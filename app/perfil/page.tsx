"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--brown-lightest)] px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <Image
            src="/assets/logo.jpg"
            alt="Happy Paws"
            width={56}
            height={56}
            className="mx-auto h-14 w-14 rounded-full bg-white object-cover"
          />
          <h1 className="mt-4 text-xl font-bold text-[var(--text-dark)]">
            Todavía no iniciaste sesión
          </h1>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            Iniciá sesión para ver tu perfil.
          </p>
          <Link href="/login" className="btn-dark mt-6 inline-flex">
            Iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  const misSolicitudes = solicitudes.filter((s) => s.adoptanteNombre === nombre);
  const inicial = nombre?.charAt(0).toUpperCase() || "?";

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brown-main)] to-[var(--brown-dark)] text-xl font-bold text-white">
            {inicial}
          </span>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-dark)]">
              Hola, {nombre}
            </h1>
            <p className="text-sm text-[var(--text-light)]">
              {role === "adoptante" ? "Cuenta de adoptante" : "Cuenta de protectora"}
            </p>
          </div>
        </div>

        {role === "adoptante" && (
          <div className="mt-6 space-y-3">
            <div className="card p-4">
              <h2 className="font-semibold text-[var(--text-dark)]">
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
                      className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-light)] p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--text-dark)]">{s.mascotaNombre}</p>
                        <p className="text-xs text-[var(--text-light)]">{s.fecha}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badgeClasses(s.estado)}`}>
                        {badgeLabel(s.estado)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card p-4">
              <h2 className="font-semibold text-[var(--text-dark)]">
                Explorar mascotas
              </h2>
              <Link
                href="/mascotas"
                className="mt-2 inline-block text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
              >
                Ver mascotas en adopción →
              </Link>
            </div>
          </div>
        )}

        {role === "protectora" && (
          <div className="mt-6 space-y-3">
            <div className="card p-4">
              <h2 className="font-semibold text-[var(--text-dark)]">
                Mis mascotas publicadas
              </h2>
              <p className="mt-1 text-sm text-[var(--text-mid)]">
                {mascotas.length} {mascotas.length === 1 ? "mascota publicada" : "mascotas publicadas"}.
              </p>
              <button
                type="button"
                onClick={() => setMostrarFormulario((v) => !v)}
                className="mt-3 text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]"
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
                      className="input"
                    />
                  </label>
                  <label className="block text-sm text-[var(--text-mid)]">
                    Especie
                    <select
                      value={especie}
                      onChange={(e) => setEspecie(e.target.value as MascotaMock["especie"])}
                      className="input"
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
                      className="input"
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
                      className="input"
                    />
                  </label>
                  <label className="block text-sm text-[var(--text-mid)]">
                    Tamaño
                    <select
                      value={tamanio}
                      onChange={(e) => setTamanio(e.target.value as MascotaMock["tamanio"])}
                      className="input"
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
                      className="input"
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
                  <button type="submit" className="btn-dark w-full">
                    Publicar mascota
                  </button>
                </form>
              )}
            </div>

            <div className="card p-4">
              <h2 className="font-semibold text-[var(--text-dark)]">
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
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[var(--text-dark)]">{s.mascotaNombre}</p>
                          <p className="truncate text-xs text-[var(--text-light)]">{s.adoptanteNombre} · {s.fecha}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badgeClasses(s.estado)}`}>
                          {badgeLabel(s.estado)}
                        </span>
                      </div>
                      {s.estado === "PENDIENTE" && (
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => actualizarEstado(s.id, "APROBADA")}
                            className="flex-1 rounded-lg bg-[var(--green-ok)] px-3 py-1.5 text-xs font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5"
                          >
                            Aprobar
                          </button>
                          <button
                            type="button"
                            onClick={() => actualizarEstado(s.id, "RECHAZADA")}
                            className="flex-1 rounded-lg border border-[var(--brown-light)] px-3 py-1.5 text-xs font-semibold text-[var(--text-mid)] transition-colors duration-150 hover:bg-[var(--brown-lightest)]"
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

            <div className="card p-4">
              <h2 className="font-semibold text-[var(--text-dark)]">
                Datos de la protectora
              </h2>
              <p className="mt-1 text-sm text-[var(--text-mid)]">
                Ubicación, contacto y descripción pública.
              </p>
            </div>
          </div>
        )}

        <button onClick={logout} className="btn-outline mt-8 w-full">
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
