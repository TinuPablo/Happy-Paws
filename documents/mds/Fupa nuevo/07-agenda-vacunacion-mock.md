# Prompt 7 — Agenda de vacunación (mock, readaptada al modelo de adopción)

## Contexto para el agente
Este proyecto tenía antes una agenda de vacunación pensada para un dueño con
una sola mascota propia (con calendario navegable y notificaciones nativas
vía Capacitor). Esa versión vieja está guardada de referencia en
`documents/mds/Fupa nuevo/backup-page-vacunacion-agenda.tsx.txt`, pero
**NO la copies tal cual** — hay que adaptarla:

- Ya NO es "mi mascota", es la mascota de una protectora (o un adoptante,
  eventualmente). El historial de vacunación pertenece a la mascota, no a
  un usuario.
- Por ahora es 100% mock — sin calendario navegable, sin generación
  automática desde protocolos WSAVA, sin notificaciones de Capacitor. Todo
  eso es una versión simplificada para mostrar la idea en la presentación.
- Se integra DENTRO de `app/mascotas/[id]/page.tsx` (el detalle de mascota
  que ya arreglamos en el prompt anterior), no en una ruta separada.

## Prompt

```
Leé AGENTS.md.

Tarea 1 — Extender el tipo y los datos mock:

En data/mock-mascotas.ts, agregá al tipo MascotaMock un campo opcional:

vacunas?: {
  nombre: string;
  fecha: string; // formato "DD/MM/AAAA"
  estado: "APLICADA" | "PENDIENTE";
}[];

Agregá datos de ejemplo de vacunas a 2 o 3 de las mascotas del array
mockMascotas (no hace falta a todas), con nombres reales de vacunas caninas
o felinas según la especie (ej: "Polivalente (moquillo, parvovirus,
hepatitis)", "Antirrábica", "Triple felina"), un par ya aplicadas con fecha
pasada y un par pendientes con fecha futura.

Tarea 2 — Mostrar la agenda en el detalle de mascota:

En app/mascotas/[id]/page.tsx, agregá una sección DESPUÉS de la ficha de la
mascota (la que ya armamos en el prompt anterior), solo si la mascota tiene
el campo vacunas definido:

<section className="mt-8">
  <h2 className="text-lg font-medium text-[var(--text-dark)]">
    Libreta de vacunación
  </h2>
  <div className="mt-4 space-y-3">
    {mascota.vacunas?.map((vacuna, i) => (
      <div
        key={i}
        className="flex items-center justify-between rounded-2xl border border-[var(--brown-light)] bg-white p-4"
      >
        <div>
          <p className="font-medium text-[var(--text-dark)]">{vacuna.nombre}</p>
          <p className="text-sm text-[var(--text-light)]">{vacuna.fecha}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            vacuna.estado === "APLICADA"
              ? "bg-[var(--green-ok)] text-white"
              : "bg-[var(--gold)] text-[var(--brown-darker)]"
          }`}
        >
          {vacuna.estado === "APLICADA" ? "Aplicada" : "Pendiente"}
        </span>
      </div>
    ))}
  </div>
</section>

Si la mascota NO tiene el campo vacunas definido, no muestres esta sección
(ni un mensaje vacío, directamente no renderices nada).

No implementes calendario, no implementes generación automática desde
protocolos, no toques nada de Capacitor. Es solo esta lista simple.

Al terminar, corré npm run build y confirmame que compila. Navegá a algún
/mascotas/[id] que sí tenga vacunas cargadas y confirmame visualmente que
se ve bien. Agregá tu entrada a PROGRESS_LOG.md.
```

## Nota para más adelante (no ahora)
Cuando pasemos a la fase de MySQL, esto se reemplaza por el modelo
`Vacunacion` del `schema.prisma` que ya está diseñado (FK a `Mascota`,
no a un usuario) — y ahí sí tiene sentido reconectar la lógica de
protocolos WSAVA (`vaccine-protocols.json`) para generación automática.
Por ahora, mock alcanza para la demo.
