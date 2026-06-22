# OBJETIVO: MOTOR DE CALENDARIO INTERACTIVO DINÁMICO
Construir un algoritmo puro de manejo de fechas (Vanilla JavaScript) para estructurar un calendario mensual interactivo completo en formato de cuadrícula de 7 columnas (Lunes a Domingo). Este motor debe calcular de forma matemática la distribución exacta de los días de cualquier mes y año, posicionando correctamente el día 1 en su respectivo casillero semanal, administrando años bisiestos y cruzando datos con el array de vacunas para inyectar marcadores visuales personalizados.

---

# 🧠 ALGORITMO Y LÓGICA DE FECHAS REQUERIDA
El script no debe depender de librerías externas (como Moment.js o FullCalendar). Debe resolverse nativamente con el objeto `Date` de JavaScript mediante las siguientes directrices:

1. **Variables de Control de Navegación:**
   Mantener un estado interno para el mes y año visualizado actualmente en la cuadrícula (ej. `currentCalendarMonth` y `currentCalendarYear`), inicializados por defecto con la fecha actual del sistema.

2. **Cálculo de la Matriz Mensual:**
   * Obtener el primer día del mes seleccionado y determinar qué día de la semana cae (`new Date(year, month, 1).getDay()`), ajustando el índice para que el Lunes sea 0 y el Domingo sea 6.
   * Obtener la cantidad exacta de días totales que posee el mes en curso (`new Date(year, month + 1, 0).getDate()`).
   * Obtener los días del mes anterior necesarios para rellenar los huecos iniciales de la cuadrícula, y los días del mes posterior para completar la última fila de la grilla (para mantener siempre una estética perfecta de bloques simétricos y compactos).

3. **Mapeo y Pintado de Vacunas:**
   Durante el bucle de generación de los divs correspondientes a cada día, el script debe formatear la fecha iterada (`YYYY-MM-DD`) y compararla contra el array global de vacunas. Si hay coincidencia exacta de fecha, el casillero HTML generado debe incluir un elemento hijo especial: `<span class="calendar-dot"></span>` o un indicador visual.

---

# 🎨 MAQUETACIÓN CSS REQUERIDA
Asegura que el diseño sea responsivo y encaje perfectamente en el contenedor de 420px del proyecto:
```css
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    margin-top: 8px;
}
.calendar-day {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    border-radius: 10px;
    color: var(--text-dark);
    cursor: pointer;
    position: relative;
}
.calendar-day.empty { opacity: 0.3; }
.calendar-day.today { background: var(--brown-light); font-weight: bold; }
.calendar-day.has-vaccine { border: 1px solid var(--brown-main); }
.calendar-dot {
    position: absolute;
    bottom: 4px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--gold);
}