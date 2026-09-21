// mediaUrl/logoUrl llegan del cliente como un hidden input común — cualquiera
// puede editar su valor antes de enviar el formulario (devtools, proxy) sin
// pasar por la subida real a Cloudinary. Esto no habilita XSS (siempre se
// renderizan como src de <img>/<video>, nunca como href ni HTML crudo), pero
// sin este chequeo se podía guardar cualquier string como si fuera la foto
// de una mascota o el logo de una protectora — incluida una URL externa que
// trackee a quien la visite. Solo se acepta lo que realmente salió de
// nuestra propia subida firmada a Cloudinary.
export function esUrlDeCloudinaryValida(valor: string): boolean {
  try {
    const url = new URL(valor);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}
