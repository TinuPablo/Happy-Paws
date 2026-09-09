"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useMascotas } from "@/app/context/MascotasContext";
import { useSolicitudes } from "@/app/context/SolicitudesContext";
import type { MascotaMock } from "@/data/mock-mascotas";

function badgeClasses(estado: "PENDIENTE" | "APROBADA" | "RECHAZADA") {
  if (estado === "APROBADA") return "bg-[var(--green-ok)] text-white";
  if (estado === "PENDIENTE") return "bg-[var(--gold)] text-[var(--brown-darker)]";
  return "border border-red-300 text-[var(--text-mid)]";
}

function badgeLabel(estado: "PENDIENTE" | "APROBADA" | "RECHAZADA") {
  if (estado === "APROBADA") return "Aprobada";
  if (estado === "PENDIENTE") return "Pendiente";
  return "Rechazada";
}

export default function PerfilPage() {
  const { loggedIn, role, nombre, logout } = useAuth();
  const { mascotas, addMascota } = useMascotas();
  const { solicitudes, actualizarEstado } = useSolicitudes();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreMascota, setNombreMascota] = useState("");
  const [especie, setEspecie] = useState<MascotaMock["especie"]>("PERRO");
  const [raza, setRaza] = useState("");
  const [edadAproximada, setEdadAproximada] = useState("");
  const [tamanio, setTamanio] = useState<MascotaMock["tamanio"]>("MEDIANO");
  const [descripcion, setDescripcion] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
  const [mediaType, setMediaType] = useState<"image" | "video" | undefined>(undefined);

  function handleAgregarMascota(e: React.FormEvent) {
    e.preventDefault();
    addMascota({ nombre: nombreMascota, especie, raza, edadAproximada, tamanio, descripcion, mediaUrl, mediaType });
    setNombreMascota("");
    setEspecie("PERRO");
    setRaza("");
    setEdadAproximada("");
    setTamanio("MEDIANO");
    setDescripcion("");
    setMediaUrl(undefined);
    setMediaType(undefined);
    setMostrarFormulario(false);
  }

  if (!loggedIn) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center bg-[var(--brown-lightest)] px-6 text-center">
        <h1 className="text-xl font-medium text-[var(--text-dark)]">
          Todavía no iniciaste sesión
        </h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          Iniciá sesión para ver tu perfil.
        </p>
        <Link
          href="/login"
          className="mt-6 rounded-xl bg-[var(--brown-dark)] px-6 py-3 font-medium text-[var(--brown-lightest)]"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  const misSolicitudes = solicitudes.filter((s) => s.adoptanteNombre === nombre);

  return (
    <main className="min-h-full bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-xl font-medium text-[var(--text-dark)]">
        Hola, {nombre}
      </h1>
      <p className="mt-1 text-sm text-[var(--text-light)]">
        {role === "adoptante" ? "Cuenta de adoptante" : "Cuenta de protectora"}
      </p>

      {role === "adoptante" && (
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-[var(--brown-light)] bg-white p-4">
            <h2 className="font-medium text-[var(--text-dark)]">
              Mis solicitudes de adopción
            </h2>
            {misSolicitudes.length === 0 ? (
              <p className="mt-1 text-sm text-[var(--text-mid)]">
                Todavía no enviaste ninguna solicitud.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {misSolicitudes.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-[var(--brown-light)] p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--text-dark)]">{s.mascotaNombre}</p>
                      <p className="text-xs text-[var(--text-light)]">{s.fecha}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses(s.estado)}`}>
                      {badgeLabel(s.estado)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-[var(--brown-light)] bg-white p-4">
            <h2 className="font-medium text-[var(--text-dark)]">
              Explorar mascotas
            </h2>
            <Link
              href="/mascotas"
              className="mt-2 inline-block text-sm font-medium text-[var(--brown-main)]"
            >
              Ver mascotas en adopción →
            </Link>
          </div>
        </div>
      )}

      {role === "protectora" && (
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-[var(--brown-light)] bg-white p-4">
            <h2 className="font-medium text-[var(--text-dark)]">
              Mis mascotas publicadas
            </h2>
            <p className="mt-1 text-sm text-[var(--text-mid)]">
              {mascotas.length} {mascotas.length === 1 ? "mascota publicada" : "mascotas publicadas"}.
            </p>
            <button
              type="button"
              onClick={() => setMostrarFormulario((v) => !v)}
              className="mt-3 text-sm font-medium text-[var(--brown-main)]"
            >
              {mostrarFormulario ? "Cancelar" : "+ Agregar mascota"}
            </button>

            {mostrarFormulario && (
              <form
                onSubmit={handleAgregarMascota}
                className="mt-4 space-y-3 border-t border-[var(--brown-light)] pt-4"
              >
                <label className="block text-sm text-[var(--text-mid)]">
                  Nombre
                  <input
                    type="text"
                    required
                    value={nombreMascota}
                    onChange={(e) => setNombreMascota(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
                  />
                </label>
                <label className="block text-sm text-[var(--text-mid)]">
                  Especie
                  <select
                    value={especie}
                    onChange={(e) => setEspecie(e.target.value as MascotaMock["especie"])}
                    className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
                  >
                    <option value="PERRO">Perro</option>
                    <option value="GATO">Gato</option>
                  </select>
                </label>
                <label className="block text-sm text-[var(--text-mid)]">
                  Raza
                  <input
                    type="text"
                    required
                    value={raza}
                    onChange={(e) => setRaza(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
                  />
                </label>
                <label className="block text-sm text-[var(--text-mid)]">
                  Edad aproximada
                  <input
                    type="text"
                    required
                    placeholder="Ej: 2 años"
                    value={edadAproximada}
                    onChange={(e) => setEdadAproximada(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
                  />
                </label>
                <label className="block text-sm text-[var(--text-mid)]">
                  Tamaño
                  <select
                    value={tamanio}
                    onChange={(e) => setTamanio(e.target.value as MascotaMock["tamanio"])}
                    className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
                  >
                    <option value="PEQUEÑO">Pequeño</option>
                    <option value="MEDIANO">Mediano</option>
                    <option value="GRANDE">Grande</option>
                  </select>
                </label>
                <label className="block text-sm text-[var(--text-mid)]">
                  Descripción
                  <textarea
                    required
                    rows={3}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--brown-light)] px-3 py-2 text-[var(--text-dark)]"
                  />
                </label>
                <label className="block text-sm text-[var(--text-mid)]">
                  Foto o video (opcional)
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      const tipo = file.type.startsWith("video/") ? "video" : "image";
                      setMediaUrl(url);
                      setMediaType(tipo);
                    }}
                    className="mt-1 w-full text-sm text-[var(--text-mid)]"
                  />
                </label>

                {mediaUrl && mediaType === "image" && (
                  <img
                    src={mediaUrl}
                    alt="Vista previa"
                    className="mt-3 h-32 w-full rounded-xl object-cover"
                  />
                )}
                {mediaUrl && mediaType === "video" && (
                  <video
                    src={mediaUrl}
                    controls
                    className="mt-3 h-32 w-full rounded-xl object-cover"
                  />
                )}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[var(--brown-dark)] px-4 py-2 text-sm font-medium text-[var(--brown-lightest)]"
                >
                  Publicar mascota
                </button>
              </form>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--brown-light)] bg-white p-4">
            <h2 className="font-medium text-[var(--text-dark)]">
              Solicitudes recibidas
            </h2>
            {solicitudes.length === 0 ? (
              <p className="mt-1 text-sm text-[var(--text-mid)]">
                Todavía no recibiste solicitudes de adopción.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {solicitudes.map((s) => (
                  <div key={s.id} className="rounded-xl border border-[var(--brown-light)] p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--text-dark)]">{s.mascotaNombre}</p>
                        <p className="text-xs text-[var(--text-light)]">{s.adoptanteNombre} · {s.fecha}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses(s.estado)}`}>
                        {badgeLabel(s.estado)}
                      </span>
                    </div>
                    {s.estado === "PENDIENTE" && (
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => actualizarEstado(s.id, "APROBADA")}
                          className="flex-1 rounded-lg bg-[var(--green-ok)] px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Aprobar
                        </button>
                        <button
                          type="button"
                          onClick={() => actualizarEstado(s.id, "RECHAZADA")}
                          className="flex-1 rounded-lg border border-[var(--brown-light)] px-3 py-1.5 text-xs font-medium text-[var(--text-mid)]"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--brown-light)] bg-white p-4">
            <h2 className="font-medium text-[var(--text-dark)]">
              Datos de la protectora
            </h2>
            <p className="mt-1 text-sm text-[var(--text-mid)]">
              Ubicación, contacto y descripción pública.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={logout}
        className="mt-8 w-full rounded-xl border border-[var(--brown-light)] px-4 py-2 text-sm font-medium text-[var(--text-mid)]"
      >
        Cerrar sesión
      </button>
    </main>
  );
}
