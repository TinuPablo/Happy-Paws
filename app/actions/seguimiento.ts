"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { protectoraIdDeUsuario } from "@/lib/protectora";

// La protectora marca un checkpoint de seguimiento post-adopción como hecho
// (ver schema: SeguimientoAdopcion, generados automáticamente al aprobar una
// solicitud) — se verifica que sea dueña de la mascota, mismo patrón que
// actualizarEstadoSolicitudAction en app/actions/solicitudes.ts.
export async function completarSeguimientoAction(formData: FormData) {
  const session = await requireRole("ADMIN_PROTECTORA", "COLABORADOR", "HOGAR_TRANSITO");

  const seguimientoId = String(formData.get("seguimientoId") || "");
  if (!seguimientoId) throw new Error("Falta el checkpoint.");

  const nota = String(formData.get("nota") || "").trim();

  const seguimiento = await prisma.seguimientoAdopcion.findUnique({
    where: { id: seguimientoId },
    include: { mascota: true },
  });
  if (!seguimiento) throw new Error("Checkpoint no encontrado.");

  const protectoraId = await protectoraIdDeUsuario(session.userId);
  if (!protectoraId || protectoraId !== seguimiento.mascota.protectoraId) {
    throw new Error("No tenés permiso sobre esta mascota.");
  }

  await prisma.seguimientoAdopcion.update({
    where: { id: seguimientoId },
    data: { fechaRealizada: new Date(), nota: nota || null },
  });

  revalidatePath(`/mascotas/${seguimiento.mascotaId}`);
}
