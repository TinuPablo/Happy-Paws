// Manda un correo de prueba a MAIL_ADMIN para confirmar que el SMTP de Gmail
// quedó bien configurado. Uso: npm run mail:test (carga el .env solo).
import { sendMail } from "../lib/mail";
import { protectoraEnRevision } from "../lib/mail-templates";

async function main() {
  const to = process.env.MAIL_ADMIN;
  if (!to) {
    console.error("Falta MAIL_ADMIN en el .env.");
    process.exit(1);
  }

  const { subject, html, text } = protectoraEnRevision("Protectora de prueba");
  const { ok } = await sendMail({ to, subject: `[Prueba] ${subject}`, html, text });

  if (ok) {
    console.log(`Correo de prueba enviado a ${to}. Revisá la bandeja (y spam, por las dudas).`);
  } else {
    console.error("No se pudo enviar el correo de prueba. Revisá SMTP_USER/SMTP_PASS y el log de arriba.");
    process.exit(1);
  }
}

main();
