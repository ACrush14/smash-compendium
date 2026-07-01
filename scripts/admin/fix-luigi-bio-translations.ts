import { db } from "../../lib/db";

// Tradução manual (Gemini quota esgotada) — PT + JpEn para bios SSB4/SSBB/SSBM/SSBU

const TRANSLATIONS: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    pt: "Luigi recentemente celebrou seu 30º aniversário com o Ano de Luigi, mas toda aquela atenção só o deixou ainda mais tímido e desajeitado. Em Smash Bros., Luigi se inspira bastante no estilo de luta do irmão, dando um toque especial a golpes como o Super Jump Punch. Suas provocações, porém, são verdadeiramente únicas.",
    jpEn: "After his 30th birthday brought the \"Year of Luigi,\" Mario's twin brother gained a bit more presence (maybe?). Still, his reserved and timid personality hasn't changed a bit. In Smash Bros., many of his attacks resemble Mario's. His Super Jump Punch, when landed clean at close range, unleashes tremendous power with a satisfying sound. His comical taunts are also a must-see.",
  },
  SSBB: {
    pt: "O irmão gêmeo mais novo do Mario. Ele é tímido e quieto e ofuscado por seu irmão, mas na verdade é bastante talentoso. Sua habilidade de pulo supera a do Mario, e suas habilidades versáteis o permitem superar qualquer problema. Ele é um pouco covarde e tem muito medo de fantasmas. Mesmo assim, em Luigi's Mansion, ele foi encarregado de limpar uma casa inteira cheia de espíritos.",
    jpEn: "Mario's twin younger brother. Due to his shy and reserved personality, he tends to be overshadowed by Mario, but he's actually quite skilled. His jumping ability surpasses Mario's, and he's an all-rounder who can handle just about anything with ease. He's a bit cowardly and terrible with ghosts. Yet in Luigi's Mansion, where he took the lead role, he ends up having to go hunt ghosts anyway. Mario Bros.",
  },
  SSBM: {
    pt: "Embora o irmão mais novo do Mario sempre tenha ficado em segundo plano, Luigi finalmente conquistou os holofotes com seu próprio jogo, Luigi's Mansion. As coisas estão melhorando para o eterno coadjuvante; ele até ganhou seu próprio rival em Waluigi. O dia em que ele será chamado de \"máquina verde, magra e implacável\" pode não estar tão longe.\nMario Bros. (Arcade 1983)",
    jpEn: "Mario's younger brother. Though often called the \"eternal second banana,\" he brilliantly takes the lead role in Luigi's Mansion. In recent years, a rival named Waluigi has also appeared. His achievements have been so remarkable that it doesn't feel far-fetched to imagine a day when he'll be called the \"green fan favorite.\"",
  },
  SSBU: {
    pt: "Luigi (ルイージ, Luigi) é um personagem jogável em Super Smash Bros. Ultimate. Ele foi confirmado junto com Yoshi e o restante dos veteranos em 12 de junho de 2018 durante a E3 2018, sendo ele e Yoshi os últimos dois veteranos revelados. Como em suas aparições anteriores a Super Smash Bros. 4, ele é desbloqueável, em vez de estar disponível desde o início. Luigi é classificado como Lutador #09.",
    jpEn: "Regarding Luigi as a fighter, see respectively: \"Luigi (64),\" \"Luigi (DX),\" \"Luigi (X),\" \"Luigi (3DS/Wii U),\" and \"Luigi (SP).\"",
  },
};

async function main() {
  const luigi = await db.fighter.findFirst({
    where: { name: "Luigi" },
    select: { bios: { select: { id: true, smashGameVersion: true, contentPt: true } } },
  });
  if (!luigi) { console.log("Luigi not found"); return; }

  for (const [version, data] of Object.entries(TRANSLATIONS)) {
    const bio = luigi.bios.find(b => b.smashGameVersion === version);
    if (!bio) { console.log(`  ⚠️  Bio ${version} não encontrada`); continue; }
    if (bio.contentPt) { console.log(`  ⏭️  Bio ${version} já tem PT`); continue; }
    await db.fighterBio.update({
      where: { id: bio.id },
      data: { contentPt: data.pt, contentJpEn: data.jpEn },
    });
    console.log(`  ✅ Bio ${version}: PT + JpEn adicionados`);
  }

  await db.$disconnect();
}
main().catch(console.error);
