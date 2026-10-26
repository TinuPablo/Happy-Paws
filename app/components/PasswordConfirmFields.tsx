"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  label?: string;
  minLength?: number;
  maxLength?: number;
};

// "Contraseña" + "Repetí la contraseña" (campos password / password2). El
// servidor vuelve a comparar las dos: esto solo avisa antes de enviar.
export default function PasswordConfirmFields({ label = "Contraseña", minLength = 6, maxLength = 100 }: Props) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [visible, setVisible] = useState(false);
  const noCoinciden = password2.length > 0 && password !== password2;

  return (
    <>
      <label className="mt-4 block text-sm text-[var(--text-mid)]">
        {label}
        <div className="relative">
          <input
            type={visible ? "text" : "password"}
            name="password"
            required
            minLength={minLength}
            maxLength={maxLength}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input pr-10"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]"
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>
      <label className="mt-4 block text-sm text-[var(--text-mid)]">
        Repetí la contraseña
        <input
          type={visible ? "text" : "password"}
          name="password2"
          required
          maxLength={maxLength}
          autoComplete="new-password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          aria-invalid={noCoinciden}
          aria-describedby={noCoinciden ? "password2-error" : undefined}
          className="input"
        />
      </label>
      {noCoinciden && (
        <p id="password2-error" className="mt-1 text-xs font-medium text-red-600">
          Las contraseñas no coinciden.
        </p>
      )}
    </>
  );
}
