import { prisma } from "@/lib/prisma";
import { Reveal } from "@/app/components/Reveal";

export default async function ProtectoraDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const protectora = await prisma.protectora.findUnique({
    where: { id },
    include: { _count: { select: { mascotas: { where: { estado: { not: "ADOPTADO" } } } } } },
  });

  if (!protectora) {
    return (
      <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
        <p className="text-[var(--text-mid)]">Protectora no encontrada</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <Reveal className="mx-auto flex max-w-4xl gap-5 rounded-2xl border border-[var(--brown-light)] bg-white p-6 shadow-sm">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--brown-light)] bg-white text-3xl">
          {protectora.logoUrl ? (
            <img src={protectora.logoUrl} alt={protectora.nombre} className="h-full w-full object-cover" />
          ) : (
            "🏠"
          )}
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[var(--text-dark)]">{protectora.nombre}</h1>
          <p className="text-sm text-[var(--text-light)]">{protectora.ubicacion}</p>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            {protectora.descripcion || "Todavía no cargó una descripción pública."}
          </p>
          <p className="mt-3 text-sm font-semibold text-[var(--brown-main)]">
            {protectora._count.mascotas} mascotas en adopción
          </p>
        </div>
      </Reveal>
    </main>
  );
}
