"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export async function marcarNotificacionLeidaAction(formData: FormData) {
  const session = await requireRole("ADMIN_PROTECTORA");

  const notificacionId = String(formData.get("notificacionId") || "");
  const notificacion = await prisma.notificacion.findUnique({
    where: { id: notificacionId },
    include: { protectora: true },
  });
  if (!notificacion || notificacion.protectora.duenioId !== session.userId) {
    throw new Error("No se encontró esa notificación.");
  }

  await prisma.notificacion.update({
    where: { id: notificacionId },
    data: { leida: true },
  });

  revalidatePath("/perfil");
}
