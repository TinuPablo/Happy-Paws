import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Paws - Mi mascota y yo",
  description: "Aplicación de gestión de mascotas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
