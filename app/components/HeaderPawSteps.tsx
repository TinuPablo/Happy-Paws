"use client";

import { SolidPawIcon } from "./SolidPawIcon";

const DELAYS_MS = [0, 220, 440, 660];

// Una tanda de 4 huellas apareciendo en secuencia (no loop continuo). El
// padre (Navbar) cambia `tick` cada ~10s y remonta este árbol con key={tick}
// para que las animaciones de CSS vuelvan a arrancar desde cero.
export function HeaderPawSteps({ tick }: { tick: number }) {
  return (
    <span
      key={tick}
      aria-hidden="true"
      className="pointer-events-none absolute left-full top-1/2 ml-2 hidden -translate-y-1/2 items-center gap-1 sm:flex"
    >
      {DELAYS_MS.map((delay, i) => (
        <span
          key={i}
          className="animate-header-paw-step opacity-0"
          style={{ animationDuration: "1.3s", animationDelay: `${delay}ms` }}
        >
          <SolidPawIcon size={16} color="black" />
        </span>
      ))}
    </span>
  );
}
