"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RegistroAdoptanteForm from "./RegistroAdoptanteForm";
import RegistroProtectoraForm from "./RegistroProtectoraForm";

type TipoUsuario = "adoptante" | "protectora" | null;

export default function RegistroPage() {
  // Cada formulario maneja su propio captcha y su estado: al cambiar de
  // tipo se monta el otro desde cero.
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(null);

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

        {tipoUsuario === "adoptante" && <RegistroAdoptanteForm />}
        {tipoUsuario === "protectora" && <RegistroProtectoraForm />}

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
