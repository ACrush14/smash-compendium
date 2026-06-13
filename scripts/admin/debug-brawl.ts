import { fetchHtml, cleanText } from "../scrapers/utils";

async function main() {
const $ = await fetchHtml("https://www.ssbwiki.com/List_of_SSBB_trophies_(complete_list)", 3);

const tables = $("table");
console.log("Total tabelas:", tables.length);

tables.each((i, t) => {
  const cls = $(t).attr("class") ?? "(sem classe)";
  const rows = $("tbody tr", t).length;
  if (rows > 5) console.log(`Tabela ${i} | ${cls.slice(0, 50)} | linhas tbody: ${rows}`);
});

const firstRow = $("table.wikitable tbody tr").first();
const cells = firstRow.find("td, th");
console.log("\nCols 1ª linha wikitable:", cells.length);
cells.each((i, c) => { console.log(`  col${i}: ${cleanText($(c).text()).slice(0, 40)}`); });

// Conta rows com >= 3 td
let count3 = 0;
$("table.wikitable tbody tr").each((_i, row) => {
  if ($("td", row).length >= 3) count3++;
});
console.log("\nLinhas com >= 3 td:", count3);

// Distribuição de linhas por número de td
const dist: Record<number, number> = {};
$("table.wikitable tbody tr").each((_i, row) => {
  const n = $("td", row).length;
  dist[n] = (dist[n] ?? 0) + 1;
});
console.log("\nDistribuição por nº de td:", dist);

// Mostra HTML bruto das primeiras 3 linhas com 2 td
let shown = 0;
$("table.wikitable tbody tr").each((_i, row) => {
  if (shown >= 3) return false;
  const tds = $("td", row);
  if (tds.length === 2) {
    console.log("\n--- Linha com 2 td ---");
    console.log($(row).html()?.slice(0, 500));
    shown++;
  }
});
// Também mostra uma linha com 3 td
let shown3 = 0;
$("table.wikitable tbody tr").each((_i, row) => {
  if (shown3 >= 1) return false;
  const tds = $("td", row);
  if (tds.length === 3) {
    console.log("\n--- Linha com 3 td ---");
    console.log($(row).html()?.slice(0, 500));
    shown3++;
  }
});

process.exit(0);
}
main().catch(console.error);
