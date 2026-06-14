/**
 * translate-mario-bios.ts — Preenche contentPt (do EN) e contentJpEn (do JP) das bios do Mario.
 * Traduções feitas manualmente (alta qualidade). NÃO altera curationStatus.
 */
import { db } from "../../lib/db";

const T: Record<string, { pt: string; jpEn: string }> = {
  SSB64: {
    pt: "Embora seja mais conhecido como o encanador bigodudo que enfrenta a Tribo das Tartarugas com seu característico pulo, esse herói mundialmente famoso também já atuou como árbitro, piloto e até médico! Há anos ele é associado à Princesa Peach do Reino dos Cogumelos, mas até hoje a verdadeira relação entre os dois permanece um mistério.",
    jpEn: "A world-famous, mustachioed gentleman. With his signature jumps and prized moves, he fought spectacularly against Bowser's army. He has known Princess Peach of the Mushroom Kingdom for a long time, though just how close they are remains a mystery. Originally a plumber, he has since tried his hand at all sorts of jobs—building demolition, tennis referee, driver, doctor, and more.",
  },
  SSBM: {
    pt: "Conhecido no mundo todo como o Sr. Nintendo, Mario usa sua incrível habilidade de pulo para frustrar o maligno Bowser vez após vez. Embora seja mais famoso como herói, Mario já desempenhou muitos papéis, incluindo piloto, médico, golfista e vilão. Seus gostos mudaram ao longo de mais de 20 anos de games; há muito tempo ele trocou as cores da camisa e do macacão.",
    jpEn: "The world-famous Mr. Nintendo. Armed with powerful jumping ability and drive, he takes on Bowser. An adventurer at heart, he nonetheless holds a variety of hobbies and occupations—golfer, racer, demolition worker, doctor, even villain. He's around 26 years old. Long ago, the colors of his overalls and shirt used to be the other way around.",
  },
  SSBB: {
    pt: "Uma figura familiar de macacão que é o personagem símbolo da Nintendo. Sua coragem e habilidade de pulo o levaram através de incontáveis aventuras. É um encanador multitalentoso com conhecimentos de médico, um golfista de primeira e um veterano árbitro de tênis. Será que sua destreza nos pulos é uma herança dos tempos em que subia vigas de aço?",
    jpEn: "The character who represents Nintendo, instantly recognizable in his overalls. Blessed with both courage and initiative, he has pulled through countless adventures. Alongside his work as a plumber, he has a doctor's knowledge, considerable skill at golf, and even serves as a tennis referee—a truly multitalented individual. Is his remarkable jumping ability a gift from his girder-climbing days?",
  },
  SSB4: {
    pt: "Ícone entre os ícones, essa celebridade dos games é conhecida por salvar o mundo de Bowser. Tem habilidades incríveis de pulo e recorre a uma enorme variedade de transformações. No tempo livre, pratica mais esportes do que se pode contar. Em Smash Bros., é um lutador equilibrado em quem você pode confiar. Diga comigo: \"It's-a me, Mario!\"",
    jpEn: "An icon of the gaming world, battling Bowser in his familiar overalls. He has more talents than you could ever list—extraordinary jumping power, transformations that swap between all kinds of techniques, all-around sports mastery, and more. In Smash Bros., he's an all-rounder with a counter for every opponent's style of attack. If you can't decide which fighter to use, you can't go wrong picking Mario.",
  },
};

async function main() {
  const f = await db.fighter.findFirst({ where: { name: "Mario" }, include: { bios: true } });
  if (!f) { console.log("Mario não encontrado"); return; }
  let n = 0;
  for (const [era, t] of Object.entries(T)) {
    const bio = f.bios.find(b => b.smashGameVersion === era);
    if (!bio) { console.log(`⚠ bio ${era} não existe`); continue; }
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: t.pt, contentJpEn: t.jpEn } });
    console.log(`✅ ${era}: PT ${t.pt.length} + JpEn ${t.jpEn.length}`);
    n++;
  }
  console.log(`\nTraduções gravadas: ${n}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
