"use client";

import { useState, useEffect } from "react";
import { GAME_META } from "@/lib/smash-meta";
// ─── Types ────────────────────────────────────────────────────────────────────

export type Lang = "EN" | "PT" | "JP" | "JP_EN";

export interface FighterTip {
  titleEn:  string;
  textEn:   string;
  titlePt?: string | null;
  textPt?:  string | null;
  titleJp?: string | null;
  textJp?:  string | null;
}

export interface SerializedBio {
  smashGameVersion:    string;
  contentEn:           string;
  contentPt:           string | null;
  contentJp:           string | null;
  contentJpEn:         string | null;
  contentJpTranslated: string | null;
}

export interface SerializedCollectible {
  id:               string;
  name:             string;
  nameJp?:          string | null;
  description:      string | null;
  descriptionPt?:   string | null;
  descriptionJp?:   string | null;
  smashGameVersion: string;
}

export interface WorkGame {
  name:          string;
  titleJp?:      string;
  dateStr:       string;   // ex: "1994.08"
  dateStrNa?:    string;
  boxArtPath?:   string;
  boxArtPathJp?: string;
  badgeColor:    string;
  wikiUrl?:      string;
  wikiUrlJp?:    string;
}

export interface FighterDataZoneProps {
  franchiseName:     string;
  curatorOverviewEn: string | null;
  curatorOverviewJp: string | null;
  erasToShow:        string[];
  bios:              SerializedBio[];
  trophiesMap:       Record<string, SerializedCollectible[]>;
  stickersMap:       Record<string, SerializedCollectible[]>;
  appearances:       string[];
  fichaCounters:     { eras: number; trophies: number; stickers: number; spirits: number };
  originWorkGames?:  WorkGame[];
  fightersTips?:     FighterTip[];
  lang:              Lang;
  setLang:           (l: Lang) => void;
}

export type FighterDataZoneData = Omit<FighterDataZoneProps, "lang" | "setLang">;

// ─── PT cache ─────────────────────────────────────────────────────────────────

interface PtCache {
  curator?: string;
  bios:     Record<string, string>; // keyed by smashGameVersion
}

// ─── Language helpers ─────────────────────────────────────────────────────────

function getBioText(
  bio: SerializedBio | null,
  lang: Lang,
  ptCache: PtCache | null,
): string | null {
  if (!bio) return null;

  switch (lang) {
    case "PT":
      return ptCache?.bios[bio.smashGameVersion]
        ?? bio.contentPt
        ?? bio.contentEn;
    case "JP":
      return bio.contentJp ?? null;
    case "JP_EN":
      return bio.contentJpEn ?? bio.contentJpTranslated ?? null;
    default:
      return bio.contentEn;
  }
}

// ─── Language Selector ────────────────────────────────────────────────────────

function LangSelector({
  lang, setLang, hasPt, ptLoading, ptUnavailable,
}: {
  lang:         Lang;
  setLang:      (l: Lang) => void;
  hasPt:        boolean;
  ptLoading:    boolean;
  ptUnavailable: boolean;
}) {
  const TABS: Array<{ id: Lang; label: string }> = [
    { id: "EN",    label: "EN"    },
    { id: "PT",    label: "PT-BR" },
    { id: "JP",    label: "JP"    },
    { id: "JP_EN", label: "JP→EN" },
  ];

  return (
    <div className="flex items-center gap-3 justify-end">
      {ptLoading && (
        <span className="font-mono text-[9px] text-cyan-600 animate-pulse tracking-widest">
          Traduzindo...
        </span>
      )}
      <span className="font-mono text-[13px] uppercase tracking-[0.25em] text-cyan-800">
        Idioma global:
      </span>
      <div
        className="inline-flex border border-cyan-500/15 overflow-hidden"
        style={{ background: "rgba(5,5,24,0.9)" }}
      >
        {TABS.map((tab) => {
          const isPt  = tab.id === "PT";
          const avail = !isPt || (hasPt && !ptUnavailable);
          return (
            <button
              key={tab.id}
              disabled={!avail}
              title={isPt && ptUnavailable ? "Tradução indisponível (configure ANTHROPIC_API_KEY)" : undefined}
              onClick={() => avail && setLang(tab.id)}
              className={[
                "px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest transition-all border-r border-cyan-500/10 last:border-r-0",
                lang === tab.id
                  ? "bg-cyan-500/15 text-cyan-300"
                  : avail
                    ? "text-slate-500 hover:text-slate-300 hover:bg-white/4"
                    : "text-slate-800 cursor-not-allowed",
              ].join(" ")}
            >
              {tab.label}
              {isPt && ptUnavailable && <span className="ml-0.5 text-[8px] opacity-40">✕</span>}
              {lang === tab.id && (
                <span className="block h-0.5 w-full bg-cyan-400 mt-1.5 -mb-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Era Header ───────────────────────────────────────────────────────────────

function EraHeader({ gameVer, isDebut, lang }: { gameVer: string; isDebut: boolean; lang: Lang }) {
  const meta = GAME_META[gameVer];
  if (!meta) return null;

  const useJpMode = lang === "JP" || lang === "JP_EN";
  const infoUrl = useJpMode ? (meta.wikiUrlJp || meta.wikiUrlUsa) : (meta.wikiUrlUsa || meta.wikiUrlJp);

  return (
    <div
      className="flex items-stretch border-b border-white/5 overflow-hidden"
      style={{ background: meta.eraHeaderBg, height: 300 }}
    >
      {/* ── Bloco esquerdo: layout vertical — ícone → nome → data ── */}
      <a
        href={infoUrl || "#"}
        target={infoUrl ? "_blank" : undefined}
        rel={infoUrl ? "noopener noreferrer" : undefined}
        className="flex flex-col justify-between px-5 py-5 shrink-0 relative hover:brightness-125 transition-all cursor-pointer"
        style={{ background: meta.consoleBg, width: 220, borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Badge DEBUT — topo do bloco */}
        {isDebut && (
          <div className="absolute top-0 left-0 right-0 flex justify-center pt-2 z-10">
            <span
              className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] px-3 py-1 leading-none"
              style={{
                color: meta.eraTextColor,
                background: `${meta.eraTextColor}18`,
                border: `1px solid ${meta.eraTextColor}50`,
              }}
            >
              ★ DEBUT
            </span>
          </div>
        )}

        {/* Ícone do console */}
        {meta.consoleIcon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/assets/consoles/${meta.consoleIcon}`}
            alt={meta.consoleFull}
            style={{ width: 120, height: 72, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.80, marginTop: isDebut ? 24 : 0 }}
          />
        )}

        {/* Info do jogo na base */}
        <div className="flex flex-col gap-1.5">
          <span
            className="font-black uppercase leading-none tracking-tight"
            style={{ color: meta.eraTextColor, fontSize: "2.4rem" }}
          >
            {meta.short}
          </span>
          {meta.fullNameEn && (
            <span className="font-mono text-[11px] text-slate-300 leading-snug">
              {meta.fullNameEn}
            </span>
          )}
          {meta.fullNameJp && (
            <span className="font-mono text-[10px] text-slate-500 leading-snug">
              {meta.fullNameJp}
            </span>
          )}
          <span className="font-mono text-[13px] leading-none mt-1" style={{ color: meta.eraTextColor, opacity: 0.65 }}>
            {meta.year}{meta.releaseMonth ? `.${meta.releaseMonth}` : ""}
          </span>
        </div>
      </a>

      {/* ── Box arts: cada uma com link próprio (USA→Wiki EN, JP→Wiki JP) ── */}
      <div className="flex items-end gap-px flex-1">
        {meta.boxArtUsa && (
          <a href={meta.wikiUrlUsa || "#"} target="_blank" rel="noopener noreferrer"
            className="shrink-0 overflow-hidden border-l border-white/10 self-stretch flex items-center hover:brightness-110 transition-all cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={meta.boxArtUsa} alt={`${meta.short} — Box USA`}
              style={{ height: 300, width: "auto", display: "block" }} />
          </a>
        )}
        {meta.boxArtJp && (
          <a href={meta.wikiUrlJp || "#"} target="_blank" rel="noopener noreferrer"
            className="shrink-0 overflow-hidden border-l border-white/[0.08] self-stretch flex items-center hover:brightness-110 transition-all cursor-pointer" style={{ opacity: 0.88 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={meta.boxArtJp} alt={`${meta.short} — Box JP`}
              style={{ height: 300, width: "auto", display: "block" }} />
          </a>
        )}
        {meta.boxArtAlt && (
          <a href={meta.wikiUrlUsa || "#"} target="_blank" rel="noopener noreferrer"
            className="shrink-0 overflow-hidden border-l border-white/10 self-stretch flex items-center hover:brightness-110 transition-all cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={meta.boxArtAlt} alt={`${meta.short} — Box Alt`}
              style={{ height: 300, width: "auto", display: "block" }} />
          </a>
        )}
        {meta.boxArtAltJp && (
          <a href={meta.wikiUrlJp || "#"} target="_blank" rel="noopener noreferrer"
            className="shrink-0 overflow-hidden border-l border-white/[0.08] self-stretch flex items-center hover:brightness-110 transition-all cursor-pointer" style={{ opacity: 0.88 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={meta.boxArtAltJp} alt={`${meta.short} — Box Alt JP`}
              style={{ height: 300, width: "auto", display: "block" }} />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── FighterDataZone ──────────────────────────────────────────────────────────

export default function FighterDataZone({
  franchiseName,
  curatorOverviewEn,
  curatorOverviewJp,
  erasToShow,
  bios,
  trophiesMap,
  stickersMap,
  appearances,
  fichaCounters,
  originWorkGames,
  fightersTips,
  lang,
  setLang,
}: FighterDataZoneProps) {
  const hasPt   = true; // always enabled — AI translates on demand
  const biosMap = Object.fromEntries(bios.map((b) => [b.smashGameVersion, b]));

  // ── PT-BR on-demand translation ──────────────────────────────────────────────
  const [ptCache,       setPtCache]       = useState<PtCache | null>(null);
  const [ptLoading,     setPtLoading]     = useState(false);
  const [ptUnavailable, setPtUnavailable] = useState(false);

  useEffect(() => {
    if (lang !== "PT" || ptCache !== null || ptLoading) return;

    const texts: Record<string, string> = {};

    if (curatorOverviewEn) {
      texts["curator"] = curatorOverviewEn;
    }

    for (const bio of bios) {
      if (!bio.contentPt && bio.contentEn) {
        texts[`bio_${bio.smashGameVersion}`] = bio.contentEn;
      }
    }

    if (Object.keys(texts).length === 0) {
      setPtCache({ bios: {} });
      return;
    }

    setPtLoading(true);
    fetch("/api/translate", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ texts }),
    })
      .then(async (r) => {
        if (!r.ok) {
          setPtUnavailable(true);
          setPtCache({ bios: {} });
          return;
        }
        const data = await r.json() as { translated?: Record<string, string>; error?: string };
        if (data.error || !data.translated) {
          setPtUnavailable(true);
          setPtCache({ bios: {} });
          return;
        }
        const bioCache: Record<string, string> = {};
        for (const [key, val] of Object.entries(data.translated)) {
          if (key.startsWith("bio_")) bioCache[key.slice(4)] = val;
        }
        setPtCache({ curator: data.translated["curator"], bios: bioCache });
      })
      .catch(() => { setPtUnavailable(true); setPtCache({ bios: {} }); })
      .finally(() => setPtLoading(false));
  }, [lang, ptCache, ptLoading, bios, curatorOverviewEn]);

  // ── Curator text resolved by lang ────────────────────────────────────────────
  const curatorText =
    lang === "JP" || lang === "JP_EN" ? (curatorOverviewJp ?? curatorOverviewEn)
    : lang === "PT"                   ? (ptCache?.curator ?? curatorOverviewEn)
    :                                   curatorOverviewEn;

  return (
    <div className="px-10 py-8 flex flex-col gap-8">

      {/* ── Seletor de Idioma Global ──────────────────────────────── */}
      <LangSelector lang={lang} setLang={setLang} hasPt={hasPt} ptLoading={ptLoading} ptUnavailable={ptUnavailable} />

      {/* ── Ficha Catalográfica ──────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="h-px w-5 bg-cyan-500/35" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cyan-700 text-glow-cyan">
            Ficha Catalográfica
          </span>
        </div>

        <div className="border border-cyan-500/12 relative overflow-hidden" style={{ background: "rgba(5,5,24,0.7)" }}>
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />
          <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/40" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500/40" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/40" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/40" />

          <div className="p-6 flex flex-col gap-5">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Eras",     value: fichaCounters.eras     },
                { label: "Troféus",  value: fichaCounters.trophies },
                { label: "Stickers", value: fichaCounters.stickers },
                { label: "Spirits",  value: fichaCounters.spirits  },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-cyan-700">{s.label}</span>
                  <span className="font-mono text-3xl font-bold text-white leading-none">{s.value}</span>
                </div>
              ))}
            </div>

            {curatorOverviewEn && (
              <div className="border-t border-cyan-500/10 pt-5">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-cyan-700 block mb-3">
                  Nota curatorial
                </span>
                {ptLoading && lang === "PT" ? (
                  <div className="flex items-center gap-2">
                    <span className="h-px flex-1 bg-cyan-500/10 animate-pulse" />
                    <span className="font-mono text-[9px] text-cyan-800 animate-pulse">traduzindo...</span>
                    <span className="h-px flex-1 bg-cyan-500/10 animate-pulse" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {(curatorText ?? "")
                      .split(/\n+/)
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i} className="text-sm leading-relaxed text-slate-100 italic">
                          {para}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Linha do Tempo ────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="h-px w-5 bg-cyan-500/35" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cyan-700 text-glow-cyan">
            Linha do Tempo
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {erasToShow.map((gameVer) => {
            const meta      = GAME_META[gameVer];
            const bio       = biosMap[gameVer] ?? null;
            const eraTrophy = trophiesMap[gameVer] ?? [];
            const eraStic   = stickersMap[gameVer] ?? [];
            const isDebut   = appearances[0] === gameVer;
            const bioText   = getBioText(bio, lang, ptCache);
            const isTranslating = ptLoading && lang === "PT" && bio && !bio.contentPt;

            return (
              <div
                key={gameVer}
                className={`border border-white/5 overflow-hidden border-l-2 ${meta?.accent ?? "border-l-white/10"}`}
                style={{ background: "rgba(5,5,24,0.65)" }}
              >
                <EraHeader gameVer={gameVer} isDebut={isDebut} lang={lang} />

                <div className="px-6 pt-5 pb-4">
                  {gameVer === "SSB64" && (
                    <span className="font-mono text-[8px] uppercase tracking-[0.25em] block mb-3" style={{ color: `${meta?.eraTextColor}80` }}>
                      Bios
                    </span>
                  )}
                  {/* Fighters Tips (SSBU) substituem o bio quando disponíveis */}
                  {gameVer === "SSBU" && fightersTips && fightersTips.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {fightersTips.map((tip) => {
                        const tipTitle = lang === "PT" ? (tip.titlePt || tip.titleEn) : lang.startsWith("JP") ? (tip.titleJp || tip.titleEn) : tip.titleEn;
                        const tipText = lang === "PT" ? (tip.textPt || tip.textEn) : lang.startsWith("JP") ? (tip.textJp || tip.textEn) : tip.textEn;
                        return (
                          <div key={tip.titleEn} className="flex flex-col gap-1">
                            <span
                              className="font-mono text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: meta?.eraTextColor }}
                            >
                              {tipTitle}
                            </span>
                            <p className="text-sm leading-relaxed text-slate-300">{tipText}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : isTranslating ? (
                    <div className="flex items-center gap-2">
                      <span className="h-px flex-1 bg-cyan-500/10 animate-pulse" />
                      <span className="font-mono text-[9px] text-cyan-800 animate-pulse">traduzindo...</span>
                      <span className="h-px flex-1 bg-cyan-500/10 animate-pulse" />
                    </div>
                  ) : bioText ? (
                    <p className="text-sm leading-relaxed text-slate-200">{bioText}</p>
                  ) : null}
                </div>

                {(eraTrophy.length > 0 || eraStic.length > 0) && (
                  <div className="px-6 pb-5 flex flex-col gap-4 border-t border-white/5 pt-4">
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-cyan-800">
                      {lang === "JP" || lang === "JP_EN" ? "フィギュア" : lang === "PT" ? "Troféus" : "Trophies"}
                    </span>

                    {eraTrophy.map((t) => {
                      if (lang.startsWith("JP") && !t.descriptionJp) return null;
                      if (lang === "PT" && !t.descriptionPt && !t.description) return null;
                      const desc = lang === "PT" ? (t.descriptionPt || t.description) : lang.startsWith("JP") ? t.descriptionJp : t.description;
                      const title = lang === "PT" ? (t.name) : lang.startsWith("JP") ? (t.nameJp || t.name) : t.name;
                      return desc ? (
                        <div key={t.id} className="border-l-2 pl-4" style={{ borderLeftColor: `${meta?.eraTextColor}30` }}>
                          <p className="font-mono text-[9px] uppercase tracking-wider mb-1.5 opacity-70" style={{ color: meta?.eraTextColor }}>
                            {title}
                          </p>
                          <p className="text-xs leading-relaxed text-slate-300 italic">{desc}</p>
                        </div>
                      ) : null;
                    })}

                    {eraStic.map((s) => {
                      if (lang.startsWith("JP") && !s.descriptionJp) return null;
                      if (lang === "PT" && !s.descriptionPt && !s.description) return null;
                      const desc = lang === "PT" ? (s.descriptionPt || s.description) : lang.startsWith("JP") ? s.descriptionJp : s.description;
                      const title = lang === "PT" ? (s.name) : lang.startsWith("JP") ? (s.nameJp || s.name) : s.name;
                      return desc ? (
                        <div key={s.id} className="border-l-2 border-purple-500/20 pl-4">
                          <p className="font-mono text-[9px] uppercase tracking-wider text-purple-400/70 mb-1.5">{title}</p>
                          <p className="text-xs leading-relaxed text-slate-300 italic">{desc}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                <div className="px-6 pb-4 border-t border-white/5 pt-3 flex flex-col gap-3">
                  {/* Label Works */}
                  <span className="font-mono text-[13px] uppercase tracking-[0.2em] text-cyan-800">Works:</span>

                  {/* Jogos de origem com capa + data */}
                  {originWorkGames && originWorkGames.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {originWorkGames.map((wg) => {
                        const useJpMode = lang === "JP" || lang === "JP_EN";
                        const title = useJpMode && wg.titleJp ? wg.titleJp : wg.name;
                        const artSrc = (useJpMode && wg.boxArtPathJp) ? wg.boxArtPathJp : wg.boxArtPath;
                        const targetUrl = useJpMode ? (wg.wikiUrlJp || wg.wikiUrl) : (wg.wikiUrl || wg.wikiUrlJp);
                        const displayDate = (!useJpMode && wg.dateStrNa) ? wg.dateStrNa : wg.dateStr;

                        return (
                        <a
                          key={wg.name}
                          href={targetUrl || "#"}
                          target={targetUrl ? "_blank" : undefined}
                          rel={targetUrl ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-2.5 group hover:opacity-80 transition-opacity"
                        >
                          {artSrc && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={artSrc}
                              alt={title}
                              style={{ height: 48, width: "auto", display: "block", opacity: 0.9 }}
                              className="border border-white/10 group-hover:border-white/30 transition-colors"
                            />
                          )}
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono text-[22px] font-semibold text-slate-200 leading-none group-hover:text-white transition-colors">
                              {title}
                            </span>
                            <span className="font-mono text-[10px] leading-none" style={{ color: wg.badgeColor }}>
                              {displayDate}
                            </span>
                          </div>
                        </a>
                      )})}
                    </div>
                  )}

                  {/* Badges de troféus/stickers */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {eraTrophy.length > 0 && (
                      <span className={`border px-2 py-0.5 font-mono text-[8px] opacity-70 ${meta?.color ?? ""}`}>
                        {eraTrophy.length} troféu{eraTrophy.length > 1 ? "s" : ""}
                      </span>
                    )}
                    {eraStic.length > 0 && (
                      <span className="border border-purple-900/30 bg-purple-950/20 px-2 py-0.5 font-mono text-[8px] text-purple-500/70">
                        {eraStic.length} sticker{eraStic.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {erasToShow.length === 0 && (
            <p className="font-mono text-xs text-slate-700 italic">
              Nenhuma era catalogada — execute o ETL para popular este lutador.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
