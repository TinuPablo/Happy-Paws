"use client";

import { useActionState, useState } from "react";
import { actualizarEstadoSaludAction } from "@/app/actions/mascotas";

export function EstadoSaludForm({ mascotaId, estadoSalud }: { mascotaId: string; estadoSalud: string | null }) {
  const [state, formAction, pending] = useActionState(actualizarEstadoSaludAction, null);
  const [texto, setTexto] = useState(estadoSalud ?? "");

  return (
    <form action={formAction} className="space-y-1">
      <input type="hidden" name="mascotaId" value={mascotaId} />
      <label className="block text-sm text-[var(--text-mid)]">
        Estado de salud (interno, solo lo ve tu protectora)
        <textarea
          name="estadoSalud"
          value={texto}
          onChange={(e) => setTexto(e.target.value.slice(0, 280))}
          maxLength={280}
          rows={2}
          placeholder="Ej: en tratamiento de sarna, toma antibióticos hasta el 15/10..."
          className="input mt-1"
        />
      </label>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-light)]">{texto.length}/280</span>
        <button type="submit" disabled={pending} className="btn-outline disabled:opacity-60">
          {pending ? "Guardando..." : "Guardar"}
        </button>
      </div>
      {state?.error && <p className="text-xs font-medium text-red-600">{state.error}</p>}
    </form>
  );
}
