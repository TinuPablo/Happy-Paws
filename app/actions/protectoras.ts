"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export type LogoActionState = { error: string } | null;

export async function actualizarLogoProtectoraAction(
  _prevState: LogoActionState,
  formData: FormData
): Promise<LogoActionState> {
  const session = await requireRole("ADMIN_PROTECTORA");

  const logoUrl = String(formData.get("logoUrl") || "").trim();
  if (!logoUrl) return { error: "Elegí una imagen primero." };

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
