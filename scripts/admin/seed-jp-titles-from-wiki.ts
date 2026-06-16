/**
 * Para cada ChronicleEntry com wikiUrl mas sem titleJp:
 * - Extrai o slug da URL Wikipedia EN
 * - Busca langlinks via API
 * - Pega o link "ja" → título japonês
 * - Salva no DB
 *
 * Usa wikiUrl existente, sem precisar adivinhar título.
 */
import { db } from "../../lib/db";

const DELAY_MS = 1200;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function extractSlug(wikiUrl: string): string | null {
  // https://en.wikipedia.org/wiki/Metroid_Prime_Pinball → Metroid_Prime_Pinball
  const m = wikiUrl.match(/wikipedia\.org\/wiki\/(.+)$/);
  return m ? decodeURIComponent(m[1]!) : null;
}

async function fetchJpTitle(slug: string): Promise<string | null> {
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(slug)}&prop=langlinks&redirects=1&format=json`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SmashCompendium/1.0 (anderson.crush.link@gmail.com)" },
    });
    if (!res.ok) return null;
    const json = await res.json() as any;

    if (json.error) return null;

    const langlinks: Array<{ lang: string; "*": string }> =
      json.parse?.langlinks ?? [];

    const ja = langlinks.find(l => l.lang === "ja");
    return ja ? ja["*"] : null;
  } catch {
    return null;
  }
}

async function main() {
  // Entries with wiki URL but no JP title
  const entries = await db.chronicleEntry.findMany({
    where: {
      wikiUrl:  { not: null },
      titleJp:  null,
    },
    select: { id: true, titleNtsc: true, consoleName: true, wikiUrl: true },
    orderBy: { consoleName: "asc" },
  });

  console.log(`Entradas com wiki mas sem JP: ${entries.length}\n`);

  let found = 0, notFound = 0, errors = 0;

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]!;
    const prefix = `[${String(i + 1).padStart(3)}/${entries.length}] ${e.titleNtsc?.padEnd(45)}`;

    const slug = extractSlug(e.wikiUrl!);
    if (!slug) {
      console.log(`${prefix} — sem slug`);
      errors++;
      continue;
    }

    const jpTitle = await fetchJpTitle(slug);

    if (jpTitle) {
      await db.chronicleEntry.update({
        where: { id: e.id },
        data: { titleJp: jpTitle },
      });
      console.log(`${prefix} +jp(${jpTitle})`);
      found++;
    } else {
      console.log(`${prefix} — não encontrado`);
      notFound++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n${"═".repeat(52)}`);
  console.log(`  Títulos JP preenchidos : ${found}`);
  console.log(`  Não encontrados        : ${notFound}`);
  console.log(`  Erros                  : ${errors}`);
  console.log(`${"═".repeat(52)}`);

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
