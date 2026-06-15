/**
 * seed-pokemon-trainer-team.ts
 * Cria Squirtle, Ivysaur e Charizard como Fighters acoplados ao Pokémon Trainer.
 * Raspa bios EN (SSBWiki) + JP (smashwiki.info) e movimentos JP por era.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/seed-pokemon-trainer-team.ts
 *   npx tsx --env-file=.env.local scripts/admin/seed-pokemon-trainer-team.ts --dry-run
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText } from "../scrapers/utils";
import * as cheerio from "cheerio";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const DELAY_MS = 1600;

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ─── Config dos 3 lutadores ──────────────────────────────────────────────────
const TEAM = [
  { name: "Squirtle",  rosterNumber: "33a", jpSlug: "ゼニガメ",    enSlug: "Squirtle"  },
  { name: "Ivysaur",   rosterNumber: "33b", jpSlug: "フシギソウ",  enSlug: "Ivysaur"   },
  { name: "Charizard", rosterNumber: "33c", jpSlug: "リザードン",  enSlug: "Charizard" },
];

// ─── Badge → era ────────────────────────────────────────────────────────────
const JP_BADGE: Record<string, string> = {
  "64": "SSB64", "DX": "SSBM", "X": "SSBB",
  "3U": "SSB4", "3": "SSB4", "U": "SSB4", "WiiU": "SSB4", "SP": "SSBU",
};
const JP_BADGES_ORDERED = ["WiiU", "3U", "64", "DX", "SP", "X", "3", "U"];

function stripWorks(s: string): string {
  const lines = s.split("\n").map(l => l.trim()).filter(Boolean);
  const out: string[] = [];
  for (const line of lines) {
    if (/^[（(]/.test(line)) break;
    if (/[（(]\s*(FC|SFC|SF|N64|AC|GB|GBA|GCN|Wii|3DS|NES|SNES|MD|Arcade|\d)/i.test(line)) break;
    out.push(line);
  }
  return (out.join(" ").trim() || lines[0] || s).trim();
}

// ─── Scraper JP bios ─────────────────────────────────────────────────────────
function scrapeJpBios($: cheerio.CheerioAPI): Record<string, string> {
  const base: Record<string, string> = {};
  $(".mw-parser-output dl").each((_, dl) => {
    const dtRaw = $(dl).find("dt").first().text().replace(/\s+/g, " ").trim();
    const dd    = cleanText($(dl).find("dd").first().text());
    if (!dtRaw.startsWith("[") || dd.length < 20) return;
    const inner  = dtRaw.slice(1);
    const badge  = JP_BADGES_ORDERED.find(b => inner.startsWith(b));
    if (!badge) return;
    const era      = JP_BADGE[badge]!;
    const closeIdx = dtRaw.indexOf("]");
    if (closeIdx < 0) return;
    const charName = dtRaw.slice(closeIdx + 1).trim();
    if (/(SMASH|EX|ファイナル)/.test(charName)) return;
    if (!base[era]) base[era] = stripWorks(dd);
  });
  return base;
}

// ─── Scraper EN bios ─────────────────────────────────────────────────────────
function enHeadingToEra(h: string): string | null {
  if (/Ultimate/i.test(h))                                      return "SSBU";
  if (/Brawl/i.test(h))                                         return "SSBB";
  if (/Melee/i.test(h))                                         return "SSBM";
  if (/Super Smash Bros\. 4|for (Nintendo 3DS|Wii U)/i.test(h)) return "SSB4";
  if (/^In Super Smash Bros\.?$/i.test(h.trim()))               return "SSB64";
  return null;
}

function scrapeEnBios($: cheerio.CheerioAPI, fighterName: string): Record<string, string> {
  const bios: Record<string, string> = {};
  let currentEra: string | null = null;
  const nameLower = fighterName.toLowerCase().replace(/[^a-z0-9\s]/g, "");

  $(".mw-parser-output").children().each((_, el) => {
    const tag = el.type === "tag" ? el.name : null;
    if (!tag) return;
    if (tag === "h2") {
      const headlineSpan = $(el).find(".mw-headline").text().trim();
      currentEra = enHeadingToEra(headlineSpan || $(el).text().trim());
      return;
    }
    if (!currentEra || tag !== "dl") return;
    const dt = $(el).find("dt").first().text().trim();
    const dd = cleanText($(el).find("dd").first().text());
    if (!dt || dd.length < 40) return;
    const dtLower = dt.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    if (dtLower.startsWith("works")) return;
    if (dtLower.startsWith("for ")) return;
    if (/smash|final smash|\(ex\)|\(alt\.\)/i.test(dt)) return;
    if (/\+\s/.test(dt)) return;
    if (!dtLower.includes(nameLower) && !nameLower.includes(dtLower)) return;
    if (!bios[currentEra]) bios[currentEra] = dd;
  });
  return bios;
}

// ─── Scraper JP moves ────────────────────────────────────────────────────────
interface MoveEntry { era: string; order: number; label: string; descJp: string; }

function scrapeJpMoves($: cheerio.CheerioAPI): MoveEntry[] {
  const results: MoveEntry[] = [];
  const orderByEra: Record<string, number> = {};

  $(".mw-parser-output dl").each((_, dl) => {
    const dtRaw = $(dl).find("dt").first().text().replace(/\s+/g, " ").trim();
    const dd    = $(dl).find("dd").first().text().replace(/\s+/g, " ").trim();
    if (!dtRaw.startsWith("[") || dd.length < 20) return;
    const inner  = dtRaw.slice(1);
    const badge  = JP_BADGES_ORDERED.find(b => inner.startsWith(b));
    if (!badge) return;
    const era      = JP_BADGE[badge]!;
    const closeIdx = dtRaw.indexOf("]");
    if (closeIdx < 0) return;
    const charName = dtRaw.slice(closeIdx + 1).trim();
    if (!/(SMASH|EX|ファイナル)/.test(charName)) return;

    const label = /ファイナル/.test(charName) ? "Final Smash" : /\(EX\)/.test(charName) ? "EX" : "SMASH";
    const order = orderByEra[era] ?? 0;
    orderByEra[era] = order + 1;
    results.push({ era, order, label, descJp: dd });
  });
  return results;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  // Busca franchiseId do Pokémon Trainer
  const trainer = await db.fighter.findFirst({
    where: { name: { contains: "Pokémon Trainer" } },
    select: { franchiseId: true },
  });
  if (!trainer) {
    console.error("❌ Pokémon Trainer não encontrado no banco.");
    process.exit(1);
  }
  const franchiseId = trainer.franchiseId;
  console.log(`Franchise Pokémon: ${franchiseId}`);
  console.log(DRY_RUN ? "MODO DRY RUN — sem escrita\n" : "");

  for (const pokemon of TEAM) {
    console.log(`\n${"─".repeat(60)}`);
    console.log(`▶ ${pokemon.name} (#${pokemon.rosterNumber})`);

    // 1. Cria o Fighter
    let fighterId: string;
    const existing = await db.fighter.findUnique({ where: { name: pokemon.name } });
    if (existing) {
      fighterId = existing.id;
      console.log(`  ✓ Fighter já existe (id=${fighterId})`);
    } else if (!DRY_RUN) {
      const created = await db.fighter.create({
        data: {
          name:         pokemon.name,
          rosterNumber: pokemon.rosterNumber,
          franchiseId,
        },
      });
      fighterId = created.id;
      console.log(`  ✅ Fighter criado (id=${fighterId})`);
    } else {
      fighterId = "dry-run-id";
      console.log(`  [dry] Fighter seria criado`);
    }

    // 2. Raspa bios EN
    const enUrl = `https://www.ssbwiki.com/${pokemon.enSlug}`;
    console.log(`  Scraping EN: ${enUrl}`);
    let enBios: Record<string, string> = {};
    try {
      const $en = await fetchHtml(enUrl);
      enBios = scrapeEnBios($en, pokemon.name);
      await sleep(DELAY_MS);
    } catch (e) { console.error(`  ⚠ EN falhou: ${e}`); }

    // 3. Raspa bios + moves JP
    const jpUrl = `https://smashwiki.info/${pokemon.jpSlug.split("/").map(encodeURIComponent).join("/")}`;

    console.log(`  Scraping JP: ${jpUrl}`);
    let jpBios: Record<string, string> = {};
    let jpMoves: MoveEntry[] = [];
    try {
      const $jp = await fetchHtml(jpUrl);
      jpBios  = scrapeJpBios($jp);
      jpMoves = scrapeJpMoves($jp);
      await sleep(DELAY_MS);
    } catch (e) { console.error(`  ⚠ JP falhou: ${e}`); }

    // 4. Mostra bios encontradas
    const eras = new Set([...Object.keys(enBios), ...Object.keys(jpBios)]);
    console.log(`  Bios encontradas: ${[...eras].join(", ") || "nenhuma"}`);
    for (const era of eras) {
      const en = enBios[era] ? enBios[era]!.slice(0, 70) + "…" : "—";
      const jp = jpBios[era] ? "✓" : "—";
      console.log(`    [${era}] EN=${en} | JP=${jp}`);
    }
    console.log(`  Moves JP encontrados: ${jpMoves.length}`);
    for (const m of jpMoves) {
      console.log(`    [${m.era}#${m.order}] ${m.label}: ${m.descJp.slice(0, 60)}…`);
    }

    if (DRY_RUN) continue;

    // 5. Salva bios
    let biosCreated = 0, biosUpdated = 0;
    for (const era of eras) {
      const enText = enBios[era];
      const jpText = jpBios[era];
      if (!enText && !jpText) continue;

      const bioExisting = await db.fighterBio.findUnique({
        where: { fighterId_smashGameVersion: { fighterId, smashGameVersion: era } },
      });

      if (bioExisting) {
        const data: Record<string, string> = {};
        if (enText && !bioExisting.contentEn) data.contentEn = enText;
        if (jpText && !bioExisting.contentJp) data.contentJp = jpText;
        if (Object.keys(data).length > 0) {
          await db.fighterBio.update({
            where: { fighterId_smashGameVersion: { fighterId, smashGameVersion: era } },
            data,
          });
          biosUpdated++;
        }
      } else if (enText) {
        await db.fighterBio.create({
          data: { fighterId, smashGameVersion: era, contentEn: enText, contentJp: jpText ?? null },
        });
        biosCreated++;
      }
    }
    console.log(`  ✅ Bios: +${biosCreated} criadas, ~${biosUpdated} atualizadas`);

    // 6. Salva moves (apaga e recria limpo)
    if (jpMoves.length > 0) {
      await db.fighterMove.deleteMany({ where: { fighterId } });
      await db.fighterMove.createMany({
        data: jpMoves.map(m => ({
          fighterId,
          smashGameVersion: m.era,
          order: m.order,
          label: m.label,
          descJp: m.descJp,
        })),
      });
      console.log(`  ✅ Moves: ${jpMoves.length} inseridos`);
    }
  }

  await db.$disconnect();
  console.log("\n\n✅ Done — Squirtle, Ivysaur e Charizard processados.");
}

main().catch(e => { console.error(e); process.exit(1); });
