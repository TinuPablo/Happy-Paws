"use client";

import { useState } from "react";
import { eliminarVacunaAction } from "@/app/actions/vacunaciones";
import { EditarVacunaForm } from "./EditarVacunaForm";

type Props = {
  id: string;
  nombreVacuna: string;
  fechaAplicacion: Date;
  proximaDosis: Date | null;
  observaciones: string | null;
};

export function VacunaItem(props: Props) {
  const [editando, setEditando] = useState(false);
  const proximaFutura = props.proximaDosis && props.proximaDosis.getTime() > Date.now();

  return (
    <div className="rounded-lg border border-[var(--brown-light)] p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[var(--text-dark)]">{props.nombreVacuna}</p>
          <p className="text-xs text-[var(--text-light)]">
            Aplicada: {props.fechaAplicacion.toLocaleDateString("es-AR")}
          </p>
          {props.observaciones && (
            <p className="mt-1 text-xs text-[var(--text-mid)]">{props.observaciones}</p>
          )}
        </div>
        {proximaFutura && (
          <span className="shrink-0 rounded-full bg-[var(--gold)]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--brown-dark)]">
            Próxima: {props.proximaDosis!.toLocaleDateString("es-AR")}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEditando((v) => !v)}
          className="text-xs font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
        >
          {editando ? "Cancelar" : "Editar"}
        </button>
        <form
          action={eliminarVacunaAction}
          onSubmit={(e) => {
            if (!confirm(`¿Eliminar el registro de "${props.nombreVacuna}"? No se puede deshacer.`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="vacunaId" value={props.id} />
          <button type="submit" className="text-xs font-semibold text-red-600 hover:text-red-700">
            Eliminar
          </button>
        </form>
      </div>

      {editando && (
        <EditarVacunaForm
          vacunaId={props.id}
          nombreVacuna={props.nombreVacuna}
          fechaAplicacion={props.fechaAplicacion}
          proximaDosis={props.proximaDosis}
          observaciones={props.observaciones}
        />
      )}
    </div>
  );
}
