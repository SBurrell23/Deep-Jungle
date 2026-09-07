/* Deep Jungle — expedition history: every finished run, with the numbers behind it. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const H = (UI.History = {});

  let selected = 0;      // index into profile.history
  let filter = 'all';    // all | won | lost

  H.open = function () {
    selected = 0;
    H.initToolbar();
    H.render();
    UI.show('history');
  };

  H.initToolbar = function () {
    let bar = UI.$('#histToolbar');
    if (bar) return;
    bar = UI.el('div', 'ach-toolbar');
    bar.id = 'histToolbar';
    bar.appendChild(UI.el('span', 'chip-label', 'Show'));
    [['all', 'All'], ['won', 'Survived'], ['lost', 'Lost']].forEach(([id, text]) => {
      const c = UI.el('div', 'chip' + (id === filter ? ' on' : ''), text);
      c.dataset.f = id;
      c.addEventListener('click', () => {
        filter = id;
        selected = 0;
        UI.$$('.chip', bar).forEach((x) => x.classList.toggle('on', x.dataset.f === id));
        DJ.sfx('click');
        H.render();
      });
      bar.appendChild(c);
    });
    const list = UI.$('#histList');
    list.parentNode.insertBefore(bar, list);
  };

  function entries() {
    const all = DJ.profile.history || [];
    if (filter === 'won') return all.filter((e) => e.won);
    if (filter === 'lost') return all.filter((e) => !e.won);
    return all;
  }

  // ---- formatting ----
  function clock(ms) {
    const total = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
    if (h) return h + 'h ' + m + 'm';
    return m + 'm ' + String(s).padStart(2, '0') + 's';
  }
  function when(at) {
    const d = new Date(at);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    if (sameDay) return 'Today, ' + time;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ', ' + time;
  }
  const num = (n) => (n || 0).toLocaleString();

  H.render = function () {
    const list = UI.$('#histList');
    list.innerHTML = '';
    const rows = entries();
    UI.$('#histCount').textContent = (DJ.profile.history || []).length + ' logged';

    if (!rows.length) {
      list.appendChild(UI.el('p', 'empty-note', filter === 'all'
        ? 'No expeditions finished yet. Come back once the jungle has had its say.'
        : 'Nothing here under this filter.'));
      renderDetail(null);
      return;
    }
    if (selected >= rows.length) selected = 0;

    rows.forEach((e, i) => {
      const row = UI.el('div', 'hist-row' + (i === selected ? ' on' : '') + (e.won ? ' won' : ' lost'));
      row.tabIndex = 0;

      const top = UI.el('div', 'hr-top');
      top.appendChild(UI.el('span', 'hr-verdict', e.won ? 'Survived' : 'Lost'));
      top.appendChild(UI.el('span', 'hr-when', when(e.at)));
      row.appendChild(top);

      const crew = UI.el('div', 'hr-crew');
      for (const m of e.party) {
        const w = UI.el('div', 'hr-face');
        if (DJ.SPRITES[m.id]) w.appendChild(UI.spriteEl(m.id, 1.15, m.name));
        w.appendChild(UI.el('span', null, 'Lv ' + m.level));
        UI.tip(w, '<b>' + m.name + '</b><span>Level ' + m.level + ' at the end of the run.</span>');
        crew.appendChild(w);
      }
      row.appendChild(crew);

      const foot = UI.el('div', 'hr-foot');
      foot.appendChild(UI.el('span', null, clock(e.ms)));
      foot.appendChild(UI.el('span', null, e.nodes + ' nodes'));
      foot.appendChild(UI.el('span', null, e.region));
      row.appendChild(foot);

      const pick = () => { selected = i; DJ.sfx('click'); H.render(); };
      row.addEventListener('click', pick);
      row.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(); }
      });
      list.appendChild(row);
    });

    renderDetail(rows[selected]);
  };

  // A titled block of label/value pairs. Everything on the right is built from these.
  function block(box, title, pairs) {
    const shown = pairs.filter((p) => p);
    if (!shown.length) return;
    box.appendChild(UI.el('h4', 'hd-head', title));
    const grid = UI.el('div', 'hd-grid');
    for (const [label, value, tone] of shown) {
      const cell = UI.el('div', 'hd-cell');
      const v = UI.el('b', null, String(value));
      if (tone) v.style.color = tone;
      cell.appendChild(v);
      cell.appendChild(UI.el('span', null, label));
      grid.appendChild(cell);
    }
    box.appendChild(grid);
  }

  function renderDetail(e) {
    const box = UI.$('#histDetail');
    box.innerHTML = '';
    if (!e) {
      box.appendChild(UI.el('p', 'muted center', 'Finish an expedition and its full record shows up here.'));
      return;
    }
    const t = e.tally || {};
    const n = e.nodeTypes || {};

    const head = UI.el('div', 'hd-title');
    const verdict = UI.el('div', 'hd-verdict ' + (e.won ? 'won' : 'lost'),
      e.won ? 'The jungle is quiet' : 'The jungle keeps you');
    head.appendChild(verdict);
    head.appendChild(UI.el('div', 'hd-sub', when(e.at) + '  ·  ' + clock(e.ms) + '  ·  seed ' + e.seed));
    if (e.flawless) head.appendChild(UI.el('span', 'hd-badge', 'Flawless'));
    box.appendChild(head);

    // The party, at the size they finished
    const crew = UI.el('div', 'hd-crew');
    for (const m of e.party) {
      const c = UI.el('div', 'hd-member' + (m.alive ? '' : ' fallen'));
      if (DJ.SPRITES[m.id]) c.appendChild(UI.spriteEl(m.id, 2, m.name));
      c.appendChild(UI.el('div', 'hdm-name', m.name));
      c.appendChild(UI.el('div', 'hdm-lv', 'Level ' + m.level + (m.alive ? '' : '  ·  fallen')));
      crew.appendChild(c);
    }
    box.appendChild(crew);

    block(box, 'Journey', [
      ['Nodes visited', num(e.nodes)],
      ['Furthest region', e.region],
      ['Column reached', e.col + ' / ' + (e.totalCols ? e.totalCols - 1 : e.col)],
      ['Gold carried out', num(e.goldLeft)],
    ]);

    // n.battles counts every fight, elites and bosses included, so the plain figure is
    // the remainder. Split out this way the three add back up to the total.
    block(box, 'Nodes completed', [
      ['Ordinary battles', num(Math.max(0, (n.battles || 0) - (n.elites || 0) - (n.bosses || 0)))],
      ['Elite fights', num(n.elites)],
      ['Boss fights', num(n.bosses)],
      ['Campfires', num(n.rests)],
      ['Treasures', num(n.treasures)],
      ['Trading posts', num(n.merchants)],
      ['Shrines', num(n.shrines)],
      ['Events', num(n.events)],
      ['Puzzles', num(n.puzzles)],
      ['Training', num(n.trainings)],
      ['Traps', num(n.traps)],
    ]);

    block(box, 'Combat', [
      ['Battles won', num(t.battlesWon)],
      ['Monsters felled', num(t.kills)],
      ['Elites felled', num(t.elitesKilled)],
      ['Minions felled', num(t.summonKills)],
      ['Damage dealt', num(t.damageDealt), '#ff9b8a'],
      ['Damage taken', num(t.damageTaken), '#ffb0b0'],
      ['Healing done', num(t.healingDone), '#8fe08a'],
      ['Biggest hit', num(e.bestHit), '#ffd27a'],
      ['Critical hits', num(t.crits)],
      ['Statuses inflicted', num(t.statusesInflicted)],
      ['Abilities cast', num(t.skillsUsed)],
      ['Guards raised', num(t.defends)],
      ['Longest battle', e.longestBattle ? e.longestBattle + ' rounds' : '0'],
      ['Untouched wins', num(t.perfectBattles)],
      ['One-round wins', num(t.oneRoundWins)],
      ['Heroes revived', num(t.revives)],
      ['Heroes downed', num(t.heroKOs)],
    ]);

    block(box, 'Spoils', [
      ['Gold earned', num(t.goldEarned), '#ffd966'],
      ['Gold spent', num(t.goldSpent), '#ffd966'],
      ['Equipment found', num(t.itemsFound)],
      ['Equipment worn', num(t.itemsEquipped)],
      ['Epics found', num(t.epicsFound), '#d0b0ff'],
      ['Potions drunk', num(t.potionsUsed)],
    ]);

    block(box, 'Discovery', [
      ['New monsters', num(t.discovered)],
      ['Puzzles solved', num(t.puzzlesSolved)],
      ['Riddles answered', num(t.riddlesSolved)],
      ['Totems recalled', num(t.totemsSolved)],
      ['Vine locks picked', num(t.vinesSolved)],
    ]);
  }
})(typeof window !== 'undefined' ? window : globalThis);
