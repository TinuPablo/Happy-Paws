# Prompt — Renombrar a "Agenda" + Libreta de Vacunas (sin perder lo existente)

## Contexto importante (leer antes de tocar código)

Hoy existe la pestaña **"Vacunas"** (ícono jeringa en el bottom nav) con:
- Formulario "Programar Vacuna": nombre de la vacuna + fecha programada, botón "Guardar Vacuna".
- Botón "Ver calendario".
- Sección "Próximas Vacunas": lista con nombre, fecha, días restantes, y opción de eliminar.
- Sistema de notificaciones al agendar.

**Nada de esto se elimina.** Se reorganiza y se generaliza, y se le agrega una vista nueva. El objetivo final es que esta pestaña sirva para dos cosas distintas conviviendo en el mismo lugar:
1. Un **recordatorio general** de la mascota (vacunas, visitas al veterinario, medicación, u otros eventos de salud) — esto es la evolución del formulario que ya existe.
2. Una **libreta de vacunación** (tipo carnet físico), que muestra el estado de cada vacuna del protocolo de forma clara y ordenada.

## 1) Cambio de nombre en el bottom nav

Renombrar la pestaña del bottom nav de **"Vacunas"** a **"Agenda"**, manteniendo el mismo ícono de jeringa (o cambiarlo por uno que represente mejor "agenda/recordatorios" si el proyecto ya tiene alguno consistente con el estilo actual — a criterio, pero sin romper la consistencia visual del resto de los íconos del bottom nav).

## 2) Generalizar el sistema de recordatorios existente

Extender la estructura de datos actual (que hoy probablemente es solo `{ id, name, date }` o similar, ya extendida en el paso anterior con `status`, `auto_generated`, `protocol_id`) agregando un campo `type`:

```js
{
  id: "uuid",
  name: "Antirrábica",
  date: "2026-08-15",
  type: "vacuna" | "visita_veterinaria" | "medicamento" | "otro",
  status: "aplicada" | "pendiente",
  auto_generated: true | false,
  protocol_id: "antirrabica" | null
}
```

- **Migración de datos existentes**: al cargar la app, si hay datos guardados en `localStorage` con la estructura vieja (sin `type`), asignarles automáticamente `type: "vacuna"` para no perder ni romper nada de lo ya cargado por el usuario.
- En el formulario "Programar" (el que ya existe con nombre + fecha), agregar un selector de **tipo de recordatorio**: Vacuna / Visita al veterinario / Medicamento / Otro. Si elige "Vacuna" y el nombre coincide con una del protocolo (`vaccine-protocols.json`), aplica toda la lógica ya implementada (estado, cálculo de refuerzo, etc.). Si elige cualquier otro tipo, se guarda como recordatorio simple, sin lógica de protocolo ni refuerzos automáticos (funciona exactamente igual a como funciona hoy el formulario).
- El calendario visual y la lista de "Próximas" pasan a mostrar **todos los tipos de recordatorio** (no solo vacunas), cada uno distinguible con un ícono o color distinto según su `type` (ej. jeringa para vacuna, un ícono de veterinario/cruz para visita, una pastilla para medicamento).

## 3) Nueva vista: Libreta de Vacunación

Agregar, dentro de esta misma pestaña "Agenda", una sección "Libreta de Vacunas" que muestre **una tarjeta por cada vacuna del protocolo** correspondiente a la especie de la mascota (usando `vaccine-protocols.json`), con:

- Nombre de la vacuna y un ícono distintivo (💉 si no hay uno más específico).
- Estado visual con color: al día (verde), próxima a vencer (amarillo, dentro de 30 días), vencida (rojo, pero con texto amigable, no alarmante — ej. "Te la debe 🙈"), o sin aplicar todavía (gris).
- "Última aplicada: [fecha]" (buscando en los recordatorios de `type: "vacuna"` con `protocol_id` coincidente y `status: "aplicada"` más reciente) o "Aún no se registró ninguna dosis" si no hay ninguna.
- "Próxima: [fecha]" usando el cálculo ya existente, o "A definir con tu veterinario" si no hay una calculada.
- Si tiene más de una dosis en el historial, poder desplegar el historial completo de esa vacuna en particular.
- Si el usuario quiere agregar una dosis de una vacuna directamente desde su tarjeta en la libreta (en vez de ir al formulario general), agregar un botón simple "+ Agregar dosis" en cada tarjeta, que abra el mismo formulario de siempre pre-completado con el nombre de esa vacuna y `type: "vacuna"`.
- Agrupar primero las vacunas `category: "core"` (esenciales) y después las `"non-core"` (recomendadas), con un separador sutil entre ambos grupos.

## 4) Organización final de la pestaña "Agenda"

Sugerencia de estructura (adaptar según lo que ya exista en el proyecto, sin forzar algo que no encaje con los componentes actuales):

- Arriba: **Libreta de Vacunación** (la vista nueva, la más visual/tipo carnet).
- Debajo: el formulario "Programar" generalizado (con el selector de tipo) + el botón "Ver calendario" + la lista "Próximos recordatorios" (ya no solo "Próximas Vacunas", ahora incluye todos los tipos) — básicamente todo lo que ya existe hoy, tal cual, solo que ahora sirve para más que vacunas.

Si el proyecto ya usa tabs/sub-secciones dentro de una pantalla, se puede organizar como dos sub-tabs ("Libreta" y "Recordatorios") en vez de todo en un solo scroll — usar el criterio que mejor encaje con el patrón de navegación que ya tiene la app.

## 5) Tono y diseño

Mantener el mismo estilo visual ya usado (colores marrones/cálidos del bottom nav y tarjetas que se ven en la pantalla actual). Todo el copy nuevo debe sonar cercano y amigable, igual que el resto de la app — nada de lenguaje clínico ni alarmante.

## Verificación final
Probar:
1. Que los datos de vacunas ya cargados anteriormente en `localStorage` sigan apareciendo correctamente después de la migración (no se pierde nada).
2. Agendar un recordatorio de tipo "Visita al veterinario" y confirmar que aparece en el calendario y en la lista, sin intentar aplicarle lógica de protocolo de vacunas.
3. Agregar una dosis de vacuna desde el botón "+ Agregar dosis" de una tarjeta de la Libreta, y confirmar que se refleja correctamente tanto en la Libreta como en la lista general de recordatorios.
4. Confirmar que el bottom nav ahora dice "Agenda" y que la navegación sigue funcionando sin errores.
