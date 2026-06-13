import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import CollectiblesMusicBar from "@/components/ui/CollectiblesMusicBar";

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
      </body>
    </html>
  );
}
