import "server-only";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { protectoraEnRevision, solicitudProtectoraParaAdmin, verificacionEmail } from "@/lib/mail-templates";

const VALIDEZ_MS = 24 * 60 * 60 * 1000;

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Genera un link nuevo de "confirmá tu correo" y lo manda. Los links
// anteriores de ese usuario que no se usaron dejan de valer: solo sirve el
// último que le llegó.
export async function enviarVerificacion(user: { id: string; email: string; nombre: string; rol: string }) {
  const token = crypto.randomBytes(32).toString("base64url");
  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId: user.id, usedAt: null } }),
    prisma.emailVerificationToken.create({
      data: { tokenHash: hashToken(token), userId: user.id, expiresAt: new Date(Date.now() + VALIDEZ_MS) },
    }),
  ]);
  const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");
  return sendMail({
    to: user.email,
    ...verificacionEmail(user.nombre, `${appUrl}/verificar?token=${token}`, user.rol === "ADMIN_PROTECTORA"),
  });
}

// Una cuenta que nunca confirmó su correo no pudo iniciar sesión, así que no
// tiene nada propio (mascotas, solicitudes, etc.). Si alguien vuelve a
// registrarse con ese email, se borra y se crea de cero — si no, quien se
// registró primero con un email ajeno (o con un error de tipeo) dejaría ese
// correo tomado para siempre, y reenviarle el link al dueño real del correo
// le daría acceso a una cuenta con una contraseña que eligió otra persona.
export async function borrarCuentaSinVerificar(userId: string) {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId }, select: { emailVerificadoEn: true } });
    if (!user || user.emailVerificadoEn) return;
    const protectoras = await tx.protectora.findMany({ where: { duenioId: userId }, select: { id: true } });
    const pIds = protectoras.map((p) => p.id);
    await tx.invitacionProtectora.deleteMany({ where: { protectoraId: { in: pIds } } });
    await tx.notificacion.deleteMany({ where: { protectoraId: { in: pIds } } });
    await tx.protectora.deleteMany({ where: { id: { in: pIds } } });
    await tx.adoptante.deleteMany({ where: { userId } });
    await tx.emailVerificationToken.deleteMany({ where: { userId } });
    await tx.passwordResetToken.deleteMany({ where: { userId } });
    await tx.user.delete({ where: { id: userId } });
  });
}

// Lo que pasa cuando un correo queda confirmado por primera vez. Para una
// protectora nueva, recién ahora entra a la cola de revisión: se le avisa a
// ella y a la casilla de Happy Paws (MAIL_ADMIN). Nunca lanza.
export async function alConfirmarEmail(userId: string) {
  const protectora = await prisma.protectora.findFirst({
    where: { duenioId: userId, estadoVerificacion: "PENDIENTE" },
    include: { duenio: { select: { email: true } } },
  });
  if (!protectora) return;

  await prisma.protectora.update({ where: { id: protectora.id }, data: { fechaSolicitud: new Date() } });

  const email = protectora.email || protectora.duenio.email;
  const mailAdmin = process.env.MAIL_ADMIN;
  if (!mailAdmin) console.warn("[verificacion] MAIL_ADMIN no configurado — no se avisó de la nueva protectora.");
  await Promise.all([
    sendMail({ to: email, ...protectoraEnRevision(protectora.nombre) }),
    mailAdmin
      ? sendMail({
          to: mailAdmin,
          replyTo: email,
          ...solicitudProtectoraParaAdmin({
            nombre: protectora.nombre,
            ubicacion: protectora.ubicacion,
            email,
            telefono: protectora.telefono,
            instagram: protectora.instagram,
            facebook: protectora.facebook,
            sitioWeb: protectora.sitioWeb,
            nombreResponsable: protectora.nombreResponsable,
            cargoResponsable: protectora.cargoResponsable,
            textoVerificacion: protectora.textoVerificacion,
          }),
        })
      : null,
  ]);
}
