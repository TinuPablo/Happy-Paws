# OBJETIVO: MOTOR DE PERSISTENCIA Y BASE DE DATOS LOCAL
Implementar un sistema de almacenamiento y persistencia de datos local para la aplicación móvil híbrida. El objetivo es asegurar que toda la información ingresada por el usuario (puntos acumulados, datos de la mascota, fotos de perfil en Base64, estado de tareas y calendario de vacunación) quede guardada permanentemente en el almacenamiento del dispositivo (`LocalStorage` o `Capacitor Preferences`) y se restaure automáticamente al iniciar o recargar la app.

---

# 🧠 ESTRUCTURA DE DATOS Y LÓGICA ESPERADA
Se debe unificar el estado global de la aplicación en un único objeto para mantener el orden de los datos:

1. **Estado Inicial (Estructura Base):**
   Al cargar la app, se debe verificar si ya existen datos guardados. Si no existen, se inicializa el almacenamiento con los datos por defecto del proyecto:
   ```javascript
   const APP_STATE = {
       user: { name: "María González", avatar: null, memberSince: 2021 },
       pet: { name: "Firulais", type: "🐶", breed: "Labrador", age: 3, gender: "Macho", avatar: null },
       game: { points: 320, streak: 5, totalTasks: 48, mood: 82 },
       tasks: [
           { id: 1, name: "Dar de comer", time: "08:00", desc: "Ración de la mañana", done: true },
           { id: 2, name: "Cambiar el agua", time: "12:00", desc: "Hidratación diaria", done: false }
       ],
       vaccines: []
   };

   Funciones Guardianas (Save/Load):

saveAppState(): Se debe invocar automáticamente cada vez que ocurra un cambio (completar una tarea, gastar puntos, cambiar una foto, registrar una vacuna). Convierte el objeto a texto mediante JSON.stringify().

loadAppState(): Se ejecuta de manera obligatoria inmediatamente al arrancar la aplicación. Debe leer el almacenamiento y disparar las funciones de renderizado visual para inyectar los datos guardados en el HTML.

Manejo de Imágenes (Base64):
Las strings de texto largo generadas al cargar las fotos desde la galería/cámara deben guardarse directamente dentro de sus respectivos campos en el objeto (user.avatar y pet.avatar). El cargador de la app debe comprobar si existen estos valores y setearlos como fondo (background-image) en los círculos de perfil del HTML.

🛠️ CÓDIGO REQUERIDO
Devuelve un script JavaScript modular y limpio que contenga:

La inicialización y comprobación del almacenamiento al arrancar la app.

La lógica de guardado automático integrada con los eventos existentes de la app (como toggleTask(), buyItem(), petAction(), etc.).

Funciones de actualización del DOM que lean el estado recuperado de la memoria e inyecten los textos, imágenes y puntuaciones en todas las pantallas (#screen-home, #screen-virtual, #screen-profile, etc.).