"use client";

import Link from "next/link";
import type { Mascota } from "@prisma/client";

type MatchResultProps = {
  mascota: Mascota;
  porcentaje: number;
  onVerTodas: () => void;
};

export function MatchResult({ mascota, porcentaje, onVerTodas }: MatchResultProps) {
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--text-light)]">
        ¡Encontramos tu match!
      </p>
      <p className="mt-1 text-5xl font-bold text-[var(--brown-dark)]">{porcentaje}%</p>
      <p className="mt-1 text-sm text-[var(--text-mid)]">de compatibilidad con vos</p>

      <div className="card mt-6 overflow-hidden p-4 text-left">
        <div className="relative mb-3 h-40 overflow-hidden rounded-xl bg-[var(--brown-light)]">
          {mascota.mediaUrl && mascota.mediaType === "image" ? (
            <img
              src={mascota.mediaUrl}
              alt={mascota.nombre}
              className="h-40 w-full object-cover"
            />
          ) : mascota.mediaUrl && mascota.mediaType === "video" ? (
            <video src={mascota.mediaUrl} controls className="h-40 w-full object-cover" />
          ) : (
            <div className="flex h-40 items-center justify-center text-5xl">
              {mascota.especie === "PERRO" ? "🐶" : "🐱"}
            </div>
          )}
          <span className="badge-pill absolute left-2 top-2">
            {mascota.especie === "PERRO" ? "Perro" : "Gato"}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-dark)]">{mascota.nombre}</h3>
        <p className="text-sm text-[var(--text-light)]">
          {mascota.razaTexto} · {mascota.edadTexto} · {mascota.tamanio}
        </p>
        <p className="mt-2 text-sm text-[var(--text-mid)]">{mascota.descripcion}</p>
        <Link href={`/mascotas/${mascota.id}`} className="btn-dark mt-4 block text-center">
          Ver ficha completa
        </Link>
      </div>

      <button
        type="button"
        onClick={onVerTodas}
        className="mt-6 text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--brown-dark)]"
      >
        Ver todas las mascotas
      </button>
    </div>
  );
}
