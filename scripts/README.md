# scripts/

Como rodar qualquer script: `npx tsx --env-file=.env.local scripts/<pasta>/<arquivo>.ts` (nunca `ts-node`).

| Pasta | Conteúdo |
|---|---|
| `admin/` | Rotinas de curadoria e manutenção do banco (importar timestamps, traduzir, vincular works, otimizar mídia). |
| `scrapers/` | Coletores de dados externos (SSBWiki, SmashWiki, ssbuspirits…). |
| `seed/` | Carga inicial do banco. |
| `_archive/` | Scripts de uso único (`scratch_*`) já executados. Ficam só como registro; não use como base. |
| (raiz) | Ferramentas gerais (`seed.ts`, `curator.ts`, `media.ts`…). |

Dados que os scripts leem/escrevem ficam em `data/` (`data/timestamps/` tem os JSON/CSV de timestamps dos vídeos).

Mídia: `admin/convert-videos-webm.ts` (vídeos completos → WebM 720p), `admin/optimize-clips-webm.ts`
(clipes ≤720p) e `admin/optimize-images.ts` (imagens locais + miniaturas WebP).
