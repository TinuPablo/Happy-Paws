"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { registerProtectoraAction } from "@/app/actions/auth";
import TurnstileWidget, { type TurnstileWidgetHandle } from "@/app/components/TurnstileWidget";
import PasswordConfirmFields from "@/app/components/PasswordConfirmFields";
import { LIMITES_PROTECTORA as L, validarRegistroProtectora } from "@/lib/validacionProtectora";
import RevisaTuCorreo from "./RevisaTuCorreo";

export default function RegistroProtectoraForm() {
  const [state, formAction, pending] = useActionState(registerProtectoraAction, null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [errorCliente, setErrorCliente] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  // Cada respuesta con error ya consumió el token del captcha: se pide uno nuevo.
  useEffect(() => {
    if (state?.error) turnstileRef.current?.reset();
  }, [state]);

  // Misma validación que hace el servidor, para avisar antes de enviar (y
  // sin gastar el token del captcha). Se envía a mano con startTransition en
  // vez de <form action>, porque con action React vacía el form al
  // terminar — con un formulario así de largo, un error del servidor
  // obligaría a cargar todo de nuevo.
  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const campo = (n: string) => String(fd.get(n) || "").trim();
    const error = validarRegistroProtectora({
      nombreProtectora: campo("nombreProtectora"),
      ubicacion: campo("ubicacion"),
      email: campo("email").toLowerCase(),
      password: String(fd.get("password") || ""),
      password2: String(fd.get("password2") || ""),
      telefono: campo("telefono"),
      instagram: campo("instagram"),
      facebook: campo("facebook"),
      sitioWeb: campo("sitioWeb"),
      nombreResponsable: campo("nombreResponsable"),
      cargoResponsable: campo("cargoResponsable"),
      textoVerificacion: campo("textoVerificacion"),
    });
    setErrorCliente(error);
    if (!error) startTransition(() => formAction(fd));
  }

  if (state?.enviadoA) return <RevisaTuCorreo email={state.enviadoA} esProtectora />;

  const error = errorCliente ?? state?.error;

  return (
    <form
      onSubmit={enviar}
      className="mt-6 rounded-2xl border border-[var(--brown-light)] bg-white p-6 shadow-[0_16px_40px_rgba(75,40,14,0.10)]"
    >
      <p className="rounded-xl bg-[var(--brown-lightest)] px-3 py-2 text-xs leading-relaxed text-[var(--text-mid)]">
        Para cuidar a las familias adoptantes, revisamos cada protectora antes de habilitarla. Contanos un
        poco de ustedes y te escribimos en cuanto la veamos.
      </p>

      <label className="mt-4 block text-sm text-[var(--text-mid)]">
        Nombre de la protectora
        <input type="text" name="nombreProtectora" required maxLength={L.nombreProtectora} className="input" />
      </label>
      <label className="mt-4 block text-sm text-[var(--text-mid)]">
        Ubicación
        <input type="text" name="ubicacion" required maxLength={L.ubicacion} className="input" />
      </label>
      <label className="mt-4 block text-sm text-[var(--text-mid)]">
        Email de contacto
        <input type="email" name="email" required maxLength={L.email} className="input" />
      </label>
      <label className="mt-4 block text-sm text-[var(--text-mid)]">
        Teléfono / WhatsApp
        <input type="tel" name="telefono" required maxLength={L.telefono} className="input" />
      </label>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-[var(--text-dark)]">¿Dónde podemos conocerlos?</legend>
        <p className="mt-0.5 text-xs text-[var(--text-light)]">Completá al menos uno, con la dirección completa.</p>
        <label className="mt-3 block text-sm text-[var(--text-mid)]">
          Instagram
          <input type="url" name="instagram" maxLength={L.url} placeholder="https://instagram.com/tuprotectora" className="input" />
        </label>
        <label className="mt-3 block text-sm text-[var(--text-mid)]">
          Facebook
          <input type="url" name="facebook" maxLength={L.url} placeholder="https://facebook.com/tuprotectora" className="input" />
        </label>
        <label className="mt-3 block text-sm text-[var(--text-mid)]">
          Sitio web
          <input type="url" name="sitioWeb" maxLength={L.url} placeholder="https://..." className="input" />
        </label>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-[var(--text-dark)]">Persona responsable</legend>
        <label className="mt-3 block text-sm text-[var(--text-mid)]">
          Nombre y apellido
          <input type="text" name="nombreResponsable" required maxLength={L.nombreResponsable} className="input" />
        </label>
        <label className="mt-3 block text-sm text-[var(--text-mid)]">
          Cargo o rol en la protectora
          <input type="text" name="cargoResponsable" required maxLength={L.cargoResponsable} placeholder="Ej: presidenta, coordinador de adopciones" className="input" />
        </label>
      </fieldset>

      <label className="mt-5 block text-sm text-[var(--text-mid)]">
        ¿Cómo podemos comprobar que formás parte de la protectora?
        <textarea
          name="textoVerificacion"
          required
          minLength={L.textoVerificacionMin}
          maxLength={L.textoVerificacion}
          rows={4}
          placeholder="Ej: podés escribirnos al Instagram de la protectora, figuro en la comisión directiva, etc."
          className="input resize-y"
        />
      </label>

      <PasswordConfirmFields minLength={L.passwordMin} maxLength={L.password} />

      <TurnstileWidget ref={turnstileRef} onToken={setCaptchaToken} />
      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      <button type="submit" disabled={pending || !captchaToken} className="btn-dark mt-6 w-full disabled:opacity-60">
        {pending ? "Enviando solicitud..." : "Enviar solicitud"}
      </button>
    </form>
  );
}
