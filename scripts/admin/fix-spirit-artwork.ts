import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const spirits = await db.collectible.findMany({
    where: { type: 'SPIRIT' },
    select: { id: true, sourceGame: true, spiritArtworkSource: true }
  });

  let updatedCount = 0;

  for (const s of spirits) {
    if (!s.sourceGame) continue;
    
    let sourceGame = s.sourceGame;
    let artwork = s.spiritArtworkSource;
    let changed = false;

    // Check if sourceGame has a broken "(Artwork" inside it due to bad regex
    const artIdx = sourceGame.indexOf("(Artwork");
    if (artIdx !== -1) {
      const parsedSource = sourceGame.substring(0, artIdx).trim();
      const afterArt = sourceGame.substring(artIdx);
      
      let parsedArtwork = artwork;
      const colonIdx = afterArt.indexOf(":");
      if (colonIdx !== -1) {
        parsedArtwork = afterArt.substring(colonIdx + 1, afterArt.length - 1).trim();
      }

      sourceGame = parsedSource;
      artwork = parsedArtwork;
      changed = true;
    }

    // Deal with weird merged names like "Diddy Kong Racing (Banjo)Banjo-Kazooie (Kazooie)"
    // Actually, I recommended leaving them as is in Collectibles and letting the seeder do fuzzy link, 
    // but separating them into the two correct names is even better if they are just concatenated.
    // Let's just fix the Artwork issue first.

    if (changed || sourceGame !== s.sourceGame || artwork !== s.spiritArtworkSource) {
      await db.collectible.update({
        where: { id: s.id },
        data: { sourceGame, spiritArtworkSource: artwork }
      });
      console.log(`Fixed ${s.id}: source="${sourceGame}", artwork="${artwork}"`);
      updatedCount++;
    }
  }

  console.log(`Finished fixing ${updatedCount} records.`);
}

main().finally(() => db.$disconnect());
