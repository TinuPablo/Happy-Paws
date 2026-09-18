import "server-only";
import { prisma } from "@/lib/prisma";

// El proveedor de email todavía no está decidido (ver backlog en AGENTS.md:
// "Notificación por email... depende de una decisión de proveedor de
// SMTP/Resend/similar que no estaba tomada"). Por ahora esto solo deja
// constancia en el log del servidor. Cuando se elija un proveedor, se
// reemplaza el cuerpo de esta función — nadie que la llame necesita
// cambiar nada.
async function enviarEmailNotificacion(destinatario: string, asunto: string, cuerpo: string) {
  console.log(`[email pendiente de proveedor] Para: ${destinatario} — ${asunto}\n${cuerpo}`);
}

// Se llama después de crear una SolicitudAdopcion exitosamente. Crea la
// notificación interna (visible en /perfil de la protectora) y dispara el
// email de aviso. No lanza excepciones hacia quien la llama — un problema
// acá no debe romper el flujo de "solicitud enviada" del adoptante.
export async function notificarNuevaSolicitud(solicitudId: string) {
  try {
    const solicitud = await prisma.solicitudAdopcion.findUnique({
      where: { id: solicitudId },
      include: {
        mascota: { include: { protectora: true } },
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

    if (solicitud.mascota.protectora.email) {
      await enviarEmailNotificacion(
        solicitud.mascota.protectora.email,
        "Nueva solicitud de adopción en Happy Paws",
        mensaje
      );
    }
  } catch (error) {
    console.error("No se pudo notificar la nueva solicitud:", error);
  }
}
