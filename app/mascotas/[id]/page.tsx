"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useMascotas } from "@/app/context/MascotasContext";
import { useSolicitudes } from "@/app/context/SolicitudesContext";

export default function MascotaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { mascotas } = useMascotas();
  const mascota = mascotas.find((m) => m.id === id);
  const { loggedIn, role, nombre } = useAuth();
  const { addSolicitud } = useSolicitudes();
  const router = useRouter();

  function handleAdoptar() {
    if (!loggedIn) {
      router.push(`/login?redirect=/mascotas/${id}`);
      return;
    }
    if (!mascota) return;
    addSolicitud({
      mascotaId: mascota.id,
      mascotaNombre: mascota.nombre,
      adoptanteNombre: nombre,
    });
    alert(`Solicitud enviada para adoptar a ${mascota.nombre}`);
  }

  if (!mascota) {
    return (
      <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
        <p className="text-[var(--text-mid)]">Mascota no encontrada</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-[var(--brown-light)] bg-white p-4 shadow-sm lg:grid-cols-2 lg:p-6">
          <div className="relative">
            {mascota.mediaUrl && mascota.mediaType === "image" ? (
              <img
                src={mascota.mediaUrl}
                alt={mascota.nombre}
                className="h-64 w-full rounded-xl object-cover lg:h-full"
              />
            ) : mascota.mediaUrl && mascota.mediaType === "video" ? (
              <video
                src={mascota.mediaUrl}
                controls
                className="h-64 w-full rounded-xl object-cover lg:h-full"
              />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl bg-[var(--brown-light)] text-6xl lg:h-full">
                {mascota.especie === "PERRO" ? "🐶" : "🐱"}
              </div>
            )}
            <span className="badge-pill absolute left-3 top-3">
              {mascota.especie === "PERRO" ? "Perro" : "Gato"}
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[var(--text-dark)]">{mascota.nombre}</h1>
            <p className="text-sm text-[var(--text-light)]">
              {mascota.raza} · {mascota.edadAproximada} · {mascota.tamanio}
            </p>
            <p className="mt-3 text-sm text-[var(--text-mid)]">{mascota.descripcion}</p>

            {role !== "protectora" && (
              <button onClick={handleAdoptar} className="btn-primary mt-6 w-full">
                Quiero adoptar a {mascota.nombre} 🐾
              </button>
            )}
          </div>
        </div>

        {mascota.vacunas && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-[var(--text-dark)]">
              Libreta de vacunación
            </h2>
            <div className="mt-4 space-y-3">
              {mascota.vacunas?.map((vacuna, i) => (
                <div
                  key={i}
                  className="card flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-[var(--text-dark)]">{vacuna.nombre}</p>
                    <p className="text-sm text-[var(--text-light)]">{vacuna.fecha}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      vacuna.estado === "APLICADA"
                        ? "bg-[var(--green-ok)] text-white"
                        : "bg-[var(--gold)] text-[var(--brown-darker)]"
                    }`}
                  >
                    {vacuna.estado === "APLICADA" ? "Aplicada" : "Pendiente"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
