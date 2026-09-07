/* Deep Jungle — run state: party, leveling, inventory, node progression (DOM-free). */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});

  DJ.xpForLevel = (lvl) => Math.round(26 * Math.pow(lvl, 1.32));
  DJ.MAX_LEVEL = 20;

  DJ.makeHeroUnit = function (heroId, level) {
    const h = DJ.HERO_BY_ID[heroId];
    level = level || 1;
    const u = {
      uid: DJ.uid('h'), side: 'hero', id: heroId, name: h.name, sprite: heroId, role: h.role,
      level, xp: 0, xpNext: DJ.xpForLevel(1),
      bonus: { hp: 0, mp: 0, atk: 0, mag: 0, def: 0, spd: 0 }, // permanent from shrines/events
      equip: { weapon: null, armor: null, trinket: null },
      statuses: [], alive: true, size: 32, kind: 'hero',
      maxHp: 0, hp: 0, maxMp: 0, mp: 0, base: {},
    };
    DJ.recalcHero(u);
    u.hp = u.maxHp; u.mp = u.maxMp;
    return u;
  };

  DJ.recalcHero = function (u) {
    const h = DJ.HERO_BY_ID[u.id];
    const n = u.level - 1;
    const g = h.grow, b = h.base;
    const prevMaxHp = u.maxHp, prevMaxMp = u.maxMp;
    let hp = Math.round(b.hp + g.hp * n) + u.bonus.hp;
    let mp = Math.round(b.mp + g.mp * n) + u.bonus.mp;
    u.base = {
      atk: Math.round(b.atk + g.atk * n) + u.bonus.atk,
      mag: Math.round(b.mag + g.mag * n) + u.bonus.mag,
      def: Math.round(b.def + g.def * n) + u.bonus.def,
      spd: Math.round(b.spd + g.spd * n) + u.bonus.spd,
    };
    // equipment hp/mp
    for (const slot in u.equip) { const it = u.equip[slot]; if (it && it.stats) { hp += it.stats.hp || 0; mp += it.stats.mp || 0; } }
    u.maxHp = Math.max(1, hp); u.maxMp = Math.max(0, mp);
    if (prevMaxHp) { u.hp = DJ.clamp(u.hp + (u.maxHp - prevMaxHp), 0, u.maxHp); u.mp = DJ.clamp(u.mp + (u.maxMp - prevMaxMp), 0, u.maxMp); }
    u.skills = h.skills.filter((s, i) => u.level >= DJ.SKILL_UNLOCK_LEVELS[i]);
    u.passives = [];
    for (const slot in u.equip) { const it = u.equip[slot]; if (it && it.passive) u.passives.push(it.passive); }
    return u;
  };

  DJ.grantXp = function (u, xp) {
    if (!u) return [];
    const gains = [];
    let bonus = 1 + (DJ.hasPassive(u, 'xp') ? 0.2 : 0);
    u.xp += Math.round(xp * bonus);
    while (u.level < DJ.MAX_LEVEL && u.xp >= u.xpNext) {
      u.xp -= u.xpNext;
      u.level++;
      const before = { hp: u.maxHp, mp: u.maxMp, atk: u.base.atk, mag: u.base.mag, def: u.base.def, spd: u.base.spd };
      DJ.recalcHero(u);
      // level-ups also restore some HP/MP
      u.hp = Math.min(u.maxHp, u.hp + Math.round(u.maxHp * 0.25));
      u.mp = Math.min(u.maxMp, u.mp + Math.round(u.maxMp * 0.3));
      u.xpNext = DJ.xpForLevel(u.level);
      const newSkill = DJ.SKILL_UNLOCK_LEVELS.map((l, i) => (l === u.level ? DJ.HERO_BY_ID[u.id].skills[i] : null)).filter(Boolean);
      gains.push({ unit: u, level: u.level, delta: { hp: u.maxHp - before.hp, mp: u.maxMp - before.mp, atk: u.base.atk - before.atk, mag: u.base.mag - before.mag, def: u.base.def - before.def, spd: u.base.spd - before.spd }, newSkills: newSkill });
    }
    if (u.level >= DJ.MAX_LEVEL) u.xpNext = 0;
    return gains;
  };

  // ---- Run ----
  function Run(o) {
    this.seed = o.seed;
    this.rng = new DJ.RNG(o.seed);
    this.map = DJ.generateMap(o.seed);
    this.party = o.partyIds.map((id) => DJ.makeHeroUnit(id, 1));
    this.gold = 40;
    this.inventory = { red: 2, blue: 1, green: 1, yellow: 0, purple: 0, orange: 0, elixir: 0, phoenix: 0 };
    this.stash = [];                  // unequipped items
    this.currentId = this.map.startId;
    this.visited = { [this.map.startId]: true };
    this.path = [this.map.startId];
    this.available = this.map.nodeById[this.map.startId].next.slice();
    this.nodesVisited = 0;
    this.flawless = true;             // no hero KO'd this run
    this.finished = false;
    this.won = false;
    this.startedAt = Date.now();
    this.elapsed = 0;
    this.discovered = {};             // monsters seen this run
    this.stats = { battles: 0, elites: 0, bosses: 0, rests: 0, treasures: 0, merchants: 0, shrines: 0, events: 0, puzzles: 0, traps: 0, trainings: 0 };
  }
  DJ.Run = Run;
  const R = Run.prototype;

  R.node = function (id) { return this.map.nodeById[id || this.currentId]; };
  R.canGoTo = function (id) { return this.available.includes(id); };
  R.moveTo = function (id) {
    if (!this.canGoTo(id)) return false;
    this.currentId = id;
    this.visited[id] = true;
    this.path.push(id);
    this.nodesVisited++;
    const n = this.node(id);
    this.available = [];   // set after the node is resolved
    return true;
  };
  R.completeNode = function () {
    const n = this.node();
    n.done = true;
    if (n.type === 'heart') { this.finished = true; this.won = true; this.available = []; return; }
    this.available = n.next.slice();
  };
  R.partyAlive = function () { return this.party.filter((h) => h.alive); };
  R.isWiped = function () { return this.party.every((h) => !h.alive); };

  R.addPotion = function (id, n) { this.inventory[id] = (this.inventory[id] || 0) + (n || 1); };
  R.addItem = function (item) { this.stash.push(item); };
  R.equipItem = function (hero, item) {
    const prev = hero.equip[item.slot];
    hero.equip[item.slot] = item;
    const i = this.stash.indexOf(item);
    if (i >= 0) this.stash.splice(i, 1);
    if (prev) this.stash.push(prev);
    DJ.recalcHero(hero);
    return prev;
  };
  R.unequipItem = function (hero, slot) {
    const prev = hero.equip[slot];
    if (!prev) return null;
    hero.equip[slot] = null;
    this.stash.push(prev);
    DJ.recalcHero(hero);
    return prev;
  };
  R.sellItem = function (item) {
    const i = this.stash.indexOf(item);
    if (i < 0) return 0;
    this.stash.splice(i, 1);
    const g = Math.round(DJ.itemPrice(item) * 0.45);
    this.gold += g;
    return g;
  };

  // The guaranteed camp before the Heart hands out emergency supplies, so a party with
  // no healer or revive skill can still contest the finale.
  R.finalCampSupplies = function () {
    const given = [];
    if ((this.inventory.phoenix || 0) < 1) { this.addPotion('phoenix', 1); given.push('phoenix'); }
    if ((this.inventory.elixir || 0) < 1) { this.addPotion('elixir', 1); given.push('elixir'); }
    for (let i = (this.inventory.red || 0); i < 3; i++) { this.addPotion('red', 1); given.push('red'); }
    for (let i = (this.inventory.yellow || 0); i < 2; i++) { this.addPotion('yellow', 1); given.push('yellow'); }
    return given;
  };

  // ---- Rest / campfire ----
  R.restHeal = function (pct) {
    const out = [];
    for (const h of this.party) {
      if (!h.alive) { h.alive = true; h.hp = Math.round(h.maxHp * 0.5); h.statuses = []; out.push({ unit: h, revived: true }); continue; }
      const before = h.hp;
      h.hp = Math.min(h.maxHp, h.hp + Math.round(h.maxHp * pct));
      h.mp = Math.min(h.maxMp, h.mp + Math.round(h.maxMp * pct));
      h.statuses = [];
      out.push({ unit: h, healed: h.hp - before });
    }
    return out;
  };

  // ---- Node reward helpers ----
  R.treasureLoot = function (level, boost) {
    const rng = this.rng;
    const out = { gold: 0, items: [], potions: [] };
    out.gold = Math.round((18 + level * 9) * rng.range(0.8, 1.3));
    if (DJ.hasPassive(this.party[0] || {}, 'gold')) out.gold = Math.round(out.gold * 1.25);
    out.items.push(DJ.rollItem(rng, level, boost || 1));
    if (rng.chance(0.55)) out.potions.push(DJ.rollPotion(rng));
    if (rng.chance(0.2)) out.potions.push(DJ.rollPotion(rng));
    return out;
  };
  R.applyLoot = function (loot) {
    if (loot.gold) this.gold += loot.gold;
    for (const it of loot.items || []) this.addItem(it);
    for (const p of loot.potions || []) this.addPotion(p, 1);
  };

  // Loot dropped by a won battle (potions are the party's main sustain between campfires).
  R.battleDrops = function (node) {
    const rng = this.rng;
    const drops = { potions: [], items: [] };
    const boss = node.type === 'boss' || node.type === 'heart';
    const elite = node.type === 'elite';
    const pChance = boss ? 1 : elite ? 0.9 : 0.62;
    if (rng.chance(pChance)) drops.potions.push(DJ.rollPotion(rng));
    if (rng.chance(boss ? 0.9 : elite ? 0.45 : 0.14)) drops.potions.push(DJ.rollPotion(rng));
    const iChance = boss ? 1 : elite ? 0.7 : 0.16;
    if (rng.chance(iChance)) drops.items.push(DJ.rollItem(rng, node.level, boss ? 3 : elite ? 2 : 0));
    return drops;
  };

  // ---- Battle rewards ----
  R.applyBattleRewards = function (rew) {
    this.gold += rew.gold;
    const alive = this.partyAlive();
    const share = alive.length ? rew.xp : 0;
    const gains = [];
    for (const h of this.party) {
      // fallen heroes get half XP
      const amt = h.alive ? share : Math.round(share * 0.5);
      gains.push(...DJ.grantXp(h, amt));
    }
    return gains;
  };

  // Between-battle recovery so the run doesn't die from attrition: small heal after each battle
  R.postBattleRecovery = function () {
    for (const h of this.party) {
      if (!h.alive) continue;
      h.statuses = [];
      h.hp = Math.min(h.maxHp, h.hp + Math.round(h.maxHp * 0.22));
      h.mp = Math.min(h.maxMp, h.mp + Math.round(h.maxMp * 0.28));
    }
  };

  R.merchantStock = function () {
    const rng = this.rng;
    const level = this.node().level;
    const items = [];
    for (let i = 0; i < 3; i++) items.push(DJ.rollItem(rng, level, 1));
    // Always stock a heal and a revive: a party with no healer must be able to buy sustain.
    const rest = rng.shuffle(['blue', 'green', 'purple', 'orange', 'elixir', 'phoenix']).slice(0, 2);
    const potions = rng.shuffle(['red', 'yellow'].concat(rest));
    return { items, potions };
  };

  R.serialize = function () {
    const ser = (u) => ({
      id: u.id, level: u.level, xp: u.xp, xpNext: u.xpNext, hp: u.hp, mp: u.mp, alive: u.alive,
      bonus: u.bonus, equip: { weapon: u.equip.weapon ? u.equip.weapon.id : null, armor: u.equip.armor ? u.equip.armor.id : null, trinket: u.equip.trinket ? u.equip.trinket.id : null },
    });
    return {
      seed: this.seed, rngState: this.rng.s, gold: this.gold, inventory: this.inventory,
      stash: this.stash.map((i) => i.id), party: this.party.map(ser),
      currentId: this.currentId, visited: this.visited, path: this.path, available: this.available,
      nodesVisited: this.nodesVisited, flawless: this.flawless, finished: this.finished, won: this.won,
      elapsed: this.elapsed + (Date.now() - this.startedAt), stats: this.stats, discovered: this.discovered,
      doneNodes: Object.keys(this.map.nodeById).filter((k) => this.map.nodeById[k].done),
    };
  };
  DJ.deserializeRun = function (d) {
    const r = new Run({ seed: d.seed, partyIds: d.party.map((p) => p.id) });
    r.rng.s = d.rngState;
    r.gold = d.gold; r.inventory = d.inventory;
    r.stash = (d.stash || []).map((id) => DJ.ITEM_BY_ID[id]).filter(Boolean);
    d.party.forEach((p, i) => {
      const u = r.party[i];
      u.level = p.level; u.xp = p.xp; u.xpNext = p.xpNext; u.bonus = p.bonus || u.bonus;
      u.equip.weapon = p.equip.weapon ? DJ.ITEM_BY_ID[p.equip.weapon] : null;
      u.equip.armor = p.equip.armor ? DJ.ITEM_BY_ID[p.equip.armor] : null;
      u.equip.trinket = p.equip.trinket ? DJ.ITEM_BY_ID[p.equip.trinket] : null;
      DJ.recalcHero(u);
      u.hp = p.hp; u.mp = p.mp; u.alive = p.alive;
    });
    r.currentId = d.currentId; r.visited = d.visited; r.path = d.path; r.available = d.available;
    r.nodesVisited = d.nodesVisited; r.flawless = d.flawless; r.finished = d.finished; r.won = d.won;
    r.elapsed = d.elapsed || 0; r.startedAt = Date.now();
    r.stats = d.stats || r.stats; r.discovered = d.discovered || {};
    for (const id of d.doneNodes || []) if (r.map.nodeById[id]) r.map.nodeById[id].done = true;
    return r;
  };
})(typeof window !== 'undefined' ? window : globalThis);
