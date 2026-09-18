"use client";

const DELAYS_MS = [0, 220, 440, 660];

// Huella sólida (almohadilla + 4 dedos), todo relleno negro — no es un
// ícono de lucide-react: esos son de trazo (stroke), no de relleno.
function SolidPawIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="black" aria-hidden="true">
      <ellipse cx="12" cy="17" rx="6" ry="5" />
      <ellipse cx="5" cy="9" rx="2.3" ry="3" transform="rotate(-20 5 9)" />
      <ellipse cx="10" cy="4.5" rx="2.3" ry="3" transform="rotate(-8 10 4.5)" />
      <ellipse cx="15" cy="4.5" rx="2.3" ry="3" transform="rotate(8 15 4.5)" />
      <ellipse cx="19.5" cy="9" rx="2.3" ry="3" transform="rotate(20 19.5 9)" />
    </svg>
  );
}

// Una tanda de 4 huellas apareciendo en secuencia (no loop continuo). El
// padre (Navbar) cambia `tick` cada ~20s y remonta este árbol con key={tick}
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
          <SolidPawIcon size={16} />
        </span>
      ))}
    </span>
  );
}
