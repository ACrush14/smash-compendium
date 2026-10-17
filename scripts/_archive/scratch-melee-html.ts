import { fetchHtml, cleanText } from "../scrapers/utils";

async function main() {
  const url = "https://www.ssbwiki.com/List_of_SSB4_trophies_(Super_Mario_Bros._series)";
  const $ = await fetchHtml(url, 3);
  
  const tables = $("table.wikitable");
  if (tables.length > 0) {
    const table = tables.first();
    const rows = table.find("tbody tr").slice(0, 3);
    
    rows.each((i, row) => {
      const cells = $(row).find("td");
      if (cells.length < 5) return;
      
      const descCell = $(cells.eq(5));
      const gameNames: string[] = [];
      descCell.find("dl").first().children("dd").each((_j, dd) => {
         const rawHtml = $(dd).html() || "";
         const text = cleanText($("<div>").html(rawHtml.replace(/<br\s*\/?>/gi, " ")).text()).replace(/^[:\s]+/, "");
         if (text) gameNames.push(text);
      });
      console.log(`Linha ${i} extracted:`, gameNames);
    });
  }
}
main().catch(console.error);
