# Prompt 10 — Perfil de protectora funcional (mock end-to-end)

## Contexto para el agente
Hasta ahora, mockMascotas era un array estático importado directamente en
varios archivos. Vamos a moverlo a un Context (como ya hicimos con la
sesión en AuthContext) para que una protectora pueda "agregar" una mascota
y que aparezca inmediatamente en el catálogo de /mascotas — todo en
localStorage, sin backend real. Mismo criterio para las solicitudes de
adopción: hoy el botón "Adoptar" solo muestra un alert, ahora va a crear
una solicitud real (mock) que la protectora puede ver y aprobar/rechazar.

Es una simulación completa del flujo, pensada para la demo. Cuando
conectemos MySQL, estos dos Context se reemplazan por llamadas a la base.

## Prompt

```
Leé AGENTS.md.

Tarea 1 — Context de mascotas (reemplaza el import estático)

Creá app/context/MascotasContext.tsx con "use client" al principio:

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { mockMascotas, MascotaMock } from "../../data/mock-mascotas";

type MascotasContextType = {
  mascotas: MascotaMock[];
  addMascota: (mascota: Omit<MascotaMock, "id">) => void;
};

const MascotasContext = createContext<MascotasContextType | undefined>(undefined);
const STORAGE_KEY = "happy_paws_mock_mascotas";

export function MascotasProvider({ children }: { children: ReactNode }) {
  const [mascotas, setMascotas] = useState<MascotaMock[]>(mockMascotas);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMascotas(JSON.parse(saved));
    }
  }, []);

  function addMascota(nueva: Omit<MascotaMock, "id">) {
    setMascotas((prev) => {
      const next = [...prev, { ...nueva, id: String(Date.now()) }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <MascotasContext.Provider value={{ mascotas, addMascota }}>
      {children}
    </MascotasContext.Provider>
  );
}

export function useMascotas() {
  const ctx = useContext(MascotasContext);
  if (!ctx) throw new Error("useMascotas debe usarse dentro de MascotasProvider");
  return ctx;
}

// MOCK: vive en localStorage. Se reemplaza por datos reales de MySQL
// (tabla Mascota) cuando conectemos el backend.

(ajustá el import de mockMascotas/MascotaMock a la ruta relativa correcta
según dónde esté ubicado este archivo)

Tarea 2 — Context de solicitudes de adopción

Creá app/context/SolicitudesContext.tsx con "use client" al principio:

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type SolicitudMock = {
  id: string;
  mascotaId: string;
  mascotaNombre: string;
  adoptanteNombre: string;
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA";
  fecha: string;
};

type SolicitudesContextType = {
  solicitudes: SolicitudMock[];
  addSolicitud: (s: Omit<SolicitudMock, "id" | "estado" | "fecha">) => void;
  actualizarEstado: (id: string, estado: "APROBADA" | "RECHAZADA") => void;
};

const SolicitudesContext = createContext<SolicitudesContextType | undefined>(undefined);
const STORAGE_KEY = "happy_paws_mock_solicitudes";

export function SolicitudesProvider({ children }: { children: ReactNode }) {
  const [solicitudes, setSolicitudes] = useState<SolicitudMock[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSolicitudes(JSON.parse(saved));
  }, []);

  function persist(next: SolicitudMock[]) {
    setSolicitudes(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addSolicitud(s: Omit<SolicitudMock, "id" | "estado" | "fecha">) {
    const nueva: SolicitudMock = {
      ...s,
      id: String(Date.now()),
      estado: "PENDIENTE",
      fecha: new Date().toLocaleDateString("es-AR"),
    };
    persist([...solicitudes, nueva]);
  }

  function actualizarEstado(id: string, estado: "APROBADA" | "RECHAZADA") {
    persist(
      solicitudes.map((s) => (s.id === id ? { ...s, estado } : s))
    );
  }

  return (
    <SolicitudesContext.Provider value={{ solicitudes, addSolicitud, actualizarEstado }}>
      {children}
    </SolicitudesContext.Provider>
  );
}

export function useSolicitudes() {
  const ctx = useContext(SolicitudesContext);
  if (!ctx) throw new Error("useSolicitudes debe usarse dentro de SolicitudesProvider");
  return ctx;
}

// MOCK: vive en localStorage. Se reemplaza por la tabla SolicitudAdopcion
// real de MySQL cuando conectemos el backend.

Tarea 3 — Envolver la app con ambos providers

En app/layout.tsx, además de AuthProvider que ya está, importá
MascotasProvider y SolicitudesProvider, y envolvé el contenido en este
orden (de afuera hacia adentro, no importa mucho el orden entre ellos pero
mantené AuthProvider como el más externo):

<AuthProvider>
  <MascotasProvider>
    <SolicitudesProvider>
      {/* contenido existente, incluyendo BottomNav y children */}
    </SolicitudesProvider>
  </MascotasProvider>
</AuthProvider>

Tarea 4 — Actualizar /mascotas para usar el Context

En app/mascotas/page.tsx, agregá "use client" al principio si no lo tiene,
reemplazá el import de mockMascotas por:

import { useMascotas } from "../context/MascotasContext";

Y adentro del componente, en vez de usar mockMascotas directamente, usá:

const { mascotas } = useMascotas();

Y reemplazá todas las referencias a mockMascotas en el .map() por mascotas.
No cambies el diseño visual, solo el origen de los datos.

Tarea 5 — Actualizar /mascotas/[id] para usar el Context

Mismo criterio en app/mascotas/[id]/page.tsx: reemplazá el import estático
por useMascotas() y buscá la mascota dentro de mascotas (del context) en
vez de mockMascotas.

Tarea 6 — El botón de adoptar crea una solicitud real (mock)

En app/mascotas/[id]/page.tsx, importá useSolicitudes desde
"../../context/SolicitudesContext" (ajustá la ruta relativa si hace falta).
En la función handleAdoptar que ya existe (del prompt 9), reemplazá el
alert de "Solicitud de adopción enviada" por una llamada real:

addSolicitud({
  mascotaId: mascota.id,
  mascotaNombre: mascota.nombre,
  adoptanteNombre: nombre, // el nombre del usuario logueado, desde useAuth()
});

Dejá el alert también, como confirmación visual para quien hace la demo:
alert(`Solicitud enviada para adoptar a ${mascota.nombre}`);

Tarea 7 — Perfil de adoptante: ver mis solicitudes reales

En app/perfil/page.tsx, importá useSolicitudes. En la sección de
"Mis solicitudes de adopción" (rol adoptante), reemplazá el texto fijo de
"Todavía no enviaste ninguna solicitud" por una lista real: filtrá
solicitudes donde adoptanteNombre === nombre (el usuario logueado), y si
hay alguna, mostrá cada una como una card chica con el nombre de la
mascota y un badge de estado (mismo estilo de colores que usamos en la
libreta de vacunación: verde para APROBADA, dorado para PENDIENTE, y para
RECHAZADA usá un borde rojo sutil con texto en --text-mid). Si no hay
ninguna, dejá el mensaje original.

Tarea 8 — Perfil de protectora: agregar mascota + gestionar solicitudes

En la sección de rol "protectora" de app/perfil/page.tsx:

8a. Reemplazá la card de "Mis mascotas publicadas" (que hoy es texto fijo)
por: la cantidad real de mascotas (mascotas.length, desde useMascotas) y
un botón/formulario simple para agregar una nueva. Usá un useState local
para mostrar/ocultar un formulario con estos campos: nombre, especie
(select PERRO/GATO), raza, edadAproximada, tamanio (select
PEQUEÑO/MEDIANO/GRANDE), descripcion (textarea). Al enviar, llamá a
addMascota(...) con esos valores y cerrá el formulario.

8b. Reemplazá la card de "Solicitudes recibidas" (hoy texto fijo) por una
lista real usando solicitudes (de useSolicitudes). Si no hay ninguna, dejá
el mensaje original. Si hay, mostrá cada una con: nombre de la mascota,
nombre del adoptante, fecha, y estado. Si el estado es PENDIENTE, mostrá
dos botones chicos "Aprobar" y "Rechazar" que llamen a
actualizarEstado(solicitud.id, "APROBADA") o "RECHAZADA" respectivamente.
Si ya no está pendiente, no muestres los botones, solo el badge de estado.

No toques nada de MySQL/Prisma en este prompt. Al terminar, corré
npm run build y confirmame que compila. Probá manualmente el flujo
completo: logueate como protectora, agregá una mascota nueva, deslogueate,
logueate como adoptante, confirmá que la mascota nueva aparece en
/mascotas, adoptala, deslogueate, volvé a loguearte como protectora y
confirmá que ves la solicitud y podés aprobarla. Agregá tu entrada a
PROGRESS_LOG.md con el detalle de qué probaste.
```

## Nota para más adelante (no ahora)
Todo lo de este prompt vive en `localStorage` del navegador — si abrís la
demo en otra computadora o borrás datos de navegación, se pierde. Para la
presentación no es un problema, pero es importante que lo sepas para no
sorprenderte. Se reemplaza por datos reales en MySQL cuando conectemos el
backend (`Mascota` y `SolicitudAdopcion` del `schema.prisma`).
