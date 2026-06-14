import { fetchHtml } from "../scrapers/utils";
import * as cheerio from "cheerio";

async function main() {
  const $ = await fetchHtml("https://www.ssbwiki.com/List_of_spirits");
  
  // Try to find the navbox or links to series pages
  const links = $("a").filter((_, el) => {
    const href = $(el).attr("href");
    return href && href.startsWith("/List_of_spirits_(") && !href.includes("action=edit");
  }).map((_, el) => $(el).attr("href")).get();

  const uniqueLinks = [...new Set(links)];
  console.log("Found links:", uniqueLinks.length);
  console.log(uniqueLinks.join("\n"));
}

main().catch(console.error);
