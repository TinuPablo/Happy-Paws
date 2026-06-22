# OBJETIVO: MOTOR DE MASCOTA VIRTUAL - CAPAS DE EQUIPAMIENTO (Z-INDEX)
Rediseñar el contenedor de la mascota virtual (`#pet-stage` o equivalente) para transformarlo en un motor de juego basado en capas superpuestas. El objetivo es que la mascota base pueda "equiparse" ropa, sombreros o accesorios de forma dinámica mediante JavaScript, utilizando posicionamiento absoluto y ejes Z, simulando un sistema de personalización de un videojuego.

---

# 🧠 ARQUITECTURA DE CAPAS (CSS Z-INDEX)
Para evitar renderizar cientos de imágenes combinadas, la IA debe estructurar el contenedor de la mascota como un lienzo de capas alineadas milimétricamente (todas con el mismo tamaño, por ejemplo `200px x 200px` y centradas):

1. **Capa 1 (Base - Z-Index: 10):** Contiene la imagen de la mascota (`#pet-body`). Su propiedad `src` cambiará según el estado de ánimo o acción.
2. **Capa 2 (Cuerpo/Ropa - Z-Index: 20):** Contiene la imagen de remeras, disfraces o collares (`#pet-clothing`). Si no hay nada equipado, permanece oculta o vacía.
3. **Capa 3 (Cabeza/Sombreros - Z-Index: 30):** Contiene los sombreros, gorras o moños (`#pet-hat`).
4. **Capa 4 (Cara/Gafas - Z-Index: 40):** Contiene lentes, antifaces o elementos faciales (`#pet-eyes`).

---

# 🕹️ LÓGICA DE JUEGO ESPERADA (JavaScript)
* **Estado de Equipamiento:** El objeto global de la mascota (`APP_STATE.pet`) debe extenderse para incluir los ítems actualmente equipados:
  ```javascript
  // Ejemplo dentro del estado global
  pet: {
      name: "Firulais",
      // ... otros datos
      equipped: {
          hat: "hat_detective", // ID del ítem o null si está desvestido
          clothing: null,
          eyes: "glasses_cool"
      }
  }



Función equipItem(category, itemId): Al recibir la categoría (ej: 'hat') y el ID del ítem, debe buscar la ruta de la imagen correspondiente en un catálogo interno, actualizar el objeto APP_STATE.pet.equipped, inyectar la imagen en la capa CSS correcta y guardar el estado en el dispositivo (saveAppState()). Si el ID es null, limpia la capa (desviste a la mascota).

🛠️ CÓDIGO REQUERIDO
Devuelve exclusivamente:

La estructura HTML renovada para el contenedor de la mascota virtual con sus capas internas.

Las reglas CSS estrictas de posicionamiento (position: relative para el contenedor padre y position: absolute; top:0; left:0; width:100%; height:100%; para las capas hijas) asegurando el orden correcto de z-index.

La función JavaScript equipItem() encargada de vestir/desvestir a la mascota en tiempo real actualizando el DOM y el estado de persistencia.