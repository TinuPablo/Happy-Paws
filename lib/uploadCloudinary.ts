import { crearFirmaSubidaAction } from "@/app/actions/upload";

export type ArchivoSubido = { url: string; tipo: "image" | "video" };

// Sube el archivo directo desde el navegador a Cloudinary (usando una firma
// de un solo uso pedida al servidor) y devuelve la URL real y persistente —
// reemplaza el patrón anterior de blob: URL de sesión, que no sobrevivía a
// cerrar el navegador.
export async function subirArchivoACloudinary(file: File): Promise<ArchivoSubido> {
  const firma = await crearFirmaSubidaAction();
  const tipo: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", firma.apiKey);
  body.append("timestamp", String(firma.timestamp));
  body.append("signature", firma.signature);
  body.append("folder", firma.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${firma.cloudName}/${tipo}/upload`, {
    method: "POST",
    body,
  });
  if (!res.ok) throw new Error("No se pudo subir el archivo. Probá de nuevo.");

  const data = await res.json();
  return { url: data.secure_url as string, tipo };
}
