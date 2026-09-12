import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/app/actions/auth";
import { actualizarEstadoSolicitudAction } from "@/app/actions/solicitudes";
import { AgregarMascotaForm } from "./AgregarMascotaForm";
import { LogoProtectoraForm } from "./LogoProtectoraForm";
import type { EstadoSolicitud } from "@prisma/client";

function badgeClasses(estado: EstadoSolicitud) {
  if (estado === "APROBADA") return "bg-[var(--green-ok)] text-white";
  if (estado === "PENDIENTE" || estado === "EN_REVISION") return "bg-[var(--gold)] text-[var(--brown-darker)]";
  return "border border-red-300 text-[var(--text-mid)]";
}

function badgeLabel(estado: EstadoSolicitud) {
  if (estado === "APROBADA") return "Aprobada";
  if (estado === "PENDIENTE") return "Pendiente";
  if (estado === "EN_REVISION") return "En revisión";
  if (estado === "CANCELADA") return "Cancelada";
  return "Rechazada";
}

export default async function PerfilPage() {
  const session = await getSession();

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--brown-lightest)] px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <Image
            src="/assets/logo.jpg"
            alt="Happy Paws"
            width={56}
            height={56}
            className="mx-auto h-14 w-14 rounded-full bg-white object-cover"
          />
          <h1 className="mt-4 text-xl font-bold text-[var(--text-dark)]">
            Todavía no iniciaste sesión
          </h1>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            Iniciá sesión para ver tu perfil.
          </p>
          <Link href="/login" className="btn-dark mt-6 inline-flex">
            Iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  const esAdoptante = session.rol === "ADOPTANTE";
  const inicial = session.nombre.charAt(0).toUpperCase() || "?";

  const misSolicitudes = esAdoptante
    ? await prisma.solicitudAdopcion.findMany({
        where: { adoptante: { userId: session.userId } },
        include: { mascota: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const misFavoritos = esAdoptante
    ? await prisma.favorito.findMany({
        where: { adoptante: { userId: session.userId } },
        include: { mascota: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const protectora = !esAdoptante
    ? await prisma.protectora.findFirst({
        where: { duenioId: session.userId },
        include: { mascotas: true },
      })
    : null;

  const solicitudesRecibidas = protectora
    ? await prisma.solicitudAdopcion.findMany({
        where: { mascota: { protectoraId: protectora.id } },
        include: { mascota: true, adoptante: { include: { user: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const inicioDeMes = new Date();
  inicioDeMes.setDate(1);
  inicioDeMes.setHours(0, 0, 0, 0);

  const dashboard = protectora
    ? {
        total: protectora.mascotas.length,
        disponibles: protectora.mascotas.filter((m) => m.estado !== "ADOPTADO").length,
        pendientes: solicitudesRecibidas.filter((s) => s.estado === "PENDIENTE").length,
        adopcionesEsteMes: solicitudesRecibidas.filter(
          (s) => s.estado === "APROBADA" && s.updatedAt >= inicioDeMes
        ).length,
      }
    : null;

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brown-main)] to-[var(--brown-dark)] text-xl font-bold text-white">
            {inicial}
          </span>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-dark)]">Hola, {session.nombre}</h1>
            <p className="text-sm text-[var(--text-light)]">
              {esAdoptante ? "Cuenta de adoptante" : "Cuenta de protectora"}
            </p>
          </div>
        </div>

        {esAdoptante && (
          <div className="mt-6 space-y-3">
            <div className="card p-4">
              <h2 className="font-semibold text-[var(--text-dark)]">Mis solicitudes de adopción</h2>
              {misSolicitudes.length === 0 ? (
                <p className="mt-1 text-sm text-[var(--text-mid)]">
                  Todavía no enviaste ninguna solicitud.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {misSolicitudes.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-light)] p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--text-dark)]">{s.mascota.nombre}</p>
                        <p className="text-xs text-[var(--text-light)]">
                          {s.createdAt.toLocaleDateString("es-AR")}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badgeClasses(s.estado)}`}>
                        {badgeLabel(s.estado)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card p-4">
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
            </div>
            <div className="card p-4">
              <h2 className="font-semibold text-[var(--text-dark)]">Explorar mascotas</h2>
              <Link href="/mascotas" className="mt-2 inline-block text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]">
                Ver mascotas en adopción →
              </Link>
            </div>
          </div>
        )}

        {!esAdoptante && (
          <div className="mt-6 space-y-3">
            {dashboard && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-[var(--text-dark)]">{dashboard.total}</p>
                  <p className="text-xs text-[var(--text-light)]">Mascotas totales</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-[var(--text-dark)]">{dashboard.disponibles}</p>
                  <p className="text-xs text-[var(--text-light)]">Disponibles</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-[var(--gold)]">{dashboard.pendientes}</p>
                  <p className="text-xs text-[var(--text-light)]">Solicitudes pendientes</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-[var(--green-ok)]">{dashboard.adopcionesEsteMes}</p>
                  <p className="text-xs text-[var(--text-light)]">Adopciones este mes</p>
                </div>
              </div>
            )}
            <div className="card p-4">
              <h2 className="font-semibold text-[var(--text-dark)]">Mis mascotas publicadas</h2>
              <p className="mt-1 text-sm text-[var(--text-mid)]">
                {protectora?.mascotas.length ?? 0}{" "}
                {(protectora?.mascotas.length ?? 0) === 1 ? "mascota publicada" : "mascotas publicadas"}.
              </p>
              <AgregarMascotaForm />
            </div>

            <div className="card p-4">
              <h2 className="font-semibold text-[var(--text-dark)]">Solicitudes recibidas</h2>
              {solicitudesRecibidas.length === 0 ? (
                <p className="mt-1 text-sm text-[var(--text-mid)]">
                  Todavía no recibiste solicitudes de adopción.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {solicitudesRecibidas.map((s) => (
                    <div key={s.id} className="rounded-xl border border-[var(--brown-light)] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[var(--text-dark)]">{s.mascota.nombre}</p>
                          <p className="truncate text-xs text-[var(--text-light)]">
                            {s.adoptante.user.nombre} · {s.createdAt.toLocaleDateString("es-AR")}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badgeClasses(s.estado)}`}>
                          {badgeLabel(s.estado)}
                        </span>
                      </div>
                      {s.estado === "PENDIENTE" && (
                        <form action={actualizarEstadoSolicitudAction} className="mt-2 flex gap-2">
                          <input type="hidden" name="solicitudId" value={s.id} />
                          <button
                            type="submit"
                            name="estado"
                            value="APROBADA"
                            className="flex-1 rounded-lg bg-[var(--green-ok)] px-3 py-1.5 text-xs font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5"
                          >
                            Aprobar
                          </button>
                          <button
                            type="submit"
                            name="estado"
                            value="RECHAZADA"
                            className="flex-1 rounded-lg border border-[var(--brown-light)] px-3 py-1.5 text-xs font-semibold text-[var(--text-mid)] transition-colors duration-150 hover:bg-[var(--brown-lightest)]"
                          >
                            Rechazar
                          </button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-4">
              <h2 className="font-semibold text-[var(--text-dark)]">Datos de la protectora</h2>
              <p className="mt-1 text-sm text-[var(--text-mid)]">
                {protectora?.ubicacion} · {protectora?.email}
              </p>
              <LogoProtectoraForm logoActualUrl={protectora?.logoUrl ?? null} />
            </div>
          </div>
        )}

        <form action={logoutAction}>
          <button type="submit" className="btn-outline mt-8 w-full">
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
