# OBJETIVO: MOTOR DE INTERACTIVIDAD Y ANIMACIÓN DE ALIMENTACIÓN
Implementar la mecánica interactiva de "Dar de comer" a la mascota virtual dentro de `#screen-virtual`. La IA debe programar un sistema de animaciones por estados (JavaScript + CSS Transiciones/Keyframes) para que un elemento de comida se desplace físicamente por la pantalla hacia la mascota, provocando un cambio dinámico en su expresión visual, reproduciendo un feedback táctil/sonoro simulado y actualizando las estadísticas de humor y energía en tiempo real.

---

# 🧠 LÓGICA DE ESTADOS Y REACCIÓN (JavaScript)
El motor de animaciones debe manejar el comportamiento de la mascota mediante cambios temporales en el atributo `src` de la capa base (`#pet-body`):

1. **Estados de la Mascota:**
   * **Estado IDLE (Por defecto):** La mascota parpadea o respira de forma sutil (`pet_idle.gif` o `pet_happy.png`).
   * **Estado COMIENDO (2 Segundos):** Al interactuar con la comida, la imagen base cambia instantáneamente a una expresión con la boca abierta o masticando (`pet_eating.gif`).
   * **Estado FESTEJO (1.5 Segundos):** Tras comer, la mascota salta o tira corazones (`pet_excited.gif`), volviendo luego al estado IDLE.

2. **Función `feedPet(foodType)`:**
   * Verifica si el usuario tiene alimentos disponibles (o resta puntos si la comida cuesta monedas).
   * Dispara la animación CSS del proyectil de comida.
   * Modifica el objeto global de datos incrementando las estadísticas: `APP_STATE.game.mood = Math.min(100, APP_STATE.game.mood + 15)`.
   * Invoca a `saveAppState()` para registrar el nuevo humor de la mascota en el almacenamiento del teléfono.

---

# 🎨 REQUISITOS DE ANIMACIÓN Y CSS (Efecto Físico)
Para lograr el efecto de juego real sin usar motores pesados, la IA debe implementar una animación con `@keyframes` de CSS:

* **El Proyectil de Comida:** Al tocar el botón "Alimentar", se genera dinámicamente un elemento temporal (ej: un emoji de hueso `🍖` o galleta `🍪`) en la posición del botón.
* **Efecto Traslación:** Usando transiciones de CSS (`transform: translate()`), el elemento debe flotar y desplazarse de manera fluida hacia las coordenadas exactas de la boca de la mascota.
* **Desaparición y Feedback:** Al colisionar con la mascota, el emoji de comida hace un efecto de escala a cero (`transform: scale(0)`), desaparece, se dispara el estado "COMIENDO" y se emite una notificación flotante estilo `showToast('¡Añam! A Firulais le encantó 🍖', 'success')`.

---

# 🛠️ CÓDIGO REQUERIDO
Devuelve exclusivamente:
1. El código HTML de los botones de interacción ("Dar de comer 🍖", "Dar agua 💧") para la interfaz.
2. Las clases CSS y los `@keyframes` necesarios para la trayectoria de la comida flotante y las micro-animaciones de rebote/festejo de la mascota.
3. El script de JavaScript que controle los temporizadores (`setTimeout`) para alternar las imágenes de los estados de la mascota (Idle -> Comiendo -> Festejo -> Idle) y actualizar las barras de progreso del juego en el DOM.