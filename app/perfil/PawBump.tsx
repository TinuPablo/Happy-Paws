// Perro y gato "chocando patas" — decorativo, solo cuentas de protectora.
// Loop continuo (ver @keyframes paw-bump-dog/-cat/-flash en globals.css):
// se acercan, se tocan un instante con un flash dorado, y vuelven.
function DogSilhouette() {
  return (
    <svg width="44" height="36" viewBox="0 0 44 36" aria-hidden="true">
      <rect x="2" y="4" width="9" height="14" rx="4" fill="var(--brown-main)" transform="rotate(-18 6.5 11)" />
      <rect x="13" y="2" width="9" height="14" rx="4" fill="var(--brown-main)" transform="rotate(10 17.5 9)" />
      <ellipse cx="14" cy="19" rx="11" ry="10" fill="var(--brown-main)" />
      <circle cx="34" cy="21" r="4.5" fill="var(--gold)" />
    </svg>
  );
}

function CatSilhouette() {
  return (
    <svg width="44" height="36" viewBox="0 0 44 36" aria-hidden="true">
      <polygon points="24,2 33,3 29,13" fill="var(--brown-dark)" />
      <polygon points="41,3 33,5 36,14" fill="var(--brown-dark)" />
      <ellipse cx="30" cy="19" rx="11" ry="10" fill="var(--brown-dark)" />
      <circle cx="10" cy="21" r="4.5" fill="var(--gold)" />
    </svg>
  );
}

export function PawBump() {
  return (
    <div className="mt-3 flex h-9 items-center justify-center" aria-hidden="true">
      <span className="paw-bump-dog inline-flex">
        <DogSilhouette />
      </span>
      <span className="paw-bump-flash -mx-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)] opacity-0" />
      <span className="paw-bump-cat inline-flex">
        <CatSilhouette />
      </span>
    </div>
  );
}
