import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "The \"Tiny Mouse Pokémon,\" National Pokédex No. 172. The pre-evolution of Pikachu. It differs from Pikachu in size, cheek color, and ear shape. It has enough electrical power to shock even an adult, but the drawback is that it shocks itself too. Its cheek electric pouches are small and it's bad at storing electricity, discharging immediately from even minor shocks like being startled — though it improves with growth. When thunderclouds form or the air is dry, electricity builds up more easily throughout its body. When playing with friends, their electricity can short together, sometimes producing sparks from the impact.",
    pt: "O \"Pokémon Camundongo Pequeno,\" No. 172 da Pokédex Nacional. A pré-evolução do Pikachu. Difere do Pikachu em tamanho, cor das bochechas e formato das orelhas. Tem poder elétrico suficiente para chocar até um adulto, mas a desvantagem é que também choca a si mesmo. Suas bolsas elétricas nas bochechas são pequenas e ele é ruim em armazenar eletricidade, descarregando imediatamente até com pequenos choques como ser assustado — embora melhore com o crescimento. Quando nuvens de trovão se formam ou o ar está seco, a eletricidade se acumula mais facilmente por todo o corpo. Ao brincar com amigos, a eletricidade deles pode entrar em curto-circuito, às vezes produzindo faíscas com o impacto.",
  },
  SSBM: {
    jpEn: "A Tiny Mouse Pokémon. Its big ears are its distinctive feature. This Pichu evolves into Pikachu. It's still bad at storing electricity. It discharges immediately from any kind of shock. Despite being small, it can unleash a shock strong enough to startle an adult. However, it startles itself too.",
    pt: "Um Pokémon Camundongo Pequeno. Suas grandes orelhas são sua característica distintiva. Este Pichu evolui para Pikachu. Ele ainda é ruim em armazenar eletricidade. Descarrega imediatamente com qualquer tipo de choque. Apesar de ser pequeno, pode liberar um choque forte o suficiente para assustar um adulto. Porém, também se assusta.",
  },
  SSBB: {
    jpEn: "A Tiny Mouse Pokémon. Because the electric pouches on its cheeks are still small, it cannot store electricity. It's said to sometimes test its courage with friends by touching the tips of their tails together and letting sparks fly. Electricity builds up more easily when the air is dry. When it levels up while sufficiently attached to its trainer, it evolves into Pikachu.",
    pt: "Um Pokémon Camundongo Pequeno. Como as bolsas elétricas em suas bochechas ainda são pequenas, ele não consegue armazenar eletricidade. Diz-se que às vezes testa sua coragem com amigos, tocando as pontas das caudas e deixando faíscas voarem. A eletricidade se acumula mais facilmente quando o ar está seco. Quando sobe de nível estando suficientemente apegado ao seu treinador, evolui para Pikachu.",
  },
  SSB4: {
    jpEn: "So that adorable Pikachu had a pre-evolution! People at the time were shocked — and deeply charmed — by this new Pokémon discovered by Professor Elm. Its youthful tendency to accidentally discharge electricity when startled, combined with its appearance, seems to stir up parental instincts in people. Touching the tips of tails together with friends to make sparks fly is apparently a game to test courage, but it's just plain adorable to watch.",
    pt: "Então aquele adorável Pikachu tinha uma pré-evolução! As pessoas da época ficaram chocadas — e profundamente encantadas — por este novo Pokémon descoberto pelo Professor Carvalho. Sua tendência juvenil de descarregar eletricidade acidentalmente quando assustado, combinada com sua aparência, parece despertar instintos parentais nas pessoas. Tocar as pontas das caudas com amigos para fazer faíscas voarem é aparentemente um jogo para testar a coragem, mas é simplesmente adorável de assistir.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "Its nimbleness is hard to pin down. Also, Quick Attack has become Agility, drastically improving its usability and travel distance. However, using electric moves shocks itself, increasing the damage it takes. It's light and easy to launch. Given its severe handicaps, it's for advanced players only. B: Thunder Jolt, Side+B: Skull Bash",
    pt: "Sua agilidade é difícil de acompanhar. Além disso, o Quick Attack se tornou Agility, melhorando drasticamente sua usabilidade e distância percorrida. Porém, usar golpes elétricos o choca, aumentando o dano que sofre. É leve e fácil de arremessar. Dadas suas severas desvantagens, é apenas para jogadores avançados. B: Thunder Jolt, Lateral+B: Skull Bash",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "It's the lightest of all the characters. Its lack of attack power is also top-tier. That being the case, the best approach is to run around focusing on grabbing items to find a chance at victory. Agility deals 1 damage for a single warp, but 4 damage for two warps, so it's better to keep the number of warps low when possible. Up+B: Agility, Down+B: Thunder",
    pt: "É o mais leve entre todos os personagens. Sua falta de poder de ataque também é de nível máximo. Sendo assim, a melhor abordagem é correr por aí focando em pegar itens para encontrar uma chance de vitória. O Agility causa 1 de dano em um único teleporte, mas 4 de dano em dois teleportes, então é melhor manter o número de teleportes baixo quando possível. Cima+B: Agility, Baixo+B: Thunder",
  },
];

async function main() {
  const pichu = await db.fighter.findFirst({
    where: { name: "Pichu" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
    },
  });
  if (!pichu) { console.log("Pichu not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: pichu.id },
    data: {
      curatorOverviewEn: "Pichu, the pre-evolution of Pikachu, is Smash's ultimate high-risk gamble — every electric move it uses damages itself as much as the opponent, and its featherweight body makes it the single lightest fighter in the game. In exchange, it retains all of Pikachu's speed and combo tools with an even faster Agility recovery. Success with Pichu means playing perfectly, since it has almost no room for error.",
      curatorOverviewPt: "Pichu, a pré-evolução do Pikachu, é a aposta de maior risco do Smash — cada golpe elétrico que usa causa dano nele mesmo tanto quanto no adversário, e seu corpo leve como pena o torna o lutador mais leve do jogo. Em troca, ele mantém toda a velocidade e as ferramentas de combo do Pikachu, com uma recuperação Agility ainda mais rápida. O sucesso com o Pichu significa jogar perfeitamente, já que ele tem quase nenhuma margem para erro.",
      curatorOverviewJp: "ピカチュウの進化前であるピチューは、スマブラで最もハイリスクなファイター――使用するあらゆる電気ワザは相手だけでなく自分自身にもダメージを与え、羽根のように軽い体はゲーム中で最も軽いファイターにしている。その代償として、ピカチュウのスピードとコンボ性能をすべて引き継ぎ、こうそくいどうによる復帰はさらに速い。ピチューで勝つにはミスの許されない、完璧なプレイが求められる。",
      curatorOverviewJpEn: "Pichu, the pre-evolution of Pikachu, is Smash's highest-risk fighter — every electric move it uses damages itself as much as the opponent, and its feather-light body makes it the lightest fighter in the game. In exchange, it inherits all of Pikachu's speed and combo potential, with an even faster Agility recovery. Winning with Pichu demands flawless, error-free play.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 4 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = pichu.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix Bio SSBM video: 4933-4967 -> 2897-2913 (48:17-48:33 ZoomZike VLC confirmed)
  const bioSsbm = pichu.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 2897, videoEndSec: 2913 } });
    console.log("✅ Bio SSBM video: 4933-4967 -> 2897-2913 (48:17-48:33)");
  }

  // Fix Trophy "Pichu" SSBM to match
  const trophy = await db.collectible.findFirst({ where: { name: "Pichu", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (trophy) {
    await db.collectible.update({ where: { id: trophy.id }, data: { videoStartSec: 2897, videoEndSec: 2913 } });
    console.log(`✅ Trophy Pichu SSBM: ${trophy.videoStartSec}-${trophy.videoEndSec} -> 2897-2913`);
  }

  // SSB4 Trophy "Pichu" already has correct 3DS timing (4120-4130) in videoStartSec2/videoEndSec2.
  // No WiiU trophy exists for Pichu -- confirmed by user. Component logic (FighterDataZone.tsx)
  // was updated to render 3DS-only video when primary videoStartSec is null. No DB change needed here.
  console.log("ℹ️  SSB4 Trophy Pichu: 3DS timing (4120-4130) já correto no banco; component atualizado para renderizar vídeo 3DS-only");

  // Moves EN+PT+JpEn
  for (const m of pichu.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  console.log("\n⚠️  PENDENTE: 9 tips SSBU (Pichu's Origins, In Its Series, Thunder Jolt, Skull Bash, Agility, Thunder, Volt Tackle, Damage from Electricity, The Three Lightest Fighters) -- aguardando texto JP oficial correto do usuário (o texto colado foi do Dr. Mario)");

  await db.$disconnect();
}
main().catch(console.error);
