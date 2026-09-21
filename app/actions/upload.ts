"use server";

import { cloudinary } from "@/lib/cloudinary";
import { getSession } from "@/lib/session";

export type FirmaSubida = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
};

// Genera una firma de Cloudinary de un solo uso para que el navegador suba
// el archivo directo a Cloudinary (sin pasar por nuestro servidor — evita el
// límite de tamaño de las server actions, que no da para video) sin exponer
// el API secret del lado del cliente. Cualquier cuenta logueada puede pedir
// una firma; lo que hace falta con la URL resultante (crear una mascota,
// cambiar el logo de la protectora) sí queda gateado por rol donde
// corresponde (addMascotaAction, actualizarLogoProtectoraAction).
export async function crearFirmaSubidaAction(): Promise<FirmaSubida> {
  const session = await getSession();
  if (!session) throw new Error("No autenticado.");

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "Falta configurar Cloudinary en .env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)."
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "happy-paws";
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
  };
}
