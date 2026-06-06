import { db } from "../../lib/db";
import { execSync } from "child_process";
import { log, politeDelay } from "./utils";

async function main() {
  const fighters = await db.fighter.findMany({
    orderBy: { rosterNumber: "asc" }
  });

  log.step(`Iniciando ETL em massa para ${fighters.length} lutadores...`);

  let count = 0;
  for (const fighter of fighters) {
    count++;
    log.step(`[${count}/${fighters.length}] Processando ${fighter.name}...`);
    
    try {
      console.log(`  > Rodando character-article.ts...`);
      execSync(`npx tsx scripts/scrapers/character-article.ts "${fighter.name}" --save`, { stdio: "inherit" });
      
      await politeDelay();
      
      console.log(`  > Rodando fetch-images.ts...`);
      execSync(`npx tsx scripts/scrapers/fetch-images.ts "${fighter.name}" --save`, { stdio: "inherit" });
      
      await politeDelay();
    } catch (err) {
      log.warn(`  Falha ao processar ${fighter.name}: ${err}`);
    }
  }

  log.ok(`ETL em massa concluído para todos os lutadores!`);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
