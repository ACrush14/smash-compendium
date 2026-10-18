import { NextResponse } from "next/server";
import { revalidateSite } from "@/lib/cache";

// Protegido pelo middleware (/api/admin/*). Limpa o cache de páginas e de dados para mostrar edições na hora.
export async function POST() {
  revalidateSite();
  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
