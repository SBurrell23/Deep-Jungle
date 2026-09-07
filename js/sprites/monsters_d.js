// js/sprites/monsters_d.js — Tier 4 monsters (levels 10–12) + elites 95–96
// Text pixel grids; see docs/ART_SPEC.md. Monsters FACE LEFT.
(function () {
  const S = (window.DJ = window.DJ || {}).SPRITES || (DJ.SPRITES = {});

  // 55 — Elder Treant: big gnarled tree, mossy beard face, thick arm-branches
  S.elder_treant = {
    w: 32, h: 32,
    pal: {
      k: '#1a1410', // outline
      b: '#4a3020', // bark dark
      c: '#6e4a2e', // bark mid
      d: '#8f6a44', // bark light
      g: '#2e6b2a', // leaf dark
      h: '#4d9a3c', // leaf mid
      m: '#7fc45a', // moss / leaf light
      e: '#ffd23a', // eyes
    },
    px: [
      '..........kkkkkkkkkkk...........',
      '.......kkkgghhhhhhhggkkk........',
      '.....kkgghhhhmmhhhhhhhggkk......',
      '....kghhhhmmhhhhhhhhhhhhhgk.....',
      '...kghhhhhhhhhhmmhhhhhhhhhgk....',
      '..kghhhhhhhhhhhhhhhhhhhhhhhgk...',
      '..kgghhhhhhhhhhhhhhhhhhhhhhggk..',
      '.kgggghhhhhhgggggghhhhhhhhggggk.',
      '.kkgggggghhkkbbbbbkkhhhggggggkk.',
      '..kkkkkggkbbccccccbbkgggkkkkk...',
      '.....kkkkbbccddccccbbkkkk.......',
      '........kbccbbbbbccdbk..........',
      '........kbcbeekbeekdbk..........',
      '........kbcbeekbeekdbk..........',
      '........kbccbcccbccdbk..........',
      '......kkkbccmmmmmmcdbk.kk.......',
      '....kkbbbbcmmhmmhmmcdbbbbkk.....',
      '..kkbbccbbbmmmmmmmmcdbbccbbkk...',
      '.kbbccbbkkbcmmmmmmccdbkkbbccbbk.',
      'kbccbkk..kbccmmmmcccdbk..kkbccbk',
      'kbcbk....kbccmmmmcccdbk....kbcbk',
      'kbkk.....kbccdmmccccdbk.....kkbk',
      'kk.......kbccddcccccdbk.......kk',
      '.........kbccddccccccbk.........',
      '........kbbccddccccccdbk........',
      '.......kbbcccddcccccccdbk.......',
      '......kbbccccddccccbcccdbk......',
      '.....kbbcccbbkbbcccbkbccddbk....',
      '....kbbccbkk.kbbccbk.kbbcddbk...',
      '...kbbccbk...kbbcbk...kbccdbk...',
      '..kbbcbkk....kbbbk....kbccbkk...',
      '..kkkkk......kkkkk....kkkkkk....',
    ],
  };

  // 56 — Basilisk: six-legged green lizard-serpent, red crest, glowing eyes
  S.basilisk = {
    w: 32, h: 32,
    pal: {
      k: '#10201a', // outline
      b: '#245a2c', // scale dark
      c: '#3f8a3c', // scale mid
      d: '#7cc35a', // scale light
      u: '#b8c97a', // belly
      r: '#c8412d', // crest dark
      s: '#e8804a', // crest light
      e: '#f4e04b', // eyes
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '.......k.k.k....................',
      '......krkrkrk.........kkkkk.....',
      '......krsrsrk........kbdddbk....',
      '.....kkrrrrrkk......kbdccccbk...',
      '....kbccccccbbk.....kbck.kcbk...',
      '...kbcdddddcccbk....kbck..kbk...',
      '..kbcdddddddcccbk...kbck...kk...',
      '.kbcdeekdddcccccbk..kbcck.......',
      '.kbcdeekddccccccccbkkbcck.......',
      'kbcccdddddccccccccbbbbccbk......',
      'kbkkkkkkcccccccccccccccccbk.....',
      'kbuucccccccccccdddccccccccbk....',
      'kbuuuuccccccccdddddddcccccbk....',
      '.kbuuuuucccccddddddddddccccbk...',
      '.kbuuuuuuucccdddddddddddcccbk...',
      '..kbuuuuuuuuccccdddddddccccccbk.',
      '..kbuuuuuuuuuuucccccccccccccccbk',
      '...kbuuuuuuuuuuuuuucccccccccccbk',
      '....kbbuuuuuuuuuuuuuuuuccccccbk.',
      '.....kkbbbbbbbbbbbbbbbbbbbbbbkk.',
      '.....kcdkbbk.kcdkbbk.kcdkbbk....',
      '.....kcdkbbk.kcdkbbk.kcdkbbk....',
      '.....kcdkbbk.kcdkbbk.kcdkbbk....',
      '.....kcdkbbk.kcdkbbk.kcdkbbk....',
      '....kccdkbbkkccdkbbkkccdkbbk....',
      '....kkkkk.kkkkkkk.kkkkkkk.kk....',
      '................................',
      '................................',
    ],
  };

  // 57 — Fire Salamander: orange-red salamander with flames along its back
  S.fire_salamander = {
    w: 32, h: 32,
    pal: {
      k: '#2a0e0a', // outline
      b: '#8c2a1a', // skin dark
      c: '#d9532a', // skin mid
      d: '#f08a3c', // skin light
      s: '#f3c48a', // belly
      f: '#ff7a1a', // flame
      y: '#ffd94a', // flame bright
      e: '#ffff88', // eyes
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '..........y......y..............',
      '.........yfy....yfy.............',
      '.........yfy...yffy.....kkkk....',
      '........yffy..yfffyy...kbddbk...',
      '........yffyyyffffyfy..kbcbkck..',
      '.......yffffffffffffy..kbck.kk..',
      '.......kffffffkffffffkkkbcck....',
      '......kbcfffkkbccfffffkbbcck....',
      '.....kbccbkkkkbcccfffkbccccbk...',
      '....kbcccbbbbbccccbbbbcccccbk...',
      '...kbccddcccccccccccccccccccbk..',
      '..kbceekddccccccccddddcccccccbk.',
      '.kbceekddddcccccdddddddcccccbk..',
      '.kbccccccddcccccccdddddddccccbk.',
      'kbccccccccccccccccccdddddccccbk.',
      'kbkkkkcccccccccccccccccddccccbk.',
      'kbsssssscccccccccccccccccccbbk..',
      '.kbsssssssccccccccccccccccbkk...',
      '..kbsssssssssccccccccccccbbk....',
      '...kkbbssssssssssssssssbbkk.....',
      '.....kbcckkbbbbbbbbbbkkbcck.....',
      '.....kbcck..........kbcck.......',
      '....kbccck.........kbccck.......',
      '....kccdckk.......kkccdckk......',
      '...kkkkkkk........kkkkkkk.......',
      '................................',
      '................................',
    ],
  };

  // 58 — Shadow Ape: black smoky ape, white glowing eyes, knuckle-walking
  S.shadow_ape = {
    w: 32, h: 32,
    pal: {
      k: '#07040c', // outline
      b: '#171024', // body dark
      c: '#261a3c', // body mid
      d: '#3d2d5e', // body light
      s: '#5a4a80', // smoke
      f: '#c8c0e0', // fangs
      e: '#ffffff', // eyes
    },
    px: [
      '................................',
      '..................s.............',
      '.................ss....s........',
      '..........s.......s...ss........',
      '.........ss......sss..s.........',
      '..........s.....kkkkkkkk........',
      '.......kkkkk..kkddddddddkk......',
      '.....kkddddkkkkddddddddddddk....',
      '....kdddccccdddddcccccccccdck...',
      '...kddccccccccccccccccccccccdk..',
      '..kdccccccccccccccbbbbbbccccck..',
      '..kdcbeecbbcccccccbbbbbbbcccbbk.',
      '.kdcbbeecbbbccccccccbbbbbbbccbbk',
      '.kdcbbbbbbbbbccccccccbbbbbbbbbbk',
      '.kdcbffffbbbbkcccccccbbbbbbbbbbk',
      '.kdcbfkkkfbbbkccccccccbbbbbbbbbk',
      '..kcbbffffbbbkccccccccccbbbbbbk.',
      '..kkcbbbbbbbkkcccccccccccbbbbbk.',
      '...kkbbbbbbkkccccccccccccbbbbbk.',
      '.....kkkkkccccccccccccccbbbbbbk.',
      '......kdcccccccccccccccbbbbbbk..',
      '.....kdccccccckkbbbbbbbbbbbbbk..',
      '....kdcccccck..kbbbbbbbbbbbbk...',
      '....kdccccck....kbbbbbbbbbbk....',
      '...kdcccccck.....kbbbbbkbbbbk...',
      '...kdccccck......kbbbbk.kbbbbk..',
      '..kdccccccck.....kbbbbk..kbbbk..',
      '..kdcccccck......kbbbk...kbbbk..',
      '..kdcccccck.....kbbbbk...kbbbbk.',
      '.kdccccccck.....kbbbbk..kbbbbbk.',
      '.kkkkkkkkkk.....kkkkkk..kkkkkkk.',
      '................................',
    ],
  };

  // 59 — Stone Idol: walking carved stone statue with tribal face, moss
  S.stone_idol = {
    w: 32, h: 32,
    pal: {
      k: '#14161a', // outline
      b: '#4a4f58', // stone dark
      c: '#737a85', // stone mid
      d: '#a2aab5', // stone light
      m: '#5aa03a', // moss
      n: '#3a7028', // moss dark
      e: '#ff9a2a', // eye glow
    },
    px: [
      '................................',
      '.........kkkkkkkkkkkkkk.........',
      '........kdddddddddddddbk........',
      '.......kddcccmmmccccccbbk.......',
      '.......kdccccnmcccccccbbk.......',
      '......kkkkkkkkcccccccccbbk......',
      '.....kdcbbbbbbkccccccccbbk......',
      '.....kdcbkeekbkcccccccccbk......',
      '.....kdcbkeekbkcccccccccbk......',
      '....kkdccbbbbbcccccccccccbk.....',
      '...kdddcccccccccccccccccbbk.....',
      '..kdccccccccccccccccccccbbk.....',
      '..kdcccbbkccccccccccccccbbk.....',
      '..kkkkkkkkccccccccccccccbbk.....',
      '....kdcbkkkkkkkkcccccccccbk.....',
      '....kdcbdkdkdkdbkccccccccbk.....',
      '....kdcbkkkkkkkkcccccccccbk.....',
      '.....kdccbbbbbcccccccccccbk.....',
      '.....kkdcccccccccccccccbbbk.....',
      '......kkkdddccccccccccbbkk......',
      '.....kdddccccccccccccccbbbk.....',
      '....kdccccbbbbccccccbbbbcbbk....',
      '....kdcccbmmmbcccccbccccbbbk....',
      '....kdcccbmmnbcccccbcccbcbbk....',
      '....kdccccbbbbccccccbbbbcbbk....',
      '....kdcccccccccccccccccccbbk....',
      '.....kddcccccccccccccccbbbk.....',
      '.....kkkbccbkkkkkkkkbccbkkk.....',
      '.......kbccbk......kbccbk.......',
      '......kdcccbk.....kdcccbk.......',
      '......kddccbk.....kddccbk.......',
      '......kkkkkkk.....kkkkkkk.......',
    ],
  };

  // 60 — Manticore: lion body, bat wings, scorpion tail, human-ish face
  S.manticore = {
    w: 32, h: 32,
    pal: {
      k: '#2a1a0e', // outline
      b: '#a8672c', // fur dark
      c: '#d49348', // fur mid
      d: '#efc47a', // fur light / face
      m: '#6e3a1a', // mane dark
      n: '#8f4e22', // mane mid
      w: '#4a2a3a', // wing dark
      x: '#6a3f55', // wing light
      e: '#ff3030', // eyes / stinger
    },
    px: [
      '................................',
      '................................',
      '............k..........kkk......',
      '...........kwk........kbbbk.....',
      '..........kwwxk......kbkkkbk....',
      '..........kwwxxk.....kbk.kkbk...',
      '.........kwwxxxxk...kbk...kbk...',
      '.........kwwxxxxxk..kbk...kbk...',
      '....kkkk.kwwxxxxxxk.kbck..kek...',
      '...kmmnnkkwwxxxxxxxkkbck..kkk...',
      '..kmmnnnnkkwwxxxxxxxkbck........',
      '.kmmnddddnkkwwxxxxxxkbcck.......',
      '.kmnddeedddnkwwwwwwwwbcck.......',
      'kmmnddkedddnkkkkkkkkbccbk.......',
      'kmnnddddddnnnbbbbbbbbbccbk......',
      'kmnnddkdddnnbbccccccccccbbk.....',
      'kmnnddddddnnbcccccccccccbbbk....',
      '.kmnnkkkdnnbcccccccccccccbbk....',
      '.kmmnnnnnnbbcccccccccccccbbk....',
      '..kmmmmmmbbccccccccccccccbbk....',
      '...kkkkkbbcccccccccccccccbbk....',
      '.....kbbbccccccccccccccccbbk....',
      '.....kbbcccccccccccccccccbbk....',
      '....kbbcccccbbbbbbbccccccbbk....',
      '....kbccccbbkkkkkkbbcccccbbk....',
      '....kbcccbk......kbccccbbbbk....',
      '....kbccbk.......kbcccbkkbbk....',
      '....kbcbk........kbccbk.kbbk....',
      '...kbcccbk......kbcccbk.kbbbk...',
      '...kbccccbk.....kbccccbkkbbbbk..',
      '...kkkkkkkk.....kkkkkkkkkkkkkk..',
      '................................',
    ],
  };

  // 61 - Swamp Hag: hunched green-skinned hag, tattered robe, long nails
  S.swamp_hag = {
    w: 32, h: 32,
    pal: {
      k: '#150f1c', // outline
      b: '#2c2340', // robe dark
      c: '#463a5e', // robe mid
      d: '#63537f', // robe light
      g: '#3d6b32', // skin dark
      h: '#5f9448', // skin mid
      j: '#8bbb63', // skin light
      n: '#e8e2c4', // nails / teeth
      e: '#ffe14a', // eye
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................kkk.............',
      '...............kkckk............',
      '...............kcdckk...........',
      '..............kkddddkk..........',
      '..............kddddddkkk........',
      '.............kkddddddddkk.......',
      '............kkdddddddddckk......',
      '........kkkkkkddddddddbbbk......',
      '.......kkgkkhkkkkdccbbbbbk......',
      '......kkggjjjgjhgkcbbbbbbk......',
      '......kggjjjjgjjgkcbbbbbbk......',
      '......kgkkkkjgjhggcbbbbbbk......',
      '......kgeehjhgghhgkbbbbbbk......',
      '.....kkggehhhhghhgkbbbbbbk......',
      '...kkkhhghhhhhghhggbbbbbbk......',
      '.kkkhhhhghhhghghhkgbbbbbbkk.....',
      '.khhhhhhggggghghhkgcbbbbbkk.....',
      '.kkkggkgggggggghkkgcbbbbbkk.....',
      'kkkkkkkkkhhhhggkkgkkkkkkkkk.....',
      'nnkknhhhknknkghkhgkbbbbbbbkk....',
      'knnkhhhhkkhhhghkhgkbbbbbbbbk....',
      'kknnhhhhhkhhhgkkgkkbbbbbbbbk....',
      '.kkhhhghhkkkkkkkgkbbbbbbbbbk....',
      '.kkkhggghggkkkkkbbbbkbbbbbkk....',
      'kknngggggkkkddkcbcbbkbbbbbk.....',
      'nnnkkgggkkdbdkkkbcbkkkbbbkk.....',
      'kkkkkngkkkdbdk.kbcbk.kbbbk......',
      '...knnkk.kkkkk.kkkkk.kkkkk......',
      '...knkk.........................',
    ],
  };

  // 62 - Carnivorous Bloom: giant red-purple flower with toothy maw and tentacle leaves
  S.carnivorous_bloom = {
    w: 32, h: 32,
    pal: {
      k: '#1c0a18', // outline
      b: '#6d1030', // petal dark
      c: '#a3204f', // petal mid
      d: '#d9407a', // petal light
      p: '#43164e', // throat
      g: '#2f6b32', // stem dark
      h: '#57a83f', // stem light
      n: '#f2e6d0', // fangs
      e: '#ff8a2a', // gullet glow
      y: '#ffe14a', // core glow
    },
    px: [
      '......kkkdddbdddkkkkckkkkk......',
      '......kdddddbddddddccbccckkk....',
      '....kkkdddddbbdddddddbddddckk...',
      '.kkkkddddddddbddddddbdddddddk...',
      'kkdddddddddddbddddddbdddddddkk..',
      'kdddbddddddddbdddddbbddddddddk..',
      'kddddbbdddkkkkkddddbdddddddddkkk',
      'kdddddkkkkknnnkkkkkbdddddddddddk',
      'ddddddknnnnnnnnnnnkbdddddddddddc',
      'kdddkkknnnnnnnnnnnkkkddddddddddc',
      'kdddknnnnpnknpnpnnnnkddddddddbbc',
      'kdkkknnnnknknknpnnnnkkkdddbbbccc',
      'kkknnnnkkkkekkkkppnnnnkbbbbccccc',
      '.kkknpnkkeeeeekkkpnpnkkbcccccccc',
      '..kknpkkeeeyeeekkpppnkkccccccccc',
      '..kppkkeeeyyyeeekkppppkccccbcccc',
      '..kknpkkeeeyeeekkpppnkkcbbbbbbcc',
      '.kkknpnkkeeeeekkkpnpnkkbbbbbbbbk',
      'kkknnnnkkkkenkkkppnnnnkbbbbbbbbb',
      'kckkknnnnknknknpnnnnkkkbbbbbbbbb',
      'kcccknnnnpnknpnpnnnnkbbbbbbbbbbb',
      'kcbbkkknnnnnnnnnnnkkkbbbbbbbbbbb',
      'cbbcccknnnnnnnnnnnkbbbbbbbbbbbbb',
      'kccccckkkkkkpkkkkkkbbbbbbbbbbbbb',
      'kcccccccccckkkbbbbbbbbbbbbbbbbbb',
      'kccccccccccccbbbbbbbbbbbbbbbbbbk',
      'kkccccccccccbcbbbbbbbbbbbbbbbbkk',
      'kkkkkcccccccbcbbbbbbbbbbbbbbkkkg',
      'kgggkkkcccccbccbbbbbbbbbbbbbkghg',
      'gghhhhkccccbccccbbbbbbbbbbkkkhhg',
      'gghhhgkkkccbcccckkkkkbkkkkkghhgg',
      'kkgkkkkkkkkkckkkkgggkkk.kkkkkghg',
    ],
  };

  // 63 - Obsidian Beetle: huge glossy black beetle with purple sheen and horns
  S.obsidian_beetle = {
    w: 32, h: 32,
    pal: {
      k: '#080510', // outline
      b: '#170f26', // shell dark
      c: '#2a1b45', // shell mid
      d: '#4a2f72', // shell purple sheen
      s: '#8f70cc', // gloss highlight
      n: '#c0aee0', // mandible
      e: '#ff9a2a', // eye glow
    },
    px: [
      'kkkkkkk.........................',
      'kdkdddkk........................',
      'kdsdsddkk.......................',
      'kkddddddkk......................',
      '.kddddsddkk.....................',
      '.kkddddsddkk....................',
      '..kkkkddsddk........kkk.........',
      '.....kkdssdkk...kkkkkckkkkk.....',
      '......kkdssdk.kkkdsdddddddkkk...',
      '.......kddsdkkkkssssssddddddkk..',
      'kkkk...kkdssdkcksssssssddddddkk.',
      'knnkkkkkkddsdkckssssssdddddddck.',
      'knnnkckkkkdddkdkddsdddddddsdddkk',
      'kknndccckkkkkkdkdddddddddddsdcck',
      '.kdddddcckdbdddkdddddddddddddcck',
      'kkkeedddckkbddckddddddddddddccck',
      'kceeeddccckbccckkkkkkkddddbbbbcc',
      'kkccdcccckkbcccckcccdkkkkkkkkkkk',
      'kkccccccckcbcccckccbbbbbbbbbbbbk',
      'knnncccckkcbcccckcbbbbbbbbbbbbbk',
      'nnnkkckkkccbcccckcbbbbbbbbbbbbkk',
      'kkkkkkkkkkkkcccckbbbbbbbbbbbbbk.',
      '.....kkcccckkkkkkcbbbbbbbbbbbkk.',
      '....kkcccccckkkcccbbbbbbbbbbkkk.',
      '....kccccckkk.kkkccbbbbbbbkkkbk.',
      '...kkccckkk..kkckkkkkbkkkkkckbkk',
      '...kccckkkk.kkccckkkkkkkkccckkbk',
      '...kccckkk..kccckkbk....kkccckbk',
      '..kkccckk...kccckbkk.....kccckkk',
      'kkkccckk...kkcckkkk......kccckk.',
      'kbbbbck..kkkccckkk.......kccckkk',
      'kkkkckk..kbbbbck.........kcbbbbk',
    ],
  };

  // 64 - Serpent Priest: naga with golden headdress holding a snake staff
  S.serpent_priest = {
    w: 32, h: 32,
    pal: {
      k: '#101a24', // outline
      b: '#1d4a4e', // tail dark
      c: '#2f7a72', // tail mid
      d: '#59b39a', // tail light
      i: '#2c5c3a', // body dark
      j: '#43804d', // body mid
      u: '#74b46b', // body light
      y: '#b8871e', // gold dark
      w: '#f6d24a', // gold light
      r: '#4a3320', // staff
      t: '#7a5634', // staff light
      g: '#8ecf5a', // staff snake
      e: '#ff4a3a', // eyes / tongue
    },
    px: [
      '..............kkykkk......kkkk..',
      '.............kkyyyykkk...kkggkkk',
      '...........kkkyyyyyyykkkkkgggggk',
      '..........kkykkkywwyyyyykkkggggg',
      '.........kkkkkjkkkkwywyyyykkgggg',
      '.......kkkkjjjjjjjkkywwwyykrkkgg',
      '......kkiiiiiijjjjjkywwwyykkkggg',
      '...kkkkjjeeeuujjjjjkkwwwyyykkggg',
      '...kjjjjuekeuujjjjjjkwwwyyykgggk',
      '...kjjjjjjjjjjjjjjjkkyyyyyykgggk',
      'kkkkjjjjjjjijjjjjjjkyyyyyyykkgkk',
      'eekeeiiiiiiiijjjjjkkyyyykkkkkkk.',
      'keekkkkkkkkkkkjkkkkkkkkkkrtrk...',
      'kekk...kyyyyykkkyyyyyyykkktrk...',
      'ekk....kkyyyyyywyyyyyykkjkkkk...',
      'kk......kkyyyyyyyyyyykkjjjjkk...',
      '.......kkkkkkkkykkkkkkjjjjjjk...',
      '.......kjjjjjukkkiiiiiijjjjjk...',
      '.......kjjjjuuuuuiiiiiikkjjjkkk.',
      '.......kjjjjuuuujiiiiiikkjjjkckk',
      '......kkjjjjjujjiiiiiiiikjjjkkck',
      '.....kkkjjjjjjjjjiiiiiiijjjjjkcc',
      '....kkdkjjjjjjjjjiiiiiiijjjjjkkc',
      '....kckkjjjjjjjjjiiiiiijjjjjjjkc',
      '....kkkjjjjjjjkkkkkkkkkkjjjjjkkc',
      '....kkkkjjjjjkkbbbbbbbbkjjjjjkcc',
      '...kkcckjjjjjkccccbcccckkkjkkkck',
      '..kkcddkkkjkkkdddddbccccckkkccck',
      '..kcccccdkkkbbbbbbdbbbbbbbbbbbcc',
      '..kkcccbbbbbbdbbbbbbbbbdbbbbbbbk',
      '...kkccccbbbbbbbbbbbbbbbbbbbbbkk',
      '....kkkkcccccccccccbccccccckkkk.',
    ],
  };

  // 65 - Thunder Gorilla: massive silverback with blue lightning scars
  S.thunder_gorilla = {
    w: 32, h: 32,
    pal: {
      k: '#090b12', // outline
      b: '#2b3247', // fur dark
      c: '#4b5674', // fur mid
      d: '#bcc6da', // silver back
      f: '#463a34', // face dark
      g: '#7d6a5a', // muzzle
      e: '#6fe0ff', // lightning / eyes
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '....................kkk.........',
      '................kkkkkbkkkkk.....',
      '...............kkdbbbbbbbbkk....',
      '......kkk....kkkdbbbbbbbbbbkkk..',
      '...kkkkckkkk.kbdddbbbbbbbbbddk..',
      '..kkccccbcckkkddddddddbddddddkk.',
      '.kkcccbbbbbbkkbdddddddddddddddk.',
      '.kcccbbbbbbbckbbdddddddddddddbk.',
      '.kccccbbbbbcckkbbddddddddddddbkk',
      'kkkkkkkkbcccckkkkbbbbbdbdddddbbk',
      'feefeeffcccccckckbbbbbbdddddddkk',
      'feefeeffccccckkckbbcbbbbdddddbk.',
      'ffgggggffcccckcckccccecbdddddbk.',
      'kkkkkkkgfcceckcckccceccccdedbkk.',
      'gkggkggggceckkcckcceeccccbebbkk.',
      'kkkkccccceekkccckcccceeccebbbkk.',
      '...kkkkckkeecccckcccceccceebkkkk',
      '......kkkbccbccckccceccccbeekbbk',
      '.......kccbbbbbckkkkkkkkkkkbbbbk',
      '.......kkbbbbbbbck..kkcccccbbbck',
      '........kbbbbcbbbk...kccccbcbcck',
      '........kkccccccckk.kkbbbbbbbbbk',
      '........kccdccdccck.kbbbbbbbbbbb',
      '........kkccccccckk.kkbbbbbbbbbk',
    ],
  };

  // 66 - Wraith of the Canopy: tattered dark green spirit in a leaf cloak
  S.canopy_wraith = {
    w: 32, h: 32,
    pal: {
      k: '#0a1410', // outline
      b: '#12291f', // shroud dark
      c: '#1e4331', // shroud mid
      d: '#367049', // shroud light
      g: '#2c6b28', // leaf dark
      m: '#4f9a37', // leaf light
      n: '#8ec45c', // leaf vein
      e: '#a8ffd8', // eyes
    },
    px: [
      '................kkkckk..........',
      '.............kkkkcccck..........',
      '...........kkkccccdcckk.........',
      '..........kkcccdddddddkk........',
      '.........kkccddddddddddk........',
      '........kkcccddddddddddkk.......',
      '........kcccdkddddddddddk.......',
      '........kckkkkkdddddddddkk......',
      '......kkkkkkkkkkddddddddck......',
      '.....kkckkkkkkkkkdddddbbbk......',
      '.....kcckeekkeekkcdbbbbbbk......',
      '.....kckkeekkeekkccbbbbbbk......',
      '.....kkkkeekkeekkccbbbbbbk......',
      '.....kkkkekkkekkccbbbbbbkkk.....',
      '...kkkmkkkkkkkkkcccbbbkkkmkkk...',
      '..kkmmmmmkkkkkkkcccbbkkmmmmmkk..',
      '.kkmmmmmmmkkkkkkcccbkkmmmmmmmkk.',
      '.knnnnnnnnnmkkkccckkkmnnnnnnnnk.',
      '.kkgggmggmmmmmkkkkkmmmmmgmgggkk.',
      '.kkkggggmmmmmmmkmkmmmmmmmgggkkkk',
      '.kckkkgnnnnnnnmmmnnnnnnnnnkkkbck',
      '.kcddkkkgggmgmmmmmgggmgggkkbbbck',
      '.kdddddkkgggnnnnnnngggggkkcbbbck',
      '.kcdddckkkkgkgggmgggkgkkkkbbbbbk',
      'kkcdddkkddkkkkgggggkkkkbbkcbbbck',
      'kccdddkkddbddkkkgkkkbkbbbkcbkbck',
      'kcccdcckdbbdddkkbkbbbkbbkkcbkbck',
      'kccckcckbbkkddkbbkkbbkbbkkcckcck',
      'kccckckkbbkkdkkbbkkbkkbbkkckkcck',
      'kkcckkkkbbkkkkkbbkkkkkbbkkkkkckk',
      '.kkkk..kbbk...kbbk...kbbk...kck.',
      '...k...kbkk...kbkk...kbkk...kkk.',
    ],
  };

  // 67 - Bog Hydra: three-headed dark green hydra rising from the muck
  S.bog_hydra = {
    w: 32, h: 32,
    pal: {
      k: '#0c1810', // outline
      b: '#12351f', // scale dark
      c: '#1f5c31', // scale mid
      d: '#3f8c46', // scale light
      p: '#3a3320', // muck dark
      q: '#6a5c35', // muck light
      n: '#e8e6c8', // teeth
      e: '#ffd23a', // eyes
    },
    px: [
      '................................',
      '................................',
      '................................',
      '.................kkkk...........',
      '...............kkkdckkk.........',
      '.........kkkkkkkdcdddckkk.......',
      '.........kccccccekddddddkk......',
      '.........kccncnceeccccccck......',
      '.........kkkkkkcccccccccck......',
      '..............kkcbccccccckkkkk..',
      '...........kkkkbbbcccccckkkdckkk',
      '.........kkkbbbbbbbccckkkdcddddk',
      '.........kbnbbbnbbbccckkcekddddd',
      '........kkkkbnbkkkkcccckceeccccc',
      '......kkkdckkkkk..kcccckcccccccc',
      'kkkkkkkdcddddkkk..kcccckccbccccc',
      'kccccccekddddddkk.kcccckbbbccccc',
      'kccncnceeccccccck.kcccckbbbbccck',
      'kkkkkkcccccccccck.kkcccknbbbccck',
      '.....kccbcccccckk.kcccbkbkkcccck',
      '..kkkkbbbcccccck.kkccbbkkkkcccck',
      'kkkbbbbbbbckkkkk.kcccbbk.kcccckk',
      'kbnbbbnbbbcck...kkccbbkkkkcccck.',
      'kkbbnbbkcccckkkkkkccbbkkccccckk.',
      '.kkkkkkkkcccckkckccbbkkcccbbck..',
      '..kkkkkkkcbbcckkkccbbkccbbbckk..',
      '.kkqkkkdkkbbbcckkccbkkcbbbkkkkkk',
      '.kqqqkkcdkkbbbckkccckcbbckkckkqk',
      'kkkqqkcccckkbbckkkkkkcckkkbcckqq',
      'kqqqqkkcccckkkkkbbbkkkkkbbbbkkqp',
      'pppqqqkccccccbbbbbbbbbbbbbbbkppp',
      'ppppppkkkcccccbbbbbbbbbbbbkkkppp',
    ],
  };

  // 68 - Spore Colossus: giant mushroom humanoid with many caps and a spore cloud
  S.spore_colossus = {
    w: 32, h: 32,
    pal: {
      k: '#150f16', // outline
      b: '#6a5540', // stalk dark
      c: '#a08a68', // stalk mid
      d: '#d2bd96', // stalk light
      r: '#6b2438', // cap dark
      t: '#a83c4e', // cap mid
      u: '#e0cfa8', // gills / spots
      s: '#9ac26a', // spores
      e: '#b6ff5a', // eye glow
    },
    px: [
      '.......kkskkkkukkkkkkkskk.......',
      '......kkskkkkuuurkkukkkkkkkk....',
      '...kkkkkkkttttutttuuuttkkkskk...',
      '..kkskkkttutttttuttutttttkkkkk..',
      '.kkssktttuuutttuuuttttutttrksk..',
      '.ksskkttttutttttuttttuuutrrkkk..',
      '.kkskrrrttttutttuttttuurrrrrk...',
      '..kkkkrruuuuuuuuuuuuuuuuurrkkkkk',
      '...kkkuuuuuuuuuuuuuuuuuuuuukkksk',
      '.....kkbubububububububububkkksss',
      '.kkk..kkkkrrrrrrurrrrrrkkkk.kksk',
      'kkskkkk..kkkkkkkrkkkkkkk.....kkk',
      'kskkktkkkkceeedkkkedccck..kkk...',
      'kkktttttkkceeecceeecccckkkktkkk.',
      'kkttuttttkkkkkcckkkcccckktttttkk',
      'krrtttttrrkccccccccccckkttuttttk',
      'kkrrrurrrkkkbbbbbbbbckkrrtttttrr',
      '.kuuuuuuukdkkkkkkkkkkkkkrrrurrrk',
      '.kkkkukkkkddddddcccbbbbkuuuuuuuk',
      '..kkkkkkkdbbbbbbbcbbbbbkkkkukkkk',
      'kkkbbbbkddddddddbbbbbbbbbkkkkkss',
      'kskbbbbkcdddddddcbbbbbbbbkbbbkkk',
      'sskbbbbkcdbbbbbbbbbbbbbbbkbbbbkk',
      'kskbbcbkkdddddddbbbbbbbbkkbcbbk.',
      'kkkccccckcdddddccbbbbbbbkccccck.',
      '.kbccccckkbbbbbbbbbbbbbkkccccckk',
      '.kcccccckkkkkkkkkkkkkkkkccccccck',
      '.kbccccckkbbccck..kbbcckkcccccbk',
      '.kkkkkkkkkbbccck..kbbccckkkkkkkk',
      '.......kkcbbccck.kkbbbccck......',
      '......kkbbbbbbbkkkbbbbbbbkk.....',
      '......kbbbbbbbbbkbbbbbbbbbk.....',
    ],
  };

  // 69 - Headhunter Chief: tall tribal warrior with skull mask, spear and shrunken heads
  S.headhunter_chief = {
    w: 32, h: 32,
    pal: {
      k: '#170f10', // outline
      b: '#3a2418', // skin dark
      c: '#5e3a22', // skin mid
      d: '#8a5a32', // skin light
      g: '#5a2a2a', // loincloth
      m: '#9c4f3a', // cloth trim / feather
      r: '#4a3320', // shaft / cord
      n: '#e6e0cc', // bone / skull
      u: '#ffffff', // bone highlight
      y: '#e0a02a', // beads / feather
      e: '#ff3a2a', // eye glow
    },
    px: [
      '...knkk..............kkkk.......',
      '..kkunk..........kkkkkmmkkkk....',
      '.kknunkk......kkkkdkkkkmkyuk....',
      '.knnunnk.....kkcdddndckkuuyk....',
      '.knnuunkk....knuuuuuddckukkk....',
      '.kknnunnk....kuuuuuudddkkkkkkk..',
      '..knnunkk...kkekuekuddckkkmmmk..',
      '..kknunk....knkknkknnccckmmmkk..',
      '...knnnk....knnkkknnncckkmkkk...',
      '...kkrrk....kknnknnnncckkkk.....',
      '...kyyykk...kkknknkkncckk.......',
      '...kkmyyk.kkkknnnnnnnckkkk......',
      '....kmykkkkcckkkccccckkckkk.....',
      '....kmykkcccccckkkkkkkccckkk....',
      '....kkkkcccdccckdddcccbcckckk...',
      '.....kkcccddcckkddddbbbbbkkckk..',
      '.....kkccddckkkddddbbbbbbbkcck..',
      '....kkccddckkdddddbbbbbbbbkcck..',
      '....kcccdckkddddddbbbbbbbbkcck..',
      '...kkccccckkcdddddbbbbbbbbkbck..',
      '...kccccckkkkkkkkkkkkkkkkkkbck..',
      '...kkcccckrkkmmmmmmmmmmmmkkkkk..',
      '....kcckkkbkkkmmmmmmmmmmmkkkrkk.',
      '....kkkkbbbbbkgmggmggmgggkkkbkkk',
      '......kkbbgbbkkmggmggmggkkbbbbbk',
      '......kbbegebbkmkkmkkmkkkkbbgbbk',
      '......kkgggggkkkkkkkkkkkkbbegebb',
      '......kkbknkbkcccckkbbbbkkgggggk',
      '......kkkkgkkkcdddkkbbccckbknkbk',
      '......krrkkkdccdddkkbbccckkkgkkk',
      '......kkrkkccccccckkbbbbbbbkkk..',
      '.......krkkccccccckkbbbbbbbk....',
    ],
  };

  // 70 - Emerald Wyrmling: small green dragon with bright emerald scales and wings
  S.emerald_wyrmling = {
    w: 32, h: 32,
    pal: {
      k: '#08180f', // outline
      b: '#0f4a2c', // scale dark
      c: '#1d7a3f', // scale mid
      d: '#45cf62', // scale light
      m: '#96f57e', // crest / claws
      u: '#dbe58c', // belly
      w: '#123c30', // wing bone
      x: '#2f8560', // wing membrane
      n: '#f0f4d8', // teeth
      e: '#ffd23a', // eye
    },
    px: [
      '................................',
      '..............kkkk..............',
      '.............kkmmk....kkk.......',
      '............kkmmmk....kwkkkk....',
      '........kkkkkmmkkk...kkwwwwkkkkk',
      '...kkkkkkdkmmmkkkk...kwwwwwwwwwk',
      '...kbbbbbddmmkkmmk..kkwwwxxwwwwk',
      '..kkkeeeddddddmmmk..kwxwwwxxxwkk',
      'kkkccekeddddmmmkkk.kkwxwxwwxxwk.',
      'kccccccccdddmmck...kwxxwxxwwwwk.',
      'kcnnnnnncccccckk...kwxxwxxxwwkk.',
      'kccccccbccccccck..kkxxxwwxxwwkk.',
      'kknkbbbbccccccckk.kwxxxxwxwwwwkk',
      'kbbbnbnbbccccccckkkkxxxxwxxwwwwk',
      'kkkkkkkkkkccccccckkkkkkkwxxxwwwk',
      '.........kcccccccckkmcckkxxxxxww',
      '.........kkcccccccckdccckkxwwwkk',
      '..........kkccccccckdcccckkwwkk.',
      '..........kkkcccccckddcccckkkk..',
      '..........kckkccccckbccccckk....',
      '.........kkcukccccckbbbbcckk....',
      '.........kcukkkkkkkkbbbbbcckk...',
      '.........kkkkccckkbbbbbbbbkkkkk.',
      '.........kukccccckubbbbbbbkccckk',
      '.........kkkccccckbbbbbbbbkddcck',
      '.........kkcccccckbbbbbbbkkkddck',
      '.........kcccccckkbbbbbbkkckcddc',
      '........kkccccckkbbbbbbkkcckccdc',
      '.......kkcccccckkkbkkkkkccckcdcc',
      '.......kcccccckk.kkkcccccckkdccc',
      '.......kmmmmmkk..kmmmmmcckkdccck',
      '.......kccccck...kkccccckkdccckk',
    ],
  };

  // 71 - Rot Bear: huge undead bear with exposed ribs and fungus
  S.rot_bear = {
    w: 32, h: 32,
    pal: {
      k: '#140f0e', // outline
      b: '#2a2a1e', // fur dark
      c: '#4a4530', // fur mid
      d: '#736947', // fur light
      g: '#5a2430', // exposed flesh
      n: '#ddd6b8', // bone / claws
      p: '#8f7a5a', // muzzle
      f: '#a84a1e', // fungus cap
      y: '#e8903a', // fungus light
      e: '#8ef07a', // eye glow
    },
    px: [
      '................................',
      '................................',
      '................................',
      '..................kkk...........',
      '............kkkkkkkykkkk........',
      '.........kkkkykkyyyyyyykk.......',
      '........kkyyyyyffffyffffk.......',
      '........kffffyfffffffffkkkk.....',
      '.......kkyfffffffkkfkkkkkykkk...',
      '......kkyyykkfkkkkkdkkkyyyyykk..',
      '...kkkkffyffkdkdddkdkkfffyfffk..',
      '.kkkcckkfffkkdkdddkdkkkfffffkk..',
      'kkbbbbbkkfkkkdkdddkkkdkkkfkkkk..',
      'ppkeeedckdkckkkddddddccckdkkykk.',
      'ppdekeddkdkckkddddddcccckdkyyykk',
      'cccccccckdkcckggcncccccckdffyffk',
      'cnnnnnnckkkckknnnncccccbkkkfffkk',
      'cccccgcccccckgggnngbbbbgggkkfkkk',
      'gngggggcccccknnnnngbbbbbgggkdkck',
      'kkkncnccccckkgggnngbbbbbgggkdkkk',
      '..kkkkkckkkknnnnnnggbbbbbbgkdkk.',
      '....kkkkknnnngggnngbbbbbbbbkkkk.',
      '....kkggggggnnnnnngbbbbbbbbbbkk.',
      '....kkgnnnnnngggnggbbbbbbbbbkk..',
      '....kkkgggggggggngbbbbbbbbbkkk..',
      '...kkbkkkgggggggbbbbbbbbbbkkbk..',
      '...kcbbckkkkgccccbbbbbbbkkkkbk..',
      '...kcbbcccckkkkkkkckkkkkkcckbk..',
      '...kcbbcccckbbk..kkkbbccccckbk..',
      '..kkcbbcccckcckk...kbbccccckckk.',
      '..knnnnnnnkkccck...knnnnnnkkcck.',
      '..kkkkkkkkkccckk...kkkkkkkkcckk.',
    ],
  };

  // 72 - Hollow Knight: empty rusted suit of armour animated by a green glow
  S.hollow_knight = {
    w: 32, h: 32,
    pal: {
      k: '#120d10', // outline
      b: '#38302a', // steel dark
      c: '#6a5a4a', // steel mid
      d: '#9c8a72', // steel light
      n: '#8f8a80', // blade
      u: '#d6d2c6', // blade edge
      r: '#a3521f', // rust
      e: '#3ad46a', // green glow
      g: '#ccffb4', // glow core
    },
    px: [
      '.kkkkkk........krrrrrk..........',
      '.kuuuuk......kkkrrrrrkkk........',
      '.knuuuk.....kkccccdcccck........',
      '.knuunk....kkcdddddddddkk.......',
      '.kknunkk..kkcdddddddddddk.......',
      '..knuunk..kcccdddddddddck.......',
      '..kknunkk.keeeeeeeeekccckk......',
      '...kkuunk.kkgkkgkkkkkcccck......',
      '....knunkkkddddcccccccccckkk....',
      '....kkuunkkddkkkkkkkkccckkckkk..',
      '.....knukkkkcccrrcccccckkcccckk.',
      '.....knkkcckkccrrcccccckcccccckk',
      '.....kkkddrkkkkkkkkkkkkkccccrddk',
      '......kkkdkkccckkkekkkkdddcdddkk',
      '......kkkkkcccckkegeekkkdddddkk.',
      '.......knkkcccckegggeekkkkdkkk..',
      '.......kkkccccckeegeekbbbkkkckk.',
      '.......kckcccckkkkekkbbbbbbkcck.',
      '.......kkkcccckcdckbbbbbrbbkcck.',
      '........kkcccckkcccbbbbbrbkkcck.',
      '.........kccccbkkkbbbbbbbbkccck.',
      '.........kkcbbbbbkbbbbbbbbkbcck.',
      '..........kcbbbbbkkbbbbbbrkbbbk.',
      '..........kbbbbbbbkbbbbbbrkbbbkk',
      '..........kkbbbbbkkkkkkkkkkbbbbk',
      '...........kbbbbbkckkbbkkbbbbbkk',
      '...........kkkbkkkdkkdddkbbbbbk.',
      '............kkkkccckkbbckkkbkkk.',
      '...........kkcbbccckkbbccckkk...',
      '...........kbbbbbbbbbbbbbbbbk...',
      '...........kbbbbbbbbbbbbbbbbk...',
      '...........kkkkkkkkkkkkkkkkkk...',
    ],
  };

  // 95 - Elder Basilisk (ELITE 40x40): huge crowned basilisk with petrifying glowing eyes
  S.elder_basilisk = {
    w: 40, h: 40,
    pal: {
      k: '#0d1a12', // outline
      b: '#14401f', // scale dark
      c: '#256b2e', // scale mid
      d: '#4cae42', // scale light
      u: '#c2cf7a', // belly
      r: '#7a5a2a', // crown / spine dark
      s: '#dcb85e', // crown light
      m: '#e8e2c0', // claws / tail spike
      n: '#f4f0d8', // teeth
      e: '#ffe14a', // petrifying eyes
      y: '#fffbc8', // eye core / glow
    },
    px: [
      '....kkk.kkk..kkrkk......................',
      '...kkrkkkrkk.krsrk..kkk.................',
      '...krsrrrsrkkkrsrk.kkrkk................',
      '...kkrssrssrkkrsrk.krsrk................',
      '....kkrssysrkkrsrkkkrsrk................',
      'kkk..kkrssrsrkksrkkrsskk................',
      'kyk...kkkkkkkkksskkrsrk.kkk.............',
      'kkkkkkkkckkdkkkkkkkrsrkkkrkk............',
      'kkkbbbbbbbddddddkkksskkkrsrk............',
      'ykkkkkekkddddddddkksrkkrsskk....kkk.....',
      'kkcckeeekcdddkddddkkrkrssrk..kkkkmkk....',
      'ccckeeyeekddkekdddckrkrsrkk..kmmmmmkkk..',
      'bbbbkeeekcdkeeekddckkrsrkk...kkmmmmmckk.',
      'cccckkekkcddkekdccccksrkkkk...kkcmmmmckk',
      'cccccckccccdckccccckksrkkrk....kccddccck',
      'cccccnnnnncccccccccksrkkkrkkkkkkccdddccc',
      'knnnnnbbbccccccccckkrkkkrsrkkrkkkkkcddcc',
      'bbnbbnbbnbccccccccckkkrkrsrkrrrkkrkkcddd',
      'bnbbnbbnbbccccccccccksskssskrsrkrrrkccdd',
      'bbbbbbbbbbbccccccccckksrsssrssskrsrkkcdd',
      'kkkkkkkkkcccccccccccckkkkkkkkkkkkkkkkkdd',
      '.kkkkkcckkccccccccccckddddddddddccccckkd',
      '.kykkcccckkcccccccccckdddddddccccccccckc',
      '.kkkkkcckkkkcccccccckkccccbccccccccccckk',
      '.....kckkcckkccccccckbbbbkkkkkbbbbbcccck',
      '.....kkkcccckkkccckkkkbbkkccckkbbbbbbbkk',
      '......kcccccckkkkkkcckbkkccccckbbbbbbbkc',
      '.....kkccbbcckkcccccckukcccccckbbbbbbkkc',
      '....kkcccbbckkkccbbcckkkccbbcckubbbbkkkk',
      '...kkcccbbckkkcccbbckkkcccbbckkkuukkkk..',
      '...kcccbbckkkcccbbckkkcccbbckkukkkk.....',
      '...kccbbcckkcccbbckkkcccbbckkkkk........',
      '...kccbbckkkccbbcckbkccbbcckbk..........',
      '...kcccckkbkccbbckkbkccbbckkkk..........',
      '..kkcccckbbkccccckbbkccccckbk...........',
      'kkkccccckbbkccccckbkkccccckbk...........',
      'kmkcmccckkkkccccckkkkccccckbk...........',
      'kmmmmmmmkkmkcmccckkmkcmccckbk...........',
      'kkkkccckkkmmmmmmmkkmmmmmmmkbk...........',
      '...kkkkkkkkkkccckkkkkkccckkkk...........',
    ],
  };

  // 96 - Twin-Headed Anaconda (ELITE 40x40): two-headed giant anaconda, each head hissing
  S.twin_anaconda = {
    w: 40, h: 40,
    pal: {
      k: '#0b1610', // outline
      b: '#183a24', // scale dark
      c: '#2b5f34', // scale mid
      d: '#4f9349', // scale light
      p: '#12291a', // pattern dark
      q: '#78b062', // pattern light
      g: '#8a3040', // mouth
      n: '#f0eed4', // fangs
      e: '#e8506a', // tongue
      y: '#ffd23a', // eyes
    },
    px: [
      '....................kkk.................',
      '..............kkkkkkkdkkkk..............',
      '.............kkbbbbbbddddkk.............',
      '..........kkkkddyyydddddddkk............',
      '.........kkdddddykyddddddddk............',
      '.........kccccccyyydddddddckkk..........',
      '..kkkk...kcccccccccddddddccckkk.........',
      '..keekk..kcnnnnnnnnccdccccckkck.........',
      '..kkeekkkkcncddcccgcccccccckcck.........',
      '...kkeeekcccndccgggccccccckkcckk........',
      '...kkeeeeeccddgggggcccccckkdccck........',
      '..kkeekkkcccdngnnnngkckkkkddccdkkkk.....',
      '..keekk.kccgnnnnggggkkkcbbbbbbddddkk....',
      '..kkkk..kcccddccckkkkkkddyyydddddddkk...',
      '........kcccdcccckkkdddddykyddddddddk...',
      '........kcccdcccckkccccccyyydddddddckk..',
      '........kcccddcccckcccccccccddddddccck..',
      '........kccccddccckknnnnnnnnccdccccckk..',
      '........kkcccddccccknkcccccgcccccccck...',
      '.........kccccddccckkncccgggccccccckk...',
      '.......kkkkcccddcccckccggggggccccckk....',
      '......kkddkccccddccckcngnnnngkckkkk.....',
      '.....kkcdpkkccccdcccknnnnggggkkk........',
      '.....kccccckkccccccckccccccckkck........',
      '.....kkccccckccccccckccccccckckk........',
      '......kkkkkkkkccccckkkccccckkkkkkkk.....',
      '......kkkddddkkkkkkkdkkkkkkkdccccckkk...',
      '.....kkcccpcccppqppcccpcccccpccccccckk..',
      '.....kccppqppcccpcccppqppcppqppcccccck..',
      '.....kkcccpcccbbbbbbbbpbbbbbpbbbbbbckk..',
      '......kkkcccbbbbbbbbbbbbbbbbbbbbbbkkk...',
      '...kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk..',
      '..kkccccccccccpcccccccccbcpcccccccccckk.',
      '.kkcccccpcccppqppcccpcbcppqppcccpccccckk',
      '.kccccppqppbbbpbbbppqppbbbpbbbppqppcccck',
      '.kkccccbpbbbbbbbbbbbpbbbbbbbbbbbpbbbbbkk',
      '..kkccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbkk.',
      '...kkkcbbbbbbbbbbbbbbbbbbbbbbbbbbbbkkk..',
      '.....kkkkkcbbbbbbbbbbbbbbbbbbbbkkkkk....',
      '.........kkkkkkkkkkkckkkkkkkkkkk........',
    ],
  };
})();
