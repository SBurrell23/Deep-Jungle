/* Deep Jungle — per-adventurer strength.
 *
 * Every adventurer is run with the same fixed set of partner pairs, so what comes out is
 * the hero's own contribution rather than the company they happened to keep.
 *
 * Usage:  node tools/heroes.js [runsPerPair] [--pairs N]
 *   runsPerPair   expeditions per partner pair, default 5 (about 50 runs a hero)
 *   --pairs N     how many partner pairs to draw, default 12
 *
 * Reading it: at 50 runs a hero the sampling noise is worth roughly 13 points, so treat
 * anything inside that as level and act only on heroes that stay out of line across
 * repeated measurements.
 */
const path = require('path');
const { simRun } = require(path.resolve(__dirname, 'sim.js'));
const DJ = global.DJ;

const args = process.argv.slice(2);
const RUNS = parseInt(args[0], 10) || 5;
const pi = args.indexOf('--pairs');
const NPAIRS = pi >= 0 ? parseInt(args[pi + 1], 10) : 12;

const ids = DJ.HEROES.map((h) => h.id);
const prng = new DJ.RNG(90210);          // fixed, so every hero meets the same company
const PAIRS = [];
for (let i = 0; i < NPAIRS; i++) PAIRS.push(prng.shuffle(ids.slice()).slice(0, 2));

const out = [];
for (const hero of ids) {
  let wins = 0, runs = 0, cols = 0, lvl = 0, time = 0;
  for (const pair of PAIRS) {
    if (pair.includes(hero)) continue;
    for (let r = 0; r < RUNS; r++) {
      const res = simRun(31000 + runs * 97 + r * 13, [hero].concat(pair));
      runs++;
      if (res.won) wins++;
      cols += res.col; lvl += res.maxLevel; time += res.time;
    }
  }
  out.push({ hero, runs, win: wins / runs, col: cols / runs, lvl: lvl / runs, time: time / runs });
  process.stderr.write('  measured ' + hero + ' (' + Math.round(100 * wins / runs) + '%)\n');
}

out.sort((a, b) => a.win - b.win);
const mean = out.reduce((a, x) => a + x.win, 0) / out.length;
const sigma = Math.sqrt(0.25 / out[0].runs) * 100;

console.log('\n=== Per-adventurer win rate, identical partner pairs ===');
console.log('roster mean ' + (mean * 100).toFixed(1) + '%   ' + out[0].runs + ' runs a hero   ' +
  'noise about ±' + (2 * sigma).toFixed(0) + ' points at two sigma');
console.log('\nhero                       win%   avgCol  avgLv   vs mean');
for (const x of out) {
  const d = (x.win - mean) * 100;
  console.log(
    x.hero.padEnd(22),
    (100 * x.win).toFixed(0).padStart(5) + '%',
    x.col.toFixed(1).padStart(7),
    x.lvl.toFixed(1).padStart(6),
    ((d >= 0 ? '+' : '') + d.toFixed(1)).padStart(8));
}
