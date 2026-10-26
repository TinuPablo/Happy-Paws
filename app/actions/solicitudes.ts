"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { protectoraIdDeUsuario } from "@/lib/protectora";
import { sendMail } from "@/lib/mail";
import { cambioEstadoSolicitud } from "@/lib/mail-templates";
import { notificarNuevaSolicitud } from "@/lib/notificaciones";
import {
  calcularCompatibilidad,
  esRespuestasQuizValidas,
  type RespuestasQuiz,
} from "@/lib/calcularCompatibilidad";

export type SolicitudActionState = { error?: string; success?: string } | null;

export async function crearSolicitudAction(
  _prevState: SolicitudActionState,
  formData: FormData
): Promise<SolicitudActionState> {
  // Solo cuentas de adoptante pueden pedir una adopción — se revalida acá,
  // no alcanza con que el botón esté oculto para protectoras en el cliente.
  const session = await requireRole("ADOPTANTE");

  const mascotaId = String(formData.get("mascotaId") || "");
  if (!mascotaId) return { error: "Falta la mascota." };

  const adoptante = await prisma.adoptante.findUnique({
    where: { userId: session.userId },
  });
  if (!adoptante) return { error: "No se encontró el perfil de adoptante de esta cuenta." };

  const yaExiste = await prisma.solicitudAdopcion.findFirst({
    where: {
      mascotaId,
      adoptanteId: adoptante.id,
      estado: { in: ["PENDIENTE", "EN_REVISION"] },
    },
  });
  if (yaExiste) return { error: "Ya tenés una solicitud en curso para esta mascota." };

  const mascota = await prisma.mascota.findUnique({
    where: { id: mascotaId },
    include: { protectora: { select: { estadoVerificacion: true } } },
  });
  if (!mascota || !mascota.activo || mascota.protectora.estadoVerificacion !== "APROBADA") {
    return { error: "Mascota no encontrada." };
  }
  if (mascota.estado === "ADOPTADO") return { error: "Esta mascota ya fue adoptada." };

  // Si el adoptante completó el quiz de compatibilidad, se recalcula el %
  // acá (no se confía en un valor que mande el cliente) y se compara contra
  // el resto de las mascotas disponibles para saber si esta era la
  // recomendada — se muestra después en "Ver formulario" del lado protectora.
  let quizRespuestas: RespuestasQuiz | undefined;
  let quizPorcentaje: number | undefined;
  let quizEraRecomendada: boolean | undefined;

  const quizRaw = String(formData.get("quizRespuestas") || "");
  if (quizRaw) {
    try {
      const parsed = JSON.parse(quizRaw);
      if (esRespuestasQuizValidas(parsed)) {
        quizRespuestas = parsed;
        quizPorcentaje = calcularCompatibilidad(mascota, parsed);

        const disponibles = await prisma.mascota.findMany({
          where: {
            activo: true,
            estado: { in: ["EN_PROTECTORA", "EN_TRANSITO", "EN_PROCESO"] },
            protectora: { estadoVerificacion: "APROBADA" },
          },
        });
        const mejorPuntaje = Math.max(...disponibles.map((m) => calcularCompatibilidad(m, parsed)));
        quizEraRecomendada = quizPorcentaje === mejorPuntaje;
      }
    } catch {
      // JSON inválido en el hidden input — se guarda la solicitud igual, sin quiz
    }
  }

  const solicitud = await prisma.solicitudAdopcion.create({
    data: { mascotaId, adoptanteId: adoptante.id, quizRespuestas, quizPorcentaje, quizEraRecomendada },
  });

  // Notificación interna + correo a la protectora (nunca lanza).
  await notificarNuevaSolicitud(solicitud.id);

  revalidatePath(`/mascotas/${mascotaId}`);
  revalidatePath("/perfil");
  revalidatePath("/adopciones");
  return { success: `Solicitud enviada para adoptar a ${mascota.nombre}.` };
}

export async function actualizarEstadoSolicitudAction(formData: FormData) {
  // Solo la protectora dueña de la mascota puede aprobar/rechazar — se
  // verifica la relación completa server-side, no solo el rol.
  const session = await requireRole("ADMIN_PROTECTORA", "COLABORADOR", "HOGAR_TRANSITO");

  const solicitudId = String(formData.get("solicitudId") || "");
  const nuevoEstado = String(formData.get("estado") || "") as "APROBADA" | "RECHAZADA";
  if (!solicitudId || !["APROBADA", "RECHAZADA"].includes(nuevoEstado)) {
    throw new Error("Datos inválidos.");
  }

  const solicitud = await prisma.solicitudAdopcion.findUnique({
    where: { id: solicitudId },
    include: {
      mascota: {
        include: {
          protectora: {
            select: { nombre: true, email: true, telefono: true, duenio: { select: { email: true } } },
          },
        },
      },
      adoptante: { include: { user: true } },
    },
  });
  if (!solicitud) throw new Error("Solicitud no encontrada.");

  const protectoraId = await protectoraIdDeUsuario(session.userId);
  if (!protectoraId || protectoraId !== solicitud.mascota.protectoraId) {
    throw new Error("No tenés permiso sobre esta solicitud.");
  }

  if (nuevoEstado === "APROBADA" && solicitud.mascota.estado === "ADOPTADO") {
    throw new Error("Esta mascota ya fue adoptada.");
  }

  // Una solicitud solo puede resolverse una vez: el estado PENDIENTE va en
  // el where, así un doble click (o dos personas de la protectora a la vez)
  // no duplica los checkpoints de seguimiento ni los correos.
  const otrasPendientes: { id: string; email: string }[] = [];
  const resuelta = await prisma.$transaction(async (tx) => {
    const { count } = await tx.solicitudAdopcion.updateMany({
      where: { id: solicitudId, estado: "PENDIENTE" },
      data: { estado: nuevoEstado },
    });
    if (count === 0) return false;
    if (nuevoEstado !== "APROBADA") return true;

    // Transferencia de "propiedad": la mascota pasa a estar adoptada por
    // este adoptante.
    await tx.mascota.update({
      where: { id: solicitud.mascotaId },
      data: { estado: "ADOPTADO", adoptanteId: solicitud.adoptanteId },
    });

    // El resto de las solicitudes en curso por la misma mascota se cierran:
    // si no, la protectora podía aprobar una segunda y "re-adoptarla".
    const pendientes = await tx.solicitudAdopcion.findMany({
      where: { mascotaId: solicitud.mascotaId, id: { not: solicitudId }, estado: { in: ["PENDIENTE", "EN_REVISION"] } },
      include: { adoptante: { include: { user: { select: { email: true } } } } },
    });
    if (pendientes.length > 0) {
      await tx.solicitudAdopcion.updateMany({
        where: { id: { in: pendientes.map((p) => p.id) } },
        data: { estado: "RECHAZADA" },
      });
      otrasPendientes.push(...pendientes.map((p) => ({ id: p.id, email: p.adoptante.user.email })));
    }

    // Seguimiento post-adopción: se programan los 4 checkpoints automáticos
    // (ver schema, SeguimientoAdopcion) a partir de hoy — "la historia de
    // una mascota no termina con la adopción". La protectora los va a ir
    // marcando como hechos desde la ficha de la mascota.
    const hoy = Date.now();
    const DIA_MS = 24 * 60 * 60 * 1000;
    await tx.seguimientoAdopcion.createMany({
      data: [
        { mascotaId: solicitud.mascotaId, tipo: "DIAS_7", fechaProgramada: new Date(hoy + 7 * DIA_MS) },
        { mascotaId: solicitud.mascotaId, tipo: "MES_1", fechaProgramada: new Date(hoy + 30 * DIA_MS) },
        { mascotaId: solicitud.mascotaId, tipo: "MES_3", fechaProgramada: new Date(hoy + 90 * DIA_MS) },
        { mascotaId: solicitud.mascotaId, tipo: "MES_6", fechaProgramada: new Date(hoy + 180 * DIA_MS) },
      ],
    });
    return true;
  });
  if (!resuelta) throw new Error("Esta solicitud ya fue resuelta.");

  // Los correos van después de guardar: si fallan, el estado real ya quedó
  // en la base (sendMail nunca lanza).
  const { protectora } = solicitud.mascota;
  const contacto = {
    nombre: protectora.nombre,
    email: protectora.email || protectora.duenio.email,
    telefono: protectora.telefono,
  };
  await Promise.all([
    sendMail({
      to: solicitud.adoptante.user.email,
      ...cambioEstadoSolicitud(solicitud.mascota.nombre, nuevoEstado, contacto),
    }),
    ...otrasPendientes.map((o) =>
      sendMail({ to: o.email, ...cambioEstadoSolicitud(solicitud.mascota.nombre, "RECHAZADA") })
    ),
  ]);

  revalidatePath("/perfil");
  revalidatePath("/adopciones");
  revalidatePath(`/mascotas/${solicitud.mascotaId}`);
  revalidatePath("/mascotas");
}
