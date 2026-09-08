/* Deep Jungle — region guardians, head to head.
 *
 * Each region fields one of three guardians per run. This fights all of them with the
 * same party at the same level, so the three a region can draw are comparable.
 *
 * Win rate alone is misleading here: a guardian can be beaten reliably and still gut a
 * party on the way out, which shows up later as a lost run. Watch the rounds and the
 * hero downs alongside it.
 *
 * Usage:  node tools/bosses.js [fightsPerGuardian]
 */
global.window = global;
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
['js/core/util.js', 'js/data/skills.js', 'js/data/heroes.js', 'js/data/monsters.js', 'js/data/items.js',
 'js/data/events.js', 'js/data/achievements.js', 'js/engine/battle.js', 'js/engine/map.js', 'js/engine/run.js']
  .forEach((f) => require(path.join(ROOT, f)));
const DJ = global.DJ;

const N = parseInt(process.argv[2], 10) || 300;
// Party level and node level at each region's boss column, taken from the sim's curve.
const SETUP = [
  { r: 0, lvl: 7, node: 7 },
  { r: 1, lvl: 13, node: 13 },
  { r: 2, lvl: 18, node: 18 },
];
const PARTY = ['elf_warrior', 'goblin_mage', 'dryad_healer'];
const STOCK = { red: 4, blue: 2, green: 2, yellow: 1 };

console.log('region  guardian            win%   rounds  heroDowns  partyHP%');
for (const s of SETUP) {
  for (const id of DJ.regionBosses(s.r)) {
    let wins = 0, rounds = 0, kos = 0, hp = 0;
    for (let i = 0; i < N; i++) {
      const rng = new DJ.RNG(5000 + i);
      const party = PARTY.map((h) => {
        const u = DJ.makeHeroUnit(h, 1);
        for (let l = 1; l < s.lvl; l++) DJ.grantXp(u, u.xpNext);
        return u;
      });
      const node = { type: 'boss', region: s.r, col: 12, level: s.node, boss: id };
      const b = new DJ.Battle({ party, enemies: DJ.buildEncounter(rng, node), rng, level: s.node, kind: 'boss' });
      b.start();
      let guard = 0;
      while (!b.over && guard++ < 900) {
        const step = b.next();
        if (step.needInput) { b.act(step.needInput, b.heroAutoAction(step.needInput, Object.assign({}, STOCK))); b.checkEnd(); }
      }
      if (b.result === 'victory') wins++;
      rounds += b.round; kos += b.stats.heroKOs;
      hp += party.reduce((a, h) => a + (h.alive ? h.hp / h.maxHp : 0), 0) / party.length;
    }
    console.log(
      String(s.r).padStart(5), ' ', id.padEnd(18),
      (100 * wins / N).toFixed(0).padStart(4) + '%',
      (rounds / N).toFixed(1).padStart(8),
      (kos / N).toFixed(2).padStart(10),
      (100 * hp / N).toFixed(0).padStart(8) + '%');
  }
}
