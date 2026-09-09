# Prompt 8 — Sesión mock con rol + perfil condicional

## Contexto para el agente
No hay backend todavía, así que "loguearse" acá es una simulación: guardamos
el estado de sesión (si está logueado, con qué rol, con qué nombre) en el
navegador usando Context + localStorage, para que persista al navegar entre
páginas. Esto se reemplaza por sesión real cuando conectemos MySQL — dejalo
comentado en el código como mock, igual que hicimos con login/registro.

## Prompt

```
Leé AGENTS.md.

Vamos a armar una sesión simulada (mock) con rol, para poder mostrar la
experiencia de "adoptante" y de "protectora" por separado en /perfil.

Tarea 1 — Contexto de sesión mock

Creá app/context/AuthContext.tsx con "use client" al principio:

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Role = "adoptante" | "protectora" | null;

type AuthState = {
  loggedIn: boolean;
  role: Role;
  nombre: string;
};

type AuthContextType = AuthState & {
  login: (nombre: string, role: "adoptante" | "protectora") => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "happy_paws_mock_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    loggedIn: false,
    role: null,
    nombre: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setState(JSON.parse(saved));
    }
  }, []);

  function login(nombre: string, role: "adoptante" | "protectora") {
    const next = { loggedIn: true, role, nombre };
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function logout() {
    const next = { loggedIn: false, role: null, nombre: "" };
    setState(next);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

// MOCK: esta sesión vive en localStorage del navegador, no en un backend
// real. Se reemplaza por sesión/JWT real cuando conectemos MySQL + auth.

Tarea 2 — Envolver la app con el provider

En app/layout.tsx, importá AuthProvider desde "./context/AuthContext" y
envolvé el contenido existente del body (donde ya está {children} y el
BottomNav) con <AuthProvider> ... </AuthProvider>. No cambies nada más de
layout.tsx.

Tarea 3 — Selector de rol en login + conectar con la sesión mock

En app/(auth)/login/page.tsx, agregá un selector de rol como el que ya
existe en /registro (dos botones: "Adoptante" / "Protectora"), guardado en
un useState nuevo (rolSeleccionado). Al hacer submit del formulario:
- Si no eligió rol, no dejes enviar (mostrá algún indicio visual simple,
  no hace falta una librería de validación).
- Si eligió rol, llamá a login(email.split("@")[0], rolSeleccionado) usando
  el hook useAuth (importalo de "../../context/AuthContext" o la ruta
  relativa que corresponda), y redirigí a /perfil usando useRouter de
  "next/navigation" (router.push("/perfil")).

Tarea 4 — Conectar registro con la sesión mock

En app/(auth)/registro/page.tsx, en el submit de CADA uno de los dos
formularios (adoptante y protectora), además del alert mock que ya existe,
llamá a login(nombre, tipoUsuario) — usá el campo nombre para adoptante, y
nombreProtectora para protectora — y redirigí a /perfil con router.push.

Tarea 5 — Perfil condicional por rol

Reemplazá TODO el contenido de app/perfil/page.tsx (con "use client" al
principio) por esto:

"use client";

import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function PerfilPage() {
  const { loggedIn, role, nombre, logout } = useAuth();

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--brown-lightest)] px-6 text-center">
        <h1 className="text-xl font-medium text-[var(--text-dark)]">
          Todavía no iniciaste sesión
        </h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          Iniciá sesión para ver tu perfil.
        </p>
        <Link
          href="/login"
          className="mt-6 rounded-xl bg-[var(--brown-dark)] px-6 py-3 font-medium text-[var(--brown-lightest)]"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-xl font-medium text-[var(--text-dark)]">
        Hola, {nombre}
      </h1>
      <p className="mt-1 text-sm text-[var(--text-light)]">
        {role === "adoptante" ? "Cuenta de adoptante" : "Cuenta de protectora"}
      </p>

      {role === "adoptante" && (
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-[var(--brown-light)] bg-white p-4">
            <h2 className="font-medium text-[var(--text-dark)]">
              Mis solicitudes de adopción
            </h2>
            <p className="mt-1 text-sm text-[var(--text-mid)]">
              Todavía no enviaste ninguna solicitud.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--brown-light)] bg-white p-4">
            <h2 className="font-medium text-[var(--text-dark)]">
              Explorar mascotas
            </h2>
            <Link
              href="/mascotas"
              className="mt-2 inline-block text-sm font-medium text-[var(--brown-main)]"
            >
              Ver mascotas en adopción →
            </Link>
          </div>
        </div>
      )}

      {role === "protectora" && (
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-[var(--brown-light)] bg-white p-4">
            <h2 className="font-medium text-[var(--text-dark)]">
              Mis mascotas publicadas
            </h2>
            <p className="mt-1 text-sm text-[var(--text-mid)]">
              Gestioná el legajo de las mascotas de tu protectora.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--brown-light)] bg-white p-4">
            <h2 className="font-medium text-[var(--text-dark)]">
              Solicitudes recibidas
            </h2>
            <p className="mt-1 text-sm text-[var(--text-mid)]">
              Todavía no recibiste solicitudes de adopción.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--brown-light)] bg-white p-4">
            <h2 className="font-medium text-[var(--text-dark)]">
              Datos de la protectora
            </h2>
            <p className="mt-1 text-sm text-[var(--text-mid)]">
              Ubicación, contacto y descripción pública.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={logout}
        className="mt-8 w-full rounded-xl border border-[var(--brown-light)] px-4 py-2 text-sm font-medium text-[var(--text-mid)]"
      >
        Cerrar sesión
      </button>
    </main>
  );
}

Todo lo de arriba (solicitudes, mascotas publicadas, etc.) es contenido
mock/placeholder — no hace falta que funcione de verdad todavía, solo que
se vea bien y sea coherente con el rol.

Al terminar, corré npm run build, confirmame que compila, y probá
manualmente: iniciar sesión como adoptante → ver /perfil → cerrar sesión →
iniciar sesión como protectora → ver /perfil. Confirmame que cada rol
muestra sus opciones correctas. Agregá tu entrada a PROGRESS_LOG.md.
```

## Nota para más adelante (no ahora)
Cuando conectemos MySQL, este Context se reemplaza por sesión real
(cookies/JWT) validada contra la tabla `User` del `schema.prisma`, y los
placeholders de "solicitudes"/"mascotas publicadas" se conectan a los
modelos `SolicitudAdopcion` y `Mascota` reales.
