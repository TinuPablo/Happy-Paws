const ITEMS = [
  "🐾 Adopción responsable",
  "🏠 Protectoras verificadas",
  "🧡 Familias felices",
  "📋 Seguimiento post-adopción",
  "💛 Sin costos ocultos",
];

export function ImpactTicker() {
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden border-y border-brown-light bg-brown-light/40 py-3">
      <div className="marquee-track flex w-max gap-10">
        {loop.map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-sm font-semibold text-text-mid"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
