"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { solicitarRecuperacionAction } from "@/app/actions/auth";

export default function RecuperarPage() {
  const [state, formAction, pending] = useActionState(solicitarRecuperacionAction, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--brown-light)]/40 to-[var(--brown-lightest)] px-6 py-10">
      <form
        action={formAction}
        className="animate-fade-in-up w-full max-w-sm rounded-2xl border border-[var(--brown-light)] bg-white p-8 shadow-[0_16px_40px_rgba(75,40,14,0.10)]"
      >
        <Image
          src="/assets/logo.jpg"
          alt="Happy Paws"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full bg-white object-cover"
        />
        <h1 className="mt-4 text-xl font-bold text-[var(--text-dark)]">
          Recuperar contraseña
        </h1>
        <p className="mt-1 text-sm text-[var(--text-light)]">
          Te mandamos un link a tu email para elegir una nueva.
        </p>

        <label className="mt-6 block text-sm text-[var(--text-mid)]">
          Email
          <input type="email" name="email" required className="input" />
        </label>

        {state?.error && <p className="mt-4 text-sm font-medium text-red-600">{state.error}</p>}
        {state?.success && (
          <p className="mt-4 text-sm font-medium text-[var(--green-ok)]">{state.success}</p>
        )}

        <button type="submit" disabled={pending} className="btn-dark mt-6 w-full disabled:opacity-60">
          {pending ? "Enviando..." : "Enviar link"}
        </button>
        <Link
          href="/login"
          className="mt-4 block text-center text-sm font-medium text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
        >
          Volver a iniciar sesión
        </Link>
      </form>
    </main>
  );
}
