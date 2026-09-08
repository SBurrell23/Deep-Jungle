/* Deep Jungle — how deep does The Beyond go?
 *
 * Plays complete expeditions, and every party that beats the Heart carries straight on
 * into the endless region. Reports the distribution of depths reached, which is the only
 * number that matters down there: the party is frozen at level 20, so the whole design
 * is the curve of monster levels against a party that cannot answer it.
 *
 * Targets: most deep runs should end before depth 13 (monster level 33), and very few
 * should see depth 20 (level 40).
 *
 * Usage:  node tools/beyond.js [parties] [runsPerParty]
 */
const path = require('path');
const { simRun } = require(path.resolve(__dirname, 'sim.js'));
const DJ = global.DJ;

const PARTIES = parseInt(process.argv[2], 10) || 60;
const RUNS = parseInt(process.argv[3], 10) || 4;
const ids = DJ.HEROES.map((h) => h.id);
const rng = new DJ.RNG(1234);

const depths = [];
let heartWins = 0, total = 0;
for (let t = 0; t < PARTIES; t++) {
  const p = rng.shuffle(ids.slice()).slice(0, 3);
  for (let i = 0; i < RUNS; i++) {
    const r = simRun(7000 + t * 131 + i * 17, p, { endless: true });
    total++;
    if (r.heartBeaten) { heartWins++; depths.push(r.depth || 0); }
  }
}

depths.sort((a, b) => a - b);
const pct = (q) => depths.length ? depths[Math.min(depths.length - 1, Math.floor(q * depths.length))] : 0;
const mean = depths.reduce((a, x) => a + x, 0) / Math.max(1, depths.length);

console.log('\n=== The Beyond, over ' + total + ' expeditions ===');
console.log('reached the Heart:   ' + heartWins + ' (' + (100 * heartWins / total).toFixed(1) + '%)');
if (!depths.length) { console.log('nobody got that far.'); return; }
console.log('mean depth:          ' + mean.toFixed(1) + '   (monster level ' + Math.round(20 + mean) + ')');
console.log('median / 75th / 90th / deepest: ' + pct(0.5) + ' / ' + pct(0.75) + ' / ' + pct(0.9) + ' / ' + depths[depths.length - 1]);

const buckets = [[0, 4], [5, 9], [10, 12], [13, 16], [17, 19], [20, 24], [25, 30]];
console.log('\ndepth      runs   share   monster level');
for (const [lo, hi] of buckets) {
  const n = depths.filter((d) => d >= lo && d <= hi).length;
  if (!n) continue;
  console.log((lo + '-' + hi).padEnd(10) + String(n).padStart(5) + '  ' +
    (100 * n / depths.length).toFixed(1).padStart(5) + '%   ' + (20 + lo) + '-' + (20 + hi));
}
const past13 = depths.filter((d) => d >= 13).length;
const past20 = depths.filter((d) => d >= 20).length;
console.log('\nreached depth 13 or more: ' + (100 * past13 / depths.length).toFixed(1) + '%   (want a minority)');
console.log('reached depth 20 or more: ' + (100 * past20 / depths.length).toFixed(1) + '%   (want almost none)');
