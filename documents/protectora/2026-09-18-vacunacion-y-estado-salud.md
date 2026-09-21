# Vacunación (CRUD) + estado de salud interno

**Fecha:** 2026-09-18
**Rama:** `feature/perfil-protectora`
**Backlog:** ítems tildados en `app/protectoras/BACKLOG-protectora.md` → "Vacunación" (los 3 originales + 1 nuevo)

## Qué se hizo

1. **No hizo falta modelo nuevo.** `Vacunacion` (existente desde el arranque del backend real) ya tenía `nombreVacuna`, `fechaAplicacion`, `proximaDosis` y `observaciones` — exactamente lo pedido. Solo faltaban las server actions y la UI de gestión, que hasta ahora no existían (Pablo solo la leía, read-only, en `/mascotas/[id]`).

2. **`app/actions/vacunaciones.ts` (nuevo):** `registrarVacunaAction`, `editarVacunaAction`, `eliminarVacunaAction`. A diferencia de `Mascota` (soft-delete), acá `eliminarVacunaAction` hace `DELETE` real — no hay ninguna otra tabla que dependa de un registro de vacunación. Las 3 verifican ownership real recorriendo la cadena `vacuna → mascota → protectora.duenioId === session.userId`.

3. **`estadoSalud` (schema, compartido):** `Mascota.estadoSalud String? @db.VarChar(280)`, migración `20260918112620_mascota_estado_salud`. Decisión explícita del usuario: **interno, solo protectora**. Confirmé con `grep` que no hay ninguna referencia a `estadoSalud` en `app/mascotas/**` — no se tocó `CAMBIOS-PARA-ADOPTANTE.md`, tal como se pidió (se evaluará más adelante si se hace parcialmente visible).

4. **UI:** nueva sección "Vacunación" colapsable por mascota, colgando de cada fila en `MascotaRow.tsx` (junto a "Editar" y "Dar de baja" que ya existían). Adentro: `EstadoSaludForm.tsx` (textarea de 280 caracteres con contador), historial ordenado por fecha de aplicación descendente vía `VacunaItem.tsx` (cada uno con "Editar" inline y "Eliminar" con confirmación), y `RegistrarVacunaForm.tsx` colapsable al final, mismo patrón que el resto del perfil.

## Archivos tocados
- `prisma/schema.prisma` (campo nuevo, compartido) + `prisma/migrations/20260918112620_mascota_estado_salud/`
- `app/actions/vacunaciones.ts` (nuevo), `app/actions/mascotas.ts` (`actualizarEstadoSaludAction`)
- `app/perfil/MascotaRow.tsx`, `app/perfil/PerfilProtectora.tsx` (incluye `vacunaciones` en la query)
- `app/perfil/VacunacionPanel.tsx`, `VacunaItem.tsx`, `RegistrarVacunaForm.tsx`, `EditarVacunaForm.tsx`, `EstadoSaludForm.tsx` (todos nuevos)

## Verificación
- `npx tsc --noEmit` y `npm run build`: ambos limpios, mismas 10 rutas.
- `grep -r "estadoSalud" app/mascotas/`: sin resultados — confirmado que no se filtra al lado adoptante.
- Contra MySQL real (cookie firmada de `fupa@gmail.com`): `/perfil` renderiza el botón "Vacunación" en las 4 mascotas. `/mascotas/[id]` de Firulais (lado público) sigue mostrando su "Libreta de vacunación" normalmente, sin ningún rastro de `estadoSalud`.
- No se probó el click real (toggle del panel, registrar/editar/eliminar una vacuna) en navegador — sin browser en este entorno, mismo límite de siempre.

## Estado
Completo según lo pedido.

## Próximo paso sugerido
Backlog de protectora: quedan "Notificaciones", "Historial de adopciones" y "Dashboard con métricas" (este último ya tiene una base parcial desde antes — 4 tiles en `/perfil`). Evaluar si/cuándo hacer visible `estadoSalud` (parcial) del lado adoptante, como quedó abierto.
