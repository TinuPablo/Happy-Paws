# Prompt 13 — Mascota animada en el login (sigue el mouse, se tapa los ojos)

## Contexto para el agente
Es un detalle de personalidad para /login (y opcionalmente /registro): un
perrito dibujado en SVG cuyos ojos siguen el cursor del mouse mientras el
usuario escribe su email/usuario, y que se tapa los ojos con las patitas
cuando el campo de contraseña está enfocado — a menos que el usuario active
"mostrar contraseña", en cuyo caso se destapa. Es 100% visual/decorativo,
no afecta la lógica de login que ya existe.

## Prompt

```
Leé AGENTS.md.

Tarea 1 — Componente de la mascota animada

Creá app/components/LoginMascot.tsx con "use client" al principio:

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
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const maxOffset = 4;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
      const clamped = Math.min(distance, 100);
      setEyeOffset({
        x: (deltaX / distance) * (clamped / 100) * maxOffset,
        y: (deltaY / distance) * (clamped / 100) * maxOffset,
      });
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const coveringEyes = isPasswordFocused && !isPasswordVisible;

  return (
    <div ref={containerRef} className="mx-auto mb-4 flex justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Orejas */}
        <ellipse cx="30" cy="30" rx="14" ry="20" fill="var(--brown-mid)" transform="rotate(-20 30 30)" />
        <ellipse cx="90" cy="30" rx="14" ry="20" fill="var(--brown-mid)" transform="rotate(20 90 30)" />

        {/* Cara */}
        <circle cx="60" cy="60" r="42" fill="var(--brown-light)" />

        {/* Ojos (se mueven con eyeOffset, sin importar el estado de tapado) */}
        <g style={{ transition: "transform 0.05s linear" }}>
          <circle
            cx={45 + eyeOffset.x}
            cy={55 + eyeOffset.y}
            r="6"
            fill="var(--text-dark)"
          />
          <circle
            cx={75 + eyeOffset.x}
            cy={55 + eyeOffset.y}
            r="6"
            fill="var(--text-dark)"
          />
        </g>

        {/* Nariz y boca */}
        <ellipse cx="60" cy="72" rx="7" ry="5" fill="var(--brown-dark)" />
        <path
          d="M 60 77 Q 60 84 52 84 M 60 77 Q 60 84 68 84"
          stroke="var(--brown-dark)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Patitas que tapan los ojos */}
        <g
          style={{
            transform: coveringEyes ? "translateY(0px)" : "translateY(-55px)",
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

Tarea 2 — Agregar toggle de "mostrar contraseña" en /login

En app/(auth)/login/page.tsx, si todavía no existe, agregá:
- Un useState nuevo: const [showPassword, setShowPassword] = useState(false);
- Un useState para saber si el campo contraseña está enfocado:
  const [passwordFocused, setPasswordFocused] = useState(false);
- Importá los íconos Eye y EyeOff de "lucide-react".
- Cambiá el input de contraseña para que tenga type={showPassword ? "text" : "password"},
  y agregale onFocus={() => setPasswordFocused(true)} y
  onBlur={() => setPasswordFocused(false)}.
- Al lado del input (podés envolver el input en un div relative y el botón
  en position absolute a la derecha, con padding-right en el input para
  que no se superpongan), agregá un botón tipo:

<button
  type="button"
  onClick={() => setShowPassword((prev) => !prev)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]"
  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
>
  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>

Tarea 3 — Integrar la mascota en el login

En app/(auth)/login/page.tsx, importá LoginMascot y renderizala arriba del
<h1>Iniciar sesión</h1>, pasándole:

<LoginMascot isPasswordFocused={passwordFocused} isPasswordVisible={showPassword} />

No toques nada de la lógica de login (el submit, el useAuth, el redirect)
— esto es puramente visual, se agrega arriba del formulario existente.

No apliques esto a /registro en este prompt (si querés, lo hacemos aparte
después, reusando el mismo componente).

Al terminar, corré npm run build y confirmame que compila. Probá
manualmente: mové el mouse por la pantalla y confirmá que los ojos del
perrito lo siguen levemente. Hacé click en el campo de contraseña y
confirmá que las patitas bajan a tapar los ojos. Activá "mostrar
contraseña" y confirmá que las patitas se destapan mientras seguís en ese
campo. Agregá tu entrada a PROGRESS_LOG.md.
```

## Nota
El seguimiento de ojos es sutil a propósito (máximo 4px de desplazamiento)
para que se vea como un guiño simpático, no algo que distraiga de verdad
del formulario. Si en la demo te parece que se mueve muy poco o mucho,
avisame y ajustamos el valor `maxOffset` en el código.
