/* Deep Jungle — monster compendium and achievement list. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const C = (UI.Compendium = {});

  const TIER_COLOR = ['#666', '#6fc98a', '#7fd4e8', '#e8c65a', '#f0904b', '#e05252'];
  const TIER_NAME = ['', 'Undergrowth', 'Shallows', 'Deep Green', 'Old Growth', 'The Deep'];

  // Two independent filters, so "discovered" can be combined with a tier or rank.
  let known = 'all';        // all | seen | unseen
  let kind = 'all';         // all | t1..t5 | elite | boss
  let query = '';

  C.open = function () {
    C.render();
    UI.show('compendium');
  };

  C.init = function () {
    const box = UI.$('#compFilters');
    box.innerHTML = '';

    const group = (label, options, get, set) => {
      const g = UI.el('div', 'chip-group');
      g.appendChild(UI.el('span', 'chip-label', label));
      options.forEach(([id, text]) => {
        const c = UI.el('div', 'chip' + (id === get() ? ' on' : ''), text);
        c.dataset.f = id;
        c.addEventListener('click', () => {
          set(id);
          UI.$$('.chip', g).forEach((x) => x.classList.toggle('on', x.dataset.f === get()));
          DJ.sfx('click');
          C.render();
        });
        g.appendChild(c);
      });
      box.appendChild(g);
      return g;
    };

    group('Status', [['all', 'All'], ['seen', 'Discovered'], ['unseen', 'Unknown']],
      () => known, (v) => { known = v; });
    group('Kind', [['all', 'Any'], ['t1', 'Tier 1'], ['t2', 'Tier 2'], ['t3', 'Tier 3'],
      ['t4', 'Tier 4'], ['t5', 'Tier 5'], ['elite', 'Elites'], ['boss', 'Bosses']],
      () => kind, (v) => { kind = v; });

    const search = UI.$('#compSearch');
    search.addEventListener('input', () => { query = search.value.trim().toLowerCase(); C.render(); });
  };

  C.render = function () {
    const grid = UI.$('#compGrid');
    grid.innerHTML = '';
    const comp = DJ.profile.compendium;
    let shown = 0;
    for (const m of DJ.MONSTERS) {
      const entry = comp[m.id];
      const seen = !!entry;
      if (known === 'seen' && !seen) continue;
      if (known === 'unseen' && seen) continue;
      if (kind.length === 2 && kind[0] === 't' && m.tier !== parseInt(kind[1], 10)) continue;
      if (kind === 'elite' && m.kind !== 'elite') continue;
      if (kind === 'boss' && m.kind !== 'boss' && m.kind !== 'final') continue;
      if (query) {
        if (!seen) continue;
        if (!m.name.toLowerCase().includes(query) && !m.tags.join(' ').includes(query)) continue;
      }
      shown++;
      const card = UI.el('div', 'comp-card' + (seen ? '' : ' undiscovered'));
      card.appendChild(seen ? UI.spriteEl(m.id, 2, m.name) : UI.silhouetteEl(m.id, 2));
      card.appendChild(UI.el('div', 'comp-name', seen ? m.name : '???'));
      const meta = UI.el('div', 'comp-meta');
      const dot = UI.el('span', 'tier-dot');
      dot.style.background = TIER_COLOR[m.tier];
      meta.appendChild(dot);
      meta.appendChild(document.createTextNode(seen
        ? (m.kind === 'final' ? 'Final Boss' : m.kind === 'boss' ? 'Boss' : m.kind === 'elite' ? 'Elite' : TIER_NAME[m.tier])
        : 'Undiscovered'));
      card.appendChild(meta);
      if (seen) {
        card.appendChild(UI.el('div', 'comp-meta', `defeated \u00d7${entry.killed}`));
        card.addEventListener('click', () => { DJ.sfx('page'); detail(m, entry); });
      }
      grid.appendChild(card);
    }
    if (!shown) grid.appendChild(UI.el('p', 'empty-note', query ? 'Nothing matches that.' : 'Nothing here yet.'));
    UI.$('#compCount').textContent = `${Object.keys(comp).length} / ${DJ.MONSTERS.length}`;
  };

  // Open one monster's entry from anywhere, so the battle screen can show it mid-fight.
  C.inspect = function (monsterId) {
    const m = DJ.MONSTER_BY_ID[monsterId];
    if (!m) return false;
    detail(m, DJ.profile.compendium[monsterId] || { seen: 0, killed: 0 });
    return true;
  };

  function detail(m, entry) {
    UI.openOverlay((panel, close) => {
      UI.overlayHeader(panel, m.name, close);
      const sp = UI.spriteEl(m.id, 4, m.name);
      sp.className = 'detail-sprite';
      panel.appendChild(sp);
      const sub = UI.el('p', 'center muted');
      sub.style.cssText = 'font-size:12px;margin:0 0 4px;letter-spacing:.6px;text-transform:uppercase';
      sub.textContent = (m.kind === 'final' ? 'Final Boss' : m.kind === 'boss' ? 'Region Boss' : m.kind === 'elite' ? 'Elite' : TIER_NAME[m.tier]) + `  ·  Tier ${m.tier}`;
      panel.appendChild(sub);

      const tags = UI.el('div', 'tag-row');
      for (const t of m.tags) tags.appendChild(UI.el('span', 'tag', t));
      panel.appendChild(tags);

      const desc = UI.el('p', 'center');
      desc.style.cssText = 'font-style:italic;color:#a8c0aa;font-size:13.5px;line-height:1.55;margin:12px 4px';
      desc.textContent = m.desc;
      panel.appendChild(desc);

      const grid = UI.el('div', 'stat-grid');
      const stats = [['HP', m.hp], ['ATK', m.atk], ['MAG', m.mag], ['DEF', m.def], ['SPD', m.spd], ['Lv', DJ.TIER_BASE_LEVEL[m.tier]]];
      for (const [k, v] of stats) {
        const b = UI.el('div', 'stat-box');
        b.appendChild(UI.el('b', null, String(v)));
        b.appendChild(UI.el('span', null, k));
        UI.statTip(b, k.toLowerCase());
        grid.appendChild(b);
      }
      panel.appendChild(grid);

      panel.appendChild(UI.el('h4', null, 'Abilities')).style.cssText = 'margin:14px 0 8px;font-size:14px;color:#8fe08a';
      for (const sid of m.skills) {
        const sk = DJ.SKILLS[sid];
        if (!sk) continue;
        const item = UI.el('div', 'skill-item');
        const hd = UI.el('div', 'sk-head');
        hd.appendChild(UI.el('span', 'sk-name', sk.name));
        hd.appendChild(UI.el('span', 'sk-cost', sk.target === 'enemies' ? 'All' : sk.target === 'enemy' ? 'Single' : 'Support'));
        item.appendChild(hd);
        item.appendChild(UI.el('div', 'sk-desc', sk.desc));
        panel.appendChild(item);
      }

      const rec = UI.el('p', 'center muted');
      rec.style.cssText = 'font-size:12.5px;margin-top:14px';
      rec.textContent = `Encountered ${entry.seen}×  ·  Defeated ${entry.killed}×`;
      panel.appendChild(rec);

    });
  }

  // ---------------- Achievements ----------------
  // Grouped by theme so the list reads as categories rather than one long column.
  const ACH_GROUPS = [
    { id: 'unlock',  name: 'Adventurers',  test: (a) => !!a.unlocks },
    { id: 'progress', name: 'Progress',    ids: ['into_the_green','undergrowth','canopy','warden_slayer','heart_x3','heart_x10','persistent','obsessed','fallen','speedrunner'] },
    { id: 'combat',  name: 'Combat',       ids: ['brawler','warrior','champion','hunter','exterminator','big_hit','massive_hit','legendary_hit','crit_happens','crit_master','flawless_x5','one_round','blitz_x10','last_stand','clutch','elite_x20','poisoner','arsonist','bleeder','debuffer','healer','great_healer','damage_10k','defender','marathon','minion_masher','revivalist'] },
    { id: 'bestiary', name: 'Bestiary',    ids: ['beast_hunter','bug_squasher','gardener','gravedigger','exorcist','herpetologist','demolisher','dragon_slayer','mycologist','birdwatcher','humanitarian','elementalist','discover_5','discover_30','discover_85','discover_100'] },
    { id: 'explore', name: 'Exploration',  ids: ['wanderer','pathfinder','shopper','big_spender','rich','hoarder','looter','epic_find','fully_geared','storyteller','riddler','totem_memory','vine_untangler','puzzle_master','trapped','blessed','trained','chemist'] },
    { id: 'heroes',  name: 'Heroes',       ids: ['level_5','level_15','roster_10','roster_23','variety','starters','all_casters','goblin_win','completionist'] },
  ];

  const A = (UI.Achievements = {});
  let achSort = 'all';   // all | todo | done

  A.open = function () {
    A.initToolbar();
    A.render();
    UI.show('achievements');
  };

  A.initToolbar = function () {
    let bar = UI.$('#achToolbar');
    if (bar) return;
    bar = UI.el('div', 'ach-toolbar');
    bar.id = 'achToolbar';
    bar.appendChild(UI.el('span', 'chip-label', 'Show'));
    [['all', 'All'], ['todo', 'Not earned'], ['done', 'Earned']].forEach(([id, text]) => {
      const c = UI.el('div', 'chip' + (id === achSort ? ' on' : ''), text);
      c.dataset.f = id;
      c.addEventListener('click', () => {
        achSort = id;
        UI.$$('.chip', bar).forEach((x) => x.classList.toggle('on', x.dataset.f === id));
        DJ.sfx('click');
        A.render();
      });
      bar.appendChild(c);
    });
    const list = UI.$('#achList');
    list.parentNode.insertBefore(bar, list);
  };

  A.render = function () {
    const list = UI.$('#achList');
    list.innerHTML = '';
    const have = new Set(DJ.profile.achievements);

    const claimed = new Set();
    const groups = ACH_GROUPS.map((g) => {
      const items = DJ.ACHIEVEMENTS.filter((a) => {
        if (claimed.has(a.id)) return false;
        const mine = g.test ? g.test(a) : g.ids.includes(a.id);
        if (mine) claimed.add(a.id);
        return mine;
      });
      return { name: g.name, items };
    });
    // Anything not explicitly categorised still gets a home.
    const leftovers = DJ.ACHIEVEMENTS.filter((a) => !claimed.has(a.id));
    if (leftovers.length) groups.push({ name: 'Other', items: leftovers });

    let anyShown = false;
    for (const g of groups) {
      const visible = g.items.filter((a) => {
        const done = have.has(a.id);
        return achSort === 'all' || (achSort === 'done' ? done : !done);
      });
      // Earned first inside each group.
      visible.sort((a, b) => (have.has(b.id) ? 1 : 0) - (have.has(a.id) ? 1 : 0));
      if (!visible.length) continue;
      anyShown = true;

      const head = UI.el('div', 'ach-group-head');
      head.appendChild(UI.el('h3', null, g.name));
      const earned = g.items.filter((a) => have.has(a.id)).length;
      head.appendChild(UI.el('span', 'ag-count', `${earned} / ${g.items.length}`));
      list.appendChild(head);

      for (const a of visible) {
        const done = have.has(a.id);
        const row = UI.el('div', 'ach-row' + (done ? ' done' : ''));
        row.appendChild(UI.el('div', 'ach-icon', done ? '\u{1F3C6}' : '\u{1F512}'));
        const body = UI.el('div', 'ach-body');
        body.appendChild(UI.el('div', 'ach-name', a.name));
        body.appendChild(UI.el('div', 'ach-desc', a.desc));
        if (!done) {
          const bar = UI.achProgressBar(a);
          if (bar) body.appendChild(bar);
        }
        if (a.unlocks) {
          const h = DJ.HERO_BY_ID[a.unlocks];
          body.appendChild(UI.el('div', 'ach-unlock', (done ? 'Unlocked: ' : 'Unlocks: ') + (h ? h.name : a.unlocks)));
        }
        row.appendChild(body);
        list.appendChild(row);
      }
    }
    if (!anyShown) list.appendChild(UI.el('p', 'empty-note', achSort === 'done' ? 'Nothing earned yet.' : 'Everything here is earned.'));
    UI.$('#achCount').textContent = `${have.size} / ${DJ.ACHIEVEMENTS.length}`;
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* Deep Jungle — adventurer roster: every hero's stats and skills, locked ones hidden. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const R = (UI.Roster = {});

  const STAT_MAX = { hp: 130, mp: 60, atk: 20, mag: 20, def: 16, spd: 16 };
  const STAT_COLOR = { hp: '#4fbf5a', mp: '#4f9fe0', atk: '#e05252', mag: '#a97fe0', def: '#7fc8ff', spd: '#e8c65a' };

  let rosterHover = null;

  R.open = function () {
    rosterHover = null;
    R.render();
    UI.show('roster');
  };

  R.render = function () {
    const grid = UI.$('#rosterGrid');
    grid.innerHTML = '';
    grid.onmouseleave = () => { rosterHover = null; renderPanel(); };
    // Everyone you have earned comes first, in roster order, then the silhouettes. Sorting
    // a copy leaves DJ.HEROES alone, since party setup and saves rely on its order.
    const ordered = DJ.HEROES.slice().sort(
      (a, b) => (DJ.isUnlocked(b.id) ? 1 : 0) - (DJ.isUnlocked(a.id) ? 1 : 0));
    for (const h of ordered) {
      const unlocked = DJ.isUnlocked(h.id);
      const card = UI.el('div', 'roster-card' + (unlocked ? '' : ' locked'));
      card.tabIndex = 0;
      card.appendChild(unlocked ? UI.spriteEl(h.id, 3.0, h.name) : UI.silhouetteEl(h.id, 3.0));
      card.appendChild(UI.el('div', 'rc-name', unlocked ? h.name : '???'));
      card.appendChild(UI.el('div', 'rc-role', unlocked ? h.role : 'Locked'));
      if (unlocked && !h.unlock) card.appendChild(UI.el('div', 'rc-tag', 'Starter'));
      else if (!unlocked) {
        const a = DJ.unlockRequirement(h.id);
        card.appendChild(UI.el('div', 'rc-tag locked', a ? a.name : 'Locked'));
      }
      if (unlocked) {
        const badge = UI.heartWinBadge(h.id);
        if (badge) card.appendChild(badge);
      }
      const show = () => { rosterHover = h.id; renderPanel(); };
      card.addEventListener('mouseenter', show);
      card.addEventListener('focus', show);
      card.addEventListener('click', () => { DJ.sfx('page'); rosterHover = h.id; renderPanel(); });
      grid.appendChild(card);
    }
    UI.$('#rosterCount').textContent = `${DJ.profile.unlocked.length} / ${DJ.HEROES.length}`;
    renderPanel();
  };

  // The right-hand panel mirrors the party-setup screen: hover to read a full kit.
  function renderPanel() {
    const box = UI.$('#rosterDetail');
    if (!box) return;
    box.innerHTML = '';
    if (!rosterHover) {
      box.appendChild(UI.el('p', 'muted center', 'Hover an adventurer to see their stats and skills.'));
      return;
    }
    const h = DJ.HERO_BY_ID[rosterHover];
    const unlocked = DJ.isUnlocked(h.id);

    const head = UI.el('div');
    head.style.cssText = 'display:flex;gap:12px;align-items:center;margin-bottom:8px';
    head.appendChild(unlocked ? UI.spriteEl(h.id, 2.5, h.name) : UI.silhouetteEl(h.id, 2.5));
    const ht = UI.el('div');
    ht.appendChild(UI.el('h3', null, unlocked ? h.name : '???'));
    ht.appendChild(UI.el('div', 'role-line', unlocked ? h.role + (h.unlock ? '' : '  \u00b7  Starter') : 'Locked'));
    head.appendChild(ht);
    box.appendChild(head);

    if (!unlocked) {
      const a = DJ.unlockRequirement(h.id);
      const note = UI.el('div', 'unlock-note');
      note.innerHTML = `<b>Locked.</b> Unlocks with the achievement <b>${a ? a.name : '???'}</b>.`;
      if (a) {
        note.appendChild(UI.el('div', null, a.desc));
        const bar = UI.achProgressBar(a);
        if (bar) note.appendChild(bar);
      }
      box.appendChild(note);
      return;
    }

    box.appendChild(UI.el('p', 'desc', h.desc));
    const stats = UI.el('div', 'stat-rows');
    for (const k of ['hp', 'mp', 'atk', 'mag', 'def', 'spd']) {
      stats.appendChild(UI.statBar(k.toUpperCase(), h.base[k], STAT_MAX[k], STAT_COLOR[k]));
    }
    box.appendChild(stats);

    // Growth used to be one comma-run of numbers. As a row of chips, each tinted like its
    // stat bar above, you can see at a glance which stats this adventurer actually gains.
    box.appendChild(UI.growthRow(h, STAT_COLOR));

    const sh = UI.el('h4', null, 'Skills');
    sh.style.cssText = 'margin:14px 0 8px;font-size:14px;color:#8fe08a';
    box.appendChild(sh);
    h.skills.forEach((sid, i) => {
      const sk = DJ.SKILLS[sid];
      if (!sk) return;
      const item = UI.el('div', 'skill-item');
      const hd = UI.el('div', 'sk-head');
      hd.appendChild(UI.el('span', 'sk-name', sk.name));
      const meta = UI.el('span', 'sk-meta');
      meta.appendChild(UI.el('span', 'sk-cost', sk.mp ? sk.mp + ' MP' : 'Free'));
      const sc = DJ.skillScaling(sk);
      if (sc) meta.appendChild(UI.el('span', 'a-scale ' + (sc === 'MAG' ? 'sc-mag' : 'sc-phys'), sc));
      hd.appendChild(meta);
      item.appendChild(hd);
      item.appendChild(UI.el('div', 'sk-desc', sk.desc));
      const lv = DJ.SKILL_UNLOCK_LEVELS[i];
      if (lv > 1) item.appendChild(UI.el('div', 'sk-lvl', 'Unlocks at level ' + lv));
      box.appendChild(item);
    });

    // Under the kit, a reminder of how this adventurer was earned. Starters say so plainly
    // rather than leaving a gap where every other card has a line.
    const src = UI.el('div', 'unlock-earned');
    const req = DJ.unlockRequirement(h.id);
    if (req) {
      src.innerHTML = `<span class="ue-label">Unlocked by</span> <b>${req.name}</b>`;
      src.appendChild(UI.el('div', 'ue-desc', req.desc));
    } else {
      src.innerHTML = '<span class="ue-label">Unlocked by</span> <b>Starter</b>';
      src.appendChild(UI.el('div', 'ue-desc', 'Available from your very first expedition.'));
    }
    box.appendChild(src);
  }

})(typeof window !== 'undefined' ? window : globalThis);
