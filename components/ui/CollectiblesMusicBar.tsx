"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MusicPlayer from "./MusicPlayer";

interface Track { youtubeId: string; title: string; artist: string; }

// Rotação de menus/galerias de troféus & spirits pela história da série
const TRACKS: Track[] = [
  { youtubeId: "omS360U3g6Y", title: "Menu",               artist: "Super Smash Bros." },
  { youtubeId: "XesLSGRTwxM", title: "How to Play",         artist: "Super Smash Bros." },
  { youtubeId: "kaXGfHXl-q8", title: "Menu",                artist: "Super Smash Bros. Melee" },
  { youtubeId: "N480Ogy1_Go", title: "Trophies",            artist: "Super Smash Bros. Melee" },
  { youtubeId: "PCAjipTpk3k", title: "Trophy Gallery",      artist: "Super Smash Bros. Brawl" },
  { youtubeId: "KmsHxQlVoSk", title: "Trophy Shop",         artist: "Super Smash Bros. for Nintendo 3DS / Wii U" },
  { youtubeId: "E2hAVnmPXjI", title: "Spirits: Collection", artist: "Super Smash Bros. Ultimate" },
];

function pickRandomTrack(excludeId?: string): Track {
  const pool = excludeId ? TRACKS.filter(t => t.youtubeId !== excludeId) : TRACKS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function CollectiblesMusicBar() {
  const pathname = usePathname();
  const showMusic = pathname === "/" || pathname === "/collectibles" || pathname === "/chronicles" || pathname.startsWith("/fighters") || pathname === "/music";

  // Começa com a primeira faixa (evita mismatch de hidratação) e sorteia após montar no cliente.
  const [track, setTrack] = useState<Track>(TRACKS[0]);
  useEffect(() => {
    setTrack(pickRandomTrack());
  }, []);

  if (!showMusic) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto w-full pointer-events-auto">
      <MusicPlayer
        youtubeId={track.youtubeId}
        title={track.title}
        artist={track.artist}
        autoPlay
        onEnded={() => setTrack(prev => pickRandomTrack(prev.youtubeId))}
      />
    </div>
  );
}
