# Prompt 12 — Rediseño completo: de app-shell mobile a página web

## Contexto para el agente
Hasta ahora el diseño simulaba una app de celular: `app/layout.tsx` envuelve
todo en una tarjeta angosta tipo teléfono (centrada en desktop, pantalla
completa en mobile), con `app/components/BottomNav.tsx` como navegación
inferior de 5 pestañas. Esto se descarta por completo. Ahora es una página
web estándar: navegación superior, contenido que aprovecha el ancho de
pantalla en desktop, responsive de verdad (no un mockup de celular).

## Prompt

```
Leé AGENTS.md.

Vamos a rediseñar la estructura general de página, de app-shell mobile a
web estándar. Es un cambio grande — hacelo en el orden de tareas que sigue,
verificando visualmente después de cada una.

Tarea 1 — Sacar el app-shell de app/layout.tsx

Quitá el div que envuelve todo simulando una tarjeta de teléfono (bordes
redondeados, ancho fijo tipo 420px, centrado). El <body> debe contener
directamente: el Navbar nuevo (tarea 2), {children}, y opcionalmente un
footer simple. Sin contenedor de ancho fijo alrededor de todo.

Tarea 2 — Crear Navbar (reemplaza a BottomNav)

Creá app/components/Navbar.tsx con "use client" al principio:

"use client";

import Link from "next/link";
import { useState } from "next/navigation" === undefined ? [] : [];
import { usePathname } from "next/navigation";
import { useState as useReactState } from "react";

(Nota para el agente: usá imports reales de React para useState, no el
placeholder de arriba — importá "use client"; import { useState } from
"react"; import Link from "next/link"; import { usePathname } from
"next/navigation"; de forma normal, prolija.)

El Navbar debe tener:
- Logo/nombre "Happy Paws" a la izquierda, linkeando a "/".
- En desktop (md: en adelante): links horizontales a Inicio, Mascotas,
  Protectoras, Guías, Perfil — usando el mismo criterio de resaltar la
  ruta activa que tenía BottomNav (comparando con usePathname()).
- En mobile (debajo de md:): un botón de menú hamburguesa que al tocarlo
  despliega los mismos links en una lista vertical debajo del navbar
  (useState para mostrar/ocultar).
- Fondo `--brown-dark`, texto claro, mismo criterio de paleta que ya
  usamos en todo el proyecto.
- Se muestra en TODAS las rutas, incluyendo /login y /registro (a
  diferencia de BottomNav que se ocultaba ahí — en web es normal que el
  navbar esté siempre visible).

Después de crear Navbar.tsx, borrá app/components/BottomNav.tsx y sacá su
import/uso de donde estuviera (probablemente en app/layout.tsx). Reemplazá
por <Navbar /> antes de {children} en layout.tsx.

Tarea 3 — Landing: reintroducir breakpoints responsive reales

En app/page.tsx, en cada sección con grid (mascotas destacadas,
protectoras participantes), volvé a agregar breakpoints de Tailwind que se
habían sacado porque respondían al ancho de la tarjeta angosta y no al de
la pantalla real. Ahora que no hay más tarjeta, correspondén al ancho real
del navegador:

- Grid de mascotas destacadas: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
- Grid de protectoras: grid-cols-1 sm:grid-cols-2
- Sección "cómo funciona": ya tenía sm:grid-cols-3, confirmá que sigue así

Además, envolvé el contenido de cada sección en un contenedor centrado con
ancho máximo, para que en pantallas grandes el texto no se estire de punta
a punta: agregá `mx-auto max-w-6xl` a los contenedores principales de cada
sección (heredando el padding horizontal que ya tengan).

Tarea 4 — /mascotas y /protectoras: mismo criterio de grid responsive

En app/mascotas/page.tsx: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4, más
`mx-auto max-w-6xl` en el contenedor. Mismo en app/protectoras/page.tsx
con grid-cols-1 sm:grid-cols-2 (son cards más anchas, 2 columnas alcanza).

Tarea 5 — /mascotas/[id] y /protectoras/[id]: layout de detalle más ancho

Estas páginas hoy están pensadas para una tarjeta angosta (todo en una
columna). En desktop, reorganizá el detalle de mascota en dos columnas
usando `grid grid-cols-1 lg:grid-cols-2 gap-8`: a la izquierda la
imagen/media (si tiene), a la derecha la ficha de texto y el botón de
adoptar. En mobile sigue siendo una sola columna (se apila normal).
Agregá `mx-auto max-w-4xl` al contenedor general. Mismo criterio de
"detalle más ancho en desktop" para protectoras/[id], aunque ahí una sola
columna más ancha alcanza (no hace falta el grid de dos columnas).

Tarea 6 — /login y /registro: quitar cualquier resabio de ancho de celular

Confirmá que estas páginas ya centran su formulario con `max-w-sm` (como
las armamos originalmente) — eso está bien para web también, no hace falta
cambiarlo, un formulario de login angosto y centrado es un patrón normal
en cualquier página web. Solo confirmá que no quedó ningún contenedor
extra heredado del app-shell viejo.

Tarea 7 — /perfil: ancho de contenido apropiado para web

Agregá `mx-auto max-w-3xl` al contenedor principal de app/perfil/page.tsx,
tanto en el estado logueado como no logueado, para que no se estire de
punta a punta de la pantalla en desktop.

No toques nada de MySQL/Prisma en este prompt, ni la lógica de
autenticación/mascotas/solicitudes — es puramente de layout y responsive.

Al terminar, corré npm run build y confirmame que compila. Probá
visualmente en al menos dos anchos: mobile (achicá la ventana del
navegador o usá las devtools en modo responsive) y desktop ancho (ventana
completa). Confirmame que el navbar cambia de horizontal a hamburguesa
correctamente, y que los grids muestran más columnas en desktop que en
mobile. Agregá tu entrada a PROGRESS_LOG.md.
```

## Después de este prompt
Puede que algunos detalles visuales queden por afinar (espaciados,
tamaños de fuente en pantallas muy grandes) — es normal en un cambio de
esta magnitud. Revisalo vos primero antes de darlo por cerrado, y si algo
se ve raro en algún ancho puntual, lo ajustamos con un prompt chico
apuntado a esa sección específica en vez de repetir todo el prompt 12.
