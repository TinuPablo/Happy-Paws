import { prisma } from "@/lib/prisma";
import { protectoraIdDeUsuario } from "@/lib/protectora";
import { LogoProtectoraForm } from "./LogoProtectoraForm";
import { EditarDatosProtectoraForm } from "./EditarDatosProtectoraForm";
import { Reveal } from "@/app/components/Reveal";

// Vista de perfil para cuentas de protectora (ADMIN_PROTECTORA/COLABORADOR/
// HOGAR_TRANSITO). Solo edición de cuenta — foto, mail, "acerca de" — como
// el perfil de cualquier app. Todo lo operativo (mascotas, solicitudes,
// vacunación, notificaciones, equipo) se movió a /adopciones.
export async function PerfilProtectora({ userId }: { userId: string }) {
  const protectoraId = await protectoraIdDeUsuario(userId);

  const protectora = protectoraId
    ? await prisma.protectora.findUnique({ where: { id: protectoraId } })
    : null;

  // Un colaborador/hogar de tránsito puede ver estos datos pero no
  // editarlos — las server actions detrás (protectoras.ts) verifican
  // duenioId, así que esto no es solo cosmético.
  const esAdmin = protectora?.duenioId === userId;

  return (
    <div className="mt-6 space-y-3">
      <Reveal className="card p-4">
        <h2 className="font-semibold text-[var(--text-dark)]">Foto de perfil</h2>
        {esAdmin ? (
          <LogoProtectoraForm logoActualUrl={protectora?.logoUrl ?? null} />
        ) : (
          <p className="mt-1 text-sm text-[var(--text-mid)]">Solo el dueño de la cuenta puede cambiar el logo.</p>
        )}
      </Reveal>

      <Reveal delay={60} className="card p-4">
        <h2 className="font-semibold text-[var(--text-dark)]">Correo electrónico</h2>
        <p className="mt-1 text-sm text-[var(--text-mid)]">{protectora?.email ?? "Sin cargar"}</p>
      </Reveal>

      <Reveal delay={120} className="card p-4">
        <h2 className="font-semibold text-[var(--text-dark)]">Acerca de</h2>
        <p className="mt-1 text-sm text-[var(--text-mid)]">
          {protectora?.ubicacion}
          {protectora?.telefono ? ` · ${protectora.telefono}` : ""}
        </p>
        {protectora?.descripcion && (
          <p className="mt-1 text-sm text-[var(--text-light)]">{protectora.descripcion}</p>
        )}
        {esAdmin && protectora && (
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
