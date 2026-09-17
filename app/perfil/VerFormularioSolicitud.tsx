"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { RespuestasQuiz } from "@/lib/calcularCompatibilidad";

const ETIQUETAS: Record<keyof RespuestasQuiz, { pregunta: string; valores: Record<string, string> }> = {
  departamento: {
    pregunta: "¿Vive en un departamento?",
    valores: { si: "Sí", no: "No" },
  },
  hijos: {
    pregunta: "¿Tiene hijos en casa?",
    valores: { si: "Sí", no: "No" },
  },
  tiempoDisponible: {
    pregunta: "Tiempo disponible para pasear y jugar",
    valores: { poco: "Poco", moderado: "Moderado", mucho: "Mucho" },
  },
  especiePreferida: {
    pregunta: "Preferencia de especie",
    valores: { perro: "Perro", gato: "Gato", cualquiera: "Cualquiera" },
  },
  otrasMascotas: {
    pregunta: "¿Ya tiene otras mascotas en casa?",
    valores: { si: "Sí", no: "No" },
  },
};

type VerFormularioSolicitudProps = {
  respuestas: RespuestasQuiz;
  porcentaje: number;
  eraRecomendada: boolean;
  nombreMascota: string;
  nombreAdoptante: string;
};

export function VerFormularioSolicitud({
  respuestas,
  porcentaje,
  eraRecomendada,
  nombreMascota,
  nombreAdoptante,
}: VerFormularioSolicitudProps) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setAbierto(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="mt-2 text-xs font-semibold text-[var(--brown-main)] transition-colors hover:text-[var(--brown-dark)]"
      >
        Ver formulario ↗
      </button>

      {abierto &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setAbierto(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              className="animate-fade-in-up max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--brown-light)] bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 rounded-t-2xl bg-[var(--brown-dark)] px-6 py-5 text-[var(--brown-lightest)]">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-[var(--brown-light)]">
                    Cuestionario de compatibilidad
                  </p>
                  <h2 className="mt-1 truncate text-lg font-bold">{nombreAdoptante}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  aria-label="Cerrar"
                  className="shrink-0 rounded-full p-1.5 text-[var(--brown-light)] transition-colors hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <div
                  className={`rounded-xl border p-4 text-sm ${
                    eraRecomendada
                      ? "border-[var(--green-ok)]/30 bg-[var(--green-ok)]/10"
                      : "border-[var(--gold)]/40 bg-[var(--gold)]/10"
                  }`}
                >
                  <p className="text-3xl font-bold text-[var(--brown-dark)]">{porcentaje}%</p>
                  <p className="mt-1 font-medium text-[var(--text-dark)]">
                    {eraRecomendada
                      ? `✅ ${nombreMascota} era la mascota que el cuestionario le recomendó.`
                      : `⚠️ ${nombreMascota} no era la mascota recomendada por el cuestionario, pero tiene este % de compatibilidad.`}
                  </p>
                </div>

                <h3 className="mt-5 text-sm font-semibold text-[var(--text-dark)]">
                  Respuestas del adoptante
                </h3>
                <dl className="mt-3 space-y-2.5">
                  {(Object.keys(ETIQUETAS) as (keyof RespuestasQuiz)[]).map((clave) => {
                    const valor = respuestas[clave];
                    if (!valor) return null;
                    const info = ETIQUETAS[clave];
                    return (
                      <div
                        key={clave}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brown-light)] px-3 py-2.5"
                      >
                        <dt className="text-sm text-[var(--text-mid)]">{info.pregunta}</dt>
                        <dd className="shrink-0 rounded-full bg-[var(--brown-light)] px-3 py-1 text-xs font-semibold text-[var(--text-dark)]">
                          {info.valores[valor] ?? valor}
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                <button type="button" onClick={() => setAbierto(false)} className="btn-outline mt-6 w-full">
                  Cerrar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
