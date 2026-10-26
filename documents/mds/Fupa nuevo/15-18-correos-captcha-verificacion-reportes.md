# Prompts 15 a 18 — Correos reales, captcha, verificación de protectoras y reportes

## Orden y ramas (según WORKFLOW-GIT.md)
Una rama por prompt, en este orden:

1. `feature/mail-infra` — Prompt 15 (envío de correos)
2. `feature/captcha` — Prompt 16 (Cloudflare Turnstile + límite de intentos)
3. `feature/verificacion-protectoras` — Prompt 17 (registro con verificación + panel admin)
4. `feature/reportes-contacto` — Prompt 18 (footer + formulario de reportes)

El 15 va primero porque 17 y 18 dependen de él. El captcha va antes que 17 y 18
a propósito: cada registro de protectora y cada reporte manda un mail a la casilla
de Happy Paws, así que sin captcha un bot podría llenarla de mensajes.

---

## PARTE MANUAL (la hacés vos, no el agente)

### A. Casilla de Gmail de Happy Paws
1. Creá la cuenta de Gmail (puede que `happypaws@gmail.com` ya esté tomada; si es
   así, usá una variante y avisame cuál quedó para ajustar los textos).
2. Activá la **verificación en dos pasos** en esa cuenta (es obligatoria para el
   paso siguiente).
3. Entrá a https://myaccount.google.com/apppasswords con esa cuenta y creá una
   **contraseña de aplicación** (nombre sugerido: "Happy Paws web"). Google te
   muestra 16 caracteres una sola vez: copialos.
4. En tu `.env` local (nunca en un chat, ni al agente) agregá:

   SMTP_USER="la-cuenta@gmail.com"
   SMTP_PASS="los16caracteresdelaapp"
   MAIL_ADMIN="la-cuenta@gmail.com"
   APP_URL="http://localhost:3000"

   (`MAIL_ADMIN` es la casilla que recibe solicitudes y reportes; puede ser la
   misma cuenta o la de uno de ustedes durante las pruebas.)

### B. Cloudflare Turnstile (captcha gratuito)
1. Creá cuenta gratis en https://dash.cloudflare.com y entrá a **Turnstile**.
2. Agregá un sitio. Para desarrollo alcanza con `localhost`.
3. Copiá la **Site Key** y la **Secret Key** y ponelas en tu `.env`:

   NEXT_PUBLIC_TURNSTILE_SITE_KEY="..."
   TURNSTILE_SECRET_KEY="..."

   Mientras no tengas las claves reales podés usar las de prueba de Cloudflare:
   site key `1x00000000000000000000AA` y secret key `1x0000000000000000000000000000000AA`
   (siempre pasan la verificación; sirven para desarrollar, no para producción).

### C. Para Daniel
El `.env` no viaja por git: Daniel tiene que agregar estas mismas variables a su
`.env` y, después de cada pull con cambios de schema, correr `npx prisma migrate deploy`
y `npx prisma generate`.

---

## PROMPT 15 — Infraestructura de correos

```
Leé AGENTS.md y WORKFLOW-GIT.md. Estás en la rama feature/mail-infra (si no
existe, creala desde main actualizado antes de tocar nada).

Objetivo: dejar lista la capa de envío de correos de Happy Paws, sin conectarla
todavía a ninguna pantalla. Las variables de entorno SMTP_USER, SMTP_PASS,
MAIL_ADMIN y APP_URL ya las configura Tinu en su .env. NO leas ni muestres el
contenido de .env en tus respuestas.

1. Instalá nodemailer y @types/nodemailer.

2. Creá lib/mail.ts con una función sendMail({ to, subject, html, text, replyTo? })
   que use el SMTP de Gmail (smtp.gmail.com, puerto 465, secure) con SMTP_USER y
   SMTP_PASS. Reglas:
   - El campo From es siempre "Happy Paws" <SMTP_USER>. Nunca uses un email
     ingresado por un usuario como From (eso es suplantación). Si hay que
     responderle a un usuario, usá replyTo.
   - Devuelve { ok: boolean }. Si falla, captura el error, loguealo SIN incluir
     credenciales, y devolvé { ok: false }. Nunca lances una excepción que rompa
     el flujo de quien llama.
   - Validá que "to" y "replyTo" tengan formato de email y no contengan saltos
     de línea (evitar inyección de cabeceras).

3. Creá lib/mail-templates.ts con una función escapeHtml y estas plantillas, cada
   una devolviendo { subject, html, text }. Layout HTML simple con estilos inline,
   paleta marrón del proyecto (fondo #FDF6EE, títulos #6B3F1F, botón #6B3F1F con
   texto claro) y tono cálido, nunca alarmista. Todo dato de usuario que entre al
   HTML debe pasar por escapeHtml:
   - protectoraEnRevision(nombreProtectora): "Recibimos tu solicitud de ingreso.
     Estamos revisándola y te vamos a escribir a este correo. La respuesta puede
     demorar hasta 72 horas hábiles."
   - solicitudProtectoraParaAdmin(datos): para la casilla de Happy Paws. Incluye
     todos los datos que cargó la protectora (nombre, ubicación, email, teléfono,
     redes/sitio, nombre y cargo del responsable, texto de verificación) y un
     botón/link a `${APP_URL}/admin/protectoras`.
   - protectoraAprobada(nombreProtectora): avisa que ya puede iniciar sesión, con
     link a `${APP_URL}/login`.
   - protectoraRechazada(nombreProtectora, motivo): explica con respeto los motivos
     y dice que puede escribirnos desde el formulario de contacto del sitio.
   - reporteParaAdmin(emailUsuario, mensaje): para la casilla de Happy Paws, con
     el mensaje del usuario y su email visible.
   - reporteConfirmacion(): copia para el usuario: "Recibimos tu reporte y te
     vamos a responder a este correo."

4. Creá un script scripts/test-mail.ts que envíe una de las plantillas de prueba
   a MAIL_ADMIN, para que Tinu verifique que llega. Agregá en package.json un
   script "mail:test" para correrlo (instalá tsx como devDependency si hace
   falta) y asegurate de que cargue el .env.

5. Creá (o actualizá) .env.example con los NOMBRES de las variables nuevas
   (SMTP_USER, SMTP_PASS, MAIL_ADMIN, APP_URL, NEXT_PUBLIC_TURNSTILE_SITE_KEY,
   TURNSTILE_SECRET_KEY) sin valores reales. Confirmá que .env sigue en .gitignore.

No toques ninguna pantalla ni el schema. Corré npm run build y confirmame que
compila. Agregá tu entrada a PROGRESS_LOG.md indicando la rama. No corras
mail:test vos: eso lo hace Tinu para confirmar que le llega el correo.
```

---

## PROMPT 16 — Captcha (Cloudflare Turnstile) + límite de intentos

```
Leé AGENTS.md y WORKFLOW-GIT.md. Estás en la rama feature/captcha (creala desde
main actualizado, que ya incluye feature/mail-infra mergeada).

Objetivo: proteger login y registro contra bots. NO leas ni muestres .env. Las
variables NEXT_PUBLIC_TURNSTILE_SITE_KEY y TURNSTILE_SECRET_KEY ya las configura
Tinu.

1. Instalá @marsidev/react-turnstile.

2. Creá app/components/TurnstileWidget.tsx (client component): renderiza el widget
   con NEXT_PUBLIC_TURNSTILE_SITE_KEY y expone onToken(token | null). Cuando el
   token expira o falla, avisa con onToken(null). Debe poder reiniciarse después
   de un envío fallido (un token solo sirve una vez). Tema claro, integrado
   visualmente con la paleta del proyecto.

3. Creá lib/turnstile.ts con verifyTurnstile(token, ip?): hace POST a
   https://challenges.cloudflare.com/turnstile/v0/siteverify con
   TURNSTILE_SECRET_KEY y devuelve true/false. Si la verificación falla por
   cualquier error de red, devolvé false (fallar cerrado, nunca dejar pasar).

4. Aplicalo a /login y /registro (los dos formularios de /registro): el botón de
   enviar queda deshabilitado hasta que exista un token; el token viaja con el
   envío; el SERVIDOR lo verifica como primer paso, ANTES de revisar contraseñas,
   crear usuarios o enviar correos. Si falla, respondé con un mensaje claro
   ("No pudimos verificar que sos una persona. Probá de nuevo.") y reiniciá el
   widget. No toques el componente de la mascota animada del login; tiene que
   seguir funcionando igual.

5. Creá lib/rateLimit.ts, un limitador simple en memoria por IP (Map con ventana
   de tiempo), y aplicalo a los endpoints de login (máx. 8 intentos por minuto) y
   registro (máx. 5 por hora). Al superar el límite devolvé 429 con un mensaje
   amable. Dejá un comentario aclarando que es en memoria (válido para un solo
   proceso, MVP) y que en producción con varias instancias conviene un store
   compartido.

Corré npm run build y confirmá que compila. Probá: login con captcha resuelto
(funciona), enviando sin token o con token inválido (rechaza), y superando el
límite de intentos (429). Agregá tu entrada a PROGRESS_LOG.md indicando la rama.
```

---

## PROMPT 17 — Verificación de protectoras + panel de administración

```
Leé AGENTS.md y WORKFLOW-GIT.md. Estás en la rama feature/verificacion-protectoras
(creala desde main actualizado, que ya incluye mail-infra y captcha).

Objetivo: que una protectora nueva no pueda operar hasta que Happy Paws verifique
que existe y que quien registra es parte de ella. NO leas ni muestres .env.

IMPORTANTE: antes de cambiar nada, leé prisma/schema.prisma y el código real de
registro/login/sesión (el proyecto cambió bastante desde el diseño original).
Adaptá los nombres de modelos y campos a lo que existe de verdad.

1. Schema + migración (nombre: verificacion_protectoras):
   - enum EstadoVerificacion { PENDIENTE APROBADA RECHAZADA }
   - En el modelo de la protectora agregá: estadoVerificacion con
     @default(APROBADA) (así las protectoras ya existentes y las del seed de
     FUPA quedan aprobadas; las registraciones nuevas lo setean explícitamente
     en PENDIENTE desde el código), instagram?, facebook?, sitioWeb?,
     telefonoContacto?, nombreResponsable?, cargoResponsable?,
     textoVerificacion? (@db.Text), motivoRechazo? (@db.Text), fechaSolicitud?,
     fechaRevision?.
   - Agregá el rol ADMIN de plataforma al enum de roles que corresponda.

2. Formulario de registro de protectora (/registro): además de los datos
   comunes, pedí: Instagram, Facebook, sitio web (al menos UNO es obligatorio),
   teléfono/WhatsApp de contacto, nombre y cargo de la persona responsable, y un
   textarea "¿Cómo podemos comprobar que formás parte de la protectora?". Validá
   en cliente Y en servidor: al menos un enlace, URLs válidas (http/https), y
   largos máximos razonables en todos los campos.

3. Al enviar el registro de una protectora:
   - Crear usuario + protectora con estadoVerificacion PENDIENTE y fechaSolicitud.
   - Enviar de inmediato protectoraEnRevision() al email de la protectora y
     solicitudProtectoraParaAdmin() a MAIL_ADMIN. Si algún envío falla, el
     registro igual se guarda (la solicitud aparece en el panel admin de todos
     modos); solo logueá el error.
   - NO iniciar sesión automáticamente. Mostrar una pantalla de confirmación:
     "Solicitud enviada. La estamos revisando; te escribimos a tu correo. Puede
     demorar hasta 72 horas hábiles."

4. Login: si la protectora está PENDIENTE, no dejar entrar y mostrar "Tu solicitud
   está en revisión. Te vamos a avisar por correo." Si está RECHAZADA, mostrar
   "Tu solicitud no fue aprobada. Revisá tu correo para ver los motivos." Como
   defensa en profundidad, todas las acciones de protectora del lado servidor
   (publicar mascotas, gestionar solicitudes, etc.) deben chequear que
   estadoVerificacion sea APROBADA. Las listas públicas (/protectoras, mascotas)
   solo muestran protectoras APROBADAS.

5. Panel /admin/protectoras (solo rol ADMIN, validado en el servidor con la
   cookie firmada; cualquier otro rol recibe 403/redirect):
   - Pestañas "Pendientes" y "Revisadas".
   - Cada solicitud muestra todos los datos cargados; los enlaces se abren en
     pestaña nueva con rel="noopener noreferrer".
   - Botón Aprobar: pone APROBADA + fechaRevision y envía protectoraAprobada().
   - Botón Rechazar: pide un motivo obligatorio, pone RECHAZADA + motivoRechazo
     + fechaRevision y envía protectoraRechazada() al email registrado.
   - En "Revisadas", botón "Volver a pendiente" por si hay que reabrir un caso.
   - Mismo estilo visual del resto del sitio.

6. Script scripts/crear-admin.ts: crea un usuario ADMIN pidiendo email y
   contraseña por terminal (sin guardarlos en ningún archivo), con el mismo hash
   que usa el registro real. Agregá un script npm "admin:crear". No lo corras
   vos: lo corre Tinu.

7. Confirmá que el seed existente deja a FUPA y a las protectoras demo como
   APROBADA.

Corré npm run build y confirmá que compila. Probá el flujo completo: registrar
protectora nueva, ver que no puede entrar, aprobarla desde el panel admin, ver
que ya entra; y repetir con un rechazo. Agregá tu entrada a PROGRESS_LOG.md
indicando la rama y aclarando que quien haga pull debe correr prisma migrate
deploy y prisma generate.
```

---

## PROMPT 18 — Footer + formulario de reportes

```
Leé AGENTS.md y WORKFLOW-GIT.md. Estás en la rama feature/reportes-contacto
(creala desde main actualizado, que ya incluye mail-infra, captcha y
verificación). NO leas ni muestres .env.

Objetivo: que cualquier persona pueda reportar un problema desde el footer.

1. Schema + migración (nombre: reportes): modelo Reporte con id, email, mensaje
   (@db.Text), emailEnviado (Boolean, default false) y createdAt.

2. Footer: revisá app/layout.tsx. Si ya hay footer, usalo; si no, creá uno simple
   (paleta marrón del proyecto, ancho máximo centrado) con el texto
   "¿Tuviste un problema? Comunicate con nosotros" como botón que abre un modal.

3. Modal ContactModal (client component), con accesibilidad correcta: role
   "dialog", aria-modal, se cierra con Esc y con click en el fondo, el foco queda
   dentro mientras está abierto y vuelve al botón al cerrar. Campos:
   - Correo electrónico (obligatorio, formato válido; si hay sesión iniciada,
     precargado con el email del usuario)
   - Mensaje (textarea obligatorio, entre 10 y 2000 caracteres, con contador)
   - Widget de Turnstile (reutilizá app/components/TurnstileWidget.tsx)
   - Un campo honeypot oculto (invisible para personas, no usar display:none
     simple; ocultalo fuera de pantalla y con aria-hidden/tabIndex -1). Si viene
     completado, el servidor responde "ok" sin guardar ni enviar nada.
   Estados: enviando, éxito ("Gracias. Te vamos a responder al correo que
   ingresaste.") y error con mensaje claro.

4. Endpoint POST de reportes: orden estricto de validaciones: rate limit
   (máx. 3 por hora por IP, reutilizá lib/rateLimit.ts) → honeypot → Turnstile →
   validación de email y largo del mensaje. Luego:
   - Guardar el Reporte en la base ANTES de enviar correos.
   - Enviar reporteParaAdmin() a MAIL_ADMIN con replyTo = email del usuario, para
     que al responder desde Gmail la respuesta vaya directo a esa persona.
   - Enviar reporteConfirmacion() al email del usuario.
   - Actualizar emailEnviado según el resultado. Si falla el envío, el usuario
     igual ve el éxito (el reporte quedó guardado); solo logueá el error.

5. Todo texto del usuario que vaya a HTML de correo pasa por escapeHtml.

Corré npm run build y confirmá que compila. Probá: enviar un reporte válido (llega
a MAIL_ADMIN con Reply-To correcto), enviar sin captcha (rechaza), superar el
límite (429) y cerrar el modal con Esc. Agregá tu entrada a PROGRESS_LOG.md
indicando la rama y aclarando que quien haga pull debe correr prisma migrate
deploy y prisma generate.
```

---

## Pendientes que quedan fuera de estos 4 prompts (para el backlog)
- Verificar que el correo del usuario le pertenece (link de confirmación): hoy los
  motivos de rechazo y las respuestas a reportes dependen de que haya escrito bien
  su email.
- Que una protectora rechazada pueda corregir y reenviar sin intervención manual.
- Mover los envíos a un proveedor con dominio propio (Resend, etc.) antes de
  abrir al público; Gmail SMTP alcanza para el MVP (tiene un tope diario de
  envíos).
- Términos y privacidad reales, que mencionen el uso de datos de contacto y
  reportes.
