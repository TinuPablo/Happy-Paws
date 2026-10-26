import Link from "next/link";

// Pantalla que se muestra después de registrarse: la cuenta queda creada
// pero sin activar hasta que confirme desde el mail.
export default function RevisaTuCorreo({ email, esProtectora }: { email: string; esProtectora: boolean }) {
  return (
    <div className="mt-6 rounded-2xl border border-[var(--brown-light)] bg-white p-6 text-center shadow-[0_16px_40px_rgba(75,40,14,0.10)]">
      <span className="block text-3xl">📬</span>
      <h2 className="mt-3 text-lg font-bold text-[var(--brown-dark)]">Revisá tu correo</h2>
      <p className="mt-2 text-sm text-[var(--text-mid)]">
        Te mandamos un mail a <strong className="break-all text-[var(--text-dark)]">{email}</strong> para que
        confirmes que es tuyo.
      </p>
      <p className="mt-2 text-sm text-[var(--text-mid)]">
        {esProtectora
          ? "Cuando lo confirmes, tu solicitud pasa a revisión del equipo de Happy Paws. Puede demorar hasta 72 horas hábiles y te avisamos por correo."
          : "Cuando lo confirmes, ya vas a poder iniciar sesión."}
      </p>
      <p className="mt-3 text-xs text-[var(--text-light)]">
        ¿No te llegó? Fijate en spam o promociones. El link vale por 24 horas; si se vence, iniciá sesión y te
        mandamos uno nuevo.
      </p>
      <Link href="/login" className="btn-dark mt-6 inline-flex">
        Ir a iniciar sesión
      </Link>
    </div>
  );
}
