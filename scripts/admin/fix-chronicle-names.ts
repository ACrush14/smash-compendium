import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function run() {
  const updates: Array<{ id: string, titleNtsc: string }> = [];
  const creates: Array<{ consoleName: string, titleNtsc: string }> = [];

  // Diddy Kong Racing
  const diddy = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Diddy Kong Racing (Banjo)Banjo-Kazooie (Kazooie)" }});
  if (diddy) {
    updates.push({ id: diddy.id, titleNtsc: "Diddy Kong Racing" });
    creates.push({ consoleName: diddy.consoleName, titleNtsc: "Banjo-Kazooie" });
  }

  // Dragon Quest II (Mobile)
  const dq2 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Dragon Quest II (Mobile)" }});
  if (dq2) updates.push({ id: dq2.id, titleNtsc: "Dragon Quest II" });

  // Dragon Quest III (SFC)
  const dq3 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Dragon Quest III: The Seeds of Salvation (SFC)" }});
  if (dq3) updates.push({ id: dq3.id, titleNtsc: "Dragon Quest III: The Seeds of Salvation" });

  // Dragon Quest IV (DS)
  const dq4 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Dragon Quest IV: Chapters of the Chosen (DS)" }});
  if (dq4) updates.push({ id: dq4.id, titleNtsc: "Dragon Quest IV: Chapters of the Chosen" });

  // Famicom Detective Club
  const famicom = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Famicom Detective Club Part II: The Girl Who Stands Behind (Disk System)" }});
  if (famicom) updates.push({ id: famicom.id, titleNtsc: "Famicom Detective Club Part II: The Girl Who Stands Behind" });

  // SimCity
  const simcity = await db.chronicleEntry.findFirst({ where: { titleNtsc: "SimCity (1991, SNES)" }});
  if (simcity) updates.push({ id: simcity.id, titleNtsc: "SimCity" });

  // Final Fantasy II & VII
  const ff = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Final Fantasy II (Concept)Final Fantasy VII (Incarnation; Artwork)" }});
  if (ff) {
    updates.push({ id: ff.id, titleNtsc: "Final Fantasy II" });
    creates.push({ consoleName: ff.consoleName, titleNtsc: "Final Fantasy VII" });
  }
  
  // Final Fantasy II & III
  const ff2 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Final Fantasy II (Chocobo)Final Fantasy III (Moogle)" }});
  if (ff2) {
    updates.push({ id: ff2.id, titleNtsc: "Final Fantasy II" });
    creates.push({ consoleName: ff2.consoleName, titleNtsc: "Final Fantasy III" });
  }

  // Tekken
  const tekken1 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Tekken (original Kuma)Tekken 3 (current Kuma and Panda)" }});
  if (tekken1) {
    updates.push({ id: tekken1.id, titleNtsc: "Tekken" });
    creates.push({ consoleName: tekken1.consoleName, titleNtsc: "Tekken 3" });
  }

  const tekken2 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Tekken (original incarnations)Tekken 3 (current King)Tekken 5: Dark Resurrection (current Armor King)" }});
  if (tekken2) {
    updates.push({ id: tekken2.id, titleNtsc: "Tekken" });
    creates.push({ consoleName: tekken2.consoleName, titleNtsc: "Tekken 3" });
    creates.push({ consoleName: tekken2.consoleName, titleNtsc: "Tekken 5: Dark Resurrection" });
  }

  const tekken3 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Tekken (as Jack)Tekken 7 (artwork; as Jack-7)" }});
  if (tekken3) {
    updates.push({ id: tekken3.id, titleNtsc: "Tekken" });
    creates.push({ consoleName: tekken3.consoleName, titleNtsc: "Tekken 7" });
  }

  // Jikkyo
  const jikkyo1 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Jikkyō Powerful Pro Yakyū '94 (Power Pro-Kun)Jikkyō Powerful Pro Yakyū 4 (Mamoru Ikari)Jikkyō Powerful Pro Yakyū 7 (Aoi Hayakawa)" }});
  if (jikkyo1) {
    updates.push({ id: jikkyo1.id, titleNtsc: "Jikkyō Powerful Pro Yakyū '94" });
    creates.push({ consoleName: jikkyo1.consoleName, titleNtsc: "Jikkyō Powerful Pro Yakyū 4" });
    creates.push({ consoleName: jikkyo1.consoleName, titleNtsc: "Jikkyō Powerful Pro Yakyū 7" });
  }

  const jikkyo2 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Jikkyō Powerful Pro Yakyū Heroes)(Artwork (Aoi Hayakawa & Mamoru Ikari): Jikkyō Powerful Pro Yakyū 2013" }});
  if (jikkyo2) {
    updates.push({ id: jikkyo2.id, titleNtsc: "Jikkyō Powerful Pro Yakyū Heroes" });
    creates.push({ consoleName: jikkyo2.consoleName, titleNtsc: "Jikkyō Powerful Pro Yakyū 2013" });
  }
  
  // Pikmin 2
  const pikmin2 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Pikmin 2(Artwork: Pikmin 3)" }});
  if (pikmin2) {
    updates.push({ id: pikmin2.id, titleNtsc: "Pikmin 2" });
    creates.push({ consoleName: pikmin2.consoleName, titleNtsc: "Pikmin 3" });
  }

  for (const update of updates) {
    await db.chronicleEntry.update({
      where: { id: update.id },
      data: { titleNtsc: update.titleNtsc }
    });
    console.log(`Updated ${update.id} to ${update.titleNtsc}`);
  }

  for (const create of creates) {
    // Check if it already exists
    const exists = await db.chronicleEntry.findFirst({
      where: { titleNtsc: create.titleNtsc, consoleName: create.consoleName }
    });
    if (!exists) {
      await db.chronicleEntry.create({
        data: {
          consoleName: create.consoleName,
          titleNtsc: create.titleNtsc
        }
      });
      console.log(`Created new entry for ${create.titleNtsc}`);
    } else {
      console.log(`Skipped creating ${create.titleNtsc} (already exists)`);
    }
  }

  console.log('Done!');
}

run().finally(() => db.$disconnect());
