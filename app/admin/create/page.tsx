"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Shield, Loader2, CheckCircle, Plus, Sword, Trophy, Ghost,
  Music, Layout, BookOpen, Gamepad2, ExternalLink, ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Franchise { id: string; name: string }
interface SmashGame { id: string; titleEn: string; era: string; platform: string; releaseYear: number | null }
interface RecentItem { label: string; subLabel?: string; href?: string; id: string }

type EntityType =
  | "fighter"
  | "trophy"
  | "spirit"
  | "sticker"
  | "music"
  | "stage"
  | "chronicle"
  | "franchise";

const ERA_ORDER = ["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"];
const ERA_LABEL: Record<string, string> = {
  SSB64: "SSB64 · N64", SSBM: "SSBM · GameCube",
  SSBB: "SSBB · Wii",   SSB4: "SSB4 · Wii U/3DS",
  SSBU: "SSBU · Switch",
};

// ─── Shared: FranchiseSelect ──────────────────────────────────────────────────

function FranchiseSelect({
  value, onChange, franchises, required,
}: {
  value: string; onChange: (v: string) => void;
  franchises: Franchise[]; required?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/30"
    >
      <option value="">— Selecionar franquia —</option>
      {franchises.map(f => (
        <option key={f.id} value={f.id}>{f.name}</option>
      ))}
    </select>
  );
}

// ─── Shared: FighterSearch ────────────────────────────────────────────────────

function FighterSearch({
  value, onChange, placeholder,
}: {
  value: string; onChange: (id: string, name: string) => void;
  placeholder?: string;
}) {
  const [q, setQ]           = useState("");
  const [results, setResults] = useState<{ id: string; name: string }[]>([]);
  const [open, setOpen]       = useState(false);
  const [selected, setSelected] = useState(value ? "carregando…" : "");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback((term: string) => {
    clearTimeout(timerRef.current);
    if (!term.trim()) { setResults([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      const data = await fetch(`/api/admin/fighters?q=${encodeURIComponent(term)}`)
        .then(r => r.json());
      setResults(data.slice(0, 8).map((f: { id: string; name: string }) => ({ id: f.id, name: f.name })));
      setOpen(true);
    }, 300);
  }, []);

  return (
    <div className="relative">
      <input
        value={selected || q}
        onChange={e => { setQ(e.target.value); setSelected(""); search(e.target.value); }}
        onFocus={() => q && setOpen(true)}
        placeholder={placeholder ?? "Buscar fighter…"}
        className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/30 placeholder:text-slate-700"
      />
      {open && results.length > 0 && (
        <div className="absolute z-20 w-full bg-[#07071a] border border-white/10 shadow-lg">
          {results.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => { onChange(r.id, r.name); setSelected(r.name); setQ(""); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-[12px] text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all"
            >
              {r.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared: FieldRow ─────────────────────────────────────────────────────────

function Field({
  label, required, children,
  hint,
}: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">
        {label}{required && <span className="text-cyan-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[9px] text-slate-700 mt-0.5">{hint}</p>}
    </div>
  );
}

function Input({
  value, onChange, placeholder, required, type = "text",
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/30 placeholder:text-slate-700"
    />
  );
}

function Textarea({
  value, onChange, placeholder, rows = 3,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/30 placeholder:text-slate-700 resize-none"
    />
  );
}

function EraSelect({ value, onChange, required }: { value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/30"
    >
      <option value="">— Selecionar era —</option>
      {ERA_ORDER.map(era => (
        <option key={era} value={era}>{ERA_LABEL[era] ?? era}</option>
      ))}
    </select>
  );
}

// ─── SubmitButton ──────────────────────────────────────────────────────────────

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2 bg-cyan-500/15 border border-cyan-500/50 text-cyan-300 text-[12px] font-mono uppercase tracking-wider hover:bg-cyan-500/25 transition-all disabled:opacity-40"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
      {label}
    </button>
  );
}

// ─── Success Banner ────────────────────────────────────────────────────────────

function SuccessBanner({
  item, onCreateAnother,
}: {
  item: RecentItem; onCreateAnother: () => void;
}) {
  return (
    <div className="border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-4">
      <CheckCircle size={18} className="text-emerald-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-emerald-300 text-[13px] font-bold truncate">{item.label}</p>
        {item.subLabel && <p className="text-[10px] text-slate-500">{item.subLabel}</p>}
      </div>
      <div className="flex gap-2 shrink-0">
        {item.href && (
          <Link
            href={item.href}
            className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/20 px-2.5 py-1 transition-all"
          >
            <ExternalLink size={10} /> Abrir
          </Link>
        )}
        <button
          onClick={onCreateAnother}
          className="flex items-center gap-1 text-[10px] text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 px-2.5 py-1 transition-all"
        >
          <Plus size={10} /> Criar outro
        </button>
      </div>
    </div>
  );
}

// ─── Form: Fighter ────────────────────────────────────────────────────────────

function FormFighter({
  franchises, smashGames, onSuccess,
}: {
  franchises: Franchise[]; smashGames: SmashGame[]; onSuccess: (item: RecentItem) => void;
}) {
  const [name,         setName]         = useState("");
  const [rosterNumber, setRosterNumber] = useState("");
  const [franchiseId,  setFranchiseId]  = useState("");
  const [imageUrl,     setImageUrl]     = useState("");
  const [musicId,      setMusicId]      = useState("");
  const [musicTitle,   setMusicTitle]   = useState("");
  const [musicArtist,  setMusicArtist]  = useState("");
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());
  const [debutGame,    setDebutGame]    = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const toggleGame = (id: string) =>
    setSelectedGames(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !rosterNumber.trim() || !franchiseId) {
      setError("Preencha os campos obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const works = Array.from(selectedGames).map(gameId => ({
        gameId,
        isDebut: gameId === debutGame,
      }));
      const res = await fetch("/api/admin/fighters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          rosterNumber: rosterNumber.trim(),
          franchiseId,
          imageUrl: imageUrl || null,
          musicYoutubeId: musicId || null,
          musicTitle: musicTitle || null,
          musicArtist: musicArtist || null,
          works: works.length > 0 ? works : undefined,
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Erro ao criar fighter");
      }
      const created = await res.json();
      onSuccess({
        id: created.id,
        label: `#${created.rosterNumber} ${created.name}`,
        subLabel: `${created.franchise} · ${works.length} games`,
        href: `/admin/fighters/${created.id}`,
      });
      // reset
      setName(""); setRosterNumber(""); setFranchiseId(""); setImageUrl("");
      setMusicId(""); setMusicTitle(""); setMusicArtist("");
      setSelectedGames(new Set()); setDebutGame("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <Field label="Roster #" required>
            <Input value={rosterNumber} onChange={setRosterNumber} placeholder="01" required />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Nome" required>
            <Input value={name} onChange={setName} placeholder="Mario" required />
          </Field>
        </div>
      </div>

      <Field label="Franquia" required>
        <FranchiseSelect value={franchiseId} onChange={setFranchiseId} franchises={franchises} required />
      </Field>

      <Field label="Image URL (Render 3D)" hint="PNG com fundo transparente do SmashWiki">
        <Input value={imageUrl} onChange={setImageUrl} placeholder="https://ssb.wiki.gallery/…" />
      </Field>

      {/* Smash Games */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">
          Aparece em (Works)
        </label>
        <div className="flex flex-col gap-1.5">
          {smashGames.map(g => (
            <label key={g.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedGames.has(g.id)}
                onChange={() => toggleGame(g.id)}
                className="accent-cyan-500"
              />
              <span className={`text-[12px] transition-all ${
                selectedGames.has(g.id) ? "text-slate-200" : "text-slate-500 group-hover:text-slate-400"
              }`}>
                {ERA_LABEL[g.era] ?? g.era}
              </span>
              {selectedGames.has(g.id) && (
                <label className="flex items-center gap-1 ml-auto text-[10px] text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="debutGame"
                    value={g.id}
                    checked={debutGame === g.id}
                    onChange={() => setDebutGame(g.id)}
                    className="accent-amber-500"
                  />
                  debut
                </label>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Optional music */}
      <details className="group">
        <summary className="cursor-pointer text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-all list-none flex items-center gap-1.5">
          <ChevronRight size={10} className="group-open:rotate-90 transition-transform" />
          Música icônica (opcional)
        </summary>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <Field label="YouTube ID">
              <Input value={musicId} onChange={setMusicId} placeholder="dQw4w9WgXcQ" />
            </Field>
          </div>
          <div>
            <Field label="Título">
              <Input value={musicTitle} onChange={setMusicTitle} placeholder="Main Theme" />
            </Field>
          </div>
          <div>
            <Field label="Artista">
              <Input value={musicArtist} onChange={setMusicArtist} placeholder="Koji Kondo" />
            </Field>
          </div>
        </div>
      </details>

      {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}

      <SubmitButton loading={loading} label="Criar Fighter" />
    </form>
  );
}

// ─── Form: Collectible (Trophy / Spirit / Sticker) ────────────────────────────

function FormCollectible({
  type, onSuccess,
}: {
  type: "TROPHY" | "SPIRIT" | "STICKER"; onSuccess: (item: RecentItem) => void;
}) {
  const [name,          setName]         = useState("");
  const [nameJp,        setNameJp]       = useState("");
  const [era,           setEra]          = useState("");
  const [fighterId,     setFighterId]    = useState("");
  const [descEn,        setDescEn]       = useState("");
  const [descPt,        setDescPt]       = useState("");
  const [imageUrl,      setImageUrl]     = useState("");
  const [loading,       setLoading]      = useState(false);
  const [error,         setError]        = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !era) {
      setError("Preencha os campos obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/collectibles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          smashGameVersion: era,
          name: name.trim(),
          fighterId: fighterId || null,
          nameJp: nameJp || null,
          description: descEn || null,
          descriptionPt: descPt || null,
          assetRenderUrl: imageUrl || null,
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Erro ao criar");
      }
      const created = await res.json();
      onSuccess({
        id: created.id,
        label: `${created.name}`,
        subLabel: `${type} · ${era}`,
      });
      setName(""); setNameJp(""); setEra(""); setFighterId("");
      setDescEn(""); setDescPt(""); setImageUrl("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const typeLabel = type === "TROPHY" ? "Troféu" : type === "SPIRIT" ? "Spirit" : "Sticker";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome EN" required>
          <Input value={name} onChange={setName} placeholder={`${typeLabel} name…`} required />
        </Field>
        <Field label="Nome JP">
          <Input value={nameJp} onChange={setNameJp} placeholder="（日本語）" />
        </Field>
      </div>

      <Field label="Jogo (Era)" required>
        <EraSelect value={era} onChange={setEra} required />
      </Field>

      <Field label="Fighter associado (opcional)">
        <FighterSearch value={fighterId} onChange={(id) => setFighterId(id)} />
      </Field>

      <Field label="Descrição EN">
        <Textarea value={descEn} onChange={setDescEn} placeholder="Description…" rows={3} />
      </Field>

      <Field label="Descrição PT">
        <Textarea value={descPt} onChange={setDescPt} placeholder="Descrição em português…" rows={3} />
      </Field>

      <Field label="URL da imagem (assetRenderUrl)">
        <div className="flex gap-2 items-center">
          <Input value={imageUrl} onChange={setImageUrl} placeholder="/assets/collectibles/…" />
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="w-10 h-10 object-contain border border-white/10 shrink-0" />
          )}
        </div>
      </Field>

      {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}

      <SubmitButton loading={loading} label={`Criar ${typeLabel}`} />
    </form>
  );
}

// ─── Form: Stage Music Track ──────────────────────────────────────────────────

const MUSIC_COMPOSITION_TYPES = [
  "", "Original", "New Remix", "New Arrangement",
  "Melee Remix", "Brawl Remix", "SSB4 Remix", "Other Remix",
];

function FormMusic({
  franchises, onSuccess,
}: {
  franchises: Franchise[]; onSuccess: (item: RecentItem) => void;
}) {
  const [title,           setTitle]           = useState("");
  const [franchiseId,     setFranchiseId]     = useState("");
  const [arranger,        setArranger]        = useState("");
  const [isRemix,         setIsRemix]         = useState(false);
  const [youtubeId,       setYoutubeId]       = useState("");
  const [duration,        setDuration]        = useState("");
  const [sourceGame,      setSourceGame]      = useState("");
  const [compositionType, setCompositionType] = useState("");
  const [notes,           setNotes]           = useState("");
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !franchiseId) {
      setError("Preencha os campos obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/music-tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:           title.trim(),
          franchiseId,
          arranger:        arranger        || null,
          isRemix,
          youtubeId:       youtubeId       || null,
          duration:        duration        || null,
          sourceGame:      sourceGame      || null,
          compositionType: compositionType || null,
          notes:           notes           || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro");
      const created = await res.json();
      onSuccess({
        id: created.id,
        label: created.title,
        subLabel: `${franchises.find(f => f.id === franchiseId)?.name ?? ""} · ${compositionType || (isRemix ? "remix" : "original")}`,
      });
      setTitle(""); setFranchiseId(""); setArranger(""); setIsRemix(false);
      setYoutubeId(""); setDuration(""); setSourceGame(""); setCompositionType(""); setNotes("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Título" required>
        <Input value={title} onChange={setTitle} placeholder="Ground Theme (Super Mario Bros.)" required />
      </Field>

      <Field label="Franquia" required>
        <FranchiseSelect value={franchiseId} onChange={setFranchiseId} franchises={franchises} required />
      </Field>

      <Field label="YouTube ID" hint="ID do vídeo (ex: dQw4w9WgXcQ)">
        <Input value={youtubeId} onChange={setYoutubeId} placeholder="dQw4w9WgXcQ" />
      </Field>

      <Field label="Duração" hint="Formato MM:SS">
        <Input value={duration} onChange={setDuration} placeholder="2:30" />
      </Field>

      <Field label="Jogo de Origem">
        <Input value={sourceGame} onChange={setSourceGame} placeholder="Super Mario Bros." />
      </Field>

      <Field label="Tipo de Composição">
        <select
          value={compositionType}
          onChange={e => {
            setCompositionType(e.target.value);
            setIsRemix(e.target.value !== "Original" && e.target.value !== "");
          }}
          className="w-full bg-[#050510] border border-white/10 text-slate-300 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/50"
        >
          {MUSIC_COMPOSITION_TYPES.map(t => (
            <option key={t} value={t}>{t || "— selecionar —"}</option>
          ))}
        </select>
      </Field>

      <Field label="Arranjador / Compositor" hint="Deixe vazio se desconhecido">
        <Input value={arranger} onChange={setArranger} placeholder="Koji Kondo" />
      </Field>

      <Field label="Notas" hint="Créditos, supervisores, curiosidades">
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Arranged by... Supervised by..."
          className="w-full bg-[#050510] border border-white/10 text-slate-200 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/50 resize-y min-h-[64px]"
        />
      </Field>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isRemix}
          onChange={e => setIsRemix(e.target.checked)}
          className="accent-purple-500"
        />
        <span className="text-[12px] text-slate-400">É um remix / arranjo</span>
      </label>

      {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}

      <SubmitButton loading={loading} label="Criar Faixa Musical" />
    </form>
  );
}

// ─── Form: Stage ──────────────────────────────────────────────────────────────

function FormStage({
  franchises, onSuccess,
}: {
  franchises: Franchise[]; onSuccess: (item: RecentItem) => void;
}) {
  const [name,        setName]        = useState("");
  const [franchiseId, setFranchiseId] = useState("");
  const [era,         setEra]         = useState("");
  const [description, setDescription] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !franchiseId || !era) {
      setError("Preencha os campos obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          franchiseId,
          smashDebutVersion: era,
          description: description || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro");
      const created = await res.json();
      onSuccess({
        id: created.id,
        label: created.name,
        subLabel: `${franchises.find(f => f.id === franchiseId)?.name ?? ""} · debut ${era}`,
      });
      setName(""); setFranchiseId(""); setEra(""); setDescription("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nome do Palco" required>
        <Input value={name} onChange={setName} placeholder="Princess Peach's Castle" required />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Franquia" required>
          <FranchiseSelect value={franchiseId} onChange={setFranchiseId} franchises={franchises} required />
        </Field>
        <Field label="Debut em" required hint="Jogo em que estreou no Smash">
          <EraSelect value={era} onChange={setEra} required />
        </Field>
      </div>

      <Field label="Descrição">
        <Textarea value={description} onChange={setDescription} placeholder="Palco clássico de…" rows={3} />
      </Field>

      {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}

      <SubmitButton loading={loading} label="Criar Palco" />
    </form>
  );
}

// ─── Form: Chronicle ──────────────────────────────────────────────────────────

function FormChronicle({
  onSuccess,
}: {
  onSuccess: (item: RecentItem) => void;
}) {
  const [consoleName,  setConsoleName]  = useState("");
  const [titleNtsc,    setTitleNtsc]    = useState("");
  const [titlePal,     setTitlePal]     = useState("");
  const [titleJp,      setTitleJp]      = useState("");
  const [titleJpEn,    setTitleJpEn]    = useState("");
  const [dateNtsc,     setDateNtsc]     = useState("");
  const [datePal,      setDatePal]      = useState("");
  const [dateJp,       setDateJp]       = useState("");
  const [wikiUrl,      setWikiUrl]      = useState("");
  const [boxArtUrl,    setBoxArtUrl]    = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  // Common console names for datalist
  const CONSOLES = [
    "NES / Famicom", "Super NES / Super Famicom", "Nintendo 64",
    "Game Boy", "Game Boy Advance", "Nintendo DS", "Nintendo 3DS",
    "GameCube", "Wii", "Wii U", "Nintendo Switch",
    "Game & Watch", "Virtual Boy", "Satellaview",
    "MSX", "Arcade", "PC / Computer",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!consoleName.trim() || !titleNtsc.trim()) {
      setError("Console e título NTSC são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/chronicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consoleName: consoleName.trim(),
          titleNtsc:   titleNtsc.trim(),
          titlePal:    titlePal  || null,
          titleJp:     titleJp   || null,
          titleJpEn:   titleJpEn || null,
          releaseDateNtsc: dateNtsc || null,
          releaseDatePal:  datePal  || null,
          releaseDateJp:   dateJp   || null,
          wikiUrl:     wikiUrl   || null,
          boxArtUrl:   boxArtUrl || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro");
      const created = await res.json();
      onSuccess({
        id: created.id,
        label: created.titleNtsc,
        subLabel: `${created.consoleName}${dateNtsc ? ` · ${dateNtsc}` : ""}`,
        href: `/admin/chronicles`,
      });
      setConsoleName(""); setTitleNtsc(""); setTitlePal(""); setTitleJp("");
      setTitleJpEn(""); setDateNtsc(""); setDatePal(""); setDateJp("");
      setWikiUrl(""); setBoxArtUrl("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Console" required hint="Ex: Nintendo 64, Super NES / Super Famicom">
        <div className="relative">
          <input
            list="consoles-list"
            value={consoleName}
            onChange={e => setConsoleName(e.target.value)}
            placeholder="Nintendo 64"
            required
            className="w-full bg-[#030310] border border-white/10 text-slate-200 text-[12px] px-3 py-2 focus:outline-none focus:border-cyan-500/30 placeholder:text-slate-700"
          />
          <datalist id="consoles-list">
            {CONSOLES.map(c => <option key={c} value={c} />)}
          </datalist>
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Título NTSC (EN)" required>
          <Input value={titleNtsc} onChange={setTitleNtsc} placeholder="Star Fox 64" required />
        </Field>
        <Field label="Título PAL">
          <Input value={titlePal} onChange={setTitlePal} placeholder="Lylat Wars" />
        </Field>
        <Field label="Título JP (japonês)">
          <Input value={titleJp} onChange={setTitleJp} placeholder="スターフォックス64" />
        </Field>
        <Field label="Título JP em inglês">
          <Input value={titleJpEn} onChange={setTitleJpEn} placeholder="Star Fox 64" />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Data NTSC" hint="Ex: 1997 ou 1997/07/01">
          <Input value={dateNtsc} onChange={setDateNtsc} placeholder="1997" />
        </Field>
        <Field label="Data PAL">
          <Input value={datePal} onChange={setDatePal} placeholder="1997" />
        </Field>
        <Field label="Data JP">
          <Input value={dateJp} onChange={setDateJp} placeholder="1997/04/27" />
        </Field>
      </div>

      <details className="group">
        <summary className="cursor-pointer text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-all list-none flex items-center gap-1.5">
          <ChevronRight size={10} className="group-open:rotate-90 transition-transform" />
          Mídia e referência (opcional)
        </summary>
        <div className="mt-3 grid grid-cols-1 gap-3">
          <Field label="Wiki URL (SmashWiki)">
            <Input value={wikiUrl} onChange={setWikiUrl} placeholder="https://www.ssbwiki.com/…" />
          </Field>
          <Field label="Box Art URL">
            <div className="flex gap-2 items-center">
              <Input value={boxArtUrl} onChange={setBoxArtUrl} placeholder="https://…" />
              {boxArtUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={boxArtUrl} alt="" className="w-10 h-12 object-contain border border-white/10 shrink-0" />
              )}
            </div>
          </Field>
        </div>
      </details>

      {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}

      <SubmitButton loading={loading} label="Criar Crônica" />
    </form>
  );
}

// ─── Form: Franchise ──────────────────────────────────────────────────────────

function FormFranchise({
  onSuccess, onFranchiseCreated,
}: {
  onSuccess: (item: RecentItem) => void;
  onFranchiseCreated: (f: Franchise) => void;
}) {
  const [name,       setName]       = useState("");
  const [svgIconUrl, setSvgIconUrl] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Nome é obrigatório."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/franchises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), svgIconUrl: svgIconUrl || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro");
      const created = await res.json();
      onFranchiseCreated(created);
      onSuccess({
        id: created.id,
        label: created.name,
        subLabel: "franquia criada",
      });
      setName(""); setSvgIconUrl("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nome da Franquia" required hint="Ex: Mario, Pokémon, Fire Emblem">
        <Input value={name} onChange={setName} placeholder="Xenoblade Chronicles" required />
      </Field>

      <Field label="SVG Icon URL" hint="URL para o ícone SVG da franquia (opcional)">
        <Input value={svgIconUrl} onChange={setSvgIconUrl} placeholder="/assets/franchises/mario.svg" />
      </Field>

      {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}

      <SubmitButton loading={loading} label="Criar Franquia" />
    </form>
  );
}

// ─── Entity Sidebar ────────────────────────────────────────────────────────────

const ENTITIES: {
  type: EntityType;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { type: "fighter",   label: "Fighter",    sublabel: "personagem jogável",  icon: <Sword size={14} />,    color: "text-cyan-400 border-cyan-500/40" },
  { type: "trophy",    label: "Troféu",     sublabel: "collectible TROPHY",  icon: <Trophy size={14} />,   color: "text-yellow-400 border-yellow-500/40" },
  { type: "spirit",    label: "Spirit",     sublabel: "collectible SPIRIT",  icon: <Ghost size={14} />,    color: "text-purple-400 border-purple-500/40" },
  { type: "sticker",   label: "Sticker",    sublabel: "collectible STICKER", icon: <Gamepad2 size={14} />, color: "text-pink-400 border-pink-500/40" },
  { type: "music",     label: "Música",     sublabel: "faixa de palco",      icon: <Music size={14} />,    color: "text-green-400 border-green-500/40" },
  { type: "stage",     label: "Palco",      sublabel: "stage / arena",       icon: <Layout size={14} />,   color: "text-orange-400 border-orange-500/40" },
  { type: "chronicle", label: "Crônica",    sublabel: "chronicle entry",     icon: <BookOpen size={14} />, color: "text-red-400 border-red-500/40" },
  { type: "franchise", label: "Franquia",   sublabel: "nova franquia",       icon: <Shield size={14} />,   color: "text-slate-400 border-slate-500/40" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCreatePage() {
  const [entity,     setEntity]     = useState<EntityType>("fighter");
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [smashGames, setSmashGames] = useState<SmashGame[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [recent,     setRecent]     = useState<RecentItem[]>([]);
  const [justCreated, setJustCreated] = useState<RecentItem | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/franchises").then(r => r.json()),
      fetch("/api/admin/games/smash").then(r => r.json()),
    ]).then(([f, g]) => {
      setFranchises(f);
      setSmashGames(g.sort((a: SmashGame, b: SmashGame) =>
        ERA_ORDER.indexOf(a.era) - ERA_ORDER.indexOf(b.era)));
      setLoading(false);
    });
  }, []);

  const handleSuccess = useCallback((item: RecentItem) => {
    setJustCreated(item);
    setRecent(prev => [item, ...prev].slice(0, 20));
  }, []);

  const handleFranchiseCreated = useCallback((f: Franchise) => {
    setFranchises(prev => [...prev, f].sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  const selected = ENTITIES.find(e => e.type === entity)!;

  if (loading) return (
    <div className="h-screen bg-[#040412] flex items-center justify-center text-cyan-400 font-mono gap-2">
      <Loader2 size={16} className="animate-spin" /> Carregando…
    </div>
  );

  return (
    <div className="min-h-screen bg-[#040412] text-slate-200 font-mono flex flex-col">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-cyan-500/10 px-5 py-3 flex items-center gap-3 flex-wrap">
        <Shield size={13} className="text-cyan-800 shrink-0" />
        <span className="text-sm font-bold uppercase tracking-widest text-cyan-400">
          Construtor
        </span>

        <div className="flex gap-1">
          <Link href="/admin/fighters"   className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Curadoria</Link>
          <Link href="/admin/chronicles" className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Chronicles</Link>
          <Link href="/admin/music"      className="px-2 py-0.5 text-[10px] border border-white/10 text-slate-500 hover:text-slate-300 transition-all">Music</Link>
        </div>

        <div className="flex-1" />
        <span className="text-[10px] text-slate-600">{franchises.length} franquias · {smashGames.length} jogos Smash</span>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar */}
        <div className="w-52 shrink-0 border-r border-cyan-500/10 py-2">
          {ENTITIES.map(e => (
            <button
              key={e.type}
              onClick={() => { setEntity(e.type); setJustCreated(null); }}
              className={`w-full text-left px-4 py-2.5 border-b border-white/[0.03] transition-all flex items-start gap-3 ${
                entity === e.type
                  ? "bg-cyan-500/8 border-l-2 border-l-cyan-500/60"
                  : "hover:bg-white/[0.02] border-l-2 border-l-transparent"
              }`}
            >
              <span className={`mt-0.5 shrink-0 ${entity === e.type ? e.color.split(" ")[0] : "text-slate-600"}`}>
                {e.icon}
              </span>
              <div>
                <p className={`text-[12px] font-bold ${entity === e.type ? "text-slate-100" : "text-slate-400"}`}>
                  {e.label}
                </p>
                <p className="text-[9px] text-slate-600">{e.sublabel}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Main panel */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl">

            {/* Entity header */}
            <div className={`flex items-center gap-2 mb-6 pb-4 border-b border-white/5`}>
              <span className={selected.color.split(" ")[0]}>{selected.icon}</span>
              <div>
                <h2 className="text-base font-bold text-slate-100">Criar {selected.label}</h2>
                <p className="text-[10px] text-slate-600">{selected.sublabel}</p>
              </div>
            </div>

            {/* Success banner */}
            {justCreated && (
              <div className="mb-6">
                <SuccessBanner item={justCreated} onCreateAnother={() => setJustCreated(null)} />
              </div>
            )}

            {/* Form */}
            {!justCreated && (
              <>
                {entity === "fighter"   && (
                  <FormFighter franchises={franchises} smashGames={smashGames} onSuccess={handleSuccess} />
                )}
                {entity === "trophy"    && <FormCollectible type="TROPHY"  onSuccess={handleSuccess} />}
                {entity === "spirit"    && <FormCollectible type="SPIRIT"  onSuccess={handleSuccess} />}
                {entity === "sticker"   && <FormCollectible type="STICKER" onSuccess={handleSuccess} />}
                {entity === "music"     && (
                  <FormMusic franchises={franchises} onSuccess={handleSuccess} />
                )}
                {entity === "stage"     && (
                  <FormStage franchises={franchises} onSuccess={handleSuccess} />
                )}
                {entity === "chronicle" && <FormChronicle onSuccess={handleSuccess} />}
                {entity === "franchise" && (
                  <FormFranchise onSuccess={handleSuccess} onFranchiseCreated={handleFranchiseCreated} />
                )}
              </>
            )}

            {/* Recent creations */}
            {recent.length > 0 && (
              <div className="mt-8 border-t border-white/5 pt-4">
                <p className="text-[9px] uppercase tracking-widest text-slate-600 mb-3">
                  Criados recentemente ({recent.length})
                </p>
                <div className="space-y-1">
                  {recent.map((item, i) => (
                    <div key={`${item.id}-${i}`} className="flex items-center gap-3 px-3 py-1.5 border border-white/[0.04] hover:border-white/10 transition-all">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 shrink-0" />
                      <span className="text-[11px] text-slate-300 truncate flex-1">{item.label}</span>
                      {item.subLabel && (
                        <span className="text-[10px] text-slate-600 shrink-0">{item.subLabel}</span>
                      )}
                      {item.href && (
                        <Link href={item.href} className="text-slate-700 hover:text-cyan-400 transition-all shrink-0">
                          <ExternalLink size={10} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
