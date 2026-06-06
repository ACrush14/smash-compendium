
import { scrapeAndUpsertChronicle } from "./chronicle";

scrapeAndUpsertChronicle()
  .then(() => {
    console.log("Chronicle import complete.");
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
