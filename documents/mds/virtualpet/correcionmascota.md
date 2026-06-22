# 🚨 ERROR CRÍTICO A CORREGIR: MOTOR DE MASCOTA DINÁMICA (ESTILO POU / PET SOCIETY)
El sistema actual está renderizando una imagen estática fija que incluye los accesorios dibujados en la misma pieza. Esto impide que los ítems comprados se equipen realmente y no ofrece ninguna animación interactiva. Necesitamos reestructurar por completo el módulo de la mascota virtual para que funcione como un juego real.

---

# 🛠️ CORRECCIÓN DE ARQUITECTURA (SEPARACIÓN EN CAPAS)
La IA debe separar el diseño de forma obligatoria en contenedores independientes usando `position: absolute` y `z-index`. Ningún accesorio debe venir pre-dibujado en el cuerpo del perro:

1. **Capa Base (`#pet-core` - Z-Index: 1):** Aquí va EXCLUSIVAMENTE el cuerpo limpio de la mascota (sin sombreros, sin ropa, sin bufandas).
2. **Capa Sombreros (`#layer-hat` - Z-Index: 10):** Un contenedor vacío alineado a la altura de la cabeza. Al presionar "Sombrero", se inyecta la imagen del sombrero aquí.
3. **Capa Cuello/Moños (`#layer-neck` - Z-Index: 5):** Un contenedor alineado al cuello para el moño o la bufanda.

> **Regla de Equipamiento:** Al hacer clic en "Moño (Adquirido)", la función JavaScript debe limpiar la capa `#layer-neck` de cualquier bufanda previa e inyectar el archivo del moño en su lugar de forma inmediata.

---

# 🫨 MOTOR DE MOVIMIENTO ANIMADO (ESTILO POU)
Para que deje de ser una foto muerta y se mueva como en Pet Society, aplica los siguientes efectos usando animaciones puras de CSS (`@keyframes`):

1. **Efecto Respiración / Relajado (Idle):** El cuerpo de la mascota (`#pet-core`) debe tener una animación en bucle infinito que cambie sutilmente su escala vertical (`transform: scaleY(1)` a `scaleY(1.04)`) de forma lenta y fluida para simular que está vivo y respirando.
2. **Animación de Equipamiento:** Cuando el usuario equipe exitosamente un accesorio (como el moño o el sombrero), el accesorio debe caer desde arriba con una transición suave y la mascota debe dar un pequeño salto de alegría (`transform: translateY(-15px)`).

---

# 🛠️ CÓDIGO REQUERIDO DE REEMPLAZO
Devuelve de forma exclusiva:
1. El HTML corregido de `#pet-stage` mostrando la separación real de las capas (Cuerpo, Sombrero, Cuello).
2. El CSS con las animaciones `@keyframes` para el efecto de respiración (Idle) y el salto de alegría.
3. El JavaScript corregido para que la función de equipar impacte directamente en la capa correspondiente del DOM sin romper el renderizado.