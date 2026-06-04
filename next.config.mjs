/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.ssbwiki.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "ssb.wiki.gallery",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
