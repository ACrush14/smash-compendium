/**
 * populate-all-fighter-works.ts
 * Scrapa a seção "Works" de cada lutador no SSBWiki e cria FighterChronicleLinks.
 *
 * Works no SSBWiki ficam em <dd> começando com "Works:" seguido de <ul><li><a>.
 * Usa o título do link (atributo title) como nome canônico do jogo.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/populate-all-fighter-works.ts
 *   npx tsx --env-file=.env.local scripts/admin/populate-all-fighter-works.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/admin/populate-all-fighter-works.ts --fighter Mario
 *   npx tsx --env-file=.env.local scripts/admin/populate-all-fighter-works.ts --clear  (deleta links existentes antes)
 */

import { db } from "../../lib/db";
import { fetchHtml } from "../scrapers/utils";

const args = process.argv.slice(2);
const DRY_RUN     = args.includes("--dry-run");
const CLEAR       = args.includes("--clear");
const FIGHTER_ARG = args.includes("--fighter") ? args[args.indexOf("--fighter") + 1] : null;

const DELAY_MS = 1600;

// Títulos que NÃO devem virar FighterChronicleLink (são aparições no Smash, não "works de origem")
const SMASH_GAMES = new Set([
  "Super Smash Bros.", "Super Smash Bros. Melee", "Super Smash Bros. Brawl",
  "Super Smash Bros. for Nintendo 3DS", "Super Smash Bros. for Wii U",
  "Super Smash Bros. for Nintendo 3DS / Wii U", "Super Smash Bros. Ultimate",
]);

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// Normaliza título para comparação (remove ®, ™, pontuação extra, lowercase)
function normalize(s: string) {
  return s.toLowerCase()
    .replace(/[®™]/g, "")
    .replace(/[:\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// SSBWiki slugs especiais que diferem do nome do lutador
const SSBWIKI_SLUGS: Record<string, string> = {
  "Link":           "Link_(character)",
  "Samus":          "Samus_(character)",
  "Peach":          "Peach_(character)",
  "Zelda":          "Zelda_(character)",
  "Falco":          "Falco_(character)",
  "Marth":          "Marth_(SSBM)",
  "Captain Falcon": "Captain_Falcon",
  "Mr. Game & Watch": "Mr._Game_%26_Watch",
  "R.O.B.":         "R.O.B.",
  "Pokémon Trainer":"Pokémon_Trainer_(SSBB)",
  "Mii Brawler":    "Mii_Brawler",
  "Mii Swordfighter": "Mii_Swordfighter",
  "Mii Gunner":     "Mii_Gunner",
  "Rosalina & Luma": "Rosalina_%26_Luma",
  "Banjo & Kazooie": "Banjo_%26_Kazooie",
  "Pyra":           "Pyra/Mythra",
  "Mythra":         "Pyra/Mythra",
  "Joker":          "Joker_(SSBU)",
  "Hero":           "Hero_(SSBU)",
  "Steve":          "Steve_(SSBU)",
  "Sephiroth":      "Sephiroth_(SSBU)",
  "Min Min":        "Min_Min_(SSBU)",
  "Kazuya":         "Kazuya_(SSBU)",
  "Sora":           "Sora_(SSBU)",
};

async function scrapeWorks(fighterName: string): Promise<string[]> {
  const slug = SSBWIKI_SLUGS[fighterName] ?? fighterName.replace(/ /g, "_");
  const url  = `https://www.ssbwiki.com/${slug}`;
  const $ = await fetchHtml(url);

  const works: string[] = [];

  // Works ficam em <dd> cujo texto começa com "Works:"
  $("dd").each((_, el) => {
    const rawText = $(el).clone().children().remove().end().text().trim();
    if (!rawText.toLowerCase().startsWith("works")) return;

    // Extrai títulos via atributo title dos links (canônico) ou texto do <a>
    $(el).find("li a").each((__, link) => {
      const title = $(link).attr("title")?.replace(/ \(.*?\)$/, "").trim()
                 ?? $(link).text().trim();
      if (title && title.length > 1 && !SMASH_GAMES.has(title)) {
        works.push(title);
      }
    });

    // Fallback: li sem link (ex.: "Metroid II: Return of Samus")
    if (works.length === 0) {
      $(el).find("li").each((__, li) => {
        const text = $(li).text().replace(/\s*\(.*?\)\s*/g, "").trim();
        if (text && text.length > 1 && !SMASH_GAMES.has(text)) {
          works.push(text);
        }
      });
    }
  });

  return [...new Set(works)];
}

async function findChronicleEntry(title: string, allEntries: { id: string; titleNtsc: string }[]) {
  const normTitle = normalize(title);

  // 1. Match exato
  const exact = allEntries.find(e => normalize(e.titleNtsc) === normTitle);
  if (exact) return exact;

  // 2. Match por substring
  const partial = allEntries.find(e => {
    const normE = normalize(e.titleNtsc);
    return normE.includes(normTitle) || normTitle.includes(normE);
  });
  if (partial) return partial;

  // 3. Match sem subtítulo (antes de ":" ou "-")
  const shortTitle = normalize(title.split(/[:\-–]/)[0]!.trim());
  if (shortTitle.length > 3) {
    const shortMatch = allEntries.find(e => normalize(e.titleNtsc).startsWith(shortTitle));
    if (shortMatch) return shortMatch;
  }

  return null;
}

async function populateWorks(
  fighter: { id: string; name: string },
  allEntries: { id: string; titleNtsc: string }[],
  existingIds: Set<string>
) {
  let works: string[] = [];
  try {
    works = await scrapeWorks(fighter.name);
    await sleep(DELAY_MS);
  } catch (e) {
    console.error(`  ⚠ scrape failed: ${e}`);
    return { linked: 0, created: 0, notFound: [] as string[] };
  }

  const notFound: string[] = [];
  let linked = 0, created = 0;
  let displayOrder = 1;

  for (const work of works) {
    const entry = await findChronicleEntry(work, allEntries);

    if (entry) {
      if (existingIds.has(entry.id)) {
        displayOrder++;
        continue; // já linkado
      }
      if (!DRY_RUN) {
        await db.fighterChronicleLink.upsert({
          where: { fighterId_chronicleEntryId: { fighterId: fighter.id, chronicleEntryId: entry.id } },
          create: { fighterId: fighter.id, chronicleEntryId: entry.id, displayOrder, isDebut: displayOrder === 1 },
          update: { displayOrder },
        });
        existingIds.add(entry.id);
      }
      linked++;
    } else {
      notFound.push(work);
      if (!DRY_RUN) {
        // Cria ChronicleEntry placeholder
        const newEntry = await db.chronicleEntry.create({
          data: {
            titleNtsc: work,
            consoleName: "Unknown",
          },
        });
        await db.fighterChronicleLink.create({
          data: { fighterId: fighter.id, chronicleEntryId: newEntry.id, displayOrder, isDebut: displayOrder === 1 },
        });
        allEntries.push({ id: newEntry.id, titleNtsc: work });
        existingIds.add(newEntry.id);
        created++;
      }
    }
    displayOrder++;
  }

  return { linked, created, notFound };
}

async function main() {
  // Carrega todos os ChronicleEntries de uma vez (evita N queries)
  const allEntries = await db.chronicleEntry.findMany({
    select: { id: true, titleNtsc: true },
  });
  console.log(`ChronicleEntries carregados: ${allEntries.length}`);

  const fighterWhere = FIGHTER_ARG ? { name: FIGHTER_ARG } : {};
  const fighters = await db.fighter.findMany({
    where: fighterWhere,
    orderBy: { rosterNumber: "asc" },
    include: { chronicleLinks: { select: { chronicleEntryId: true, fighterId: true } } },
  });

  // --clear: apaga todos os FighterChronicleLinks dos lutadores selecionados
  if (CLEAR && !DRY_RUN) {
    const ids = fighters.map(f => f.id);
    const deleted = await db.fighterChronicleLink.deleteMany({
      where: { fighterId: { in: ids } },
    });
    console.log(`--clear: ${deleted.count} FighterChronicleLinks apagados\n`);
    // Re-carrega com links zerados
    for (const f of fighters) f.chronicleLinks = [];
  }

  const toProcess = fighters;

  console.log(`Lutadores a processar: ${toProcess.length}/${fighters.length}`);
  console.log(DRY_RUN ? "MODO DRY RUN\n" : "");

  let totalLinked = 0, totalCreated = 0, totalNotFound = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const f = toProcess[i]!;
    const existingIds = new Set(f.chronicleLinks.map(l => l.chronicleEntryId));
    const pct = Math.round(((i + 1) / toProcess.length) * 100);
    process.stdout.write(`[${pct}%] ${String(i + 1).padStart(2)}/${toProcess.length} ${f.name.padEnd(25)}`);

    try {
      const result = await populateWorks(f, allEntries, existingIds);
      totalLinked  += result.linked;
      totalCreated += result.created;
      totalNotFound += result.notFound.length;
      const nfMsg = result.notFound.length > 0 ? ` | NF: ${result.notFound.slice(0, 2).join(", ")}` : "";
      console.log(`→ ${result.linked} linked, ${result.created} criados${nfMsg}`);
    } catch (e) {
      console.log(`→ ERRO: ${e}`);
    }
  }

  await db.$disconnect();
  console.log("\n=== RESULTADO ===");
  console.log(`🔗 FighterChronicleLinks criados: ${totalLinked}`);
  console.log(`📝 ChronicleEntries novos (Unknown): ${totalCreated}`);
  console.log(`❓ Sem match no banco:               ${totalNotFound}`);
}

main().catch(e => { console.error(e); process.exit(1); });
