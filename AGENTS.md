# Happy Paws — Contexto fijo del proyecto

> Este archivo es de lectura obligatoria antes de cualquier tarea. Contiene lo
> que NUNCA cambia entre prompts. Si algo acá contradice lo que dice un prompt
> puntual, este archivo tiene prioridad salvo que el prompt diga explícitamente
> lo contrario.

> A partir de ahora el proyecto se trabaja en equipo (Tinu + Daniel). Antes de
> tocar cualquier archivo, leé también `WORKFLOW-GIT.md` — define en qué rama
> tenés que estar y cómo se sube el trabajo (nunca directo a `main`).

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
**Fase visual/mock COMPLETA** (prompts 01 a 11): mascota virtual eliminada,
rutas reestructuradas, landing/mascotas/protectoras con diseño real, sesión
mock por rol (adoptante/protectora), flujo completo de adopción simulado
(agregar mascota → solicitar adopción → aprobar/rechazar), foto/video mock,
libreta de vacunación mock. Todo esto vive en `localStorage` del navegador,
no en una base de datos real.

**Ahora arranca la fase de backend real (MySQL + Prisma).** A partir de acá:
- SÍ conectar a MySQL y correr migraciones de Prisma.
- SÍ implementar autenticación real (hash de contraseñas, sesiones).
- El objetivo de esta fase es reemplazar, una por una, las piezas mock
  (AuthContext, MascotasContext, SolicitudesContext, todo lo que hoy vive en
  localStorage) por llamadas reales a la base de datos — no reescribir la
  UI desde cero, la UI ya está resuelta y probada.
- Mientras se hace esta migración, está bien que convivan temporalmente
  partes mock con partes reales (ej: podés conectar mascotas a MySQL antes
  que las solicitudes) — no hace falta migrar todo de una vez.

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

**Layout: página web estándar, NO app-shell mobile.** El proyecto tuvo una
etapa temprana (prompts 01-11) donde se simulaba una app de celular con
`app/layout.tsx` envolviendo todo en una tarjeta angosta tipo teléfono y
`BottomNav` (navegación inferior). Eso quedó descartado a partir del
prompt 12 — ahora es una página web responsive normal: `Navbar` superior
(horizontal en desktop, hamburguesa en mobile), contenido con ancho máximo
centrado (`max-w-6xl` o similar según la sección) que aprovecha el ancho de
pantalla en desktop, grids con breakpoints reales (`sm:`, `lg:`) respondiendo
al ancho del navegador. NO reintroducir el patrón de tarjeta angosta ni
BottomNav bajo ningún concepto, aunque aparezca referenciado en prompts
viejos (01a-04a) o en el backup de vacunación — esos son de la etapa mobile
anterior.

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
- [x] Eliminada mascota virtual (confirmado: no existía código de esa funcionalidad en app/page.tsx)
- [x] Rutas reestructuradas (`/mascotas`, `/protectoras`, `/guias`, `/perfil`, `/login`, `/registro`)
- [x] Landing con diseño real (protectoras/adopción)
- [x] Listado de mascotas con diseño real
- [x] Listado de protectoras con diseño real
- [x] Login/registro con diseño real (visual, sin lógica real)
- [x] Detalle de mascota/protectora conectado a datos mock
- [x] Libreta de vacunación mock en detalle de mascota
- [x] Sesión mock por rol (adoptante/protectora) + perfil condicional
- [x] Adoptar requiere login (con redirect de vuelta)
- [x] Perfil de protectora funcional (mock): agregar mascota, ver/aprobar/rechazar solicitudes
- [x] Foto/video mock en formulario de agregar mascota
- [ ] MySQL + Prisma conectado y migrado (EN CURSO)
- [ ] Autenticación real (reemplaza AuthContext mock)
- [ ] Mascotas reales en MySQL (reemplaza MascotasContext mock)
- [ ] Solicitudes de adopción reales en MySQL (reemplaza SolicitudesContext mock)
- [ ] Vacunación real en MySQL (reemplaza libreta mock)
- [ ] Seed de datos reales de FUPA (reemplaza datos de ejemplo)

## Backlog

### Imprescindibles (para que la app sea real, no solo demo)
- [ ] Autenticación real (hash + sesión) — reemplaza AuthContext mock.
      Recomendación técnica: evaluar Auth.js (NextAuth) con adapter de
      Prisma en vez de armar sesión/JWT a mano — cubre hash, sesiones y
      reset de contraseña sin reinventar la rueda, dado el tiempo y equipo
      chico.
- [ ] Mascotas conectadas a MySQL — reemplaza MascotasContext mock
- [ ] Solicitudes conectadas a MySQL — reemplaza SolicitudesContext mock
- [ ] Transferencia de "propiedad" de mascota al aprobar una adopción (falta
      campo/relación en el schema para esto)
- [ ] Storage real de fotos/video (hoy es blob URL de sesión, no persiste)
- [ ] Vacunación conectada a MySQL (hoy es lista mock hardcodeada)
- [ ] Permisos verificados del lado del servidor (hoy el rol vive solo en
      el navegador/mock). CRÍTICO: hoy el rol "protectora" es 100%
      falsificable editando localStorage a mano (happy_paws_mock_session)
      para desbloquear "agregar mascota" o "aprobar solicitudes" — con
      auth mock no importa, pero es el punto #1 a blindar apenas haya
      sesión real. No alcanza con ocultar el botón en el cliente, cada
      mutación de la API tiene que revalidar el rol server-side.
- [ ] Datos reales de FUPA (reemplaza el seed de ejemplo)
- [ ] Modelo de "seguimiento posterior a la adopción" en schema.prisma —
      hoy Mascota pasa a ADOPTADO y ahí termina, no hay tabla para
      checkpoints (7 días, 1 mes, etc.). contexto.md lo describe como
      diferencial del producto ("la historia de una mascota no termina").
      Si se va a mostrar en la presentación como parte de la propuesta de
      valor, diseñar esta tabla junto con el resto del schema, no como
      parche después.
- [ ] Estados de error en /login y /registro (contraseña incorrecta, email
      ya registrado, etc.) — no existen hoy porque no hacían falta con el
      mock. Diseñarlos ahora, no descubrirlos sobre la marcha al conectar
      auth real.
- [ ] Pasada general de links `<a href>` sueltos (landing, /protectoras)
      que fuerzan recarga completa de página en vez de navegación SPA —
      solo se corrigió el de /mascotas porque rompía la foto. Conviene
      resolver esto antes de sumar más estado en memoria (sesión real),
      porque cada recarga completa lo tira todo.

### Recomendaciones (suman valor, no bloquean)
- [ ] Filtros de búsqueda en /mascotas (especie, tamaño, edad)
- [ ] Recuperación de contraseña
- [ ] Notificación por email al cambiar estado de solicitud
- [ ] Dashboard simple para protectora (mascotas activas, adopciones del mes)
- [ ] Favoritos para adoptantes
- [ ] Deploy a producción (Vercel + MySQL en la nube)
- [ ] Página de términos/privacidad reales (hoy es texto placeholder)
- [ ] Reemplazar los alert() nativos (login, registro, adoptar) por un
      toast/notificación con la estética del proyecto — hoy interrumpen la
      interfaz y desentonan con el resto del diseño cuidado.
- [ ] Foto/logo de protectora — ni ProtectoraMock ni el schema lo tienen
      hoy. Para FUPA en particular, un logo real en /protectoras da mucha
      más credibilidad que una card de solo texto.
