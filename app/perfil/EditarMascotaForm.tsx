"use client";

import { useActionState, useState } from "react";
import { editarMascotaAction } from "@/app/actions/mascotas";

type Props = {
  mascotaId: string;
  nombre: string;
  especie: "PERRO" | "GATO";
  razaTexto: string | null;
  edadTexto: string | null;
  tamanio: string | null;
  descripcion: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
};

export function EditarMascotaForm(props: Props) {
  const [state, formAction, pending] = useActionState(editarMascotaAction, null);
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(props.mediaUrl ?? undefined);
  const [mediaType, setMediaType] = useState<"image" | "video" | undefined>(
    (props.mediaType as "image" | "video") ?? undefined
  );

  return (
    <form action={formAction} className="mt-3 space-y-3 border-t border-[var(--brown-light)] pt-3">
      <input type="hidden" name="mascotaId" value={props.mascotaId} />

      <label className="block text-sm text-[var(--text-mid)]">
        Nombre
        <input type="text" name="nombre" defaultValue={props.nombre} required className="input" />
      </label>
      <label className="block text-sm text-[var(--text-mid)]">
        Especie
        <select name="especie" defaultValue={props.especie} className="input">
          <option value="PERRO">Perro</option>
          <option value="GATO">Gato</option>
        </select>
      </label>
      <label className="block text-sm text-[var(--text-mid)]">
        Raza
        <input type="text" name="raza" defaultValue={props.razaTexto ?? ""} required className="input" />
      </label>
      <label className="block text-sm text-[var(--text-mid)]">
        Edad aproximada
        <input
          type="text"
          name="edadAproximada"
          defaultValue={props.edadTexto ?? ""}
          required
          placeholder="Ej: 2 años"
          className="input"
        />
      </label>
      <label className="block text-sm text-[var(--text-mid)]">
        Tamaño
        <select name="tamanio" defaultValue={props.tamanio ?? "MEDIANO"} className="input">
          <option value="PEQUEÑO">Pequeño</option>
          <option value="MEDIANO">Mediano</option>
          <option value="GRANDE">Grande</option>
        </select>
      </label>
      <label className="block text-sm text-[var(--text-mid)]">
        Descripción
        <textarea name="descripcion" defaultValue={props.descripcion ?? ""} required rows={3} className="input" />
      </label>
      <label className="block text-sm text-[var(--text-mid)]">
        Foto o video (opcional)
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => {
              setMediaUrl(reader.result as string);
              setMediaType(file.type.startsWith("video/") ? "video" : "image");
            };
            reader.readAsDataURL(file);
          }}
          className="mt-1 w-full text-sm text-[var(--text-mid)]"
        />
      </label>

      <input type="hidden" name="mediaUrl" value={mediaUrl ?? ""} />
      <input type="hidden" name="mediaType" value={mediaType ?? ""} />

      {mediaUrl && mediaType === "image" && (
        <img src={mediaUrl} alt="Vista previa" className="mt-1 h-32 w-full rounded-xl object-cover" />
      )}
      {mediaUrl && mediaType === "video" && (
        <video src={mediaUrl} controls className="mt-1 h-32 w-full rounded-xl object-cover" />
      )}

      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-dark w-full disabled:opacity-60">
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
