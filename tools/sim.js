/* Deep Jungle — headless balance simulator.
 * Runs full expeditions with an AI player and reports win rate, length, and difficulty spikes.
 * Usage: node tools/sim.js [runs] [--party a,b,c] [--verbose] [--seed N]
 */
global.window = global;
const path = require('path');
const load = (f) => require(path.resolve(__dirname, '..', f));
['js/core/util.js', 'js/data/skills.js', 'js/data/heroes.js', 'js/data/monsters.js', 'js/data/items.js',
 'js/data/events.js', 'js/data/achievements.js', 'js/engine/battle.js', 'js/engine/map.js', 'js/engine/run.js'].forEach(load);
const DJ = global.DJ;

// Timing model (seconds) for estimating real playtime.
const T = {
  heroTurn: 4.2,            // menu navigation + target select + attack animation
  enemyTurn: 2.5,           // enemy animation + damage numbers
  battleIntroOutro: 11,     // encounter intro, victory banner, XP/loot screen
  mapChoice: 5.5,           // looking at the map and picking a node
  nodeSimple: 9,            // treasure/rest/shrine/trap screens
  nodeInteractive: 20,      // events, puzzles, merchant browsing
  levelUp: 3.5,
  gearCheck: 14,            // occasional inventory management
};

function simRun(seed, partyIds, opt) {
  opt = opt || {};
  const run = new DJ.Run({ seed, partyIds });
  const rng = run.rng;
  let time = 0;
  let battleCount = 0, totalRounds = 0, deaths = 0, potionsUsed = 0;
  const battleLog = [];
  let guard = 0;

  while (!run.finished && guard++ < 200) {
    // choose next node
    const opts = run.available;
    if (!opts.length) break;
    time += T.mapChoice;
    // AI player preference: rest when hurt, else prefer value nodes
    const hpPct = run.party.reduce((a, h) => a + (h.alive ? h.hp / h.maxHp : 0), 0) / run.party.length;
    const scored = opts.map((id) => {
      const n = run.map.nodeById[id];
      let s = rng.range(0, 1);
      if (n.type === 'rest') s += hpPct < 0.6 ? 4 : 0.4;
      else if (n.type === 'treasure') s += 2.2;
      else if (n.type === 'shrine') s += 1.9;
      else if (n.type === 'training') s += 1.6;
      else if (n.type === 'merchant') s += run.gold > 90 ? 1.8 : 0.6;
      else if (n.type === 'elite') s += hpPct > 0.75 ? 1.2 : -2;
      else if (n.type === 'battle') s += 1.0;
      else if (n.type === 'trap') s -= 1.2;
      else if (n.type === 'mystery') s += 1.0;
      else if (n.type === 'puzzle') s += 1.3;
      else if (n.type === 'event') s += 1.2;
      return { id, s };
    }).sort((a, b) => b.s - a.s);
    run.moveTo(scored[0].id);
    const node = run.node();
    DJ.profile && 0;

    const res = resolveNode(run, node, rng);
    time += res.time;
    battleCount += res.battles;
    totalRounds += res.rounds;
    deaths += res.deaths;
    potionsUsed += res.potions;
    if (res.battleInfo) battleLog.push(res.battleInfo);
    if (res.wiped) { run.finished = true; run.won = false; break; }
    run.completeNode();
    if (run.finished) break;
  }
  const maxLevel = Math.max(...run.party.map((h) => h.level));
  return {
    won: run.won, seed, nodes: run.nodesVisited, time, battleCount, totalRounds, deaths, potionsUsed,
    maxLevel, gold: run.gold, party: partyIds, battleLog, col: run.node() ? run.node().col : 0,
    finalHp: run.party.map((h) => Math.round((h.hp / h.maxHp) * 100)),
  };
}

function resolveNode(run, node, rng) {
  const out = { time: 0, battles: 0, rounds: 0, deaths: 0, potions: 0, wiped: false, battleInfo: null };
  const t = node.type;
  if (t === 'battle' || t === 'elite' || t === 'boss' || t === 'heart') {
    const enemies = DJ.buildEncounter(rng, node);
    const r = simBattle(run, enemies, node, rng);
    out.time += T.battleIntroOutro + r.heroTurns * T.heroTurn + r.enemyTurns * T.enemyTurn + (r.levelUps * T.levelUp);
    out.battles = 1; out.rounds = r.rounds; out.deaths = r.deaths; out.potions = r.potions;
    out.wiped = r.wiped;
    out.battleInfo = { col: node.col, type: t, level: node.level, plevel: Math.max(...run.party.map(h=>h.level)), rounds: r.rounds, deaths: r.deaths,
      hpAfter: Math.round(r.hpPct * 100), enemies: enemies.map((e) => e.name), wiped: r.wiped };
    if (!r.wiped) run.postBattleRecovery();
    return out;
  }
  if (t === 'rest') {
    run.restHeal(1.0);
    if (node.finalCamp) run.finalCampSupplies();
    run.stats.rests++;
    out.time += T.nodeSimple;
    if (rng.chance(0.35)) out.time += T.gearCheck;
    return out;
  }
  if (t === 'treasure') {
    run.applyLoot(run.treasureLoot(node.level, 1));
    autoEquip(run);
    run.stats.treasures++;
    out.time += T.nodeSimple + T.gearCheck * 0.6;
    return out;
  }
  if (t === 'shrine') {
    const bl = rng.pick(DJ.BLESSINGS);
    if (!bl.cost || run.gold >= bl.cost) {
      if (bl.cost) run.gold -= bl.cost;
      const targets = bl.party ? run.party : [rng.pick(run.party)];
      for (const h of targets) { for (const k in bl.apply) h.bonus[k] = (h.bonus[k] || 0) + bl.apply[k]; DJ.recalcHero(h); }
    }
    run.stats.shrines++;
    out.time += T.nodeSimple + 4;
    return out;
  }
  if (t === 'training') {
    const h = rng.pick(run.party);
    DJ.grantXp(h, Math.round(20 + node.level * 9));
    run.stats.trainings++;
    out.time += T.nodeSimple + 4;
    return out;
  }
  if (t === 'trap') {
    for (const h of run.party) if (h.alive) h.hp = Math.max(1, h.hp - Math.round(h.maxHp * 0.14));
    if (rng.chance(0.4)) run.applyLoot({ gold: 20 + node.level * 4 });
    run.stats.traps++;
    out.time += T.nodeSimple;
    return out;
  }
  if (t === 'merchant') {
    const stock = run.merchantStock();
    // buy potions when affordable
    for (const p of ['red', 'red', 'green', 'yellow']) {
      const price = DJ.POTIONS[p].price;
      if (run.gold >= price + 40) { run.gold -= price; run.addPotion(p, 1); }
    }
    for (const item of stock.items) {
      const price = DJ.itemPrice(item);
      if (run.gold >= price && isUpgrade(run, item)) { run.gold -= price; run.addItem(item); autoEquip(run); }
    }
    run.stats.merchants++;
    out.time += T.nodeInteractive + T.gearCheck;
    return out;
  }
  if (t === 'event') {
    const ev = rng.pick(DJ.EVENTS);
    const opt = rng.pick(ev.options);
    const oc = rng.weighted(opt.outcomes.map((o) => ({ v: o, w: o.w })));
    for (const op of oc.ops) {
      if (op.heal) for (const h of run.party) if (h.alive) h.hp = Math.min(h.maxHp, h.hp + Math.round(h.maxHp * op.heal));
      if (op.mp) for (const h of run.party) if (h.alive) h.mp = Math.min(h.maxMp, h.mp + Math.round(h.maxMp * op.mp));
      if (op.damage) for (const h of run.party) if (h.alive) h.hp = Math.max(1, h.hp - Math.round(h.maxHp * op.damage));
      if (op.gold) run.gold = Math.max(0, run.gold + op.gold);
      if (op.potion) run.addPotion(op.potion === 'random' ? DJ.rollPotion(rng) : op.potion, 1);
      if (op.item != null) { run.addItem(DJ.rollItem(rng, node.level, op.item)); autoEquip(run); }
      if (op.xp) for (const h of run.party) DJ.grantXp(h, op.xp);
      if (op.stat) { const h = op.stat.who === 'all' ? null : rng.pick(run.party);
        const tg = h ? [h] : run.party;
        const st = op.stat.stat === 'random' ? rng.pick(['atk', 'mag', 'def', 'spd']) : op.stat.stat;
        for (const x of tg) { x.bonus[st] = (x.bonus[st] || 0) + op.stat.amount; DJ.recalcHero(x); } }
      if (op.battle) {
        const enemies = DJ.buildNormalGroup(rng, node.level, node.region, op.battle === 'normal' ? null : op.battle);
        const r = simBattle(run, enemies, node, rng);
        out.battles++; out.rounds += r.rounds; out.deaths += r.deaths; out.potions += r.potions;
        out.time += T.battleIntroOutro + r.heroTurns * T.heroTurn + r.enemyTurns * T.enemyTurn;
        if (r.wiped) { out.wiped = true; return out; }
        run.postBattleRecovery();
      }
    }
    run.stats.events++;
    out.time += T.nodeInteractive;
    return out;
  }
  if (t === 'puzzle') {
    // ~75% solve rate for an average player
    const solved = rng.chance(0.75);
    if (solved) { run.applyLoot(run.treasureLoot(node.level, 2)); autoEquip(run); run.stats.puzzles++; }
    else for (const h of run.party) if (h.alive) h.hp = Math.max(1, h.hp - Math.round(h.maxHp * 0.08));
    out.time += T.nodeInteractive + 10;
    return out;
  }
  if (t === 'mystery') {
    // resolves to a random other node type
    const inner = rng.pick(['battle', 'treasure', 'event', 'elite', 'shrine', 'rest']);
    const fake = Object.assign({}, node, { type: inner });
    const r = resolveNode(run, fake, rng);
    r.time += 4;
    return r;
  }
  if (t === 'start') { out.time += 3; return out; }
  out.time += T.nodeSimple;
  return out;
}

function isUpgrade(run, item) {
  for (const h of run.party) {
    const cur = h.equip[item.slot];
    if (!cur) return true;
    const score = (i) => (i.stats.atk || 0) * 2 + (i.stats.mag || 0) * 2 + (i.stats.def || 0) * 2 + (i.stats.hp || 0) * 0.25 + (i.stats.spd || 0) * 1.5 + (i.stats.mp || 0) * 0.2 + (i.passive ? 4 : 0);
    if (score(item) > score(cur) + 1) return true;
  }
  return false;
}

function autoEquip(run) {
  // give each stashed item to the hero who benefits most
  for (const item of run.stash.slice()) {
    let best = null, bestGain = 0;
    for (const h of run.party) {
      const cur = h.equip[item.slot];
      const w = weightsFor(h);
      const score = (i) => i ? ((i.stats.atk || 0) * w.atk + (i.stats.mag || 0) * w.mag + (i.stats.def || 0) * 2 + (i.stats.hp || 0) * 0.25 + (i.stats.spd || 0) * 1.5 + (i.stats.mp || 0) * 0.2 + (i.passive ? 4 : 0)) : 0;
      const gain = score(item) - score(cur);
      if (gain > bestGain) { bestGain = gain; best = h; }
    }
    if (best) run.equipItem(best, item);
  }
}
function weightsFor(h) {
  const b = DJ.HERO_BY_ID[h.id].base;
  return b.mag > b.atk ? { atk: 0.4, mag: 3 } : { atk: 3, mag: 0.4 };
}

function simBattle(run, enemies, node, rng) {
  const b = new DJ.Battle({ party: run.party, enemies, rng, level: node.level, kind: node.type });
  b.start();
  let guard = 0, heroTurns = 0, enemyTurns = 0;
  while (!b.over && guard++ < 600) {
    const step = b.next();
    for (const e of step.events) if (e.type === 'turnStart') { if (e.unit.side === 'hero') heroTurns++; else enemyTurns++; }
    if (step.needInput) {
      const action = b.heroAutoAction(step.needInput, run.inventory);
      b.act(step.needInput, action);
      b.checkEnd();
    }
  }
  const wiped = b.result === 'defeat';
  if (!wiped) {
    const rew = b.rewards();
    run.applyBattleRewards(rew);
    run.applyLoot(run.battleDrops(node));
    autoEquip(run);
  }
  const hpPct = run.party.reduce((a, h) => a + (h.alive ? h.hp / h.maxHp : 0), 0) / run.party.length;
  return { rounds: b.round, heroTurns, enemyTurns, deaths: b.stats.heroKOs, potions: b.stats.potions, wiped, hpPct, levelUps: 0 };
}

module.exports = { simRun };

// ---------------- CLI ----------------
// Only run the report when invoked directly (tools/sweep.js requires this file).
if (require.main !== module) return;
const args = process.argv.slice(2);
const N = parseInt(args[0], 10) || 30;
let party = ['elf_warrior', 'goblin_mage', 'kuata_lancer'];
const pi = args.indexOf('--party');
if (pi >= 0) party = args[pi + 1].split(',');
const verbose = args.includes('--verbose');
const si = args.indexOf('--seed');
const baseSeed = si >= 0 ? parseInt(args[si + 1], 10) : 1000;

const results = [];
for (let i = 0; i < N; i++) results.push(simRun(baseSeed + i * 7919, party));

const wins = results.filter((r) => r.won);
const avg = (arr, f) => arr.length ? arr.reduce((a, x) => a + f(x), 0) / arr.length : 0;
const med = (arr) => { const s = arr.slice().sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const fmtTime = (s) => `${Math.floor(s / 60)}m${String(Math.round(s % 60)).padStart(2, '0')}s`;

console.log(`\n=== Deep Jungle balance sim: ${N} runs, party [${party.join(', ')}] ===`);
console.log(`Win rate:        ${((wins.length / N) * 100).toFixed(1)}%  (${wins.length}/${N})`);
console.log(`Avg playtime:    ${fmtTime(avg(results, (r) => r.time))}   (winning runs: ${fmtTime(avg(wins, (r) => r.time))})`);
console.log(`Median time:     ${fmtTime(med(results.map((r) => r.time)))}`);
console.log(`Avg nodes:       ${avg(results, (r) => r.nodes).toFixed(1)}   battles: ${avg(results, (r) => r.battleCount).toFixed(1)}`);
console.log(`Avg rounds/fight:${(avg(results, (r) => r.totalRounds) / Math.max(1, avg(results, (r) => r.battleCount))).toFixed(2)}`);
console.log(`Avg final level: ${avg(results, (r) => r.maxLevel).toFixed(1)}   (wins: ${avg(wins, (r) => r.maxLevel).toFixed(1)})`);
console.log(`Avg hero KOs:    ${avg(results, (r) => r.deaths).toFixed(1)}   potions used: ${avg(results, (r) => r.potionsUsed).toFixed(1)}`);

// where do runs die?
const losses = results.filter((r) => !r.won);
if (losses.length) {
  const byCol = {};
  for (const l of losses) { const c = l.battleLog.length ? l.battleLog[l.battleLog.length - 1].col : l.col; byCol[c] = (byCol[c] || 0) + 1; }
  console.log(`\nLosses by column: ` + Object.entries(byCol).sort((a, b) => a[0] - b[0]).map(([c, n]) => `c${c}:${n}`).join(' '));
  const lastFights = losses.map((l) => l.battleLog[l.battleLog.length - 1]).filter(Boolean);
  const byType = {};
  for (const f of lastFights) byType[f.type] = (byType[f.type] || 0) + 1;
  console.log(`Losses by node type: ` + Object.entries(byType).map(([t, n]) => `${t}:${n}`).join(' '));
}

// difficulty curve: avg rounds and post-fight HP by column
const cols = {};
for (const r of results) for (const f of r.battleLog) {
  const c = cols[f.col] = cols[f.col] || { n: 0, rounds: 0, hp: 0, deaths: 0, nlvl:0, plvl:0, types: {} };
  c.n++; c.rounds += f.rounds; c.hp += f.hpAfter; c.deaths += f.deaths; c.nlvl += f.level; c.plvl += f.plevel; c.types[f.type] = (c.types[f.type] || 0) + 1;
}
console.log('\nDifficulty curve by map column:');
console.log('col |  n  | nodeLv | partyLv | rounds | HP% after | KOs');
for (const c of Object.keys(cols).map(Number).sort((a, b) => a - b)) {
  const x = cols[c];
  console.log(`${String(c).padStart(3)} | ${String(x.n).padStart(3)} |  ${(x.nlvl/x.n).toFixed(1).padStart(4)}  |  ${(x.plvl/x.n).toFixed(1).padStart(4)}   | ${(x.rounds / x.n).toFixed(2).padStart(5)}  |    ${(x.hp / x.n).toFixed(0).padStart(3)}%   | ${(x.deaths / x.n).toFixed(2)}`);
}

if (verbose) {
  console.log('\nSample run detail (first run):');
  for (const f of results[0].battleLog) console.log(`  c${f.col} ${f.type} lv${f.level} — ${f.rounds} rounds, HP after ${f.hpAfter}%, KOs ${f.deaths} — ${f.enemies.join(', ')}`);
}
console.log('');
