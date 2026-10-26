"use client";

import { useActionState } from "react";
import Link from "next/link";
import { confirmarEmailAction } from "@/app/actions/auth";

export function ConfirmarEmailForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(confirmarEmailAction, null);

  if (state?.error) {
    return (
      <>
        <p className="mt-4 text-sm font-medium text-red-600">{state.error}</p>
        <Link href="/login" className="btn-dark mt-6 inline-flex">
          Ir a iniciar sesión
        </Link>
      </>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />
      <button type="submit" disabled={pending} className="btn-dark mt-6 w-full disabled:opacity-60">
        {pending ? "Confirmando..." : "Confirmar mi correo"}
      </button>
    </form>
  );
}
