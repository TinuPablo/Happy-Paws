"use server";

import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole, createSession } from "@/lib/session";
import { enviarEmailInvitacionProtectora } from "@/lib/email";
import type { RolGlobal, RolEnProtectora } from "@prisma/client";

export type MiembroActionState = { error?: string; success?: string } | null;

// Solo el dueño de la protectora puede invitar — un colaborador no puede
// sumar más gente al equipo.
export async function invitarMiembroAction(
  _prevState: MiembroActionState,
  formData: FormData
): Promise<MiembroActionState> {
  const session = await requireRole("ADMIN_PROTECTORA");

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const rol = String(formData.get("rol") || "") as RolEnProtectora;
  if (!email || !["COLABORADOR", "HOGAR_TRANSITO"].includes(rol)) {
    return { error: "Completá el email y elegí un rol." };
  }

  const protectora = await prisma.protectora.findFirst({ where: { duenioId: session.userId } });
  if (!protectora) return { error: "No se encontró una protectora asociada a esta cuenta." };

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    return { error: "Ese email ya tiene una cuenta en Happy Paws — todavía no se puede sumar a alguien que ya está registrado." };
  }

  const token = crypto.randomBytes(32).toString("base64url");
  await prisma.invitacionProtectora.create({
    data: {
      token,
      protectoraId: protectora.id,
      email,
      rol,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  await enviarEmailInvitacionProtectora(email, protectora.nombre, rol, `${appUrl}/invitacion?token=${token}`);

  revalidatePath("/perfil");
  return { success: `Invitación enviada a ${email}.` };
}

export type AceptarInvitacionState = { error: string } | null;

export async function aceptarInvitacionAction(
  _prevState: AceptarInvitacionState,
  formData: FormData
): Promise<AceptarInvitacionState> {
  const token = String(formData.get("token") || "");
  const nombre = String(formData.get("nombre") || "").trim();
  const password = String(formData.get("password") || "");

  if (!token) return { error: "Falta el token de invitación." };
  if (!nombre) return { error: "Ingresá tu nombre." };
  if (password.length < 6) return { error: "La contraseña tiene que tener al menos 6 caracteres." };

  const invitacion = await prisma.invitacionProtectora.findUnique({ where: { token } });
  if (!invitacion || invitacion.usedAt || invitacion.expiresAt < new Date()) {
    return { error: "Esta invitación ya no es válida. Pedile a la protectora que te mande una nueva." };
  }

  const existente = await prisma.user.findUnique({ where: { email: invitacion.email } });
  if (existente) return { error: "Ese email ya tiene una cuenta en Happy Paws." };

  // RolEnProtectora y RolGlobal comparten los mismos nombres para estos dos
  // valores, pero son enums distintos en el schema — se mapea explícito.
  const rolGlobal: RolGlobal = invitacion.rol === "COLABORADOR" ? "COLABORADOR" : "HOGAR_TRANSITO";
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: invitacion.email,
      passwordHash,
      nombre,
      rol: rolGlobal,
      membresias: {
        create: { protectoraId: invitacion.protectoraId, rol: invitacion.rol },
      },
    },
  });

  await prisma.invitacionProtectora.update({
    where: { id: invitacion.id },
    data: { usedAt: new Date() },
  });

  await createSession({ userId: user.id, rol: user.rol, nombre: user.nombre });
  redirect("/perfil");
}
