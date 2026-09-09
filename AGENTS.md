# Happy Paws — Contexto fijo del proyecto

> Este archivo es de lectura obligatoria antes de cualquier tarea. Contiene lo
> que NUNCA cambia entre prompts. Si algo acá contradice lo que dice un prompt
> puntual, este archivo tiene prioridad salvo que el prompt diga explícitamente
> lo contrario.

## Qué es Happy Paws
Plataforma web que conecta protectoras de animales con familias adoptantes.
Piloto: **FUPA** (Villa Carlos Paz). Antes era una app de cuidado de mascota
virtual — esa funcionalidad **ya no existe** y no debe reintroducirse.

## Stack técnico
- Next.js (App Router) + TypeScript
- Tailwind CSS 4
- Datos actuales: JSON en `data/` (razas, guías, protocolos de vacunación)
- MySQL + Prisma: **planificado, todavía NO implementado**. No conectar
  todavía salvo que un prompt lo pida explícitamente.

## Fase actual del proyecto
**Estamos en reestructuración visual y de rutas, ANTES de tocar base de
datos.** Reglas mientras dure esta fase:
- NO implementar autenticación real (login/registro son visuales/mock)
- NO conectar a MySQL
- NO reintroducir mecánicas de mascota virtual (puntos, tienda, ánimo, racha)
- SÍ mantener intacta la lógica de razas, guías y vacunación

## Sistema de diseño — paleta (usar SIEMPRE estos valores exactos)
```css
--brown-lightest: #FDF6EE;
--brown-light: #F5E6D0;
--brown-mid: #C8956C;
--brown-main: #9B6B47;
--brown-dark: #6B3F1F;
--brown-darker: #4A2A0E;
--cream: #FAF3E8;
--text-dark: #3D2010;
--text-mid: #6B4A2F;
--text-light: #A07850;
--green-ok: #5A8A5A;
--gold: #D4A843;
```
Patrones visuales fijos: cards con bordes redondeados (16-20px), borde sutil
`--brown-light`, hero con fondo `--brown-dark` y texto claro. Copy siempre
cálido y amigable, **nunca alarmista o urgente**, ni siquiera al hablar de
animales en situación de calle.

## Glosario del dominio
- **Protectora**: organización (ej. FUPA) que rescata y aloja animales.
- **Mascota**: animal real en proceso de adopción o ya adoptado. NO existe
  más el concepto de "mascota virtual".
- **Adoptante**: usuario que busca adoptar una mascota.
- **Hogar de tránsito**: rol dentro de una protectora, cuida mascotas
  temporalmente antes de la adopción definitiva.
- **Colaborador**: rol dentro de una protectora con permisos limitados.
- **Solicitud de adopción**: pedido formal de un adoptante por una mascota
  puntual, con estados (pendiente, en revisión, aprobada, rechazada).

## Estructura de carpetas
```
app/            -> páginas y rutas (App Router)
data/           -> JSON estáticos (razas, guías, vacunación, + mocks nuevos)
lib/            -> lógica de negocio y utilidades
documents/      -> planificación, roadmaps, prompts usados, maquetas
public/         -> estáticos (logo, PWA)
```

## Convenciones de código
- Componentes: PascalCase, archivos `.tsx`
- Textos de interfaz (UI): en español
- Nombres de variables/funciones/props: en inglés
- Un componente por archivo cuando sea razonable

## Entorno de ejecución — IMPORTANTE
Este proyecto corre en **Windows, con PowerShell** (no bash, no WSL, no Mac).
Nunca uses estos comandos, no existen acá: `grep`, `rg`, `find`, `head`,
`tail`, `cat`, `mkdir -p`, `ls -la`, `&&` para encadenar comandos.

Usá siempre **rutas relativas desde la raíz del proyecto** (ej: `app/page.tsx`
o `app\page.tsx`), nunca rutas absolutas ni rutas tipo `/workspace/...` — esa
ruta no existe en este proyecto.

Si necesitás crear un archivo en una carpeta que todavía no existe, **creá
el archivo directamente con la herramienta de escritura de archivos** — no
hace falta correr `mkdir` antes, la carpeta se crea sola al crear el archivo.

Si en algún caso puntual necesitás crear una carpeta vacía a mano en
PowerShell, el equivalente correcto es:
```
New-Item -ItemType Directory -Force -Path "app/mascotas"
```

Para carpetas con paréntesis o corchetes en el nombre (`(auth)`, `[id]`),
esos caracteres dan problemas en PowerShell si no se manejan con cuidado.
Evitá crearlas con `mkdir`/`New-Item` — creá directamente el archivo dentro
de esa ruta (ej: `app/(auth)/login/page.tsx`) con la herramienta de
escritura de archivos, que arma las carpetas intermedias sola.

Si necesitás buscar texto dentro de un archivo, usá `Select-String` (el
equivalente de PowerShell a `grep`), pero preferí directamente leer el
archivo completo con la herramienta de lectura en vez de buscar patrones —
es más simple y confiable con este proyecto chico.

## Checkpoint obligatorio después de CADA sub-paso
No intentes estimar tu propio porcentaje de tokens usados — no tenés forma
confiable de saber ese dato. En cambio, seguí esta regla siempre:

**Al terminar cualquier sub-paso que te pida (sin importar cuál), antes de
esperar el siguiente mensaje, agregá una entrada corta a PROGRESS_LOG.md**
con este formato:

```
## [fecha u orden secuencial] — [nombre corto de la tarea]
- Qué se hizo: (1-2 líneas)
- Archivos tocados: (lista)
- Estado: completo / con errores pendientes
- Próximo paso sugerido: (1 línea)
```

Si PROGRESS_LOG.md no existe todavía, creálo la primera vez que te toque
escribir en él. Si una sesión nueva empieza y no sabés en qué quedó el
proyecto, leé PROGRESS_LOG.md ANTES que cualquier otra cosa — ahí está el
resumen más reciente y no hace falta releer todo el código para ubicarte.

## Estado de avance (actualizar manualmente después de cada tarea completada)
- [x] Eliminada mascota virtual
- [x] Rutas reestructuradas (`/mascotas`, `/protectoras`, `/guias`, `/perfil`, `/login`, `/registro`)
- [x] Landing con diseño real (protectoras/adopción)
- [x] Listado de mascotas con diseño real
- [x] Listado de protectoras con diseño real
- [x] Login/registro con diseño real (visual, sin lógica real)
- [ ] MySQL + Prisma (no iniciado)
