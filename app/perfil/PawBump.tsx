import { SolidPawIcon } from "@/app/components/SolidPawIcon";

// Dos huellas "chocando" — gato (brown-mid, más clara) y perro
// (brown-dark, más oscura), decorativo, solo cuentas de protectora. Loop
// continuo (ver @keyframes paw-bump-dog/-cat/-flash en globals.css): se
// acercan, hacen un pequeño "punch" al tocarse, y vuelven.
export function PawBump() {
  return (
    <div className="mt-3 flex h-9 items-center justify-center" aria-hidden="true">
      <span className="paw-bump-dog inline-flex">
        <SolidPawIcon size={30} color="var(--brown-dark)" />
      </span>
      <span className="paw-bump-flash -mx-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)] opacity-0" />
      <span className="paw-bump-cat inline-flex">
        <SolidPawIcon size={30} color="var(--brown-mid)" />
      </span>
    </div>
  );
}
