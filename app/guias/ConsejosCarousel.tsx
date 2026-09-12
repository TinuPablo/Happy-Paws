"use client";

import { useEffect, useState } from "react";

type Consejo = { id: string; title: string; content: string };

const INTERVALO_MS = 15000;

export function ConsejosCarousel({ consejos }: { consejos: Consejo[] }) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (consejos.length <= 1) return;
    const id = setInterval(() => {
      setIndice((i) => (i + 1) % consejos.length);
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [consejos.length]);

  if (consejos.length === 0) return null;
  const consejo = consejos[indice];

  return (
    <div>
      <div
        key={consejo.id}
        className="card animate-fade-in-up border-l-4 border-l-brown-main bg-cream p-4"
      >
        <h4 className="mb-1 text-sm font-bold text-brown-darker">{consejo.title}</h4>
        <p className="text-xs leading-relaxed text-brown-mid">{consejo.content}</p>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {consejos.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setIndice(i)}
            aria-label={`Ver consejo ${i + 1} de ${consejos.length}`}
            aria-current={i === indice}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === indice ? "w-5 bg-brown-main" : "w-1.5 bg-brown-light"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
