# OBJETIVO
Crear e integrar una nueva pantalla de **LogIn / Registro** (Inicio de Sesión) dentro del proyecto actual "Mi mascota y yo", respetando rigurosamente el diseño, la paleta de colores y la estructura de navegación por pantallas (`.screen`).

---

# 🧠 COMPORTAMIENTO ESPERADO (Flujo de prueba)
1. **Pantalla Inicial:** Al cargar la aplicación, la pantalla activa por defecto ya NO debe ser `#screen-home`, sino la nueva pantalla `#screen-login`.
2. **Simulación Simple:** No se requiere validación real con base de datos. Si el usuario ingresa cualquier correo y cualquier contraseña y presiona el botón de ingresar, el sistema debe redirigirlo automáticamente a la pantalla de inicio ejecutando la función existente `goTo('home')`.
3. **Alternancia LogIn/Registro:** Debe haber un enlace o botón simple dentro de la misma pantalla que permita alternar visualmente entre el formulario de "Iniciar Sesión" y el de "Crear Cuenta" (o cambiar los textos del botón y títulos dinámicamente) para simular ambas opciones sin trabar la navegación.

---

# 🎨 REQUISITOS DE DISEÑO Y ESTILOS
Debes estructurar el HTML y CSS utilizando los componentes de diseño de la aplicación:
* **Contenedor Principal:** La pantalla debe ser un `<div class="screen active" id="screen-login">`. (Nota: Recuerda quitarle la clase `active` a `#screen-home` en el código principal para que esta sea la primera).
* **Estética General:** Utiliza fondos tipo `.virtual-pet-stage` o tarjetas `.card` para envolver el formulario.
* **Campos de Entrada:** Los inputs de correo y contraseña deben usar los estilos globales ya definidos en el proyecto:
    ```css
    outline: none;
    width: 100%;
    border: 1px solid var(--brown-light);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 14px;
    color: var(--text-dark);
    background: var(--cream);
    ```
* **Botón de Acción:** El botón principal para ingresar debe usar la clase `.btn-primary`.
* **Identidad:** Sumá un logotipo o sección arriba del formulario que use un emoji grande de huella `🐾` o mascota `🐶` y el título de la app para darle la bienvenida al usuario.

---

# 🛠️ CÓDIGO REQUERIDO
Devuelve exclusivamente:
1. El bloque de código HTML correspondiente a `<div class="screen" id="screen-login">` listo para ser insertado dentro de `.app-shell`.
2. Las modificaciones o funciones JavaScript necesarias para procesar el clic de ingreso (haciendo el `goTo('home')`) y para alternar entre iniciar sesión y registrarse.