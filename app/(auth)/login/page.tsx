"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<"adoptante" | "protectora" | null>(null);
  const [mostrarErrorRol, setMostrarErrorRol] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // MOCK: acá va la validación real contra el backend cuando exista.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!rolSeleccionado) {
      setMostrarErrorRol(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(email.split("@")[0], rolSeleccionado);
      const redirectTo = searchParams.get("redirect");
      router.push(redirectTo || "/perfil");
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

        <div className="mt-4">
          <span className="block text-sm text-[var(--text-mid)]">Ingresar como</span>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setRolSeleccionado("adoptante");
                setMostrarErrorRol(false);
              }}
              className={`rounded-xl border p-3 text-center text-sm font-medium text-[var(--text-dark)] ${
                rolSeleccionado === "adoptante"
                  ? "border-[var(--brown-main)] bg-[var(--brown-light)]"
                  : "border-[var(--brown-light)] bg-white"
              }`}
            >
              Adoptante
            </button>
            <button
              type="button"
              onClick={() => {
                setRolSeleccionado("protectora");
                setMostrarErrorRol(false);
              }}
              className={`rounded-xl border p-3 text-center text-sm font-medium text-[var(--text-dark)] ${
                rolSeleccionado === "protectora"
                  ? "border-[var(--brown-main)] bg-[var(--brown-light)]"
                  : "border-[var(--brown-light)] bg-white"
              }`}
            >
              Protectora
            </button>
          </div>
          {mostrarErrorRol && (
            <p className="mt-2 text-xs font-medium text-red-600">
              Elegí con qué rol querés ingresar.
            </p>
          )}
        </div>

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
