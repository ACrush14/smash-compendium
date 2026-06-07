/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // SSBWiki
      { protocol: "https", hostname: "www.ssbwiki.com",           pathname: "/images/**" },
      { protocol: "https", hostname: "ssb.wiki.gallery",          pathname: "/images/**" },
      // Fandom (earthbound.fandom.com + CDN Wikia)
      { protocol: "https", hostname: "earthbound.fandom.com",     pathname: "/**" },
      { protocol: "https", hostname: "static.wikia.nocookie.net", pathname: "/**" },
      // Wikipedia Commons — ícones de consoles + box arts de jogos
      { protocol: "https", hostname: "upload.wikimedia.org",      pathname: "/wikipedia/**" },
      // MarioWiki — box arts de jogos do Chronicles
      { protocol: "https", hostname: "mario.wiki.gallery",        pathname: "/images/**" },
    ],
  },
};

export default nextConfig;
