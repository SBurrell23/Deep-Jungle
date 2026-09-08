/* Deep Jungle — does a party need a healer?
 *
 * Classifies every adventurer by the sustain they actually bring, judged from their kit
 * rather than their job title, then runs many random parties and splits the results by
 * that classification. Two cuts are reported:
 *
 *   1. win rate against the number of healers in the party
 *   2. among healerless parties, whether carrying a substitute (a drain, a self-heal or
 *      a revive) makes up the difference
 *
 * Run this after changing any heal power or cost, which is the thing it is most
 * sensitive to. Compare the gap between the buckets, not the absolute numbers: the
 * party sample differs from sweep.js, so the overall rate will not match it.
 *
 * Usage:  node tools/sustain.js [parties] [runsPerParty]
 *   parties        random compositions to draw, default 300
 *   runsPerParty   expeditions each, default 4
 */
const path = require('path');
const { simRun } = require(path.resolve(__dirname, 'sim.js'));
const DJ = global.DJ;

const PARTIES = parseInt(process.argv[2], 10) || 300;
const RUNS = parseInt(process.argv[3], 10) || 4;

// What a hero brings, read off their skills.
function kitOf(h) {
  const k = { partyHeal: 0, allyHeal: 0, selfHeal: 0, revive: 0, drain: 0, aoe: 0 };
  for (const sid of h.skills) {
    const sk = DJ.SKILLS[sid];
    if (!sk) continue;
    if (sk.kind === 'heal') {
      if (sk.target === 'allies') k.partyHeal++;
      else if (sk.target === 'ally') k.allyHeal++;
      else if (sk.target === 'self') k.selfHeal++;
    }
    if (sk.kind === 'revive') k.revive++;
    if (sk.kind === 'drain') k.drain++;
    if (sk.target === 'enemies' && (sk.kind === 'phys' || sk.kind === 'mag')) k.aoe++;
  }
  return k;
}
const KIT = {};
for (const h of DJ.HEROES) KIT[h.id] = kitOf(h);

// A healer is someone who can put health back on somebody else.
const isHealer = (id) => KIT[id].partyHeal > 0 || KIT[id].allyHeal > 0;
// A substitute is any other way to undo damage: drain, a self-heal, or a revive.
const hasSub = (id) => KIT[id].drain > 0 || KIT[id].selfHeal > 0 || KIT[id].revive > 0;

console.log('=== What each adventurer brings ===');
const label = (id) => KIT[id].partyHeal ? 'party healer' : KIT[id].allyHeal ? 'single-target healer'
  : KIT[id].revive ? 'reviver only' : KIT[id].selfHeal ? 'self-sustain' : KIT[id].drain ? 'drain only' : 'none';
const groups = {};
for (const h of DJ.HEROES) (groups[label(h.id)] = groups[label(h.id)] || []).push(h.id);
for (const k of ['party healer', 'single-target healer', 'reviver only', 'self-sustain', 'drain only', 'none']) {
  if (groups[k]) console.log('  ' + k.padEnd(21) + '(' + groups[k].length + ')  ' + groups[k].join(', '));
}

const ids = DJ.HEROES.map((h) => h.id);
const rng = new DJ.RNG(4242);
const byHealers = {};
const bySubstitute = {};
const healerless = [];

for (let t = 0; t < PARTIES; t++) {
  const p = rng.shuffle(ids.slice()).slice(0, 3);
  const n = p.filter(isHealer).length;
  const b = (byHealers[n] = byHealers[n] || { runs: 0, wins: 0, pots: 0, kos: 0 });
  let w = 0;
  const sub = p.some(hasSub);
  const aoe = p.reduce((a, id) => a + KIT[id].aoe, 0);
  const key = n ? null : (sub ? 'carries a substitute' : 'no sustain at all') +
    (aoe >= 3 ? ', heavy area damage' : ', light area damage');
  const c = key ? (bySubstitute[key] = bySubstitute[key] || { runs: 0, wins: 0, kos: 0 }) : null;

  for (let i = 0; i < RUNS; i++) {
    const r = simRun(88000 + t * 211 + i * 37, p);
    b.runs++; b.pots += r.potionsUsed; b.kos += r.deaths;
    if (c) { c.runs++; c.kos += r.deaths; }
    if (r.won) { b.wins++; w++; if (c) c.wins++; }
  }
  if (!n) healerless.push({ p: p.join(' + '), w: w / RUNS, sub });
}

console.log('\n=== Win rate by how many healers the party brought ===');
console.log('healers  runs   win%   potions drunk   heroes downed');
for (const k of Object.keys(byHealers).sort()) {
  const b = byHealers[k];
  if (b.runs < RUNS * 3) continue;
  console.log('   ' + k + '    ' + String(b.runs).padStart(5) + '  ' +
    (100 * b.wins / b.runs).toFixed(1).padStart(5) + '%   ' +
    (b.pots / b.runs).toFixed(1).padStart(11) + '   ' + (b.kos / b.runs).toFixed(1).padStart(11));
}

console.log('\n=== Healerless parties, by what they carry instead ===');
console.log('group                                       runs   win%   heroes downed');
for (const k of Object.keys(bySubstitute).sort()) {
  const c = bySubstitute[k];
  if (c.runs < 20) continue;
  console.log(k.padEnd(43) + String(c.runs).padStart(5) + '  ' +
    (100 * c.wins / c.runs).toFixed(1).padStart(5) + '%   ' + (c.kos / c.runs).toFixed(1).padStart(11));
}

healerless.sort((a, b) => b.w - a.w);
const anyWin = healerless.filter((x) => x.w > 0).length;
console.log('\n' + healerless.length + ' healerless compositions tested, ' + anyWin +
  ' won at least one run (' + Math.round(100 * anyWin / Math.max(1, healerless.length)) + '%)');
console.log('  strongest:');
healerless.slice(0, 5).forEach((x) => console.log('   ' + String(Math.round(x.w * 100)).padStart(4) + '%  ' + x.p));
console.log('  weakest:');
healerless.slice(-5).forEach((x) => console.log('   ' + String(Math.round(x.w * 100)).padStart(4) + '%  ' + x.p));
