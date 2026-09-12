import Link from "next/link";
import { ArrowRight, ChevronDown, Search, ClipboardCheck, HeartHandshake } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HeroCTA } from "./components/HeroCTA";
import { Reveal } from "./components/Reveal";
import { Counter } from "./components/Counter";
import { ImpactTicker } from "./components/ImpactTicker";

const PASOS = [
  {
    icon: Search,
    titulo: "Explorá",
    texto: "Mirá las mascotas disponibles en protectoras de tu zona.",
  },
  {
    icon: ClipboardCheck,
    titulo: "Solicitá",
    texto: "Enviá tu solicitud de adopción con tus datos y disponibilidad.",
  },
  {
    icon: HeartHandshake,
    titulo: "Adoptá",
    texto: "La protectora revisa tu solicitud y coordina el encuentro.",
  },
];

const ESTADOS_DISPONIBLE = ["EN_PROTECTORA", "EN_TRANSITO", "EN_PROCESO"] as const;

export default async function HomePage() {
  const [mascotas, protectoras, totalDisponibles, totalAdoptadas, totalProtectoras] =
    await Promise.all([
      prisma.mascota.findMany({
        where: { estado: { in: [...ESTADOS_DISPONIBLE] } },
        orderBy: { fechaIngreso: "desc" },
        take: 4,
      }),
      prisma.protectora.findMany({ orderBy: { nombre: "asc" }, take: 2 }),
      prisma.mascota.count({ where: { estado: { in: [...ESTADOS_DISPONIBLE] } } }),
      prisma.mascota.count({ where: { estado: "ADOPTADO" } }),
      prisma.protectora.count(),
    ]);

  const STATS = [
    { value: totalDisponibles, suffix: "", label: "Esperando un hogar hoy" },
    { value: totalAdoptadas, suffix: "", label: "Ya encontraron familia" },
    { value: totalProtectoras, suffix: "", label: "Protectoras sumadas" },
  ];

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)]">
      <section className="bg-grain relative overflow-hidden bg-gradient-to-br from-[var(--brown-dark)] to-[var(--brown-darker)] px-6 pb-20 pt-28 text-center text-[var(--brown-lightest)] sm:pt-32">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[var(--gold)]/20 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[var(--brown-mid)]/25 blur-3xl animate-blob-slow" />

        <div className="relative z-10 mx-auto max-w-6xl animate-fade-in-up">
          <span className="badge-pill bg-white/10 text-[var(--brown-light)] shadow-none">
            🐾 Adopción responsable en Villa Carlos Paz
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl">
            Encontrá a tu nuevo{" "}
            <span className="text-gradient-gold">mejor amigo</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--brown-light)]">
            Happy Paws conecta protectoras de animales de la zona con familias que
            quieren adoptar de forma responsable.
          </p>
          <HeroCTA />
        </div>

        <Link
          href="#mascotas"
          className="relative z-10 mt-16 hidden items-center justify-center text-[var(--brown-light)]/70 transition-colors hover:text-[var(--brown-lightest)] sm:flex"
          aria-label="Ver mascotas"
        >
          <ChevronDown className="animate-bounce-chevron" size={28} />
        </Link>
      </section>

      <section className="relative z-10 bg-[var(--brown-lightest)] px-6 pb-4 pt-14">
        <Reveal className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-brown-light bg-white p-6 text-center shadow-[0_10px_28px_rgba(75,40,14,0.08)]"
            >
              <p className="text-3xl font-bold text-[var(--brown-dark)] sm:text-4xl">
                <Counter value={stat.value} />
              </p>
              <p className="mt-1 text-sm text-[var(--text-mid)]">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <ImpactTicker />

      <section id="mascotas" className="scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-2xl font-bold text-[var(--text-dark)] sm:text-3xl">
              Mascotas que te esperan
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {mascotas.map((mascota, i) => (
              <Reveal key={mascota.id} delay={i * 90}>
                <div className="card group overflow-hidden p-4">
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
                    {mascota.razaTexto} · {mascota.edadTexto}
                  </p>
                  <Link
                    href={`/mascotas/${mascota.id}`}
                    className="btn-dark mt-3 flex items-center justify-center gap-1.5"
                  >
                    Ver más
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--cream)] px-6 py-20">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-[var(--text-dark)] sm:text-3xl">
            ¿Cómo funciona?
          </h2>
        </Reveal>
        <div className="relative mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[var(--brown-mid)]/50 to-transparent sm:block"
          />
          {PASOS.map((paso, i) => (
            <Reveal key={paso.titulo} delay={i * 120} className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brown-main)] to-[var(--brown-dark)] text-white shadow-md ring-4 ring-[var(--cream)]">
                <paso.icon size={24} />
              </div>
              <h3 className="font-semibold text-[var(--text-dark)]">{paso.titulo}</h3>
              <p className="mt-1 text-sm text-[var(--text-mid)]">{paso.texto}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-2xl font-bold text-[var(--text-dark)] sm:text-3xl">
              Protectoras participantes
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {protectoras.map((protectora, i) => (
              <Reveal key={protectora.id} delay={i * 100}>
                <Link href={`/protectoras/${protectora.id}`} className="card flex gap-4 p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--brown-light)] bg-white text-xl">
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
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-grain relative overflow-hidden bg-gradient-to-br from-[var(--brown-dark)] to-[var(--brown-darker)] px-6 py-16 text-center text-[var(--brown-lightest)]">
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[var(--gold)]/15 blur-3xl animate-blob" />
        <Reveal className="relative z-10 mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            ¿Tenés una protectora?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[var(--brown-light)]">
            Sumate a Happy Paws y dale más visibilidad a los animales que están
            buscando una familia.
          </p>
          <Link href="/registro" className="btn-secondary mt-6 inline-flex">
            Sumar mi protectora
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
