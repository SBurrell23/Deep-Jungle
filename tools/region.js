/* Deep Jungle — one stretch of the map in isolation.
 *
 * Full expeditions are slow and their averages hide what a single region feels like.
 * This stops each run at a chosen column and reports the difficulty curve over just
 * that stretch, which is how the opening region was diagnosed as a formality: fights
 * were ending with the party at 92% health and the content running a level and a third
 * below them the whole way.
 *
 * Usage:  node tools/region.js [maxCol] [runsPerParty]
 *   maxCol         stop each run after this column, default 11 (the Undergrowth)
 *   runsPerParty   expeditions per party, default 50
 *
 * Rough targets: fights should leave the party near 85% health, run four to six rounds,
 * and the node level should track the party level rather than trail it.
 */
const path = require('path');
const { simRun } = require(path.resolve(__dirname, 'sim.js'));
const DJ = global.DJ;

const MAXCOL = parseInt(process.argv[2], 10) || 11;
const N = parseInt(process.argv[3], 10) || 50;
const PARTIES = [
  ['elf_warrior', 'goblin_mage', 'kuata_lancer'],
  ['elf_warrior', 'frog_monk', 'dryad_healer'],
  ['goblin_mage', 'dryad_healer', 'kuata_lancer'],
  ['frog_monk', 'kuata_lancer', 'elf_warrior'],
];

const rows = {};
let wipes = 0, runs = 0;
for (const party of PARTIES) {
  for (let i = 0; i < N; i++) {
    const r = simRun(4000 + i, party, { maxCol: MAXCOL });
    runs++;
    if (!r.won && r.finalHp.every((h) => h === 0)) wipes++;
    for (const b of r.battleLog) {
      if (b.col > MAXCOL) continue;
      const e = (rows[b.col] = rows[b.col] || { n: 0, rounds: 0, hp: 0, kos: 0, node: 0, party: 0 });
      e.n++; e.rounds += b.rounds; e.hp += b.hpAfter; e.kos += b.deaths;
      e.node += b.level; e.party += b.plevel;
    }
  }
}

console.log('\n=== Columns 1 to ' + MAXCOL + ', over ' + runs + ' partial runs ===');
console.log('col |  n  | nodeLv | partyLv | rounds | HP% after | downs');
let tr = 0, th = 0, tn = 0, tk = 0;
for (const c of Object.keys(rows).map(Number).sort((a, b) => a - b)) {
  const e = rows[c];
  tr += e.rounds; th += e.hp; tn += e.n; tk += e.kos;
  console.log(
    String(c).padStart(3), '|', String(e.n).padStart(3), '|',
    (e.node / e.n).toFixed(1).padStart(5), ' |',
    (e.party / e.n).toFixed(1).padStart(6), ' |',
    (e.rounds / e.n).toFixed(2).padStart(5), ' |',
    (e.hp / e.n).toFixed(0).padStart(7) + '%  |',
    (e.kos / e.n).toFixed(2));
}
console.log('---');
console.log('average: ' + (tr / tn).toFixed(2) + ' rounds, ' + (th / tn).toFixed(1) +
  '% health after a fight, ' + (tk / tn).toFixed(3) + ' downs a fight, ' + wipes + ' party wipes');
