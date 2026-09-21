import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AceptarInvitacionForm } from "./AceptarInvitacionForm";

export default async function InvitacionPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const invitacion = token
    ? await prisma.invitacionProtectora.findUnique({
        where: { token },
        include: { protectora: true },
      })
    : null;

  const valida = Boolean(invitacion) && !invitacion!.usedAt && invitacion!.expiresAt > new Date();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--brown-light)]/40 to-[var(--brown-lightest)] px-6 py-10">
      <div className="animate-fade-in-up w-full max-w-sm rounded-2xl border border-[var(--brown-light)] bg-white p-8 shadow-[0_16px_40px_rgba(75,40,14,0.10)]">
        <Image
          src="/assets/logo.jpg"
          alt="Happy Paws"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full bg-white object-cover"
        />

        {!valida ? (
          <>
            <h1 className="mt-4 text-xl font-bold text-[var(--text-dark)]">
              Invitación no válida
            </h1>
            <p className="mt-2 text-sm text-[var(--text-mid)]">
              Este link ya no es válido o venció. Pedile a la protectora que te mande una invitación nueva.
            </p>
            <Link href="/login" className="btn-dark mt-6 inline-flex">
              Ir al login
            </Link>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-xl font-bold text-[var(--text-dark)]">
              Te invitaron a {invitacion!.protectora.nombre}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-light)]">
              Como {invitacion!.rol === "COLABORADOR" ? "colaborador/a" : "hogar de tránsito"}.
              Elegí tu nombre y contraseña para crear tu cuenta.
            </p>
            <AceptarInvitacionForm token={token!} />
          </>
        )}
      </div>
    </main>
  );
}
