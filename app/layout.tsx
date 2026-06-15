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
});

export const metadata: Metadata = {
  title: {
    default: "Smash Compendium",
    template: "%s | Smash Compendium",
  },
  description:
    "Museu digital da franquia Super Smash Bros — troféus, spirits, stickers e a história de cada personagem.",
  keywords: ["Super Smash Bros", "Nintendo", "troféus", "spirits", "museum"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-vault-bg text-vault-text antialiased">
        {children}
        <CollectiblesMusicBar />
        <footer className="w-full text-center py-3 font-mono text-[10px] text-cyan-900/60 tracking-widest uppercase border-t border-cyan-500/5 select-none">
          <span className="text-cyan-800/50 mr-3">{APP_VERSION}</span>
          <span className="text-cyan-900/40 mr-3">·</span>
          <span className="mr-3">Alpha Phase</span>
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
