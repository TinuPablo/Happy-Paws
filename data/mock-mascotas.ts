export type MascotaMock = {
  id: string;
  nombre: string;
  especie: "PERRO" | "GATO";
  raza: string;
  edadAproximada: string;
  tamanio: "PEQUEÑO" | "MEDIANO" | "GRANDE";
  descripcion: string;
  vacunas?: {
    nombre: string;
    fecha: string; // formato "DD/MM/AAAA"
    estado: "APLICADA" | "PENDIENTE";
  }[];
  mediaUrl?: string;
  mediaType?: "image" | "video";
};

// Datos temporales — se reemplazan por datos reales de MySQL más adelante
export const mockMascotas: MascotaMock[] = [
  {
    id: "1",
    nombre: "Firulais",
    especie: "PERRO",
    raza: "Mestizo",
    edadAproximada: "2 años",
    tamanio: "MEDIANO",
    descripcion: "Muy juguetón y cariñoso, se lleva bien con otros perros.",
    vacunas: [
      { nombre: "Polivalente (moquillo, parvovirus, hepatitis)", fecha: "10/03/2026", estado: "APLICADA" },
      { nombre: "Antirrábica", fecha: "15/03/2026", estado: "APLICADA" },
      { nombre: "Antirrábica (refuerzo anual)", fecha: "15/03/2027", estado: "PENDIENTE" },
    ],
  },
  {
    id: "2",
    nombre: "Michi",
    especie: "GATO",
    raza: "Mestizo",
    edadAproximada: "1 año",
    tamanio: "PEQUEÑO",
    descripcion: "Tranquila y curiosa, ideal para departamento.",
    vacunas: [
      { nombre: "Triple felina", fecha: "05/02/2026", estado: "APLICADA" },
      { nombre: "Antirrábica", fecha: "20/06/2026", estado: "PENDIENTE" },
    ],
  },
  {
    id: "3",
    nombre: "Rocky",
    especie: "PERRO",
    raza: "Labrador",
    edadAproximada: "4 años",
    tamanio: "GRANDE",
    descripcion: "Energético, necesita espacio y paseos diarios.",
  },
  {
    id: "4",
    nombre: "Luna",
    especie: "GATO",
    raza: "Siamés",
    edadAproximada: "3 años",
    tamanio: "PEQUEÑO",
    descripcion: "Independiente pero muy cariñosa con su familia.",
  },
];
