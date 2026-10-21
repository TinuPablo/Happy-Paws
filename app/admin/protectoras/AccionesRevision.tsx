"use client";

import { useActionState, useState } from "react";
import {
  aprobarProtectoraAction,
  rechazarProtectoraAction,
  volverAPendienteAction,
} from "@/app/actions/admin";

export function AccionesRevision({ protectoraId, pendiente }: { protectoraId: string; pendiente: boolean }) {
  const [aprobarState, aprobar, aprobando] = useActionState(aprobarProtectoraAction, null);
  const [rechazarState, rechazar, rechazando] = useActionState(rechazarProtectoraAction, null);
  const [reabrirState, reabrir, reabriendo] = useActionState(volverAPendienteAction, null);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);

  const error = aprobarState?.error || rechazarState?.error || reabrirState?.error;
  const ocupado = aprobando || rechazando || reabriendo;

  if (!pendiente) {
    return (
      <div className="mt-5 border-t border-[var(--brown-light)] pt-4">
        <form action={reabrir}>
          <input type="hidden" name="protectoraId" value={protectoraId} />
          <button type="submit" disabled={ocupado} className="btn-outline disabled:opacity-60">
            {reabriendo ? "Reabriendo..." : "Volver a pendiente"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-5 border-t border-[var(--brown-light)] pt-4">
      {!mostrarRechazo ? (
        <div className="flex flex-wrap gap-3">
          <form action={aprobar}>
            <input type="hidden" name="protectoraId" value={protectoraId} />
            <button type="submit" disabled={ocupado} className="btn-dark disabled:opacity-60">
              {aprobando ? "Aprobando..." : "Aprobar"}
            </button>
          </form>
          <button type="button" disabled={ocupado} onClick={() => setMostrarRechazo(true)} className="btn-outline disabled:opacity-60">
            Rechazar
          </button>
        </div>
      ) : (
        <form action={rechazar}>
          <input type="hidden" name="protectoraId" value={protectoraId} />
          <label className="block text-sm text-[var(--text-mid)]">
            Motivo del rechazo (se lo enviamos a la protectora)
            <textarea name="motivo" required maxLength={2000} rows={3} className="input resize-y" />
          </label>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="submit" disabled={ocupado} className="btn-dark disabled:opacity-60">
              {rechazando ? "Enviando..." : "Confirmar rechazo"}
            </button>
            <button type="button" disabled={ocupado} onClick={() => setMostrarRechazo(false)} className="btn-outline disabled:opacity-60">
              Cancelar
            </button>
          </div>
        </form>
      )}
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
