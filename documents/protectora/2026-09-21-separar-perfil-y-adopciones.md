# Separar /perfil (edición de cuenta) de /adopciones (operativo)

**Fecha:** 2026-09-21
**Rama:** `feature/reorganizar-perfil-adopciones`
**Backlog:** ítem nuevo tildado en `app/protectoras/BACKLOG-protectora.md` → "Perfil de la protectora"

## Contexto

Pedido directo del usuario, post-merge con el trabajo de Pablo. `PerfilProtectora.tsx` había crecido con todo mezclado (notificaciones, dashboard, mascotas, solicitudes, equipo, datos de cuenta) en una sola página. El usuario pidió separar: `/perfil` = solo edición de cuenta "como los perfiles de cualquier app" (foto, mail, acerca de); todo lo operativo pasa a una sección nueva "Adopciones", que reemplaza al ítem "Guías" del nav para cuentas de protectora.

## Qué se hizo

1. **`app/adopciones/page.tsx` (nuevo):** contiene todo lo que antes estaba en `PerfilProtectora.tsx` salvo Datos/Logo — `NotificacionesPanel`, dashboard de 4 tiles + links a `/protectoras/dashboard` y `/protectoras/historial`, "Mis mascotas publicadas" (alta + `MascotaRow` con editar/cambiar estado/dar de baja/**vacunación**), "Solicitudes recibidas", "Equipo de la protectora" + `InvitarMiembroForm`. Mismo control de acceso que tenía `PerfilProtectora.tsx`: página propia con `getSession()` + bloqueo si no hay sesión o es `ADOPTANTE` (mismo patrón que `/protectoras/dashboard` y `/protectoras/historial`), protectora resuelta vía `protectoraIdDeUsuario` (dueño o colaborador), secciones de administración gateadas por `esAdmin`.
2. **`PerfilProtectora.tsx` reducido**: 3 cards — "Foto de perfil" (`LogoProtectoraForm`, solo admin), "Correo electrónico" (solo lectura), "Acerca de" (ubicación/teléfono/descripción + `EditarDatosProtectoraForm`, solo admin).
3. **`Navbar.tsx` (compartido):** "Guías" se reemplaza por "Adopciones" (`/adopciones`) únicamente cuando la sesión es de protectora (nuevo prop `esProtectora`, default `false` — no rompe nada si algún día se renderiza `<Navbar />` sin pasarlo). Para adoptante o sin sesión, el nav no cambió en nada.
4. **`app/layout.tsx` (compartido):** nuevo booleano `esProtectora`, reutilizando el mismo cálculo que ya existía para la campana de notificaciones.

**Explícitamente no se tocó:** el "Seguimiento post-adopción" de Pablo (checkpoints 7 días/1 mes/3 meses/6 meses) vive en la ficha pública de la mascota (`/mascotas/[id]`), no en `/perfil` — el usuario confirmó que solo se refería a lo que ya estaba en `/perfil` (vacunación/estado de salud, que sí es mío).

## Archivos tocados
- `app/adopciones/page.tsx` (nuevo)
- `app/perfil/PerfilProtectora.tsx` (reescrito, mucho más chico)
- `app/components/Navbar.tsx`, `app/layout.tsx` (compartidos, cambio chico y aditivo — avisado en `CAMBIOS-PARA-ADOPTANTE.md`)

## Verificación
- `npx tsc --noEmit` y `npm run build`: limpios, 16 rutas ahora (`/adopciones` nueva, `/guias` sigue existiendo intacta).
- Contra MySQL real (cookie de `fupa@gmail.com`): `/perfil` responde 200 con solo "Foto de perfil"/"Correo electrónico"/"Acerca de" — nada de mascotas/solicitudes/notificaciones/equipo. `/adopciones` responde 200 con todo eso (Notificaciones, Mis mascotas publicadas, Firulais, Solicitudes recibidas, Equipo de la protectora), y el nav muestra "Adopciones".
- Cookie de adoptante: el nav sigue mostrando "Guías" (no "Adopciones"), y `/adopciones` devuelve el mensaje de acceso restringido sin filtrar ningún dato (confirmado que "Firulais" no aparece en esa respuesta). Sin sesión: mismo resultado, nav con "Guías".
- `/guias` sigue respondiendo 200 sin cambios.

## Estado
Completo según lo pedido, confirmado con el usuario antes de implementar (3 preguntas de alcance resueltas en el intercambio previo).

## Próximo paso sugerido
Ninguno pendiente de esta tarea. Nota aparte (no de esta tarea, preexistente): la campana de notificaciones del header sigue resolviendo la protectora por `duenioId` únicamente (no usa `protectoraIdDeUsuario`), así que un colaborador no ve el badge de no leídas en el header aunque sí las vea dentro de `/adopciones` — quedó así desde antes del merge con Pablo, no se tocó por estar fuera de alcance de este pedido.
