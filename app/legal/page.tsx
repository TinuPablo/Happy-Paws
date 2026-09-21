import Link from "next/link";
import { Reveal } from "@/app/components/Reveal";

// Texto estándar de "derechos reservados" — no es un texto legal redactado
// por un abogado ni revisado por el dueño real del proyecto. Sirve como
// placeholder razonable ("como en cualquier app") hasta que se redacte el
// contenido legal definitivo (ver backlog de AGENTS.md: "Página de
// términos/privacidad reales" sigue pendiente por el mismo motivo).
export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <Link href="/perfil" className="text-sm font-semibold text-[var(--brown-main)] hover:text-[var(--brown-dark)]">
            ← Volver a mi perfil
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-[var(--text-dark)]">Derechos de autor</h1>
          <p className="mt-1 text-sm text-[var(--text-mid)]">© {new Date().getFullYear()} Happy Paws. Todos los derechos reservados.</p>
        </Reveal>

        <div className="mt-6 space-y-5">
          <Reveal delay={60} className="card p-5">
            <h2 className="font-semibold text-[var(--text-dark)]">Propiedad intelectual</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-mid)]">
              El código fuente, la marca "Happy Paws", los diseños visuales y los contenidos de esta plataforma
              son propiedad de sus autores. Queda prohibida su reproducción, distribución o modificación total
              o parcial sin autorización expresa.
            </p>
          </Reveal>

          <Reveal delay={120} className="card p-5">
            <h2 className="font-semibold text-[var(--text-dark)]">Uso de la plataforma</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-mid)]">
              Happy Paws conecta protectoras de animales con familias adoptantes. Los datos que cargás
              (perfil, mascotas, solicitudes) se almacenan en la base de datos de la plataforma y se usan
              únicamente para su funcionamiento. Nos reservamos el derecho de actualizar estos términos a
              medida que la plataforma evolucione.
            </p>
          </Reveal>

          <Reveal delay={180} className="card p-5">
            <h2 className="font-semibold text-[var(--text-dark)]">Marcas y contenido de terceros</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-mid)]">
              Los nombres, fotos y datos de las protectoras y mascotas publicados pertenecen a quienes los
              cargaron. Al publicar contenido, la protectora declara contar con los derechos necesarios para
              hacerlo.
            </p>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
