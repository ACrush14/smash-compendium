import { chromium } from "playwright";
import { mkdirSync } from "fs";

mkdirSync("public/screenshots", { recursive: true });

const PAGES = [
  { url: "http://localhost:3001/",                                  file: "home.png",           wait: 1500 },
  { url: "http://localhost:3001/fighters",                          file: "fighters.png",        wait: 1000 },
  { url: "http://localhost:3001/fighters/ness",                     file: "fighter-ness.png",    wait: 2000 },
  { url: "http://localhost:3001/collectibles?type=SPIRIT",          file: "spirit-viewer.png",   wait: 3000 },
  { url: "http://localhost:3001/collectibles?type=TROPHY&game=SSBM",file: "trophies-melee.png",  wait: 2000 },
  { url: "http://localhost:3001/collectibles?type=TROPHY&game=SSBB",file: "trophies-brawl.png",  wait: 2000 },
  { url: "http://localhost:3001/chronicles",                        file: "chronicles.png",      wait: 1500 },
];

const browser = await chromium.launch();
const page    = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

for (const { url, file, wait } of PAGES) {
  console.log(`📸 ${file}…`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(wait);
  await page.screenshot({ path: `public/screenshots/${file}`, fullPage: false });
}

await browser.close();
console.log("✅ Screenshots salvas em public/screenshots/");
