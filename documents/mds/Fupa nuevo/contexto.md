# Contexto y requerimientos para incorporar a la aplicación: Plataforma de adopción responsable de mascotas

## Instrucción general para este proyecto

Quiero incorporar a mi aplicación actual un nuevo módulo o conjunto de funcionalidades orientado a la adopción responsable de mascotas. Este documento explica el contexto completo de la idea, el problema que busca resolver, los usuarios involucrados, el flujo esperado y las funcionalidades que debería contemplar.

La idea debe integrarse respetando la arquitectura, el diseño y el contexto existente de la aplicación. Antes de modificar funcionalidades existentes, se debe analizar cómo incorporar este nuevo módulo de manera coherente con lo que ya está desarrollado.

---

# 1. Idea general

La aplicación incorporará una plataforma digital para facilitar y centralizar el proceso de adopción responsable de mascotas.

La idea inicial es trabajar junto a dos protectoras de animales de Villa Carlos Paz que tienen una actividad importante dentro de la comunidad. La aplicación funcionará como un nexo entre estas protectoras, sus colaboradores, hogares de tránsito y las personas interesadas en adoptar.

No se busca crear solamente un catálogo de perros y gatos disponibles.

La propuesta busca acompañar todo el ciclo del proceso de adopción, desde que una mascota es registrada por una protectora hasta el seguimiento posterior una vez que encuentra un hogar.

El concepto general es:

    Rescate o ingreso del animal
            ↓
    Registro y centralización de información
            ↓
    Hogar de tránsito o cuidado de la protectora
            ↓
    Mascota disponible para adopción
            ↓
    Búsqueda y descubrimiento por parte de adoptantes
            ↓
    Sistema de compatibilidad o match
            ↓
    Solicitud de adopción
            ↓
    Evaluación por parte de la protectora
            ↓
    Adopción
            ↓
    Seguimiento posterior
            ↓
    Historial continuo de la mascota

La plataforma debe convertirse en un punto central de información y gestión, evitando que los datos de los animales y de las adopciones queden dispersos entre WhatsApp, redes sociales, mensajes privados, fotografías en teléfonos o registros informales.

---

# 2. Problema que busca resolver

Las protectoras y las personas que colaboran con ellas suelen manejar una gran cantidad de información sobre los animales, posibles adoptantes, hogares de tránsito y adopciones.

Parte de esta información puede encontrarse distribuida entre:

- WhatsApp.
- Instagram.
- Facebook.
- Mensajes privados.
- Fotografías almacenadas en distintos teléfonos.
- Publicaciones antiguas.
- Planillas.
- Registros personales.
- Diferentes voluntarios y colaboradores.

Esto puede generar dificultades para saber con claridad:

- Qué animales están disponibles actualmente.
- Qué información existe sobre cada animal.
- En qué estado se encuentra cada mascota.
- Quién la tiene a su cuidado.
- Qué personas están interesadas en adoptarla.
- En qué etapa se encuentra cada solicitud.
- Qué información aportó cada colaborador.
- Qué ocurrió con el animal después de ser adoptado.

La aplicación busca centralizar esta información y convertirla en un sistema organizado, accesible para las personas autorizadas y fácil de utilizar.

---

# 3. Público objetivo y actores principales

La plataforma estará dirigida principalmente a cuatro grupos.

## 3.1 Protectoras de animales

Las protectoras serán uno de los actores principales.

Necesitan herramientas para:

- Registrar mascotas.
- Publicar animales disponibles.
- Subir y administrar fotografías.
- Registrar características y necesidades.
- Actualizar el estado de cada animal.
- Gestionar solicitudes de adopción.
- Organizar el proceso de evaluación.
- Registrar adopciones.
- Realizar seguimientos posteriores.
- Consultar el historial completo de cada mascota.

Inicialmente, la idea es trabajar con dos protectoras de animales de Villa Carlos Paz.

La plataforma debería diseñarse teniendo en cuenta las necesidades reales de estas organizaciones y permitir, en el futuro, sumar otras protectoras.

---

## 3.2 Administradores, colaboradores y voluntarios

Las protectoras cuentan con diferentes personas que ayudan de distintas maneras.

La aplicación debería contemplar roles y permisos.

### Administrador de la protectora

Podría tener acceso completo a la gestión.

Por ejemplo:

- Gestionar animales.
- Gestionar colaboradores.
- Revisar y administrar solicitudes.
- Actualizar estados.
- Registrar adopciones.
- Consultar historiales.
- Configurar o administrar seguimientos.

### Colaborador o voluntario

Podría contar con permisos más limitados según su función.

Por ejemplo:

- Actualizar información de determinadas mascotas.
- Subir fotografías.
- Registrar novedades.
- Agregar observaciones.
- Participar en tareas de seguimiento.

### Hogar de tránsito

Podría contar con un acceso específico para registrar información sobre el animal que tiene temporalmente a su cuidado.

Por ejemplo:

- Subir fotografías.
- Registrar cambios de comportamiento.
- Informar sobre adaptación.
- Registrar necesidades especiales.
- Agregar observaciones.
- Actualizar novedades relevantes.

El objetivo es que la información importante no dependa de una única persona.

---

## 3.3 Adoptantes

Las personas interesadas en adoptar podrán tener un perfil dentro de la aplicación.

Deberían poder:

- Ver mascotas disponibles.
- Buscar y filtrar animales.
- Consultar fotografías.
- Conocer la historia de cada mascota.
- Ver características y necesidades.
- Guardar favoritos.
- Completar un perfil relacionado con su estilo de vida.
- Recibir sugerencias de mascotas compatibles.
- Enviar solicitudes de adopción.
- Consultar el estado de sus solicitudes.
- Mantener un vínculo posterior a la adopción mediante el sistema de seguimiento.

---

# 4. Perfil y legajo digital de cada mascota

Cada mascota debe contar con un perfil propio.

Este perfil funcionará como un legajo digital que centralice su información durante toda su historia dentro de la plataforma.

La información podría incluir:

- Fotografías.
- Nombre.
- Especie.
- Sexo.
- Edad aproximada.
- Tamaño.
- Raza o tipo.
- Estado de salud.
- Historia o descripción.
- Personalidad.
- Nivel de energía.
- Compatibilidad con niños.
- Compatibilidad con perros.
- Compatibilidad con gatos.
- Necesidades especiales.
- Requerimientos del hogar.
- Observaciones relevantes.
- Protectora responsable.
- Persona o lugar que actualmente tiene a su cuidado.
- Estado actual dentro del proceso.

Los estados posibles pueden evolucionar según el diseño final, pero inicialmente podrían contemplarse:

    Rescatado
        ↓
    En cuidado de protectora o hogar de tránsito
        ↓
    Disponible para adopción
        ↓
    En proceso de adopción
        ↓
    Adoptado

También puede ser necesario permitir otros estados, como tratamiento, no disponible temporalmente, reserva o casos especiales.

Es importante que la información del animal no desaparezca después de la adopción.

---

# 5. Listado y búsqueda de mascotas

Los adoptantes deben poder navegar por un catálogo de mascotas disponibles.

Cada mascota debe contar con una presentación visual atractiva, especialmente mediante fotografías, junto con información básica.

La búsqueda debería poder filtrarse según características relevantes, por ejemplo:

- Especie.
- Edad.
- Sexo.
- Tamaño.
- Raza o tipo.
- Nivel de energía.
- Compatible con niños.
- Compatible con perros.
- Compatible con gatos.
- Necesidades especiales.
- Otras características relevantes que surjan del modelo de datos.

El objetivo no es solamente mostrar todos los animales, sino ayudar a que las personas encuentren mascotas que puedan adaptarse razonablemente a su realidad.

---

# 6. Sistema de compatibilidad o match

Uno de los principales diferenciales será un sistema de compatibilidad entre mascotas y posibles adoptantes.

El usuario interesado en adoptar podría completar un cuestionario o perfil relacionado con su contexto.

Por ejemplo:

## Sobre el hogar

- ¿Vive en casa o departamento?
- ¿Cuenta con patio?
- ¿Cuántas personas viven en el hogar?
- ¿Hay niños?

## Sobre la rutina

- ¿Cuántas horas permanece fuera de casa?
- ¿Cuánto tiempo puede dedicarle a una mascota?
- ¿Busca una mascota tranquila, moderadamente activa o muy activa?

## Sobre experiencia y convivencia

- ¿Tiene otras mascotas?
- ¿Convive con perros?
- ¿Convive con gatos?
- ¿Tuvo mascotas anteriormente?
- ¿Qué tipo de experiencia tiene en el cuidado de animales?

Cada mascota también tendrá características y necesidades que permitan compararla con el perfil del adoptante.

Por ejemplo:

- Puede vivir en departamento.
- Requiere patio.
- Compatible con gatos.
- Compatible con niños.
- Necesita compañía frecuente.
- No es recomendable dejarla sola durante muchas horas.
- Nivel de energía alto.
- Requiere experiencia previa.

El sistema puede generar una puntuación o nivel de compatibilidad.

Ejemplo conceptual:

    Luna
    Compatibilidad estimada: 91%

    ✓ Puede vivir en departamento.
    ✓ Compatible con gatos.
    ✓ Nivel de energía medio.
    ✓ Adecuada para familias.

    Atención:
    Requiere compañía y no es recomendable dejarla sola durante muchas horas.

Importante: el sistema de match no debe decidir automáticamente quién puede adoptar.

Su función es sugerir y facilitar el descubrimiento de mascotas potencialmente compatibles.

La decisión final sobre una adopción debe permanecer en manos de la protectora.

El sistema puede implementarse inicialmente mediante reglas y puntuaciones, sin necesidad de utilizar inteligencia artificial compleja.

---

# 7. Solicitud de adopción

Cuando un usuario encuentre una mascota que le interese, debe poder iniciar una solicitud de adopción.

En lugar de limitarse a un simple botón de contacto, la aplicación debería permitir un proceso organizado.

La solicitud puede incluir información como:

- Datos básicos del interesado.
- Tipo de vivienda.
- Integrantes del hogar.
- Existencia de patio u otros espacios.
- Otras mascotas.
- Experiencia previa.
- Tiempo disponible.
- Motivos para adoptar.
- Información adicional requerida por la protectora.

Las protectoras podrían revisar estas solicitudes y actualizar su estado.

Ejemplo de flujo:

    Solicitud enviada
            ↓
    En evaluación
            ↓
    Se solicita información adicional
            ↓
    Aprobada

o

    Rechazada

El diseño debería permitir que el proceso pueda evolucionar si las protectoras necesitan agregar entrevistas, visitas u otras etapas.

---

# 8. Proceso de adopción

La aplicación debe permitir representar el proceso completo y conocer en qué etapa se encuentra cada caso.

Conceptualmente:

    Mascota disponible
            ↓
    Usuario interesado
            ↓
    Match o descubrimiento
            ↓
    Solicitud de adopción
            ↓
    Evaluación
            ↓
    Comunicación o solicitud de información adicional
            ↓
    Aprobación
            ↓
    Adopción registrada
            ↓
    Inicio del seguimiento posterior

Cada adopción debe quedar vinculada tanto a la mascota como al adoptante y a la protectora responsable.

---

# 9. Seguimiento posterior a la adopción

El seguimiento posterior será uno de los elementos más importantes y diferenciales de la aplicación.

La idea central es que la historia de una mascota no termine cuando encuentra un hogar.

Una vez realizada la adopción, el animal debe continuar formando parte de la plataforma.

El sistema podría programar o sugerir seguimientos en diferentes momentos.

Por ejemplo:

- 7 días después de la adopción.
- 1 mes.
- 3 meses.
- 6 meses.
- 1 año.

Estos períodos deberían poder ser configurables según las necesidades de cada protectora.

El adoptante podría recibir una invitación sencilla y amigable para compartir una actualización.

Ejemplo conceptual:

    ¡Hace un mes que Luna está con vos!
    ¿Cómo se está adaptando a su nuevo hogar?

El adoptante podría:

- Contar cómo está la mascota.
- Subir fotografías.
- Compartir novedades.
- Informar sobre su adaptación.
- Comunicar cambios importantes.
- Mantener el contacto con la protectora.

La experiencia debe sentirse cercana y amena, evitando que el seguimiento se perciba solamente como un mecanismo de control.

---

# 10. Historial y línea de vida de la mascota

Cada mascota debería contar con una línea de tiempo o historial de acontecimientos importantes.

Ejemplo:

    10 de enero
    Luna fue rescatada.

    15 de enero
    Ingresó a un hogar de tránsito.

    2 de febrero
    Fue publicada para adopción.

    15 de febrero
    Se recibió una solicitud de adopción.

    1 de marzo
    Luna fue adoptada.

    10 de marzo
    Su nueva familia compartió una actualización.

    1 de abril
    Se realizó un seguimiento.

El historial debe ayudar a conservar la información aunque cambien los voluntarios, administradores o personas que participan dentro de la protectora.

La mascota debería tener una historia continua dentro del sistema.

---

# 11. Centralización de información

Uno de los objetivos principales es evitar un escenario donde la información esté dispersa.

Situación actual conceptual:

    PROTECTORA
        ├── WhatsApp
        ├── Instagram
        ├── Facebook
        ├── Mensajes privados
        ├── Fotografías en celulares
        ├── Planillas
        └── Información distribuida entre voluntarios

Situación deseada:

                    PLATAFORMA
                        │
            ┌───────────┼───────────┐
            │           │           │
       PROTECTORAS  COLABORADORES  ADOPTANTES
            │           │           │
            └───────────┼───────────┘
                        │
                 HISTORIAL CENTRAL
                   DE LA MASCOTA

La aplicación debe actuar como un punto de referencia para la información relevante.

---

# 12. Flujo general del sistema

La plataforma debería contemplar el siguiente recorrido general:

    PROTECTORA / COLABORADOR
                ↓
        REGISTRO DE MASCOTA
                ↓
       INFORMACIÓN Y FOTOGRAFÍAS
                ↓
      ESTADO Y DISPONIBILIDAD
                ↓
       PUBLICACIÓN PARA ADOPCIÓN
                ↓
    BÚSQUEDA POR PARTE DEL USUARIO
                ↓
      FILTROS Y SISTEMA DE MATCH
                ↓
       SOLICITUD DE ADOPCIÓN
                ↓
    EVALUACIÓN POR LA PROTECTORA
                ↓
           ADOPCIÓN
                ↓
      SEGUIMIENTO POSTERIOR
                ↓
      HISTORIAL CONTINUO DEL ANIMAL

---

# 13. Funcionalidades principales a incorporar

Estas son las funcionalidades principales que se espera incorporar o diseñar dentro de la aplicación.

## Gestión de usuarios y roles

- Adoptantes.
- Administradores de protectoras.
- Colaboradores o voluntarios.
- Hogares de tránsito.
- Posibilidad de definir permisos según el rol.

## Gestión de protectoras

- Perfil de la protectora.
- Información básica.
- Personas autorizadas.
- Mascotas asociadas.
- Gestión de procesos y solicitudes.

## Gestión de mascotas

- Crear mascota.
- Editar información.
- Subir fotografías.
- Registrar características.
- Definir necesidades.
- Actualizar estado.
- Registrar observaciones.
- Mantener historial.

## Catálogo de adopciones

- Listado visual de mascotas.
- Fotografías.
- Información básica.
- Página de detalle.
- Filtros de búsqueda.
- Estado de disponibilidad.

## Perfil del adoptante

- Datos del usuario.
- Información sobre hogar y rutina.
- Información sobre experiencia.
- Información sobre otras mascotas.
- Preferencias.

## Sistema de match

- Comparación entre perfil del adoptante y necesidades de la mascota.
- Puntuación o nivel de compatibilidad.
- Explicación de los factores principales.
- Sugerencia de mascotas.
- El match no reemplaza la decisión de la protectora.

## Solicitudes de adopción

- Envío de solicitud.
- Formulario.
- Estados del proceso.
- Información adicional.
- Relación entre usuario, mascota y protectora.

## Registro de adopciones

- Confirmación de adopción.
- Cambio de estado de la mascota.
- Asociación con el adoptante.
- Inicio del período de seguimiento.

## Seguimiento posterior

- Seguimientos programados o configurables.
- Recordatorios.
- Respuestas del adoptante.
- Fotografías.
- Actualizaciones.
- Registro dentro del historial.

## Historial de la mascota

- Línea de tiempo.
- Eventos importantes.
- Cambios de estado.
- Actualizaciones.
- Adopción.
- Seguimientos.

---

# 14. Propuesta de valor

La aplicación no debe plantearse únicamente como un sitio donde se publican animales disponibles.

Su principal valor es cubrir el proceso completo:

    Gestión de la mascota
            +
    Publicación
            +
    Búsqueda
            +
    Compatibilidad
            +
    Solicitud
            +
    Evaluación
            +
    Adopción
            +
    Seguimiento
            +
    Historial

Esto permite ofrecer valor a todos los participantes.

## Para las protectoras

- Mejor organización.
- Información centralizada.
- Gestión de animales.
- Gestión de solicitudes.
- Menor dependencia de conversaciones dispersas.
- Historial de mascotas.
- Seguimiento organizado.

## Para colaboradores y hogares de tránsito

- Un lugar para registrar información.
- Menos pérdida de datos.
- Participación según permisos.
- Historial compartido y actualizado.

## Para adoptantes

- Mejor experiencia de búsqueda.
- Información más clara.
- Filtros.
- Mascotas compatibles con su situación.
- Proceso de adopción organizado.
- Comunicación y seguimiento posterior.

## Para las mascotas

El objetivo final es aumentar las posibilidades de encontrar un hogar adecuado y mantener un registro de su historia y bienestar después de la adopción.

---

# 15. Enfoque inicial del proyecto

La aplicación debe comenzar con un alcance local y realista.

El objetivo inicial es trabajar con dos protectoras importantes de Villa Carlos Paz.

Esto permite:

- Validar la idea con usuarios reales.
- Conocer problemas concretos.
- Diseñar funcionalidades basadas en necesidades reales.
- Probar el flujo de adopción.
- Ajustar el sistema antes de pensar en una expansión mayor.

La posible evolución futura podría ser:

    Villa Carlos Paz
            ↓
    Región de Punilla
            ↓
    Provincia de Córdoba
            ↓
    Otras regiones

La expansión no es el objetivo inmediato. La prioridad es construir una solución útil y funcional para las protectoras iniciales.

---

# 16. MVP o primera versión recomendada

Para evitar intentar desarrollar todo al mismo tiempo, la primera versión debería centrarse en las funcionalidades esenciales.

## Para protectoras

- Registro de mascotas.
- Edición de información.
- Carga de fotografías.
- Estados de la mascota.
- Gestión básica de solicitudes.

## Para adoptantes

- Registro y perfil.
- Catálogo de mascotas.
- Filtros.
- Vista detallada de cada mascota.
- Solicitud de adopción.

## Match inicial

- Cuestionario básico.
- Reglas simples de compatibilidad.
- Sugerencias de mascotas compatibles.

## Después de la adopción

- Registro de adopción.
- Seguimientos básicos.
- Carga de actualizaciones y fotografías.
- Historial de la mascota.

Las funcionalidades más complejas pueden incorporarse posteriormente.

---

# 17. Principios importantes para la implementación

Al incorporar estas funcionalidades, se deben tener en cuenta los siguientes principios.

## La aplicación no es solamente un catálogo

Debe contemplar procesos y relaciones entre protectoras, mascotas, adoptantes y colaboradores.

## La protectora mantiene la decisión final

El sistema de match solo recomienda o sugiere.

No debe aprobar automáticamente una adopción.

## La información debe mantenerse después de la adopción

Una mascota adoptada no debe simplemente desaparecer del sistema.

Su estado cambia, pero su historial continúa.

## Los permisos son importantes

No todos los colaboradores deben tener acceso a la misma información ni a las mismas acciones.

## El sistema debe poder crecer

Aunque inicialmente se trabaje con dos protectoras, el modelo debería evitar decisiones que impidan sumar otras protectoras en el futuro.

## La experiencia debe ser cercana

Especialmente en el seguimiento posterior, la aplicación debe sentirse humana y amigable.

---

# 18. Concepto central del proyecto

La aplicación busca conectar los siguientes actores:

                    PROTECTORAS
                        │
                        │
    COLABORADORES ─── PLATAFORMA ─── ADOPTANTES
                        │
                        │
                 HOGARES DE TRÁNSITO

Todos participan, con diferentes roles, en el proceso de ayudar a una mascota a encontrar un hogar adecuado y mantener un vínculo organizado con su historia.

---

# 19. Objetivo principal

El objetivo de la aplicación es:

> Facilitar el encuentro entre mascotas que necesitan un hogar y personas interesadas en adoptar, brindando a las protectoras herramientas para gestionar el proceso de adopción, organizar la información de los animales y realizar un seguimiento posterior de cada caso.

---

# 20. Resumen final de la visión

Se busca incorporar a la aplicación una plataforma de adopción responsable de mascotas orientada inicialmente a trabajar con protectoras de animales de Villa Carlos Paz.

La plataforma debe funcionar como un nexo entre:

- Protectoras.
- Administradores.
- Colaboradores.
- Voluntarios.
- Hogares de tránsito.
- Personas interesadas en adoptar.

Debe permitir centralizar la información de cada mascota, publicar animales disponibles, facilitar su búsqueda, generar sugerencias de compatibilidad con posibles adoptantes, gestionar solicitudes y acompañar el proceso posterior a la adopción.

La visión completa del proceso es:

    RESCATE O INGRESO
            ↓
    REGISTRO DE LA MASCOTA
            ↓
    CUIDADO / HOGAR DE TRÁNSITO
            ↓
    PUBLICACIÓN
            ↓
    BÚSQUEDA Y FILTROS
            ↓
    MATCH CON POSIBLES ADOPTANTES
            ↓
    SOLICITUD
            ↓
    EVALUACIÓN
            ↓
    ADOPCIÓN
            ↓
    SEGUIMIENTO
            ↓
    HISTORIAL DE VIDA

La idea principal que debe guiar el desarrollo es:

> La historia de una mascota no termina cuando encuentra un hogar.

La aplicación debe ayudar a encontrar una familia adecuada para cada animal y, al mismo tiempo, permitir que las protectoras mantengan de manera organizada, respetuosa y cercana el seguimiento y la historia de los animales que ayudaron a rescatar.