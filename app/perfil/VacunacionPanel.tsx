import { EstadoSaludForm } from "./EstadoSaludForm";
import { RegistrarVacunaForm } from "./RegistrarVacunaForm";
import { VacunaItem } from "./VacunaItem";

type Vacuna = {
  id: string;
  nombreVacuna: string;
  fechaAplicacion: Date;
  proximaDosis: Date | null;
  observaciones: string | null;
};

type Props = {
  mascotaId: string;
  estadoSalud: string | null;
  vacunaciones: Vacuna[];
};

export function VacunacionPanel({ mascotaId, estadoSalud, vacunaciones }: Props) {
  return (
    <div className="mt-3 space-y-4 border-t border-[var(--brown-light)] pt-3">
      <EstadoSaludForm mascotaId={mascotaId} estadoSalud={estadoSalud} />

      <div>
        <h3 className="text-sm font-semibold text-[var(--text-dark)]">Historial de vacunación</h3>
        {vacunaciones.length === 0 ? (
          <p className="mt-1 text-xs text-[var(--text-light)]">Todavía no registraste ninguna vacuna.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {vacunaciones.map((v) => (
              <VacunaItem
                key={v.id}
                id={v.id}
                nombreVacuna={v.nombreVacuna}
                fechaAplicacion={v.fechaAplicacion}
                proximaDosis={v.proximaDosis}
                observaciones={v.observaciones}
              />
            ))}
          </div>
        )}
        <div className="mt-3">
          <RegistrarVacunaForm mascotaId={mascotaId} />
        </div>
      </div>
    </div>
  );
}
