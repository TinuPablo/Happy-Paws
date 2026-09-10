import { getRecommendedGuides } from '@/lib/recommendations';

const petData = {
  breedId: 'labrador-retriever' as string | null,
  species: 'dog' as 'dog' | 'cat' | null,
};

export default function GuiasPage() {
  const { recommendations, isFallback } = getRecommendedGuides(petData);

  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-[var(--text-dark)]">
          Guías de cuidado
        </h1>

        <div className="mt-4 rounded-xl bg-cream p-3 text-center text-xs italic text-brown-mid">
          La información de esta sección es orientativa y no reemplaza la consulta veterinaria.
        </div>

        {recommendations.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-brown-mid">
              {isFallback
                ? 'Guías recomendadas para tu perro 🐶'
                : 'Recomendado especialmente para tu mascota ✨'
              }
            </div>
            <div className="space-y-4">
              {recommendations.map(g => (
                <div key={g.id} className="card border-l-4 border-l-brown-main p-4">
                  <h4 className="mb-1 text-sm font-bold text-brown-darker">{g.title}</h4>
                  <p className="text-xs leading-relaxed text-brown-mid">{g.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-3 mt-8 text-xs font-bold uppercase tracking-widest text-brown-mid">Guías generales</div>

        <div className="space-y-4">
          <div className="card border-l-4 border-l-brown-main bg-cream p-4">
            <h4 className="mb-1 text-sm font-bold text-brown-darker">¿Cuánto darle de comer?</h4>
            <p className="text-xs leading-relaxed text-brown-mid">Depende del peso y edad. Un adulto de 10kg necesita 250-300g diarios.</p>
          </div>
          <div className="card border-l-4 border-l-brown-main bg-cream p-4">
            <h4 className="mb-1 text-sm font-bold text-brown-darker">Vacunación</h4>
            <p className="text-xs leading-relaxed text-brown-mid">Las esenciales son: moquillo, parvovirus y rabia. Esta última es anual y obligatoria.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
