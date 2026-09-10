# Happy Paws — Workflow de Git (trabajo en equipo)

> A partir de ahora trabajamos de a dos (Tinu + Daniel). Este archivo define
> el flujo obligatorio para CUALQUIER funcionalidad nueva. Leélo siempre
> antes de empezar a tocar código, junto con AGENTS.md.

## Regla de oro
**Nunca se trabaja ni se commitea directo sobre `main`.** Toda funcionalidad
nueva vive en su propia rama, y llega a `main` únicamente a través de un
Pull Request revisado y mergeado a mano — nunca con un merge automático ni
un push directo a `main`.

## Flujo paso a paso, para cada funcionalidad nueva

### 1. Antes de empezar: actualizar `main` local
```
git checkout main
git pull origin main
```
Esto trae cualquier cambio que Daniel (u otra persona) ya haya mergeado,
para no partir desde una versión vieja del proyecto.

### 2. Crear una rama nueva para la funcionalidad
```
git checkout -b tipo/nombre-corto-de-la-funcionalidad
```
Convención de nombres:
- `feature/nombre` — funcionalidad nueva (ej: `feature/auth-real`)
- `fix/nombre` — corrección de un bug (ej: `fix/link-registro`)
- `chore/nombre` — tareas de mantenimiento/config (ej: `chore/actualizar-schema`)

Una rama = una funcionalidad. No mezclar dos cosas distintas en la misma
rama, aunque parezcan chicas.

### 3. Trabajar y commitear normalmente
Commits chicos y descriptivos, en español, describiendo qué se hizo:
```
git add .
git commit -m "Agrega formulario de login con validación básica"
```
No hace falta un solo commit gigante al final — varios commits chicos
durante el desarrollo de la funcionalidad están bien.

### 4. Antes de subir: traer main de nuevo (por si cambió mientras trabajabas)
```
git checkout main
git pull origin main
git checkout tipo/nombre-corto-de-la-funcionalidad
git merge main
```
Si hay conflictos en este paso, se resuelven ACÁ, en tu rama, tranquilo —
nunca se dejan para resolver directo en `main`. Si el agente encuentra un
conflicto en este paso, debe mostrarte los archivos afectados y las dos
versiones en conflicto, y esperar que decidas cuál corresponde — no
resolverlo por su cuenta sin que lo veas.

### 5. Subir la rama a GitHub
```
git push -u origin tipo/nombre-corto-de-la-funcionalidad
```

### 6. Abrir el Pull Request
Desde GitHub (web) o con GitHub CLI si está instalado:
```
gh pr create --base main --head tipo/nombre-corto-de-la-funcionalidad --title "Título descriptivo" --body "Qué hace esta funcionalidad, qué se probó"
```
Si `gh` no está instalado, hacerlo manualmente desde la web de GitHub:
"Compare & pull request" en la rama recién subida.

### 7. Revisión y merge manual
- El otro (Tinu o Daniel, el que no escribió el código) revisa el PR antes
  de aprobar.
- El merge a `main` se hace a mano desde GitHub, después de revisar —
  nunca automático, nunca sin que la otra persona lo haya visto.
- Después de mergear, borrar la rama (tanto local como en GitHub) para no
  acumular ramas viejas.

### 8. Después del merge: volver a sincronizar
```
git checkout main
git pull origin main
```

## Reglas para el agente de IA (Claude Code / OpenCode)

- **Nunca hagas `git push` directo a `main`.**
- **Nunca hagas merge de un PR por tu cuenta** — eso lo decide una persona.
- Al empezar cualquier tarea nueva, tu primer paso SIEMPRE es: confirmar en
  qué rama estás (`git branch --show-current`). Si estás en `main`, avisá y
  creá la rama correspondiente antes de tocar cualquier archivo.
- Si te piden seguir una funcionalidad que ya tiene una rama abierta,
  cambiate a esa rama (`git checkout nombre-de-la-rama`) en vez de crear una
  nueva.
- Si al hacer `git merge main` (paso 4) aparece un conflicto, PARÁ, mostrá
  los archivos en conflicto y las dos versiones, y esperá instrucciones —
  no elijas una versión por tu cuenta.
- Actualizá `PROGRESS_LOG.md` indicando en qué rama se hizo cada avance,
  además de lo que ya venís registrando.

## Nota
Este archivo complementa a `AGENTS.md` (contexto del proyecto) y a
`PROGRESS_LOG.md` (historial de avance) — los tres se leen juntos antes de
empezar cualquier tarea.
