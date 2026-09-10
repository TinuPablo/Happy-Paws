import { mockProtectoras } from "@/data/mock-protectoras";

export default function ProtectorasPage() {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-[var(--text-dark)]">
          Protectoras
        </h1>
        <p className="mt-1 text-sm text-[var(--text-light)]">
          Organizaciones que rescatan y cuidan mascotas hasta encontrarles un hogar.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mockProtectoras.map((protectora) => (
            <div
              key={protectora.id}
              className="card p-5"
            >
              <h3 className="font-semibold text-[var(--text-dark)]">{protectora.nombre}</h3>
              <p className="text-sm text-[var(--text-light)]">{protectora.ubicacion}</p>
              <p className="mt-2 text-sm text-[var(--text-mid)]">{protectora.descripcion}</p>
              <p className="mt-3 text-sm font-semibold text-[var(--brown-main)]">
                {protectora.cantidadMascotas} mascotas en adopción
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
