import { db } from "../../lib/db";

async function main() {
  const luigi = await db.fighter.findFirst({
    where: { name: "Luigi" },
    select: { moves: { select: { id: true, smashGameVersion: true, label: true, order: true, descJp: true }, orderBy: [{ smashGameVersion: "asc" }, { order: "asc" }] } },
  });
  if (!luigi) { console.log("Luigi not found"); return; }

  for (const m of luigi.moves) {
    let data: { descEn: string; descPt: string; descJpEn: string } | null = null;

    if (m.smashGameVersion === "SSBM" && m.descJp?.startsWith("マリオよりすべりやすいが")) {
      data = {
        descEn: "He's more slippery than Mario, but has better jumping ability. Some of his standard moves also differ. His Fireball isn't affected by gravity and flies straight across. Luigi Missile is similar to Skull Bash, but has a 1/8 chance of misfiring. Above all, the pose he strikes for his moves is rather negative. B: Fireball, Side+B: Luigi Missile",
        descPt: "Ele escorrega mais que o Mario, mas tem melhor capacidade de pulo. Alguns de seus golpes padrão também são diferentes. Sua Bola de Fogo não é afetada pela gravidade e voa reto horizontalmente. O Luigi Missile é semelhante ao Skull Bash, mas tem 1/8 de chance de disparar sem controle. Acima de tudo, a pose que ele faz durante os golpes é bem negativa. B: Bola de Fogo, Lateral+B: Luigi Missile",
        descJpEn: "He's more slippery than Mario, but has better jumping ability. Some of his standard moves also differ. His Fireball isn't affected by gravity and flies straight across. Luigi Missile is similar to Skull Bash, but has a 1/8 chance of misfiring. Above all, the pose he strikes for his moves is rather negative. B: Fireball, Side+B: Luigi Missile",
      };
    } else if (m.smashGameVersion === "SSBM" && m.descJp?.startsWith("”スーパージャンプパンチ”")) {
      data = {
        descEn: "If Super Jump Punch connects right at the very start, it becomes the \"Fire Jump Punch,\" producing incredibly powerful knockback. However, it can only jump straight up, and if the timing is off, it becomes a weak hit dealing only 1 damage. Luigi Cyclone lands as a single hit. Up+B: Super Jump Punch, Down+B: Luigi Cyclone",
        descPt: "Se o Super Jump Punch conectar bem no início, ele se torna o \"Fire Jump Punch\", produzindo um poder de arremesso incrivelmente forte. Porém, só pode pular na vertical, e se o timing estiver errado, se torna um golpe fraco causando apenas 1 de dano. O Luigi Cyclone acerta em um único golpe. Cima+B: Super Jump Punch, Baixo+B: Luigi Cyclone",
        descJpEn: "If Super Jump Punch connects right at the very start, it becomes the \"Fire Jump Punch,\" producing incredibly powerful knockback. However, it can only jump straight up, and if the timing is off, it becomes a weak hit dealing only 1 damage. Luigi Cyclone lands as a single hit. Up+B: Super Jump Punch, Down+B: Luigi Cyclone",
      };
    } else if (m.smashGameVersion === "SSB4" && m.label === "EX") {
      data = {
        descEn: "Luigi's down taunt, which looks like him sulking and hanging his head, has surprising properties you wouldn't expect from its appearance. If it hits an opponent, it has an attack hitbox and deals a small amount of damage. In fact, it carries a powerful meteor effect that spikes opponents downward. Use it against an opponent hanging on a ledge, and a well-placed hit can KO them in a single blow. (AC) Mario Bros. (1983) (3DS) Luigi's Mansion 2 (2013/03)",
        descPt: "A provocação baixa do Luigi, que parece ele emburrado e cabisbaixo, tem propriedades surpreendentes que você não esperaria pela aparência. Se atingir um adversário, tem uma hitbox de ataque e causa um pequeno dano. Na verdade, ela carrega um poderoso efeito meteoro que arremessa os adversários para baixo. Use-a contra um adversário pendurado em uma borda, e um golpe bem posicionado pode eliminá-lo em um único golpe. (AC) Mario Bros. (1983) (3DS) Luigi's Mansion 2 (2013/03)",
        descJpEn: "Luigi's down taunt, which looks like him sulking and hanging his head, has surprising properties you wouldn't expect from its appearance. If it hits an opponent, it has an attack hitbox and deals a small amount of damage. In fact, it carries a powerful meteor effect that spikes opponents downward. Use it against an opponent hanging on a ledge, and a well-placed hit can KO them in a single blow. (AC) Mario Bros. (1983) (3DS) Luigi's Mansion 2 (2013/03)",
      };
    }

    if (!data) { console.log(`  ⚠️  Sem match: [${m.smashGameVersion}] ${m.label}`); continue; }
    await db.fighterMove.update({ where: { id: m.id }, data });
    console.log(`  ✅ [${m.smashGameVersion}] ${m.label} (order ${m.order}): EN+PT+JpEn adicionados`);
  }

  await db.$disconnect();
}
main().catch(console.error);
