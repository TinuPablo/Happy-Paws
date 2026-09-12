"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addMascotaAction } from "@/app/actions/mascotas";

export function AgregarMascotaForm() {
  const [state, formAction, pending] = useActionState(addMascotaAction, null);
  const [mostrar, setMostrar] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
  const [mediaType, setMediaType] = useState<"image" | "video" | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state) {
      formRef.current?.reset();
      setMediaUrl(undefined);
      setMediaType(undefined);
      setMostrar(false);
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setMostrar((v) => !v)}
        className="mt-3 text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
      >
        {mostrar ? "Cancelar" : "+ Agregar mascota"}
      </button>

      {mostrar && (
        <form
          ref={formRef}
          action={formAction}
          className="mt-4 space-y-3 border-t border-[var(--brown-light)] pt-4"
        >
          <label className="block text-sm text-[var(--text-mid)]">
            Nombre
            <input type="text" name="nombre" required className="input" />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Especie
            <select name="especie" defaultValue="PERRO" className="input">
              <option value="PERRO">Perro</option>
              <option value="GATO">Gato</option>
            </select>
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Raza
            <input type="text" name="raza" required className="input" />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Edad aproximada
            <input type="text" name="edadAproximada" required placeholder="Ej: 2 años" className="input" />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Tamaño
            <select name="tamanio" defaultValue="MEDIANO" className="input">
              <option value="PEQUEÑO">Pequeño</option>
              <option value="MEDIANO">Mediano</option>
              <option value="GRANDE">Grande</option>
            </select>
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Descripción
            <textarea name="descripcion" required rows={3} className="input" />
          </label>
          <label className="block text-sm text-[var(--text-mid)]">
            Foto o video (opcional)
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                setMediaUrl(url);
                setMediaType(file.type.startsWith("video/") ? "video" : "image");
              }}
              className="mt-1 w-full text-sm text-[var(--text-mid)]"
            />
          </label>

          <input type="hidden" name="mediaUrl" value={mediaUrl ?? ""} />
          <input type="hidden" name="mediaType" value={mediaType ?? ""} />

          {mediaUrl && mediaType === "image" && (
            <img src={mediaUrl} alt="Vista previa" className="mt-3 h-32 w-full rounded-xl object-cover" />
          )}
          {mediaUrl && mediaType === "video" && (
            <video src={mediaUrl} controls className="mt-3 h-32 w-full rounded-xl object-cover" />
          )}

          {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

          <button type="submit" disabled={pending} className="btn-dark w-full disabled:opacity-60">
            {pending ? "Publicando..." : "Publicar mascota"}
          </button>
        </form>
      )}
    </>
  );
}
