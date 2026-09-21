"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
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

  const protectora = await prisma.protectora.findFirst({ where: { duenioId: session.userId } });
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

  const protectora = await prisma.protectora.findFirst({ where: { duenioId: session.userId } });
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
