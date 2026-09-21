# Botón de derechos de autor en /perfil

**Fecha:** 2026-09-21
**Rama:** `feature/reorganizar-perfil-adopciones`
**Backlog:** ítem nuevo tildado en `app/protectoras/BACKLOG-protectora.md` → "Perfil de la protectora"

## Qué se hizo

Pedido directo del usuario: "un botón de derechos de reserva de autores de formato legal, como en cualquier app".

1. **`app/legal/page.tsx` (nueva):** aviso de derechos reservados con 3 bloques — Propiedad intelectual (código/marca/diseños), Uso de la plataforma (adaptado a lo que hace hoy Happy Paws, no a la versión vieja de mascota virtual/localStorage), Marcas y contenido de terceros (fotos/datos que cargan las protectoras). **Es texto estándar tipo boilerplate, no redactado por un abogado ni revisado por el dueño real del proyecto** — mismo motivo por el que el backlog de `AGENTS.md` sigue teniendo pendiente "Página de términos/privacidad reales". Sirve como placeholder razonable, no como documento legal definitivo. Queda anotado en un comentario en el propio archivo para que quede claro en el código, no solo acá.
2. Botón "Derechos de autor" (ícono `Gavel` de lucide-react) agregado al final de `PerfilProtectora.tsx`, como card propia.

No se tocó ningún archivo compartido ni de Pablo — `/legal` es una ruta nueva, independiente.

## Archivos tocados
- `app/legal/page.tsx` (nuevo)
- `app/perfil/PerfilProtectora.tsx` (botón nuevo)

## Verificación
- `npx tsc --noEmit` y `npm run build`: limpios, 17 rutas (`/legal` nueva).
- Contra MySQL real: `/perfil` de FUPA muestra el botón "Derechos de autor"; `/legal` responde 200 con los 3 bloques de texto.

## Estado
Completo según lo pedido.

## Próximo paso sugerido
Si en algún momento se redacta contenido legal real (términos/privacidad), reemplazar el texto placeholder de `/legal` en vez de crear una página aparte — ya está la estructura armada. Evaluar si Pablo quiere el mismo botón en `PerfilAdoptante.tsx` (no se tocó ese archivo, es su dominio).
