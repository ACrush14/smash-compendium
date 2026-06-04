import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import { db } from "@/lib/db";
import BioTranslator from "@/components/ui/BioTranslator";
import MediaVaultViewer, { type MediaAsset } from "@/components/ui/MediaVaultViewer";

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_META: Record<string, { short: string; platform: string; year: string; color: string }> = {
  SSB64: { short: "SSB 64",   platform: "Nintendo 64",    year: "1999", color: "border-yellow-600/40 bg-yellow-900/20 text-yellow-400" },
  SSBM:  { short: "Melee",    platform: "GameCube",        year: "2001", color: "border-sky-600/40 bg-sky-900/20 text-sky-400" },
  SSBB:  { short: "Brawl",    platform: "Wii",             year: "2008", color: "border-purple-600/40 bg-purple-900/20 text-purple-400" },
  SSB4:  { short: "Smash 4",  platform: "Wii U / 3DS",     year: "2014", color: "border-blue-600/40 bg-blue-900/20 text-blue-400" },
  SSBU:  { short: "Ultimate", platform: "Nintendo Switch", year: "2018", color: "border-red-600/40 bg-red-900/20 text-red-400" },
};

const GAME_ORDER = ["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"];

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FighterPage({ params }: PageProps) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);

  const [fighter, trophies, stickers, originAssets] = await Promise.all([
    db.fighter.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      include: {
        franchise: true,
        bios:  { orderBy: { smashGameVersion: "asc" } },
        works: { include: { game: true } },
      },
    }),
    db.collectible.findMany({
      where: { fighter: { name: { equals: name, mode: "insensitive" } }, type: "TROPHY" },
      orderBy: [{ smashGameVersion: "asc" }, { name: "asc" }],
    }),
    db.collectible.findMany({
      where: { fighter: { name: { equals: name, mode: "insensitive" } }, type: "STICKER" },
    }),
    // Sprite de origem (EarthBound) e Spirit — extraídos pelo fetch-images.ts
    db.collectible.findMany({
      where: {
        fighter: { name: { equals: name, mode: "insensitive" } },
        type:    { in: ["SPRITE", "SPIRIT"] },
      },
    }),
  ]);

  if (!fighter) notFound();

  // ── Derivações ───────────────────────────────────────────────────────────────

  const biosOrdered = [...fighter.bios].sort(
    (a, b) => GAME_ORDER.indexOf(a.smashGameVersion) - GAME_ORDER.indexOf(b.smashGameVersion),
  );

  const appearances: string[] = [];
  for (const w of fighter.works) {
    const t = w.game.titleEn;
    let ver = "";
    if (t.includes("Ultimate"))                                          ver = "SSBU";
    else if (t.includes("4") || t.includes("3DS") || t.includes("Wii U")) ver = "SSB4";
    else if (t.includes("Brawl"))                                        ver = "SSBB";
    else if (t.includes("Melee"))                                        ver = "SSBM";
    else if (t === "Super Smash Bros." || t.includes("64"))              ver = "SSB64";
    if (ver && !appearances.includes(ver)) appearances.push(ver);
  }
  appearances.sort((a, b) => GAME_ORDER.indexOf(a) - GAME_ORDER.indexOf(b));

  // Índices de colecionáveis por era — apenas para o Media Vault e para badges de contagem
  const trophiesByGame = new Map<string, typeof trophies>();
  for (const t of trophies) {
    const list = trophiesByGame.get(t.smashGameVersion) ?? [];
    list.push(t);
    trophiesByGame.set(t.smashGameVersion, list);
  }
  const stickersByGame = new Map<string, typeof stickers>();
  for (const s of stickers) {
    const list = stickersByGame.get(s.smashGameVersion) ?? [];
    list.push(s);
    stickersByGame.set(s.smashGameVersion, list);
  }

  // Eras a exibir (união de aparições + bios + colecionáveis)
  const erasSet = new Set<string>();
  for (const v of appearances) erasSet.add(v);
  for (const b of biosOrdered) erasSet.add(b.smashGameVersion);
  for (const [v] of trophiesByGame) erasSet.add(v);
  for (const [v] of stickersByGame) erasSet.add(v);
  const erasToShow = GAME_ORDER.filter((v) => erasSet.has(v));

  // Bio de referência para a ficha curatorial (SSBU → primeira disponível)
  const primaryBio = biosOrdered.find((b) => b.smashGameVersion === "SSBU") ?? biosOrdered[0] ?? null;

  // ── Media Vault assets (EXCLUSIVO da zona esquerda) ──────────────────────────
  const vaultAssets: MediaAsset[] = [];

  // Render SSBU — posição 0 (principal)
  if (fighter.imageUrl) {
    vaultAssets.push({
      url: fighter.imageUrl,
      label: `${fighter.name} — Render`,
      sublabel: "Super Smash Bros. Ultimate · 2018",
      assetType: "render",
    });
  }

  // Sprite de origem e Spirit — logo após o render
  for (const oa of originAssets) {
    const isSprite = oa.type === "SPRITE";
    vaultAssets.push({
      url:       oa.assetRenderUrl,
      label:     oa.name,
      sublabel:  isSprite ? `Sprite Original · ${fighter.franchise.name}` : "Spirit · Ultimate",
      assetType: isSprite ? "sprite" : "spirit",
    });
  }

  for (const gameVer of GAME_ORDER) {
    for (const t of trophiesByGame.get(gameVer) ?? []) {
      vaultAssets.push({
        url: t.assetRenderUrl,
        label: t.name,
        sublabel: `Troféu · ${GAME_META[gameVer]?.short ?? gameVer}`,
        assetType: "trophy",
      });
    }
  }
  for (const s of stickers) {
    vaultAssets.push({
      url: s.assetRenderUrl,
      label: s.name,
      sublabel: `Sticker · ${GAME_META[s.smashGameVersion]?.short ?? s.smashGameVersion}`,
      assetType: "sticker",
    });
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 antialiased">

      {/* ── Global Header ─────────────────────────────────────── */}
      <header className="shrink-0 z-50 border-b border-white/5 bg-slate-950/90 backdrop-blur-md">
        <div className="flex items-center gap-4 px-6 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" strokeWidth={2.5} />
            <span className="font-black italic text-sm tracking-tight text-white">
              SMASH<span className="text-amber-400">COMPENDIUM</span>
            </span>
          </Link>
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-600">
            <ChevronRight className="h-3 w-3" />
            <Link href="/fighters" className="hover:text-slate-400 transition-colors">Lutadores</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-500">{fighter.name}</span>
          </div>
        </div>
      </header>

      {/* ── Split Body ────────────────────────────────────────── */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden min-h-0">

        {/* ════════════════════════════════════════════════════════
            ZONA ESQUERDA — Media Vault (5 cols)
            REGRA: exclusiva para imagens. Nenhum texto de dado aqui.
        ════════════════════════════════════════════════════════ */}
        <aside className="col-span-5 relative border-r border-white/10">
          <MediaVaultViewer assets={vaultAssets} />
        </aside>

        {/* ════════════════════════════════════════════════════════
            ZONA DIREITA — Data Archive (7 cols)
            REGRA: exclusiva para texto/dados. Nenhuma <img> aqui.
        ════════════════════════════════════════════════════════ */}
        <div className="col-span-7 relative">
          <div
            className="absolute inset-0 overflow-y-auto bg-slate-900/30"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.04) transparent" }}
          >

            {/* ── Fighter Header (sticky no topo do scroll) ──────── */}
            <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-white/5 px-10 py-6">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500/60">
                  #{String(fighter.rosterNumber).padStart(2, "0")}
                </span>
                <span className="font-mono text-[9px] text-slate-700">·</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-600">
                  {fighter.franchise.name}
                </span>
              </div>

              <h1
                className="font-black italic uppercase leading-none tracking-tight text-white"
                style={{ fontSize: "clamp(2.4rem, 3.4vw, 3.5rem)" }}
              >
                {fighter.name}
              </h1>

              {appearances.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {appearances.map((ver, i) => {
                    const meta = GAME_META[ver];
                    if (!meta) return null;
                    return (
                      <span
                        key={ver}
                        className={`border px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${meta.color}`}
                      >
                        {meta.short}
                        {i === 0 && <span className="ml-1 text-[7px] opacity-60">★</span>}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 h-px bg-gradient-to-r from-amber-500/20 via-white/5 to-transparent" />
            </div>

            {/* ── Conteúdo rolável ─────────────────────────────── */}
            <div className="px-10 py-8 flex flex-col gap-8">

              {/* Ficha Catalográfica */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-px w-5 bg-amber-500/40" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-600">
                    Ficha Catalográfica
                  </span>
                </div>

                <div className="border border-white/5 p-6 flex flex-col gap-5">
                  {/* Contadores */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "Eras",     value: erasToShow.length },
                      { label: "Troféus",  value: trophies.length },
                      { label: "Stickers", value: stickers.length },
                      { label: "Spirits",  value: 0 },
                    ].map((s) => (
                      <div key={s.label} className="flex flex-col gap-1">
                        <span className="font-mono text-[8px] uppercase tracking-widest text-slate-700">
                          {s.label}
                        </span>
                        <span className="font-mono text-2xl font-bold text-white leading-none">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Nota curatorial */}
                  {fighter.curatorOverviewEn && (
                    <div className="border-t border-white/5 pt-5">
                      <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-slate-700 block mb-3">
                        Nota curatorial
                      </span>
                      <div className="flex flex-col gap-3">
                        {fighter.curatorOverviewEn.split(/\n+/).filter(Boolean).map((para, i) => (
                          <p key={i} className="text-sm leading-relaxed text-slate-400 italic">
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Linha do Tempo */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-px w-5 bg-amber-500/40" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-600">
                    Linha do Tempo
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {erasToShow.map((gameVer) => {
                    const meta        = GAME_META[gameVer];
                    const bio         = biosOrdered.find((b) => b.smashGameVersion === gameVer);
                    const eraCountT   = trophiesByGame.get(gameVer)?.length ?? 0;
                    const eraCountS   = stickersByGame.get(gameVer)?.length ?? 0;
                    const isDebut     = appearances[0] === gameVer;

                    return (
                      <div key={gameVer} className="border border-white/5 overflow-hidden">

                        {/* Era header */}
                        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-slate-950/40">
                          <div className="flex items-center gap-3">
                            <span className={`border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${meta?.color ?? "border-white/10 text-slate-500"}`}>
                              {meta?.short ?? gameVer}
                            </span>
                            <span className="font-mono text-[10px] text-slate-600">{meta?.platform}</span>
                            <span className="font-mono text-[10px] text-slate-800">// {meta?.year}</span>
                          </div>
                          {isDebut && (
                            <span className="font-mono text-[8px] uppercase tracking-wider border border-amber-500/25 bg-amber-900/10 px-1.5 py-0.5 text-amber-500/70">
                              ★ debut
                            </span>
                          )}
                        </div>

                        {/* Bio do jogo */}
                        <div className="px-6 pt-5 pb-4">
                          {bio ? (
                            <BioTranslator
                              contentEn={bio.contentEn}
                              contentPt={bio.contentPt ?? undefined}
                              contentJp={bio.contentJp ?? undefined}
                              contentJpEn={bio.contentJpEn ?? undefined}
                              contentJpTranslated={bio.contentJpTranslated ?? undefined}
                              compact
                            />
                          ) : (
                            <p className="font-mono text-[10px] italic text-slate-700">
                              Biografia não catalogada para esta era.
                            </p>
                          )}
                        </div>

                        {/* Acervo textual dos colecionáveis — sem imagens, apenas name + description */}
                        {(eraCountT > 0 || eraCountS > 0) && (
                          <div className="px-6 pb-5 flex flex-col gap-4 border-t border-white/5 pt-4">
                            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-700">
                              Acervo textual
                            </span>

                            {trophiesByGame.get(gameVer)?.map((t) =>
                              t.description ? (
                                <div key={t.id} className="border-l-2 border-sky-500/20 pl-4">
                                  <p className="font-mono text-[9px] uppercase tracking-wider text-sky-400/70 mb-1.5">
                                    {t.name}
                                  </p>
                                  <p className="text-xs leading-relaxed text-slate-400 italic">
                                    {t.description}
                                  </p>
                                </div>
                              ) : null
                            )}

                            {stickersByGame.get(gameVer)?.map((s) =>
                              s.description ? (
                                <div key={s.id} className="border-l-2 border-purple-500/20 pl-4">
                                  <p className="font-mono text-[9px] uppercase tracking-wider text-purple-400/70 mb-1.5">
                                    {s.name}
                                  </p>
                                  <p className="text-xs leading-relaxed text-slate-400 italic">
                                    {s.description}
                                  </p>
                                </div>
                              ) : null
                            )}
                          </div>
                        )}

                        {/* Works badges — texto puro, zero imagens */}
                        <div className="px-6 pb-5 flex items-center gap-2 flex-wrap border-t border-white/5 pt-3">
                          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-700">
                            Works:
                          </span>
                          <span className="border border-white/10 px-2.5 py-0.5 font-mono text-[9px] text-slate-500">
                            {fighter.franchise.name}
                          </span>
                          {eraCountT > 0 && (
                            <span className="border border-sky-900/30 bg-sky-950/20 px-2 py-0.5 font-mono text-[8px] text-sky-600/70">
                              {eraCountT} troféu{eraCountT > 1 ? "s" : ""}
                            </span>
                          )}
                          {eraCountS > 0 && (
                            <span className="border border-purple-900/30 bg-purple-950/20 px-2 py-0.5 font-mono text-[8px] text-purple-500/70">
                              {eraCountS} sticker{eraCountS > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}

                  {erasToShow.length === 0 && (
                    <p className="font-mono text-xs text-slate-700 italic">
                      Nenhuma era catalogada — execute o ETL para popular este lutador.
                    </p>
                  )}
                </div>
              </section>

            </div>

            {/* Footer */}
            <footer className="border-t border-white/5 px-10 py-5">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="font-black italic text-[10px] tracking-tight text-slate-700 hover:text-slate-500 transition-colors"
                >
                  SMASH<span className="text-amber-900">COMPENDIUM</span>
                </Link>
                <span className="font-mono text-[9px] text-slate-800">Fan-made. Não oficial.</span>
              </div>
            </footer>

          </div>
        </div>

      </main>
    </div>
  );
}
