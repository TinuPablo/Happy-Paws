import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { MascotasProvider } from "./context/MascotasContext";
import { SolicitudesProvider } from "./context/SolicitudesContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <AuthProvider>
          <MascotasProvider>
            <SolicitudesProvider>
              <Navbar />
              {children}
              <footer className="border-t border-brown-light bg-brown-lightest px-6 py-10 text-center">
                <p className="font-heading text-lg font-semibold text-brown-dark">
                  🐾 Happy Paws
                </p>
                <p className="mt-1 text-sm text-text-mid">
                  Conectando protectoras y familias en Villa Carlos Paz.
                </p>
                <p className="mt-4 text-xs text-text-light">
                  © {new Date().getFullYear()} Happy Paws
                </p>
              </footer>
            </SolicitudesProvider>
          </MascotasProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
