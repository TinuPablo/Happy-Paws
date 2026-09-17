"use client";

import { useActionState, useState } from "react";
import { actualizarDatosProtectoraAction } from "@/app/actions/protectoras";

type Props = {
  ubicacion: string;
  descripcion: string | null;
  telefono: string | null;
  email: string | null;
  redSocial: string | null;
};

export function EditarDatosProtectoraForm({ ubicacion, descripcion, telefono, email, redSocial }: Props) {
  const [state, formAction, pending] = useActionState(actualizarDatosProtectoraAction, null);
  const [mostrar, setMostrar] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMostrar((v) => !v)}
        className="mt-3 text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
      >
        {mostrar ? "Cancelar" : "Editar datos"}
      </button>

      {mostrar && (
        <form action={formAction} className="mt-4 space-y-3 border-t border-[var(--brown-light)] pt-4">
          <label className="block text-sm text-[var(--text-mid)]">
            Ubicación
            <input
              type="text"
              name="ubicacion"
              defaultValue={ubicacion}
              required
              placeholder="Ej: Villa Carlos Paz"
              className="input mt-1"
            />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Descripción
            <textarea
              name="descripcion"
              defaultValue={descripcion ?? ""}
              rows={3}
              placeholder="Contá quiénes son, hace cuánto rescatan animales, etc."
              className="input mt-1"
            />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Teléfono de contacto
            <input type="tel" name="telefono" defaultValue={telefono ?? ""} className="input mt-1" />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Email de contacto
            <input type="email" name="email" defaultValue={email ?? ""} className="input mt-1" />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Red social
            <input
              type="text"
              name="redSocial"
              defaultValue={redSocial ?? ""}
              placeholder="Ej: instagram.com/fupa"
              className="input mt-1"
            />
          </label>

          {state?.error && <p className="text-xs font-medium text-red-600">{state.error}</p>}

          <button type="submit" disabled={pending} className="btn-outline disabled:opacity-60">
            {pending ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      )}
    </>
  );
}
