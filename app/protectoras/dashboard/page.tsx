import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Reveal } from "@/app/components/Reveal";
import { Counter } from "@/app/components/Counter";

// Vista de solo lectura del lado protectora. Mismo criterio de seguridad
// que app/protectoras/historial/page.tsx: sin ningún id de protectora en
// la URL, siempre sale de la sesión.
export default async function DashboardMetricasPage() {
  const session = await getSession();

  if (!session || session.rol === "ADOPTANTE") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--brown-lightest)] px-6 text-center">
        <div className="mx-auto max-w-md">
          <h1 className="text-xl font-bold text-[var(--text-dark)]">Sección solo para protectoras</h1>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            Iniciá sesión con una cuenta de protectora para ver este dashboard.
          </p>
          <Link href="/login" className="btn-dark mt-6 inline-flex">
            Iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  const protectora = await prisma.protectora.findFirst({ where: { duenioId: session.userId } });

  if (!protectora) {
    return (
      <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10 text-center">
        <p className="text-sm text-[var(--text-mid)]">No se encontró una protectora asociada a esta cuenta.</p>
      </main>
    );
  }

  const hace30dias = new Date();
  hace30dias.setDate(hace30dias.getDate() - 30);

  const [mascotasActivas, solicitudesPendientes, adopcionesTotal, adopcionesUltimos30] = await Promise.all([
    prisma.mascota.count({ where: { protectoraId: protectora.id, activo: true } }),
    prisma.solicitudAdopcion.count({
      where: { mascota: { protectoraId: protectora.id }, estado: { notIn: ["APROBADA", "RECHAZADA"] } },
    }),
    prisma.solicitudAdopcion.count({
      where: { mascota: { protectoraId: protectora.id }, estado: "APROBADA" },
    }),
    prisma.solicitudAdopcion.count({
      where: {
        mascota: { protectoraId: protectora.id },
        estado: "APROBADA",
        updatedAt: { gte: hace30dias },
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <Link href="/perfil" className="text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]">
            ← Volver a mi perfil
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-[var(--text-dark)]">Dashboard de {protectora.nombre}</h1>
          <p className="mt-1 text-sm text-[var(--text-mid)]">Un vistazo general a tu actividad en Happy Paws.</p>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Reveal className="card p-5 text-center">
            <p className="text-3xl font-bold text-[var(--text-dark)]">
              <Counter value={mascotasActivas} />
            </p>
            <p className="mt-1 text-sm text-[var(--text-light)]">Mascotas activas</p>
          </Reveal>
          <Reveal delay={60} className="card p-5 text-center">
            <p className="text-3xl font-bold text-[var(--gold)]">
              <Counter value={solicitudesPendientes} />
            </p>
            <p className="mt-1 text-sm text-[var(--text-light)]">Solicitudes pendientes</p>
          </Reveal>
          <Reveal delay={120} className="card p-5 text-center">
            <p className="text-3xl font-bold text-[var(--green-ok)]">
              <Counter value={adopcionesTotal} />
            </p>
            <p className="mt-1 text-sm text-[var(--text-light)]">Adopciones concretadas</p>
            <p className="mt-2 text-xs text-[var(--text-mid)]">{adopcionesUltimos30} en los últimos 30 días</p>
          </Reveal>
        </div>

        <Link
          href="/protectoras/historial"
          className="mt-6 block text-center text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
        >
          Ver historial completo de adopciones →
        </Link>
      </div>
    </main>
  );
}
