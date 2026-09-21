import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { MascotasCatalogo } from "./MascotasCatalogo";
import { Reveal } from "@/app/components/Reveal";
import type { Prisma } from "@prisma/client";

export default async function MascotasPage({
  searchParams,
}: {
  searchParams: Promise<{ especie?: string; tamanio?: string }>;
}) {
  const { especie, tamanio } = await searchParams;

  const where: Prisma.MascotaWhereInput = {
    activo: true,
    estado: { in: ["EN_PROTECTORA", "EN_TRANSITO", "EN_PROCESO"] },
  };
  if (especie === "PERRO" || especie === "GATO") where.especie = especie;
  if (tamanio) where.tamanio = tamanio;

  const [mascotas, session] = await Promise.all([
    prisma.mascota.findMany({ where, orderBy: { fechaIngreso: "desc" } }),
    getSession(),
  ]);

  const favoritosIds =
    session?.rol === "ADOPTANTE"
      ? (
          await prisma.favorito.findMany({
            where: { adoptante: { userId: session.userId } },
            select: { mascotaId: true },
          })
        ).map((f) => f.mascotaId)
      : null;

  // El quiz de match solo se ofrece en la entrada "limpia" a /mascotas: si
  // ya hay filtros de especie/tamaño en la URL es porque el visitante está
  // navegando el catálogo a mano, no tiene sentido interrumpirlo con el quiz.
  // Tampoco se ofrece a cuentas de protectora — las protectoras no adoptan,
  // solo publican mascotas y gestionan solicitudes.
  const esCuentaProtectora = Boolean(session) && session!.rol !== "ADOPTANTE";
  const mostrarQuiz = !especie && !tamanio && mascotas.length > 0 && !esCuentaProtectora;

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h1 className="text-2xl font-bold text-[var(--text-dark)]">
            Mascotas en adopción
          </h1>
        </Reveal>

        <MascotasCatalogo mascotas={mascotas} favoritosIds={favoritosIds} mostrarQuiz={mostrarQuiz} />
      </div>
    </main>
  );
}
