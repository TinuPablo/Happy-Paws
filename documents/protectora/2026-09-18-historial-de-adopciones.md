# Historial de adopciones (listado + filtros)

**Fecha:** 2026-09-18
**Rama:** `feature/perfil-protectora`
**Backlog:** ítems tildados en `app/protectoras/BACKLOG-protectora.md` → "Historial de adopciones" (los 2)

## Qué se hizo

Nuevo `app/protectoras/historial/page.tsx`, 100% lectura, sin schema nuevo y sin tocar ningún archivo compartido.

1. **"Concretada"** = `SolicitudAdopcion.estado === "APROBADA"` (mismo criterio que ya usa `actualizarEstadoSolicitudAction`, que vos manejás).
2. **Fecha de adopción**: se reutilizó `updatedAt` de la solicitud — es el mismo campo que el dashboard de `/perfil` ya usa para "adopciones este mes" (`s.estado === "APROBADA" && s.updatedAt >= inicioDeMes`). No hizo falta agregar ningún campo nuevo al schema.
3. **Seguridad:** la página deriva la protectora **siempre desde la sesión** (`protectora.findFirst({ where: { duenioId: session.userId } })`) — no tiene ningún parámetro de URL con un id de protectora, así que no hay forma de manipular la URL para ver el historial de otra cuenta. Sin sesión o con rol `ADOPTANTE`, muestra un mensaje, no datos (verificado con dos cookies distintas, ver abajo).
4. **Filtros** (`?desde=&hasta=&mascotaId=`) vía `<form method="GET">` — sin JavaScript, mismo patrón que ya usa `/mascotas` del lado de Pablo con `especie`/`tamanio`. El selector de mascota solo lista las que tienen al menos una adopción aprobada (evita mostrar mascotas irrelevantes).
5. Cards con nombre de mascota, nombre del adoptante, email, teléfono (o "Teléfono no cargado" si falta) y fecha.
6. Link "Ver historial completo de adopciones →" agregado en `PerfilProtectora.tsx`, debajo del dashboard de métricas.

## Archivos tocados
- `app/protectoras/historial/page.tsx` (nuevo)
- `app/perfil/PerfilProtectora.tsx` (link nuevo)

Sin cambios en `prisma/schema.prisma` ni en ningún archivo de la lista de compartidos.

## Verificación
- `npx tsc --noEmit` y `npm run build`: limpios, ahora 11 rutas (se sumó `/protectoras/historial`).
- Contra MySQL real: se aprobó la solicitud de prueba que había quedado de la tarea de notificaciones (Ana Adoptante → Firulais) para tener un caso real, y se confirmó que `/protectoras/historial` la muestra (cookie de `fupa@gmail.com`).
- **Control de acceso probado con 2 sesiones distintas:** sin cookie de sesión → mensaje "Sección solo para protectoras", sin ningún dato. Con cookie de `adoptante@happypaws.demo` (rol `ADOPTANTE`) → mismo mensaje, sin ningún dato filtrado (confirmado que "Firulais" no aparece en ese response).

## Estado
Completo según lo pedido.

## Próximo paso sugerido
Backlog de protectora: queda solo "Dashboard con métricas" (ya tiene una base parcial desde antes — 4 tiles en `/perfil`, ver qué falta puntualmente). Seguir pendiente: que Pablo enganche `notificarNuevaSolicitud` (ver entrada anterior) y resolver el permiso de push de Daniel.
