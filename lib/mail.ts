import nodemailer, { type Transporter } from "nodemailer";

// Sin `import "server-only"` a propósito: scripts/test-mail.ts usa este
// módulo desde Node plano (tsx), donde ese paquete tira error al importarse.
// Igual nunca se importa desde un client component — lee SMTP_PASS.

export type MailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

// Sin espacios ni saltos de línea (\s los cubre): un "\r\n" en un campo que
// termina en una cabecera permitiría inyectar cabeceras nuevas (Bcc, etc.).
const EMAIL_REGEX = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;

export function esEmailValido(valor: string): boolean {
  return valor.length <= 254 && EMAIL_REGEX.test(valor);
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }
  return transporter;
}

// Nunca lanza: quien llama (registro, reportes, etc.) ya guardó el dato real
// en la base, y un mail que no sale no debería romper ese flujo.
export async function sendMail({ to, subject, html, text, replyTo }: MailInput): Promise<{ ok: boolean }> {
  if (!esEmailValido(to) || (replyTo !== undefined && !esEmailValido(replyTo))) {
    console.error("[mail] Destinatario o replyTo con formato inválido — no se envió el correo.");
    return { ok: false };
  }

  const smtp = getTransporter();
  if (!smtp) {
    console.warn(`[mail] SMTP_USER/SMTP_PASS no configurados — no se envió "${subject}".`);
    return { ok: false };
  }

  try {
    await smtp.sendMail({
      // El From es siempre la casilla de Happy Paws. Un email que haya
      // ingresado un usuario nunca va acá (sería suplantación): si hay que
      // responderle, va en replyTo.
      from: { name: "Happy Paws", address: process.env.SMTP_USER! },
      to,
      replyTo,
      subject: subject.replace(/[\r\n]+/g, " "),
      html,
      text,
    });
    return { ok: true };
  } catch (err) {
    // Solo el mensaje y el código: el objeto de error de nodemailer puede
    // arrastrar la config del transporte, y con ella la contraseña.
    const e = err as { message?: string; code?: string };
    console.error(`[mail] Error enviando "${subject}": ${e.code ?? ""} ${e.message ?? "error desconocido"}`);
    return { ok: false };
  }
}
