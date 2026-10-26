"use server";

import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";
import { MENSAJE_LIMITE, estaLimitado, ipCliente } from "@/lib/rateLimit";
import { MENSAJE_CAPTCHA_FALLIDO, verifyTurnstile } from "@/lib/turnstile";
import { esEmailValido, sendMail } from "@/lib/mail";
import { recuperacionContrasena } from "@/lib/mail-templates";
import { estadoVerificacionDeUsuario } from "@/lib/protectora";
import { type DatosRegistroProtectora, validarRegistroProtectora } from "@/lib/validacionProtectora";
import { alConfirmarEmail, borrarCuentaSinVerificar, enviarVerificacion, hashToken } from "@/lib/verificacionEmail";

// sinVerificar: la cuenta existe y la contraseña es correcta, pero todavía
// no confirmó su correo — el login muestra "Reenviarme el correo".
export type AuthActionState = { error: string; sinVerificar?: boolean } | null;

// Registro: no inicia sesión, manda el link de confirmación y el form
// muestra "Te mandamos un correo a <enviadoA>".
export type RegistroState = { error?: string; enviadoA?: string } | null;

const MENSAJE_PASSWORDS_DISTINTAS = "Las contraseñas no coinciden.";

// Si el email ya existe pero nunca se confirmó, esa cuenta se descarta y se
// deja registrar de nuevo (ver borrarCuentaSinVerificar). Devuelve true si
// el email sigue tomado por una cuenta real.
async function emailTomado(email: string): Promise<boolean> {
  const existente = await prisma.user.findUnique({ where: { email }, select: { id: true, emailVerificadoEn: true } });
  if (!existente) return false;
  if (existente.emailVerificadoEn) return true;
  await borrarCuentaSinVerificar(existente.id);
  return false;
}

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
    return "/";
  }
  return valor;
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const redirectTo = rutaInternaSegura(String(formData.get("redirectTo") || "/"));

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
  if (!user.emailVerificadoEn) {
    return {
      error: "Todavía no confirmaste tu correo. Buscá el mail que te mandamos (fijate también en spam).",
      sinVerificar: true,
    };
  }
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
  // El equipo de Happy Paws, sin destino explícito, va directo al panel de revisión.
  redirect(user.rol === "ADMIN" && redirectTo === "/" ? "/admin/protectoras" : redirectTo);
}

export async function registerAdoptanteAction(
  _prevState: RegistroState,
  formData: FormData
): Promise<RegistroState> {
  const nombre = String(formData.get("nombre") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const telefono = String(formData.get("telefono") || "").trim();
  const password = String(formData.get("password") || "");
  const password2 = String(formData.get("password2") || "");

  const bloqueo = await chequeoAntiBots(formData, "registro", 5, 60 * 60 * 1000);
  if (bloqueo) return { error: bloqueo };

  if (!nombre || !email || !password) {
    return { error: "Completá nombre, email y contraseña." };
  }
  if (nombre.length > 120) return { error: "El nombre puede tener hasta 120 caracteres." };
  if (!esEmailValido(email)) return { error: "Revisá el formato del email." };
  if (telefono.length > 40) return { error: "El teléfono puede tener hasta 40 caracteres." };
  if (password.length < 6) {
    return { error: "La contraseña tiene que tener al menos 6 caracteres." };
  }
  if (password.length > 100) return { error: "La contraseña puede tener hasta 100 caracteres." };
  if (password !== password2) return { error: MENSAJE_PASSWORDS_DISTINTAS };

  if (await emailTomado(email)) {
    return { error: "Ese email ya está registrado. Iniciá sesión en vez de crear una cuenta nueva." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // La cuenta nace sin verificar: no se inicia sesión hasta que confirme
  // desde el link que le llega por correo.
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

  const { ok } = await enviarVerificacion(user);
  if (!ok) {
    return {
      error: "Creamos tu cuenta, pero no pudimos mandarte el correo de confirmación. Probá iniciar sesión en un rato para que te lo reenviemos.",
    };
  }
  return { enviadoA: email };
}

export async function registerProtectoraAction(
  _prevState: RegistroState,
  formData: FormData
): Promise<RegistroState> {
  const campo = (nombre: string) => String(formData.get(nombre) || "").trim();
  const datos: DatosRegistroProtectora = {
    nombreProtectora: campo("nombreProtectora"),
    ubicacion: campo("ubicacion"),
    email: campo("email").toLowerCase(),
    password: String(formData.get("password") || ""),
    password2: String(formData.get("password2") || ""),
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

  if (await emailTomado(datos.email)) {
    return { error: "Ese email ya está registrado. Iniciá sesión en vez de crear una cuenta nueva." };
  }

  const passwordHash = await bcrypt.hash(datos.password, 10);

  // La protectora nace PENDIENTE: no puede entrar ni aparece en los
  // listados hasta que alguien de Happy Paws la apruebe en /admin/protectoras.
  // Y antes de eso tiene que confirmar su correo: recién ahí entra a la cola
  // de revisión y se avisa al admin (ver alConfirmarEmail).
  const user = await prisma.user.create({
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

  const { ok } = await enviarVerificacion(user);
  if (!ok) {
    return {
      error: "Guardamos tu solicitud, pero no pudimos mandarte el correo de confirmación. Probá iniciar sesión en un rato para que te lo reenviemos.",
    };
  }
  return { enviadoA: datos.email };
}

export type VerificacionState = { error?: string } | null;

// Botón "Confirmar mi correo" de /verificar. Se confirma con un POST (y no
// solo con abrir el link) porque Gmail/Outlook a veces abren los links de
// los mails para revisarlos, y eso gastaría el token sin que la persona
// hiciera nada.
export async function confirmarEmailAction(
  _prevState: VerificacionState,
  formData: FormData
): Promise<VerificacionState> {
  const token = String(formData.get("token") || "");
  const invalido = {
    error: "Este link de confirmación ya no es válido. Iniciá sesión y te mandamos uno nuevo.",
  };
  if (!token || token.length > 200) return invalido;

  const registro = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, rol: true, emailVerificadoEn: true } } },
  });
  if (!registro || registro.usedAt || registro.expiresAt < new Date()) return invalido;

  // Token marcado como usado solo si seguía sin usar, en la misma
  // transacción: dos clicks a la vez no disparan dos veces los avisos.
  const confirmado = await prisma.$transaction(async (tx) => {
    const { count } = await tx.emailVerificationToken.updateMany({
      where: { id: registro.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (count === 0) return false;
    const { count: nuevos } = await tx.user.updateMany({
      where: { id: registro.userId, emailVerificadoEn: null },
      data: { emailVerificadoEn: new Date() },
    });
    return nuevos > 0;
  });

  if (confirmado) await alConfirmarEmail(registro.userId);

  redirect(registro.user.rol === "ADMIN_PROTECTORA" ? "/login?verificado=protectora" : "/login?verificado=1");
}

export type ReenviarState = { error?: string; success?: string } | null;

// "Reenviarme el correo" desde el login. Mismo mensaje exista o no la
// cuenta (no dejar adivinar qué emails están registrados).
export async function reenviarVerificacionAction(
  _prevState: ReenviarState,
  formData: FormData
): Promise<ReenviarState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const mensajeGenerico = "Si la cuenta existe y todavía no está confirmada, te mandamos un correo nuevo.";

  const ip = await ipCliente();
  if (estaLimitado(`reenviar-ip:${ip}`, 10, 60 * 60 * 1000)) return { error: MENSAJE_LIMITE };
  if (!(await verifyTurnstile(String(formData.get("turnstileToken") || ""), ip))) {
    return { error: MENSAJE_CAPTCHA_FALLIDO };
  }
  if (!esEmailValido(email)) return { error: "Revisá el formato del email." };
  if (estaLimitado(`reenviar:${email}`, 3, 60 * 60 * 1000)) return { success: mensajeGenerico };

  const user = await prisma.user.findUnique({ where: { email } });
  if (user && !user.emailVerificadoEn) await enviarVerificacion(user);
  return { success: mensajeGenerico };
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
  // la casilla de otra persona con mails de recuperación repetidos. Se
  // limita por IP (antes del captcha, como en login/registro) y además por
  // IP+email.
  const ip = await ipCliente();
  if (estaLimitado(`recuperar-ip:${ip}`, 10, 60 * 60 * 1000)) return { error: MENSAJE_LIMITE };
  if (!(await verifyTurnstile(String(formData.get("turnstileToken") || ""), ip))) {
    return { error: MENSAJE_CAPTCHA_FALLIDO };
  }
  if (estaLimitado(`recuperar:${ip}:${email}`, 3, 60 * 60 * 1000)) {
    return { success: mensajeGenerico };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { success: mensajeGenerico };

  const token = crypto.randomBytes(32).toString("base64url");
  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) },
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  await sendMail({ to: user.email, ...recuperacionContrasena(`${appUrl}/restablecer?token=${token}`) });

  return { success: mensajeGenerico };
}

export async function restablecerContrasenaAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const password2 = String(formData.get("password2") || "");

  if (!token) return { error: "Falta el token de recuperación." };
  if (password.length < 6) return { error: "La contraseña tiene que tener al menos 6 caracteres." };
  if (password.length > 100) return { error: "La contraseña puede tener hasta 100 caracteres." };
  if (password !== password2) return { error: MENSAJE_PASSWORDS_DISTINTAS };

  const invalido = { error: "Este link para recuperar la contraseña ya no es válido. Pedí uno nuevo." };
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) return invalido;

  const passwordHash = await bcrypt.hash(password, 10);
  // El token se marca usado solo si seguía sin usar, en la misma transacción
  // que el cambio de contraseña: no se puede usar dos veces en paralelo.
  const cambiada = await prisma.$transaction(async (tx) => {
    const { count } = await tx.passwordResetToken.updateMany({
      where: { id: resetToken.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (count === 0) return null;
    await tx.user.update({ where: { id: resetToken.userId }, data: { passwordHash } });
    // El link llegó a ese correo, así que también prueba que es suyo.
    const { count: recienVerificado } = await tx.user.updateMany({
      where: { id: resetToken.userId, emailVerificadoEn: null },
      data: { emailVerificadoEn: new Date() },
    });
    return { recienVerificado: recienVerificado > 0 };
  });
  if (!cambiada) return invalido;
  if (cambiada.recienVerificado) await alConfirmarEmail(resetToken.userId);

  redirect("/login?restablecida=1");
}
