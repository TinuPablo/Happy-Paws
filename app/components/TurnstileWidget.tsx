"use client";

import { useImperativeHandle, useRef, useState, type Ref } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

export type TurnstileWidgetHandle = { reset: () => void };

type Props = {
  onToken: (token: string | null) => void;
  ref?: Ref<TurnstileWidgetHandle>;
  // Nombre del campo con el que viaja el token en el form.
  name?: string;
};

// Un token de Turnstile sirve una sola vez: después de un envío fallido el
// form tiene que llamar a reset() para pedir uno nuevo.
export default function TurnstileWidget({ onToken, ref, name = "turnstileToken" }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [token, setToken] = useState<string | null>(null);

  function actualizar(nuevo: string | null) {
    setToken(nuevo);
    onToken(nuevo);
  }

  useImperativeHandle(ref, () => ({
    reset() {
      actualizar(null);
      turnstileRef.current?.reset();
    },
  }));

  if (!siteKey) {
    return (
      <p className="mt-4 rounded-xl border border-[var(--brown-light)] bg-[var(--brown-lightest)] px-3 py-2 text-xs text-[var(--text-mid)]">
        Falta configurar la verificación anti-bots (NEXT_PUBLIC_TURNSTILE_SITE_KEY).
      </p>
    );
  }

  return (
    <div className="mt-4 flex min-h-[65px] justify-center overflow-hidden rounded-xl">
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        options={{ theme: "light", language: "es", size: "flexible", responseField: false }}
        onSuccess={(t) => actualizar(t)}
        onExpire={() => {
          actualizar(null);
          turnstileRef.current?.reset();
        }}
        onError={() => actualizar(null)}
        className="w-full"
      />
      <input type="hidden" name={name} value={token ?? ""} />
    </div>
  );
}
