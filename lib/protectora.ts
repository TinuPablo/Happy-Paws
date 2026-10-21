import "server-only";
import type { EstadoVerificacion } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Resuelve para qué protectora puede actuar un usuario: la que es dueño
// (ADMIN_PROTECTORA) o, si no tiene una propia, aquella de la que es
// miembro (COLABORADOR/HOGAR_TRANSITO vía MiembroProtectora). Usado tanto
// para las mutaciones (aprobar solicitud, completar seguimiento) como para
// armar /perfil — antes solo se reconocía al dueño, así que un colaborador
// invitado no podía hacer nada aunque su rol ya estuviera habilitado en
// requireRole().
// Solo devuelve protectoras APROBADAS: una pendiente o rechazada no puede
// operar aunque tenga una sesión abierta (defensa en profundidad además del
// bloqueo en el login).
export async function protectoraIdDeUsuario(userId: string): Promise<string | null> {
  const propia = await prisma.protectora.findFirst({
    where: { duenioId: userId, estadoVerificacion: "APROBADA" },
    select: { id: true },
  });
  if (propia) return propia.id;

  const membresia = await prisma.miembroProtectora.findFirst({
    where: { userId, protectora: { estadoVerificacion: "APROBADA" } },
    select: { protectoraId: true },
  });
  return membresia?.protectoraId ?? null;
}

// Estado de verificación de la protectora a la que pertenece el usuario
// (como dueño o miembro), sin filtrar — lo usa el login para explicar por
// qué no puede entrar. null si no pertenece a ninguna.
export async function estadoVerificacionDeUsuario(userId: string): Promise<EstadoVerificacion | null> {
  const propia = await prisma.protectora.findFirst({
    where: { duenioId: userId },
    select: { estadoVerificacion: true },
  });
  if (propia) return propia.estadoVerificacion;

  const membresia = await prisma.miembroProtectora.findFirst({
    where: { userId },
    select: { protectora: { select: { estadoVerificacion: true } } },
  });
  return membresia?.protectora.estadoVerificacion ?? null;
}
