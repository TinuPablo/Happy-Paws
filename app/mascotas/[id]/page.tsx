import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession, toUiRole } from "@/lib/session";
import { toggleFavoritoAction } from "@/app/actions/favoritos";
import { completarSeguimientoAction } from "@/app/actions/seguimiento";
import { AdoptarButton } from "./AdoptarButton";
import { Reveal } from "@/app/components/Reveal";

const ETIQUETA_CHECKPOINT: Record<string, string> = {
  DIAS_7: "7 días después",
  MES_1: "1 mes después",
  MES_3: "3 meses después",
  MES_6: "6 meses después",
};

export default async function MascotaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [mascota, session] = await Promise.all([
    prisma.mascota.findUnique({
      where: { id },
      include: {
        vacunaciones: { orderBy: { fechaAplicacion: "asc" } },
        seguimientos: { orderBy: { fechaProgramada: "asc" } },
        protectora: true,
      },
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
  const esProtectoraDuenia = Boolean(session) && mascota.protectora.duenioId === session!.userId;
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
        <Reveal className="grid grid-cols-1 gap-8 rounded-2xl border border-[var(--brown-light)] bg-white p-4 shadow-sm lg:grid-cols-2 lg:p-6">
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

            {!mascota.activo ? (
              <p className="badge-pill mt-6 inline-flex bg-[var(--brown-light)] text-[var(--text-mid)] shadow-none">
                Ya no está disponible
              </p>
            ) : mascota.estado === "ADOPTADO" ? (
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
        </Reveal>

        {vacunas.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-[var(--text-dark)]">Libreta de vacunación</h2>
            <div className="mt-4 space-y-3">
              {vacunas.map((vacuna, i) => (
                <Reveal key={i} delay={Math.min(i, 8) * 60} className="card flex items-center justify-between gap-3 p-4">
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
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {mascota.seguimientos.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-[var(--text-dark)]">
              Seguimiento post-adopción
            </h2>
            <p className="mt-1 text-sm text-[var(--text-mid)]">
              La historia de {mascota.nombre} no termina con la adopción — así le fue en el nuevo hogar.
            </p>
            <div className="mt-4 space-y-3">
              {mascota.seguimientos.map((s, i) => (
                <Reveal key={s.id} delay={Math.min(i, 8) * 60} className="card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--text-dark)]">
                        {ETIQUETA_CHECKPOINT[s.tipo] ?? s.tipo}
                      </p>
                      <p className="text-sm text-[var(--text-light)]">
                        {s.fechaRealizada
                          ? `Registrado el ${s.fechaRealizada.toLocaleDateString("es-AR")}`
                          : `Programado para el ${s.fechaProgramada.toLocaleDateString("es-AR")}`}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        s.fechaRealizada
                          ? "bg-[var(--green-ok)] text-white"
                          : "bg-[var(--gold)] text-[var(--brown-darker)]"
                      }`}
                    >
                      {s.fechaRealizada ? "Hecho" : "Pendiente"}
                    </span>
                  </div>
                  {s.nota && <p className="mt-2 text-sm text-[var(--text-mid)]">{s.nota}</p>}
                  {!s.fechaRealizada && esProtectoraDuenia && (
                    <form action={completarSeguimientoAction} className="mt-3 flex gap-2">
                      <input type="hidden" name="seguimientoId" value={s.id} />
                      <input
                        type="text"
                        name="nota"
                        placeholder="¿Cómo le está yendo? (opcional)"
                        className="input mt-0 flex-1"
                      />
                      <button type="submit" className="btn-dark shrink-0">
                        Marcar hecho
                      </button>
                    </form>
                  )}
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
