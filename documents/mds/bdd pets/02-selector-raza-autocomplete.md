# Prompt 2 — Selector de raza con autocompletado en el Perfil

## Rol
Actuá como desarrollador frontend en un proyecto Next.js (React) + JavaScript. Este prompt depende del dataset generado en `01-dataset-razas-y-guias.md` (`/data/breeds.json`), así que asumí que ya existe.

## Objetivo
Antes de escribir código, revisar cómo está armado actualmente el apartado **Perfil** (páginas/componentes existentes, cómo se guarda la info de la mascota hoy) y adaptarse a esa estructura. Si el perfil no persiste datos en ningún lado todavía, usar estado de React (Context o similar) como solución simple, dejando un comentario indicando dónde debería conectarse a una persistencia real en el futuro (ej. backend/DB).

Construir un componente `BreedSelector` (o el nombre que mejor encaje con las convenciones del proyecto) que se use en el Perfil para elegir la raza de la mascota, con estas características:

### Comportamiento
1. Input de texto donde el usuario empieza a tipear el nombre de la raza.
2. A medida que tipea (con debounce de ~200-300ms para no filtrar en cada tecla), se muestra un desplegable/acordeón debajo del input con las razas de `breeds.json` que matchean lo escrito.
   - El filtro de especie debe considerar el tipo de mascota ya seleccionado en el perfil (si el usuario ya indicó "perro" o "gato" en otro campo, filtrar `breeds.json` solo por esa `species`; si no hay ese campo, mostrar de ambas especies).
   - El match debe ser por substring, sin distinguir mayúsculas/minúsculas ni tildes (normalizar el texto de búsqueda y el de las razas antes de comparar).
   - Si no hay resultados, mostrar un mensaje tipo "No encontramos esa raza — vas a ver recomendaciones generales" en vez de una lista vacía.
3. El usuario debe **seleccionar una opción de la lista** con click/tap (o teclado, con navegación por flechas + Enter, por accesibilidad) para confirmar la raza. No se guarda como raza "reconocida" un texto libre que no matchea ninguna opción exacta de la lista.
4. Si el usuario escribe algo y no selecciona ninguna opción de la lista (o la raza no existe en el dataset), guardar igualmente el texto que escribió como `raw_breed_name`, pero marcar `breedId: null` — esto se usa después para activar el fallback de recomendaciones generales.
5. Si selecciona una raza de la lista, guardar `breedId` (el `id` del objeto de `breeds.json`) junto con el nombre.

### Estado a persistir en el perfil de la mascota
```json
{
  "breedId": "labrador-retriever",
  "breedName": "Labrador Retriever",
  "species": "dog"
}
```
o, si no matcheó ninguna raza:
```json
{
  "breedId": null,
  "breedName": "texto que escribió el usuario",
  "species": "dog"
}
```

### UI/UX
- Mantener el estilo visual y componentes ya usados en el resto del proyecto (revisar si hay una librería de UI en uso, ej. Tailwind, y respetar esas convenciones).
- El desplegable debe ser accesible: cerrar con Escape, click afuera lo cierra, navegación con teclado.
- Mostrar un pequeño ícono o texto distinto cuando la raza fue reconocida (ej. check verde) vs cuando quedó como texto libre no reconocido.

## Verificación final
Probar manualmente tipeando una raza que existe (ej. "Labrador") y una que no existe (ej. "Perro Callejero"), confirmando que en el segundo caso igual se puede guardar el perfil.
