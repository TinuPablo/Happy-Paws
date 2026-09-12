"use client";

import { useEffect, useRef, useState } from "react";

type LoginMascotProps = {
  isPasswordFocused: boolean;
  isPasswordVisible: boolean;
};

export default function LoginMascot({
  isPasswordFocused,
  isPasswordVisible,
}: LoginMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Dirección normalizada del mouse respecto al centro de la mascota (-1..1
  // en cada eje, escalada por qué tan cerca está el cursor).
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
      const radius = 220; // hasta dónde sigue respondiendo la cabeza
      const strength = Math.min(distance, radius) / radius;
      setMouse({
        x: (deltaX / distance) * strength,
        y: (deltaY / distance) * strength,
      });
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const coveringEyes = isPasswordFocused && !isPasswordVisible;

  // La cabeza entera gira y se desplaza siguiendo al mouse — bien
  // perceptible, no un tilt sutil.
  const headTilt = mouse.x * 12;
  const headShiftX = mouse.x * 6;
  const headShiftY = mouse.y * 5;

  // Las pupilas suman un movimiento propio, más chico, dentro de la cabeza.
  const pupilOffset = { x: mouse.x * 4, y: mouse.y * 4 };

  return (
    <div ref={containerRef} className="mx-auto mb-4 flex justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ overflow: "visible" }}>
        {/* Cabeza completa: orejas + cara + ojos + nariz + boca, sigue al mouse */}
        <g
          style={{
            transform: `translate(${headShiftX}px, ${headShiftY}px) rotate(${headTilt}deg)`,
            transformOrigin: "60px 60px",
            transition: "transform 0.12s ease-out",
          }}
        >
          {/* Orejas */}
          <ellipse cx="30" cy="30" rx="14" ry="20" fill="var(--brown-mid)" transform="rotate(-20 30 30)" />
          <ellipse cx="90" cy="30" rx="14" ry="20" fill="var(--brown-mid)" transform="rotate(20 90 30)" />

          {/* Cara */}
          <circle cx="60" cy="60" r="42" fill="var(--brown-light)" />

          {/* Ojos (pupilas con su propio offset, dentro de la cabeza) */}
          <circle cx={45 + pupilOffset.x} cy={55 + pupilOffset.y} r="6" fill="var(--text-dark)" />
          <circle cx={75 + pupilOffset.x} cy={55 + pupilOffset.y} r="6" fill="var(--text-dark)" />

          {/* Nariz y boca */}
          <ellipse cx="60" cy="72" rx="7" ry="5" fill="var(--brown-dark)" />
          <path
            d="M 60 77 Q 60 84 52 84 M 60 77 Q 60 84 68 84"
            stroke="var(--brown-dark)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Patitas: descansan abajo por defecto y suben a tapar los ojos */}
        <g
          style={{
            transform: coveringEyes ? "translateY(0px)" : "translateY(48px)",
            transition: "transform 0.35s ease",
          }}
        >
          <ellipse cx="45" cy="55" rx="13" ry="15" fill="var(--brown-main)" />
          <ellipse cx="75" cy="55" rx="13" ry="15" fill="var(--brown-main)" />
          {/* Deditos, decorativo */}
          <ellipse cx="40" cy="46" rx="4" ry="5" fill="var(--brown-main)" />
          <ellipse cx="50" cy="44" rx="4" ry="5" fill="var(--brown-main)" />
          <ellipse cx="70" cy="44" rx="4" ry="5" fill="var(--brown-main)" />
          <ellipse cx="80" cy="46" rx="4" ry="5" fill="var(--brown-main)" />
        </g>
      </svg>
    </div>
  );
}

// MOCK/decorativo: no depende de auth real, se puede reusar tal cual
// cuando conectemos autenticación real más adelante.
