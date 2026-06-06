/**
 * fetch-consoles.ts — Baixa ícones de consoles e salva em public/assets/consoles/
 *
 * FONTES:
 *  1. SteamGridDB API v2  (requer STEAMGRIDDB_API_KEY no .env.local)
 *     → https://www.steamgriddb.com/api/v2
 *     → Nota: SGDB é primariamente para arte de JOGOS (PC/Steam), não hardware.
 *       A API retorna ícones de software; para hardware Nintendo use a opção 2.
 *     → Para obter chave: https://www.steamgriddb.com/profile/preferences/api
 *
 *  2. Wikipedia Commons  (fallback público, sem auth)
 *     → Imagens de hardware oficiais sob licença livre (CC-BY-SA / Public Domain)
 *     → Usadas automaticamente quando não há chave SGDB ou quando o SGDB
 *       não retorna resultado relevante.
 *
 * USO:
 *   npx tsx --env-file=.env.local scripts/fetch-consoles.ts          # dry-run
 *   npx tsx --env-file=.env.local scripts/fetch-consoles.ts --save   # baixa os arquivos
 */

import fs   from "fs";
import path from "path";

const SAVE = process.argv.includes("--save");
const SGDB_KEY = process.env.STEAMGRIDDB_API_KEY ?? "";

// ─── Mapa curado: console slug → fonte de ícone ──────────────────────────────
//
// Para cada console definimos:
//   sgdbQuery  — termo de busca na API do SteamGridDB (game/icon search)
//   wikiUrl    — URL do Wikipedia Commons como fallback confiável
//   outputFile — nome do arquivo a salvar em public/assets/consoles/
//
interface ConsoleEntry {
  label:       string;   // nome exibível
  sgdbQuery:   string;   // termo de busca no SGDB
  wikiFile:    string;   // Nome do arquivo no Wikimedia Commons (ex: "NES-Console-Set.png")
  wikiUrl:     string;   // URL direta (fallback se a API do Commons falhar)
  outputFile:  string;   // public/assets/consoles/[outputFile]
}

const CONSOLE_MAP: ConsoleEntry[] = [
  { label:"NES / Famicom",        sgdbQuery:"Nintendo Entertainment System",    wikiFile:"NES-Console-Set.png",                outputFile:"nes.png",    wikiUrl:"" },
  { label:"SNES / Super Famicom", sgdbQuery:"Super Nintendo Entertainment System",wikiFile:"Super-Famicom-Set-FL.png",         outputFile:"snes.png",   wikiUrl:"" },
  { label:"Nintendo 64",          sgdbQuery:"Nintendo 64",                       wikiFile:"Nintendo-64-Set.png",               outputFile:"n64.png",    wikiUrl:"" },
  { label:"Game Boy",             sgdbQuery:"Nintendo Game Boy",                 wikiFile:"Game-Boy-FL.png",                   outputFile:"gb.png",     wikiUrl:"" },
  { label:"Game Boy Color",       sgdbQuery:"Game Boy Color",                    wikiFile:"Nintendo_Game_Boy_Color.png",       outputFile:"gbc.png",    wikiUrl:"" },
  { label:"Game Boy Advance",     sgdbQuery:"Game Boy Advance",                  wikiFile:"Game-Boy-Advance-Purple-FL.png",    outputFile:"gba.png",    wikiUrl:"" },
  { label:"GameCube",             sgdbQuery:"Nintendo GameCube",                 wikiFile:"GameCube-Set.png",                  outputFile:"gcn.png",    wikiUrl:"" },
  { label:"Wii",                  sgdbQuery:"Nintendo Wii",                      wikiFile:"Wii-Img.png",                       outputFile:"wii.png",    wikiUrl:"" },
  { label:"Wii U",                sgdbQuery:"Nintendo Wii U",                    wikiFile:"Nintendo-Wii-U-Console-FL.png",     outputFile:"wiiu.png",   wikiUrl:"" },
  { label:"Nintendo DS",          sgdbQuery:"Nintendo DS",                       wikiFile:"Nintendo-DS-Fat-Blue.jpg",          outputFile:"ds.png",     wikiUrl:"" },
  { label:"Nintendo 3DS",         sgdbQuery:"Nintendo 3DS",                      wikiFile:"Nintendo-3DS-AquaOpen.png",         outputFile:"3ds.png",    wikiUrl:"" },
  { label:"Nintendo Switch",      sgdbQuery:"Nintendo Switch",                   wikiFile:"Nintendo_Switch_dock_with_controllers.jpg", outputFile:"switch.png", wikiUrl:"" },
  { label:"Sega Genesis / MD",    sgdbQuery:"Sega Genesis",                      wikiFile:"Sega-Genesis-Mod1-Set.png",         outputFile:"gen.png",    wikiUrl:"" },
  { label:"PlayStation 3",        sgdbQuery:"PlayStation 3",                     wikiFile:"PS3-Versions.png",                  outputFile:"ps3.png",    wikiUrl:"" },
  { label:"PlayStation 4",        sgdbQuery:"PlayStation 4",                     wikiFile:"PlayStation_4_Pro_with_DualShock_4.png", outputFile:"ps4.png", wikiUrl:"" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Wikimedia API — retorna URL do thumbnail para um arquivo do Commons
async function getWikimediaThumbUrl(filename: string, width = 120): Promise<string | null> {
  const apiUrl = [
    "https://commons.wikimedia.org/w/api.php",
    `?action=query&titles=File:${encodeURIComponent(filename)}`,
    `&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`,
  ].join("");
  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent": "SmashCompendium/1.0 (fan-project; no-auth; academic use)",
      "Accept":     "application/json",
    },
  });
  if (!res.ok) return null;
  const json = await res.json() as { query?: { pages?: Record<string, { imageinfo?: Array<{ thumburl: string }> }> } };
  const page = Object.values(json.query?.pages ?? {})[0];
  return page?.imageinfo?.[0]?.thumburl ?? null;
}

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "SmashCompendium/1.0 (fan-project; academic use)",
      "Accept":     "image/png,image/jpeg,image/*",
      "Referer":    "https://commons.wikimedia.org/",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// Fallback: gera um SVG estilizado para o console (cartridge-badge)
function generateConsoleSvg(entry: ConsoleEntry): string {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    "nes.png":    { bg: "#1a0a0a", border: "#e60012", text: "#ff8888" },
    "snes.png":   { bg: "#1a0a2e", border: "#6d3b8e", text: "#a78bfa" },
    "n64.png":    { bg: "#0a0a2a", border: "#1a3a7e", text: "#60a5fa" },
    "gb.png":     { bg: "#1a1a1a", border: "#555",    text: "#aaa"    },
    "gbc.png":    { bg: "#1a1a1a", border: "#666",    text: "#bbb"    },
    "gba.png":    { bg: "#1a0a2e", border: "#5c1f8a", text: "#c084fc" },
    "gcn.png":    { bg: "#0a0020", border: "#1a0050", text: "#818cf8" },
    "wii.png":    { bg: "#111126", border: "#374151", text: "#9ca3af" },
    "wiiu.png":   { bg: "#0a0a2a", border: "#1d4ed8", text: "#93c5fd" },
    "switch.png": { bg: "#1a0000", border: "#dc2626", text: "#fca5a5" },
    "3ds.png":    { bg: "#0a0a2a", border: "#1e40af", text: "#93c5fd" },
    "ds.png":     { bg: "#0a0a2a", border: "#2563eb", text: "#93c5fd" },
    "gen.png":    { bg: "#000a1a", border: "#0044aa", text: "#60a5fa" },
    "ps3.png":    { bg: "#0a0a0a", border: "#2563eb", text: "#bfdbfe" },
    "ps4.png":    { bg: "#0a0a0a", border: "#1d4ed8", text: "#93c5fd" },
  };
  const col = colors[entry.outputFile] ?? { bg: "#0a0a14", border: "#334155", text: "#94a3b8" };
  const abbr = entry.outputFile.replace(".png", "").toUpperCase().slice(0, 4);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 28" width="48" height="28">
  <rect width="48" height="28" rx="3" fill="${col.bg}"/>
  <rect x="1" y="1" width="46" height="26" rx="2.5" fill="none" stroke="${col.border}" stroke-width="1.5"/>
  <rect x="4" y="4" width="40" height="20" rx="1.5" fill="${col.border}22"/>
  <text x="24" y="19" font-family="monospace" font-weight="bold" font-size="9" fill="${col.text}" text-anchor="middle" letter-spacing="0.5">${abbr}</text>
</svg>`;
}

// SteamGridDB — busca ícone de JOGO pelo nome (retorna o melhor match)
// Nota: SGDB não indexa hardware de console como categoria própria.
// Este endpoint retorna ícones de jogos com nome similar ao query.
async function fetchFromSGDB(entry: ConsoleEntry): Promise<string | null> {
  if (!SGDB_KEY) return null;

  try {
    // 1. Busca o game ID pelo nome
    const searchRes = await fetch(
      `https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(entry.sgdbQuery)}`,
      { headers: { Authorization: `Bearer ${SGDB_KEY}` } }
    );
    const searchJson = await searchRes.json() as { data?: Array<{ id: number }> };
    const gameId = searchJson.data?.[0]?.id;
    if (!gameId) return null;

    // 2. Busca ícones desse game ID
    const iconsRes = await fetch(
      `https://www.steamgriddb.com/api/v2/icons/game/${gameId}?dimensions=32x32,64x64`,
      { headers: { Authorization: `Bearer ${SGDB_KEY}` } }
    );
    const iconsJson = await iconsRes.json() as { data?: Array<{ url: string }> };
    const iconUrl = iconsJson.data?.[0]?.url;
    return iconUrl ?? null;
  } catch {
    return null;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const OUT_DIR = path.join(process.cwd(), "public", "assets", "consoles");
if (SAVE && !fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const SEP  = "─".repeat(64);
const c = (s: string, code: number) => `\x1b[${code}m${s}\x1b[0m`;

async function main() {
console.log(`\n${c("╔" + "═".repeat(62) + "╗", 33)}`);
console.log(`${c("║   CONSOLE ICON FETCHER" + " ".repeat(39) + "║", 33)}`);
console.log(`${c("╚" + "═".repeat(62) + "╝", 33)}`);
console.log(`\n  SGDB key: ${SGDB_KEY ? c("✔ configurada", 32) : c("✘ ausente — usando Wikipedia fallback", 33)}`);
console.log(`  Output:   ${c(OUT_DIR, 36)}`);
console.log(`  Mode:     ${SAVE ? c("--save (baixando arquivos)", 32) : c("dry-run (use --save para baixar)", 33)}`);

for (const entry of CONSOLE_MAP) {
  console.log(`\n${c(SEP, 36)}`);
  console.log(`  ${c(entry.label, 1)}`);

  let imageUrl: string | null = null;
  let source = "";

  let savedOk = false;

  // Tentativa 1: SteamGridDB API (software art — requer STEAMGRIDDB_API_KEY)
  if (SGDB_KEY) {
    try {
      imageUrl = await fetchFromSGDB(entry);
      if (imageUrl) source = "SteamGridDB";
    } catch { /* cai no próximo */ }
  }

  // Tentativa 2: Wikimedia Commons API (hardware thumbnail — preferível)
  if (!imageUrl) {
    try {
      imageUrl = await getWikimediaThumbUrl(entry.wikiFile, 120);
      if (imageUrl) source = "Wikimedia Commons API";
    } catch { /* cai no fallback */ }
  }

  console.log(`  Fonte:  ${c(source || "SVG gerado localmente", 33)}`);
  if (imageUrl) console.log(`  URL:    ${imageUrl.slice(0, 70)}`);

  if (SAVE) {
    // A. Tenta baixar a imagem bitmap
    if (imageUrl) {
      try {
        const buf  = await download(imageUrl);
        const dest = path.join(OUT_DIR, entry.outputFile);
        fs.writeFileSync(dest, buf);
        console.log(`  ${c("✔ Bitmap salvo:", 32)} ${entry.outputFile} (${(buf.length / 1024).toFixed(1)} KB)`);
        savedOk = true;
      } catch (err) {
        console.log(`  ${c("⚠ Download falhou:", 33)} ${String(err).slice(0, 60)}`);
      }
    }
    // B. Fallback: salva um SVG estilizado local
    if (!savedOk) {
      const svgContent = generateConsoleSvg(entry);
      const svgFile    = entry.outputFile.replace(".png", ".svg");
      const dest       = path.join(OUT_DIR, svgFile);
      fs.writeFileSync(dest, svgContent, "utf8");
      console.log(`  ${c("✔ SVG fallback salvo:", 32)} ${svgFile}`);
    }
  } else {
    console.log(`  ${c("→", 36)} ${path.join(OUT_DIR, entry.outputFile)}`);
  }
}

console.log(`\n${c(SEP, 36)}`);
console.log(`\n  ${c("Para baixar os ícones:", 1)}`);
console.log(`  npx tsx --env-file=.env.local scripts/fetch-consoles.ts --save\n`);
console.log(`  ${c("Para usar SteamGridDB API:", 1)}`);
console.log(`  1. Acesse https://www.steamgriddb.com/profile/preferences/api`);
console.log(`  2. Gere uma API key`);
console.log(`  3. Adicione ao .env.local: STEAMGRIDDB_API_KEY="sua-chave"\n`);
} // end main

main().catch(console.error);
