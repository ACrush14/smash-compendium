import { PrismaClient } from '@prisma/client';
import { parseFighterTemplate } from '../lib/template-parser';

const db = new PrismaClient();

const marioText = `
Games (O Works que fica lá em cima)

N64 Bios: Although best known as the mustachioed plumber who battles the Turtle Tribe with his distinct jumping action, this internationally-famous hero has also acted as a referee, a driver, and even a doctor! He's been linked to Princess Peach of Mushroom Kingdom for years, but to this day their true relationship remains a mystery.

N64 Works: Super Mario Bros. (NES)
Super Mario Kart (SNES)
Mario Kart 64 (Nintendo 64)

Melee Trophy: Known worldwide as Mr. Nintendo, Mario uses his incredible jumping ability to thwart the evil Bowser time after time. While he's best known as a hero, Mario has played many roles, including racer, doctor, golfer, and villain. His tastes have changed over 20 years of gaming; he long ago swapped the colors of his shirt and overalls.

Melee Works: Donkey Kong (Arcade 1981)
Melee Smash 1: Mario is a character without any glaring weaknesses and plenty of strong attacks: he's even equipped with a Meteor Smash. He's a straightforward character who'll reflect the actual skills of the player. Mario's Cape will turn other characters in the opposite direction and can also reflect missile weapons. B: Fireball Smash B: Cape

Melee Smash 2: Mass determines how easily a character can be sent flying, as well as a character's physical strength: Mario's mass is the standard upon which other Smash fighters are measured. His Super Jump Punch sends foes skyward in a shower of coins, while the Mario Tornado pulls in nearby foes, spins them silly, and scatters them every which way.
Up & B: Super Jump Punch
Down & B: Mario Tornado

Brawl Trophy: A familiar overall-clad figure who is Nintendo's flagship character. His courage and jumping ability have seen him through countless adventures. He's a multitalented plumber with the knowledge of a physician, a top-notch golfer, and a veteran tennis umpire. Is his jumping prowess a boon from his girder-climbing days?
Brawl Works: NES: Donkey Kong
NES: Super Mario Bros.

Smash 4 Trophy : As iconic as iconic gets, this gaming celebrity is known for saving the world from Bowser. He's got amazing jumping skills and makes use of a wide range of transformations. In his free time, he plays too many sports to count. In Smash Bros., he's a well-rounded fighter you can rely on. Say it with me: "It's-a me, Mario!"
Smash 4 Works : NES: Donkey Kong Classics (09/1988)
NES: Super Mario Bros. (10/1985)

Ultimate Fan description: The one and only knight in shining overalls, this hero of the Mushroom Kingdom is known worldwide for his thrilling adventures and talented careers in all kinds of sporting events. He's a true all-rounder, and that holds true in Smash as well! Whether you're a seasoned veteran or holding a controller for the first time, you can't go wrong with Mario.

Ultimate Fighter Tips: (★☆☆) Mario's Origins – Mario made his debut in the arcade game Donkey Kong. He wore a blue shirt and red overalls—the opposite of his current outfit.
(★☆☆) In His Series – When you think of Mario, you might think of his signature phrases like "Mamma Mia!" and "It's-a me, Mario!" These classic Mario phrases were first uttered by Mario in Super Mario 64.
(★☆☆) The Gold Standard of Action Games – The Super Mario series has released 35 titles, appeared on at least 15 systems, and it's sold more than 340 million copies worldwide!
(★☆☆) Luigi's Air Superiority – The title Super Mario Bros. 2 refers to different games in the West and in Japan, but both games introduced Luigi's ability to jump higher than Mario!
(★☆☆) Mario's Name – When Mario first appeared in the arcade version of Donkey Kong, he was known as Jumpman. The kidnapped woman was called "Lady," but she was later given the name Pauline.
(★☆☆) A Familiar Face – In Punch-Out!!, released on the NES in 1987, the referee was none other than Mario! His outfit was a bit different, but he still wore his trademark cap.
(★☆☆) F.L.U.D.D. from Super Mario Sunshine – A device in Super Mario Sunshine made by Gadd Science, Inc. It's a handy partner that can defeat enemies with water or change abilities by changing the nozzle.
(★☆☆) Builder Mario – Select the seventh color variation to play as Builder Mario from Super Mario Maker.
(★☆☆) Wedding – Select the eighth color variation to play as Wedding Mario from Super Mario Odyssey.
(★★☆) Cape's Effect (Side Special) – This move has the effect of turning your opponents around. This can really mess them up if they're trying to get back onto the stage!
(★★★) Dodging with Cape (Side Special) – Use this in midair to slow down Mario's falling speed for a moment. In particular, the first time you use it, he'll float up a bit—great for dodging!
(★☆☆) Reversing Controls with Cape (Side Special) – Mario's Cape doesn't just flip an opponent's body around. It also reverses an opponent's controls for a short period of time.
(★☆☆) Super Jump Punch (Up Special) – Sometimes the coins that appear will become the regional coins from Super Mario Odyssey. When that happens, Mario's cap will turn into Cappy.
(★★☆) F.L.U.D.D.ing a Recovery – F.L.U.D.D.'s water is great for stopping fighters like Ness and Ike from recovering with their up specials. Try to keep it charged and ready!
(★☆☆) F.L.U.D.D. (Down Special) – A blast of water is an effective way to disrupt your opponents. It doesn't hurt, but it can slide them around.
(★★☆) F.L.U.D.D.ing Items – F.L.U.D.D. isn't just for pushing fighters—it can also push some items, like capsules and crates, and even deflect incoming Bob-ombs.
(★☆☆) Water from F.L.U.D.D. (Down Special) – Tilt the control stick up or down to change the angle of the water spray. The more water you charge up, the more forcefully it will spray out.
(★☆☆) Mario Finale (Final Smash) – Unleash a wave of fire that damages and pushes opponents. Hit opponents when they are close to deal big damage. It's perfect for stopping opponents from returning to the stage.
(★☆☆) Mario Finale Warning (Final Smash) – You'll slide backward little by little when releasing Mario Finale. Trigger it too close to an edge, or while on a narrow platform, and you might find yourself in midair!
(★★★) Lead Headbutt (Up Smash Attack) – A powerful upward headbutt. Mario's head is invulnerable while performing it. Useful against opponents moving in to attack from above.
(★★★) Meteor Knuckle (Forward Air Attack) – It's a slow attack, but Mario swings his fist down hard enough for a meteor smash as it begins.
(★☆☆) Airplane Swing (Back Throw) – When grabbing opponents and swinging them around, you can hit other fighters with the move as well. Use this to deal damage to an entire group of fighters.
Ultimate Works: Donkey Kong, Super Mario 64

N64 Bios JP: 世界的に有名な、ヒゲのナイスミドル。得意のジャンプと自慢のアクションでクッパ軍団を相手に大活躍した。キノコ王国のピーチ姫とは長いつきあいだが、どの程度の仲かはなぞである。元は配管工で、その後ビルの解体、テニスの審判、ドライバー、医者など、いろいろな仕事を経験している。
N64 Works JP: スーパーマリオブラザーズ (85.9/FC)
スーパーマリオカート (92.8/SFC)
スーパーマリオ64 (96.6/N64)

Melee Trophy JP: 世界的に有名なミスター・ニンテンドー。強いジャンプ力と行動力を武器に、クッパに挑む。基本的には冒険家だが、ゴルファー、レーサー、解体屋、医者、悪役などさまざまな趣味や職を持つ。年齢は26歳前後。昔はオーバーオールとシャツが逆の色だったこともある。
Melee Works JP: ドンキーコング (FC)
スーパーマリオブラザーズ (FC)
Melee Smash 1 JP:  「スマブラ」はイメージ世界のできごとなので、キャラの描き込みが深くなっている。弱点らしい弱点はなく、メテオ攻撃も実装する。「スマブラ」の基本体なので、プレイヤーの実力がストレートに問われる。”スーパーマント”は、敵の向きをひっくりかえし飛び道具をはねかえす。
B:ファイアボール
横+B:スーパーマント
Melee Smash 2 JP: マリオの体重は、全キャラの中でも標準的に設定されているので、キャラの軽さ（＝ふっとびやすさ）やふっとばし力を計るのに適している。”スーパージャンプパンチ”は、コインをまきちらしながら上昇する連続ヒットワザ。”マリオトルネード”は敵を巻き込みふきとばす。
上+B:スーパージャンプパンチ
下+B:マリオトルネード

Brawl Trophy JP: オーバーオール姿がなじみ深い任天堂を代表するキャラクター。勇気と行動力を兼ね揃え、幾多の冒険を乗り切ってきた。配管工として活躍する傍ら、医者としての知識もあり、ゴルフの腕前もなかなかのもの。さらにテニスの審判もこなす。まさにマルチな才能の持ち主。その高いジャンプ能力は、鉄骨を登っていた時代の賜?
Brawl Works JP: (FC) ドンキーコング
(FC) スーパーマリオブラザーズ
Brawl Alt JP: スマッシュボールを手にしたマリオが放つ最後の切りふだ。両手から龍のような2つの炎を放ち、フィールドの相手に大ダメージを与える。上下に広がりながら飛ぶため、フィールドの端、かつ高さのある地点で発動させれば効果的にダメージを与えられる。燃える瞳はこの一発にかける意気込みの証なのだろう。
(Wii) 大乱闘スマッシュブラザーズX

Smash 4 Trophy JP: おなじみのオーバーオール姿でクッパと戦う、ゲーム界を代表する存在。人並外れた跳躍力、様々な技を使い分ける変身、スポーツ万能など、挙げればきりがないほどの才能を持っている。『スマブラ』ではライバルの攻撃方法によって、様々な対抗策をもっているオールラウンダー。使用ファイターに迷ったらマリオを選ぶといい。
Smash 4 Works JP: (AC) ドンキーコング (1981)
(FC) スーパーマリオブラザーズ (1985/09)
Smash 4 Alt JP: 「スーパージャンプパンチ」は高く飛び上がり、突き上げた拳で相手を打ち上げる上必殺ワザ。ワザを出した直後、一瞬だけ無敵になる。また、地上で相手に密着して出すと全段ヒットする。横必殺ワザ「スーパーマント」は命中した相手を反転させる。復帰ワザで場外から戻ろうとする相手に繰り出せば復帰を阻止することも可能。
(AC) ドンキーコング (1981)
(FC) スーパーマリオブラザーズ (1985/09)

Ultimate Fighter Tips JP: 
マリオの初登場作品
マリオが初めて登場した作品はアーケード版『ドンキーコング』。当時のマリオは、
青いシャツに赤のオーバーオール姿と、今とは色が逆だった。
原作では
マリオと言えば「Mamma Mia!」や「It's-a me, Mario!」などの特徴的なセリフ。
『スーパーマリオ64』ではじめて声が入り、いまもそのままのイメージ。
アクションゲームの金字塔
マリオの代表作『スーパーマリオ』シリーズは、２０１８年１２月の時点で
３５タイトルが発売され、全世界で累計３億４０００万本以上売り上げている。
マリオとルイージの能力の違い
『スーパーマリオブラザーズ2』で、初めてマリオとルイージに能力差が
ついた。ルイージはマリオよりジャンプが高く、滑りやすい。
マリオの名前は……
アーケード版『ドンキーコング』で初登場のマリオは、「ジャンプマン」と呼ばれていた。
当初、さらわれた女性の名前は「レディ」だったが、後に「ポリーン」と名付けられた。
ここにもマリオが!?
１９８７年に登場したファミコン版『パンチアウト!!』のレフェリーはマリオ。
白いシャツに蝶ネクタイのレフェリー姿だが、いつもの帽子はそのまま。
スーパーマリオサンシャインでのポンプ
『スーパーマリオサンシャイン』に登場した、「オヤ・マーサイエンス社」の商品。
放水することで敵を倒せたり、ノズルを変えることで性能が変化する、頼れる相棒。
ビルダーマリオ
7Pカラーを選択すると『スーパーマリオメーカー』でおなじみの、
「ビルダーマリオ」の姿でプレイすることができる。
ウェディングスタイル
8Pカラーを選択すると、『スーパーマリオ オデッセイ』で着ることができる衣装、
「ウェディングスタイル」のマリオで、プレイすることができる。
スーパーマントの効果 【横必殺ワザ】
スーパーマントには、相手を反転させる効果がある。
復帰しようとしている相手に使うと有効。
スーパーマントで回避 【横必殺ワザ】
空中で使うと落下速度が一瞬遅くなる。特に１回目は効果が強く、
体がふわっと浮き上がるので、相手の攻撃の回避にも使える。
スーパーマントで操作も反転 【横必殺ワザ】
スーパーマントには、相手を反転させるだけでなく、
少しの間、相手の操作も反転させる効果がある。
スーパージャンプパンチ 【上必殺ワザ】
飛び出るコインが、『スーパーマリオ オデッセイ』のローカルコインになることがある。
その時は、マリオのぼうしも「キャッピー」に変化！
ポンプで復帰阻止 【下必殺ワザ】
ポンプの水はネスやアイクなどの上必殺ワザでの復帰をとても邪魔しやすい。
相手によっては一撃必殺になるため、スキを見て積極的にためておくとよい。
ポンプ 【下必殺ワザ】
ダメージは与えられないが、水流で相手を強く押し返す。
復帰しようとする相手をジャマするのに便利。
ポンプとアイテム 【下必殺ワザ】
ポンプの水は、箱やカプセルなど、一部のアイテムを押し流すこともできる。
ボムへいなどの危険なアイテムを場外に押し流すのも戦略のひとつ。
ポンプでの放水 【下必殺ワザ】
スティックを上下に動かすことで、放水する角度を変えることができる。
放水量はためていた量に比例して多くなり、勢いも増す。
マリオファイナル 【最後の切りふだ】
最後の切りふだは、螺旋状に広がる一対の巨大な火炎球で、相手を巻き込み押し出す。
至近距離で当てればダメージを与えられるほか、復帰の妨害にも使いやすい。
マリオファイナル使用時の注意 【最後の切りふだ】
マリオファイナルを放つと同時に、少しずつ後ずさりをしている。
ガケや狭い足場の上で発動させると、いつの間にか空中に……なんてことも。
スマッシュヘッドバット 【上スマッシュ攻撃】
上方向に強烈な頭突きを放つ。この時、マリオの頭は無敵。
上から攻めてきた相手を迎え撃つのに便利。
メテオナックル 【前空中攻撃】
パンチを思いっきり下に振り下ろす。出るのがやや遅いが、
振り下ろす時にメテオの効果があり、相手を叩き落とす。
ジャイアントスイング 【後ろ投げ】
相手をつかんで振り回す時、他のファイターを巻き込んで攻撃できる。
上手く使えば、乱戦で上手く相手にダメージを与えられる。
`;

async function run() {
  console.log("Fetching Mario ID...");
  const mario = await db.fighter.findFirst({ where: { name: 'Mario' } });
  if (!mario) return console.log("Mario not found");
  
  console.log("Parsing template...");
  const data = parseFighterTemplate(marioText);
  const id = mario.id;

  // 1. Bios (SSB64)
  if (data.n64BiosEn || data.n64BiosJp) {
    await db.fighterBio.upsert({
      where: { fighterId_smashGameVersion: { fighterId: id, smashGameVersion: "SSB64" } },
      create: {
        fighterId: id,
        smashGameVersion: "SSB64",
        contentEn: data.n64BiosEn || "",
        contentJp: data.n64BiosJp || null,
      },
      update: {
        ...(data.n64BiosEn ? { contentEn: data.n64BiosEn } : {}),
        ...(data.n64BiosJp ? { contentJp: data.n64BiosJp } : {}),
      }
    });
  }

  // 2. Ultimate Fan Description (Overview EN)
  if (data.ultimateFanEn) {
    await db.fighter.update({
      where: { id },
      data: { curatorOverviewEn: data.ultimateFanEn }
    });
  }

  const upsertCollectible = async (
    ver: string, type: string, nameEn: string,
    descEn?: string, descJp?: string
  ) => {
    if (!descEn && !descJp) return;
    const safeName = nameEn.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
    const collId = `${type}-${ver}-${id}-${safeName}`;
    await db.collectible.upsert({
      where: { id: collId },
      create: {
        id: collId,
        fighterId: id,
        smashGameVersion: ver,
        type: type,
        name: nameEn,
        description: descEn || null,
        descriptionJp: descJp || null,
      },
      update: {
        ...(descEn ? { description: descEn } : {}),
        ...(descJp ? { descriptionJp: descJp } : {}),
      }
    });
  };

  // 3. Melee Trophies
  await upsertCollectible("SSBM", "TROPHY", "Classic", data.meleeTrophyEn, data.meleeTrophyJp);
  await upsertCollectible("SSBM", "TROPHY", "Smash 1", data.meleeSmash1En, data.meleeSmash1Jp);
  await upsertCollectible("SSBM", "TROPHY", "Smash 2", data.meleeSmash2En, data.meleeSmash2Jp);

  // 4. Brawl Trophies
  await upsertCollectible("SSBB", "TROPHY", "Classic", data.brawlTrophyEn, data.brawlTrophyJp);
  await upsertCollectible("SSBB", "TROPHY", "Final Smash", data.brawlAltEn, data.brawlAltJp);

  // 5. Smash 4 Trophies
  await upsertCollectible("SSB4", "TROPHY", "Classic", data.smash4TrophyEn, data.smash4TrophyJp);
  await upsertCollectible("SSB4", "TROPHY", "Alt", data.smash4AltEn, data.smash4AltJp);

  // 6. Ultimate Tips
  const processTips = async (tipsEnText?: string, tipsJpText?: string) => {
    // Process EN Tips First
    if (tipsEnText) {
      const tipLines = tipsEnText.split("\n").map(l => l.trim()).filter(Boolean);
      for (const line of tipLines) {
        const match = line.match(/^(\([★☆]{3}\))\s*(.*?)[:–-]\s*(.*)$/);
        if (match) {
          const title = `${match[1]} ${match[2]}`.trim();
          const content = match[3].trim();
          
          const existing = await db.fighterTip.findFirst({ where: { fighterId: id, titleEn: title } });
          if (existing) {
            await db.fighterTip.update({ where: { id: existing.id }, data: { textEn: content } });
          } else {
            await db.fighterTip.create({ data: { fighterId: id, titleEn: title, textEn: content } });
          }
        }
      }
    }

    // Process JP Tips via Heuristic and match by index
    if (tipsJpText) {
      const allTips = await db.fighterTip.findMany({
        where: { fighterId: id },
        orderBy: { id: 'asc' }
      });

      const lines = tipsJpText.split("\n").map(l => l.trim()).filter(Boolean);
      const parsedJpTips: { title: string, content: string }[] = [];
      let currentTitle = "";
      let currentContent: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!currentTitle) {
          currentTitle = line;
          continue;
        }

        const lastLine = currentContent.length > 0 ? currentContent[currentContent.length - 1] : "";
        if (lastLine && (lastLine.endsWith('。') || lastLine.endsWith('！') || lastLine.endsWith('？') || lastLine.endsWith('」'))) {
          if (!line.endsWith('。') && !line.endsWith('、') && !line.endsWith('」')) {
            // New title found
            parsedJpTips.push({ title: currentTitle, content: currentContent.join('\n') });
            currentTitle = line;
            currentContent = [];
            continue;
          }
        }
        currentContent.push(line);
      }
      if (currentTitle) {
        parsedJpTips.push({ title: currentTitle, content: currentContent.join('\n') });
      }

      for (let i = 0; i < parsedJpTips.length; i++) {
        const jpTip = parsedJpTips[i];
        if (allTips[i]) {
          await db.fighterTip.update({
            where: { id: allTips[i].id },
            data: { titleJp: jpTip.title, textJp: jpTip.content }
          });
        } else {
          await db.fighterTip.create({
            data: {
              fighterId: id,
              titleEn: `[JP Only] ${jpTip.title}`,
              textEn: "",
              titleJp: jpTip.title,
              textJp: jpTip.content
            }
          });
        }
      }
    }
  };

  await processTips(data.ultimateTipsEn, data.ultimateTipsJp);
  
  console.log("Successfully ingested Mario!");
  await db.$disconnect();
}

run().catch(console.error);
