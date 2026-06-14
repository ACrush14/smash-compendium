import { fetchHtml, cleanText } from "../scrapers/utils";

async function main() {
  const $ = await fetchHtml("https://www.ssbwiki.com/List_of_SSB4_trophies_(complete_list)", 3);

  // Encontra as seções por heading h2
  const sections: { title: string; table: number; dist: Record<number, number> }[] = [];

  $(".mw-parser-output h2, .mw-parser-output .mw-heading2").each((_i, heading) => {
    const title = cleanText($(heading).text()).replace(/\[.*?\]/g, "").trim();
    let table = $(heading).nextAll("table.wikitable").first();
    if (!table.length) return;

    const dist: Record<number, number> = {};
    table.find("tbody tr").each((_j, row) => {
      const n = $("td", row).length;
      dist[n] = (dist[n] ?? 0) + 1;
    });

    sections.push({ title, table: table.find("tbody tr").length, dist });
  });

  console.log("\n=== Seções encontradas ===");
  for (const s of sections) {
    console.log(`\n"${s.title}" — ${s.table} linhas tbody`);
    console.log("  Distribuição:", s.dist);
  }

  // Mostra HTML das primeiras linhas de cada tipo na tabela "Both versions"
  const bothH2 = $(".mw-parser-output h2, .mw-parser-output .mw-heading2")
    .filter((_i, el) => cleanText($(el).text()).includes("Both")).first();
  const bothTable = bothH2.nextAll("table.wikitable").first();

  console.log("\n=== Primeiras 3 linhas com 5 td (Both versions) ===");
  let shown5 = 0;
  bothTable.find("tbody tr").each((_i, row) => {
    if (shown5 >= 2) return false;
    if ($("td", row).length === 5) {
      const cells = $("td", row);
      console.log(`  Name: ${cleanText($(cells.eq(0)).text()).slice(0, 30)}`);
      console.log(`  Series: ${cleanText($(cells.eq(3)).text()).slice(0, 30)}`);
      console.log(`  Category: ${cleanText($(cells.eq(4)).text()).slice(0, 30)}`);
      const img1 = $(cells.eq(1)).find("img").attr("src") ?? "";
      const img2 = $(cells.eq(2)).find("img").attr("src") ?? "";
      console.log(`  WiiU img: ${img1.slice(0, 60)}`);
      console.log(`  3DS  img: ${img2.slice(0, 60)}`);
      shown5++;
      console.log();
    }
  });

  console.log("=== 1ª linha com 4 td (Both versions) ===");
  let shown4 = 0;
  bothTable.find("tbody tr").each((_i, row) => {
    if (shown4 >= 1) return false;
    if ($("td", row).length === 4) {
      const cells = $("td", row);
      console.log(`  Name: ${cleanText($(cells.eq(0)).text()).slice(0, 30)}`);
      console.log(`  col3: ${cleanText($(cells.eq(3)).text()).slice(0, 30)}`);
      shown4++;
    }
  });

  process.exit(0);
}
main().catch(console.error);
