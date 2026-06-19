import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, id, videoStartSec, videoEndSec } = body as {
    type: 'collectible' | 'fighterBio';
    id: string;
    videoStartSec: number | null;
    videoEndSec: number | null;
  };

  if (!id || !type) return NextResponse.json({ error: 'Missing id or type' }, { status: 400 });

  if (type === 'collectible') {
    await db.collectible.update({ where: { id }, data: { videoStartSec, videoEndSec } });
  } else {
    await db.fighterBio.update({ where: { id }, data: { videoStartSec, videoEndSec } });
  }

  return NextResponse.json({ ok: true });
}
