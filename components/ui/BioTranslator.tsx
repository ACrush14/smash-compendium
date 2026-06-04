"use client";

import { useState } from "react";

interface BioTranslatorProps {
  contentEn:           string;
  contentPt?:          string | null;   // PT-BR gerado por IA
  contentJp?:          string | null;   // JP canônico (raspado do jogo)
  contentJpEn?:        string | null;   // JP traduzido literalmente para EN
  contentJpTranslated?: string | null;  // deprecated — fallback de contentJpEn
  compact?: boolean;
}

type LangTab = "EN" | "PT" | "JP" | "JP_EN";

export default function BioTranslator({
  contentEn,
  contentPt,
  contentJp,
  contentJpEn,
  contentJpTranslated,
  compact = false,
}: BioTranslatorProps) {
  const [active, setActive] = useState<LangTab>("EN");

  // contentJpEn usa o novo campo; cai no deprecated contentJpTranslated como fallback
  const resolvedJpEn = contentJpEn ?? contentJpTranslated ?? null;

  const tabs: Array<{ id: LangTab; label: string; short: string; avail: boolean }> = [
    { id: "EN",    label: "Inglês (EN)",       short: "EN",    avail: true              },
    { id: "PT",    label: "Português (PT-BR)",  short: "PT-BR", avail: !!contentPt       },
    { id: "JP",    label: "Japonês (JP)",       short: "JP",    avail: !!contentJp       },
    { id: "JP_EN", label: "JP Traduzido",       short: "JP→EN", avail: !!resolvedJpEn    },
  ];

  const body =
    active === "EN"    ? contentEn
    : active === "PT"  ? (contentPt ?? "")
    : active === "JP"  ? (contentJp ?? "")
    : (resolvedJpEn ?? "");

  const isJp = active === "JP";

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-end gap-1 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              disabled={!t.avail}
              onClick={() => t.avail && setActive(t.id)}
              className={[
                "px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border transition-colors",
                active === t.id
                  ? "border-amber-500/50 bg-amber-900/20 text-amber-400"
                  : t.avail
                    ? "border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20"
                    : "border-transparent text-slate-700 cursor-not-allowed opacity-40",
              ].join(" ")}
            >
              {t.short}
            </button>
          ))}
        </div>
        <p className={`text-xs leading-relaxed text-slate-300 ${isJp ? "font-serif" : ""}`}>
          {body}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-white/5 bg-slate-900/40">
      <div className="flex border-b border-white/5 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            disabled={!t.avail}
            onClick={() => t.avail && setActive(t.id)}
            className={[
              "relative shrink-0 px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-colors",
              active === t.id
                ? "text-amber-400 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-amber-400"
                : t.avail
                  ? "text-slate-500 hover:text-slate-300"
                  : "cursor-not-allowed text-slate-700",
            ].join(" ")}
          >
            {t.label}
            {!t.avail && (
              <span className="ml-2 font-mono text-[9px] text-slate-700 normal-case tracking-normal">
                em breve
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="min-h-[180px] px-6 py-5">
        <p className={`text-sm leading-relaxed text-slate-300 ${isJp ? "font-serif" : ""}`}>
          {body}
        </p>
      </div>
    </div>
  );
}
