"use client";

import { useEffect, useRef, useState } from "react";

const PAW = "🐾";
const HEARTS = ["🧡", "💛"];

type ParticleConfig = {
  id: number;
  emoji: string;
  left: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  parallax: number;
  startBottom: number;
  dx1: number;
  dx2: number;
  dx3: number;
  dr1: number;
  dr2: number;
  dr3: number;
};

// 3 capas de profundidad: más chicas/lentas/lejanas, más grandes/rápidas/cercanas.
// Pensado para vivir dentro de la caja del hero, no de toda la pantalla:
// pocas partículas y recorrido corto (ver --dx/--dr y el keyframe en globals.css).
const LAYERS = [
  { count: 5, size: [16, 20] as const, opacity: [0.16, 0.22] as const, duration: [13, 17] as const, parallax: 5 },
  { count: 5, size: [20, 26] as const, opacity: [0.2, 0.28] as const, duration: [9, 12] as const, parallax: 10 },
  { count: 4, size: [26, 32] as const, opacity: [0.24, 0.32] as const, duration: [6, 8] as const, parallax: 16 },
];

// Las huellas se ven menos que los corazones a igual opacidad (el emoji es
// más "hueco"), así que les damos un empujón extra de opacidad.
const PAW_OPACITY_BOOST = 1.4;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Posiciones horizontales al azar, pero con una distancia mínima entre ellas
// para que no caigan dos pegadas por pura casualidad. A diferencia de repartir
// en franjas parejas, esto no forma una "fila" prolija — queda orgánico.
function scatterLefts(total: number): number[] {
  const minGap = 100 / total / 1.6;
  const lefts: number[] = [];
  let guard = 0;
  while (lefts.length < total && guard < total * 60) {
    guard++;
    const candidate = rand(3, 97);
    if (lefts.every((l) => Math.abs(l - candidate) >= minGap)) {
      lefts.push(candidate);
    }
  }
  while (lefts.length < total) lefts.push(rand(3, 97));
  // Orden al azar: el orden de generación tiende a ir de menor a mayor.
  for (let i = lefts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lefts[i], lefts[j]] = [lefts[j], lefts[i]];
  }
  return lefts;
}

// Mitad huellas, mitad corazones (mezclando los dos colores), mezcladas al
// azar entre sí — no elegidas al azar partícula por partícula, para no
// terminar con, por ejemplo, muchos más corazones que huellas por casualidad.
function buildEmojiPool(total: number): string[] {
  const pawCount = Math.round(total / 2);
  const pool: string[] = [];
  for (let i = 0; i < pawCount; i++) pool.push(PAW);
  for (let i = 0; i < total - pawCount; i++) {
    pool.push(HEARTS[Math.floor(Math.random() * HEARTS.length)]);
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

function buildParticles(): ParticleConfig[] {
  const total = LAYERS.reduce((sum, layer) => sum + layer.count, 0);
  const lefts = scatterLefts(total);
  const emojis = buildEmojiPool(total);

  const particles: ParticleConfig[] = [];
  let id = 0;
  for (const layer of LAYERS) {
    for (let i = 0; i < layer.count; i++) {
      const duration = rand(layer.duration[0], layer.duration[1]);
      const emoji = emojis[id];
      const baseOpacity = rand(layer.opacity[0], layer.opacity[1]);
      particles.push({
        id: id++,
        emoji,
        left: lefts[id - 1],
        size: rand(layer.size[0], layer.size[1]),
        opacity: emoji === PAW ? Math.min(0.45, baseOpacity * PAW_OPACITY_BOOST) : baseOpacity,
        duration,
        delay: -rand(0, duration),
        parallax: layer.parallax,
        // Recorrido y giro propios de cada partícula: sin esto, todas
        // dibujan la misma curva y varias en fase parecen una fila subiendo.
        startBottom: rand(-70, -10),
        dx1: rand(-36, 36),
        dx2: rand(-36, 36),
        dx3: rand(-36, 36),
        dr1: rand(-16, 16),
        dr2: rand(-16, 16),
        dr3: rand(-16, 16),
      });
    }
  }
  return particles;
}

export function FloatingPawsBackground() {
  const [particles, setParticles] = useState<ParticleConfig[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setParticles(buildParticles());

    const el = containerRef.current;
    if (!el) return;

    function handleMouseMove(e: MouseEvent) {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      el!.style.setProperty("--mx", mx.toFixed(3));
      el!.style.setProperty("--my", my.toFixed(3));
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ "--mx": "0", "--my": "0" } as React.CSSProperties}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="floating-paw"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            translate: `calc(var(--mx) * ${p.parallax}px) calc(var(--my) * ${p.parallax * 0.5}px)`,
            "--start-bottom": `${p.startBottom}px`,
            "--dx1": `${p.dx1}px`,
            "--dx2": `${p.dx2}px`,
            "--dx3": `${p.dx3}px`,
            "--dr1": `${p.dr1}deg`,
            "--dr2": `${p.dr2}deg`,
            "--dr3": `${p.dr3}deg`,
          } as React.CSSProperties}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
