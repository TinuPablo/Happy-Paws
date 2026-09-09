import { getRecommendedGuides } from '@/lib/recommendations';

const petData = {
  breedId: 'labrador-retriever' as string | null,
  species: 'dog' as 'dog' | 'cat' | null,
};

export default function GuiasPage() {
  const { recommendations, isFallback } = getRecommendedGuides(petData);

  return (
    <main className="min-h-full bg-[var(--brown-lightest)] px-6 py-10">
      <h1 className="text-2xl font-medium text-[var(--text-dark)]">
        Guías de cuidado
      </h1>

      <div className="mt-4 p-3 bg-cream rounded-xl text-[10px] text-brown-mid text-center italic">
        La información de esta sección es orientativa y no reemplaza la consulta veterinaria.
      </div>

      {recommendations.length > 0 && (
        <div className="mt-6">
          <div className="text-[12px] font-bold tracking-widest text-brown-mid uppercase mb-3 px-1">
            {isFallback
              ? 'Guías recomendadas para tu perro 🐶'
              : 'Recomendado especialmente para tu mascota ✨'
            }
          </div>
          <div className="space-y-4">
            {recommendations.map(g => (
              <div key={g.id} className="rounded-2xl border border-brown-light border-l-4 border-l-brown-main bg-white p-4 shadow-sm">
                <h4 className="text-sm font-bold text-brown-darker mb-1">{g.title}</h4>
                <p className="text-xs leading-relaxed text-brown-mid">{g.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 mb-3 text-[13px] font-bold tracking-widest text-brown-mid uppercase">Guías generales</div>

      <div className="space-y-6">
        <div>
          <div className="rounded-2xl border-l-4 border-brown-main bg-cream p-4 shadow-sm">
            <h4 className="text-sm font-bold text-brown-darker mb-1">¿Cuánto darle de comer?</h4>
            <p className="text-xs leading-relaxed text-brown-mid">Depende del peso y edad. Un adulto de 10kg necesita 250-300g diarios.</p>
          </div>
        </div>
        <div>
          <div className="rounded-2xl border-l-4 border-brown-main bg-cream p-4 shadow-sm">
            <h4 className="text-sm font-bold text-brown-darker mb-1">Vacunación</h4>
            <p className="text-xs leading-relaxed text-brown-mid">Las esenciales son: moquillo, parvovirus y rabia. Esta última es anual y obligatoria.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
