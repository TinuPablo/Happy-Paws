"use client";

import { useActionState, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { actualizarLogoProtectoraAction } from "@/app/actions/protectoras";

export function LogoProtectoraForm({ logoActualUrl }: { logoActualUrl: string | null }) {
  const [state, formAction, pending] = useActionState(actualizarLogoProtectoraAction, null);
  const [preview, setPreview] = useState<string | null>(logoActualUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="mt-3 flex items-center gap-4">
      <div className="relative shrink-0">
        <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-[var(--brown-light)] bg-white p-3 text-4xl">
          {preview ? (
            <img src={preview} alt="Logo de la protectora" className="h-full w-full object-contain" />
          ) : (
            "🏠"
          )}
        </span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[var(--brown-dark)] text-white shadow-sm transition-transform hover:scale-105"
          aria-label="Cambiar logo"
        >
          <Pencil size={16} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <input type="hidden" name="logoUrl" value={preview ?? ""} />
        <p className="text-sm text-[var(--text-mid)]">Hacé click en el lápiz para cambiar el logo.</p>
        {state?.error && <p className="mt-1 text-xs font-medium text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending || !preview} className="btn-outline mt-2 disabled:opacity-60">
          {pending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
