"use client";

import { Suspense, useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import LoginMascot from "@/app/components/LoginMascot";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/perfil";
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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
        <LoginMascot isPasswordFocused={passwordFocused} isPasswordVisible={showPassword} />
        <h1 className="mt-4 text-xl font-bold text-[var(--text-dark)]">
          Iniciar sesión
        </h1>
        <p className="mt-1 text-sm text-[var(--text-light)]">
          Qué bueno tenerte de vuelta.
        </p>

        <input type="hidden" name="redirectTo" value={redirectTo} />

        <label className="mt-6 block text-sm text-[var(--text-mid)]">
          Email
          <input type="email" name="email" required className="input" />
        </label>
        <label className="mt-4 block text-sm text-[var(--text-mid)]">
          Contraseña
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        {state?.error && (
          <p className="mt-4 text-sm font-medium text-red-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-dark mt-6 w-full disabled:opacity-60"
        >
          {pending ? "Ingresando..." : "Iniciar sesión"}
        </button>
        <Link
          href="/registro"
          className="mt-4 block text-center text-sm font-medium text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
        >
          ¿No tenés cuenta? Registrate
        </Link>
      </form>
    </main>
  );
}
