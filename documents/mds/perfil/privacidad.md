# OBJETIVO
Modificar la opción de privacidad en la pantalla de Perfil (`#screen-profile`) y crear una vista/modal secundaria para mostrar los **Términos de Servicio y Políticas de Privacidad**. Este documento debe incluir cláusulas estándar de protección de propiedad intelectual (para evitar copias o robo de la aplicación) y protección de datos de los usuarios.

---

# 🧠 COMPORTAMIENTO Y LÓGICA ESPERADA
1. **Modificación en Perfil:** En la lista de configuración, la fila que dice *"Privacidad y datos"* debe renombrarse a **"Términos y privacidad"**.
2. **Despliegue del Contenido:** Al hacer clic en esa fila, se debe abrir un contenedor (puede ser una nueva sub-pantalla `#screen-legal` o un modal emergente estilizado dentro de la app) que muestre el texto legal completo. Debe incluir un botón claro para "Cerrar" o "Volver" al Perfil.
3. **Contenido Legal Base (Texto Protegido):** El documento debe estar redactado de manera formal y profesional, dividiéndose en tres puntos esenciales:
   * **Propiedad Intelectual:** Declarar explícitamente que todo el código fuente, la marca "Happy Paws" / "Mi mascota y yo", los diseños visuales, ilustraciones y mecánicas de gamificación son propiedad exclusiva del desarrollador y está prohibida su reproducción, copia o distribución sin autorización.
   * **Uso de la Aplicación:** Normas básicas de convivencia y uso responsable del software.
   * **Privacidad de Datos:** Explicar de forma simple que los datos ingresados (fotos, nombres de mascotas) se procesan únicamente de forma local en el dispositivo para el correcto funcionamiento de la app.

---

# 🎨 REQUISITOS DE DISEÑO Y ESTILOS
* **Estructura:** El contenedor legal debe tener scroll vertical independiente (`overflow-y: auto`), ya que el texto es extenso.
* **Estética:** Utiliza un fondo limpio `--cream` o `--white`, textos con `--text-mid` y títulos de sección usando `--text-dark`. El botón de cierre debe integrarse con la estética de la app.

---

# 🛠️ CÓDIGO REQUERIDO
Devuelve exclusivamente:
1. El HTML modificado de la fila en `#screen-profile`.
2. El bloque de código HTML correspondiente a la nueva sección o modal legal (`#screen-legal`).
3. El texto legal estándar redactado e insertado dentro del HTML con etiquetas estructuradas (`<h3>`, `<p>`).
4. El JavaScript necesario para abrir y cerrar esta vista de manera fluida.