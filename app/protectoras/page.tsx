import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/app/components/Reveal";

export default async function ProtectorasPage() {
  const protectoras = await prisma.protectora.findMany({
    include: { _count: { select: { mascotas: { where: { estado: { not: "ADOPTADO" } } } } } },
    orderBy: { nombre: "asc" },
  });

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h1 className="text-2xl font-bold text-[var(--text-dark)]">Protectoras</h1>
          <p className="mt-1 text-sm text-[var(--text-light)]">
            Organizaciones que rescatan y cuidan mascotas hasta encontrarles un hogar.
          </p>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {protectoras.map((protectora, i) => (
            <Reveal key={protectora.id} delay={Math.min(i, 8) * 70}>
              <Link href={`/protectoras/${protectora.id}`} className="card flex gap-4 p-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--brown-light)] bg-white text-2xl">
                {protectora.logoUrl ? (
                  <img src={protectora.logoUrl} alt={protectora.nombre} className="h-full w-full object-cover" />
                ) : (
                  "🏠"
                )}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--text-dark)]">{protectora.nombre}</h3>
                <p className="text-sm text-[var(--text-light)]">{protectora.ubicacion}</p>
                <p className="mt-2 text-sm text-[var(--text-mid)]">{protectora.descripcion}</p>
                <p className="mt-3 text-sm font-semibold text-[var(--brown-main)]">
                  {protectora._count.mascotas} mascotas en adopción
                </p>
              </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
