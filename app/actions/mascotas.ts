"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export type MascotaActionState = { error: string } | null;

export async function addMascotaAction(
  _prevState: MascotaActionState,
  formData: FormData
): Promise<MascotaActionState> {
  // Revalida el rol contra la sesión firmada del servidor, no contra lo que
  // mande el formulario — un usuario sin este rol no puede crear la mascota
  // aunque fuerce el envío del form (ej. con curl).
  const session = await requireRole("ADMIN_PROTECTORA");

  const protectora = await prisma.protectora.findFirst({
    where: { duenioId: session.userId },
  });
  if (!protectora) return { error: "No se encontró una protectora asociada a esta cuenta." };

  const nombre = String(formData.get("nombre") || "").trim();
  const especie = String(formData.get("especie") || "PERRO") as "PERRO" | "GATO";
  const razaTexto = String(formData.get("raza") || "").trim();
  const edadTexto = String(formData.get("edadAproximada") || "").trim();
  const tamanio = String(formData.get("tamanio") || "MEDIANO");
  const descripcion = String(formData.get("descripcion") || "").trim();
  const mediaUrl = String(formData.get("mediaUrl") || "").trim() || null;
  const mediaType = String(formData.get("mediaType") || "").trim() || null;

  if (!nombre || !razaTexto || !edadTexto || !descripcion) {
    return { error: "Completá todos los campos obligatorios." };
  }

  await prisma.mascota.create({
    data: {
      nombre,
      especie,
      razaTexto,
      edadTexto,
      tamanio,
      descripcion,
      mediaUrl,
      mediaType,
      protectoraId: protectora.id,
    },
  });

  revalidatePath("/mascotas");
  revalidatePath("/perfil");
  revalidatePath("/");
  return null;
}
