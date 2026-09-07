// js/sprites/heroes_b.js — Heroes 13–23. Heroes FACE RIGHT.
(function () {
  const S = (window.DJ = window.DJ || {}).SPRITES || (DJ.SPRITES = {});

  // 13. Sporeling Druid — small mushroom-capped creature with wooden staff, spore puffs
  S.spore_druid = {
    w: 32, h: 32,
    pal: {
      k: '#241a2a', // outline
      r: '#8c2f4a', // cap dark
      s: '#cc5468', // cap mid
      w: '#f7e6d2', // cap spots / highlight
      c: '#dcc39c', // stem skin light
      b: '#9a7448', // skin shade / staff wood
      g: '#35663a', // tunic dark
      h: '#5aa055', // tunic light
      e: '#8cf0b8', // eyes + spores
    },
    px: [
      '................................',
      '..................e.............',
      '.....e...................e......',
      '..........kkkkkkk.....kkkk......',
      '........kkrsssssrkk..kweeewk....',
      '.......krsswwsssssrk.kweewk.....',
      '......krsswwwwsssssrk..kbk......',
      '.....krsswwwssssswssrk.kbk......',
      '.....krrsswwssssswwsrk.kbk......',
      '......krrrrrrrrrrrrrk..kbk......',
      '........kwbwbwbwbwk....kbk......',
      '.........kccccccck.....kbk......',
      '........kccccccccck....kbk......',
      '........kccceccecck....kbk......',
      '........kcccccbbcck....kbk......',
      '.........kccccccbk.....kbk......',
      '..........kbcccbk......kbk......',
      '........kgggghhhgggk...kbk......',
      '.......kbgggghhhhgggk..kbk......',
      '.......kbggghhhhhgggcckbk.......',
      '.......kbgggghhhhggcbk.kbk......',
      '.......kbggghhhhhgggck.kbk......',
      '.......kbbggghhhgggbk..kbk......',
      '.......kgggghhhhggggk..kbk......',
      '......kgggghhhhhhggggk.kbk......',
      '......kgggkgggkgggkggk.kbk......',
      '.........kcck..kcck....kbk......',
      '.........kcck..kcck....kbk......',
      '.........kcck..kcck....kbk......',
      '.........kcck..kcck....kbk......',
      '........kccbk.kccbk....kbk......',
      '........kkkkk.kkkkk....kkk......',
    ],
  };

  // 14. Tiger Shaman — tiger humanoid in bone necklace and feather cloak, totem staff
  S.tiger_shaman = {
    w: 32, h: 32,
    pal: {
      k: '#2a1608', // outline
      o: '#a85510', // fur dark
      p: '#e08a28', // fur mid
      q: '#f8c878', // fur light
      w: '#f4ecd8', // muzzle / bone
      b: '#3a2410', // stripes
      e: '#7ef25a', // eyes
      f: '#c03040', // cloak feathers
      n: '#7a5230', // staff wood
    },
    px: [
      '................................',
      '................................',
      '....................kkkkkkk.....',
      '....................knwwwnk.....',
      '........kkk.....kkk.knekenk.....',
      '.......kopok...kopokknnnnnk.....',
      '.......kobpbppppbpbok.kfnnfk....',
      '......kobbpppppppbbpok.knk......',
      '......kobpeppebppwwwok.knk......',
      '......kobppppppbpwwwok.knk......',
      '......kobpppppbpwkkwok.knk......',
      '.......kobppppppbwwwok.knk......',
      '........koobppppwwwok..knk......',
      '.........koopppwwwok...knk......',
      '..........kopppok......knk......',
      '....kfkffkoopppppookk..knk......',
      '...kffkffkoppppppppook.knk......',
      '...kfffkfffkopwwwwpok..knk......',
      '...kfffkfffkopppwwppok.knk......',
      '...kfffkfkoppbppppppqqqknk......',
      '....kffkfkopppppppppqqqknk......',
      '....kffkfkoppppppppook.knk......',
      '......kffkopbppppbpok..knk......',
      '.......kfkopppppppok...knk......',
      '.......kkooppppppookk..knk......',
      '........kopok..kopok...knk......',
      '........kopok..kopok...knk......',
      '........kobok..kobok...knk......',
      '........kopok..kopok...knk......',
      '........kopok..kopok...knk......',
      '.......koppqk..koppqk..knk......',
      '.......kkkkkk..kkkkkk..kkk......',
    ],
  };

  // 15. Harpy Skydancer — winged bird-woman with colorful plumage and a spear
  S.harpy_skydancer = {
    w: 32, h: 32,
    pal: {
      k: '#1a1030', // outline
      b: '#28508c', // feather dark
      c: '#3f7fc8', // feather mid
      d: '#7fb8ec', // feather light
      o: '#f0a028', // crest / talons / beak
      s: '#e8c49a', // skin
      e: '#ffe45c', // eye
      w: '#dfe6f0', // spear head
      n: '#8a5a2a', // spear shaft
    },
    px: [
      '................................',
      '........................kwk.....',
      '.......................kwwk.....',
      '.......................kwwk.....',
      '.............kok........knk.....',
      '.kdk........kooook......knk.....',
      'kdddk......kkssssskk....knk.....',
      'kbkddkdk...ksssssssk....knk.....',
      'kbkdckdcck.ksssssssk....knk.....',
      'kbkdckdcckckssseksooook.knk.....',
      'kbkdckdcckckssssssook...knk.....',
      'kbkdckdcckcksssssssk....knk.....',
      'kbkdckdcckcckssssssk....knk.....',
      'kbkdckdcckcckbdcdbbk....knk.....',
      'kbkdckdcckcckbcdcbbk....knk.....',
      '.kkdckdcckcckbcdcbssssssknk.....',
      '..kkdkdcckcckbcdcbssssssknk.....',
      '...kkdkdckcckbcdcbk.....knk.....',
      '....kkdkdccckbcdcbk.....knk.....',
      '.....kkdkdcckbsssbk.....knk.....',
      '......kkdkcckbsssbk.....knk.....',
      '.......kkdcckbsssbk.....knk.....',
      '........kkdckbbbbbk.....knk.....',
      '.........kkckbbbk.......knk.....',
      '............ksk.ksk.....knk.....',
      '............ksk.ksk.....knk.....',
      '............ksk.ksk.....knk.....',
      '............kok.kok.....knk.....',
      '............kok.kok.....knk.....',
      '............kok.kok.....knk.....',
      '..........kooookkooook..knk.....',
      '..........kkkkkkkkkkkk..kkk.....',
    ],
  };

  // 16. Ghoul Necromancer — gaunt grey ghoul in tattered dark robe, skull staff, green flames
  S.ghoul_necromancer = {
    w: 32, h: 32,
    pal: {
      k: '#0d0d16', // outline
      b: '#191428', // robe dark
      c: '#332b4e', // robe mid
      d: '#6a5c9c', // robe light
      s: '#a8b6ac', // ghoul skin
      t: '#5d6b64', // skin shade / staff
      w: '#e6e4d4', // bone
      e: '#6cff8c', // green flame / eyes
      g: '#2f9a58', // flame dark
    },
    px: [
      '................................',
      '.......................e........',
      '......................geg.......',
      '....................kkwwwkk.....',
      '....................kwewewk.....',
      '........kkbbbbbbbkk.kwwwwwk.....',
      '.......kbbbbbbbbbbbkkkwkwkk.....',
      '.......kbbccccccccbk..ktk.......',
      '.......kbcttssssstck..ktk.......',
      '.......kbctskesketck..ktk.......',
      '.......kbctsssssstck..ktk.......',
      '........kbcskkkscbk...ktk.......',
      '.........kbcssscbk....ktk.......',
      '.......kbbcccccccbbk..ktk.......',
      '.....kbbcccdddcccbbk..ktk.......',
      '.....kbbccdddddcccbk..ktk.......',
      '.....kbbcdddddddccbwwwktk.......',
      '.....kbbccdddddcccbk.wktk.......',
      '.....kbbccdddddcccbk..ktk.......',
      '....kbbcccdddddccccbk.ktk.......',
      '....kbbcccdddddccccbk.ktk.......',
      '....kbbccdddddddcccbk.ktk.......',
      '...kbbcccddddddccccbk.ktk.......',
      '...kbbcccddddddccccbk.ktk.......',
      '..kbbcccdddddddccccbk.ktk.......',
      '..kbbccdddddddddcccbk.ktk.......',
      '..kbbcccddddddddcccbk.ktk.......',
      '.kbbcccdddddddddcccbk.ktk.......',
      '.kbbccdddddddddddcccbkktk.......',
      '.kbbcccddddddddddcccbkktk.......',
      '.kbkbkbbkbkbbkbkbbkbkkktk.......',
      '.kbbkkbbkkbbkkbbkkbbkkktk.......',
    ],
  };

  // 17. Beetle Knight — knight in iridescent beetle-shell armor, horned helm, lance and shield
  S.beetle_knight = {
    w: 32, h: 32,
    pal: {
      k: '#08181a', // outline
      b: '#11524c', // shell dark
      c: '#1c8a72', // shell mid
      d: '#3fc79a', // shell light
      v: '#96f2da', // iridescent sheen
      s: '#dbe4ec', // lance steel
      t: '#7a8794', // steel dark
      e: '#ffb020', // eye slit glow
      y: '#e8bc44', // gold shield boss
    },
    px: [
      '................................',
      '................................',
      '...............kvk.....ksk......',
      '................kvck..ksssk.....',
      '.................kvck.ksssk.....',
      '..........kkkkkkkkvdck.ktk......',
      '.........kbbcccccddvck.ktk......',
      '.........kbcccdddvddck.ktk......',
      '.........kbcckkeekkcck.ktk......',
      '.........kbcccccccccck.ktk......',
      '.........kbccdddddvcck.ktk......',
      '..........kbkckckckbk..ktk......',
      '...........kbcccccbk...ktk......',
      '..kbbbbbbk.kbbcccccbbk.ktk......',
      '.kbcccccbk.kbcccdddcbk.ktk......',
      '.kbccyyccbkkbccdddccbk.ktk......',
      '.kbcyyyycbkkbccdddccdddktk......',
      '.kbcyyyycbkkbccdddccdddktk......',
      '.kbccyyccbkkbcccdcccbk.ktk......',
      '.kbcccccbk.kbccdddccbk.ktk......',
      '..kbbcccbbkkbcccccccbk.ktk......',
      '...kbbbbbk.kbbcccccbbk.ktk......',
      '....kkkkk..kbbcccccbbk.ktk......',
      '...........kbbcccccbbk.ktk......',
      '...........kbbccbbccbk.ktk......',
      '...........kbck.kbck...ktk......',
      '...........kbck.kbck...ktk......',
      '...........kbck.kbck...ktk......',
      '...........kbck.kbck...ktk......',
      '...........kbck.kbck...ktk......',
      '..........kbcdk.kbcdk..ktk......',
      '..........kkkkk.kkkkk..kkk......',
    ],
  };

  // 18. Naga Assassin — serpent-tailed hooded assassin with twin daggers, dark scales
  S.naga_assassin = {
    w: 32, h: 32,
    pal: {
      k: '#0a0c16', // outline
      b: '#1e2f4e', // scale dark
      c: '#3a5c8e', // scale mid
      d: '#6b9ad0', // scale light
      h: '#1a1d33', // hood
      w: '#9fb0bc', // belly scales / fangs
      s: '#d2dae6', // blade steel
      t: '#78838f', // steel dark
      e: '#c46cff', // eye glow
    },
    px: [
      '................................',
      '................................',
      '................................',
      '.......................ksk......',
      '..........kkkkkkkkk....ksk......',
      '.........khhhhhhhhhk...ksk......',
      '........khhhhhhhhhhhk..ksk......',
      '........khhbbbbbbbhhk..ksk......',
      '........khhbccccccbhk..ksk......',
      '........khbccceccecbk..ksk......',
      '........khbcccccccbhk..ksk......',
      '........khhbccwwwcbhk..ksk......',
      '.........khhbccwcbhk...ksk......',
      '..........khhbbbbbhk.kttttk.....',
      '.......kbbccccccbbk.kdk.........',
      '......kbbcccccccbbkkddk.........',
      '....kdbbcwwkwwwccbbk.kdk........',
      '...kddbbcwwkwwwcbbk.kbk.........',
      '..kdkkbbcwwkwwwccbk.............',
      '..kssk.kbbcwwwccbbk.............',
      '..kssk.kbbcwwkccbbk.............',
      '..kssk.kbbccwccbbk..............',
      '..kssk.kbbccccbbk...............',
      '..kttk.kbbccccbbbk..............',
      '...kk.kbbcccccccccbbk...........',
      '.....kbbcccccccccccbbk..........',
      '....kbbccwwwcwwwccccbbk.........',
      '....kbbcwwwcwwwcwwwcbbbk........',
      '...kbbcwwwcwwwcwwwcwwwcbk.......',
      '...kbbccwwwcwwwcwwwcwwwcbk......',
      '....kbbcccwwwcwwwcwwwccbbk......',
      '....kkbbbbbbbbbbbbbbbbbbk.......',
    ],
  };

  // 19. Panda Brewmaster — round panda with barrel on back and gourd, bamboo staff
  S.panda_brewmaster = {
    w: 32, h: 32,
    pal: {
      k: '#181820', // outline
      w: '#f4f2e8', // white fur
      y: '#cfccc0', // white fur shade
      b: '#22222c', // black fur
      c: '#3c3c4a', // black fur mid
      n: '#8a5a2a', // barrel wood
      m: '#5a3618', // barrel dark
      o: '#e0a832', // gourd / barrel hoops
      g: '#6fae3f', // bamboo
    },
    px: [
      '................................',
      '................................',
      '................................',
      '.......................kgk......',
      '..........kkk...kkk....kkk......',
      '.........kbcbk.kbcbk...kgk......',
      '........kbbbbkkkbbbbk..kgk......',
      '........kbbwwwwwwwbbk..kgk......',
      '.......kwwwwwwwwwwwwwk.kgk......',
      '.......kwwbbwwwwwbbwwk.kgk......',
      '.......kwwbwbwwwbwbwwk.kgk......',
      '.......kwwbwwbbbwwbwwk.kgk......',
      '.......kwwwwwwykywwwwk.kgk......',
      '........kwwwwwwwwwwwk..kgk......',
      '.kmnnnnmkkbbwwwwwwwbbk.kgk......',
      '.kmnnnnmkkbwwwwwwwwwbk.kgk......',
      '.kmoooomkkbwwwwwwwwwbk.kgk......',
      '.kmnnnnmkkbwwwwwwbccbbbkgk......',
      '.kmnnnnmkkbwwwwwbbcccbbkgk......',
      '.kmoooomkkbwwwwwwwbbbk.kgk......',
      '.kmnnnnmkkbbwwwwwwwbbk.kkk......',
      '.kkmmmmkkkbbwwwwwwwbbk.kgk......',
      '.....kok.kbbwwwwwwbbk..kgk......',
      '....kookkkbbwwwwwwbbk..kgk......',
      '..koooookkbbwwwwbbk....kgk......',
      '..kooyookkbck.kbck.....kgk......',
      '..koooookkbck.kbck.....kgk......',
      '..kkoookkkbck.kbck.....kkk......',
      '...kkkkk.kbck.kbck.....kgk......',
      '.........kbck.kbck.....kgk......',
      '........kbbbk.kbbbk....kgk......',
      '........kkkkk.kkkkk....kkk......',
    ],
  };

  // 20. Gorilla Stormcaller — big gorilla with blue tattoos and lightning-charged fists
  S.ape_stormcaller = {
    w: 32, h: 32,
    pal: {
      k: '#0e0e18', // outline
      b: '#262633', // fur dark
      c: '#3f3f4f', // fur mid
      d: '#5e5e6e', // fur light
      s: '#6b4a44', // face skin
      t: '#3a7ad0', // tattoo bright
      u: '#2a4a8a', // tattoo dark
      e: '#a8ecff', // lightning
      y: '#ffffff', // lightning core
    },
    px: [
      '................................',
      '................................',
      '..........kkkkkkkkk.............',
      '.........kbbbbbbbbbk............',
      '........kbbccccccccbk...........',
      '........kbcssssssssck...........',
      '........kbckkkskkkcbk...........',
      '........kbcskysskysck...........',
      '........kbcsskkksscbk...........',
      '.........kbcssssscbk............',
      '..........kbcccccbk.............',
      '.....kbbcccccccccccccbbk........',
      '...kbbcttccccccttcccbbk.........',
      '..kbbccttccccccccttccccbk.......',
      '..kbbcccuucccccccuuccccbk.......',
      '.kbbccccttcddddcttcccccbk...e...',
      '.kbbcccccccdddddcccccccbk.......',
      '.kbbccccccdddddddccccccbk......e',
      '.kbbcccccdddddddddcccccbk.......',
      '.kbbcccccdddddddddcccccbk...e...',
      '..kbbccccdddddddcccccbbk...e....',
      '.ekbbcccccdddddcccccbbk.....e...',
      '.kbeebk.kbbcccccccbbk.kbeebk....',
      '.keyyek.kbbcccccccbbk.keyyek....',
      '.kbeebk.kbbcccccccbbk.kbeebk....',
      '.kkbbkk.kbbcccccccbbk.kkbbkk....',
      '........kbccbk.kbccbk.....e.....',
      '........kbccbk.kbccbk...........',
      '........kbccbk.kbccbk...........',
      '........kbccbk.kbccbk...........',
      '.......kbdddbk.kbdddbk..........',
      '.......kkkkkkk.kkkkkkk..........',
    ],
  };

  // 21. Chameleon Ninja — chameleon humanoid in ninja garb with katana, color-shifting skin
  S.chameleon_ninja = {
    w: 32, h: 32,
    pal: {
      k: '#0c150f', // outline
      b: '#17282c', // cloth dark
      c: '#2b4750', // cloth mid
      d: '#456e78', // cloth light
      g: '#4fae4a', // skin green
      h: '#8fd868', // skin light
      m: '#b04ad0', // colour-shift patch
      s: '#dfe8f0', // katana blade
      e: '#ffd23a', // eye / tsuba
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '..........kkkkkkkkk.............',
      '.........kbbbbbbbbbk............',
      '........kbbccccccccbk...........',
      '........kbcccccccccbk...........',
      '........kggggggggggk........ksk.',
      '........kghggkeekggk.......kssk.',
      '........kghggkeekggk......kssk..',
      '........kghhggghhggk.....kssk...',
      '........kbbccccccbbk....kssk....',
      '.........kbccccccbk....kssk.....',
      '.........kbbccccbbk...kssk......',
      '.......kbbcccccccbbk.keek.......',
      '......kbbccdddcccbggkbk.........',
      '......kbbccccccccbggkbk.........',
      '......kbbcccccccccbk............',
      '......kbbcccmmcccccbk...........',
      '.....kgkkbbccmmmmcccbk..........',
      '...kghk.kbbccmmccccbk...........',
      '..kghk..kbbcccccccbk............',
      '.kghk...kbbcccccccbk............',
      '.kghhk..kbbcccccccbk............',
      '.kgghk...kbck.kbck..............',
      '..kgghk..kbck.kbck..............',
      '...kghk..kbck.kbck..............',
      '....kgk..kbck.kbck..............',
      '.........kbck.kbck..............',
      '........kbcck.kbcck.............',
      '........kkkkk.kkkkk.............',
    ],
  };

  // 22. Treant Sage — small walking tree elder with moss beard holding a glowing book
  S.treant_sage = {
    w: 32, h: 32,
    pal: {
      k: '#160f06', // outline
      b: '#452c14', // bark dark
      c: '#6b4724', // bark mid
      d: '#9a6c3a', // bark light
      m: '#37672a', // moss dark
      n: '#72b648', // moss light
      w: '#f2e6c4', // book pages
      r: '#8a2a2a', // book cover
      e: '#ffd85a', // glow / eyes
    },
    px: [
      '................................',
      '...........kkkkkk...............',
      '........kkmmnnnnmmkk............',
      '......kmmnnnnnnnnnmmk...........',
      '.....kmnnnnnnnnnnnnmk...........',
      '....kmnnnnnnnnnnnnnnmk..........',
      '....kmnnnnmmnnnnnnnnmk..........',
      '....kmmnnnnnnnnnnnnmmk..........',
      '.....kmmnnnnnnnnnnnmk...........',
      '......kkmmnnmmnnmmkk............',
      '........kbccccccccbk............',
      '........kbcddccddcbk............',
      '........kbckekckekbk............',
      '........kbccccccccbk............',
      '........kbccddccdcbk............',
      '........kbcckkkkccbk............',
      '........kbccmmmmccbk............',
      '.......kbcmmnnnnmmcbkwwrrwwk....',
      '......kbcmmnnnnnnmmckkrwwwwrk...',
      '......kbcmmnnnnnmmccckrwewwrk...',
      '......kbccmmnnnnmmccckrwwewrk...',
      '......kbcccmmmmmcccbkkrwwwwrk...',
      '......kbcccccccccccbkkkrrrrkk...',
      '......kbccdcccccdccbk...........',
      '......kbcccccccccccbk...........',
      '......kbbcccccccccbbk...........',
      '.......kbcck...kbcck............',
      '.......kbcck...kbcck............',
      '.......kbcck...kbcck............',
      '......kbccck..kbccck............',
      '.....kbccdck..kbccdck...........',
      '.....kkkkkkk..kkkkkkk...........',
    ],
  };

  // 23. Jaguar Paladin — jaguar humanoid in golden armor with sun shield and mace
  S.jaguar_paladin = {
    w: 32, h: 32,
    pal: {
      k: '#1e1206', // outline
      y: '#9a6a14', // gold dark
      z: '#dda428', // gold mid
      x: '#ffd97a', // gold light
      o: '#cf8a30', // jaguar fur
      b: '#4a2a0e', // fur spots / dark
      w: '#f6ead0', // muzzle white
      e: '#7ef25a', // eyes
      s: '#aab4c0', // mace steel
    },
    px: [
      '................................',
      '................................',
      '................................',
      '................................',
      '.........kzk..kzk...............',
      '........kzxzkkzxzk.....kzk......',
      '........kzzxxzzxxzzk.kzsszk.....',
      '........kyzzzzzzzzykkzsssszk....',
      '........kyzzzzzzzzykkssxxssk....',
      '........kooeooeooookkssxxssk....',
      '........kobooboowwokkzsssszk....',
      '........kooooowwwwok.kzsszk.....',
      '........koooowwkkwok...kyk......',
      '.........koooowwwok....kyk......',
      '..........kobooobk.....kyk......',
      '.kkyyyykkkyzzzzzzzzyk..kyk......',
      '.kyzzzzykkyzzzzzzzzyk..kyk......',
      '.kyzxxzykkyzzxxzzzzyk..kyk......',
      '.kzxxxxzkkyzzxxxzzzyk..kyk......',
      '.kzxxxxzkkyzzxxxzzzooookyk......',
      '.kyzxxzykkyzzzzzzzzooookyk......',
      '.kyzzzzykkyzzzzzzzzyk..kyk......',
      '.kkyzzykkkyykkkkkkyyk..kyk......',
      '..kkyykk.kyzzzzzzzzyk..kyk......',
      '.........kyzzzzzzzzyk..kyk......',
      '.........kyzzkkkkzzyk..kyk......',
      '.........kyzk.kyzk.....kyk......',
      '.........kyzk.kyzk.....kyk......',
      '.........kyzk.kyzk.....kyk......',
      '.........kobk.kobk.....kyk......',
      '........koobk.koobk....kyk......',
      '........kkkkk.kkkkk....kkk......',
    ],
  };
})();
