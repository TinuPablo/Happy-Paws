"use client";

import { useActionState, useState } from "react";
import { invitarMiembroAction } from "@/app/actions/miembros";

export function InvitarMiembroForm() {
  const [state, formAction, pending] = useActionState(invitarMiembroAction, null);
  const [mostrar, setMostrar] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMostrar((v) => !v)}
        className="mt-3 text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
      >
        {mostrar ? "Cancelar" : "+ Invitar colaborador/a u hogar de tránsito"}
      </button>

      {mostrar && (
        <form action={formAction} className="mt-3 space-y-3 border-t border-[var(--brown-light)] pt-3">
          <label className="block text-sm text-[var(--text-mid)]">
            Email
            <input type="email" name="email" required className="input" />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Rol
            <select name="rol" defaultValue="COLABORADOR" className="input">
              <option value="COLABORADOR">Colaborador/a</option>
              <option value="HOGAR_TRANSITO">Hogar de tránsito</option>
            </select>
          </label>

          {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
          {state?.success && <p className="text-sm font-medium text-[var(--green-ok)]">{state.success}</p>}

          <button type="submit" disabled={pending} className="btn-dark w-full disabled:opacity-60">
            {pending ? "Enviando invitación..." : "Enviar invitación"}
          </button>
        </form>
      )}
    </>
  );
}
