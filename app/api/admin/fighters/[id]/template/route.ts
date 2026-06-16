import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseFighterTemplate } from "@/lib/template-parser";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json() as { text?: string; data?: any };
  if (!body.text && !body.data) return NextResponse.json({ error: "Text or Data is required" }, { status: 400 });

  const data = body.data || parseFighterTemplate(body.text!);

  // 1. Bios (SSB64)
  if (data.n64BiosEn || data.n64BiosJp) {
    await db.fighterBio.upsert({
      where: { fighterId_smashGameVersion: { fighterId: id, smashGameVersion: "SSB64" } },
      create: {
        fighterId: id,
        smashGameVersion: "SSB64",
        contentEn: data.n64BiosEn || "",
        contentJp: data.n64BiosJp || null,
      },
      update: {
        ...(data.n64BiosEn ? { contentEn: data.n64BiosEn } : {}),
        ...(data.n64BiosJp ? { contentJp: data.n64BiosJp } : {}),
      }
    });
  }

  // 2. Ultimate Fan Description (Overview EN)
  if (data.ultimateFanEn) {
    await db.fighter.update({
      where: { id },
      data: { curatorOverviewEn: data.ultimateFanEn }
    });
  }

  // Helper for Collectibles
  const upsertCollectible = async (
    ver: string, type: string, nameEn: string,
    descEn?: string, descJp?: string
  ) => {
    if (!descEn && !descJp) return;
    
    // Check if exists for this fighter, version and type
    // Since we don't have a strict name if we just want to update the first one...
    // Let's create a deterministic ID: "TROPHY-{VER}-{FighterId}-{NameEn}"
    const safeName = nameEn.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
    const collId = `${type}-${ver}-${id}-${safeName}`;

    await db.collectible.upsert({
      where: { id: collId },
      create: {
        id: collId,
        fighterId: id,
        smashGameVersion: ver,
        type: type,
        name: nameEn,
        description: descEn || null,
        descriptionJp: descJp || null,
      },
      update: {
        ...(descEn ? { description: descEn } : {}),
        ...(descJp ? { descriptionJp: descJp } : {}),
      }
    });
  };

  // 3. Melee Trophies
  await upsertCollectible("SSBM", "TROPHY", "Classic", data.meleeTrophyEn, data.meleeTrophyJp);
  await upsertCollectible("SSBM", "TROPHY", "Smash 1", data.meleeSmash1En, data.meleeSmash1Jp);
  await upsertCollectible("SSBM", "TROPHY", "Smash 2", data.meleeSmash2En, data.meleeSmash2Jp);

  // 4. Brawl Trophies
  await upsertCollectible("SSBB", "TROPHY", "Classic", data.brawlTrophyEn, data.brawlTrophyJp);
  await upsertCollectible("SSBB", "TROPHY", "Final Smash", data.brawlAltEn, data.brawlAltJp);

  // 5. Smash 4 Trophies
  await upsertCollectible("SSB4", "TROPHY", "Classic", data.smash4TrophyEn, data.smash4TrophyJp);
  await upsertCollectible("SSB4", "TROPHY", "Alt", data.smash4AltEn, data.smash4AltJp);

  // 6. Ultimate Tips
  const processTips = async (tipsEnText?: string, tipsJpText?: string) => {
    // Process EN Tips First
    if (tipsEnText) {
      const tipLines = tipsEnText.split("\n").map(l => l.trim()).filter(Boolean);
      for (const line of tipLines) {
        const match = line.match(/^(\([★☆]{3}\))\s*(.*?)[:–-]\s*(.*)$/);
        if (match) {
          const title = `${match[1]} ${match[2]}`.trim();
          const content = (match[3] || "").trim();
          
          const existing = await db.fighterTip.findFirst({ where: { fighterId: id, titleEn: title } });
          if (existing) {
            await db.fighterTip.update({ where: { id: existing.id }, data: { textEn: content } });
          } else {
            await db.fighterTip.create({ data: { fighterId: id, titleEn: title, textEn: content } });
          }
        }
      }
    }

    // Process JP Tips via Heuristic and match by index
    if (tipsJpText) {
      const allTips = await db.fighterTip.findMany({
        where: { fighterId: id },
        orderBy: { id: 'asc' }
      });

      const lines = tipsJpText.split("\n").map(l => l.trim()).filter(Boolean);
      const parsedJpTips: { title: string, content: string }[] = [];
      let currentTitle = "";
      let currentContent: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        if (!currentTitle) {
          currentTitle = line;
          continue;
        }

        const lastLine = currentContent.length > 0 ? currentContent[currentContent.length - 1] : "";
        if (lastLine && (lastLine.endsWith('。') || lastLine.endsWith('！') || lastLine.endsWith('？') || lastLine.endsWith('」'))) {
          if (!line.endsWith('。') && !line.endsWith('、') && !line.endsWith('」')) {
            // New title found
            parsedJpTips.push({ title: currentTitle, content: currentContent.join('\n') });
            currentTitle = line;
            currentContent = [];
            continue;
          }
        }
        currentContent.push(line);
      }
      if (currentTitle) {
        parsedJpTips.push({ title: currentTitle, content: currentContent.join('\n') });
      }

      for (let i = 0; i < parsedJpTips.length; i++) {
        const jpTip = parsedJpTips[i];
        if (!jpTip) continue;
        const existingTip = allTips[i];
        if (existingTip) {
          await db.fighterTip.update({
            where: { id: existingTip.id },
            data: { titleJp: jpTip.title, textJp: jpTip.content }
          });
        } else {
          await db.fighterTip.create({
            data: {
              fighterId: id,
              titleEn: `[JP Only] ${jpTip.title}`,
              textEn: "",
              titleJp: jpTip.title,
              textJp: jpTip.content
            }
          });
        }
      }
    }
  };

  await processTips(data.ultimateTipsEn, data.ultimateTipsJp);

  return NextResponse.json({ success: true, parsed: data });
}
