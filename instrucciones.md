# Instrucciones para levantar el proyecto (Happy Paws)

Guía rápida para que puedas clonar/pullear el repo y correr la app en tu máquina.

## 1. Requisitos previos

- **Node.js 20.9 o superior** (se desarrolló con Node 24.x — si tenés una versión vieja instalada, actualizá antes de seguir).
- **npm** (viene con Node). El proyecto usa `package-lock.json`, así que usá `npm`, no `yarn` ni `pnpm`, para evitar conflictos de dependencias.
- Un editor de código (VS Code recomendado, pero no es obligatorio).

Para chequear tu versión de Node:

```bash
node -v
```

## 2. Clonar y traer los cambios

Si todavía no tenés el repo clonado:

```bash
git clone <URL-del-repo>
cd happy-paws
```

Si ya lo tenías clonado, simplemente traé lo último:

```bash
git pull origin main
```

## 3. Instalar dependencias

Parado en la carpeta del proyecto:

```bash
npm install
```

## 4. Variables de entorno

**No hace falta configurar nada todavía.** El proyecto está en una fase 100% visual/mock: no hay base de datos ni backend real conectado (ver `AGENTS.md`), así que no existe ningún archivo `.env` que necesites pedir ni completar por ahora.

## 5. Correr el proyecto en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador. La app se actualiza sola al guardar cambios.

Otros comandos disponibles:

```bash
npm run build   # build de producción (sirve para chequear que no rompiste nada)
npm run start   # levanta el build de producción ya generado
npm run lint    # corre el linter
```

## 6. Antes de tocar código, leé esto (en este orden)

1. **`AGENTS.md`** (raíz del proyecto): contexto fijo del proyecto — qué es Happy Paws, en qué fase estamos, qué está prohibido hacer todavía (auth real, conectar MySQL, reintroducir mascota virtual), la paleta de colores exacta y las convenciones de código.
2. **`PROGRESS_LOG.md`** (raíz del proyecto): historial de qué se hizo, en qué orden, y qué quedó pendiente. Si arrancás una sesión de trabajo y no sabés en qué quedó el proyecto, es la primera cosa que hay que leer.
3. **`documents/mds/Fupa nuevo/`**: ahí están los prompts/instrucciones que se le fueron dando al agente de IA para construir cada parte (útil como referencia de "por qué" está hecho así cada pantalla).

## 7. Cómo está armado hoy (para orientarte rápido)

- Es una app **mobile-first**: todo el contenido vive dentro de una "tarjeta" tipo teléfono (ver `app/layout.tsx`). En desktop se ve como un mockup de celular centrado; en un celular real ocupa toda la pantalla.
- Navegación inferior (`app/components/BottomNav.tsx`): Inicio, Mascotas, Protectoras, Guías, Perfil.
- **No hay backend ni base de datos todavía.** Todo el estado "dinámico" (sesión de usuario, mascotas agregadas, solicitudes de adopción) es una simulación que vive en el `localStorage` de tu propio navegador, usando React Context:
  - `app/context/AuthContext.tsx` — sesión mock (login/logout, rol adoptante/protectora).
  - `app/context/MascotasContext.tsx` — catálogo de mascotas (arranca con datos de `data/mock-mascotas.ts`, y podés agregar más desde `/perfil` como protectora).
  - `app/context/SolicitudesContext.tsx` — solicitudes de adopción mock.
- **Importante:** como todo esto vive en el `localStorage` de cada navegador, **vos y yo no vamos a ver los mismos datos** aunque corramos el mismo código — cada uno tiene su propia sesión/mascotas/solicitudes de prueba en su propia máquina. Eso es esperado, no es un bug. Si en algún momento la app se ve "rara" por datos viejos de otra prueba, podés limpiar el estado abriendo las DevTools del navegador → pestaña Application/Almacenamiento → Local Storage → borrar las claves que empiezan con `happy_paws_`.
- Login/registro son **visuales/mock**: no validan contra ningún backend real todavía.

## 8. Convenciones a respetar al escribir código

- Textos de interfaz (lo que ve el usuario): **en español**.
- Nombres de variables, funciones y props: **en inglés**.
- Componentes en PascalCase, un componente por archivo.
- Paleta de colores: usar siempre los valores exactos definidos en `AGENTS.md` (ya están cargados como variables CSS en `app/globals.css`).
- No implementar autenticación real, no conectar MySQL, no reintroducir mecánicas de mascota virtual — mientras `AGENTS.md` no diga lo contrario, esas tres cosas están fuera de alcance de esta fase.

## 9. Sobre las notas de entorno Windows/PowerShell de AGENTS.md

Esas indicaciones (no usar `grep`/`find`/`&&`, etc.) son específicas para cuando se trabaja con un agente de IA en Windows. Si vos estás en Mac/Linux o preferís tu propia terminal, no te aplican — usá los comandos normales de tu sistema. Lo que sí aplica siempre, sin importar el sistema operativo, son las reglas de alcance del proyecto (fase actual, qué no tocar todavía) descritas en las secciones de arriba.

## 10. Dudas

Si algo de esto no cuadra con lo que ves en el repo, avisame — este archivo lo generó un asistente de IA en base al estado del proyecto en el momento de escribirlo, puede haber quedado desactualizado si seguimos avanzando.
