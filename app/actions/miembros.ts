"use server";

import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole, createSession } from "@/lib/session";
import { esEmailValido, sendMail } from "@/lib/mail";
import { invitacionProtectora } from "@/lib/mail-templates";
import { MENSAJE_LIMITE, estaLimitado, ipCliente } from "@/lib/rateLimit";
import { MENSAJE_CAPTCHA_FALLIDO, verifyTurnstile } from "@/lib/turnstile";
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
  if (!esEmailValido(email)) return { error: "Revisá el formato del email." };
  // Cada invitación manda un correo: tope para que una cuenta no se use
  // para mandar mails en cantidad desde la casilla de Happy Paws.
  if (estaLimitado(`invitar:${session.userId}`, 10, 60 * 60 * 1000)) return { error: MENSAJE_LIMITE };

  const protectora = await prisma.protectora.findFirst({
    where: { duenioId: session.userId, estadoVerificacion: "APROBADA" },
  });
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
  const { ok } = await sendMail({
    to: email,
    ...invitacionProtectora(protectora.nombre, rol as "COLABORADOR" | "HOGAR_TRANSITO", `${appUrl}/invitacion?token=${token}`),
  });

  revalidatePath("/perfil");
  revalidatePath("/adopciones");
  if (!ok) return { error: "La invitación quedó creada, pero no pudimos enviar el correo. Probá de nuevo en un rato." };
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

  // Igual que el registro: límite por IP y captcha antes de crear la cuenta.
  const ip = await ipCliente();
  if (estaLimitado(`registro-ip:${ip}`, 5, 60 * 60 * 1000)) return { error: MENSAJE_LIMITE };
  if (!(await verifyTurnstile(String(formData.get("turnstileToken") || ""), ip))) {
    return { error: MENSAJE_CAPTCHA_FALLIDO };
  }

  if (!token) return { error: "Falta el token de invitación." };
  if (!nombre) return { error: "Ingresá tu nombre." };
  if (nombre.length > 120) return { error: "El nombre puede tener hasta 120 caracteres." };
  if (password.length < 6) return { error: "La contraseña tiene que tener al menos 6 caracteres." };
  if (password.length > 100) return { error: "La contraseña puede tener hasta 100 caracteres." };
  if (password !== String(formData.get("password2") || "")) return { error: "Las contraseñas no coinciden." };

  const invitacion = await prisma.invitacionProtectora.findUnique({
    where: { token },
    include: { protectora: { select: { estadoVerificacion: true } } },
  });
  if (
    !invitacion ||
    invitacion.usedAt ||
    invitacion.expiresAt < new Date() ||
    invitacion.protectora.estadoVerificacion !== "APROBADA"
  ) {
    return { error: "Esta invitación ya no es válida. Pedile a la protectora que te mande una nueva." };
  }

  const existente = await prisma.user.findUnique({ where: { email: invitacion.email } });
  if (existente) return { error: "Ese email ya tiene una cuenta en Happy Paws." };

  // RolEnProtectora y RolGlobal comparten los mismos nombres para estos dos
  // valores, pero son enums distintos en el schema — se mapea explícito.
  const rolGlobal: RolGlobal = invitacion.rol === "COLABORADOR" ? "COLABORADOR" : "HOGAR_TRANSITO";
  const passwordHash = await bcrypt.hash(password, 10);

  // La invitación se marca usada en la misma transacción y solo si seguía
  // sin usar: dos envíos a la vez no pueden crear dos cuentas.
  const user = await prisma.$transaction(async (tx) => {
    const { count } = await tx.invitacionProtectora.updateMany({
      where: { id: invitacion.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (count === 0) return null;
    return tx.user.create({
      data: {
        email: invitacion.email,
        passwordHash,
        nombre,
        rol: rolGlobal,
        // La invitación llegó a este correo: ya está probado que es suyo.
        emailVerificadoEn: new Date(),
        membresias: {
          create: { protectoraId: invitacion.protectoraId, rol: invitacion.rol },
        },
      },
    });
  });
  if (!user) return { error: "Esta invitación ya fue usada." };

  await createSession({ userId: user.id, rol: user.rol, nombre: user.nombre });
  redirect("/");
}
