"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OriginGamesPanel, { type OriginGame } from "./OriginGamesPanel";
import FighterDataZone, { type FighterDataZoneData, type Lang } from "./FighterDataZone";
import FighterSuggestions, { type SerializedSuggestion } from "./FighterSuggestions";
import { GAME_META } from "@/lib/smash-meta";
import { t } from "@/lib/ui-i18n";

export type TabName = "SMASH" | "ORIGINS" | "PROFILE";

interface FighterHeader {
  rosterNumber:  number;
  name:          string;
  franchiseName: string;
  appearances:   string[];
  prevSlug?:     string | null;
  nextSlug?:     string | null;
}

interface FighterRightPanelProps {
  fighterId:   string;
  fighterSlug: string;
  suggestions: SerializedSuggestion[];
  header:      FighterHeader;
  originGames: OriginGame[];
  dataZone:    FighterDataZoneData;
  lang:        Lang;
  setLang:     (l: Lang) => void;
  associatedCardsNode?: React.ReactNode;
}

export default function FighterRightPanel({ fighterId, fighterSlug, suggestions, header, originGames, dataZone, lang, setLang, associatedCardsNode }: FighterRightPanelProps) {
  const [activeTab, setActiveTab] = useState<TabName>("SMASH");

  return (
    <div
      className="absolute inset-0 overflow-y-auto"
      style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(64,180,255,0.08) transparent" }}
    >
      {/* ── Fighter Header (sticky — compacto) ────────────────────── */}
      <div
        className="sticky top-0 z-20 border-b border-cyan-500/10 px-10 py-4"
        style={{ background: "rgba(5,5,24,0.96)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Meta + Nome */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-cyan-500/70">
                #{String(header.rosterNumber).padStart(2, "0")}
              </span>
              <span className="font-mono text-[9px] text-cyan-900">·</span>
              <Link
                href={`/franchise/${encodeURIComponent(header.franchiseName)}`}
                className="font-mono text-[9px] uppercase tracking-wider text-cyan-700 hover:text-cyan-400 transition-colors"
                title={`Ver universo ${header.franchiseName}`}
              >
                {header.franchiseName}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {header.prevSlug ? (
                <Link
                  href={`/fighters/${encodeURIComponent(header.prevSlug)}`}
                  className="text-cyan-500/50 hover:text-cyan-400 transition-colors shrink-0"
                  title={`← ${header.prevSlug}`}
                >
                  <ChevronLeft size={28} strokeWidth={2.5} />
                </Link>
              ) : (
                <span className="w-7 shrink-0" />
              )}
              <h1
                className="font-black italic uppercase leading-none tracking-tight text-white fighter-title-glow"
                style={{ fontSize: "clamp(2rem, 2.8vw, 3rem)" }}
              >
                {header.name}
              </h1>
              {header.nextSlug ? (
                <Link
                  href={`/fighters/${encodeURIComponent(header.nextSlug)}`}
                  className="text-cyan-500/50 hover:text-cyan-400 transition-colors shrink-0"
                  title={`${header.nextSlug} →`}
                >
                  <ChevronRight size={28} strokeWidth={2.5} />
                </Link>
              ) : (
                <span className="w-7 shrink-0" />
              )}
            </div>
          </div>

          {/* Badges compactos no header sticky */}
          {header.appearances.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
              {header.appearances.map((ver, i) => {
                const meta = GAME_META[ver];
                if (!meta) return null;
                return (
                  <span key={ver} className={`border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase ${meta.color}`}>
                    {meta.short}
                    {i === 0 && <span className="ml-1 text-[7px] opacity-70">★</span>}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        
        {/* TABS */}
        <div className="mt-4 flex items-center gap-6 border-b border-cyan-500/10">
          <button 
            onClick={() => setActiveTab("SMASH")}
            className={`pb-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${activeTab === "SMASH" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-cyan-900 hover:text-cyan-600"}`}
          >
            Série Smash
          </button>
          <button 
            onClick={() => setActiveTab("ORIGINS")}
            className={`pb-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${activeTab === "ORIGINS" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-cyan-900 hover:text-cyan-600"}`}
          >
            Aparições Originais
          </button>
          <button 
            onClick={() => setActiveTab("PROFILE")}
            className={`pb-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${activeTab === "PROFILE" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-cyan-900 hover:text-cyan-600"}`}
          >
            Perfil & Dados
          </button>
        </div>
      </div>

      {/* ── Showcase: Jogos de Origem ──────────── */}
      {activeTab === "ORIGINS" && (
        <div className="px-10 pt-8 pb-6 flex flex-col gap-6">

          {/* Jogos de Origem com placeholders */}
          {originGames.length > 0 && (
            <OriginGamesPanel games={originGames} lang={lang} />
          )}

          {/* Outras aparições */}
          {header.appearances.length > 1 && (() => {
            const rest = header.appearances.slice(1);
            return (
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cyan-700">
                  {t(lang, "alsoIn")}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {rest.map((ver) => {
                    const meta = GAME_META[ver];
                    if (!meta) return null;
                    return (
                      <span key={ver} className={`border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase ${meta.color}`}>
                        {meta.short}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <div className="h-px bg-gradient-to-r from-cyan-500/20 via-cyan-500/8 to-transparent" />
        </div>
      )}

      {/* ── Data Zone (controlada pelo idioma do panel) ─────────── */}
      <FighterDataZone {...dataZone} lang={lang} setLang={setLang} activeTab={activeTab} />

      {/* ── Sugestões / Comentários ────────────────────────────── */}
      {activeTab === "PROFILE" && (
        <FighterSuggestions
          fighterId={fighterId}
          fighterSlug={fighterSlug}
          fighterName={header.name}
          suggestions={suggestions}
          validSections={header.appearances}
        />
      )}

      {associatedCardsNode}

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-cyan-500/10 px-10 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-black italic text-[10px] tracking-tight text-slate-700 hover:text-slate-500 transition-colors">
            SMASH<span className="text-amber-900">COMPENDIUM</span>
          </Link>
          <span className="font-mono text-[9px] text-slate-800">{t(lang, "fanMade")}</span>
        </div>
      </footer>
    </div>
  );
}
