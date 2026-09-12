"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export async function toggleFavoritoAction(formData: FormData) {
  // Solo adoptantes tienen favoritos — se revalida el rol server-side,
  // no alcanza con ocultar el botón para protectoras en el cliente.
  const session = await requireRole("ADOPTANTE");

  const mascotaId = String(formData.get("mascotaId") || "");
  if (!mascotaId) throw new Error("Falta la mascota.");

  const adoptante = await prisma.adoptante.findUnique({
    where: { userId: session.userId },
  });
  if (!adoptante) throw new Error("No se encontró el perfil de adoptante de esta cuenta.");

  const existente = await prisma.favorito.findUnique({
    where: { adoptanteId_mascotaId: { adoptanteId: adoptante.id, mascotaId } },
  });

  if (existente) {
    await prisma.favorito.delete({ where: { id: existente.id } });
  } else {
    await prisma.favorito.create({ data: { adoptanteId: adoptante.id, mascotaId } });
  }

  revalidatePath("/mascotas");
  revalidatePath(`/mascotas/${mascotaId}`);
  revalidatePath("/perfil");
}
