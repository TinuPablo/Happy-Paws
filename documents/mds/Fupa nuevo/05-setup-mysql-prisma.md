# Prompt 5 — Setup de MySQL + Prisma (primer paso hacia backend real)

> Este prompt tiene una parte manual para VOS (Tinu) y una parte para el agente.
> Hacé la parte manual primero.

---

## Parte manual (la hacés vos, no el agente)

### 1. Crear la base de datos
Con tu cliente de MySQL (SQLTools, MySQL Workbench, o la terminal `mysql -u root -p`),
corré:

```sql
CREATE DATABASE happy_paws CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Crear el archivo `.env` en la raíz del proyecto (vos, no el agente)
Creá (o editá si ya existe) un archivo `.env` en la raíz con esta línea,
reemplazando `TU_PASSWORD` por tu contraseña real de MySQL:

```
DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/happy_paws"
```

### 3. Confirmar que `.env` está en `.gitignore`
Abrí `.gitignore` y verificá que tenga una línea con `.env`. Si no está,
agregala vos mismo ahora, antes de seguir. **No cometas el `.env` a git.**

---

## Parte para el agente (Claude Code)

```
Leé AGENTS.md.

Vamos a conectar el proyecto a MySQL con Prisma. Hacé esto en orden:

1. Instalá las dependencias necesarias: prisma (como devDependency) y
   @prisma/client (como dependency).

2. Copiá el contenido del archivo schema.prisma que está en
   documents/mds/Fupa nuevo/schema.prisma hacia prisma/schema.prisma
   (creando la carpeta prisma/ si no existe). No modifiques el contenido,
   copialo tal cual.

3. Confirmá que existe un archivo .env en la raíz con la variable
   DATABASE_URL. NO leas ni muestres el contenido de .env en tu respuesta
   (puede tener una contraseña) — solo confirmá que la variable existe.

4. Corré: npx prisma migrate dev --name init
   Esto va a crear las tablas en la base de datos real.

5. Corré: npx prisma generate
   Esto genera el cliente de Prisma tipado para usar en el código.

6. Reportame el resultado de los pasos 4 y 5. Si hay un error de conexión
   (por ejemplo, credenciales incorrectas o MySQL no está corriendo), no
   intentes adivinar la contraseña ni modificar el .env vos mismo —
   reportame el error exacto y yo lo reviso con Tinu.

No toques ningún otro archivo del proyecto en este prompt.
```

---

## Verificación
Si todo salió bien, deberías poder abrir tu cliente MySQL y ver las tablas
creadas: `users`, `protectoras`, `miembros_protectora`, `mascotas`, `razas`,
`vacunaciones`, `adoptantes`, `solicitudes_adopcion`.

## Si falla la conexión
Los errores más comunes:
- Contraseña incorrecta en el `.env`
- MySQL no está corriendo (revisá el servicio en Windows: `services.msc`,
  buscá "MySQL")
- El puerto no es 3306 (si lo cambiaste en la instalación)

## Al terminar
Actualizá en `AGENTS.md`:
```
- [x] MySQL + Prisma conectado y migrado
```
