import type { EstadoSolicitud } from "@prisma/client";

export function badgeClasses(estado: EstadoSolicitud) {
  if (estado === "APROBADA") return "bg-[var(--green-ok)] text-white";
  if (estado === "PENDIENTE" || estado === "EN_REVISION") return "bg-[var(--gold)] text-[var(--brown-darker)]";
  return "border border-red-300 text-[var(--text-mid)]";
}

export function badgeLabel(estado: EstadoSolicitud) {
  if (estado === "APROBADA") return "Aprobada";
  if (estado === "PENDIENTE") return "Pendiente";
  if (estado === "EN_REVISION") return "En revisión";
  if (estado === "CANCELADA") return "Cancelada";
  return "Rechazada";
}
