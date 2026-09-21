---
title: Pendientes del lado protectora (para Daniel)
---

# Pendientes del lado protectora — para el agente de Daniel

> Este archivo es para el agente de **Daniel**, que va a trabajar la parte
> de **protectora** de Happy Paws, en paralelo con Pablo (que trabaja la
> parte de adoptante/usuario) — cada uno en su propia PC, con su propio
> agente. Es autocontenido: no depende de ninguna conversación previa.
>
> Antes que nada, leé `AGENTS.md` completo (contexto fijo del proyecto,
> siempre obligatorio) y las últimas ~10 entradas de `PROGRESS_LOG.md` para
> saber en qué quedó todo. Este archivo es un complemento puntual a eso, no
> un reemplazo.

## Contexto: qué pasó justo antes de este archivo

El backlog de `AGENTS.md` estaba casi completo salvo 4 ítems. Pablo (con su
agente) los resolvió todos en una sesión reciente, **incluyendo varios que
tocan archivos del dominio de Daniel** (storage de fotos con Cloudinary, que
se conectó en `AgregarMascotaForm.tsx` y `LogoProtectoraForm.tsx`; y después,
a pedido explícito, todo el sistema de colaboradores/hogares de tránsito,
que reescribió `PerfilProtectora.tsx` bastante). Se hizo así porque Daniel
todavía no había arrancado y no tenía sentido dejar esos features a medio
hacer, o que alguien más los reprograme sin saber que ya existen. **No hay
nada de eso para programar de nuevo** — lo que queda es probarlo en vivo y
seguir desde ahí.

⚠️ Si tu copia de `PerfilProtectora.tsx` es muy distinta a lo que describe
este archivo (por ejemplo si no existe una sección "Equipo de la
protectora"), es que estás en una versión vieja — hacé `git pull` antes de
seguir, no reescribas el archivo desde cero.

## Setup (hacé esto primero)

1. `git checkout main && git pull`
2. `git checkout -b feature/perfil-protectora` (o el nombre que prefieras)
3. `npm install`
4. `npx prisma generate`
5. Si tenés tu propia base MySQL local (recomendado — cada uno la suya):
   `npx prisma migrate dev` para traer todas las migraciones existentes,
   después `npx prisma db seed` si tu base está vacía (datos de ejemplo de
   FUPA: Firulais, Michi, Rocky, Luna, usuarios demo). Si en cambio
   compartís una sola base con Pablo, avisale antes de correr cualquier
   `migrate`.
6. Copiá `.env` y completá **tus propias** credenciales (no las de Pablo,
   las tuyas — son cuentas gratuitas):
   - `SESSION_SECRET`: cualquier string random largo (ej.
     `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`).
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`:
     cuenta gratis en https://cloudinary.com → Dashboard, están ahí arriba
     de todo.
   - `RESEND_API_KEY`: cuenta gratis en https://resend.com → API Keys. Sin
     dominio propio verificado, dejá `EMAIL_FROM="onboarding@resend.dev"`
     (funciona igual para probar).
   - `APP_URL="http://localhost:3000"`.
7. `npm run dev`.

## Qué ya está hecho (no lo reprogrames)

- **Storage de fotos/video con Cloudinary**: subida firmada desde el
  navegador directo a Cloudinary (`app/actions/upload.ts` +
  `lib/uploadCloudinary.ts`), ya conectada en `AgregarMascotaForm.tsx`
  (foto/video de mascota) y `LogoProtectoraForm.tsx` (logo de protectora).
  Muestra vista previa instantánea y deshabilita el submit mientras sube.
- **Seguimiento post-adopción**: al aprobar una solicitud
  (`actualizarEstadoSolicitudAction`) se generan automáticamente 4
  checkpoints (7 días / 1 mes / 3 meses / 6 meses — tabla
  `SeguimientoAdopcion`). Se ven en la ficha pública de la mascota
  (`/mascotas/[id]`, sección "Seguimiento post-adopción"), y si sos la
  protectora dueña de esa mascota tenés un formulario para marcar cada uno
  como hecho con una nota opcional (`app/actions/seguimiento.ts`).
- **Notificación por email al aprobar/rechazar**: `actualizarEstadoSolicitudAction`
  ya manda un mail al adoptante (`lib/email.ts`, Resend). Si no configurás
  `RESEND_API_KEY`, no se rompe nada — solo queda un warning en la consola
  del servidor en vez de mandarse el mail de verdad.
- **"Ver formulario"** en solicitudes recibidas (modal con las respuestas
  del quiz de compatibilidad del adoptante y el % de match) — ya
  implementado en `app/perfil/VerFormularioSolicitud.tsx`.
- `/perfil` ya está separado en `PerfilAdoptante.tsx` / `PerfilProtectora.tsx`
  (antes todo mezclado en un solo archivo) — vos trabajás en
  `PerfilProtectora.tsx`.
- **Colaboradores y hogares de tránsito**: sección "Equipo de la
  protectora" en `/perfil`. El dueño invita por email (rol Colaborador o
  Hogar de tránsito) desde `InvitarMiembroForm.tsx` → `invitarMiembroAction`
  (en `app/actions/miembros.ts`), la persona invitada crea su cuenta en
  `/invitacion?token=` (`AceptarInvitacionForm.tsx` →
  `aceptarInvitacionAction`, no necesita cuenta previa ni login). Un
  colaborador ve el mismo dashboard/solicitudes/seguimiento que el dueño
  (se resuelve con `lib/protectora.ts` → `protectoraIdDeUsuario`, que
  contempla dueño Y miembro), pero **no** ve "Agregar mascota", "Datos de
  la protectora" ni el botón de invitar — eso queda gateado por un flag
  `esAdmin` en `PerfilProtectora.tsx` (solo true para el dueño). Si en
  algún momento un colaborador necesita más permisos que los que tiene hoy
  (por ejemplo, poder agregar mascotas), es una decisión de producto — no
  lo cambies sin pensarlo, el glosario de `AGENTS.md` dice explícitamente
  que colaborador tiene "permisos limitados".
  - Cuenta de prueba ya creada en la base (si compartís la misma base que
    Pablo, o si corriste el seed y después esto — si no existe en tu base,
    no importa, no es parte del seed):
    `colaborador.test@happypaws.demo` / `colaborador123`, miembro de FUPA.

## Tus tareas concretas ahora

Todo lo de arriba se verificó por código/build/scripts, **pero nunca se
probó a mano en un navegador real** (el entorno donde se hizo no tiene esa
herramienta). Esto es lo primero que tenés que hacer:

1. Loguearte como protectora (`fupa@gmail.com` / `123456`, o registrar una
   cuenta nueva de protectora) y probar:
   - Agregar una mascota con foto real desde `/perfil` → confirmar que la
     imagen se sube a Cloudinary de verdad y se ve después en `/mascotas`
     y en la ficha de la mascota (no debería ser un blob: URL roto al
     recargar la página).
   - Cambiar el logo de la protectora desde "Datos de la protectora" →
     mismo chequeo.
   - Aprobar una solicitud de adopción → confirmar que en la ficha de esa
     mascota (`/mascotas/[id]`) aparecen los 4 checkpoints de seguimiento,
     y que podés marcar uno como hecho con una nota.
   - Aprobar/rechazar una solicitud con `RESEND_API_KEY` configurada →
     confirmar que llega el mail de verdad (revisá también la carpeta de
     spam, común con la cuenta sandbox de Resend).
   - Abrir "Ver formulario" en una solicitud que tenga quiz respondido →
     confirmar que el modal abre bien, cierra con ✕/click afuera/Escape, y
     que el mensaje de "era/no era la recomendada" se ve correcto.
   - Invitar a un colaborador desde "Equipo de la protectora" (con
     `RESEND_API_KEY` configurada) → confirmar que llega el mail, que
     `/invitacion?token=` funciona, y que esa cuenta nueva ve el perfil de
     protectora bien (dashboard + solicitudes) pero sin los botones de
     admin. Podés usar la cuenta de prueba (`colaborador.test@happypaws.demo`
     / `colaborador123`) para el segundo chequeo sin tener que invitar de
     nuevo.
2. Si encontrás bugs o cosas que no se ven bien en `PerfilProtectora.tsx`,
   `AgregarMascotaForm.tsx`, `LogoProtectoraForm.tsx`,
   `VerFormularioSolicitud.tsx`, `InvitarMiembroForm.tsx`, la página
   `/invitacion` o la sección de seguimiento en `/mascotas/[id]`,
   arreglalos ahí directamente — son tu dominio.
3. Del backlog original de `AGENTS.md` solo quedan sin resolver, a
   propósito, "Deploy a producción" y "Página de términos/privacidad
   reales" — ambos necesitan algo que solo puede aportar el usuario real
   del proyecto (acceso a cuentas de hosting, texto legal real). Si te
   piden avanzar en alguno, coordinalo con Pablo antes de tocar nada de
   infra o contenido legal por tu cuenta.

## Reparto de archivos (para no pisarse con Pablo)

**Tu dominio (protectora) — trabajá libremente:**
`app/perfil/PerfilProtectora.tsx`, `app/perfil/AgregarMascotaForm.tsx`,
`app/perfil/LogoProtectoraForm.tsx`, `app/perfil/VerFormularioSolicitud.tsx`,
`app/perfil/InvitarMiembroForm.tsx`, `app/(auth)/invitacion/**`,
`app/protectoras/**`, `app/actions/protectoras.ts`, `app/actions/mascotas.ts`,
`app/actions/seguimiento.ts`, `app/actions/miembros.ts`, `lib/protectora.ts`.

**NO toques (dominio de Pablo, en paralelo):**
`app/mascotas/**` (catálogo, quiz de match, ficha de mascota — salvo la
sección de seguimiento que ya quedó ahí, evitá tocar el resto de ese
archivo sin avisar), `app/perfil/PerfilAdoptante.tsx`,
`app/(auth)/login`, `app/(auth)/registro`, `app/(auth)/recuperar`,
`app/(auth)/restablecer`, `app/page.tsx`, `app/actions/favoritos.ts`,
`lib/calcularCompatibilidad.ts`, `lib/uploadCloudinary.ts`, `lib/email.ts`.

**Compartidos — avisale a Pablo antes de tocarlos:**
`prisma/schema.prisma` y sus migraciones, `app/actions/solicitudes.ts`
(tiene `crearSolicitudAction` de Pablo y `actualizarEstadoSolicitudAction`
tuya — tocá solo tu función), `app/actions/auth.ts` (login/registro son de
Pablo, pero por ahí en algún punto se toca junto con `miembros.ts`),
`app/layout.tsx`, `app/globals.css`, `app/components/**`, `lib/session.ts`,
`lib/cloudinary.ts`, `PROGRESS_LOG.md`/`AGENTS.md`.

## Disciplina de trabajo

- Commits chicos y frecuentes. Pusheá seguido a tu rama, no dejes trabajo
  sin subir por días.
- `git pull origin main` (o rebase) antes de arrancar cada sesión.
- Si necesitás un campo/modelo nuevo en `prisma/schema.prisma`: proponelo
  primero, corré `npx prisma migrate dev --name <algo>`, commiteá la
  migración generada ya mismo, y avisale a Pablo para que la aplique en su
  propia base (`npx prisma migrate dev` de nuevo del lado de él) antes de
  seguir.
- Al terminar cualquier sub-tarea, agregá tu entrada a `PROGRESS_LOG.md`
  (mismo formato que ya tiene el archivo). Si hay un conflicto chico ahí
  por agregar los dos al final casi al mismo tiempo, no es grave: quedate
  con las dos entradas.
- Mergeá a `main` cuando termines algo razonable (PR o merge directo) y
  avisale a Pablo para que haga pull.
