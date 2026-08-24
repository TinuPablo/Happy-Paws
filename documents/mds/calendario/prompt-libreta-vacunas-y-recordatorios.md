# Prompt — Pestaña "Agenda": Libreta de Vacunas (swipe) + Recordatorios (con hora)

## Contexto importante (leer antes de tocar código)

La pestaña ya fue renombrada de "Vacunas" a **"Agenda"** en el bottom nav, y ya existe dentro de ella:
- Formulario "Programar Recordatorio": nombre, selector "Tipo" (Vacuna / Visita al veterinario / Medicamento / Otro), fecha programada, botón "Guardar Recordatorio".
- Botón "Ver calendario".
- Lista "Próximos Recordatorios".
- Un título "Libreta de Vacunas" con placeholder "Vista de Libreta en construcción..." (esto es lo que hay que reemplazar por la implementación real en este prompt).

**No romper nada de lo que ya funciona.** Este prompt define cómo organizar todo esto y completa la parte de la Libreta que quedó pendiente.

## 1) Estructura de navegación dentro de "Agenda"

Dividir la pantalla de "Agenda" en **dos sub-tabs** (navegación interna, tipo pestañas secundarias arriba del contenido, debajo del header "Agenda"):

1. **"Vacunas"** → la nueva vista tipo libreta (detallada en el punto 2).
2. **"Recordatorios"** → todo lo que ya existe hoy (formulario, calendario, próximos), sin cambios de lógica salvo el agregado del punto 3 (hora).

## 2) Sub-tab "Vacunas" — Libreta de Vacunación

Reemplazar el placeholder "Vista de Libreta en construcción..." por una experiencia de libreta real:

### Selector/índice superior
Una fila horizontal arriba de la página de la libreta, con el nombre (o ícono + nombre corto) de cada vacuna del protocolo correspondiente a la especie de la mascota (desde `vaccine-protocols.json`). Tocar un nombre lleva directo a esa página, sin tener que deslizar una por una. Marcar visualmente cuál es la página actualmente activa (ej. subrayado o color distinto).

### Página de la libreta (una vacuna a la vez)
Diseño tipo tarjeta grande, con estética de "hoja de carnet":
- Nombre de la vacuna arriba, grande.
- Debajo, el historial de fechas en que se aplicó esa vacuna (buscando en los recordatorios con `type: "vacuna"`, `protocol_id` coincidente, `status: "aplicada"`), listadas en orden cronológico. Si nunca se aplicó, mostrar un texto tipo "Todavía no se registró ninguna dosis 🐾".
- Debajo del historial, un renglón destacado "Próxima: [fecha]" con la fecha ya calculada por el sistema existente, o "A definir con tu veterinario" si no hay una calculada.
- Sin flechas visibles en la UI (el desplazamiento es solo mediante gesto).

### Navegación por gesto (swipe)
Permitir deslizar el dedo hacia la izquierda o derecha sobre la página activa para pasar a la vacuna anterior/siguiente según el orden del selector superior (que a su vez debe scrollear/actualizarse para reflejar cuál está activa). Implementar con manejo táctil estándar (touch events / librería liviana ya usada en el proyecto si existe alguna para swipe; si no hay ninguna, implementar detección simple de swipe con touch events nativos, sin agregar una dependencia pesada solo para esto).

### Botón "Ver historial"
Un botón en la parte superior de cada página (junto al nombre de la vacuna) que abre una vista expandida tipo timeline vertical, mostrando **todas** las fechas de esa vacuna en orden cronológico (aplicadas en el pasado, apiladas de más antigua a más reciente) y, al final, la próxima fecha calculada (y cualquier refuerzo futuro adicional si el sistema ya los calcula). Cerrar esta vista debe volver a la página normal de la libreta sin perder en qué vacuna estaba parado el usuario.

## 3) Sub-tab "Recordatorios" — agregar hora

En el formulario "Programar Recordatorio" ya existente, agregar un campo de **hora** junto al de fecha (ej. un input tipo `time` al lado o debajo del `date` ya existente), para que un recordatorio quede con fecha **y** hora (ej. "lunes 14/07/2026 a las 09:00" para la pastilla o gota de un medicamento).

- Este campo es opcional pero recomendado especialmente cuando el tipo elegido es "Medicamento" (se puede mostrar un placeholder o sugerencia tipo "¿A qué hora? (opcional)" para no obligar a completarlo si el usuario no lo necesita, por ejemplo, para una vacuna donde la hora no importa tanto).
- Actualizar la estructura de datos para incluir el campo `time` (string tipo `"HH:mm"` o `null` si no se especificó).
- En la lista "Próximos Recordatorios" y en el calendario, si el recordatorio tiene hora cargada, mostrarla junto a la fecha (ej. "14/07/2026 · 09:00hs").
- Si el sistema de notificaciones ya programa la alerta según la fecha, ajustarlo para que, si hay hora cargada, dispare la notificación a esa hora específica del día en vez de a una hora por defecto.

## 4) Tono y diseño

Mantener el estilo visual ya usado (colores marrones/cálidos, tipografía y componentes ya definidos en el proyecto). Que la Libreta se sienta cálida y prolija, como un objeto que da gusto mirar — no una tabla fría de datos.

## 5) Aviso anticipado en la pestaña "Inicio"

Cuando a una vacuna le falten **14 días o menos** para su fecha "Próxima" calculada, mostrar un aviso/recordatorio visible en la pestaña **Inicio** (no solo dentro de Agenda), para que el dueño lo vea apenas abre la app sin tener que entrar a buscarlo.

- Formato sugerido: una tarjeta o banner breve, tono cálido y no alarmante (ej. "En 10 días le toca la Antirrábica a [nombre de la mascota] 🐾"), con un link/botón que lleve directo a la sub-tab "Vacunas" de Agenda, a la página de esa vacuna en particular.
- Si hay más de una vacuna dentro de esa ventana de 14 días al mismo tiempo, mostrar todas (apiladas o como una lista corta), no solo la más próxima.
- Si no hay ninguna vacuna dentro de esos 14 días, no mostrar nada en Inicio (no ocupar espacio con un estado vacío innecesario ahí).
- Revisar cómo está armada hoy la pantalla de Inicio y adaptar el aviso a esa estructura existente, sin romper lo que ya se muestra ahí.

## 6) Historial general (todas las vacunas juntas, cronológico)

Además del botón "Ver historial" que ya existe dentro de cada página individual de vacuna (que muestra el historial de esa vacuna puntual), agregar un botón aparte, visible en la sub-tab "Vacunas" (por ejemplo, arriba del todo, junto al selector de vacunas, o como un ícono adicional), que abra una vista de **"Historial general"**.

Esta vista muestra **todas las vacunas de la mascota mezcladas en una sola línea de tiempo cronológica**, sin separar por tipo de vacuna, por ejemplo:

```
Antirrábica       01/02/2021
Triple Felina     01/02/2021
Séxtuple          05/08/2022
Antirrábica       03/02/2026   ← próximo refuerzo calculado (pendiente)
```

- Incluir tanto las dosis ya **aplicadas** (con su fecha real) como las **pendientes/futuras ya calculadas** por el sistema (refuerzos que aún no se aplicaron), distinguiendo visualmente cuáles son pasado y cuáles son futuro (ej. las pendientes con un color o ícono distinto, o agrupadas bajo un subtítulo "Ya aplicadas" / "Próximas").
- Ordenar todo estrictamente por fecha, de más antigua a más reciente.
- Esta lista debe actualizarse sola a medida que se van cargando nuevas vacunas desde el formulario o desde la libreta (no debe requerir mantenimiento manual).

## Verificación final
Probar:
1. Que el selector superior de la Libreta permite saltar directo a cualquier vacuna sin deslizar.
2. Que deslizar con el dedo sobre la página activa cambia correctamente a la vacuna anterior/siguiente.
3. Que "Ver historial" (dentro de una vacuna) muestra el timeline completo y correcto de esa vacuna con múltiples dosis aplicadas.
4. Que se puede cargar un recordatorio de tipo "Medicamento" con fecha y hora, y que aparece correctamente reflejado en la lista y el calendario con ambos datos.
5. Que la sub-tab "Recordatorios" sigue funcionando exactamente igual que antes en todo lo demás.
6. Que, con una vacuna a 10 días de su fecha próxima, aparece el aviso correspondiente en la pestaña Inicio, y que desaparece si no hay ninguna vacuna dentro de esa ventana de 14 días.
7. Que el botón "Historial general" muestra correctamente todas las vacunas de todos los tipos mezcladas y ordenadas por fecha, incluyendo tanto aplicadas como pendientes futuras.
