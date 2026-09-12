import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession, toUiRole } from "@/lib/session";
import { toggleFavoritoAction } from "@/app/actions/favoritos";
import { AdoptarButton } from "./AdoptarButton";

export default async function MascotaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [mascota, session] = await Promise.all([
    prisma.mascota.findUnique({
      where: { id },
      include: { vacunaciones: { orderBy: { fechaAplicacion: "asc" } } },
    }),
    getSession(),
  ]);

  if (!mascota) {
    return (
      <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
        <p className="text-[var(--text-mid)]">Mascota no encontrada</p>
      </main>
    );
  }

  const role = session ? toUiRole(session.rol) : null;
  const esFavorito =
    role === "adoptante"
      ? Boolean(
          await prisma.favorito.findFirst({
            where: { mascotaId: id, adoptante: { userId: session!.userId } },
          })
        )
      : false;

  // La libreta de vacunación se arma a partir de Vacunacion real: cada
  // registro es una dosis aplicada, y si tiene próxima dosis programada se
  // muestra además como pendiente.
  const vacunas = mascota.vacunaciones.flatMap((v) => {
    const items: { nombre: string; fecha: string; estado: "APLICADA" | "PENDIENTE" }[] = [
      {
        nombre: v.nombreVacuna,
        fecha: v.fechaAplicacion.toLocaleDateString("es-AR"),
        estado: "APLICADA",
      },
    ];
    if (v.proximaDosis) {
      items.push({
        nombre: `${v.nombreVacuna} (próxima dosis)`,
        fecha: v.proximaDosis.toLocaleDateString("es-AR"),
        estado: "PENDIENTE" as const,
      });
    }
    return items;
  });

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-[var(--brown-light)] bg-white p-4 shadow-sm lg:grid-cols-2 lg:p-6">
          <div className="relative">
            {mascota.mediaUrl && mascota.mediaType === "image" ? (
              <img
                src={mascota.mediaUrl}
                alt={mascota.nombre}
                className="h-64 w-full rounded-xl object-cover lg:h-full"
              />
            ) : mascota.mediaUrl && mascota.mediaType === "video" ? (
              <video src={mascota.mediaUrl} controls className="h-64 w-full rounded-xl object-cover lg:h-full" />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl bg-[var(--brown-light)] text-6xl lg:h-full">
                {mascota.especie === "PERRO" ? "🐶" : "🐱"}
              </div>
            )}
            <span className="badge-pill absolute left-3 top-3">
              {mascota.especie === "PERRO" ? "Perro" : "Gato"}
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[var(--text-dark)]">{mascota.nombre}</h1>
            <p className="text-sm text-[var(--text-light)]">
              {mascota.razaTexto} · {mascota.edadTexto} · {mascota.tamanio}
            </p>
            <p className="mt-3 text-sm text-[var(--text-mid)]">{mascota.descripcion}</p>

            {mascota.estado === "ADOPTADO" ? (
              <p className="badge-pill mt-6 inline-flex bg-[var(--green-ok)] text-white shadow-none">
                Ya encontró un hogar 🏡
              </p>
            ) : (
              <>
                {!session && (
                  <Link href={`/login?redirect=/mascotas/${id}`} className="btn-primary mt-6 block text-center">
                    Quiero adoptar a {mascota.nombre} 🐾
                  </Link>
                )}
                {role === "adoptante" && <AdoptarButton mascotaId={mascota.id} nombre={mascota.nombre} />}
              </>
            )}

            {role === "adoptante" && (
              <form action={toggleFavoritoAction} className="mt-3">
                <input type="hidden" name="mascotaId" value={mascota.id} />
                <button type="submit" className="btn-outline w-full">
                  {esFavorito ? "★ Quitar de favoritos" : "☆ Guardar en favoritos"}
                </button>
              </form>
            )}
          </div>
        </div>

        {vacunas.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-[var(--text-dark)]">Libreta de vacunación</h2>
            <div className="mt-4 space-y-3">
              {vacunas.map((vacuna, i) => (
                <div key={i} className="card flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--text-dark)]">{vacuna.nombre}</p>
                    <p className="text-sm text-[var(--text-light)]">{vacuna.fecha}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      vacuna.estado === "APLICADA"
                        ? "bg-[var(--green-ok)] text-white"
                        : "bg-[var(--gold)] text-[var(--brown-darker)]"
                    }`}
                  >
                    {vacuna.estado === "APLICADA" ? "Aplicada" : "Pendiente"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
