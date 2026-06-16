"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Loader2, CheckCircle, ChevronDown, ChevronUp,
  Music, Image as ImageIcon, FileText, Trophy, ExternalLink, RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FighterBio {
  id: string;
  fighterId: string;
  smashGameVersion: string;
  contentEn: string;
  contentPt: string | null;
  contentJp: string | null;
  contentJpEn: string | null;
}

interface FighterDetail {
  id: string;
  name: string;
  rosterNumber: string;
  franchise: string;
  franchiseId: string;      // direct FK on the Fighter
  franchiseObjId: string;   // populated by detail API (same as franchiseId)
  imageUrl: string | null;
  curationStatus: string | null;
  musicYoutubeId: string | null;
  musicTitle: string | null;
  musicArtist: string | null;
  musicStatus: string | null;
  curatorOverviewEn: string | null;
  curatorOverviewPt: string | null;
  curatorOverviewJp: string | null;
  curatorOverviewJpEn: string | null;
  bios: FighterBio[];
  worksEras: string[];
}

interface CollectibleItem {
  id: string;
  type: string;
  smashGameVersion: string;
  name: string;
  nameJp: string | null;
  description: string | null;   // EN — campo principal usado na página pública
  descriptionPt: string | null;
  descriptionJp: string | null;
  descriptionJpEn: string | null;
  assetRenderUrl: string | null;
}

type Tab = "overview" | "bios" | "collectibles" | "constructor";
type OverviewLang = "EN" | "PT" | "JP" | "JP+EN";
type BioLang = "EN" | "PT" | "JP" | "JP+EN";
type CollectibleType = "TROPHY" | "SPIRIT" | "STICKER";

const ERA_LABEL: Record<string, string> = {
  SSB64: "64", SSBM: "Melee", SSBB: "Brawl", SSB4: "4", SSBU: "Ultimate",
};

const ERA_COLOR: Record<string, string> = {
  SSB64: "text-yellow-400 border-yellow-500/40",
  SSBM:  "text-blue-400 border-blue-500/40",
  SSBB:  "text-red-400 border-red-500/40",
  SSB4:  "text-purple-400 border-purple-500/40",
  SSBU:  "text-cyan-400 border-cyan-500/40",
};

// ─── SaveFeedback ─────────────────────────────────────────────────────────────

function useSaveFeedback() {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const setSaving = () => setState("saving");
  const setSaved  = () => {
    setState("saved");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setState("idle"), 2200);
  };
  const setError  = () => {
    setState("error");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setState("idle"), 3000);
  };

  return { state, setSaving, setSaved, setError };
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function TabOverview({
  fighter,
  onFieldUpdate,
}: {
  fighter: FighterDetail;
  onFieldUpdate: (patch: Partial<FighterDetail>) => void;
}) {
  // Render
  const [imageUrl, setImageUrl] = useState(fighter.imageUrl ?? "");
  const renderSave = useSaveFeedback();

  // Curator overview
  const [ovLang, setOvLang] = useState<OverviewLang>("EN");
  const [overviews, setOverviews] = useState<Record<OverviewLang, string>>({
    EN:      fighter.curatorOverviewEn    ?? "",
    PT:      fighter.curatorOverviewPt    ?? "",
    JP:      fighter.curatorOverviewJp    ?? "",
    "JP+EN": fighter.curatorOverviewJpEn  ?? "",
  });
  const ovSave = useSaveFeedback();

  // Music
  const [musicId,     setMusicId]     = useState(fighter.musicYoutubeId ?? "");
  const [musicTitle,  setMusicTitle]  = useState(fighter.musicTitle     ?? "");
  const [musicArtist, setMusicArtist] = useState(fighter.musicArtist    ?? "");
  const [musicStatus, setMusicStatus] = useState(fighter.musicStatus    ?? "pending_review");
  const musicSave = useSaveFeedback();

  const patch = useCallback(async (data: Record<string, unknown>) => {
    await fetch(`/api/admin/fighters/${fighter.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    onFieldUpdate(data as Partial<FighterDetail>);
  }, [fighter.id, onFieldUpdate]);

  const saveRender = async () => {
    renderSave.setSaving();
    try {
      await patch({ imageUrl: imageUrl || null });
      renderSave.setSaved();
    } catch { renderSave.setError(); }
  };

  const saveOverview = async () => {
    ovSave.setSaving();
    try {
      await patch({
        curatorOverviewEn:   overviews.EN    || null,
        curatorOverviewPt:   overviews.PT    || null,
        curatorOverviewJp:   overviews.JP    || null,
        curatorOverviewJpEn: overviews["JP+EN"] || null,
      });
      ovSave.setSaved();
    } catch { ovSave.setError(); }
  };

  const saveMusic = async () => {
    musicSave.setSaving();
    try {
      await patch({
        musicYoutubeId: musicId     || null,
        musicTitle:     musicTitle  || null,
        musicArtist:    musicArtist || null,
        musicStatus,
      });
      musicSave.setSaved();
    } catch { musicSave.setError(); }
  };

  const hasOverview = Object.values(overviews).some(v => v.length > 0);

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* ── Render 3D ─────────────────────────── */}
      <section className="border border-white/5 bg-[#05050f] p-5">
        <h3 className="text-[10px] uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <ImageIcon size={11} /> Render 3D
        </h3>
        <div className="flex gap-4 items-start">
          {/* Preview */}
          <div className="shrink-0 w-20 h-24 bg-[#07071a] border border-white/5 flex items-end justify-center overflow-hidden">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" style={{ height: 96, width: "auto", maxWidth: 80, objectFit: "contain" }} />
            ) : (
              <span className="text-[8px] text-slate-700 mb-1 text-center">SEM<br/>RENDER</span>
            )}
          </div>
          {/* Input */}
          <div className="flex-1 space-y-2">
            <label className="block text-[10px] text-slate-500">URL do render PNG (transparente)</label>
            <input
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/30 placeholder:text-slate-700 font-mono"
            />
            <div className="flex items-center gap-2">
              <SaveButton state={renderSave.state} onClick={saveRender} label="Salvar Render" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Curator Overview ──────────────────── */}
      <section className="border border-white/5 bg-[#05050f] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <FileText size={11} /> Curator Overview
          </h3>
          {hasOverview && (
            <span className="text-[9px] text-emerald-500/60 font-mono">✓ preenchido</span>
          )}
        </div>

        {/* Lang tabs */}
        <div className="flex gap-1 mb-3">
          {(["EN", "PT", "JP", "JP+EN"] as const).map(l => (
            <button
              key={l}
              onClick={() => setOvLang(l)}
              className={`px-3 py-1 text-[10px] font-mono border transition-all ${
                ovLang === l
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                  : "border-white/5 text-slate-600 hover:text-slate-400"
              }`}
            >
              {l}
              {overviews[l].length > 0 && (
                <span className="ml-1 w-1 h-1 rounded-full bg-emerald-400 inline-block align-middle" />
              )}
            </button>
          ))}
        </div>

        <textarea
          value={overviews[ovLang]}
          onChange={e => setOverviews(prev => ({ ...prev, [ovLang]: e.target.value }))}
          placeholder={`Texto curador em ${ovLang}…`}
          rows={8}
          className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-4 py-3 focus:outline-none focus:border-amber-500/20 placeholder:text-slate-700 resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="font-mono text-[10px] text-slate-600">{overviews[ovLang].length} chars</span>
          <SaveButton state={ovSave.state} onClick={saveOverview} label="Salvar Overview" />
        </div>
      </section>

      {/* ── Música ────────────────────────────── */}
      <section className="border border-white/5 bg-[#05050f] p-5">
        <h3 className="text-[10px] uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <Music size={11} /> Música Icônica
        </h3>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">YouTube ID</label>
            <input
              value={musicId}
              onChange={e => setMusicId(e.target.value)}
              placeholder="dQw4w9WgXcQ"
              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/30 placeholder:text-slate-700 font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">Título</label>
            <input
              value={musicTitle}
              onChange={e => setMusicTitle(e.target.value)}
              placeholder="Main Theme"
              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/30 placeholder:text-slate-700"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">Artista / Compositor</label>
            <input
              value={musicArtist}
              onChange={e => setMusicArtist(e.target.value)}
              placeholder="Koji Kondo"
              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/30 placeholder:text-slate-700"
            />
          </div>
        </div>

        {musicId && (
          <div className="mb-3 border border-white/5 overflow-hidden" style={{ aspectRatio: "16/9", maxHeight: 180 }}>
            <iframe
              src={`https://www.youtube.com/embed/${musicId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="text-[10px] text-slate-500">Status:</label>
          <select
            value={musicStatus}
            onChange={e => setMusicStatus(e.target.value)}
            className="bg-[#030310] border border-white/10 text-slate-300 text-[11px] px-2 py-1 focus:outline-none"
          >
            <option value="pending_review">⏳ pending_review</option>
            <option value="approved">✓ approved</option>
          </select>
          <div className="flex-1" />
          <SaveButton state={musicSave.state} onClick={saveMusic} label="Salvar Música" />
        </div>
      </section>

    </div>
  );
}

// ─── Tab: Bios ────────────────────────────────────────────────────────────────
// Only SSB64 (1999) has real in-game character bios. Other eras use Curator Overview.

function TabBios({
  fighterId,
  worksEras,
  initialBios,
}: {
  fighterId: string;
  worksEras: string[];
  initialBios: FighterBio[];
}) {
  const [bios, setBios] = useState<FighterBio[]>(initialBios);
  const [lang, setLang] = useState<BioLang>("EN");
  const [text, setText] = useState<string>("");
  const save = useSaveFeedback();

  const ERA_BIO = "SSB64"; // Only era with real in-game bio text
  const isIn64  = worksEras.includes("SSB64");

  const LANG_FIELD: Record<BioLang, keyof FighterBio> = {
    EN:      "contentEn",
    PT:      "contentPt",
    JP:      "contentJp",
    "JP+EN": "contentJpEn",
  };

  const currentBio = bios.find(b => b.smashGameVersion === ERA_BIO);
  const legacyBioCount = bios.filter(b => b.smashGameVersion !== ERA_BIO).length;

  // Sync textarea when lang or bios changes
  useEffect(() => {
    const field = LANG_FIELD[lang];
    const val = currentBio ? (currentBio[field] as string | null) : null;
    setText(val ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, bios]);

  const handleSave = async () => {
    save.setSaving();
    try {
      const field = LANG_FIELD[lang];
      const res = await fetch(`/api/admin/fighters/${fighterId}/bios`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ smashGameVersion: ERA_BIO, [field as string]: text }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated: FighterBio = await res.json();
      setBios(prev => {
        const idx = prev.findIndex(b => b.smashGameVersion === ERA_BIO);
        if (idx >= 0) { const n = [...prev]; n[idx] = updated; return n; }
        return [...prev, updated];
      });
      save.setSaved();
    } catch { save.setError(); }
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Scope note */}
      <div className="mb-5 px-3 py-2.5 border border-yellow-500/15 bg-yellow-500/[0.04] text-[11px] font-mono text-yellow-700 flex items-start gap-2">
        <span className="text-yellow-500 shrink-0">★</span>
        <span>
          <span className="text-yellow-400">Apenas SSB64</span> possui bio de jogo (texto original do cartucho, 1999).
          {" "}Melee, Brawl, 4 e Ultimate usam o{" "}
          <span className="text-cyan-400">Curator Overview</span> na aba Visão Geral.
        </span>
      </div>

      {/* Fighter not in SSB64 */}
      {!isIn64 && (
        <div className="mb-4 px-3 py-2 border border-slate-500/15 text-[11px] font-mono text-slate-600">
          Este fighter não estava no SSB64 — não possui bio de jogo.
          {" "}Use o <span className="text-cyan-500/70">Curator Overview</span> na aba Visão Geral.
        </div>
      )}

      {/* Lang tabs */}
      <div className="flex gap-1 mb-3">
        {(["EN", "PT", "JP", "JP+EN"] as const).map(l => {
          const field = LANG_FIELD[l];
          const hasContent = currentBio ? !!currentBio[field] : false;
          return (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex items-center gap-1 px-3 py-1 text-[10px] font-mono border transition-all ${
                lang === l
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                  : "border-white/5 text-slate-600 hover:text-slate-400"
              }`}
            >
              {l}
              {hasContent && (
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={!isIn64}
        placeholder={isIn64 ? `Bio SSB64 · ${lang}…` : "Fighter não estava no SSB64 — sem bio de jogo"}
        rows={14}
        className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-4 py-3 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700 resize-none leading-relaxed font-mono disabled:opacity-40 disabled:cursor-not-allowed"
      />

      <div className="flex items-center justify-between mt-2">
        <span className="font-mono text-[10px] text-slate-600">{text.length} chars</span>
        <SaveButton
          state={save.state}
          onClick={handleSave}
          label="Salvar Bio SSB64"
          disabled={!isIn64}
        />
      </div>

      {/* SSB64 bio status (by language) */}
      <div className="mt-6 border border-white/5 p-4 bg-[#05050f]">
        <p className="text-[9px] uppercase tracking-widest text-slate-600 mb-3">
          Status · Bio SSB64
        </p>
        <div className="grid grid-cols-4 gap-2 text-[10px]">
          {(["EN", "PT", "JP", "JP+EN"] as const).map(l => {
            const field = LANG_FIELD[l];
            const filled = currentBio ? !!(currentBio[field] as string | null) : false;
            return (
              <div key={l} className={`p-2 border ${filled ? "border-white/10" : "border-white/5 opacity-50"}`}>
                <p className="font-mono font-bold text-amber-400/80 mb-1">{l}</p>
                <p className={filled ? "text-emerald-400" : "text-slate-700"}>
                  {filled ? "✓ ok" : "vazio"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legacy bios warning */}
      {legacyBioCount > 0 && (
        <div className="mt-4 px-3 py-2 border border-red-500/10 text-[10px] font-mono text-slate-700">
          ⚠ {legacyBioCount} bio(s) de outras eras existem no banco (provavelmente wiki-scraped).
          {" "}Para limpar:{" "}
          <code className="text-red-800/70">
            npx tsx --env-file=.env.local scripts/admin/cleanup-non-64-bios.ts
          </code>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Collectibles ────────────────────────────────────────────────────────

function TabCollectibles({
  fighterId,
  franchiseId,
  franchiseName,
}: {
  fighterId: string;
  franchiseId: string;
  franchiseName: string;
}) {
  const [type, setType]       = useState<CollectibleType>("TROPHY");
  const [items, setItems]     = useState<CollectibleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [edits, setEdits]     = useState<Record<string, Partial<CollectibleItem>>>({});
  const [saving, setSaving]   = useState<Set<string>>(new Set());
  const [saved,  setSaved]    = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // id do item aguardando confirmação
  const [isCreating, setIsCreating] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "", nameJp: "", description: "", descriptionJp: "", smashGameVersion: "SSBM", assetRenderUrl: ""
  });

  const loadItems = useCallback(async (t: CollectibleType) => {
    setLoading(true);
    const data = await fetch(`/api/admin/fighters/${fighterId}/collectibles?type=${t}`)
      .then(r => r.json());
    setItems(data);
    setLoading(false);
    setExpanded(new Set());
    setEdits({});
  }, [fighterId]);

  useEffect(() => { loadItems(type); }, [type, loadItems]);

  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const setEdit = (id: string, field: string, value: string) =>
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const saveItem = async (item: CollectibleItem) => {
    const patch = edits[item.id];
    if (!patch || Object.keys(patch).length === 0) return;
    setSaving(prev => new Set(prev).add(item.id));
    try {
      await fetch(`/api/admin/collectibles/${item.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(patch),
      });
      setItems(prev => prev.map(c =>
        c.id === item.id ? { ...c, ...patch } : c,
      ));
      setEdits(prev => { const n = { ...prev }; delete n[item.id]; return n; });
      setSaved(prev => {
        const n = new Set(prev).add(item.id);
        setTimeout(() => setSaved(s => { const m = new Set(s); m.delete(item.id); return m; }), 2000);
        return n;
      });
    } finally {
      setSaving(prev => { const n = new Set(prev); n.delete(item.id); return n; });
    }
  };

  const handleCreate = async () => {
    if (!newItem.name.trim()) return;
    setSaving(prev => new Set(prev).add("new"));
    try {
      const res = await fetch("/api/admin/collectibles", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...newItem,
          type,
          fighterId,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const created = await res.json();
      setItems(prev => [...prev, created]);
      setIsCreating(false);
      setNewItem({ name: "", nameJp: "", description: "", descriptionJp: "", smashGameVersion: newItem.smashGameVersion, assetRenderUrl: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(prev => { const n = new Set(prev); n.delete("new"); return n; });
    }
  };

  // Desvincular: remove fighterId mas mantém franchiseId → coletável some da página
  // do fighter mas continua visível na página da franquia /franchise/[name]
  const unlinkItem = async (item: CollectibleItem) => {
    setSaving(prev => new Set(prev).add(item.id));
    try {
      await fetch(`/api/admin/collectibles/${item.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        // null fighterId + keep franchiseId → shows on franchise page, not on fighter page
        body:    JSON.stringify({ fighterId: null, franchiseId }),
      });
      setItems(prev => prev.filter(c => c.id !== item.id));
      setExpanded(prev => { const n = new Set(prev); n.delete(item.id); return n; });
    } finally {
      setSaving(prev => { const n = new Set(prev); n.delete(item.id); return n; });
    }
  };

  // Excluir permanentemente
  const deleteItem = async (id: string) => {
    setSaving(prev => new Set(prev).add(id));
    try {
      await fetch(`/api/admin/collectibles/${id}`, { method: "DELETE" });
      setItems(prev => prev.filter(c => c.id !== id));
      setExpanded(prev => { const n = new Set(prev); n.delete(id); return n; });
      setConfirmDelete(null);
    } finally {
      setSaving(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  const typeLabels: Record<CollectibleType, string> = {
    TROPHY: "Troféus", SPIRIT: "Spirits", STICKER: "Stickers",
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Type tabs */}
      <div className="flex gap-1 mb-5">
        {(["TROPHY", "SPIRIT", "STICKER"] as const).map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-1.5 text-[11px] font-mono border transition-all ${
              type === t
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                : "border-white/10 text-slate-500 hover:text-slate-300"
            }`}
          >
            <Trophy size={10} className="inline mr-1.5 -mt-0.5" />
            {typeLabels[t]}
            {!loading && type === t && (
              <span className="ml-2 text-[9px] text-slate-600">{items.length}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-600 gap-2">
          <Loader2 size={14} className="animate-spin" /> Carregando…
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-slate-600 text-[12px]">
          Nenhum {typeLabels[type].toLowerCase()} encontrado.
        </div>
      ) : (
        <div className="space-y-1">
          {items.map(item => {
            const isOpen = expanded.has(item.id);
            const editPatch = edits[item.id] ?? {};
            const isDirty = Object.keys(editPatch).length > 0;
            const isSaving = saving.has(item.id);
            const isSaved  = saved.has(item.id);
            const e = edits[item.id] ?? {};

            return (
              <div key={item.id} className="border border-white/5 bg-[#05050f]">
                {/* Row header */}
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-all text-left"
                >
                  {/* Era badge */}
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 border shrink-0 ${
                    ERA_COLOR[item.smashGameVersion] ?? "text-slate-500 border-slate-500/30"
                  }`}>
                    {ERA_LABEL[item.smashGameVersion] ?? item.smashGameVersion}
                  </span>

                  {/* Image */}
                  {item.assetRenderUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.assetRenderUrl}
                      alt=""
                      className="w-6 h-6 object-contain shrink-0 opacity-80"
                    />
                  ) : (
                    <div className="w-6 h-6 border border-white/5 shrink-0" />
                  )}

                  <span className="text-[12px] text-slate-300 truncate flex-1">{item.name}</span>

                  {isDirty && (
                    <span className="text-[9px] text-amber-400 font-mono shrink-0">● não salvo</span>
                  )}
                  {isSaved && !isDirty && (
                    <span className="text-[9px] text-emerald-400 font-mono shrink-0">✓</span>
                  )}

                  {/* Quick-action buttons visible without expanding */}
                  {!isOpen && (
                    <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        title={`Desvincular deste fighter → mover para franquia ${franchiseName}`}
                        onClick={() => unlinkItem(item)}
                        disabled={isSaving}
                        className="px-2 py-0.5 text-[9px] font-mono border border-amber-500/20 text-amber-800 hover:text-amber-400 hover:border-amber-500/40 transition-all disabled:opacity-40"
                      >
                        ⇥
                      </button>
                      {confirmDelete === item.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => deleteItem(item.id)}
                            disabled={isSaving}
                            className="px-2 py-0.5 text-[9px] font-mono border border-red-500/50 text-red-400 bg-red-500/15 transition-all"
                          >
                            {isSaving ? "…" : "OK?"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-0.5 text-[9px] font-mono border border-white/10 text-slate-600 hover:text-slate-400 transition-all"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          title="Excluir permanentemente"
                          onClick={() => setConfirmDelete(item.id)}
                          className="px-2 py-0.5 text-[9px] font-mono border border-red-500/15 text-red-900 hover:text-red-500 hover:border-red-500/40 transition-all"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  )}

                  {isOpen ? <ChevronUp size={12} className="text-slate-600 shrink-0" /> : <ChevronDown size={12} className="text-slate-600 shrink-0" />}
                </button>

                {/* Expanded edit form */}
                {isOpen && (
                  <div className="border-t border-white/5 p-4 grid grid-cols-2 gap-4">

                    <div>
                      <label className="block text-[9px] text-slate-500 mb-1">Nome EN</label>
                      <input
                        value={e.name ?? item.name}
                        onChange={ev => setEdit(item.id, "name", ev.target.value)}
                        className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] text-slate-500 mb-1">Nome JP</label>
                      <input
                        value={(e.nameJp ?? item.nameJp) ?? ""}
                        onChange={ev => setEdit(item.id, "nameJp", ev.target.value)}
                        className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/30"
                        placeholder="（日本語）"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[9px] text-slate-500 mb-1">Descrição EN</label>
                      <textarea
                        value={(e.description ?? item.description) ?? ""}
                        onChange={ev => setEdit(item.id, "description", ev.target.value)}
                        rows={3}
                        className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-2 focus:outline-none focus:border-cyan-500/30 resize-none"
                        placeholder="Description…"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[9px] text-slate-500 mb-1">Descrição JP</label>
                      <textarea
                        value={(e.descriptionJp ?? item.descriptionJp) ?? ""}
                        onChange={ev => setEdit(item.id, "descriptionJp", ev.target.value)}
                        rows={3}
                        className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-2 focus:outline-none focus:border-cyan-500/30 resize-none"
                        placeholder="Descrição original em japonês…"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[9px] text-slate-500 mb-1">URL da imagem</label>
                      <div className="flex gap-2 items-center">
                        <input
                          value={(e.assetRenderUrl ?? item.assetRenderUrl) ?? ""}
                          onChange={ev => setEdit(item.id, "assetRenderUrl", ev.target.value)}
                          className="flex-1 bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/30 font-mono"
                          placeholder="https://…"
                        />
                        {(e.assetRenderUrl ?? item.assetRenderUrl) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={(e.assetRenderUrl ?? item.assetRenderUrl) ?? ""}
                            alt=""
                            className="w-10 h-10 object-contain border border-white/5"
                          />
                        )}
                      </div>
                    </div>

                    {/* ── Ações destrutivas ── */}
                    <div className="col-span-2 flex items-center justify-between pt-1 border-t border-white/5">
                      <div className="flex gap-2">
                        {/* Desvincular */}
                        <button
                          type="button"
                          onClick={() => unlinkItem(item)}
                          disabled={isSaving}
                          className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono border border-amber-500/30 text-amber-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all disabled:opacity-40"
                          title="Remove a associação com este fighter mas mantém o coletável no banco"
                        >
                          ⇥ Desvincular
                        </button>

                        {/* Excluir (com confirmação) */}
                        {confirmDelete === item.id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-red-400 font-mono">Confirmar exclusão?</span>
                            <button
                              type="button"
                              onClick={() => deleteItem(item.id)}
                              disabled={isSaving}
                              className="px-2.5 py-1 text-[10px] font-mono border border-red-500/60 text-red-400 bg-red-500/15 hover:bg-red-500/25 transition-all disabled:opacity-40"
                            >
                              {isSaving ? "…" : "✕ Excluir"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(null)}
                              className="px-2.5 py-1 text-[10px] font-mono border border-white/10 text-slate-500 hover:text-slate-300 transition-all"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(item.id)}
                            className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono border border-red-500/20 text-red-800 hover:text-red-500 hover:border-red-500/40 transition-all"
                            title="Apaga permanentemente do banco de dados"
                          >
                            ✕ Excluir
                          </button>
                        )}
                      </div>

                      <SaveButton
                        state={isSaving ? "saving" : isSaved ? "saved" : "idle"}
                        onClick={() => saveItem(item)}
                        label="Salvar"
                        disabled={!isDirty}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add New Collectible ── */}
      {isCreating ? (
        <div className="mt-4 border border-cyan-500/30 p-4 bg-cyan-900/10 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <h4 className="text-[11px] font-mono text-cyan-400 mb-2">Novo {typeLabels[type]}</h4>
          </div>
          <div>
            <label className="block text-[9px] text-slate-500 mb-1">Nome EN *</label>
            <input
              value={newItem.name}
              onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/30"
            />
          </div>
          <div>
            <label className="block text-[9px] text-slate-500 mb-1">Nome JP</label>
            <input
              value={newItem.nameJp}
              onChange={e => setNewItem(prev => ({ ...prev, nameJp: e.target.value }))}
              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/30"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[9px] text-slate-500 mb-1">Descrição EN</label>
            <textarea
              value={newItem.description}
              onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-2 focus:outline-none focus:border-cyan-500/30 resize-none"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[9px] text-slate-500 mb-1">Descrição JP</label>
            <textarea
              value={newItem.descriptionJp}
              onChange={e => setNewItem(prev => ({ ...prev, descriptionJp: e.target.value }))}
              rows={3}
              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-2 focus:outline-none focus:border-cyan-500/30 resize-none"
            />
          </div>
          <div>
            <label className="block text-[9px] text-slate-500 mb-1">Era (Game Version)</label>
            <select
              value={newItem.smashGameVersion}
              onChange={e => setNewItem(prev => ({ ...prev, smashGameVersion: e.target.value }))}
              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/30"
            >
              <option value="SSB64">SSB64</option>
              <option value="SSBM">SSBM</option>
              <option value="SSBB">SSBB</option>
              <option value="SSB4">SSB4</option>
              <option value="SSBU">SSBU</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] text-slate-500 mb-1">Render URL</label>
            <input
              value={newItem.assetRenderUrl}
              onChange={e => setNewItem(prev => ({ ...prev, assetRenderUrl: e.target.value }))}
              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/30"
            />
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-1.5 text-[11px] font-mono border border-white/10 text-slate-400 hover:text-slate-200 transition-all"
            >
              Cancelar
            </button>
            <SaveButton
              state={saving.has("new") ? "saving" : "idle"}
              onClick={handleCreate}
              label="Criar Item"
              disabled={!newItem.name.trim()}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="mt-4 w-full py-2.5 border border-dashed border-white/10 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 text-[11px] font-mono transition-all"
        >
          + Adicionar novo {typeLabels[type]}
        </button>
      )}
    </div>
  );
}

// ─── SaveButton ───────────────────────────────────────────────────────────────

function SaveButton({
  state,
  onClick,
  label,
  disabled,
}: {
  state: "idle" | "saving" | "saved" | "error";
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={state === "saving" || disabled}
      className={`flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-mono border transition-all disabled:opacity-40 ${
        state === "saved"  ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" :
        state === "error"  ? "border-red-500/50 text-red-400 bg-red-500/10" :
        state === "saving" ? "border-cyan-500/30 text-cyan-500 bg-cyan-500/5" :
        "border-cyan-500/40 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20"
      }`}
    >
      {state === "saving" ? <Loader2 size={11} className="animate-spin" /> :
       state === "saved"  ? <CheckCircle size={11} /> :
       <Save size={11} />}
      {state === "saved" ? "Salvo!" : state === "error" ? "Erro" : label}
    </button>
  );
}

// ─── Tab: Constructor ─────────────────────────────────────────────────────────

function TabConstructor({ fighterId }: { fighterId: string }) {
  const [data, setData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle"|"saving"|"saved"|"error">("idle");
  const [result, setResult] = useState<any>(null);

  const handleIngest = async () => {
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/fighters/${fighterId}/template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (!res.ok) throw new Error();
      const resData = await res.json();
      setResult(resData.parsed);
      setStatus("saved");
      setData({});
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
    }
  };

  const updateField = (key: string, val: string) => setData(p => ({ ...p, [key]: val }));

  const Field = ({ label, id, rows = 3 }: { label: string, id: string, rows?: number }) => (
    <div className="mb-3">
      <label className="block text-[10px] text-emerald-500/80 mb-1">{label}</label>
      <textarea
        value={data[id] ?? ""}
        onChange={e => updateField(id, e.target.value)}
        rows={rows}
        className="w-full bg-[#030310] border border-emerald-500/20 text-slate-200 text-[11px] px-3 py-2 focus:outline-none focus:border-emerald-500/50 placeholder:text-slate-700 resize-y font-mono leading-relaxed"
      />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
          Construtor Modular (Bulk Ingest)
        </h3>
      </div>
      
      <div className="mb-4 px-4 py-3 border border-emerald-500/15 bg-emerald-500/[0.04] text-[11px] font-mono text-emerald-600 leading-relaxed">
        Preencha apenas os campos que desejar atualizar. Campos vazios serão ignorados.
      </div>
      
      <div className="space-y-6">
        {/* N64 */}
        <section className="border border-emerald-500/10 p-4">
          <h4 className="text-[12px] font-bold text-emerald-300 mb-3 border-b border-emerald-500/10 pb-2">SSB64</h4>
          <div className="grid grid-cols-2 gap-4">
            <Field label="N64 Bios" id="n64BiosEn" rows={4} />
            <Field label="N64 Bios JP" id="n64BiosJp" rows={4} />
            <Field label="N64 Works" id="n64WorksEn" rows={2} />
            <Field label="N64 Works JP" id="n64WorksJp" rows={2} />
          </div>
        </section>

        {/* Melee */}
        <section className="border border-emerald-500/10 p-4">
          <h4 className="text-[12px] font-bold text-emerald-300 mb-3 border-b border-emerald-500/10 pb-2">Melee</h4>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Melee Trophy" id="meleeTrophyEn" rows={4} />
            <Field label="Melee Trophy JP" id="meleeTrophyJp" rows={4} />
            <Field label="Melee Works" id="meleeWorksEn" rows={2} />
            <Field label="Melee Works JP" id="meleeWorksJp" rows={2} />
            <Field label="Melee Smash 1" id="meleeSmash1En" rows={3} />
            <Field label="Melee Smash 1 JP" id="meleeSmash1Jp" rows={3} />
            <Field label="Melee Smash 2" id="meleeSmash2En" rows={3} />
            <Field label="Melee Smash 2 JP" id="meleeSmash2Jp" rows={3} />
          </div>
        </section>

        {/* Brawl */}
        <section className="border border-emerald-500/10 p-4">
          <h4 className="text-[12px] font-bold text-emerald-300 mb-3 border-b border-emerald-500/10 pb-2">Brawl</h4>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Brawl Trophy" id="brawlTrophyEn" rows={4} />
            <Field label="Brawl Trophy JP" id="brawlTrophyJp" rows={4} />
            <Field label="Brawl Works" id="brawlWorksEn" rows={2} />
            <Field label="Brawl Works JP" id="brawlWorksJp" rows={2} />
            <Field label="Brawl Final Smash (Alt)" id="brawlAltEn" rows={3} />
            <Field label="Brawl Final Smash JP" id="brawlAltJp" rows={3} />
          </div>
        </section>

        {/* Smash 4 */}
        <section className="border border-emerald-500/10 p-4">
          <h4 className="text-[12px] font-bold text-emerald-300 mb-3 border-b border-emerald-500/10 pb-2">Smash 4</h4>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Smash 4 Trophy" id="smash4TrophyEn" rows={4} />
            <Field label="Smash 4 Trophy JP" id="smash4TrophyJp" rows={4} />
            <Field label="Smash 4 Works" id="smash4WorksEn" rows={2} />
            <Field label="Smash 4 Works JP" id="smash4WorksJp" rows={2} />
            <Field label="Smash 4 Alt" id="smash4AltEn" rows={3} />
            <Field label="Smash 4 Alt JP" id="smash4AltJp" rows={3} />
          </div>
        </section>

        {/* Ultimate */}
        <section className="border border-emerald-500/10 p-4">
          <h4 className="text-[12px] font-bold text-emerald-300 mb-3 border-b border-emerald-500/10 pb-2">Ultimate</h4>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ultimate Fan Description (Overview EN)" id="ultimateFanEn" rows={4} />
            <Field label="Ultimate Works" id="ultimateWorksEn" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <Field label="Ultimate Fighter Tips" id="ultimateTipsEn" rows={10} />
            <Field label="Ultimate Fighter Tips JP" id="ultimateTipsJp" rows={10} />
          </div>
        </section>
      </div>
      
      <div className="flex justify-between items-center mt-6 sticky bottom-0 bg-[#040412] p-4 border-t border-emerald-500/20">
        <div className="text-[10px] text-slate-500 font-mono">
          {result && status === "saved" && (
            <span className="text-emerald-400">✓ Sucesso!</span>
          )}
          {status === "error" && <span className="text-red-400">✗ Erro ao salvar</span>}
        </div>
        <SaveButton state={status} onClick={handleIngest} label="Salvar Tudo" disabled={Object.keys(data).length === 0} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FighterEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [fighter, setFighter] = useState<FighterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    fetch(`/api/admin/fighters/${id}/detail`)
      .then(r => r.json())
      .then((data: FighterDetail) => { setFighter(data); setLoading(false); });
  }, [id]);

  const handleFieldUpdate = useCallback((patch: Partial<FighterDetail>) => {
    setFighter(prev => prev ? { ...prev, ...patch } : prev);
  }, []);

  if (loading || !fighter) return (
    <div className="h-screen bg-[#040412] flex items-center justify-center text-cyan-400 font-mono gap-2">
      <Loader2 size={16} className="animate-spin" /> Carregando…
    </div>
  );

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview",     label: "Visão Geral",    icon: <ImageIcon size={11} /> },
    { id: "bios",         label: "Bios",           icon: <FileText size={11} /> },
    { id: "collectibles", label: "Colecionáveis",  icon: <Trophy size={11} /> },
    { id: "constructor",  label: "Construtor",     icon: <RefreshCw size={11} className="text-emerald-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#040412] text-slate-200 font-mono flex flex-col">

      {/* ── Header ────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-cyan-500/10 px-5 py-3 flex items-center gap-3 flex-wrap">
        <Link
          href="/admin/fighters"
          className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/20 px-2.5 py-1 transition-all"
        >
          <ArrowLeft size={11} /> Fighters
        </Link>

        {/* Fighter identity */}
        <div className="flex items-center gap-2">
          {fighter.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fighter.imageUrl} alt="" className="w-7 h-8 object-contain" />
          )}
          <div>
            <span className="text-sm font-bold text-cyan-200">{fighter.name}</span>
            <span className="text-[10px] text-slate-600 ml-2">
              #{fighter.rosterNumber} · {fighter.franchise}
            </span>
          </div>
          <span className={`text-[9px] px-1.5 py-0.5 border font-mono ml-1 ${
            fighter.curationStatus === "approved"
              ? "border-emerald-500/30 text-emerald-500/70"
              : "border-amber-500/20 text-amber-500/50"
          }`}>
            {fighter.curationStatus === "approved" ? "✓ APROVADO" : "● PENDENTE"}
          </span>
        </div>

        <div className="flex-1" />

        {/* Admin nav */}
        <div className="flex gap-1">
          <Link href="/admin/fighters"      className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Curadoria</Link>
          <Link href="/admin/collectibles" className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Colecionáveis</Link>
          <Link href="/admin/chronicles"   className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Chronicles</Link>
          <Link href="/admin/music"        className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Music</Link>
          <Link href="/admin/create"       className="px-2 py-0.5 text-[10px] border border-emerald-500/20 text-emerald-600 hover:text-emerald-400 transition-all">+ Construtor</Link>
        </div>

        <Link
          href={`/franchise/${encodeURIComponent(fighter.franchise)}`}
          target="_blank"
          className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-purple-400 border border-white/5 hover:border-purple-500/20 px-2.5 py-1 transition-all"
          title={`Ver universo ${fighter.franchise}`}
        >
          <ExternalLink size={10} /> Franquia
        </Link>
        <Link
          href={`/fighters/${encodeURIComponent(fighter.name)}`}
          target="_blank"
          className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/20 px-2.5 py-1 transition-all"
        >
          <ExternalLink size={10} /> Ver página
        </Link>
      </div>

      {/* ── Tab bar ───────────────────────────────────────── */}
      <div className="shrink-0 border-b border-white/5 px-5 flex gap-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] uppercase tracking-wider border-b-2 transition-all ${
              tab === t.id
                ? "border-cyan-500 text-cyan-300"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6">
        {tab === "overview" && (
          <TabOverview fighter={fighter} onFieldUpdate={handleFieldUpdate} />
        )}
        {tab === "bios" && (
          <TabBios
            fighterId={fighter.id}
            worksEras={fighter.worksEras}
            initialBios={fighter.bios}
          />
        )}
        {tab === "collectibles" && (
          <TabCollectibles
            fighterId={fighter.id}
            franchiseId={fighter.franchiseId ?? fighter.franchiseObjId}
            franchiseName={fighter.franchise}
          />
        )}
        {tab === "constructor" && (
          <TabConstructor fighterId={fighter.id} />
        )}
      </div>
    </div>
  );
}
