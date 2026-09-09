# Prompt 1 (atomizado) — Eliminar la mascota virtual

> Instrucción para vos (Tinu): pasale un sub-paso por vez al agente, en orden.
> Después de cada uno, revisá que compile antes de pasar al siguiente. No le
> pegues los 4 sub-pasos juntos.

---

## Sub-paso A — Solo listar, no borrar todavía

```
Leé AGENTS.md primero.

Tarea: NO modifiques nada todavía. Solo leé app/page.tsx y listame, en
formato de lista simple, lo siguiente:

1. Todas las variables de estado (useState) que existen en el archivo.
2. Todas las funciones/handlers definidos en el archivo.
3. Todos los bloques JSX principales (secciones), con una descripción de una
   línea de qué muestra cada uno.

Devolveme la lista nada más. No edites ningún archivo en este paso.
```

Con esa lista, marcá vos mismo (a mano, respondiéndole al agente en el chat)
cuáles son de mascota virtual (puntos, tienda, ánimo, streak, tareas
diarias con checkbox) y cuáles son de razas/guías/vacunación. Esto evita que
el agente tenga que decidir solo qué es qué.

---

## Sub-paso B — Borrar el estado y las funciones marcadas

```
Leé AGENTS.md primero.

En app/page.tsx, eliminá ÚNICAMENTE estas variables de estado y funciones
que ya identificamos como de mascota virtual:

[PEGÁ ACÁ LA LISTA QUE VOS MARCASTE COMO "mascota virtual" DEL SUB-PASO A]

No toques ninguna otra variable, función, ni el JSX todavía. Solo el
estado y las funciones de esta lista.

Al terminar, decime si el archivo tiene errores de compilación por
referencias rotas (por ejemplo, JSX que todavía usa una función que
borraste). Si los hay, listámelos pero NO los arregles todavía.
```

---

## Sub-paso C — Borrar el JSX correspondiente

```
Leé AGENTS.md primero.

En app/page.tsx, eliminá los bloques JSX de estas secciones (las que
marcamos como mascota virtual):

[PEGÁ ACÁ LOS BLOQUES JSX MARCADOS EN EL SUB-PASO A]

Mantené intacto todo el JSX de razas, guías y vacunación. Si algún bloque
mezcla ambas cosas, decímelo antes de tocarlo en vez de borrar directamente.
```

---

## Sub-paso D — Verificación final

```
Leé AGENTS.md primero.

Corré npm run build (o npm run dev si no hay build script) y decime:
1. Si compiló sin errores.
2. Si hay, listame los errores exactos (archivo, línea, mensaje).
3. Confirmame que no quedó ningún import sin usar relacionado a mascota
   virtual (ícono, emoji, componente).

No arregles nada todavía, solo reportá.
```

Con el reporte del sub-paso D, si hay errores se los pasás como sub-paso
extra ("arreglá este error puntual: ...") de a uno.

---

## Al terminar
Actualizá en `AGENTS.md` el checklist:
```
- [x] Eliminada mascota virtual
```
