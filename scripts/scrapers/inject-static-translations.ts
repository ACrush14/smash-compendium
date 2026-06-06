import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const jpEnData: Record<string, string> = {
  curator: `Ness, hailing from the idyllic town of Onett in Eagleland, is the very embodiment of an unexpected hero. The life of this ordinary-looking boy completely changed on the day a meteorite crashed into the mountain behind his house, and an alien visitor revealed the destiny that awaited him. Believing in the ultimate power of wisdom, courage, and friendship, this young hero sets off on an adventure to defeat the evil Giygas. Participating since the original 1999 *Super Smash Bros.* as the representative of *MOTHER2 Giygas Strikes Back*, Ness is one of the early fighters who built the foundation of the series.\n\nIn Smash, his greatest weapon is his mental power. Ness masters "PSI" energy in various forms. "PK Flash" is a projectile whose power grows the longer it is charged; "PK Fire" is a psychic flame that continuously burns the opponent upon hitting; and "PK Thunder" is lightning whose trajectory can be manipulated. By crashing PK Thunder into himself, he turns into a powerful human missile, functioning as a charging attack that deals immense damage as well as a recovery move. "PSI Magnet" can absorb energy-based projectiles and recover damage. Besides psychic powers, he also excels in physical offense and defense; the forward smash attack using his bat boasts tremendous power when hit at the tip, and can also strike back projectiles. Also, the up and down smash attacks using his yo-yo cover a wide range. Compensating for his somewhat modest movement speed with a unique midair jump, he has built a solid position as a fighter combining mental pressure, comeback potential, and extraordinary recovery capabilities.`,
  bio_SSB64: "The seemingly ordinary boy 'Ness' living in the town of Onett takes a step on the path of adventure from the day a meteorite fell on the mountain behind his house. Being able to use the mysterious power = 'PSI', he grows through various encounters. Regarding his personality, it was never deeply discussed in the game, and there are many unknown points.",
  bio_SSBU: "A boy who fights by making full use of his psychic power 'PSI', a bat, and a yo-yo. The recovery move 'PK Thunder Tackle', where he crashes the projectile 'PK Thunder' into himself and rams the opponent with that momentum, is super powerful!",
  tip_1: "Ness's first appearance was in 'MOTHER2 Giygas Strikes Back', released in 1994. He looks like an ordinary boy, but he can use psychic powers. The eldest son of a family of four.",
  tip_2: "The protagonist of 'MOTHER2'. You could decide his name and the name of his exclusive PSI. Entrusted with the fate of the world by a messenger from the future, he stands up to stop the plan of the invader Giygas.",
  tip_3: "In 'MOTHER2 Giygas Strikes Back', Ness occasionally gets homesick and becomes unable to fight properly. He recovers by going home or calling his mother on the phone.",
  tip_4: "Ness has a younger sister named Tracy. She works part-time at Escargo Express, answering phone calls when depositing or delivering items.",
  tip_5: "The PK Fire and PK Thunder that Ness uses are PSI he couldn't use in the original game. In the original 'MOTHER2 Giygas Strikes Back', his companion Paula used them.",
  trophy_ssbm_1: "A boy who uses the power of the heart, 'PSI'. Ness, who lived as an ordinary boy in the suburbs of Onett, sets out on a journey triggered by the incident of a meteorite falling on the mountain behind his house. Experiencing various encounters and partings, in the final stages, he fought through even to the point of discarding his own body.",
  trophy_ssb4_1: "A boy living in Onett, a small town in Eagleland. He looks like an ordinary boy but can use psychic powers. In 'MOTHER2 Giygas Strikes Back', he sets out on a journey to stop Giygas. In 'Smash Bros.', he fights using PSI, a bat, and a yo-yo. PK Thunder's trajectory can be controlled. By hitting himself with it and ramming the opponent with that momentum, he can deal massive damage.",
  trophy_ssbb_1: "A boy who lived a very ordinary life. One day, when he went to see a meteorite that fell on the mountain behind his house, he was warned of a future crisis by an alien he met, and he sets out on a journey. He can use the power of the heart 'PSI', and simultaneously masters a bat and a yo-yo. He is a boy who works hard to defeat Giygas while overcoming homesickness.",
  trophy_ssb4_2: "Speaking of the tools Ness uses, it's the bat and the yo-yo. The bat is used in the forward smash attack and forward taunt. The smash attack's attack power increases when the position the bat hits the opponent is closer to the tip than the base. It's also possible to strike back by swinging to match a projectile. The yo-yo is used in the up and down smash attacks. Because the attack range is wide, it's a move that is easy to land on the opponent.",
  trophy_ssb4_3: "A powerful PSI usable by Poo, the prince of Dalaam, who adventures together in 'MOTHER2 Giygas Strikes Back'. It seems he learned it upon joining 'Smash Bros.'. When activated, countless shooting stars fall from the sky, and rivals hit by the stars take damage. By inputting the direction left or right, you can control the angle. While activated, Ness's body shines, becoming invincible.",
  trophy_ssbm_2: "Attacks using things other than his own hands and feet directly tend to be more powerful. 'PK Thunder' is a projectile that can be controlled after firing. Hitting himself with it sends him flying at high speed, useful for recovery. 'PSI Magnet' can absorb energy-based projectiles. If you see certain Pokémon, consider it a means of recovery.",
  trophy_ssbm_3: "Ness's own speed is modest overall. The smash attack's bat and yo-yo shine in strength and ease of use when used with smash hold. 'PK Flash' is weak at first, but grows steadily larger and stronger as you continue to charge it. 'PK Fire' hits continuously if it hits the opponent deeply. Also effective for stopping them in their tracks."
};

const enPtData: Record<string, string> = {
  bio_SSB64: "Ness era um garoto aparentemente comum de Onett, mas na verdade, ele estava destinado a muito mais. Quando um estranho meteorito caiu perto de sua cidade natal, o garotinho com poderes psíquicos partiu para salvar o mundo. Pouco foi dito sobre o caráter de Ness, e muito permanece oculto.",
  bio_SSBU: "Ness é um lutador jogável em Super Smash Bros. Ultimate. Ele foi revelado junto com o colega de EarthBound, Lucas, e todos os outros veteranos anteriores em 12 de junho de 2018. Assim como no original Super Smash Bros., Brawl e for Nintendo 3DS, ele é desbloqueável, em vez de estar disponível desde o início. Ness é classificado como o Lutador #10.",
  tip_1: "Ness apareceu primeiro no título de SNES EarthBound, lançado na América do Norte em 1995. Ele pode parecer um garoto comum, mas pode usar uma variedade de poderes PSI. Ele também tem uma irmã mais nova.",
  tip_2: "Ness é o personagem principal de EarthBound. Nesse jogo, um mensageiro do futuro confia a ele o destino do mundo, e Ness sai para deter os planos malignos de um invasor chamado Giygas.",
  tip_3: "Em EarthBound, Ness ocasionalmente sente saudades de casa, o que o enfraquece em batalha. Isso pode ser curado indo para casa ou apenas ligando para sua mãe!",
  tip_4: "Ness tem uma irmãzinha chamada Tracy. Ela trabalha meio período no Escargo Express, atendendo às ligações de Ness quando ele precisa que itens sejam entregues.",
  tip_5: "Ness sempre teve uma variedade de poderes PSI, mas ele não podia realmente usar o PK Fire ou PK Thunder em EarthBound. Sua amiga Paula, no entanto, podia.",
  trophy_ssbm_1: "A mente de Ness é sua melhor arma. O PK Thunder é um ataque de míssil PSI que pode ser guiado usando o Control Stick, e se Ness atingir a si mesmo com ele, ele se transforma em um míssil vivo capaz de causar dano massivo. Esse movimento também pode ser usado para recuperação. O PSI Magnet transforma ataques de projéteis de energia em saúde; experimente com certos Pokémon para reabastecimento de estamina.",
  trophy_ssbb_1: "Um garoto comum cuja vida mudou quando ele encontrou um meteoro e um alienígena em uma montanha próxima. O alienígena o avisou de uma ameaça futura, e a aventura se seguiu. Ele pode usar a energia psíquica conhecida como PSI e também empunha um taco e um ioiô. Esse jovem corajoso dá tudo de si para derrotar o maligno Giygas.",
  trophy_ssb4_1: "Vindo de Onett, uma pequena cidade em Eagleland, esse jovem ostenta uma aparência comum que esconde seus poderes psíquicos. Ness lutou contra o maligno Giygas em EarthBound, e em Smash Bros. ele libera alguns dos mesmos movimentos PSI. Cuidado com o PK Thunder, um ataque guiado que também pode lançar Ness como um foguete!",
  trophy_ssb4_2: "Vindo de Onett em Eagleland, surge esse jovem garoto. Ele pode não parecer muita coisa, mas tem poderosas habilidades psíquicas, e elas são muito úteis em EarthBound. Elas também são úteis neste jogo. Você sabia que pode controlar o raio do PK Thunder dele? Aponte-o para o próprio Ness para mandá-lo voando, nocauteando completamente qualquer um em seu caminho!",
  trophy_ssb4_3: "Ness pode ter poderes psíquicos, mas isso não significa que ele evite entrar no confronto físico. O seu smash lateral desfere um soco real se você acertar os inimigos com a ponta de seu taco, e ele pode até refletir projéteis! Seus smashes para cima e para baixo também têm muito alcance, o que significa que quando você joga de Ness, é sempre fácil acertar os golpes em seus inimigos!",
  trophy_ssb4_4: "Ness pode ter poderes psíquicos, mas isso não significa que ele evite entrar no confronto físico. O seu smash lateral desfere um soco real se você acertar os inimigos com a ponta de seu taco, e ele pode até refletir projéteis! Seus smashes para cima e para baixo também têm muito alcance — tente dar um giro neles!",
  trophy_ssb4_5: "Ness pode ter poderes psíquicos, mas isso não significa que ele evite entrar no confronto físico. O seu smash lateral desfere um soco real se você acertar os inimigos com a ponta de seu taco, e ele pode até defletir projéteis! Seus smashes para cima e para baixo também têm muito alcance — Ness consegue acertar seus golpes com facilidade!",
  trophy_ssbm_2: "A chave para dominar Ness é controlar seu pulo singular no meio do ar, que compensa o que ele carece de velocidade. Seu ataque PK Flash pode parecer fraco à primeira vista, mas fica mais poderoso quanto mais você segurar o Botão B. Para causar muito dano com PK Fire, tente queimar seu oponente o maior número de vezes possível."
};

async function main() {
  const f = await db.fighter.findUnique({where: {name: "Ness"}, include: {bios: true, tips: true, collectibles: true}});
  if (!f) return;

  await db.fighter.update({
    where: { id: f.id },
    data: { curatorOverviewJpEn: jpEnData.curator }
  });

  for (const b of f.bios) {
    if (jpEnData["bio_"+b.smashGameVersion]) await db.fighterBio.update({where: {id: b.id}, data: {contentJpEn: jpEnData["bio_"+b.smashGameVersion]}});
    if (enPtData["bio_"+b.smashGameVersion]) await db.fighterBio.update({where: {id: b.id}, data: {contentPt: enPtData["bio_"+b.smashGameVersion]}});
  }

  for (let i = 0; i < f.tips.length; i++) {
    const tip = f.tips[i];
    if (!tip) continue;
    await db.fighterTip.update({
      where: {id: tip.id},
      data: {
        titleJpEn: jpEnData[`tip_${i+1}`]?.split('.')[0],
        textJpEn: jpEnData[`tip_${i+1}`]?.split('.').slice(1).join('.').trim(),
        titlePt: enPtData[`tip_${i+1}`]?.split('.')[0],
        textPt: enPtData[`tip_${i+1}`]?.split('.').slice(1).join('.').trim()
      }
    });
  }

  const jpEnCollIds = [
    {djpStart: "ココロのチカラ", jpEnKey: "trophy_ssbm_1"},
    {djpStart: "イーグルランドの小さな", jpEnKey: "trophy_ssb4_1"},
    {djpStart: "ごく普通に暮らしてた", jpEnKey: "trophy_ssbb_1"},
    {djpStart: "ネスが使用する道具と", jpEnKey: "trophy_ssb4_2"},
    {djpStart: "『MOTHER2 ギーグの逆襲』で共に", jpEnKey: "trophy_ssb4_3"},
    {djpStart: "自分の手足を直接使わない", jpEnKey: "trophy_ssbm_2"},
    {djpStart: "ネス自身の速度は全体", jpEnKey: "trophy_ssbm_3"}
  ];

  const enPtCollIds = [
    {denStart: "Ness's mind is his best weapon", ptKey: "trophy_ssbm_1"},
    {denStart: "An average boy whose life", ptKey: "trophy_ssbb_1"},
    {denStart: "Hailing from Onett, a small town in Eagleland, this young boy sports", ptKey: "trophy_ssb4_1"},
    {denStart: "From Onett in Eagleland", ptKey: "trophy_ssb4_2"},
    {denStart: "Ness may have psychic powers, but that doesn't mean he shies away from getting physical. His side smash packs a real punch if you hit enemies with the end of his bat, and it can even reflect projectiles! His up and down smashes also have a lot of range, meaning", ptKey: "trophy_ssb4_3"},
    {denStart: "Ness may have psychic powers, but that doesn't mean he shies away from getting physical. His side smash packs a real punch if you hit enemies with the end of his bat, and it can even deflect projectiles! His up and down smashes also have a lot of range—try giving", ptKey: "trophy_ssb4_4"},
    {denStart: "Ness may have psychic powers, but that doesn't mean he shies away from getting physical. His side smash packs a real punch if you hit enemies with the end of his bat, and it can even deflect projectiles! His up and down smashes also have a lot of range—Ness can", ptKey: "trophy_ssb4_5"},
    {denStart: "The key to mastering Ness is", ptKey: "trophy_ssbm_2"},
  ];

  for (const c of f.collectibles) {
    if (c.descriptionJp) {
      const match = jpEnCollIds.find(x => c.descriptionJp!.startsWith(x.djpStart));
      if (match) await db.collectible.update({where: {id: c.id}, data: {descriptionJpEn: jpEnData[match.jpEnKey]}});
    }
    if (c.descriptionEn) {
      const match = enPtCollIds.find(x => c.descriptionEn!.startsWith(x.denStart));
      if (match) await db.collectible.update({where: {id: c.id}, data: {descriptionPt: enPtData[match.ptKey]}});
    }
  }
  console.log("Translations injected manually!");
}
main().catch(console.error).finally(()=>db.$disconnect());
