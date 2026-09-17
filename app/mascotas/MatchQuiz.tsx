"use client";

import { useState } from "react";
import type { RespuestasQuiz } from "@/lib/calcularCompatibilidad";

type Pregunta = {
  clave: keyof RespuestasQuiz;
  texto: string;
  opciones: { label: string; valor: string }[];
};

const PREGUNTAS: Pregunta[] = [
  {
    clave: "departamento",
    texto: "¿Vivís en un departamento?",
    opciones: [
      { label: "Sí", valor: "si" },
      { label: "No", valor: "no" },
    ],
  },
  {
    clave: "hijos",
    texto: "¿Tenés hijos en casa?",
    opciones: [
      { label: "Sí", valor: "si" },
      { label: "No", valor: "no" },
    ],
  },
  {
    clave: "tiempoDisponible",
    texto: "¿Cuánto tiempo podés dedicarle a pasear y jugar por día?",
    opciones: [
      { label: "Poco", valor: "poco" },
      { label: "Moderado", valor: "moderado" },
      { label: "Mucho", valor: "mucho" },
    ],
  },
  {
    clave: "especiePreferida",
    texto: "¿Preferís perro, gato, o no tenés preferencia?",
    opciones: [
      { label: "Perro", valor: "perro" },
      { label: "Gato", valor: "gato" },
      { label: "Cualquiera", valor: "cualquiera" },
    ],
  },
  {
    clave: "otrasMascotas",
    texto: "¿Ya tenés otras mascotas en casa?",
    opciones: [
      { label: "Sí", valor: "si" },
      { label: "No", valor: "no" },
    ],
  },
];

type MatchQuizProps = {
  onFinish: (respuestas: RespuestasQuiz) => void;
  onSkip: () => void;
};

export function MatchQuiz({ onFinish, onSkip }: MatchQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Partial<RespuestasQuiz>>({});
  const [seleccionada, setSeleccionada] = useState<string | null>(null);

  function elegir(valor: string) {
    if (seleccionada) return;
    setSeleccionada(valor);
    const nuevasRespuestas = { ...respuestas, [PREGUNTAS[currentIndex].clave]: valor };

    setTimeout(() => {
      setSeleccionada(null);
      if (currentIndex === PREGUNTAS.length - 1) {
        onFinish(nuevasRespuestas as RespuestasQuiz);
      } else {
        setRespuestas(nuevasRespuestas);
        setCurrentIndex((i) => i + 1);
      }
    }, 350);
  }

  return (
    <div className="mx-auto max-w-xl py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex gap-1.5">
          {PREGUNTAS.map((pregunta, i) => (
            <div
              key={pregunta.clave}
              className="h-1.5 w-10 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: i <= currentIndex ? "var(--brown-dark)" : "var(--brown-light)",
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="shrink-0 text-xs font-medium text-[var(--text-light)] transition-colors hover:text-[var(--brown-dark)]"
        >
          Omitir y ver todas las mascotas
        </button>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.4s ease",
          }}
        >
          {PREGUNTAS.map((pregunta, i) => (
            <div key={pregunta.clave} className="w-full shrink-0 px-1">
              <div className="card p-8 text-center">
                <h2 className="text-xl font-bold text-[var(--text-dark)] sm:text-2xl">
                  {pregunta.texto}
                </h2>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {pregunta.opciones.map((opcion) => {
                    const activa = i === currentIndex && seleccionada === opcion.valor;
                    return (
                      <button
                        key={opcion.valor}
                        type="button"
                        onClick={() => i === currentIndex && elegir(opcion.valor)}
                        className="rounded-xl px-6 py-3 text-sm font-semibold transition-colors duration-200"
                        style={{
                          backgroundColor: activa ? "var(--brown-main)" : "var(--brown-light)",
                          color: activa ? "#fff" : "var(--text-dark)",
                        }}
                      >
                        {opcion.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
