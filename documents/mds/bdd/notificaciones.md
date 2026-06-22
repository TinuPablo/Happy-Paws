# OBJETIVO: MOTOR DE NOTIFICACIONES LOCALES NATIVAS
Desarrollar e implementar el motor de alertas y notificaciones locales para dispositivos móviles reales (iOS/Android) utilizando la API nativa de Capacitor (`@capacitor/local-notifications`) o en su defecto un sistema híbrido compatible. La finalidad es permitir que la aplicación agende alertas físicas en el sistema operativo del smartphone, disparándose con precisión horaria incluso si la aplicación se encuentra totalmente cerrada o en segundo plano.

---

# 🧠 COMPORTAMIENTO Y LÓGICA ESPERADA
1. **Permisología Móvil:** Al iniciar la aplicación o al intentar agendar la primera vacuna, el sistema debe comprobar el estado de los permisos de notificación mediante hardware. Si no están otorgados, debe invocar la solicitud nativa emergente del sistema operativo: `LocalNotifications.requestPermissions()`.
2. **Agendamiento Automatizado de Vacunas:** Cada vez que el usuario agregue con éxito una nueva vacuna en la pantalla correspondiente (`#screen-vaccines`), el motor de JS debe ejecutar un registro de notificación nativa.
   * **Parámetros del Payload:**
     * `id`: ID numérico único autogenerado para esa vacuna.
     * `title`: "🐾 ¡Recordatorio de Vacunación!"
     * `body`: `Es hora de aplicar la vacuna [Nombre_Vacuna] a [Nombre_Mascota]. ¡Cuidá a tu mejor amigo!`
     * `schedule`: Objeto de fecha nativo configurado exactamente para el día registrado por el usuario a las 09:00 AM.
3. **Cancelación de Alertas:** Si el usuario elimina una vacuna de su lista de planificación, el motor debe invocar la cancelación del ID específico asignado en el sistema móvil para evitar alertas huérfanas.

---

# 🛠️ CÓDIGO REQUERIDO
Devuelve un bloque JavaScript limpio diseñado para el ecosistema móvil:
1. Función asíncrona de inicialización y verificación/solicitud de permisos nativos de hardware.
2. Función `scheduleVaccineNotification(vaccineId, vaccineName, dateString)` que traduzca el string de fecha del `<input type="date">` a un objeto ejecutable por el planificador del celular.
3. Comentarios explícitos que detallen la importación del plugin de Capacitor para que la compilación en Android Studio o Xcode no genere errores de dependencias.
4. Un sistema de "fallback" (simulación mediante la función `showToast` actual) en caso de ejecutarse en navegadores web tradicionales durante la fase de testing en computadora.