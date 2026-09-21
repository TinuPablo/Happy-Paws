// Headers de seguridad comunes (clickjacking, MIME sniffing, etc.) — no
// dependen de nada del entorno, se mandan siempre.
const HEADERS_COMUNES = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// La Content-Security-Policy solo se manda en producción: en dev, Turbopack
// necesita 'unsafe-eval' y una conexión websocket propia para el hot reload
// que no vale la pena replicar acá — el CSP real importa en lo que
// efectivamente se sirve a los usuarios (`next build` + `next start`).
const CSP_PRODUCCION = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://res.cloudinary.com",
  "media-src 'self' https://res.cloudinary.com",
  "connect-src 'self' https://api.cloudinary.com",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// @ts-ignore
const nextConfig: any = {
  allowedDevOrigins: [
    'lake-varnish-reassign.ngrok-free.dev',
    '127.0.0.1'
  ],
  async headers() {
    const headers = [...HEADERS_COMUNES];
    if (process.env.NODE_ENV === "production") {
      headers.push({ key: "Content-Security-Policy", value: CSP_PRODUCCION });
      headers.push({ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" });
    }
    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
