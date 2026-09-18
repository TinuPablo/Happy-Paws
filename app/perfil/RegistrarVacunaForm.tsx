"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { registrarVacunaAction } from "@/app/actions/vacunaciones";

export function RegistrarVacunaForm({ mascotaId }: { mascotaId: string }) {
  const [state, formAction, pending] = useActionState(registrarVacunaAction, null);
  const [mostrar, setMostrar] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state) {
      formRef.current?.reset();
      setMostrar(false);
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setMostrar((v) => !v)}
        className="text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
      >
        {mostrar ? "Cancelar" : "+ Registrar vacuna"}
      </button>

      {mostrar && (
        <form
          ref={formRef}
          action={formAction}
          className="mt-3 space-y-3 rounded-lg border border-[var(--brown-light)] p-3"
        >
          <input type="hidden" name="mascotaId" value={mascotaId} />
          <label className="block text-sm text-[var(--text-mid)]">
            Nombre de la vacuna
            <input type="text" name="nombreVacuna" required placeholder="Ej: Antirrábica" className="input mt-1" />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Fecha de aplicación
            <input type="date" name="fechaAplicacion" required className="input mt-1" />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Próxima dosis (opcional)
            <input type="date" name="proximaDosis" className="input mt-1" />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Observaciones (opcional)
            <textarea name="observaciones" rows={2} className="input mt-1" />
          </label>

          {state?.error && <p className="text-xs font-medium text-red-600">{state.error}</p>}

          <button type="submit" disabled={pending} className="btn-dark w-full disabled:opacity-60">
            {pending ? "Guardando..." : "Registrar vacuna"}
          </button>
        </form>
      )}
    </>
  );
}
