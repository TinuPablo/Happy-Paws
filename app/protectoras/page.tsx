import { mockProtectoras } from "@/data/mock-protectoras";

export default function ProtectorasPage() {
  return (
    <main className="min-h-full bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Protectoras
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-4">
        {mockProtectoras.map((protectora) => (
          <div
            key={protectora.id}
            className="rounded-2xl border border-[var(--brown-light)] bg-white p-5"
          >
            <h3 className="font-medium text-[var(--text-dark)]">{protectora.nombre}</h3>
            <p className="text-sm text-[var(--text-light)]">{protectora.ubicacion}</p>
            <p className="mt-2 text-sm text-[var(--text-mid)]">{protectora.descripcion}</p>
            <p className="mt-3 text-sm font-medium text-[var(--brown-main)]">
              {protectora.cantidadMascotas} mascotas en adopción
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
