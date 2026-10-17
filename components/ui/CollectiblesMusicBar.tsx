"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MusicPlayer, { type AudioSource } from "./MusicPlayer";
import { cdnUrl } from "@/lib/media-config";

// Trilha única do site: "Trophy Gallery" (Brawl), versão de 1 hora, em loop.
// O arquivo de áudio é baixado manualmente e colocado em public/audio/ (ver public/audio/LEIA-ME.md).
// O navegador usa a primeira fonte que conseguir tocar.
const TRACK = {
  title:  "Trophy Gallery",
  artist: "Super Smash Bros. Brawl · 1 Hour Ambience Loop",
  sources: [
    { src: cdnUrl("/audio/trophy-gallery.webm"), type: "audio/webm" },
    { src: cdnUrl("/audio/trophy-gallery.ogg"),  type: "audio/ogg"  },
    { src: cdnUrl("/audio/trophy-gallery.mp3"),  type: "audio/mpeg" },
  ] satisfies AudioSource[],
};

const STORAGE_KEY = "smash-music-collapsed";

export default function CollectiblesMusicBar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Lembra se a pessoa recolheu o player (ignora falhas de localStorage, ex.: aba anônima).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Sem preferência salva: no celular começa recolhido (o player completo ocupa muita tela).
      setCollapsed(saved !== null ? saved === "1" : window.innerWidth < 640);
    } catch { /* ignora */ }
  }, []);

  const toggle = () => {
    setCollapsed(c => {
      const next = !c;
      try { localStorage.setItem(STORAGE_KEY, next ? "1" : "0"); } catch { /* ignora */ }
      return next;
    });
  };

  // O layout raiz não remonta entre páginas, então a música segue tocando ao navegar.
  if (pathname.startsWith("/admin")) return null;

  return <MusicPlayer {...TRACK} loop collapsed={collapsed} onToggleCollapse={toggle} />;
}
