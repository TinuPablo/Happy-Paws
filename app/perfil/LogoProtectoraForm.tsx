"use client";

import { useActionState, useState } from "react";
import { actualizarLogoProtectoraAction } from "@/app/actions/protectoras";
import { subirArchivoACloudinary } from "@/lib/uploadCloudinary";

export function LogoProtectoraForm({ logoActualUrl }: { logoActualUrl: string | null }) {
  const [state, formAction, pending] = useActionState(actualizarLogoProtectoraAction, null);
  const [preview, setPreview] = useState<string | null>(logoActualUrl);
  const [subiendo, setSubiendo] = useState(false);
  const [errorSubida, setErrorSubida] = useState<string | null>(null);

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
          className="w-full text-sm text-[var(--text-mid)]"
        />
        {errorSubida && <p className="mt-1 text-xs font-medium text-red-600">{errorSubida}</p>}
        {state?.error && <p className="mt-1 text-xs font-medium text-red-600">{state.error}</p>}
      </div>
      <button type="submit" disabled={pending || subiendo || !preview} className="btn-outline shrink-0 disabled:opacity-60">
        {pending ? "Guardando..." : subiendo ? "Subiendo..." : "Guardar"}
      </button>
    </form>
  );
}
