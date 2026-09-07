// js/sprites/monsters_a.js — Tier 1 monsters (1–18) + elites 89–90. Monsters FACE LEFT.
(function () {
  const S = (window.DJ = window.DJ || {}).SPRITES || (DJ.SPRITES = {});

  // 1. Vine Rat — brown rat tangled in a green vine, red eyes, long tail
  S.vine_rat = {
    w: 32, h: 32,
    pal: {
      k: '#1b1023', // outline
      b: '#6b4a2f', // fur dark
      c: '#9c7048', // fur mid
      d: '#c99c6a', // fur light
      e: '#ff3b4a', // eye
      f: '#3f8a3a', // vine dark
      g: '#78c95a', // vine light
      p: '#d98a8a', // nose / tail
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
      '................................',
      '.........................kkkk...',
      '........................kpppk...',
      '........................kpkkpk..',
      '..........kk............kpk.kk..',
      '.........kdck..kkkkkkk..kpk.....',
      '.........kdbckkcccccccckkpk.....',
      '......kkkkcbccccccddddcckpk.....',
      '....kkcccccccccccdddddccckpk....',
      '..kkcccccecccccgcccddddcccpk....',
      '.kcccccccccccfgcccccdddccccpk...',
      'kcpccccccccfggfccccccccccccpk...',
      'kppcccccccfgffccccccccccbbbpk...',
      '.kkccccccfgfcccffccccccbbbpk....',
      '...kccccfgfcccccfgfccccbbkk.....',
      '....kcffgfcccbbbbfgfcbbbk.......',
      '.....kkfccbbbkkkbbfgfbbk........',
      '......kbbbk...kbbbbfgbk.........',
      '......kbbk.....kbbbbgk..........',
      '......kbck.....kbbckk...........',
      '.....kbcck.....kbcck............',
      '.....kccck....kkcccck...........',
      '.....kkkkk....kkkkkkk...........',
      '................................',
    ],
  };

  // 2. Thorn Sprite — tiny hovering green fairy made of thorns, glowing yellow eyes
  S.thorn_sprite = {
    w: 32, h: 32,
    pal: {
      k: '#0f2a1a', // outline
      b: '#2e6b2e', // body dark
      c: '#4c9a3c', // body mid
      d: '#8ed15e', // body light
      t: '#6b3f2a', // thorn
      e: '#ffe94a', // eye
      g: '#fff7a8', // glow
      w: '#b7e8a0', // wing
    },
    px: [
      '................................',
      '................................',
      '...........k....................',
      '........k.ktk...................',
      '........ktktk.k.................',
      '.......kktkbkktk.......kk.......',
      '.......kbbbbbbbk......kwwk......',
      '......kbbccccbbbk....kwwwwk.....',
      '......kbccccccbbk...kwdwwwwk....',
      '.....kbcgecgecccbk..kwwdwwwwk...',
      '.....kbcceccecccbk.kwwwwdwwwk...',
      '.....kbccccccccbbkkwwwwwwdwwk...',
      '......kbbccccccbbkwwwwwwwwdwk...',
      '......kkbbbbbbbbkwwwwwwwwwwwk...',
      '.......kkkbcbkkkkwwwwwwwwwkk....',
      '....kk..kbcdccbkkkwwwwwwkk......',
      '...ktbkkbccdccbkwwkkkkkk........',
      '..kt.kbbbccdcccbkwwwwk..........',
      '.k...ktbbccccccbkwwwwwwk........',
      '......kkbbcccccbkwwdwwwwk.......',
      '.......kbbbccccbkwwwdwwwwk......',
      '........kbbbcbbbkwwwwdwwwk......',
      '........kbbkkbbbk.kwwwwwwk......',
      '........kbk.kbbk...kwwwwk.......',
      '.......kbk..kbbk....kkkk........',
      '......ktk...ktbk................',
      '......kk....kkkt................',
      '...............k................',
      '................................',
      '....g.....d.........g...........',
      '................................',
      '................................',
    ],
  };

  // 3. Mud Toad — fat brown toad, dripping mud, warty back, wide mouth
  S.mud_toad = {
    w: 32, h: 32,
    pal: {
      k: '#1a140e', // outline
      b: '#4a3320', // skin dark
      c: '#7a5533', // skin mid
      d: '#a87c4d', // wart / light
      e: '#f2c94c', // eye
      m: '#3d3a22', // mud dark
      n: '#6b6438', // mud light
      w: '#8a3a3a', // mouth
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
      '................................',
      '......kkkk.....kkkk.............',
      '.....kdeeek...kdeeek............',
      '.....kekkeek..kekkeek...........',
      '....kkeeeeekkkkeeeeekkkk........',
      '...kcccbbbbcccbbbbbbccccckk.....',
      '..kcccccccdccccccdccccccbbckk...',
      '.kccccccccccccdcccccdccccbbbbk..',
      'kcdcccccccccccccccccccccbbbbbbk.',
      'kcccccccccdcccccccdccccccbbbbbbk',
      'kcccccccccccccccccccdccccbbcbbbk',
      'kbwwwwwwwwwwwkcccccccccccbcccbbk',
      '.kwwwwwwwwwwwwkccccccccccbccccbk',
      '..kkkkkkkkkkkkkbccccccccbbcccbbk',
      '...kbbbbbbbbbbbbbcccccccbbccbbk.',
      '....kbbbbbbbbbbbbbbbcccbbbbbbbk.',
      '....kbbbbmbbbbbbbbbbbbbbkbbbbk..',
      '...kbbbbmmmbbbbbbbbbbbbkbbbbbk..',
      '..kbbbbkmmmkkbbbbbbbkkkbbbbbbk..',
      '..kbbbk.kmmk.kkkkkkk..kbbbbbbbk.',
      '.kbbbbk..kmk........kbbbbbbbbbk.',
      '.kbbbbbk..kk.......kbbbbbbbbbbk.',
      '.kkkkkkk...........kkkkkkkkkkkk.',
      '................................',
    ],
  };

  // 4. Leaf Beetle — beetle whose shell is a big green leaf, six black legs
  S.leaf_beetle = {
    w: 32, h: 32,
    pal: {
      k: '#0e1f12', // outline
      b: '#2f6f2a', // leaf dark
      c: '#4ea83a', // leaf mid
      d: '#8fd45c', // leaf light
      v: '#d2f096', // vein
      h: '#2a2a2a', // head/legs dark
      i: '#505050', // head mid
      e: '#ff4a3a', // eye
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '..k...k.........................',
      '...k.k..........................',
      '....kkk.....kkkkkkkkk...........',
      '...khhhkk.kkbbbcccccckkk........',
      '..khehhhkkbbccccccccccckkk......',
      '..khhhhhkbccccdcccccccccckkk....',
      '..khhhhhkbccdvvdcccccccccbckkk..',
      '...khhhkkbccdcvvvdccccccccbbckk.',
      '....kkkkbbccccdvvvvdccccccbbbbk.',
      '......kbbcccccccvvvvvvdccccbbbk.',
      '......kbbccccccccvvvvvvvvvvvvvk.',
      '......kbbbccccccccvvvvvdccbbbk..',
      '.......kbbbcccccccvvvdccccbbk...',
      '.......kkbbbcccccvvvccccbbkk....',
      '........kkbbbbccvvccccbbbkk.....',
      '.........kkkbbbvbbbbbbkkk.......',
      '........kkh.kkkkkkkkkkk.........',
      '.......khk..kh.kh...kh..........',
      '......kh.k..kh..kh...kh.........',
      '.....kh..kh.kh..kh...kh.........',
      '....kh...kh.kh...kh...kh........',
      '...kh....kh.kh...kh...kh........',
      '...kk....kk.kk...kk...kk........',
      '................................',
      '................................',
    ],
  };

  // 5. Gnat Swarm — dark cloud of dozens of tiny gnats with a few red dots for eyes
  S.gnat_swarm = {
    w: 32, h: 32,
    pal: {
      k: '#141018', // gnat body
      g: '#3a3340', // gnat mid
      s: '#5a5262', // gnat light
      w: '#8c8496', // wing
      e: '#ff3b3b', // eye
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '..........k.......k.............',
      '.......k....kw..k...w.k.........',
      '.....k..kw.kk..k.kk.k..k........',
      '....kw.kk.k.kwkkk.k.kwk.k.......',
      '..k.kk.kekk.kk.kkgkkk.kk..k.....',
      '...kkgkkkkkgkkkkkkkkekkgkk.w....',
      '.k.kkkkkkgkkkkkkkkkkkkkkkkkk.k..',
      '..kkkgkkkkkkkkkgkkkkkkgkkkkkk...',
      '.kkkkkkkekkkgkkkkkkkkkkkkkkkkk..',
      '.kgkkkkkkkkkkkkkkekkkkgkkkkkkgk.',
      '..kkkkkgkkkkkkkkkkkkkkkkkkkekk..',
      '.kkkkkkkkkkkekkgkkkkkkkkkkkkk...',
      '..kkgkkkkkkkkkkkkkkkkgkkkkkgkk..',
      '...kkkkkkgkkkkkkekkkkkkkkkkk.k..',
      '..k.kkkkkkkkkkkkkkkkgkkkkkkk....',
      '.....kkgkkkkkgkkkkkkkkkkkk.k....',
      '....k.kkkkkkkkkkkkegkkkgkk......',
      '...w.kk.kkgkk.kkkkkkkk.kk.k.....',
      '......k.kk.k.kk.kwk.kk..k.......',
      '....k..k..k...kk..k..w..........',
      '.......w...k.....k....k.........',
      '.........k....k.................',
      '................................',
      '................................',
      '................................',
      '................................',
    ],
  };

  // 6. Bramble Hare — hare with bramble/thorn antlers, tan fur, angry eyes
  S.bramble_hare = {
    w: 32, h: 32,
    pal: {
      k: '#2a1a10', // outline
      b: '#8a6a3a', // fur dark
      c: '#c4a066', // fur mid
      d: '#e8d3a0', // fur light
      e: '#ff3a2a', // eye
      t: '#4a2c18', // bramble dark
      u: '#7a4e2a', // bramble light
      n: '#d98a8a', // ear inner / nose
    },
    px: [
      '...............kk..kk...........',
      '..........k....kck.kck..........',
      '.....k...kt....kcnkkcnk.........',
      '.....kt.ktu....kcnkkcnk.........',
      '......ktktu.k..kcnkkcnk.........',
      '...k...ktu.ktk.kcnkkcnk.........',
      '...kt..ktukktu.kcnk.kcnk........',
      '....ktktuuutu..kcnk.kcnk........',
      '.....ktuuutkkkkkcckkkcck........',
      '......ktukcccdcccccccck.........',
      '.......kkccccddccccccck.........',
      '......kcccccccccccccccck........',
      '.....kccceccccccccccccck........',
      '....kcckkeecccccccccccccck......',
      '...kcccccccccccccccccccccck.....',
      '..kcnccccccccddccccccccccccck...',
      '..kcccccccccdddddccccccccccccck.',
      '...kkkcccccddddddccccccccccccck.',
      '.....kkccccddddddcccccccccbbccck',
      '......kccccdddddcccccccccbbbbcck',
      '......kcccccdddcccccccccbbbbbbck',
      '.....kccccccccccccccccccbbbbbbbk',
      '.....kcccccbbcccccccccccbbbbbbbk',
      '.....kccccbbkkccccccccccbbbbbbbk',
      '.....kcccbbk..kcccccccccbbbbbbk.',
      '.....kcbbbk....kcccccccbbbbbbbk.',
      '....kccbbk......kkccccbbbbbbbk..',
      '...kcccbk.........kkkkbbbbbbk...',
      '..kccccbk.......kkkkkbbbbbbbk...',
      '.kcccccbbk.....kbbbbbbbbbbbbk...',
      '.kkkkkkkkk.....kkkkkkkkkkkkkk...',
      '................................',
    ],
  };

  // 7. Fungling — small waddling mushroom creature, red spotted cap, stubby legs, dot eyes
  S.fungling = {
    w: 32, h: 32,
    pal: {
      k: '#2a1418', // outline
      r: '#a02828', // cap dark
      s: '#d94040', // cap mid
      t: '#f06a5a', // cap light
      w: '#f7efe0', // spots
      c: '#e8dcc0', // stem
      b: '#c4b28e', // stem shade
      e: '#2a1418', // eye
    },
    px: [
      '................................',
      '................................',
      '................................',
      '...........kkkkkkkk.............',
      '........kkksssssssskkk..........',
      '......kkssswwsssssssswkk........',
      '.....kssswwwwssssswwwwwsk.......',
      '....kssstwwwwssssswwwwwssk......',
      '...kssssswwwssssssswwwsssskk....',
      '..kstssssswwsssswwssssssstwwk...',
      '..ksttsssssssssswwwwsssssswwk...',
      '.kssttsssswwsssswwwwsssssssswk..',
      '.kssssssswwwwssssssssswwsssssk..',
      '.krssssssswwssssssssswwwwssssrk.',
      '.krrrsssssssssssssssswwsssssrrk.',
      '..krrrrrrrrssssssssssssssrrrrk..',
      '...kkrrrrrrrrrrrrrrrrrrrrrrkk...',
      '.....kkkkkbccccccccbkkkkkkk.....',
      '.........kbcccccccccbk..........',
      '........kbcccccccccccbk.........',
      '........kbckcccckccccbk.........',
      '.......kbcccccccccccccbk........',
      '.......kbccccccccccccbbk........',
      '.......kbbccckkkcccccbbk........',
      '.......kbbcccccccccccbbk........',
      '........kbbcccccccccbbbk........',
      '........kbbbbbbbbbbbbbk.........',
      '.........kbbbkkkkbbbbk..........',
      '.........kbbk...kbbbk...........',
      '........kbbbk...kbbbk...........',
      '........kkkkk...kkkkk...........',
      '................................',
    ],
  };

  // 8. Sap Slime — amber translucent slime blob with a leaf stuck in it
  S.sap_slime = {
    w: 32, h: 32,
    pal: {
      k: '#4a2a08', // outline
      a: '#b86a10', // amber dark
      b: '#e69420', // amber mid
      c: '#f7c04a', // amber light
      d: '#fde9a0', // highlight
      g: '#2f6f2a', // leaf dark
      h: '#6fbf4a', // leaf light
      e: '#3a1a08', // eye
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '.......................kk.......',
      '......................khgk......',
      '....................kkhhgk......',
      '...................khhhgggk.....',
      '...................khhgggk......',
      '...........kkkkk....kgggkk......',
      '.........kkbbbbbkk..kggk........',
      '.......kkbbccccbbbkkkgkk........',
      '......kbbccdddccbbbbbgbbk.......',
      '.....kbbccddddccbbbbbbbbbk......',
      '....kbbcccdddccbbbbbbbbbbbk.....',
      '...kbbbccccdcccbbbbbbbbbbbbk....',
      '...kbbbeccccccbbbbbbccbbbbbbk...',
      '..kbbbbebbbcccbbbbbcddcbbbbbbk..',
      '..kbbbbbbbbbbbbbbbbcdccbbbbbbk..',
      '.kbbbbbbbbbbbbbbbbbbccbbbbbbbbk.',
      '.kbbabbbkkkkbbbbbbbbbbbbbbabbbk.',
      '.kbaabbbbbbbbbbbbbbbbbbbbaaabbk.',
      'kbaaabbbbbbbbbbbccbbbbbbaaaabbk.',
      'kbaaaabbbbbbbbbbbbbbbbbaaaaabbbk',
      'kaaaaabbbbbbbbbbbbbbbbaaaaaabbbk',
      'kaaaaaabbbbbbbbbbbbbbaaaaaaaabak',
      'kkaaaaaakbbbbbbbbbkaaaaaaaakaaak',
      '.kkaaaakkkkkkkkkkkkaaaaakk.kaak.',
      '..kkkkk...........kkkkkk...kkk..',
      '................................',
    ],
  };

  // 9. Jungle Bat — purple-brown bat with wide wings, fangs, flying
  S.jungle_bat = {
    w: 32, h: 32,
    pal: {
      k: '#1a0f22', // outline
      b: '#4a2c5a', // wing dark
      c: '#6b4478', // wing mid
      d: '#8f6a9a', // wing light
      f: '#5a3a48', // fur
      e: '#ff3b3b', // eye
      w: '#f5f0ff', // fang
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '..............k.....k...........',
      '.............kdk...kdk..........',
      '.............kfdk.kdfk..........',
      '..............kffkkffk..........',
      'kk...........kffffffffk........k',
      'kck.........kfffffffffk.......kc',
      'kccdk.......kfeefffefffk.....kdc',
      'kcccdkk.....kffkfffkfffk...kkdcc',
      'kbcccddkk...kkffwfwffkk..kkddccc',
      'kbbccccddkk..kkfffffkk.kkddccccb',
      '.kbbcccccddkkkkfffffkkkddcccccbk',
      '.kbbbccccccddkfffffffkddccccbbbk',
      '..kbbbccccccckfffffffkcccccbbbk.',
      '..kkbbbcccccckfffffffkcccccbbbk.',
      '...kkbbbbccccckfffffkcccccbbbkk.',
      '....kkbbbbccckkfffffkkccccbbkk..',
      '.....kkbbbkkbbkfffffkbbkkbbkk...',
      '......kkkk.kbbkkfffkkbbk.kkk....',
      '...........kkk.kkkkk.kkk........',
      '...............kk.kk............',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
    ],
  };

  // 10. Moss Crab — grey-green crab covered in moss, one oversized claw
  S.moss_crab = {
    w: 32, h: 32,
    pal: {
      k: '#141c14', // outline
      b: '#4a5a48', // shell dark
      c: '#6e8068', // shell mid
      d: '#94a88c', // shell light
      m: '#3a7a2a', // moss dark
      n: '#6fc24a', // moss light
      e: '#f0d040', // eye
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '..............nk.....kn.........',
      '.............knmk...kmnk........',
      '....kk.......kmk..kkmnk.........',
      '...kddk......kek.kmnkek.........',
      '..kdccck....kkekkknkkekk........',
      '.kdccccck..kbbkkbbbbbkkbbkk.....',
      'kdcccccbk..kbbcccccccccccbbk....',
      'kccccccbbkkbbccnnncccnnccccbk...',
      'kcccccbbbkkbccnnnnncnnnnnccccbk.',
      'kbcccccbbkkbcccnnncccnnncccccbk.',
      'kbbcccbbbkkbcccccccccccccccccbk.',
      '.kbbbbbbbkkbbccccccccccccccccbk.',
      '.kbbbbbbkkkkbbbcccccccccccccbbk.',
      '..kbbbbbkkkkbbbbccccccccccccbbk.',
      '.kkcccbbk..kkbbbbbbbbbbbbbbbbk..',
      'kdccccbbk..kbbkkbbkkkkbbkkbbkk..',
      'kcccccbk..kbbkkbbkk.kbbk.kbbk...',
      'kbccccbk.kbbk.kbbk..kbbk..kbbk..',
      'kbbcbbbk.kbk..kbk...kbk...kbbk..',
      '.kbbbbk.kbk..kbk....kbk....kbk..',
      '..kkkk..kbk..kbk.....kbk...kbk..',
      '........kk...kk......kk....kk...',
      '................................',
      '................................',
      '................................',
      '................................',
    ],
  };

  // 11. Spitting Lizard — yellow-green lizard with puffed throat, spit droplet
  S.spitting_lizard = {
    w: 32, h: 32,
    pal: {
      k: '#1a2410', // outline
      b: '#5a7a20', // scale dark
      c: '#8fb03a', // scale mid
      d: '#c8dc60', // scale light
      t: '#f0d858', // throat
      e: '#ff8a2a', // eye
      s: '#8ff0e8', // spit
      m: '#6a2a2a', // mouth
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
      '..............................k.',
      '.............................kck',
      '............................kbck',
      '...........................kbck.',
      '..........................kbck..',
      '.........................kbbk...',
      '........kkkkk...........kbbk....',
      '......kkcccccckkkkkkkk.kbbk.....',
      '....kkccceccccccccccccckbbk.....',
      '...kccccckcccdddcccccccbbbk.....',
      '..kccccccccdddddddccccccbbk.....',
      '.kcmmmmmcccdddddddddcccbbbk.....',
      '..kkkkkccccccdddddddccccbbk.....',
      's..kttttcccccccccccccccbbbk.....',
      'ss.ktttttcccccccccccccbbbk......',
      's..kttttttkkbbccccccbbbbbk......',
      '....kttttk..kbbcccbbbkbbk.......',
      '.....kkkk..kbbbkkkbbk.kbbk......',
      '..........kbbk..kbbk...kbk......',
      '.........kbbk..kbbk....kbk......',
      '........kbbk..kbbk.....kbk......',
      '.......kbbkk.kbbbk....kbbbk.....',
      '.......kkkk..kkkkk....kkkkk.....',
      '................................',
    ],
  };

  // 12. Puffbird — round fluffy blue/orange bird, tiny wings, oversized beak
  S.puffbird = {
    w: 32, h: 32,
    pal: {
      k: '#14203a', // outline
      b: '#2a4a9a', // blue dark
      c: '#4a7ad0', // blue mid
      d: '#8ab8f0', // blue light
      o: '#c05a10', // orange dark
      p: '#f08a20', // orange mid
      q: '#ffc060', // orange light
      e: '#ffffff', // eye
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '..............kkkkkkk...........',
      '...........kkkccddccckk.........',
      '.........kkccccdddccccckk.......',
      '........kccccccddccccccbbk......',
      '.......kcccccccccccccccbbbk.....',
      '......kccccceeecccccccccbbk.....',
      '.....kccccceekecccccccccbbbk....',
      '..kkkkccccceeeecccccccccbbbk....',
      'kkppqqkccccceeccccccccccbbbbk...',
      'kpppqqqkcccccccccccccccccbbbk...',
      'kkppppqkccccccccccccccccbbbbkk..',
      '..kkoooookccccccccccccccbbbbbkkk',
      '....kkkkkccccccccccdcccbbbbbkbbk',
      '......kppcccccccccdddccbbbbkbbk.',
      '.....kpppqccccccccdddccbbbbbkk..',
      '.....kppqqccccccccdddccbbbbk.k..',
      '.....kqqqqccccccccdddcccbbbk....',
      '......kkqkccccccccddcccbbbk.....',
      '.......kkbccccccccccccbbbk......',
      '.........kbbcccccccccbbbk.......',
      '..........kkbbbbbbbbbbkk........',
      '............kkkkkkkkkk..........',
      '...........kok....kok...........',
      '..........kooook.kooook.........',
      '..........kkkkkk.kkkkkk.........',
      '................................',
    ],
  };

  // 13. Root Grub — pale fat larva with brown mandibles, segmented body
  S.root_grub = {
    w: 32, h: 32,
    pal: {
      k: '#2a2018', // outline
      b: '#b8a888', // crease
      c: '#e8dcc0', // body
      d: '#faf4e0', // highlight
      r: '#8a6a48', // head
      m: '#5a3a18', // mandible dark
      n: '#8a5a28', // mandible mid
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
      '................................',
      '................................',
      '....................kkkkk.......',
      '...............kkkkkkcccck......',
      '...........kkkkkccccccccccck....',
      '.........kkccccccccdcccccccck...',
      '.......kkccccccccdddcbcccccccck.',
      '......kcccccccbcccddcbccccccccck',
      '.....krrcccccbccccdccbcccccccbck',
      '....krrrrkccbcccccccbcccccccbcck',
      '...krrkrrkcccbcccccccbccccccbbck',
      '..kmnkrrrkcccbcccccccbccccccbbck',
      '.kmnk.krrkccccbcccccccbcccccbbk.',
      'kmnk..krrkcccbccccccccbccccbbbk.',
      'kmk...krrkcccbcccccccbcccccbbbk.',
      'kmnk..krrkccccbcccccccbccccbbk..',
      '.kmnk.krrkccccbccccccbccccbbbk..',
      '..kmnkkrrkcccccbccccccbccccbbk..',
      '...kkkrrbkkcccbbbcccccbccbbbk...',
      '.....krrbbkkkbbbbbkkkbbbbbbkk...',
      '.....kkbbkkkkkkkkkkkkkkkkkk.....',
      '......kkkk..kk..kk..kk..........',
      '................................',
      '................................',
    ],
  };

  // 14. Fern Imp — small red imp wearing fern leaves, pointy tail, grin
  S.fern_imp = {
    w: 32, h: 32,
    pal: {
      k: '#2a0c10', // outline
      r: '#8a1e22', // skin dark
      s: '#c8323a', // skin mid
      t: '#e86a5a', // skin light
      g: '#2f6f2a', // fern dark
      h: '#6fbf4a', // fern light
      e: '#ffe94a', // eye
      w: '#f7efe0', // teeth
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '..........k....k................',
      '.........ksk..ksk...............',
      '........ksk.kkksk...............',
      '.......kkkkksssskk..............',
      '......kssssssssssk..............',
      '.....kssseesssseesk.............',
      '.....ksssekssssekssk............',
      '.....ksssssssssssssk............',
      '.....kswwwwwwwwwsssk............',
      '......kkwkwkwkwksk..............',
      '.......kkkkkkkkkk...............',
      '....kk.kgghgssshghgk............',
      '...ks.kghgssssssghgk............',
      '...kskkgssssssssssgk............',
      '...kssksssssssssssk.............',
      '....ksssssssssssssk.............',
      '.....kkkghghghghgk..........kk..',
      '.......kghhhhhhhgk.........ksk..',
      '.......kgghgghgggk.........ksk..',
      '........kgggggggk.........ksk...',
      '........kssskssskk.......ksk....',
      '........kssk.kssskkkkkkkkssk....',
      '........kssk..ksssssssssskk.....',
      '.......kssk....kkkkkkkkkk.......',
      '......ksssk....kssk.............',
      '.....kssssk...ksssk.............',
      '.....kkkkkk...kkkkk.............',
      '................................',
    ],
  };

  // 15. Stinger Wasp — yellow-black wasp, big stinger, translucent wings
  S.stinger_wasp = {
    w: 32, h: 32,
    pal: {
      k: '#1a1608', // outline
      y: '#f2c81e', // yellow
      z: '#ffe870', // yellow light
      b: '#2a2418', // black stripe
      c: '#3d3628', // black mid
      w: '#b8c8d8', // wing
      v: '#e0ecf4', // wing light
      e: '#e83a2a', // eye
      s: '#d8d8d8', // stinger
    },
    px: [
      '................................',
      '................................',
      '................................',
      '...............kkkkkkkk.........',
      '............kkkwwwvvvvwkk.......',
      '..........kkwwwwvvvvvwwwwkk.....',
      '.........kwwwwvvvvwwwwwwwwwk....',
      '........kwwwvvvvwwwwwwwwwwwwk...',
      '........kwwvvvwwwwwwwwwwwwwwk...',
      '.....k..kwwwwwwwwwwwkkkkwwwwk...',
      '....k...kkwwwwwwwkkkbbbbkkwwk...',
      '...k....kkkwwwwkkbbccbbbbbkkk...',
      '...kkkk.kcckkkkkbbccyyybbbbbk...',
      '..kccccckcccccccbbcyyyybbbbbbk..',
      '.kceeeccckccccccbbyyyyybbbbyyyk.',
      '.kceeeeccckccccbbbyyyyybbbyyyyk.',
      'kceeeeeccckccccbbyyyyyybbbyyyykk',
      'kceeeeeccckkkccbbyyyyybbbyyyykss',
      'kkceeeccckkkkccbbyyyyybbbyyykss.',
      '.kccccccck.kkccbbyyyyybbbyykssk.',
      '.kkcccckk...kkkbbyyyybbbyykssk..',
      '..kkkkk..k...k.kkbyyybbbyksskk..',
      '....k...k....k...kkkbbbkkssk....',
      '...k...k.....k......kkkssk......',
      '...k..k......k.........ss.......',
      '......k.......k.......kk........',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
    ],
  };

  // 16. Ironshell Snail — snail with grey riveted metal shell, orange body
  S.ironshell_snail = {
    w: 32, h: 32,
    pal: {
      k: '#1a1a20', // outline
      g: '#4a4e58', // steel dark
      h: '#7a8090', // steel mid
      i: '#aab0bc', // steel light
      r: '#2a2c34', // rivet
      o: '#b85a10', // body dark
      p: '#e8842a', // body mid
      q: '#ffb060', // body light
    },
    px: [
      '................................',
      '................................',
      '................................',
      '..................kkkkkkk.......',
      '...............kkkhhhiihhkkk....',
      '.............kkhhhiiiiiihhhhkk..',
      '............khhhiiiiiiiiihhhhhk.',
      '...........khhiiiihhhhhhiihhhgk.',
      '..........khhiiihhhhhhhhhihhggk.',
      '.........khhiiihhhrhhhhhhihhggk.',
      '.........khiiihhhhhhhhhhhhihggk.',
      '........khiiihhhrhhhhhhhhhhhggk.',
      '........khiiihhhhhhhiiihhhhhgggk',
      '........khiihhhhhhhiiiiihhhhgggk',
      '........khiihhhrhhhiihiihhhhggkk',
      '........khhhhhhhhhhihhhihhhhggk.',
      '.....k..khhhhhhhhhhihhhihhhgggk.',
      '....k....khhhhrhhhhhiihhhhgggk..',
      '...k.....khhhhhhhhhhhhhhhggggk..',
      '..kk.k...khghhhhhhrhhhhggggggk..',
      '.kqqkk....khgghhhhhhhhgggggkk...',
      'kqppqkk....kkggggggggggggkkk....',
      'kqpppqqkk....kkkkkkkkkkkk.......',
      'kppppqqqqkkk..kkkkkkkkkkkkkk....',
      'kopppppqqqqkkkoooooppppqqqooook.',
      '.koopppppqqqppppppppppppqqqppook',
      '.kooopppppppppppppppppqqqppppook',
      '..kooooppppppppppppppppppppppook',
      '...kooooooooooooooooooooooooook.',
      '....kkkkkkkkkkkkkkkkkkkkkkkkkkk.',
      '................................',
      '................................',
    ],
  };

  // 17. Marsh Leech — dark red-black leech reared up, round sucker mouth with teeth
  S.marsh_leech = {
    w: 32, h: 32,
    pal: {
      k: '#160608', // outline
      b: '#3a0e14', // body dark
      c: '#6a1a24', // body mid
      d: '#9a2a34', // body light
      s: '#2a0a10', // sucker inner
      w: '#f0e0d0', // teeth
      m: '#c04050', // mouth ring
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '........kkkkkk..................',
      '......kkccccccck................',
      '....kkccdddccccck...............',
      '...kmmkcdddcccccck..............',
      '..kmwmmkcddcccccck..............',
      '.kmwsswkccdccccccck.............',
      '.kmsssswkcccccccccck............',
      'kmwsssswkccccccccccck...........',
      'kmsssssmkbccccccccccck..........',
      'kmwssswmkbccccccccccck..........',
      '.kmsssmkbbbcccccccccck..........',
      '.kmwmwkbbbcccccccccccck.........',
      '..kkkkkbbcccddccccccccck........',
      '.......kbbccddddcccccccck.......',
      '........kbbcddddccccccccck......',
      '.........kbbcdddccccccccck......',
      '..........kbbcccccccccccbk......',
      '...........kkbbcccccccccbk......',
      '.............kkbbbccccccbbk.....',
      '...............kkbbbcccccbbk....',
      '.................kkbbbcccbbbk...',
      '..................kkbbbbbbbbbk..',
      '...................kkbbbbbbbbbk.',
      '....................kkbbbbbbbbk.',
      '....................kbbbbbbbbbk.',
      '...................kbbbbbbbbbbk.',
      '...................kkkkkkkkkkkk.',
      '................................',
    ],
  };

  // 18. Twig Golem — humanoid made of bundled sticks and twine, glowing green eyes
  S.twig_golem = {
    w: 32, h: 32,
    pal: {
      k: '#1c1208', // outline
      b: '#5a3a1a', // stick dark
      c: '#8a5e2e', // stick mid
      d: '#b8884a', // stick light
      t: '#d8c070', // twine
      e: '#5aff5a', // eye
    },
    px: [
      '................................',
      '................................',
      '..........k.k.k.................',
      '.........kckbkck................',
      '........kcbcbcbck...............',
      '.......kbcbcbcbcbk..............',
      '.......kcecbcbecck..............',
      '.......kcbcbcbcbck..............',
      '.......kttttttttk...............',
      '........kcbcbcbck...............',
      '.........kbcbck.k...............',
      '....k...kkkkkkkkkkk.k...........',
      '...kck.kbcbcbcbcbcbkkck.........',
      '...kck.kcbcbcbcbcbcbkck.........',
      '...kbkkbttttttttttttkbk.........',
      '...kckkcbcbcbcbcbcbckck.........',
      '...kckkbcbcbcbcbcbcbkbk.........',
      '...kbk.kcbcbcbcbcbcbkck.........',
      '...kck.kbttttttttttbkck.........',
      '...kbk.kcbcbcbcbcbcckbk.........',
      '...kck..kbcbcbcbcbck.kck........',
      '...kbk..kkcbcbcbcbkk.kck........',
      '...kck...kbckkkkcbk..kbk........',
      '...kk....kcbk..kbck..kk.........',
      '.........kbtk..ktbk.............',
      '.........kcbk..kbck.............',
      '.........kbck..kcbk.............',
      '........kkcbkk.kbckk............',
      '.......kbcbcbk.kcbcbk...........',
      '.......kkkkkkk.kkkkkk...........',
      '................................',
      '................................',
    ],
  };

  // 89. Alpha Bark Wolf (ELITE) — huge wolf with bark-plated hide, moss mane, orange eyes
  S.alpha_bark_wolf = {
    w: 40, h: 40,
    pal: {
      k: '#160e08', // outline
      b: '#4a3020', // fur dark
      c: '#6e4a2c', // fur mid
      d: '#9a7040', // bark light
      m: '#2f6a28', // moss dark
      n: '#5fae44', // moss light
      e: '#ff8a1a', // eye
      w: '#f5efe0', // teeth
      t: '#8a2a2a', // mouth
    },
    px: [
      '........................................',
      '........................................',
      '........................................',
      '........................................',
      '........................................',
      '........................................',
      '..........kk............................',
      '.........kbbk.........................kk',
      '........kbcbk........................kbk',
      '.......kbccbkk......................kbbk',
      '......kbcccbmmkk...................kbcbk',
      '.....kbccccbmnnmkkkkkkkk..........kbccbk',
      '....kbcccccbmnnmmmmmmmmmkkkkk....kbcccbk',
      '...kbcccccccmnnnmmnnmmmmbbbbbkkkkbccccbk',
      '..kbcceccccbmnnnnmnnnmmbbddbbbbbbbccccbk',
      '..kbcckkccccmnnnnnnnnnmbddddbbbbbbbcccbk',
      '.kbcccccccccmmnnnnnnnmmbbddbbbdbbbbbccbk',
      '.kbccccccccccmmnnnnnmmbbbbbbbddbbbbbccbk',
      'kbcccccccccccbmmmmmmmbbbbbbbdbbbdbbbbcbk',
      'kbbwcwcwccccccbbbbbbbbbbbbbbbbbdbbbbbbbk',
      '.kkkkkkwwcccccbbbbbccccbbbbbbbbbbbbbbkk.',
      '..kttttkkkcccccbbbccccccbbbbbbbbbbbbk...',
      '...kwtwtwkccccccbbccccccccbbbbbbbbbbk...',
      '....kkkkkkccccccccccccccccccbbbbbbbbk...',
      '.......kcccccccccccccccccccccbbbbbbbk...',
      '.......kbccccccccccccccccccccccbbbbbk...',
      '......kbbccccccbbbbbccccccccccccbbbk....',
      '......kbbcccccbk..kkbbbccccccccccbbk....',
      '......kbbbcccbk.....kbbbccccccbbcbk.....',
      '.....kbbbcccbk.......kbbbbcccbkbcbk.....',
      '.....kbbbcccbk........kbbbbccbk.kbk.....',
      '.....kbbbccbk..........kbbbcbk..kbk.....',
      '....kbbbcccbk...........kbbcbk..kbk.....',
      '....kbbbccbk............kbbcbk.kbbk.....',
      '....kbbbcbk.............kbbcbk.kbbk.....',
      '...kbbbccbk.............kbbbcbkbbbk.....',
      '...kbbbbbk..............kbbbbbkbbbk.....',
      '..kkbbbbkk..............kbbbbbbbbbk.....',
      '..kkkkkkk...............kkkkkkkkkkk.....',
      '........................................',
    ],
  };

  // 90. Spider Matriarch (ELITE) — giant black-purple spider, egg sac, many glowing eyes
  S.spider_matriarch = {
    w: 40, h: 40,
    pal: {
      k: '#0c0610', // outline
      b: '#2a1430', // body dark
      c: '#4a2a5a', // body mid
      d: '#7a4a8a', // body light
      e: '#8cff5c', // eye glow
      w: '#e8e0f0', // fang
      s: '#d8d0c0', // egg sac
      t: '#a89c88', // egg sac shade
    },
    px: [
      '........................................',
      '........................................',
      '........................................',
      '........................................',
      '.......................kkkkkkkkk........',
      '....................kkkbbbbbbbbbkkk.....',
      '..................kkbbbbcccccbbbbbbkk...',
      '.................kbbbbccdddcccbbbbbbbk..',
      '................kbbbbccdcccdccbbbbbbbbk.',
      '...............kbbbbcccdccccdcccbbbbbbk.',
      '...............kbbbcccccdcccdcccbbbbbbbk',
      '......kkk......kbbbccccccdddccccbbbbbbbk',
      '....kkbbbkkk...kbbbcccccccccccccbbbbbbbk',
      '...kbbbbbbbbkk.kbbbbccccccccccccbbbbbbbk',
      '..kbbebebbbbbbkkbbbbbcccccccccccbbbbbbbk',
      '.kbbebebebbbbbbkkbbbbbbcccccccccbbbbbbk.',
      '.kbebebebbbbbbbbkbbbbbbbbcccccccbbbbbbk.',
      '.kbbebebbbbbbbbbkbbbbbbbbbbbbbbbbbbbbbk.',
      '.kkbbbbbbbbbbbbkkkbbbbbbbbbbbbbbbbbbbk..',
      '..kwkwkbbbbbbbkkkkkkbbbbbbbbbbbbbbbbkk..',
      '..kw.wkkkbbbkkkkkkkkkkbbbbbbbbbbbbbkk...',
      '.......kkkkkkk..kkkkkkkkbbbbbbbbbkkk....',
      '......kk.kk.kk.....kk.kkkkkkkkkkk.......',
      '.....kk..kk..kk...kk...kk.kk...kk.......',
      '....kk...kk...kk..kk...kk..kk...kk......',
      '...kk...kk.....kkkk....kk...kk...kk.....',
      '..kk...kk.......kk.....kk....kk...kk....',
      '.kk...kk................kk....kk...kk...',
      'kk...kk.................kk.....kk...kk..',
      'k...kk...................kk.....kk...kk.',
      '....k.....................kk.....kk...kk',
      '..........................k......k....k.',
      '........................................',
      '........................................',
      '........................................',
      '........................................',
      '........................................',
      '........................................',
      '........................................',
      '........................................',
    ],
  };
})();
