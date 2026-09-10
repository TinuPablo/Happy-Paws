"use client";

import { Search, ClipboardCheck, HeartHandshake } from "lucide-react";
import { mockMascotas } from "@/data/mock-mascotas";
import { mockProtectoras } from "@/data/mock-protectoras";
import { useAuth } from "@/app/context/AuthContext";

const PASOS = [
  {
    icon: Search,
    texto: "Explorá mascotas disponibles en protectoras de tu zona.",
  },
  {
    icon: ClipboardCheck,
    texto: "Enviá tu solicitud de adopción con tus datos y disponibilidad.",
  },
  {
    icon: HeartHandshake,
    texto: "La protectora revisa tu solicitud y coordina el encuentro.",
  },
];

export default function HomePage() {
  const { loggedIn } = useAuth();

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--brown-dark)] to-[var(--brown-darker)] px-6 py-20 text-center text-[var(--brown-lightest)]">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[var(--gold)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[var(--brown-mid)]/25 blur-3xl" />

        <div className="relative mx-auto max-w-6xl animate-fade-in-up">
          <span className="badge-pill bg-white/10 text-[var(--brown-light)] shadow-none">
            🐾 Adopción responsable en Villa Carlos Paz
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
            Encontrá a tu nuevo{" "}
            <span className="text-[var(--gold)]">mejor amigo</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--brown-light)]">
            Happy Paws conecta protectoras de animales de la zona con familias que
            quieren adoptar de forma responsable.
          </p>
          {!loggedIn && (
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="/mascotas" className="btn-primary">
                Quiero adoptar 🐶
              </a>
              <a href="/registro" className="btn-secondary">
                Soy una protectora
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-[var(--text-dark)]">
            Mascotas que te esperan
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockMascotas.map((mascota) => (
              <div
                key={mascota.id}
                className="card group overflow-hidden p-4"
              >
                <div className="relative mb-3 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-[var(--brown-light)] text-4xl">
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {mascota.especie === "PERRO" ? "🐶" : "🐱"}
                  </span>
                  <span className="badge-pill absolute left-2 top-2">
                    {mascota.especie === "PERRO" ? "Perro" : "Gato"}
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--text-dark)]">{mascota.nombre}</h3>
                <p className="text-sm text-[var(--text-light)]">
                  {mascota.raza} · {mascota.edadAproximada}
                </p>
                <a href={`/mascotas/${mascota.id}`} className="btn-dark mt-3 block">
                  Ver más
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--cream)] px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-[var(--text-dark)]">
          ¿Cómo funciona?
        </h2>
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          {PASOS.map((paso, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brown-main)] to-[var(--brown-dark)] text-white shadow-md">
                <paso.icon size={24} />
              </div>
              <p className="text-sm text-[var(--text-mid)]">{paso.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-[var(--text-dark)]">
            Protectoras participantes
          </h2>
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
      </section>
    </main>
  );
}
