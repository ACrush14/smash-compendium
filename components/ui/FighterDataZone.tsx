"use client";

import { useState, useEffect } from "react";
import { GAME_META } from "@/lib/smash-meta";
import SuggestionPanel from "@/components/ui/SuggestionPanel";
import LocalVideoGif from "@/components/ui/LocalVideoGif";
import { t } from "@/lib/ui-i18n";
// ─── Types ────────────────────────────────────────────────────────────────────

export type Lang = "EN" | "PT" | "JP" | "JP_EN";

export interface FighterTip {
  titleEn:  string;
  textEn:   string;
  titlePt?: string | null;
  textPt?:  string | null;
  titleJp?: string | null;
  textJp?:  string | null;
  titleJpEn?: string | null;
  textJpEn?:  string | null;
}

export interface SerializedBio {
  smashGameVersion:    string;
  contentEn:           string;
  contentPt:           string | null;
  contentJp:           string | null;
  contentJpEn:         string | null;
  contentJpTranslated: string | null;
  videoStartSec?:      number | null;
  videoEndSec?:        number | null;
}

export interface SerializedMove {
  smashGameVersion: string;
  order:            number;
  label:            string | null;
  descEn:           string | null;
  descPt:           string | null;
  descJp:           string | null;
  descJpEn:         string | null;
}

export interface SerializedCollectible {
  id:               string;
  name:             string;
  nameJp?:          string | null;
  description:      string | null;
  descriptionPt?:   string | null;
  descriptionJp?:   string | null;
  descriptionJpEn?: string | null;
  smashGameVersion: string;
  sourceType:       string;
  assetRenderUrl?:  string | null;
  videoStartSec?:   number | null;
  videoEndSec?:     number | null;
  videoStartSec2?:  number | null;
  videoEndSec2?:    number | null;
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
  fighterId:         string;
  franchiseName:     string;
  curatorOverviewEn: string | null;
  curatorOverviewJp: string | null;
  curatorOverviewJpEn: string | null;
  curatorOverviewPt: string | null;
  erasToShow:        string[];
  bios:              SerializedBio[];
  trophiesMap:       Record<string, SerializedCollectible[]>;
  stickersMap:       Record<string, SerializedCollectible[]>;
  appearances:       string[];
  fichaCounters:     { eras: number; trophies: number; stickers: number; spirits: number };
  originWorkGames?:  WorkGame[];
  worksPerGame?:     Record<string, WorkGame[]>;
  movesMap?:         Record<string, SerializedMove[]>;
  fightersTips?:     FighterTip[];
  lang:              Lang;
  setLang:           (l: Lang) => void;
  activeTab?:        "SMASH" | "ORIGINS" | "PROFILE";
}

export type FighterDataZoneData = Omit<FighterDataZoneProps, "lang" | "setLang" | "activeTab">;

// ─── Language helpers ─────────────────────────────────────────────────────────

function getMoveText(mv: SerializedMove, lang: Lang): string | null {
  switch (lang) {
    case "PT":    return mv.descPt ?? mv.descEn ?? mv.descJpEn;
    case "JP":    return mv.descJp ?? null;
    case "JP_EN": return mv.descJpEn ?? mv.descEn;
    default:      return mv.descEn ?? mv.descJpEn;
  }
}

function getBioText(
  bio: SerializedBio | null,
  lang: Lang,
): string | null {
  if (!bio) return null;

  switch (lang) {
    case "PT":
      return bio.contentPt ?? bio.contentEn;
    case "JP":
      return bio.contentJp ?? null;
    case "JP_EN":
      return bio.contentJpEn ?? bio.contentJpTranslated ?? null;
    default:
      return bio.contentEn;
  }
}

// ─── Language Selector ────────────────────────────────────────────────────────

// Flag image component using flagcdn.com
function Flag({ code, size = 24 }: { code: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code.toUpperCase()}
      width={size}
      height={size * 0.667}
      style={{ objectFit: "cover", borderRadius: 2, display: "block" }}
    />
  );
}

const TABS: Array<{ id: Lang; flags: React.ReactNode; title: string }> = [
  {
    id: "EN",
    flags: <Flag code="gb" size={26} />,
    title: "English",
  },
  {
    id: "PT",
    flags: <Flag code="br" size={26} />,
    title: "Português (Brasil)",
  },
  {
    id: "JP",
    flags: <Flag code="jp" size={26} />,
    title: "日本語",
  },
  {
    id: "JP_EN",
    flags: (
      <span className="flex items-center gap-0.5">
        <Flag code="jp" size={22} />
        <span className="font-mono text-[9px] text-slate-500">→</span>
        <Flag code="us" size={22} />
      </span>
    ),
    title: "JP → English",
  },
];

function LangSelector({
  lang, setLang,
}: {
  lang:         Lang;
  setLang:      (l: Lang) => void;
}) {
  return (
    <div className="flex items-center gap-3 justify-end">
      <span className="font-mono text-[13px] uppercase tracking-[0.25em] text-cyan-800">
        {t(lang, "globalLanguage")}
      </span>
      <div
        className="inline-flex border border-cyan-500/15 overflow-hidden"
        style={{ background: "rgba(5,5,24,0.9)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            title={tab.title}
            onClick={() => setLang(tab.id)}
            className={[
              "px-3 py-2 flex flex-col items-center gap-1 transition-all border-r border-cyan-500/10 last:border-r-0 leading-none",
              lang === tab.id
                ? "bg-cyan-500/15"
                : "opacity-40 hover:opacity-80 hover:bg-white/4",
            ].join(" ")}
          >
            {tab.flags}
            {lang === tab.id && (
              <span className="block h-0.5 w-full bg-cyan-400" />
            )}
          </button>
        ))}
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

  if (!isDebut) {
    return (
      <div className="flex items-stretch border-b border-white/5 overflow-hidden justify-between" style={{ background: meta.eraHeaderBg, height: 110 }}>
        <a href={infoUrl || "#"} target={infoUrl ? "_blank" : undefined} rel={infoUrl ? "noopener noreferrer" : undefined} className="flex items-center gap-5 px-6 shrink-0 relative hover:brightness-125 transition-all cursor-pointer flex-1" style={{ background: meta.consoleBg }}>
          {meta.consoleIcon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/assets/consoles/${meta.consoleIcon}`} alt={meta.consoleFull} style={{ width: 80, height: 48, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }} />
          )}
          <div className="flex flex-col">
            <span className="font-black uppercase leading-none tracking-tight" style={{ color: meta.eraTextColor, fontSize: "1.8rem" }}>{meta.short}</span>
            <span className="font-mono text-[11px] leading-none mt-1.5" style={{ color: meta.eraTextColor, opacity: 0.65 }}>{meta.year}{meta.releaseMonth ? `.${meta.releaseMonth}` : ""}</span>
          </div>
        </a>

        <div className="flex items-end gap-px shrink-0">
          {meta.boxArtUsa && (
            <a href={meta.wikiUrlUsa || "#"} target="_blank" rel="noopener noreferrer" className="shrink-0 overflow-hidden border-l border-white/10 self-stretch flex items-center hover:brightness-110 transition-all cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={meta.boxArtUsa} alt={`${meta.short} — Box USA`} style={{ height: 110, width: "auto", display: "block" }} />
            </a>
          )}
          {meta.boxArtJp && (
            <a href={meta.wikiUrlJp || "#"} target="_blank" rel="noopener noreferrer" className="shrink-0 overflow-hidden border-l border-white/[0.08] self-stretch flex items-center hover:brightness-110 transition-all cursor-pointer" style={{ opacity: 0.88 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={meta.boxArtJp} alt={`${meta.short} — Box JP`} style={{ height: 110, width: "auto", display: "block" }} />
            </a>
          )}
          {meta.boxArtAlt && (
            <a href={meta.wikiUrlUsa || "#"} target="_blank" rel="noopener noreferrer" className="shrink-0 overflow-hidden border-l border-white/10 self-stretch flex items-center hover:brightness-110 transition-all cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={meta.boxArtAlt} alt={`${meta.short} — Box Alt`} style={{ height: 110, width: "auto", display: "block" }} />
            </a>
          )}
          {meta.boxArtAltJp && (
            <a href={meta.wikiUrlJp || "#"} target="_blank" rel="noopener noreferrer" className="shrink-0 overflow-hidden border-l border-white/[0.08] self-stretch flex items-center hover:brightness-110 transition-all cursor-pointer" style={{ opacity: 0.88 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={meta.boxArtAltJp} alt={`${meta.short} — Box Alt JP`} style={{ height: 110, width: "auto", display: "block" }} />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-stretch border-b border-white/5 overflow-hidden"
      style={{ background: meta.eraHeaderBg, height: 300 }}
    >
      <a
        href={infoUrl || "#"}
        target={infoUrl ? "_blank" : undefined}
        rel={infoUrl ? "noopener noreferrer" : undefined}
        className="flex flex-col justify-between px-5 py-5 shrink-0 relative hover:brightness-125 transition-all cursor-pointer"
        style={{ background: meta.consoleBg, width: 220, borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
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

        {meta.consoleIcon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/assets/consoles/${meta.consoleIcon}`}
            alt={meta.consoleFull}
            style={{ width: 120, height: 72, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.80, marginTop: isDebut ? 24 : 0 }}
          />
        )}

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

export default function FighterDataZone(props: FighterDataZoneProps) {
  const {
    fighterId,
    curatorOverviewEn, curatorOverviewJp, curatorOverviewJpEn, curatorOverviewPt,
    erasToShow, bios, trophiesMap, stickersMap, appearances, fichaCounters,
    originWorkGames, worksPerGame, movesMap, fightersTips, lang, setLang, activeTab = "SMASH",
  } = props;

  const biosMap = Object.fromEntries(bios.map((b) => [b.smashGameVersion, b]));

  const curatorText =
    lang === "JP_EN" ? (curatorOverviewJpEn ?? curatorOverviewEn)
    : lang === "JP"  ? (curatorOverviewJp ?? curatorOverviewEn)
    : lang === "PT"  ? (curatorOverviewPt ?? curatorOverviewEn)
    :                  curatorOverviewEn;

  return (
    <div className="px-10 py-8 flex flex-col gap-8">

      <LangSelector lang={lang} setLang={setLang} />

      {activeTab === "PROFILE" && (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="h-px w-5 bg-cyan-500/35" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-700 text-glow-cyan">
            {t(lang, "profile")}
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
                { label: t(lang, "eras"),     value: fichaCounters.eras     },
                { label: t(lang, "trophies"), value: fichaCounters.trophies },
                { label: t(lang, "stickers"), value: fichaCounters.stickers },
                { label: t(lang, "spirits"),  value: fichaCounters.spirits  },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-cyan-700">{s.label}</span>
                  <span className="font-mono text-3xl font-bold text-white leading-none">{s.value}</span>
                </div>
              ))}
            </div>

            {curatorOverviewEn && (
              <div className="border-t border-cyan-500/10 pt-5">
                <div className="flex gap-4 items-center">
                  <span className="text-xl font-bold uppercase tracking-widest text-cyan-400">
                    {lang === "JP_EN" && curatorOverviewJpEn
                      ? t(lang, "curatorLiteral")
                      : t(lang, "curatorOverview")}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {(curatorText ?? "")
                    .split(/\n+/)
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i} className="text-[15px] leading-relaxed text-slate-100 italic">
                        {para}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {activeTab === "SMASH" && (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="h-px w-5 bg-cyan-500/35" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-700 text-glow-cyan">
            {t(lang, "timeline")}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {erasToShow.map((gameVer, index) => {
            const LOCAL_VIDEOS: Record<string, string> = {
              SSB64: "/videos/full_SSB64_video.mp4",
              SSBM: "/videos/full_video_Zoomzike.mp4",
            };

            const TROPHY_LOCAL_VIDEOS: Record<string, string> = {
              SSBM: "/videos/full_video_Zoomzike.mp4",
              SSBB: "/videos/full_video_brawl.mp4",
              SSB4: "/videos/full_video_ssb4_wiiu.mp4",
            };

            const meta      = GAME_META[gameVer];
            const bio       = biosMap[gameVer] ?? null;
            const eraTrophy = trophiesMap[gameVer] ?? [];
            const eraStic   = stickersMap[gameVer] ?? [];
            const isDebut   = index === 0;
            const bioText   = getBioText(bio, lang);
            const eraMoves  = (movesMap?.[gameVer] ?? [])
              .map((mv) => ({ mv, text: getMoveText(mv, lang) }))
              .filter((x) => x.text);
            const eraWorkGames: WorkGame[] = (worksPerGame && worksPerGame[gameVer]) ? worksPerGame[gameVer]! : (originWorkGames ?? []);

            const mainTrophyWithVideo = 
              eraTrophy.find(t => t.name === meta?.short && t.videoStartSec != null && t.videoEndSec != null) || 
              eraTrophy.find(t => t.videoStartSec != null && t.videoEndSec != null);

            return (
              <div
                key={gameVer}
                className={`border border-white/5 overflow-hidden border-l-2 ${meta?.accent ?? "border-l-white/10"}`}
                style={{ background: "rgba(5,5,24,0.65)" }}
              >
                <EraHeader gameVer={gameVer} isDebut={isDebut} lang={lang} />

                <div className="px-6 pt-5 pb-4">
                  {bio?.videoStartSec != null && bio?.videoEndSec != null && LOCAL_VIDEOS[gameVer] ? (
                    <div className="relative w-full aspect-video flex justify-center mb-5 rounded-xl overflow-hidden border border-cyan-500/20 shadow-xl bg-black/50">
                      <LocalVideoGif
                        src={LOCAL_VIDEOS[gameVer]}
                        startSec={bio.videoStartSec}
                        endSec={bio.videoEndSec}
                      />
                    </div>
                  ) : mainTrophyWithVideo && TROPHY_LOCAL_VIDEOS[gameVer] ? (
                    <>
                      <div className="relative w-full aspect-video flex justify-center mb-3 rounded-xl overflow-hidden border border-cyan-500/20 shadow-xl bg-black/50">
                        {mainTrophyWithVideo.videoStartSec2 != null && <span className="absolute top-2 left-2 z-10 text-xs font-bold bg-black/70 text-yellow-300 px-2 py-0.5 rounded">Wii U</span>}
                        <LocalVideoGif
                          src={TROPHY_LOCAL_VIDEOS[gameVer]}
                          startSec={mainTrophyWithVideo.videoStartSec!}
                          endSec={mainTrophyWithVideo.videoEndSec!}
                        />
                      </div>
                      {mainTrophyWithVideo.videoStartSec2 != null && mainTrophyWithVideo.videoEndSec2 != null && (
                        <div className="relative w-full aspect-video flex justify-center mb-5 rounded-xl overflow-hidden border border-red-500/20 shadow-xl bg-black/50">
                          <span className="absolute top-2 left-2 z-10 text-xs font-bold bg-black/70 text-red-300 px-2 py-0.5 rounded">3DS</span>
                          <LocalVideoGif
                            src="/videos/full_video_ssb4_3ds.mp4"
                            startSec={mainTrophyWithVideo.videoStartSec2}
                            endSec={mainTrophyWithVideo.videoEndSec2}
                          />
                        </div>
                      )}
                    </>
                  ) : null}

                  {gameVer === "SSB64" && (
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] block mb-3" style={{ color: `${meta?.eraTextColor}80` }}>
                      {t(lang, "bios")}
                    </span>
                  )}
                  {gameVer === "SSBU" && fightersTips && fightersTips.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {fightersTips.map((tip) => {
                        const tipTitle = lang === "PT" ? (tip.titlePt || tip.titleEn) : lang === "JP_EN" ? (tip.titleJpEn || tip.titleEn) : lang === "JP" ? (tip.titleJp || tip.titleEn) : tip.titleEn;
                        const tipText = lang === "PT" ? (tip.textPt || tip.textEn) : lang === "JP_EN" ? (tip.textJpEn || tip.textEn) : lang === "JP" ? (tip.textJp || tip.textEn) : tip.textEn;
                        return (
                          <div key={tip.titleEn} className="flex flex-col gap-1">
                            <span
                              className="font-mono text-xs font-bold uppercase tracking-wider"
                              style={{ color: meta?.eraTextColor }}
                            >
                              {tipTitle}
                            </span>
                            <p className="text-[15px] leading-relaxed text-slate-200">{tipText}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : bioText ? (
                    <p className="text-[15px] leading-relaxed text-slate-200">{bioText}</p>
                  ) : null}
                </div>

                {eraMoves.length > 0 && (
                  <div className="px-6 pb-5 flex flex-col gap-4 border-t border-white/5 pt-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: meta?.eraTextColor }}>
                      {t(lang, "moves")}
                    </span>
                    {eraMoves.map(({ mv, text }) => (
                      <div key={`${mv.smashGameVersion}-${mv.order}`} className="flex flex-col gap-1">
                        {mv.label && (
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-600">
                            {mv.label}
                          </span>
                        )}
                        <p className="text-[15px] leading-relaxed text-slate-200">{text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {(eraTrophy.length > 0 || eraStic.length > 0) && (
                  <div className="px-6 pb-5 flex flex-col gap-4 border-t border-white/5 pt-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-700">
                      {t(lang, "trophies")}
                    </span>

                    {eraTrophy.map((t) => {
                      if (lang === "JP" && !t.descriptionJp) return null;
                      if (lang === "JP_EN" && !t.descriptionJpEn && !t.descriptionJp) return null;
                      if (lang === "PT" && !t.descriptionPt && !t.description) return null;
                      const desc = lang === "PT" ? (t.descriptionPt || t.description) : lang === "JP_EN" ? (t.descriptionJpEn || t.description) : lang === "JP" ? (t.descriptionJp || t.description) : t.description;
                      const title = lang === "JP_EN" && t.nameJp ? t.nameJp.replace(/ネス/g, "Ness") : lang === "JP" && t.nameJp ? t.nameJp : t.name;
                      return desc ? (
                        <div key={t.id} className="border-l-2 pl-4" style={{ borderLeftColor: `${meta?.eraTextColor}30` }}>
                          <p className="font-mono text-[13px] uppercase tracking-wider mb-2 opacity-80" style={{ color: meta?.eraTextColor }}>
                            {title}
                          </p>
                          <p className="text-[15px] leading-relaxed text-slate-200">{desc}</p>
                        </div>
                      ) : null;
                    })}

                    {eraStic.map((s) => {
                      if (lang === "JP" && !s.descriptionJp) return null;
                      if (lang === "JP_EN" && !s.descriptionJpEn && !s.descriptionJp) return null;
                      if (lang === "PT" && !s.descriptionPt && !s.description) return null;
                      const desc = lang === "PT" ? (s.descriptionPt || s.description) : lang === "JP_EN" ? (s.descriptionJpEn || s.description) : lang === "JP" ? (s.descriptionJp || s.description) : s.description;
                      const title = lang === "JP_EN" && s.nameJp ? s.nameJp.replace(/ネス/g, "Ness") : lang === "JP" && s.nameJp ? s.nameJp : s.name;
                      return desc ? (
                        <div key={s.id} className="border-l-2 border-purple-500/20 pl-4">
                          <p className="font-mono text-[13px] uppercase tracking-wider text-purple-400/80 mb-2">{title}</p>
                          <p className="text-[15px] leading-relaxed text-slate-200">{desc}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                <div className="px-6 pb-4 border-t border-white/5 pt-3 flex flex-col gap-3">
                  {/* Label Works */}
                  <span className="font-mono text-[13px] uppercase tracking-[0.2em] text-cyan-800">{t(lang, "works")}</span>

                  {/* Jogos de origem — específicos por era, fallback para global */}
                  {eraWorkGames.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {eraWorkGames.map((wg) => {
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
                        );
                      })}
                    </div>
                  )}

                  {/* Badges de troféus/stickers */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {eraTrophy.length > 0 && (
                      <span className={`border px-2 py-0.5 font-mono text-[10px] opacity-80 ${meta?.color ?? ""}`}>
                        {eraTrophy.length} {eraTrophy.length > 1 ? t(lang, "trophyPlural") : t(lang, "trophy")}
                      </span>
                    )}
                    {eraStic.length > 0 && (
                      <span className="border border-purple-900/30 bg-purple-950/20 px-2 py-0.5 font-mono text-[10px] text-purple-500/80">
                        {eraStic.length} {eraStic.length > 1 ? t(lang, "stickerPlural") : t(lang, "sticker")}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

          {erasToShow.length === 0 && (
            <p className="font-mono text-xs text-slate-700 italic">
              {t(lang, "noEras")}
            </p>
          )}
        </div>
      </section>
      )}

      <SuggestionPanel
        fighterId={fighterId}
        section="general"
        lang={lang}
      />
    </div>
  );
}
