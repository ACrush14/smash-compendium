/**
 * link-trophies-to-chronicles.ts
 *
 * Associa troféus (Collectible) a jogos no Chronicles (ChronicleEntry) via
 * a tabela junction CollectibleChronicleLink.
 *
 * Estratégia de match:
 *   1. Parse do campo sourceGame (divide por " / " para múltiplos jogos)
 *   2. Remove parentéticos: "Super Mario Bros. (NES)" → "Super Mario Bros."
 *   3. Normaliza: minúsculas, apenas alfanuméricos
 *   4. Score 3 = match exato normalizado
 *      Score 2 = sourceNorm.startsWith(chronicleNorm) && len>=5  (Melee "DonkeyKongArcade1981")
 *   5. Se nenhum match → cria novo ChronicleEntry automaticamente
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/admin/link-trophies-to-chronicles.ts
 *   npx tsx --env-file=.env.local scripts/admin/link-trophies-to-chronicles.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/admin/link-trophies-to-chronicles.ts --game=SSBB
 */

import { db } from "../../lib/db";

const DRY_RUN = process.argv.includes("--dry-run");
const GAME_ARG = process.argv.find(a => a.startsWith("--game="))?.split("=")[1];

// ── Normalização ───────────────────────────────────────────────────────────────

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, "") // remove parentéticos "(NES)", "(1981)", "(Wii)"
    .replace(/[^a-z0-9]/g, "")   // remove tudo exceto alfanumérico
    .trim();
}

// Limpa sufixos de dado sujo do Melee: datas concatenadas, "Japan Only", parênteses.
// "Super Smash Bros. Melee12/01" → "Super Smash Bros. Melee"
// "Pikmin12/01" → "Pikmin"
// "Kuru Kuru KururinJapan Only" → "Kuru Kuru Kururin"
// "Kaeru no Tame ni Kane wa NaruKaeru no Tame ni Kane wa Naru" → "Kaeru no Tame ni Kane wa Naru"
function cleanTitle(s: string): string {
  let t = s;
  // Remove parênteses "(NES)", "(1985)" etc.
  t = t.replace(/\s*\([^)]*\)/g, "");
  // Remove sufixo de data MM/YY colado (ex: "12/01", "10/85", "7/87")
  t = t.replace(/\d{1,2}\/\d{2}$/, "");
  // Remove ano solitário no final ("1981", "2001")
  t = t.replace(/\s+\d{4}$/, "");
  // Remove "Japan Only" colado ao final
  t = t.replace(/Japan Only$/i, "");
  // Detecta título duplicado (Melee concat bug): "AbcAbc" → "Abc"
  const half = Math.floor(t.length / 2);
  if (half >= 5 && t.slice(0, half) === t.slice(half)) {
    t = t.slice(0, half);
  }
  return t.trim();
}

function extractConsole(s: string): string {
  const m = s.match(/\(([^)]+)\)/);
  if (!m) return "Unknown";
  const raw = m[1].trim();
  if (/^\d+$/.test(raw)) return "Unknown";
  const MAP: Record<string, string> = {
    "NES": "NES", "SNES": "SNES", "Super NES": "SNES",
    "N64": "Nintendo 64", "Nintendo 64": "Nintendo 64",
    "Game Boy": "Game Boy", "GB": "Game Boy",
    "Game Boy Color": "Game Boy Color", "GBC": "Game Boy Color",
    "Game Boy Advance": "Game Boy Advance", "GBA": "Game Boy Advance",
    "GameCube": "Nintendo GameCube", "GCN": "Nintendo GameCube", "Nintendo GameCube": "Nintendo GameCube",
    "DS": "Nintendo DS", "Nintendo DS": "Nintendo DS",
    "Wii": "Wii", "3DS": "Nintendo 3DS", "Nintendo 3DS": "Nintendo 3DS",
    "Wii U": "Wii U", "Switch": "Nintendo Switch", "Nintendo Switch": "Nintendo Switch",
    "Arcade": "Arcade", "Virtual Boy": "Virtual Boy", "PC": "PC", "MSX": "MSX",
    "Famicom": "NES", "Super Famicom": "SNES",
  };
  return MAP[raw] ?? raw;
}

// ── Parsing dos segmentos de sourceGame ────────────────────────────────────────
// Divide SOMENTE por " / " (com espaços obrigatórios) para preservar títulos como
// "Pokémon X/Y" e "Pokémon Red/Blue" como uma unidade, evitando fragmentos "Y"/"Blue".
function parseSegments(raw: string): string[] {
  const seen = new Set<string>();
  return raw
    .split(" / ")
    .map(s => cleanTitle(s.trim()))
    .filter(s => {
      if (s.length < 3) return false;
      const n = norm(s);
      if (!n || n.length < 3) return false;
      if (seen.has(n)) return false; // deduplica segmentos iguais (ex: SSB4 3DS+WiiU duplicate)
      seen.add(n);
      return true;
    });
}

// ── Score de match entre sourceGame e ChronicleEntry ──────────────────────────
//
//   4 = match exato no titleNtsc (não "JP EXCLUSIVE") — preferência máxima
//   3 = match exato em qualquer campo de título (incluindo JP)
//   2 = sourceNorm começa com chronicleNorm (Melee dirty, ex: "DonkeyKongArcade1981")
//   0 = sem match

interface ChronicleRow {
  id: string;
  titleNtsc: string;
  titleJp: string | null;
  titleJpEn: string | null;
  consoleName: string;
  ntscNorm: string;                // norm do titleNtsc pré-computado
  norms: string[];                 // norms de todos os campos de título
}

function matchScore(sourceNorm: string, c: ChronicleRow): number {
  if (!sourceNorm) return 0;
  // Score 4: match exato no titleNtsc canônico (não JP EXCLUSIVE)
  if (c.ntscNorm === sourceNorm && c.titleNtsc !== "JP EXCLUSIVE") return 4;
  // Score 3: match exato em qualquer campo
  if (c.norms.some(cn => cn === sourceNorm)) return 3;
  // Score 2: Melee dirty — source começa com chronicle norm E é suficientemente mais longo
  // (ex: "donkeykongarcade" → "donkeykong"); evita "pokemonblack2" → "pokemonblack" (diff só 1 char)
  if (c.norms.some(cn => cn.length >= 5 && sourceNorm.startsWith(cn) && sourceNorm.length >= cn.length + 3)) return 2;
  return 0;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (DRY_RUN) console.log("⚠  DRY RUN — nenhuma escrita no banco\n");

  // Carrega todos os ChronicleEntry (exceto SMASH)
  const chronicles = await db.chronicleEntry.findMany({
    where: { consoleName: { not: "SMASH" } },
    select: { id: true, titleNtsc: true, titleJp: true, titleJpEn: true, consoleName: true },
  });

  const chronicleRows: ChronicleRow[] = chronicles.map(c => ({
    ...c,
    ntscNorm: norm(c.titleNtsc),
    norms: [c.titleNtsc, c.titleJp, c.titleJpEn]
      .filter(Boolean)
      .map(t => norm(t!)),
  }));

  // Filtra por jogo se --game= especificado
  const versionFilter: string[] = GAME_ARG
    ? GAME_ARG === "SSBM" ? ["SSBM"]
    : GAME_ARG === "SSBB" ? ["SSBB"]
    : GAME_ARG === "SSB4" ? ["SSB4", "SSB4_3DS", "SSB4_WIIU"]
    : [GAME_ARG]
    : ["SSBM", "SSBB", "SSB4", "SSB4_3DS", "SSB4_WIIU"];

  // Carrega troféus com sourceGame
  const trophies = await db.collectible.findMany({
    where: {
      type: "TROPHY",
      smashGameVersion: { in: versionFilter },
      sourceGame: { not: null },
      NOT: { sourceGame: { in: ["SMASH", ""] } },
    },
    select: { id: true, name: true, smashGameVersion: true, sourceGame: true },
  });

  console.log(`Troféus a processar: ${trophies.length}`);
  console.log(`ChronicleEntries disponíveis: ${chronicleRows.length}\n`);

  let linked = 0;
  let skipped = 0;
  let autoCreated = 0;
  let alreadyLinked = 0;
  const unmatched: string[] = [];
  const newEntries: { titleNtsc: string; consoleName: string }[] = [];

  // Verifica links já existentes
  const existingLinks = await (db as any).$queryRawUnsafe(
    `SELECT "collectibleId", "chronicleEntryId" FROM "CollectibleChronicleLink"`
  ) as { collectibleId: string; chronicleEntryId: string }[];
  const existingSet = new Set(existingLinks.map(l => `${l.collectibleId}::${l.chronicleEntryId}`));

  for (const trophy of trophies) {
    const rawGames = trophy.sourceGame!;

    const gameTitles = parseSegments(rawGames);

    for (const gameTitle of gameTitles) {
      const titleClean = cleanTitle(gameTitle);
      const titleNorm  = norm(gameTitle);

      // Tentativa de match
      let bestScore = 0;
      let bestMatches: ChronicleRow[] = [];

      for (const c of chronicleRows) {
        const s = matchScore(titleNorm, c);
        if (s > bestScore) {
          bestScore = s;
          bestMatches = [c];
        } else if (s === bestScore && s > 0) {
          bestMatches.push(c);
        }
      }

      if (bestScore === 0) {
        // Nenhum match — cria novo ChronicleEntry
        const consoleName = extractConsole(gameTitle);
        const alreadyNew = chronicleRows.find(c => c.ntscNorm === titleNorm && c.id.startsWith("_new"));

        let newId: string | null = null;

        if (!alreadyNew) {
          newEntries.push({ titleNtsc: titleClean, consoleName });
          if (!DRY_RUN) {
            const created = await db.chronicleEntry.create({
              data: { titleNtsc: titleClean, consoleName },
              select: { id: true },
            });
            newId = created.id;
            chronicleRows.push({
              id: newId,
              titleNtsc: titleClean,
              titleJp: null,
              titleJpEn: null,
              consoleName,
              ntscNorm: norm(titleClean),
              norms: [norm(titleClean)],
            });
          } else {
            // dry-run: cria placeholder para deduplicar futuras refs
            const placeholder = "_new_" + titleNorm;
            chronicleRows.push({
              id: placeholder,
              titleNtsc: titleClean,
              titleJp: null,
              titleJpEn: null,
              consoleName,
              ntscNorm: titleNorm,
              norms: [titleNorm],
            });
            newId = placeholder;
          }
          autoCreated++;
          console.log(`  ✨ Criado: "${titleClean}" [${consoleName}]`);
        } else {
          newId = alreadyNew.id;
        }

        if (newId && !DRY_RUN) {
          const key = `${trophy.id}::${newId}`;
          if (!existingSet.has(key)) {
            await (db as any).$executeRawUnsafe(
              `INSERT INTO "CollectibleChronicleLink"("collectibleId","chronicleEntryId") VALUES ($1,$2) ON CONFLICT DO NOTHING`,
              trophy.id, newId
            );
            existingSet.add(key);
            linked++;
          } else {
            alreadyLinked++;
          }
        }
        continue;
      }

      // Múltiplos matches → prefere non-JP-EXCLUSIVE, depois maior norm (mais específico)
      if (bestMatches.length > 1) {
        bestMatches.sort((a, b) => {
          // non-JP-EXCLUSIVE primeiro
          const aJp = a.titleNtsc === "JP EXCLUSIVE" ? 1 : 0;
          const bJp = b.titleNtsc === "JP EXCLUSIVE" ? 1 : 0;
          if (aJp !== bJp) return aJp - bJp;
          // maior norm (mais específico)
          const la = Math.max(...a.norms.map(n => n.length));
          const lb = Math.max(...b.norms.map(n => n.length));
          return lb - la;
        });
        if (bestMatches.length > 1) {
          console.log(`  ⚠  "${gameTitle}" → ${bestMatches.length} candidatos, usando: "${bestMatches[0].titleNtsc}" [${bestMatches[0].consoleName}]`);
        }
      }

      const match = bestMatches[0];
      const key = `${trophy.id}::${match.id}`;

      if (existingSet.has(key)) {
        alreadyLinked++;
        continue;
      }

      if (!DRY_RUN) {
        await (db as any).$executeRawUnsafe(
          `INSERT INTO "CollectibleChronicleLink"("collectibleId","chronicleEntryId") VALUES ($1,$2) ON CONFLICT DO NOTHING`,
          trophy.id, match.id
        );
        existingSet.add(key);
      }

      linked++;
      if (bestScore === 2) {
        console.log(`  ~ Fuzzy: "${gameTitle}" → "${match.titleNtsc}" [${match.consoleName}]`);
      }
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`Links criados:      ${linked}`);
  console.log(`Já existiam:        ${alreadyLinked}`);
  console.log(`Entries auto-add:   ${autoCreated}`);
  if (unmatched.length) {
    console.log(`\nSem match (${unmatched.length}):`);
    unmatched.slice(0, 30).forEach(u => console.log(`  - ${u}`));
  }
}

main().catch(e => { console.error(e); process.exit(1); });
