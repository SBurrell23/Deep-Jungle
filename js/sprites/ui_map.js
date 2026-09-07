/* Deep Jungle — map footer button icons. */
(function () {
  const S = (window.DJ = window.DJ || {}).SPRITES || (DJ.SPRITES = {});

  // Three adventurer busts shoulder to shoulder: the party roster.
  S.icon_party = {
    w: 24, h: 24,
    pal: { k: '#12200f', a: '#2f5c38', b: '#4f9e52', c: '#8fe08a', d: '#8a5a2c', e: '#c98f4a',
           f: '#7a3b8a', g: '#b070c0', s: '#e8c4a0', t: '#3a2a1c' },
    px: [
      '........................',
      '........................',
      '.........kkkk...........',
      '........kddddk..........',
      '........kssssk..........',
      '........kstssk..........',
      '.........kssk...........',
      '..kkkk..kkkkkk..kkkk....',
      '.kbbbbk.kkkkkk.kffffk...',
      'kbccccbkkeeeekkfggggfk..',
      'kbssssbkkssssk.kfssssfk.',
      'kbstssbkkstsskkfstssfk..',
      'kbbsskbkkksskkkkfsskfk..',
      '.kkkkkk.kkkkkk..kkkkkk..',
      'kaabbbaakddeeddkkffggffk',
      'kabbbbbakdeeeedkfgggggfk',
      'kabbbbbakdeeeedkfgggggfk',
      'kaabbbaakddeeddkkffggffk',
      '.kaaaaak.kddddk.kfffffk.',
      '.kaaaaak.kddddk.kfffffk.',
      '..kaaak...kddk...kfffk..',
      '..kkkkk...kkkk...kkkkk..',
      '........................',
      '........................',
    ],
  };

  // A cinched leather satchel with a buckle: the bag.
  S.icon_bag = {
    w: 24, h: 24,
    pal: { k: '#1a1108', a: '#5a3a1c', b: '#8a5a2c', c: '#b07c40', d: '#d8a05a', e: '#e8c65a', f: '#3a2410' },
    px: [
      '........................',
      '.........kkkk...........',
      '........kaaaak..........',
      '.......ka....ak.........',
      '.......ka....ak.........',
      '......kkakkkkakkk.......',
      '.....kbbbbbbbbbbbk......',
      '....kbcccccccccccbk.....',
      '...kbcccddddddcccbbk....',
      '...kbcdddddddddccbbk....',
      '..kbccdddddddddcccbbk...',
      '..kbccddkkkkkddcccbbk...',
      '..kbccddkeeekddcccbbk...',
      '..kbccddkekekddcccbbk...',
      '..kbccddkeeekddcccbbk...',
      '..kbccddkkkkkddcccbbk...',
      '..kbccdddddddddcccbbk...',
      '..kbbccdddddddccccbbk...',
      '...kbbcccccccccccbbk....',
      '...kbbbbcccccccbbbbk....',
      '....kbbbbbbbbbbbbbk.....',
      '.....kaaaaaaaaaaak......',
      '......kkkkkkkkkkk.......',
      '........................',
    ],
  };
})();
