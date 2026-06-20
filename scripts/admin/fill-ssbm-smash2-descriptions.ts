/**
 * fill-ssbm-smash2-descriptions.ts
 * Preenche descriptionEn dos 28 troféus SSBM sem descrição:
 * os 26 SMASH (2) de cada personagem + Andross (2) + Starman (2).
 * Fonte: SmashWiki (List of SSBM trophies por série)
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/fill-ssbm-smash2-descriptions.ts
 */

import { db } from '../../lib/db';

// posicaoTrofeuMelee → descriptionEn (NA/NTSC)
const DESCRIPTIONS: Record<number, string> = {
  3: "Mass determines how easily a character can be sent flying, as well as a character's physical strength: Mario's mass is the standard upon which other Smash fighters are measured. His Super Jump Punch sends foes skyward in a shower of coins, while the Mario Tornado pulls in nearby foes, spins them silly, and scatters them every which way.",

  6: "Donkey Kong is a huge target in a fight, so he hates crowds. When he's in the fray, his Giant Punch deals serious damage to multiple opponents. The big ape's Headbutt hits so hard that it temporarily buries opponents in the ground. DK is a lot faster than he looks, and he's lethal in the hands of a master.",

  9: "Link's Bow, Boomerang, and Bombs all take time to wield, so you may want to try drawing them in midair to prevent your foes from attacking you while you're vulnerable. The Spin Attack can score consecutive midair hits, and the final slash is very powerful. Link's Bombs are his trump card, but he can't pull one out if he's carrying another item.",

  12: "While Samus's arsenal of missile weapons is indeed formidable, her enemies are in for a rude awakening if they guard against nothing else. Her Grappling Beam captures foes and latches on to walls, and the Screw Attack drags foes upward in a series of spins that doubles as a recovery move. Samus can also use her Bombs to perform Bomb Jumps.",

  15: "Yoshi has no third jump, so the timing of his second jump is of vital importance. The angle and distance of his Egg Throw can be altered by how you tilt the Control Stick and how long you press the B Button. When Yoshi lands after doing his Yoshi Bomb, stars appear on either side of him, making it hard for enemies to deliver counterattacks.",

  18: "Kirby's small size lets him dodge many attacks, but his light weight makes him fly far when struck. Using his ability to inflate, he can jump five times. His Swallow attack creates wild combos; not only can he copy foes' moves, but he'll also put on special hats and mimic their voices. His Hammer is unwieldy but powerful.",

  21: "Fox falls quickly, so he's a tough target to strike from below; however, this advantage can work against him when he goes flying sideways. You can use the Control Stick to set the direction of the Fire Fox technique while it's charging up. On a side note, Fox is also much lighter than he was in the N64 Super Smash Bros. game.",

  24: "While its electric attacks, such as Thunder and Thunder Jolt, are powerful, Pikachu is at its best speeding around the fray and waiting for its chance to strike. You can control the path of Pikachu's two-directional Quick Attack, allowing you to jump twice. Hold down the B Button to charge up Skull Bash.",

  27: "Ness's mind is his best weapon. PK Thunder is a PSI missile weapon that can be guided using the Control Stick, and if Ness hits himself with it, he turns into a living missile capable of doing massive damage. This move can also be used for recovery. PSI Magnet turns energy missile attacks into health; try out certain Pokémon for stamina replenishment.",

  30: "The Knee Smash, used in midair on foes in front of you, is slow and has a short reach, but if it connects, it'll send foes flying a long way on a low trajectory. Falcon uses his Falcon Dive to grab an enemy in midair and fling them away with an explosive blast. He can do this technique repeatedly without landing, so it can also be used as a recovery move.",

  33: "Bowser's Fire Breath strikes continually, but it grows gradually smaller over time until it's barely smoldering. The Koopa Klaw rakes enemies at a distance and pulls nearby foes in close for a good gnawing. Bowser's Whirling Fortress moves laterally over the ground; it works in midair as a recovery. The Bowser Bomb is powerful and paves the way for more attacks.",

  36: "Peach's Smash A attack will set her swinging with either a frying pan, tennis racket, or golf club. These bludgeoning devices appear randomly and have different reaches and power levels. The princess uses Toad to absorb attacks, and he counters by sending spores out at attackers. Don't worry about the little guy, though; he takes his job seriously.",

  39: "The colors of the Ice Climbers' parkas denote who's in the lead: Nana's in pink or orange, while Popo's in green or blue. Their hairstyles are also slightly different. Belay allows them to cover great distances, but doesn't give foes the chance to target their landing. Blizzard is best used in close quarters; in the fray, Nana and Popo will sometimes freeze opponents.",

  42: "Zelda's midair Lightning Kick centers immense magical power in the ball of her foot. If she strikes perfectly, the attack is as strong as can be. If her aim is slightly off, it'll be exceedingly weak. Farore's Wind again utilizes Zelda's magical prowess, this time by transporting her great distances. It's vital to know the lay of the land before using this move.",

  45: "The best strategy to use when playing as Sheik is to let her flow from one powerful attack into another, like a river of quicksilver. Zelda has some techniques with more punch, however, so in one-on-one battles, use Transform as needed. Sheik only travels a short way when using Vanish, but the move comes with a small explosion that damages foes around her.",

  48: "Smack someone with Luigi's Super Jump Punch, and if the timing is just right, it will become a Fire Jump Punch of incredible strength. However, Luigi can only jump straight up when delivering this blow, and if his aim is a bit off, he'll only do a single point of damage. The Luigi Cyclone sucks foes in and twirls them about.",

  51: "Jigglypuff's normal attacks are weak, and because of its light weight it's easily sent flying. However, with its incredible midair agility, it seems to dance when airborne. Rollout is a powerful speed attack, but be careful not to fly off the edge. Pound does serious damage, and it can also help as a recovery move.",

  54: "As Mewtwo relies mostly on its powerful brain, there are times when it scarcely uses its arms and legs. Since Mewtwo spends much of its time floating, it flies far when struck. Shadow Ball traces a jagged path once released: the longer Mewtwo holds it, the more powerful it becomes. Mewtwo uses Confusion to spin its foes around.",

  57: "The tip of Marth's blade causes the most damage, so you should try to create adequate distance between you and your enemy to gracefully strike with that point. Marth's Dolphin Slash is fast and powerful, but it leaves him vulnerable upon landing. Marth uses Counter to block a foe's attack and deal a return strike. If you're fighting a Counter-happy Marth, grab him.",

  60: "A man of great stature in the world of Nintendo characters, Mr. Game & Watch is a comparatively light fellow and doesn't feature many powerful attacks. When he's in danger of falling, Fire calls out a rescue brigade to send him skyward once more. He can also catch missile weapons with Oil Panic; once he's caught three, he can dump the bucket on his foes.",

  63: "The differences between Dr. Mario and Mario are more pronounced in some areas than others, but basically they can be played in similar fashion. While it may be hard to spot the contrasts, they do exist. For example, Dr. Mario's Super Sheet is longer and narrower than Mario's Cape, and any opponents hit by Dr. Tornado will fly off in diverse directions.",

  66: "Ganondorf's slow speed works against him in single combat, but in melees, his crazy power lets him earn his keep with innumerable KOs. Ganondorf can't strike quickly, but each blow he lands adds up. Ganondorf is at his quickest when he uses the Wizard's Foot, and his Dark Dive blasts foes in a burst of dark energy.",

  69: "Falco's amazing jumping abilities have many merits, but it's vital to realize that it comes at the cost of some attack power and defensive strength. He falls at a high speed, which disrupts potential attackers, but this also prevents successful recoveries occasionally. Hit an opponent with Reflector, and he or she will fly straight up; this is Falco's quickest attack.",

  72: "With a youthful spring in his step, Young Link can perform amazing wall-jumps. Once he hits a wall, tap the Control Stick in the opposite direction to send him leaping upward; you can practice to your heart's content in Target Test. His Spin Attack can strike multiple times even on the ground, and although it's hard to discern, so do his Bombs.",

  75: "Compared with Pikachu, Pichu is a tad more nimble and a little more difficult to hit. Those are the only two advantages, however, and since Pichu damages itself when it uses electrical attacks, it's best suited for handicapped matches. Even though Pichu's tough to catch, it's easy to throw its tiny frame great distances.",

  78: "Roy's blade is different than Marth's; he does the most damage hitting with the center of his sword. So, a fearless advance into the arms of his foe is Roy's best bet. Blazer is a bit slower than Marth's Dolphin Slash, but it's still a mighty attack that sets anyone it strikes aflame. Roy's attack after using Counter differs slightly from Marth's.",

  230: "This incarnation of Andross was so big as to be ridiculous, but it at least appeared to be a living being. Andross was once a brilliant scientist, but was banished from the galaxy for his dangerous experiments. From the planet Venom, he readied his troops and directed his sword of vengeance toward the Lylat System.",

  246: "Just one kooky subset of the diverse cast of enemies in EarthBound, these strange creatures are aliens in the employ of Giygas. Variations of the Starman race include Starman, Starman Jr., Starman Deluxe, and Starman Super. They all use PSI powers, but their strength differs depending on the level on which they're found.",
};

async function main() {
  let updated = 0;

  for (const [posStr, descriptionEn] of Object.entries(DESCRIPTIONS)) {
    const pos = parseInt(posStr);
    const result = await db.collectible.updateMany({
      where: {
        type: 'TROPHY',
        smashGameVersion: 'SSBM',
        posicaoTrofeuMelee: pos,
        descriptionEn: null,
      },
      data: { descriptionEn, descriptionNa: descriptionEn },
    });
    if (result.count > 0) {
      console.log(`  ✓ #${pos} (${result.count} registro)`);
      updated += result.count;
    } else {
      console.warn(`  [?] #${pos} — nenhum registro atualizado`);
    }
  }

  console.log(`\n✅ ${updated}/${Object.keys(DESCRIPTIONS).length} troféus atualizados`);
}

main().catch(console.error).finally(() => db.$disconnect());
