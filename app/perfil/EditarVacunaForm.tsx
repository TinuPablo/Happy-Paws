"use client";

import { useActionState } from "react";
import { editarVacunaAction } from "@/app/actions/vacunaciones";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

type Props = {
  vacunaId: string;
  nombreVacuna: string;
  fechaAplicacion: Date;
  proximaDosis: Date | null;
  observaciones: string | null;
};

export function EditarVacunaForm(props: Props) {
  const [state, formAction, pending] = useActionState(editarVacunaAction, null);

  return (
    <form action={formAction} className="mt-3 space-y-3 rounded-lg border border-[var(--brown-light)] p-3">
      <input type="hidden" name="vacunaId" value={props.vacunaId} />
      <label className="block text-sm text-[var(--text-mid)]">
        Nombre de la vacuna
        <input type="text" name="nombreVacuna" defaultValue={props.nombreVacuna} required className="input mt-1" />
      </label>
      <label className="block text-sm text-[var(--text-mid)]">
        Fecha de aplicación
        <input
          type="date"
          name="fechaAplicacion"
          defaultValue={toDateInputValue(props.fechaAplicacion)}
          required
          className="input mt-1"
        />
      </label>
      <label className="block text-sm text-[var(--text-mid)]">
        Próxima dosis (opcional)
        <input
          type="date"
          name="proximaDosis"
          defaultValue={props.proximaDosis ? toDateInputValue(props.proximaDosis) : ""}
          className="input mt-1"
        />
      </label>
      <label className="block text-sm text-[var(--text-mid)]">
        Observaciones (opcional)
        <textarea name="observaciones" defaultValue={props.observaciones ?? ""} rows={2} className="input mt-1" />
      </label>

      {state?.error && <p className="text-xs font-medium text-red-600">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-dark w-full disabled:opacity-60">
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
