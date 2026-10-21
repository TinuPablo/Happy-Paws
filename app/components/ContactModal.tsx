"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import TurnstileWidget, { type TurnstileWidgetHandle } from "./TurnstileWidget";
import { REPORTE_MENSAJE_MAX, REPORTE_MENSAJE_MIN } from "@/lib/reportes";

type Estado = { tipo: "idle" } | { tipo: "enviando" } | { tipo: "exito" } | { tipo: "error"; mensaje: string };

const FOCUSABLES = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

// Botón del footer + modal de "¿Tuviste un problema?". Manda a
// POST /api/reportes, que guarda el reporte y avisa por correo.
export default function ContactModal({ emailInicial = "" }: { emailInicial?: string }) {
  const [abierto, setAbierto] = useState(false);
  const [email, setEmail] = useState(emailInicial);
  const [mensaje, setMensaje] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [estado, setEstado] = useState<Estado>({ tipo: "idle" });

  const botonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const tituloId = useId();

  function abrir() {
    setEstado({ tipo: "idle" });
    setCaptchaToken(null);
    setAbierto(true);
  }

  function cerrar() {
    setAbierto(false);
    // El foco vuelve al botón que abrió el modal.
    requestAnimationFrame(() => botonRef.current?.focus());
  }

  // Al abrir: foco adentro y sin scroll de fondo.
  useEffect(() => {
    if (!abierto) return;
    emailRef.current?.focus();
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, [abierto]);

  // Esc cierra; Tab/Shift+Tab no se escapan del modal.
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.stopPropagation();
      cerrar();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLES));
    if (focusables.length === 0) return;
    const primero = focusables[0];
    const ultimo = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = String(new FormData(e.currentTarget).get("website") || "");
    setEstado({ tipo: "enviando" });
    try {
      const res = await fetch("/api/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mensaje, turnstileToken: captchaToken, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setEstado({ tipo: "exito" });
        setMensaje("");
        return;
      }
      setEstado({ tipo: "error", mensaje: data.error || "No pudimos enviar tu mensaje. Probá de nuevo en un ratito." });
    } catch {
      setEstado({ tipo: "error", mensaje: "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." });
    }
    // El token ya se usó (o falló): se pide uno nuevo para reintentar.
    turnstileRef.current?.reset();
  }

  const largo = mensaje.trim().length;
  const mensajeValido = largo >= REPORTE_MENSAJE_MIN && largo <= REPORTE_MENSAJE_MAX;
  const enviando = estado.tipo === "enviando";

  return (
    <>
      <button
        ref={botonRef}
        type="button"
        onClick={abrir}
        className="mt-4 rounded-full border border-brown-light bg-white px-4 py-2 text-sm font-medium text-brown-main transition-colors hover:border-brown-mid hover:text-brown-dark"
      >
        ¿Tuviste un problema? Comunicate con nosotros
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-brown-darker/50 px-4 py-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) cerrar();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={tituloId}
            onKeyDown={onKeyDown}
            className="relative max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-brown-light bg-white p-6 text-left shadow-[0_16px_40px_rgba(75,40,14,0.18)]"
          >
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar"
              className="absolute right-4 top-4 rounded-full p-1 text-text-light hover:bg-brown-lightest hover:text-brown-dark"
            >
              <X size={20} />
            </button>

            <h2 id={tituloId} className="pr-8 text-lg font-bold text-brown-dark">
              ¿Tuviste un problema?
            </h2>

            {estado.tipo === "exito" ? (
              <div className="mt-4">
                <p className="text-sm text-text-mid" role="status">
                  Gracias. Te vamos a responder al correo que ingresaste.
                </p>
                <button type="button" onClick={cerrar} className="btn-dark mt-6 w-full">
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={enviar}>
                <p className="mt-1 text-sm text-text-light">
                  Contanos qué pasó y te respondemos por correo.
                </p>

                <label className="mt-4 block text-sm text-text-mid">
                  Correo electrónico
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    required
                    maxLength={190}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                  />
                </label>

                <label className="mt-4 block text-sm text-text-mid">
                  Mensaje
                  <textarea
                    name="mensaje"
                    required
                    minLength={REPORTE_MENSAJE_MIN}
                    maxLength={REPORTE_MENSAJE_MAX}
                    rows={5}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    aria-describedby={`${tituloId}-contador`}
                    className="input resize-y"
                  />
                </label>
                <p
                  id={`${tituloId}-contador`}
                  className={`mt-1 text-right text-xs ${largo > 0 && !mensajeValido ? "text-red-600" : "text-text-light"}`}
                >
                  {largo}/{REPORTE_MENSAJE_MAX}
                  {largo > 0 && largo < REPORTE_MENSAJE_MIN && ` · mínimo ${REPORTE_MENSAJE_MIN}`}
                </p>

                {/* Honeypot: fuera de pantalla, invisible para lectores de
                    pantalla y fuera del orden de tabulación. Una persona
                    nunca lo completa; un bot que llena todo, sí. */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
                  <label>
                    No completar
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                  </label>
                </div>

                <TurnstileWidget ref={turnstileRef} onToken={setCaptchaToken} />

                {estado.tipo === "error" && (
                  <p className="mt-4 text-sm font-medium text-red-600" role="alert">
                    {estado.mensaje}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={enviando || !captchaToken || !mensajeValido || !email.trim()}
                  className="btn-dark mt-6 w-full disabled:opacity-60"
                >
                  {enviando ? "Enviando..." : "Enviar"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
