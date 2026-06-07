import { execSync } from "child_process";

function run(script: string) {
  console.log(`\n\n======================================================`);
  console.log(`Starting: ${script}`);
  console.log(`======================================================\n`);
  execSync(`npx tsx --env-file=.env.local ${script}`, { stdio: "inherit" });
}

async function main() {
  console.log("Iniciando Mestre ETL (Trophies -> Imagens -> Bios JP)");
  try {
    run("scripts/scrapers/collectibles.ts");
    run("scripts/scrapers/download-all-media.ts");
    run("scripts/scrapers/scrape-jp-bios.ts");
    console.log("ETL Mestre concluído com sucesso!");
  } catch (err) {
    console.error("Falha no script Mestre ETL:", err);
    process.exit(1);
  }
}

main();
