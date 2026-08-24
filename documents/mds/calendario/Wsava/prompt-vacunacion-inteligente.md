# Prompt — Calendario de vacunación inteligente (aplicadas vs. pendientes)

## Contexto del sistema actual
La app ya tiene un sistema de vacunación funcionando: estado `vaccines` (array de `{ id, name, date }`) en el componente principal, persistido en `localStorage`, con formulario para agendar, calendario visual, lista de próximas vacunas con días restantes, notificaciones al agendar, y opción de eliminar. Todo esto sigue existiendo y **no hay que romperlo** — este prompt extiende ese sistema, no lo reemplaza.

Antes de tocar código, revisar cómo está armado hoy el componente principal y el flujo de perfil de mascota, para integrar los cambios respetando esa estructura.

## Objetivo del nuevo feature

Que el sistema conozca el **protocolo real de vacunación** (qué vacunas existen, a qué edad se aplican, cada cuánto se refuerzan) y lo cruce con lo que el usuario va cargando, para:

1. En el alta del perfil de la mascota, preguntar si ya tiene vacunas aplicadas.
2. Si el usuario indica que sí tiene, permitirle cargar cuáles y cuándo se aplicaron.
3. Si el usuario indica que no tiene ninguna (o es un cachorro/gatito recién llegado), generar automáticamente el calendario de vacunación desde cero según su edad y especie.
4. A partir de ahí, mantener un registro claro de qué vacunas están **aplicadas** y cuáles están **pendientes**, calculando automáticamente la fecha de la próxima dosis de cada vacuna según el protocolo (ej. si se aplica la antirrábica hoy, calcular y agendar automáticamente el refuerzo a los 12 meses).

## 1) Dataset de protocolos

Usar el archivo adjunto `vaccine-protocols.json` (incluido en esta carpeta), copiándolo a `/data/vaccine-protocols.json` sin modificar su contenido. Contiene, para perro y gato, cada vacuna con:
- `category`: `"core"` (esencial) o `"non-core"` (recomendada según estilo de vida).
- `puppy_series`: dosis de cachorro/gatito con rango de edad en semanas para cada una.
- `booster_after_puppy_series_months`: a los cuántos meses va el primer refuerzo después de completar la serie inicial.
- `annual_booster_after_months`: cada cuántos meses se repite el refuerzo de por vida (en este dataset, siempre 12 = anual, acorde a la normativa y práctica veterinaria argentina).
- `adult_unknown_history_protocol`: texto guía para cuando la mascota es adulta y no se conoce su historial.

## 2) Cambios en el perfil de mascota (alta)

Al crear el perfil de una mascota nueva, agregar un paso que pregunte:

> "¿Tu mascota ya tiene vacunas aplicadas?"

- **Si responde que no**: usar la fecha de nacimiento o edad aproximada cargada en el perfil (si no existe ese campo todavía, agregarlo, es necesario para este cálculo) junto con la especie, y generar automáticamente el calendario completo de vacunas `core` pendientes según `vaccine-protocols.json` (ej. si es un cachorro de 7 semanas, generar las 3 dosis de la serie de cachorro con sus rangos de edad correspondientes, más la antirrábica cuando corresponda). Estas quedan como vacunas **pendientes**, no aplicadas.
- **Si responde que sí**: mostrar un formulario simple para cargar qué vacunas ya tiene y en qué fecha se aplicó cada una (usando los nombres del dataset, con un selector, no texto libre). Con esos datos:
  - Marcar esas vacunas como **aplicadas**.
  - Calcular automáticamente cuándo corresponde la próxima dosis de cada una (según `booster_after_puppy_series_months` o `annual_booster_after_months`, según corresponda) y agregarla como vacuna **pendiente** en el sistema existente de `vaccines` (reutilizando ese mismo array/estructura para que aparezca en el calendario y notificaciones que ya existen).
  - Para las vacunas `core` que el usuario no marcó como aplicadas, generar igual su calendario pendiente correspondiente según edad.

## 3) Registro de nuevas vacunas aplicadas (flujo ya existente + nueva lógica)

Cuando el usuario agrega una vacuna nueva desde el formulario ya existente:
- Si el nombre de la vacuna coincide con una del dataset de protocolos, además de guardarla como aplicada:
  - Calcular automáticamente la fecha del próximo refuerzo según el protocolo.
  - Agregar esa fecha futura como una nueva entrada pendiente en el sistema de `vaccines` (con algún indicador visual de que es un refuerzo generado automáticamente, no cargado a mano), para que aparezca en el calendario y dispare su propia notificación cuando corresponda.
- Si el nombre no coincide con ninguna del dataset (vacuna no reconocida o personalizada), guardarla igual como hasta ahora, sin generar refuerzo automático.

## 4) Estado de cada vacuna: aplicada vs. pendiente

Extender la estructura de datos de cada vacuna (sin romper lo que ya existe) para incluir un estado, por ejemplo:

```js
{
  id: "uuid",
  name: "Antirrábica",
  date: "2026-08-15",
  status: "aplicada" | "pendiente",
  auto_generated: true | false,
  protocol_id: "antirrabica" | null
}
```

En la interfaz:
- La lista de "Próximas vacunas" debe distinguir visualmente las pendientes generadas automáticamente por el sistema de las agendadas manualmente por el usuario (sin que esto complique la experiencia, algo sutil como un ícono o etiqueta pequeña alcanza).
- Agregar una vista o sección simple de "Resumen de vacunación" que muestre, por vacuna del protocolo correspondiente a la especie de la mascota, si está al día, pendiente, o vencida.

## 5) Tono y disclaimers

Todo el copy debe mantener el mismo tono cálido y cercano ya usado en el resto de la app (ver guías de razas como referencia de estilo). Incluir un disclaimer breve y amigable indicando que el calendario generado es orientativo según protocolos generales, y que el veterinario de confianza es quien debe confirmar y ajustar el esquema real de cada mascota.

## Verificación final
Probar:
1. Crear un perfil de cachorro sin vacunas aplicadas y confirmar que se genera el calendario de vacunas pendientes correspondiente a su edad.
2. Crear un perfil de mascota adulta indicando que ya tiene la séxtuple y la antirrábica aplicadas en fechas concretas, y confirmar que el sistema calcula y agenda correctamente los próximos refuerzos.
3. Agregar una vacuna nueva desde el formulario existente y confirmar que, si coincide con el dataset, se genera automáticamente el refuerzo futuro correspondiente.
4. Confirmar que el sistema de notificaciones y el calendario visual ya existentes siguen funcionando sin romperse con estos cambios.
