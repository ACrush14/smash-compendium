/**
 * ETL — Curadoria Automatizada (Motor de Síntese Curatorial)
 *
 * Lê os bios e descrições de colecionáveis já no banco, chama a API da Anthropic
 * para sintetizar uma "Ficha Catalográfica" e persiste o resultado em Fighter.curatorOverview.
 *
 * Uso:
 *   npm run curate                       # processa todos os lutadores sem curatorOverview
 *   npm run curate -- --fighter "Ness"   # processa um lutador específico
 *   npm run curate -- --force            # sobrescreve mesmo que já exista
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "../lib/db";
import { log } from "./scrapers/utils";

// ─── CLI ──────────────────────────────────────────────────────────────────────

const args        = process.argv.slice(2);
const fighterArg  = args[args.indexOf("--fighter") + 1] ?? null;
const force       = args.includes("--force");

// ─── Constantes ───────────────────────────────────────────────────────────────

const GAME_ORDER = ["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"] as const;

const GAME_LABEL: Record<string, string> = {
  SSB64: "Super Smash Bros. 64 (1999)",
  SSBM:  "Super Smash Bros. Melee (2001)",
  SSBB:  "Super Smash Bros. Brawl (2008)",
  SSB4:  "Super Smash Bros. for Wii U / 3DS (2014)",
  SSBU:  "Super Smash Bros. Ultimate (2018)",
};

// ─── Prompt do Motor de Síntese ───────────────────────────────────────────────

const SYSTEM_PROMPT = `Aja estritamente como o Curador Chefe de um arquivo histórico definitivo sobre a franquia Super Smash Bros. O seu único objetivo é receber dados brutos (textos de troféus, descrições in-game de múltiplas eras, como N64, Melee, Brawl, Smash 4 e Ultimate) de um personagem e gerar uma "Ficha Catalográfica" única, coesa e enciclopédica.

REGRAS DE GERAÇÃO (OBRIGATÓRIO):
1. Fusão Histórica e Mecânica: O texto final deve unir a história de origem do personagem (Lore) com o seu estilo de combate (Gameplay) de forma orgânica. Não separe em tópicos. Construa uma narrativa fluida.
2. Eliminação de Redundâncias: Os textos de origem terão informações repetidas. Sintetize. Diga as coisas apenas uma vez, com a máxima precisão de vocabulário.
3. Fidelidade Canónica: Não invente características, golpes ou dados que não estejam presentes no texto bruto fornecido. A sua função é reescrever e compilar, não criar fanfiction.
4. Tom de Museu: O tom deve ser sério, reverente e informativo, típico de uma placa de museu de alta fidelidade. Evite linguagem excessivamente coloquial ou piadas, a menos que seja um traço intrínseco da personalidade do lutador mencionado nos textos base.
5. Formato de Saída: Devolva APENAS o texto final (composto por 2 ou 3 parágrafos densos). Não inclua introduções, saudações, nem explique o que fez. Não use markdown, asteriscos, ou qualquer formatação especial — apenas texto plano com parágrafos separados por linha em branco.

ESTRUTURA ESPERADA:
- Parágrafo 1 (Identidade e Origem): Quem é o personagem, de onde vem (Franquia/Mundo), e qual é a sua motivação histórica ou traço principal de personalidade.
- Parágrafo 2 (Perfil de Combate e Ferramentas): Como ele luta, quais são as suas ferramentas características (armas, magias) e os seus golpes singulares mencionados nos textos.`;

// ─── Construção do Acervo Textual ─────────────────────────────────────────────

function buildAcervo(fighter: {
  name: string;
  franchise: { name: string };
  bios: Array<{ smashGameVersion: string; contentEn: string }>;
  collectibles: Array<{ type: string; smashGameVersion: string; name: string; description: string | null }>;
}): string {
  const lines: string[] = [
    `PERSONAGEM: ${fighter.name}`,
    `FRANQUIA DE ORIGEM: ${fighter.franchise.name}`,
    "",
  ];

  // Bios por era
  const biosOrdered = [...fighter.bios].sort(
    (a, b) => GAME_ORDER.indexOf(a.smashGameVersion as never) - GAME_ORDER.indexOf(b.smashGameVersion as never),
  );

  if (biosOrdered.length > 0) {
    lines.push("=== BIOGRAFIAS POR ERA ===");
    for (const bio of biosOrdered) {
      lines.push(`\n[${GAME_LABEL[bio.smashGameVersion] ?? bio.smashGameVersion}]`);
      lines.push(bio.contentEn.trim());
    }
    lines.push("");
  }

  // Troféus com descrição
  const trophies = fighter.collectibles.filter((c) => c.type === "TROPHY" && c.description);
  if (trophies.length > 0) {
    lines.push("=== TEXTOS DE TROFÉUS ===");
    for (const t of trophies) {
      lines.push(`\n[Troféu — ${GAME_LABEL[t.smashGameVersion] ?? t.smashGameVersion}] ${t.name}`);
      lines.push(t.description!.trim());
    }
    lines.push("");
  }

  // Stickers com descrição
  const stickers = fighter.collectibles.filter((c) => c.type === "STICKER" && c.description);
  if (stickers.length > 0) {
    lines.push("=== TEXTOS DE STICKERS ===");
    for (const s of stickers) {
      lines.push(`\n[Sticker — ${GAME_LABEL[s.smashGameVersion] ?? s.smashGameVersion}] ${s.name}`);
      lines.push(s.description!.trim());
    }
  }

  return lines.join("\n");
}

// ─── Chamada à API ────────────────────────────────────────────────────────────

async function synthesize(client: Anthropic, acervo: string): Promise<string> {
  const message = await client.messages.create({
    model:      "claude-opus-4-5",
    max_tokens: 1024,
    system:     SYSTEM_PROMPT,
    messages:   [
      {
        role:    "user",
        content: `Acervo Textual para síntese:\n\n${acervo}`,
      },
    ],
  });

  const block = message.content[0];
  if (!block || block.type !== "text") throw new Error("Resposta inesperada da API.");
  return block.text.trim();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    log.error("ANTHROPIC_API_KEY não encontrada em .env.local");
    log.error('Adicione: ANTHROPIC_API_KEY="sk-ant-..." no arquivo .env.local');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  // Busca lutadores no banco
  const where = fighterArg
    ? { name: { equals: fighterArg, mode: "insensitive" as const } }
    : force
      ? {}
      : { curatorOverviewEn: null };

  const fighters = await db.fighter.findMany({
    where,
    include: {
      franchise:   true,
      bios:        true,
      collectibles: {
        where: { type: { in: ["TROPHY", "STICKER"] } },
        select: {
          type:             true,
          smashGameVersion: true,
          name:             true,
          description:      true,
        },
      },
    },
    orderBy: { rosterNumber: "asc" },
  });

  if (fighters.length === 0) {
    log.ok("Nenhum lutador para processar. Use --force para reprocessar todos.");
    await db.$disconnect();
    return;
  }

  log.ok(`Processando ${fighters.length} lutador(es)...`);

  let success = 0;
  let failed  = 0;

  for (const fighter of fighters) {
    try {
      log.info(`[${fighter.rosterNumber}] ${fighter.name}`);

      const acervo = buildAcervo(fighter);

      if (acervo.length < 100) {
        log.error(`  Acervo insuficiente para ${fighter.name} — pulando.`);
        failed++;
        continue;
      }

      const overviewEn = await synthesize(client, acervo);

      // Gera PT-BR a partir do EN
      const overviewPt = await client.messages.create({
        model:      "claude-opus-4-5",
        max_tokens: 1024,
        messages:   [{
          role:    "user",
          content: `Traduza fielmente para o Português Brasileiro o texto abaixo. Mantenha exatamente o mesmo tom e estrutura. Devolva APENAS a tradução, sem introduções.\n\n${overviewEn}`,
        }],
      }).then((m) => {
        const b = m.content[0];
        return b && b.type === "text" ? b.text.trim() : overviewEn;
      });

      await db.fighter.update({
        where: { id: fighter.id },
        data:  { curatorOverviewEn: overviewEn, curatorOverviewPt: overviewPt },
      });

      log.ok(`  ${fighter.name} — EN: ${overviewEn.length} chars | PT: ${overviewPt.length} chars`);
      success++;

      // Delay cortês para não saturar a API
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      log.error(`  Falha em ${fighter.name}: ${String(err)}`);
      failed++;
    }
  }

  console.log("");
  log.ok(`Concluído: ${success} gerados, ${failed} falhas.`);
  await db.$disconnect();
}

main().catch((err) => {
  log.error(`Erro fatal: ${String(err)}`);
  console.error(err);
  process.exit(1);
});
