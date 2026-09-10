"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--brown-light)]/40 to-[var(--brown-lightest)] px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-[var(--brown-light)] bg-white p-8 shadow-[0_16px_40px_rgba(75,40,14,0.10)]"
      >
        <Image
          src="/assets/logo.jpg"
          alt="Happy Paws"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full bg-white object-cover"
        />
        <h1 className="mt-4 text-xl font-bold text-[var(--text-dark)]">
          Iniciar sesión
        </h1>
        <p className="mt-1 text-sm text-[var(--text-light)]">
          Qué bueno tenerte de vuelta.
        </p>
        <label className="mt-6 block text-sm text-[var(--text-mid)]">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </label>
        <label className="mt-4 block text-sm text-[var(--text-mid)]">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
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
              className={`rounded-xl border p-3 text-center text-sm font-medium text-[var(--text-dark)] transition-colors duration-200 ${
                rolSeleccionado === "adoptante"
                  ? "border-[var(--brown-main)] bg-[var(--brown-light)]"
                  : "border-[var(--brown-light)] bg-white hover:bg-[var(--brown-lightest)]"
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
              className={`rounded-xl border p-3 text-center text-sm font-medium text-[var(--text-dark)] transition-colors duration-200 ${
                rolSeleccionado === "protectora"
                  ? "border-[var(--brown-main)] bg-[var(--brown-light)]"
                  : "border-[var(--brown-light)] bg-white hover:bg-[var(--brown-lightest)]"
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
          className="btn-dark mt-6 w-full disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
        <a
          href="/registro"
          className="mt-4 block text-center text-sm font-medium text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
        >
          ¿No tenés cuenta? Registrate
        </a>
      </form>
    </main>
  );
}
