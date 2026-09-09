"use client";

import { mockMascotas } from "@/data/mock-mascotas";
import { mockProtectoras } from "@/data/mock-protectoras";
import { useAuth } from "@/app/context/AuthContext";

export default function HomePage() {
  const { loggedIn } = useAuth();

  return (
    <main className="min-h-full bg-[var(--brown-lightest)]">
      <section className="bg-[var(--brown-dark)] px-6 py-16 text-center text-[var(--brown-lightest)]">
        <h1 className="text-3xl font-medium">
          Encontrá a tu nuevo mejor amigo
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[var(--brown-light)]">
          Happy Paws conecta protectoras de animales de la zona con familias que
          quieren adoptar de forma responsable.
        </p>
        {!loggedIn && (
          <div className="mt-8 flex flex-col justify-center gap-3">
            <a
              href="/mascotas"
              className="rounded-2xl bg-[var(--gold)] px-6 py-3 font-medium text-[var(--brown-darker)]"
            >
              Quiero adoptar
            </a>
            <a
              href="/registro"
              className="rounded-2xl border border-[var(--brown-light)] px-6 py-3 font-medium text-[var(--brown-lightest)]"
            >
              Soy una protectora
            </a>
          </div>
        )}
      </section>

      <section className="px-6 py-14">
        <h2 className="text-2xl font-medium text-[var(--text-dark)]">
          Mascotas que te esperan
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4">
          {mockMascotas.map((mascota) => (
            <div
              key={mascota.id}
              className="rounded-2xl border border-[var(--brown-light)] bg-white p-4"
            >
              <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-[var(--brown-light)] text-4xl">
                {mascota.especie === "PERRO" ? "🐶" : "🐱"}
              </div>
              <h3 className="font-medium text-[var(--text-dark)]">{mascota.nombre}</h3>
              <p className="text-sm text-[var(--text-light)]">
                {mascota.raza} · {mascota.edadAproximada}
              </p>
              <a
                href={`/mascotas/${mascota.id}`}
                className="mt-3 block rounded-xl bg-[var(--brown-dark)] px-4 py-2 text-center text-sm font-medium text-[var(--brown-lightest)]"
              >
                Ver más
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--cream)] px-6 py-14">
        <h2 className="text-center text-2xl font-medium text-[var(--text-dark)]">
          ¿Cómo funciona?
        </h2>
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brown-main)] text-lg font-medium text-white">
              1
            </div>
            <p className="text-sm text-[var(--text-mid)]">
              Explorá mascotas disponibles en protectoras de tu zona.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brown-main)] text-lg font-medium text-white">
              2
            </div>
            <p className="text-sm text-[var(--text-mid)]">
              Enviá tu solicitud de adopción con tus datos y disponibilidad.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brown-main)] text-lg font-medium text-white">
              3
            </div>
            <p className="text-sm text-[var(--text-mid)]">
              La protectora revisa tu solicitud y coordina el encuentro.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <h2 className="text-2xl font-medium text-[var(--text-dark)]">
          Protectoras participantes
        </h2>
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
      </section>
    </main>
  );
}
