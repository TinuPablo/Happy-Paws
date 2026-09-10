"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

type TipoUsuario = "adoptante" | "protectora" | null;

export default function RegistroPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [nombreProtectora, setNombreProtectora] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--brown-light)]/40 to-[var(--brown-lightest)] px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brown-light)] text-2xl">
            🐾
          </span>
          <h1 className="mt-4 text-xl font-bold text-[var(--text-dark)]">
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            ¿Qué tipo de cuenta querés crear?
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTipoUsuario("adoptante")}
            className={`rounded-2xl border p-4 text-center transition-all duration-200 ${
              tipoUsuario === "adoptante"
                ? "border-[var(--brown-main)] bg-[var(--brown-light)] shadow-sm"
                : "border-[var(--brown-light)] bg-white hover:-translate-y-0.5 hover:shadow-sm"
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
            className={`rounded-2xl border p-4 text-center transition-all duration-200 ${
              tipoUsuario === "protectora"
                ? "border-[var(--brown-main)] bg-[var(--brown-light)] shadow-sm"
                : "border-[var(--brown-light)] bg-white hover:-translate-y-0.5 hover:shadow-sm"
            }`}
          >
            <span className="block text-2xl">🏠</span>
            <span className="mt-2 block text-sm font-medium text-[var(--text-dark)]">
              Soy una protectora
            </span>
          </button>
        </div>

        {tipoUsuario === "adoptante" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Registro simulado (mock). Falta conectar backend real.");
              login(nombre, "adoptante");
              router.push("/perfil");
            }}
            className="mt-6 rounded-2xl border border-[var(--brown-light)] bg-white p-6 shadow-[0_16px_40px_rgba(75,40,14,0.10)]"
          >
            <label className="block text-sm text-[var(--text-mid)]">
              Nombre completo
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="input"
              />
            </label>
            <label className="mt-4 block text-sm text-[var(--text-mid)]">
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
              Teléfono (opcional)
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
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
            <button type="submit" className="btn-dark mt-6 w-full">
              Crear cuenta
            </button>
          </form>
        )}

        {tipoUsuario === "protectora" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Registro simulado (mock). Falta conectar backend real.");
              login(nombreProtectora, "protectora");
              router.push("/perfil");
            }}
            className="mt-6 rounded-2xl border border-[var(--brown-light)] bg-white p-6 shadow-[0_16px_40px_rgba(75,40,14,0.10)]"
          >
            <label className="block text-sm text-[var(--text-mid)]">
              Nombre de la protectora
              <input
                type="text"
                required
                value={nombreProtectora}
                onChange={(e) => setNombreProtectora(e.target.value)}
                className="input"
              />
            </label>
            <label className="mt-4 block text-sm text-[var(--text-mid)]">
              Ubicación
              <input
                type="text"
                required
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="input"
              />
            </label>
            <label className="mt-4 block text-sm text-[var(--text-mid)]">
              Email de contacto
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
            <button type="submit" className="btn-dark mt-6 w-full">
              Crear cuenta de protectora
            </button>
          </form>
        )}

        <a
          href="/login"
          className="mt-4 block text-center text-sm font-medium text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
        >
          ¿Ya tenés cuenta? Iniciá sesión
        </a>
      </div>
    </main>
  );
}
