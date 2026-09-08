/* Deep Jungle — a look at the whole equipment table at once, for balance work.
 * Not part of the game: opened from the console with DJ.UI.ItemDebug.open(), or by
 * loading the page with ?items in the address. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const D = (UI.ItemDebug = {});

  const SLOTS = ['weapon', 'armor', 'trinket'];
  const STAT_ORDER = ['atk', 'mag', 'def', 'hp', 'mp', 'spd'];
  const STAT_COLOR = { hp: '#4fbf5a', mp: '#4f9fe0', atk: '#e05252', mag: '#a97fe0', def: '#7fc8ff', spd: '#e8c65a' };

  // A rough single number for "how much is this worth", using the same weights the
  // simulator's auto-equip uses to decide whether an item is an upgrade.
  function score(it) {
    const s = it.stats || {};
    return (s.atk || 0) * 2 + (s.mag || 0) * 2 + (s.def || 0) * 2 +
      (s.hp || 0) * 0.25 + (s.spd || 0) * 1.5 + (s.mp || 0) * 0.2 + (it.passive ? 4 : 0);
  }

  D.open = function () {
    UI.openOverlay((panel, close) => {
      UI.overlayHeader(panel, 'Equipment table  ·  ' + DJ.ITEMS.length + ' items', close);

      // What the table looks like from a distance: how many of each kind exist, and
      // whether any tier or slot is thin.
      const counts = {};
      for (const it of DJ.ITEMS) {
        const k = it.slot + '/' + it.tier;
        counts[k] = (counts[k] || 0) + 1;
      }
      const sum = UI.el('div', 'idbg-summary');
      const head = UI.el('div', 'idbg-row idbg-head');
      head.appendChild(UI.el('span', null, ''));
      for (let t = 1; t <= 5; t++) head.appendChild(UI.el('span', null, 'T' + t));
      head.appendChild(UI.el('span', null, 'all'));
      sum.appendChild(head);
      for (const slot of SLOTS) {
        const row = UI.el('div', 'idbg-row');
        row.appendChild(UI.el('span', 'idbg-slot', slot));
        let total = 0;
        for (let t = 1; t <= 5; t++) {
          const n = counts[slot + '/' + t] || 0;
          total += n;
          const c = UI.el('span', n ? '' : 'idbg-zero', String(n));
          row.appendChild(c);
        }
        row.appendChild(UI.el('span', 'idbg-total', String(total)));
        sum.appendChild(row);
      }
      panel.appendChild(sum);

      const rarity = { common: 0, rare: 0, epic: 0 };
      for (const it of DJ.ITEMS) rarity[it.rarity]++;
      const passives = {};
      for (const it of DJ.ITEMS) if (it.passive) passives[it.passive] = (passives[it.passive] || 0) + 1;
      const note = UI.el('p', 'idbg-note');
      note.textContent =
        'Rarity: ' + Object.entries(rarity).map(([k, v]) => v + ' ' + k).join(', ') +
        '.  Passives in use: ' + Object.entries(passives).map(([k, v]) => k + ' ×' + v).join(', ') +
        '.  Unused passives: ' + Object.keys(DJ.PASSIVE_DESC).filter((k) => !passives[k]).join(', ') + '.';
      panel.appendChild(note);

      // Every item, grouped by slot then tier.
      for (const slot of SLOTS) {
        const h = UI.el('h4', 'idbg-h', slot + 's');
        panel.appendChild(h);
        const list = DJ.ITEMS.filter((i) => i.slot === slot).sort((a, b) => a.tier - b.tier || score(a) - score(b));
        let lastTier = null;
        for (const it of list) {
          if (it.tier !== lastTier) {
            lastTier = it.tier;
            const t = UI.el('div', 'idbg-tier', 'Tier ' + it.tier + '  ·  drops around level ' + ((it.tier - 1) * 3 + 1) + '-' + (it.tier * 3));
            panel.appendChild(t);
          }
          const row = UI.el('div', 'idbg-item rarity-' + it.rarity);
          if (DJ.SPRITES[it.icon]) row.appendChild(UI.spriteEl(it.icon, 1.6, it.name));
          const body = UI.el('div', 'idbg-body');
          const top = UI.el('div', 'idbg-name');
          top.appendChild(UI.el('span', 'rarity-' + it.rarity, it.name));
          top.appendChild(UI.el('span', 'idbg-price', DJ.itemPrice(it) + 'g'));
          top.appendChild(UI.el('span', 'idbg-score', 'value ' + score(it).toFixed(1)));
          body.appendChild(top);

          const stats = UI.el('div', 'idbg-stats');
          for (const k of STAT_ORDER) {
            const v = (it.stats || {})[k];
            if (!v) continue;
            const chip = UI.el('span', 'idbg-chip');
            chip.style.borderColor = STAT_COLOR[k];
            chip.appendChild(UI.el('b', null, (v > 0 ? '+' : '') + v));
            const lb = UI.el('span', null, k.toUpperCase());
            lb.style.color = STAT_COLOR[k];
            chip.appendChild(lb);
            stats.appendChild(chip);
          }
          if (it.passive) {
            const chip = UI.el('span', 'idbg-chip idbg-passive');
            chip.appendChild(UI.el('b', null, DJ.PASSIVE_DESC[it.passive] || it.passive));
            stats.appendChild(chip);
          }
          body.appendChild(stats);
          body.appendChild(UI.el('div', 'idbg-desc', it.desc));
          row.appendChild(body);
          panel.appendChild(row);
        }
      }

      // Potions get the same treatment, since they are the other half of what drops.
      panel.appendChild(UI.el('h4', 'idbg-h', 'potions'));
      for (const pid of Object.keys(DJ.POTIONS)) {
        const p = DJ.POTIONS[pid];
        const row = UI.el('div', 'idbg-item');
        if (DJ.SPRITES[p.icon]) row.appendChild(UI.spriteEl(p.icon, 1.6, p.name));
        const body = UI.el('div', 'idbg-body');
        const top = UI.el('div', 'idbg-name');
        top.appendChild(UI.el('span', null, p.name));
        top.appendChild(UI.el('span', 'idbg-price', p.price
          ? DJ.potionPrice(pid, 1) + 'g at level 1, ' + DJ.potionPrice(pid, 20) + 'g at level 20'
          : 'never sold'));
        top.appendChild(UI.el('span', 'idbg-score', p.grade + (p.cap ? ', max ' + p.cap + ' a run' : '')));
        body.appendChild(top);
        body.appendChild(UI.el('div', 'idbg-desc', p.desc));
        row.appendChild(body);
        panel.appendChild(row);
      }
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
