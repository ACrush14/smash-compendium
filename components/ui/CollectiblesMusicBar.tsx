"use client";

import { usePathname } from "next/navigation";
import MusicPlayer from "./MusicPlayer";

// Trophy Gallery — Super Smash Bros. Brawl (YouTube ID: PCAjipTpk3k)
const TROPHY_GALLERY: { youtubeId: string; title: string; artist: string } = {
  youtubeId: "PCAjipTpk3k",
  title:     "Trophy Gallery",
  artist:    "Super Smash Bros. Brawl",
};

export default function CollectiblesMusicBar() {
  const pathname = usePathname();
  const showMusic = pathname === "/" || pathname === "/collectibles" || pathname === "/chronicles" || pathname.startsWith("/fighters") || pathname === "/music";
  if (!showMusic) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto w-full pointer-events-auto">
      <MusicPlayer
        youtubeId={TROPHY_GALLERY.youtubeId}
        title={TROPHY_GALLERY.title}
        artist={TROPHY_GALLERY.artist}
        autoPlay
      />
    </div>
  );
}
