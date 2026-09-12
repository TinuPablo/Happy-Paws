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
- [x] MySQL + Prisma conectado y migrado
- [x] Autenticación real (reemplaza AuthContext mock) — hash bcrypt + sesión
      firmada en cookie httpOnly (ver `lib/session.ts`), sin NextAuth
- [x] Mascotas reales en MySQL (reemplaza MascotasContext mock, eliminado)
- [x] Solicitudes de adopción reales en MySQL (reemplaza SolicitudesContext
      mock, eliminado) + transferencia de "propiedad" al aprobar
- [x] Vacunación real en MySQL (reemplaza libreta mock, se arma desde
      `Vacunacion` real en `/mascotas/[id]`)
- [x] Permisos verificados del lado del servidor en toda mutación (ver
      `requireRole()` en `lib/session.ts` + chequeo de dueño de protectora
      en `actualizarEstadoSolicitudAction`) — el rol ya no es falsificable
      vía localStorage, sale de la cookie firmada
- [x] Seed de datos de ejemplo de FUPA vía Prisma (`npm run db:seed`) —
      sigue siendo data placeholder, no la real de la ONG (ver backlog)

## Backlog

### Imprescindibles (para que la app sea real, no solo demo)
- [x] Autenticación real (hash + sesión) — reemplaza AuthContext mock.
      Se implementó con bcrypt + cookie httpOnly firmada con HMAC
      (`lib/session.ts`), sin NextAuth: dado que el login es solo
      email+contraseña (sin proveedores OAuth), el adapter de Prisma de
      NextAuth no aportaba demasiado y el signing casero evita traer una
      dependencia mayor con compatibilidad incierta contra Next 16/React 19
      en este momento. Server actions en `app/actions/auth.ts`
      (`loginAction`, `registerAdoptanteAction`, `registerProtectoraAction`,
      `logoutAction`), con errores reales vía `useActionState` en
      `/login` y `/registro` (email ya registrado, contraseña incorrecta,
      contraseña muy corta). El selector de rol falso en `/login` se sacó:
      el rol ahora sale siempre de la base, nunca de lo que elige el
      usuario en el formulario.
- [x] Mascotas conectadas a MySQL — reemplaza MascotasContext mock
      (eliminado junto con `data/mock-mascotas.ts`). `/mascotas`,
      `/mascotas/[id]` y la landing leen directo de Prisma.
- [x] Solicitudes conectadas a MySQL — reemplaza SolicitudesContext mock
      (eliminado junto con `data/mock-protectoras.ts`). Ver
      `app/actions/solicitudes.ts`.
- [x] Transferencia de "propiedad" de mascota al aprobar una adopción — se
      agregó `Mascota.adoptanteId` al schema (migración
      `20260911234041_auth_real_mascotas_solicitudes`); al aprobar,
      `actualizarEstadoSolicitudAction` pone `estado: ADOPTADO` y completa
      `adoptanteId`.
- [ ] Storage real de fotos/video (hoy sigue siendo blob URL de sesión, no
      persiste entre navegadores — el campo `Mascota.mediaUrl` ya existe en
      el schema pero guarda esa misma blob URL no portable hasta que haya
      un storage real, S3/Cloudinary/similar).
- [x] Vacunación conectada a MySQL (se arma en `/mascotas/[id]` a partir de
      la tabla `Vacunacion` real: cada fila es una dosis aplicada, y si
      tiene `proximaDosis` se muestra además como pendiente).
- [x] Permisos verificados del lado del servidor — CRÍTICO, resuelto: el
      rol ya no vive en el navegador. La sesión es una cookie httpOnly
      firmada con HMAC (`lib/session.ts`), y toda mutación (`addMascotaAction`,
      `crearSolicitudAction`, `actualizarEstadoSolicitudAction`) revalida el
      rol contra esa cookie con `requireRole()` — `actualizarEstadoSolicitudAction`
      además verifica que la protectora dueña de la mascota sea la de la
      sesión, no solo el rol. No se puede forzar ninguna de estas acciones
      editando estado del cliente.
- [x] Datos de ejemplo de FUPA cargados en MySQL vía `prisma/seed.ts`
      (`npm run db:seed`) — mismo contenido que tenían los mocks (Firulais,
      Michi, Rocky, Luna + 2 protectoras + usuarios demo, contraseña
      `happypaws123`). Sigue sin ser la data real de la ONG: falta que FUPA
      provea sus mascotas/fotos reales para reemplazar este seed.
- [ ] Modelo de "seguimiento posterior a la adopción" en schema.prisma —
      hoy Mascota pasa a ADOPTADO y ahí termina, no hay tabla para
      checkpoints (7 días, 1 mes, etc.). contexto.md lo describe como
      diferencial del producto ("la historia de una mascota no termina").
      Si se va a mostrar en la presentación como parte de la propuesta de
      valor, diseñar esta tabla junto con el resto del schema, no como
      parche después.
- [x] Estados de error en /login y /registro (contraseña incorrecta, email
      ya registrado, contraseña muy corta) — implementados vía
      `useActionState`, mensaje inline en el propio formulario.
- [x] Pasada general de links `<a href>` sueltos — no queda ninguno en
      `app/` (confirmado por búsqueda), todos son `<Link>` de `next/link`.

### Recomendaciones (suman valor, no bloquean)
- [x] Filtros de búsqueda en /mascotas (especie, tamaño) — vía query params
      (`?especie=&tamanio=`), filtro server-side con Prisma. Edad no se
      filtra: sigue siendo texto libre (`edadTexto`), no hay un campo
      numérico cargado todavía para poder rangear.
- [ ] Recuperación de contraseña — no se implementó: requiere una decisión
      de proveedor de email (SMTP/Resend/similar) que no estaba tomada, y
      una versión sin envío real de mail hubiera sido más confusa que útil.
- [ ] Notificación por email al cambiar estado de solicitud — mismo
      motivo, depende de la misma decisión de proveedor de email.
- [x] Dashboard simple para protectora — 4 tiles en `/perfil` (mascotas
      totales, disponibles, solicitudes pendientes, adopciones del mes).
- [x] Favoritos para adoptantes — tabla `Favorito` nueva, botón ☆/★ en
      `/mascotas`, `/mascotas/[id]` y listado en "Mis favoritos" en
      `/perfil`.
- [ ] Deploy a producción (Vercel + MySQL en la nube) — no se tocó: implica
      acceso a cuentas/infra del usuario, se hace a pedido explícito.
- [ ] Página de términos/privacidad reales — no se creó: hoy no hay ningún
      placeholder en el código (se ve que se sacó en algún rediseño previo,
      no quedó rastro), y escribir texto legal "real" no es algo para
      inventar — falta que alguien redacte el contenido real.
- [x] Reemplazar los alert() nativos — ya no queda ninguno en `app/`
      (confirmado por búsqueda): se fueron solos al reescribir
      login/registro/perfil con server actions + `useActionState`, que
      muestran el mensaje inline en vez de con `alert()`.
- [x] Foto/logo de protectora — `Protectora.logoUrl` nuevo en el schema,
      se carga desde "Datos de la protectora" en `/perfil` (mismo patrón de
      preview con blob URL que ya se usaba para fotos de mascota) y se
      muestra en `/protectoras`, `/protectoras/[id]` y la landing.
