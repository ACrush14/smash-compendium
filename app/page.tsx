import {
  Search,
  Sword,
  Trophy,
  Sparkles,
  Tag,
  BookOpen,
  Music2,
  ChevronRight,
  Terminal,
  CircleDot,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Suspense } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { RandomAssetShowcase } from "@/components/ui/RandomAssetShowcase";
import { db } from "@/lib/db";
import type { Fighter, Franchise } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type EtlStatus = "ok" | "sync" | "new";

interface EtlEntry {
  id: number;
  status: EtlStatus;
  message: string;
  time: string;
  tags: string[];
}

type FighterWithFranchise = Fighter & { franchise: Franchise };

// ─── ETL log (decorativo — mostra atividade do pipeline real) ─────────────────

const ETL_LOG: EtlEntry[] = [
  { id: 1, status: "ok",   message: "87 lutadores ingeridos via SSBWiki ETL v1.0",            time: "agora",        tags: ["fighter", "etl", "ssbu"] },
  { id: 2, status: "new",  message: "Franquias detectadas: 39 universos catalogados",          time: "agora",        tags: ["franchise", "index"] },
  { id: 3, status: "sync", message: "Bios EN extraidas para todos os lutadores do SSBU",       time: "agora",        tags: ["bio", "en", "ssbu"] },
  { id: 4, status: "ok",   message: "Aparicoes por jogo mapeadas: SSB64 → SSBU",              time: "agora",        tags: ["work", "game", "history"] },
  { id: 5, status: "new",  message: "Pipeline de Collectibles agendado — proxima execucao",   time: "pendente",     tags: ["trophy", "spirit", "sticker"] },
  { id: 6, status: "sync", message: "Stages + Music: aguardando execucao do ETL completo",    time: "pendente",     tags: ["stage", "music", "etl"] },
];

const STATUS_STYLES: Record<EtlStatus, { dot: string; label: string; text: string }> = {
  ok:   { dot: "bg-emerald-400", label: "OK",   text: "text-emerald-400" },
  sync: { dot: "bg-sky-400",     label: "SYNC", text: "text-sky-400" },
  new:  { dot: "bg-amber-400",   label: "NEW",  text: "text-amber-400" },
};

function filterLog(entries: EtlEntry[], query: string): EtlEntry[] {
  if (!query) return entries;
  const q = query.toLowerCase();
  return entries.filter((e) => e.message.toLowerCase().includes(q) || e.tags.some((t) => t.includes(q)));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PulsingDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
    </span>
  );
}

function FighterSearchResults({ fighters }: { fighters: FighterWithFranchise[] }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <p className="mb-4 font-mono text-xs text-slate-500">
        {fighters.length} resultado{fighters.length !== 1 ? "s" : ""} encontrado{fighters.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {fighters.map((f) => (
          <a
            key={f.id}
            href={`/fighters/${encodeURIComponent(f.name)}`}
            className="flex flex-col gap-2 border border-white/5 bg-slate-900/40 p-4 transition-all hover:bg-slate-900/70 hover:border-amber-500/20 group"
          >
            <span className="inline-block self-start border border-red-900/40 bg-red-950/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-red-400">
              fighter
            </span>
            <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{f.name}</span>
            <span className="text-xs text-slate-500">{f.franchise.name} · #{f.rosterNumber}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function VaultPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  // Queries paralelas ao banco
  const [fighterCount, franchiseCount, gameCount, trophyCount, spiritCount, stickerCount, musicCount, approvedCount, searchResults, showcaseAssets] = await Promise.all([
    db.fighter.count(),
    db.franchise.count(),
    db.chronicleEntry.count(),
    db.collectible.count({ where: { type: "TROPHY" } }),
    db.collectible.count({ where: { type: "SPIRIT" } }),
    db.collectible.count({ where: { type: "STICKER" } }),
    db.music.count(),
    db.fighter.count({ where: { curationStatus: "approved" } }),
    query
      ? db.fighter.findMany({
          where: {
            OR: [
              { name:              { contains: query, mode: "insensitive" } },
              { franchise: { name: { contains: query, mode: "insensitive" } } },
            ],
          },
          include: { franchise: true },
          take: 20,
          orderBy: { rosterNumber: "asc" },
        })
      : Promise.resolve([]),
    db.$queryRaw<{ name: string; assetRenderUrl: string }[]>`
      SELECT name, "assetRenderUrl" FROM "Collectible"
      WHERE type = 'TROPHY' AND "assetRenderUrl" IS NOT NULL
      ORDER BY RANDOM() LIMIT 20
    `,
  ]);

  const curationPct = fighterCount > 0 ? Math.round((approvedCount / fighterCount) * 100) : 0;

  const filteredLog = filterLog(ETL_LOG, query);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
          <div className="flex shrink-0 items-center gap-2.5">
            <Zap className="h-5 w-5 text-amber-400" strokeWidth={2.5} />
            <span className="font-black italic tracking-tight text-white" style={{ fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
              SMASH<span className="text-amber-400">COMPENDIUM</span>
            </span>
          </div>
          <Suspense
            fallback={
              <div className="relative flex-1 max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                <div className="w-full rounded-none border border-slate-700/60 bg-slate-900/80 py-2 pl-9 pr-4 text-sm text-slate-600">
                  Buscar lutador, franquia...
                </div>
              </div>
            }
          >
            <SearchBar />
          </Suspense>
          <div className="flex shrink-0 items-center gap-2">
            <PulsingDot />
            <span className="text-xs font-medium text-slate-400">Acervo Sincronizado</span>
          </div>
        </div>
      </header>

      {/* BARRA DE CURADORIA */}
      <div className="border-b border-white/[0.06] bg-[#020510]">
        <div className="mx-auto max-w-7xl px-6 py-2.5 flex items-center gap-4">

          {/* Label */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`h-1.5 w-1.5 rounded-full ${
              curationPct === 100 ? "bg-emerald-400 animate-pulse" : "bg-amber-500/50"
            }`} />
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
              Curadoria do Acervo
            </span>
          </div>

          {/* Bar */}
          <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                curationPct === 100
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-300"
                  : curationPct >= 50
                  ? "bg-gradient-to-r from-cyan-700 to-emerald-500"
                  : "bg-gradient-to-r from-amber-800 to-amber-500"
              }`}
              style={{ width: curationPct === 0 ? "0%" : `${curationPct}%` }}
            />
          </div>

          {/* Numbers */}
          <div className="font-mono shrink-0 flex items-center gap-1.5 text-[11px]">
            <span className={
              curationPct === 100 ? "text-emerald-400 font-bold" :
              curationPct > 0    ? "text-slate-300 font-bold" : "text-slate-600"
            }>
              {approvedCount}
            </span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-600">{fighterCount} fighters</span>
            <span className="text-slate-700 mx-1">·</span>
            <span className={`font-bold ${
              curationPct === 100 ? "text-emerald-400" :
              curationPct >= 50  ? "text-cyan-400"    : "text-slate-500"
            }`}>
              {curationPct}%
            </span>
            <span className="text-slate-700">curados</span>
          </div>

          {/* Admin link */}
          <a
            href="/admin/fighters"
            className="shrink-0 font-mono text-[9px] text-slate-700 hover:text-slate-400 border border-white/5 hover:border-white/15 px-2 py-0.5 transition-all"
          >
            gerenciar ↗
          </a>

        </div>
      </div>

      {/* SEARCH RESULTS */}
      {query && (
        <div className="border-b border-white/5 bg-slate-950/60">
          {searchResults.length > 0 ? (
            <FighterSearchResults fighters={searchResults} />
          ) : (
            <div className="mx-auto max-w-7xl px-6 py-6">
              <p className="font-mono text-xs text-slate-600">
                Nenhum resultado para{" "}
                <span className="text-amber-500">&ldquo;{query}&rdquo;</span>
                {" "}— verifique a ortografia ou tente um termo mais amplo.
              </p>
            </div>
          )}
        </div>
      )}

      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-white/5"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(127,29,29,0.28) 0%, transparent 70%)," +
            "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(30,27,75,0.35) 0%, transparent 65%)," +
            "#020617",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                Museu Digital desde SSB64
              </span>
            </div>
            <h1 className="font-black uppercase leading-[0.9] tracking-tight text-white" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}>
              O ACERVO
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #f59e0b 0%, #fcd34d 50%, #f59e0b 100%)" }}>
                DEFINITIVO
              </span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-slate-400">
              Preservacao historica de trofeus, spirits, stickers e biografias
              bilingues de cada lutador desde o N64 ate o Switch.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="/collectibles"
                className="group relative flex items-center gap-2 overflow-hidden border border-amber-500 bg-amber-500 px-7 py-3 font-bold text-slate-950 transition-all duration-200 hover:bg-amber-400 hover:shadow-[0_0_28px_rgba(245,158,11,0.45)]"
                style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}
              >
                <span>Explorar o Cofre</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a href="/fighters" className="flex items-center gap-1.5 text-sm font-medium text-slate-400 underline-offset-4 hover:text-white hover:underline transition-colors">
                Ver Lutadores
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
            {/* Stats reais do banco */}
            <div className="flex items-center gap-8 border-t border-white/5 pt-6">
              {[
                { value: fighterCount.toString(),   label: "Lutadores" },
                { value: franchiseCount.toString(), label: "Franquias" },
                { value: gameCount.toString(),      label: "Jogos" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-black text-2xl text-amber-400">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative flex h-72 w-64 flex-col items-center justify-center md:h-96 md:w-80">
              <div className="absolute inset-0 rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.6) 0%, transparent 70%)" }} />
              <div
                className="relative flex h-56 w-56 flex-col items-center justify-center border border-amber-500/20 bg-slate-900/60 backdrop-blur-sm md:h-72 md:w-72"
                style={{
                  clipPath: "polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)",
                  boxShadow: "inset 0 0 40px rgba(245,158,11,0.06), 0 0 60px rgba(245,158,11,0.08)",
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                <RandomAssetShowcase assets={showcaseAssets.map(a => ({ name: a.name, url: a.assetRenderUrl }))} />
                <span className="absolute left-2 top-2 h-4 w-4 border-l border-t border-amber-500/40" />
                <span className="absolute right-2 top-2 h-4 w-4 border-r border-t border-amber-500/40" />
                <span className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-amber-500/40" />
                <span className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-amber-500/40" />
              </div>
              <div className="mt-0 h-4 w-40 bg-gradient-to-b from-slate-700/60 to-transparent md:w-52" />
              <div className="h-2 w-28 bg-gradient-to-b from-slate-800/60 to-transparent md:w-36" />
              <div className="absolute -bottom-4 h-12 w-48 rounded-full opacity-30 blur-xl" style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.4) 0%, transparent 70%)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* VAULT CARDS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/5" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">Secoes do Acervo</span>
          <span className="h-px flex-1 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* 01 — Lutadores */}
          <a href="/fighters"
            className="group relative flex flex-col justify-between overflow-hidden border border-white/10 p-7 transition-all duration-300 hover:scale-[1.03] hover:border-red-900/50 hover:shadow-[0_0_40px_rgba(127,29,29,0.3)]"
            style={{ background: "linear-gradient(135deg, rgba(127,29,29,0.35) 0%, rgba(69,10,10,0.5) 40%, #0a0010 100%)", clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-700/60 to-transparent" />
            <div>
              <div className="mb-4 flex items-start justify-between">
                <Sword className="h-8 w-8 text-red-400 transition-transform duration-300 group-hover:-rotate-12" strokeWidth={1.5} />
                <span className="font-mono text-xs text-red-900/70">01 / 06</span>
              </div>
              <h2 className="mb-2 font-black text-2xl uppercase tracking-tight text-white">Lutadores</h2>
              <p className="text-sm leading-relaxed text-slate-500">Biografias completas em EN e JP, franquia de origem e cronologia de aparicoes por jogo.</p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="font-mono text-xs text-slate-600">{fighterCount} registros</span>
              <ChevronRight className="h-4 w-4 text-slate-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-red-400" />
            </div>
          </a>

          {/* 02 — Troféus */}
          <a href="/collectibles?type=TROPHY"
            className="group relative flex flex-col justify-between overflow-hidden border border-white/10 p-7 transition-all duration-300 hover:scale-[1.03] hover:border-amber-900/50 hover:shadow-[0_0_40px_rgba(120,53,15,0.3)]"
            style={{ background: "linear-gradient(135deg, rgba(120,53,15,0.35) 0%, rgba(69,26,3,0.5) 40%, #0a0500 100%)", clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-700/60 to-transparent" />
            <div>
              <div className="mb-4 flex items-start justify-between">
                <Trophy className="h-8 w-8 text-amber-400 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                <span className="font-mono text-xs text-amber-900/70">02 / 06</span>
              </div>
              <h2 className="mb-2 font-black text-2xl uppercase tracking-tight text-white">Trofeus</h2>
              <p className="text-sm leading-relaxed text-slate-500">Galeria de trofeus do Melee, Brawl e Smash 4 com renders em alta resolucao.</p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="font-mono text-xs text-slate-600">{trophyCount} itens</span>
              <ChevronRight className="h-4 w-4 text-slate-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-amber-400" />
            </div>
          </a>

          {/* 03 — Spirits */}
          <a href="/collectibles?type=SPIRIT"
            className="group relative flex flex-col justify-between overflow-hidden border border-white/10 p-7 transition-all duration-300 hover:scale-[1.03] hover:border-purple-900/50 hover:shadow-[0_0_40px_rgba(88,28,135,0.3)]"
            style={{ background: "linear-gradient(135deg, rgba(88,28,135,0.35) 0%, rgba(46,16,101,0.5) 40%, #060010 100%)", clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-700/60 to-transparent" />
            <div>
              <div className="mb-4 flex items-start justify-between">
                <Sparkles className="h-8 w-8 text-purple-400 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                <span className="font-mono text-xs text-purple-900/70">03 / 06</span>
              </div>
              <h2 className="mb-2 font-black text-2xl uppercase tracking-tight text-white">Spirits</h2>
              <p className="text-sm leading-relaxed text-slate-500">Spirit Board do Ultimate com raridades, tipos e habilidades catalogados.</p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="font-mono text-xs text-slate-600">{spiritCount} itens</span>
              <ChevronRight className="h-4 w-4 text-slate-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-purple-400" />
            </div>
          </a>

          {/* 04 — Stickers */}
          <a href="/collectibles?type=STICKER"
            className="group relative flex flex-col justify-between overflow-hidden border border-white/10 p-7 transition-all duration-300 hover:scale-[1.03] hover:border-sky-900/50 hover:shadow-[0_0_40px_rgba(14,116,144,0.25)]"
            style={{ background: "linear-gradient(135deg, rgba(12,74,110,0.35) 0%, rgba(7,89,133,0.3) 40%, #010814 100%)", clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-700/50 to-transparent" />
            <div>
              <div className="mb-4 flex items-start justify-between">
                <Tag className="h-8 w-8 text-sky-400 transition-transform duration-300 group-hover:-rotate-12" strokeWidth={1.5} />
                <span className="font-mono text-xs text-sky-900/70">04 / 06</span>
              </div>
              <h2 className="mb-2 font-black text-2xl uppercase tracking-tight text-white">Stickers</h2>
              <p className="text-sm leading-relaxed text-slate-500">Adesivos do Brawl organizados por franquia, poder e tipo de ataque.</p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="font-mono text-xs text-slate-600">{stickerCount} itens</span>
              <ChevronRight className="h-4 w-4 text-slate-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-sky-400" />
            </div>
          </a>

          {/* 05 — Chronicles */}
          <a href="/chronicles"
            className="group relative flex flex-col justify-between overflow-hidden border border-white/10 p-7 transition-all duration-300 hover:scale-[1.03] hover:border-emerald-900/50 hover:shadow-[0_0_40px_rgba(6,78,59,0.25)]"
            style={{ background: "linear-gradient(135deg, rgba(6,78,59,0.3) 0%, rgba(4,47,35,0.45) 40%, #010d08 100%)", clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-800/60 to-transparent" />
            <div>
              <div className="mb-4 flex items-start justify-between">
                <BookOpen className="h-8 w-8 text-emerald-500 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                <span className="font-mono text-xs text-emerald-900/70">05 / 06</span>
              </div>
              <h2 className="mb-2 font-black text-2xl uppercase tracking-tight text-white">Chronicles</h2>
              <p className="text-sm leading-relaxed text-slate-500">Linha do tempo interativa dos jogos originais, consoles e franquias representadas em cada titulo.</p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="font-mono text-xs text-slate-600">{gameCount} jogos · {franchiseCount} universos</span>
              <ChevronRight className="h-4 w-4 text-slate-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-emerald-500" />
            </div>
          </a>

          {/* 06 — Songs */}
          <a
            href="/music"
            className="relative flex flex-col justify-between overflow-hidden border border-white/5 p-7 transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-900/20 group"
            style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(67,20,141,0.25) 40%, #060010 100%)", clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
            <div>
              <div className="mb-4 flex items-start justify-between">
                <Music2 className="h-8 w-8 text-violet-400 group-hover:text-violet-300 transition-colors" strokeWidth={1.5} />
                <span className="font-mono text-xs text-violet-700/70">06 / 06</span>
              </div>
              <h2 className="mb-2 font-black text-2xl uppercase tracking-tight text-slate-200 group-hover:text-violet-200 transition-colors">Songs</h2>
              <p className="text-sm leading-relaxed text-slate-500">Trilha sonora iconica de cada franquia no Super Smash Bros. Ultimate.</p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="font-mono text-xs text-slate-500">{musicCount} faixas</span>
              <span className="font-mono text-[10px] text-violet-600 group-hover:text-violet-400 transition-colors">EXPLORAR →</span>
            </div>
          </a>

        </div>
      </section>

      {/* ETL LOG */}
      <section className="border-t border-white/5 bg-slate-950/80 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-3">
            <Terminal className="h-4 w-4 text-slate-500" />
            <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
              Atividade Recente do Acervo
            </h2>
            {query && (
              <span className="font-mono text-[10px] text-amber-500/70">filtrado por &ldquo;{query}&rdquo;</span>
            )}
            <span className="h-px flex-1 bg-white/5" />
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-700">
              <PulsingDot />
              LIVE
            </span>
          </div>
          <div className="divide-y divide-white/[0.04] border border-white/5 bg-[#060810]">
            <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2">
              <CircleDot className="h-3 w-3 text-slate-700" />
              <span className="font-mono text-[10px] text-slate-700">smash-compendium / etl-pipeline main</span>
            </div>
            {filteredLog.length === 0 ? (
              <div className="px-4 py-4">
                <span className="font-mono text-xs text-slate-700">Nenhuma entrada de log corresponde ao filtro atual.</span>
              </div>
            ) : (
              filteredLog.map((entry) => {
                const s = STATUS_STYLES[entry.status];
                return (
                  <div key={entry.id} className="group flex items-start gap-4 px-4 py-3 transition-colors hover:bg-white/[0.02]">
                    <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      <span className={`font-mono text-[10px] font-bold ${s.text}`}>{s.label}</span>
                    </div>
                    <span className="flex-1 font-mono text-xs text-slate-400 transition-colors group-hover:text-slate-300">{entry.message}</span>
                    <div className="flex shrink-0 items-center gap-1.5 text-slate-700">
                      <Clock className="h-3 w-3" />
                      <span className="font-mono text-[10px]">{entry.time}</span>
                    </div>
                  </div>
                );
              })
            )}
            <div className="flex items-center justify-between bg-slate-900/30 px-4 py-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span className="font-mono text-[10px] text-slate-600">Pipeline estavel · {fighterCount} fighters · {franchiseCount} franquias no banco</span>
              </div>
              <button className="font-mono text-[10px] text-slate-700 underline underline-offset-2 transition-colors hover:text-slate-500">
                Ver log completo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="font-black italic text-xs tracking-tight text-slate-700">
            SMASH<span className="text-amber-900">COMPENDIUM</span>
          </span>
          <span className="font-mono text-[10px] text-slate-800">
            Projeto Academico. Fan-made. Nao oficial.
          </span>
        </div>
      </footer>

    </div>
  );
}
