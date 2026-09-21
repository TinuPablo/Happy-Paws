"use server";

import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";
import { enviarEmailRecuperacion } from "@/lib/email";

export type AuthActionState = { error: string } | null;

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirectTo") || "/perfil");

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Email o contraseña incorrectos." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Email o contraseña incorrectos." };
  }

  await createSession({ userId: user.id, rol: user.rol, nombre: user.nombre });
  redirect(redirectTo || "/perfil");
}

export async function registerAdoptanteAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const nombre = String(formData.get("nombre") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const telefono = String(formData.get("telefono") || "").trim();
  const password = String(formData.get("password") || "");

  if (!nombre || !email || !password) {
    return { error: "Completá nombre, email y contraseña." };
  }
  if (password.length < 6) {
    return { error: "La contraseña tiene que tener al menos 6 caracteres." };
  }

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    return { error: "Ese email ya está registrado. Iniciá sesión en vez de crear una cuenta nueva." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      nombre,
      telefono: telefono || null,
      rol: "ADOPTANTE",
      adoptante: { create: {} },
    },
  });

  await createSession({ userId: user.id, rol: user.rol, nombre: user.nombre });
  redirect("/perfil");
}

export async function registerProtectoraAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const nombreProtectora = String(formData.get("nombreProtectora") || "").trim();
  const ubicacion = String(formData.get("ubicacion") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!nombreProtectora || !ubicacion || !email || !password) {
    return { error: "Completá todos los campos." };
  }
  if (password.length < 6) {
    return { error: "La contraseña tiene que tener al menos 6 caracteres." };
  }

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    return { error: "Ese email ya está registrado. Iniciá sesión en vez de crear una cuenta nueva." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      nombre: nombreProtectora,
      rol: "ADMIN_PROTECTORA",
      protectorasPropias: {
        create: {
          nombre: nombreProtectora,
          ubicacion,
          email,
        },
      },
    },
  });

  await createSession({ userId: user.id, rol: user.rol, nombre: user.nombre });
  redirect("/perfil");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export type RecuperacionActionState = { error?: string; success?: string } | null;

export async function solicitarRecuperacionAction(
  _prevState: RecuperacionActionState,
  formData: FormData
): Promise<RecuperacionActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) return { error: "Ingresá tu email." };

  const user = await prisma.user.findUnique({ where: { email } });
  // Mismo mensaje exista o no el email — no hay que dejar adivinar desde
  // afuera qué emails están registrados.
  const mensajeGenerico = "Si ese email está registrado, te mandamos un link para recuperar tu contraseña.";
  if (!user) return { success: mensajeGenerico };

  const token = crypto.randomBytes(32).toString("base64url");
  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) },
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  await enviarEmailRecuperacion(user.email, `${appUrl}/restablecer?token=${token}`);

  return { success: mensajeGenerico };
}

export async function restablecerContrasenaAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");

  if (!token) return { error: "Falta el token de recuperación." };
  if (password.length < 6) return { error: "La contraseña tiene que tener al menos 6 caracteres." };

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "Este link para recuperar la contraseña ya no es válido. Pedí uno nuevo." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  redirect("/login");
}
