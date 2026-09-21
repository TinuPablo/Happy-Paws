"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export type VacunaActionState = { error: string } | null;

function parseFecha(value: FormDataEntryValue | null): Date | null {
  const str = String(value || "").trim();
  if (!str) return null;
  const date = new Date(str);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Misma idea que mascotaDePropiedad() en mascotas.ts, pero partiendo de una
// mascota (registrar) o de una vacuna existente (editar/eliminar) — evita
// que alguien opere sobre una mascota/vacuna que no es de su protectora.
async function mascotaDePropiedad(mascotaId: string, userId: string) {
  const mascota = await prisma.mascota.findUnique({
    where: { id: mascotaId },
    include: { protectora: true },
  });
  if (!mascota || mascota.protectora.duenioId !== userId) return null;
  return mascota;
}

async function vacunaDePropiedad(vacunaId: string, userId: string) {
  const vacuna = await prisma.vacunacion.findUnique({
    where: { id: vacunaId },
    include: { mascota: { include: { protectora: true } } },
  });
  if (!vacuna || vacuna.mascota.protectora.duenioId !== userId) return null;
  return vacuna;
}

export async function registrarVacunaAction(
  _prevState: VacunaActionState,
  formData: FormData
): Promise<VacunaActionState> {
  const session = await requireRole("ADMIN_PROTECTORA");

  const mascotaId = String(formData.get("mascotaId") || "");
  const mascota = await mascotaDePropiedad(mascotaId, session.userId);
  if (!mascota) return { error: "No se encontró esa mascota en tu protectora." };

  const nombreVacuna = String(formData.get("nombreVacuna") || "").trim();
  const fechaAplicacion = parseFecha(formData.get("fechaAplicacion"));
  const proximaDosis = parseFecha(formData.get("proximaDosis"));
  const observaciones = String(formData.get("observaciones") || "").trim();

  if (!nombreVacuna || !fechaAplicacion) {
    return { error: "Completá el nombre de la vacuna y la fecha de aplicación." };
  }

  await prisma.vacunacion.create({
    data: {
      mascotaId,
      nombreVacuna,
      fechaAplicacion,
      proximaDosis,
      observaciones: observaciones || null,
    },
  });

  revalidatePath("/perfil");
  revalidatePath(`/mascotas/${mascotaId}`);
  return null;
}

export async function editarVacunaAction(
  _prevState: VacunaActionState,
  formData: FormData
): Promise<VacunaActionState> {
  const session = await requireRole("ADMIN_PROTECTORA");

  const vacunaId = String(formData.get("vacunaId") || "");
  const vacuna = await vacunaDePropiedad(vacunaId, session.userId);
  if (!vacuna) return { error: "No se encontró ese registro de vacunación." };

  const nombreVacuna = String(formData.get("nombreVacuna") || "").trim();
  const fechaAplicacion = parseFecha(formData.get("fechaAplicacion"));
  const proximaDosis = parseFecha(formData.get("proximaDosis"));
  const observaciones = String(formData.get("observaciones") || "").trim();

  if (!nombreVacuna || !fechaAplicacion) {
    return { error: "Completá el nombre de la vacuna y la fecha de aplicación." };
  }

  await prisma.vacunacion.update({
    where: { id: vacunaId },
    data: { nombreVacuna, fechaAplicacion, proximaDosis, observaciones: observaciones || null },
  });

  revalidatePath("/perfil");
  revalidatePath(`/mascotas/${vacuna.mascotaId}`);
  return null;
}

export async function eliminarVacunaAction(formData: FormData) {
  const session = await requireRole("ADMIN_PROTECTORA");

  const vacunaId = String(formData.get("vacunaId") || "");
  const vacuna = await vacunaDePropiedad(vacunaId, session.userId);
  if (!vacuna) throw new Error("No se encontró ese registro de vacunación.");

  // Acá sí es DELETE real: a diferencia de Mascota, no hay ninguna otra
  // tabla (solicitudes, favoritos) que dependa de un registro de vacunación.
  await prisma.vacunacion.delete({ where: { id: vacunaId } });

  revalidatePath("/perfil");
  revalidatePath(`/mascotas/${vacuna.mascotaId}`);
}
