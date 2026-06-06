import { db } from "../lib/db";
import { Prisma } from "@prisma/client";

const CUSTOM_GAMES: Partial<Prisma.ChronicleEntryCreateInput>[] = [
  // PlayStation 1
  { consoleName: "PlayStation 1", titleNtsc: "Metal Gear Solid", titleJp: "メタルギアソリッド", releaseDateNtsc: "1998/10/21", releaseDateJp: "1998/09/03" },
  { consoleName: "PlayStation 1", titleNtsc: "Final Fantasy VII", titleJp: "ファイナルファンタジーVII", releaseDateNtsc: "1997/09/07", releaseDateJp: "1997/01/31" },
  { consoleName: "PlayStation 1", titleNtsc: "Tekken", titleJp: "鉄拳", releaseDateNtsc: "1995/11/08", releaseDateJp: "1995/03/31" },
  
  // PlayStation 2
  { consoleName: "PlayStation 2", titleNtsc: "Metal Gear Solid 2: Sons of Liberty", titleJp: "メタルギアソリッド2", releaseDateNtsc: "2001/11/13", releaseDateJp: "2001/11/29" },
  { consoleName: "PlayStation 2", titleNtsc: "Kingdom Hearts", titleJp: "キングダム ハーツ", releaseDateNtsc: "2002/09/17", releaseDateJp: "2002/03/28" },
  { consoleName: "PlayStation 2", titleNtsc: "Dragon Quest VIII: Journey of the Cursed King", titleJp: "ドラゴンクエストVIII 空と海と大地と呪われし姫君", releaseDateNtsc: "2005/11/15", releaseDateJp: "2004/11/27" },
  
  // PlayStation 3
  { consoleName: "PlayStation 3", titleNtsc: "Metal Gear Solid 4: Guns of the Patriots", titleJp: "メタルギアソリッド4", releaseDateNtsc: "2008/06/12", releaseDateJp: "2008/06/12" },
  { consoleName: "PlayStation 3", titleNtsc: "Persona 5", titleJp: "ペルソナ5", releaseDateNtsc: "2017/04/04", releaseDateJp: "2016/09/15" },
  
  // PlayStation 4
  { consoleName: "PlayStation 4", titleNtsc: "Kingdom Hearts III", titleJp: "キングダム ハーツIII", releaseDateNtsc: "2019/01/29", releaseDateJp: "2019/01/25" },
  { consoleName: "PlayStation 4", titleNtsc: "Persona 5 Royal", titleJp: "ペルソナ5 ザ・ロイヤル", releaseDateNtsc: "2020/03/31", releaseDateJp: "2019/10/31" },
  
  // Xbox 360
  { consoleName: "Xbox 360", titleNtsc: "Banjo-Kazooie: Nuts & Bolts", titleJp: "バンジョーとカズーイの大冒険 ガレージ大作戦", releaseDateNtsc: "2008/11/11", releaseDateJp: "2008/12/11" },
  
  // Wii U
  { consoleName: "Wii U", titleNtsc: "Splatoon", titleJp: "スプラトゥーン", releaseDateNtsc: "2015/05/29", releaseDateJp: "2015/05/28" },
  { consoleName: "Wii U", titleNtsc: "Bayonetta 2", titleJp: "ベヨネッタ2", releaseDateNtsc: "2014/10/24", releaseDateJp: "2014/09/20" },
  
  // Nintendo Switch
  { consoleName: "Nintendo Switch", titleNtsc: "ARMS", titleJp: "アームズ", releaseDateNtsc: "2017/06/16", releaseDateJp: "2017/06/16" },
  { consoleName: "Nintendo Switch", titleNtsc: "Splatoon 2", titleJp: "スプラトゥーン2", releaseDateNtsc: "2017/07/21", releaseDateJp: "2017/07/21" },
  { consoleName: "Nintendo Switch", titleNtsc: "Super Mario Odyssey", titleJp: "スーパーマリオ オデッセイ", releaseDateNtsc: "2017/10/27", releaseDateJp: "2017/10/27" },
  { consoleName: "Nintendo Switch", titleNtsc: "The Legend of Zelda: Breath of the Wild", titleJp: "ゼルダの伝説 ブレス オブ ザ ワイルド", releaseDateNtsc: "2017/03/03", releaseDateJp: "2017/03/03" },
  { consoleName: "Nintendo Switch", titleNtsc: "Super Smash Bros. Ultimate", titleJp: "大乱闘スマッシュブラザーズ SPECIAL", releaseDateNtsc: "2018/12/07", releaseDateJp: "2018/12/07" },
  { consoleName: "Nintendo Switch", titleNtsc: "Xenoblade Chronicles 2", titleJp: "ゼノブレイド2", releaseDateNtsc: "2017/12/01", releaseDateJp: "2017/12/01" },
  { consoleName: "Nintendo Switch", titleNtsc: "Fire Emblem: Three Houses", titleJp: "ファイアーエムブレム 風花雪月", releaseDateNtsc: "2019/07/26", releaseDateJp: "2019/07/26" },
];

async function run() {
  console.log("Seeding custom chronicle games...");
  for (const game of CUSTOM_GAMES) {
    const exists = await db.chronicleEntry.findFirst({
      where: { consoleName: game.consoleName, titleNtsc: game.titleNtsc }
    });
    
    if (!exists) {
      await db.chronicleEntry.create({
        data: game as Prisma.ChronicleEntryCreateInput
      });
      console.log(`Inserted: ${game.titleNtsc} (${game.consoleName})`);
    } else {
      console.log(`Skipped: ${game.titleNtsc} (already exists)`);
    }
  }
  console.log("Done seeding custom games.");
}

run();
