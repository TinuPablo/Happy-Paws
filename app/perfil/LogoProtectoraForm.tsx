"use client";

import { useActionState, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { actualizarLogoProtectoraAction } from "@/app/actions/protectoras";
import { subirArchivoACloudinary } from "@/lib/uploadCloudinary";

export function LogoProtectoraForm({ logoActualUrl }: { logoActualUrl: string | null }) {
  const [state, formAction, pending] = useActionState(actualizarLogoProtectoraAction, null);
  const [preview, setPreview] = useState<string | null>(logoActualUrl);
  const [subiendo, setSubiendo] = useState(false);
  const [errorSubida, setErrorSubida] = useState<string | null>(null);
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
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setErrorSubida(null);
            // Vista previa instantánea con el archivo local mientras se sube
            // de verdad a Cloudinary en segundo plano.
            setPreview(URL.createObjectURL(file));
            setSubiendo(true);
            try {
              const subido = await subirArchivoACloudinary(file);
              setPreview(subido.url);
            } catch {
              setPreview(logoActualUrl);
              setErrorSubida("No se pudo subir la imagen. Probá de nuevo.");
            } finally {
              setSubiendo(false);
            }
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <input type="hidden" name="logoUrl" value={preview ?? ""} />
        <p className="text-sm text-[var(--text-mid)]">Hacé click en el lápiz para cambiar el logo.</p>
        {errorSubida && <p className="mt-1 text-xs font-medium text-red-600">{errorSubida}</p>}
        {state?.error && <p className="mt-1 text-xs font-medium text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending || subiendo || !preview} className="btn-outline mt-2 disabled:opacity-60">
          {pending ? "Guardando..." : subiendo ? "Subiendo..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
