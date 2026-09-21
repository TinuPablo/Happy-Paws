"use client";

import { Suspense, useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { restablecerContrasenaAction } from "@/app/actions/auth";

export default function RestablecerPage() {
  return (
    <Suspense fallback={null}>
      <RestablecerForm />
    </Suspense>
  );
}

function RestablecerForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, formAction, pending] = useActionState(restablecerContrasenaAction, null);
  const [showPassword, setShowPassword] = useState(false);

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
          Elegí tu nueva contraseña
        </h1>

        <input type="hidden" name="token" value={token} />

        {!token ? (
          <p className="mt-4 text-sm font-medium text-red-600">
            Este link no es válido. Pedí uno nuevo desde{" "}
            <Link href="/recuperar" className="underline">
              recuperar contraseña
            </Link>
            .
          </p>
        ) : (
          <>
            <label className="mt-6 block text-sm text-[var(--text-mid)]">
              Nueva contraseña
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={6}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {state?.error && <p className="mt-4 text-sm font-medium text-red-600">{state.error}</p>}

            <button type="submit" disabled={pending} className="btn-dark mt-6 w-full disabled:opacity-60">
              {pending ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </>
        )}
      </form>
    </main>
  );
}
