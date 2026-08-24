# Prompt — Ajustes a la Libreta de Vacunas

Este prompt corrige 3 cosas puntuales sobre lo ya implementado en la sub-tab "Vacunas" de Agenda. No romper nada de lo que ya funciona (swipe, selector superior, sub-tab Recordatorios, etc.), solo completar lo siguiente:

## 1) Faltan tipos de vacuna en el selector

Hoy el selector superior de la Libreta muestra solo "Antirrábica" y "Séxtuple". Tiene que mostrar **todas las vacunas del protocolo correspondientes a la especie de la mascota activa**, leyendo directamente de `/data/vaccine-protocols.json` (no una lista hardcodeada en el componente). Para perro son 3: Séxtuple/Quíntuple, Antirrábica, Bordetella. Para gato son 3: Triple Felina, Antirrábica, Leucemia Felina. Verificar que el filtro por `species` esté tomando correctamente la especie de la mascota activa del perfil.

## 2) Carga retroactiva de vacunas ya aplicadas, desde el Perfil

En la pestaña **Perfil**, agregar la posibilidad de cargar vacunas que la mascota ya tenía aplicadas **antes de empezar a usar la app** (por ejemplo, si el usuario adopta la app cuando su perro ya tiene 2 años y varias vacunas puestas en el pasado).

Funcionamiento esperado:
- En el Perfil, agregar una sección o botón tipo "Cargar vacunas ya aplicadas" (puede ser parte del alta inicial de la mascota, o accesible después también, editable en cualquier momento, no solo una vez).
- Debe permitir cargar varias vacunas de una sola vez (no una por una a través del formulario de Recordatorios), cada una con: nombre de vacuna (seleccionable desde el protocolo correspondiente a la especie, no texto libre) y fecha en que se aplicó.
- Cada vacuna cargada acá debe guardarse con `status: "aplicada"`, `type: "vacuna"`, `protocol_id` correspondiente, y `auto_generated: false` (fue cargada a mano por el usuario, no generada por el sistema).
- Esto debe reflejarse automáticamente en el **"Historial de dosis"** de la página correspondiente a esa vacuna dentro de la Libreta (sub-tab Vacunas de Agenda), y también recalcular la "Próxima dosis" en base a la fecha más reciente cargada, igual que si se hubiera cargado desde el formulario de Recordatorios.
- También debe aparecer reflejada en el "Historial general" (punto 3).

## 3) Los botones de historial no están implementados

Actualmente:
- El botón **"Ver historial general"** está visible pero no hace nada al tocarlo.
- Falta el botón **"Ver historial"** dentro de cada página individual de vacuna (el que muestra el timeline completo de esa vacuna puntual, no el general).

Implementar ambos:

- **"Ver historial" (por vacuna)**: agregarlo dentro de la tarjeta de cada página de vacuna (por ejemplo, junto al título "Historial de dosis"). Al tocarlo, abre una vista expandida (modal o vista completa) con el timeline vertical de todas las fechas de esa vacuna en particular, ordenadas de más antigua a más reciente, incluyendo también la próxima fecha calculada al final. Cerrar debe volver a la página de la libreta sin perder en qué vacuna estaba el usuario.

- **"Ver historial general"**: al tocarlo, debe abrir la vista cronológica combinada que ya se había definido: todas las vacunas de la mascota (de todos los tipos) mezcladas en una sola lista ordenada por fecha, distinguiendo visualmente las ya aplicadas (pasado) de las próximas/pendientes calculadas (futuro). Debe incluir automáticamente cualquier vacuna cargada desde el punto 2 (carga retroactiva).

## Verificación final
Probar con una mascota de prueba:
1. Que el selector de la Libreta muestra las 3 vacunas correspondientes a su especie.
2. Cargar desde Perfil 2-3 vacunas "ya aplicadas antes de usar la app" con fechas pasadas distintas, y confirmar que aparecen correctamente en el Historial de dosis de cada vacuna correspondiente en la Libreta, con la Próxima dosis recalculada.
3. Tocar "Ver historial" dentro de una vacuna con más de una dosis cargada y confirmar que se ve el timeline completo de esa vacuna.
4. Tocar "Ver historial general" y confirmar que aparecen todas las vacunas mezcladas y ordenadas cronológicamente, incluyendo las cargadas retroactivamente desde el Perfil.
