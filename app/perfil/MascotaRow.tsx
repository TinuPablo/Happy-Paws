"use client";

import { useState } from "react";
import { cambiarEstadoMascotaAction, darDeBajaMascotaAction } from "@/app/actions/mascotas";
import { EditarMascotaForm } from "./EditarMascotaForm";
import { estadoMascotaClasses, estadoMascotaLabel } from "./estadoMascotaBadge";

const ESTADOS = ["EN_PROTECTORA", "EN_TRANSITO", "EN_PROCESO", "ADOPTADO", "FALLECIDO"] as const;

type Props = {
  id: string;
  nombre: string;
  especie: "PERRO" | "GATO";
  razaTexto: string | null;
  edadTexto: string | null;
  tamanio: string | null;
  descripcion: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  estado: string;
  activo: boolean;
};

export function MascotaRow(props: Props) {
  const [editando, setEditando] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--brown-light)] p-3">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--brown-lightest)] text-xl">
          {props.mediaUrl && props.mediaType === "image" ? (
            <img src={props.mediaUrl} alt={props.nombre} className="h-full w-full object-cover" />
          ) : props.especie === "PERRO" ? (
            "🐶"
          ) : (
            "🐱"
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[var(--text-dark)]">{props.nombre}</p>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${estadoMascotaClasses(props.estado)}`}
          >
            {estadoMascotaLabel(props.estado)}
          </span>
          {!props.activo && (
            <span className="ml-2 inline-block rounded-full bg-gray-200 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600">
              Dada de baja
            </span>
          )}
        </div>
      </div>

      {props.activo && (
        <>
          <form action={cambiarEstadoMascotaAction} className="mt-3 flex items-center gap-2">
            <input type="hidden" name="mascotaId" value={props.id} />
            <select name="estado" defaultValue={props.estado} className="input flex-1">
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {estadoMascotaLabel(e)}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-outline shrink-0">
              Actualizar
            </button>
          </form>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditando((v) => !v)}
              className="text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
            >
              {editando ? "Cancelar edición" : "Editar"}
            </button>
            <form
              action={darDeBajaMascotaAction}
              onSubmit={(e) => {
                if (!confirm(`¿Dar de baja a ${props.nombre}? Dejará de mostrarse en el catálogo.`)) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="mascotaId" value={props.id} />
              <button type="submit" className="text-sm font-semibold text-red-600 hover:text-red-700">
                Dar de baja
              </button>
            </form>
          </div>

          {editando && (
            <EditarMascotaForm
              mascotaId={props.id}
              nombre={props.nombre}
              especie={props.especie}
              razaTexto={props.razaTexto}
              edadTexto={props.edadTexto}
              tamanio={props.tamanio}
              descripcion={props.descripcion}
              mediaUrl={props.mediaUrl}
              mediaType={props.mediaType}
            />
          )}
        </>
      )}
    </div>
  );
}
