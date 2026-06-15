/**
 * populate-all-fighter-works.ts
 * Scrapa a seção "Works" de cada lutador no SSBWiki e cria FighterChronicleLinks
 * apontando para ChronicleEntry existentes no banco.
 *
 * Estratégia de match:
 *   1. Tenta match exato por titleNtsc
 *   2. Tenta match por substring (title contém ou é contido pelo nome scrapeado)
 *   3. Tenta match ignorando subtítulo após ":"
 *   Cria ChronicleEntry placeholder (console=Unknown) se nenhum match encontrado.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/populate-all-fighter-works.ts
 *   npx tsx --env-file=.env.local scripts/admin/populate-all-fighter-works.ts --skip-existing
 *   npx tsx --env-file=.env.local scripts/admin/populate-all-fighter-works.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/admin/populate-all-fighter-works.ts --fighter Mario
 */

import { db } from "../../lib/db";
import { fetchHtml } from "../scrapers/utils";

const args = process.argv.slice(2);
const DRY_RUN       = args.includes("--dry-run");
const SKIP_EXISTING = args.includes("--skip-existing");
const FIGHTER_ARG   = args.includes("--fighter") ? args[args.indexOf("--fighter") + 1] : null;

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

async function scrapeWorks(fighterName: string): Promise<string[]> {
  const url = `https://www.ssbwiki.com/${encodeURIComponent(fighterName.replace(/ /g, "_"))}`;
  const $ = await fetchHtml(url);

  const works: string[] = [];

  // Busca seção "Works" ou "Game appearances" → lista de jogos
  $(".mw-parser-output").find("h2, h3, h4").each((_, heading) => {
    const text = $(heading).text().trim().toLowerCase();
    if (!text.includes("work") && !text.includes("game appearance")) return;

    // Pega os elementos imediatamente após o heading até o próximo heading
    let el = $(heading).next();
    while (el.length && !el.is("h2, h3, h4")) {
      el.find("li, td").each((__, item) => {
        const title = $(item).text().replace(/\(.*?\)/g, "").trim();
        if (title && !SMASH_GAMES.has(title) && title.length > 1) {
          works.push(title);
        }
      });
      el = el.next();
    }
  });

  // Fallback: seção "In other games" ou "Appearances"
  if (works.length === 0) {
    $("table.wikitable td:first-child, ul li").each((_, el) => {
      const text = $(el).text().replace(/\(.*?\)/g, "").trim();
      if (text && text.length > 3 && !SMASH_GAMES.has(text) && /[A-Z]/.test(text[0]!)) {
        works.push(text);
      }
    });
  }

  return [...new Set(works)].slice(0, 20); // deduplica, max 20
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
    include: { chronicleLinks: { select: { chronicleEntryId: true } } },
  });

  const toProcess = SKIP_EXISTING
    ? fighters.filter(f => f.chronicleLinks.length === 0)
    : fighters;

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
