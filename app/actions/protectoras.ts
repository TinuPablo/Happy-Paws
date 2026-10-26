"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { esEmailValido } from "@/lib/mail";
import { esUrlDeCloudinaryValida } from "@/lib/mediaUrl";

export type LogoActionState = { error: string } | null;
export type DatosProtectoraActionState = { error: string } | null;

export async function actualizarDatosProtectoraAction(
  _prevState: DatosProtectoraActionState,
  formData: FormData
): Promise<DatosProtectoraActionState> {
  const session = await requireRole("ADMIN_PROTECTORA");

  const ubicacion = String(formData.get("ubicacion") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const redSocial = String(formData.get("redSocial") || "").trim();

  if (!ubicacion) return { error: "La ubicación no puede quedar vacía." };
  if (ubicacion.length > 120) return { error: "La ubicación puede tener hasta 120 caracteres." };
  if (descripcion.length > 5000) return { error: "La descripción puede tener hasta 5000 caracteres." };
  if (telefono.length > 40) return { error: "El teléfono puede tener hasta 40 caracteres." };
  // El email de contacto se usa para avisos por correo y se muestra a los
  // adoptantes aprobados: tiene que ser un email de verdad.
  if (email && !esEmailValido(email)) return { error: "Revisá el formato del email de contacto." };
  if (redSocial.length > 190) return { error: "La red social puede tener hasta 190 caracteres." };

  const protectora = await prisma.protectora.findFirst({
    where: { duenioId: session.userId, estadoVerificacion: "APROBADA" },
  });
  if (!protectora) return { error: "No se encontró una protectora asociada a esta cuenta." };

  await prisma.protectora.update({
    where: { id: protectora.id },
    data: {
      ubicacion,
      descripcion: descripcion || null,
      telefono: telefono || null,
      email: email || null,
      redSocial: redSocial || null,
    },
  });

  revalidatePath("/protectoras");
  revalidatePath(`/protectoras/${protectora.id}`);
  revalidatePath("/perfil");
  revalidatePath("/");
  return null;
}

export async function actualizarLogoProtectoraAction(
  _prevState: LogoActionState,
  formData: FormData
): Promise<LogoActionState> {
  const session = await requireRole("ADMIN_PROTECTORA");

  const logoUrl = String(formData.get("logoUrl") || "").trim();
  if (!logoUrl || !esUrlDeCloudinaryValida(logoUrl)) return { error: "Elegí una imagen primero." };

  const protectora = await prisma.protectora.findFirst({
    where: { duenioId: session.userId, estadoVerificacion: "APROBADA" },
  });
  if (!protectora) return { error: "No se encontró una protectora asociada a esta cuenta." };

  await prisma.protectora.update({
    where: { id: protectora.id },
    data: { logoUrl },
  });

  revalidatePath("/protectoras");
  revalidatePath(`/protectoras/${protectora.id}`);
  revalidatePath("/perfil");
  revalidatePath("/");
  return null;
}
