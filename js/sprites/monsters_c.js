// js/sprites/monsters_c.js — Tier 3 monsters (37–54) + elites 93–94. Monsters FACE LEFT.
(function () {
  const S = (window.DJ = window.DJ || {}).SPRITES || (DJ.SPRITES = {});

  // 37. Jaguar Stalker — sleek spotted jaguar crouching, glowing yellow eyes
  S.jaguar_stalker = {
    w: 32, h: 32,
    pal: {
      k: '#1a1006', // outline
      b: '#8a5520', // fur dark
      c: '#c58a34', // fur mid
      d: '#e8bc72', // fur light
      s: '#2e1c0a', // spots
      e: '#ffe83a', // eye
      w: '#fff4e0', // fang
      n: '#d97a80', // nose
    },
    px: [
      '................................',
      '..........................kkk...',
      '.........................kbdbk..',
      '.........................kbddk..',
      '.........................kbdk...',
      '........................kbdk....',
      '........................kbdk....',
      '.......................kbdk.....',
      '.......................kbdk.....',
      '.......................kbdk.....',
      '.......................kbdk.....',
      '..kk.....kk............kbdk.....',
      '.kdck...kdck.kkkkkkkkkkkbbk.....',
      '.kdcck.kdcckkccccsccccckkk......',
      '.kdcccckdccckcscccccsccccck.....',
      'kddccccccccccccccccccccscccck...',
      'kdecccccccscccscccccccccccccck..',
      'kdeecccccccccccccccsccccdccccck.',
      'kdncccsccccccsccccccccccddccccck',
      'kkwwccccccccccccccscccccddcccsck',
      '.kkkccscccccccccccccccccdscccbck',
      '...kccccccccscccccccccdddcccccbk',
      '...kccccckkkkkkcccccccddcccccbbk',
      '...kccccck....kcccccccdccscccbk.',
      '...kcccck.....kccccccccccccccbk.',
      '...kcccbk.....kcccbk.kccccccbk..',
      '...kccbk......kccbk..kcccbkkbk..',
      '...kcbk.......kcbk...kccbk.kbk..',
      '...kcbk.......kcbk...kcbk..kbk..',
      '..kbbbk......kbbbk..kbbbk.kbbk..',
      '..kkkkk......kkkkk..kkkkk.kkkk..',
      '................................',
    ],
  };

  // 38. Poison Dart Shaman — tribal shaman, feather headdress, dart pouch, green smoke
  S.dart_shaman = {
    w: 32, h: 32,
    pal: {
      k: '#160f0a', // outline
      b: '#6b4326', // skin dark
      c: '#a06a3a', // skin mid
      w: '#e8dcc4', // bone mask
      r: '#d0402a', // feather red
      y: '#f0c22a', // feather gold
      g: '#2f7a3a', // cloth green
      n: '#7ee06a', // smoke
      e: '#ffe83a', // eye glow
    },
    px: [
      '................................',
      '.........k...k....k.............',
      '........kyk.kyk..kyk............',
      '.......kryk.kryk.kryk...........',
      '.......kryk.kryk.kryk...........',
      '......kryk..kryk..kryk..........',
      '......kkkkkkryykkkkkkk..........',
      '.......kryyyyyyyyyyrk...........',
      '......kkgggggggggggggkk.........',
      '...n.kwwwwwwwwwwwwwwwwk.........',
      '..nn.kwwkkwwwwwwwwkkwwk.........',
      '.nnnnkwkeekwwwwwwkeekwk.........',
      'nnnnnkwkeekwwwwwwkeekwk.........',
      '.nnnnkwwkkwwwwwwwwkkwwk.........',
      '..nn.kwwwwrrwwwwrrwwwwk.........',
      '..n..kkwwwwwwwwwwwwwkk..........',
      '.......kkgggggggggkk............',
      '....kkkkgggggrrgggggkk..........',
      '..kkbckkgggggrrgggggggk.........',
      '.kwbcckgggggggrggggggggk........',
      '.kwkbckgggggggggggggggk.........',
      '..k.kbkggggkyyyykgggggk.........',
      '.....kkgggkyyyyyykggggk.........',
      '.......kggkyyyyyykgggk..........',
      '.......kgggkyyyykggggk..........',
      '.......kggggkkkkgggggk..........',
      '.......kgggggggggggggk..........',
      '.......kkggggkkggggkk...........',
      '........kcck..kcck..............',
      '........kcck..kcck..............',
      '.......kbccbkkbccbk.............',
      '.......kkkkkk.kkkkk.............',
    ],
  };

  // 39. Mangrove Crocodile — long green croc, open jaws, mangrove roots on back
  S.mangrove_croc = {
    w: 32, h: 32,
    pal: {
      k: '#0e1a10', // outline
      b: '#2a5a2e', // scale dark
      c: '#46813c', // scale mid
      d: '#6fae52', // belly light
      w: '#f4f0e0', // teeth
      e: '#e8a020', // eye
      r: '#6b4a2a', // root dark
      m: '#8a6a3a', // root light
      p: '#7a2a2a', // mouth
    },
    px: [
      '................................',
      '................................',
      '................................',
      '..............k....k...k........',
      '..............kr..kr..kr........',
      '...........k..km..km..km........',
      '...........kr.kr.kkr.kkr........',
      '........k..km.km.kmr.km.........',
      '........kr.kr.km.km..kmr........',
      '........km.km.kr.kr..km.........',
      '........kr.kr.kkkkr.kkr.........',
      '.......kkm.kkkkbbbkkkkm.........',
      '......kkbbkkbbbbbbbbbbbkk.......',
      '....kkbbbbbbbbbbbbbbbbbbbbkk....',
      '..kkbbbccbbbccbbbccbbbccbbbbk...',
      '.kbbcccccccccccccccccccccccbbk..',
      'kbcccccccccccccccccccccccccccbk.',
      'kbecccccccccccccccccccccccccccbk',
      'kwcwcwcwcwcwckcccccccccccccccbbk',
      'kkpppppppppkkdcccccccccccccccbbk',
      '.kwcwcwcwcwkdddccccccccccccccbbk',
      '..kbbbbbbbbkkddddddddcccccccbbk.',
      '...kkkkkkkk..kkdddddddddddcbbbk.',
      '..............kkkddddddddddbbbk.',
      '.........kkkkkkkdddkkkddddbbbk..',
      '........kbccbk..kbk..kbccbkkkk..',
      '.......kbcccbk..kbk.kbcccbk.....',
      '.......kbcccbk..kbk.kbcccbk.....',
      '......kbbcccbk..kbk.kbbcccbk....',
      '......kbbbbbk...kbk..kbbbbbk....',
      '......kkkkkk....kkk..kkkkkk.....',
      '................................',
    ],
  };

  // 40. Anaconda — thick coiled dark green anaconda, huge head
  S.anaconda = {
    w: 32, h: 32,
    pal: {
      k: '#0c1408', // outline
      b: '#1e4020', // scale dark
      c: '#356b30', // scale mid
      d: '#5b9a44', // scale light
      m: '#7a6a2a', // pattern olive
      e: '#e8c020', // eye
      w: '#f0e8d0', // fang
      p: '#c05a6a', // tongue
    },
    px: [
      '................................',
      '................................',
      '........kkkkkkkk................',
      '......kkccccccccck..............',
      '.....kcccddddddccck.............',
      '....kccddddddddccck.............',
      '....kcedddddddddcck.............',
      '...kceeddddddddddcck............',
      '...kceeddddddddddcck............',
      '...kkcdddddddddddcck............',
      '....kwkwkwkccddddccck...........',
      'p...kppppppkkcddddcccck.........',
      'ppp.kpppppppkkcddddccccck.......',
      '.p..kwkwkwkwkkkccddddcccck......',
      '....kkkkkkkkk..kkcccddddcccck...',
      '.....kkkkkkkkkkkcccccccccccck...',
      '.....kkkkkkkkccccccccck.........',
      '...kkccccccccccmccccccck........',
      '..kcccmmmccccmmmmcccccck........',
      '.kcccmmmmmcccmmmmmcccccck.......',
      '.kccmmmmmmmcccmmmccccccckkk.....',
      'kcccmmmmmcccccccccccccccccckk...',
      'kccccmmmcccccmmmcccccccccccckk..',
      'kccccccccccmmmmmmmcccccccccccck.',
      'kbccccccccmmmmmmmmmcccccccccccck',
      'kbbcccccccmmmmmmmccccccmmmcccccc',
      '.kbbccccccccmmmcccccccmmmmmcccck',
      '..kbbbcccccccccccccccmmmmmmccck.',
      '...kbbbbcccccccccccccccmmmcccck.',
      '.....kkbbbbcccccccccccccccccbbk.',
      '.......kkkbbbbbbbbbbbbbbbbbbbk..',
      '..........kkkkkkkkkkkkkkkkkkk...',
    ],
  };

  // 41. Totem Walker — stacked carved wooden totem faces with little legs
  S.totem_walker = {
    w: 32, h: 32,
    pal: {
      k: '#1a1008', // outline
      b: '#5a3a1c', // wood dark
      c: '#8a5c2e', // wood mid
      d: '#b8874a', // wood light
      r: '#c0402a', // red paint
      t: '#2f7a8a', // teal paint
      e: '#f0d040', // glowing eye
      w: '#e8dcc0', // white paint / teeth
    },
    px: [
      '.....kkkkkkkkkkkkkkkk...........',
      '....kddddddddddddddddk..........',
      '....kdccccccccccccccdk..........',
      '....kdckeekccccckeekdk..........',
      '....kdckeekccccckeekdk..........',
      '....kdcckkccccccckkccdk.........',
      '....kdccccrrrrrrccccdk..........',
      '....kdcccwwwwwwwwcccdk..........',
      '....kbbbbbbbbbbbbbbbbk..........',
      '...kkddddddddddddddddkk.........',
      '...kdccccccccccccccccdk.........',
      '...kdcttcccccccccttccdk.........',
      '...kdctectccccctecttcdk.........',
      '...kdcttcccrrrccttcccdk.........',
      '...kdccccccrrrccccccddk.........',
      '...kdcckwwwwwwwwwwkccdk.........',
      '...kdcckwkwkwkwkwwkccdk.........',
      '...kbbbbbbbbbbbbbbbbbbk.........',
      '..kkdddddddddddddddddddkk.......',
      '..kdcccccccccccccccccccdk.......',
      '..kdcrrccccccccccccrrccdk.......',
      '..kdcrekcccccccccrekcccdk.......',
      '..kdcrrccccwwwccccrrcccdk.......',
      '..kdccccccwwwwwcccccccbdk.......',
      '..kdccckwwwwwwwwwwkcccbdk.......',
      '..kdcckwkwkwkwkwkwwkccbdk.......',
      '..kbbbbbbbbbbbbbbbbbbbbbk.......',
      '..kkbbbccccccccccccccbbbkk......',
      '....kkkkcbbk....kbbckkkk........',
      '.......kcbbk....kbbck...........',
      '......kdcbbk...kdcbbk...........',
      '......kkkkkk...kkkkkk...........',
    ],
  };

  // 42. Hornet Queen — oversized orange-black hornet with crown-like head
  S.hornet_queen = {
    w: 32, h: 32,
    pal: {
      k: '#160f04', // outline
      o: '#e07818', // orange mid
      p: '#f7a838', // orange light
      b: '#241c10', // black dark
      c: '#3d3220', // black mid
      w: '#9fb8cc', // wing
      v: '#e2eef8', // wing light
      e: '#ff3a2a', // eye
      y: '#f5d84a', // crown gold
    },
    px: [
      '................................',
      '.......................kkkkk....',
      '...................kkkkwwwvvk...',
      '...............kkkkwwwwwwvvvk...',
      '...........kkkkwwwwwwwwwvvvkk...',
      '..k.....kkkkwwwwwwwwwwwvvvkk....',
      '...k..kkkwwwwwwwwwwwwvvvkkk.....',
      '..k.kkkwwwwwwwwwwwvvvkkk........',
      '...kkkkwwwwwwwwvvvkkkk..........',
      '.kykkykkkwwwwvvvkkkk............',
      '.kyyykyykkkkkkkkkk..............',
      'kkyyyyyyyykkkkkkkkkkk...........',
      'kbyyyyyyyyyykbbbbbbbbkkk........',
      'kbbkkkkkkkkbbbbbbbbbbbboopkk....',
      'kboobbbbbbbbbbbbbbbbbbboppppk...',
      'kbeoobbbbbbbbbbbbbbbbbbopppppok.',
      'kbeeobbbbbbbbbbbbbbbbbboppppppok',
      'kbeeobbbbbbbbbbbbbbbbbobbbbbbppk',
      'kbeoobbbbbbbbbbbbbbbbbobbbbbbppk',
      'kboobbbbbbbbbbbbbbbbbboppppppppk',
      '.kbbbbbbbbbbbbbbbbbbbboppppppppk',
      '..kkbbbbbbbbbbbbbbbbbbobbbbbbppk',
      '....kbbkbbkbbkkbbbbbbbobbbbbbppk',
      '.....kbkkbkkbk.kbbbbbboppppppppk',
      '....kbk.kbk.kbk.kbbbbbopppppppk.',
      '...kbk..kbk..kbk.kbbbbboppppppk.',
      '..kbk...kk...kbk..kbbbbooppppk..',
      '..kk..........kk...kbbbbooppkk..',
      '.....................kbbboopk...',
      '......................kbbbokk...',
      '.......................kbbkk....',
      '........................kkk.....',
    ],
  };

  // 43. Rot Shambler — rotting zombie covered in moss and fungus, one arm raised
  S.rot_shambler = {
    w: 32, h: 32,
    pal: {
      k: '#0f1410', // outline
      b: '#3f5a3a', // flesh dark
      c: '#6a8a58', // flesh mid
      d: '#98b478', // flesh light
      m: '#2a5a2a', // moss
      n: '#9ade4a', // fungus glow
      r: '#7a2a2a', // wound
      w: '#e8e0c8', // bone
      e: '#c8ff5a', // eye
    },
    px: [
      '..............kkkk..............',
      '.............kdccdk.............',
      '.............kckkck.............',
      '............kdccccdk............',
      '............kdccccdk............',
      '.............kbccbk.............',
      '....kkkkk....kbccbk.............',
      '...kdcccdk...kbccbk.............',
      '..kdccccddk..kbccbk.............',
      '..kekcekcck..kbccbk.............',
      '..kkkckkkcdk.kbccbk.............',
      '..kccccccccdkkbccbk.............',
      '..kcwkwkwccdkbbccbk.............',
      '...kkkkkkccdbbcccbknn...........',
      '.....kkkccccbbccccknnnk.........',
      '...kkkccccccbbcccccknnk.........',
      '..kbcccmmccccbbcccccckk.........',
      '.kbccccmmmcccbbccccck...........',
      'kbcccwwwmmccbbbccccbk...........',
      'kbccwwwwwmccbbbcccbbk...........',
      'kbcccwwwwwccbbbcccbk............',
      '.kbccwwwwcccbbbcccbk............',
      '.kkbcccccccnncbbccbk............',
      '...kbcccccnnnncbcccbk...........',
      '....kbccccnnnccbcccbk...........',
      '....kbcccccccbbkkccbk...........',
      '....kbcccccbbk..kccbk...........',
      '....kbccccbbk...kccbk...........',
      '...kbccccbk.....kcccbk..........',
      '...kbcccbk......kbcccbk.........',
      '..kkbbbbkk......kkbbbbk.........',
      '..kbbbbbbk.......kbbbbbk........',
    ],
  };

  // 44. Mist Panther — black panther, semi-transparent, wisps of grey mist
  S.mist_panther = {
    w: 32, h: 32,
    pal: {
      k: '#0a0c14', // outline
      b: '#1c2230', // body dark
      c: '#2f3a4e', // body mid
      d: '#4a5a72', // body light
      m: '#7b8aa0', // mist
      n: '#b8c6d8', // mist light
      e: '#7ef0ff', // eye glow
      w: '#dff4ff', // fang / highlight
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '..kk...kk.......................',
      '.kbdk.kbdk......................',
      '.kbddkbddk......................',
      '.kbdddddddkkkkkkkkkkkkkkk.......',
      'kbdddddddddccccbbbbbbbbbbk......',
      'kbedddddddccccccbbbbbbbbbbk.....',
      'kbeedddddcccccccccbbbbbbbbbk....',
      'kbedddddccccccccccccbbbbbbbk....',
      'kbwwddddcccccccccccccbbbbbbbk...',
      '.kkwwdddccccccccccccccbbbbbbk...',
      '..kkbddccccccccccccccccbbbbbbk..',
      '....kdcccccccccccccccccccbbbbk..',
      '....kdccccccccccccccccccccbbbbk.',
      '....kcccccccccccccccccccccccbbk.',
      '....kccccccccccccccccccccccccbk.',
      '....kcccccccccccccccccccccccbbk.',
      '....kccccckkkkkkkkkkkcccccccbbk.',
      '....kccck..........kccccccbbbk..',
      '....kccck..........kcccccbbbk...',
      '....kccck..........kccccbbbk....',
      '....kbcck..........kcccbbk......',
      '....kbck...........kbcck........',
      '...kbmck..........kbmck.........',
      '...kmmmk..........kmmmk..n......',
      '..nmmmmmn........nmmmmmnmmn.....',
      '.nmmmmmmn..nn...nmmmmmmmmmmn....',
      '..nmmmn...nmmn...nmmmnnmmmmmn...',
      '...nn......nn......nn...nmmn....',
    ],
  };

  // 45. Ruin Guardian — cracked stone statue warrior, glowing blue eyes, stone sword
  S.ruin_guardian = {
    w: 32, h: 32,
    pal: {
      k: '#141820', // outline
      b: '#4a5058', // stone dark
      c: '#70787f', // stone mid
      d: '#9aa2a8', // stone light
      m: '#2f6b3a', // moss
      e: '#4ad8ff', // eye glow
      w: '#a8f2ff', // glow light
      r: '#2a2e34', // crack
    },
    px: [
      '................................',
      '.........kkkkkkkkkk.............',
      '........kdddddddddck............',
      '........kdcccccccdck............',
      '.......kkdccccccccdckk..........',
      '......kdddcccccccccddk..........',
      '......kdckwewkcckwewkdk.........',
      '......kdckweekcckweekdk.........',
      '......kdcccccccccccccdk.........',
      '......kdccrccccccccccdk.........',
      '......kkdcckkkkkkkccddk.........',
      '........kddddddddddk............',
      '....kkkkkkddddddddkkkkkkk.......',
      '...kdddddkdcccccccdkdddddk......',
      '...kdcccdkdcccmccccdkdcccdk.....',
      '..kkdcccdkdccmmmcccdkdccddk.....',
      '..kdccccdkdcccmccccdkdccdkk.....',
      '..kdccccdkdccccccccdkdcdk.......',
      '.kkdcccdkkdcrccccrcdkddk........',
      'kwwddwwkkkdccccccccdkkk.........',
      'kwddwk....kdccccccdk............',
      'kwddwk....kdccccccdk............',
      '.kwddwk...kddddddddk............',
      '.kwddwk...kbccbccbkk............',
      '.kwddwk..kdccdkdccdk............',
      '..kwddwk.kdcccdkdcccdk..........',
      '..kwddwk.kdcccdkdcccdk..........',
      '..kwddwk.kdcccdkdcccdk..........',
      '...kwdwk.kdccccdkdccccdk........',
      '...kwdwkkkddddddkkddddddk.......',
      '....kwwk.kkdddddkk.kkdddddk.....',
      '....kkkk..kkkkkkk...kkkkkkk.....',
    ],
  };

  // 46. Wild Druid — feral human in pelts with antler crown and gnarled staff
  S.wild_druid = {
    w: 32, h: 32,
    pal: {
      k: '#170f0a', // outline
      b: '#4a3520', // pelt dark
      c: '#7a5a34', // pelt mid
      d: '#a88a56', // pelt light
      s: '#c9a882', // skin
      r: '#8a2a2a', // warpaint
      u: '#6b4a26', // staff wood
      e: '#e8e030', // eye
      w: '#e0d8c0', // antler bone
    },
    px: [
      'k....k.......k.....k............',
      'kw..kw..k...kw....kw............',
      '.kw.kw.kw..kw.kw.kw.............',
      '..kwkw.kwkkw.kwkkw..............',
      '...kwwwkwwwwkwwwww..............',
      '....kkwwwwwwwwwwk...............',
      '.....kkksssssskkk...............',
      '....kkssssssssssskk.............',
      '....ksssssssssssssk.............',
      '....ksrkeekssskeeksk............',
      '....ksrkeekssskeeksk............',
      '....ksssssssssssssssk...........',
      '....kssskwwwwwwksssk............',
      '.....kkkbbbbbbbbkkk.............',
      '..k..kkccbbbbbbbcckk............',
      '..ku.kdcccbbbbbcccdk............',
      '..ku.kdccccbbbccccdk............',
      '..kukkdcccccbcccccdk............',
      '.kuukkbdccccbbbcccdk............',
      '.kuukssbdcccbbbbccdk............',
      '..kukssbbdccbbbbbcdk............',
      '..kukssbbbdcbbbbbcdk............',
      '..ku.kkbbbbcbbbbbcdk............',
      '..ku..kbbbbbbbbbbcdk............',
      '..ku..kcccbbbbbbbcdk............',
      '..ku..kcccbkkkbbbcdk............',
      '..ku..kccbk..kbbbcdk............',
      '..kuu.kccbk..kbbccdk............',
      '..kuu.kcccbk.kbcccdk............',
      '..kuu.kdcccbk.kbccdk............',
      '..kkk.kkddddk.kkdddk............',
      '.......kkkkk...kkkkk............',
    ],
  };

  // 47. Blood Vine — red thorny vine mass with a snapping bulb mouth
  S.blood_vine = {
    w: 32, h: 32,
    pal: {
      k: '#1a0810', // outline
      b: '#5a0f1a', // vine dark
      c: '#8f1a24', // vine mid
      d: '#c43240', // bulb light
      p: '#ff6a7a', // bulb bright
      w: '#f0e8d8', // teeth
      e: '#ffd23a', // gullet glow
      s: '#e8d0a0', // thorn
    },
    px: [
      '................................',
      '......kkkkkk....................',
      '....kkddddddkk..................',
      '...kdddppppdddk.................',
      '..kddppppppppddk................',
      '..kdppppppppppdk................',
      '.kddppppppppppddk...............',
      '.kkddppppppppdddk...............',
      'kwkwkwkwkwkddddk................',
      'keeeeeeeeekkdddk................',
      'keeeeeeeeeekdddk................',
      'kwkwkwkwkwkkdddk................',
      '.kkdddddddddddkk................',
      '..kddddddddddck.................',
      '...kcccddddccck.................',
      '....kcccccccckkkk...............',
      '.....kbcccccbk......s...........',
      '.s....kbcccbk......ksk..........',
      '.ks..kkbcccbkk....kbcbk.........',
      'kbck.kbccccccbk..kbccbk.........',
      'kbcbkkbcckkccbkkkbccbbk...s.....',
      '.kbcbkbcbkkbccbkbcccbbk..ksk....',
      '..kbccbcbk.kbccbccccbk..kbcbk...',
      's.kbcccbk...kbcccccbk..kbccbk...',
      'ksk.kbccbk..kbcccccbk.kbccbbk...',
      'kbcbkkbccbk.kbcccccbkkbccbbk....',
      '.kbccbkbccbkkbcccccbkbccbbk.....',
      '..kbccbbccbbbccccccbbccbbk......',
      '..kbccccbbcccccccccbbccbbk......',
      '..kbbbcccccbbbbbbbbbbccbbbk.....',
      '...kkbbbbbbbbbbbbbbbbbbbbk......',
      '.....kkkkkkkkkkkkkkkkkkkk.......',
    ],
  };

  // 48. Armored Tapir — tapir wearing bronze plates on head and back
  S.armored_tapir = {
    w: 32, h: 32,
    pal: {
      k: '#181410', // outline
      b: '#3a3038', // hide dark
      c: '#5c5260', // hide mid
      d: '#867c88', // hide light
      o: '#8a5a20', // bronze dark
      p: '#c08a30', // bronze mid
      q: '#eec460', // bronze light
      e: '#ff9a2a', // eye
    },
    px: [
      '................................',
      '.................kkkkkkkkk......',
      '..............kkkqqqqqqqqqkkk...',
      '............kkqqqppppppppppppqk.',
      '..........kkqqppoppoppoppppppqqk',
      '.........kqqpppppppppppppppppqqk',
      '......kkkqqqqqqqqqqqqqqqqqqqqqqk',
      '.....kkcccccccccccccccccccccccck',
      '....kqqqqqkcccccccccccccccccccck',
      '...kqppppqkcccccccccccccccccccbk',
      '...kqpoopqkcccccccccccccccccccbk',
      '..kqppppqkccccccccccccccccccccbk',
      '..kqqqqqqkccccccccccccccccccccbk',
      '..kdddddddkcccccccccccccccccccbk',
      '.kddeedddddkccccccccccccccccccbk',
      '.kddeeddddddkcccccccccccccccccbk',
      'kdddddddddddkccccccccccccccccbbk',
      'kddddddddddddkcccccccccccccccbbk',
      'kdddddddddddddkccccccccccccccbbk',
      'kddddddddddddkkcccccccccccccbbbk',
      'kdddddddddddkkcccccccccccccbbbbk',
      'kddddkkddddkkccccccccccccbbbbbk.',
      'kdddk.kdddkkcccccccccccbbbbbbk..',
      'kdddk..kkkkkkkcccccckkkkbbbbbk..',
      'kdddk........kdcccck..kbbccbbk..',
      'kbddk........kdcccck..kbcckbbk..',
      '.kkkk........kdcccck..kbck.kbk..',
      '.............kdcbbck..kbck.kbk..',
      '.............kbckbck..kbck.kbk..',
      '.............kbck.kck.kbck.kbk..',
      '.............kqqk.kqk.kqqk.kqk..',
      '.............kkkk.kkk.kkkk.kkk..',
    ],
  };

  // 49. Storm Parrot — blue-yellow parrot with crackling lightning around wings
  S.storm_parrot = {
    w: 32, h: 32,
    pal: {
      k: '#0e1424', // outline
      b: '#1b3a8a', // blue dark
      c: '#2f6ad0', // blue mid
      d: '#6aa8f0', // blue light
      y: '#f5d02a', // yellow
      o: '#e07818', // beak orange
      e: '#ffffff', // eye
      l: '#9ef0ff', // lightning
      m: '#ffffff', // lightning core
    },
    px: [
      '.....................l..........',
      '..................m.l.m.........',
      '.................lml.lm.....l...',
      '.........kkkk...ml.kkl.....lm...',
      '.......kkyyyykk.kkkkkkkk..lm....',
      '......kyyyyyyyccbbbbbccbkkml....',
      '.....kyyeyyyyyccccbbbccbbkl.....',
      '....kyekyyyyyyccccccbbbccbkm....',
      '...kyeeyyyyyyyccccccccbbbccbk...',
      '..kyyyyyyyyyycccccccccccbbbccbk.',
      '.koyyyyyyyyycccccccccccccbbbccbk',
      'kooyyyyyyyycccccccccccccccbbbcck',
      'koookyyyyyccccccccccccccccccbbbk',
      '.koookyyycccccccccccccccccccbbbk',
      '..kookyyycccccccccccccccccbbbkk.',
      '...kkkyyccccccccccccccccbbbkk...',
      '.....kyyccccccccccccccbbbk......',
      '.....kyyccccccccccccbbbk........',
      '.....kyyccccccccccccbbk.........',
      '.....kyyycccccccccccbbk.........',
      '.....kyyyycccccccccbbk..........',
      '......kyyyyccccccbbbk...........',
      '......kyyyyccccbbbkkkk..........',
      '.......kyyycccbkkbbbbkk.........',
      '.......kkyycccbkkbbbbbbkk.......',
      '.........kkkkkk.kkbbbbbbbkk.....',
      '..........kok.....kbbbbbbbbkk...',
      '.........koook......kbbbbbbbbkk.',
      '..........kkk.........kbbbbbbbbk',
      '........................kbbbbbbk',
      '..........................kbbbk.',
      '............................kkk.',
    ],
  };

  // 50. Sludge Elemental — oozing dark green-brown humanoid sludge, bubbles
  S.sludge_elemental = {
    w: 32, h: 32,
    pal: {
      k: '#101408', // outline
      b: '#2a3a16', // sludge dark
      c: '#46601f', // sludge mid
      d: '#6f8a2e', // sludge light
      m: '#3a2a12', // mud brown
      n: '#9fbb45', // bright ooze
      e: '#ffe84a', // eye
      w: '#c8e07a', // bubble highlight
    },
    px: [
      '................................',
      '.......kkkkkk...................',
      '.....kkddnnddkk.................',
      '....kddnnnnnddck................',
      '....kdnnnnnndddck...............',
      '...kddddddddddddck..............',
      '...kdkkkdddkkkdddck.............',
      '...kdkeekddkeekddck.............',
      '...kdkeekddkeekdddk.............',
      '...kdkkkdddkkkddddk.............',
      '....kdddddddddddddck............',
      '.....kkdddddddddddck............',
      '.......kkddddddddcck............',
      '........kkdddddddckk...kkk......',
      '.....kkkkkddddddddkkkkkddddk....',
      '...kkddddddddddddddddkddddddk...',
      '..kddddddnnndddddddddkddddddddk.',
      '.kdddddnnnnnnddddddddkdddddddddk',
      'kddddk.knnnnndddddddckkddddddddk',
      'kcdddk.kddnnndddddddck.kdddddddk',
      'kcdddk.kddddddddddddck.kddddddck',
      'kcdddk.kddddddddddddck.kddddddck',
      'kcdddk.kdddmmmmddddddk.kdddddcck',
      'kcdddk.kdddmmmmdddddck.kddddcck.',
      '.kcddk.kddddmmmddddddk.kdddcck..',
      '.kcddkkkdddddddddddddk.kddcck...',
      '.kcdddddddddddnndddddk.kdcck....',
      '..kcddddddddnnnnnddddk.kdcck....',
      '..kccdddddddnnnnddddck.kdcck....',
      '...kccdddddddnnddddcckkkdcck....',
      '.kkkccddddddddddddccddddccckk...',
      'kkkkkkkkkkkkkkkkkkkkkkkkkkkkk...',
    ],
  };

  // 51. Skull Monkey — undead monkey skeleton with glowing eye sockets
  S.skull_monkey = {
    w: 32, h: 32,
    pal: {
      k: '#12101a', // outline
      b: '#8a8272', // bone dark
      c: '#c4bca6', // bone mid
      d: '#f0ead6', // bone light
      e: '#7affc0', // eye glow
      g: '#2a3028', // socket shadow
      r: '#4a4a3a', // rib gap
      w: '#fdfaf0', // teeth
    },
    px: [
      '................................',
      '................................',
      '.....kkkkkkkk...................',
      '...kkddddddddkk.................',
      '..kdddddddddddck................',
      '..kddddddddddddck...............',
      '.kdkkkgkkdkkkgkdck..............',
      '.kdkgeegkddkgeegkck.............',
      '.kdkgeegkddkgeegkck.............',
      '.kdkkgkkkddkkgkkkck.............',
      '.kdddddddddddddddck.............',
      'kddwkwkwkwdddddddck.............',
      'kkdddddddddddddddck.............',
      '.kkddddddddddddddck.............',
      '..kkkkkddddddkkkkk..............',
      '..kkk...kbbk....kkk.............',
      '.kdddk..kbbk...kdddk...kkk......',
      '.kdcdkkkkbbkkkkkdcdk..kdck......',
      '.kdcdkkdcccccdkkdcdk..kdk.......',
      '.kdcdkkdkrrrkdkkdcdk.kdck.......',
      '.kdcdkkdcccccdkkdcdk.kdk........',
      '.kdcdkkdkrrrkdkkdcdkkdck........',
      '.kdcdk.kdcccccdk.kdcdkdk........',
      '.kdcdk.kdkrrrkdk.kdcdkck........',
      '.kdddk..kdcccdk..kdddkk.........',
      '..kddk..kkdddkk..kddkk..........',
      '..kkkk.kkdddddkk.kkkk...........',
      '.......kdddkdddk................',
      '.......kdcdkdcdk................',
      '.......kdcdkdcdk................',
      '......kbddbkbddbk...............',
      '......kkkkkkkkkkk...............',
    ],
  };

  // 52. Tree Frog Witch — red-eyed tree frog with a little witch hat and wand
  S.treefrog_witch = {
    w: 32, h: 32,
    pal: {
      k: '#0f2410', // outline
      b: '#2f7a2a', // skin dark
      c: '#57b23a', // skin mid
      d: '#8fe05a', // skin light
      r: '#e83a3a', // eye red
      w: '#fdf6e8', // white
      v: '#3a1f56', // hat dark
      u: '#6d3f96', // hat mid
      y: '#ffe23a', // wand glow
    },
    px: [
      '................................',
      '..............kk................',
      '.............kuvk...............',
      '............kuuvk...............',
      '...........kuuvvk...............',
      '..........kuuuvvk...............',
      '.........kuuuuvvk...............',
      '........kuuuuuvvvk..............',
      '.......kvvuuuuvvvvk.............',
      '.....kkvvvvvvvvvvvvkk...........',
      '....kvuuuuuuuuuuuuuuvk..........',
      '.....kkkkkkkkkkkkkkkkk..........',
      '.....kkkkkk......kkkk...........',
      '....krrrrkkkkkkkkrrrrk..........',
      '...krrrrrkddddddkrrrrrk.........',
      '...krkrrkddddddddkrrkrk.........',
      '...krrrkdddddddddddkrrk.........',
      '....kkkddddddddddddddkk.........',
      '....kdddddddddddddddddk.........',
      '..y.kdddcccccccccccdddk.........',
      '.yyykdcccccccccccccccdk.........',
      'yywykccccccbbbbbcccccck.........',
      '.yyykkccbbbkkkkkbbcccck.........',
      '..y.kwkkkkk.....kkkbccck........',
      '....kwwk.kkk......kbcccck.......',
      '...kwwwkkdcck.....kbccccck......',
      '...kwwkkdcccbk....kbcccccbk.....',
      '..kdddkdccccbk...kbcccccbbk.....',
      '.kdccckdccccbbk..kbccccbbk......',
      '.kdcccbkbccccbbkkbccccbbk.......',
      '.kbbbbbkkbbbbbbbbbbbbbbk........',
      '..kkkkk..kkkkkkkkkkkkkk.........',
    ],
  };

  // 53. Lost Explorer — translucent bluish ghost in pith helmet with lantern
  S.lost_explorer = {
    w: 32, h: 32,
    pal: {
      k: '#16223a', // outline
      b: '#3a5a8a', // ghost dark
      c: '#6a92c0', // ghost mid
      d: '#9cc4e8', // ghost light
      w: '#e0f0ff', // highlight
      t: '#7a6236', // helmet dark
      u: '#c4a874', // helmet light
      e: '#ffd24a', // lantern glow
    },
    px: [
      '................................',
      '.........kkkkkkkkk..............',
      '.......kkuuuuuuuuukk............',
      '......kuuuuuuuuuuuuuk...........',
      '.....kuuuuuuuuuuuuuuuk..........',
      '....kkttttttttttttttttk.........',
      '....kuuuuuuuuuuuuuuuuuk.........',
      '.....kkkkkkkkkkkkkkkkkk.........',
      '.......kdddddddddddk............',
      '......kdkkddddddkkdk............',
      '......kkwwkddddkwwkdk...........',
      '......kdkkddddddkkddk...........',
      '......kdddwwwwwwdddck...........',
      '.......kdddddddddcck............',
      '.......kkdddddddcckk............',
      '..kkk...kkdddddccck.............',
      '.keeek.kkkddddddcckkk...........',
      'keeeeekkccddddddcccccck.........',
      'keeeeekccccddddddcccccck........',
      'keeeeekcccccdddddcccccbk........',
      '.keeek.kccccdddddcccccbk........',
      '..kkk..kccccddddddccccbk........',
      '...k...kbcccddddddcccbbk........',
      '...k...kbcccdddddcccbbk.........',
      '...k....kbcccdddccbbbk..........',
      '........kbbcccdddcbbbk..........',
      '.........kbbccdddcbbk...........',
      '..........kbbccdccbk............',
      '...........kbbcccbk.............',
      '.........k..kbbcbk..k...........',
      '........kbk..kkbkk.kbk..........',
      '.........k....kk....k...........',
    ],
  };

  // 54. Cave Troll — hunched grey troll with big nose, club
  S.cave_troll = {
    w: 32, h: 32,
    pal: {
      k: '#14161a', // outline
      b: '#3f4548', // skin dark
      c: '#666e70', // skin mid
      d: '#949c9a', // skin light
      p: '#a06a68', // nose
      w: '#e8e0d0', // tusks
      m: '#3a2a18', // club dark
      u: '#6b4a26', // club light
      e: '#e8c030', // eye
    },
    px: [
      '................................',
      '.......................kkkkkk...',
      '.....................kkmuuuumk..',
      '....................kmuumuuuumk.',
      '....................kmuuuuuuumk.',
      '....................kmumuuuumumk',
      '....................kmuuuuuumuuk',
      '.....kkkkkk..........kkmuuuuuumk',
      '...kkdddddkk..........kkmuuuuumk',
      '..kddccccccdk...........kkmuumk.',
      '..kdcccccccck.....kkkk....kmumk.',
      '..kdckekccccdk..kkbbbbkk..kmuk..',
      '.kdppkekccccdkkkbbbbbbbbk.kmuk..',
      'kdppppcccccccbbbbbbbbbbbbbkuk...',
      'kdpppppcccccbbbbbbbbbbbbbbbkk...',
      'kdpppppcccccbbbbbbbbbbbbbbbbbk..',
      'kkdpppcccccccbbbbbbbbbbbbbbbbbk.',
      '.kkdpkwkwkccccbbbbbbbbbbbbbbbbk.',
      '..kkkkkkkkkcccccbbbbbbbbbbbbbbk.',
      '..kccccccccccccccbbbbbbbbbbbbbk.',
      '.kccccccccccccccccbbbbbbbbbbbbk.',
      'kcdcccccccccccccccbbbbbbbbbbbbk.',
      'kcdccccccccccccccccbbbbbbbbbbk..',
      'kccccccccccccccccccbbbbbbbbbbk..',
      '.kcccccccccccccccccbbbbbbbbbk...',
      '.kkccccccckkkccccccbbbbbbbbk....',
      '..kcccccck..kcccccccbbbbbbbk....',
      '..kcccccck..kccccccbbbbbbbbk....',
      '..kcccccck..kcccccbbbbbbbbbk....',
      '..kbccccbk..kbccccbbbbbbbbbk....',
      '.kkdddddkk..kkddddbbbbbbbbbk....',
      '.kkkkkkkkk...kkkkkkkkkkkkkkk....',
    ],
  };

  // 93. Golden Idol (ELITE) — floating golden carved idol head with glowing gem eyes
  S.golden_idol = {
    w: 40, h: 40,
    pal: {
      k: '#2e2006', // outline
      o: '#8a6510', // gold dark
      p: '#c99a20', // gold mid
      q: '#f0c840', // gold light
      w: '#fff0a8', // gold highlight
      e: '#3affd8', // gem eye
      g: '#a8fff0', // gem glow
      s: '#5a4208', // deep groove
    },
    px: [
      '........................................',
      '..........k....k.....k....k....k........',
      '.........kqk..kqk...kqk..kqk..kqk.......',
      '.........kqk..kqk...kqk..kqk..kqk.......',
      '........kkqkkkkqkkkkkqkkkkqkkkkqkk......',
      '.......kqqqqqqqqqqqqqqqqqqqqqqqqqqk.....',
      '......kqwwqqsqqqwwqqsqqwwqqsqqqwwqqk....',
      '......kqwwqqsqqqwwqqsqqwwqqsqqqwwqqk....',
      '.....kqqqqqqsqqqqqqqsqqqqqqsqqqqqqqqk...',
      '.....kppppppppppppppppppppppppppppppk...',
      '.....kkoooooooooooooooooooooooooooookk..',
      '......kppppppppppppppppppppppppppppk....',
      '.....kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk...',
      '....kqqoooooooqqqqqqqqqqoooooooooqqqqk..',
      '....kqoosggggsooqqqqqqoosggggsooqqqqqk..',
      '....kqosgeeegsoqqqqqqqosgeeegsoqqqqqqk..',
      '....kqosgeeegsoqqqqqqqosgeeegsoqqqqqqk..',
      '....kqoosggggsooqqqqqqoosggggsooqqqqqk..',
      '....kqqooooooooqqqqqqqqoooooooooqqqqqk..',
      '.....kqqqqqqqqqqqppqqqqqqqqqqqqqqqqqk...',
      '.....kqqqqqqqqqqoppoqqqqqqqqqqqqqqqqk...',
      '.....kqqqqqqqqqoppppoqqqqqqqqqqqqqqqk...',
      '......kqqqqqqqqoppppoqqqqqqqqqqqqqqk....',
      '......kqqqqqqqqqooooqqqqqqqqqqqqqqqk....',
      '......kqqqqqqqqqqqqqqqqqqqqqqqqqqqqk....',
      '.......kqqooooooooooooooooooooqqqqqk....',
      '.......kqowwowwowwowwowwowwowoqqqqqk....',
      '.......kqooooooooooooooooooooqqqqqqk....',
      '.......kqqqqqqqqqqqqqqqqqqqqqqqqqqk.....',
      '........kqqqqqqqqqqqqqqqqqqqqqqqqk......',
      '.........kppqqqqqqqqqqqqqqqqqqppk.......',
      '..........kppqqqqqqqqqqqqqqqppk.........',
      '...........kkoppqqqqqqqqqppokk..........',
      '.............kkooopppppoookk............',
      '...............kkkoooooookk.............',
      '..................kkkkkkk...............',
      '.......g....g...........g....g..........',
      '.........g.......g...........g..........',
      '............g..........g................',
      '........................................',
    ],
  };

  // 94. Corrupted Dryad (ELITE) — dryad with black-purple rotting bark, red glowing veins
  S.corrupted_dryad = {
    w: 40, h: 40,
    pal: {
      k: '#0c0710', // outline
      b: '#2a1830', // bark dark
      c: '#452a4e', // bark mid
      d: '#6b4676', // bark light
      r: '#ff2a3a', // glowing vein
      o: '#8a1020', // vein dark
      g: '#2f4a2a', // dead leaves
      e: '#ff7a4a', // eye glow
      w: '#c89ad0', // highlight
    },
    px: [
      '.....k...k.........k......k.............',
      '.....kb.kb....k....kb....kb.............',
      '......kbkb...kb...kbk...kbk.............',
      '.k.....kbb..kbk..kbk...kbk..............',
      '.kb.....kbbkkbk.kbbk..kbk...............',
      '..kb.....kbbbbkkbbkkkbbk................',
      '...kbg....kbbbbbbbbbbbk.......kk........',
      '....kbgg...kbbbbbbbbbk......kgbk........',
      '.....kbbgg..kbccccbk......kggbk.........',
      '......kkbbg.kcddddck....kggbbk..........',
      '........kkbkcdccccdckkkkggbbk...........',
      '..........kkceeceecdkkgbbk..............',
      '..........kkceeceecdkbbbk...............',
      '...........kcdccccdcbbkk................',
      '...........kkcwwwwdckk..................',
      '..........kbcccdddcccbk.................',
      '.........kbccrreccrreccbk...............',
      '.........kbcrreeecrreecbk...............',
      '.........kbccrrccccrrccbk...............',
      '.........kbcccccooccccccbk..............',
      '.........kbccccoorrooccccbk.............',
      '..........kbccccorrocccccbk.............',
      '...........kbcccooooocccbk..............',
      '.........kkkkbcrrrrrrrcbkkkkk...........',
      '.......kkbbbcccrrorrorrccccbbbkk........',
      '.....kkbccccccrrocccorrccccccccbkk......',
      '....kbcccddcccrocccccorccccddccccbk.....',
      '...kbccddcccccroccccorccccccddcccbk.....',
      '...kbcddccccccrroccorrccccccddcccbk.....',
      '...kbcccccccccrrooorrcccccccccccbbk.....',
      '....kbcccccccccrrrrrccccccccccbbbk......',
      '.....kbcccccccccrrrccccccccccbbbk.......',
      '.....kbccccccccccrccccccccccbbbk........',
      '.....kbccccccbcccrcccbcccccbbbk.........',
      '....kbcccccbk.kccrcckkbcccbbbk..........',
      '....kbcccbbk...kcrck...kbbbbk...........',
      '...kbccbbbk....kcrck....kbbbbk..........',
      '..kbccbbk.....kbcrcbk....kbbbbk.........',
      '.kbbbbbkkk...kbbcccbbk..kkbbbbbk........',
      'kkkkkkk......kkkkkkkkk...kkkkkkk........',
    ],
  };
})();
