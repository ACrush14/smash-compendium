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

interface Props {
  searchParams: { game?: string; type?: string };
}

export default async function CollectiblesPage({ searchParams }: Props) {
  const typeFilter = searchParams.type?.toUpperCase();
  const isTypeView = typeFilter === "TROPHY" || typeFilter === "SPIRIT" || typeFilter === "STICKER";

  const activeGame = searchParams.game || ERAS[0]!.id;

  const raw = await db.collectible.findMany({
    where: isTypeView
      ? { type: typeFilter as "TROPHY" | "SPIRIT" | "STICKER" }
      : { smashGameVersion: activeGame, type: { not: "SPRITE" } },
    orderBy: [
      { posicaoSpiritSsbu: "asc" },
      { orderIndex: "asc" },
      { name: "asc" }
    ]
  });

  // Deduplicate by orderIndex: keep the first record per index (duplicates come
  // from the same sticker being linked to multiple fighters during import).
  const seenIdx = new Set<number>();
  const collectibles = raw.filter(item => {
    if (!item.orderIndex) return true;
    if (seenIdx.has(item.orderIndex)) return false;
    seenIdx.add(item.orderIndex);
    return true;
  });

  const title = isTypeView ? (TYPE_LABELS[typeFilter!] ?? "Coleções") : "Coleções";

  return (
    <main className="min-h-screen bg-vault-bg text-vault-text flex flex-col font-body">

      {/* Header Fixo e Tabs */}
      <div className="sticky top-0 z-40 bg-vault-bg/95 backdrop-blur-md border-b border-vault-border shadow-xl">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-100 uppercase tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-vault-accent/20 flex items-center justify-center text-vault-accent">
                ★
              </div>
              {title}
            </h1>
            <div className="flex items-center gap-2">
              {isTypeView && (
                <Link href="/collectibles" className="text-xs font-mono text-vault-muted hover:text-slate-200 transition-colors">
                  ← Todas as coleções
                </Link>
              )}
              <span className="text-xs font-mono text-vault-muted bg-vault-surface px-2 py-1 rounded border border-vault-border/50">
                {collectibles.length} ITENS
              </span>
            </div>
          </div>

          {/* Abas de era — só exibe na view padrão */}
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
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 max-w-[1600px] mx-auto px-4 md:px-6 py-8 w-full">
        {collectibles.length === 0 ? (
          <div className="text-center text-vault-muted py-32 flex flex-col items-center justify-center">
            <div className="text-4xl mb-4 opacity-20">🗄️</div>
            <p className="font-display text-xl text-slate-400">Nenhum item encontrado.</p>
          </div>
        ) : typeFilter === "SPIRIT" ? (
          /* ── Lista vertical de Spirits ── */
          <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-vault-border/50">

            {/* Cabeçalho da tabela */}
            <div className="hidden md:grid grid-cols-[56px_80px_1fr_180px_1fr] gap-4 px-4 py-2 bg-slate-900/80 border-b border-vault-border/60 text-[10px] font-bold uppercase tracking-widest text-vault-accent">
              <span>No.</span>
              <span>Arte</span>
              <span>Nome</span>
              <span>Jogo de Origem / 1ª Aparição</span>
              <span>Música &amp; Texto</span>
            </div>

            {collectibles.map((item, idx) => (
              <div
                key={item.id}
                className={`grid grid-cols-[56px_80px_1fr] md:grid-cols-[56px_80px_1fr_180px_1fr] gap-4 px-4 py-3 items-start transition-colors border-b border-vault-border/20 last:border-0 ${
                  idx % 2 === 0 ? "bg-slate-900/30" : "bg-slate-800/20"
                } hover:bg-vault-surface/60`}
              >
                {/* Número */}
                <div className="flex flex-col items-center justify-center pt-1">
                  <span className="text-[11px] font-mono font-bold text-vault-accent">
                    {item.posicaoSpiritSsbu
                      ? `#${String(item.posicaoSpiritSsbu).padStart(4, "0")}`
                      : "—"}
                  </span>
                </div>

                {/* Imagem */}
                <div className="relative w-16 h-16 bg-slate-800/60 rounded-lg overflow-hidden flex items-center justify-center border border-vault-border/30 shrink-0">
                  {item.assetRenderUrl ? (
                    <Image
                      src={item.assetRenderUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  ) : (
                    <span className="text-2xl opacity-10">?</span>
                  )}
                </div>

                {/* Nome + série */}
                <div className="flex flex-col justify-center min-w-0">
                  <p className="text-sm font-semibold text-slate-100 leading-tight">{item.name}</p>
                  {item.nameJp && (
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.nameJp}</p>
                  )}
                  {/* Em mobile: mostra o resto dos campos aqui */}
                  <div className="md:hidden mt-1 space-y-0.5">
                    {(item as any).spiritArtworkSource && (
                      <p className="text-[10px] text-slate-400">🎨 {(item as any).spiritArtworkSource}</p>
                    )}
                    {(item as any).spiritFirstAppearance && (
                      <p className="text-[10px] text-slate-500">📅 {(item as any).spiritFirstAppearance}</p>
                    )}
                    {(item as any).spiritMusicTitle && (
                      <p className="text-[10px] text-vault-accent/80">♪ {(item as any).spiritMusicTitle}</p>
                    )}
                  </div>
                </div>

                {/* Jogo de Origem / 1ª Aparição (desktop) */}
                <div className="hidden md:flex flex-col justify-center gap-1 min-w-0">
                  {(item as any).spiritArtworkSource ? (
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-vault-accent/60 block">Arte</span>
                      <p className="text-xs text-slate-300 leading-tight">{(item as any).spiritArtworkSource}</p>
                    </div>
                  ) : null}
                  {(item as any).spiritFirstAppearance ? (
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">1ª Aparição</span>
                      <p className="text-xs text-slate-400 leading-tight">{(item as any).spiritFirstAppearance}</p>
                    </div>
                  ) : null}
                  {!(item as any).spiritArtworkSource && !(item as any).spiritFirstAppearance && item.sourceGame && (
                    <p className="text-xs text-slate-400">{item.sourceGame}</p>
                  )}
                </div>

                {/* Música + Texto (desktop) */}
                <div className="hidden md:flex flex-col justify-center gap-1 min-w-0">
                  {(item as any).spiritMusicTitle && (
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-vault-accent/60 block">Música</span>
                      <p className="text-xs text-vault-accent/90 leading-tight truncate" title={(item as any).spiritMusicTitle}>
                        {(item as any).spiritMusicTitle}
                      </p>
                      {(item as any).spiritMusicArtist && (
                        <p className="text-[10px] text-slate-500 leading-tight truncate">
                          {(item as any).spiritMusicArtist}
                          {(item as any).spiritMusicDuration ? ` · ${(item as any).spiritMusicDuration}` : ""}
                        </p>
                      )}
                    </div>
                  )}
                  {(item as any).spiritCuratorComment && (
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-snug mt-0.5">
                      {(item as any).spiritCuratorComment}
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
      </div>

    </main>
  );
}
