/**
 * fix-chronicle-missing-data.ts
 *
 * Para cada ChronicleEntry sem wikiUrl (ou com wikiUrl do SSBWiki):
 *   1. Busca Wikipedia para obter o console correto
 *   2. Corrige consoleName se necessário
 *   3. Tenta box art em https://thumbnails.libretro.com/
 *   4. Define wikiUrl com a URL do Wikipedia
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/fix-chronicle-missing-data.ts [--dry-run]
 */

import { db } from "../../lib/db";
import { fetchHtml, log, sleep } from "../scrapers/utils";

const DELAY_MS  = 1_200;
const DRY_RUN   = process.argv.includes("--dry-run");

// ─── Platform mapping: texto do Wikipedia → consoleName do DB ─────────────────

const PLATFORM_MAP: [RegExp, string][] = [
  [/nintendo switch/i,                              "Nintendo Switch"],
  [/wii u/i,                                        "Wii U"],
  [/\bwii\b/i,                                      "Wii"],
  [/new nintendo 3ds|nintendo 3ds|3ds/i,            "Nintendo DS"],
  [/nintendo ds\b|nds/i,                            "Nintendo DS"],
  [/nintendo gamecube|gamecube|\bgcn\b|\bgc\b/i,    "Nintendo GameCube"],
  [/game boy advance|\bgba\b/i,                     "GAME BOY ADVANCE"],
  [/nintendo 64|\bn64\b/i,                          "Nintendo 64"],
  [/super nes|super nintendo|snes|super famicom/i,  "Super Nintendo Entertainment System"],
  [/game boy color|\bgbc\b/i,                       "GAME BOY"],
  [/game boy\b|\bgb\b/i,                            "GAME BOY"],
  [/nintendo entertainment system|\bnes\b|famicom/i,"Nintendo Entertainment System"],
  [/virtual boy/i,                                  "VIRTUAL BOY"],
  [/game & watch|game and watch/i,                  "GAME & WATCH"],
  [/playstation 4|\bps4\b/i,                        "PlayStation 4"],
  [/playstation 3|\bps3\b/i,                        "PlayStation 3"],
  [/playstation 2|\bps2\b/i,                        "PlayStation 2"],
  [/playstation\b|\bps1\b|\bpsx\b/i,               "PlayStation 1"],
  [/xbox 360/i,                                     "Xbox 360"],
];

function mapPlatform(raw: string): string | null {
  for (const [re, val] of PLATFORM_MAP) {
    if (re.test(raw)) return val;
  }
  return null;
}

// ─── Libretro system folder names ─────────────────────────────────────────────

const LIBRETRO_SYSTEMS: Record<string, string[]> = {
  "Nintendo Entertainment System": ["Nintendo - NES"],
  "Disk System":                   ["Nintendo - Family Computer Disk System"],
  "Super Nintendo Entertainment System": ["Nintendo - SNES"],
  "Nintendo 64":                   ["Nintendo - Nintendo 64"],
  "Nintendo GameCube":             ["Nintendo - GameCube"],
  "Wii":                           ["Nintendo - Wii"],
  "Wii U":                         ["Nintendo - Wii U"],
  "Nintendo DS":                   ["Nintendo - DS", "Nintendo - 3DS"],
  "GAME BOY":                      ["Nintendo - Game Boy", "Nintendo - Game Boy Color"],
  "GAME BOY ADVANCE":              ["Nintendo - Game Boy Advance"],
  "VIRTUAL BOY":                   ["Nintendo - Virtual Boy"],
  "GAME & WATCH":                  ["Nintendo - Game and Watch"],
  "PlayStation 1":                 ["Sony - PlayStation"],
  "PlayStation 2":                 ["Sony - PlayStation 2"],
  "PlayStation 3":                 ["Sony - PlayStation 3"],
  "PlayStation 4":                 ["Sony - PlayStation 4"],
  "Xbox 360":                      ["Microsoft - Xbox 360"],
};

// Libretro usa No-Intro ROM naming — ajusta o título para as variantes mais prováveis
function libretroCandidates(title: string): string[] {
  const base = title
    .replace(/:/g, " -")   // "Castlevania: Symphony" → "Castlevania - Symphony"
    .replace(/\s+/g, " ")
    .trim();

  // Tenta várias regiões: sem região, USA, World, Europe, Japan
  const regions = ["", " (USA)", " (World)", " (Europe)", " (Japan)"];
  return regions.map(r => `${base}${r}`);
}

async function tryLibretroArt(consoleName: string, title: string): Promise<string | null> {
  const systems = LIBRETRO_SYSTEMS[consoleName];
  if (!systems) return null;

  const candidates = libretroCandidates(title);

  for (const system of systems) {
    for (const name of candidates) {
      const url = `https://thumbnails.libretro.com/${encodeURIComponent(system)}/Named_Boxarts/${encodeURIComponent(name)}.png`;
      try {
        const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5_000) });
        if (res.ok) return url;
      } catch {
        // timeout ou rede — próxima variante
      }
    }
  }
  return null;
}

// ─── Wikipedia platform detection ─────────────────────────────────────────────

async function getPlatformAndWikiUrl(title: string): Promise<{
  platform: string | null;
  wikiUrl: string;
}> {
  const slug = title.replace(/ /g, "_");
  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(slug)}`;

  try {
    const $ = await fetchHtml(wikiUrl, 1);

    // Detecta redirect/disambiguation
    if ($(".disambigbox, #disambig").length > 0) {
      return { platform: null, wikiUrl };
    }

    // Procura linha "Platform(s)" no infobox
    let platform: string | null = null;
    $("table.infobox tr, .infobox-full-data tr, table.wikitable tr").each((_, row) => {
      if (platform) return;
      const th = $("th", row).first().text().trim().toLowerCase();
      if (!th.includes("platform") && !th.includes("console") && !th.includes("system")) return;

      const tdText = $("td", row).first().text().trim();

      // Coleta plataformas individuais: prefere <li>, senão divide por vírgula/newline
      // Isso garante que pegamos a PRIMEIRA plataforma listada (= lançamento original)
      const items: string[] = [];
      $("td li", row).each((_, li) => {
        const t = $(li).text().trim();
        if (t) items.push(t);
      });
      if (items.length === 0) {
        items.push(...tdText.split(/[,\n\/]/).map(s => s.trim()).filter(Boolean));
      }
      if (items.length === 0) items.push(tdText);

      // Primeira plataforma que mapeia → console original do jogo
      for (const item of items) {
        const mapped = mapPlatform(item);
        if (mapped) { platform = mapped; break; }
      }
    });

    return { platform, wikiUrl };
  } catch {
    return { platform: null, wikiUrl };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (DRY_RUN) log.step("DRY RUN — sem mudanças no DB");

  // Entradas sem wikiUrl OU com wikiUrl do SSBWiki (console estimado por ano)
  const entries = await db.chronicleEntry.findMany({
    where: {
      OR: [
        { wikiUrl: null },
        { wikiUrl: { contains: "ssbwiki" } },
      ],
    },
    orderBy: [{ consoleName: "asc" }, { titleNtsc: "asc" }],
  });

  log.ok(`Entradas a processar: ${entries.length}`);

  let fixedConsole = 0, addedArt = 0, errors = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    process.stdout.write(`  [${i + 1}/${entries.length}] ${entry.titleNtsc} (${entry.consoleName})… `);

    // 1. Wikipedia → plataforma + URL
    const { platform, wikiUrl } = await getPlatformAndWikiUrl(entry.titleNtsc);

    // Sanidade: se o ano do entry é muito antigo para o console detectado, ignora
    const year = parseInt(entry.releaseDateNtsc ?? "0") || 0;
    const platformTooNew =
      platform === "Nintendo Switch" && year > 0 && year < 2017 ||
      platform === "Wii U"           && year > 0 && year < 2012 ||
      platform === "Wii"             && year > 0 && year < 2006 ||
      platform === "Nintendo DS"     && year > 0 && year < 2004 ||
      platform === "Nintendo GameCube" && year > 0 && year < 2001 ||
      platform === "Nintendo 64"     && year > 0 && year < 1996 ||
      platform === "GAME BOY ADVANCE" && year > 0 && year < 2001;

    const newConsole = (platform && !platformTooNew) ? platform : entry.consoleName;
    const consoleChanged = newConsole !== entry.consoleName;
    if (consoleChanged) fixedConsole++;

    // 2. Libretro → box art (só se ainda sem capa)
    let newBoxArt = entry.boxArtUrl;
    if (!newBoxArt) {
      newBoxArt = await tryLibretroArt(newConsole, entry.titleNtsc);
      if (newBoxArt) addedArt++;
    }

    // 3. Update DB
    const changes: string[] = [];
    if (consoleChanged) changes.push(`${entry.consoleName} → ${newConsole}`);
    if (newBoxArt && !entry.boxArtUrl) changes.push("+capa");
    if (wikiUrl !== entry.wikiUrl) changes.push("+wiki");

    console.log(changes.length ? changes.join(" | ") : "sem mudanças");

    if (!DRY_RUN) {
      try {
        await db.chronicleEntry.update({
          where: { id: entry.id },
          data: {
            consoleName: newConsole,
            boxArtUrl:   newBoxArt,
            wikiUrl:     wikiUrl,
          },
        });
      } catch (e: any) {
        console.error(`    ✗ ${String(e.message).slice(0, 60)}`);
        errors++;
      }
    }

    await sleep(DELAY_MS);
  }

  log.ok(`\nConcluído — consoles corrigidos: ${fixedConsole}, capas adicionadas: ${addedArt}, erros: ${errors}`);
}

main().catch(console.error);
