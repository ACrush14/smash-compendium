import { db } from "@/lib/db";
import { Metadata } from "next";
import MusicBrowser, { type MusicTrack } from "./MusicBrowser";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Músicas",
  description: "Trilha sonora completa do Super Smash Bros. Ultimate — 1076 faixas com arranjos originais.",
};

export default async function MusicPage() {
  const raw = await db.music.findMany({
    orderBy: [{ franchise: { name: "asc" } }, { title: "asc" }],
    include: { franchise: { select: { name: true, svgIconUrl: true } } },
  });

  const tracks: MusicTrack[] = raw.map(m => ({
    id:              m.id,
    title:           m.title,
    arranger:        m.arranger      ?? null,
    duration:        m.duration      ?? null,
    sourceGame:      m.sourceGame    ?? null,
    compositionType: m.compositionType ?? null,
    youtubeId:       m.youtubeId     ?? null,
    isRemix:         m.isRemix,
    franchiseName:   m.franchise.name,
    franchiseIcon:   m.franchise.svgIconUrl ?? null,
  }));

  return <MusicBrowser tracks={tracks} />;
}
