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
  descriptionEn: string | null;
  descriptionPt: string | null;
  descriptionJp: string | null;
  descriptionJpEn: string | null;
  assetRenderUrl: string | null;
}

type Tab = "overview" | "bios" | "collectibles";
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

function TabBios({
  fighterId,
  worksEras,
  initialBios,
}: {
  fighterId: string;
  worksEras: string[];
  initialBios: FighterBio[];
}) {
  const [bios, setBios]   = useState<FighterBio[]>(initialBios);
  const [era,  setEra]    = useState<string>(worksEras[0] ?? "SSBU");
  const [lang, setLang]   = useState<BioLang>("EN");
  const [text, setText]   = useState<string>("");
  const save = useSaveFeedback();

  const LANG_FIELD: Record<BioLang, keyof FighterBio> = {
    EN:      "contentEn",
    PT:      "contentPt",
    JP:      "contentJp",
    "JP+EN": "contentJpEn",
  };

  const currentBio = bios.find(b => b.smashGameVersion === era);

  // Sync textarea when era/lang changes
  useEffect(() => {
    const field = LANG_FIELD[lang];
    const val = currentBio ? (currentBio[field] as string | null) : null;
    setText(val ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [era, lang, bios]);

  const handleSave = async () => {
    save.setSaving();
    try {
      const field = LANG_FIELD[lang];
      const bodyField = field as string;
      const res = await fetch(`/api/admin/fighters/${fighterId}/bios`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ smashGameVersion: era, [bodyField]: text }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated: FighterBio = await res.json();
      setBios(prev => {
        const idx = prev.findIndex(b => b.smashGameVersion === era);
        if (idx >= 0) { const n = [...prev]; n[idx] = updated; return n; }
        return [...prev, updated];
      });
      save.setSaved();
    } catch { save.setError(); }
  };

  const allEras = ["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"];

  return (
    <div className="max-w-3xl mx-auto">

      {/* Era tabs */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {allEras.map(e => {
          const inWorks = worksEras.includes(e);
          const hasBio  = bios.some(b => b.smashGameVersion === e);
          if (!inWorks && !hasBio) return null;
          return (
            <button
              key={e}
              onClick={() => setEra(e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono border transition-all ${
                era === e
                  ? `border-current bg-current/10 ${ERA_COLOR[e] ?? "text-slate-300 border-slate-500/40"}`
                  : "border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20"
              }`}
            >
              {hasBio && era !== e && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 shrink-0" />
              )}
              {ERA_LABEL[e] ?? e}
              {!inWorks && (
                <span className="text-[8px] text-slate-700 ml-0.5">ext</span>
              )}
            </button>
          );
        })}
        {/* Show all eras button */}
        {worksEras.length < 5 && (
          <button
            onClick={() => { /* show more — just set an era not in works */ }}
            className="px-3 py-1.5 text-[10px] font-mono border border-dashed border-white/10 text-slate-700 hover:text-slate-500 transition-all"
          >
            + outros eras
          </button>
        )}
      </div>

      {/* Selected era state */}
      {!worksEras.includes(era) && (
        <div className="mb-3 text-[10px] text-amber-600/70 font-mono border border-amber-500/10 px-3 py-2">
          ⚠ {ERA_LABEL[era] ?? era} não está nos works deste fighter, mas pode editar mesmo assim.
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
        placeholder={`Bio ${ERA_LABEL[era] ?? era} · ${lang}…`}
        rows={14}
        className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-4 py-3 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700 resize-none leading-relaxed font-mono"
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <span className="font-mono text-[10px] text-slate-600">{text.length} chars</span>
        <SaveButton
          state={save.state}
          onClick={handleSave}
          label={`Salvar ${ERA_LABEL[era] ?? era} · ${lang}`}
        />
      </div>

      {/* Bio status grid */}
      <div className="mt-6 border border-white/5 p-4 bg-[#05050f]">
        <p className="text-[9px] uppercase tracking-widest text-slate-600 mb-3">Status das bios</p>
        <div className="grid grid-cols-5 gap-2 text-[10px]">
          {["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"].map(e => {
            const bio = bios.find(b => b.smashGameVersion === e);
            const langs: BioLang[] = ["EN", "PT", "JP", "JP+EN"];
            const filled = bio ? langs.filter(l => {
              const f = LANG_FIELD[l];
              return !!(bio[f] as string | null);
            }) : [];
            return (
              <div key={e} className={`p-2 border ${
                worksEras.includes(e) ? "border-white/10" : "border-white/5 opacity-40"
              }`}>
                <p className={`font-mono font-bold mb-1 ${ERA_COLOR[e]?.split(" ")[0] ?? "text-slate-400"}`}>
                  {ERA_LABEL[e] ?? e}
                </p>
                {filled.length === 0 ? (
                  <p className="text-slate-700">sem bio</p>
                ) : (
                  <p className="text-slate-500">{filled.join(", ")}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
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
                        value={(e.descriptionEn ?? item.descriptionEn) ?? ""}
                        onChange={ev => setEdit(item.id, "descriptionEn", ev.target.value)}
                        rows={3}
                        className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-2 focus:outline-none focus:border-cyan-500/30 resize-none"
                        placeholder="Description…"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[9px] text-slate-500 mb-1">Descrição PT</label>
                      <textarea
                        value={(e.descriptionPt ?? item.descriptionPt) ?? ""}
                        onChange={ev => setEdit(item.id, "descriptionPt", ev.target.value)}
                        rows={3}
                        className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[11px] px-2.5 py-2 focus:outline-none focus:border-cyan-500/30 resize-none"
                        placeholder="Descrição em português…"
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
          <Link href="/admin/fighters"   className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Curadoria</Link>
          <Link href="/admin/chronicles" className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Chronicles</Link>
          <Link href="/admin/music"      className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Music</Link>
          <Link href="/admin/create"     className="px-2 py-0.5 text-[10px] border border-emerald-500/20 text-emerald-600 hover:text-emerald-400 transition-all">+ Construtor</Link>
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
      </div>
    </div>
  );
}
