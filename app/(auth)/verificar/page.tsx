import Image from "next/image";
import Link from "next/link";
import { ConfirmarEmailForm } from "./ConfirmarEmailForm";

// Destino del link "Confirmar mi correo" del mail de registro. Abrir la
// página no confirma nada: hay que tocar el botón (ver confirmarEmailAction).
export default async function VerificarPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--brown-light)]/40 to-[var(--brown-lightest)] px-6 py-10">
      <div className="animate-fade-in-up w-full max-w-sm rounded-2xl border border-[var(--brown-light)] bg-white p-8 text-center shadow-[0_16px_40px_rgba(75,40,14,0.10)]">
        <Image
          src="/assets/logo.jpg"
          alt="Happy Paws"
          width={48}
          height={48}
          className="mx-auto h-12 w-12 rounded-full bg-white object-cover"
        />
        <h1 className="mt-4 text-xl font-bold text-[var(--text-dark)]">Confirmá tu correo</h1>
        {token ? (
          <>
            <p className="mt-2 text-sm text-[var(--text-mid)]">
              Ya casi está: tocá el botón para activar tu cuenta.
            </p>
            <ConfirmarEmailForm token={token} />
          </>
        ) : (
          <>
            <p className="mt-2 text-sm font-medium text-red-600">
              Este link no es válido. Iniciá sesión y te mandamos uno nuevo.
            </p>
            <Link href="/login" className="btn-dark mt-6 inline-flex">
              Ir a iniciar sesión
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
