// js/sprites/heroes_a.js — Heroes 1–12. Heroes FACE RIGHT.
(function () {
  const S = (window.DJ = window.DJ || {}).SPRITES || (DJ.SPRITES = {});

  // 1. Elf Warrior — slender elf in green/brown leather, silver sword + round shield, blond hair
  S.elf_warrior = {
    w: 32, h: 32,
    pal: {
      k: '#1b1426', // outline
      h: '#c8a038', // hair dark / gold trim
      i: '#f2d97a', // hair light
      s: '#e8b98a', // skin
      g: '#2f4f24', // leather dark
      n: '#5c8a38', // leather mid
      l: '#7a8290', // steel dark
      m: '#dce4f0', // steel light
      e: '#4ad8ff', // eye / shield gem
    },
    px: [
      '................................',
      '................................',
      '.......................kk.......',
      '......................kmlk......',
      '.............khiiihk..kmlk......',
      '............khiiiiihk.kmlk......',
      '............khiiisssk.kmlk......',
      '............khissessk.kmlk......',
      '............khisssssskkmlk......',
      '............khisssssk.kmlk......',
      '.............khisssk..kmlk......',
      '.............khissk...kmlk......',
      '............khignnngk.kmlk......',
      '...........khignnnngk.kmlk......',
      '....kllllk.khignnnngk.kmlk......',
      '...klnnnnlk.knnnnnnkkllllllk....',
      '..klnnnnnnlkkgnnnnnssskggk......',
      '..klnnhhnnlkkgnnnnngk.kggk......',
      '..klnhhhhnlkkgnnnnngk.kllk......',
      '..klnhehhnlkkhhhhhhhk.kkkk......',
      '..klnhhhhnlkkgnnnnngk...........',
      '..klnnhhnnlkkgnnnnngk...........',
      '..klnnnnnnlkkgnnnnngk...........',
      '...klnnnnlk.kgnnnnngk...........',
      '....kllllk..knnk.knnk...........',
      '............knnk.knnk...........',
      '............knnk.knnk...........',
      '............knnk.knnk...........',
      '............kggk.kggk...........',
      '...........kgggk.kgggk..........',
      '...........kkkkk.kkkkk..........',
      '................................',
    ],
  };

  // 2. Goblin Mage — small green goblin, purple robe, tall crooked hat, staff with glowing orb
  S.goblin_mage = {
    w: 32, h: 32,
    pal: {
      k: '#180d20', // outline
      g: '#3d6a22', // skin dark
      h: '#6fae36', // skin mid
      i: '#a8d85c', // skin light
      p: '#2b1747', // hat dark
      q: '#5a3a86', // hat mid
      r: '#9a6ad8', // robe light
      w: '#7a4c22', // staff wood / belt
      e: '#ffe14a', // orb glow / eyes
    },
    px: [
      '................................',
      '................................',
      '.....kqk........................',
      '.....kqpk.......................',
      '......kqqpk.....................',
      '.......kqqqpk............kek....',
      '........kqqqqpk.........keeek...',
      '.........kqqqqqpk.......keeek...',
      '.........kqqqqqqpk.......kek....',
      '.........kqqqqqqqpk......kwk....',
      '........kqqqqqqqqppk.....kwk....',
      '.......kppqqqqqqqpppk....kwk....',
      '..........khhhhhhhk......kwk....',
      '........kggkhhhhhhhggk...kwk....',
      '.......kgggkhhhehehgggk..kwk....',
      '.........kgkhhhhhhiik....kwk....',
      '..........khhhhhhhik.....kwk....',
      '..........khhkikhhk......kwk....',
      '...........khhhhhk.......kwk....',
      '............khhhk........kwk....',
      '.........kqrrrrrrrqk.....kwk....',
      '........kqrrrrrrrrrqkhhhhkwk....',
      '........kqrrrrrrrrrqk....kwk....',
      '........kwwwwwwwwwwwk....kwk....',
      '.......kqrrrrrrrrrrrrqk..kwk....',
      '.......kqrrrrrrrrrrrrqk..kwk....',
      '......kqqrrrrrrrrrrrrrqqk.kwk...',
      '......kqqrrrrrrrrrrrrrqqk.kwk...',
      '......kqqrrrrrrrrrrrrrqqk.kwk...',
      '......kqqrrrrrrrrrrrrrqqk.kwk...',
      '......kkkkkkkkkkkkkkkkkkk.kkk...',
      '................................',
    ],
  };

  // 3. Kua Ta Lancer — tall teal-scaled lizardfolk, feathered headdress, long spear
  S.kuata_lancer = {
    w: 32, h: 32,
    pal: {
      k: '#0c1e21', // outline
      b: '#1f6b70', // scale dark
      c: '#2f9aa0', // scale mid
      d: '#63d2d2', // scale light
      r: '#c8402a', // feather red
      y: '#f0c040', // feather gold / band
      w: '#7a5a3a', // spear shaft
      s: '#dde5ef', // spear head
      e: '#ffe14a', // eye
    },
    px: [
      '.........................k......',
      '........................ksk.....',
      '.............k..k..k...ksssk....',
      '............krk.kyk.krkksssk....',
      '...........krrkkyykkrrk.ksk.....',
      '...........kyyyyyyyyyk..kwk.....',
      '............kbcccccck...kwk.....',
      '............kbcceccdddk.kwk.....',
      '............kbccccddddkkkwk.....',
      '............kbbccckkkk..kwk.....',
      '.............kbcccdk....kwk.....',
      '..............kbcck.....kwk.....',
      '...........kbccyyybbk...kwk.....',
      '..........kbcdcyycccbk..kwk.....',
      '..........kbcddccccbcccckwk.....',
      '..........kbcddccccbk...kwk.....',
      '..........kbcddccccbk...kwk.....',
      '..........kbcddccccbk...kwk.....',
      '..........krrrrrrrrrk...kwk.....',
      '...........kyrrrryk.....kwk.....',
      '...........kyrrrryk.....kwk.....',
      '..........kbcck.kccbk...kwk.....',
      '..........kbcck.kccbk...kwk.....',
      '..........kbcck.kccbk...kwk.....',
      '..........kbcck.kccbk...kwk.....',
      '..........kbcck.kccbk...kwk.....',
      '..........kbcck.kccbk...kwk.....',
      '..........kbcck.kccbk...kwk.....',
      '..........kbcck.kccbk...kwk.....',
      '.........kbccck.kcccck..kwk.....',
      '.........kkkkkk.kkkkkk..kkk.....',
      '................................',
    ],
  };

  // 4. Frog Monk — stocky orange-green frog in saffron robes, prayer beads, fists raised
  S.frog_monk = {
    w: 32, h: 32,
    pal: {
      k: '#16240f', // outline
      g: '#3f7a2a', // skin dark
      h: '#6aad3a', // skin mid
      i: '#a5d95e', // skin light
      o: '#b85c0e', // robe dark
      p: '#ef9c22', // robe mid
      q: '#ffd070', // robe light
      e: '#ffe94a', // eye
      w: '#f2e8d0', // prayer beads
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '...........kkk...kkk............',
      '..........keeek.keeek...........',
      '..........kekek.kekek...........',
      '.........khhhhhhhhhhhhk.........',
      '........khhhhhhhhhhhhhhk........',
      '........kghhiihhhhhiihhk........',
      '........kghhhhhhhhhhhgk.........',
      '........kgkkkkkkkkkkkgk.........',
      '.........kghhhhhhhhhgk..kkkk....',
      '..........kghhhhhhhgk.kihhk.....',
      '......khhkopppppppokhhkihhk.....',
      '.....kihhkopwqwpwpok..kkkkk.....',
      '.....kihhkoppqqppppok...........',
      '.....kkkkkoppqqqppppok..........',
      '........koppqqqqpppppok.........',
      '........koppqqqqpppppok.........',
      '.......koppqqqqqppppppok........',
      '.......koppqqqqqppppppok........',
      '......kopppqqqqqpppppppok.......',
      '......kopppqqqqqpppppppok.......',
      '......kopppqqqqqpppppppok.......',
      '......kopppqqqqqpppppppok.......',
      '......kkkkkkkkkkkkkkkkkkk.......',
      '........kghhk...kghhhk..........',
      '........kghhk...kghhhk..........',
      '......kihhhhhk.kihhhhhhk........',
      '......kkkkkkkk.kkkkkkkkk........',
      '................................',
    ],
  };

  // 5. Dryad Healer — bark-skinned woman, leafy green hair with flowers, glowing green hands
  S.dryad_healer = {
    w: 32, h: 32,
    pal: {
      k: '#161008', // outline
      b: '#5a3d26', // bark dark
      c: '#a07a52', // bark mid
      d: '#d6b080', // bark light
      g: '#27612a', // leaf dark
      h: '#5fbf42', // leaf light
      f: '#f27ac0', // flower
      e: '#8cff7a', // healing glow / eye
    },
    px: [
      '................................',
      '................................',
      '............khhhhk..............',
      '..........khhghhhhk.............',
      '........kfhhhghhhhhhk...........',
      '.......khhhghhhhghhhhfk.........',
      '......kfhhhhhhghhhhhhhhk........',
      '......khhghhhhhhhhhhghhk........',
      '......kghhkddcccdkhhhgk.........',
      '......khhhkddcecdkhhk...........',
      '.......khhkddcccdkhk............',
      '.........khkdccdkhk....kek......',
      '..........kbcccbk.....keeek.....',
      '..........kbcdcbk.....keeek.....',
      '.........kbcddccbkkkkkkkek......',
      '........kbccddcccbkkccdk........',
      '........kbccddcccbkkccdk........',
      '........kbccddcccbkkkkkk........',
      '.......kbccddggcccbk............',
      '.......kbccddghgcccbk...........',
      '......kbcccddcccccccbk..........',
      '......kbcccddccccccccbk.........',
      '.....kbccccddccccccccccbk.......',
      '.....kbccccddccccccccccbk.......',
      '....kbcccccddccccccccccccbk.....',
      '....kbcccccddccccccccccccbk.....',
      '...kbccccccddccccccccccccccbk...',
      '...kbccccccddccccccccccccccbk...',
      '...kbbcccccddccccccccccccccbbk..',
      '..kbbbcccccccccccccccccccccbbbk.',
      '..kkkkkkkkkkkkkkkkkkkkkkkkkkkkk.',
      '................................',
    ],
  };

  // 6. Lizardfolk Berserker — bulky red lizardman with twin axes and bone armor
  S.lizard_berserker = {
    w: 32, h: 32,
    pal: {
      k: '#200f0a', // outline
      b: '#8a2418', // scale dark
      c: '#c4402a', // scale mid
      d: '#ec7c50', // scale light
      n: '#e8dfc4', // bone
      m: '#a89878', // bone shade
      l: '#8e959e', // axe steel
      w: '#5a3a20', // axe haft
      e: '#ffd12a', // eye
    },
    px: [
      '................................',
      '................................',
      '................................',
      '........................kkkk....',
      '...........knk...knk...kllllk...',
      '..........knbbbbbnk....kllllk...',
      '.........kbccccccbk....klllk....',
      '.........kbccecedbk....kwk......',
      '.........kbcccccdddk...kwk......',
      '.........kbccccnnnnk...kwk......',
      '.........kbccccccck....kwk......',
      '..........kbccccck.....kwk......',
      '...........kbccck......kwk......',
      '......kmnnmbccccbmnnmk.kwk......',
      '.....kmnnnmbcccccbmnnnmkwk......',
      '.....kmnnmkbcdcccbkmnnmkwk......',
      '......kcckkbcddccbkcccckwk......',
      '......kcckkbcddccbkkcckkwk......',
      '......kwk.kbccddccbk...kkk......',
      '......kwk.kbccddccbk............',
      '......kwk.kbccddccbk............',
      '......kwk.knnnnnnnnk............',
      '......kwk.kbccddccbk............',
      '..kkkkkwk.kcck.kccck............',
      '.kllllkwk.kcck.kccck............',
      '.kllllkwk.kcck.kccck............',
      '.kllllkwk.kcck.kccck............',
      '..kllkkkk.kcck.kccck............',
      '...kkk....kcck.kccck............',
      '.........kbccckkbcccck..........',
      '.........kkkkkkkkkkkkk..........',
      '................................',
    ],
  };

  // 7. Moth Oracle — humanoid moth, fuzzy antennae, dusty wings, crystal ball
  S.moth_oracle = {
    w: 32, h: 32,
    pal: {
      k: '#191320', // outline
      b: '#4a3a5e', // wing vein / eyespot ring
      c: '#a091bd', // wing mid
      d: '#e2d8ee', // wing light
      f: '#e0d0b0', // fuzz
      g: '#a89070', // fuzz shade
      e: '#ff9a3a', // compound eye
      s: '#7ae8ff', // crystal ball
      y: '#f0d878', // ruff
    },
    px: [
      '................................',
      '................................',
      '..........f.......f.............',
      '.........fg......gf.............',
      '..........fg....gf..............',
      '...........fg..gf...............',
      '...........kfffffffk............',
      '..........kffffffffgk...........',
      '..........kffeeffeegk...........',
      '..........kffeeffeegk...........',
      '..........kffffffffgk...........',
      '.......kdcckfffffffgk...........',
      '.....kdcccbckyyfffgk............',
      '...kdccccbcckyyyfffgk...........',
      '..kdccccbccckffffffgk...........',
      '.kdccbbbcccckffffffgk...........',
      '.kdccbddbccckffffffgk...........',
      '.kdccbbbccccckfffffgk...........',
      '..kdcccbccckffffffffk..kkkkk....',
      '..kdccbcccckffffffgk..kssssssk..',
      '...kdcbcccckffffffgfkksdsssssk..',
      '....kdccccckffffffgfkksdsssssk..',
      '.....kdccbckffffffgk..kssssssk..',
      '.......kdcckffffffgk..kssssssk..',
      '.........kdckffffffgk..kkkkkk...',
      '............kgffffggk...........',
      '............kgfffffgk...........',
      '............kffk.kffk...........',
      '............kffk.kffk...........',
      '...........kfffk.kfffk..........',
      '...........kkkkk.kkkkk..........',
      '................................',
    ],
  };

  // 8. Pygmy Beastmaster — small tribal human, wooden mask and whip, tiny pet boar
  S.pygmy_beastmaster = {
    w: 32, h: 32,
    pal: {
      k: '#1c120c', // outline
      s: '#8a5a34', // skin dark
      t: '#c08a52', // skin mid
      m: '#dcbc7c', // wood light / whip
      n: '#9a7038', // wood dark
      r: '#c03a2a', // war paint
      w: '#e8dcc0', // bone / tusk
      b: '#453626', // boar dark
      h: '#7d6248', // boar mid
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '.........knk..knk...............',
      '........knmmmmmnk...............',
      '........knmmmmmmnk..............',
      '........knmkkmkknk..............',
      '........knmmmmmmnk.......mm.....',
      '........knrrrrrrnk......mm......',
      '........knmmmmmmnk.....mm.......',
      '.........knwwwwnk....mm.........',
      '..........knmmnk....mm..........',
      '........kstttttsk..mm...........',
      '.......kstwtwtwtsk.mm...........',
      '.......ksttttttttsk.mm..........',
      '.......ksttttttttsktttk.........',
      '.......ksttttttttsk.............',
      '.......krrrwrrrrrrk.............',
      '........krrrrrrrk...............',
      '........kstk.kttk...............',
      '........kstk.kttk...............',
      '........kstk.kttk....kbbbbk.....',
      '........kstk.kttk..kbhhhhhhbk...',
      '........kstk.kttk.kbhhhhhhhhbk..',
      '........kstk.kttk.kbhhhhhhrhbk..',
      '........kstk.kttk.kbhhhhhhhwbk..',
      '.......ksttk.ktttk.kbbk..kbbk...',
      '.......kkkkk.kkkkk.kkkk..kkkk...',
      '................................',
    ],
  };

  // 9. Orchid Witch — pale witch in pink/magenta petal dress, wide flower hat, wand
  S.orchid_witch = {
    w: 32, h: 32,
    pal: {
      k: '#2a0e28', // outline
      p: '#8a1e5a', // magenta dark
      q: '#d24a90', // magenta mid
      r: '#f88ac2', // pink light
      w: '#ffdcee', // pale petal
      s: '#f2d8c8', // skin
      g: '#3f7a3a', // stem / wand
      y: '#ffe14a', // pollen / wand gem
    },
    px: [
      '................................',
      '................................',
      '................................',
      '.............krrrk..............',
      '...........krrwwwrrk............',
      '.........krrrwwwwwrrrk..........',
      '.......krrrrwwwyywwwrrrrk.......',
      '.....krrrrrwwwwyywwwwrrrrrk.....',
      '.....kqqrrrrrwwwwwwrrrrrqqk.....',
      '......kqqqqqqrrrrrrqqqqqqk......',
      '........kppppppppppppppppk......',
      '.............kssssssk...kyk.....',
      '.............kssksksk..kyyyk....',
      '.............kssssqsk..kyyyk....',
      '..............kssssk....kyk.....',
      '.............kgqqqqgk...kgk.....',
      '...........kpqqqqqqqpk..kgk.....',
      '..........kpqqrqqqqqpk..kgk.....',
      '..........kpqqrrqqqqpssskgk.....',
      '..........kpqqrrrqqqpk..kgk.....',
      '.........kpqqrrrrqqqqpk.kkk.....',
      '.........kpqqrrrrqqqqpk.........',
      '........kpqqrrrrrqqqqqpk........',
      '........kpqqrrwrrrqqqqpk........',
      '.......kpqqqrrwwrrrqqqqpk.......',
      '.......kpqqqrrwwrrrqqqqpk.......',
      '......kpqqqqrrwwwrrrqqqqpk......',
      '......kpqqqqrrwwwrrrqqqqpk......',
      '.....kpqqqqqrrwwwwrrrqqqqpk.....',
      '....kpqqqqqqrrwwwwrrrqqqqqpk....',
      '....kkkkkkkkkkkkkkkkkkkkkkkk....',
      '................................',
    ],
  };

  // 10. Golem Guardian — squat mossy stone golem, glowing rune eyes, huge fists
  S.golem_guardian = {
    w: 32, h: 32,
    pal: {
      k: '#0e1410', // outline
      a: '#464e4c', // stone dark
      b: '#6e7874', // stone mid
      c: '#96a09a', // stone light
      d: '#c4ccc6', // stone highlight
      m: '#2b6226', // moss dark
      n: '#5fae44', // moss light
      e: '#4ad8ff', // rune glow
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '............kmnnmnmk............',
      '...........kmnnmnnmmk...........',
      '...........kabbbbbbak...........',
      '..........kabeebeebak...........',
      '..........kabbbbbbcak...........',
      '..........kabccccccak...........',
      '..........kakkkkkkkak...........',
      '...........kabbbbbak............',
      '......kmnnmbbbbbbbmnnnmk........',
      '.......kabcbbccddcbbcak.........',
      '.......kabbcbcddcbcbbak.kkkkkk..',
      '.......kabccbbccbbccbaakbccbbk..',
      '.......kamnbbbccbbbnmaakbccbbk..',
      '..kkkkkkamnnbbccbbbnmaakbccbbk..',
      '.kbccbkaabnbbbbbbbbbbaakbccbbk..',
      '.kbccbkaabbbbccccbbbbaakbccbbk..',
      '.kbccbkaabbbbceecbbbbaakbccbbk..',
      '.kbccbkaabbbbccccbbbbaakkkkkkk..',
      '.kkkkkkkabbbbbbbbbbbbak.........',
      '........kabbak..kabbak..........',
      '........kabbak..kabbak..........',
      '........kabbak..kabbak..........',
      '........kabbak..kabbak..........',
      '.......kabbbbakkabbbbak.........',
      '.......kabbbbakkabbbbak.........',
      '.......kkkkkkkkkkkkkkkk.........',
      '................................',
    ],
  };

  // 11. Ratkin Corsair — rat pirate with tricorne hat, eyepatch, cutlass, curling tail
  S.ratkin_corsair = {
    w: 32, h: 32,
    pal: {
      k: '#1a1218', // outline
      b: '#5a4a42', // fur dark
      c: '#8a7568', // fur mid
      d: '#b8a494', // fur light / trim
      h: '#272134', // hat dark
      i: '#474058', // hat mid
      r: '#b02a2a', // coat red
      l: '#c8d0dc', // cutlass steel
      e: '#ffd12a', // eye / gold
    },
    px: [
      '................................',
      '................................',
      '................................',
      '.............khhhk..............',
      '...........khhiiihhk............',
      '.........khhiiiiiiihhk..........',
      '......khhhiiiiiiiiiiihhhk.......',
      '.....khhhhhhiiiiiiihhhhhhk......',
      '......kkkkkkkkkkkkkkkkkkk.......',
      '.........kckkbcccccck......klk..',
      '...........kbcckkcecdk....kllk..',
      '...........kbccccccdddk...kllk..',
      '...........kbcccccdddrk..kllk...',
      '............kbccccck.....kllk...',
      '.............kbcck......kllk....',
      '..........krrrrrrrrrk...kllk....',
      '.........krrdrrrrrrrk..kllk.....',
      '.........krrerrrrrrcckkeeek.....',
      '.........krrddrrrrrcckkbbk......',
      '.........krrerrrrrrrrkkkkk......',
      '........krrrddrrrrrrrk..........',
      '........krrrddrrrrrrrk..........',
      '.....kdkkrrrddrrrrrrrrrk........',
      '...kdk..krrrddrrrrrrrrrk........',
      '..kdk.....kbck..kbcck...........',
      '..kdk.....kbck..kbcck...........',
      '...kdk....kbck..kbcck...........',
      '.....kdk..kbck..kbcck...........',
      '.........kbbbk..kbbbbk..........',
      '........kbbbbk..kbbbbbk.........',
      '........kkkkkk..kkkkkkk.........',
      '................................',
    ],
  };

  // 12. Firefly Ranger — hooded archer, bow drawn, glowing fireflies orbiting
  S.firefly_ranger = {
    w: 32, h: 32,
    pal: {
      k: '#101a14', // outline
      b: '#17301f', // cloak dark
      c: '#3f7a55', // cloak mid
      d: '#6cb682', // cloak light
      s: '#eabb88', // skin
      w: '#9a6a34', // bow wood
      l: '#ffe9a8', // string / arrow
      e: '#eaff6a', // firefly / eye glow
      y: '#8fd94a', // glow halo
    },
    px: [
      '................................',
      '................................',
      '................................',
      '.....................y..........',
      '...........kbbbbk...yey.........',
      '.....y....kbcccbbk...y..........',
      '....yey..kbcccccbbk....kk.......',
      '.....y...kbccccccbk...kwk.......',
      '.........kbcckssssk...lkwk......',
      '.........kbcckseskb...l.kwk.....',
      '.........kbcckssssb..l..kwk.....',
      '..........kbcksssbk..l...kwk....',
      '..........kbcccccbk..l...kwk....',
      '..........kbccdcccbkl....kwk....',
      '.........kbccddcccbkl....kwk....',
      '.........kbccddcccbkl....kwk....',
      '.........kbccddccsskllllkkwkllk.',
      '.........kbccddcccbkssssskwk....',
      '.........kbccddcccbkkkkkkkwk....',
      '.........kbcccccccbk.l...kwk....',
      '......y..kbcccccccbk.l...kwk....',
      '.....yey.kbcccccccbk..l..kwk....',
      '......y..kbcccccccbk..l.kwk.....',
      '.........kbcck.kccbk...lkwk.....',
      '.........kbcck.kccbk...kwk......',
      '.........kbcck.kccbk...kwk......',
      '.........kbcck.kccbk..kwk.......',
      '.........kbcck.kccbk...kk.......',
      '.........kbcck.kccbk............',
      '........kbccck.kcccbk...........',
      '........kkkkkk.kkkkkk...........',
      '................................',
    ],
  };
})();
