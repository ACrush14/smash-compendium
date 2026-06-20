/**
 * fix-ssbm-smash1-descriptions.ts
 * Corrige as 18 posições SMASH (1) duplicadas.
 * O banco tinha o texto do SMASH (2) em ambas as posições.
 * Aqui sobrescrevemos SMASH (1) com o texto correto (Classic mode).
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/fix-ssbm-smash1-descriptions.ts
 */
import { db } from '../../lib/db';

const SMASH1_DESCRIPTIONS: Record<number, string> = {
  2: "Mario is a character without any glaring weaknesses and plenty of strong attacks: he's even equipped with a Meteor Smash. He's a straightforward character who'll reflect the actual skills of the player. Mario's Cape will turn other characters in the opposite direction and can also reflect missile weapons.",

  8: "Burdened with a shield, a heavy sword, and plenty of equipment, Link is not a very mobile character. Nevertheless, he's skilled with the blade, and his varied supply of missile weapons makes him a powerful fighter. To master Link, you must control the pace by balancing your long-range attacks with head-to-head swordplay.",

  11: "Samus has an abundance of projectile weapons, making her a long-distance attack specialist. The most powerful weapon in her arsenal is her Charge Shot, but be warned: it can be reflected. Her Missiles have homing capabilities, but when fired as Smash Attacks, they fly on a straight trajectory and have boosted power.",

  14: "To make up for his lack of powerful airborne attacks, Yoshi has a miraculous jumping ability and is resistant to damage while in the air. Yoshi can also swallow a foe and transform him or her into an egg: try doing this close to an edge! The speed and power of the Egg Roll increases if you hold down the B Button, but it'll be tougher to control.",

  20: "Fox is among the quickest and nimblest of the Smash Bros. characters. His speed is offset by low firepower, however, and he's better at one-on-one fights than melees with multiple foes. His Blaster is unique: it does damage, but it doesn't make enemies flinch.",

  26: "The key to mastering Ness is controlling his unique midair jump, which makes up for what he lacks in speed. His PK Flash attack may seem weak at first glance, but it grows more powerful the longer you hold down the B Button. To do a lot of damage with PK Fire, try to burn your opponent as many times as possible.",

  29: "Falcon's style is a balanced combination of raw power and speed. His attacks are slow, but when combined with Falcon's high mobility, he's a formidable combat force. The Falcon Punch packs the highest degree of destructive power, while the explosive Raptor Boost can be used to smash airborne foes into the depths.",

  32: "In many ways, Bowser is the toughest character around. Not only does he have near-impervious hide, but his great mass makes him almost impossible to hurl offscreen. Of course, his weight also makes him rather slow to maneuver, so when facing him in battle, it's best to press your attack and not give him a chance to counter.",

  35: "Peach's ability to float is invaluable in Super Smash Bros. Melee, as she can return from incredible distances. Balancing this talent, though, is the fact that she's quite light and therefore can be sent flying with a single powerful attack. Her attacks are fairly weak, so you'll have to hang around to win.",

  41: "Zelda is a bit slow and, because of her light frame, easy to send flying. On the other hand, her magical skills lend her reliable and explosive attack power. Zelda's easier to use if you focus on waiting and countering rather than pressing attacks. She can use Nayru's Love to reflect projectile attacks or as an offensive weapon.",

  47: "Luigi has worse traction than his brother, but he's a more powerful jumper. His Fireballs aren't affected by gravity, so they fly straight horizontally. The Green Missile is similar to Pikachu's Skull Bash, but there's a 12.5% chance of a spontaneous misfire. Luigi's taunting pose inflicts minor damage.",

  56: "Marth is a magnificent swordsman. While his swordplay is faster than that of Link, he lacks power, and his quickness is offset by a marginal endurance. His Shield Breaker gains power the longer it's held. The Dancing Blade combination uses both the Control Stick and the B Button to produce a series of up to four attacks.",

  59: "A resident of a totally flat world, Mr. Game & Watch's frame-by-frame movement is distinctive. His image is known far and wide, and respected by gamers everywhere. In Super Smash Bros. Melee, he hurls sausages with his Chef technique. The random strength of his Judgment is determined by the number displayed; food appears on lucky 7.",

  62: "There's hardly any difference in the abilities of Mario and Dr. Mario, so choosing is largely a matter of taste. Dr. Mario is a tad slower due to his lack of exercise, but his Megavitamins pack a bit more punch than Mario's Fireballs. The capsules travel on a unique trajectory and make a distinct sound on impact.",

  65: "Since he's slow and can't jump very high, Ganondorf relies mainly on his immense physical strength to overwhelm his enemies. His great weight also makes him a difficult foe to send offscreen. Ganondorf's Warlock Punch is slow but absurdly powerful, and when he strikes with his Gerudo Dragon, enemies rise skyward enveloped in dark flames.",

  68: "Where his leader, Fox, has blinding speed, Falco has his own distinct skills and advantages. He has both a higher jump and a longer reach than Fox, and although his Blaster lacks rapid-fire capabilities, it strikes with shocking force.",

  71: "Young Link is lighter and faster than his older self, and his Kokiri sword packs less punch. Even though his Boomerang has a shorter range, he has greater control over it. He's a smaller target, and while his Hookshot has less reach than the older Link's, you can still use it in midair as a last-ditch attempt to grab a ledge.",

  77: "While Roy's moves are well balanced, he's a little on the slow side, and doesn't excel at midair combat. His blade, the Sword of Seals, gives him excellent reach, and makes his Double-Edge Dance slightly different than Marth's Dancing Blade. When it's fully charged, Roy's destructive Flare Blade delivers an instant KO.",
};

async function main() {
  let updated = 0;

  for (const [posStr, descriptionEn] of Object.entries(SMASH1_DESCRIPTIONS)) {
    const pos = parseInt(posStr);
    const result = await db.collectible.updateMany({
      where: { type: 'TROPHY', smashGameVersion: 'SSBM', posicaoTrofeuMelee: pos },
      data: { descriptionEn, descriptionNa: descriptionEn },
    });
    if (result.count > 0) {
      console.log(`  ✓ #${pos} SMASH (1) corrigido`);
      updated += result.count;
    } else {
      console.warn(`  [?] #${pos} — nenhum registro encontrado`);
    }
  }

  console.log(`\n✅ ${updated}/18 descrições SMASH (1) corrigidas`);
}

main().catch(console.error).finally(() => db.$disconnect());
