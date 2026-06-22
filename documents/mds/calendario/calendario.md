# OBJETIVO
Expandir la pantalla de vacunas (`#screen-vaccines`) agregando un botón interactivo que diga **"Ver calendario"**. Al presionarlo, debe desplegar u ocultar una vista de **Calendario Mensual Completo en formato de cuadrícula (Grid)**, manteniendo la estética cálida, "cozy" y personalizada de la aplicación, inspirada en la funcionalidad de iOS pero adaptada a nuestro diseño.

---

# 🧠 COMPORTAMIENTO Y LÓGICA ESPERADA
1. **Botón de Activación:** Cerca del listado o formulario de vacunas, debe haber un botón (ej. `.btn-primary` o un botón secundario estilizado) que actúe como "Toggle" (Mostrar/Ocultar) para el calendario completo.
2. **Cuadrícula Mensual (Grid):** El calendario debe renderizar los días del mes actual en una cuadrícula de 7 columnas (Lunes a Domingo). Debe calcular automáticamente los días del mes para mostrar la grilla correctamente.
3. **Marcadores de Vacunas:** Si un día del mes coincide con una fecha de vacunación registrada, ese casillero del día debe mostrar un indicador visual sutil y hermoso (por ejemplo, un puntito color `--gold`, `--brown-main` o un mini emoji de jeringa `💉` / huella `🐾`).
4. **Interactividad:** Al hacer clic en un día del calendario que tenga una vacuna programada, debe disparar el componente de notificación existente usando la función `showToast('🐾 Vacuna: [Nombre] asignada para hoy', '')`.

---

# 🎨 REQUISITOS DE DISEÑO Y ESTILOS (Fiel a la App)
Para alejarlo del diseño frío de un sistema operativo y mantenerlo fiel a "Mi mascota y yo", la IA debe seguir estas pautas:
* **Estructura del Calendario:** Todo el bloque del calendario debe estar contenido dentro de una tarjeta `.card` o un bloque tipo `.virtual-pet-stage` (fondo `--cream` o `--white`).
* **Cabecera del Calendario:** Debe incluir el nombre del mes actual (ej. "Junio 2026") con tipografía de la app y flechas (`←` y `→`) estilizadas para navegar entre meses si el usuario lo desea.
* **Días de la Semana:** Los encabezados (L, M, X, J, V, S, D) deben usar los estilos de la sección de progreso semanal: `font-size: 11px; color: var(--text-light); text-align: center; font-weight: 500;`.
* **Casilleros de los Días:** Cada día debe ser un bloque sutilmente redondeado. Los días que no pertenecen al mes actual deben verse opacos (`opacity: 0.3`). El día actual (hoy) debe resaltar con un fondo `--brown-light` o un borde `--brown-mid`.

---

# 🛠️ CÓDIGO REQUERIDO
Devuelve exclusivamente:
1. El bloque de código HTML del botón "Ver calendario" y el contenedor contenedor del calendario (`<div id="calendar-container" style="display:none;">...</div>`) para insertar en `#screen-vaccines`.
2. Los estilos CSS adicionales necesarios para la cuadrícula del calendario, asegurando que se adapte perfectamente al ancho de 420px del `.app-shell`.
3. El código JavaScript encargado de:
   * Generar la matriz de días del mes dinámicamente.
   * Cruzar los datos del array de vacunas para pintar los marcadores en los días correspondientes.
   * La lógica del botón para mostrar/ocultar el calendario con una transición limpia.