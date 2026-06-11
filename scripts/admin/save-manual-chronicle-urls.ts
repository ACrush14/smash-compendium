/**
 * save-manual-chronicle-urls.ts
 * Salva manualmente as URLs registradas pelo usuário nas screenshots.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/admin/save-manual-chronicle-urls.ts
 */

import { db } from "@/lib/db";

const ENTRIES = [
  // Wii JP EXCLUSIVE
  {
    titleJp: "スーパーマリオギャラクシー",
    wikiUrl:  "https://ja.wikipedia.org/wiki/スーパーマリオギャラクシー",
    boxArtUrl: "https://m.media-amazon.com/images/I/918a0egesqL.jpg",
  },
  {
    titleJp: "マリオ＆ソニック AT 北京(べきん)オリンピック",
    wikiUrl:  "https://www.nintendo.co.jp/wii/rwsj/index.html",
    boxArtUrl: "https://item-shopping.c.yimg.jp/i/j/netoff_0010538117",
  },
  {
    titleJp: "ゼルダの伝説(でんせつ) トワイライトプリンセス",
    wikiUrl:  "https://ja.wikipedia.org/wiki/ゼルダの伝説_トワイライトプリンセス",
    boxArtUrl: "https://www.famitsu.com/images/000/242/701/y_61a4e4a034c42.jpg",
  },
  {
    titleJp: "アイシールド21 フィールド最強(さいきょう)の戦士(せんし)たち",
    wikiUrl:  "https://www.nintendo.co.jp/wii/rs7j/index.html",
    boxArtUrl: "https://m.media-amazon.com/images/I/61QjJ95EnDL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    titleJp: "はじめてのWii",
    wikiUrl:  "https://ja.wikipedia.org/wiki/はじめてのWii",
    boxArtUrl: "https://tshop.r10s.jp/book/cabinet/4902/4902370515619.jpg?fitin=560:400&composite-to=*,*|560:400",
  },
  {
    titleJp: "ポケモンバトルレボリューション",
    wikiUrl:  "https://ja.wikipedia.org/wiki/ポケモンバトルレボリューション",
    boxArtUrl: "https://eccdn.geo-online.co.jp/ec_media_images/5083001-01.jpg",
  },
  {
    titleJp: "ファイアーエムブレム 暁(あかつき)の女神(めがみ)",
    wikiUrl:  "https://ja.wikipedia.org/wiki/ファイアーエムブレム_暁の女神",
    boxArtUrl: "https://item-shopping.c.yimg.jp/i/n/mediaworld-plus_10420030001",
  },
  // Xbox 360
  {
    titleNtsc: "Banjo-Kazooie: Nuts & Bolts",
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%90%E3%83%B3%E3%82%B8%E3%83%A7%E3%83%BC%E3%81%A8%E3%82%AB%E3%82%BA%E3%83%BC%E3%82%A4%E3%81%AE%E5%A4%A7%E5%86%92%E9%99%BA_%E3%82%AC%E3%83%AC%E3%83%BC%E3%82%B8%E5%A4%A7%E4%BD%9C%E6%88%A6",
    boxArtUrl: "https://m.media-amazon.com/images/I/71epYbFo6nL._AC_UF1000,1000_QL80_.jpg",
  },
];

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  save-manual-chronicle-urls                          ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  let saved = 0, notFound = 0;

  for (const entry of ENTRIES) {
    const where = "titleJp" in entry
      ? { titleJp: entry.titleJp }
      : { titleNtsc: (entry as any).titleNtsc };

    const label = ("titleJp" in entry ? entry.titleJp : (entry as any).titleNtsc) ?? "";

    const found = await db.chronicleEntry.findFirst({ where });

    if (!found) {
      console.log(`❌ NÃO ENCONTRADO: ${label}`);
      notFound++;
      continue;
    }

    await db.chronicleEntry.update({
      where: { id: found.id },
      data: {
        wikiUrl:   entry.wikiUrl   ?? undefined,
        boxArtUrl: entry.boxArtUrl ?? undefined,
      },
    });

    console.log(`✅ ${label.slice(0, 50)}`);
    saved++;
  }

  console.log(`\n══════════════════`);
  console.log(`✅ Salvos:       ${saved}`);
  console.log(`❌ Não achados:  ${notFound}`);
}

main()
  .catch(e => { console.error("Erro:", e); process.exit(1); })
  .finally(() => db.$disconnect());
