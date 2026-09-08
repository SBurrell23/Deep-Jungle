/* Deep Jungle — procedural branching map generator (left to right).
 * The map is a DAG of columns. Column 0 is the start hut; the last column is the
 * Heart of the Jungle. Every path converges on the Heart.
 * Three regions, each ending in a region boss column that all paths pass through.
 */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});

  // Each region keeps a roster of guardians. A map draws one per region, so which three
  // bosses a run faces is part of what makes that run different. `boss` remains the
  // first of each list purely so anything reading a region outside a run still resolves.
  DJ.REGIONS = [
    { id: 'undergrowth', name: 'The Undergrowth', bosses: ['bramble_king'], boss: 'bramble_king', tiers: [1, 2], color: '#3f7d3a', bg: '#0f2418',
      blurb: 'Wet green dark. Everything here is small, hungry, and numerous.' },
    { id: 'mireheart', name: 'The Mire', bosses: ['mother_of_fangs'], boss: 'mother_of_fangs', tiers: [2, 3, 4], color: '#7a6b2f', bg: '#1d2110',
      blurb: 'The ground stops being ground. Things move under the water.' },
    { id: 'canopy', name: 'The High Canopy', bosses: ['vine_warden'], boss: 'vine_warden', tiers: [4, 5], color: '#2f6b7a', bg: '#0d1c24',
      blurb: 'Above the mist, where the old guardians still keep their posts.' },
  ];

  // Every guardian a region can field, whether or not this run drew them. Used by the
  // compendium and by the achievements that ask you to beat "a region's guardian".
  DJ.regionBosses = function (r) {
    const reg = DJ.REGIONS[r];
    if (!reg) return [];
    return (reg.bosses && reg.bosses.length ? reg.bosses : [reg.boss]).filter((id) => DJ.MONSTER_BY_ID[id]);
  };

  // Node types and their base weights per region index.
  const NODE_WEIGHTS = [
    // region 0
    { battle: 74, elite: 7, rest: 9, treasure: 8, shrine: 6, event: 8, merchant: 4, puzzle: 5, training: 4, trap: 3, mystery: 5 },
    // region 1
    { battle: 70, elite: 13, rest: 9, treasure: 8, shrine: 6, event: 7, merchant: 4, puzzle: 5, training: 4, trap: 4, mystery: 5 },
    // region 2
    { battle: 66, elite: 18, rest: 9, treasure: 8, shrine: 5, event: 7, merchant: 4, puzzle: 4, training: 3, trap: 4, mystery: 5 },
  ];

  DJ.NODE_INFO = {
    start:    { name: 'Trailhead', icon: 'node_start', color: '#8fd694' },
    battle:   { name: 'Battle', icon: 'node_battle', color: '#d8735e' },
    elite:    { name: 'Elite', icon: 'node_elite', color: '#c94f8a' },
    boss:     { name: 'Region Boss', icon: 'node_boss', color: '#b03030' },
    heart:    { name: 'Heart of the Jungle', icon: 'node_heart', color: '#ff4d6d' },
    rest:     { name: 'Campfire', icon: 'node_rest', color: '#f0a04b' },
    treasure: { name: 'Treasure', icon: 'node_treasure', color: '#e8c65a' },
    shrine:   { name: 'Shrine', icon: 'node_shrine', color: '#7fd4e8' },
    event:    { name: 'Encounter', icon: 'node_event', color: '#c8b8e8' },
    merchant: { name: 'Merchant', icon: 'node_merchant', color: '#6fc98a' },
    puzzle:   { name: 'Puzzle', icon: 'node_puzzle', color: '#9c8fe8' },
    training: { name: 'Training Ground', icon: 'node_training', color: '#88c4d8' },
    trap:     { name: 'Trap', icon: 'node_trap', color: '#a0785a' },
    mystery:  { name: 'Mystery', icon: 'node_mystery', color: '#b07fe8' },
  };

  // Column plan per region: [normal columns..., boss column]
  const REGION_COLS = [11, 12, 11]; // + 1 boss column each => 1 start + 12 + 13 + 12 + 1 camp + 1 heart = 40 columns

  // Guarantee trading posts. Left to the type weights alone a whole region could pass
  // without one, which strands the player with gold and nothing to spend it on.
  function ensureMerchants(cols, region, rng) {
    const mine = cols.filter((col) => col.length > 1 && col[0].region === region);
    if (!mine.length) return;
    const has = () => mine.reduce((n, col) => n + col.filter((x) => x.type === 'merchant').length, 0);
    const want = rng.int(1, 2);
    // Only free columns can host one; forced columns are all-combat by design.
    const free = mine.filter((col) => col.some((x) => x.type !== 'battle' && x.type !== 'elite'));
    let guard = 0;
    while (has() < want && free.length && guard++ < 40) {
      const col = rng.pick(free);
      if (col.some((x) => x.type === 'merchant')) continue;
      // Replace a non-combat, non-camp node so the pre-boss camp guarantee survives.
      const swappable = col.filter((x) => x.type !== 'battle' && x.type !== 'elite' && x.type !== 'rest');
      if (!swappable.length) continue;
      rng.pick(swappable).type = 'merchant';
    }
  }

  DJ.generateMap = function (seed) {
    const rng = new DJ.RNG(seed);
    const cols = [];
    let colIndex = 0;
    const push = (nodes) => { cols.push(nodes); colIndex++; };

    // Draw this run's three guardians up front, off the map's own seed, so the same seed
    // always produces the same trio and a save reloads into the fight it left.
    const bossFor = [0, 1, 2].map((r) => {
      const pool = DJ.regionBosses(r);
      return pool.length ? rng.pick(pool) : DJ.REGIONS[r].boss;
    });

    // Column 0: start
    push([{ type: 'start', region: 0 }]);

    // Columns alternate between "forced" (every node is combat) and "free" (a mixed
    // branch). Because the player takes exactly one node per column, alternating this way
    // guarantees they can never travel two nodes in a row without a fight.
    let lastWasCombat = false;   // the start hut is not a fight
    for (let r = 0; r < 3; r++) {
      const n = REGION_COLS[r];
      for (let c = 0; c < n; c++) {
        const width = rng.weighted([{ v: 2, w: 2 }, { v: 3, w: 5 }, { v: 4, w: 4 }]);
        const nodes = [];
        // Strict alternation. A free column is never adjacent to another free column,
        // so no route can string two non-combat nodes together.
        const forced = !lastWasCombat;

        if (forced) {
          // Every option is a fight, but the player still chooses which kind.
          const eliteW = r === 0 ? 0.14 : r === 1 ? 0.24 : 0.34;
          for (let i = 0; i < width; i++) {
            const canElite = !(r === 0 && c === 0);
            nodes.push({ type: canElite && rng.chance(eliteW) ? 'elite' : 'battle', region: r });
          }
          // Never make every option an elite; at least one ordinary battle stays available.
          if (nodes.every((x) => x.type === 'elite')) nodes[rng.int(0, nodes.length - 1)].type = 'battle';
        } else {
          const usedTypes = {};
          for (let i = 0; i < width; i++) {
            let t = rng.weighted(Object.entries(NODE_WEIGHTS[r]).map(([k, w]) => ({ v: k, w })));
            // Special nodes should not repeat inside one column (that would waste a choice),
            // but plain battles may, since combat is the default and should stay common.
            let tries = 0;
            while (t !== 'battle' && usedTypes[t] && tries++ < 6) t = rng.weighted(Object.entries(NODE_WEIGHTS[r]).map(([k, w]) => ({ v: k, w })));
            if (t === 'elite' && r === 0 && c === 0) t = 'battle';
            usedTypes[t] = true;
            nodes.push({ type: t, region: r });
          }
          // A free column must always leave a non-combat option, otherwise it is just a
          // forced column and the rhythm collapses.
          if (nodes.every((x) => x.type === 'battle' || x.type === 'elite')) {
            nodes[rng.int(0, nodes.length - 1)].type = rng.pick(['rest', 'treasure', 'shrine', 'event', 'merchant']);
          }
          // Guarantee a camp in the last free column before the boss, so the party can
          // always arrive at a region boss rested if they choose to.
          const lastFreeBeforeBoss = c >= n - 2;
          if (lastFreeBeforeBoss && !nodes.some((x) => x.type === 'rest')) nodes[rng.int(0, nodes.length - 1)].type = 'rest';
        }
        push(nodes);
        lastWasCombat = forced;
      }
      ensureMerchants(cols, r, rng);
      // Region boss column (single node, everything converges)
      push([{ type: 'boss', region: r, boss: bossFor[r] }]);
      lastWasCombat = true;
    }
    // Final camp: a guaranteed full-rest before the Heart, so the finale is a fair fight.
    push([{ type: 'rest', region: 2, finalCamp: true }]);
    // Final column: Heart
    push([{ type: 'heart', region: 2 }]);

    // Assign ids, levels, and per-node data
    const nodeById = {};
    cols.forEach((col, ci) => {
      col.forEach((nd, ri) => {
        nd.id = `n${ci}_${ri}`;
        nd.col = ci; nd.row = ri;
        nd.rows = col.length;
        nd.level = DJ.nodeLevel(ci, nd.type);
        nd.next = [];
        nd.prev = [];
        nodeById[nd.id] = nd;
      });
    });

    // Connect columns: every node gets 1-3 forward edges; every node in the next
    // column must have at least one incoming edge. Edges do not cross (keeps it readable).
    for (let ci = 0; ci < cols.length - 1; ci++) {
      const a = cols[ci], b = cols[ci + 1];
      // map each source to a contiguous window of targets based on relative position
      const covered = new Set();
      a.forEach((src, i) => {
        const center = b.length === 1 ? 0 : Math.round((i / Math.max(1, a.length - 1)) * (b.length - 1));
        const span = b.length === 1 ? 1 : rng.weighted([{ v: 2, w: 6 }, { v: 3, w: 4 }, { v: 1, w: 1.4 }]);
        const width = Math.min(span, b.length);
        const lo = DJ.clamp(center - Math.floor((width - 1) / 2), 0, b.length - width);
        const hi = lo + width - 1;
        for (let j = lo; j <= hi; j++) { src.next.push(b[j].id); b[j].prev.push(src.id); covered.add(j); }
      });
      // ensure every target is reachable
      b.forEach((tgt, j) => {
        if (covered.has(j)) return;
        const srcIdx = DJ.clamp(Math.round((j / Math.max(1, b.length - 1)) * (a.length - 1)), 0, a.length - 1);
        a[srcIdx].next.push(tgt.id); tgt.prev.push(a[srcIdx].id);
      });
      // dedupe
      a.forEach((s) => (s.next = Array.from(new Set(s.next))));
      b.forEach((t) => (t.prev = Array.from(new Set(t.prev))));
    }

    return { seed, cols, nodeById, bosses: bossFor, startId: cols[0][0].id, heartId: cols[cols.length - 1][0].id, totalCols: cols.length };
  };

  // Node "level" drives enemy strength and reward scale.
  DJ.nodeLevel = function (col, type) {
    let lvl = 1 + Math.floor(col * 0.43);
    // The Undergrowth used to sit more than a level under the party the whole way, so the
    // opening was a formality. This closes the gap without moving the later curve at all.
    if (col >= 2 && col <= 11) lvl += 1;
    if (type === 'elite') lvl += 2;
    if (type === 'boss') lvl += 1;
    if (type === 'heart') lvl = 20;
    return DJ.clamp(lvl, 1, 20);
  };

  DJ.regionOfCol = function (col) {
    if (col === 0) return 0;
    let c = 1;
    for (let r = 0; r < 3; r++) { const n = REGION_COLS[r] + 1; if (col < c + n) return r; c += n; }
    return 2;
  };

  // Build the enemy group for a node.
  DJ.buildEncounter = function (rng, node) {
    return DJ.scaleEncounter(buildEncounterUnits(rng, node), node.region == null ? DJ.regionOfCol(node.col) : node.region);
  };
  function buildEncounterUnits(rng, node) {
    const level = node.level;
    const region = node.region;
    if (node.type === 'heart') {
      const heart = DJ.makeEnemyUnit(DJ.MONSTER_BY_ID.heart_of_jungle, 17, rng);
      // Procedurally chosen minions: 2 from tier 4-5 pool, flavored by region tags
      const pool = DJ.MONSTERS.filter((m) => m.kind === 'normal' && m.tier >= 4);
      const picks = rng.shuffle(pool).slice(0, 2);
      const minions = picks.map((m) => {
        const u = DJ.makeEnemyUnit(m, 14, rng);
        u.maxHp = Math.round(u.maxHp * 0.6); u.hp = u.maxHp;
        u.isHeartGuard = true;
        return u;
      });
      return [heart].concat(minions);
    }
    if (node.type === 'boss') {
      const boss = DJ.MONSTER_BY_ID[node.boss];
      const b = DJ.makeEnemyUnit(boss, level + 1, rng);
      // 1-2 themed adds
      const tiers = DJ.REGIONS[region].tiers;
      const pool = DJ.MONSTERS.filter((m) => m.kind === 'normal' && tiers.includes(m.tier));
      const adds = rng.shuffle(pool).slice(0, 1).map((m) => DJ.makeEnemyUnit(m, level - 1, rng));
      return [b].concat(adds);
    }
    if (node.type === 'elite') {
      const pool = DJ.MONSTERS.filter((m) => m.kind === 'elite' && Math.abs(DJ.TIER_BASE_LEVEL[m.tier] - level) <= 5);
      const mon = pool.length ? rng.pick(pool) : rng.pick(DJ.MONSTERS.filter((m) => m.kind === 'elite'));
      const e = DJ.makeEnemyUnit(mon, level, rng);
      const tiers = DJ.REGIONS[region].tiers;
      const adds = rng.chance(0.6)
        ? rng.shuffle(DJ.MONSTERS.filter((m) => m.kind === 'normal' && tiers.includes(m.tier))).slice(0, 1).map((m) => DJ.makeEnemyUnit(m, level, rng))
        : [];
      return [e].concat(adds);
    }
    // normal battle
    return DJ.buildNormalGroup(rng, level, region);
  };

  DJ.buildNormalGroup = function (rng, level, region, tagFilter) {
    const tiers = DJ.REGIONS[region] ? DJ.REGIONS[region].tiers : [1, 2];
    let pool = DJ.MONSTERS.filter((m) => m.kind === 'normal' && tiers.includes(m.tier));
    if (tagFilter) {
      const filtered = pool.filter((m) => m.tags.includes(tagFilter));
      if (filtered.length >= 2) pool = filtered;
      else {
        const wide = DJ.MONSTERS.filter((m) => m.kind === 'normal' && m.tags.includes(tagFilter));
        if (wide.length >= 2) pool = wide;
      }
    }
    const count = rng.weighted([{ v: 2, w: 5 }, { v: 3, w: 6 }, { v: 4, w: 2.5 }]);
    const picked = [];
    for (let i = 0; i < count; i++) {
      // allow duplicates but bias toward variety
      const choices = pool.filter((m) => picked.filter((p) => p.id === m.id).length < 2);
      picked.push(rng.pick(choices.length ? choices : pool));
    }
    return picked.map((m) => DJ.makeEnemyUnit(m, level + rng.int(-1, 1), rng));
  };
})(typeof window !== 'undefined' ? window : globalThis);
