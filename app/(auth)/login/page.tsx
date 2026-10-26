"use client";

import { Suspense, startTransition, useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { loginAction, reenviarVerificacionAction } from "@/app/actions/auth";
import LoginMascot from "@/app/components/LoginMascot";
import TurnstileWidget, { type TurnstileWidgetHandle } from "@/app/components/TurnstileWidget";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  // Sin ?redirect= explícito, después de entrar se va al inicio.
  const redirectTo = searchParams.get("redirect") || "/";
  const contrasenaRestablecida = searchParams.get("restablecida") === "1";
  const verificado = searchParams.get("verificado");
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [reenvioState, reenviarAction, reenviando] = useActionState(reenviarVerificacionAction, null);
  // Controlado para que no se borre al volver un error (y para poder
  // reenviar el correo de confirmación a esa dirección).
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  // Cada respuesta (con error o de reenvío) ya consumió el token del
  // captcha: se pide uno nuevo.
  useEffect(() => {
    if (state?.error || reenvioState) turnstileRef.current?.reset();
  }, [state, reenvioState]);

  function reenviarCorreo() {
    const fd = new FormData();
    fd.set("email", email);
    fd.set("turnstileToken", captchaToken ?? "");
    startTransition(() => reenviarAction(fd));
  }

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

        {contrasenaRestablecida && !state?.error && (
          <p className="mt-4 rounded-xl bg-[var(--green-ok)]/10 px-3 py-2 text-sm font-medium text-[var(--green-ok)]">
            ¡Listo! Ya podés entrar con tu nueva contraseña.
          </p>
        )}
        {verificado === "1" && !state?.error && (
          <p className="mt-4 rounded-xl bg-[var(--green-ok)]/10 px-3 py-2 text-sm font-medium text-[var(--green-ok)]">
            ¡Correo confirmado! Ya podés iniciar sesión.
          </p>
        )}
        {verificado === "protectora" && !state?.error && (
          <p className="mt-4 rounded-xl bg-[var(--green-ok)]/10 px-3 py-2 text-sm font-medium text-[var(--green-ok)]">
            ¡Correo confirmado! Tu solicitud pasó a revisión del equipo de Happy Paws. Te avisamos por correo
            cuando esté lista (puede demorar hasta 72 horas hábiles).
          </p>
        )}

        <input type="hidden" name="redirectTo" value={redirectTo} />

        <label className="mt-6 block text-sm text-[var(--text-mid)]">
          Email
          <input
            type="email"
            name="email"
            required
            maxLength={190}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
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

        <TurnstileWidget ref={turnstileRef} onToken={setCaptchaToken} />

        {state?.error && (
          <p className="mt-4 text-sm font-medium text-red-600">{state.error}</p>
        )}

        {state?.sinVerificar && (
          <div className="mt-3 rounded-xl bg-[var(--brown-lightest)] px-3 py-3 text-sm">
            {reenvioState?.success ? (
              <p className="font-medium text-[var(--green-ok)]">{reenvioState.success}</p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={reenviarCorreo}
                  disabled={reenviando || !captchaToken || !email}
                  className="font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)] disabled:opacity-60"
                >
                  {reenviando ? "Enviando..." : "Reenviarme el correo de confirmación"}
                </button>
                {!captchaToken && !reenviando && (
                  <p className="mt-1 text-xs text-[var(--text-light)]">Esperá a que se complete la verificación de arriba.</p>
                )}
                {reenvioState?.error && <p className="mt-1 text-xs font-medium text-red-600">{reenvioState.error}</p>}
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={pending || !captchaToken}
          className="btn-dark mt-6 w-full disabled:opacity-60"
        >
          {pending ? "Ingresando..." : "Iniciar sesión"}
        </button>
        <Link
          href="/recuperar"
          className="mt-3 block text-center text-sm text-[var(--text-light)] hover:text-[var(--brown-dark)]"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <Link
          href="/registro"
          className="mt-2 block text-center text-sm font-medium text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
        >
          ¿No tenés cuenta? Registrate
        </Link>
      </form>
    </main>
  );
}
