import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MENSAJE_LIMITE, estaLimitado, ipCliente } from "@/lib/rateLimit";
import { MENSAJE_CAPTCHA_FALLIDO, verifyTurnstile } from "@/lib/turnstile";
import { esEmailValido, sendMail } from "@/lib/mail";
import { reporteConfirmacion, reporteParaAdmin } from "@/lib/mail-templates";
import { REPORTE_MENSAJE_MAX as MENSAJE_MAX, REPORTE_MENSAJE_MIN as MENSAJE_MIN } from "@/lib/reportes";

// Formulario "¿Tuviste un problema?" del footer (app/components/ContactModal.tsx).
// Orden estricto: límite por IP → honeypot → captcha → validación. Así un
// bot que insiste no nos hace llamar a Cloudflare ni tocar la base.
export async function POST(request: Request) {
  const ip = await ipCliente();
  if (estaLimitado(`reporte-ip:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json({ error: MENSAJE_LIMITE }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "No pudimos leer el formulario. Probá de nuevo." }, { status: 400 });
  }
  const texto = (v: unknown) => (typeof v === "string" ? v : "");

  // Honeypot: un campo invisible para personas. Si viene completo es un
  // bot — se le responde "ok" para que no sepa que lo detectamos, sin
  // guardar ni enviar nada.
  if (texto(body.website).trim()) {
    return NextResponse.json({ ok: true });
  }

  if (!(await verifyTurnstile(texto(body.turnstileToken), ip))) {
    return NextResponse.json({ error: MENSAJE_CAPTCHA_FALLIDO }, { status: 400 });
  }

  const email = texto(body.email).trim().toLowerCase();
  const mensaje = texto(body.mensaje).trim();
  if (!esEmailValido(email)) {
    return NextResponse.json({ error: "Revisá el formato de tu correo electrónico." }, { status: 400 });
  }
  if (mensaje.length < MENSAJE_MIN || mensaje.length > MENSAJE_MAX) {
    return NextResponse.json(
      { error: `El mensaje tiene que tener entre ${MENSAJE_MIN} y ${MENSAJE_MAX} caracteres.` },
      { status: 400 }
    );
  }

  // Primero se guarda: si después falla el correo, el reporte no se pierde.
  const reporte = await prisma.reporte.create({ data: { email, mensaje } });

  const mailAdmin = process.env.MAIL_ADMIN;
  if (!mailAdmin) console.warn("[reportes] MAIL_ADMIN no configurado — el reporte quedó solo en la base.");
  const [aviso] = await Promise.all([
    // replyTo = quien reportó: al responder desde Gmail le llega directo.
    mailAdmin ? sendMail({ to: mailAdmin, replyTo: email, ...reporteParaAdmin(email, mensaje) }) : { ok: false },
    sendMail({ to: email, ...reporteConfirmacion() }),
  ]);

  if (aviso.ok) {
    await prisma.reporte.update({ where: { id: reporte.id }, data: { emailEnviado: true } });
  } else {
    console.error(`[reportes] No se pudo avisar del reporte ${reporte.id} por correo (quedó guardado).`);
  }

  // Aunque el correo falle, para quien reporta está todo bien: quedó guardado.
  return NextResponse.json({ ok: true });
}
