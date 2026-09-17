# Prompt 14 — Match adoptante-mascota (quiz estilo Kahoot)

## Contexto para el agente
En /mascotas, antes de mostrar el catálogo completo, el adoptante responde
un cuestionario de 5 preguntas (una por vez, tipo Kahoot, con transición de
carrusel). Al terminar, se le muestra la mascota más compatible con un
porcentaje de match, calculado con datos mock (MascotasContext, todavía
sin backend real). Siempre tiene que poder saltar al catálogo completo, ya
sea desde el cuestionario o desde la pantalla de resultado.

## Prompt

```
Leé AGENTS.md.

Tarea 1 — Extender el tipo de mascota con atributos de compatibilidad

En data/mock-mascotas.ts, agregá al tipo MascotaMock estos campos
opcionales:

aptaDepartamento?: boolean;
aptaNinos?: boolean;
nivelEnergia?: "bajo" | "medio" | "alto";
conviveOtrasMascotas?: boolean;

Completá estos valores en las 4 mascotas existentes del array mockMascotas,
exactamente así:

- Firulais: aptaDepartamento: true, aptaNinos: true, nivelEnergia: "alto", conviveOtrasMascotas: true
- Michi: aptaDepartamento: true, aptaNinos: true, nivelEnergia: "bajo", conviveOtrasMascotas: true
- Rocky: aptaDepartamento: false, aptaNinos: true, nivelEnergia: "alto", conviveOtrasMascotas: false
- Luna: aptaDepartamento: true, aptaNinos: false, nivelEnergia: "medio", conviveOtrasMascotas: false

Tarea 2 — Función de cálculo de compatibilidad

Creá app/lib/calcularCompatibilidad.ts (sin "use client", es una función
pura):

import { MascotaMock } from "../../data/mock-mascotas";

export type RespuestasQuiz = {
  departamento: "si" | "no";
  hijos: "si" | "no";
  tiempoDisponible: "poco" | "moderado" | "mucho";
  especiePreferida: "perro" | "gato" | "cualquiera";
  otrasMascotas: "si" | "no";
};

export function calcularCompatibilidad(
  mascota: MascotaMock,
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

Tarea 3 — Componente del quiz (estilo Kahoot, carrusel)

Creá app/mascotas/MatchQuiz.tsx con "use client" al principio. Estructura:

- Un array interno PREGUNTAS con las 5 preguntas y sus opciones:
  1. "¿Vivís en un departamento?" → Sí / No (clave: departamento)
  2. "¿Tenés hijos en casa?" → Sí / No (clave: hijos)
  3. "¿Cuánto tiempo podés dedicarle a pasear y jugar por día?" →
     Poco / Moderado / Mucho (clave: tiempoDisponible, valores poco/moderado/mucho)
  4. "¿Preferís perro, gato, o no tenés preferencia?" →
     Perro / Gato / Cualquiera (clave: especiePreferida)
  5. "¿Ya tenés otras mascotas en casa?" → Sí / No (clave: otrasMascotas)

- Props del componente:
  type MatchQuizProps = {
    onFinish: (respuestas: RespuestasQuiz) => void;
    onSkip: () => void;
  };

- Estado interno: currentIndex (número de pregunta actual, 0 a 4) y
  respuestas (objeto que se va completando).

- Al elegir una opción: guardá la respuesta, esperá ~350ms (para que se
  vea el botón seleccionado un instante, efecto Kahoot), y avanzá a la
  siguiente pregunta. Si era la última (index 4), llamá a onFinish con
  las respuestas completas en vez de avanzar.

- Transición de carrusel: envolvé las preguntas en un contenedor con
  overflow-hidden, y aplicá un transform: translateX(-${currentIndex * 100}%)
  con transition: "transform 0.4s ease" al contenedor interno que tiene
  las 5 preguntas una al lado de la otra (display: flex, cada pregunta
  con flex-shrink: 0 y width: 100%).

- Arriba de todo, una barra de progreso con 5 segmentos (divs chicos en
  fila), donde los segmentos hasta currentIndex están coloreados con
  --brown-dark y el resto con --brown-light.

- Cada pregunta se muestra como una card grande centrada (fondo blanco,
  borde --brown-light, bien padding), con el texto de la pregunta en
  tamaño grande (text-xl o text-2xl, bold, color --text-dark) y los
  botones de opciones debajo, en fila si son 2-3 opciones, cada botón con
  fondo --brown-light que cambia a --brown-main con texto blanco al
  seleccionarse.

- Un link/botón chico, discreto, en la esquina superior derecha o debajo
  de la barra de progreso: "Omitir y ver todas las mascotas" que llama a
  onSkip().

No implementes la pantalla de resultado en este componente — eso es una
pieza separada (tarea 4).

Tarea 4 — Componente de resultado (mascota recomendada)

Creá app/mascotas/MatchResult.tsx con "use client":

type MatchResultProps = {
  mascota: MascotaMock;
  porcentaje: number;
  onVerTodas: () => void;
};

Mostrá: un título tipo "¡Encontramos tu match!", el porcentaje grande
(text-5xl o similar, color --brown-dark, con el símbolo %), una card con
la mascota recomendada (mismo estilo visual que las cards del catálogo:
imagen o emoji placeholder, nombre, raza, edad, tamaño, descripción), un
botón "Ver ficha completa" que linkea a /mascotas/[id] con el id de esa
mascota, y más abajo, con menos protagonismo visual, un botón o link
"Ver todas las mascotas" que llama a onVerTodas().

Tarea 5 — Orquestar todo en app/mascotas/page.tsx

Agregá "use client" si no lo tiene. Agregá un useState:

const [vista, setVista] = useState<"quiz" | "resultado" | "catalogo">("quiz");
const [mascotaRecomendada, setMascotaRecomendada] = useState<{ mascota: MascotaMock; porcentaje: number } | null>(null);

Importá calcularCompatibilidad, MatchQuiz y MatchResult.

Lógica:
- Si vista === "quiz": renderizá <MatchQuiz onFinish={handleFinish} onSkip={() => setVista("catalogo")} /> en vez del catálogo.
- handleFinish(respuestas) calcula, para cada mascota de mascotas (del
  useMascotas() que ya usás), su puntaje con calcularCompatibilidad, toma
  la de mayor puntaje, guarda { mascota, porcentaje: puntaje } en
  mascotaRecomendada, y pone vista en "resultado".
- Si vista === "resultado" && mascotaRecomendada: renderizá
  <MatchResult mascota={mascotaRecomendada.mascota} porcentaje={mascotaRecomendada.porcentaje} onVerTodas={() => setVista("catalogo")} />
- Si vista === "catalogo": renderizá el grid de mascotas que ya existía
  en esta página, sin cambios.

No toques nada de MySQL/Prisma ni del resto de las rutas. Al terminar,
corré npm run build y confirmame que compila. Probá manualmente el flujo
completo: respondé las 5 preguntas, confirmá que aparece una mascota
recomendada con un porcentaje coherente (probá distintas combinaciones de
respuestas y confirmá que cambia la recomendada según lo que contestás),
y confirmá que "Ver todas las mascotas" te lleva al catálogo completo.
Probá también el botón de "Omitir" desde la mitad del cuestionario.
Agregá tu entrada a PROGRESS_LOG.md.
```

## Nota para más adelante (no ahora)
Cuando `/mascotas` se conecte a MySQL real, estos mismos campos
(`aptaDepartamento`, `aptaNinos`, `nivelEnergia`, `conviveOtrasMascotas`)
tendrían que sumarse al modelo `Mascota` del `schema.prisma`, y la
protectora los cargaría al publicar cada animal (hoy están hardcodeados
en el mock). El cálculo de compatibilidad en sí (`calcularCompatibilidad`)
es una función pura y se puede reusar tal cual, sin cambios.
