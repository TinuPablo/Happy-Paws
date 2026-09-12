import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { toggleFavoritoAction } from "@/app/actions/favoritos";
import { FiltrosMascotas } from "./FiltrosMascotas";
import type { Prisma } from "@prisma/client";

export default async function MascotasPage({
  searchParams,
}: {
  searchParams: Promise<{ especie?: string; tamanio?: string }>;
}) {
  const { especie, tamanio } = await searchParams;

  const where: Prisma.MascotaWhereInput = {
    estado: { in: ["EN_PROTECTORA", "EN_TRANSITO", "EN_PROCESO"] },
  };
  if (especie === "PERRO" || especie === "GATO") where.especie = especie;
  if (tamanio) where.tamanio = tamanio;

  const [mascotas, session] = await Promise.all([
    prisma.mascota.findMany({ where, orderBy: { fechaIngreso: "desc" } }),
    getSession(),
  ]);

  const favoritos =
    session?.rol === "ADOPTANTE"
      ? new Set(
          (
            await prisma.favorito.findMany({
              where: { adoptante: { userId: session.userId } },
              select: { mascotaId: true },
            })
          ).map((f) => f.mascotaId)
        )
      : null;

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-[var(--text-dark)]">
          Mascotas en adopción
        </h1>
        <p className="mt-1 text-sm text-[var(--text-light)]">
          {mascotas.length} {mascotas.length === 1 ? "mascota esperando" : "mascotas esperando"} un hogar.
        </p>

        <Suspense fallback={null}>
          <FiltrosMascotas />
        </Suspense>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mascotas.map((mascota) => (
            <div key={mascota.id} className="card group overflow-hidden p-4">
              <div className="relative mb-3 h-32 overflow-hidden rounded-xl bg-[var(--brown-light)]">
                {mascota.mediaUrl && mascota.mediaType === "image" ? (
                  <img
                    src={mascota.mediaUrl}
                    alt={mascota.nombre}
                    className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : mascota.mediaUrl && mascota.mediaType === "video" ? (
                  <video src={mascota.mediaUrl} controls className="h-32 w-full object-cover" />
                ) : (
                  <div className="flex h-32 items-center justify-center text-4xl transition-transform duration-300 group-hover:scale-110">
                    {mascota.especie === "PERRO" ? "🐶" : "🐱"}
                  </div>
                )}
                <span className="badge-pill absolute left-2 top-2">
                  {mascota.especie === "PERRO" ? "Perro" : "Gato"}
                </span>
                {favoritos && (
                  <form action={toggleFavoritoAction} className="absolute right-2 top-2">
                    <input type="hidden" name="mascotaId" value={mascota.id} />
                    <button
                      type="submit"
                      aria-label={favoritos.has(mascota.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm"
                    >
                      {favoritos.has(mascota.id) ? "★" : "☆"}
                    </button>
                  </form>
                )}
              </div>
              <h3 className="font-semibold text-[var(--text-dark)]">{mascota.nombre}</h3>
              <p className="text-sm text-[var(--text-light)]">
                {mascota.razaTexto} · {mascota.edadTexto} · {mascota.tamanio}
              </p>
              <p className="mt-2 text-sm text-[var(--text-mid)]">{mascota.descripcion}</p>
              <Link href={`/mascotas/${mascota.id}`} className="btn-dark mt-3 block">
                Ver más
              </Link>
            </div>
          ))}
          {mascotas.length === 0 && (
            <p className="col-span-full text-sm text-[var(--text-mid)]">
              No hay mascotas que coincidan con esos filtros.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
