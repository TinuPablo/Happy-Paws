"use client";

import { useActionState, useEffect, useRef } from "react";
import { crearSolicitudAction } from "@/app/actions/solicitudes";

export function AdoptarButton({ mascotaId, nombre }: { mascotaId: string; nombre: string }) {
  const [state, formAction, pending] = useActionState(crearSolicitudAction, null);
  const quizInputRef = useRef<HTMLInputElement>(null);

  // Si el adoptante completó el quiz de compatibilidad en /mascotas durante
  // esta sesión del navegador, se adjunta acá para que la protectora pueda
  // verlo junto a la solicitud (ver "Ver formulario" en /perfil).
  useEffect(() => {
    try {
      const respuestas = sessionStorage.getItem("happy_paws_quiz_respuestas");
      if (respuestas && quizInputRef.current) {
        quizInputRef.current.value = respuestas;
      }
    } catch {
      // sin sessionStorage disponible, la solicitud igual se envía sin quiz
    }
  }, []);

  return (
    <form action={formAction}>
      <input type="hidden" name="mascotaId" value={mascotaId} />
      <input type="hidden" name="quizRespuestas" ref={quizInputRef} defaultValue="" />
      <button type="submit" disabled={pending} className="btn-primary mt-6 w-full disabled:opacity-60">
        {pending ? "Enviando..." : `Quiero adoptar a ${nombre} 🐾`}
      </button>
      {state?.error && <p className="mt-2 text-sm font-medium text-red-600">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm font-medium text-[var(--green-ok)]">{state.success}</p>}
    </form>
  );
}
