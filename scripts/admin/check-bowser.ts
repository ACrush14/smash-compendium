import { db } from '../../lib/db';
async function main() {
  const bio = await db.fighterBio.findFirst({
    where: { smashGameVersion: 'SSBM', fighter: { name: 'Bowser' } },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  console.log('Bowser FighterBio:', bio);

  // Fix: if duration < 5s, extend to avgDur 18s
  if (bio && bio.videoStartSec != null && bio.videoEndSec != null) {
    const dur = bio.videoEndSec - bio.videoStartSec;
    if (dur < 5) {
      const newEnd = bio.videoStartSec + 18;
      await db.fighterBio.update({ where: { id: bio.id }, data: { videoEndSec: newEnd } });
      console.log(`Corrigido: ${bio.videoStartSec}s → ${newEnd}s`);
    } else {
      console.log(`Duração OK: ${dur}s`);
    }
  }
}
main().catch(console.error).finally(() => db.$disconnect());
