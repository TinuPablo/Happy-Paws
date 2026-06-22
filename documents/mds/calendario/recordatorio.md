# OBJETIVO
Crear una nueva pantalla de **Calendario de Vacunación** (`#screen-vaccines`) e integrarla en la barra de navegación inferior. Además, conectar su lógica con la pantalla de Inicio (`#screen-home`) para que los recordatorios de vacunas se muestren de forma dinámica cerca de las tareas del día.

---

# 🧠 COMPORTAMIENTO Y LÓGICA ESPERADA
1. **Navegación Inferior:** Se debe añadir la opción de "Vacunas" o "Calendario" en el `bottom-nav`. Para mantener el diseño limpio de 4 botones dentro de los 420px del dispositivo, debes evaluar si es mejor redistribuir los botones o añadirlo de forma compacta usando un icono de Tabler Icons como `ti-calendar-event` o `ti-vaccine`.
2. **Formulario de Carga (Pantalla Vacunas):** Dentro de la nueva pantalla, el usuario debe poder registrar una vacuna ingresando:
   * Nombre de la vacuna (ej. "Antirrábica", "Quíntuple").
   * Fecha programada (usando un `<input type="date">` estilizado).
3. **Listado de Próximas Vacunas:** Abajo del formulario, se debe mostrar un listado de las vacunas ya agendadas usando el componente `.card`.
4. **Conexión con el Inicio (Home):** Al guardar una fecha en el calendario, el sistema debe calcular cuántos días faltan y **renderizar un recordatorio dinámico en la pantalla de inicio**, en la sección de "Tareas de hoy" o "Próximos eventos", reemplazando o sumándose al bloque estático actual que dice *"Vacuna antirrábica — Próxima: 15 de junio · 8 días"*.

---

# 🎨 REQUISITOS DE DISEÑO Y ESTILOS
* **Estructura Base:** La nueva pantalla debe usar la estructura estándar:
  ```html
  <div class="screen" id="screen-vaccines">
    <div class="topbar">...</div>
    <div class="content">...</div>
    <nav class="bottom-nav">...</nav>
  </div>