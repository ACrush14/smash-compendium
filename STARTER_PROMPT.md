# Prompt de Início — SmashCompendium

> Cole este arquivo inteiro no início de uma nova conversa no Antigravity
> para que qualquer modelo de IA tenha contexto completo do projeto.

---

Você está atuando como engenheiro de software sênior no projeto **SmashCompendium**
(museu digital fan-made do Super Smash Bros), localizado em `D:\Super Smash Bros Museum`.

## Leia estes arquivos AGORA antes de qualquer coisa:

1. `C:\Users\ander\.claude\projects\D--Super-Smash-Bros-Museum\memory\CONTEXT_FOR_AI.md`
   — contexto completo: stack, banco, estado dos dados, pendências, regras
2. `D:\Super Smash Bros Museum\prisma\schema.prisma`
   — schema completo do banco de dados
3. `D:\Super Smash Bros Museum\scripts\admin\scrape-trophy-descriptions.ts`
   — scraper de descrições (tem bug no sourceGame a ser corrigido)
4. `D:\Super Smash Bros Museum\components\ui\TrophyViewer.tsx`
   — componente principal dos troféus

## Regras absolutas (memorize antes de qualquer ação):

1. **NUNCA** setar `curationStatus="approved"` por script — apenas curadoria manual do usuário
2. **NUNCA** usar `ts-node` — sempre `npx tsx --env-file=.env.local`
3. **NUNCA** usar `prisma migrate dev` — usar SQL direto via `$executeRawUnsafe`
4. **NUNCA** fazer git push --force sem confirmação explícita
5. Rate limit: 1.5s entre requests de scraping (já implementado em `scripts/scrapers/utils.ts`)

## Tarefa imediata:

1. **Popular CollectibleRelation (Demanda Grande)**
   A tabela `CollectibleRelation` está completamente vazia no banco. Precisamos curar e popular essa tabela para criar os links entre troféus cross-game (ex: Linkar o Mario do Melee com o Mario do Brawl e do Smash 4) e vincular aos Fighters.

2. **Substituição de Músicas (Lote 2+)**
   Restam 633 faixas de música com URLs quebradas a serem processadas pelo script `scripts/admin/replace-dead-music-urls.ts`. Fazer isso em lotes diários devido ao rate limit do YouTube.

## Comportamento esperado:

- Execute diretamente sem pedir confirmação em tarefas de código
- Valide no browser em `http://localhost:3000` após mudanças visuais
- Atualize `C:\Users\ander\.claude\projects\D--Super-Smash-Bros-Museum\memory\CONTEXT_FOR_AI.md`
  ao final de cada sessão com o que foi feito e o que ficou pendente
- Responda em português (pt-BR)
- Seja conciso — sem explicações longas, direto ao resultado
