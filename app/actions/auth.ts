"use server";

import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";
import { enviarEmailRecuperacion } from "@/lib/email";
import { MENSAJE_LIMITE, estaLimitado, ipCliente } from "@/lib/rateLimit";
import { MENSAJE_CAPTCHA_FALLIDO, verifyTurnstile } from "@/lib/turnstile";
import { sendMail } from "@/lib/mail";
import { protectoraEnRevision, solicitudProtectoraParaAdmin } from "@/lib/mail-templates";
import { estadoVerificacionDeUsuario } from "@/lib/protectora";
import { type DatosRegistroProtectora, validarRegistroProtectora } from "@/lib/validacionProtectora";

export type AuthActionState = { error: string } | null;

// Primer paso de login y registro, antes de mirar contraseñas, crear
// usuarios o mandar correos: límite por IP y después el captcha (en ese
// orden, para que un bot que insiste no nos haga llamar a Cloudflare cada
// vez). Las server actions no pueden devolver un 429 HTTP real: el "429" es
// el mensaje de límite en el estado del form.
async function chequeoAntiBots(
  formData: FormData,
  accion: "login" | "registro",
  maxIntentos: number,
  ventanaMs: number
): Promise<string | null> {
  const ip = await ipCliente();
  if (estaLimitado(`${accion}-ip:${ip}`, maxIntentos, ventanaMs)) return MENSAJE_LIMITE;
  const captchaOk = await verifyTurnstile(String(formData.get("turnstileToken") || ""), ip);
  return captchaOk ? null : MENSAJE_CAPTCHA_FALLIDO;
}

// El destino post-login viene de un query param (?redirect=) que cualquiera
// puede armar a mano — sin esta validación, un link tipo
// "/login?redirect=https://sitio-falso.com" terminaría mandando a un
// usuario que sí inició sesión correctamente a un sitio externo (open
// redirect, clásico para phishing). Solo se acepta una ruta interna.
function rutaInternaSegura(valor: string): string {
  if (!valor.startsWith("/") || valor.startsWith("//") || valor.startsWith("/\\")) {
    return "/perfil";
  }
  return valor;
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const redirectTo = rutaInternaSegura(String(formData.get("redirectTo") || "/perfil"));

  const bloqueo = await chequeoAntiBots(formData, "login", 8, 60 * 1000);
  if (bloqueo) return { error: bloqueo };

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }

  // Sin esto, el login no tenía ningún límite de intentos — una cuenta se
  // podía probar por fuerza bruta sin fricción. 10 intentos cada 10 minutos
  // por IP+email alcanza para frenar un ataque automatizado sin molestar a
  // alguien que se equivoca de contraseña un par de veces.
  const clave = `login:${await ipCliente()}:${email}`;
  if (estaLimitado(clave, 10, 10 * 60 * 1000)) {
    return { error: "Demasiados intentos. Esperá unos minutos y volvé a probar." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Email o contraseña incorrectos." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Email o contraseña incorrectos." };
  }

  // Recién con la contraseña correcta se informa el estado de verificación
  // — antes de eso no hay que dejar adivinar qué cuentas existen.
  if (user.rol !== "ADOPTANTE" && user.rol !== "ADMIN") {
    const estado = await estadoVerificacionDeUsuario(user.id);
    if (estado === "PENDIENTE") {
      return { error: "Tu solicitud está en revisión. Te vamos a avisar por correo." };
    }
    if (estado === "RECHAZADA") {
      return { error: "Tu solicitud no fue aprobada. Revisá tu correo para ver los motivos." };
    }
  }

  await createSession({ userId: user.id, rol: user.rol, nombre: user.nombre });
  redirect(user.rol === "ADMIN" && redirectTo === "/perfil" ? "/admin/protectoras" : redirectTo);
}

export async function registerAdoptanteAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const nombre = String(formData.get("nombre") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const telefono = String(formData.get("telefono") || "").trim();
  const password = String(formData.get("password") || "");

  const bloqueo = await chequeoAntiBots(formData, "registro", 5, 60 * 60 * 1000);
  if (bloqueo) return { error: bloqueo };

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

export type RegistroProtectoraState = { error?: string; enviado?: boolean } | null;

export async function registerProtectoraAction(
  _prevState: RegistroProtectoraState,
  formData: FormData
): Promise<RegistroProtectoraState> {
  const campo = (nombre: string) => String(formData.get(nombre) || "").trim();
  const datos: DatosRegistroProtectora = {
    nombreProtectora: campo("nombreProtectora"),
    ubicacion: campo("ubicacion"),
    email: campo("email").toLowerCase(),
    password: String(formData.get("password") || ""),
    telefono: campo("telefono"),
    instagram: campo("instagram"),
    facebook: campo("facebook"),
    sitioWeb: campo("sitioWeb"),
    nombreResponsable: campo("nombreResponsable"),
    cargoResponsable: campo("cargoResponsable"),
    textoVerificacion: campo("textoVerificacion"),
  };

  const bloqueo = await chequeoAntiBots(formData, "registro", 5, 60 * 60 * 1000);
  if (bloqueo) return { error: bloqueo };

  const errorValidacion = validarRegistroProtectora(datos);
  if (errorValidacion) return { error: errorValidacion };

  const existente = await prisma.user.findUnique({ where: { email: datos.email } });
  if (existente) {
    return { error: "Ese email ya está registrado. Iniciá sesión en vez de crear una cuenta nueva." };
  }

  const passwordHash = await bcrypt.hash(datos.password, 10);

  // La protectora nace PENDIENTE: no puede entrar ni aparece en los
  // listados hasta que alguien de Happy Paws la apruebe en /admin/protectoras.
  await prisma.user.create({
    data: {
      email: datos.email,
      passwordHash,
      nombre: datos.nombreProtectora,
      telefono: datos.telefono,
      rol: "ADMIN_PROTECTORA",
      protectorasPropias: {
        create: {
          nombre: datos.nombreProtectora,
          ubicacion: datos.ubicacion,
          email: datos.email,
          telefono: datos.telefono,
          instagram: datos.instagram || null,
          facebook: datos.facebook || null,
          sitioWeb: datos.sitioWeb || null,
          nombreResponsable: datos.nombreResponsable,
          cargoResponsable: datos.cargoResponsable,
          textoVerificacion: datos.textoVerificacion,
          estadoVerificacion: "PENDIENTE",
          fechaSolicitud: new Date(),
        },
      },
    },
  });

  // Si algún correo no sale, el registro igual quedó guardado y la
  // solicitud aparece en el panel admin; sendMail ya loguea el error.
  const mailAdmin = process.env.MAIL_ADMIN;
  if (!mailAdmin) console.warn("[registro] MAIL_ADMIN no configurado — no se avisó de la nueva protectora.");
  await Promise.all([
    sendMail({ to: datos.email, ...protectoraEnRevision(datos.nombreProtectora) }),
    mailAdmin
      ? sendMail({
          to: mailAdmin,
          replyTo: datos.email,
          ...solicitudProtectoraParaAdmin({
            nombre: datos.nombreProtectora,
            ubicacion: datos.ubicacion,
            email: datos.email,
            telefono: datos.telefono,
            instagram: datos.instagram,
            facebook: datos.facebook,
            sitioWeb: datos.sitioWeb,
            nombreResponsable: datos.nombreResponsable,
            cargoResponsable: datos.cargoResponsable,
            textoVerificacion: datos.textoVerificacion,
          }),
        })
      : null,
  ]);

  return { enviado: true };
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

  // Mismo mensaje exista o no el email — no hay que dejar adivinar desde
  // afuera qué emails están registrados.
  const mensajeGenerico = "Si ese email está registrado, te mandamos un link para recuperar tu contraseña.";

  // Sin límite acá, cualquiera podía usar este formulario para bombardear
  // la casilla de otra persona con mails de recuperación repetidos.
  const clave = `recuperar:${await ipCliente()}:${email}`;
  if (estaLimitado(clave, 3, 60 * 60 * 1000)) {
    return { success: mensajeGenerico };
  }

  const user = await prisma.user.findUnique({ where: { email } });
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
