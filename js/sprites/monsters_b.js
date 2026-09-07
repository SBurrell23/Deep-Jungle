// js/sprites/monsters_b.js — Tier 2 monsters (19–36) + elites 91–92. Monsters FACE LEFT.
(function () {
  const S = (window.DJ = window.DJ || {}).SPRITES || (DJ.SPRITES = {});

  // 19. Howler Monkey - brown monkey, mouth wide open screaming, sound lines
  S.howler_monkey = {
    w: 32, h: 32,
    pal: {
      k: '#1c1108', // outline
      b: '#4e3018', // fur dark
      c: '#7a4e26', // fur mid
      d: '#a8763c', // fur light
      f: '#d9a06a', // face
      g: '#f0c898', // face light
      m: '#5e1420', // mouth
      w: '#f7ecd8', // teeth
      e: '#ffd23a', // eye
      s: '#ffe9a0', // howl
    },
    px: [
      '................................',
      '................................',
      '..............kkkkkk............',
      '............kkkbbbbbbkkk........',
      '..........kkbbbcccccccbbbkk.....',
      '.....kk...kbbbcccccccccbbbbk....',
      '....kdbk.kbbccccccccccccbbbk.kk.',
      '...kdccbkkbcffffffffgcccbbbkkdbk',
      '..kdcccbkkbcfffffffffgccbbbkdccb',
      '..kdccdbkkbffffffffffgccbbbkdccb',
      '..kdcccbkkbfeffgffffffccbbbkdccb',
      '...kdccbkkbckkfffffffgccbbbkdcbk',
      '....kdbk.kbcfffffffffgccbbbkdbk.',
      '.....kk..kbmmmmmmfffffccbbbkkk..',
      's....s...kbmwmwmwmffffccbbbk....',
      '.s..s....kbmmmmmmmmfffccbbk.....',
      's..s.....kbmwmwmwmmffccbbk......',
      '.s..s.....kbmmmmmmmffcbbk.......',
      's....s.....kkbbbbbbbbbbkk.......',
      '..........kkkbbbcccccbbbkkk.....',
      '........kkbbcccccccccccbbbbkkk..',
      '.......kbbccccccccccccccbbbbbkk.',
      '......kbbcccccccccccccccbbbbbbkk',
      '.....kbbcccccccccccccccccbbbbbkk',
      '.....kbcccccccccccccccccbbbbbbkk',
      '....kbbccccccbbbbcccccccbbbbbbk.',
      '....kbccccckkkkkbccccccbbbbbbk..',
      '....kbccccbk...kbccccccbbbbbk...',
      '...kbbcccbk....kbccccccbbbbk....',
      '...kbcccbk.....kbccccccbbbk.....',
      '...kbbbbk......kbbbbbbbbbk......',
      '...kkkkk.......kkkkkkkkkk.......',
    ],
  };

  // 20. Venom Spider - green-black spider, dripping purple fangs
  S.venom_spider = {
    w: 32, h: 32,
    pal: {
      k: '#0a1208', // outline
      b: '#1b3418', // body dark
      c: '#33632c', // body mid
      d: '#5c9a44', // body light
      e: '#ff4a3a', // eye
      v: '#a44adc', // venom
      u: '#d6a0ff', // venom light
      w: '#efe6d2', // fang
    },
    px: [
      '................................',
      '.........kkkkkkkkkkk............',
      '......kkkbbbbbbbbbbbkkk.........',
      '....kkbbbccccccccccccbbbkk......',
      '...kbbccbbdddddddddddcccbbk.....',
      '..kbbcccbbddddddddddddccbbbk....',
      '.kbbccccbbdddddddddddddccbbbk...',
      'kbbcccccbbdddddddddddddcccbbbk..',
      'kbccecccbbddddddddddddddccbbbbk.',
      'kbceecccbbdddddddddddddddcbbbbk.',
      'kbceecccbbdddddddddddddddccbbbbk',
      'kbceccccbbcddddddddddddddccbbbbk',
      'kbccccccbbccddddddddddddcccbbbbk',
      '.kbcccccbbcccdddddddddccccbbbbk.',
      '.kbwwcccbbccccdddddddccccbbbbbk.',
      '.kwwwwccbbcccccccccccccbbbbbbk..',
      'kwvvwwkbbccccccccccccbbbbbbbkk..',
      'kvvvvk.kkbbbbccccccbbbbbbbbkkk..',
      '.kvvk...kk.kkbbbbbbbbbkkkk......',
      '..uv...kk..kk.kk.kk.kk..kk......',
      '...v..kk...kk.kk.kk.kk...kk.....',
      '.....kk...kk..kk.kk..kk...kk....',
      '....kk...kk...kk.kk..kk....kk...',
      '...kk...kk...kk..kk...kk....kk..',
      '..kk...kk....kk..kk...kk.....kk.',
      '.kk...kk....kk...kk...kk......kk',
      'kk...kk.....kk...kk....kk.....kk',
      'k...kk......kk...kk....kk......k',
      '....k.......k....k.....kk.......',
      '................................',
      '................................',
      '................................',
    ],
  };

  // 21. Bog Wisp - floating pale blue-green flame with a faint skull face
  S.bog_wisp = {
    w: 32, h: 32,
    pal: {
      k: '#07202a', // outline
      b: '#125058', // flame dark
      c: '#2a939a', // flame mid
      d: '#63dcc8', // flame light
      w: '#d8fff4', // core
      e: '#04141c', // socket
      g: '#9cf0ff', // spark
    },
    px: [
      '................................',
      '..............kk................',
      '.............kddk...............',
      '............kdwwdk..............',
      '...........kdwwwwdk.............',
      '..........kdwwwwwwdk............',
      '.........kcdwwwwwwwdk...........',
      '.........kcdwwwwwwwwdk..........',
      '........kcdwweeewweeewdk........',
      '........kcdwkeeewkeeewdk........',
      '.......kbcdwkeeewkeeewdck.......',
      '.......kbcdwweewwweewwdck.......',
      '......kbccdwwwweewwwwwdcck......',
      '......kbccdwwwwewwwwwwdcck......',
      '.....kbbccdwwwekewewwwdccbk.....',
      '.....kbbccdwwekekekewwdccbk.....',
      '....kbbcccdwwwwwwwwwwwdcccbk....',
      '....kbbcccddwwwwwwwwwddcccbk....',
      '...kbbbcccdddwwwwwwwdddcccbbk...',
      '...kbbbccccdddwwwwwdddccccbbk...',
      '..kbbbbccccdddwwwwdddccccbbbk...',
      '..kbbbbcccccddddddddcccccbbbk...',
      '..kkbbbbccccccddddccccccbbbkk...',
      '...kkbbbbbcccccccccccccbbbkk....',
      '.....kkbbbbbccccccccccbbkk......',
      '.......kkbbbbbbccccbbbkk........',
      '.........kkkbbbbbbbkkk..........',
      '............kkkkkkk.............',
      '.....g.....g........g...........',
      '...........................g....',
      '........g........g..............',
      '................................',
    ],
  };

  // 22. Tusk Boar - dark bristly boar with big white tusks, charging stance
  S.tusk_boar = {
    w: 32, h: 32,
    pal: {
      k: '#12100b', // outline
      b: '#332621', // hide dark
      c: '#5a453a', // hide mid
      d: '#87695a', // hide light
      w: '#f2ecd8', // tusk
      e: '#ff8a1a', // eye
      n: '#231a16', // snout
      m: '#6e2a2a', // mouth
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '..............b...b...b...b.....',
      '...........b.kbk.kbk.kbk.kbk....',
      '..........kbkkbbkkbbkkbbkkbbkk..',
      '.........kbbbbbbbbbbbbbbbbbbbbk.',
      '........kbdddccbbbbbbbbbbbbbbbbk',
      '.......kbdddddcccbbbbbbbbbbbbbbk',
      '......kbdddddddcccbbbbbbbbbbbbbk',
      '.....kbcddedddddcccbbbbbbbbbbbbk',
      '....kbccdkkkdddddcccbbbbbbbbbbbk',
      '...kwkcccddddddddccccbbbbbbbbbbk',
      '..kwwkccccddddddddccccbbbbbbbbbk',
      '.kwwkdccccdddddddddcccbbbbbbbbbk',
      '.kwwkddccccddddddddcccbbbbbbbbbk',
      'kwwknddddccccddddddcccbbbbbbbbk.',
      'kwwknnmmddccccddddccccbbbbbbbbk.',
      'kwwkknmmdddcccccddccccbbbbbbbbk.',
      '.kwkkkknddddcccccccccccbbbbbbbk.',
      '..kkk.kkkddddccccccccccbbbbbbbk.',
      '.........kkdddccbbbbcccbbbbbbbk.',
      '..........kddccbkkkbbcccbbbbbbk.',
      '..........kdcccbk.kbcdcbkbbcbbk.',
      '..........kdcccbk.kbcdcbkkbcdbk.',
      '..........kdccbk..kbcdcbk.kcdcbk',
      '..........kdccbk..kbcdcbk.kcdcbk',
      '..........kdccbk..kbcdcbk.kcdcbk',
      '..........knnnk...knnnk...knnnk.',
      '..........kkkkk...kkkkk...kkkkk.',
    ],
  };

  // 23. Bark Wolf - wolf with bark-textured brown hide, leafy tail
  S.bark_wolf = {
    w: 32, h: 32,
    pal: {
      k: '#15100a', // outline
      b: '#4a3520', // bark dark
      c: '#7a5730', // bark mid
      d: '#a8834c', // bark light
      e: '#ffd23a', // eye
      g: '#2f7028', // leaf dark
      h: '#67bd46', // leaf light
      w: '#f5efe0', // fang
      n: '#241a12', // nose
    },
    px: [
      '.....................kk.hhk.....',
      '....................khhkhhgkk...',
      '...................kghhhhhhhgk..',
      '..................kghhghhhghhgk.',
      '....kkk...kkk....kkgghhhhhhhhggk',
      '...kbdbk.kbdbk..kbgghhhghhhhhggk',
      '...kbcdbkkbcdbk.kbbgghhhhhhhggkk',
      '...kbccdkkkbcdbkkkbbgghhhhhggkk.',
      '...kbcccdcccbcdkkkkbbgghhhggkk..',
      '.....kbccccccccccbbbbbbgggbbk...',
      '....kbcccdccccccccbbbbbbbbbbbk..',
      '...kbccccccccdcccccccbbbbbbbbbk.',
      '..kbcecccccccccdcccccbbbbbbbbbbk',
      '..kbkkccdcccccccdcccccbbbbbbbbbk',
      'kkbcccccccdcccccccdccccbbbbbbbbk',
      'kncccccdccccdcccccccdcccbbbbbbbk',
      'knnccccccdcccccdcccccdccbbbbbbbk',
      'kwkwcccdccccccdcccccccdcccbbbbbk',
      '.kkkkcccccdcccccdcccccdcccbbbbbk',
      '...kkcdccccccdcccccccdcccbbbbbbk',
      '.....kkccccccccdcccccdccbbbbbbbk',
      '.......kcccccccccdcccccbbbbbbbbk',
      '.....kbccdccccccccdcccccbbbbbbk.',
      '.....kbcccbbbkkkkkbbcccdcbbbbbk.',
      '.....kbcccbk.....kbbcccccbbbbbk.',
      '.....kbcdcbk......kbcdcccbbbbbk.',
      '.....kbcccbk......kbccccccbbbbk.',
      '.....kbccdbk......kbcdccccbbbk..',
      '.....kbcccbk......kbcccccbbbk...',
      '.....kbcdcbk......kbcdcccbbk....',
      '....kbbcccbbk....kbbccccbbbk....',
      '....kkkkkkkkk....kkkkkkkkkk.....',
    ],
  };

  // 24. Fire Ant Warrior - upright red ant with thorn spear and leaf shield
  S.fire_ant_warrior = {
    w: 32, h: 32,
    pal: {
      k: '#280a06', // outline
      r: '#8f2412', // chitin dark
      s: '#cf3f1c', // chitin mid
      t: '#f57a38', // chitin light
      e: '#ffd23a', // eye
      n: '#6b4522', // spear wood
      w: '#efe4cc', // thorn tip
      g: '#2f7028', // shield dark
      h: '#67bd46', // shield light
    },
    px: [
      '..k...............w.............',
      '...k.............kwk............',
      '....k............kwk............',
      '.....k.kkkkkkk...knk............',
      '......krrsssssrk.knk............',
      '.....krssttttttsrknk............',
      '....krssteetttttsrknk...........',
      '...krsstekttttttsrrknk..........',
      '..krssttttttttttssrknk..........',
      'kkrsstttttttttttssrknk..........',
      'kwrssttttttttttsssrknk..........',
      'kwrrssstttttttsssrrknk..........',
      '.krrkkrrsssssrrkkrrknk..........',
      '..kk...kkrrrrrkk...knk..........',
      '.........krrrk.....knk..........',
      '.......kkkrrrkkk...knk..........',
      '..kkk.kkrssssssrk..knk..........',
      '.kghgkkkrsssssssrk.knk..........',
      'kghhhgkkrssssssssrkknk..........',
      'kghhhhgkrsssssssssrknk..........',
      'kghwhhgkrssttttsssrknkk.........',
      'kghhhhgkrsstttttssrknnkkk.......',
      '.kghhgkkrssttttsssrkksssrk......',
      '..kkkk..krsssssssrkksttttsrk....',
      '.........krsssssrkksttttttsrk...',
      '.........kkrrrrrkksttttttttsrk..',
      '........kkrrkkkrrksttttttttsrk..',
      '.......krrk...krrkksttttttsrkk..',
      '......krrk.....krrkksssssssrk...',
      '.....krrk.......krrkkrsssrrkk...',
      '.....krk.........krrkkkrrrkk....',
      '.....kk...........kkk..kkk......',
    ],
  };

  // 25. Hex Frog - purple frog with yellow rune markings, glowing eyes
  S.hex_frog = {
    w: 32, h: 32,
    pal: {
      k: '#160820', // outline
      b: '#361650', // skin dark
      c: '#5c2b83', // skin mid
      d: '#8d55b8', // skin light
      e: '#d9ff3a', // eye glow
      y: '#ffd83a', // rune
      m: '#2a0a2a', // mouth
      w: '#f2e6ff', // glint
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '.......kkkk.......kkkk..........',
      '......kdeeedk....kdeeedk........',
      '.....kdeewekdk..kdeewekdk.......',
      '.....kdeeeeekk..kdeeeeekk.......',
      '.....kkdeeedkkkkkkdeeedkk.......',
      '....kbbkkddkkccckkkddkkbbk......',
      '...kbccccccccccccccccccccbbk....',
      '..kbccccyccccccccccyccccccbbk...',
      '.kbcccyyyccccddccccyyyccccbbbk..',
      '.kbccccyccccddddccccyccccccbbbk.',
      'kbcdcccccccdddddddcccccccccbbbk.',
      'kbcdcccccccdddddddccccccccccbbbk',
      'kbcdccyyycccdddddccccyyyccccbbbk',
      'kbcdcccycccccdddcccccycccccccbbk',
      'kbmmmmmmmmmccccccccccccccccccbbk',
      'kbmmmmmmmmmmcccccccccccccccccbbk',
      '.kkkkkkkkkkkccccyccccccccccccbbk',
      '..kbbccccccccccyyyccccccccccbbk.',
      '..kbcccccccccccycccccccccccbbbk.',
      '..kbccccbbbbccccccccccccccbbbbk.',
      '..kbcccbk..kbbcccccccccbbbbbbbk.',
      '.kbccccbk...kbbccccccbbbbbbbbk..',
      'kbcccccbk....kkkkkkkkkkbbbbbbk..',
      'kbccdcccbk............kbbcbbbbk.',
      'kbcdddccbk...........kbbcccbbbk.',
      'kbcddcccbk...........kbcccccbbk.',
      '.kbcccbbk............kbbcccbbk..',
      '..kkkkkk..............kkkkkkk...',
    ],
  };

  // 26. Sapling Treant - small walking tree with leaves and angry knot face
  S.sapling_treant = {
    w: 32, h: 32,
    pal: {
      k: '#1a1208', // outline
      b: '#4a3318', // bark dark
      c: '#7a5528', // bark mid
      d: '#a8813f', // bark light
      g: '#2c6b24', // leaf dark
      h: '#59ad3c', // leaf mid
      n: '#8fdc5e', // leaf light
      e: '#ffb02a', // eye
    },
    px: [
      '........kkkkkkkkkkkk............',
      '.....kkkghhhhhhhhhhgkk..........',
      '...kkghhnnnhhhhnnnhhhgkk........',
      '..kghhnnnnhhnnnnnnnnhhhgk.......',
      '..kghnnnhhnnnnnhnnnnnnnhgk......',
      '..kghnnhggghhhgggghnnnnhgk......',
      '..kghnnhgkkkbbkkkkghnnnhgkk.....',
      '..kghnhgk..kbcdbk.kghnnnhgk.....',
      '..kghhgk...kbcdbk..kghhnhgk.....',
      '..kgggk....kbcdbk...kghhggk.....',
      '..kkkk...kkkbcdbkkk..kggggk.....',
      '.........kkbcccdccbkk.kkkk......',
      '.......kbcdcccccdccbk...........',
      '.......kbckkkccckkkbk...........',
      '.......kbckekcckekcbk...........',
      '......kbcckekcckekccbk..........',
      '......kbccdcccccccdccbk.........',
      '.....kbccdbkbkbkbkbdccbk........',
      '.kkk.kbccccbccccbcccccbk.kkk....',
      'kbdbkkbcdcccbbbbcccdcccbkkbdbk..',
      'kbcdbkbcccdccccccccccdcbkbcdbk..',
      '.kbcdbbcdcccccccccdccccbbbcdbk..',
      '..kbcdbcccdccccccdcccccbbcdbk...',
      '...kkkbccccccdcccccccdcbkkkkk...',
      '......kbcdccccccdcccccbk........',
      '......kbccccdccccccdccbk........',
      '......kbcdcbbkkkkbbcccbk........',
      '.....kbccdcbk...kbcdccbk........',
      '.....kbccccbk...kbccdcbk........',
      '....kbccdcbbk...kbbccccbk.......',
      '..kkbbcccbbk.....kbbcccbbkk.....',
      '..kkkkkkkkk.......kkkkkkkkk.....',
    ],
  };

  // 27. Blowgun Pygmy - small tribal humanoid, wooden mask, blowgun raised
  S.blowgun_pygmy = {
    w: 32, h: 32,
    pal: {
      k: '#1a0f08', // outline
      s: '#7a4c28', // skin dark
      t: '#a8703c', // skin mid
      u: '#cf9a5c', // skin light
      m: '#c8a464', // mask
      n: '#8a6636', // mask shade
      w: '#f2eadc', // mask paint
      r: '#c33a2a', // war paint
      g: '#3f8a3a', // grass skirt
      h: '#78c95a', // skirt light
      p: '#5a3a1c', // blowgun
    },
    px: [
      '................................',
      '................................',
      '................................',
      'kk..............................',
      'kpk.............................',
      '.kpk............................',
      '..kpk...........kkkkkk..........',
      '...kpk........kkmmmmmmkk........',
      '..kkpkk......kmmmmmmmmmmk.......',
      '.ktuupkuk...kmmnmmmmmmnmmk......',
      '.ktuukpkuk..kmmwwmmmmwwmmk......',
      '..kkkkpkuk..kmwwrwwmwwrwwmk.....',
      '.....kpkkk..kmwwwwwmwwwwwmk.....',
      '.....kkpkuk.kmmwwmmmmmwwmmk.....',
      '.....ktuupkukmmmmmmmmmmmmmk.....',
      '.....ktuukpkkmmwwwwwwwwwmmk.....',
      '.....ktuukkkkmmmmmmmmmmmmmk.....',
      '......kkkk...kmmnmmmmmmnmmk.....',
      '..............kmmmmmmmmmmk......',
      '...............kkksssskkk.......',
      '.................ksssk..........',
      '..............kkkksssskkkk......',
      '.............ktuuuuuuuuuutk.....',
      '.............ktuuwwwwwwuuutk....',
      '.............ktuuuuuuuuuuutk....',
      '.............kkttuuuuuuutkk.....',
      '..............kgggggggggggk.....',
      '.............kgghgggggghggk.....',
      '.............kggkkkkkkkkggk.....',
      '.............kkk.ktuk.kkkk......',
      '.............ktuk.ktuk..........',
      '.............kkkk.kkkk..........',
    ],
  };

  // 28. Mud Golem - hulking dripping mud humanoid, pebbles embedded
  S.mud_golem = {
    w: 32, h: 32,
    pal: {
      k: '#140d06', // outline
      b: '#3a2a12', // mud dark
      c: '#5e4622', // mud mid
      d: '#87663a', // mud light
      p: '#8e8b82', // pebble
      q: '#c0bdb2', // pebble light
      e: '#ffd23a', // eye
      m: '#241906', // drip
    },
    px: [
      '................................',
      '..........kkkkkkkk..............',
      '........kkbbcccccbbkk...........',
      '.......kbbccddddddccbbk.........',
      '.......kbccddpqddddccbk.........',
      '......kbccdeeeddeeedccbk........',
      '......kbccdeeeddeeedccbk........',
      '......kbcccdddccdddcccbk........',
      '.......kbccccccccccccbk.........',
      '....kkkkbbccccccccccbbkkkk......',
      '.kbbbk..kkbbbbbbbbbbkk..kbbbk...',
      'kbcddbk.kbbccddddddccbbk.kbddcbk',
      'kbcddcbkkbccdddpqdddccbk.kbdddbk',
      'kbcdddbkkbcddddddddddcbkkbddccbk',
      'kbcdddbk.kbcdddddddddcbk.kbdddbk',
      'kbccddbk.kbcddpqdddddcbk.kbddcbk',
      'kbcdddbk.kbcdddddddddcbk.kbdddbk',
      'kbcdddbk.kbccddddddddcbk.kbdddbk',
      'kbccddbk.kbccddddddddcbk.kbddcbk',
      'kbcdddbk.kbccddpqddddcbk.kbdddbk',
      'kbcdddbkkkbbcddddddddcbkkkbdddbk',
      'kbcddcbbbbbbcddddddddcbbbbbcddbk',
      'kbbcddddcbbbcddddddddcbbbcddddbk',
      '.kbbcdddcbbbbcdddddddcbbcdddbbk.',
      '..kbbcccbbbbbcccccccccbbcccbbk..',
      '...kkbbbbkbbcccccccccbbkbbbbkk..',
      '....mkkkkkbccdddddddccbkkkkkkm..',
      '....mm...kbccddddddddccbk...mm..',
      '.....m...kbccddbkkbddccbk....m..',
      '........kbccddbk.kbddccbk.......',
      '........kbcdddbk.kbdddcbk.......',
      '........kkkkkkk..kkkkkkk........',
    ],
  };

  // 29. Lantern Moth - large moth with glowing orange lantern abdomen
  S.lantern_moth = {
    w: 32, h: 32,
    pal: {
      k: '#191223', // outline
      b: '#453552', // wing dark
      c: '#6f5c80', // wing mid
      d: '#a493b5', // wing light
      v: '#ded2ea', // wing pale
      o: '#b04c08', // abdomen dark
      p: '#f08a18', // abdomen mid
      q: '#ffd870', // abdomen glow
      f: '#5a4630', // fur
      e: '#ff4a3a', // eye
    },
    px: [
      '................................',
      '.....kk...................kk....',
      '....kbbk...k..........k..kbbk...',
      '...kbccbk..kk........kk.kbccbk..',
      '..kbcddcbk..kk......kk.kbcddcbk.',
      '..kbcdvdcbk..kkffkkk..kbcdvdcbk.',
      '.kbcdvvvdcbkkfffffffkkbcdvvvdcbk',
      '.kbcdvvvvdcbkfeffefkbcdvvvvvdcbk',
      '.kbcdvvvvvdcbkfffffkbcdvvvvvdcbk',
      '.kbcddvvvvdcbkfffffkbcddvvvvdcbk',
      '.kbccddvvvdccbkfffkbccddvvvddcbk',
      '.kbbccddvddccbkfffkbccddvddccbbk',
      '..kbbccdddccbbkfffkbbccdddccbbk.',
      '..kkbbccdccbbkkfffkkbbccdccbbkk.',
      '....kbbcccbbk.kofok.kbbcccbbk...',
      '....kkbbcbbkk.kopok.kkbbcbbkk...',
      '.....kkbbbkk..koppok..kkbbbkk...',
      '.......kkk...kopqqpok...kkk.....',
      '............kopqqqqpok..........',
      '...........kopqqqqqqpok.........',
      '...........kopqqqqqqpok.........',
      '..........kopqqqqqqqqpok........',
      '..........kopqqqqqqqqpok........',
      '..........kopqqqqqqqqpok........',
      '...........kopqqqqqqpok.........',
      '...........kkopqqqqpokk.........',
      '.............kopqqpok...........',
      '..............kooook............',
      '...............kkkk.............',
      '................................',
      '................................',
      '................................',
    ],
  };

  // 30. Piranha Swarm - leaping silver-red piranhas with sharp teeth and splash
  S.piranha_swarm = {
    w: 32, h: 32,
    pal: {
      k: '#0c1420', // outline
      s: '#4e6070', // silver dark
      i: '#8fa2b2', // silver mid
      l: '#d8e4ee', // silver light
      r: '#bd3a30', // red belly
      t: '#f7f2e6', // teeth
      e: '#ffd23a', // eye
      w: '#2f7fb8', // water
      v: '#8fd8f2', // foam
    },
    px: [
      '................................',
      '..........kkkk..................',
      '.......kkkislsikk...............',
      '.....kkisssllllsik..............',
      '...kkilllllllllsikk.....kkkk....',
      '..kisstttrrssiisikk..kkkislsik..',
      '.ktttterrrssiiiisik.kislllllsik.',
      'ktttkrrrrssiiiiiissikillllllsikk',
      '.kttrrrrssiiiiiiisssikttteirrsik',
      '..kkrrrssiiiiiiiiissikttterrrsik',
      '....kkkssiiiiiiiisskkttkkrrrssik',
      '.......kkkkiiiiskk.ktt.krrrssiik',
      '..........kkkkkk....k..kkrrssiik',
      '.....kkkk................kssiikk',
      '...kkislsikk...............kkkk.',
      '..kislllllsikk..................',
      '.killlllllllsikkkk..............',
      'kttteirrrsssiiiiisik............',
      'kttterrrrsssiiiiiisik...........',
      'kttkkrrrssssiiiiiissik..........',
      '.k..kkrrssssiiiiiisskk..........',
      '.....kkkkssssiiisskk............',
      '........kkkkkkkkkkk.............',
      '..v...v.....v.......v....v......',
      '.vwv.vwv...vwv.....vwv..vwv.....',
      'vwwwvwwwv.vwwwv...vwwwvvwwwv....',
      'wwwwwwwwwwwwwwwwwwwwwwwwwwwwv...',
      'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww..',
      'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww.',
      'kwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwk',
      'kkwwwwwwwwwwwwwwwwwwwwwwwwwwwkk.',
      '..kkkkkkkkkkkkkkkkkkkkkkkkkkk...',
    ],
  };

  // 31. Coil Viper - coiled green snake with yellow diamonds, hood flared
  S.coil_viper = {
    w: 32, h: 32,
    pal: {
      k: '#0b2410', // outline
      b: '#1d5622', // scale dark
      c: '#3b8a30', // scale mid
      d: '#6bb948', // scale light
      y: '#f2d24a', // diamond
      e: '#ff3a2a', // eye
      t: '#e8506a', // tongue
      w: '#f5efe0', // fang
      m: '#5c1420', // mouth
    },
    px: [
      '.................kkkkk..........',
      '..............kkkbbbbbkkk.......',
      '............kkbbcccccccbbkk.....',
      '...........kbbcddyyddyyddcbk....',
      '..........kbccddyyddddyyddcbk...',
      '.........kbccdyyddddddddyyddcbk.',
      '........kbccdyddddddddddddyddcbk',
      '.....kkkkbccddddddddddddddddddbk',
      '...kkbbbbcccddddddddddddddddddbk',
      '..kbbcccccccdddddddddddddddddcbk',
      '.kbccecccccccddddddddddddddddcbk',
      'kbcckkcccccccddddddddddddddddcbk',
      'kbccccccccccccdddddddddddddddcbk',
      'kbccwwccccccccddddddddddddddcbbk',
      '.kbmmmmcccccccdddddddddddddcbbk.',
      'tkkbbbbbcccccccddddddddddccbbk..',
      't...kkkbbbccccccccdddddcccbbkkk.',
      '.......kbbcccccccddccbbkk.......',
      '......kbccdyyddyyddyyddcbk......',
      '.....kbccdyyddyyddyyddyycbk.....',
      '....kbccdyddddyyddyyddyyccbk....',
      '....kbccccdddccccccdddcccbbk....',
      '...kbbbbbbbbbbbbbbbbbbbbbbbk....',
      '..kbbcccccccccccccccccccbbbk....',
      '..kbcccdyyddyyddyyddyyddcbbk....',
      '.kbccdyyddyyddyyddyyddyycbbk....',
      '.kbccdyddddyyddyyddyyddyccbk....',
      '.kbcccccdddccccccdddcccccbbk....',
      '.kbbbbbbbbbbbbbbbbbbbbbbbbbk....',
      '..kbbbccccccccccccccccccbbk.....',
      '...kkbbbbbbbbbbbbbbbbbbbkk......',
      '.....kkkkkkkkkkkkkkkkkkk........',
    ],
  };

  // 32. Spore Bat - bat covered with glowing green fungus spots
  S.spore_bat = {
    w: 32, h: 32,
    pal: {
      k: '#150f1c', // outline
      b: '#332840', // wing dark
      c: '#52415e', // wing mid
      d: '#7c6689', // wing light
      f: '#3f382c', // fur
      g: '#2f7a2a', // fungus dark
      n: '#8cff6a', // fungus glow
      e: '#ffcf3a', // eye
      w: '#f2ecdc', // fang
    },
    px: [
      '................................',
      '................................',
      '.............k.....k............',
      '............kdk...kdk...........',
      '............kfdk.kdfk...........',
      '.............kffkkffk...........',
      '.kk..........kffffffk........kk.',
      'kbdk........kkffffffkk......kdbk',
      'kbcdk.......kfeffffefk.....kdcbk',
      'kbccdk......kfkfffffkfk...kdccbk',
      'kbcccdkk....kffwfffwffk..kkdcccb',
      'kbccnccdkk..kkfffffffkk.kkdccnck',
      'kbccnnccddkk.kfffffffk.kkddccnnc',
      '.kbccncccdddkkfffffffkkdddcccnck',
      '.kbcccccccdddkfffffffkdddcccccbk',
      '.kkbcncccccddkfffffffkddcccccnbk',
      '..kbcnncccccdkfffffffkdcccccnncb',
      '..kbcnccccccckfffffffkccccccncbk',
      '...kbccccccccckfffffkcccccccccbk',
      '...kbcccngccccckfffkccccgnccccbk',
      '....kbcccnnccccckfkccccnnnccccbk',
      '....kkbcccngcccckkkcccgncccccbkk',
      '.....kkbccccccbkkkkkbcccccccbkk.',
      '.......kkbbbbbk.k.kbbbbbbbkkk...',
      '.........kkkkk.....kkkkkkk......',
      '................................',
      '..n........n..........n.........',
      '.......n.........n..........n...',
      '................................',
      '................................',
      '................................',
      '................................',
    ],
  };

  // 33. Orchid Mantis - pink-white mantis shaped like orchid petals
  S.orchid_mantis = {
    w: 32, h: 32,
    pal: {
      k: '#3a1030', // outline
      r: '#b8558a', // petal dark
      p: '#e894be', // petal mid
      q: '#f8dceb', // petal light
      w: '#fff6fb', // petal white
      g: '#5f9a48', // green
      e: '#ffe14a', // eye
      m: '#2a0a20', // eye pupil
    },
    px: [
      '................................',
      '................................',
      '.....k.......k..................',
      '......k.....k...................',
      '.......k...k....................',
      'kkk.....kkkk....................',
      'kprk...kqqqqqk..................',
      'kpqrk.kqeeqqeeqk................',
      'kpqrkkqemmqqemmqk...............',
      '.kpqrkqeeqqqqeeqk...............',
      '.kpqrkkqqwwwwwqqk...............',
      '..kpqrkkkpqqqqqpkkkk............',
      '..kpqqrkkpqqqqqqqqqqppkkk.......',
      '...kppqqqpqwwwwwwwwwwwqqppkk....',
      '....kkpqqqqwwwwwwwwwwwwwwqqppk..',
      '......kpqqqrrrrrrrrrrrrrrrrqqppk',
      '......kpqqqwwwwwwwwwwwwwwwwwwqpk',
      '......kpqqqrrrrrrrrrrrrrrrrrrqpk',
      '......kpqqqwwwwwwwwwwwwwwwwwqqpk',
      '.....kkpqqqqrrrrrrrrrrrrrrrqqppk',
      '....kkpqqqqqqwwwwwwwwwwwwqqpppk.',
      '...kkpqqqqqqqqqqqqqqqqqqqppkk...',
      '...kkkppqqqqqqqqqqqqqqqppkkk....',
      '.....kkkkppppppppppppppkkk......',
      '........kg....kg....kg....kg....',
      '.......kgk...kgk...kgk...kgk....',
      '......kgk...kgk...kgk...kgk.....',
      '.....kgk...kgk...kgk...kgk......',
      '.....kgk..kgk...kgk...kgk.......',
      '....kgk..kgk...kgk...kgk........',
      '....kk...kk....kk....kk.........',
      '................................',
    ],
  };

  // 34. Jungle Bandit - human bandit with bandana, machete, leather vest
  S.jungle_bandit = {
    w: 32, h: 32,
    pal: {
      k: '#170f08', // outline
      s: '#8a5a30', // skin dark
      t: '#c08a54', // skin mid
      u: '#e8b47c', // skin light
      r: '#b8302e', // bandana
      n: '#7a1c1c', // bandana dark
      v: '#6b4423', // vest
      x: '#9a6a35', // vest light
      m: '#b9c4cc', // machete
      e: '#f5efe0', // eye
    },
    px: [
      '................................',
      '..........................kmk...',
      '.........................kmmk...',
      '........................kmmk....',
      '.......................kmmk.....',
      '.........kkkkkk.......kmmk......',
      '.......kknrrrrnkk....kmmk.......',
      '......knrrrrrrrrnk..kmmk........',
      '.....knrrrrrrrrrrnk.kmk.........',
      '.....krrnnrrrrnnrrkkkkk.........',
      '....kktttttttttttkkkxxk.........',
      '...ktuuuuuuuuuuuutkxxxk.........',
      '...ktuekuuuuekuuutkxxxk.........',
      '...ktuuuuuuuuuuuutkxvxk.........',
      '...kktuuuuuuuuuuutkxvxk.........',
      '.....ktuukkkkuuutkkxvxk.........',
      '.....kkstuuuuuutskkxvvxk........',
      '.......kkkssskkk.kxvvxk.........',
      '........kkvvvvkkkkxvvxk.........',
      '.....kkkvvxxvvvvvxxvvxkk........',
      '...kktuukvxxxvvvvxxvvvvxk.......',
      '..ktuuuukvxxvvvvvxxvvvvxk.......',
      '..ktuuutkvvxxvvvvxxvvvvxk.......',
      '..kktttkkvvvxxvvvxxvvvvxk.......',
      '....kkk.kvvvvxxvvxxvvvvxk.......',
      '........kvvvvvvvvvvvvvvxk.......',
      '........kkvvvvkkkvvvvvvkk.......',
      '.........kvvvk..kvvvvvk.........',
      '.........kvvvk..kvvvvvk.........',
      '.........kvvvk..kvvvvvk.........',
      '........kkvvvkk.kkvvvvkk........',
      '........kkkkkk..kkkkkkk.........',
    ],
  };

  // 35. Bone Picker - scraggly vulture with bald red head, holding a bone
  S.bone_picker = {
    w: 32, h: 32,
    pal: {
      k: '#120e0a', // outline
      b: '#2c261f', // feather dark
      c: '#4e463a', // feather mid
      d: '#7c705e', // feather light
      r: '#9e3f3a', // bald head
      p: '#d97a66', // head light
      y: '#e8b83a', // beak
      e: '#ffe14a', // eye
      w: '#efe8d4', // bone
    },
    px: [
      '................................',
      '.......kkkkk....................',
      '.....kkrrpprkk..................',
      '....krrppppprrk.................',
      '...krppperpppprk................',
      '...krppekkppprrk................',
      '..kyykrpppppprrk................',
      '.kyyykrrppppprrk................',
      'kyyykkkrrpppprk.................',
      'kyykk..krrpprrk.................',
      'kkk.....krrrrk..................',
      '.kwk...kkrrrrkk.................',
      'kwwwk..kkrrrrkk.........kk......',
      '.kwwwwwwkrrrrkk.......kkbbk.....',
      '..kkwwwwwkrrrbkk....kkbbccbbk...',
      '.....kwwwkbrrbbbkkkkbbccddccbk..',
      '......kkkkbbrbbbbbbbccddddddcbk.',
      '.....kbdccccbbbbbbbbcdddddddcbbk',
      '....kbdddcccccbbbbbbcddddddddcbk',
      '....kbdddcccccccbbbbcddddddddcbk',
      '....kbddcccccccccbbbbcdddddddcbk',
      '....kbdcccccccccccbbbbcdddddcbbk',
      '....kbcccccccccccccbbbbcdddcbbbk',
      '....kkbccccccccccccbbbbbcccbbbk.',
      '.....kkbbcccccccccccbbbbbbbbbk..',
      '.......kkbbbcccccccccbbbbbbkk...',
      '.........kkbbbbcccccbbbbkkk.....',
      '...........kkkbbbbbbbkkk........',
      '............kyk..kyk............',
      '............kyk..kykk...........',
      '..........kkykykkykyk...........',
      '..........kkkkkkkkkkk...........',
    ],
  };

  // 36. Glow Slug - big slug with bioluminescent cyan spots and slime trail
  S.glow_slug = {
    w: 32, h: 32,
    pal: {
      k: '#0e1a20', // outline
      b: '#38492f', // body dark
      c: '#5f7a4c', // body mid
      d: '#90ae72', // body light
      n: '#2fd8c8', // glow dark
      m: '#a8fff4', // glow bright
      e: '#ffe14a', // eye
      s: '#4bb8b0', // slime
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '...kk.....kk....................',
      '..kmnk...kmnk...................',
      '..knbk...knbk...................',
      '..kbck...kbck...................',
      '...kbk...kbk............kkkk....',
      '...kbck.kbck.........kkkdddkkk..',
      '....kbckbck........kkbdddddddkk.',
      '....kbcbbck......kkbdddnmnddddkk',
      '...kkbbbbbkkkkkkkbddddnmmmnddddk',
      '..kbccccccccccbbbddddnmmmmmndddk',
      '.kbcedccccccccccddddddnmmmnddddk',
      'kbccccdccccnmnccddddddddnmnddddk',
      'kbcdccccccnmmmnccdddnmndddddddbk',
      'kbccccdcccnmmmnccddnmmmnddddddbk',
      'kbccdccccccnmnccdddnmmmndddddbbk',
      'kbccccccccccccccddddnmndddddbbk.',
      'kbcdcccnmnccccccdddddddddddbbk..',
      'kbccccnmmmnccccdddddddddddbbk...',
      'kbcccccnmmnccccccddddddddbbk....',
      'kbcccccccnccccccccdddddbbbk.....',
      '.kbccccccccccccccccddbbbkk......',
      '.kkbbccccccccccccbbbbbkkk.......',
      '..kkbbbbbbbbbbbbbbbkkk..........',
      '...kkkkkkkkkkkkkkkkk............',
      '.ssssssssssssssssss.............',
      'sssssssssssssssssss.............',
      '.sss..sss..sss..sss.............',
      '................................',
    ],
  };

  // 91. Ogre Chieftain (ELITE) - grey-green ogre with skull necklace and huge club
  S.ogre_chieftain = {
    w: 40, h: 40,
    pal: {
      k: '#12180e', // outline
      b: '#3d5233', // skin dark
      c: '#5f7a4c', // skin mid
      d: '#89a46c', // skin light
      w: '#ece2c8', // bone
      n: '#5a3a1e', // club dark
      m: '#8a5e2e', // club mid
      o: '#b58848', // club light
      e: '#ffd23a', // eye
      r: '#8a3a2a', // loincloth
    },
    px: [
      '........................................',
      '..............kkkkkkkkk.................',
      '...........kkkbbbccccbbkkk..............',
      '.........kkbbccccddddccccbbkk...........',
      '........kbbccccddddddddcccbbbk..........',
      '.......kbccccddddddddddddcccbbk.........',
      '.......kbcccdddddddddddddddccbbk........',
      '......kbcccdddddddddddddddddccbk........',
      '......kbccdddeewdddddeewddddccbk........',
      '......kbccdddeewdddddeewddddccbk........',
      '......kbcccddwwwdddddwwwdddcccbk........',
      '......kbccccddddddddddddddccccbk........',
      '.......kbcccccdwwwwwwwwdcccccbk.........',
      '.......kbccccccwkwkwkwwccccccbk.........',
      '........kbccccccwwwwwwccccccbk..........',
      '.........kkbccccccccccccccbkk...........',
      '...........kkbbccccccccbbkk.............',
      '..........kkkkkwwwwwwwwkkkkk............',
      '........kkkbbbwkwkwkwkwbbbkkk...........',
      '.....kkkbbccbbwwwwwwwwwbbccbbkkk........',
      '..kkkbbbccccbbbbccccbbbbccccbbb..kkkkk..',
      '.kbbbcccccccccccccccccccbbbbbbb.knnnnnk.',
      'kbcccddcccccccccccccccddcccbbbbknmooomnk',
      'kbcbdddccccccccccccccdddccbbbbbknmowomnk',
      'kbckdddccccccccccccccdddccbbbbbknmooomnk',
      'kbckddcccccrrrrrrccccddccbbbbbbknmowomnk',
      'kbckcccccrrrrrrrrrrccccccbbbbbbknmooomnk',
      'kbckcccrrrrrrrrrrrrccccbbbbbbbb.knmmmnk.',
      'kbckdccckrrrrrrrrrrrrkccccdccbk..knmnk..',
      'kbckddcckrrrrrrrrrrrrkcccddccbk..knmnk..',
      'kbckddcckrrrrrrrrrrrrkccddccbbk..knmnk..',
      'kbccdccbkkrrrrrrrrrrrrkkbccdccb..knmnk..',
      '.kbcccbbk.krrrrrrrrrrk..kbbcccb..knmnk..',
      '.kbbbbbbk.kkrrrrrrrrkk...kbbbbb..knmnk..',
      '..kkkkkk...kkkkkkkkkk.....kkkkk..knmnk..',
      '.........kbcddcbcddcbk...........knmnk..',
      '.........kbccccbccccbk...........knmnk..',
      '........kbbccccbccccbbk..........knmnk..',
      '........kbbbbbbkbbbbbbk..........kknkk..',
      '........kkkkkkk.kkkkkkk...........kkk...',
    ],
  };

  // 92. Swamp Behemoth (ELITE) - massive hippo-like beast covered in swamp weeds and mud
  S.swamp_behemoth = {
    w: 40, h: 40,
    pal: {
      k: '#0e1408', // outline
      b: '#2f3d26', // hide dark
      c: '#4c6036', // hide mid
      d: '#728449', // hide light
      g: '#2c6b24', // weed dark
      h: '#59ad3c', // weed light
      e: '#ff8a1a', // eye
      w: '#f0ead0', // tusk
      m: '#6e2432', // mouth
      p: '#3f3218', // mud
    },
    px: [
      '........................................',
      '........................................',
      '........................................',
      '.................h.....h....h...........',
      '.........h..hh..khk...khk..khk..h.......',
      '........khk.kgk.kgk.h.kgk.kgkkghk.......',
      '.......kghkkghkkghkkghkkghkkghgkk.......',
      '......kkghghghghghghghghghghghgkk.......',
      '....kkkbghghghghghghghghghghgbbbkkk.....',
      '...kbbbbbgbgbgbgbgbgbgbgbgbbbbbbbbkk....',
      '..kbbccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk...',
      '.kbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbk..',
      'kbcccddccccbbbbbbbbbbbbbbbbbbbbbbbbbbbk.',
      'kbccddddcccccbbbbbbbbbbbbbbbbbbbbbbbbbbk',
      'kbccddddddcccccbbbbbbbbbbbbbbbbbbbbbbbbk',
      'kbcddddddddccccccbbbbbbbbbbbbbbbbbbbbbbk',
      'kbcddeddddddccccccccbbbbbbbbbbbbbbbbbbbk',
      'kbcdkkkdddddddccccccccbbbbbbbbbbbbbbbbbk',
      'kbcddddddddddddccccccccccbbbbbbbbbbbbbbk',
      'kbcddddddddddddddccccccccccbbbbbbbbbbbbk',
      'kbcdddddddddddddddddccccccccbbbbbbbbbbbk',
      'kbcddddddddddddddddddddccccccbbbbbbbbbbk',
      'kwkddddddddddddddddddddddccccbbbbbbbbbbk',
      'kwkmmmmmmmmmmmmmddddddddddccccbbbbbbbbbk',
      'kwkmwmwmwmwmwmmmmdddddddddddcccbbbbbbbbk',
      '.kkmmmmmmmmmmmmmmmdddddddddddccbbbbbbbbk',
      '..kkkkkkkkkkkkkkmmmmddddddddddccbbbbbbbk',
      '.......kwk...kwkkkkkmmmddddddddccbbbbbbk',
      '.......kkk...kkk..kkkkkddddddddccbbbbbbk',
      '.........kbbbbccccccccdddddddddccbbbbbbk',
      '........kbbccccccccccccddddddddccbbbbbk.',
      '........kbccccbbbbbbccccddddddccbbbbbbk.',
      '.......kbbcccbk...kbbccccdddddccbbbbbbk.',
      '.......kbcccbk.....kbcccccddccbbbbbbbbk.',
      '.......kbcccbk.....kbccccccbbbbbbbcbbk..',
      '......kbbcccbk.....kbcccbbbbkkbbbbbbbk..',
      '......kbbcccbbk...kbbcccbbbk..kbbbbbbk..',
      '......kbbbbbbbk...kbbbbbbbbk..kbbbbbk...',
      '......kbppppbbk...kbppppbbbk..kbppbbk...',
      '......kkkkkkkkk...kkkkkkkkkk..kkkkkkk...',
    ],
  };
})();
