import { fetchHtml, cleanText } from "../scrapers/utils";
import * as cheerio from "cheerio";

async function main() {
  const $ = await fetchHtml("https://www.ssbwiki.com/List_of_spirits_(Tekken_series)");
  
  $("table.wikitable").each((i, table) => {
    console.log(`\nTable ${i}:`);
    const headers: string[] = [];
    $(table).find("tr").first().find("th").each((_, th) => {
      headers.push(cleanText($(th).text()));
    });
    if (headers.length === 0) {
      // Sometimes headers are in the second row if the first row has colspan
      $(table).find("tr").eq(1).find("th").each((_, th) => {
        headers.push(cleanText($(th).text()));
      });
    }
    console.log("Headers:", headers);
    
    // Sample first data row
    let dataRow = $(table).find("tr").filter((_, el) => $(el).find("td").length > 0).first();
    const rowData: string[] = [];
    dataRow.find("td").each((_, td) => rowData.push(cleanText($(td).text())));
    console.log("Row 1 data:", rowData);
  });
}

main().catch(console.error);
