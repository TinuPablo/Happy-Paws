# OBJETIVO: TIENDA DE ACCESORIOS E INVENTARIO DE LA MASCOTA
Implementar la interfaz visual y la lógica de programación para la **Tienda de Accesorios** y el **Inventario (Mochila)** dentro de la sección de la mascota virtual. El usuario podrá gastar los puntos/monedas acumulados de sus tareas diarias para comprar ropa y sombreros, almacenarlos en su inventario y equipárselos a la mascota desde una interfaz de cuadrícula cómoda y móvil.

---

# 🧠 LÓGICA DE ECONOMÍA E INVENTARIO (JavaScript)
El motor de la app debe expandir el objeto global (`APP_STATE`) para incluir el catálogo y las posesiones del usuario:

1. **Estructura del Inventario:**
   ```javascript
   game: {
       points: 320, // Monedas actuales del usuario
       // ... otros datos
   },
   inventory: ["hat_detective"], // IDs de ítems que el usuario YA compró


Catálogo de Ítems (Base de Datos interna): Un array de objetos estáticos que defina los ítems disponibles:

Ejemplo: { id: "hat_cowboy", name: "Sombrero Vaquero", price: 150, category: "hat", src: "assets/pet/hat_cowboy.png" }

Función buyItem(itemId): * Debe verificar si el itemId ya está en APP_STATE.inventory (evitar comprar doble).

Debe comprobar si APP_STATE.game.points es mayor o igual al precio del ítem.

Si cumple: descuenta los puntos, añade el ID al array de inventory, muestra un mensaje de éxito (showToast), actualiza los marcadores de puntos en la pantalla de inicio y guarda los cambios con saveAppState().

Si no tiene fondos, muestra una alerta de "Puntos insuficientes".

🎨 REQUISITOS DE DISEÑO DE LA INTERFAZ
Navegación Interna: Añade pestañas simples o un botón deslizante dentro de la pantalla virtual para alternar entre la vista "Tienda" (para comprar) e "Inventario" (para ver lo que ya posees).

Cuadrícula de Ítems (Grid CSS): Ambas secciones deben mostrar los ítems en una rejilla responsiva de 2 o 3 columnas que quepa perfectamente en los 420px del celular:
.shop-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 12px;
}

Tarjetas de Ítems (.card): Cada celda debe mostrar la miniatura del accesorio, su nombre, una insignia con el precio en puntos (ej: 🪙 120) o un botón que diga "Equipar" si el ítem ya es propiedad del usuario. Si un ítem ya fue comprado, la tarjeta en la tienda debe mostrar un estado opaco o un cartel de "Adquirido".

🛠️ CÓDIGO REQUERIDO
Devuelve exclusivamente:

El código HTML de la interfaz de la Tienda/Inventario para integrarse debajo del escenario de la mascota.

Los estilos CSS para la cuadrícula y los estados de los botones ("Comprar", "Equipar", "Quitar").

Las funciones JavaScript buyItem(itemId) y la lógica de renderizado que dibuje los ítems dinámicamente según los puntos e inventario del estado actual de la app.