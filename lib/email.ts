import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";

// protectoraNombre y mascotaNombre los elige la protectora al registrarse o
// publicar una mascota — son texto libre que después se interpola en estos
// templates. Sin escapar, una protectora podría poner HTML/links falsos en
// ese campo y que termine incrustado tal cual en un mail real a otra
// persona (invitación o aviso de solicitud).
function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Si todavía no se configuró Resend, se avisa por consola en vez de romper
// el flujo (ej. crear una solicitud no debería fallar porque no se pudo
// mandar el mail de aviso) — el dato real ya quedó guardado en la base.
async function enviar(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY no configurada — no se envió "${subject}" a ${to}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error(`[email] Error mandando "${subject}" a ${to}:`, err);
  }
}

export async function enviarEmailRecuperacion(to: string, resetUrl: string) {
  await enviar(
    to,
    "Recuperá tu contraseña — Happy Paws",
    `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#6B3F1F">Happy Paws 🐾</h2>
        <p>Pediste restablecer tu contraseña. Si fuiste vos, entrá al siguiente link (vale por 2 horas):</p>
        <p><a href="${resetUrl}" style="display:inline-block;background:#6B3F1F;color:#fff;padding:10px 20px;border-radius:10px;text-decoration:none">Elegir nueva contraseña</a></p>
        <p style="color:#6B4A2F;font-size:13px">Si no fuiste vos, podés ignorar este mensaje — tu contraseña sigue igual.</p>
      </div>
    `
  );
}

export async function enviarEmailInvitacionProtectora(
  to: string,
  protectoraNombre: string,
  rol: "COLABORADOR" | "HOGAR_TRANSITO",
  inviteUrl: string
) {
  const etiquetaRol = rol === "COLABORADOR" ? "colaborador/a" : "hogar de tránsito";
  const nombreSeguro = escaparHtml(protectoraNombre);
  await enviar(
    to,
    `Te invitaron a sumarte a ${protectoraNombre} — Happy Paws`,
    `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#6B3F1F">Happy Paws 🐾</h2>
        <p>${nombreSeguro} te invitó a sumarte como <strong>${etiquetaRol}</strong>.</p>
        <p>Si querés aceptar, entrá al siguiente link y creá tu cuenta (vale por 7 días):</p>
        <p><a href="${inviteUrl}" style="display:inline-block;background:#6B3F1F;color:#fff;padding:10px 20px;border-radius:10px;text-decoration:none">Aceptar invitación</a></p>
        <p style="color:#6B4A2F;font-size:13px">Si no esperabas esto, podés ignorar este mensaje.</p>
      </div>
    `
  );
}

export async function enviarEmailCambioEstadoSolicitud(
  to: string,
  mascotaNombre: string,
  estado: "APROBADA" | "RECHAZADA"
) {
  const nombreSeguro = escaparHtml(mascotaNombre);
  const mensaje =
    estado === "APROBADA"
      ? `¡Buenas noticias! Tu solicitud para adoptar a ${nombreSeguro} fue aprobada 🎉`
      : `Tu solicitud para adoptar a ${nombreSeguro} no fue aprobada esta vez.`;

  await enviar(
    to,
    `Novedades sobre tu solicitud por ${mascotaNombre} — Happy Paws`,
    `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#6B3F1F">Happy Paws 🐾</h2>
        <p>${mensaje}</p>
        <p style="color:#6B4A2F;font-size:13px">Podés ver el detalle entrando a tu perfil en Happy Paws.</p>
      </div>
    `
  );
}
