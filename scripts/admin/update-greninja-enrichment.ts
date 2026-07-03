import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "A Water/Dark-type Ninja Pokémon. It has speed like a ninja, and the shuriken it creates itself can cut through metal. It's the final evolution of the Pokémon \"Froakie.\" In Super Smash Bros. too, it's a fighter characterized by nimble movements and ninja-like moves that use water. Its \"Hydro Pump,\" which lets it rise on a jet of water, can change to a free angle once partway through — making it valuable for recovery.",
    pt: "Este Pokémon do tipo Água/Sombrio é a forma evoluída final de Froakie. É tão rápido e perigoso quanto qualquer outro ninja, e os shurikens que consegue criar com água conseguem cortar metal. Em Smash Bros., além de ser um lutador ágil e veloz, também pode usar golpes como Hydro Pump, que o deixam viajar pelo ar e evitar cair.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Greninja's Origins", titleJp: "ゲッコウガの初登場作品", textJp: "ゲッコウガの初登場作品は、２０１３年発売の『ポケットモンスター X・Y』。ゲコガシラから進化し、忍術が得意。首に巻いているのは舌である。", titleJpEn: "Greninja's Debut Work", textJpEn: "Greninja's debut work is 2013's \"Pokémon X and Y.\" It evolves from Frogadier and excels at ninjutsu. What's wrapped around its neck is actually its tongue.", titlePt: "As Origens do Greninja", textPt: "O trabalho de estreia do Greninja é \"Pokémon X e Y\", lançado em 2013. Ele evolui de Frogadier e é habilidoso em ninjutsu. O que está enrolado em seu pescoço é, na verdade, sua língua." },
  { titleEn: "[★☆☆] In Its Series", titleJp: "原作では", textJp: "原作では「まきびし」や「かげぶんしん」など、忍者のような技を使う、しのびポケモン。水を圧縮して使う「みずしゅりけん」は、当初ゲッコウガの専用技だった。", titleJpEn: "In the Original Games", textJpEn: "In the original games, it's a Ninja Pokémon that uses ninja-like moves such as Spikes and Double Team. Water Shuriken, which uses compressed water, was originally an exclusive move for Greninja.", titlePt: "Na Série Original", textPt: "Nos jogos originais, é um Pokémon Ninja que usa golpes como Ferrão e Distração. Shuriken de Água, que usa água comprimida, era originalmente um golpe exclusivo do Greninja." },
  { titleEn: "[★★☆] Water Shuriken (Neutral Special)", titleJp: "みずしゅりけん 【通常必殺ワザ】", textJp: "長くためるほど射程距離が短くなっていく。射程の長いため無しの攻撃は、けん制に使うなど、状況や用途に応じて使い分けることができる。", titleJpEn: "Water Shuriken (Neutral Special)", textJpEn: "The longer it's charged, the shorter its range becomes. The uncharged version, with its longer range, can be used for keeping foes in check — switch between them depending on the situation and purpose.", titlePt: "Water Shuriken (Especial Neutro)", textPt: "Quanto mais tempo for carregado, mais curto o alcance se torna. A versão descarregada, com alcance maior, pode ser usada para conter adversários — alterne entre elas de acordo com a situação e o propósito." },
  { titleEn: "[★☆☆] Shadow Sneak (Side Special)", titleJp: "かげうち 【横必殺ワザ】", textJp: "ゲッコウガが影の位置へ瞬間移動し、近くの相手を攻撃する。ボタンを長押しすることで影の位置が離れて行き、より遠くへ移動できる。", titleJpEn: "Shadow Sneak (Side Special)", textJpEn: "Greninja instantly teleports to the shadow's location and attacks nearby opponents. Holding the button down makes the shadow move farther away, allowing Greninja to travel a greater distance.", titlePt: "Shadow Sneak (Especial Lateral)", textPt: "O Greninja se teleporta instantaneamente para a posição da sombra e ataca adversários próximos. Segurar o botão faz a sombra se afastar mais, permitindo que o Greninja percorra uma distância maior." },
  { titleEn: "[★☆☆] Hydro Pump (Up Special)", titleJp: "ハイドロポンプ 【上必殺ワザ】", textJp: "水流を出しながら、入力した方向にむかって移動する。また、１回だけ移動する方向を変えられる。", titleJpEn: "Hydro Pump (Up Special)", textJpEn: "Releases a jet of water while moving in the input direction. It can also change direction once during the move.", titlePt: "Hydro Pump (Especial Cima)", textPt: "Libera um jato de água enquanto se move na direção inputada. Também é possível mudar de direção uma vez durante o movimento." },
  { titleEn: "[★★☆] Hydro Pump's Flow (Up Special)", titleJp: "ハイドロポンプの水流 【上必殺ワザ】", textJp: "手から出している水流には攻撃力がある。うまく当てれば相手を押し出すこともできる。", titleJpEn: "Hydro Pump's Water Flow (Up Special)", textJpEn: "The jet of water coming from its hands has attack power. Landing it well can even push opponents away.", titlePt: "O Fluxo do Hydro Pump (Especial Cima)", textPt: "O jato de água que sai das mãos tem poder de ataque. Acertá-lo bem pode até empurrar os adversários para longe." },
  { titleEn: "[★★☆] Substitute (Down Special)", titleJp: "みがわり 【下必殺ワザ】", textJp: "攻撃されると、丸太や人形を「みがわり」にして姿を消し、離れた場所から出現して攻撃する。", titleJpEn: "Substitute (Down Special)", textJpEn: "When hit, it disappears by using a log or a doll as a \"substitute,\" then reappears from a distant spot and attacks.", titlePt: "Substitute (Especial Baixo)", textPt: "Ao ser atingido, ele desaparece usando um tronco ou um boneco como \"substituto\", reaparecendo de um local distante para atacar." },
  { titleEn: "[★★★] Substitute (Down Special)", titleJp: "みがわりの反撃 【下必殺ワザ】", textJp: "カウンター成功時に方向を入力すれば、一度姿を消した後に入力した方向に向かって反撃することができる。", titleJpEn: "Substitute's Counterattack (Down Special)", textJpEn: "If a direction is input when the counter succeeds, after briefly disappearing it can counterattack in the direction that was input.", titlePt: "O Contra-ataque do Substitute (Especial Baixo)", textPt: "Se uma direção for inputada quando o contra-ataque tem sucesso, após desaparecer brevemente ele pode revidar na direção inputada." },
  { titleEn: "[★☆☆] Secret Ninja Attack (Final Smash)", titleJp: "しのびのひおうぎ 【最後の切りふだ】", textJp: "きずなへんげで姿を変えたゲッコウガがくり出す、最後の切りふだ。たたみがえしを当てた相手を、月をバックに鋭く斬りつけ、叩きつける。", titleJpEn: "Secret Ninja Attack (Final Smash)", textJpEn: "The Final Smash unleashed by Greninja after transforming with Bond Phenomenon. An opponent hit by the Mat Block is slashed sharply and slammed down, with the moon in the background.", titlePt: "Secret Ninja Attack (Final Smash)", textPt: "O Final Smash desencadeado pelo Greninja após se transformar com o Fenômeno de Vínculo. Um adversário atingido pelo Mat Block é cortado com precisão e arremessado para baixo, com a lua ao fundo." },
  { titleEn: "[★☆☆] Down Taunt", titleJp: "下アピール", textJp: "両手を使った水芸を披露してくれる、下アピール。当たったファイターを少しだけ浮かせ、ダメージを与える。", titleJpEn: "Down Taunt", textJpEn: "A down taunt in which it performs a water trick using both hands. Fighters hit by it float slightly and take damage.", titlePt: "Provocação Baixo", textPt: "Uma provocação baixo na qual ele realiza um truque com água usando as duas mãos. Lutadores atingidos flutuam um pouco e recebem dano." },
];

async function main() {
  const greninja = await db.fighter.findFirst({
    where: { name: "Greninja" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!greninja) { console.log("Greninja not found"); return; }

  await db.fighter.update({
    where: { id: greninja.id },
    data: {
      curatorOverviewEn: "Greninja, the Ninja Pokémon from Pokémon X and Y, is one of the fastest and most technical fighters in the roster. Its combo game revolves around quick aerials and Shadow Sneak repositioning, while Water Shuriken lets it control neutral from a distance — charge it fully for maximum damage, or fire it uncharged as a quick projectile to keep foes at bay. Substitute punishes overcommitment with a teleporting counter, and Hydro Pump gives it one of the best recoveries in the game thanks to its mid-air redirect. The tradeoff is fragility: Greninja is light and dies early off strong hits, demanding a hit-and-run playstyle that never lets an opponent land a clean read.",
      curatorOverviewPt: "Greninja, o Pokémon Ninja de Pokémon X e Y, é um dos lutadores mais rápidos e técnicos do elenco. Seu jogo de combos gira em torno de ataques aéreos rápidos e reposicionamento com Shadow Sneak, enquanto o Water Shuriken permite controlar o neutro à distância — carregue-o totalmente para dano máximo, ou dispare-o descarregado como um projétil rápido para manter os adversários afastados. Substitute pune excessos de confiança com um contra-ataque teleportador, e Hydro Pump dá a ele uma das melhores recuperações do jogo graças ao redirecionamento no meio do ar. A contrapartida é a fragilidade: Greninja é leve e morre cedo com golpes fortes, exigindo um estilo de jogo de ataque-e-fuga que nunca deixa o adversário acertar uma leitura limpa.",
      curatorOverviewJp: "『ポケットモンスター X・Y』のしのびポケモン、ゲッコウガは、ロスター屈指の速さとテクニカルさを誇るファイターだ。素早い空中攻撃と「かげうち」による位置取りを軸としたコンボゲームが持ち味で、「みずしゅりけん」は中距離での主導権を握る手段となる――フルチャージで最大威力を狙うもよし、無チャージで素早い牽制として使うもよし。「みがわり」は無理な攻めを瞬間移動カウンターで罰し、「ハイドロポンプ」は空中で方向転換できるおかげでゲーム屈指の復帰力を誇る。その代償は脆さだ――ゲッコウガは軽量級で強力な一撃で早期に撃墜されるため、相手に的確な読みを許さないヒットアンドアウェイの立ち回りが求められる。",
      curatorOverviewJpEn: "Greninja, the Ninja Pokémon from Pokémon X and Y, boasts speed and technical depth among the best in the roster. Its combo game centers on quick aerial attacks and repositioning with Shadow Sneak, while Water Shuriken serves as a tool for controlling the midrange — fully charged for maximum power, or uncharged as a quick deterrent. Substitute punishes reckless aggression with a teleporting counter, and Hydro Pump grants one of the game's best recoveries thanks to its mid-air redirect. The price is fragility — as a lightweight, Greninja falls early to strong hits, demanding a hit-and-run approach that never lets opponents land a clean read.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = greninja.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = greninja.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"Substitute\" is a Down Special that swaps places with a log in a split second to block an opponent's attack. When hit, Greninja instantly teleports to a distant spot and launches a surprise counterattack. The spot where Greninja reappears can be adjusted up, down, left, right, or diagonally. It should prove to be a counterattack that's hard for opponents to read. Note that a stand-in doll can also appear in place of the log. (3DS) Pokémon X/Y (2013/10)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Substitute\" é um golpe especial baixo que troca de lugar com um tronco em uma fração de segundo para bloquear o ataque de um adversário. Ao ser atingido, o Greninja se teleporta instantaneamente para um local distante e lança um contra-ataque surpresa. O local onde o Greninja reaparece pode ser ajustado para cima, baixo, esquerda, direita ou na diagonal. Deve se provar um contra-ataque difícil de ler para os adversários. Note que um boneco substituto também pode aparecer no lugar do tronco. (3DS) Pokémon X/Y (2013/10)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = greninja.tips.find(t => t.titleEn === data.titleEn);
    if (!tip) { console.log(`  ⚠️  Tip não encontrada: "${data.titleEn}"`); continue; }
    await db.fighterTip.update({
      where: { id: tip.id },
      data: {
        titleJp: data.titleJp, textJp: data.textJp,
        titleJpEn: data.titleJpEn, textJpEn: data.textJpEn,
        titlePt: data.titlePt, textPt: data.textPt,
      },
    });
    updated++;
  }
  console.log(`✅ ${updated}/${TIPS.length} tips atualizadas`);

  // Video fix (usuário via VLC): 3DS 56:13-56:24 = 3373-3384 | WiiU 1:04:12-1:04:23 = 3852-3863
  const main = await db.collectible.findFirst({ where: { fighter: { name: "Greninja" }, type: "TROPHY", name: "Greninja", smashGameVersion: "SSB4" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (main) {
    await db.collectible.update({ where: { id: main.id }, data: { videoStartSec: 3852, videoEndSec: 3863, videoStartSec2: 3373, videoEndSec2: 3384 } });
    console.log(`✅ Trophy "Greninja" [SSB4]: vídeo corrigido WiiU 3852-3863 | 3DS 3373-3384 (era ${main.videoStartSec}-${main.videoEndSec})`);
  }

  // Alt costume trophy: primary WiiU timing already plausible, only the corrupted 3DS videoEndSec2 needs fixing
  const alt = await db.collectible.findFirst({ where: { fighter: { name: "Greninja" }, type: "TROPHY", name: "Greninja (Alt.)", smashGameVersion: "SSB4" }, select: { id: true, videoStartSec2: true, videoEndSec2: true } });
  if (alt && alt.videoStartSec2 != null) {
    await db.collectible.update({ where: { id: alt.id }, data: { videoEndSec2: alt.videoStartSec2 + 11 } });
    console.log(`✅ Trophy "Greninja (Alt.)" [SSB4]: videoEndSec2 corrigido para ${alt.videoStartSec2 + 11} (era ${alt.videoEndSec2}, corrompido)`);
  }

  await db.$disconnect();
}
main().catch(console.error);
