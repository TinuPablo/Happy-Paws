import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/app/components/Reveal";
import { badgeClasses, badgeLabel } from "./estadoBadge";

// Vista de perfil para cuentas ADOPTANTE. Dominio del lado "adoptante" del
// proyecto — la vista de protectora vive en PerfilProtectora.tsx, aparte a
// propósito para que ambas puedan evolucionar sin pisarse.
export async function PerfilAdoptante({ userId }: { userId: string }) {
  const [misSolicitudes, misFavoritos] = await Promise.all([
    prisma.solicitudAdopcion.findMany({
      where: { adoptante: { userId } },
      include: {
        mascota: {
          include: {
            protectora: {
              select: { nombre: true, email: true, telefono: true, duenio: { select: { email: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.favorito.findMany({
      where: { adoptante: { userId } },
      include: { mascota: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mt-6 space-y-3">
      <Reveal className="card p-4">
        <h2 className="font-semibold text-[var(--text-dark)]">Mis solicitudes de adopción</h2>
        {misSolicitudes.length === 0 ? (
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            Todavía no enviaste ninguna solicitud.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {misSolicitudes.map((s) => {
              const { protectora } = s.mascota;
              const emailProtectora = protectora.email || protectora.duenio.email;
              return (
                <div key={s.id} className="rounded-xl border border-[var(--brown-light)] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/mascotas/${s.mascotaId}`}
                        className="block truncate text-sm font-medium text-[var(--text-dark)] hover:text-[var(--brown-dark)]"
                      >
                        {s.mascota.nombre}
                      </Link>
                      <p className="text-xs text-[var(--text-light)]">
                        {protectora.nombre} · {s.createdAt.toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badgeClasses(s.estado)}`}>
                      {badgeLabel(s.estado)}
                    </span>
                  </div>
                  {/* Con la solicitud aprobada, el adoptante también puede
                      escribirle a la protectora para coordinar. */}
                  {s.estado === "APROBADA" && (
                    <div className="mt-2 rounded-lg bg-[var(--green-ok)]/10 px-3 py-2 text-xs text-[var(--text-mid)]">
                      <p className="font-semibold text-[var(--green-ok)]">
                        ¡Felicitaciones! Coordiná con {protectora.nombre}:
                      </p>
                      <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <a href={`mailto:${emailProtectora}`} className="break-all font-medium text-[var(--brown-main)] hover:text-[var(--brown-dark)]">
                          ✉ {emailProtectora}
                        </a>
                        {protectora.telefono && (
                          <a
                            href={`tel:${protectora.telefono.replace(/[^\d+]/g, "")}`}
                            className="font-medium text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
                          >
                            ☎ {protectora.telefono}
                          </a>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Reveal>
      <Reveal delay={80} className="card p-4">
        <h2 className="font-semibold text-[var(--text-dark)]">Mis favoritos</h2>
        {misFavoritos.length === 0 ? (
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            Todavía no guardaste ninguna mascota como favorita.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {misFavoritos.map((f) => (
              <Link
                key={f.id}
                href={`/mascotas/${f.mascotaId}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-light)] p-3 hover:bg-[var(--brown-lightest)]"
              >
                <span className="truncate text-sm font-medium text-[var(--text-dark)]">
                  ★ {f.mascota.nombre}
                </span>
                <span className="shrink-0 text-xs text-[var(--text-light)]">Ver ficha →</span>
              </Link>
            ))}
          </div>
        )}
      </Reveal>
      <Reveal delay={160} className="card p-4">
        <h2 className="font-semibold text-[var(--text-dark)]">Explorar mascotas</h2>
        <Link href="/mascotas" className="mt-2 inline-block text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]">
          Ver mascotas en adopción →
        </Link>
      </Reveal>
    </div>
  );
}
