# Notificaciones internas + gancho para el email

**Fecha:** 2026-09-18
**Rama:** `feature/perfil-protectora`
**Backlog:** ítems tildados en `app/protectoras/BACKLOG-protectora.md` → "Notificaciones"

## Qué se hizo

1. **Modelo `Notificacion` (schema, compartido):** `protectoraId`, `tipo` (string libre, hoy solo existe `"SOLICITUD_NUEVA"`), `mensaje`, `leida`, `solicitudId` opcional, `createdAt`. Migración `20260918114939_notificaciones`.

2. **`lib/notificaciones.ts` → `notificarNuevaSolicitud(solicitudId)`:** función lista para importar. Busca la solicitud, arma el mensaje, crea la `Notificacion` real en la base, y dispara el email de aviso. **El email no se envía de verdad todavía** — no hay proveedor decidido (SMTP/Resend/similar, ver backlog de `AGENTS.md`), así que por ahora solo queda logueado en la consola del servidor con un comentario explicando por qué. Cuando se elija un proveedor, el cambio queda encapsulado ahí adentro — nadie que la llame tiene que tocar nada. La función nunca tira una excepción hacia afuera (todo el cuerpo está en un `try/catch`), para que un problema de notificación no le rompa el flujo de "solicitud enviada" al adoptante.

3. **`app/actions/notificaciones.ts` → `marcarNotificacionLeidaAction`:** verifica ownership (la notificación tiene que pertenecer a una protectora del usuario de la sesión) y marca `leida: true`.

4. **`NotificacionesPanel.tsx`:** nueva sección arriba del todo en `/perfil` (antes del dashboard de métricas), con ícono de campana, badge de "X nuevas" y el listado (no leídas resaltadas), cada una con su botón "Marcar como leída".

5. **No se tocó `app/actions/solicitudes.ts`** (es de Pablo) — instrucción explícita del usuario de dejar el enganche documentado en vez de tocarlo yo. Se agregó la entrada `[PENDIENTE - Pablo] Notificaciones al crear solicitud` en `app/protectoras/CAMBIOS-PARA-ADOPTANTE.md` con el import exacto y la línea a agregar (`await notificarNuevaSolicitud(solicitud.id)`), incluyendo la aclaración de que `crearSolicitudAction` hoy no guarda el resultado del `create` en una variable, así que va a necesitar ese cambio chico también.

## Archivos tocados
- `prisma/schema.prisma` (modelo nuevo, compartido) + `prisma/migrations/20260918114939_notificaciones/`
- `lib/notificaciones.ts` (nuevo), `app/actions/notificaciones.ts` (nuevo)
- `app/perfil/NotificacionesPanel.tsx` (nuevo), `app/perfil/PerfilProtectora.tsx` (lo engancha)
- `app/protectoras/CAMBIOS-PARA-ADOPTANTE.md` (entrada para Pablo)

## Verificación
- `npx tsc --noEmit` y `npm run build`: limpios, mismas 10 rutas.
- **No se pudo probar `notificarNuevaSolicitud()` tal cual está escrita** con un script suelto: importa `"server-only"`, que tira error fuera del runtime de Next.js (es justamente lo que tiene que hacer). Se verificó la misma lógica en línea (sin el wrapper) creando una solicitud real contra la base: la notificación se creó, quedó vinculada a la protectora dueña correcta (verificado con `include`) y aparece en `/perfil` (cookie firmada de `fupa@gmail.com`) con el badge "1 nueva" y el botón "Marcar como leída". Se dejó esa solicitud/notificación de prueba en la base a propósito, para que se vea el feature andando de una.
- **Hallazgo al hacer esta prueba (no es de esta tarea, ya estaba antes):** `prisma/seed.ts` no es idempotente para `Protectora`/`Mascota` — cada corrida de `npx prisma db seed` crea protectoras/mascotas nuevas en vez de reusar las existentes (a diferencia de `User`, que sí hace upsert por email). En esta base local terminé con 2 "FUPA" y 2 "Firulais" duplicados de las veces que corrí seed durante esta sesión. No lo toqué (es un archivo compartido, fuera del alcance de esta tarea) — lo dejo anotado para que se decida si vale la pena arreglarlo.

## Estado
Completo según lo pedido. Queda pendiente del lado de Pablo el enganche de una línea en `crearSolicitudAction`.

## Próximo paso sugerido
Backlog de protectora: quedan "Historial de adopciones" y "Dashboard con métricas" (parcial). Decidir si vale la pena arreglar la no-idempotencia de `prisma/seed.ts` (afecta a los dos lados).
