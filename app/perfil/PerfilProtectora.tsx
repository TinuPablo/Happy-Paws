import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { actualizarEstadoSolicitudAction } from "@/app/actions/solicitudes";
import { AgregarMascotaForm } from "./AgregarMascotaForm";
import { LogoProtectoraForm } from "./LogoProtectoraForm";
import { EditarDatosProtectoraForm } from "./EditarDatosProtectoraForm";
import { MascotaRow } from "./MascotaRow";
import { NotificacionesPanel } from "./NotificacionesPanel";
import { VerFormularioSolicitud } from "./VerFormularioSolicitud";
import { Reveal } from "@/app/components/Reveal";
import { Counter } from "@/app/components/Counter";
import { esRespuestasQuizValidas } from "@/lib/calcularCompatibilidad";
import { badgeClasses, badgeLabel } from "./estadoBadge";

// Vista de perfil para cuentas de protectora (ADMIN_PROTECTORA/COLABORADOR/
// HOGAR_TRANSITO). Dominio del lado "protectora" del proyecto — la vista de
// adoptante vive en PerfilAdoptante.tsx, aparte a propósito para que ambas
// puedan evolucionar sin pisarse.
export async function PerfilProtectora({ userId }: { userId: string }) {
  const protectora = await prisma.protectora.findFirst({
    where: { duenioId: userId },
    include: {
      mascotas: {
        orderBy: { createdAt: "desc" },
        include: { vacunaciones: { orderBy: { fechaAplicacion: "desc" } } },
      },
    },
  });
  // El listado de gestión muestra todo (incluidas las dadas de baja, para
  // que la protectora tenga registro), pero las métricas del dashboard
  // solo cuentan mascotas activas.
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
      {protectora && (
        <Link
          href="/protectoras/historial"
          className="block text-center text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
        >
          Ver historial completo de adopciones →
        </Link>
      )}
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

      <Reveal delay={160} className="card p-4">
        <h2 className="font-semibold text-[var(--text-dark)]">Datos de la protectora</h2>
        <p className="mt-1 text-sm text-[var(--text-mid)]">
          {protectora?.ubicacion} · {protectora?.email}
        </p>
        {protectora?.descripcion && (
          <p className="mt-1 text-sm text-[var(--text-light)]">{protectora.descripcion}</p>
        )}
        <LogoProtectoraForm logoActualUrl={protectora?.logoUrl ?? null} />
        {protectora && (
          <EditarDatosProtectoraForm
            ubicacion={protectora.ubicacion}
            descripcion={protectora.descripcion}
            telefono={protectora.telefono}
            email={protectora.email}
            redSocial={protectora.redSocial}
          />
        )}
      </Reveal>
    </div>
  );
}
