"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

// Se muestra en el header solo para cuentas de protectora (ver Navbar). Sin
// infraestructura de tiempo real todavía (websockets/polling), "cuando llega
// una notificación nueva" se interpreta como: mientras haya alguna sin leer,
// la campana brilla y hace el shake+ondas una vez al cargar la página; el
// resto del tiempo queda con el brillo dorado fijo como recordatorio sutil.
export function NotificationBell({ noLeidas }: { noLeidas: number }) {
  const hayNuevas = noLeidas > 0;

  return (
    <Link href="/perfil" aria-label="Notificaciones" className="relative inline-flex shrink-0 items-center">
      {hayNuevas && (
        <>
          <span className="animate-bell-ring-wave absolute inset-0 -z-10 rounded-full border border-[var(--gold)]" />
          <span
            className="animate-bell-ring-wave absolute inset-0 -z-10 rounded-full border border-[var(--gold)]"
            style={{ animationDelay: "0.5s" }}
          />
        </>
      )}
      <Bell
        size={20}
        className={hayNuevas ? "animate-bell-glow-shake text-[var(--gold)]" : "opacity-80"}
        style={hayNuevas ? { filter: "drop-shadow(0 0 5px var(--gold))" } : undefined}
      />
      {hayNuevas && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)] text-[9px] font-bold text-[var(--brown-darker)]">
          {noLeidas > 9 ? "9+" : noLeidas}
        </span>
      )}
    </Link>
  );
}
