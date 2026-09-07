/* Deep Jungle — monster compendium and achievement list. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const C = (UI.Compendium = {});

  const TIER_COLOR = ['#666', '#6fc98a', '#7fd4e8', '#e8c65a', '#f0904b', '#e05252'];
  const TIER_NAME = ['', 'Undergrowth', 'Shallows', 'Deep Green', 'Old Growth', 'The Deep'];
  let filter = 'all';
  let query = '';

  C.open = function () {
    C.render();
    UI.show('compendium');
  };

  C.init = function () {
    const chips = [
      ['all', 'All'], ['seen', 'Discovered'], ['unseen', 'Unknown'],
      ['t1', 'Tier 1'], ['t2', 'Tier 2'], ['t3', 'Tier 3'], ['t4', 'Tier 4'], ['t5', 'Tier 5'],
      ['elite', 'Elites'], ['boss', 'Bosses'],
    ];
    const box = UI.$('#compFilters');
    box.innerHTML = '';
    chips.forEach(([id, label]) => {
      const c = UI.el('div', 'chip' + (id === filter ? ' on' : ''), label);
      c.dataset.f = id;
      c.addEventListener('click', () => {
        filter = id;
        UI.$$('.chip', box).forEach((x) => x.classList.toggle('on', x.dataset.f === id));
        DJ.sfx('click');
        C.render();
      });
      box.appendChild(c);
    });
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
      if (filter === 'seen' && !seen) continue;
      if (filter === 'unseen' && seen) continue;
      if (filter.startsWith('t') && filter.length === 2 && m.tier !== parseInt(filter[1], 10)) continue;
      if (filter === 'elite' && m.kind !== 'elite') continue;
      if (filter === 'boss' && m.kind !== 'boss' && m.kind !== 'final') continue;
      if (query && seen && !m.name.toLowerCase().includes(query) && !m.tags.join(' ').includes(query)) continue;
      if (query && !seen) continue;
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
        card.appendChild(UI.el('div', 'comp-meta', `defeated ×${entry.killed}`));
        card.addEventListener('click', () => { DJ.sfx('page'); detail(m, entry); });
      }
      grid.appendChild(card);
    }
    if (!shown) grid.appendChild(UI.el('p', 'empty-note', query ? 'Nothing matches that.' : 'Nothing here yet.'));
    const n = Object.keys(comp).length;
    UI.$('#compCount').textContent = `${n} / ${DJ.MONSTERS.length}`;
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
  const A = (UI.Achievements = {});
  A.open = function () {
    A.render();
    UI.show('achievements');
  };
  A.render = function () {
    const list = UI.$('#achList');
    list.innerHTML = '';
    const have = new Set(DJ.profile.achievements);
    const sorted = DJ.ACHIEVEMENTS.slice().sort((a, b) => {
      const ad = have.has(a.id), bd = have.has(b.id);
      if (ad !== bd) return ad ? -1 : 1;
      if (!!a.unlocks !== !!b.unlocks) return a.unlocks ? -1 : 1;
      return 0;
    });
    for (const a of sorted) {
      const done = have.has(a.id);
      const row = UI.el('div', 'ach-row' + (done ? ' done' : ''));
      row.appendChild(UI.el('div', 'ach-icon', done ? '🏆' : '🔒'));
      const body = UI.el('div', 'ach-body');
      body.appendChild(UI.el('div', 'ach-name', a.name));
      body.appendChild(UI.el('div', 'ach-desc', a.desc));
      if (a.unlocks) {
        const h = DJ.HERO_BY_ID[a.unlocks];
        body.appendChild(UI.el('div', 'ach-unlock', (done ? 'Unlocked: ' : 'Unlocks: ') + (h ? h.name : a.unlocks)));
      }
      row.appendChild(body);
      list.appendChild(row);
    }
    UI.$('#achCount').textContent = `${have.size} / ${DJ.ACHIEVEMENTS.length}`;
  };
})(typeof window !== 'undefined' ? window : globalThis);
