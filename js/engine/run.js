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
    // How many of each capped potion this run has already dropped, so the caps hold.
    this.potionDrops = {};
    // Set when the player refuses to leave after the Heart. From then on the run has no
    // end except the one the jungle picks, and nobody gains another level.
    this.beyond = false;
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
    this.stats = { battles: 0, elites: 0, bosses: 0, rests: 0, treasures: 0, merchants: 0, shrines: 0, events: 0, puzzles: 0, traps: 0, trainings: 0, bestHit: 0, longestBattle: 0 };
    // The profile's running totals as this expedition began. Everything the history
    // screen reports for a single run is the difference between then and the end, so
    // no counter anywhere else has to learn about per-run bookkeeping.
    this.startStats = (typeof DJ.profile === 'object' && DJ.profile) ? Object.assign({}, DJ.profile.stats) : {};
    this.startedWall = Date.now();
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
    this.available = [];   // set once the node is resolved
    // From here until completeNode() the run is "inside" a node. If the player closes
    // the tab or steps out to the menu now, resuming must drop them back into this
    // node rather than onto a map with nothing to click. The RNG state is snapshotted
    // so the rebuilt encounter is the same one they walked into.
    this.pending = true;
    this.pendingRng = this.rng.s;
    return true;
  };
  R.completeNode = function () {
    const n = this.node();
    n.done = true;
    this.pending = false;
    this.pendingRng = null;
    if (n.type === 'heart') {
      // The Heart is beaten. Whether that is the end is the player's call, so the run is
      // parked here with no onward path until they answer.
      this.won = true;
      this.heartBeaten = true;
      this.available = [];
      return;
    }
    this.available = n.next.slice();
  };
  // Refuse to leave. Opens the columns past the Heart and freezes the party where they
  // stand: no more experience, only what the jungle drops.
  R.enterBeyond = function () {
    const n = this.node();
    if (!n || n.type !== 'heart' || this.finished) return false;
    this.beyond = true;
    this.available = n.next.slice();
    return this.available.length > 0;
  };

  // How far past the Heart the party has come. Zero anywhere in the expedition proper.
  R.depth = function () {
    const n = this.node();
    return n ? Math.max(0, n.col - DJ.HEART_COL) : 0;
  };

  // True when the save was taken inside an unresolved node.
  R.isMidNode = function () {
    if (this.finished) return false;
    const n = this.node();
    if (!n) return false;
    if (this.pending) return true;
    // Older saves predate the flag: infer it from a node that has no way forward.
    return !n.done && !this.available.length && n.type !== 'heart';
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
  // no healer or revive skill can still contest the finale. An Elixir every time: strong,
  // but it only undoes damage. A free Phoenix Down used to undo the whole fight, which
  // took most of the tension out of the finale.
  R.finalCampSupplies = function () {
    const given = [];
    this.addPotion('elixir', 1); given.push('elixir');
    for (let i = (this.inventory.red || 0); i < 3; i++) { this.addPotion('red', 1); given.push('red'); }
    for (let i = (this.inventory.yellow || 0); i < 2; i++) { this.addPotion('yellow', 1); given.push('yellow'); }
    return given;
  };

  // ---- Potions outside battle ----
  // Buff potions only last for battle turns, so they are not offered on the map.
  DJ.potionUsableOutOfBattle = function (pid) {
    const e = DJ.POTIONS[pid].effect;
    return !!(e.heal || e.mp || e.cure || e.revive != null || e.levelUp);
  };
  // Would this potion actually do anything right now? Keeps the player from burning a
  // revive with nobody down, or a heal on a party already at full.
  R.potionHasEffect = function (pid) {
    const e = DJ.POTIONS[pid].effect;
    if (!DJ.potionUsableOutOfBattle(pid)) return false;
    if (e.levelUp) return this.party.some((h) => h.alive && h.level < DJ.MAX_LEVEL);
    const pool = e.party ? this.party : this.party;
    if (e.revive != null) return pool.some((h) => !h.alive);
    return pool.some((h) => h.alive && (
      (e.heal && h.hp < h.maxHp) ||
      (e.mp && h.mp < h.maxMp) ||
      (e.cure && h.statuses.some((st) => (DJ.STATUS[st.id] || {}).bad))
    ));
  };
  // Apply it and report what happened, so the UI can show a line per hero.
  R.usePotionOutOfBattle = function (pid, target) {
    const pot = DJ.POTIONS[pid];
    if (!pot || (this.inventory[pid] || 0) <= 0) return null;
    const e = pot.effect;
    const targets = e.party ? this.party.slice() : [target].filter(Boolean);
    if (!targets.length) return null;
    const lines = [];
    if (e.levelUp) {
      const h = targets[0];
      if (!h || !h.alive || h.level >= DJ.MAX_LEVEL) return null;
      const before = h.level;
      // Hand over exactly the XP still owed for the next level, so it is always one level.
      const gains = DJ.grantXp(h, Math.max(1, h.xpNext - h.xp));
      if (!gains.length) return null;
      const d = gains.reduce((acc, g) => {
        for (const k in acc) acc[k] += g.delta[k] || 0;
        return acc;
      }, { hp: 0, mp: 0, atk: 0, mag: 0, def: 0, spd: 0 });
      // The card built from `gains` is what the player actually sees; this text is only
      // the fallback for anywhere that cannot draw one.
      lines.push({ unit: h, text: `reached level ${h.level}, up from ${before}`, levelUp: true, gains });
      this.inventory[pid]--;
      return { potion: pot, lines };
    }
    for (const h of targets) {
      if (e.revive != null) {
        if (h.alive) continue;
        h.alive = true;
        h.hp = Math.max(1, Math.round(h.maxHp * e.revive));
        h.statuses = [];
        lines.push({ unit: h, text: `back on their feet at ${h.hp}/${h.maxHp} HP` });
        continue;
      }
      if (!h.alive) continue;
      const bits = [];
      if (e.cure) {
        const before = h.statuses.length;
        h.statuses = h.statuses.filter((st) => !(DJ.STATUS[st.id] && DJ.STATUS[st.id].bad));
        if (before !== h.statuses.length) bits.push('cured');
      }
      if (e.heal) {
        const gain = Math.min(h.maxHp - h.hp, Math.round(h.maxHp * e.heal));
        if (gain > 0) { h.hp += gain; bits.push(`+${gain} HP`); }
      }
      if (e.mp) {
        const gain = Math.min(h.maxMp - h.mp, Math.round(h.maxMp * e.mp));
        if (gain > 0) { h.mp += gain; bits.push(`+${gain} MP`); }
      }
      if (bits.length) lines.push({ unit: h, text: bits.join(', ') });
    }
    if (!lines.length) return null;
    this.inventory[pid]--;
    return { potion: pot, lines };
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
    if (rng.chance(0.55)) out.potions.push(DJ.rollPotion(rng, this));
    if (rng.chance(0.2)) out.potions.push(DJ.rollPotion(rng, this));
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
    // The Heart drops like any other boss. It used to drop nothing, because the run
    // ended the moment it died; now the player can carry straight on into The Beyond,
    // where a fresh weapon is the difference between depth six and depth twelve.
    const boss = node.type === 'boss' || node.type === 'heart';
    const elite = node.type === 'elite';
    // The Undergrowth now hits hard enough to cost real sustain, so it hands a little
    // more back. Without this the opening drains potions the party never recovers, and
    // the whole run gets harder rather than just its first stretch.
    const reg = node.region == null ? DJ.regionOfCol(node.col) : node.region;
    const early = reg === 0;
    // Supplies are the only currency left in The Beyond, so it is generous with them.
    // It has to be: without experience, potions and gear are the whole of the ramp.
    const pChance = boss ? 1 : elite ? 0.9 : (reg === 3 ? 0.92 : early ? 0.8 : 0.62);
    if (rng.chance(pChance)) drops.potions.push(DJ.rollPotion(rng, this));
    if (rng.chance(boss ? 0.9 : elite ? 0.45 : 0.14)) drops.potions.push(DJ.rollPotion(rng, this));
    const iChance = boss ? 1 : elite ? 0.7 : (reg === 3 ? 0.42 : 0.16);
    if (rng.chance(iChance)) drops.items.push(DJ.rollItem(rng, node.level, boss ? 3 : elite ? 2 : 0));
    // Heartbloom Nectar is the run's rare prize: a guaranteed reward for a region boss,
    // and an occasional one from an elite. Ordinary monsters never carry it.
    if (node.type === 'boss') drops.potions.push('pink');
    else if (elite && rng.chance(0.12)) drops.potions.push('pink');
    return drops;
  };

  // ---- Battle rewards ----
  R.applyBattleRewards = function (rew) {
    this.gold += rew.gold;
    const alive = this.partyAlive();
    // Nothing past the Heart teaches you anything. Gold, gear and potions still drop.
    const share = (alive.length && !this.beyond) ? rew.xp : 0;
    const gains = [];
    for (const h of this.party) {
      // fallen heroes get half XP
      const amt = h.alive ? share : Math.round(share * 0.5);
      gains.push(...DJ.grantXp(h, amt));
    }
    return gains;
  };

  // A breather between fights, not a refill. At the old figures a run's two dozen
  // battles handed back far more mana than any hero could spend, so the expensive sweep
  // was free every encounter and nothing ever wore the party down. Campfires, potions and
  // levelling are what restore a bar now; this only takes the edge off.
  R.RECOVER = { hp: 0.20, mp: 0.19 };
  R.postBattleRecovery = function () {
    for (const h of this.party) {
      if (!h.alive) continue;
      h.statuses = [];
      h.hp = Math.min(h.maxHp, h.hp + Math.round(h.maxHp * R.RECOVER.hp));
      h.mp = Math.min(h.maxMp, h.mp + Math.round(h.maxMp * R.RECOVER.mp));
    }
  };

  R.merchantStock = function () {
    const rng = this.rng;
    const level = this.node().level;
    const items = [];
    for (let i = 0; i < 3; i++) items.push(DJ.rollItem(rng, level, 1));
    // Always stock a heal and a revive: a party with no healer must be able to buy sustain.
    // Everything above that is the mid shelf. A premium tonic appears only now and then,
    // and mostly deep in the run, where a party might actually have the gold for one.
    const mid = rng.shuffle(['blue', 'green', 'purple']).slice(0, 2);
    const potions = ['red', 'yellow'].concat(mid);
    if (rng.chance(level >= 10 ? 0.3 : 0.1)) {
      potions.push(rng.weighted([{ v: 'orange', w: 5 }, { v: 'phoenix', w: 2 }, { v: 'elixir', w: 1 }]));
    }
    return { items, potions: rng.shuffle(potions) };
  };

  R.serialize = function () {
    const ser = (u) => ({
      id: u.id, level: u.level, xp: u.xp, xpNext: u.xpNext, hp: u.hp, mp: u.mp, alive: u.alive,
      bonus: u.bonus, equip: { weapon: u.equip.weapon ? u.equip.weapon.id : null, armor: u.equip.armor ? u.equip.armor.id : null, trinket: u.equip.trinket ? u.equip.trinket.id : null },
    });
    return {
      seed: this.seed, rngState: this.rng.s, gold: this.gold, inventory: this.inventory,
      potionDrops: this.potionDrops || {},
      beyond: !!this.beyond, heartBeaten: !!this.heartBeaten,
      stash: this.stash.map((i) => i.id), party: this.party.map(ser),
      currentId: this.currentId, visited: this.visited, path: this.path, available: this.available,
      nodesVisited: this.nodesVisited, flawless: this.flawless, finished: this.finished, won: this.won,
      pending: !!this.pending, pendingRng: this.pendingRng == null ? null : this.pendingRng,
      elapsed: this.elapsed + (Date.now() - this.startedAt), stats: this.stats, discovered: this.discovered,
      startStats: this.startStats, startedWall: this.startedWall,
      doneNodes: Object.keys(this.map.nodeById).filter((k) => this.map.nodeById[k].done),
    };
  };
  DJ.deserializeRun = function (d) {
    const r = new Run({ seed: d.seed, partyIds: d.party.map((p) => p.id) });
    r.rng.s = d.rngState;
    r.gold = d.gold; r.inventory = d.inventory;
    r.potionDrops = d.potionDrops || {};   // per-run caps survive a reload
    r.beyond = !!d.beyond; r.heartBeaten = !!d.heartBeaten;
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
    r.pending = !!d.pending; r.pendingRng = d.pendingRng == null ? null : d.pendingRng;
    r.elapsed = d.elapsed || 0; r.startedAt = Date.now();
    r.stats = Object.assign(r.stats, d.stats || {}); r.discovered = d.discovered || {};
    r.startStats = d.startStats || r.startStats;
    r.startedWall = d.startedWall || r.startedWall;
    for (const id of d.doneNodes || []) if (r.map.nodeById[id]) r.map.nodeById[id].done = true;
    return r;
  };
})(typeof window !== 'undefined' ? window : globalThis);
