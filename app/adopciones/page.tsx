import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { protectoraIdDeUsuario } from "@/lib/protectora";
import { actualizarEstadoSolicitudAction } from "@/app/actions/solicitudes";
import { AgregarMascotaForm } from "@/app/perfil/AgregarMascotaForm";
import { MascotaRow } from "@/app/perfil/MascotaRow";
import { NotificacionesPanel } from "@/app/perfil/NotificacionesPanel";
import { VerFormularioSolicitud } from "@/app/perfil/VerFormularioSolicitud";
import { InvitarMiembroForm } from "@/app/perfil/InvitarMiembroForm";
import { Reveal } from "@/app/components/Reveal";
import { Counter } from "@/app/components/Counter";
import { esRespuestasQuizValidas } from "@/lib/calcularCompatibilidad";
import { badgeClasses, badgeLabel } from "@/app/perfil/estadoBadge";

const ETIQUETA_ROL_MIEMBRO: Record<string, string> = {
  COLABORADOR: "Colaborador/a",
  HOGAR_TRANSITO: "Hogar de tránsito",
};

// Todo lo operativo del lado protectora (antes vivía mezclado en
// PerfilProtectora.tsx): notificaciones, dashboard, gestión de mascotas
// (incluida vacunación), solicitudes, equipo. /perfil quedó solo para
// edición de cuenta (foto, mail, "acerca de"). Reemplaza a "Guías" en el
// nav para cuentas de protectora — ver Navbar.tsx.
export default async function AdopcionesPage() {
  const session = await getSession();

  if (!session || session.rol === "ADOPTANTE") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--brown-lightest)] px-6 text-center">
        <div className="mx-auto max-w-md">
          <h1 className="text-xl font-bold text-[var(--text-dark)]">Sección solo para protectoras</h1>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            Iniciá sesión con una cuenta de protectora para gestionar tus adopciones.
          </p>
          <Link href="/login" className="btn-dark mt-6 inline-flex">
            Iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  const protectoraId = await protectoraIdDeUsuario(session.userId);

  const protectora = protectoraId
    ? await prisma.protectora.findUnique({
        where: { id: protectoraId },
        include: {
          mascotas: {
            orderBy: { createdAt: "desc" },
            include: { vacunaciones: { orderBy: { fechaAplicacion: "desc" } } },
          },
          miembros: { include: { user: true }, orderBy: { createdAt: "asc" } },
        },
      })
    : null;

  // Mismo criterio que tenía PerfilProtectora.tsx: solo el dueño puede
  // publicar/editar mascotas o invitar gente nueva — las server actions
  // detrás (mascotas.ts, miembros.ts) también verifican duenioId.
  const esAdmin = protectora?.duenioId === session.userId;

  const mascotasActivas = protectora?.mascotas.filter((m) => m.activo) ?? [];

  const notificaciones = protectora
    ? await prisma.notificacion.findMany({
        where: { protectoraId: protectora.id },
        orderBy: { createdAt: "desc" },
        take: 15,
      })
    : [];

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
        total: mascotasActivas.length,
        disponibles: mascotasActivas.filter((m) => m.estado !== "ADOPTADO").length,
        pendientes: solicitudesRecibidas.filter((s) => s.estado === "PENDIENTE").length,
        adopcionesEsteMes: solicitudesRecibidas.filter(
          (s) => s.estado === "APROBADA" && s.updatedAt >= inicioDeMes
        ).length,
      }
    : null;

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h1 className="text-2xl font-bold text-[var(--text-dark)]">Adopciones</h1>
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            Mascotas, solicitudes y seguimiento de {protectora?.nombre ?? "tu protectora"}.
          </p>
        </Reveal>

        <div className="mt-6 space-y-3">
          {protectora && <NotificacionesPanel notificaciones={notificaciones} />}
          {dashboard && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Reveal className="card p-4 text-center">
                <p className="text-2xl font-bold text-[var(--text-dark)]">
                  <Counter value={dashboard.total} />
                </p>
                <p className="text-xs text-[var(--text-light)]">Mascotas totales</p>
              </Reveal>
              <Reveal delay={60} className="card p-4 text-center">
                <p className="text-2xl font-bold text-[var(--text-dark)]">
                  <Counter value={dashboard.disponibles} />
                </p>
                <p className="text-xs text-[var(--text-light)]">Disponibles</p>
              </Reveal>
              <Reveal delay={120} className="card p-4 text-center">
                <p className="text-2xl font-bold text-[var(--gold)]">
                  <Counter value={dashboard.pendientes} />
                </p>
                <p className="text-xs text-[var(--text-light)]">Solicitudes pendientes</p>
              </Reveal>
              <Reveal delay={180} className="card p-4 text-center">
                <p className="text-2xl font-bold text-[var(--green-ok)]">
                  <Counter value={dashboard.adopcionesEsteMes} />
                </p>
                <p className="text-xs text-[var(--text-light)]">Adopciones este mes</p>
              </Reveal>
            </div>
          )}

          {esAdmin && (
            <div className="flex flex-col items-center gap-1">
              <Link
                href="/protectoras/dashboard"
                className="text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
              >
                Ver dashboard completo →
              </Link>
              <Link
                href="/protectoras/historial"
                className="text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
              >
                Ver historial completo de adopciones →
              </Link>
            </div>
          )}

          {esAdmin && (
            <Reveal className="card p-4">
              <h2 className="font-semibold text-[var(--text-dark)]">Mis mascotas publicadas</h2>
              <p className="mt-1 text-sm text-[var(--text-mid)]">
                {mascotasActivas.length} {mascotasActivas.length === 1 ? "mascota publicada" : "mascotas publicadas"}.
              </p>
              <AgregarMascotaForm />
              {protectora && protectora.mascotas.length > 0 && (
                <div className="mt-4 space-y-2">
                  {protectora.mascotas.map((m) => (
                    <MascotaRow
                      key={m.id}
                      id={m.id}
                      nombre={m.nombre}
                      especie={m.especie}
                      razaTexto={m.razaTexto}
                      edadTexto={m.edadTexto}
                      tamanio={m.tamanio}
                      descripcion={m.descripcion}
                      mediaUrl={m.mediaUrl}
                      mediaType={m.mediaType}
                      estado={m.estado}
                      activo={m.activo}
                      estadoSalud={m.estadoSalud}
                      vacunaciones={m.vacunaciones}
                    />
                  ))}
                </div>
              )}
            </Reveal>
          )}

          <Reveal delay={80} className="card p-4">
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
                    {esRespuestasQuizValidas(s.quizRespuestas) && typeof s.quizPorcentaje === "number" && (
                      <VerFormularioSolicitud
                        respuestas={s.quizRespuestas}
                        porcentaje={s.quizPorcentaje}
                        eraRecomendada={Boolean(s.quizEraRecomendada)}
                        nombreMascota={s.mascota.nombre}
                        nombreAdoptante={s.adoptante.user.nombre}
                      />
                    )}
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
          </Reveal>

          <Reveal delay={120} className="card p-4">
            <h2 className="font-semibold text-[var(--text-dark)]">Equipo de la protectora</h2>
            {!protectora || protectora.miembros.length === 0 ? (
              <p className="mt-1 text-sm text-[var(--text-mid)]">
                Todavía no hay colaboradores ni hogares de tránsito sumados.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {protectora.miembros.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-light)] p-3"
                  >
                    <span className="truncate text-sm font-medium text-[var(--text-dark)]">{m.user.nombre}</span>
                    <span className="shrink-0 rounded-full bg-[var(--brown-light)] px-3 py-1 text-xs font-medium text-[var(--text-dark)]">
                      {ETIQUETA_ROL_MIEMBRO[m.rol] ?? m.rol}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {esAdmin && <InvitarMiembroForm />}
          </Reveal>
        </div>
      </div>
    </main>
  );
}
