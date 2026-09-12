"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";

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
