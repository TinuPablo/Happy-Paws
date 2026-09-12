"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function FiltrosMascotas() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const especie = searchParams.get("especie") ?? "";
  const tamanio = searchParams.get("tamanio") ?? "";

  function actualizar(clave: "especie" | "tamanio", valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    router.push(`/mascotas${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <label className="text-sm text-[var(--text-mid)]">
        Especie
        <select
          value={especie}
          onChange={(e) => actualizar("especie", e.target.value)}
          className="input mt-1"
        >
          <option value="">Todas</option>
          <option value="PERRO">Perros</option>
          <option value="GATO">Gatos</option>
        </select>
      </label>
      <label className="text-sm text-[var(--text-mid)]">
        Tamaño
        <select
          value={tamanio}
          onChange={(e) => actualizar("tamanio", e.target.value)}
          className="input mt-1"
        >
          <option value="">Todos</option>
          <option value="PEQUEÑO">Pequeño</option>
          <option value="MEDIANO">Mediano</option>
          <option value="GRANDE">Grande</option>
        </select>
      </label>
      {(especie || tamanio) && (
        <button
          type="button"
          onClick={() => router.push("/mascotas")}
          className="self-end text-sm font-medium text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
