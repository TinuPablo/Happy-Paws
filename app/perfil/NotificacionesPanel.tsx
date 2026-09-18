import { Bell } from "lucide-react";
import { marcarNotificacionLeidaAction } from "@/app/actions/notificaciones";

type Notificacion = {
  id: string;
  mensaje: string;
  leida: boolean;
  createdAt: Date;
};

export function NotificacionesPanel({ notificaciones }: { notificaciones: Notificacion[] }) {
  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <Bell size={18} className="text-[var(--brown-main)]" />
        <h2 className="font-semibold text-[var(--text-dark)]">Notificaciones</h2>
        {noLeidas > 0 && (
          <span className="rounded-full bg-[var(--gold)] px-2 py-0.5 text-[11px] font-bold text-[var(--brown-darker)]">
            {noLeidas} nueva{noLeidas === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {notificaciones.length === 0 ? (
        <p className="mt-1 text-sm text-[var(--text-mid)]">Todavía no tenés notificaciones.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {notificaciones.map((n) => (
            <div
              key={n.id}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                n.leida ? "border-[var(--brown-light)]" : "border-[var(--gold)] bg-[var(--gold)]/10"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-[var(--text-dark)]">{n.mensaje}</p>
                <p className="text-xs text-[var(--text-light)]">{n.createdAt.toLocaleDateString("es-AR")}</p>
              </div>
              {!n.leida && (
                <form action={marcarNotificacionLeidaAction}>
                  <input type="hidden" name="notificacionId" value={n.id} />
                  <button type="submit" className="shrink-0 text-xs font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]">
                    Marcar como leída
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
