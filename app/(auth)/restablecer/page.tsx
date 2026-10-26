"use client";

import { Suspense, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { restablecerContrasenaAction } from "@/app/actions/auth";
import PasswordConfirmFields from "@/app/components/PasswordConfirmFields";

export default function RestablecerPage() {
  return (
    <Suspense fallback={null}>
      <RestablecerForm />
    </Suspense>
  );
}

function RestablecerForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, formAction, pending] = useActionState(restablecerContrasenaAction, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--brown-light)]/40 to-[var(--brown-lightest)] px-6 py-10">
      <form
        action={formAction}
        className="animate-fade-in-up w-full max-w-sm rounded-2xl border border-[var(--brown-light)] bg-white p-8 shadow-[0_16px_40px_rgba(75,40,14,0.10)]"
      >
        <Image
          src="/assets/logo.jpg"
          alt="Happy Paws"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full bg-white object-cover"
        />
        <h1 className="mt-4 text-xl font-bold text-[var(--text-dark)]">
          Elegí tu nueva contraseña
        </h1>

        <input type="hidden" name="token" value={token} />

        {!token ? (
          <p className="mt-4 text-sm font-medium text-red-600">
            Este link no es válido. Pedí uno nuevo desde{" "}
            <Link href="/recuperar" className="underline">
              recuperar contraseña
            </Link>
            .
          </p>
        ) : (
          <>
            <div className="mt-2">
              <PasswordConfirmFields label="Nueva contraseña" />
            </div>

            {state?.error && <p className="mt-4 text-sm font-medium text-red-600">{state.error}</p>}

            <button type="submit" disabled={pending} className="btn-dark mt-6 w-full disabled:opacity-60">
              {pending ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </>
        )}
      </form>
    </main>
  );
}
