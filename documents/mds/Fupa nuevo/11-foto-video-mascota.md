# Prompt 11 — Foto/video en el formulario de agregar mascota (mock)

## Contexto para el agente
Vamos a permitir que la protectora suba una foto o video al agregar una
mascota. Como no hay backend/storage real, usamos `URL.createObjectURL()`
para mostrar el archivo localmente en el navegador — esto SOLO dura la
sesión actual de esa pestaña (se pierde al recargar la página). Por eso,
el campo de media NO se guarda en localStorage junto con el resto de los
datos de la mascota (rompería la cuota de almacenamiento, sobre todo con
video) — se guarda únicamente en el estado de React en memoria.

## Prompt

```
Leé AGENTS.md.

Tarea 1 — Extender el tipo de mascota

En data/mock-mascotas.ts, agregá al tipo MascotaMock estos dos campos
opcionales:

mediaUrl?: string;
mediaType?: "image" | "video";

Tarea 2 — Actualizar MascotasContext para no persistir el media

En app/context/MascotasContext.tsx, modificá la función addMascota para
que acepte también mediaUrl y mediaType (ya vienen incluidos en el objeto
que le pasás porque son parte de MascotaMock). Modificá la función que
guarda en localStorage (donde hacés JSON.stringify(next)) para que ANTES
de guardar, quite esos dos campos de cada mascota, así:

localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify(next.map(({ mediaUrl, mediaType, ...resto }) => resto))
);

Pero el setMascotas(next) que actualiza el estado en memoria SÍ debe
incluir mediaUrl y mediaType completos, para que se vea en la sesión
actual. O sea: el estado en memoria tiene el media, lo que se persiste en
localStorage no.

Tarea 3 — Input de archivo en el formulario de agregar mascota

En app/perfil/page.tsx, en el formulario de agregar mascota que ya existe
(dentro de la sección de protectora), agregá un campo de archivo antes del
botón de submit:

<label className="block text-sm text-[var(--text-mid)]">
  Foto o video (opcional)
  <input
    type="file"
    accept="image/*,video/*"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const tipo = file.type.startsWith("video/") ? "video" : "image";
      setMediaUrl(url);
      setMediaType(tipo);
    }}
    className="mt-1 w-full text-sm text-[var(--text-mid)]"
  />
</label>

{mediaUrl && mediaType === "image" && (
  <img
    src={mediaUrl}
    alt="Vista previa"
    className="mt-3 h-32 w-full rounded-xl object-cover"
  />
)}
{mediaUrl && mediaType === "video" && (
  <video
    src={mediaUrl}
    controls
    className="mt-3 h-32 w-full rounded-xl object-cover"
  />
)}

Agregá dos useState nuevos junto a los del formulario existente:
const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
const [mediaType, setMediaType] = useState<"image" | "video" | undefined>(undefined);

En el submit del formulario, incluí mediaUrl y mediaType dentro del objeto
que le pasás a addMascota(...). Después de agregar la mascota, reseteá
también estos dos estados a undefined junto con el resto de los campos del
formulario.

Tarea 4 — Mostrar el media en las cards de /mascotas y en el detalle

En app/mascotas/page.tsx, en cada card del .map(), donde hoy se muestra el
div con el emoji de fondo (🐶/🐱) como placeholder, cambialo para que:
- Si la mascota tiene mediaUrl y mediaType === "image", muestre un <img>
  con esa URL en vez del emoji, mismo tamaño/bordes que el div actual.
- Si tiene mediaUrl y mediaType === "video", muestre un <video controls>
  con esa URL, mismo tamaño.
- Si no tiene mediaUrl, dejá el emoji placeholder como está hoy.

Mismo criterio en app/mascotas/[id]/page.tsx para la ficha de detalle
(podés usar un tamaño más grande ahí, ej. h-64 en vez de h-32).

No toques nada de MySQL/Prisma. Al terminar, corré npm run build y
confirmame que compila. Probá manualmente: como protectora, agregá una
mascota con una foto de tu compu, confirmá que se ve en el formulario como
vista previa, y que después aparece con esa foto en /mascotas y en su
detalle (dentro de la misma sesión, sin recargar la página). Agregá tu
entrada a PROGRESS_LOG.md, aclarando que el media no persiste a recarga.
```

## Para tener en cuenta en la presentación
Si vas a mostrar esto en vivo, **no recargues la página** después de subir
la foto/video de ejemplo, o se pierde y volvés a ver el emoji placeholder.
Si querés que la mascota de ejemplo ya tenga foto desde el arranque (sin
depender de subirla en vivo), avisame y armamos un prompt aparte para
precargar una imagen de ejemplo directamente en los datos mock iniciales
(esa sí puede persistir, porque sería una URL externa fija, no un archivo
subido desde la compu).
