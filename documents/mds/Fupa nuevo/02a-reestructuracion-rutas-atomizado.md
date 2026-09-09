# Prompt 2 (atomizado) — Reestructuración de rutas

> Pasale un sub-paso por vez. Verificá que compile y que la ruta cargue en el
> navegador antes de pasar al siguiente.

---

## Sub-paso 0 — Variables CSS base (una sola vez, antes de todo)

```
Leé AGENTS.md.

Abrí app/globals.css y verificá si ya existen estas variables CSS en :root.
Si NO existen, agregalas dentro de :root (no dupliques si ya están):

:root {
  --brown-lightest: #FDF6EE;
  --brown-light: #F5E6D0;
  --brown-mid: #C8956C;
  --brown-main: #9B6B47;
  --brown-dark: #6B3F1F;
  --brown-darker: #4A2A0E;
  --cream: #FAF3E8;
  --text-dark: #3D2010;
  --text-mid: #6B4A2F;
  --text-light: #A07850;
  --green-ok: #5A8A5A;
  --gold: #D4A843;
}

No cambies nada más del archivo. Confirmame si ya existían o si las agregaste.
```

---

## Sub-paso 1 — Carpeta y página de mascotas

```
Leé AGENTS.md.

Creá el archivo app/mascotas/page.tsx con este contenido exacto:

export default function MascotasPage() {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Mascotas en adopción
      </h1>
      <p className="mt-2 text-[var(--text-mid)]">
        Acá va el listado de mascotas disponibles para adopción.
      </p>
    </main>
  );
}

No agregues nada más todavía. Solo creá el archivo tal cual.
```

---

## Sub-paso 2 — Carpeta y página de detalle de mascota

```
Leé AGENTS.md.

Creá el archivo app/mascotas/[id]/page.tsx con este contenido exacto:

export default function MascotaDetallePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Detalle de mascota
      </h1>
      <p className="mt-2 text-[var(--text-mid)]">
        Legajo de la mascota con id: {params.id}
      </p>
    </main>
  );
}

No agregues nada más todavía. Solo creá el archivo tal cual.
```

---

## Sub-paso 3 — Carpeta y página de protectoras

```
Leé AGENTS.md.

Creá el archivo app/protectoras/page.tsx con este contenido exacto:

export default function ProtectorasPage() {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Protectoras
      </h1>
      <p className="mt-2 text-[var(--text-mid)]">
        Acá va el listado de protectoras participantes.
      </p>
    </main>
  );
}

No agregues nada más todavía. Solo creá el archivo tal cual.
```

---

## Sub-paso 4 — Carpeta y página de detalle de protectora

```
Leé AGENTS.md.

Creá el archivo app/protectoras/[id]/page.tsx con este contenido exacto:

export default function ProtectoraDetallePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Perfil de protectora
      </h1>
      <p className="mt-2 text-[var(--text-mid)]">
        Datos de la protectora con id: {params.id}
      </p>
    </main>
  );
}

No agregues nada más todavía. Solo creá el archivo tal cual.
```

---

## Sub-paso 5 — Página de guías (mover contenido existente)

```
Leé AGENTS.md.

Tarea en dos partes:

1. Creá el archivo app/guias/page.tsx.
2. Movéle DENTRO el contenido de razas y guías que hoy está en app/page.tsx
   (el que sobrevivió a la eliminación de la mascota virtual). No reescribas
   su lógica interna, solo cambiá su ubicación y ajustá los imports
   relativos que hagan falta (por ejemplo si importa desde ../lib o ../data,
   ahora la ruta relativa cambia por estar un nivel más adentro).

Al terminar, dejá app/page.tsx con un placeholder temporal:

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Happy Paws
      </h1>
      <p className="mt-2 text-[var(--text-mid)]">
        Landing en construcción.
      </p>
    </main>
  );
}

Reportame qué imports tuviste que ajustar.
```

---

## Sub-paso 6 — Carpetas de login y registro

```
Leé AGENTS.md.

Creá estos dos archivos con contenido placeholder simple:

app/(auth)/login/page.tsx:

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Iniciar sesión
      </h1>
    </main>
  );
}

app/(auth)/registro/page.tsx:

export default function RegistroPage() {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Crear cuenta
      </h1>
    </main>
  );
}

No agregues nada más todavía.
```

---

## Sub-paso 7 — Carpeta de perfil

```
Leé AGENTS.md.

Creá app/perfil/page.tsx:

export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Mi perfil
      </h1>
    </main>
  );
}

No agregues nada más todavía.
```

---

## Sub-paso 8 — Navegación global

```
Leé AGENTS.md.

En app/layout.tsx, agregá una barra de navegación simple arriba de
{children}, con estos links usando el componente Link de next/link:
Inicio (/), Mascotas (/mascotas), Protectoras (/protectoras),
Guías (/guias), Perfil (/perfil), Iniciar sesión (/login).

Usá fondo --brown-dark y texto claro para la barra. No hace falta que sea
responsive/con menú hamburguesa todavía, solo que funcione en desktop.

No toques nada más de layout.tsx aparte de agregar esta barra.
```

---

## Sub-paso 9 — Verificación final

```
Leé AGENTS.md.

Corré npm run build y decime si compila sin errores. Navegá (o listame)
que existan y respondan estas rutas: /, /mascotas, /mascotas/1,
/protectoras, /protectoras/1, /guias, /login, /registro, /perfil.

Reportá solamente, no arregles nada todavía.
```

---

## Al terminar
Actualizá en `AGENTS.md`:
```
- [x] Rutas reestructuradas (/mascotas, /protectoras, /guias, /perfil, /login, /registro)
```
