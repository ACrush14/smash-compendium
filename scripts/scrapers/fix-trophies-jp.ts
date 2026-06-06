import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function fix() {
  // Melee
  await db.collectible.updateMany({
    where: { name: "Ness's Classic Mode trophy in Melee" },
    data: {
      nameJp: "ネス",
      descriptionJp: "ココロのチカラ\"PSI\"を使う少年。オネットの郊外でふつうの少年としてくらしていたネスは、裏山にいん石が落ちた事件をきっかけに旅立つ。さまざまな出会いとさまざまな別れを経験し、終盤では、自分のカラダを捨ててまで戦いぬいた。"
    }
  });

  await db.collectible.updateMany({
    where: { name: "Ness's Adventure Mode trophy in Melee" },
    data: {
      nameJp: "ネス(SMASH)",
      descriptionJp: "ネス自身の速度は全体的にひかえめ。スマッシュ攻撃のバット、ヨーヨーは、スマッシュホールドで使うと強さ、使いやすさがひきたつ。\"PKフラッシュ\"は、最初は弱々しいが、ため続けるとぐんぐん大きく、強くなる。\"PKファイヤー\"は、相手に深くあてると連続ヒットする。足止めにも有効。"
    }
  });

  await db.collectible.updateMany({
    where: { name: "Ness's All-Star Mode trophy in Melee" },
    data: {
      nameJp: "ネス(SMASH)_2",
      descriptionJp: "自分の手足を直接使わない攻撃のほうが強力ぎみ。\"PKサンダー\"は、発射後操作できる飛び道具。自分に当てると高速でふっとび、復帰に役立つ。\"サイマグネット\"は、エネルギー系の飛び道具を吸収することができる。一部のポケモンを見たら、回復の手だてと思おう。"
    }
  });

  // Brawl
  await db.collectible.updateMany({
    where: { name: "Ness's trophy in Brawl" },
    data: {
      nameJp: "ネス",
      descriptionJp: "ごく普通に暮らしてた少年。ある日、裏山に落ちたいん石を見に行った際に出会う宇宙人から未来の危機を告げられ、旅に出ることになる。ココロのチカラ\"PSI\"を使うことができ、同時にバットやヨーヨーも使いこなす。ホームシックを克服しながらギーグを倒すために頑張る少年である。"
    }
  });
  
  await db.collectible.updateMany({
    where: { name: "Ness's Final Smash trophy in Brawl" },
    data: {
      nameJp: "PKスターストーム",
      descriptionJp: "天から無数の星を落下させて相手を攻撃する最後の切りふだ。フィールドにいる相手全員にダメージを与えることができる。無傷で回避するのは難しい。実際に『MOTHER』シリーズに登場するが、習得するのはネスではなく仲間のプー。『スマブラX』に参戦するにあたって、ネスがプーから授かったのかもしれない。"
    }
  });

  // Smash 4
  await db.collectible.updateMany({
    where: { name: "Ness's trophy in Super Smash Bros. for Wii U" },
    data: {
      nameJp: "ネス",
      descriptionJp: "イーグルランドの小さな町オネットに住む少年。見た目はごく普通の少年だが超能力を使える。『MOTHER2 ギーグの逆襲』の中でギーグを止めるため、旅に出る。『スマブラ』では、PSIやバット、ヨーヨーを使って戦う。PKサンダーは軌道を操作できる。自分に当てて、その勢いで相手に体当たりすると大ダメージを与えられる。"
    }
  });
  
  await db.collectible.updateMany({
    where: { name: "Ness's trophy in Super Smash Bros. for Nintendo 3DS" },
    data: {
      nameJp: "ネス",
      descriptionJp: "イーグルランドの小さな町オネットに住む少年。見た目はごく普通の少年だが超能力を使える。『MOTHER2 ギーグの逆襲』の中でギーグを止めるため、旅に出る。『スマブラ』では、PSIやバット、ヨーヨーを使って戦う。PKサンダーは軌道を操作できる。自分に当てて、その勢いで相手に体当たりすると大ダメージを与えられる。"
    }
  });

  await db.collectible.updateMany({
    where: { name: "Ness (Alt.)'s trophy in Super Smash Bros. for Wii U" },
    data: {
      nameJp: "ネス(EX)",
      descriptionJp: "ネスが使用する道具といえば、バットとヨーヨー。バットは、横スマッシュ攻撃と横アピールで使う。スマッシュ攻撃は相手に当てたバットの位置が、根本より先端に近い方が攻撃力がアップする。飛び道具に合わせて振ると打ち返すことも可能。ヨーヨーは、上下のスマッシュ攻撃で使用する。攻撃範囲が広いため、相手に当てやすいワザだ。"
    }
  });

  await db.collectible.updateMany({
    where: { name: "Ness (Alt.)'s trophy in Super Smash Bros. for Nintendo 3DS" },
    data: {
      nameJp: "ネス(EX)",
      descriptionJp: "ネスが使用する道具といえば、バットとヨーヨー。バットは、横スマッシュ攻撃と横アピールで使う。スマッシュ攻撃は相手に当てたバットの位置が、根本より先端に近い方が攻撃力がアップする。飛び道具に合わせて振ると打ち返すことも可能。ヨーヨーは、上下のスマッシュ攻撃で使用する。攻撃範囲が広いため、相手に当てやすいワザだ。"
    }
  });

  console.log("✅ Fixed all trophy Japanese texts!");
}

fix().catch(console.error).finally(() => db.$disconnect());
