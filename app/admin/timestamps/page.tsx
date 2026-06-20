import { db } from '@/lib/db';
import TimestampEditor from './TimestampEditor';

export const dynamic = 'force-dynamic';

export default async function TimestampAdminPage() {
  const [meleeTrophies, brawlTrophies, wiiuTrophies, sdsTrophies, , meleeBios] = await Promise.all([
    db.collectible.findMany({
      where: { type: 'TROPHY', smashGameVersion: 'SSBM' },
      select: { id: true, name: true, videoStartSec: true, videoEndSec: true, posicaoTrofeuMelee: true },
      orderBy: { posicaoTrofeuMelee: 'asc' },
    }),
    db.collectible.findMany({
      where: { type: 'TROPHY', smashGameVersion: 'SSBB' },
      select: { id: true, name: true, videoStartSec: true, videoEndSec: true, posicaoTrofeuBrawl: true },
      orderBy: { posicaoTrofeuBrawl: 'asc' },
    }),
    db.collectible.findMany({
      where: { type: 'TROPHY', smashGameVersion: { in: ['SSB4_WIIU', 'SSB4'] } },
      select: { id: true, name: true, videoStartSec: true, videoEndSec: true, posicaoTrofeuSsb4: true, smashGameVersion: true },
      orderBy: { posicaoTrofeuSsb4: 'asc' },
    }),
    db.collectible.findMany({
      where: { type: 'TROPHY', smashGameVersion: 'SSB4_3DS' },
      select: { id: true, name: true, videoStartSec: true, videoEndSec: true, posicaoTrofeuSsb4: true },
      orderBy: { posicaoTrofeuSsb4: 'asc' },
    }),
    // SSB64 placeholder — sem vídeo ainda
    Promise.resolve([]),
    db.fighterBio.findMany({
      where: { smashGameVersion: 'SSBM' },
      select: { id: true, videoStartSec: true, videoEndSec: true, fighter: { select: { name: true } } },
      orderBy: { fighter: { name: 'asc' } },
    }),
  ]);

  const tabs = [
    {
      key: 'melee-trophies',
      label: 'Melee — Troféus',
      videoSrc: '/videos/full_video_Zoomzike.mp4',
      entries: meleeTrophies.map(t => ({
        id: t.id, name: t.name, position: t.posicaoTrofeuMelee,
        videoStartSec: t.videoStartSec, videoEndSec: t.videoEndSec,
        type: 'collectible' as const,
      })),
    },
    {
      key: 'melee-fighters',
      label: 'Melee — Lutadores',
      videoSrc: '/videos/full_video_Zoomzike.mp4',
      entries: meleeBios.map(b => ({
        id: b.id, name: b.fighter?.name ?? '?', position: null,
        videoStartSec: b.videoStartSec, videoEndSec: b.videoEndSec,
        type: 'fighterBio' as const,
      })),
    },
    {
      key: 'brawl',
      label: 'Brawl — Troféus',
      videoSrc: '/videos/full_video_brawl.mp4',
      entries: brawlTrophies.map(t => ({
        id: t.id, name: t.name, position: t.posicaoTrofeuBrawl,
        videoStartSec: t.videoStartSec, videoEndSec: t.videoEndSec,
        type: 'collectible' as const,
      })),
    },
    {
      key: 'wiiu',
      label: 'Wii U — Troféus',
      videoSrc: '/videos/full_video_ssb4_wiiu.mp4',
      entries: wiiuTrophies.map(t => ({
        id: t.id, name: t.name, position: (t as any).posicaoTrofeuSsb4,
        videoStartSec: t.videoStartSec, videoEndSec: t.videoEndSec,
        type: 'collectible' as const,
      })),
    },
    {
      key: '3ds',
      label: '3DS — Troféus',
      videoSrc: '/videos/full_video_ssb4_3ds.mp4',
      entries: sdsTrophies.map(t => ({
        id: t.id, name: t.name, position: t.posicaoTrofeuSsb4,
        videoStartSec: t.videoStartSec, videoEndSec: t.videoEndSec,
        type: 'collectible' as const,
      })),
    },
  ];

  return <TimestampEditor tabs={tabs} />;
}
