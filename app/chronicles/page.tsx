import { db } from "@/lib/db";
import { Zap } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nintendo Chronicle",
  description: "Galeria de lançamentos históricos da Nintendo.",
};

const CONSOLE_ORDER = [
  "Game & Watch",
  "Nintendo Entertainment System",
  "Famicom Disk System",
  "Game Boy",
  "Super Nintendo Entertainment System",
  "Virtual Boy",
  "Nintendo 64",
  "Game Boy Advance",
  "Nintendo GameCube",
  "Nintendo DS",
  "Wii",
  "Wii U",
  "Nintendo Switch",
  "PlayStation 1",
  "PlayStation 2",
  "PlayStation 3",
  "PlayStation 4",
  "Xbox 360",
];

const CONSOLE_ICONS: Record<string, string> = {
  "Nintendo Entertainment System": "/assets/consoles/nes.svg",
  "Famicom Disk System": "/assets/consoles/famicom.svg",
  "Game Boy": "/assets/consoles/gb.svg",
  "Super Nintendo Entertainment System": "/assets/consoles/snes.svg",
  "Virtual Boy": "/assets/consoles/virtualboy.svg",
  "Nintendo 64": "/assets/consoles/n64.svg",
  "Game Boy Advance": "/assets/consoles/gba.svg",
  "Nintendo GameCube": "/assets/consoles/gcn.svg",
  "Nintendo DS": "/assets/consoles/ds.svg",
  "Wii": "/assets/consoles/wii.svg",
  "Wii U": "/assets/consoles/wiiu.svg",
  "Nintendo Switch": "/assets/consoles/switch.svg",
  "PlayStation 1": "/assets/consoles/ps1.svg",
  "PlayStation 2": "/assets/consoles/ps2.svg",
  "PlayStation 3": "/assets/consoles/ps3.svg",
  "PlayStation 4": "/assets/consoles/ps4.svg",
  // No Xbox 360 SVG available yet, leave empty or undefined
};

interface Props {
  searchParams: { console?: string; q?: string };
}

export default async function ChroniclesPage({ searchParams }: Props) {
  const searchQuery   = searchParams.q?.trim() || null;
  const activeConsole = searchParams.console || CONSOLE_ORDER[0];

  // ── Search mode: query cross-console ──────────────────────────────────────
  if (searchQuery) {
    const results = await db.chronicleEntry.findMany({
      where: {
        consoleName: { not: "SMASH" }, // categoria oculta — sentinela para troféus de lutadores
        OR: [
          { titleNtsc: { contains: searchQuery, mode: "insensitive" } },
          { titleJp:   { contains: searchQuery, mode: "insensitive" } },
          { titleJpEn: { contains: searchQuery, mode: "insensitive" } },
          { titlePal:  { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      take: 30,
    });

    return (
      <main className="min-h-screen bg-vault-bg text-vault-text flex flex-col font-body">
        <div className="sticky top-0 z-40 bg-vault-bg/95 backdrop-blur-md border-b border-vault-border shadow-xl">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
                <Zap className="h-4 w-4 text-amber-400" strokeWidth={2.5} />
                <span className="font-black italic tracking-tight text-white text-sm" style={{ letterSpacing: "-0.02em" }}>
                  SMASH<span className="text-amber-400">COMPENDIUM</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Link href="/chronicles" className="text-xs font-mono text-vault-muted hover:text-slate-200 transition-colors">
                ← Chronicle
              </Link>
              <h1 className="text-lg font-display font-bold text-slate-100 uppercase tracking-tight">
                Resultados para &ldquo;{searchQuery}&rdquo;
              </h1>
              <span className="text-xs font-mono text-vault-muted bg-vault-surface px-2 py-1 rounded">
                {results.length} REGISTROS
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
          {results.length === 0 ? (
            <div className="text-center text-vault-muted py-20">Nenhum jogo encontrado para &ldquo;{searchQuery}&rdquo;.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {results.map(game => {
                const consoleHref = `/chronicles?console=${encodeURIComponent(game.consoleName)}`;
                return (
                  <div key={game.id} className="flex flex-col group">
                    <a
                      href={game.wikiUrl ?? undefined}
                      target={game.wikiUrl ? "_blank" : undefined}
                      rel={game.wikiUrl ? "noopener noreferrer" : undefined}
                      className={`relative block aspect-[3/4] w-full bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-vault-border rounded-sm overflow-hidden group-hover:border-vault-accent transition-colors shadow-lg${game.wikiUrl ? " cursor-pointer" : " cursor-default"}`}
                    >
                      {game.boxArtUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={game.boxArtUrl} alt={game.titleNtsc} className="absolute inset-0 w-full h-full object-cover object-top" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                          <span className="font-bold text-slate-400 text-lg font-serif group-hover:text-amber-500 transition-colors">
                            {game.titleNtsc !== "JP EXCLUSIVE" ? game.titleNtsc : game.titleJp}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <p className="font-display font-bold text-white text-sm line-clamp-2 leading-tight drop-shadow-md">
                          {game.titleNtsc !== "JP EXCLUSIVE" ? game.titleNtsc : game.titleJp || "TÍTULO DESCONHECIDO"}
                        </p>
                      </div>
                    </a>
                    <div className="mt-2 flex flex-col gap-1 px-1">
                      <p className="text-sm font-semibold text-slate-200 leading-tight">{game.titleNtsc !== "JP EXCLUSIVE" ? game.titleNtsc : game.titleJp}</p>
                      <Link
                        href={consoleHref}
                        className="text-[10px] font-mono text-vault-accent/60 hover:text-vault-accent transition-colors"
                      >
                        {game.consoleName} ↗
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    );
  }

  // Fetch only games for the active console
  const games = await db.chronicleEntry.findMany({
    where: { consoleName: activeConsole },
  });

  const parseDate = (d: string | null): number => {
    if (!d || d === "—") return Infinity;
    const t = new Date(d).getTime();
    if (!isNaN(t)) return t;
    const m = d.match(/\d{4}/);
    return m ? new Date(`${m[0]}-01-01`).getTime() : Infinity;
  };

  type GameEntry = (typeof games)[0];

  const earliestDate = (g: GameEntry) =>
    Math.min(parseDate(g.releaseDateNtsc), parseDate(g.releaseDateJp), parseDate(g.releaseDatePal));

  // Separa entradas JP EXCLUSIVE das demais
  const jpEntries = games.filter(g => g.titleNtsc === "JP EXCLUSIVE" || g.titleNtsc === "PAL EXCLUSIVE");
  const intlEntries = games.filter(g => g.titleNtsc !== "JP EXCLUSIVE" && g.titleNtsc !== "PAL EXCLUSIVE");

  // Tenta parear cada versão internacional com sua contraparte JP/PAL via titleJpEn
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  const usedJpIds = new Set<string>();
  const groups: GameEntry[][] = [];

  for (const intl of intlEntries) {
    const key = normalize(intl.titleNtsc);
    const pair = jpEntries.find(jp => {
      if (usedJpIds.has(jp.id)) return false;
      const jpKey = normalize(jp.titleJpEn ?? "");
      return jpKey.length > 3 && (jpKey === key || jpKey.includes(key) || key.includes(jpKey));
    });
    if (pair) {
      usedJpIds.add(pair.id);
      groups.push([intl, pair]);
    } else {
      groups.push([intl]);
    }
  }

  // JP/PAL exclusivos sem par internacional ficam como grupo solo
  for (const jp of jpEntries) {
    if (!usedJpIds.has(jp.id)) groups.push([jp]);
  }

  // Dentro de cada grupo: data mais antiga primeiro
  for (const group of groups) {
    group.sort((a, b) => earliestDate(a) - earliestDate(b));
  }

  // Ordena grupos pela data mais antiga do grupo
  groups.sort((a, b) => {
    const minA = Math.min(...a.map(earliestDate));
    const minB = Math.min(...b.map(earliestDate));
    if (minA !== minB) return minA - minB;
    return (a[0]?.titleNtsc ?? "").localeCompare(b[0]?.titleNtsc ?? "");
  });

  const sortedGames = groups.flat();

  const iconPath = CONSOLE_ICONS[activeConsole as string];

  return (
    <main className="min-h-screen bg-vault-bg text-vault-text flex flex-col font-body">
      
      {/* Header Fixo e Tabs */}
      <div className="sticky top-0 z-40 bg-vault-bg/95 backdrop-blur-md border-b border-vault-border shadow-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
              <Zap className="h-4 w-4 text-amber-400" strokeWidth={2.5} />
              <span className="font-black italic tracking-tight text-white text-sm" style={{ letterSpacing: "-0.02em" }}>
                SMASH<span className="text-amber-400">COMPENDIUM</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-100 uppercase tracking-tight">
              Nintendo Chronicle
            </h1>
            <span className="text-xs font-mono text-vault-muted bg-vault-surface px-2 py-1 rounded">
              {sortedGames.length} REGISTROS
            </span>
          </div>

          {/* Abas Scrolláveis */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
            {CONSOLE_ORDER.map(cName => {
              const isActive = cName === activeConsole;
              const tabIcon = CONSOLE_ICONS[cName];
              
              return (
                <Link
                  key={cName}
                  href={`/chronicles?console=${encodeURIComponent(cName)}`}
                  className={`shrink-0 flex flex-col items-center justify-end gap-2 px-4 pt-3 pb-2 text-[11px] uppercase tracking-wider font-medium rounded-t-lg transition-colors border-b-2 ${
                    isActive
                      ? "bg-vault-surface border-vault-accent text-slate-100"
                      : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-vault-surface/50"
                  }`}
                >
                  <div className="h-8 flex items-center justify-center">
                    {tabIcon && (
                      <Image 
                        src={tabIcon} 
                        alt={cName} 
                        width={64} 
                        height={32} 
                        className={`object-contain transition-all ${isActive ? "opacity-100 brightness-0 invert" : "opacity-40 brightness-0 invert group-hover:opacity-80"}`} 
                      />
                    )}
                  </div>
                  <span>{cName}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Galeria de Jogos */}
      <div className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        {sortedGames.length === 0 ? (
          <div className="text-center text-vault-muted py-20">Nenhum registro encontrado para este console.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {sortedGames.map(game => (
              <div key={game.id} className="flex flex-col group">

                {/* Capa clicável → Wiki */}
                <a
                  href={game.wikiUrl ?? undefined}
                  target={game.wikiUrl ? "_blank" : undefined}
                  rel={game.wikiUrl ? "noopener noreferrer" : undefined}
                  className={`relative block aspect-[3/4] w-full bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-vault-border rounded-sm overflow-hidden group-hover:border-vault-accent transition-colors shadow-lg${game.wikiUrl ? " cursor-pointer" : " cursor-default"}`}
                >
                  {game.boxArtUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={game.boxArtUrl}
                      alt={game.titleNtsc}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  ) : (
                    <>
                      {/* Padrão de fundo */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                      {/* Ícone central do console */}
                      {iconPath && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 mix-blend-screen pointer-events-none p-4">
                          <Image
                            src={iconPath}
                            alt="Console Logo"
                            width={120}
                            height={120}
                            className="object-contain brightness-0 invert"
                          />
                        </div>
                      )}

                      {/* Nome do Jogo no Centro */}
                      <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                        <span className="font-bold text-slate-400 text-lg sm:text-xl font-serif drop-shadow-md group-hover:text-amber-500 transition-colors">
                          {game.titleNtsc}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Exclusivos Badges Overlay */}
                  {(game.titleNtsc === "JP EXCLUSIVE" || game.titleNtsc === "PAL EXCLUSIVE") && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      {game.titleNtsc}
                    </div>
                  )}

                  {/* Título na base da capa */}
                  <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <p className="font-display font-bold text-white text-sm line-clamp-2 leading-tight drop-shadow-md">
                      {game.titleNtsc !== "JP EXCLUSIVE" ? game.titleNtsc : game.titleJp || "TÍTULO DESCONHECIDO"}
                    </p>
                  </div>
                </a>

                {/* Botões de ação */}
                <div className="flex gap-1 mt-2 mb-1">
                  {game.wikiUrl ? (
                    <a
                      href={game.wikiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-[9px] font-mono font-bold uppercase tracking-widest py-1.5 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 transition-colors rounded-sm"
                    >
                      WIKI
                    </a>
                  ) : (
                    <span className="flex-1 text-center text-[9px] font-mono font-bold uppercase tracking-widest py-1.5 border border-slate-800 text-slate-700 rounded-sm">
                      WIKI
                    </span>
                  )}
                  <span
                    className="flex-1 text-center text-[9px] font-mono font-bold uppercase tracking-widest py-1.5 border border-slate-800/60 text-slate-800 rounded-sm cursor-not-allowed select-none"
                    title="Em breve"
                  >
                    GAMEPLAY
                  </span>
                  <span
                    className="flex-1 text-center text-[9px] font-mono font-bold uppercase tracking-widest py-1.5 border border-slate-800/60 text-slate-800 rounded-sm cursor-not-allowed select-none"
                    title="Em breve"
                  >
                    JOGAR
                  </span>
                </div>

                {/* Metadados: Lançamento US / Lançamento JP */}
                <div className="flex flex-col space-y-2 px-1 mt-1">
                  {/* NTSC / Título Principal */}
                  {game.titleNtsc !== "JP EXCLUSIVE" && game.titleNtsc !== "PAL EXCLUSIVE" ? (
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm font-semibold text-slate-200 leading-tight">
                        {game.titleNtsc}
                      </span>
                      <span className="text-base font-mono font-bold text-amber-400 shrink-0 mt-0.5 tracking-wider">
                        {game.releaseDateNtsc || "—"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm font-semibold text-amber-500/80 leading-tight">
                        {game.titleNtsc}
                      </span>
                    </div>
                  )}
                  
                  {/* JP */}
                  {game.titleJp && (
                    <div className="flex justify-between items-start gap-2 mt-1">
                      <span className="text-sm text-slate-400 leading-tight">
                        {game.titleJp}
                      </span>
                      <span className="text-sm font-mono font-bold text-slate-400 shrink-0 mt-0.5 tracking-wider">
                        {game.releaseDateJp || "—"}
                      </span>
                    </div>
                  )}

                  {/* Traduções Exclusivas */}
                  {(game.titleJpEn || game.titleJpPt) && (
                    <div className="flex flex-col gap-0.5 pt-1.5 border-t border-vault-border/40 mt-1">
                      {game.titleJpEn && (
                        <span className="text-[10px] font-medium text-amber-400/80 leading-tight truncate" title={game.titleJpEn}>
                          🇺🇸 {game.titleJpEn}
                        </span>
                      )}
                      {game.titleJpPt && (
                        <span className="text-[10px] font-medium text-emerald-400/80 leading-tight truncate" title={game.titleJpPt}>
                          🇧🇷 {game.titleJpPt}
                        </span>
                      )}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
