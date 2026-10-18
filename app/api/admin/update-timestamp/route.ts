import { revalidateSite } from "@/lib/cache";
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

async function _POST(req: NextRequest) {
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

export async function POST(...args: Parameters<typeof _POST>) {
  const res = await _POST(...args);
  revalidateSite(); // mostra a edição no site público sem esperar o cache expirar
  return res;
}
