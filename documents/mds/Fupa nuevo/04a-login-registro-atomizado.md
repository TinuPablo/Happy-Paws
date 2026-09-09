# Prompt 4 (atomizado) — Login y registro (visual, mock)

> Pasale un sub-paso por vez. Recordá: NO es autenticación real, es solo
> interfaz — hay comentarios en el código marcando qué es mock.

---

## Sub-paso 1 — Formulario de login

```
Leé AGENTS.md.

Reemplazá el contenido de app/(auth)/login/page.tsx (mantené "use client" al
principio del archivo porque va a usar useState) por este código exacto:

"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // MOCK: acá va la validación real contra el backend cuando exista.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Login simulado (mock). Falta conectar autenticación real.");
    }, 800);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--brown-lightest)] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-[var(--brown-light)] bg-white p-8"
      >
        <h1 className="text-xl font-medium text-[var(--text-dark)]">
          Iniciar sesión
        </h1>
        <label className="mt-6 block text-sm text-[var(--text-mid)]">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
          />
        </label>
        <label className="mt-4 block text-sm text-[var(--text-mid)]">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-[var(--brown-dark)] px-4 py-2 font-medium text-[var(--brown-lightest)] disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
        <a
          href="/registro"
          className="mt-4 block text-center text-sm text-[var(--brown-main)]"
        >
          ¿No tenés cuenta? Registrate
        </a>
      </form>
    </main>
  );
}

No agregues nada más todavía.
```

---

## Sub-paso 2 — Registro: selector de tipo de usuario

```
Leé AGENTS.md.

Reemplazá el contenido de app/(auth)/registro/page.tsx (con "use client" al
principio) por este código exacto, que solo maneja el selector de tipo de
usuario por ahora (el formulario completo va en el próximo sub-paso):

"use client";

import { useState } from "react";

type TipoUsuario = "adoptante" | "protectora" | null;

export default function RegistroPage() {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--brown-lightest)] px-6 py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-xl font-medium text-[var(--text-dark)]">
          Crear cuenta
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--text-mid)]">
          ¿Qué tipo de cuenta querés crear?
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setTipoUsuario("adoptante")}
            className={`rounded-2xl border p-4 text-center ${
              tipoUsuario === "adoptante"
                ? "border-[var(--brown-main)] bg-[var(--brown-light)]"
                : "border-[var(--brown-light)] bg-white"
            }`}
          >
            <span className="block text-2xl">🐾</span>
            <span className="mt-2 block text-sm font-medium text-[var(--text-dark)]">
              Quiero adoptar
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTipoUsuario("protectora")}
            className={`rounded-2xl border p-4 text-center ${
              tipoUsuario === "protectora"
                ? "border-[var(--brown-main)] bg-[var(--brown-light)]"
                : "border-[var(--brown-light)] bg-white"
            }`}
          >
            <span className="block text-2xl">🏠</span>
            <span className="mt-2 block text-sm font-medium text-[var(--text-dark)]">
              Soy una protectora
            </span>
          </button>
        </div>
        {tipoUsuario && (
          <p className="mt-6 text-center text-sm text-[var(--text-light)]">
            (El formulario para "{tipoUsuario}" se agrega en el próximo paso)
          </p>
        )}
      </div>
    </main>
  );
}

No agregues el formulario completo todavía, solo este selector.
```

---

## Sub-paso 3 — Registro: formulario común (adoptante)

```
Leé AGENTS.md.

En app/(auth)/registro/page.tsx, reemplazá el bloque:

{tipoUsuario && (
  <p className="mt-6 text-center text-sm text-[var(--text-light)]">
    (El formulario para "{tipoUsuario}" se agrega en el próximo paso)
  </p>
)}

por este formulario (agregá los useState de nombre, email, password,
telefono arriba, junto al de tipoUsuario que ya existe):

{tipoUsuario === "adoptante" && (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      alert("Registro simulado (mock). Falta conectar backend real.");
    }}
    className="mt-6 rounded-2xl border border-[var(--brown-light)] bg-white p-6"
  >
    <label className="block text-sm text-[var(--text-mid)]">
      Nombre completo
      <input
        type="text"
        required
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
      />
    </label>
    <label className="mt-4 block text-sm text-[var(--text-mid)]">
      Email
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
      />
    </label>
    <label className="mt-4 block text-sm text-[var(--text-mid)]">
      Teléfono (opcional)
      <input
        type="tel"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
      />
    </label>
    <label className="mt-4 block text-sm text-[var(--text-mid)]">
      Contraseña
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
      />
    </label>
    <button
      type="submit"
      className="mt-6 w-full rounded-xl bg-[var(--brown-dark)] px-4 py-2 font-medium text-[var(--brown-lightest)]"
    >
      Crear cuenta
    </button>
  </form>
)}

Agregá estos useState junto al de tipoUsuario:
const [nombre, setNombre] = useState("");
const [email, setEmail] = useState("");
const [telefono, setTelefono] = useState("");
const [password, setPassword] = useState("");

No agregues el bloque de "protectora" todavía, eso es el próximo sub-paso.
```

---

## Sub-paso 4 — Registro: campos extra para protectora

```
Leé AGENTS.md.

En app/(auth)/registro/page.tsx, agregá DESPUÉS del bloque
{tipoUsuario === "adoptante" && (...)} este otro bloque (mismo nivel, como
hermano):

{tipoUsuario === "protectora" && (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      alert("Registro simulado (mock). Falta conectar backend real.");
    }}
    className="mt-6 rounded-2xl border border-[var(--brown-light)] bg-white p-6"
  >
    <label className="block text-sm text-[var(--text-mid)]">
      Nombre de la protectora
      <input
        type="text"
        required
        value={nombreProtectora}
        onChange={(e) => setNombreProtectora(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
      />
    </label>
    <label className="mt-4 block text-sm text-[var(--text-mid)]">
      Ubicación
      <input
        type="text"
        required
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
      />
    </label>
    <label className="mt-4 block text-sm text-[var(--text-mid)]">
      Email de contacto
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
      />
    </label>
    <label className="mt-4 block text-sm text-[var(--text-mid)]">
      Contraseña
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
      />
    </label>
    <button
      type="submit"
      className="mt-6 w-full rounded-xl bg-[var(--brown-dark)] px-4 py-2 font-medium text-[var(--brown-lightest)]"
    >
      Crear cuenta de protectora
    </button>
  </form>
)}

Agregá estos dos useState nuevos junto a los que ya existen:
const [nombreProtectora, setNombreProtectora] = useState("");
const [ubicacion, setUbicacion] = useState("");

(email y password ya existen del sub-paso anterior, reutilizalos)
```

---

## Sub-paso 5 — Verificación final

```
Leé AGENTS.md.

Corré npm run build. Confirmame que compila sin errores. Navegá /login y
/registro, probá elegir "adoptante" y "protectora" en el registro y
confirmame que cada uno muestra su formulario correspondiente.

Reportá solamente.
```

---

## Al terminar
Actualizá en `AGENTS.md`:
```
- [x] Login/registro con diseño real (visual, sin lógica real)
```
