import "server-only";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const MENSAJE_CAPTCHA_FALLIDO = "No pudimos verificar que sos una persona. Probá de nuevo.";

// Falla cerrado: sin secret configurado, sin token, error de red, timeout o
// respuesta rara de Cloudflare → false. Nunca se deja pasar "por las dudas".
export async function verifyTurnstile(token: string | null | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY no configurada — se rechaza la verificación.");
    return false;
  }
  if (!token || token.length > 2048) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "desconocido") body.set("remoteip", ip);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[turnstile] Error verificando el captcha:", (err as Error).message);
    return false;
  }
}
