// js/sprites/heroes_c.js — Heroes 24–30. Heroes FACE RIGHT.
(function () {
  const S = (window.DJ = window.DJ || {}).SPRITES || (DJ.SPRITES = {});

  // 24. Toucan Bard — upright toucan, huge orange/yellow beak, blue-green plumage, lute, feathered cap
  S.toucan_bard = {
    w: 32, h: 32,
    pal: {
      k: '#151a2e', // outline
      b: '#173a86', // plumage dark
      c: '#2f6fd0', // plumage mid
      d: '#4fd8b8', // plumage light (belly/wing sheen)
      o: '#e8681a', // beak orange / feet
      y: '#ffc324', // beak yellow / cap plume
      w: '#f6f0dc', // chest bib
      n: '#9a6428', // lute wood
      e: '#ffe14a', // eye / sound hole
    },
    px: [
      '................................',
      '.....kdk........................',
      '.....kddk.......................',
      '......kddk......................',
      '........koooooooooook...........',
      '.......kooyyyyyyyook............',
      '......kkkkkkkkkkkkkk............',
      '........kbbcccccccbk............',
      '........kbccccccccbkkkkkkkkkkk..',
      '........kbccccecccbkoyyyyyyyyyk.',
      '........kbccccccccbkooyyyyyyyok.',
      '........kbccccccccbkooooooooook.',
      '........kbccccccccbkooooooookkk.',
      '........kbccccccccbkkkkkkk......',
      '.........kbcccccccbk....knk.....',
      '.......kbbcccccccbbk....knk.....',
      '......kbcccccccccccbk...knk.....',
      '...kdk.kbccwwwwwwwccbk..knk.....',
      '.kddckkbccwwwwwwwccbk...knk.....',
      'kdddckkbccwwwwwwwccbk..knnnnk...',
      'kdddckkbccwwwwwwwccbkdknnnnnnk..',
      'kbddckkbdcwwwwwwwccbkdknnennnk..',
      '.kbdckkbddcwwwwwwccbkdknneennk..',
      '..kbckkbdddcwwwwwccbkdknnennnk..',
      '...kkkkbddddcwwwwccbk.knnnnnnk..',
      '......kbdddddcwwwccbk.knnnnnnk..',
      '......kbbddddddccccbk..knnnnk...',
      '.........kok...kok....kkkkkk....',
      '.........kok...kok..............',
      '.........kok...kok..............',
      '.........koook.kooook...........',
      '.........kkkkk.kkkkkk...........',
    ],
  };

  // 25. Scarab Alchemist — upright blue-green scarab, goggles pushed up, bubbling flask, vial satchel
  S.scarab_alchemist = {
    w: 32, h: 32,
    pal: {
      k: '#101426', // outline
      b: '#15286e', // shell dark
      c: '#2a58b8', // shell mid
      d: '#3fb0d8', // shell light
      v: '#7ff0c0', // iridescent green sheen
      g: '#e0a828', // brass goggle frame
      l: '#cfe8f5', // glass
      e: '#9dff3c', // potion glow / eyes
      n: '#7a4a26', // satchel leather
    },
    px: [
      '................................',
      '................................',
      '...........b.......b............',
      '............b.....b.............',
      '.........kgggkkkkgggk...........',
      '.........kglgkbbkglgk...........',
      '.........kgggkkkkgggk...........',
      '.........kbbccccccbbk...........',
      '.........kbccccccccbk...........',
      '.........kbccecceccbk...........',
      '.........kbccccccccbk....e..e...',
      '..........kbcvvvvcbk...e...e....',
      '...........kbvvvvbk......kk.....',
      '.......kbbccccccccbbk....klk....',
      '......kbccccccccccccbk...klk....',
      '......kbcdddddddddddbk...klk....',
      '......kkkkkkkkkkkkkkkk..klllk...',
      '.e.e.kbcccccckccccccbk.kllllllk.',
      'knnnkkbcdddddkddddddbk.kleeeelk.',
      'kneekkbcdvvvvkvvvvvdbk.kleeeelk.',
      'knnnkkbcdvvvvkvvvvvdbkckleeeelk.',
      'kneekkbcdvvvvkvvvvvdbkckleeeelk.',
      'knnnkkbcdvvvvkvvvvvdbk.kkeeeekk.',
      'knnnkkbcdvvvvkvvvvvdbk..kkkkkk..',
      'kknkkkbcddvvvkvvvvddbk..........',
      '.kkk.kbcdddvvkvvvdddbk..........',
      '.....kbbcdddddddddcbbk..........',
      '......kbbcccccccccbbk...........',
      '........kbck..kbck..............',
      '........kbck..kbck..............',
      '........kbck..kbck..............',
      '.......kbcccckbcccck............',
    ],
  };

  // 26. Sloth Sentinel — shaggy sloth in mossy stone armour, huge claws, sleepy eyes, slab shield
  S.sloth_sentinel = {
    w: 32, h: 32,
    pal: {
      k: '#1a1610', // outline
      b: '#4a423a', // fur dark
      c: '#7a6e5e', // fur mid
      d: '#a89880', // fur light / shaggy
      a: '#4e5a56', // stone dark
      s: '#8a968e', // stone mid
      m: '#2f6b28', // moss
      w: '#ece6d2', // claws / teeth
      e: '#ffb43a', // sleepy eye glow
    },
    px: [
      '................................',
      '.........kmmkmmkmmk.............',
      '........kasssssssssak...........',
      '........kasmssssmssak...........',
      '........kassssssssssk...........',
      '........kakkkkkkkkkak...........',
      '........kbcccccccccbk...........',
      '........kbcdddddddcbk...........',
      '........kbcbbbbbbbcbk...........',
      '........kbcbeebbeebbk...........',
      '........kbcbbbbbbbbbk.kkkkkkkkk.',
      '........kbcdwwwwwddbk.kasssssak.',
      '........kbcdwkkkwddbk.kasmmssak.',
      '.........kbcdwwwwdbk..kassssssk.',
      'kbcckkbbccccccccccbbkkkasmsssak.',
      'kbcckkbccdddddddddccbkkassssssk.',
      'kbcckkbcaassssssaaacbkkassmsssk.',
      'kbcckkbcaasmmmmmsaacbkkasmsssak.',
      'kbcckkbcaasmmmmmsaacbkkassssssk.',
      'kbcckkbcaassmmmssaacbkkasssmssk.',
      'kbcckkbcaasssssssaacbkkassssssk.',
      'kbcckkbcaaasssssaaacbkkasssssak.',
      'kbcckkbccaaaaaaaaaccbkkasssssak.',
      'kbcckkbccdddddddddccbk.kasssak..',
      'kbcckkbccdddddddddccbk..kkkkk...',
      'kwwwkkbccdddddddddccbk..........',
      'kwwwkkbbcddddddddcccbk..........',
      'kwwkwwk.kbcck..kbcck............',
      '.kwwkwwkkbcck..kbcck............',
      '.kwwkwwkkbcck..kbcck............',
      '..kkkkk.kbccddkkbccddk..........',
      '........kkkkkkkkkkkkkk..........',
    ],
  };

  // 27. Peacock Duelist — slender iridescent peacock, fanned eye-feather tail, rapier salute, plumed hat
  S.peacock_duelist = {
    w: 32, h: 32,
    pal: {
      k: '#101a3a', // outline
      b: '#123a8e', // body blue dark
      c: '#1f66c8', // body blue mid
      d: '#5ab8f8', // body blue light
      g: '#1f7a52', // tail green dark
      n: '#3fbf7a', // tail green
      y: '#e8c23a', // gold eye-feather ring / legs / beak
      s: '#dde6f2', // rapier steel
      e: '#ff5aa8', // eye-feather core / plume
    },
    px: [
      '................................',
      '........................ksk.....',
      '....................kee.ksk.....',
      '...................kee..ksk.....',
      '.............kbbbbbbk...ksk.....',
      '............kbbccccbbk..ksk.....',
      '...........kkkkkkkkkkkk.ksk.....',
      '.............kbccccbk...ksk.....',
      '.......kngnk.kbcdccbk...ksk.....',
      '.....kngnngk.kbceccbkyk.ksk.....',
      '....kyyygnnk.kbccccbk...ksk.....',
      '...knyeygnnk.kbccbk.....ksk.....',
      '..knnyyygnnkkbbccccbbk..ksk.....',
      '.knngnnngnnkkbccddccbk..ksk.....',
      '.knnnnngnnnkkbccddccbk..ksk.....',
      'kngnnnnngnnkkbccddccbk..ksk.....',
      'knyyygnnngnkkbccddccbk..ksk.....',
      'knyeygnnnnnkkbccddccbk..ksk.....',
      'knyyygnnngnkkbccddccbk..ksk.....',
      'knnnngnnnngkkbccddccbkkssssk....',
      'kngnnnnngnnkkbccddccbkcckbk.....',
      '.knngnnngnnkkbccddccbkcckbk.....',
      '.knnnyyygnnkkbccddccbk..kkk.....',
      '..knnyeygnnkkbccddccbk..........',
      '...knyyygnnkkbccddccbk..........',
      '....kngnnngkkbccddccbk..........',
      '.....kngnngkkbccdccbk...........',
      '.......kkkkk.kyk..kyk...........',
      '.............kyk..kyk...........',
      '.............kyk..kyk...........',
      '............kyyyk.kyyyk.........',
      '............kkkkk.kkkkk.........',
    ],
  };

  // 28. Crocodile Warlord — huge two-legged croc, bone/bronze pauldrons, back banner, tooth-studded club
  S.croc_warlord = {
    w: 32, h: 32,
    pal: {
      k: '#0c1a10', // outline
      b: '#1b4a24', // scale dark
      c: '#2f7a34', // scale mid
      d: '#5aa845', // scale light / belly
      w: '#efe6cc', // bone / teeth / studs
      z: '#c08a2a', // bronze
      r: '#a8262e', // banner cloth
      n: '#6b4a24', // club haft
      e: '#ffd12a', // eye
    },
    px: [
      '................................',
      '.......kzk......................',
      '.......knk......................',
      'krrrrrkknk......................',
      'krrwrrkknk..kbk.kbk.............',
      'krwwwrkknk..kek.kek.............',
      'krrwrrkknkkbcccccccbk...........',
      'krrrrrkknkkbcdddddcbk...........',
      'krwrwrkknkkbcdddddcbk...........',
      'krrrrrkknkkbcddddddddddddddddk..',
      'kkrrrkkknkkbccccccccccccccccck..',
      '..krk..knkkbcccccccccccccccck...',
      '...k...knkkwkwkwkwkwkwkwkwkk....',
      '.......knkkbccccccccccccbk......',
      'kwzzkkbbcccccccccccbbkwzzk......',
      'kzwwkkbccdddddddddccbkzwwk......',
      'kzwwkkbccdddddddddccbkzwwk......',
      'kkzzkkbczzzzzzzzzzzcbkkzzk......',
      '.kkk.kbczwwwwwwwwwzcbk...knk....',
      '.....kbczzzzzzzzzzzcbkkckknk....',
      '.....kbczwwwwwwwwwzcbkkckknk....',
      '.....kbczzzzzzzzzzzcbk...knk....',
      '.....kbcckkkkkkkkkccbk...knnk...',
      '.....kbcccdddddddcccbk..knnnnk..',
      '.....kbcccdddddddcccbkwknnnnnnkw',
      '.....kbcccdddddddcccbkwknnnnnnkw',
      '.....kbccdddddddddccbk.knnnnnnk.',
      '.....kbbcdddddddddcbbkwknnnnnnkw',
      '.......kbcck..kbcck...wknnnnnnkw',
      '.......kbcck..kbcck....knnnnnnk.',
      '.......kbccdwkkbccdwk.wknnnnnnkw',
      '.......kkkkkkkkkkkkkk..kkkkkkkk.',
    ],
  };

  // 29. Axolotl Mystic — pale pink axolotl, magenta feathery gills, water-blue robes, floating orb
  S.axolotl_mystic = {
    w: 32, h: 32,
    pal: {
      k: '#2a1030', // outline
      p: '#f9c8d6', // skin light
      q: '#dfa0b6', // skin shade
      m: '#c02a86', // gill dark
      r: '#ff7ac8', // gill light
      b: '#173f80', // robe dark
      c: '#3a86c8', // robe mid
      d: '#8fd8f5', // robe light
      e: '#9ffff0', // orb glow
    },
    px: [
      '................................',
      '................................',
      '................................',
      '...mr......kppppppk......rm.....',
      '....mrr...kppppppppk...rrm......',
      '.....mrr.kppppppppppk.rrm.......',
      '......mrrkppkppppkppkrrm........',
      '...mrmrmrkppppppppppkrmrmrm.....',
      '.mrrmrrmrkppppppppppkrmrrmrrm...',
      '...mrmrmrkpqqqqqqqqpkrmrmrm.....',
      '......rrmkpqkqqqqkqpkmrr........',
      '.....rrm..kpqkkkkqpk.mrr........',
      '....rrm....kpqqqqpk...mrr.......',
      '...rm.......kpqqpk.....mr.......',
      '.........kbbccccccccbbk.........',
      '........kbccccccccccbk..kkkkk...',
      '........kbccdddddddcbk.kkeeekk..',
      '.......kbcccddddddddcbkkeeeeek..',
      '.......kbcccddddddddcbkkeeeeek..',
      '.......kbcccddddddddcbkkeeeeek..',
      '.......kbcccddddddddcbk.kkeeekk.',
      '.......kbcccddddddddcbkq.kkkkk..',
      '......kbcccdddddddddcbkqkppk....',
      '......kbcccdddddddddcbkkkkk.....',
      '.....kbccccdddddddddccbk........',
      '.....kbccccdddddddddccbk........',
      '....kbcccccdddddddddcccbk.......',
      '....kbcccccdddddddddcccbk.......',
      '...kbccccccdddddddddccccbk......',
      '..kbcccccccdddddddddcccccbk.....',
      '.kbcccccccddddddddddccccccbk....',
      '.kkbkkbkkbkkbkkbkkbkkbkkbkkk....',
    ],
  };

  // 30. Termite Swarmlord — armoured pale-tan termite lord, crown ridge, chitin plates, swarming brood
  S.termite_swarmlord = {
    w: 32, h: 32,
    pal: {
      k: '#1a1208', // outline
      t: '#e8d8ac', // tan light
      u: '#c4ad78', // tan mid
      v: '#8a7448', // tan dark
      b: '#2b2116', // chitin dark
      c: '#4c3b26', // chitin mid
      y: '#e8b83a', // crown gold
      w: '#f6eeda', // mandibles
      e: '#ff6a3a', // eye glow
    },
    px: [
      '................................',
      '........kyk.kyk.kyk.............',
      '.......kyyykyykyyyk....vv.......',
      '.......kyyyyyyyyyyk...vv........',
      '.......kbbbbbbbbbbk..vv.........',
      '.......kbtttttttubk.vv..........',
      '.......kbtttttttubkvv...........',
      '.......kbtttetteubk.............',
      '.......kbtttttttubk.............',
      '.......kbtttttttubkvvwwwwwwk....',
      '.......kbtttttttubkvvwwwwwwwwk..',
      '.......kbtttttttubkkkkk.........',
      '.......kbtttttttubkvvwwwwwwwwk..',
      '.......kbtttttttubkvvwwwwwwk....',
      '........kbtttttubk..............',
      '......kbbccccccccbbk............',
      'kbck..kbccccccccccbkkbck........',
      'kbck..kbccbbbbbbccbkkbck........',
      'kbck..kbccccccccccbkkbck........',
      'kbck..kbkkkkkkkkkkbkkkkk........',
      'kbckkbtuutttttttttuubk..........',
      'kbckkbtuutttttttttuubk..........',
      'kbckkbtuuvvvvvvvvvuubk..........',
      'kkkkkbtuutttttttttuubk..........',
      '....kbtuuvvvvvvvvvuubk..........',
      '....kbtuutttttttttuubk..........',
      '....kbtuuvvvvvvvvvuubk..........',
      '....kbtuutttttttttuubk..........',
      '.....kbbtuuuuuuuutbbk...........',
      '.......kbck..kbck...............',
      '.kutk..kbck..kbck...kutuk.kutk..',
      '.kkkk.kbtttk.kbtttk.kkkkk.kkkk..',
    ],
  };
})();
