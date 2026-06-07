"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle, Clock, ChevronLeft, ChevronRight,
  RefreshCw, Shield, ExternalLink, Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FighterCuration {
  id:             string;
  name:           string;
  rosterNumber:   string;
  imageUrl:       string | null;
  franchise:      string;
  curationStatus: string | null;
  curationNotes:  string | null;
  musicStatus:    string | null;
  hasCuratorText: boolean;
  biosCount:      number;
  worksCount:     number;
  trophyCount:    number;
  spiritCount:    number;
  stickerCount:   number;
  bios:           { smashGameVersion: string }[];
  works:          { gameId: string }[];
}

type Filter = "all" | "pending_review" | "approved";

// ─── Completeness ─────────────────────────────────────────────────────────────

function completenessItems(f: FighterCuration) {
  return [
    {
      label:  "Render 3D",
      ok:     !!f.imageUrl,
      detail: f.imageUrl ? "presente" : "ausente",
    },
    {
      label:  "Bios EN",
      ok:     f.biosCount > 0 && f.biosCount >= f.worksCount,
      detail: `${f.biosCount}/${f.worksCount} eras`,
    },
    {
      label:  "Troféus",
      ok:     f.trophyCount > 0,
      detail: `${f.trophyCount}`,
    },
    {
      label:  "Spirits",
      ok:     f.spiritCount > 0,
      detail: `${f.spiritCount}`,
    },
    {
      label:  "Curator text",
      ok:     f.hasCuratorText,
      detail: f.hasCuratorText ? "preenchido" : "vazio",
    },
    {
      label:  "Música aprovada",
      ok:     f.musicStatus === "approved",
      detail: f.musicStatus ?? "—",
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminFightersPage() {
  const [fighters, setFighters] = useState<FighterCuration[]>([]);
  const [idx, setIdx]           = useState(0);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [filter, setFilter]     = useState<Filter>("pending_review");
  const [notes, setNotes]       = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetch("/api/admin/fighters").then((r) => r.json());
    setFighters(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = fighters.filter((f) =>
    filter === "all"           ? true :
    filter === "pending_review" ? f.curationStatus !== "approved" :
    f.curationStatus === "approved",
  );

  const current = visible[idx];

  // Sync notes when fighter changes
  useEffect(() => {
    if (current) setNotes(current.curationNotes ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const save = useCallback(async (status: "approved" | "pending_review") => {
    if (!current) return;
    setSaving(true);
    const updated = await fetch(`/api/admin/fighters/${current.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ curationStatus: status, curationNotes: notes }),
    }).then((r) => r.json());

    setFighters((prev) =>
      prev.map((f) =>
        f.id === current.id
          ? { ...f, curationStatus: updated.curationStatus, curationNotes: updated.curationNotes }
          : f,
      ),
    );
    setSaving(false);
    if (status === "approved" && idx < visible.length - 1) setIdx((i) => i + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, notes, idx, visible.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "a" || e.key === "A")  save("approved");
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, visible.length - 1));
      if (e.key === "ArrowLeft")  setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, notes, visible.length]);

  const approvedCount = fighters.filter((f) => f.curationStatus === "approved").length;
  const pendingCount  = fighters.filter((f) => f.curationStatus !== "approved").length;

  if (loading) return (
    <div className="h-screen bg-[#040412] flex items-center justify-center text-cyan-400 font-mono gap-2">
      <Loader2 size={16} className="animate-spin" /> Carregando…
    </div>
  );

  return (
    <div className="h-screen bg-[#040412] text-slate-200 font-mono flex flex-col">

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-cyan-500/10 px-5 py-3 flex items-center gap-3 flex-wrap">
        <Shield size={13} className="text-cyan-800 shrink-0" />
        <span className="text-sm font-bold uppercase tracking-widest text-cyan-400 shrink-0">
          Curadoria de Fighters
        </span>

        {/* Admin nav links */}
        <div className="flex gap-1">
          <span className="px-2 py-0.5 text-[10px] border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">Fighters</span>
          <Link href="/admin/chronicles" className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Chronicles</Link>
          <Link href="/admin/music"      className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Music</Link>
        </div>

        <div className="flex-1" />

        {/* Stats */}
        <div className="flex gap-4 text-[11px]">
          <span className="text-emerald-400 font-bold">{approvedCount} aprovados</span>
          <span className="text-amber-400">{pendingCount} pendentes</span>
          <span className="text-slate-600">{fighters.length} total</span>
        </div>

        {/* Filter */}
        <div className="flex gap-1">
          {(["all", "pending_review", "approved"] as const).map((f) => (
            <button key={f} onClick={() => { setFilter(f); setIdx(0); }}
              className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider border transition-all ${
                filter === f
                  ? "border-cyan-500/60 text-cyan-300 bg-cyan-500/10"
                  : "border-slate-700 text-slate-500 hover:text-slate-300"
              }`}
            >
              {f === "all" ? "Todos" : f === "pending_review" ? "Pendentes" : "Aprovados"}
            </button>
          ))}
        </div>

        <button onClick={load} className="p-1.5 border border-white/10 hover:border-cyan-500/30 transition-all">
          <RefreshCw size={12} className="text-slate-500" />
        </button>
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar */}
        <div className="w-60 shrink-0 border-r border-cyan-500/10 overflow-y-auto">
          {visible.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setIdx(i)}
              className={`w-full text-left px-4 py-2.5 border-b border-cyan-500/5 transition-all flex items-center gap-2 ${
                i === idx ? "bg-cyan-500/10 text-cyan-300" : "hover:bg-white/[0.03] text-slate-400"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                f.curationStatus === "approved" ? "bg-emerald-400" : "bg-amber-400/70"
              }`} />
              <span className="text-[10px] text-slate-600 w-7 shrink-0">{f.rosterNumber}</span>
              <span className="text-[11px] truncate">{f.name}</span>
            </button>
          ))}
          {visible.length === 0 && (
            <p className="text-center text-slate-600 text-[11px] py-10">Nenhum fighter.</p>
          )}
        </div>

        {/* Main panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {!current ? (
            <div className="text-slate-600 text-center mt-24 text-[13px]">
              Selecione um fighter na lista.
            </div>
          ) : (
            <div className="max-w-xl mx-auto flex flex-col gap-5">

              {/* Fighter card */}
              <div className="flex gap-4 items-start">
                {/* Render */}
                <div className="shrink-0 w-20 h-24 bg-[#060618] border border-white/5 overflow-hidden flex items-end justify-center">
                  {current.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current.imageUrl}
                      alt={current.name}
                      style={{ height: 96, width: "auto", maxWidth: 80, objectFit: "contain" }}
                    />
                  ) : (
                    <span className="text-[8px] text-slate-700 mb-1 text-center leading-tight">SEM<br/>RENDER</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-bold text-cyan-200 leading-tight">{current.name}</h2>
                      <p className="text-[10px] text-slate-500 mt-0.5">{current.franchise} · #{current.rosterNumber}</p>
                    </div>
                    <Link
                      href={`/fighters/${encodeURIComponent(current.name)}`}
                      target="_blank"
                      className="shrink-0 flex items-center gap-1 text-[9px] text-slate-600 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/20 px-2 py-1 transition-all"
                    >
                      <ExternalLink size={9} /> Ver página
                    </Link>
                  </div>

                  <span className={`mt-2 inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 border uppercase tracking-widest ${
                    current.curationStatus === "approved"
                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                      : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                  }`}>
                    <span>{current.curationStatus === "approved" ? "✓" : "●"}</span>
                    {current.curationStatus === "approved" ? "aprovado" : "pendente"}
                  </span>
                </div>
              </div>

              {/* Completeness block */}
              {(() => {
                const items = completenessItems(current);
                const score = items.filter((i) => i.ok).length;
                const pct   = Math.round((score / items.length) * 100);
                return (
                  <div className="border border-white/5 bg-[#050515] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">Completeness</span>
                      <span className="text-[11px] text-slate-400 font-bold">{score}/{items.length}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct === 100 ? "bg-emerald-500" : pct >= 50 ? "bg-cyan-600" : "bg-amber-600"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {/* Items */}
                    <div className="flex flex-col gap-1.5">
                      {items.map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          {item.ok
                            ? <CheckCircle size={11} className="text-emerald-400 shrink-0" />
                            : <span className="w-2.5 h-2.5 rounded-full border border-slate-700 shrink-0" />
                          }
                          <span className={`text-[11px] ${item.ok ? "text-slate-300" : "text-slate-600"}`}>
                            {item.label}
                          </span>
                          <span className={`text-[10px] ml-auto font-mono ${
                            item.ok ? "text-slate-600" : "text-amber-800"
                          }`}>
                            {item.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Notes */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">
                  Notas de curadoria
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="O que falta para aprovar? Ex: 'Faltam troféus Melee, bio SSBB, origin game cover'"
                  rows={3}
                  className="w-full bg-[#050510] border border-white/10 text-slate-300 text-[11px] px-3 py-2 focus:outline-none focus:border-cyan-500/30 placeholder:text-slate-700 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => save("approved")}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/50 text-emerald-400 text-[11px] uppercase tracking-wider hover:bg-emerald-500/25 transition-all disabled:opacity-40"
                >
                  <CheckCircle size={12} />
                  Aprovar <kbd className="opacity-40 ml-0.5 text-[9px]">[A]</kbd>
                </button>
                <button
                  onClick={() => save("pending_review")}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[11px] uppercase tracking-wider hover:bg-amber-500/20 transition-all disabled:opacity-40"
                >
                  <Clock size={12} />
                  Salvar pendente
                </button>

                <div className="flex-1" />

                {/* Navigation */}
                <div className="flex items-center gap-1 text-slate-500">
                  <button
                    onClick={() => setIdx((i) => Math.max(i - 1, 0))}
                    disabled={idx === 0}
                    className="p-1.5 hover:text-slate-300 disabled:opacity-30 transition-all border border-white/5 hover:border-white/15"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <span className="text-[10px] px-2 min-w-[56px] text-center">
                    {idx + 1} / {visible.length}
                  </span>
                  <button
                    onClick={() => setIdx((i) => Math.min(i + 1, visible.length - 1))}
                    disabled={idx >= visible.length - 1}
                    className="p-1.5 hover:text-slate-300 disabled:opacity-30 transition-all border border-white/5 hover:border-white/15"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {/* Keyboard hint */}
              <p className="text-[9px] text-slate-700 text-center">
                <kbd>[A]</kbd> Aprovar e avançar · <kbd>[← →]</kbd> Navegar
              </p>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
