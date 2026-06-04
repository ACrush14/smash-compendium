"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Package } from "lucide-react";

export interface MediaAsset {
  url: string | null;
  label: string;
  sublabel?: string;
  assetType: "render" | "trophy" | "sticker" | "spirit" | "sprite";
}

interface MediaVaultViewerProps {
  assets: MediaAsset[];
}

export default function MediaVaultViewer({ assets }: MediaVaultViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = assets[activeIndex] ?? null;

  return (
    <div
      className="absolute inset-0 flex flex-col bg-slate-950"
      style={{
        background:
          "radial-gradient(ellipse 130% 45% at 50% 0%, rgba(120,53,15,0.16) 0%, transparent 60%), #020617",
      }}
    >
      {/* ── Main Stage (flex-[3] = ~75% da altura) ─────────────── */}
      <div className="flex-[3] min-h-0 flex flex-col">

        {/* Área da imagem: expande para todo espaço disponível */}
        <div className="flex-1 w-full relative flex items-center justify-center p-4 min-h-0">

          {/* Pedestal shadow */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/5 h-6 rounded-full pointer-events-none z-0"
            style={{
              background: "radial-gradient(ellipse 100% 100%, rgba(0,0,0,0.8) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />

          {active && active.url ? (
            <Image
              src={active.url}
              alt={active.label}
              width={800}
              height={800}
              className="w-full h-full object-contain object-center relative z-10"
              style={{
                filter:
                  "drop-shadow(0 24px 48px rgba(0,0,0,0.85)) drop-shadow(0 6px 20px rgba(245,158,11,0.07))",
              }}
              priority
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-700 z-10">
              <ImageIcon className="h-16 w-16" strokeWidth={0.75} />
              <span className="font-mono text-[10px] uppercase tracking-widest">Sem imagem</span>
            </div>
          )}
        </div>

        {/* Label do asset ativo */}
        {active && (
          <div className="shrink-0 text-center pb-3 px-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 leading-tight truncate">
              {active.label}
            </p>
            {active.sublabel && (
              <p className="mt-0.5 font-mono text-[9px] text-slate-700 truncate">{active.sublabel}</p>
            )}
          </div>
        )}
      </div>

      {/* ── Gallery Carousel (flex-[1] = ~25% da altura) ────────── */}
      <div className="flex-[1] min-h-0 border-t border-white/5 flex flex-col justify-center px-4 py-3 overflow-hidden">
        <span className="shrink-0 block mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-700">
          Acervo · {assets.length} artefatos
        </span>
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {assets.map((asset, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                title={asset.label}
                onClick={() => setActiveIndex(i)}
                className={[
                  "shrink-0 relative flex items-center justify-center w-14 h-14 border transition-all duration-100 overflow-hidden",
                  isActive
                    ? "border-amber-500/60 bg-amber-950/30 shadow-[0_0_14px_rgba(245,158,11,0.14)]"
                    : "border-white/5 bg-slate-900/50 hover:border-white/15 hover:bg-slate-800/40",
                ].join(" ")}
              >
                {asset.url ? (
                  <Image
                    src={asset.url}
                    alt={asset.label}
                    width={44}
                    height={44}
                    className="object-contain h-11 w-11"
                  />
                ) : (
                  <Package className="h-4 w-4 text-slate-700" strokeWidth={1} />
                )}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-px bg-amber-500/60" />
                )}
              </button>
            );
          })}

          {assets.length === 0 && (
            <p className="font-mono text-[10px] text-slate-700 italic self-center">
              Nenhum artefato catalogado
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
