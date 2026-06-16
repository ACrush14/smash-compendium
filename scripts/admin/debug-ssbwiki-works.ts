/** Inspeciona a estrutura HTML do Works no SSBWiki para um lutador */
import { fetchHtml } from "../scrapers/utils";

async function main() {
  const name = process.argv[2] ?? "Donkey_Kong";
  const url = `https://www.ssbwiki.com/${name}`;
  const $ = await fetchHtml(url);

  // Tenta todas as abordagens de encontrar Works
  console.log("=== Abordagem 1: dt contendo 'Works' ===");
  $("dt").each((_, el) => {
    const text = $(el).text().trim();
    if (text.toLowerCase().includes("work")) {
      console.log("DT encontrado:", text);
      const dd = $(el).next("dd");
      console.log("DD HTML:", dd.html()?.slice(0, 500));
    }
  });

  console.log("\n=== Abordagem 2: li dentro de seções 'In Super Smash' ===");
  $("h2").each((_, h2) => {
    const heading = $(h2).text().trim();
    if (!heading.toLowerCase().includes("smash")) return;
    console.log("\nSeção:", heading);
    let el = $(h2).next();
    let found = 0;
    while (el.length && !el.is("h2") && found < 20) {
      el.find("dt").each((__, dt) => {
        const t = $(dt).text().trim();
        if (t.toLowerCase().includes("work")) {
          console.log("  Works dt:", t);
          $(dt).next("dd").find("li, a").each((___, item) => {
            console.log("    -", $(item).text().trim());
          });
        }
      });
      el = el.next();
      found++;
    }
  });

  console.log("\n=== Abordagem 3: todos os 'Works:' em dl ===");
  $("dl").each((_, dl) => {
    const text = $(dl).text();
    if (text.toLowerCase().includes("works:")) {
      console.log("DL:", $(dl).html()?.slice(0, 600));
    }
  });
}
main().catch(e => { console.error(e); process.exit(1); });
