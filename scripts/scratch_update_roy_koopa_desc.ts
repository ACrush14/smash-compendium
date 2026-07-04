import { db } from "../lib/db";
async function main() {
  const en = "This hulking Koopaling loves to flaunt his strength. His pink shades might not give him a menacing look, but the speed he goes from lazy to soldier sure does. In Super Mario Bros. 3, he creates earthquakes to stop Mario while blasting him with magic. How dreadful! This hulking henchman of Bowser's loves to flaunt his strength. His pink shades might not give him a menacing look, but the speed he goes from lazy to soldier sure does. In Super Mario Bros. 3, he creates earthquakes to paralyze Mario while blasting him with magic. How dreadful!";
  const pt = "Esse grandalhão é um dos Koopalings e adora exibir sua força. Seus óculos escuros rosa podem não lhe dar uma aparência ameaçadora, mas a velocidade com que ele passa de preguiçoso a soldado certamente dá. Em Super Mario Bros. 3, ele provoca terremotos para parar o Mario enquanto o ataca com rajadas de magia. Que coisa horrível! Esse brutamontes é um dos capangas do Bowser e adora exibir sua força. Seus óculos escuros rosa podem não lhe dar uma aparência ameaçadora, mas a velocidade com que ele passa de preguiçoso a soldado certamente dá. Em Super Mario Bros. 3, ele provoca terremotos para paralisar o Mario enquanto o ataca com rajadas de magia. Que coisa horrível!";

  const updated = await db.collectible.update({
    where: { id: "TROPHY-SSB4-RoyKoopa" },
    data: { name: "Roy (Super Mario Bros.)", descriptionEn: en, descriptionPt: pt },
  });
  console.log("✅ Atualizado:", updated.name, "- descriptionEn set:", !!updated.descriptionEn, "descriptionPt set:", !!updated.descriptionPt);
  await db.$disconnect();
}
main().catch(console.error);
