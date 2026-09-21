import "server-only";
import { prisma } from "@/lib/prisma";

// Resuelve para qué protectora puede actuar un usuario: la que es dueño
// (ADMIN_PROTECTORA) o, si no tiene una propia, aquella de la que es
// miembro (COLABORADOR/HOGAR_TRANSITO vía MiembroProtectora). Usado tanto
// para las mutaciones (aprobar solicitud, completar seguimiento) como para
// armar /perfil — antes solo se reconocía al dueño, así que un colaborador
// invitado no podía hacer nada aunque su rol ya estuviera habilitado en
// requireRole().
export async function protectoraIdDeUsuario(userId: string): Promise<string | null> {
  const propia = await prisma.protectora.findFirst({
    where: { duenioId: userId },
    select: { id: true },
  });
  if (propia) return propia.id;

  const membresia = await prisma.miembroProtectora.findFirst({
    where: { userId },
    select: { protectoraId: true },
  });
  return membresia?.protectoraId ?? null;
}
