// Validación del registro de protectora. Se usa igual en el cliente (para
// avisar antes de enviar) y en el servidor (que es la que vale: el cliente
// se puede saltear). Sin "server-only" a propósito.

export const LIMITES_PROTECTORA = {
  nombreProtectora: 120,
  ubicacion: 120,
  email: 190,
  telefono: 40,
  url: 190,
  nombreResponsable: 120,
  cargoResponsable: 80,
  textoVerificacionMin: 20,
  textoVerificacion: 2000,
  passwordMin: 6,
  password: 100,
} as const;

export type DatosRegistroProtectora = {
  nombreProtectora: string;
  ubicacion: string;
  email: string;
  password: string;
  password2: string;
  telefono: string;
  instagram: string;
  facebook: string;
  sitioWeb: string;
  nombreResponsable: string;
  cargoResponsable: string;
  textoVerificacion: string;
};

export function esUrlHttpValida(valor: string): boolean {
  try {
    const url = new URL(valor);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

const EMAIL_REGEX = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;
const TELEFONO_REGEX = /^[0-9+()\-\s]{6,}$/;

// Devuelve el primer error encontrado, o null si está todo bien.
export function validarRegistroProtectora(d: DatosRegistroProtectora): string | null {
  const L = LIMITES_PROTECTORA;

  if (!d.nombreProtectora || !d.ubicacion || !d.email || !d.password) {
    return "Completá nombre, ubicación, email y contraseña.";
  }
  if (!d.telefono || !d.nombreResponsable || !d.cargoResponsable || !d.textoVerificacion) {
    return "Completá el teléfono, los datos de la persona responsable y cómo podemos verificarte.";
  }
  if (d.nombreProtectora.length > L.nombreProtectora) return `El nombre puede tener hasta ${L.nombreProtectora} caracteres.`;
  if (d.ubicacion.length > L.ubicacion) return `La ubicación puede tener hasta ${L.ubicacion} caracteres.`;
  if (d.email.length > L.email || !EMAIL_REGEX.test(d.email)) return "Revisá el formato del email.";
  if (d.password.length < L.passwordMin) return `La contraseña tiene que tener al menos ${L.passwordMin} caracteres.`;
  if (d.password.length > L.password) return `La contraseña puede tener hasta ${L.password} caracteres.`;
  if (d.password !== d.password2) return "Las contraseñas no coinciden.";
  if (d.telefono.length > L.telefono || !TELEFONO_REGEX.test(d.telefono)) {
    return "Revisá el teléfono: solo números, espacios, guiones, paréntesis o +.";
  }
  if (d.nombreResponsable.length > L.nombreResponsable) return `El nombre de la persona responsable puede tener hasta ${L.nombreResponsable} caracteres.`;
  if (d.cargoResponsable.length > L.cargoResponsable) return `El cargo puede tener hasta ${L.cargoResponsable} caracteres.`;
  if (d.textoVerificacion.length < L.textoVerificacionMin) {
    return `Contanos un poco más sobre cómo podemos verificarte (al menos ${L.textoVerificacionMin} caracteres).`;
  }
  if (d.textoVerificacion.length > L.textoVerificacion) return `El texto de verificación puede tener hasta ${L.textoVerificacion} caracteres.`;

  const enlaces = [
    ["Instagram", d.instagram],
    ["Facebook", d.facebook],
    ["Sitio web", d.sitioWeb],
  ] as const;
  if (enlaces.every(([, v]) => !v)) {
    return "Sumá al menos un enlace (Instagram, Facebook o sitio web) para que podamos conocer la protectora.";
  }
  for (const [etiqueta, valor] of enlaces) {
    if (!valor) continue;
    if (valor.length > L.url) return `El enlace de ${etiqueta} puede tener hasta ${L.url} caracteres.`;
    if (!esUrlHttpValida(valor)) return `El enlace de ${etiqueta} tiene que ser una dirección completa, empezando con https://`;
  }

  return null;
}
