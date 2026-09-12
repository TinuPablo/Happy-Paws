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
  const json = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const value = `${json}.${sign(json)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
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
  if (sign(json) !== sig) return null;

  try {
    return JSON.parse(Buffer.from(json, "base64url").toString());
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
