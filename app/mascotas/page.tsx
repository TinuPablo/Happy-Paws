"use client";

import Link from "next/link";
import { useMascotas } from "@/app/context/MascotasContext";

export default function MascotasPage() {
  const { mascotas } = useMascotas();

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-[var(--text-dark)]">
          Mascotas en adopción
        </h1>
        <p className="mt-1 text-sm text-[var(--text-light)]">
          {mascotas.length} {mascotas.length === 1 ? "mascota esperando" : "mascotas esperando"} un hogar.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mascotas.map((mascota) => (
            <div
              key={mascota.id}
              className="card group overflow-hidden p-4"
            >
              <div className="relative mb-3 h-32 overflow-hidden rounded-xl bg-[var(--brown-light)]">
                {mascota.mediaUrl && mascota.mediaType === "image" ? (
                  <img
                    src={mascota.mediaUrl}
                    alt={mascota.nombre}
                    className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : mascota.mediaUrl && mascota.mediaType === "video" ? (
                  <video
                    src={mascota.mediaUrl}
                    controls
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center text-4xl transition-transform duration-300 group-hover:scale-110">
                    {mascota.especie === "PERRO" ? "🐶" : "🐱"}
                  </div>
                )}
                <span className="badge-pill absolute left-2 top-2">
                  {mascota.especie === "PERRO" ? "Perro" : "Gato"}
                </span>
              </div>
              <h3 className="font-semibold text-[var(--text-dark)]">{mascota.nombre}</h3>
              <p className="text-sm text-[var(--text-light)]">
                {mascota.raza} · {mascota.edadAproximada} · {mascota.tamanio}
              </p>
              <p className="mt-2 text-sm text-[var(--text-mid)]">{mascota.descripcion}</p>
              <Link href={`/mascotas/${mascota.id}`} className="btn-dark mt-3 block">
                Ver más
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
