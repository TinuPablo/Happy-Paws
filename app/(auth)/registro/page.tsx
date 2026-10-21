"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { registerAdoptanteAction } from "@/app/actions/auth";
import TurnstileWidget, { type TurnstileWidgetHandle } from "@/app/components/TurnstileWidget";
import RegistroProtectoraForm from "./RegistroProtectoraForm";

type TipoUsuario = "adoptante" | "protectora" | null;

export default function RegistroPage() {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(null);
  const [adoptanteState, adoptanteAction, adoptantePending] = useActionState(
    registerAdoptanteAction,
    null
  );
  // El form de protectora maneja su propio captcha (RegistroProtectoraForm);
  // este es el del form de adoptante. Al cambiar de tipo, el widget se
  // vuelve a montar y pide un token nuevo.
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  // Cada respuesta con error ya consumió el token del captcha: se pide uno nuevo.
  useEffect(() => {
    if (adoptanteState?.error) turnstileRef.current?.reset();
  }, [adoptanteState]);

  function elegirTipo(tipo: TipoUsuario) {
    if (tipo !== tipoUsuario) setCaptchaToken(null);
    setTipoUsuario(tipo);
  }

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
            onClick={() => elegirTipo("adoptante")}
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
            onClick={() => elegirTipo("protectora")}
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
            <TurnstileWidget ref={turnstileRef} onToken={setCaptchaToken} />
            {adoptanteState?.error && (
              <p className="mt-4 text-sm font-medium text-red-600">{adoptanteState.error}</p>
            )}
            <button type="submit" disabled={adoptantePending || !captchaToken} className="btn-dark mt-6 w-full disabled:opacity-60">
              {adoptantePending ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        )}

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
