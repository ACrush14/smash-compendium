import { db } from "../../lib/db";
async function main() {
  const t = await db.music.findFirst({ where: { title: "Trophy Gallery" }, select: { id: true, title: true, youtubeId: true } });
  console.log(JSON.stringify(t));
}
main().then(() => process.exit(0));
