"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { aceptarInvitacionAction } from "@/app/actions/miembros";
import TurnstileWidget, { type TurnstileWidgetHandle } from "@/app/components/TurnstileWidget";

export function AceptarInvitacionForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(aceptarInvitacionAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  // Cada respuesta con error ya consumió el token del captcha: se pide uno nuevo.
  useEffect(() => {
    if (state?.error) turnstileRef.current?.reset();
  }, [state]);

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="token" value={token} />

      <label className="block text-sm text-[var(--text-mid)]">
        Tu nombre
        <input type="text" name="nombre" required maxLength={120} className="input" />
      </label>
      <label className="mt-4 block text-sm text-[var(--text-mid)]">
        Elegí una contraseña
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

      <TurnstileWidget ref={turnstileRef} onToken={setCaptchaToken} />

      {state?.error && <p className="mt-4 text-sm font-medium text-red-600">{state.error}</p>}

      <button type="submit" disabled={pending || !captchaToken} className="btn-dark mt-6 w-full disabled:opacity-60">
        {pending ? "Creando cuenta..." : "Aceptar invitación"}
      </button>
    </form>
  );
}
