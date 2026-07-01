import { db } from "../../lib/db";

async function main() {
  // ===== FOX =====
  const fox = await db.fighter.findFirst({
    where: { name: "Fox" },
    select: { moves: { select: { id: true, smashGameVersion: true, label: true, descJp: true } } },
  });
  const foxMove = fox?.moves.find(m => m.smashGameVersion === "SSB4" && m.label === "EX");
  if (foxMove) {
    const text = "Somersault Kick is Fox's Up Smash attack, notable for having especially high knockback power among his moves. It's great to use against airborne opponents when going for a KO. His special move, Fire Fox, is a dashing attack cloaked in flame — inputting a direction lets him dash in any of 360 degrees. Landing all its hits at point-blank range deals massive damage. (SFC) Star Fox (1993/02) (N64) Star Fox 64 (1997/04)";
    await db.fighterMove.update({
      where: { id: foxMove.id },
      data: {
        descEn: text,
        descJpEn: text,
        descPt: "Somersault Kick é o Up Smash do Fox, notável por ter um poder de arremesso especialmente alto entre seus golpes. É ótimo para usar contra adversários no ar quando busca um KO. Seu golpe especial, Fire Fox, é um ataque de avanço envolto em chamas — inputar uma direção permite avançar em qualquer um dos 360 graus. Acertar todos os golpes à queima-roupa causa dano massivo. (SFC) Star Fox (1993/02) (N64) Star Fox 64 (1997/04)",
      },
    });
    console.log("✅ Fox [SSB4] EX: EN+PT+JpEn adicionados");
  }

  // ===== PIKACHU =====
  const pikachu = await db.fighter.findFirst({
    where: { name: "Pikachu" },
    select: {
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, label: true, order: true, descJp: true } },
    },
  });
  if (!pikachu) { console.log("Pikachu not found"); return; }

  const bioData: Record<string, { pt: string; jpEn: string }> = {
    SSBU: {
      pt: "Pikachu (ピカチュウ, Pikachu) é um personagem jogável em Super Smash Bros. Ultimate. Inicialmente sugerido no trailer de anúncio do então sem nome Ultimate, foi confirmado em 12 de junho de 2018, junto com todos os outros veteranos. Pikachu é classificado como Lutador #08.",
      jpEn: "Regarding Pikachu as a fighter, see respectively: \"Pikachu (64),\" \"Pikachu (DX),\" \"Pikachu (X),\" \"Pikachu (3DS/Wii U),\" and \"Pikachu (SP).\"",
    },
    SSBB: {
      pt: "Um Pokémon Rato. Sua cauda em formato de raio e bochechas redondas são suas marcas registradas. Quando o perigo se aproxima, ele usa pequenas bolsas elétricas dentro das bochechas para descarregar eletricidade. Quando está realmente animado, ele libera eletricidade sobre seus rivais. Diz-se que ele recarrega enquanto dorme. Evolui para Raichu.",
      jpEn: "A Mouse Pokémon. Its jagged tail and perfectly round cheeks are its trademarks. When danger draws near, it uses the small electric pouches on the underside of its cheeks to discharge electricity. When it discharges with everything it's got, its power rivals that of lightning. It's said to recharge while sleeping. Using a Thunder Stone, it evolves into Raichu.",
    },
    SSB4: {
      pt: "Reconhecido no mundo todo, Pikachu é um Pokémon do tipo Elétrico que armazena energia nas bochechas para usar em batalha. Em Smash Bros., Pikachu é um lutador versátil com ataques elétricos rápidos e poderosos. O Quick Attack pode ser usado duas vezes seguidas se duas direções forem inputadas, uma após a outra.",
      jpEn: "An Electric-type Mouse Pokémon that uses Thunder Jolt and Thunder. An iconic Pokémon and a worldwide fan favorite, it stores electricity in its cheeks. In Smash Bros., it's an all-rounder with nimble speed and powerful electric attacks. Quick Attack can be used once more by inputting an additional direction, making it convenient for recovery.",
    },
  };
  for (const [version, data] of Object.entries(bioData)) {
    const bio = pikachu.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Pikachu Bio [${version}]: PT+JpEn adicionados`);
  }

  const smashMove0 = pikachu.moves.find(m => m.smashGameVersion === "SSBM" && m.order === 0);
  if (smashMove0) {
    const text = "Its electrically-charged strikes are destructive, but in practice, running around and looking for openings is the more effective approach. Its movement is quick. Thunder Jolt is a projectile that crawls along the ground. Skull Bash doubles in power when the button is held to charge it. When an opponent starts charging theirs, try to get above them. B: Thunder Jolt, Side+B: Skull Bash";
    await db.fighterMove.update({
      where: { id: smashMove0.id },
      data: {
        descEn: text, descJpEn: text,
        descPt: "Seus golpes carregados de eletricidade são destrutivos, mas na prática, correr por aí procurando aberturas é a abordagem mais eficaz. Seu movimento é rápido. Thunder Jolt é um projétil que rasteja pelo chão. Skull Bash dobra de poder quando o botão é segurado para carregá-lo. Quando um adversário começa a carregar o dele, tente ficar acima dele. B: Thunder Jolt, Lateral+B: Skull Bash",
      },
    });
    console.log("✅ Pikachu [SSBM] SMASH (order 0): EN+PT+JpEn adicionados");
  }

  const smashMove1 = pikachu.moves.find(m => m.smashGameVersion === "SSBM" && m.order === 1);
  if (smashMove1) {
    const text = "Quick Attack moves at high speed in whichever direction the stick indicates. It can also attack opponents along the way. Additionally, changing the stick angle mid-movement lets you change direction and unleash a second dash. Thunder can be used creatively for a variety of attacks. Watch out for ceilings. Up+B: Quick Attack, Down+B: Thunder";
    await db.fighterMove.update({
      where: { id: smashMove1.id },
      data: {
        descEn: text, descJpEn: text,
        descPt: "Quick Attack se move em alta velocidade na direção indicada pelo analógico. Também pode atacar adversários pelo caminho. Além disso, mudar o ângulo do analógico durante o movimento permite mudar de direção e disparar um segundo avanço. Thunder pode ser usado de forma criativa para vários tipos de ataque. Cuidado com tetos. Cima+B: Quick Attack, Baixo+B: Thunder",
      },
    });
    console.log("✅ Pikachu [SSBM] SMASH (order 1): EN+PT+JpEn adicionados");
  }

  const ssb4Move = pikachu.moves.find(m => m.smashGameVersion === "SSB4" && m.label === "EX");
  if (ssb4Move) {
    const text = "Thunder Jolt fires an electric orb diagonally downward. It travels along the ground as electricity, gradually weakening in power over time. If it hits while still airborne as a projectile, it deals higher damage and knockback. Thunder is a Down Special that summons a storm cloud overhead to strike down lightning. The instant the bolt hits Pikachu, it becomes briefly invincible and unleashes powerful electricity around itself. (GB) Pocket Monsters Red & Green (1996/02) (GB) Pocket Monsters Pikachu (1998/09)";
    await db.fighterMove.update({
      where: { id: ssb4Move.id },
      data: {
        descEn: text, descJpEn: text,
        descPt: "Thunder Jolt dispara uma esfera elétrica na diagonal para baixo. Ela viaja pelo chão como eletricidade, enfraquecendo gradualmente com o tempo. Se acertar ainda no ar como projétil, causa mais dano e poder de arremesso. Thunder é um Especial Baixo que invoca uma nuvem de tempestade acima para atingir com um raio. No instante em que o raio atinge o Pikachu, ele fica brevemente invencível e libera eletricidade poderosa ao seu redor. (GB) Pocket Monsters Red & Green (1996/02) (GB) Pocket Monsters Pikachu (1998/09)",
      },
    });
    console.log("✅ Pikachu [SSB4] EX: EN+PT+JpEn adicionados");
  }

  await db.$disconnect();
}
main().catch(console.error);
