/**
 * translate-mario-moves.ts — Preenche descEn/descPt/descJpEn dos FighterMove do Mario.
 * Traduções curadas (do JP autoritativo). NÃO altera curationStatus.
 */
import { db } from "../../lib/db";

type Tr = { en: string; pt: string; jpEn: string };
// chave: `${era}#${order}`
const T: Record<string, Tr> = {
  "SSBM#0": {
    en: "Since Smash Bros. takes place in a world of imagination, the characters are portrayed in greater depth here. Mario has no real weaknesses and is even equipped with a meteor attack. As the baseline fighter of Smash Bros., he puts a player's skill to the test directly. His Super Cape flips enemies around and reflects projectiles.",
    pt: "Como 'Smash Bros.' se passa em um mundo de imaginação, os personagens são retratados com mais profundidade aqui. Mario não tem fraquezas reais e conta até com um ataque meteoro. Por ser o lutador-base de 'Smash Bros.', ele põe à prova diretamente a habilidade do jogador. Sua Supercapa inverte a direção dos inimigos e rebate projéteis.",
    jpEn: "Since Smash Bros. takes place in a world of imagination, the characters are portrayed in greater depth here. Mario has no real weaknesses and is even equipped with a meteor attack. As the baseline fighter of Smash Bros., he puts a player's skill to the test directly. His Super Cape flips enemies around and reflects projectiles.",
  },
  "SSBM#1": {
    en: "Mario's weight is set as the standard among all characters, making him ideal for gauging how light (i.e., easy to launch) a character is and how much launching power they have. His Super Jump Punch is a multi-hit move that rises while scattering coins. The Mario Tornado sweeps up enemies and blows them away.",
    pt: "O peso de Mario é o padrão entre todos os personagens, o que o torna ideal para medir o quão leve (= fácil de lançar) um personagem é e sua força de nocaute. Seu Soco com Supersalto é um golpe de múltiplos acertos que sobe espalhando moedas. O Tornado do Mario suga os inimigos e os arremessa.",
    jpEn: "Mario's weight is set as the standard among all characters, making him ideal for gauging how light (i.e., easy to launch) a character is and how much launching power they have. His Super Jump Punch is a multi-hit move that rises while scattering coins. The Mario Tornado sweeps up enemies and blows them away.",
  },
  "SSBB#0": {
    en: "Mario's Final Smash, unleashed once he grabs a Smash Ball. He launches two dragon-like streams of flame from both hands, dealing heavy damage to opponents across the field. Because the flames spread vertically as they travel, activating it at the stage's edge from an elevated spot deals damage most effectively. His blazing eyes are surely a sign of the determination he pours into this one strike.",
    pt: "O Final Smash de Mario, liberado quando ele pega uma Smash Ball. Ele lança das duas mãos duas torrentes de fogo em forma de dragão, causando grande dano aos oponentes pelo cenário. Como as chamas se espalham para cima e para baixo enquanto avançam, ativá-lo na borda do cenário e de um ponto elevado causa dano com mais eficácia. Seus olhos em chamas devem ser a prova da determinação que ele põe nesse único golpe.",
    jpEn: "Mario's Final Smash, unleashed once he grabs a Smash Ball. He launches two dragon-like streams of flame from both hands, dealing heavy damage to opponents across the field. Because the flames spread vertically as they travel, activating it at the stage's edge from an elevated spot deals damage most effectively. His blazing eyes are surely a sign of the determination he pours into this one strike.",
  },
  "SSB4#0": {
    en: "Super Jump Punch is an up special that leaps high into the air, knocking opponents upward with an uppercut. Right after using it, Mario is briefly invincible. Used point-blank on the ground, it lands all of its hits. The side special Super Cape flips around any opponent it hits — use it on a foe trying to recover from off-stage and you can even stop their recovery.",
    pt: "O Soco com Supersalto é um especial para cima que salta bem alto, lançando o oponente para o ar com um gancho. Logo após usá-lo, Mario fica brevemente invencível. Usado colado ao oponente no chão, acerta todos os golpes. O especial lateral Supercapa inverte o oponente atingido — use contra quem tenta voltar de fora do cenário e é possível até impedir a recuperação.",
    jpEn: "Super Jump Punch is an up special that leaps high into the air, knocking opponents upward with an uppercut. Right after using it, Mario is briefly invincible. Used point-blank on the ground, it lands all of its hits. The side special Super Cape flips around any opponent it hits — use it on a foe trying to recover from off-stage and you can even stop their recovery.",
  },
  "SSB4#1": {
    en: "Mario's Final Smash, usable once you obtain a Smash Ball. He fires a pair of dragon-like flames horizontally. The two flames spread in a spiral, so their wide range makes it easy to catch opponents. Beyond damage, you can also count on their power to push foes off-screen. Firing from a high platform or after a jump makes the most of the flames' vertical spread.",
    pt: "O Final Smash de Mario, ativável ao obter uma Smash Ball. Ele dispara um par de chamas em forma de dragão na horizontal. As duas chamas se espalham em espiral, e seu amplo alcance facilita pegar os oponentes. Além do dano, dá para contar com a força delas para empurrar os inimigos para fora da tela. Disparar de uma plataforma alta ou depois de um pulo aproveita melhor a abertura vertical das chamas.",
    jpEn: "Mario's Final Smash, usable once you obtain a Smash Ball. He fires a pair of dragon-like flames horizontally. The two flames spread in a spiral, so their wide range makes it easy to catch opponents. Beyond damage, you can also count on their power to push foes off-screen. Firing from a high platform or after a jump makes the most of the flames' vertical spread.",
  },
};

async function main() {
  const f = await db.fighter.findFirst({ where: { name: "Mario" }, include: { moves: true } });
  if (!f) { console.log("Mario não encontrado"); return; }
  let n = 0;
  for (const mv of f.moves) {
    const key = `${mv.smashGameVersion}#${mv.order}`;
    const t = T[key];
    if (!t) { console.log(`⚠ sem tradução para ${key}`); continue; }
    await db.fighterMove.update({ where: { id: mv.id }, data: { descEn: t.en, descPt: t.pt, descJpEn: t.jpEn } });
    console.log(`✅ ${key} (${mv.label})`);
    n++;
  }
  console.log(`\nMovimentos traduzidos: ${n}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
