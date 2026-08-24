# Overview del feature: Recomendaciones por raza

## Contexto general (leer antes de ejecutar cualquier prompt)

Esta app está hecha en **Next.js + Node.js + JavaScript**. No hay base de datos: toda la data persistente vive en archivos locales dentro del repo (JSON).

El objetivo del feature: en el apartado **Perfil**, el usuario elige la raza de su mascota (perro o gato) usando un selector con autocompletado. Según la raza elegida, el apartado **Guías** debe mostrar recomendaciones relevantes a esa raza (por ejemplo: Pug → cuidados respiratorios/braquicefálicos; Ovejero Alemán → displasia de cadera). Si el usuario escribe una raza que no está en nuestro dataset, se deben mostrar recomendaciones generales (por especie) en vez de nada.

## Orden de ejecución

Ejecutar los prompts en este orden, cada uno en su propio md:

1. **01-dataset-razas-y-guias.md** — genera los datos base (`breeds.json`, `guides.json`) con las razas, sus tags de salud, y las guías de contenido. Es la base de todo lo demás, hay que correrlo primero.
2. **02-selector-raza-autocomplete.md** — construye el componente de selección de raza con autocompletado en el Perfil, usando el dataset generado en el paso 1.
3. **03-logica-recomendaciones-guias.md** — conecta la raza elegida con el apartado Guías, mostrando las recomendaciones correspondientes (o las generales si la raza no está reconocida).

## Reglas transversales (aplican a los 3 prompts)

- No usar ninguna API externa ni paga. Todo el contenido debe vivir en archivos locales del repo.
- No hay base de datos: usar JSON en `/data`.
- Antes de crear un archivo o componente nuevo, revisar la estructura actual del repo (carpetas de páginas, componentes, estilos) y adaptarse a las convenciones que ya existan en el proyecto, en vez de imponer una estructura nueva desde cero.
- El contenido de salud/cuidados debe presentarse siempre como información general y orientativa, no como diagnóstico ni reemplazo de una consulta veterinaria. Incluir un disclaimer breve en la sección de Guías.
- Idioma de todo el contenido visible para el usuario: español.
