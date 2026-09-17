import type { Mascota } from "@prisma/client";

export type RespuestasQuiz = {
  departamento: "si" | "no";
  hijos: "si" | "no";
  tiempoDisponible: "poco" | "moderado" | "mucho";
  especiePreferida: "perro" | "gato" | "cualquiera";
  otrasMascotas: "si" | "no";
};

// Valida datos que llegan del cliente (hidden input del formulario de
// solicitud) antes de confiar en ellos — límite de confianza real, no
// alcanza con que el propio JS del sitio los haya puesto ahí.
export function esRespuestasQuizValidas(valor: unknown): valor is RespuestasQuiz {
  if (!valor || typeof valor !== "object") return false;
  const r = valor as Record<string, unknown>;
  return (
    (r.departamento === "si" || r.departamento === "no") &&
    (r.hijos === "si" || r.hijos === "no") &&
    (r.tiempoDisponible === "poco" || r.tiempoDisponible === "moderado" || r.tiempoDisponible === "mucho") &&
    (r.especiePreferida === "perro" || r.especiePreferida === "gato" || r.especiePreferida === "cualquiera") &&
    (r.otrasMascotas === "si" || r.otrasMascotas === "no")
  );
}

export type MascotaParaMatch = Pick<
  Mascota,
  "especie" | "tamanio" | "aptaDepartamento" | "aptaNinos" | "nivelEnergia" | "conviveOtrasMascotas"
>;

export function calcularCompatibilidad(
  mascota: MascotaParaMatch,
  respuestas: RespuestasQuiz
): number {
  let puntos = 0;

  // Pregunta 1: departamento (máx 20)
  if (respuestas.departamento === "si") {
    if (mascota.tamanio === "GRANDE") puntos += 0;
    else if (mascota.aptaDepartamento === true) puntos += 20;
    else puntos += 14;
  } else {
    puntos += 20;
  }

  // Pregunta 2: hijos (máx 20)
  if (respuestas.hijos === "si") {
    if (mascota.aptaNinos === false) puntos += 0;
    else if (mascota.aptaNinos === true) puntos += 20;
    else puntos += 12;
  } else {
    puntos += 20;
  }

  // Pregunta 3: tiempo disponible vs nivel de energía (máx 20)
  const energia = mascota.nivelEnergia;
  if (respuestas.tiempoDisponible === "poco") {
    if (energia === "bajo") puntos += 20;
    else if (energia === "medio") puntos += 10;
    else if (energia === "alto") puntos += 0;
    else puntos += 10;
  } else if (respuestas.tiempoDisponible === "moderado") {
    if (energia === "medio") puntos += 20;
    else if (energia === "bajo" || energia === "alto") puntos += 14;
    else puntos += 12;
  } else {
    if (energia === "alto") puntos += 20;
    else if (energia === "medio") puntos += 12;
    else if (energia === "bajo") puntos += 4;
    else puntos += 10;
  }

  // Pregunta 4: especie preferida (máx 20)
  if (respuestas.especiePreferida === "cualquiera") {
    puntos += 20;
  } else if (respuestas.especiePreferida === "perro") {
    puntos += mascota.especie === "PERRO" ? 20 : 0;
  } else {
    puntos += mascota.especie === "GATO" ? 20 : 0;
  }

  // Pregunta 5: otras mascotas en casa (máx 20)
  if (respuestas.otrasMascotas === "si") {
    if (mascota.conviveOtrasMascotas === false) puntos += 0;
    else if (mascota.conviveOtrasMascotas === true) puntos += 20;
    else puntos += 12;
  } else {
    puntos += 20;
  }

  return puntos; // máximo 100
}
