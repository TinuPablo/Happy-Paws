# Prompt 9 — Adoptar requiere login (con redirect de vuelta)

## Contexto para el agente
Todavía no existía un botón de "Adoptar" en el detalle de mascota — lo
agregamos ahora, con la regla de que si no estás logueado, te manda a
/login primero, y después de loguearte te trae de vuelta a la mascota que
querías adoptar (en vez de perderte en /perfil).

## Prompt

```
Leé AGENTS.md.

Tarea 1 — Botón de adoptar en el detalle de mascota

En app/mascotas/[id]/page.tsx, agregá "use client" al principio del archivo
(si no lo tiene ya) y estos imports:

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

(ajustá las rutas relativas de los imports si no coinciden con tu
estructura real)

Adentro del componente, usá:

const { loggedIn, role } = useAuth();
const router = useRouter();

function handleAdoptar() {
  if (!loggedIn) {
    router.push(`/login?redirect=/mascotas/${params.id}`);
    return;
  }
  if (role === "protectora") {
    alert("Las cuentas de protectora no pueden enviar solicitudes de adopción.");
    return;
  }
  alert("Solicitud de adopción enviada (mock). Falta conectar backend real.");
}

Y agregá este botón al final de la ficha de la mascota (después de la
descripción, antes de cerrar el contenedor principal):

<button
  onClick={handleAdoptar}
  className="mt-6 w-full rounded-xl bg-[var(--brown-dark)] px-6 py-3 font-medium text-[var(--brown-lightest)]"
>
  Quiero adoptar a {mascota.nombre}
</button>

(ajustá "mascota" al nombre real de la variable que ya usás en ese archivo
para la mascota encontrada del mock)

Tarea 2 — Login respeta el redirect

En app/(auth)/login/page.tsx, agregá el import:

import { useRouter, useSearchParams } from "next/navigation";

Adentro del componente:

const router = useRouter();
const searchParams = useSearchParams();

En el momento en que ya se llama a login(...) dentro del submit del
formulario (lo que agregamos en el prompt anterior), reemplazá el
router.push("/perfil") por esta lógica:

const redirectTo = searchParams.get("redirect");
router.push(redirectTo || "/perfil");

Así, si venís de intentar adoptar sin sesión, después de loguearte volvés
directo a la ficha de esa mascota en vez de ir a /perfil.

No cambies nada más de login ni del flujo de registro.

Al terminar, corré npm run build y confirmame que compila. Probá
manualmente: sin sesión, entrá a una mascota y tocá "Quiero adoptar" →
debería mandarte a /login → logueate como adoptante → confirmame que volvés
a la misma mascota. Agregá tu entrada a PROGRESS_LOG.md.
```

## Nota para más adelante (no ahora)
El alert de "solicitud enviada" se reemplaza cuando conectemos MySQL por
una creación real de `SolicitudAdopcion` en la base, vinculada al usuario
logueado y a la mascota.
