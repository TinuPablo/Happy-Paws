import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import type { RolGlobal } from "@prisma/client";

const COOKIE_NAME = "happy_paws_session";
const SECRET = process.env.SESSION_SECRET;

if (!SECRET) {
  throw new Error("Falta SESSION_SECRET en .env — necesaria para firmar la sesión.");
}

export type SessionPayload = {
  userId: string;
  rol: RolGlobal;
  nombre: string;
};

// Se guarda además `iat` (issued-at) firmado junto con el resto del payload
// — así el servidor puede rechazar una cookie más vieja que MAX_AGE_MS
// aunque alguien la reenvíe a mano (curl, cookie copiada) después de que el
// navegador ya la hubiera descartado por su propia cuenta. Antes de esto la
// sesión no expiraba nunca del lado del servidor.
type SessionPayloadFirmado = SessionPayload & { iat: number };

const MAX_AGE_MS = 60 * 60 * 24 * 30 * 1000;

// Rol simplificado que consume la UI (el enum real tiene 4 valores, la
// interfaz de hoy solo distingue adoptante de "cuenta de protectora").
export type UiRole = "adoptante" | "protectora";

export function toUiRole(rol: RolGlobal): UiRole {
  return rol === "ADOPTANTE" ? "adoptante" : "protectora";
}

function sign(data: string) {
  return crypto.createHmac("sha256", SECRET as string).update(data).digest("base64url");
}

export async function createSession(payload: SessionPayload) {
  const firmado: SessionPayloadFirmado = { ...payload, iat: Date.now() };
  const json = Buffer.from(JSON.stringify(firmado)).toString("base64url");
  const value = `${json}.${sign(json)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_MS / 1000,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const dotIndex = raw.lastIndexOf(".");
  if (dotIndex === -1) return null;
  const json = raw.slice(0, dotIndex);
  const sig = raw.slice(dotIndex + 1);

  // Comparación a tiempo constante: con `!==` el tiempo que tarda la
  // comparación de strings varía según en qué byte difieren, lo que en
  // teoría deja adivinar la firma correcta byte a byte midiendo latencia
  // (timing attack). crypto.timingSafeEqual no tiene ese problema — eso sí,
  // exige que ambos buffers midan lo mismo, por eso se compara longitud antes.
  const esperada = Buffer.from(sign(json));
  const recibida = Buffer.from(sig);
  if (esperada.length !== recibida.length || !crypto.timingSafeEqual(esperada, recibida)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(json, "base64url").toString()) as Partial<SessionPayloadFirmado>;
    if (!payload.userId || !payload.rol || !payload.nombre) return null;
    if (typeof payload.iat === "number" && Date.now() - payload.iat > MAX_AGE_MS) return null;
    return { userId: payload.userId, rol: payload.rol, nombre: payload.nombre };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Verifica el rol contra la sesión firmada del servidor, no contra nada que
// mande el cliente — así una mutación no puede ejecutarse solo por ocultar
// un botón en la UI (ver backlog: rol falsificable via localStorage mock).
export async function requireRole(...allowed: RolGlobal[]): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("No autenticado.");
  if (!allowed.includes(session.rol)) throw new Error("No autorizado para esta acción.");
  return session;
}
