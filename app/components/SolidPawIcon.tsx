// Huella sólida (almohadilla + 4 dedos), relleno plano — a diferencia de
// los íconos de lucide-react, que son de trazo (stroke), no de relleno.
// Compartido entre HeaderPawSteps.tsx y PawBump.tsx para usar siempre la
// misma forma reconocible.
export function SolidPawIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <ellipse cx="12" cy="17" rx="6" ry="5" />
      <ellipse cx="5" cy="9" rx="2.3" ry="3" transform="rotate(-20 5 9)" />
      <ellipse cx="10" cy="4.5" rx="2.3" ry="3" transform="rotate(-8 10 4.5)" />
      <ellipse cx="15" cy="4.5" rx="2.3" ry="3" transform="rotate(8 15 4.5)" />
      <ellipse cx="19.5" cy="9" rx="2.3" ry="3" transform="rotate(20 19.5 9)" />
    </svg>
  );
}
