# CONTEXTO DE ENTORNO
Este proyecto es una aplicación móvil nativa/híbrida descargable (desarrollada con HTML/CSS/JS y empaquetada para iOS/Android usando Capacitor/Cordova). Por lo tanto, el acceso a los componentes de hardware debe realizarse pensando en capacidades móviles reales.

# OBJETIVO
Implementar la funcionalidad nativa para cambiar la **Foto de Perfil del Usuario** y la **Foto de la Mascota Real** dentro de la pantalla de Perfil (`#screen-profile`). El sistema debe interactuar con el hardware del teléfono para permitir tomar una foto con la cámara en el momento o seleccionar una imagen existente de la galería nativa del dispositivo.

---

# 🧠 COMPORTAMIENTO Y LÓGICA ESPERADA (Entorno Mobile)
1. **Activación:** Al tocar sobre el avatar del usuario (`👩`) o de la mascota (`🐶`), se debe desplegar un menú de acciones nativo del sistema operativo (Action Sheet) con las opciones: "Tomar Foto", "Elegir de la Galería" o "Cancelar".
2. **Integración Nativa (Mock/Capacitor):** * *Para producción:* El código debe contemplar el uso de la API de cámara (ej. `@capacitor/camera` o similar).
   * *Para desarrollo/prueba actual:* Provee una función JavaScript que simule este comportamiento en el navegador mediante un `<input type="file" accept="image/*">` que en celulares abre la cámara/galería automáticamente, pero dejando la estructura lista para conectar el plugin nativo.
3. **Persistencia e Inyección Visual:** Al recibir la imagen (en formato Base64 o URL local `blob:`), JavaScript debe reemplazar el emoji actual y pintar la foto cubriendo todo el círculo (`background-size: cover`).

---

# 🎨 REQUISITOS DE DISEÑO Y ESTILOS
* **Feedback Táctil:** Los avatares deben tener el estilo visual de un botón interactivo móvil. Añade un pequeño indicador flotante (un círculo marrón oscuro `--brown-dark` con el icono `ti ti-camera` en blanco) superpuesto en la esquina inferior derecha de cada avatar.
* **Consistencia:** Las fotos cargadas deben respetar la máscara circular perfecta de los contenedores actuales (`.profile-avatar` de 72px y el contenedor de la mascota de 40px).

---

# 🛠️ CÓDIGO REQUERIDO
Devuelve:
1. El HTML modificado para los contenedores de fotos en la sección de perfil, integrando los iconos de cámara.
2. El JS con la lógica de apertura, lectura de archivos de imagen y renderizado en los contenedores correspondientes, comentando dónde iría la llamada al plugin nativo de la app descargable.