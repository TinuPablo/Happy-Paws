# Prompt 3 (atomizado) — Landing y diseño visual

> Pasale un sub-paso por vez. Revisá visualmente en el navegador después de
> cada uno antes de seguir.

---

## Sub-paso 1 — Datos mock de mascotas

```
Leé AGENTS.md.

Creá el archivo data/mock-mascotas.ts con este contenido exacto (son datos
temporales, se reemplazan cuando conectemos MySQL más adelante):

export type MascotaMock = {
  id: string;
  nombre: string;
  especie: "PERRO" | "GATO";
  raza: string;
  edadAproximada: string;
  tamanio: "PEQUEÑO" | "MEDIANO" | "GRANDE";
  descripcion: string;
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
  },
  {
    id: "2",
    nombre: "Michi",
    especie: "GATO",
    raza: "Mestizo",
    edadAproximada: "1 año",
    tamanio: "PEQUEÑO",
    descripcion: "Tranquila y curiosa, ideal para departamento.",
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

No agregues nada más todavía.
```

---

## Sub-paso 2 — Datos mock de protectoras

```
Leé AGENTS.md.

Creá el archivo data/mock-protectoras.ts con este contenido exacto:

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

No agregues nada más todavía.
```

---

## Sub-paso 3 — Hero de la landing

```
Leé AGENTS.md.

En app/page.tsx, reemplazá el contenido del placeholder por este hero
(mantené el default export function HomePage, solo cambiá el JSX interno):

<main className="min-h-screen bg-[var(--brown-lightest)]">
  <section className="bg-[var(--brown-dark)] px-6 py-16 text-center text-[var(--brown-lightest)]">
    <h1 className="text-3xl font-medium sm:text-4xl">
      Encontrá a tu nuevo mejor amigo
    </h1>
    <p className="mx-auto mt-4 max-w-xl text-[var(--brown-light)]">
      Happy Paws conecta protectoras de animales de la zona con familias que
      quieren adoptar de forma responsable.
    </p>
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      <a
        href="/mascotas"
        className="rounded-2xl bg-[var(--gold)] px-6 py-3 font-medium text-[var(--brown-darker)]"
      >
        Quiero adoptar
      </a>
      <a
        href="/registro"
        className="rounded-2xl border border-[var(--brown-light)] px-6 py-3 font-medium text-[var(--brown-lightest)]"
      >
        Soy una protectora
      </a>
    </div>
  </section>
</main>

No agregues las otras secciones todavía (mascotas destacadas, cómo funciona,
protectoras) — eso es en los próximos sub-pasos.
```

---

## Sub-paso 4 — Sección de mascotas destacadas en la landing

```
Leé AGENTS.md.

En app/page.tsx, agregá esta sección DESPUÉS del hero (dentro del mismo
<main>, como hermana de la <section> del hero). Primero importá arriba del
archivo:

import { mockMascotas } from "@/data/mock-mascotas";

(si el proyecto no usa el alias "@/", ajustá el import a una ruta relativa
como "../data/mock-mascotas")

Y agregá esta sección:

<section className="px-6 py-14">
  <h2 className="text-2xl font-medium text-[var(--text-dark)]">
    Mascotas que te esperan
  </h2>
  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {mockMascotas.map((mascota) => (
      <div
        key={mascota.id}
        className="rounded-2xl border border-[var(--brown-light)] bg-white p-4"
      >
        <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-[var(--brown-light)] text-4xl">
          {mascota.especie === "PERRO" ? "🐶" : "🐱"}
        </div>
        <h3 className="font-medium text-[var(--text-dark)]">{mascota.nombre}</h3>
        <p className="text-sm text-[var(--text-light)]">
          {mascota.raza} · {mascota.edadAproximada}
        </p>
        <a
          href={`/mascotas/${mascota.id}`}
          className="mt-3 block rounded-xl bg-[var(--brown-dark)] px-4 py-2 text-center text-sm font-medium text-[var(--brown-lightest)]"
        >
          Ver más
        </a>
      </div>
    ))}
  </div>
</section>

No agregues las otras secciones todavía.
```

---

## Sub-paso 5 — Sección "cómo funciona"

```
Leé AGENTS.md.

En app/page.tsx, agregá esta sección DESPUÉS de la de mascotas destacadas:

<section className="bg-[var(--cream)] px-6 py-14">
  <h2 className="text-center text-2xl font-medium text-[var(--text-dark)]">
    ¿Cómo funciona?
  </h2>
  <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
    <div className="text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brown-main)] text-lg font-medium text-white">
        1
      </div>
      <p className="text-sm text-[var(--text-mid)]">
        Explorá mascotas disponibles en protectoras de tu zona.
      </p>
    </div>
    <div className="text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brown-main)] text-lg font-medium text-white">
        2
      </div>
      <p className="text-sm text-[var(--text-mid)]">
        Enviá tu solicitud de adopción con tus datos y disponibilidad.
      </p>
    </div>
    <div className="text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brown-main)] text-lg font-medium text-white">
        3
      </div>
      <p className="text-sm text-[var(--text-mid)]">
        La protectora revisa tu solicitud y coordina el encuentro.
      </p>
    </div>
  </div>
</section>

No agregues la sección de protectoras todavía.
```

---

## Sub-paso 6 — Sección de protectoras en la landing

```
Leé AGENTS.md.

En app/page.tsx, agregá esta sección al final del <main>. Primero importá
arriba del archivo:

import { mockProtectoras } from "@/data/mock-protectoras";

(ajustá a ruta relativa si el proyecto no usa el alias "@/")

Y agregá:

<section className="px-6 py-14">
  <h2 className="text-2xl font-medium text-[var(--text-dark)]">
    Protectoras participantes
  </h2>
  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
    {mockProtectoras.map((protectora) => (
      <div
        key={protectora.id}
        className="rounded-2xl border border-[var(--brown-light)] bg-white p-5"
      >
        <h3 className="font-medium text-[var(--text-dark)]">{protectora.nombre}</h3>
        <p className="text-sm text-[var(--text-light)]">{protectora.ubicacion}</p>
        <p className="mt-2 text-sm text-[var(--text-mid)]">{protectora.descripcion}</p>
        <p className="mt-3 text-sm font-medium text-[var(--brown-main)]">
          {protectora.cantidadMascotas} mascotas en adopción
        </p>
      </div>
    ))}
  </div>
</section>

Al terminar, corré npm run build y confirmame que compila sin errores.
```

---

## Sub-paso 7 — Diseño de app/mascotas/page.tsx

```
Leé AGENTS.md.

Reemplazá el contenido de app/mascotas/page.tsx (mantené el default export)
por este, que reutiliza la misma card que ya armamos en la landing:

import { mockMascotas } from "@/data/mock-mascotas";

export default function MascotasPage() {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Mascotas en adopción
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockMascotas.map((mascota) => (
          <div
            key={mascota.id}
            className="rounded-2xl border border-[var(--brown-light)] bg-white p-4"
          >
            <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-[var(--brown-light)] text-4xl">
              {mascota.especie === "PERRO" ? "🐶" : "🐱"}
            </div>
            <h3 className="font-medium text-[var(--text-dark)]">{mascota.nombre}</h3>
            <p className="text-sm text-[var(--text-light)]">
              {mascota.raza} · {mascota.edadAproximada} · {mascota.tamanio}
            </p>
            <p className="mt-2 text-sm text-[var(--text-mid)]">{mascota.descripcion}</p>
            <a
              href={`/mascotas/${mascota.id}`}
              className="mt-3 block rounded-xl bg-[var(--brown-dark)] px-4 py-2 text-center text-sm font-medium text-[var(--brown-lightest)]"
            >
              Ver más
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}

(ajustá el import a ruta relativa si el proyecto no usa el alias "@/")
```

---

## Sub-paso 8 — Diseño de app/protectoras/page.tsx

```
Leé AGENTS.md.

Reemplazá el contenido de app/protectoras/page.tsx (mantené el default
export) por este:

import { mockProtectoras } from "@/data/mock-protectoras";

export default function ProtectorasPage() {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Protectoras
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mockProtectoras.map((protectora) => (
          <div
            key={protectora.id}
            className="rounded-2xl border border-[var(--brown-light)] bg-white p-5"
          >
            <h3 className="font-medium text-[var(--text-dark)]">{protectora.nombre}</h3>
            <p className="text-sm text-[var(--text-light)]">{protectora.ubicacion}</p>
            <p className="mt-2 text-sm text-[var(--text-mid)]">{protectora.descripcion}</p>
            <p className="mt-3 text-sm font-medium text-[var(--brown-main)]">
              {protectora.cantidadMascotas} mascotas en adopción
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

(ajustá el import a ruta relativa si el proyecto no usa el alias "@/")
```

---

## Sub-paso 9 — Verificación final

```
Leé AGENTS.md.

Corré npm run build. Decime si compila sin errores y confirmame que /,
/mascotas y /protectoras muestran las cards con los datos mock. Reportá
solamente, no arregles nada todavía salvo que te lo pida en el próximo
mensaje.
```

---

## Al terminar
Actualizá en `AGENTS.md`:
```
- [x] Landing con diseño real (protectoras/adopción)
- [x] Listado de mascotas con diseño real
- [x] Listado de protectoras con diseño real
```
