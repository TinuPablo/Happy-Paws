"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import type { Mascota } from "@prisma/client";
import { toggleFavoritoAction } from "@/app/actions/favoritos";
import { calcularCompatibilidad, type RespuestasQuiz } from "@/lib/calcularCompatibilidad";
import { FiltrosMascotas } from "./FiltrosMascotas";
import { MatchQuiz } from "./MatchQuiz";
import { MatchResult } from "./MatchResult";
import { Reveal } from "@/app/components/Reveal";

type Vista = "quiz" | "resultado" | "catalogo";

type MascotasCatalogoProps = {
  mascotas: Mascota[];
  favoritosIds: string[] | null;
  mostrarQuiz: boolean;
};

export function MascotasCatalogo({ mascotas, favoritosIds, mostrarQuiz }: MascotasCatalogoProps) {
  const [vista, setVista] = useState<Vista>(mostrarQuiz ? "quiz" : "catalogo");
  const [mascotaRecomendada, setMascotaRecomendada] = useState<{
    mascota: Mascota;
    porcentaje: number;
  } | null>(null);
  const favoritos = favoritosIds ? new Set(favoritosIds) : null;

  function handleFinish(respuestas: RespuestasQuiz) {
    // Se guarda para poder adjuntarlas si más adelante el adoptante solicita
    // una adopción (ver AdoptarButton) — así la protectora puede ver, junto
    // a la solicitud, qué respondió y qué tan compatible era con esa mascota.
    try {
      sessionStorage.setItem("happy_paws_quiz_respuestas", JSON.stringify(respuestas));
    } catch {
      // localStorage/sessionStorage pueden fallar (modo privado, cuota) —
      // no es crítico para el flujo del quiz en sí.
    }

    let mejor: Mascota | null = null;
    let mejorPuntaje = -1;
    for (const mascota of mascotas) {
      const puntaje = calcularCompatibilidad(mascota, respuestas);
      if (puntaje > mejorPuntaje) {
        mejorPuntaje = puntaje;
        mejor = mascota;
      }
    }
    if (mejor) {
      setMascotaRecomendada({ mascota: mejor, porcentaje: mejorPuntaje });
      setVista("resultado");
    } else {
      setVista("catalogo");
    }
  }

  if (vista === "quiz") {
    return <MatchQuiz onFinish={handleFinish} onSkip={() => setVista("catalogo")} />;
  }

  if (vista === "resultado" && mascotaRecomendada) {
    return (
      <MatchResult
        mascota={mascotaRecomendada.mascota}
        porcentaje={mascotaRecomendada.porcentaje}
        onVerTodas={() => setVista("catalogo")}
      />
    );
  }

  return (
    <>
      <p className="mt-1 text-sm text-[var(--text-light)]">
        {mascotas.length} {mascotas.length === 1 ? "mascota esperando" : "mascotas esperando"} un hogar.
      </p>

      <Suspense fallback={null}>
        <FiltrosMascotas />
      </Suspense>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mascotas.map((mascota, i) => (
          <Reveal
            key={mascota.id}
            delay={Math.min(i, 8) * 70}
            className="card group overflow-hidden p-4"
          >
            <div className="relative mb-3 h-32 overflow-hidden rounded-xl bg-[var(--brown-light)]">
              {mascota.mediaUrl && mascota.mediaType === "image" ? (
                <img
                  src={mascota.mediaUrl}
                  alt={mascota.nombre}
                  className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : mascota.mediaUrl && mascota.mediaType === "video" ? (
                <video src={mascota.mediaUrl} controls className="h-32 w-full object-cover" />
              ) : (
                <div className="flex h-32 items-center justify-center text-4xl transition-transform duration-300 group-hover:scale-110">
                  {mascota.especie === "PERRO" ? "🐶" : "🐱"}
                </div>
              )}
              <span className="badge-pill absolute left-2 top-2">
                {mascota.especie === "PERRO" ? "Perro" : "Gato"}
              </span>
              {favoritos && (
                <form action={toggleFavoritoAction} className="absolute right-2 top-2">
                  <input type="hidden" name="mascotaId" value={mascota.id} />
                  <button
                    type="submit"
                    aria-label={favoritos.has(mascota.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm"
                  >
                    {favoritos.has(mascota.id) ? "★" : "☆"}
                  </button>
                </form>
              )}
            </div>
            <h3 className="font-semibold text-[var(--text-dark)]">{mascota.nombre}</h3>
            <p className="text-sm text-[var(--text-light)]">
              {mascota.razaTexto} · {mascota.edadTexto} · {mascota.tamanio}
            </p>
            <p className="mt-2 text-sm text-[var(--text-mid)]">{mascota.descripcion}</p>
            <Link href={`/mascotas/${mascota.id}`} className="btn-dark mt-3 block">
              Ver más
            </Link>
          </Reveal>
        ))}
        {mascotas.length === 0 && (
          <p className="col-span-full text-sm text-[var(--text-mid)]">
            No hay mascotas que coincidan con esos filtros.
          </p>
        )}
      </div>
    </>
  );
}
