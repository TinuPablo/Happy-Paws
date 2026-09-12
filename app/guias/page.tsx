import consejosGenerales from '@/data/consejos-generales.json';
import guiasSalud from '@/data/guides.json';
import { ConsejosCarousel } from './ConsejosCarousel';

export default function GuiasPage() {
  return (
    <main className="min-h-screen bg-[var(--brown-lightest)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-[var(--text-dark)]">
          Guías de cuidado
        </h1>

        <div className="mt-4 rounded-xl bg-cream p-3 text-center text-xs italic text-brown-mid">
          La información de esta sección es orientativa y no reemplaza la consulta veterinaria.
        </div>

        <div className="mb-3 mt-8 text-xs font-bold uppercase tracking-widest text-brown-mid">Guías generales</div>
        <ConsejosCarousel consejos={consejosGenerales} />

        <div className="mb-3 mt-8 text-xs font-bold uppercase tracking-widest text-brown-mid">Guías de salud y bienestar</div>
        <ConsejosCarousel consejos={guiasSalud} />
      </div>
    </main>
  );
}
