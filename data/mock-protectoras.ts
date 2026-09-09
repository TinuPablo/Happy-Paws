export type ProtectoraMock = {
  id: string;
  nombre: string;
  ubicacion: string;
  descripcion: string;
  cantidadMascotas: number;
};

// Datos temporales — se reemplazan por datos reales de MySQL más adelante
export const mockProtectoras: ProtectoraMock[] = [
  {
    id: "1",
    nombre: "FUPA",
    ubicacion: "Villa Carlos Paz, Córdoba",
    descripcion: "Protectora piloto de Happy Paws, rescata y aloja animales en situación de calle.",
    cantidadMascotas: 12,
  },
  {
    id: "2",
    nombre: "Huellitas de Punilla",
    ubicacion: "Cosquín, Córdoba",
    descripcion: "Trabajan en conjunto con hogares de tránsito de la zona de Punilla.",
    cantidadMascotas: 8,
  },
];
