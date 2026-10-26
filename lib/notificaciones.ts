import "server-only";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { nuevaSolicitudParaProtectora } from "@/lib/mail-templates";

// Se llama después de crear una SolicitudAdopcion exitosamente (ver
// crearSolicitudAction). Crea la notificación interna (campana del header +
// /adopciones) y avisa por correo a la protectora. No lanza excepciones
// hacia quien la llama — un problema acá no debe romper el flujo de
// "solicitud enviada" del adoptante.
export async function notificarNuevaSolicitud(solicitudId: string) {
  try {
    const solicitud = await prisma.solicitudAdopcion.findUnique({
      where: { id: solicitudId },
      include: {
        mascota: { include: { protectora: { include: { duenio: { select: { email: true } } } } } },
        adoptante: { include: { user: true } },
      },
    });
    if (!solicitud) return;

    const mensaje = `${solicitud.adoptante.user.nombre} quiere adoptar a ${solicitud.mascota.nombre}.`;

    await prisma.notificacion.create({
      data: {
        protectoraId: solicitud.mascota.protectoraId,
        tipo: "SOLICITUD_NUEVA",
        mensaje,
        solicitudId: solicitud.id,
      },
    });

    const { protectora } = solicitud.mascota;
    await sendMail({
      to: protectora.email || protectora.duenio.email,
      ...nuevaSolicitudParaProtectora(solicitud.adoptante.user.nombre, solicitud.mascota.nombre),
    });
  } catch (error) {
    console.error("No se pudo notificar la nueva solicitud:", error);
  }
}
