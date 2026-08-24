# Prompt 1B — Completar dataset de razas (continuación, no repetir desde cero)

## Contexto
Ya existe `/data/breeds.json` con estas 10 razas cargadas (dejalas intactas, no las borres ni las regeneres):

```
dog: labrador-retriever, golden-retriever, pug, bulldog-frances, pastor-aleman, caniche
cat: persa, siames, maine-coon, british-shorthair
```

Esto es apenas una fracción de lo pedido. Faltan la gran mayoría de razas de perro y gato reconocidas.

## Objetivo
**Agregar** (no reemplazar) al array de `/data/breeds.json` el resto de razas hasta cubrir la totalidad de razas reconocidas por FCI (perros) y por CFA/FIFe/TICA (gatos), evitando duplicar los `id` ya existentes.

## Reglas de ejecución (importante, esto fue lo que falló la vez anterior)

1. **No generes todo en una sola respuesta larga.** Trabajá en tandas chicas y concretas, por ejemplo:
   - Tanda 1: grupo FCI 1 (perros pastores y boyeros)
   - Tanda 2: grupo FCI 2 (pinschers, schnauzers, molosoides)
   - ... y así sucesivamente con cada uno de los 10 grupos FCI
   - Luego: razas de gato por asociación (CFA, luego FIFe/TICA si agregan razas no cubiertas por CFA)
2. Después de cada tanda, **escribí (append) esos objetos nuevos a `/data/breeds.json`** antes de pasar a la siguiente tanda. No dejes todo el trabajo acumulado para el final.
3. Si en algún momento sentís que la respuesta se está por cortar por longitud, cerrá la tanda actual con lo que tengas, guardalo, y continuá con la siguiente tanda en un paso separado. Es preferible hacer más pasos cortos que uno solo largo que se corte a la mitad.
4. Llevá un conteo corriente y mostralo en la terminal después de cada tanda (ej. "Van 45 razas de perro, 12 de gato").

## Reglas del schema (iguales al prompt original)

```json
{
  "id": "nombre-raza-en-slug",
  "name": "Nombre de la Raza",
  "species": "dog",
  "health_tags": ["tag1", "tag2"]
}
```

- `id`: slug único, minúsculas, sin tildes ni espacios (guiones). Verificar que no choque con los 10 `id` ya existentes.
- `health_tags`: 2 a 5 tags, reutilizando el vocabulario ya existente en el archivo actual (`displasia_cadera`, `obesidad`, `problemas_articulares`, `problemas_cardiacos`, `braquicefalico`, `problemas_respiratorios`, `problemas_piel`, `problemas_columna`, `displasia_codo`, `mielopatia_degenerativa`, `problemas_dentales`, `problemas_oculares`, `enfermedad_poliquistica_renal`). Solo agregar un tag nuevo al vocabulario si ninguno de los existentes aplica razonablemente, y en ese caso reutilizarlo para otras razas similares en tandas siguientes (no crear tags exclusivos de una sola raza).
- No inventar condiciones de salud para razas poco documentadas: en esos casos usar tags genéricos (ej. `obesidad`, `problemas_dentales`) en vez de algo específico sin base real.

## Después de completar razas

Una vez que `/data/breeds.json` tenga todas las razas:

1. Revisar `/data/guides.json` y **agregar las guías faltantes** para cualquier tag nuevo que se haya incorporado al vocabulario durante este proceso (siguiendo el mismo tono cálido y cercano ya usado en las guías existentes — ver ejemplos actuales en `guides.json` como referencia de estilo, no repetir la misma frase de cierre en todas).
2. No tocar las guías que ya existen y están bien.

## Verificación final
Al terminar, mostrar en terminal:
- Total final de razas de perro y de gato.
- Lista de tags usados en `health_tags` (debe seguir siendo una lista acotada y reutilizada).
- Confirmar que cada tag usado en `breeds.json` tiene su guía correspondiente en `guides.json`.
- Confirmar que no hay `id` duplicados en `breeds.json`.
