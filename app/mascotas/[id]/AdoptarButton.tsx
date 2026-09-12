"use client";

import { useActionState } from "react";
import { crearSolicitudAction } from "@/app/actions/solicitudes";

export function AdoptarButton({ mascotaId, nombre }: { mascotaId: string; nombre: string }) {
  const [state, formAction, pending] = useActionState(crearSolicitudAction, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="mascotaId" value={mascotaId} />
      <button type="submit" disabled={pending} className="btn-primary mt-6 w-full disabled:opacity-60">
        {pending ? "Enviando..." : `Quiero adoptar a ${nombre} 🐾`}
      </button>
      {state?.error && <p className="mt-2 text-sm font-medium text-red-600">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm font-medium text-[var(--green-ok)]">{state.success}</p>}
    </form>
  );
}
