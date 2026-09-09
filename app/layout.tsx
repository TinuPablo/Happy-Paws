import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "./components/BottomNav";
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
              <div className="flex h-dvh w-full items-center justify-center bg-[#EDE0CF] sm:p-4">
                <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-brown-lightest sm:h-[844px] sm:max-h-[92vh] sm:max-w-[420px] sm:rounded-[28px] sm:border-2 sm:border-brown-light sm:shadow-[0_8px_40px_rgba(75,40,14,0.18)]">
                  <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                  </div>
                  <BottomNav />
                </div>
              </div>
            </SolicitudesProvider>
          </MascotasProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
