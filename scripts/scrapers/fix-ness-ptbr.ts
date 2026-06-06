import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const ptTranslations: Record<string, string> = {
  "TROPHY-SSB4-Ness-Ness": "Vindo de Onett, uma pequena cidade de Eagleland, este jovem de aparência comum esconde grandes poderes psíquicos. Ness lutou contra o maligno Giygas em EarthBound, e em Smash Bros. ele usa alguns dos mesmos movimentos PSI. Cuidado com o PK Thunder, um ataque guiado que também pode lançar Ness como um foguete!",
  "STICKER-SSBB-Ness-Ness": "Efeito: Ataque +33",
  "SPRITE-Ness-origin": "Sprite de Ness dentro do jogo EarthBound, que serviu de base para a sua aparência no Super Smash Bros. original.",
  "TROPHY-SSBM-Ness-Ness": "Ness é um jovem menino que dominou o poder psíquico conhecido como PSI. Ness vivia uma vida normal nos subúrbios de Onett até que um meteoro caiu em uma montanha próxima e o lançou em uma aventura selvagem. Acreditando nos poderes supremos da sabedoria, coragem e amizade, Ness prova que alguns heróis vêm em pequenos pacotes."
};

const curatorEn = `Hailing from Onett, a peaceful town in Eagleland, Ness is the epitome of the unlikely hero: an ordinary-looking boy whose life was transformed when a meteor crashed into the mountain near his house and an alien visitor revealed the destiny that awaited him. Armed by the conviction in the ultimate powers of wisdom, courage, and friendship, this young man set off on a journey to defeat the evil Giygas — proving that the greatest heroes can come in the smallest packages. A veteran representative of the EarthBound franchise since the first Super Smash Bros. in 1999, Ness is one of the founding characters of the series' very concept.\n\nIn the arena, his main weapon is his mind. Ness masters PSI energy in multiple forms: PK Flash, a projectile that grows in power while charged; PK Fire, a psychic flame capable of burning opponents in succession; and PK Thunder, a player-guided lightning bolt that, when redirected against Ness himself, converts him into a devastating human missile — serving as both an attack and a recovery move. PSI Magnet absorbs energy projectiles and converts them into health. Beyond his psychic powers, Ness does not shy away from physical confrontation: his charged bat delivers a long-reaching forward smash capable of reflecting projectiles, and his vertical yo-yo smashes cover a wide radius. His unique mid-air jump compensates for his moderate speed, consolidating a fighter profile that merges mental pressure, comeback potential, and extraordinary recovery power.`;

const curatorPt = `Originário de Onett, uma pacata cidade de Eagleland, Ness é o epítome do herói improvável: um menino de aparência comum cuja vida foi transformada quando um meteoro colidiu com a montanha próxima à sua casa e um visitante alienígena lhe revelou o destino que o aguardava. Armado pela convicção nos poderes supremos da sabedoria, da coragem e da amizade, este jovem partiu em jornada para derrotar o maligno Giygas — provando que os maiores heróis podem surgir nas menores embalagens. Representante veterano da franquia EarthBound desde o primeiro Super Smash Bros. de 1999, Ness é um dos personagens fundadores do próprio conceito da série.\n\nNa arena, sua principal arma é a mente. Ness domina a energia PSI em múltiplas formas: o PK Flash, projétil que cresce em potência enquanto carregado; o PK Fire, chama psíquica capaz de queimar oponentes em sucessão; e o PK Thunder, raio guiado pelo jogador que, ao ser redirecionado contra o próprio Ness, o converte em um míssil humano de impacto devastador — servindo tanto de ataque quanto de recuperação. O PSI Magnet absorve projéteis de energia e os converte em saúde. Para além dos poderes psíquicos, Ness não recusa o confronto físico: o bastão que carrega executa um smash lateral de grande alcance nas pontas com capacidade de deflexão de projéteis, e seus smashes verticais cobrem amplo raio. O salto aéreo singular compensa sua velocidade moderada, consolidando um perfil de lutador que une pressão mental, reversão de situação e poder de recuperação extraordinário.`;

async function main() {
  const f = await db.fighter.findUnique({where: {name: "Ness"}, include: {collectibles: true}});
  if (!f) return;

  await db.fighter.update({
    where: { id: f.id },
    data: {
      curatorOverviewEn: curatorEn,
      curatorOverviewPt: curatorPt,
    }
  });

  for (const c of f.collectibles) {
    if (ptTranslations[c.id]) {
      await db.collectible.update({
        where: { id: c.id },
        data: { descriptionPt: ptTranslations[c.id] }
      });
      console.log(`Updated collectible ${c.id}`);
    }
  }

  console.log("Fix complete.");
}
main().catch(console.error).finally(()=>db.$disconnect());
