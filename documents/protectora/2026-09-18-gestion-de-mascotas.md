# Gestión de mascotas: alta (fotos reales), edición, cambio de estado, baja

**Fecha:** 2026-09-18
**Rama:** `feature/perfil-protectora`
**Backlog:** ítems tildados en `app/protectoras/BACKLOG-protectora.md` → "Gestión de mascotas" (los 4)

## Qué se hizo

1. **Schema (compartido, avisado a Pablo en `CAMBIOS-PARA-ADOPTANTE.md`):** se agregó `Mascota.activo Boolean @default(true)` (migración `20260918111217_mascota_activo_soft_delete`). Decisión explícita del usuario: soft-delete siempre, nunca `DELETE` real — hay vacunaciones y solicitudes de adopción que pueden estar vinculadas a la mascota.

2. **Listado de gestión nuevo en `/perfil`:** antes `PerfilProtectora.tsx` solo mostraba un contador ("4 mascotas publicadas"), sin forma de seleccionar una mascota puntual. Se agregó `MascotaRow.tsx` (una fila por mascota, con thumbnail, badge de estado y las 3 acciones) debajo del formulario de alta.

3. **Alta:** ya existía (`addMascotaAction`), sin cambios funcionales — solo se le aplicó el fix de fotos (ver punto 5).

4. **Edición:** nueva `editarMascotaAction` + `EditarMascotaForm.tsx` (mismos campos que el alta, precargados). Se abre/cierra por mascota desde su fila en el listado.

5. **Fotos reales:** tanto el alta como la edición usaban `URL.createObjectURL` (blob de sesión, se perdía al recargar) — se cambió a `FileReader.readAsDataURL` (base64 persistido en `Mascota.mediaUrl`), mismo fix que ya se había aplicado al logo de la protectora.

6. **Cambio de estado:** selector (`<select>` + botón "Actualizar", sin JS extra) con los 5 valores del enum `EstadoMascota` (`EN_PROTECTORA`/`EN_TRANSITO`/`EN_PROCESO`/`ADOPTADO`/`FALLECIDO` — se expusieron los 5, no solo los 3 pedidos originalmente, ya que no costaba nada agregarlos). Nuevo helper `estadoMascotaBadge.ts` para el label/color de cada estado. **No hizo falta tocar nada del lado adoptante**: `/mascotas` (catálogo de Pablo) ya filtraba `estado != ADOPTADO` desde antes, así que una mascota que pasa a "Adoptada" ya desaparece sola del catálogo sin cambios adicionales.

7. **Baja (soft-delete):** `darDeBajaMascotaAction`, con confirmación (`window.confirm`) antes de ejecutar. Pone `activo: false`, nunca borra la fila. El listado de gestión de la protectora sigue mostrando las mascotas dadas de baja (marcadas "Dada de baja", sin acciones) para que quede registro; el dashboard (total/disponibles) sí las excluye del conteo.

8. **Seguridad:** las 3 acciones nuevas (editar/cambiar estado/baja) verifican ownership real — `mascotaDePropiedad()` confirma que la mascota pertenece a una protectora cuyo `duenioId` es el de la sesión, no solo el rol. Evita que alguien edite/cambie/dé de baja una mascota ajena forzando el id en el formulario.

## Archivos tocados
- `prisma/schema.prisma` (campo nuevo) + `prisma/migrations/20260918111217_mascota_activo_soft_delete/`
- `app/actions/mascotas.ts` (3 actions nuevas + helper de ownership)
- `app/perfil/PerfilProtectora.tsx` (listado nuevo, dashboard filtra por `activo`)
- `app/perfil/MascotaRow.tsx` (nuevo), `app/perfil/EditarMascotaForm.tsx` (nuevo), `app/perfil/estadoMascotaBadge.ts` (nuevo)
- `app/perfil/AgregarMascotaForm.tsx` (fix de fotos a base64)

## Sin tocar (dominio de Pablo)
`app/mascotas/**`, `app/page.tsx`, `app/actions/solicitudes.ts` — **pendiente que Pablo sume el filtro `activo: true`** en sus queries, documentado con el detalle exacto de los 4 lugares en `app/protectoras/CAMBIOS-PARA-ADOPTANTE.md`.

## Verificación
- `npx tsc --noEmit`: sin errores.
- `npm run build`: compiló limpio, mismas 10 rutas.
- Probado contra MySQL real con cookie de sesión firmada para `fupa@gmail.com`: `/perfil` renderiza las 4 mascotas del seed, cada una con sus 3 acciones (`Actualizar` ×4, `Dar de baja` ×4, `Editar` ×4).
- No se pudo probar el click real (confirm de baja, toggle de edición, submit de formularios) en un navegador — sin herramienta de browser en este entorno, mismo límite que otras entradas del proyecto.

## Estado
Completo según lo pedido, con la salvedad de verificación visual real de siempre.

## Próximo paso sugerido
Que Pablo sume el filtro `activo: true` en sus 4 lugares. Decidir si se quiere UI para "reactivar" una mascota dada de baja (hoy no existe, no se pidió). Seguir con "Vacunación" del backlog.
