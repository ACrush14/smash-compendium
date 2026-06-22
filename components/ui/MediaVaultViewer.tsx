"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImageIcon, Package, ChevronLeft, ChevronRight } from "lucide-react";
import MusicPlayer, { type MusicTrack } from "@/components/ui/MusicPlayer";
import { t, type UILang } from "@/lib/ui-i18n";

export type EraFilter = "N64" | "SSBM" | "SSBB" | "SSB4" | "SSBU" | "WORKS";

export interface MediaAsset {
  url:       string | null;
  label:     string;
  sublabel?: string;
  assetType:
    | "render" | "trophy" | "sticker" | "spirit" | "sprite"
    | "clay" | "art" | "gif" | "video" | "cover";
  href?: string;
  era?:  EraFilter;
}

interface MediaVaultViewerProps {
  assets: MediaAsset[];
  music?: MusicTrack;
  lang?:  UILang;
}

const IS_PLACEHOLDER = (t: MediaAsset["assetType"]) => t.startsWith("placeholder-");
const IS_GIF = (url: string | null) => !!url && url.toLowerCase().endsWith(".gif");
const IS_VIDEO = (url: string | null) => !!url && (url.toLowerCase().endsWith(".webm") || url.toLowerCase().endsWith(".mp4"));

// Glow class por tipo de asset
const ASSET_GLOW_CLASS: Partial<Record<MediaAsset["assetType"], string>> = {
  render:  "thumb-active-glow",
  trophy:  "thumb-trophy-glow",
  sticker: "thumb-sticker-glow",
  spirit:  "thumb-spirit-glow",
  sprite:  "thumb-sprite-glow",
  clay:    "thumb-active-glow",
  art:     "thumb-trophy-glow",
  gif:     "thumb-sprite-glow",
};

// Cor de acento do label do asset ativo
const ASSET_ACCENT: Partial<Record<MediaAsset["assetType"], string>> = {
  render:  "text-amber-400",
  trophy:  "text-sky-400",
  sticker: "text-purple-400",
  spirit:  "text-red-400",
  sprite:  "text-emerald-400",
  clay:    "text-amber-500",
  art:     "text-sky-300",
  gif:     "text-pink-400",
};

// Label exibido nos slots de placeholder no carrossel
const PLACEHOLDER_TAG: Partial<Record<MediaAsset["assetType"], { label: string; color: string }>> = {
  "clay":  { label: "CLAY",  color: "#a78bfa" },
  "art":   { label: "ART",   color: "#fbbf24" },
  "gif":   { label: "GIF",   color: "#34d399" },
  "video": { label: "VIDEO", color: "#f87171" },
};

const ERA_BUTTONS: { era: EraFilter; label: string }[] = [
  { era: "N64",   label: "N64"     },
  { era: "SSBM",  label: "Melee"   },
  { era: "SSBB",  label: "Brawl"   },
  { era: "SSB4",  label: "Smash 4" },
  { era: "WORKS", label: "Works"   },
];

const ERA_BTN_STYLE: Record<EraFilter, string> = {
  N64:   "text-yellow-400 border-yellow-500/50 bg-yellow-500/10",
  SSBM:  "text-indigo-400 border-indigo-500/50 bg-indigo-500/10",
  SSBB:  "text-emerald-400 border-emerald-500/50 bg-emerald-500/10",
  SSB4:  "text-red-400 border-red-500/50 bg-red-500/10",
  SSBU:  "text-cyan-400 border-cyan-500/50 bg-cyan-500/10",
  WORKS: "text-purple-400 border-purple-500/50 bg-purple-500/10",
};

export default function MediaVaultViewer({ assets, music, lang = "EN" }: MediaVaultViewerProps) {
  const [activeEra, setActiveEra] = useState<EraFilter | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const filteredAssets = activeEra
    ? assets.filter((a) => a.era === activeEra)
    : assets;

  const active = filteredAssets[activeIndex] ?? null;

  // Reset active index when era changes
  const handleEraClick = (era: EraFilter) => {
    setActiveEra((prev) => (prev === era ? null : era));
    setActiveIndex(0);
  };

  // Eras that actually have assets
  const availableEras = new Set(assets.map((a) => a.era).filter(Boolean) as EraFilter[]);

  function scrollStrip(dir: "left" | "right") {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -180 : 180, behavior: "smooth" });
  }

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse 130% 45% at 50% 0%, rgba(120,53,15,0.13) 0%, transparent 60%), #0a0a2a",
      }}
    >
      {/* ── Main Stage (flex-[3] ≈ 75% da altura) ─────────────────── */}
      <div className="flex-[3] min-h-0 flex flex-col">

        {/* Área da imagem */}
        <div className="flex-1 w-full relative flex items-center justify-center p-4 min-h-0">

          {/* Sombra de pedestal */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/5 h-6 rounded-full pointer-events-none z-0"
            style={{
              background: "radial-gradient(ellipse 100% 100%, rgba(0,0,0,0.85) 0%, transparent 70%)",
              filter:     "blur(10px)",
            }}
          />

          <div
            className="absolute inset-8 pointer-events-none z-0 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(64,180,255,0.1) 0%, transparent 70%)",
            }}
          />

          {active && (active.assetType === "spirit" || active.assetType === "render") && (
            <>
              <div className="spirit-rays absolute inset-0 pointer-events-none" />
              <div className="spirit-glow absolute inset-0 pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                <span className="spirit-star ss-1"  /><span className="spirit-star ss-2"  />
                <span className="spirit-star ss-3"  /><span className="spirit-star ss-4"  />
                <span className="spirit-star ss-5"  /><span className="spirit-star ss-6"  />
                <span className="spirit-star ss-7"  /><span className="spirit-star ss-8"  />
                <span className="spirit-star ss-9"  /><span className="spirit-star ss-10" />
                <span className="spirit-star ss-11" /><span className="spirit-star ss-12" />
                <span className="spirit-orb so-1"   /><span className="spirit-orb so-2"   />
                <span className="spirit-orb so-3"   /><span className="spirit-orb so-4"   />
                <span className="spirit-orb so-5"   /><span className="spirit-orb so-6"   />
                <span className="spirit-orb so-7"   /><span className="spirit-orb so-8"   />
                <span className="spirit-orb so-9"   /><span className="spirit-orb so-10"  />
                <span className="spirit-orb so-11"  /><span className="spirit-orb so-12"  />
                <span className="spirit-rise sr-1"  /><span className="spirit-rise sr-2"  />
                <span className="spirit-rise sr-3"  /><span className="spirit-rise sr-4"  />
              </div>
            </>
          )}

          {active && active.url ? (
            IS_VIDEO(active.url) ? (
              active.href ? (
                <a href={active.href} className="w-full h-full relative z-10 block group cursor-pointer" title={`Ver página de ${active.label}`}>
                  <video src={active.url} autoPlay loop muted playsInline className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300" style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.9)) drop-shadow(0 6px 20px rgba(64,180,255,0.06))" }} />
                </a>
              ) : (
                <video src={active.url} autoPlay loop muted playsInline className="w-full h-full object-contain object-center relative z-10" style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.9)) drop-shadow(0 6px 20px rgba(64,180,255,0.06))" }} />
              )
            ) : active.href ? (
              <a href={active.href} className="w-full h-full relative z-10 block group cursor-pointer" title={`Ver página de ${active.label}`}>
                <Image
                  src={active.url}
                  alt={active.label}
                  width={800}
                  height={800}
                  className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.9)) drop-shadow(0 6px 20px rgba(64,180,255,0.06))",
                    imageRendering: IS_GIF(active.url) ? "pixelated" : undefined,
                  }}
                  priority
                  unoptimized={IS_GIF(active.url)}
                />
              </a>
            ) : (
              <Image
                src={active.url}
                alt={active.label}
                width={800}
                height={800}
                className="w-full h-full object-contain object-center relative z-10"
                style={{
                  filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.9)) drop-shadow(0 6px 20px rgba(64,180,255,0.06))",
                  imageRendering: IS_GIF(active.url) ? "pixelated" : undefined,
                }}
                priority
                unoptimized={IS_GIF(active.url)}
              />
            )
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-700 z-10">
              <ImageIcon className="h-16 w-16" strokeWidth={0.75} />
              <span className="font-mono text-[10px] uppercase tracking-widest">{t(lang, "noImage")}</span>
            </div>
          )}
        </div>

        {/* Label do asset ativo */}
        {active && (
          <div className="shrink-0 text-center pb-4 px-6">
            <p className={`font-mono text-[13px] font-semibold uppercase tracking-widest leading-tight ${ASSET_ACCENT[active.assetType]}`}>
              {active.href ? (
                <a href={active.href} className="hover:underline flex items-center justify-center gap-1">
                  {active.label} <span className="text-[10px] opacity-70">↗</span>
                </a>
              ) : active.label}
            </p>
            {active.sublabel && (
              <p className="mt-1.5 font-mono text-[11px] text-slate-500 leading-snug">{active.sublabel}</p>
            )}
          </div>
        )}
      </div>

      {/* ── Music Player ─────────────────────────────────────────── */}
      {music && <MusicPlayer {...music} />}

      {/* ── Era Filter Buttons ───────────────────────────────────── */}
      {availableEras.size > 0 && (
        <div
          className="shrink-0 flex gap-1.5 px-4 py-2 flex-wrap"
          style={{ borderTop: "1px solid rgba(64,180,255,0.07)", background: "rgba(5,5,24,0.6)" }}
        >
          {ERA_BUTTONS.filter((b) => availableEras.has(b.era)).map(({ era, label }) => {
            const isActive = activeEra === era;
            return (
              <button
                key={era}
                onClick={() => handleEraClick(era)}
                className={[
                  "font-mono text-[8px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 border transition-all",
                  isActive
                    ? ERA_BTN_STYLE[era]
                    : "text-slate-600 border-white/8 hover:text-slate-400 hover:border-white/20",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Gallery Carousel ────────────────────────────────────── */}
      <div
        className="flex-[1] min-h-0 flex flex-col justify-center px-4 py-3 overflow-hidden"
        style={{
          borderTop:  "1px solid rgba(64,180,255,0.07)",
          background: "rgba(5,5,24,0.5)",
        }}
      >
        {/* Contador + nav buttons */}
        <div className="shrink-0 flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-800">
            {t(lang, "collection")} · {filteredAssets.length} {t(lang, "artifacts")}
          </span>
          {filteredAssets.length > 4 && (
            <div className="flex gap-1">
              <button
                onClick={() => scrollStrip("left")}
                aria-label="Rolar para esquerda"
                className="flex items-center justify-center w-7 h-7 border border-cyan-500/20 text-cyan-700 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                style={{ background: "rgba(5,5,24,0.8)" }}
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => scrollStrip("right")}
                aria-label="Rolar para direita"
                className="flex items-center justify-center w-7 h-7 border border-cyan-500/20 text-cyan-700 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                style={{ background: "rgba(5,5,24,0.8)" }}
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

        {/* Strip de thumbnails */}
        <div ref={stripRef} className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filteredAssets.map((asset, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                title={asset.label}
                onClick={() => setActiveIndex(i)}
                className={[
                  "shrink-0 relative flex items-center justify-center w-14 h-14 transition-all duration-150 overflow-hidden",
                  // border base
                  isActive
                    ? "border border-transparent"       // border transparente pois o glow já delimita
                    : "border border-white/5 bg-[#080820]/60 hover:border-cyan-500/15 hover:bg-[#0a0a28]/80",
                ].join(" ")}
                style={isActive ? {
                  transform:  "scale(1.10)",
                  zIndex:     1,
                  background: "rgba(5,5,24,0.9)",
                } : undefined}
              >
                {/* Classe de glow via CSS (definida em globals.css) */}
                {isActive && (
                  <span
                    className={`absolute inset-0 pointer-events-none ${ASSET_GLOW_CLASS[asset.assetType]}`}
                  />
                )}

                {IS_PLACEHOLDER(asset.assetType) ? (
                  /* Slot reservado — pipeline futuro */
                  <div className="flex flex-col items-center justify-center gap-0.5 z-10">
                    <span
                      className="font-mono font-bold leading-none"
                      style={{ fontSize: 7, color: PLACEHOLDER_TAG[asset.assetType]?.color ?? "#555" }}
                    >
                      {PLACEHOLDER_TAG[asset.assetType]?.label ?? "?"}
                    </span>
                    <div className="w-3 h-px opacity-30" style={{ background: PLACEHOLDER_TAG[asset.assetType]?.color }} />
                  </div>
                ) : asset.url ? (
                  IS_VIDEO(asset.url) ? (
                    <video
                      src={asset.url}
                      autoPlay loop muted playsInline
                      className="object-cover h-11 w-11 relative z-10 pointer-events-none"
                    />
                  ) : (
                    <Image
                      src={asset.url}
                      alt={asset.label}
                      width={44}
                      height={44}
                      className="object-contain h-11 w-11 relative z-10"
                      unoptimized={IS_GIF(asset.url)}
                    />
                  )
                ) : (
                  <Package className="h-4 w-4 text-slate-700 relative z-10" strokeWidth={1} />
                )}

                {/* Linha de seleção no fundo — estilo cursor do Smash */}
                {isActive && (
                  <span
                    className="absolute inset-x-0 bottom-0 h-[2px] z-20"
                    style={{
                      background: asset.assetType === "render"  ? "rgba(250,204,21,0.9)"  :
                                  asset.assetType === "trophy"  ? "rgba(56,189,248,0.9)"  :
                                  asset.assetType === "sticker" ? "rgba(192,132,252,0.9)" :
                                  asset.assetType === "spirit"  ? "rgba(239,68,68,0.9)"   :
                                                                  "rgba(52,211,153,0.9)",
                    }}
                  />
                )}
              </button>
            );
          })}

          {filteredAssets.length === 0 && (
            <p className="font-mono text-[10px] text-slate-700 italic self-center">
              {t(lang, "noArtifacts")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
