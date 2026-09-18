const LABELS: Record<string, string> = {
  EN_PROTECTORA: "Disponible",
  EN_TRANSITO: "En tránsito",
  EN_PROCESO: "En proceso",
  ADOPTADO: "Adoptada",
  FALLECIDO: "Fallecido",
};

const CLASSES: Record<string, string> = {
  EN_PROTECTORA: "bg-[var(--green-ok)]/15 text-[var(--green-ok)]",
  EN_TRANSITO: "bg-[var(--brown-light)] text-[var(--text-mid)]",
  EN_PROCESO: "bg-[var(--gold)]/20 text-[var(--brown-dark)]",
  ADOPTADO: "bg-[var(--brown-main)]/15 text-[var(--brown-dark)]",
  FALLECIDO: "bg-gray-200 text-gray-600",
};

export function estadoMascotaLabel(estado: string) {
  return LABELS[estado] ?? estado;
}

export function estadoMascotaClasses(estado: string) {
  return CLASSES[estado] ?? "bg-[var(--brown-light)] text-[var(--text-mid)]";
}
