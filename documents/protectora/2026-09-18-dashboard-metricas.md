# Dashboard de métricas (mascotas activas, pendientes, adopciones)

**Fecha:** 2026-09-18
**Rama:** `feature/perfil-protectora`
**Backlog:** ítems tildados en `app/protectoras/BACKLOG-protectora.md` → "Dashboard con métricas" (los 3) — **completa todo el backlog de protectora**.

## Qué se hizo

Nuevo `app/protectoras/dashboard/page.tsx`, mismo patrón de seguridad que `historial/page.tsx` (protectora siempre desde la sesión, sin id en la URL, bloqueado para rol adoptante o sin sesión). No se tocaron los 4 tiles rápidos que ya existían en `/perfil` desde antes.

1. **Mascotas activas:** `prisma.mascota.count({ where: { protectoraId, activo: true } })`.
2. **Solicitudes pendientes:** se usó `estado: { notIn: ["APROBADA", "RECHAZADA"] }` en vez del `estado === "PENDIENTE"` que ya usaba el dashboard chico de `/perfil` — más fiel al criterio que pediste ("no está adoptada ni rechazada"). Hoy da exactamente el mismo número en la práctica porque ningún código del proyecto usa `EN_REVISION`/`CANCELADA` todavía, pero queda correcto si en el futuro se usan.
3. **Adopciones concretadas:** total (`estado === "APROBADA"`) + "últimos 30 días" (mismo filtro + `updatedAt >= hace30dias`) en la misma card. Se descartó agrupar por mes con SQL crudo — no hay ningún `$queryRaw` en el resto del proyecto y hubiera sido la primera vez; total + últimos 30 días es la versión más simple que cumple "total y por período", con margen para agregar un desglose mensual más adelante si hace falta.

Vista: 3 cards simples (`.card`, sin gráficos), con `Counter` (mismo componente animado que ya usan los otros tiles). Link "Ver dashboard completo" agregado en `/perfil`, junto al de "Ver historial completo de adopciones".

## Archivos tocados
- `app/protectoras/dashboard/page.tsx` (nuevo)
- `app/perfil/PerfilProtectora.tsx` (link nuevo)

Sin cambios en `prisma/schema.prisma` ni en ningún archivo compartido.

## Verificación
- `npx tsc --noEmit` y `npm run build`: limpios, ahora 12 rutas (se sumó `/protectoras/dashboard`).
- Contra MySQL real (cookie de `fupa@gmail.com`): `/protectoras/dashboard` muestra "Dashboard de FUPA" y las 3 métricas con datos reales.
- Sin sesión: mensaje de acceso restringido, sin datos (confirmado con `curl`).

## Estado
Completo. **Con esta entrada se termina todo lo que estaba en `BACKLOG-protectora.md`** — los 6 bloques (Perfil de la protectora, Gestión de mascotas, Vacunación, Notificaciones, Historial de adopciones, Dashboard con métricas) quedan con todos sus ítems tildados.

## Próximo paso sugerido
No queda backlog de protectora pendiente. Sigue abierto: resolver el permiso de push de Daniel sobre el repo (todo el trabajo de esta rama sigue local); que Pablo enganche `notificarNuevaSolicitud` en `crearSolicitudAction`; decidir si se arregla la no-idempotencia de `prisma/seed.ts`. Si el usuario quiere agregar tareas nuevas al backlog, sumarlas ahí antes de arrancar.
