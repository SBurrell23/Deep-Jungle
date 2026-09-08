/* Deep Jungle — where the turns and the resources actually go.
 *
 * sim.js and sweep.js answer "did the run survive". This answers "what was the party
 * doing", which is the question you need when a simulated player loses two runs in three
 * and a person loses none: how many turns went on attacking rather than casting, how full
 * the mana bars were when a fight ended, how many potions were carried to the grave, and
 * what the party had left when it lost.
 *
 * It drives sim.js unchanged and watches from the outside by wrapping a few engine
 * methods, so the player being measured is exactly the one sweep.js reports on.
 *
 * Usage:  node tools/diag.js [parties] [runsPerParty]
 */
global.window = global;
const path = require('path');
const sim = require('./sim.js');
const DJ = global.DJ;

const PARTIES = parseInt(process.argv[2], 10) || 40;
const RUNS = parseInt(process.argv[3], 10) || 4;

const A = {
  runs: 0, wins: 0,
  turns: 0, attacks: 0, skills: 0, guards: 0, items: 0,
  cheapCasts: 0, dearCasts: 0,          // expensive = over a fifth of the caster's own bar
  costSum: 0, costN: 0,                 // cast cost as a share of the caster's max MP
  mpEndSum: 0, mpEndN: 0,
  mpFloorSum: 0, mpFloorN: 0,
  hpEndSum: 0, hpEndN: 0,
  battles: 0, rounds: 0,
  windups: 0, windupHits: 0, thorns: 0, heroKOs: 0,
  potionsUsed: 0, potionsHeld: 0, goldLeft: 0,
  lossN: 0, lossCol: 0, lossPotions: 0, lossGold: 0, lossLevel: 0,
  winLevel: 0, winN: 0,
  hits: 0, hitFrac: 0, hitOver25: 0, hitOver40: 0, hitOver60: 0,
  deathFromSum: 0, deathFromN: 0, deathOneShot: 0,
};

// ---- watch the engine without changing it ----
let liveRun = null;
const floors = new Map();

const RunCtor = DJ.Run;
DJ.Run = function (o) { const r = new RunCtor(o); liveRun = r; return r; };
DJ.Run.prototype = RunCtor.prototype;

const P = DJ.Battle.prototype;

const realHeroAuto = P.heroAutoAction;
P.heroAutoAction = function (u, inv) {
  const action = realHeroAuto.call(this, u, inv);
  A.turns++;
  if (action.type === 'attack') A.attacks++;
  else if (action.type === 'defend') A.guards++;
  else if (action.type === 'item') A.items++;
  else if (action.type === 'skill') {
    A.skills++;
    const sk = DJ.SKILLS[action.skillId];
    const cost = (sk && sk.mp) || 0;
    if (u.maxMp) {
      A.costSum += cost / u.maxMp; A.costN++;
      if (cost > u.maxMp * 0.2) A.dearCasts++; else A.cheapCasts++;
    }
  }
  for (const h of this.party) {
    if (!h.maxMp) continue;
    const f = h.mp / h.maxMp;
    floors.set(h, Math.min(floors.has(h) ? floors.get(h) : 1, f));
  }
  return action;
};

// What the party's health looked like an instant ago, so a fatal blow can be measured
// against the health it actually had rather than the zero it left behind.
const lastHp = new Map();

const scan = (events) => {
  for (const e of events || []) {
    if (e.type === 'hit' && e.target && e.target.side === 'hero' && e.dmg > 0) {
      const frac = e.dmg / e.target.maxHp;
      A.hits++; A.hitFrac += frac;
      if (frac > 0.25) A.hitOver25++;
      if (frac > 0.40) A.hitOver40++;
      if (frac > 0.60) A.hitOver60++;
      const before = (lastHp.get(e.target) || 0) + e.dmg;
      if (e.target.hp <= 0) {
        A.deathFromSum += before / e.target.maxHp; A.deathFromN++;
        // Killed from a share of health a heal-at-45% rule could never have rescued.
        if (before / e.target.maxHp > 0.45) A.deathOneShot++;
      }
    }
    if (e.target && e.target.side === 'hero') lastHp.set(e.target, e.target.hp);
    if (e.unit && e.unit.side === 'hero') lastHp.set(e.unit, e.unit.hp);
    if (e.type === 'status' && e.status === 'charge' && e.applied) A.windups++;
    if (e.thorns) A.thorns++;
    if (e.type === 'death' && e.unit && e.unit.side === 'hero') A.heroKOs++;
    // A released wind-up is the stored skill arriving; count the ones that land.
    if (e.type === 'action' && e.skill && e.skill.telegraphed && e.unit && e.unit.side === 'enemy') A.windupHits++;
  }
};
const realNext = P.next;
P.next = function () { const s = realNext.call(this); scan(s.events); return s; };
const realAct = P.act;
P.act = function (u, action, isAi) { const ev = realAct.call(this, u, action, isAi); scan(ev); return ev; };

const realRecovery = RunCtor.prototype.postBattleRecovery;
RunCtor.prototype.postBattleRecovery = function () {
  A.battles++;
  for (const h of this.party) {
    if (h.maxMp) { A.mpEndSum += h.mp / h.maxMp; A.mpEndN++; }
    A.hpEndSum += h.alive ? h.hp / h.maxHp : 0; A.hpEndN++;
  }
  for (const [h, f] of floors) { A.mpFloorSum += f; A.mpFloorN++; }
  floors.clear();
  return realRecovery.call(this);
};

// ---- run ----
const ids = DJ.HEROES.map((h) => h.id);
const prng = new DJ.RNG(31337);
for (let t = 0; t < PARTIES; t++) {
  const party = prng.shuffle(ids.slice()).slice(0, 3);
  for (let i = 0; i < RUNS; i++) {
    floors.clear();
    const r = sim.simRun(2200 + t * 89 + i * 7, party);
    A.runs++;
    A.rounds += r.totalRounds;
    A.potionsUsed += r.potionsUsed || 0;
    const held = liveRun ? Object.values(liveRun.inventory).reduce((a, n) => a + n, 0) : 0;
    A.potionsHeld += held;
    A.goldLeft += r.gold || 0;
    if (r.won) { A.wins++; A.winLevel += r.maxLevel; A.winN++; }
    else {
      A.lossN++;
      A.lossCol += r.col || 0;
      A.lossPotions += held;
      A.lossGold += r.gold || 0;
      A.lossLevel += r.maxLevel || 0;
    }
  }
}

const pct = (x) => (100 * x).toFixed(1) + '%';
const per = (x, n) => (x / Math.max(1, n)).toFixed(2);
const line = (label, value) => console.log('  ' + label.padEnd(32) + value);

console.log('\n=== ' + A.runs + ' runs, ' + A.battles + ' battles, ' + A.turns + ' hero turns ===');
line('Win rate', pct(A.wins / A.runs));

console.log('\nWhat a hero turn was spent on');
line('Attack (free)', pct(A.attacks / A.turns));
line('Ability', pct(A.skills / A.turns));
line('  of those, expensive', pct(A.dearCasts / Math.max(1, A.dearCasts + A.cheapCasts)));
line('  average cost, share of bar', pct(A.costSum / Math.max(1, A.costN)));
line('Guard', pct(A.guards / A.turns));
line('Potion', pct(A.items / A.turns));

console.log('\nResources');
line('Mana left when a fight ends', pct(A.mpEndSum / A.mpEndN));
line('Lowest mana during a fight', pct(A.mpFloorSum / Math.max(1, A.mpFloorN)));
line('Health left when a fight ends', pct(A.hpEndSum / A.hpEndN));
line('Potions drunk per run', per(A.potionsUsed, A.runs));
line('Potions still held at the end', per(A.potionsHeld, A.runs));
line('Gold unspent at the end', per(A.goldLeft, A.runs));

console.log('\nThe things meant to force a decision');
line('Wind-ups started per run', per(A.windups, A.runs));
line('Wind-ups that landed per run', per(A.windupHits, A.runs));
line('Reflected hits per run', per(A.thorns, A.runs));
line('Adventurers downed per run', per(A.heroKOs, A.runs));
line('Rounds per battle', per(A.rounds, A.battles));

console.log('\nHow hard the party gets hit (share of the target\'s max health)');
line('Average landed hit', pct(A.hitFrac / Math.max(1, A.hits)));
line('Hits over a quarter of health', pct(A.hitOver25 / Math.max(1, A.hits)));
line('Hits over two fifths', pct(A.hitOver40 / Math.max(1, A.hits)));
line('Hits over three fifths', pct(A.hitOver60 / Math.max(1, A.hits)));
line('Health held on the fatal blow', pct(A.deathFromSum / Math.max(1, A.deathFromN)));
line('Deaths from above the heal line', pct(A.deathOneShot / Math.max(1, A.deathFromN)));

if (A.lossN) {
  console.log('\nThe ' + A.lossN + ' runs that ended badly');
  line('Average column reached', per(A.lossCol, A.lossN));
  line('Party level when it ended', per(A.lossLevel, A.lossN));
  line('Potions still in the bag', per(A.lossPotions, A.lossN));
  line('Gold still unspent', per(A.lossGold, A.lossN));
}
if (A.winN) line('Party level on a win', per(A.winLevel, A.winN));
console.log('');
