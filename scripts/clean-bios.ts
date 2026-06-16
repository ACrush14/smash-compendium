import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function cleanWikiText(text: string | null): string | null {
  if (!text) return text;
  let clean = text;
  
  // Clean {{uv|Universe|Text}} or {{uv|Universe}} or {{b|Text|link}}
  clean = clean.replace(/\{\{uv\|[^\|]+\|([^}]+)\}\}/g, '$1');
  clean = clean.replace(/\{\{uv\|([^}]+)\}\}/g, '$1');
  clean = clean.replace(/\{\{[a-z]+\|([^\|}]+)(?:\|[^}]+)*\}\}/g, '$1');
  
  // Clean [[Page|Text]]
  clean = clean.replace(/\[\[[^\|\]]+\|([^\]]+)\]\]/g, '$1');
  
  // Clean [[Page]]
  clean = clean.replace(/\[\[([^\]]+)\]\]/g, '$1');
  
  // Clean lingering html-like comments or tags if any (optional, but let's stick to standard wiki for now)
  return clean;
}

async function run() {
  const bios = await db.fighterBio.findMany();
  let updated = 0;

  for (const bio of bios) {
    const newEn = cleanWikiText(bio.contentEn);
    const newPt = cleanWikiText(bio.contentPt);
    const newJp = cleanWikiText(bio.contentJp);
    const newJpEn = cleanWikiText(bio.contentJpEn);

    if (
      newEn !== bio.contentEn ||
      newPt !== bio.contentPt ||
      newJp !== bio.contentJp ||
      newJpEn !== bio.contentJpEn
    ) {
      await db.fighterBio.update({
        where: { id: bio.id },
        data: {
          contentEn: newEn,
          contentPt: newPt,
          contentJp: newJp,
          contentJpEn: newJpEn,
        },
      });
      updated++;
    }
  }

  // Troféus e descrições
  const collectibles = await db.collectible.findMany();
  let updatedCollectibles = 0;

  for (const item of collectibles) {
    const newDescEn = cleanWikiText(item.descriptionEn);
    const newDescPt = cleanWikiText(item.descriptionPt);
    const newDescJp = cleanWikiText(item.descriptionJp);

    if (
      newDescEn !== item.descriptionEn ||
      newDescPt !== item.descriptionPt ||
      newDescJp !== item.descriptionJp
    ) {
      await db.collectible.update({
        where: { id: item.id },
        data: {
          descriptionEn: newDescEn,
          descriptionPt: newDescPt,
          descriptionJp: newDescJp,
        },
      });
      updatedCollectibles++;
    }
  }

  console.log(`Atualizou \${updated} bios e \${updatedCollectibles} collectibles.`);
  await db.$disconnect();
}

run().catch(console.error);
