/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
