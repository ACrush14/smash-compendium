import { db } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Coleções",
  description: "Spirit Board: Galeria de Troféus, Adesivos e Spirits.",
};

const ERAS = [
  { id: "SSBM", label: "Melee", year: "2001" },
  { id: "SSBB", label: "Brawl", year: "2008" },
  { id: "SSB4", label: "Smash 4", year: "2014" },
  { id: "SSBU", label: "Ultimate", year: "2018" },
];

const TYPE_LABELS: Record<string, string> = {
  TROPHY:  "Troféus",
  SPIRIT:  "Spirits",
  STICKER: "Stickers",
};

const SPIRIT_PAGE_SIZE = 100;

interface Props {
  searchParams: { game?: string; type?: string; page?: string; all?: string };
}

export default async function CollectiblesPage({ searchParams }: Props) {
  const typeFilter   = searchParams.type?.toUpperCase();
  const isTypeView   = typeFilter === "TROPHY" || typeFilter === "SPIRIT" || typeFilter === "STICKER";
  const isSpiritView = typeFilter === "SPIRIT";
  const showAll      = searchParams.all === "1";
  const currentPage  = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const activeGame   = searchParams.game || ERAS[0]!.id;

  const where = isTypeView
    ? { type: typeFilter as "TROPHY" | "SPIRIT" | "STICKER" }
    : { smashGameVersion: activeGame, type: { not: "SPRITE" as const } };

  const orderBy = [
    { posicaoSpiritSsbu: "asc" as const },
    { orderIndex: "asc" as const },
    { name: "asc" as const },
  ];

  // For spirits: paginate unless showAll
  const totalCount = isSpiritView
    ? await db.collectible.count({ where })
    : 0;

  const totalPages = isSpiritView && !showAll
    ? Math.ceil(totalCount / SPIRIT_PAGE_SIZE)
    : 1;

  const raw = await db.collectible.findMany({
    where,
    orderBy,
    ...(isSpiritView && !showAll
      ? { skip: (currentPage - 1) * SPIRIT_PAGE_SIZE, take: SPIRIT_PAGE_SIZE }
      : {}),
  });

  // Deduplicate by orderIndex (sticker duplicates from multi-fighter import)
  const seenIdx = new Set<number>();
  const collectibles = raw.filter(item => {
    if (!item.orderIndex) return true;
    if (seenIdx.has(item.orderIndex)) return false;
    seenIdx.add(item.orderIndex);
    return true;
  });

  // Fetch chronicle cover art for spirit view
  const chronicleArtMap = new Map<string, string>();
  if (isSpiritView) {
    const entries = await db.chronicleEntry.findMany({
      where: { boxArtUrl: { not: null } },
      select: { titleNtsc: true, boxArtUrl: true },
    });
    for (const e of entries) {
      if (!e.boxArtUrl) continue;
      const norm = e.titleNtsc.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!chronicleArtMap.has(norm)) chronicleArtMap.set(norm, e.boxArtUrl);
    }
  }

  const findCoverArt = (source: string | null): string | null => {
    if (!source) return null;
    const name = source.replace(/\s*\(\d{4}\)$/, "").trim();
    const norm = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    return chronicleArtMap.get(norm) ?? null;
  };

  const title = isTypeView ? (TYPE_LABELS[typeFilter!] ?? "Coleções") : "Coleções";

  // Pagination URL builder
  const pageUrl = (p: number) =>
    `/collectibles?type=SPIRIT&page=${p}`;
  const allUrl = `/collectibles?type=SPIRIT&all=1`;

  // Page window: first, last, and ±2 around current
  function pageWindow(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    const add = (n: number) => { if (!pages.includes(n)) pages.push(n); };
    add(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) add(i);
    if (current < total - 2) pages.push("...");
    add(total);
    return pages;
  }

  return (
    <main className="min-h-screen bg-vault-bg text-vault-text flex flex-col font-body">

      {/* Header Fixo */}
      <div className="sticky top-0 z-40 bg-vault-bg/95 backdrop-blur-md border-b border-vault-border shadow-xl">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-100 uppercase tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-vault-accent/20 flex items-center justify-center text-vault-accent">★</div>
              {title}
            </h1>
            <div className="flex items-center gap-2">
              {isTypeView && (
                <Link href="/collectibles" className="text-xs font-mono text-vault-muted hover:text-slate-200 transition-colors">
                  ← Todas as coleções
                </Link>
              )}
              <span className="text-xs font-mono text-vault-muted bg-vault-surface px-2 py-1 rounded border border-vault-border/50">
                {isSpiritView
                  ? showAll
                    ? `${collectibles.length} ITENS`
                    : `${(currentPage - 1) * SPIRIT_PAGE_SIZE + 1}–${Math.min(currentPage * SPIRIT_PAGE_SIZE, totalCount)} de ${totalCount}`
                  : `${collectibles.length} ITENS`}
              </span>
            </div>
          </div>

          {/* Abas de era */}
          {!isTypeView && (
            <div className="flex gap-2">
              {ERAS.map(era => {
                const isActive = era.id === activeGame;
                return (
                  <Link
                    key={era.id}
                    href={`/collectibles?game=${era.id}`}
                    className={`px-5 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 flex items-baseline gap-2 ${
                      isActive
                        ? "bg-vault-surface border-vault-accent text-slate-100"
                        : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-vault-surface/50"
                    }`}
                  >
                    <span className="uppercase tracking-wider">{era.label}</span>
                    <span className={`text-[10px] font-mono ${isActive ? "text-vault-accent" : "text-slate-500"}`}>
                      {era.year}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Paginação no header (só spirits paginados) */}
          {isSpiritView && !showAll && totalPages > 1 && (
            <div className="flex items-center gap-1 mt-3 flex-wrap">
              <Link
                href={currentPage > 1 ? pageUrl(currentPage - 1) : "#"}
                className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
                  currentPage > 1
                    ? "border-vault-border/60 text-slate-300 hover:border-vault-accent hover:text-vault-accent"
                    : "border-vault-border/20 text-slate-600 pointer-events-none"
                }`}
              >
                ‹
              </Link>

              {pageWindow(currentPage, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-600">…</span>
                ) : (
                  <Link
                    key={p}
                    href={pageUrl(p as number)}
                    className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                      p === currentPage
                        ? "border-vault-accent bg-vault-accent/10 text-vault-accent"
                        : "border-vault-border/40 text-slate-400 hover:border-vault-accent hover:text-vault-accent"
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}

              <Link
                href={currentPage < totalPages ? pageUrl(currentPage + 1) : "#"}
                className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
                  currentPage < totalPages
                    ? "border-vault-border/60 text-slate-300 hover:border-vault-accent hover:text-vault-accent"
                    : "border-vault-border/20 text-slate-600 pointer-events-none"
                }`}
              >
                ›
              </Link>

              <span className="text-slate-700 mx-1 text-xs">|</span>

              <Link
                href={allUrl}
                className="px-3 py-1 text-xs font-mono font-bold rounded border border-slate-600 text-slate-400 hover:border-amber-500 hover:text-amber-400 transition-colors"
                title="Carrega todos os 1582 spirits de uma vez — pode travar o browser"
              >
                TODOS ⚠
              </Link>
            </div>
          )}

          {/* Banner quando showAll */}
          {isSpiritView && showAll && (
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs text-amber-400/80 font-mono">
                ⚠ Mostrando todos os {totalCount} spirits — desempenho reduzido
              </span>
              <Link
                href={pageUrl(1)}
                className="px-3 py-1 text-xs font-mono rounded border border-vault-border/60 text-slate-400 hover:text-vault-accent hover:border-vault-accent transition-colors"
              >
                ← Voltar à paginação
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 max-w-[1600px] mx-auto px-4 md:px-6 py-8 w-full">
        {collectibles.length === 0 ? (
          <div className="text-center text-vault-muted py-32 flex flex-col items-center justify-center">
            <div className="text-4xl mb-4 opacity-20">🗄️</div>
            <p className="font-display text-xl text-slate-400">Nenhum item encontrado.</p>
          </div>
        ) : isSpiritView ? (
          /* ── Lista vertical de Spirits ── */
          <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-vault-border/50">

            {/* Cabeçalho */}
            <div className="hidden md:grid grid-cols-[56px_148px_1fr_320px_1fr] gap-4 px-4 py-2 bg-slate-900/80 border-b border-vault-border/60 text-xs font-bold uppercase tracking-widest text-vault-accent">
              <span>No.</span>
              <span>Arte</span>
              <span>Nome</span>
              <span>Jogo de Origem / 1ª Aparição</span>
              <span>Música &amp; Texto</span>
            </div>

            {collectibles.map((item, idx) => (
              <div
                key={item.id}
                className={`grid grid-cols-[56px_148px_1fr] md:grid-cols-[56px_148px_1fr_320px_1fr] gap-4 px-4 py-4 items-start border-b border-vault-border/20 last:border-0 transition-colors ${
                  idx % 2 === 0 ? "bg-slate-900/30" : "bg-slate-800/20"
                } hover:bg-vault-surface/60`}
              >
                {/* Número */}
                <div className="flex flex-col items-center justify-center pt-2">
                  <span className="text-sm font-mono font-bold text-vault-accent">
                    {item.posicaoSpiritSsbu
                      ? `#${String(item.posicaoSpiritSsbu).padStart(4, "0")}`
                      : "—"}
                  </span>
                </div>

                {/* Imagem */}
                <div className="relative w-36 h-36 bg-slate-800/60 rounded-lg overflow-hidden flex items-center justify-center border border-vault-border/30 shrink-0">
                  {item.assetRenderUrl ? (
                    <Image
                      src={item.assetRenderUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      sizes="144px"
                    />
                  ) : (
                    <span className="text-3xl opacity-10">?</span>
                  )}
                </div>

                {/* Nome */}
                <div className="flex flex-col justify-center min-w-0">
                  <p className="text-base font-semibold text-slate-100 leading-tight">{item.name}</p>
                  {item.nameJp && (
                    <p className="text-xs text-slate-500 mt-0.5">{item.nameJp}</p>
                  )}
                  {/* Mobile: campos extras */}
                  <div className="md:hidden mt-1 space-y-0.5">
                    {item.spiritArtworkSource && (
                      <p className="text-xs text-slate-400">🎨 {item.spiritArtworkSource}</p>
                    )}
                    {item.spiritFirstAppearance && (
                      <p className="text-xs text-slate-500">📅 {item.spiritFirstAppearance}</p>
                    )}
                    {item.spiritMusicTitle && (
                      <p className="text-xs text-vault-accent/80">♪ {item.spiritMusicTitle}</p>
                    )}
                  </div>
                </div>

                {/* Jogo de Origem / 1ª Aparição (desktop) */}
                {(() => {
                  const artCover   = findCoverArt(item.spiritArtworkSource);
                  const firstCover = findCoverArt(item.spiritFirstAppearance);
                  return (
                    <div className="hidden md:flex flex-col gap-3 min-w-0">
                      {/* Arte */}
                      {item.spiritArtworkSource && (
                        <div className="flex flex-row items-start gap-2">
                          {artCover && (
                            <div className="relative shrink-0 w-12 aspect-[3/4] bg-slate-900 rounded-sm overflow-hidden border border-vault-border/50 shadow-md">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={artCover} alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-xs font-bold uppercase tracking-wider text-vault-accent/70 block">Arte</span>
                            <p className="text-sm text-slate-300 leading-tight">{item.spiritArtworkSource}</p>
                          </div>
                        </div>
                      )}
                      {/* 1ª Aparição */}
                      {item.spiritFirstAppearance && (
                        <div className="flex flex-row items-start gap-2">
                          {firstCover && (
                            <div className="relative shrink-0 w-12 aspect-[3/4] bg-slate-900 rounded-sm overflow-hidden border border-vault-border/50 shadow-md">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={firstCover} alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">1ª Aparição</span>
                            <p className="text-sm text-slate-400 leading-tight">{item.spiritFirstAppearance}</p>
                          </div>
                        </div>
                      )}
                      {!item.spiritArtworkSource && !item.spiritFirstAppearance && item.sourceGame && (
                        <p className="text-sm text-slate-400">{item.sourceGame}</p>
                      )}
                    </div>
                  );
                })()}

                {/* Música + Texto (desktop) */}
                <div className="hidden md:flex flex-col justify-start gap-2 min-w-0">
                  {item.spiritMusicTitle && (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-vault-accent/70 block">Música</span>
                      <p className="text-sm text-vault-accent/90 leading-tight" title={item.spiritMusicTitle}>
                        {item.spiritMusicTitle}
                      </p>
                      {item.spiritMusicArtist && (
                        <p className="text-xs text-slate-500 leading-tight">
                          {item.spiritMusicArtist}
                          {item.spiritMusicDuration ? ` · ${item.spiritMusicDuration}` : ""}
                        </p>
                      )}
                    </div>
                  )}
                  {item.spiritCuratorComment && (
                    <p className="text-sm text-slate-400 leading-snug mt-0.5">
                      {item.spiritCuratorComment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Grid para Troféus e Stickers ── */
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {collectibles.map(item => (
              <div key={item.id} className="group relative flex flex-col items-center">
                <div className="relative w-full aspect-square bg-slate-800/40 rounded-xl overflow-hidden border border-vault-border/50 group-hover:border-vault-accent group-hover:bg-vault-surface transition-all duration-300 shadow-sm group-hover:shadow-vault-accent/20 group-hover:-translate-y-1">
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
                  <div className="absolute top-2 right-2 z-10">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded shadow-sm">
                      {item.orderIndex ? `#${String(item.orderIndex).padStart(3, "0")}` : item.type}
                    </span>
                  </div>
                  <div className="absolute inset-4 flex items-center justify-center">
                    {item.assetRenderUrl ? (
                      <Image
                        src={item.assetRenderUrl}
                        alt={item.name}
                        fill
                        className="object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 15vw"
                      />
                    ) : (
                      <div className="text-4xl opacity-10">?</div>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-center w-full">
                  <p className="text-xs font-medium text-slate-300 line-clamp-2 leading-tight group-hover:text-white transition-colors">
                    {item.name}
                  </p>
                  {item.sourceGame && (
                    <p className="text-[10px] text-slate-500 truncate mt-0.5" title={item.sourceGame}>
                      {item.sourceGame}
                    </p>
                  )}
                  {!item.sourceGame && item.nameJp && (
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.nameJp}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação no rodapé (só spirits paginados) */}
        {isSpiritView && !showAll && totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
            <Link
              href={currentPage > 1 ? pageUrl(currentPage - 1) : "#"}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                currentPage > 1
                  ? "border-vault-border/60 text-slate-300 hover:border-vault-accent hover:text-vault-accent"
                  : "border-vault-border/20 text-slate-600 pointer-events-none"
              }`}
            >
              ‹ Anterior
            </Link>

            {pageWindow(currentPage, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-bottom-${i}`} className="px-1 text-xs text-slate-600">…</span>
              ) : (
                <Link
                  key={p}
                  href={pageUrl(p as number)}
                  className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                    p === currentPage
                      ? "border-vault-accent bg-vault-accent/10 text-vault-accent font-bold"
                      : "border-vault-border/40 text-slate-400 hover:border-vault-accent hover:text-vault-accent"
                  }`}
                >
                  {p}
                </Link>
              )
            )}

            <Link
              href={currentPage < totalPages ? pageUrl(currentPage + 1) : "#"}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                currentPage < totalPages
                  ? "border-vault-border/60 text-slate-300 hover:border-vault-accent hover:text-vault-accent"
                  : "border-vault-border/20 text-slate-600 pointer-events-none"
              }`}
            >
              Próximo ›
            </Link>

            <span className="text-slate-700 mx-2 text-xs">|</span>

            <Link
              href={allUrl}
              className="px-4 py-1.5 text-xs font-mono font-bold rounded border border-slate-600 text-slate-400 hover:border-amber-500 hover:text-amber-400 transition-colors"
              title="Carrega todos os spirits de uma vez — pode travar o browser"
            >
              TODOS ⚠
            </Link>
          </div>
        )}
      </div>

    </main>
  );
}
