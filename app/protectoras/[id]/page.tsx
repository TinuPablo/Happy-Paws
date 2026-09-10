import { mockProtectoras } from "@/data/mock-protectoras";

export default async function ProtectoraDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const protectora = mockProtectoras.find((p) => p.id === id);

  if (!protectora) {
    return (
      <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
        <p className="text-[var(--text-mid)]">Protectora no encontrada</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--brown-light)] bg-white p-5">
        <h1 className="text-2xl font-medium text-[var(--text-dark)]">{protectora.nombre}</h1>
        <p className="text-sm text-[var(--text-light)]">{protectora.ubicacion}</p>
        <p className="mt-2 text-sm text-[var(--text-mid)]">{protectora.descripcion}</p>
        <p className="mt-3 text-sm font-medium text-[var(--brown-main)]">
          {protectora.cantidadMascotas} mascotas en adopción
        </p>
      </div>
    </main>
  );
}
