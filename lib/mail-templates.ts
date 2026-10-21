// Plantillas de los correos que salen por lib/mail.ts. Cada una devuelve
// { subject, html, text }: la versión de texto plano la usan los clientes
// que no muestran HTML y ayuda a que Gmail no los marque como spam.
//
// Todo dato que viene de un usuario (nombres, mensajes, links) pasa por
// escapeHtml antes de entrar al HTML — si no, alguien podría meter HTML o
// links falsos en un correo real que le llega a otra persona.

export type MailTemplate = { subject: string; html: string; text: string };

export function escapeHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function appUrl(): string {
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");
}

// Saltos de línea del usuario → <br>, después de escapar.
function parrafoUsuario(valor: string): string {
  return escapeHtml(valor).replace(/\r?\n/g, "<br>");
}

function boton(href: string, texto: string): string {
  return `<p style="margin:24px 0"><a href="${escapeHtml(href)}" style="display:inline-block;background:#6B3F1F;color:#FDF6EE;padding:12px 22px;border-radius:12px;text-decoration:none;font-weight:600">${escapeHtml(texto)}</a></p>`;
}

function layout(titulo: string, cuerpo: string): string {
  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#FDF6EE">
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#3D2010">
      <p style="margin:0 0 8px;color:#9B6B47;font-weight:700;font-size:14px">Happy Paws 🐾</p>
      <div style="background:#FAF3E8;border:1px solid #F5E6D0;border-radius:16px;padding:24px">
        <h1 style="margin:0 0 16px;color:#6B3F1F;font-size:22px">${titulo}</h1>
        <div style="font-size:15px;line-height:1.6;color:#6B4A2F">${cuerpo}</div>
      </div>
      <p style="margin:16px 0 0;color:#A07850;font-size:12px">Happy Paws — conectamos protectoras con familias adoptantes.</p>
    </div>
  </body>
</html>`;
}

function fila(etiqueta: string, valor: string | null | undefined): string {
  const contenido = valor && valor.trim() ? parrafoUsuario(valor) : `<span style="color:#A07850">—</span>`;
  return `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#9B6B47;font-weight:600;white-space:nowrap">${escapeHtml(etiqueta)}</td><td style="padding:6px 0;vertical-align:top;color:#3D2010">${contenido}</td></tr>`;
}

function filaTexto(etiqueta: string, valor: string | null | undefined): string {
  return `${etiqueta}: ${valor && valor.trim() ? valor : "—"}`;
}

export function protectoraEnRevision(nombreProtectora: string): MailTemplate {
  const nombre = escapeHtml(nombreProtectora);
  return {
    subject: "Recibimos tu solicitud — Happy Paws",
    html: layout(
      `¡Hola, ${nombre}!`,
      `<p>Recibimos tu solicitud de ingreso a Happy Paws. ¡Gracias por sumarte!</p>
       <p>Estamos revisándola y te vamos a escribir a este correo. La respuesta puede demorar hasta 72 horas hábiles.</p>`
    ),
    text: `¡Hola, ${nombreProtectora}!

Recibimos tu solicitud de ingreso a Happy Paws. ¡Gracias por sumarte!
Estamos revisándola y te vamos a escribir a este correo. La respuesta puede demorar hasta 72 horas hábiles.`,
  };
}

export type DatosSolicitudProtectora = {
  nombre: string;
  ubicacion: string;
  email: string;
  telefono?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  sitioWeb?: string | null;
  nombreResponsable?: string | null;
  cargoResponsable?: string | null;
  textoVerificacion?: string | null;
};

export function solicitudProtectoraParaAdmin(datos: DatosSolicitudProtectora): MailTemplate {
  const panel = `${appUrl()}/admin/protectoras`;
  const campos: [string, string | null | undefined][] = [
    ["Protectora", datos.nombre],
    ["Ubicación", datos.ubicacion],
    ["Email", datos.email],
    ["Teléfono / WhatsApp", datos.telefono],
    ["Instagram", datos.instagram],
    ["Facebook", datos.facebook],
    ["Sitio web", datos.sitioWeb],
    ["Responsable", datos.nombreResponsable],
    ["Cargo", datos.cargoResponsable],
    ["Cómo verificar", datos.textoVerificacion],
  ];
  return {
    subject: `Nueva protectora para revisar: ${datos.nombre}`,
    html: layout(
      "Nueva solicitud de protectora",
      `<p>Una protectora pidió sumarse a Happy Paws. Estos son los datos que cargó:</p>
       <table style="border-collapse:collapse;font-size:14px;margin:12px 0">${campos.map(([e, v]) => fila(e, v)).join("")}</table>
       ${boton(panel, "Revisar en el panel")}`
    ),
    text: `Una protectora pidió sumarse a Happy Paws. Estos son los datos que cargó:

${campos.map(([e, v]) => filaTexto(e, v)).join("\n")}

Revisala en: ${panel}`,
  };
}

export function protectoraAprobada(nombreProtectora: string): MailTemplate {
  const nombre = escapeHtml(nombreProtectora);
  const login = `${appUrl()}/login`;
  return {
    subject: "¡Tu protectora ya está en Happy Paws! 🐾",
    html: layout(
      `¡Bienvenida, ${nombre}!`,
      `<p>Revisamos tu solicitud y ya está aprobada. Desde ahora podés iniciar sesión y empezar a publicar a tus peludos para que encuentren familia.</p>
       ${boton(login, "Iniciar sesión")}`
    ),
    text: `¡Bienvenida, ${nombreProtectora}!

Revisamos tu solicitud y ya está aprobada. Desde ahora podés iniciar sesión y empezar a publicar a tus peludos para que encuentren familia.

Iniciá sesión en: ${login}`,
  };
}

export function protectoraRechazada(nombreProtectora: string, motivo: string): MailTemplate {
  const nombre = escapeHtml(nombreProtectora);
  return {
    subject: "Sobre tu solicitud en Happy Paws",
    html: layout(
      `Hola, ${nombre}`,
      `<p>Gracias por querer sumarte a Happy Paws. Revisamos tu solicitud con atención y, por ahora, no pudimos aprobarla. Te contamos el motivo:</p>
       <blockquote style="margin:16px 0;padding:12px 16px;background:#FDF6EE;border-left:4px solid #C8956C;border-radius:8px;color:#3D2010">${parrafoUsuario(motivo)}</blockquote>
       <p>Si querés contarnos algo más o creés que hubo un error, podés escribirnos desde el formulario de contacto que está al pie del sitio. Vamos a leerte con gusto.</p>`
    ),
    text: `Hola, ${nombreProtectora}

Gracias por querer sumarte a Happy Paws. Revisamos tu solicitud con atención y, por ahora, no pudimos aprobarla. Te contamos el motivo:

${motivo}

Si querés contarnos algo más o creés que hubo un error, podés escribirnos desde el formulario de contacto que está al pie del sitio (${appUrl()}). Vamos a leerte con gusto.`,
  };
}

export function reporteParaAdmin(emailUsuario: string, mensaje: string): MailTemplate {
  return {
    subject: `Nuevo reporte de ${emailUsuario}`,
    html: layout(
      "Nuevo reporte desde el sitio",
      `<p><strong style="color:#6B3F1F">De:</strong> ${escapeHtml(emailUsuario)}</p>
       <blockquote style="margin:16px 0;padding:12px 16px;background:#FDF6EE;border-left:4px solid #C8956C;border-radius:8px;color:#3D2010">${parrafoUsuario(mensaje)}</blockquote>
       <p style="font-size:13px">Si respondés este correo, la respuesta le llega directo a esa persona.</p>`
    ),
    text: `Nuevo reporte desde el sitio
De: ${emailUsuario}

${mensaje}

Si respondés este correo, la respuesta le llega directo a esa persona.`,
  };
}

export function reporteConfirmacion(): MailTemplate {
  return {
    subject: "Recibimos tu reporte — Happy Paws",
    html: layout(
      "¡Gracias por escribirnos!",
      `<p>Recibimos tu reporte y te vamos a responder a este correo.</p>`
    ),
    text: `¡Gracias por escribirnos!

Recibimos tu reporte y te vamos a responder a este correo.`,
  };
}
