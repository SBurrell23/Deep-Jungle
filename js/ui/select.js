/* Deep Jungle — adventurer selection (pick 3 of 23). */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const S = (UI.Select = {});

  let picked = [];
  let focused = null;      // the card that was last clicked
  let hovered = null;      // the card under the cursor, which wins for the preview

  const STAT_MAX = { hp: 130, mp: 60, atk: 20, mag: 20, def: 16, spd: 16 };
  const STAT_COLOR = { hp: '#4fbf5a', mp: '#4f9fe0', atk: '#e05252', mag: '#a97fe0', def: '#7fc8ff', spd: '#e8c65a' };

  S.open = function () {
    picked = [];
    focused = null;
    render();
    UI.show('select');
  };

  function render() {
    const grid = UI.$('#heroGrid');
    grid.innerHTML = '';
    grid.onmouseleave = () => { hovered = null; renderDetail(); };
    // Only what you have earned. The locked roster lives on the Adventurers screen, where
    // it can show the achievement each one is waiting on; here it was just dead cards.
    for (const h of DJ.HEROES.filter((x) => DJ.isUnlocked(x.id))) {
      const card = UI.el('div', 'hero-card' + (picked.includes(h.id) ? ' selected' : ''));
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', h.name + ', ' + h.role);
      card.appendChild(UI.spriteEl(h.id, 2.75, h.name));
      card.appendChild(UI.el('div', 'hero-name', h.name));
      card.appendChild(UI.el('div', 'hero-role', h.role));
      const idx = picked.indexOf(h.id);
      if (idx >= 0) card.appendChild(UI.el('div', 'pick-num', String(idx + 1)));
      const act = () => selectCard(h, true);
      card.addEventListener('click', act);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
      // Hovering is enough to preview: no click needed just to read a kit.
      card.addEventListener('mouseenter', () => { hovered = h.id; renderDetail(); });
      card.addEventListener('focus', () => { hovered = h.id; renderDetail(); });
      grid.appendChild(card);
    }
    renderDetail();
    renderParty();
  }

  function selectCard(h, unlocked) {
    focused = h.id;
    if (!unlocked) { DJ.sfx('error'); renderDetail(); render(); return; }
    const i = picked.indexOf(h.id);
    if (i >= 0) { picked.splice(i, 1); DJ.sfx('cancel'); }
    else if (picked.length < 3) { picked.push(h.id); DJ.sfx('confirm'); }
    else { DJ.sfx('error'); }
    render();
  }

  function renderDetail() {
    const box = UI.$('#heroDetail');
    box.innerHTML = '';
    const showing = hovered || focused;
    if (!showing) {
      box.appendChild(UI.el('p', 'muted center', 'Hover an adventurer to see their stats and skills.'));
      return;
    }
    const h = DJ.HERO_BY_ID[showing];
    const unlocked = DJ.isUnlocked(h.id);
    const head = UI.el('div');
    head.style.cssText = 'display:flex;gap:12px;align-items:center;margin-bottom:8px';
    head.appendChild(unlocked ? UI.spriteEl(h.id, 2.5, h.name) : UI.silhouetteEl(h.id, 2.5));
    const ht = UI.el('div');
    ht.appendChild(UI.el('h3', null, unlocked ? h.name : '???'));
    ht.appendChild(UI.el('div', 'role-line', unlocked ? h.role : 'Locked'));
    head.appendChild(ht);
    box.appendChild(head);

    if (!unlocked) {
      const a = DJ.unlockRequirement(h.id);
      const note = UI.el('div', 'unlock-note');
      note.innerHTML = `<b>Locked.</b> Unlocks with the achievement <b>${a ? a.name : '???'}</b>.`;
      if (a) note.appendChild(UI.el('div', null, a.desc));
      box.appendChild(note);
      return;
    }

    box.appendChild(UI.el('p', 'desc', h.desc));
    const stats = UI.el('div', 'stat-rows');
    for (const k of ['hp', 'mp', 'atk', 'mag', 'def', 'spd']) {
      stats.appendChild(UI.statBar(k.toUpperCase(), h.base[k], STAT_MAX[k], STAT_COLOR[k]));
    }
    box.appendChild(stats);

    const gt = UI.el('p', 'muted');
    gt.style.fontSize = '11.5px';
    gt.textContent = 'Per level: ' + ['hp', 'atk', 'mag', 'def', 'spd']
      .filter((k) => h.grow[k] >= 0.5)
      .map((k) => `+${h.grow[k]} ${k.toUpperCase()}`).join(', ');
    box.appendChild(gt);

    box.appendChild(UI.el('h4', null, 'Skills')).style.cssText = 'margin:14px 0 8px;font-size:14px';
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
  }

  function renderParty() {
    const strip = UI.$('#partyStrip');
    strip.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const slot = UI.el('div', 'party-slot' + (picked[i] ? ' filled' : ''));
      if (picked[i]) slot.appendChild(UI.spriteEl(picked[i], 1.3, ''));
      strip.appendChild(slot);
    }
    UI.$('#selCount').textContent = picked.length + ' / 3';
    UI.$('#btnBegin').disabled = picked.length !== 3;
  }

  S.init = function () {
    UI.$('#btnBegin').addEventListener('click', () => {
      if (picked.length !== 3) return;
      DJ.sfx('confirm');
      DJ.startRun(picked.slice());
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
