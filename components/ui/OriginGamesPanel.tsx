"use client";

export type OriginGame = {
  name:             string;
  titleJp?:         string;
  console:          string;
  consoleFull?:     string;    // nome JP completo (ex: "Super Family Computer (Super Famicom)")
  consoleFullEn?:   string;    // nome EN completo (ex: "Super Nintendo Entertainment System")
  year:             number;    // ano de lançamento JP
  month?:           number;    // mês de lançamento JP
  region?:          string;    // região JP
  yearNa?:          number;    // ano de lançamento NA
  monthNa?:         number;    // mês de lançamento NA
  regionNa?:        string;    // região NA
  badgeColor:       string;
  iconFile?:        string;
  jpExclusive?:     boolean;
  boxArtPath?:      string;   // /assets/games/... capa NA/EN
  boxArtPathJp?:    string;   // /assets/games/... capa JP
  boxArtLandscape?: boolean;  // true = paisagem, false/undefined = retrato
  wikiUrl?:         string;
  wikiUrlJp?:       string;
};

function ConsoleIcon({ iconFile, console: consoleName, color }: {
  iconFile?: string;
  console:   string;
  color:     string;
}) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const wrapper = e.currentTarget.parentElement;
    if (wrapper) {
      wrapper.innerHTML = `<span style="font-family:monospace;font-size:10px;font-weight:bold;color:white;letter-spacing:0.1em;padding:0 6px">${consoleName}</span>`;
    }
  };

  if (iconFile) {
    return (
      <div
        className="shrink-0 relative flex items-center justify-center overflow-hidden"
        style={{ width: 100, height: 64, background: `${color}22`, border: `1px solid ${color}44` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/consoles/${iconFile}`}
          alt={consoleName}
          width={88}
          height={54}
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <span
      className="shrink-0 inline-flex items-center justify-center font-mono font-bold text-white tracking-widest"
      style={{ background: color, minWidth: 100, height: 64, fontSize: 13, paddingLeft: 10, paddingRight: 10 }}
    >
      {consoleName}
    </span>
  );
}

export default function OriginGamesPanel({ games, lang = "EN" }: { games: OriginGame[]; lang?: string }) {
  if (!games.length) return null;

  const useJpMode = lang === "JP" || lang === "JP_EN";

  return (
    <div
      className="border border-white/5 relative overflow-hidden w-full"
      style={{ background: "rgba(5,5,24,0.8)" }}
    >
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent pointer-events-none" />
      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/35" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500/35" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/35" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/35" />

      <div className="px-4 pt-3.5 pb-4">
        <p className="font-mono text-[12px] uppercase tracking-[0.25em] text-cyan-700 pb-2 mb-3 border-b border-white/5">
          Jogos de Origem
        </p>

        <div className="flex flex-row flex-wrap gap-x-6 gap-y-3">
          {games.map((game) => {
            const displayYear  = !useJpMode && game.yearNa  ? game.yearNa  : game.year;
            const displayMonth = !useJpMode && game.yearNa  ? game.monthNa : game.month;
            const displayRegion = !useJpMode && game.yearNa ? game.regionNa : game.region;
            const dateStr = displayMonth
              ? `${displayYear}.${String(displayMonth).padStart(2, "0")}`
              : String(displayYear);
            const suffix = useJpMode
              ? (game.consoleFull ?? game.console)
              : (game.consoleFullEn ?? game.consoleFull ?? game.console);
            const title = useJpMode && game.titleJp ? game.titleJp : game.name;
            const showJpOnly = game.jpExclusive && !useJpMode;

            const targetUrl = useJpMode ? (game.wikiUrlJp || game.wikiUrl) : (game.wikiUrl || game.wikiUrlJp);
            const BOX_H = 300;

            return (
              <a 
                key={game.name} 
                href={targetUrl || "#"}
                target={targetUrl ? "_blank" : undefined}
                rel={targetUrl ? "noopener noreferrer" : undefined}
                className="flex flex-col gap-3 group hover:opacity-85 transition-opacity cursor-pointer"
              >
                {/* Info do jogo */}
                <div className="flex items-start gap-2.5">
                  <ConsoleIcon iconFile={game.iconFile} console={game.console} color={game.badgeColor} />

                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-mono font-semibold leading-tight text-slate-100" style={{ fontSize: 24 }}>
                      {title}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono leading-none text-slate-500" style={{ fontSize: 13 }}>
                        {dateStr}
                        <span className="mx-1 text-slate-700">/</span>
                        <span style={{ color: `${game.badgeColor}cc` }}>{suffix}</span>
                        {displayRegion && <span className="ml-1.5 opacity-50">{displayRegion}</span>}
                      </span>
                      {showJpOnly && (
                        <span
                          className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 leading-none"
                          style={{
                            color: "#f97316",
                            background: "rgba(249,115,22,0.10)",
                            border: "1px solid rgba(249,115,22,0.35)",
                          }}
                        >
                          JP ONLY
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Box art do jogo de origem */}
                {(() => {
                  const artSrc = (useJpMode && game.boxArtPathJp) ? game.boxArtPathJp : game.boxArtPath;
                  return artSrc ? (
                  <div className="overflow-hidden border border-white/15 shadow-lg shadow-black/50 self-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={artSrc}
                      alt={`${title} — Box Art`}
                      style={{ height: BOX_H, width: "auto", display: "block" }}
                    />
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center gap-1.5"
                    style={{
                      width: 186, height: BOX_H,
                      border: `1px dashed ${game.badgeColor}40`,
                      background: `${game.badgeColor}08`,
                    }}
                  >
                    <span className="font-mono text-[8px] uppercase tracking-widest opacity-25 text-center leading-tight"
                          style={{ color: game.badgeColor }}>
                      Arte<br />Em breve
                    </span>
                  </div>
                );
                })()}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
