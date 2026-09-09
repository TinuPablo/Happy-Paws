# Prompt 6 — Detalle real (mock) + link de vuelta en registro

```
Leé AGENTS.md.

Tres correcciones puntuales:

1. En app/mascotas/[id]/page.tsx: en vez de solo mostrar el id, buscá la
   mascota correspondiente en mockMascotas (data/mock-mascotas.ts) por su
   id y mostrá su ficha completa: nombre, especie, raza, edad, tamaño,
   descripción, con el mismo estilo visual (paleta, cards redondeadas) que
   ya usamos en el listado de /mascotas. Si no se encuentra el id, mostrá
   un mensaje simple tipo "Mascota no encontrada" en vez de romper.

2. En app/protectoras/[id]/page.tsx: mismo criterio, buscá en
   mockProtectoras (data/mock-protectoras.ts) por id y mostrá su ficha
   completa (nombre, ubicación, descripción, cantidad de mascotas).

3. En app/(auth)/registro/page.tsx: agregá un link de vuelta a /login,
   con el mismo estilo que el link "¿No tenés cuenta? Registrate" que ya
   existe en /login (texto tipo "¿Ya tenés cuenta? Iniciá sesión").

No toques ninguna otra ruta ni archivo. Al terminar, corré npm run build
y confirmame que compila. Agregá tu entrada correspondiente a
PROGRESS_LOG.md como venís haciendo.
```
