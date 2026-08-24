# Prompt 1D — Integrar dataset ya generado (no redactar de nuevo)

## Contexto
Los archivos `breeds.json` y `guides.json` ya vienen completos y listos, generados fuera de esta sesión. Los adjunto en la carpeta `data-para-gemini/`.

## Tarea
1. Copiar `data-para-gemini/breeds.json` a `/data/breeds.json`, **reemplazando por completo** el archivo actual (no combinar, no fusionar con lo que ya había — este archivo ya contiene todo).
2. Copiar `data-para-gemini/guides.json` a `/data/guides.json`, **reemplazando por completo** el archivo actual.
3. No modificar el contenido de ninguno de los dos archivos (títulos, textos, tags, ids): ya están redactados con el tono cálido definido y validados para que cada tag de `breeds.json` tenga su guía correspondiente en `guides.json`.
4. Revisar el resto del código (selector de raza, lógica de recomendaciones) y confirmar que sigue funcionando correctamente con esta nueva versión de los datos — el schema de campos (`id`, `name`, `species`, `health_tags` en breeds; `id`, `title`, `species`, `tags`, `content` en guides) es el mismo que ya se usaba, solo que ahora con muchas más razas. Nota: `breeds.json` incluye además un campo extra `fci_group_or_category` (informativo, no es necesario usarlo en el código, pero no lo borres del archivo).

## Verificación final
Correr la app y confirmar en la terminal:
- Cantidad total de razas cargadas (debería ser 197: 152 de perro, 45 de gato).
- Que el selector de raza en el Perfil ahora muestra ese universo completo de opciones al tipear.
- Que elegir, por ejemplo, "Bulldog Francés" o "Maine Coon" en el perfil, muestra en Guías las recomendaciones correctas según sus `health_tags`.
