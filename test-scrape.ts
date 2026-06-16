import * as cheerio from "cheerio";

async function main() {
  const html = await fetch("https://www.ssbwiki.com/Mario_(SSB)").then(r => r.text());
  const $ = cheerio.load(html);
  
  const inGameDescH2 = $("h2").filter((i, el) => $(el).text().includes("In-game description"));
  console.log("In-game desc:\n", inGameDescH2.nextUntil("h2").text());
}
main();
