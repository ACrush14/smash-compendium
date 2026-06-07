# Sistema: Media Vault

**Componente:** `components/ui/MediaVaultViewer.tsx`
**Posição:** Coluna esquerda da página do fighter (5/12 colunas)

---

## O que é

Carrossel de assets visuais do fighter, ordenado cronologicamente da origem ao SSBU. Cada asset tem: URL, label, sublabel e assetType.

## Tipo MediaAsset

```typescript
interface MediaAsset {
  url:       string | null | undefined;
  label:     string;
  sublabel:  string;
  assetType: "render" | "trophy" | "sticker" | "spirit" | "sprite" | "gif" | "screenshot";
}
```

## Ordem Cronológica dos Assets

Montada em `page.tsx` na variável `vaultAssets`:

```
1. ORIGIN (sprites de pixel art do jogo de origem)
   ↓ GIFs do jogo de origem
2. SSBM (render Melee se existir, troféus Melee, GIFs)
3. SSBB (troféus Brawl, GIFs)
4. SSB4 (troféus SSB4 — só Wii U, 3DS filtrados, GIFs)
5. SSBU (render oficial, spirits, GIFs)
```

## Como Adicionar Assets

### Via banco (collectibles)
```typescript
// Sprites de origem (type="SPRITE", smashGameVersion="ORIGIN")
// Spirits SSBU (type="SPIRIT", smashGameVersion="SSBU")
// Media extras (type="MEDIA")
// → São carregados automaticamente via originAssets em page.tsx
```

### Via hardcode (GIFs)
```typescript
// Em page.tsx — objeto FIGHTER_GIFS:
const FIGHTER_GIFS: Record<string, Partial<Record<GifEra, GifEntry[]>>> = {
  "Ness": {
    SSBM: [
      { url: "/assets/gifs/ness-melee-pk.gif", label: "Ness · PK Fire", sublabel: "..." },
    ],
    SSBU: [
      { url: "/assets/gifs/ness-ultimate-1.gif", label: "...", sublabel: "..." },
    ],
  },
};
```

## Filtragem de Troféus 3DS

Troféus SSB4 são filtrados para exibir apenas Wii U (não 3DS):
```typescript
// Em page.tsx — função is3DSTrophy(url):
function is3DSTrophy(url: string) {
  return url.includes("3DS") || url.includes("handheld");
}
// Aplicado ao construir vaultAssets no bloco SSB4
```

## Deduplicação de Assets

```typescript
// Remove assets com mesma URL (dados duplicados no banco)
const seenVaultUrls = new Set<string>();
const dedupedVaultAssets = vaultAssets.filter(a => {
  if (!a.url) return true;
  if (seenVaultUrls.has(a.url)) return false;
  seenVaultUrls.add(a.url);
  return true;
});
```

## Regra: NENHUMA `<Image>` do Next.js na zona direita

A zona esquerda (MediaVault) usa `next/image` para renders e troféus de CDN externo.
A zona direita (DataZone) usa `<img>` para box arts locais.

```
Left  ← next/image (renders, troféus de CDN)
Right ← <img style={{ height, width: "auto" }}> (box arts locais)
```

## Assets do Ness (único fighter completo)

| Era | Assets |
|---|---|
| ORIGIN | Sprite EarthBound (NessSprite.gif) |
| SSBM | 2 GIFs hardcoded |
| SSBB | 2 GIFs hardcoded + 1 troféu |
| SSB4 | 2 GIFs hardcoded + 5 troféus Wii U |
| SSBU | Render oficial + Spirit #563 + 3 GIFs |

**Total Ness: ~16 assets no vault**
