/* Deep Jungle — turn-based battle engine (DOM-free).
 * Usage:
 *   const b = new DJ.Battle({ party, enemies, rng, level, kind });
 *   let ev = b.start();                 // events to animate
 *   loop: const step = b.next();        // {events, needInput: unit|null, over: bool}
 *         if (step.needInput) { const evs = b.act(unit, action); ... }
 * Units are created by DJ.makeHeroUnit / DJ.makeEnemyUnit (in run.js / this file).
 */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});

  const STATUS_MULT = {
    rage: { atk: 1.4 }, weak: { atk: 0.7, mag: 0.7 }, guard: { def: 1.5 }, haste: { spd: 1.5 }, slow: { spd: 0.65 },
  };

  // ---- Stat helpers ----
  DJ.hasStatus = (u, id) => u.statuses.some((s) => s.id === id);
  DJ.getStatus = (u, id) => u.statuses.find((s) => s.id === id);
  DJ.effStat = function (u, stat) {
    let v = u.base[stat] || 0;
    if (u.equip) for (const slot in u.equip) { const it = u.equip[slot]; if (it && it.stats && it.stats[stat]) v += it.stats[stat]; }
    for (const s of u.statuses) { const m = STATUS_MULT[s.id]; if (m && m[stat]) v *= m[stat]; }
    return Math.max(1, Math.round(v));
  };
  DJ.hasPassive = (u, p) => !!(u.passives && u.passives.includes(p));

  // ---- Global balance tuning (see tools/sim.js) ----
  DJ.TUNE = {
    // Nudged up together with the adventurer balance pass, which lifted the whole roster
    // and made the game about six points easier. A little more of both keeps fights the
    // same length rather than only making them longer.
    hpMult:  { normal: 1.90, elite: 1.75, boss: 1.19, final: 1.03 },
    dmgMult: { normal: 0.85, elite: 0.86, boss: 0.76, final: 0.74 },
    levelScale: 0.10,   // stat growth per level above the monster's tier base
    // Damage from everything in a region, by region index. Hero HP climbs much faster
    // than a tier-1 monster's attack does, so the opening region needs a thumb on the
    // scale to stay a fight rather than a formality.
    regionDmg: [1.14, 1.0, 1.0],
  };

  // How much harder than its own level a monster in The Beyond fights. The level itself
  // already does most of the work through levelScale; this is the extra squeeze that
  // stops a level-20 party from simply out-gearing an endless run. Tuned so a strong
  // party stalls somewhere past depth ten and almost nothing survives depth twenty.
  DJ.deepScale = function (level) {
    const past = Math.max(0, level - DJ.MAX_LEVEL);
    if (!past) return null;
    return { hp: 1 + past * 0.068, dmg: 1 + past * 0.044 };
  };

  // Applies the region's damage factor to a freshly built encounter.
  DJ.scaleEncounter = function (units, region) {
    const k = (DJ.TUNE.regionDmg || [])[region];
    if (!k || k === 1) return units;
    for (const u of units) {
      u.base.atk = Math.round(u.base.atk * k);
      u.base.mag = Math.round(u.base.mag * k);
    }
    return units;
  };

  // ---- Enemy unit factory ----
  DJ.makeEnemyUnit = function (mon, level, rng, extra) {
    const base = DJ.TIER_BASE_LEVEL[mon.tier];
    const f = Math.max(0.6, 1 + DJ.TUNE.levelScale * (level - base));
    const hm = DJ.TUNE.hpMult[mon.kind] || 1;
    const dm = DJ.TUNE.dmgMult[mon.kind] || 1;
    const u = {
      uid: DJ.uid('e'), side: 'enemy', id: mon.id, name: mon.name, sprite: mon.id, level,
      kind: mon.kind, tier: mon.tier, tags: mon.tags,
      maxHp: Math.round(mon.hp * f * hm), hp: 0, maxMp: 0, mp: 0,
      base: { atk: Math.round(mon.atk * f * dm), mag: Math.round(mon.mag * f * dm), def: Math.round(mon.def * f), spd: Math.round(mon.spd * (1 + 0.03 * (level - base))) },
      statuses: [], skills: mon.skills.slice(), passives: [], alive: true, size: mon.kind === 'final' ? 64 : mon.kind === 'boss' ? 48 : mon.kind === 'elite' ? 40 : 32,
      summoned: !!(extra && extra.summoned), phase: 0,
    };
    u.hp = u.maxHp;
    return u;
  };

  // ---- Battle ----
  function Battle(o) {
    this.party = o.party;        // hero units (alive or not)
    this.enemies = o.enemies;
    this.rng = o.rng || DJ.rng;
    this.level = o.level || 1;
    this.kind = o.kind || 'normal';
    this.round = 0;
    this.queue = [];
    this.current = null;
    this.over = false;
    this.result = null;
    this.stats = { damageTaken: 0, damageDealt: 0, crits: 0, maxHit: 0, kills: [], heroKOs: 0, statuses: 0, healing: 0, killsBy: {}, summonKills: 0, skillsUsed: 0, defends: 0, revives: 0, potions: 0 };
    this.log = [];
  }
  DJ.Battle = Battle;
  const P = Battle.prototype;

  P.allUnits = function () { return this.party.concat(this.enemies); };
  P.alive = function (side) { return (side === 'hero' ? this.party : this.enemies).filter((u) => u.alive); };
  P.foes = function (u) { return this.alive(u.side === 'hero' ? 'enemy' : 'hero'); };
  P.friends = function (u) { return this.alive(u.side); };

  P.start = function () {
    const ev = [{ type: 'start', kind: this.kind }];
    for (const e of this.enemies) ev.push({ type: 'log', text: `${e.name} appears!` });
    return ev;
  };

  P.newRound = function () {
    this.round++;
    const units = this.alive('hero').concat(this.alive('enemy'));
    const rng = this.rng;
    this.queue = units
      .map((u) => ({ u, k: DJ.effStat(u, 'spd') * rng.range(0.85, 1.15) }))
      .sort((a, b) => b.k - a.k)
      .map((x) => x.u);
    // Round-based passive regen/mpregen for heroes
    const ev = [{ type: 'roundStart', round: this.round }];
    for (const u of this.alive('hero')) {
      if (DJ.hasPassive(u, 'regen') && u.hp < u.maxHp) { const h = Math.max(1, Math.round(u.maxHp * 0.05)); u.hp = Math.min(u.maxHp, u.hp + h); ev.push({ type: 'heal', target: u, amount: h, fx: null, quiet: true }); }
      if (DJ.hasPassive(u, 'mpregen') && u.mp < u.maxMp) { const m = Math.max(1, Math.round(u.maxMp * 0.08)); u.mp = Math.min(u.maxMp, u.mp + m); ev.push({ type: 'mp', unit: u, amount: m, quiet: true }); }
    }
    return ev;
  };

  // Advance: returns { events, needInput (unit or null), over }
  P.next = function () {
    let events = [];
    if (this.over) return { events, needInput: null, over: true };
    while (true) {
      if (this.queue.length === 0) { events = events.concat(this.newRound()); }
      const u = this.queue.shift();
      this.current = u;
      if (!u || !u.alive) continue;
      // turn start: status ticks
      const tick = this.tickStatuses(u);
      events = events.concat(tick);
      const end = this.checkEnd();
      if (end) { events = events.concat(end); return { events, needInput: null, over: true }; }
      if (!u.alive) continue;
      if (DJ.hasStatus(u, 'stun')) {
        events.push({ type: 'skipStun', unit: u });
        events = events.concat(this.endTurn(u));
        continue;
      }
      if (u.side === 'hero') { events.push({ type: 'turnStart', unit: u }); return { events, needInput: u, over: false }; }
      // enemy AI
      events.push({ type: 'turnStart', unit: u });
      const action = this.aiAction(u);
      events = events.concat(this.act(u, action, true));
      const end2 = this.checkEnd();
      if (end2) { events = events.concat(end2); return { events, needInput: null, over: true }; }
      // continue loop to next actor; but yield after each enemy action so UI can animate in chunks
      return { events, needInput: null, over: false };
    }
  };

  // The next few actors, for the turn-order display. The first entry is whoever is
  // acting now. Once the current round's queue runs out we project the next round from
  // speed alone, which is what the real ordering is drawn from.
  P.upcomingOrder = function (limit) {
    limit = limit || 8;
    const out = [];
    if (this.current && this.current.alive) out.push({ unit: this.current, current: true, newRound: false });
    for (const u of this.queue) {
      if (out.length >= limit) return out;
      if (u.alive) out.push({ unit: u, current: false, newRound: false });
    }
    if (out.length >= limit) return out;
    const next = this.alive('hero').concat(this.alive('enemy'))
      .map((u) => ({ u, k: DJ.effStat(u, 'spd') }))
      .sort((a, b) => b.k - a.k)
      .map((x) => x.u);
    let first = true;
    for (const u of next) {
      if (out.length >= limit) break;
      out.push({ unit: u, current: false, newRound: first });
      first = false;
    }
    return out;
  };

  P.tickStatuses = function (u) {
    const ev = [];
    const isBoss = u.kind === 'boss' || u.kind === 'final';
    for (const s of u.statuses.slice()) {
      let dmg = 0, heal = 0;
      if (s.id === 'poison') dmg = Math.max(3, Math.round(u.maxHp * 0.07));
      else if (s.id === 'burn') dmg = Math.max(3, Math.round(u.maxHp * 0.055) + 2);
      else if (s.id === 'bleed') dmg = Math.max(3, Math.round(u.maxHp * 0.045) + 3);
      else if (s.id === 'regen') heal = Math.max(2, Math.round(u.maxHp * 0.08));
      if (dmg) {
        if (isBoss) dmg = Math.round(dmg * 0.4);
        if (u.side === 'enemy') dmg = Math.min(dmg, Math.round(u.maxHp * 0.12));
        u.hp = Math.max(0, u.hp - dmg);
        ev.push({ type: 'statusTick', unit: u, status: s.id, dmg });
        if (u.side === 'hero') this.stats.damageTaken += dmg; else this.stats.damageDealt += dmg;
        if (u.hp <= 0) { ev.push(...this.kill(u, s.id)); }
      } else if (heal && u.hp < u.maxHp) {
        heal = Math.min(heal, u.maxHp - u.hp); u.hp += heal;
        ev.push({ type: 'statusTick', unit: u, status: s.id, heal });
        if (u.side === 'hero') this.stats.healing += heal;
      }
    }
    return ev;
  };

  P.endTurn = function (u) {
    const ev = [];
    for (const s of u.statuses.slice()) {
      s.turns--;
      if (s.turns <= 0) { u.statuses = u.statuses.filter((x) => x !== s); ev.push({ type: 'statusEnd', unit: u, status: s.id }); }
    }
    return ev;
  };

  P.kill = function (u, cause) {
    const ev = [];
    u.alive = false; u.hp = 0; u.statuses = [];
    ev.push({ type: 'death', unit: u, cause });
    if (u.side === 'enemy') {
      this.stats.kills.push({ id: u.id, cause, summoned: u.summoned, kind: u.kind, tags: u.tags, tier: u.tier });
      if (u.summoned) this.stats.summonKills++;
    } else { this.stats.heroKOs++; }
    return ev;
  };

  P.checkEnd = function () {
    if (this.over) return null;
    if (this.alive('enemy').length === 0) {
      this.over = true; this.result = 'victory';
      return [{ type: 'victory' }];
    }
    if (this.alive('hero').length === 0) {
      this.over = true; this.result = 'defeat';
      return [{ type: 'defeat' }];
    }
    return null;
  };

  // ---- Damage ----
  P.critChance = function (src, tgt, skill) {
    let c = 0.05 + Math.max(0, DJ.effStat(src, 'spd') - DJ.effStat(tgt, 'spd')) * 0.005;
    if (skill && skill.crit) c += skill.crit;
    if (DJ.hasPassive(src, 'crit')) c += 0.10;
    return Math.min(0.75, c);
  };
  P.computeDamage = function (src, tgt, skill, kind) {
    const power = skill ? (skill.power || 1) : 1;
    let base;
    if (kind === 'mag' || kind === 'drain' && src.base.mag > src.base.atk) {
      base = DJ.effStat(src, 'mag') * power;
      const def = DJ.effStat(tgt, 'def') * 0.6;
      base = base * 40 / (40 + def);
    } else {
      base = DJ.effStat(src, 'atk') * power;
      const def = DJ.effStat(tgt, 'def');
      base = base * 40 / (40 + def);
    }
    base *= this.rng.range(0.9, 1.1);
    // level pressure: heroes vs. higher-level enemies take a bit more
    let crit = false;
    if (this.rng.chance(this.critChance(src, tgt, skill))) { crit = true; base *= 1.75; }
    const sh = DJ.getStatus(tgt, 'shield');
    let absorbed = 0;
    if (sh) { absorbed = Math.round(base * (sh.val || 0.3)); base -= absorbed; }
    return { dmg: Math.max(1, Math.round(base)), crit, absorbed };
  };

  P.applyStatus = function (src, tgt, st, ev) {
    if (!tgt.alive) return;
    let chance = st.chance == null ? 1 : st.chance;
    const def = DJ.STATUS[st.id];
    if (def && def.bad) {
      if (tgt.kind === 'boss' || tgt.kind === 'final') chance *= st.id === 'stun' ? 0.3 : 0.6;
      else if (tgt.kind === 'elite') chance *= st.id === 'stun' ? 0.6 : 0.85;
      if (DJ.hasPassive(tgt, 'resist')) chance *= 0.5;
    }
    if (!this.rng.chance(chance)) { if (def && def.bad) ev.push({ type: 'status', target: tgt, status: st.id, applied: false }); return; }
    let turns = st.turns || 2;
    if (def && def.bad && (tgt.kind === 'boss' || tgt.kind === 'final') && st.id === 'stun') turns = 1;
    const ex = DJ.getStatus(tgt, st.id);
    if (ex) { ex.turns = Math.max(ex.turns, turns); if (st.val) ex.val = Math.max(ex.val || 0, st.val); }
    else tgt.statuses.push({ id: st.id, turns, val: st.val });
    if (def && def.bad && src.side === 'hero') this.stats.statuses++;
    ev.push({ type: 'status', target: tgt, status: st.id, applied: true, turns });
  };

  P.dealDamage = function (src, tgt, skill, kind, ev) {
    // miss check (blind)
    if (DJ.hasStatus(src, 'blind') && this.rng.chance(0.4)) { ev.push({ type: 'hit', source: src, target: tgt, miss: true, fx: skill ? skill.fx : 'hit' }); return 0; }
    const r = this.computeDamage(src, tgt, skill, kind);
    tgt.hp = Math.max(0, tgt.hp - r.dmg);
    if (src.side === 'hero') { this.stats.damageDealt += r.dmg; if (r.crit) this.stats.crits++; if (r.dmg > this.stats.maxHit) this.stats.maxHit = r.dmg; }
    else this.stats.damageTaken += r.dmg;
    ev.push({ type: 'hit', source: src, target: tgt, dmg: r.dmg, crit: r.crit, absorbed: r.absorbed, kind, fx: skill ? skill.fx : (kind === 'mag' ? 'arcane' : 'hit'), sfx: skill ? skill.sfx : 'hit' });
    // thorns reflect
    if (DJ.hasPassive(tgt, 'thorns') && tgt.alive && src.alive) {
      const back = Math.max(1, Math.round(r.dmg * 0.2)); src.hp = Math.max(0, src.hp - back);
      ev.push({ type: 'hit', source: tgt, target: src, dmg: back, thorns: true, fx: 'thorns', sfx: 'hit' });
      if (src.hp <= 0) ev.push(...this.kill(src, 'thorns'));
    }
    // lifesteal
    if (DJ.hasPassive(src, 'lifesteal') && src.alive && src.hp < src.maxHp) {
      const h = Math.max(1, Math.round(r.dmg * 0.1)); src.hp = Math.min(src.maxHp, src.hp + h); ev.push({ type: 'heal', target: src, amount: h, quiet: true });
    }
    if (tgt.hp <= 0 && tgt.alive) ev.push(...this.kill(tgt, skill ? skill.id : 'attack'));
    else if (skill && skill.status) this.applyStatus(src, tgt, skill.status, ev);
    return r.dmg;
  };

  P.healUnit = function (src, tgt, amount, ev, fx) {
    if (!tgt.alive) return 0;
    const h = Math.min(amount, tgt.maxHp - tgt.hp);
    tgt.hp += h;
    if (src && src.side === 'hero') this.stats.healing += h;
    ev.push({ type: 'heal', source: src, target: tgt, amount: h, fx: fx || 'heal' });
    return h;
  };

  // ---- Targeting ----
  P.resolveTargets = function (u, skill, chosen) {
    const t = skill.target;
    const foes = this.foes(u), friends = this.friends(u);
    if (t === 'enemy') return chosen && chosen.alive && foes.includes(chosen) ? [chosen] : (foes.length ? [foes[0]] : []);
    if (t === 'enemies') return foes;
    if (t === 'ally') return chosen && chosen.alive && friends.includes(chosen) ? [chosen] : [u];
    if (t === 'allies') return friends;
    if (t === 'self') return [u];
    if (t === 'randomEnemy') return foes.length ? [this.rng.pick(foes)] : [];
    if (t === 'deadAlly') {
      const dead = (u.side === 'hero' ? this.party : this.enemies).filter((x) => !x.alive);
      return chosen && !chosen.alive ? [chosen] : dead.slice(0, 1);
    }
    return [];
  };

  P.canUseSkill = function (u, skill) {
    if (u.side === 'hero' && (skill.mp || 0) > u.mp) return false;
    if (skill.target === 'deadAlly') return (u.side === 'hero' ? this.party : this.enemies).some((x) => !x.alive);
    return true;
  };

  // ---- Act ----
  // action: {type:'attack', target} | {type:'skill', skillId, target} | {type:'defend'} | {type:'item', potion, target, inventory}
  P.act = function (u, action, isAi) {
    let ev = [];
    if (!u.alive || this.over) return ev;
    if (action.type === 'attack') {
      const tgt = this.resolveTargets(u, { target: 'enemy' }, action.target)[0];
      ev.push({ type: 'action', unit: u, name: 'Attack', skill: null, targets: tgt ? [tgt] : [] });
      if (tgt) this.dealDamage(u, tgt, null, 'phys', ev);
    } else if (action.type === 'defend') {
      ev.push({ type: 'action', unit: u, name: 'Defend', skill: null, targets: [u] });
      // Guard is a defensive choice, nothing more. It used to hand back MP, which made
      // spamming it at the end of a won fight the cheapest way to refill the party.
      this.applyStatus(u, u, { id: 'guard', turns: 2, chance: 1 }, ev);
      this.stats.defends++;
    } else if (action.type === 'skill') {
      const sk = DJ.SKILLS[action.skillId];
      if (!sk || !this.canUseSkill(u, sk)) { ev.push({ type: 'log', text: 'Cannot use that.' }); return ev; }
      if (u.side === 'hero') { u.mp -= sk.mp || 0; this.stats.skillsUsed++; }
      const targets = this.resolveTargets(u, sk, action.target);
      ev.push({ type: 'action', unit: u, name: sk.name, skill: sk, targets });
      ev = ev.concat(this.applySkill(u, sk, targets));
    } else if (action.type === 'item') {
      const pot = DJ.POTIONS[action.potion];
      ev.push({ type: 'action', unit: u, name: pot.name, skill: null, targets: action.target ? [action.target] : [] , potion: pot });
      ev = ev.concat(this.usePotion(u, pot, action.target, action.inventory));
    }
    // Deaths already recorded. End of turn.
    if (u.alive) ev = ev.concat(this.endTurn(u));
    if (u.side === 'enemy') { u.turnsTaken = (u.turnsTaken || 0) + 1; }
    return ev;
  };

  P.applySkill = function (u, sk, targets) {
    const ev = [];
    const hits = sk.hits || 1;
    if (sk.kind === 'phys' || sk.kind === 'mag') {
      for (let h = 0; h < hits; h++) for (const t of targets) if (t.alive) this.dealDamage(u, t, sk, sk.kind, ev);
    } else if (sk.kind === 'drain') {
      let total = 0;
      for (const t of targets) if (t.alive) total += this.dealDamage(u, t, sk, u.base.mag >= u.base.atk ? 'mag' : 'phys', ev);
      const h = Math.round(total * (sk.drain || 0.5));
      if (h > 0 && u.alive) this.healUnit(u, u, h, ev, 'dark');
    } else if (sk.kind === 'heal') {
      const mag = DJ.effStat(u, 'mag');
      for (const t of targets) {
        if (!t.alive) continue;
        const amt = Math.round(mag * (sk.power || 1) * 1.05 + u.level * 1.5);
        this.healUnit(u, t, amt, ev, sk.fx);
        if (sk.status) this.applyStatus(u, t, sk.status, ev);
      }
    } else if (sk.kind === 'buff' || sk.kind === 'debuff') {
      for (const t of targets) if (t.alive && sk.status) this.applyStatus(u, t, sk.status, ev);
    } else if (sk.kind === 'revive') {
      for (const t of targets) {
        if (t.alive) continue;
        t.alive = true; t.hp = Math.max(1, Math.round(t.maxHp * (sk.power || 0.4))); t.statuses = [];
        this.stats.revives++;
        ev.push({ type: 'revive', unit: t, hp: t.hp, fx: sk.fx });
      }
    } else if (sk.kind === 'summon') {
      ev.push(...this.summonMinions(u, 2));
    }
    if (sk.self && u.alive) {
      for (const st of (Array.isArray(sk.self) ? sk.self : [sk.self])) this.applyStatus(u, u, st, ev);
    }
    if (sk.gold && u.side === 'hero') { const g = Math.round(this.level * 3 + this.rng.int(4, 12)); this.stats.goldStolen = (this.stats.goldStolen || 0) + g; ev.push({ type: 'gold', amount: g }); }
    return ev;
  };

  P.usePotion = function (u, pot, target, inv) {
    const ev = [];
    if (inv) { if (!inv[pot.id] || inv[pot.id] <= 0) { ev.push({ type: 'log', text: 'None left.' }); return ev; } inv[pot.id]--; }
    this.stats.potions++;
    const e = pot.effect;
    const targets = e.party ? this.party.slice() : [target || u];
    for (const t of targets) {
      if (e.revive != null) {
        if (!t.alive) { t.alive = true; t.hp = Math.max(1, Math.round(t.maxHp * e.revive)); t.statuses = []; this.stats.revives++; ev.push({ type: 'revive', unit: t, hp: t.hp, fx: 'holy_heal' }); }
        continue;
      }
      if (!t.alive) continue;
      if (e.cure) { const bad = t.statuses.filter((s) => DJ.STATUS[s.id] && DJ.STATUS[s.id].bad); t.statuses = t.statuses.filter((s) => !(DJ.STATUS[s.id] && DJ.STATUS[s.id].bad)); for (const s of bad) ev.push({ type: 'statusEnd', unit: t, status: s.id }); }
      if (e.heal) this.healUnit(u, t, Math.round(t.maxHp * e.heal), ev, 'heal');
      if (e.mp) { const m = Math.min(t.maxMp - t.mp, Math.round(t.maxMp * e.mp)); t.mp += m; ev.push({ type: 'mp', unit: t, amount: m }); }
      if (e.status) for (const sid of e.status) this.applyStatus(u, t, { id: sid, turns: e.turns || 3, chance: 1 }, ev);
    }
    return ev;
  };

  P.summonMinions = function (u, count) {
    const ev = [];
    const room = 4 - this.alive('enemy').length;
    const n = Math.min(count, room);
    if (n <= 0) { ev.push({ type: 'log', text: 'The jungle stirs, but nothing answers.' }); return ev; }
    const pool = DJ.MONSTERS.filter((m) => m.kind === 'normal' && m.tier >= 3 && m.tier <= 5);
    const units = [];
    for (let i = 0; i < n; i++) {
      const mon = this.rng.pick(pool);
      const unit = DJ.makeEnemyUnit(mon, Math.max(1, this.level - 2), this.rng, { summoned: true });
      unit.maxHp = Math.round(unit.maxHp * 0.5); unit.hp = unit.maxHp;
      this.enemies.push(unit); units.push(unit);
    }
    ev.push({ type: 'summon', units, source: u });
    return ev;
  };

  // ---- Enemy AI ----
  P.aiAction = function (u) {
    const rng = this.rng;
    const heroes = this.foes(u);
    if (!heroes.length) return { type: 'defend' };
    // Boss phases: Heart summons at 70% / 35%
    if (u.kind === 'final') {
      const pct = u.hp / u.maxHp;
      if ((u.phase === 0 && pct < 0.7) || (u.phase === 1 && pct < 0.35)) { u.phase++; return { type: 'skill', skillId: 'h_summon' }; }
    }
    const skills = u.skills.map((id) => DJ.SKILLS[id]).filter(Boolean);
    // Heal logic
    const healSk = skills.find((s) => s.kind === 'heal');
    if (healSk) {
      const hurt = this.friends(u).filter((f) => f.hp / f.maxHp < 0.5).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
      if (hurt.length && rng.chance(0.6)) return { type: 'skill', skillId: healSk.id, target: hurt[0] };
    }
    // Buff logic: don't re-buff if already have it
    const usable = skills.filter((s) => {
      if (s.kind === 'heal') return false;
      if (s.kind === 'summon') return false;
      if (s.kind === 'buff' && s.status && DJ.hasStatus(u, s.status.id) && (s.target === 'self' || s.target === 'allies')) return false;
      if (s.kind === 'debuff' && s.target === 'enemy') return heroes.some((h) => !DJ.hasStatus(h, s.status.id));
      return true;
    });
    const pickTarget = () => {
      // Wounded heroes draw attention, but a taunting hero draws far more. This is what
      // makes a tank a tank: without it, high DEF only ever saved the tank itself.
      const w = heroes.map((h) => ({
        v: h,
        w: (1 + (1 - h.hp / h.maxHp) * 1.2) * (DJ.hasStatus(h, 'taunt') ? 6 : 1),
      }));
      return rng.weighted(w);
    };
    const attackW = u.kind === 'boss' || u.kind === 'final' ? 0.2 : 0.4;
    if (!usable.length || rng.chance(attackW)) return { type: 'attack', target: pickTarget() };
    const sk = rng.pick(usable);
    let target = null;
    if (sk.target === 'enemy') {
      if (sk.kind === 'debuff') { const c = heroes.filter((h) => !DJ.hasStatus(h, sk.status.id)); target = c.length ? rng.pick(c) : pickTarget(); }
      else target = pickTarget();
    }
    return { type: 'skill', skillId: sk.id, target };
  };

  // ---- Hero auto-AI (used by simulator & "auto" button) ----
  P.heroAutoAction = function (u, inventory) {
    const rng = this.rng;
    const foes = this.foes(u);
    const friends = this.friends(u);
    const skills = u.skills.map((id) => DJ.SKILLS[id]).filter((s) => s && this.canUseSkill(u, s));
    // emergency: heal lowest ally if healer, or potion
    const lowest = friends.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    const dead = this.party.filter((x) => !x.alive);
    const revive = skills.find((s) => s.kind === 'revive');
    if (dead.length && revive) return { type: 'skill', skillId: revive.id, target: dead[0] };
    if (inventory && dead.length && inventory.yellow > 0) return { type: 'item', potion: 'yellow', target: dead[0], inventory };
    const heal = skills.filter((s) => s.kind === 'heal' && s.target !== 'self').sort((a, b) => (b.target === 'allies') - (a.target === 'allies'));
    if (lowest.hp / lowest.maxHp < 0.4) {
      const hurtCount = friends.filter((f) => f.hp / f.maxHp < 0.6).length;
      const h = hurtCount >= 2 ? (heal.find((s) => s.target === 'allies') || heal[0]) : (heal.find((s) => s.target === 'ally') || heal[0]);
      if (h) return { type: 'skill', skillId: h.id, target: lowest };
      if (inventory && lowest.hp / lowest.maxHp < 0.3) {
        if (inventory.red > 0) return { type: 'item', potion: 'red', target: lowest, inventory };
        if (inventory.orange > 0) return { type: 'item', potion: 'orange', target: lowest, inventory };
      }
    }
    if (u.maxMp && u.mp < u.maxMp * 0.15 && inventory && inventory.blue > 0 && skills.length === 0) return { type: 'item', potion: 'blue', target: u, inventory };
    const selfHeal = skills.find((s) => s.kind === 'heal' && s.target === 'self');
    if (selfHeal && u.hp / u.maxHp < 0.45) return { type: 'skill', skillId: selfHeal.id, target: u };
    // buffs early in fight
    const buffs = skills.filter((s) => s.kind === 'buff' && s.status && !DJ.hasStatus(s.target === 'self' ? u : friends[0], s.status.id));
    if (buffs.length && this.round <= 2 && foes.length >= 2 && rng.chance(0.5)) return { type: 'skill', skillId: buffs[0].id, target: u };
    // damage: prefer AoE when 2+ foes, else best single
    const dmg = skills.filter((s) => ['phys', 'mag', 'drain'].includes(s.kind));
    const target = foes.slice().sort((a, b) => a.hp - b.hp)[0];
    const aoe = dmg.filter((s) => s.target === 'enemies').sort((a, b) => b.power - a.power)[0];
    const single = dmg.filter((s) => s.target === 'enemy').sort((a, b) => (b.power * (b.hits || 1)) - (a.power * (a.hits || 1)))[0];
    const debuff = skills.find((s) => s.kind === 'debuff' && s.target === 'enemies' && !foes.every((f) => DJ.hasStatus(f, s.status.id)));
    if (foes.length >= 3 && debuff && rng.chance(0.3)) return { type: 'skill', skillId: debuff.id };
    if (foes.length >= 2 && aoe && (u.mp >= aoe.mp)) return { type: 'skill', skillId: aoe.id };
    if (single && u.mp >= single.mp && (u.mp / u.maxMp > 0.25 || target.hp > DJ.effStat(u, 'atk') * 1.2)) return { type: 'skill', skillId: single.id, target };
    return { type: 'attack', target };
  };

  // ---- Rewards ----
  P.rewards = function () {
    let xp = 0, gold = 0;
    for (const e of this.enemies) {
      const mon = DJ.MONSTER_BY_ID[e.id];
      const r = DJ.monsterRewards(mon);
      const base = DJ.TIER_BASE_LEVEL[mon.tier];
      const f = 1 + 0.08 * (this.level - base);
      xp += Math.round(r.xp * f * (e.summoned ? 0.5 : 1));
      gold += Math.round(r.gold * f * this.rng.range(0.8, 1.2) * (e.summoned ? 0.5 : 1));
    }
    gold += this.stats.goldStolen || 0;
    return { xp, gold };
  };
})(typeof window !== 'undefined' ? window : globalThis);
