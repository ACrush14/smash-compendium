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
  async redirects() {
    return [
      { source: "/games", destination: "/chronicles", permanent: true },
    ];
  },
};

export default nextConfig;
