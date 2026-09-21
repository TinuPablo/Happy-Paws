import "server-only";
import { headers } from "next/headers";

// x-forwarded-for puede traer una lista "cliente, proxy1, proxy2" — el
// primero es el IP real del visitante tal como lo ve el proxy más cercano
// a él. Si no hay proxy delante (dev local), no viene ningún header y se
// agrupan todos los intentos bajo una sola clave — sigue sirviendo como
// límite global de emergencia en ese caso.
export async function ipCliente(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") || "desconocido";
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// Limitador en memoria, de un solo proceso — no hay infra de Redis todavía
// (ver AGENTS.md, "planificado, no implementado"), así que no sobrevive un
// restart ni se comparte entre instancias si el día de mañana corren varias.
// Alcanza igual para cortar de entrada los intentos automatizados de fuerza
// bruta contra el login y el spam de mails de recuperación/invitación, que
// hoy no tenían ningún límite.
export function estaLimitado(clave: string, maxIntentos: number, ventanaMs: number): boolean {
  const ahora = Date.now();
  const bucket = buckets.get(clave);
  if (!bucket || bucket.resetAt < ahora) {
    buckets.set(clave, { count: 1, resetAt: ahora + ventanaMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > maxIntentos;
}
