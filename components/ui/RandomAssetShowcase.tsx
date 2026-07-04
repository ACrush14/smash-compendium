"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

export interface ShowcaseAsset {
  name: string;
  url: string;
}

const ROTATE_MS = 10_000;
const FADE_MS = 300;

export function RandomAssetShowcase({ assets }: { assets: ShowcaseAsset[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (assets.length <= 1) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % assets.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [assets.length]);

  const current = assets[index];

  if (!current) {
    return (
      <>
        <ImageIcon className="mb-3 h-16 w-16 text-slate-700 md:h-20 md:w-20" strokeWidth={1} />
        <span className="text-center font-mono text-xs text-slate-600">RENDER 3D<br />AGUARDANDO ASSET</span>
      </>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 transition-opacity"
      style={{ opacity: visible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="relative h-32 w-32 md:h-44 md:w-44" style={{ filter: "drop-shadow(0 0 20px rgba(245,158,11,0.25))" }}>
        <Image src={current.url} alt={current.name} fill className="object-contain" sizes="176px" />
      </div>
      <span className="max-w-[180px] text-center font-mono text-[10px] uppercase tracking-wider text-slate-500">
        {current.name}
      </span>
    </div>
  );
}
