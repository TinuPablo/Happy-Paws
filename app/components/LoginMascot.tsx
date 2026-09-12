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
        {/* Cabeza completa, estilo cachorro golden retriever tierno: orejas
            caídas en forma de "paleta" (afinadas en la punta, no óvalos),
            cara redonda color crema-dorado suave, ojos grandes con brillo
            y mejillas sonrojadas. Sigue al mouse. */}
        <g
          style={{
            transform: `translate(${headShiftX}px, ${headShiftY}px) rotate(${headTilt}deg)`,
            transformOrigin: "60px 60px",
            transition: "transform 0.12s ease-out",
          }}
        >
          {/* Orejas caídas: nacen escondidas debajo del pelaje (la cara se
              dibuja encima y tapa el nacimiento) y cuelgan afinándose en
              la punta, como una oreja real — no un óvalo simétrico */}
          <path
            d="M 44 40 C 26 34, 8 50, 10 74 C 12 88, 24 98, 34 92
               C 40 88, 40 74, 38 60 C 37 50, 40 44, 44 40 Z"
            fill="var(--brown-mid)"
          />
          <path
            d="M 76 40 C 94 34, 112 50, 110 74 C 108 88, 96 98, 86 92
               C 80 88, 80 74, 82 60 C 83 50, 80 44, 76 40 Z"
            fill="var(--brown-mid)"
          />

          {/* Mechón/cowlick sobre la cabeza, detalle tierno de cachorro */}
          <path
            d="M 52 29 Q 60 16 68 29 Q 62 25 60 32 Q 58 25 52 29 Z"
            fill="var(--brown-mid)"
          />

          {/* Cara: pelaje crema-marrón suave */}
          <circle cx="60" cy="64" r="38" fill="var(--brown-light)" />

          {/* Mejillas sonrojaditas */}
          <circle cx="33" cy="74" r="6.5" fill="var(--brown-main)" opacity="0.35" />
          <circle cx="87" cy="74" r="6.5" fill="var(--brown-main)" opacity="0.35" />

          {/* Hocico: parche claro y ancho, característico del golden */}
          <ellipse cx="60" cy="75" rx="21" ry="16" fill="var(--brown-lightest)" />

          {/* Ojos grandes y tiernos, con brillo (pupilas con su propio
              offset, dentro de la cabeza) */}
          <circle cx={44 + pupilOffset.x} cy={58 + pupilOffset.y} r="7.5" fill="var(--text-dark)" />
          <circle cx={76 + pupilOffset.x} cy={58 + pupilOffset.y} r="7.5" fill="var(--text-dark)" />
          <circle cx={41.5 + pupilOffset.x} cy={55.5 + pupilOffset.y} r="2.3" fill="white" />
          <circle cx={73.5 + pupilOffset.x} cy={55.5 + pupilOffset.y} r="2.3" fill="white" />

          {/* Nariz redonda y sonrisa suave */}
          <ellipse cx="60" cy="76" rx="7.5" ry="6" fill="var(--brown-darker)" />
          <path
            d="M 50 85 Q 60 92 70 85"
            stroke="var(--brown-darker)"
            strokeWidth="2.5"
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
          <ellipse cx="44" cy="58" rx="13" ry="15" fill="var(--brown-mid)" />
          <ellipse cx="76" cy="58" rx="13" ry="15" fill="var(--brown-mid)" />
          {/* Deditos, decorativo */}
          <ellipse cx="39" cy="49" rx="4" ry="5" fill="var(--brown-mid)" />
          <ellipse cx="49" cy="47" rx="4" ry="5" fill="var(--brown-mid)" />
          <ellipse cx="71" cy="47" rx="4" ry="5" fill="var(--brown-mid)" />
          <ellipse cx="81" cy="49" rx="4" ry="5" fill="var(--brown-mid)" />
        </g>
      </svg>
    </div>
  );
}

// MOCK/decorativo: no depende de auth real, se puede reusar tal cual
// cuando conectemos autenticación real más adelante.
