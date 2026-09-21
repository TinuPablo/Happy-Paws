"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { protectoraIdDeUsuario } from "@/lib/protectora";
import { enviarEmailCambioEstadoSolicitud } from "@/lib/email";
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

  const mascota = await prisma.mascota.findUnique({ where: { id: mascotaId } });
  if (!mascota) return { error: "Mascota no encontrada." };
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
          where: { estado: { in: ["EN_PROTECTORA", "EN_TRANSITO", "EN_PROCESO"] } },
        });
        const mejorPuntaje = Math.max(...disponibles.map((m) => calcularCompatibilidad(m, parsed)));
        quizEraRecomendada = quizPorcentaje === mejorPuntaje;
      }
    } catch {
      // JSON inválido en el hidden input — se guarda la solicitud igual, sin quiz
    }
  }

  await prisma.solicitudAdopcion.create({
    data: { mascotaId, adoptanteId: adoptante.id, quizRespuestas, quizPorcentaje, quizEraRecomendada },
  });

  revalidatePath(`/mascotas/${mascotaId}`);
  revalidatePath("/perfil");
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
    include: { mascota: true, adoptante: { include: { user: true } } },
  });
  if (!solicitud) throw new Error("Solicitud no encontrada.");

  const protectoraId = await protectoraIdDeUsuario(session.userId);
  if (!protectoraId || protectoraId !== solicitud.mascota.protectoraId) {
    throw new Error("No tenés permiso sobre esta solicitud.");
  }

  await prisma.solicitudAdopcion.update({
    where: { id: solicitudId },
    data: { estado: nuevoEstado },
  });

  if (nuevoEstado === "APROBADA") {
    // Transferencia de "propiedad": la mascota pasa a estar adoptada por
    // este adoptante.
    await prisma.mascota.update({
      where: { id: solicitud.mascotaId },
      data: { estado: "ADOPTADO", adoptanteId: solicitud.adoptanteId },
    });

    // Seguimiento post-adopción: se programan los 4 checkpoints automáticos
    // (ver schema, SeguimientoAdopcion) a partir de hoy — "la historia de
    // una mascota no termina con la adopción". La protectora los va a ir
    // marcando como hechos desde la ficha de la mascota.
    const hoy = Date.now();
    const DIA_MS = 24 * 60 * 60 * 1000;
    await prisma.seguimientoAdopcion.createMany({
      data: [
        { mascotaId: solicitud.mascotaId, tipo: "DIAS_7", fechaProgramada: new Date(hoy + 7 * DIA_MS) },
        { mascotaId: solicitud.mascotaId, tipo: "MES_1", fechaProgramada: new Date(hoy + 30 * DIA_MS) },
        { mascotaId: solicitud.mascotaId, tipo: "MES_3", fechaProgramada: new Date(hoy + 90 * DIA_MS) },
        { mascotaId: solicitud.mascotaId, tipo: "MES_6", fechaProgramada: new Date(hoy + 180 * DIA_MS) },
      ],
    });
  }

  // No debe romper la actualización si el email falla — el estado real ya
  // quedó guardado en la base, avisar es secundario.
  await enviarEmailCambioEstadoSolicitud(
    solicitud.adoptante.user.email,
    solicitud.mascota.nombre,
    nuevoEstado
  );

  revalidatePath("/perfil");
  revalidatePath(`/mascotas/${solicitud.mascotaId}`);
  revalidatePath("/mascotas");
}
