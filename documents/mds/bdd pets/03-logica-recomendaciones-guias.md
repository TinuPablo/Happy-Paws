Prompt 3 — Conectar la raza elegida con las recomendaciones en Guías

Rol

Actuá como desarrollador full-stack en un proyecto Next.js + JavaScript. Este prompt depende de los dos anteriores: necesita /data/breeds.json y /data/guides.json (del prompt 1), y el perfil con breedId/species ya seleccionable (del prompt 2).

Objetivo

Antes de escribir código, revisar cómo está armado hoy el apartado Guías (página/componente actual, cómo lista el contenido) y adaptarse a esa estructura en vez de reescribirla desde cero.

Crear la lógica que, dado el perfil de la mascota activa, determine qué guías mostrarle.

1) Función utilitaria

Crear un archivo de utilidades (ej. /lib/recommendations.js o donde correspondan las utilidades del proyecto) con una función:

jsgetRecommendedGuides({ breedId, species }, breeds, guides)

Lógica:


Si breedId no es null y existe en breeds.json:

Buscar ese objeto de raza y tomar su health_tags.
Filtrar guides.json devolviendo las guías cuyo array tags tenga intersección con health_tags, y cuyo species incluya la especie de la mascota.



Si breedId es null (raza no reconocida) o no se encuentra en breeds.json:

Devolver las guías con tag general correspondientes a la species de la mascota (fallback).



Si no hay ninguna mascota/perfil cargado todavía, devolver un array vacío (o las guías general de ambas especies, lo que tenga más sentido con el resto de la app — usar criterio según cómo esté armado el flujo de "mascota activa" hoy).


2) Integración en el apartado Guías

En la página/componente de Guías:


Obtener el perfil de la mascota activa (de donde sea que se esté leyendo hoy: contexto, estado global, etc.).
Llamar a getRecommendedGuides con esos datos.
Mostrar primero las guías recomendadas (destacadas, ej. con un badge o encabezado cálido tipo "Recomendado para tu [nombre de la raza] 🐾" — usar el nombre de la mascota si está disponible en el perfil, ej. "Recomendado para tu Rocky", para que se sienta aún más personal), y debajo el resto del contenido de guías que ya exista en la app (si lo hay), sin romper lo que ya está andando.
Todo el copy de esta sección (títulos, badges, mensajes de fallback) debe seguir el mismo tono cálido y cercano que las guías del dataset: transmitir confianza y calidez, nunca sonar clínico ni alarmante.
Si se está usando el fallback general (raza no reconocida), mostrar un texto breve y amigable aclarando que son recomendaciones generales (ej. algo como "Todavía no tenemos info específica de su raza, pero acá van algunos consejos que le van a encantar 🐶"), sin sonar a error ni a limitación del sistema.


3) Disclaimer

Agregar, en un lugar visible de la sección Guías (ej. arriba de la lista), un texto corto aclarando que las recomendaciones son de carácter general/informativo y no reemplazan una consulta veterinaria.

Verificación final

Probar con un perfil de raza reconocida (ej. Pug) y confirmar que aparecen las guías de sus health_tags correspondientes. Probar con una raza no reconocida y confirmar que aparecen las guías general según la especie. Confirmar que no se rompió ningún contenido de Guías que ya existiera antes de este cambio.