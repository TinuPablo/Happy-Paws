import type { Metadata } from "next";
import Image from "next/image";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { getSession, toUiRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading-family",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body-family",
});

export const metadata: Metadata = {
  title: "Happy Paws",
  description: "Plataforma de adopción responsable de mascotas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const authState = session
    ? { loggedIn: true, role: toUiRole(session.rol), nombre: session.nombre }
    : { loggedIn: false, role: null, nombre: "" };

  // Campana del header: solo para cuentas de protectora, cuenta de
  // notificaciones sin leer de su propia protectora.
  let notificacionesNoLeidas = 0;
  if (session && session.rol !== "ADOPTANTE") {
    const protectora = await prisma.protectora.findFirst({ where: { duenioId: session.userId } });
    if (protectora) {
      notificacionesNoLeidas = await prisma.notificacion.count({
        where: { protectoraId: protectora.id, leida: false },
      });
    }
  }

  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <AuthProvider session={authState}>
          <Navbar notificacionesNoLeidas={notificacionesNoLeidas} />
          {children}
          <footer className="border-t border-brown-light bg-brown-lightest px-6 py-10 text-center">
            <p className="flex items-center justify-center gap-2 font-heading text-lg font-semibold text-brown-dark">
              <Image
                src="/assets/logo.jpg"
                alt="Happy Paws"
                width={28}
                height={28}
                className="h-7 w-7 rounded-full bg-white object-cover"
              />
              Happy Paws
            </p>
            <p className="mt-1 text-sm text-text-mid">
              Conectando protectoras y familias en Villa Carlos Paz.
            </p>
            <p className="mt-4 text-xs text-text-light">
              © {new Date().getFullYear()} Happy Paws
            </p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
