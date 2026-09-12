"use client";

import { useEffect, useRef, useState } from "react";

const EMOJIS = ["🐾", "🧡", "💛"];

type ParticleConfig = {
  id: number;
  emoji: string;
  left: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  parallax: number;
};

// 3 capas de profundidad: más chicas/lentas/lejanas, más grandes/rápidas/cercanas.
const LAYERS = [
  { count: 10, size: [18, 24] as const, opacity: [0.16, 0.22] as const, duration: [20, 28] as const, parallax: 6 },
  { count: 10, size: [24, 32] as const, opacity: [0.22, 0.3] as const, duration: [14, 20] as const, parallax: 14 },
  { count: 8, size: [32, 44] as const, opacity: [0.28, 0.38] as const, duration: [9, 14] as const, parallax: 26 },
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function buildParticles(): ParticleConfig[] {
  const particles: ParticleConfig[] = [];
  let id = 0;
  for (const layer of LAYERS) {
    for (let i = 0; i < layer.count; i++) {
      const duration = rand(layer.duration[0], layer.duration[1]);
      particles.push({
        id: id++,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        left: rand(2, 98),
        size: rand(layer.size[0], layer.size[1]),
        opacity: rand(layer.opacity[0], layer.opacity[1]),
        duration,
        delay: -rand(0, duration),
        parallax: layer.parallax,
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
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
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
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
