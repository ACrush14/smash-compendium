import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import CollectiblesMusicBar from "@/components/ui/CollectiblesMusicBar";
import { APP_VERSION } from "@/lib/version";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: false, // só poucas páginas usam; carrega sob demanda em vez de pesar todas as visitas
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://smashcompendium.com"),
  title: {
    default: "Smash Compendium",
    template: "%s | Smash Compendium",
  },
  description:
    "Museu digital da franquia Super Smash Bros — troféus, spirits, stickers e a história de cada personagem.",
  keywords: ["Super Smash Bros", "Nintendo", "troféus", "spirits", "museum"],
  openGraph: {
    type: "website",
    siteName: "Smash Compendium",
    locale: "pt_BR",
    title: "Smash Compendium",
    description:
      "Museu digital da franquia Super Smash Bros — troféus, spirits, stickers e a história de cada personagem.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Conexão antecipada com os servidores de imagens dos troféus */}
        <link rel="preconnect" href="https://ssb.wiki.gallery" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.ssbwiki.com" />
      </head>
      <body className="min-h-screen bg-vault-bg text-vault-text antialiased">
        <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
        <div id="conteudo" tabIndex={-1} className="outline-none">
          {children}
        </div>
        <CollectiblesMusicBar />
        <footer className="w-full text-center pt-3 pb-28 font-mono text-[10px] text-cyan-900/60 tracking-widest uppercase border-t border-cyan-500/5 select-none">
          <span className="text-cyan-800/50 mr-3">{APP_VERSION}</span>
          <span className="text-cyan-900/40 mr-3">·</span>
          <span className="mr-3">Beta Phase</span>
          <span className="text-cyan-900/40 mr-3">·</span>
          Made by{" "}
          <a
            href="https://andersoncrushdev.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700/70 hover:text-cyan-400 transition-colors"
          >
            Anderson Crush
          </a>
        </footer>
      </body>
    </html>
  );
}
