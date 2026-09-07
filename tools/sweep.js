/* Sweep many random party compositions to check overall balance. */
global.window = global;
const path = require('path');
['js/core/util.js','js/data/skills.js','js/data/heroes.js','js/data/monsters.js','js/data/items.js',
 'js/data/events.js','js/data/achievements.js','js/engine/battle.js','js/engine/map.js','js/engine/run.js']
  .forEach((f) => require(path.resolve(__dirname, '..', f)));
const sim = require('./sim.js');
const DJ = global.DJ;
const PARTIES = parseInt(process.argv[2], 10) || 40;
const RUNS = parseInt(process.argv[3], 10) || 5;
const ids = DJ.HEROES.map((h) => h.id);
const rng = new DJ.RNG(1234);
let wins = 0, tot = 0, time = 0, winTime = 0, nodes = 0, rounds = 0, battles = 0;
const perParty = [];
for (let t = 0; t < PARTIES; t++) {
  const p = rng.shuffle(ids).slice(0, 3);
  let w = 0, tt = 0, wt = 0;
  for (let i = 0; i < RUNS; i++) {
    const r = sim.simRun(7000 + t * 131 + i * 17, p);
    tot++; tt += r.time; nodes += r.nodes; rounds += r.totalRounds; battles += r.battleCount;
    if (r.won) { wins++; w++; wt += r.time; }
  }
  time += tt; winTime += wt;
  perParty.push({ p: p.join(' + '), w: w / RUNS, t: tt / RUNS });
}
const m = (s) => `${Math.floor(s / 60)}m${String(Math.round(s % 60)).padStart(2, '0')}s`;
console.log(`\n=== Sweep: ${PARTIES} random parties x ${RUNS} runs = ${tot} runs ===`);
console.log(`Overall win rate:      ${(wins / tot * 100).toFixed(1)}%`);
console.log(`Avg playtime:          ${m(time / tot)}`);
console.log(`Avg winning-run time:  ${m(winTime / Math.max(1, wins))}`);
console.log(`Avg nodes / battles:   ${(nodes / tot).toFixed(1)} / ${(battles / tot).toFixed(1)}`);
console.log(`Avg rounds per battle: ${(rounds / Math.max(1, battles)).toFixed(2)}`);
perParty.sort((a, b) => a.w - b.w);
console.log('\nHardest 6 parties:');
perParty.slice(0, 6).forEach((x) => console.log(`  ${String(Math.round(x.w * 100)).padStart(3)}%  ${m(x.t)}  ${x.p}`));
console.log('Easiest 6 parties:');
perParty.slice(-6).reverse().forEach((x) => console.log(`  ${String(Math.round(x.w * 100)).padStart(3)}%  ${m(x.t)}  ${x.p}`));
console.log('');
