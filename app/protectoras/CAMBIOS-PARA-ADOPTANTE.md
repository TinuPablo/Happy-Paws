# Cambios que afectan al lado adoptante o archivos compartidos

Cada vez que yo (Daniel) modifique algo que impacte:
- archivos compartidos (prisma/schema.prisma, app/actions/solicitudes.ts, 
  app/layout.tsx, app/globals.css, app/components/**, lib/session.ts), o
- algo que el lado adoptante debería saber (ej: cambio de estructura de datos, 
  nuevo campo, endpoint nuevo, migración)

Agregá una entrada acá con fecha, qué cambió, y qué necesita hacer Pablo 
(ej: "pull + npx prisma migrate dev").

---

## 2026-09-18 — Nuevo campo `Mascota.activo` (soft-delete de mascotas)

**Qué cambió:** agregué `activo Boolean @default(true)` al modelo `Mascota` en `prisma/schema.prisma` (migración `20260918111217_mascota_activo_soft_delete`, rama `feature/perfil-protectora`, **todavía no pusheada a origin** — avisame cuando la suba). Ahora las protectoras pueden "dar de baja" una mascota desde `/perfil`, lo que pone `activo: false` (nunca se borra la fila — quedan intactas las vacunaciones y solicitudes ya vinculadas).

**Qué necesitás hacer vos (Pablo):**
1. `git pull` (cuando avise que la rama está pusheada) + `npx prisma migrate dev` en tu base local.
2. **Sumar `activo: true` a los `where` de mascota en tus 4 queries**, porque hoy ninguna lo filtra y una mascota dada de baja seguiría apareciendo:
   - `app/page.tsx` (landing, destacadas — 2 queries con `ESTADOS_DISPONIBLE`)
   - `app/mascotas/page.tsx` (catálogo — el `where` que arma `especie`/`tamanio`)
   - `app/mascotas/[id]/page.tsx` (ficha — acá recomiendo que si `activo === false` la página devuelva "no encontrada", a diferencia de `ADOPTADO` que sí se deja ver como registro histórico)
   - `app/actions/solicitudes.ts` → `crearSolicitudAction` (las 2 queries de mascota: la que busca la mascota puntual y la que arma "disponibles" para el % de recomendación del quiz)

No toqué ninguno de esos 4 archivos (son tuyos) — solo te dejo la lista para que decidas cómo integrarlo.

---

## [PENDIENTE - Pablo] Notificaciones al crear solicitud
Fecha: 2026-09-18

Necesito que en `crearSolicitudAction` (`app/actions/solicitudes.ts`) agregues, al final (justo después del `prisma.solicitudAdopcion.create(...)`, antes del `return`), una llamada a la función de notificación que te dejo lista en `lib/notificaciones.ts`:

```ts
await notificarNuevaSolicitud(solicitud.id)
```

(vas a necesitar guardar el resultado de `prisma.solicitudAdopcion.create(...)` en una variable, ej. `const solicitud = await prisma.solicitudAdopcion.create({...})`, para tener `solicitud.id` a mano — hoy ese `create` no guarda el resultado en ninguna variable).

Esta función se encarga de crear la notificación interna (visible en `/perfil` de la protectora) y de disparar el email de aviso (por ahora solo loguea en consola — el proveedor de email todavía no está decidido, ver backlog de `AGENTS.md`; cuando se elija uno, el cambio queda encapsulado ahí adentro, no vas a tener que tocar nada de tu lado). Solo hace falta que la llames después de crear la solicitud exitosamente, no necesitás tocar nada más de tu lógica.

Import: `import { notificarNuevaSolicitud } from "@/lib/notificaciones";`

No hace falta ninguna migración de tu lado para esto — el modelo `Notificacion` ya está en el schema que vas a traer con el próximo pull + `npx prisma migrate dev`.

---

## [INFO - Pablo] Cambios visuales en el header (Navbar) y layout.tsx
Fecha: 2026-09-18

Toqué `app/components/Navbar.tsx`, `app/layout.tsx` y `app/globals.css` (los 3 son compartidos) para 3 mejoras visuales del lado protectora:

1. **Huellitas animadas junto al logo "Happy Paws"** (`app/components/HeaderPawSteps.tsx`, nuevo): 4 huellas que aparecen en secuencia cada 20s, decorativo, no cambia nada de la navegación ni del layout existente.
2. **Campana de notificaciones en el header** (`app/components/NotificationBell.tsx`, nuevo): solo se muestra si la sesión es de protectora Y tiene notificaciones sin leer — para cuentas adoptante nunca aparece nada nuevo en el header, no debería notarse ningún cambio visual de tu lado.
3. `app/layout.tsx` ahora hace **una query extra** (`prisma.notificacion.count(...)`) para calcular ese badge, pero **solo si `session.rol !== "ADOPTANTE"`** — para sesiones de adoptante (o sin sesión) esa rama ni se ejecuta, así que no debería afectar el tiempo de carga de tus páginas.

`Navbar` ahora acepta un prop nuevo `notificacionesNoLeidas?: number` (opcional, default `0`) — no rompe nada si en algún momento vos también necesitás renderizar `<Navbar />` sin pasarlo.

No debería requerir ninguna acción de tu parte, es solo aviso por si notás el Navbar distinto al hacer pull.

---

## [INFO - Pablo] Más @keyframes nuevos en globals.css + otro fetch en app/perfil/page.tsx
Fecha: 2026-09-18

Dos cambios chicos más, mismo criterio que el aviso anterior (aditivos, no tocan nada existente):

1. `app/globals.css`: 3 `@keyframes` nuevos (`paw-bump-dog`, `paw-bump-cat`, `paw-bump-flash`) para una animación de perro/gato en `/perfil`. No se modificó ni se borró ninguna clase/keyframe que ya existía.
2. `app/perfil/page.tsx` (el shell de `/perfil`, no estaba en tu lista pero avisamos igual por las dudas): ahora hace un `prisma.protectora.findFirst(...)` extra para mostrar el logo real en el avatar grande, **gateado a `session.rol !== "ADOPTANTE"`** — para tu vista de adoptante ese branch ni se ejecuta, sigue exactamente igual que antes ("Hola, X" / "Cuenta de adoptante").

Sin acción necesaria de tu parte.

---

## [INFO - Pablo] Nav item "Guías" -> "Adopciones" para cuentas de protectora
Fecha: 2026-09-21

Reorganizamos el lado protectora: `/perfil` quedó solo para edición de cuenta (foto, mail, "acerca de"), y todo lo operativo (mascotas, solicitudes, vacunación, notificaciones, equipo) se movió a una página nueva, `/adopciones` (mío, `app/adopciones/page.tsx`).

**Lo que toqué de lo tuyo/compartido:**
1. `app/components/Navbar.tsx`: el ítem "Guías" (`/guias`) ahora se reemplaza por "Adopciones" (`/adopciones`) **solo cuando la sesión es de protectora** (nuevo prop `esProtectora`, default `false`). Para cuentas adoptante o sin sesión, el nav sigue exactamente igual — "Guías" sigue apuntando a `/guias`, confirmado con `curl` sin cambios.
2. `app/layout.tsx`: agregué el booleano `esProtectora` (mismo cálculo que ya usaba para la campana de notificaciones) y se lo paso a `Navbar` como prop nuevo.

No toqué `app/guias/page.tsx` ni nada de su contenido — sigue existiendo tal cual, solo dejó de estar en el nav para protectoras.

Sin acción necesaria de tu parte.
