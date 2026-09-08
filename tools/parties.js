/* Deep Jungle — does a party built on purpose beat a party drawn out of a hat?
 *
 * sweep.js averages over random trios, which include compositions no player would ever
 * take: three glass casters, nobody who can heal, nobody who can hold a line. A person
 * picks deliberately, so the sweep's headline number answers a question nobody is asking.
 * This measures the same game across composition tiers so the two can be told apart.
 *
 * Usage:  node tools/parties.js [partiesPerTier] [runsPerParty]
 */
global.window = global;
const path = require('path');
const sim = require('./sim.js');
const DJ = global.DJ;

const N = parseInt(process.argv[2], 10) || 20;
const RUNS = parseInt(process.argv[3], 10) || 5;

// ---- classify the roster the way a player reads it ----
const heals = (h) => h.skills.some((id) => {
  const s = DJ.SKILLS[id];
  return s && (s.kind === 'heal' && s.target !== 'self') || (s && s.kind === 'revive');
});
const front = (h) => h.base.hp + h.grow.hp * 12 >= 150 && h.base.def >= 7;
const damage = (h) => {
  const atk = h.base.atk + h.grow.atk * 12, mag = h.base.mag + h.grow.mag * 12;
  return Math.max(atk, mag) >= 22;
};

const HEALERS = DJ.HEROES.filter(heals);
const FRONT = DJ.HEROES.filter(front);
const DAMAGE = DJ.HEROES.filter(damage);

function tierPools(tier) {
  // balanced: someone to hold the line, someone to mend it, someone to end the fight
  if (tier === 'balanced') return [FRONT, HEALERS, DAMAGE];
  // sustain: two of the three can heal, which is what a cautious player leans on
  if (tier === 'sustain') return [HEALERS, HEALERS, DAMAGE];
  // glass: all damage, no healing, no front line
  if (tier === 'glass') return [DAMAGE.filter((h) => !front(h) && !heals(h)),
                                DAMAGE.filter((h) => !front(h) && !heals(h)),
                                DAMAGE.filter((h) => !front(h) && !heals(h))];
  return [DJ.HEROES, DJ.HEROES, DJ.HEROES];
}

function draw(rng, pools) {
  const out = [];
  for (const pool of pools) {
    const usable = pool.filter((h) => !out.includes(h.id));
    if (!usable.length) return null;
    out.push(rng.pick(usable).id);
  }
  return out;
}

const TIERS = ['balanced', 'sustain', 'random', 'glass'];
console.log('\n=== ' + N + ' parties per tier x ' + RUNS + ' runs ===');
console.log('  ' + 'composition'.padEnd(12) + 'win%'.padEnd(8) + 'avg col'.padEnd(10) + 'level'.padEnd(8) + 'downed/run');

const results = {};
for (const tier of TIERS) {
  const rng = new DJ.RNG(9090);
  const pools = tierPools(tier);
  let wins = 0, tot = 0, cols = 0, lvl = 0, deaths = 0;
  for (let t = 0; t < N; t++) {
    const p = draw(rng, pools);
    if (!p) continue;
    for (let i = 0; i < RUNS; i++) {
      const r = sim.simRun(6100 + t * 71 + i * 11, p);
      tot++; cols += r.col; lvl += r.maxLevel; deaths += r.deaths;
      if (r.won) wins++;
    }
  }
  results[tier] = wins / Math.max(1, tot);
  console.log('  ' + tier.padEnd(12) +
    (100 * wins / Math.max(1, tot)).toFixed(1).padStart(5) + '%  ' +
    (cols / Math.max(1, tot)).toFixed(1).padStart(7) + '   ' +
    (lvl / Math.max(1, tot)).toFixed(1).padStart(5) + '   ' +
    (deaths / Math.max(1, tot)).toFixed(2).padStart(6));
}
console.log('');
console.log('  A player picks on purpose, so "balanced" is the number that describes them.');
console.log('  The gap to "random" is how much the sweep understates a real playthrough.');
console.log('  balanced minus random: ' +
  ((results.balanced - results.random) * 100).toFixed(1) + ' points');
console.log('');
