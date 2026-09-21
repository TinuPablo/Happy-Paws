# Rehacer animación perro/gato con huellas + intervalo de huellitas a 10s

**Fecha:** 2026-09-18
**Rama:** `feature/perfil-protectora`
**Backlog:** no corresponde a ningún ítem — segunda corrección sobre las mejoras visuales.

## Qué se hizo

1. **`PawBump.tsx` rehecho:** las siluetas de perro/gato con orejas se perdían a tamaño chico ("dos manchas marrones sin forma reconocible", reportado por el usuario). Se presentó un boceto de reemplazo (reusar la misma huella sólida ya validada en `HeaderPawSteps.tsx`) y, confirmado, se implementó: 2 huellas — gato en `--brown-mid` (más clara), perro en `--brown-dark` (más oscura), 30px cada una — que se acercan desde lados opuestos y hacen un "punch" (`scale(1) → scale(1.15) → scale(1)`) en el instante del contacto en vez de solo superponerse, con el flash dorado ya existente.
2. **`SolidPawIcon.tsx` extraído** a `app/components/` (compartido) para no duplicar el SVG de la huella entre `HeaderPawSteps.tsx` y `PawBump.tsx` — ambos ahora importan la misma forma.
3. **Intervalo de las huellitas del header:** 20s → 10s (`PAW_STEPS_INTERVAL_MS` en `Navbar.tsx`).

## Archivos tocados
- `app/perfil/PawBump.tsx` (reescrito)
- `app/components/SolidPawIcon.tsx` (nuevo, compartido)
- `app/components/HeaderPawSteps.tsx` (usa el componente compartido)
- `app/components/Navbar.tsx` (intervalo)
- `app/globals.css` (compartido — `@keyframes paw-bump-dog`/`-cat` ahora incluyen el punch de escala)

No se agregó entrada nueva en `CAMBIOS-PARA-ADOPTANTE.md`: son ajustes sobre archivos ya avisados en entradas anteriores, mismo comportamiento para Pablo (sigue sin afectar la vista de adoptante, confirmado de nuevo).

## Verificación
- `npx tsc --noEmit` y `npm run build`: limpios, mismas 12 rutas.
- Contra MySQL real (cookie de `fupa@gmail.com`): 6 almohadillas de huella en el HTML servido (4 del header + 2 del `PawBump`), clases `paw-bump-dog`/`paw-bump-cat`/`paw-bump-flash` presentes.
- Cookie de adoptante: cero rastro de `paw-bump`, confirmado que sigue sin impacto.
- Sigue sin poder verse la animación reproducirse en vivo — mismo límite de siempre (sin browser en este entorno).

## Estado
Completo según lo pedido y confirmado por el usuario ("seguí").

## Próximo paso sugerido
Que el usuario confirme en su navegador que las huellas se entienden bien esta vez. Si sigue sin verse claro, la alternativa que quedó anotada es sacar la animación del todo y dejar solo el saludo.
