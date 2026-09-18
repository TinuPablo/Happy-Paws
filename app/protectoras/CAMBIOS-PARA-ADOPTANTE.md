# Cambios que afectan al lado adoptante o archivos compartidos

Cada vez que yo (Daniel) modifique algo que impacte:
- archivos compartidos (prisma/schema.prisma, app/actions/solicitudes.ts, 
  app/layout.tsx, app/globals.css, app/components/**, lib/session.ts), o
- algo que el lado adoptante debería saber (ej: cambio de estructura de datos, 
  nuevo campo, endpoint nuevo, migración)

Agregá una entrada acá con fecha, qué cambió, y qué necesita hacer Pablo 
(ej: "pull + npx prisma migrate dev").

---

## 2026-09-18 — Nuevo campo `Mascota.activo` (soft-delete de mascotas)

**Qué cambió:** agregué `activo Boolean @default(true)` al modelo `Mascota` en `prisma/schema.prisma` (migración `20260918111217_mascota_activo_soft_delete`, rama `feature/perfil-protectora`, **todavía no pusheada a origin** — avisame cuando la suba). Ahora las protectoras pueden "dar de baja" una mascota desde `/perfil`, lo que pone `activo: false` (nunca se borra la fila — quedan intactas las vacunaciones y solicitudes ya vinculadas).

**Qué necesitás hacer vos (Pablo):**
1. `git pull` (cuando avise que la rama está pusheada) + `npx prisma migrate dev` en tu base local.
2. **Sumar `activo: true` a los `where` de mascota en tus 4 queries**, porque hoy ninguna lo filtra y una mascota dada de baja seguiría apareciendo:
   - `app/page.tsx` (landing, destacadas — 2 queries con `ESTADOS_DISPONIBLE`)
   - `app/mascotas/page.tsx` (catálogo — el `where` que arma `especie`/`tamanio`)
   - `app/mascotas/[id]/page.tsx` (ficha — acá recomiendo que si `activo === false` la página devuelva "no encontrada", a diferencia de `ADOPTADO` que sí se deja ver como registro histórico)
   - `app/actions/solicitudes.ts` → `crearSolicitudAction` (las 2 queries de mascota: la que busca la mascota puntual y la que arma "disponibles" para el % de recomendación del quiz)

No toqué ninguno de esos 4 archivos (son tuyos) — solo te dejo la lista para que decidas cómo integrarlo.
