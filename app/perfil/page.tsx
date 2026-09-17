import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/app/actions/auth";
import { Reveal } from "@/app/components/Reveal";
import { PerfilAdoptante } from "./PerfilAdoptante";
import { PerfilProtectora } from "./PerfilProtectora";

export default async function PerfilPage() {
  const session = await getSession();

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--brown-lightest)] px-6 text-center">
        <div className="animate-fade-in-up mx-auto max-w-3xl">
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

  const esAdoptante = session.rol === "ADOPTANTE";
  const inicial = session.nombre.charAt(0).toUpperCase() || "?";

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Reveal className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brown-main)] to-[var(--brown-dark)] text-xl font-bold text-white">
            {inicial}
          </span>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-dark)]">Hola, {session.nombre}</h1>
            <p className="text-sm text-[var(--text-light)]">
              {esAdoptante ? "Cuenta de adoptante" : "Cuenta de protectora"}
            </p>
          </div>
        </Reveal>

        {esAdoptante ? (
          <PerfilAdoptante userId={session.userId} />
        ) : (
          <PerfilProtectora userId={session.userId} />
        )}

        <form action={logoutAction}>
          <button type="submit" className="btn-outline mt-8 w-full">
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
