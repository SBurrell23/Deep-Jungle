/* Deep Jungle — map footer button icons. */
(function () {
  const S = (window.DJ = window.DJ || {}).SPRITES || (DJ.SPRITES = {});

  // Three adventurer busts on a shared baseline: the party roster.
  S.icon_party = {
    w: 24, h: 24,
    pal: { k: '#12200f', s: '#e8c4a0', t: '#3a2a1c', h: '#6b4a2f', i: '#d8b04a', j: '#3a2a4a', b: '#4f9e52', c: '#8fe08a', d: '#c9a227', e: '#f0d878', f: '#7a3b8a', g: '#b070c0' },
    px: [
      '........................',
      '........................',
      '........................',
      '........................',
      '..kkkk....kkkk....kkkk..',
      '.kkhhkk..kkiikk..kkjjkk.',
      '.khhhhk..kiiiik..kjjjjk.',
      '.kssssk..kssssk..kssssk.',
      '.ktsstk..ktsstk..ktsstk.',
      '.kssssk..kssssk..kssssk.',
      '..kkkk....kkkk....kkkk..',
      '...kk......kk......kk...',
      '.kkkkkk..kkkkkk..kkkkkk.',
      '.kbbbbk..kddddk..kffffk.',
      '.kbbbbk..kddddk..kffffk.',
      '.kbccbk..kdeedk..kfggfk.',
      '.kbbbbk..kddddk..kffffk.',
      '.kbbbbk..kddddk..kffffk.',
      '..kkkk....kkkk....kkkk..',
      '........................',
      '........................',
      '........................',
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
