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
      p: '#3d2258', // robe dark
      q: '#6f3f9a', // robe mid
      r: '#a86ad0', // robe light
      w: '#8a5a2a', // staff wood
      e: '#ffe14a', // orb glow / eyes
    },
    px: [
      '................................',
      '................................',
      '..........kpk...................',
      '..........kqpk..................',
      '..........kqqpk..........kek....',
      '...........kqqpk........keeek...',
      '...........krqqpk.......keeek...',
      '...........krqqqpk.......kek....',
      '..........krqqqqpk.......kwk....',
      '..........krqqqqqpk......kwk....',
      '.........krqqqqqqppk.....kwk....',
      '........krrqqqqqqqpppk...kwk....',
      '...........khhhhhhk......kwk....',
      '.........kgkhhhhhhhgk....kwk....',
      '........kggkhhhehehggk...kwk....',
      '..........kghhhhhhiik....kwk....',
      '...........khhhhhhik.....kwk....',
      '...........khhhhhhk......kwk....',
      '............khhhhk.......kwk....',
      '..........kpqqqqqqpk.....kwk....',
      '.........kpqqrqqqqpk.....kwk....',
      '.........kpqqrrqqqqhhhhhkkwk....',
      '........kpqqrrrqqqqpk....kwk....',
      '........kpqqrrrrqqqqpk...kwk....',
      '.......kpqqqrrrrqqqqqpk..kwk....',
      '.......kpqqqrrrrqqqqqpk..kwk....',
      '......kpqqqqrrrrrqqqqqpk.kwk....',
      '......kpqqqqrrrrrqqqqqpk.kwk....',
      '.....kpqqqqqrrrrrqqqqqqpkkwk....',
      '.....kpqqqqqrrrrrqqqqqqpkkwk....',
      '.....kkkkkkkkkkkkkkkkkkkkkkk....',
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
      '............kbccccccck..kwk.....',
      '............kbccecccdk..kwk.....',
      '............kbcccccdddk.kwk.....',
      '............kbbcccccck..kwk.....',
      '.............kbcccck....kwk.....',
      '..............kbcck.....kwk.....',
      '...........kbccccccbk...kwk.....',
      '..........kbcdcccccbk...kwk.....',
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
      b: '#513622', // bark dark
      c: '#8a6440', // bark mid
      d: '#bb945f', // bark light
      g: '#27612a', // leaf dark
      h: '#5fbf42', // leaf light
      f: '#f27ac0', // flower
      e: '#8cff7a', // healing glow / eye
    },
    px: [
      '................................',
      '................................',
      '.............khhhk..............',
      '...........khhghhhk.............',
      '.........kfhhhghhhhhk...........',
      '........khhhghhhhghhhfk.........',
      '.......kfhhhhhhghhhhhhhk........',
      '.......khhghhhhhhhhhghhk........',
      '.......kghhkcccccckhhgk.........',
      '.......khhhkcdccecdkhhk.........',
      '........khhkccccccdkhk..........',
      '.........khkcccccckhk...........',
      '..........kbccccck.....kek......',
      '...........kbccck.....keeek.....',
      '.........kbccdcccbk...keeek.....',
      '........kbccddccccbkkcckkek.....',
      '........kbccddccccbkkcddk.......',
      '........kbccddccccbkkkkkk.......',
      '.......kbccddggccccbk...........',
      '.......kbccddghgccccbk..........',
      '......kbcccddcccccccbk..........',
      '......kbcccddccccccccbk.........',
      '.....kbccccddccccccccbk.........',
      '.....kbccccddcccccccccbk........',
      '....kbcccccddcccccccccbk........',
      '....kbcccccddccccccccccbk.......',
      '....kbbcccddcccccccccccbk.......',
      '....kbbcccccccccccccccbbk.......',
      '....kbbbcccccccccccccbbbk.......',
      '...kbbbccccccccccccccbbbbk......',
      '...kkkkkkkkkkkkkkkkkkkkkkk......',
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
      b: '#5f5070', // wing dark
      c: '#9a89aa', // wing mid
      d: '#d4c8de', // wing light
      f: '#d8c8a8', // fuzz
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
      '.......kccckfffffffgk...........',
      '.....kcccccckyyfffgk............',
      '...kcccccccckyyyfffgk...........',
      '..kbcccccccckffffffgk...........',
      '.kbccddcccckffffffgk............',
      '.kbccddcccckffffffgk............',
      '.kbcccccccckffffffgk............',
      '..kbcccccccckffffffffk.kkkk.....',
      '..kbbccccccckffffffgk.kssssk....',
      '...kbcccccckffffffgfkksdssk.....',
      '....kbcccccckffffffgfkkssssk....',
      '.....kbcccckffffffgk.kssssk.....',
      '.......kbccckffffffgk..kkkk.....',
      '.........kbckffffffgk...........',
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
})();
