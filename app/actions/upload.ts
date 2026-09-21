"use server";

import { cloudinary } from "@/lib/cloudinary";
import { requireRole } from "@/lib/session";

export type FirmaSubida = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  allowedFormats: string;
  maxFileSize: number;
};

const FORMATOS_PERMITIDOS = "jpg,jpeg,png,webp,gif,mp4,mov,webm";
const TAMANIO_MAXIMO_BYTES = 25 * 1024 * 1024; // 25 MB

// Genera una firma de Cloudinary de un solo uso para que el navegador suba
// el archivo directo a Cloudinary (sin pasar por nuestro servidor — evita el
// límite de tamaño de las server actions, que no da para video) sin exponer
// el API secret del lado del cliente. Solo protectoras dueñas de cuenta
// pueden pedir una firma — son las únicas que hoy suben media (foto/video de
// mascota, logo), y así un adoptante no puede usar el mismo endpoint para
// abusar de la cuenta de Cloudinary del proyecto. `allowed_formats` y
// `max_file_size` quedan incluidos en lo que se firma, así que Cloudinary
// los hace cumplir del lado de ellos — el navegador no puede mandar un
// archivo de otro tipo/tamaño aunque salte la validación del `<input>`.
export async function crearFirmaSubidaAction(): Promise<FirmaSubida> {
  await requireRole("ADMIN_PROTECTORA");

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "Falta configurar Cloudinary en .env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)."
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "happy-paws";
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      allowed_formats: FORMATOS_PERMITIDOS,
      max_file_size: TAMANIO_MAXIMO_BYTES,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
    allowedFormats: FORMATOS_PERMITIDOS,
    maxFileSize: TAMANIO_MAXIMO_BYTES,
  };
}
