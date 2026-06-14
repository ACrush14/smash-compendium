/**
 * scrape-ssb4-complete-order.ts
 *
 * Scrapa a lista completa do SSB4 (https://www.ssbwiki.com/List_of_SSB4_trophies_(complete_list))
 * e atribui posições sequenciais unificadas (1-1042) a todos os troféus SSB4/3DS/WiiU.
 *
 * O site mostra todos os troféus agrupados por série, nessa ordem:
 * Both versions → 3DS exclusivos → WiiU exclusivos (dentro de cada série).
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/admin/scrape-ssb4-complete-order.ts
 *   npx tsx --env-file=.env.local scripts/admin/scrape-ssb4-complete-order.ts --dry-run
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText, log } from "../scrapers/utils";

const WIKI = "https://www.ssbwiki.com";
const URL  = `${WIKI}/List_of_SSB4_trophies_(complete_list)`;
const DRY  = process.argv.includes("--dry-run");

function norm(s: string): string {
  return s.toLowerCase().replace(/[''`']/g, "").replace(/[^a-z0-9]/g, "");
}

async function main() {
  log.step(`Buscando: ${URL}`);
  const $ = await fetchHtml(URL, 3);

  // Coleta todas as linhas de todas as wikitables em ordem de aparição na página
  const rows: { name: string; has3ds: boolean; hasWiiu: boolean }[] = [];

  $("table.wikitable tbody tr").each((_i, row) => {
    const cells = $("td", row);
    if (cells.length < 2) return;

    // Detecta imagens: células que contêm <img> com src de 3DS ou WiiU
    // Estrutura típica do complete list: # | Img3DS | ImgWiiU | Name | ...
    // Ou para exclusivos:               # | Img    | Name    | ...
    const imgs: string[] = [];
    cells.each((_j, cell) => {
      $(cell).find("img[src]").each((_k, img) => {
        imgs.push($(img).attr("src") ?? "");
      });
    });

    const has3ds  = imgs.some(src => src.toLowerCase().includes("3ds") || src.toLowerCase().includes("3DS"));
    const hasWiiu = imgs.some(src => src.toLowerCase().includes("wiiu") || src.toLowerCase().includes("WiiU") || src.toLowerCase().includes("wii_u"));

    // O nome geralmente está na célula após as imagens
    // Tenta encontrar o texto da célula que não é o número (#)
    let name = "";
    cells.each((_j, cell) => {
      const text = cleanText($(cell).text());
      // Pula célula de número (só dígitos) e células muito curtas
      if (!text || /^\d+$/.test(text) || text.length < 2) return;
      // Pula células que parecem ser tipo/categoria (começam com maiúscula curta)
      // A célula do nome geralmente tem espaços e é mais longa
      if (!name) name = text;
    });

    if (!name) return;
    rows.push({ name, has3ds, hasWiiu });
  });

  log.ok(`${rows.length} linhas encontradas na página`);

  if (rows.length < 900) {
    log.step("AVISO: Menos de 900 linhas. Verifique a estrutura da página.");
  }

  // Carrega todos os troféus SSB4 do banco
  const dbTrophies = await db.collectible.findMany({
    where: { type: "TROPHY", smashGameVersion: { in: ["SSB4", "SSB4_3DS", "SSB4_WIIU"] } },
    select: { id: true, name: true, smashGameVersion: true, posicaoTrofeuSsb4: true },
  });

  log.ok(`${dbTrophies.length} troféus SSB4 no banco`);

  // Indexa por nome normalizado + versão
  const byNameAndVersion = new Map<string, typeof dbTrophies[0]>();
  const byName           = new Map<string, typeof dbTrophies[0][]>();
  for (const t of dbTrophies) {
    const key = `${norm(t.name)}|${t.smashGameVersion}`;
    byNameAndVersion.set(key, t);
    const nameKey = norm(t.name);
    if (!byName.has(nameKey)) byName.set(nameKey, []);
    byName.get(nameKey)!.push(t);
  }

  // Atribui posições sequenciais
  let pos     = 0;
  let updated = 0;
  let missed  = 0;

  const updates: { id: string; pos: number; name: string; version: string }[] = [];

  for (const row of rows) {
    pos++;
    const key = norm(row.name);
    const matches = byName.get(key);

    if (!matches?.length) {
      missed++;
      if (DRY) console.log(`  [MISS] pos=${pos} name="${row.name}"`);
      continue;
    }

    // Se encontrar exatamente um match, usa ele
    // Se encontrar múltiplos (Both + 3DS + WiiU com mesmo nome), usa has3ds/hasWiiu para desempatar
    let target = matches[0]!;
    if (matches.length > 1) {
      if (row.has3ds && !row.hasWiiu) {
        target = matches.find(m => m.smashGameVersion === "SSB4_3DS") ?? target;
      } else if (row.hasWiiu && !row.has3ds) {
        target = matches.find(m => m.smashGameVersion === "SSB4_WIIU") ?? target;
      } else {
        target = matches.find(m => m.smashGameVersion === "SSB4") ?? target;
      }
    }

    updates.push({ id: target.id, pos, name: target.name, version: target.smashGameVersion });
    updated++;
  }

  log.ok(`${updated} troféus para atualizar, ${missed} não encontrados`);

  if (DRY) {
    console.log("\nAmostra de posições:");
    updates.slice(0, 20).forEach(u => console.log(`  #${u.pos} ${u.name} (${u.version})`));
    console.log("...");
    return;
  }

  // Atualiza em lotes
  let done = 0;
  for (const u of updates) {
    await db.collectible.update({
      where: { id: u.id },
      data:  { posicaoTrofeuSsb4: u.pos },
    });
    done++;
    if (done % 100 === 0) process.stdout.write(`  ${done}/${updates.length}...\n`);
  }

  log.ok(`Concluído: ${done} troféus com posição unificada SSB4`);
}

main().catch(console.error);
