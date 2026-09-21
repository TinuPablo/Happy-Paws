import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Reveal } from "@/app/components/Reveal";

// Vista de solo lectura del lado protectora. No tiene ningún parámetro de
// URL con un id de protectora: la protectora siempre sale de la sesión, así
// que estructuralmente no hay forma de ver el historial de otra cuenta.
export default async function HistorialAdopcionesPage({
  searchParams,
}: {
  searchParams: Promise<{ desde?: string; hasta?: string; mascotaId?: string }>;
}) {
  const session = await getSession();

  if (!session || session.rol === "ADOPTANTE") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--brown-lightest)] px-6 text-center">
        <div className="mx-auto max-w-md">
          <h1 className="text-xl font-bold text-[var(--text-dark)]">Sección solo para protectoras</h1>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            Iniciá sesión con una cuenta de protectora para ver el historial de adopciones.
          </p>
          <Link href="/login" className="btn-dark mt-6 inline-flex">
            Iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  const protectora = await prisma.protectora.findFirst({ where: { duenioId: session.userId } });

  if (!protectora) {
    return (
      <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10 text-center">
        <p className="text-sm text-[var(--text-mid)]">No se encontró una protectora asociada a esta cuenta.</p>
      </main>
    );
  }

  const { desde, hasta, mascotaId } = await searchParams;

  const where: Prisma.SolicitudAdopcionWhereInput = {
    estado: "APROBADA",
    mascota: { protectoraId: protectora.id },
  };
  if (mascotaId) where.mascotaId = mascotaId;
  if (desde || hasta) {
    where.updatedAt = {};
    if (desde) where.updatedAt.gte = new Date(`${desde}T00:00:00`);
    if (hasta) where.updatedAt.lte = new Date(`${hasta}T23:59:59`);
  }

  const [adopciones, mascotasConAdopcion] = await Promise.all([
    prisma.solicitudAdopcion.findMany({
      where,
      include: { mascota: true, adoptante: { include: { user: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.mascota.findMany({
      where: { protectoraId: protectora.id, solicitudes: { some: { estado: "APROBADA" } } },
      select: { id: true, nombre: true },
      orderBy: { nombre: "asc" },
    }),
  ]);

  const hayFiltros = Boolean(desde || hasta || mascotaId);

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <Link href="/perfil" className="text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]">
            ← Volver a mi perfil
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-[var(--text-dark)]">Historial de adopciones</h1>
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            {adopciones.length} {adopciones.length === 1 ? "adopción concretada" : "adopciones concretadas"}
            {hayFiltros ? " con los filtros actuales." : "."}
          </p>
        </Reveal>

        <Reveal delay={60} className="card mt-4 p-4">
          <form method="GET" className="flex flex-wrap items-end gap-3">
            <label className="text-sm text-[var(--text-mid)]">
              Desde
              <input type="date" name="desde" defaultValue={desde ?? ""} className="input mt-1" />
            </label>
            <label className="text-sm text-[var(--text-mid)]">
              Hasta
              <input type="date" name="hasta" defaultValue={hasta ?? ""} className="input mt-1" />
            </label>
            <label className="min-w-[180px] text-sm text-[var(--text-mid)]">
              Mascota
              <select name="mascotaId" defaultValue={mascotaId ?? ""} className="input mt-1">
                <option value="">Todas</option>
                {mascotasConAdopcion.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn-outline">
              Filtrar
            </button>
            {hayFiltros && (
              <Link href="/protectoras/historial" className="text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]">
                Limpiar filtros
              </Link>
            )}
          </form>
        </Reveal>

        {adopciones.length === 0 ? (
          <p className="mt-8 text-center text-sm text-[var(--text-mid)]">
            {hayFiltros
              ? "No hay adopciones concretadas que coincidan con estos filtros."
              : "Todavía no concretaste ninguna adopción."}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {adopciones.map((a, i) => (
              <Reveal key={a.id} delay={Math.min(i, 8) * 60} className="card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--text-dark)]">{a.mascota.nombre}</p>
                    <p className="text-sm text-[var(--text-mid)]">Adoptada por {a.adoptante.user.nombre}</p>
                  </div>
                  <span className="badge-pill shrink-0">{a.updatedAt.toLocaleDateString("es-AR")}</span>
                </div>
                <div className="mt-2 space-y-0.5 text-xs text-[var(--text-light)]">
                  <p>{a.adoptante.user.email}</p>
                  <p>{a.adoptante.user.telefono ?? "Teléfono no cargado"}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
