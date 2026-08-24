Prompt 1 (v2) — Generar dataset de razas y guías (todas las razas + tono cálido)

Rol

Actuá como desarrollador full-stack encargado de crear el dataset base de un feature de recomendaciones para una app de mascotas hecha en Next.js/Node.js, sin base de datos (todo en archivos JSON locales).

Objetivo

Crear (o regenerar si ya existen) dos archivos de datos en /data:


/data/breeds.json
/data/guides.json


1) /data/breeds.json

Generar un array con todas las razas de perro y gato reconocidas (referencia: nomenclatura FCI para perros —incluyendo razas no-FCI ampliamente reconocidas si corresponde—, y las razas reconocidas por CFA/FIFe/TICA para gatos).

Como es un volumen grande (varios cientos de razas), generalo en tandas dentro de este mismo prompt (por ejemplo, por grupo FCI para perros, y por asociación para gatos), asegurando no cortar la lista a mitad de camino ni resumir/omitir razas por practicidad. Si en algún punto no se puede completar todo en una sola ejecución, dejar un archivo /data/breeds-pending.json con las razas que falten, para completarlas en una segunda pasada.

Cada raza es un objeto con este schema exacto:

json{
  "id": "labrador-retriever",
  "name": "Labrador Retriever",
  "species": "dog",
  "health_tags": ["displasia_cadera", "displasia_codo", "obesidad", "problemas_oculares"]
}

Reglas:


id: slug único en minúsculas, sin espacios ni tildes (usar guiones).
species: solo "dog" o "cat".
health_tags: lista de 2 a 5 tags que representen predisposiciones o cuidados reales y conocidos de esa raza (no inventar condiciones; si hay dudas sobre una raza poco documentada, usar tags más genéricos en vez de inventar algo específico).
Vocabulario de tags cerrado y reutilizable: antes de asignar tags, arma (o reutiliza si ya existe) una lista fija de tags válidos y usa siempre esos mismos nombres entre razas distintas. No crear un tag exclusivo para una sola raza salvo que sea estrictamente necesario. Partir de esta base y ampliarla solo si hace falta: displasia_cadera, displasia_codo, braquicefalico, problemas_respiratorios, problemas_piel, problemas_oculares, problemas_cardiacos, obesidad, problemas_dentales, mielopatia_degenerativa, alergias, problemas_articulares, enfermedad_renal, sensibilidad_calor, sensibilidad_frio, ansiedad_separacion, alto_nivel_energia, problemas_columna, enfermedad_poliquistica_renal, problemas_urinarios.


2) /data/guides.json

Generar un array de guías de contenido, una por cada tag del vocabulario final usado en breeds.json (así toda raza queda cubierta por al menos una guía), más las guías generales de fallback.

json{
  "id": "guia-displasia-cadera",
  "title": "Cuidando sus caderas con amor 🐾",
  "species": ["dog"],
  "tags": ["displasia_cadera"],
  "content": "Texto cálido en 2-4 frases, en español, con consejos prácticos."
}

Reglas de tono (MUY IMPORTANTE, aplican a título y contenido)

La app busca transmitir confianza y calidez, nunca alarma ni diagnóstico. Seguir estos criterios:


Títulos: cálidos, cercanos, que den ganas de leer. Evitar formulaciones clínicas o que suenen a que la mascota ya tiene el problema (ej. evitar "Displasia de cadera: qué vigilar y cómo prevenir"; preferir algo como "Cuidando sus caderas con amor 🐾"). Se puede usar algún emoji suave si va con el tono general de la app.
Contenido: hablarle directo al dueño ("tu compañero", "tu peludo"), en tono positivo y de acompañamiento, no de advertencia. Presentar la condición como algo a "tener en cuenta y cuidar con cariño", no como un riesgo inminente. Dar 1-2 consejos prácticos y accionables.
Cierre de cada guía: incluir una aclaración de que es información general y que el veterinario es la mejor referencia, pero variar la redacción de esta frase entre guías (no repetir siempre "Esta información es general y no reemplaza una consulta veterinaria" textual) para que no se sienta repetitivo si el usuario lee varias guías seguidas.
Nunca usar lenguaje que suene a diagnóstico, urgencia o alarma (evitar palabras como "grave", "riesgo alto", "peligro").


Fallback general

Crear también las guías generales, con tag general, una para species: ["dog"] y otra para species: ["cat"], con el mismo tono cálido, cubriendo alimentación, chequeos veterinarios, ejercicio e higiene.


No copiar textos de ninguna fuente externa (páginas, wikis, etc.) — redactar contenido 100% original.


Verificación final

Al terminar, listar en la terminal:


Cuántas razas de perro y cuántas de gato se generaron en total.
Cuántos tags distintos se usaron en health_tags (debe ser una lista razonablemente acotada y reutilizada, no cientos de tags únicos).
Cuántas guías se generaron.
Confirmar que todo health_tag usado en breeds.json tiene al menos una guía correspondiente en guides.json.
Si quedó algo pendiente en breeds-pending.json, indicarlo explícitamente.