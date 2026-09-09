"use client";

import Link from "next/link";
import { useMascotas } from "@/app/context/MascotasContext";

export default function MascotasPage() {
  const { mascotas } = useMascotas();

  return (
    <main className="min-h-full bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Mascotas en adopción
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-4">
        {mascotas.map((mascota) => (
          <div
            key={mascota.id}
            className="rounded-2xl border border-[var(--brown-light)] bg-white p-4"
          >
            {mascota.mediaUrl && mascota.mediaType === "image" ? (
              <img
                src={mascota.mediaUrl}
                alt={mascota.nombre}
                className="mb-3 h-32 w-full rounded-xl object-cover"
              />
            ) : mascota.mediaUrl && mascota.mediaType === "video" ? (
              <video
                src={mascota.mediaUrl}
                controls
                className="mb-3 h-32 w-full rounded-xl object-cover"
              />
            ) : (
              <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-[var(--brown-light)] text-4xl">
                {mascota.especie === "PERRO" ? "🐶" : "🐱"}
              </div>
            )}
            <h3 className="font-medium text-[var(--text-dark)]">{mascota.nombre}</h3>
            <p className="text-sm text-[var(--text-light)]">
              {mascota.raza} · {mascota.edadAproximada} · {mascota.tamanio}
            </p>
            <p className="mt-2 text-sm text-[var(--text-mid)]">{mascota.descripcion}</p>
            <Link
              href={`/mascotas/${mascota.id}`}
              className="mt-3 block rounded-xl bg-[var(--brown-dark)] px-4 py-2 text-center text-sm font-medium text-[var(--brown-lightest)]"
            >
              Ver más
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
