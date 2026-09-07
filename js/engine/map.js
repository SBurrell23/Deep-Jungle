/* Deep Jungle — procedural branching map generator (left to right).
 * The map is a DAG of columns. Column 0 is the start hut; the last column is the
 * Heart of the Jungle. Every path converges on the Heart.
 * Three regions, each ending in a region boss column that all paths pass through.
 */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});

  DJ.REGIONS = [
    { id: 'undergrowth', name: 'The Undergrowth', boss: 'bramble_king', tiers: [1, 2], color: '#3f7d3a', bg: '#0f2418',
      blurb: 'Wet green dark. Everything here is small, hungry, and numerous.' },
    { id: 'mireheart', name: 'The Mire', boss: 'mother_of_fangs', tiers: [2, 3, 4], color: '#7a6b2f', bg: '#1d2110',
      blurb: 'The ground stops being ground. Things move under the water.' },
    { id: 'canopy', name: 'The High Canopy', boss: 'vine_warden', tiers: [4, 5], color: '#2f6b7a', bg: '#0d1c24',
      blurb: 'Above the mist, where the old guardians still keep their posts.' },
  ];

  // Node types and their base weights per region index.
  const NODE_WEIGHTS = [
    // region 0
    { battle: 46, elite: 5, rest: 10, treasure: 9, shrine: 7, event: 10, merchant: 5, puzzle: 6, training: 4, trap: 4, mystery: 5 },
    // region 1
    { battle: 44, elite: 9, rest: 9, treasure: 9, shrine: 7, event: 9, merchant: 5, puzzle: 6, training: 4, trap: 5, mystery: 5 },
    // region 2
    { battle: 42, elite: 12, rest: 9, treasure: 9, shrine: 6, event: 8, merchant: 5, puzzle: 5, training: 4, trap: 5, mystery: 5 },
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

  DJ.generateMap = function (seed) {
    const rng = new DJ.RNG(seed);
    const cols = [];
    let colIndex = 0;
    const push = (nodes) => { cols.push(nodes); colIndex++; };

    // Column 0: start
    push([{ type: 'start', region: 0 }]);

    let level = 1;
    for (let r = 0; r < 3; r++) {
      const n = REGION_COLS[r];
      for (let c = 0; c < n; c++) {
        // 2-4 nodes wide, occasionally 4 for real branching
        const width = rng.weighted([{ v: 2, w: 3 }, { v: 3, w: 5 }, { v: 4, w: 2.2 }]);
        const nodes = [];
        const usedTypes = {};
        for (let i = 0; i < width; i++) {
          let t = rng.weighted(Object.entries(NODE_WEIGHTS[r]).map(([k, w]) => ({ v: k, w })));
          // avoid duplicates in the same column when possible (more meaningful choices)
          let tries = 0;
          while (usedTypes[t] && tries++ < 6) t = rng.weighted(Object.entries(NODE_WEIGHTS[r]).map(([k, w]) => ({ v: k, w })));
          // no elite in the first column of region 0
          if (t === 'elite' && r === 0 && c === 0) t = 'battle';
          usedTypes[t] = true;
          nodes.push({ type: t, region: r });
        }
        // guarantee at least one battle-ish node per column so progression feels consistent
        if (!nodes.some((x) => x.type === 'battle' || x.type === 'elite')) nodes[rng.int(0, nodes.length - 1)].type = 'battle';
        // guarantee a rest before each boss column
        if (c === n - 1 && !nodes.some((x) => x.type === 'rest')) nodes[rng.int(0, nodes.length - 1)].type = 'rest';
        push(nodes);
      }
      // Region boss column (single node, everything converges)
      push([{ type: 'boss', region: r, boss: DJ.REGIONS[r].boss }]);
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
        const span = b.length === 1 ? 1 : rng.weighted([{ v: 1, w: 3 }, { v: 2, w: 5 }, { v: 3, w: 1.5 }]);
        const lo = DJ.clamp(center - Math.floor((span - 1) / 2), 0, b.length - 1);
        const hi = DJ.clamp(lo + span - 1, 0, b.length - 1);
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

    return { seed, cols, nodeById, startId: cols[0][0].id, heartId: cols[cols.length - 1][0].id, totalCols: cols.length };
  };

  // Node "level" drives enemy strength and reward scale.
  DJ.nodeLevel = function (col, type) {
    let lvl = 1 + Math.floor(col * 0.43);
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
