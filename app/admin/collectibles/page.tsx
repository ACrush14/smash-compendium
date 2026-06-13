"use client";

import { useEffect, useState, useCallback, useRef, useId } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, CheckCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Franchise {
  id:   string;
  name: string;
}

interface CollectibleItem {
  id:                     string;
  type:                   string;
  smashGameVersion:       string;
  name:                   string;
  nameJp:                 string | null;
  description:            string | null;
  descriptionPt:          string | null;
  descriptionJp:          string | null;
  descriptionJpEn:        string | null;
  assetRenderUrl:         string | null;
  franchiseId:            string | null;
  fighter:                { id: string; name: string } | null;
  spiritArtworkSource:    string | null;
  spiritFirstAppearance:  string | null;
  spiritMusicTitle:       string | null;
  spiritMusicArtist:      string | null;
  spiritMusicDuration:    string | null;
  spiritCuratorComment:   string | null;
}

type CollectibleType  = "ALL" | "TROPHY" | "SPIRIT" | "STICKER";
type LinkedFilter    = "ALL" | "UNLINKED";
type MetaFilter      = "ALL" | "NO_FIRST" | "NO_ART" | "NO_MUSIC" | "NO_DESC";

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
    timerRef.current = setTimeout(() => setState("idle"), 2500);
  };
  const setError  = () => {
    setState("error");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setState("idle"), 3000);
  };
  return { state, setSaving, setSaved, setError };
}

// ─── AutocompleteInput — generic searchable dropdown ─────────────────────────

function AutocompleteInput({
  value, onChange, fetchUrl, placeholder, className,
}: {
  value:       string;
  onChange:    (val: string) => void;
  fetchUrl:    (q: string) => string;
  placeholder: string;
  className?:  string;
}) {
  const [query,    setQuery]    = useState(value);
  const [results,  setResults]  = useState<{ id: string; label: string }[]>([]);
  const [open,     setOpen]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const id    = useId();

  // Sync external value changes
  useEffect(() => { setQuery(value); }, [value]);

  const search = useCallback((q: string) => {
    clearTimeout(timer.current);
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetch(fetchUrl(q)).then(r => r.json()) as { id: string; label: string }[];
        setResults(data);
        setOpen(data.length > 0);
      } finally { setLoading(false); }
    }, 220);
  }, [fetchUrl]);

  return (
    <div className="relative" id={id}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); search(e.target.value); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => { if (results.length > 0) setOpen(true); }}
        className={`w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-1.5 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700 ${className ?? ""}`}
      />
      {loading && <Loader2 size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 animate-spin" />}
      {open && results.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 bg-[#080818] border border-white/10 max-h-48 overflow-y-auto shadow-xl mt-0.5">
          {results.map(r => (
            <li key={r.id}>
              <button
                type="button"
                onMouseDown={() => { onChange(r.label); setQuery(r.label); setOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-[11px] text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── MusicAutocomplete — selects music and auto-fills artist + duration ────────

function MusicAutocomplete({
  title, artist, duration,
  onSelect,
}: {
  title:    string;
  artist:   string;
  duration: string;
  onSelect: (title: string, artist: string, duration: string) => void;
}) {
  const [query,   setQuery]   = useState(title);
  const [results, setResults] = useState<{ id: string; title: string; arranger: string | null; duration: string | null }[]>([]);
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { setQuery(title); }, [title]);

  const search = (q: string) => {
    clearTimeout(timer.current);
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetch(`/api/admin/music-tracks/search?q=${encodeURIComponent(q)}`).then(r => r.json());
        setResults(data);
        setOpen(data.length > 0);
      } finally { setLoading(false); }
    }, 220);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-2">
        <label className="block text-[10px] text-slate-500 mb-1">Música</label>
        <div className="relative">
          <input
            type="text"
            value={query}
            placeholder="Ex: Jump Up, Super Star!"
            onChange={e => { setQuery(e.target.value); onSelect(e.target.value, artist, duration); search(e.target.value); }}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-1.5 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700"
          />
          {loading && <Loader2 size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 animate-spin" />}
          {open && results.length > 0 && (
            <ul className="absolute z-50 top-full left-0 right-0 bg-[#080818] border border-white/10 max-h-48 overflow-y-auto shadow-xl mt-0.5">
              {results.map(r => (
                <li key={r.id}>
                  <button
                    type="button"
                    onMouseDown={() => {
                      const a = r.arranger ?? "";
                      const d = r.duration ?? "";
                      onSelect(r.title, a, d);
                      setQuery(r.title);
                      setOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-cyan-500/10 transition-colors"
                  >
                    <p className="text-[11px] text-slate-300 truncate">{r.title}</p>
                    <p className="text-[9px] text-slate-600">{r.arranger ?? "—"}{r.duration ? ` · ${r.duration}` : ""}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div>
        <label className="block text-[10px] text-slate-500 mb-1">Duração</label>
        <input
          type="text"
          value={duration}
          placeholder="Ex: 04:10"
          onChange={e => onSelect(title, artist, e.target.value)}
          className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-1.5 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700"
        />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminCollectiblesPage() {
  const [franchises,     setFranchises]     = useState<Franchise[]>([]);
  const [selectedFranchise, setSelectedFranchise] = useState<string>("");
  const [typeFilter,     setTypeFilter]     = useState<CollectibleType>("SPIRIT");
  const [linkedFilter,   setLinkedFilter]   = useState<LinkedFilter>("ALL");
  const [metaFilter,     setMetaFilter]     = useState<MetaFilter>("ALL");
  const [search,         setSearch]         = useState<string>("");
  const [items,          setItems]          = useState<CollectibleItem[]>([]);
  const [loading,        setLoading]        = useState(false);
  const [expanded,       setExpanded]       = useState<Set<string>>(new Set());
  const [edits,          setEdits]          = useState<Record<string, Partial<CollectibleItem>>>({});
  const [saving,         setSaving]         = useState<Set<string>>(new Set());
  const [saved,          setSaved]          = useState<Set<string>>(new Set());
  const [confirmDelete,  setConfirmDelete]  = useState<string | null>(null);

  // Load franchises
  useEffect(() => {
    fetch("/api/admin/franchises")
      .then(r => r.json())
      .then((data: Franchise[]) => setFranchises(data));
  }, []);

  // Load collectibles when filters change
  const loadItems = useCallback(async () => {
    // Require franchise unless filtering by a specific type (SPIRIT/TROPHY/STICKER)
    if (!selectedFranchise && typeFilter === "ALL") { setItems([]); return; }
    setLoading(true);
    const params = new URLSearchParams({
      ...(selectedFranchise && { franchiseId: selectedFranchise }),
      ...(typeFilter !== "ALL" && { type: typeFilter }),
      ...(linkedFilter === "UNLINKED" && { fighterId: "null" }),
      ...(search.trim() && { q: search.trim() }),
      take: "1600",
    });
    const data = await fetch(`/api/admin/collectibles?${params}`).then(r => r.json());
    setItems(data);
    setLoading(false);
    setExpanded(new Set());
    setEdits({});
  }, [selectedFranchise, typeFilter, linkedFilter, search]);

  useEffect(() => { loadItems(); }, [loadItems]);

  // ── Inline edit helpers ──────────────────────────────────────────────────────

  const toggle = (id: string) =>
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const setEdit = (id: string, field: string, value: string) =>
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const saveItem = async (item: CollectibleItem) => {
    const patch = edits[item.id];
    if (!patch || Object.keys(patch).length === 0) return;
    setSaving(prev => new Set(prev).add(item.id));
    try {
      await fetch(`/api/admin/collectibles/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      setItems(prev => prev.map(c => c.id === item.id ? { ...c, ...patch } : c));
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

  // ── Client-side meta filter (spirits only) ──────────────────────────────────

  const displayItems = metaFilter === "ALL" ? items : items.filter(item => {
    if (item.type !== "SPIRIT") return false;
    if (metaFilter === "NO_FIRST") return !item.spiritFirstAppearance;
    if (metaFilter === "NO_ART")   return !item.spiritArtworkSource;
    if (metaFilter === "NO_MUSIC") return !item.spiritMusicTitle;
    if (metaFilter === "NO_DESC")  return !item.spiritCuratorComment;
    return true;
  });

  // ── Counts ──────────────────────────────────────────────────────────────────

  const counts: Record<string, number> = { ALL: items.length };
  for (const c of items) { counts[c.type] = (counts[c.type] ?? 0) + 1; }
  const unlinkedCount = items.filter(c => !c.fighter).length;
  const spirits       = items.filter(c => c.type === "SPIRIT");
  const metaCounts: Record<MetaFilter, number> = {
    ALL:      spirits.length,
    NO_FIRST: spirits.filter(s => !s.spiritFirstAppearance).length,
    NO_ART:   spirits.filter(s => !s.spiritArtworkSource).length,
    NO_MUSIC: spirits.filter(s => !s.spiritMusicTitle).length,
    NO_DESC:  spirits.filter(s => !s.spiritCuratorComment).length,
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#040412] text-slate-200 font-mono flex flex-col">

      {/* Header */}
      <div className="shrink-0 border-b border-cyan-500/10 px-5 py-3 flex items-center gap-3 flex-wrap">
        <Link href="/admin/fighters" className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/20 px-2.5 py-1 transition-all">
          <ArrowLeft size={11} /> Fighters
        </Link>
        <span className="text-[12px] font-bold text-cyan-200">Colecionáveis</span>
        <span className="text-[10px] text-slate-600">Editar troféus, spirits e stickers por franquia</span>
        <div className="flex-1" />
        <div className="flex gap-1">
          <Link href="/admin/fighters"   className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Curadoria</Link>
          <Link href="/admin/chronicles" className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Chronicles</Link>
          <Link href="/admin/create"     className="px-2 py-0.5 text-[10px] border border-emerald-500/20 text-emerald-600 hover:text-emerald-400 transition-all">+ Construtor</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0 border-b border-white/5 px-5 py-3 flex flex-wrap items-center gap-3">

        {/* Franchise selector */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-slate-600">Franquia:</label>
          <select
            value={selectedFranchise}
            onChange={e => setSelectedFranchise(e.target.value)}
            className="bg-[#030310] border border-white/10 text-slate-300 text-[11px] px-2 py-1 focus:outline-none focus:border-cyan-500/20 min-w-[160px]"
          >
            <option value="">— selecione —</option>
            {franchises.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Type filter */}
        <div className="flex gap-1">
          {(["ALL", "TROPHY", "SPIRIT", "STICKER"] as CollectibleType[]).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 text-[10px] border transition-all ${
                typeFilter === t
                  ? "border-cyan-500/40 text-cyan-400 bg-cyan-500/10"
                  : "border-white/10 text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "ALL" ? "Todos" : t === "TROPHY" ? "Troféus" : t === "SPIRIT" ? "Spirits" : "Stickers"}
              {counts[t] !== undefined && (
                <span className="ml-1 text-[8px] opacity-50">{counts[t]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Linked filter */}
        <div className="flex gap-1">
          <button
            onClick={() => setLinkedFilter("ALL")}
            className={`px-2.5 py-1 text-[10px] border transition-all ${
              linkedFilter === "ALL"
                ? "border-white/30 text-slate-300"
                : "border-white/10 text-slate-600 hover:text-slate-400"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setLinkedFilter("UNLINKED")}
            className={`px-2.5 py-1 text-[10px] border transition-all ${
              linkedFilter === "UNLINKED"
                ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
                : "border-white/10 text-slate-600 hover:text-slate-400"
            }`}
          >
            Sem fighter
            {unlinkedCount > 0 && (
              <span className="ml-1 text-[8px] opacity-50">{unlinkedCount}</span>
            )}
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome…"
          className="bg-[#030310] border border-white/10 text-slate-300 text-[11px] px-2.5 py-1 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700 w-48"
        />
      </div>

      {/* Spirit metadata filters */}
      {(typeFilter === "SPIRIT" || typeFilter === "ALL") && spirits.length > 0 && (
        <div className="shrink-0 border-b border-white/5 px-5 py-2 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-600 mr-1">Spirit sem:</span>
          {(["ALL", "NO_FIRST", "NO_ART", "NO_MUSIC", "NO_DESC"] as MetaFilter[]).map(f => {
            const label = f === "ALL" ? "Todos" : f === "NO_FIRST" ? "1ª Aparição" : f === "NO_ART" ? "Arte" : f === "NO_MUSIC" ? "Música" : "Descrição";
            const active = metaFilter === f;
            return (
              <button key={f} onClick={() => setMetaFilter(f)}
                className={`px-2.5 py-0.5 text-[10px] border transition-all ${
                  active
                    ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
                    : "border-white/10 text-slate-600 hover:text-slate-400"
                }`}>
                {label}
                <span className="ml-1 text-[8px] opacity-50">{metaCounts[f]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">

        {!selectedFranchise && typeFilter === "ALL" ? (
          <div className="flex items-center justify-center h-40 text-slate-700 text-[12px]">
            Selecione uma franquia ou um tipo específico para ver os colecionáveis
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-40 text-slate-600 gap-2">
            <Loader2 size={14} className="animate-spin" /> Carregando…
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-slate-700 text-[12px]">
            Nenhum colecionável encontrado com estes filtros.
          </div>
        ) : (
          <div className="max-w-4xl space-y-1">
            {displayItems.map(item => {
              const isOpen    = expanded.has(item.id);
              const editPatch = edits[item.id] ?? {};
              const isDirty   = Object.keys(editPatch).length > 0;
              const isSaving  = saving.has(item.id);
              const isSaved   = saved.has(item.id);
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

                    {/* Type badge */}
                    <span className="text-[8px] font-mono px-1 py-0.5 border border-white/10 text-slate-700 shrink-0">
                      {item.type}
                    </span>

                    {/* Image */}
                    {item.assetRenderUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.assetRenderUrl} alt="" className="w-6 h-6 object-contain shrink-0 opacity-80" />
                    ) : (
                      <div className="w-6 h-6 border border-white/5 shrink-0" />
                    )}

                    <span className="text-[12px] text-slate-300 truncate flex-1">{item.name}</span>

                    {/* Fighter attribution */}
                    {item.fighter ? (
                      <span className="text-[9px] font-mono text-cyan-800 shrink-0">← {item.fighter.name}</span>
                    ) : (
                      <span className="text-[9px] font-mono text-amber-800/60 shrink-0">sem fighter</span>
                    )}

                    {isDirty && <span className="text-[9px] text-amber-400 font-mono shrink-0">● não salvo</span>}
                    {isSaved && !isDirty && <span className="text-[9px] text-emerald-400 font-mono shrink-0">✓</span>}

                    {/* Quick delete */}
                    {!isOpen && (
                      <div className="flex gap-1 shrink-0" onClick={ev => ev.stopPropagation()}>
                        {confirmDelete === item.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => deleteItem(item.id)}
                              disabled={isSaving}
                              className="px-2 py-0.5 text-[9px] font-mono border border-red-500/50 text-red-400 bg-red-500/15"
                            >
                              {isSaving ? "…" : "OK?"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(null)}
                              className="px-2 py-0.5 text-[9px] font-mono border border-white/10 text-slate-600 hover:text-slate-400"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(item.id)}
                            className="px-2 py-0.5 text-[9px] font-mono border border-red-500/15 text-red-900 hover:text-red-500 hover:border-red-500/40 transition-all"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    )}
                  </button>

                  {/* Expanded edit form */}
                  {isOpen && (
                    <div className="border-t border-white/5 px-4 py-4 space-y-3">

                      {/* Names row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">Nome EN</label>
                          <input
                            type="text"
                            value={e.name ?? item.name}
                            onChange={ev => setEdit(item.id, "name", ev.target.value)}
                            className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-1.5 focus:outline-none focus:border-cyan-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">Nome JP</label>
                          <input
                            type="text"
                            value={e.nameJp ?? item.nameJp ?? ""}
                            onChange={ev => setEdit(item.id, "nameJp", ev.target.value)}
                            placeholder="（日本語）"
                            className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-1.5 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700"
                          />
                        </div>
                      </div>

                      {/* Description EN */}
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">Descrição EN</label>
                        <textarea
                          value={e.description ?? item.description ?? ""}
                          onChange={ev => setEdit(item.id, "description", ev.target.value)}
                          placeholder="Description..."
                          rows={3}
                          className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700 resize-none"
                        />
                      </div>

                      {/* Description PT */}
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">Descrição PT</label>
                        <textarea
                          value={e.descriptionPt ?? item.descriptionPt ?? ""}
                          onChange={ev => setEdit(item.id, "descriptionPt", ev.target.value)}
                          placeholder="Descrição em português..."
                          rows={3}
                          className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700 resize-none"
                        />
                      </div>

                      {/* Image URL */}
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label className="block text-[10px] text-slate-500 mb-1">URL da imagem</label>
                          <input
                            type="text"
                            value={e.assetRenderUrl ?? item.assetRenderUrl ?? ""}
                            onChange={ev => setEdit(item.id, "assetRenderUrl", ev.target.value)}
                            placeholder="/assets/collectibles/..."
                            className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-1.5 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700"
                          />
                        </div>
                        {(e.assetRenderUrl ?? item.assetRenderUrl) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={e.assetRenderUrl ?? item.assetRenderUrl ?? ""}
                            alt=""
                            className="w-10 h-10 object-contain border border-white/10 shrink-0"
                          />
                        )}
                      </div>

                      {/* Spirit-specific fields */}
                      {item.type === "SPIRIT" && (
                        <div className="space-y-3 border-t border-white/5 pt-3">
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest">Spirit metadata</p>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-1">Arte de origem</label>
                              <AutocompleteInput
                                value={e.spiritArtworkSource ?? item.spiritArtworkSource ?? ""}
                                onChange={val => setEdit(item.id, "spiritArtworkSource", val)}
                                fetchUrl={q => `/api/admin/chronicles/search?q=${encodeURIComponent(q)}`}
                                placeholder="Ex: Mario Party 10 (2015)"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-1">1ª Aparição</label>
                              <AutocompleteInput
                                value={e.spiritFirstAppearance ?? item.spiritFirstAppearance ?? ""}
                                onChange={val => setEdit(item.id, "spiritFirstAppearance", val)}
                                fetchUrl={q => `/api/admin/chronicles/search?q=${encodeURIComponent(q)}`}
                                placeholder="Ex: Donkey Kong (1981)"
                              />
                            </div>
                          </div>

                          <MusicAutocomplete
                            title={e.spiritMusicTitle ?? item.spiritMusicTitle ?? ""}
                            artist={e.spiritMusicArtist ?? item.spiritMusicArtist ?? ""}
                            duration={e.spiritMusicDuration ?? item.spiritMusicDuration ?? ""}
                            onSelect={(t, a, d) => {
                              setEdit(item.id, "spiritMusicTitle",    t);
                              setEdit(item.id, "spiritMusicArtist",   a);
                              setEdit(item.id, "spiritMusicDuration", d);
                            }}
                          />

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1">Artista / Arranjador</label>
                            <input
                              type="text"
                              value={e.spiritMusicArtist ?? item.spiritMusicArtist ?? ""}
                              onChange={ev => setEdit(item.id, "spiritMusicArtist", ev.target.value)}
                              placeholder="Ex: Naoto Kubo ft. Kate Davis"
                              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-1.5 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1">Descrição curatorial</label>
                            <textarea
                              value={e.spiritCuratorComment ?? item.spiritCuratorComment ?? ""}
                              onChange={ev => setEdit(item.id, "spiritCuratorComment", ev.target.value)}
                              placeholder="Texto descritivo do spirit..."
                              rows={4}
                              className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/20 placeholder:text-slate-700 resize-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Action row */}
                      <div className="flex items-center gap-2 pt-1">
                        {/* Delete with confirm */}
                        {confirmDelete === item.id ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => deleteItem(item.id)}
                              disabled={isSaving}
                              className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono border border-red-500/60 text-red-400 bg-red-500/15 hover:bg-red-500/25 transition-all disabled:opacity-40"
                            >
                              {isSaving ? "…" : "✕ Excluir definitivamente"}
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
                          >
                            ✕ Excluir
                          </button>
                        )}

                        <div className="flex-1" />

                        <SaveItemButton
                          isSaving={isSaving}
                          isSaved={isSaved}
                          isDirty={isDirty}
                          onClick={() => saveItem(item)}
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
    </div>
  );
}

// ─── Inline save button ───────────────────────────────────────────────────────

function SaveItemButton({
  isSaving, isSaved, isDirty, onClick,
}: {
  isSaving: boolean;
  isSaved:  boolean;
  isDirty:  boolean;
  onClick:  () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isDirty || isSaving}
      className={`flex items-center gap-1.5 px-4 py-1 text-[11px] font-mono border transition-all disabled:opacity-40 ${
        isSaved   ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" :
        isSaving  ? "border-cyan-500/30 text-cyan-500 bg-cyan-500/5" :
        "border-cyan-500/40 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20"
      }`}
    >
      {isSaving ? <Loader2 size={11} className="animate-spin" /> :
       isSaved   ? <CheckCircle size={11} /> :
       <Save size={11} />}
      {isSaved ? "Salvo!" : isSaving ? "…" : "Salvar"}
    </button>
  );
}
