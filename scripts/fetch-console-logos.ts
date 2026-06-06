/**
 * fetch-console-logos.ts
 * Baixa logos SVG oficiais de consoles diretamente do Wikimedia Commons.
 * Salva em public/assets/consoles/[nome].svg
 *
 * Uso:
 *   npx tsx scripts/fetch-console-logos.ts
 */

import fs   from "fs";
import path from "path";

// Mapeamento: arquivo local → nome do arquivo no Wikimedia Commons
// API: commons.wikimedia.org/w/api.php?action=query&titles=File:[nome]&prop=imageinfo&iiprop=url&format=json
const LOGOS: Array<{ out: string; file: string }> = [
  { out: "snes.svg",   file: "SNES_logo.svg" },
  { out: "nes.svg",    file: "NES_logo.svg" },
  { out: "n64.svg",    file: "Nintendo_64_logo.svg" },
  { out: "gba.svg",    file: "Game_Boy_Advance_logo.svg" },
  { out: "gb.svg",     file: "Game_Boy_logo.svg" },
  { out: "gcn.svg",    file: "Nintendo_GameCube_Logo.svg" },
  { out: "wii.svg",    file: "Wii_logo.svg" },
  { out: "wiiu.svg",   file: "Wii_U_logo.svg" },
  { out: "3ds.svg",    file: "Nintendo_3DS_logo.svg" },
  { out: "switch.svg", file: "Nintendo_Switch_Logo.svg" },
  { out: "ds.svg",     file: "Nintendo_DS_Logo.svg" },
  { out: "gen.svg",    file: "Sega_Genesis_logo.svg" },
  { out: "ps3.svg",    file: "PlayStation_3_logo.svg" },
  { out: "ps4.svg",    file: "PlayStation_4_logo.svg" },
];

const OUT_DIR = path.join(process.cwd(), "public", "assets", "consoles");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const HEADERS = {
  "User-Agent": "SmashCompendium/1.0 (fan-project; academic; anderson.crush.link@gmail.com)",
  "Accept":     "image/svg+xml,*/*",
};

async function getCommonsUrl(filename: string): Promise<string | null> {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`;
  const res  = await fetch(api, { headers: HEADERS });
  if (!res.ok) return null;
  const json = await res.json() as {
    query?: { pages?: Record<string, { imageinfo?: Array<{ url: string }> }> }
  };
  const page = Object.values(json.query?.pages ?? {})[0];
  return page?.imageinfo?.[0]?.url ?? null;
}

const c = (s: string, n: number) => `\x1b[${n}m${s}\x1b[0m`;
const SEP = "─".repeat(56);

async function main() {
  console.log(`\n${c("╔" + "═".repeat(54) + "╗", 33)}`);
  console.log(`${c("║   CONSOLE LOGO DOWNLOADER — Wikimedia Commons     ║", 33)}`);
  console.log(`${c("╚" + "═".repeat(54) + "╝", 33)}\n`);

  let ok = 0, fail = 0;

  for (const logo of LOGOS) {
    process.stdout.write(`  ${c(logo.out.padEnd(14), 36)} `);

    try {
      const url = await getCommonsUrl(logo.file);
      if (!url) {
        console.log(c("✘  não encontrado no Commons", 31));
        fail++;
        continue;
      }

      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const body = await res.text();
      const dest = path.join(OUT_DIR, logo.out);
      fs.writeFileSync(dest, body, "utf8");

      const kb = (Buffer.byteLength(body) / 1024).toFixed(1);
      console.log(`${c("✔", 32)}  ${kb} KB  ← ${url.slice(0, 55)}`);
      ok++;
    } catch (err) {
      console.log(c(`✘  ${String(err).slice(0, 60)}`, 31));
      fail++;
    }
  }

  console.log(`\n${c(SEP, 36)}`);
  console.log(`  ${c(`${ok} baixados`, 32)}  ·  ${fail > 0 ? c(`${fail} falharam`, 31) : c("0 falhas", 32)}`);
  console.log(`  Destino: ${c(OUT_DIR, 36)}\n`);
}

main().catch(console.error);
