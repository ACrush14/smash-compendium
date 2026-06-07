import { db } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nintendo Chronicle",
  description: "Galeria de lançamentos históricos da Nintendo.",
};

const CONSOLE_ORDER = [
  "GAME & WATCH",
  "Nintendo Entertainment System",
  "Disk System",
  "GAME BOY",
  "Super Nintendo Entertainment System",
  "VIRTUAL BOY",
  "Nintendo 64",
  "GAME BOY ADVANCE",
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
  "Disk System": "/assets/consoles/famicom.svg",
  "GAME BOY": "/assets/consoles/gb.svg",
  "Super Nintendo Entertainment System": "/assets/consoles/snes.svg",
  "VIRTUAL BOY": "/assets/consoles/virtualboy.svg",
  "Nintendo 64": "/assets/consoles/n64.svg",
  "GAME BOY ADVANCE": "/assets/consoles/gba.svg",
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
  searchParams: { console?: string };
}

export default async function ChroniclesPage({ searchParams }: Props) {
  const activeConsole = searchParams.console || CONSOLE_ORDER[0];

  // Fetch only games for the active console
  const games = await db.chronicleEntry.findMany({
    where: { consoleName: activeConsole },
  });

  // Sort chronologically by the earliest worldwide release date
  const parseDate = (d: string | null) => {
    if (!d || d === "—") return Infinity;
    const t = new Date(d).getTime();
    if (!isNaN(t)) return t;
    const m = d.match(/\d{4}/);
    if (m) return new Date(`${m[0]}-01-01`).getTime();
    return Infinity;
  };

  games.sort((a, b) => {
    const ta = Math.min(parseDate(a.releaseDateNtsc), parseDate(a.releaseDateJp), parseDate(a.releaseDatePal));
    const tb = Math.min(parseDate(b.releaseDateNtsc), parseDate(b.releaseDateJp), parseDate(b.releaseDatePal));
    if (ta !== tb) return ta - tb;
    return a.titleNtsc.localeCompare(b.titleNtsc);
  });

  const iconPath = CONSOLE_ICONS[activeConsole as string];

  return (
    <main className="min-h-screen bg-vault-bg text-vault-text flex flex-col font-body">
      
      {/* Header Fixo e Tabs */}
      <div className="sticky top-0 z-40 bg-vault-bg/95 backdrop-blur-md border-b border-vault-border shadow-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-100 uppercase tracking-tight">
              Nintendo Chronicle
            </h1>
            <span className="text-xs font-mono text-vault-muted bg-vault-surface px-2 py-1 rounded">
              {games.length} REGISTROS
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
        {games.length === 0 ? (
          <div className="text-center text-vault-muted py-20">Nenhum registro encontrado para este console.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {games.map(game => (
              <div key={game.id} className="flex flex-col group">
                
                {/* Capa do Jogo */}
                <div className="relative aspect-[3/4] w-full bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-vault-border rounded-sm overflow-hidden mb-3 group-hover:border-vault-accent transition-colors shadow-lg">
                  {game.boxArtUrl ? (
                    <Image 
                      src={game.boxArtUrl} 
                      alt={game.titleNtsc}
                      fill 
                      className="object-cover object-top" 
                      sizes="(max-width: 768px) 50vw, 20vw" 
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

                  {/* Nome estilizado se for único / Título NTSC grande na capa pra quebrar galho */}
                  <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <p className="font-display font-bold text-white text-sm line-clamp-2 leading-tight drop-shadow-md">
                      {game.titleNtsc !== "JP EXCLUSIVE" ? game.titleNtsc : game.titleJp || "TÍTULO DESCONHECIDO"}
                    </p>
                  </div>
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
