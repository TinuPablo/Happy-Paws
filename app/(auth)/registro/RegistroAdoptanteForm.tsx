"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { registerAdoptanteAction } from "@/app/actions/auth";
import TurnstileWidget, { type TurnstileWidgetHandle } from "@/app/components/TurnstileWidget";
import PasswordConfirmFields from "@/app/components/PasswordConfirmFields";
import RevisaTuCorreo from "./RevisaTuCorreo";

export default function RegistroAdoptanteForm() {
  const [state, formAction, pending] = useActionState(registerAdoptanteAction, null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [errorCliente, setErrorCliente] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  // Cada respuesta con error ya consumió el token del captcha: se pide uno nuevo.
  useEffect(() => {
    if (state?.error) turnstileRef.current?.reset();
  }, [state]);

  // Se envía a mano con startTransition (y no con <form action>) para que un
  // error del servidor no vacíe lo que ya escribió.
  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("password") !== fd.get("password2")) {
      setErrorCliente("Las contraseñas no coinciden.");
      return;
    }
    setErrorCliente(null);
    startTransition(() => formAction(fd));
  }

  if (state?.enviadoA) return <RevisaTuCorreo email={state.enviadoA} esProtectora={false} />;

  const error = errorCliente ?? state?.error;

  return (
    <form
      onSubmit={enviar}
      className="mt-6 rounded-2xl border border-[var(--brown-light)] bg-white p-6 shadow-[0_16px_40px_rgba(75,40,14,0.10)]"
    >
      <label className="block text-sm text-[var(--text-mid)]">
        Nombre completo
        <input type="text" name="nombre" required maxLength={120} autoComplete="name" className="input" />
      </label>
      <label className="mt-4 block text-sm text-[var(--text-mid)]">
        Email
        <input type="email" name="email" required maxLength={190} autoComplete="email" className="input" />
      </label>
      <label className="mt-4 block text-sm text-[var(--text-mid)]">
        Teléfono (opcional)
        <input type="tel" name="telefono" maxLength={40} autoComplete="tel" className="input" />
      </label>
      <PasswordConfirmFields />
      <TurnstileWidget ref={turnstileRef} onToken={setCaptchaToken} />
      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      <button type="submit" disabled={pending || !captchaToken} className="btn-dark mt-6 w-full disabled:opacity-60">
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
