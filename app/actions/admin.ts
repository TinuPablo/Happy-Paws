"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { sendMail } from "@/lib/mail";
import { protectoraAprobada, protectoraRechazada } from "@/lib/mail-templates";

export type AdminActionState = { error?: string } | null;

const MOTIVO_MAX = 2000;

// El rol sale de la cookie firmada, nunca del form: un usuario que no sea
// ADMIN no puede aprobar/rechazar aunque arme el POST a mano.
async function esAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.rol === "ADMIN";
}

async function emailDeProtectora(protectoraId: string) {
  const p = await prisma.protectora.findUnique({
    where: { id: protectoraId },
    select: { nombre: true, email: true, duenio: { select: { email: true } } },
  });
  return p ? { nombre: p.nombre, email: p.email || p.duenio.email } : null;
}

export async function aprobarProtectoraAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  if (!(await esAdmin())) return { error: "No autorizado." };
  const protectoraId = String(formData.get("protectoraId") || "");

  // updateMany con el estado en el where: si dos personas aprueban a la
  // vez (o doble click), solo la primera cambia algo y manda el correo.
  const { count } = await prisma.protectora.updateMany({
    where: { id: protectoraId, estadoVerificacion: "PENDIENTE", duenio: { emailVerificadoEn: { not: null } } },
    data: { estadoVerificacion: "APROBADA", fechaRevision: new Date(), motivoRechazo: null },
  });
  if (count === 0) return { error: "Esta solicitud ya no está pendiente." };

  const destino = await emailDeProtectora(protectoraId);
  if (destino) await sendMail({ to: destino.email, ...protectoraAprobada(destino.nombre) });

  revalidatePath("/admin/protectoras");
  return null;
}

export async function rechazarProtectoraAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  if (!(await esAdmin())) return { error: "No autorizado." };
  const protectoraId = String(formData.get("protectoraId") || "");
  const motivo = String(formData.get("motivo") || "").trim();

  if (!motivo) return { error: "Escribí el motivo del rechazo: se lo mandamos a la protectora." };
  if (motivo.length > MOTIVO_MAX) return { error: `El motivo puede tener hasta ${MOTIVO_MAX} caracteres.` };

  const { count } = await prisma.protectora.updateMany({
    where: { id: protectoraId, estadoVerificacion: "PENDIENTE", duenio: { emailVerificadoEn: { not: null } } },
    data: { estadoVerificacion: "RECHAZADA", motivoRechazo: motivo, fechaRevision: new Date() },
  });
  if (count === 0) return { error: "Esta solicitud ya no está pendiente." };

  const destino = await emailDeProtectora(protectoraId);
  if (destino) await sendMail({ to: destino.email, ...protectoraRechazada(destino.nombre, motivo) });

  revalidatePath("/admin/protectoras");
  return null;
}

export async function volverAPendienteAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  if (!(await esAdmin())) return { error: "No autorizado." };
  const protectoraId = String(formData.get("protectoraId") || "");

  // No se manda correo: es una reapertura interna del caso. El motivo de
  // rechazo anterior se conserva como referencia hasta la nueva revisión.
  const { count } = await prisma.protectora.updateMany({
    where: { id: protectoraId, estadoVerificacion: { in: ["APROBADA", "RECHAZADA"] } },
    data: { estadoVerificacion: "PENDIENTE", fechaRevision: null },
  });
  if (count === 0) return { error: "Esta solicitud ya estaba pendiente." };

  revalidatePath("/admin/protectoras");
  return null;
}
