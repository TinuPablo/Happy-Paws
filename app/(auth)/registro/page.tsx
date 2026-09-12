"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { registerAdoptanteAction, registerProtectoraAction } from "@/app/actions/auth";

type TipoUsuario = "adoptante" | "protectora" | null;

export default function RegistroPage() {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(null);
  const [adoptanteState, adoptanteAction, adoptantePending] = useActionState(
    registerAdoptanteAction,
    null
  );
  const [protectoraState, protectoraAction, protectoraPending] = useActionState(
    registerProtectoraAction,
    null
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--brown-light)]/40 to-[var(--brown-lightest)] px-6 py-10">
      <div className="animate-fade-in-up w-full max-w-sm">
        <div className="text-center">
          <Image
            src="/assets/logo.jpg"
            alt="Happy Paws"
            width={48}
            height={48}
            className="mx-auto h-12 w-12 rounded-full bg-white object-cover"
          />
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
            action={adoptanteAction}
            className="mt-6 rounded-2xl border border-[var(--brown-light)] bg-white p-6 shadow-[0_16px_40px_rgba(75,40,14,0.10)]"
          >
            <label className="block text-sm text-[var(--text-mid)]">
              Nombre completo
              <input type="text" name="nombre" required className="input" />
            </label>
            <label className="mt-4 block text-sm text-[var(--text-mid)]">
              Email
              <input type="email" name="email" required className="input" />
            </label>
            <label className="mt-4 block text-sm text-[var(--text-mid)]">
              Teléfono (opcional)
              <input type="tel" name="telefono" className="input" />
            </label>
            <label className="mt-4 block text-sm text-[var(--text-mid)]">
              Contraseña
              <input type="password" name="password" required className="input" />
            </label>
            {adoptanteState?.error && (
              <p className="mt-4 text-sm font-medium text-red-600">{adoptanteState.error}</p>
            )}
            <button type="submit" disabled={adoptantePending} className="btn-dark mt-6 w-full disabled:opacity-60">
              {adoptantePending ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        )}

        {tipoUsuario === "protectora" && (
          <form
            action={protectoraAction}
            className="mt-6 rounded-2xl border border-[var(--brown-light)] bg-white p-6 shadow-[0_16px_40px_rgba(75,40,14,0.10)]"
          >
            <label className="block text-sm text-[var(--text-mid)]">
              Nombre de la protectora
              <input type="text" name="nombreProtectora" required className="input" />
            </label>
            <label className="mt-4 block text-sm text-[var(--text-mid)]">
              Ubicación
              <input type="text" name="ubicacion" required className="input" />
            </label>
            <label className="mt-4 block text-sm text-[var(--text-mid)]">
              Email de contacto
              <input type="email" name="email" required className="input" />
            </label>
            <label className="mt-4 block text-sm text-[var(--text-mid)]">
              Contraseña
              <input type="password" name="password" required className="input" />
            </label>
            {protectoraState?.error && (
              <p className="mt-4 text-sm font-medium text-red-600">{protectoraState.error}</p>
            )}
            <button type="submit" disabled={protectoraPending} className="btn-dark mt-6 w-full disabled:opacity-60">
              {protectoraPending ? "Creando cuenta..." : "Crear cuenta de protectora"}
            </button>
          </form>
        )}

        <Link
          href="/login"
          className="mt-4 block text-center text-sm font-medium text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
        >
          ¿Ya tenés cuenta? Iniciá sesión
        </Link>
      </div>
    </main>
  );
}
