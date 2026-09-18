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

// Busca la mascota y verifica que pertenezca a una protectora de la sesión
// actual — evita que alguien edite/cambie estado/dé de baja una mascota
// ajena forzando el id en el formulario.
async function mascotaDePropiedad(mascotaId: string, userId: string) {
  const mascota = await prisma.mascota.findUnique({
    where: { id: mascotaId },
    include: { protectora: true },
  });
  if (!mascota || mascota.protectora.duenioId !== userId) return null;
  return mascota;
}

export async function editarMascotaAction(
  _prevState: MascotaActionState,
  formData: FormData
): Promise<MascotaActionState> {
  const session = await requireRole("ADMIN_PROTECTORA");

  const mascotaId = String(formData.get("mascotaId") || "");
  const mascota = await mascotaDePropiedad(mascotaId, session.userId);
  if (!mascota) return { error: "No se encontró esa mascota en tu protectora." };

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

  await prisma.mascota.update({
    where: { id: mascotaId },
    data: { nombre, especie, razaTexto, edadTexto, tamanio, descripcion, mediaUrl, mediaType },
  });

  revalidatePath("/mascotas");
  revalidatePath(`/mascotas/${mascotaId}`);
  revalidatePath("/perfil");
  revalidatePath("/");
  return null;
}

const ESTADOS_VALIDOS = ["EN_PROTECTORA", "EN_TRANSITO", "EN_PROCESO", "ADOPTADO", "FALLECIDO"] as const;

export async function cambiarEstadoMascotaAction(formData: FormData) {
  const session = await requireRole("ADMIN_PROTECTORA");

  const mascotaId = String(formData.get("mascotaId") || "");
  const estado = String(formData.get("estado") || "");
  if (!ESTADOS_VALIDOS.includes(estado as (typeof ESTADOS_VALIDOS)[number])) {
    throw new Error("Estado inválido.");
  }

  const mascota = await mascotaDePropiedad(mascotaId, session.userId);
  if (!mascota) throw new Error("No se encontró esa mascota en tu protectora.");

  await prisma.mascota.update({
    where: { id: mascotaId },
    data: { estado: estado as (typeof ESTADOS_VALIDOS)[number] },
  });

  revalidatePath("/mascotas");
  revalidatePath(`/mascotas/${mascotaId}`);
  revalidatePath("/perfil");
  revalidatePath("/");
}

export async function darDeBajaMascotaAction(formData: FormData) {
  const session = await requireRole("ADMIN_PROTECTORA");

  const mascotaId = String(formData.get("mascotaId") || "");
  const mascota = await mascotaDePropiedad(mascotaId, session.userId);
  if (!mascota) throw new Error("No se encontró esa mascota en tu protectora.");

  // Soft-delete: nunca delete real, la mascota puede tener vacunaciones o
  // solicitudes de adopción ya vinculadas.
  await prisma.mascota.update({
    where: { id: mascotaId },
    data: { activo: false },
  });

  revalidatePath("/mascotas");
  revalidatePath(`/mascotas/${mascotaId}`);
  revalidatePath("/perfil");
  revalidatePath("/");
}
