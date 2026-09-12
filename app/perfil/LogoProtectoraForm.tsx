"use client";

import { useActionState, useState } from "react";
import { actualizarLogoProtectoraAction } from "@/app/actions/protectoras";

export function LogoProtectoraForm({ logoActualUrl }: { logoActualUrl: string | null }) {
  const [state, formAction, pending] = useActionState(actualizarLogoProtectoraAction, null);
  const [preview, setPreview] = useState<string | null>(logoActualUrl);

  return (
    <form action={formAction} className="mt-3 flex items-center gap-3">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--brown-light)] bg-white text-2xl">
        {preview ? (
          <img src={preview} alt="Logo de la protectora" className="h-full w-full object-cover" />
        ) : (
          "🏠"
        )}
      </span>
      <div className="min-w-0 flex-1">
        <input type="hidden" name="logoUrl" value={preview ?? ""} />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setPreview(URL.createObjectURL(file));
          }}
          className="w-full text-sm text-[var(--text-mid)]"
        />
        {state?.error && <p className="mt-1 text-xs font-medium text-red-600">{state.error}</p>}
      </div>
      <button type="submit" disabled={pending || !preview} className="btn-outline shrink-0 disabled:opacity-60">
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
