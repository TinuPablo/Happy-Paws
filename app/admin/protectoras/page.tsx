import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { esUrlHttpValida } from "@/lib/validacionProtectora";
import { AccionesRevision } from "./AccionesRevision";

const ETIQUETA_ESTADO = {
  PENDIENTE: { texto: "Pendiente", clase: "bg-[var(--gold)]/20 text-[var(--brown-dark)]" },
  APROBADA: { texto: "Aprobada", clase: "bg-[var(--green-ok)]/15 text-[var(--green-ok)]" },
  RECHAZADA: { texto: "Rechazada", clase: "bg-[var(--brown-light)] text-[var(--text-mid)]" },
} as const;

function fecha(d: Date | null) {
  return d ? d.toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" }) : "—";
}

export default async function AdminProtectorasPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  // Solo ADMIN de plataforma, validado contra la cookie firmada. Cualquier
  // otra sesión (o ninguna) no ve ni un dato.
  const session = await getSession();
  if (!session) redirect("/login?redirect=/admin/protectoras");
  if (session.rol !== "ADMIN") redirect("/");

  const { tab } = await searchParams;
  const verRevisadas = tab === "revisadas";

  // Una protectora entra a la cola recién cuando confirmó su correo: antes
  // de eso no tiene sentido revisarla (y el motivo de un rechazo no le
  // llegaría a nadie).
  const pendienteConfirmada = {
    estadoVerificacion: "PENDIENTE",
    duenio: { emailVerificadoEn: { not: null } },
  } as const;

  const [protectoras, pendientes] = await Promise.all([
    prisma.protectora.findMany({
      where: verRevisadas ? { estadoVerificacion: { not: "PENDIENTE" } } : pendienteConfirmada,
      include: { duenio: { select: { email: true } } },
      orderBy: verRevisadas ? { fechaRevision: "desc" } : { fechaSolicitud: "asc" },
    }),
    prisma.protectora.count({ where: pendienteConfirmada }),
  ]);

  const tabClase = (activa: boolean) =>
    activa
      ? "rounded-full bg-[var(--brown-dark)] px-4 py-2 text-sm font-medium text-[var(--brown-lightest)]"
      : "rounded-full px-4 py-2 text-sm font-medium text-[var(--text-mid)] hover:bg-[var(--brown-light)]";

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-[var(--text-dark)]">Protectoras para revisar</h1>
        <p className="mt-1 text-sm text-[var(--text-light)]">
          Verificá que cada protectora exista y que quien la registró forme parte de ella.
        </p>

        <nav className="mt-6 flex gap-2" aria-label="Filtrar solicitudes">
          <Link href="/admin/protectoras" className={tabClase(!verRevisadas)} aria-current={!verRevisadas ? "page" : undefined}>
            Pendientes ({pendientes})
          </Link>
          <Link href="/admin/protectoras?tab=revisadas" className={tabClase(verRevisadas)} aria-current={verRevisadas ? "page" : undefined}>
            Revisadas
          </Link>
        </nav>

        {protectoras.length === 0 && (
          <p className="mt-8 rounded-2xl border border-[var(--brown-light)] bg-white p-6 text-center text-sm text-[var(--text-mid)]">
            {verRevisadas ? "Todavía no hay solicitudes revisadas." : "No hay solicitudes pendientes. ¡Todo al día! 🐾"}
          </p>
        )}

        <ul className="mt-6 space-y-4">
          {protectoras.map((p) => {
            const estado = ETIQUETA_ESTADO[p.estadoVerificacion];
            const enlaces = [
              ["Instagram", p.instagram],
              ["Facebook", p.facebook],
              ["Sitio web", p.sitioWeb],
              ["Red social", p.redSocial],
            ].filter((e): e is [string, string] => Boolean(e[1]));

            return (
              <li key={p.id} className="rounded-2xl border border-[var(--brown-light)] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--brown-dark)]">{p.nombre}</h2>
                    <p className="text-sm text-[var(--text-light)]">{p.ubicacion}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estado.clase}`}>{estado.texto}</span>
                </div>

                <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  <Dato etiqueta="Email" valor={p.email || p.duenio.email} />
                  <Dato etiqueta="Teléfono / WhatsApp" valor={p.telefono} />
                  <Dato etiqueta="Responsable" valor={p.nombreResponsable} />
                  <Dato etiqueta="Cargo" valor={p.cargoResponsable} />
                  <Dato etiqueta="Solicitud enviada" valor={fecha(p.fechaSolicitud)} />
                  {verRevisadas && <Dato etiqueta="Revisada" valor={fecha(p.fechaRevision)} />}
                </dl>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-light)]">Enlaces</p>
                  {enlaces.length === 0 ? (
                    <p className="mt-1 text-sm text-[var(--text-mid)]">—</p>
                  ) : (
                    <ul className="mt-1 space-y-1 text-sm">
                      {enlaces.map(([etiqueta, url]) => (
                        <li key={etiqueta}>
                          <span className="text-[var(--text-light)]">{etiqueta}: </span>
                          {esUrlHttpValida(url) ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all font-medium text-[var(--brown-main)] underline hover:text-[var(--brown-dark)]"
                            >
                              {url}
                            </a>
                          ) : (
                            <span className="break-all text-[var(--text-mid)]">{url}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-light)]">
                    Cómo verificar que forma parte
                  </p>
                  <p className="mt-1 whitespace-pre-line rounded-xl bg-[var(--brown-lightest)] p-3 text-sm text-[var(--text-dark)]">
                    {p.textoVerificacion || "—"}
                  </p>
                </div>

                {p.motivoRechazo && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-light)]">
                      {p.estadoVerificacion === "RECHAZADA" ? "Motivo del rechazo" : "Motivo del rechazo anterior"}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm text-[var(--text-mid)]">{p.motivoRechazo}</p>
                  </div>
                )}

                <AccionesRevision protectoraId={p.id} pendiente={p.estadoVerificacion === "PENDIENTE"} />
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string | null }) {
  return (
    <div>
      <dt className="text-xs text-[var(--text-light)]">{etiqueta}</dt>
      <dd className="break-words text-[var(--text-dark)]">{valor || "—"}</dd>
    </div>
  );
}
