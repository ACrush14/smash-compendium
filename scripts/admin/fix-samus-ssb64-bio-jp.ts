import { db } from "../../lib/db";

async function main() {
  const bio = await db.fighterBio.findFirst({
    where: { fighter: { name: "Samus" }, smashGameVersion: "SSB64" },
    select: { id: true },
  });
  if (!bio) { console.log("Bio SSB64 da Samus não encontrada"); return; }

  await db.fighterBio.update({
    where: { id: bio.id },
    data: {
      contentJp: `フルネームは、サムスアラン。宇宙きってのバウンティ・ハンターである。鳥人族のテクノロジーを秘めたパワードスーツを身にまとい、アクロバティックなアクションを颯爽とこなす。ターゲットの「浮遊生命体・メトロイド」とは因縁めいた関係をもつ。ちなみに女性である。`,
      contentJpEn: `Her full name is Samus Aran. The greatest bounty hunter in the galaxy. She wears a Power Suit imbued with Chozo technology, performing acrobatic feats with effortless grace. She shares a fateful bond with her target, the floating life form known as Metroid. By the way — she is female.`,
    },
  });

  console.log("✅ SSB64 bio JP/JpEn da Samus atualizado");
  await db.$disconnect();
}
main().catch(console.error);
