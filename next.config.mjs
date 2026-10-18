/** @type {import('next').NextConfig} */
const nextConfig = {
  // Testes/builds paralelos usam outra pasta (NEXT_DIST_DIR=.next-test) para não sobrescrever o .next do servidor em produção local.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        // Segurança básica em todas as páginas
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
      {
        // Imagens, vídeos e áudio quase nunca mudam: 7 dias no navegador + 30 dias servindo "velho" enquanto atualiza
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
      {
        // Vídeos e áudio podem ser adicionados depois (o 404 de hoje não pode ficar preso no navegador): cache curto
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
      {
        source: "/audio/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/games", destination: "/chronicles", permanent: true },
    ];
  },
};

export default nextConfig;
