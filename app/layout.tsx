import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { MascotasProvider } from "./context/MascotasContext";
import { SolicitudesProvider } from "./context/SolicitudesContext";

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
    <html lang="es">
      <body>
        <AuthProvider>
          <MascotasProvider>
            <SolicitudesProvider>
              <Navbar />
              {children}
              <footer className="border-t border-brown-light bg-brown-lightest px-6 py-6 text-center text-sm text-text-light">
                © {new Date().getFullYear()} Happy Paws
              </footer>
            </SolicitudesProvider>
          </MascotasProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
