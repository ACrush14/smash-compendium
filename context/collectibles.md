# Sistema: Collectibles (Troféus, Spirits, Stickers)

**Rota:** `/collectibles`
**Arquivo da página:** `app/collectibles/page.tsx`
**Modelo:** `Collectible` (Prisma)

---

## Tipos de Collectible

| type | smashGameVersion | Descrição |
|---|---|---|
| `TROPHY` | SSBM / SSBB / SSB4 | Troféus 3D de personagens |
| `SPIRIT` | SSBU | Spirits do Ultimate |
| `STICKER` | SSBB | Adesivos do Brawl |
| `SPRITE` | ORIGIN | Sprite pixel art do jogo de origem |
| `MEDIA` | qualquer | GIFs ou vídeos extras |

## Schema do Collectible

```prisma
model Collectible {
  id                String
  fighterId         String?   — null = collectible não associado a fighter
  type              String    — "TROPHY" | "SPIRIT" | "STICKER" | "SPRITE" | "MEDIA"
  smashGameVersion  String
  name              String
  nameJp            String?
  description       String?   @db.Text  — EN principal (campo onde o scraper gravou os textos reais)
  descriptionNa     String?   @db.Text  — NTSC/NA
  descriptionEu     String?   @db.Text  — PAL/EU
  descriptionEn     String?   @db.Text  — EN unificado (vazio — dados estão em `description`)
  descriptionPt     String?   @db.Text  — PT-BR
  descriptionJp     String?   @db.Text  — JP original
  descriptionJpEn   String?   @db.Text  — JP romanizado
  assetRenderUrl    String?             — URL da imagem
  orderIndex        Int?                — posição na galeria
  posicaoSpiritSsbu Int?               — número oficial do spirit
  franchiseId       String?             — NOVO (Sessão 21): franquia dona do coletável
}
```

## Atribuição de Franquia (Sessão 21 — Opção 2)

| Campo | Quando preenchido | Efeito |
|---|---|---|
| `fighterId` | Collectible pertence a um fighter específico | Aparece na página `/fighters/[name]` |
| `franchiseId` | Collectible pertence ao universo de uma franquia | Aparece na página `/franchise/[name]` |

### Regras de atribuição:
- **Fighter-specific** (e.g. troféu do Mario): `fighterId = mario.id` + `franchiseId = mario.franchiseId`
- **Universe-only** (e.g. troféu do Boo, Koopa): `fighterId = null` + `franchiseId = mario.franchiseId`
- **Sem atribuição** (e.g. spirits avulsos sem fighter): `fighterId = null` + `franchiseId = null`

### Como desvincular de fighter sem perder franchiseId:
No editor `/admin/fighters/[id]` → Tab Colecionáveis → botão ⇥ (Desvincular)
→ automaticamente define `fighterId = null` + `franchiseId = fighter.franchiseId`
→ resultado: some da página do fighter, mas aparece na página da franquia

### Estado atual (pós-migração):
- 1395 collectibles com `franchiseId` (de fighters ativos)
- 1838 collectibles sem `franchiseId` (nunca tiveram fighter — spirits avulsos, etc.)

```prisma
```

## Estado Atual

| Tipo | Count | Fighters cobertos |
|---|---|---|
| TROPHY | 901 | 71/87 |
| SPIRIT | 1582 | 84/87 |
| STICKER | 707 | 55/87 |
| SPRITE | 37 | ~10 |
| MEDIA | 6 | apenas Ness |

## Como Collectibles Aparecem na Página do Fighter

### Na zona DIREITA (FighterDataZone)

**Troféus** — mostrados por era no timeline:
```typescript
// page.tsx — carregamento
const trophies = await db.collectible.findMany({
  where: { fighter: { name }, type: "TROPHY" },
  orderBy: [{ smashGameVersion: "asc" }, { name: "asc" }]
});
// Agrupados por smashGameVersion → trophiesMap
```

**Stickers** — ⚠️ BUG: `stickersMapSerialized` está SEMPRE vazio em `page.tsx`
```typescript
// ATUAL (linha ~330 em page.tsx) — nunca populado:
const stickersMapSerialized: Record<string, SerializedCollectible[]> = {};

// FIX NECESSÁRIO — adicionar antes:
const stickers = await db.collectible.findMany({
  where: { fighter: { name }, type: "STICKER" },
  orderBy: [{ smashGameVersion: "asc" }]
});
const stickersMapSerialized: Record<string, SerializedCollectible[]> = {};
for (const s of stickers) {
  const list = stickersMapSerialized[s.smashGameVersion] ?? [];
  list.push(serializeCollectible(s));
  stickersMapSerialized[s.smashGameVersion] = list;
}
```

**Spirits** — ⚠️ Apenas CONTADOS, não exibidos como conteúdo
```typescript
// Contados em fichaCounters:
spirits: originAssets.filter(o => o.type === "SPIRIT").length

// Para EXIBIR como conteúdo no timeline, precisaria:
// 1. Carregar spirits com descrição via db.collectible.findMany({ type: "SPIRIT" })
// 2. Criar spiritsMap análogo ao trophiesMap
// 3. Passar para FighterDataZone e renderizar
```

### Na zona ESQUERDA (MediaVaultViewer)

Spirits e sprites aparecem no carrossel de mídia:
```typescript
// Spirits → assetType: "spirit"
for (const oa of originAssets.filter(o => o.type === "SPIRIT")) {
  vaultAssets.push({ url: oa.assetRenderUrl, assetType: "spirit" });
}
// Sprites → assetType: "sprite"
for (const oa of originAssets.filter(o => o.type === "SPRITE")) {
  vaultAssets.push({ url: oa.assetRenderUrl, assetType: "sprite" });
}
```

## Página /collectibles

Exibe troféus, spirits, stickers agrupados por era (SSBM, SSBB, SSB4, SSBU).

Filtro por game via query param: `/collectibles?game=SSBM`

```typescript
const collectibles = await db.collectible.findMany({
  where: { smashGameVersion: activeGame, type: { not: "SPRITE" } },
  orderBy: [{ orderIndex: "asc" }, { name: "asc" }]
});
```

## Fighters sem Spirits (3rd party — 33 fighters)

Fighters como Snake, Sonic, Cloud, Joker, etc. não têm spirits em ssbuspirits.com.
Precisarão de texto curado manualmente ou de fonte alternativa.

## Pendências

| Item | Impacto | Fix |
|---|---|---|
| stickersMapSerialized vazio | Stickers nunca aparecem no timeline | Fix em `page.tsx` (ver acima) |
| Spirits não exibidos como conteúdo | Spirits só contados, não lidos | Criar spiritsMap em `page.tsx` |
| 3 fighters sem spirits (TROPHY ok) | Fighters sem spirit count | ETL pendente |
