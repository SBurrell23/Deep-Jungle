/* Deep Jungle — shared UI helpers: screens, toasts, overlays, sprite embedding. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});

  UI.$ = (sel, el) => (el || document).querySelector(sel);
  UI.$$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  UI.el = function (tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  UI.current = 'boot';
  UI.prev = 'title';
  UI.show = function (id) {
    if (UI.current === id) return;
    const prevEl = document.getElementById(UI.current);
    if (prevEl) prevEl.classList.remove('active');
    UI.prev = UI.current;
    UI.current = id;
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
    DJ.events.emit('screen', id);
  };

  // ---- Sprite -> canvas element ----
  UI.spriteEl = function (id, scale, fallbackLabel) {
    const c = document.createElement('canvas');
    const sp = DJ.SPRITES[id];
    scale = scale || 2;
    if (sp) {
      c.width = sp.w * scale; c.height = sp.h * scale;
      const x = c.getContext('2d');
      x.imageSmoothingEnabled = false;
      const src = DJ.spriteCanvas(id, scale);
      if (src) x.drawImage(src, 0, 0);
    } else {
      c.width = 32 * scale; c.height = 32 * scale;
      DJ.drawMissing(c.getContext('2d'), 0, 0, c.width, c.height, fallbackLabel || id);
    }
    c.style.width = c.width + 'px';
    c.style.height = c.height + 'px';
    return c;
  };
  UI.spriteInto = function (canvas, id, scale) {
    const sp = DJ.SPRITES[id];
    const x = canvas.getContext('2d');
    x.clearRect(0, 0, canvas.width, canvas.height);
    x.imageSmoothingEnabled = false;
    if (!sp) { DJ.drawMissing(x, 0, 0, canvas.width, canvas.height, id); return; }
    const s = scale || Math.max(1, Math.floor(Math.min(canvas.width / sp.w, canvas.height / sp.h)));
    const src = DJ.spriteCanvas(id, s);
    x.drawImage(src, Math.round((canvas.width - src.width) / 2), Math.round((canvas.height - src.height) / 2));
  };
  // Silhouette for undiscovered compendium entries.
  UI.silhouetteEl = function (id, scale) {
    const sp = DJ.SPRITES[id];
    const c = document.createElement('canvas');
    scale = scale || 2;
    c.width = (sp ? sp.w : 32) * scale; c.height = (sp ? sp.h : 32) * scale;
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    if (sp) {
      const t = DJ.spriteTinted(id, scale, '#24402c', 1);
      if (t) x.drawImage(t, 0, 0);
    } else { x.fillStyle = '#24402c'; x.fillRect(0, 0, c.width, c.height); }
    c.style.width = c.width + 'px'; c.style.height = c.height + 'px';
    return c;
  };

  // ---- Toasts ----
  UI.toast = function (title, desc, sfx) {
    const box = UI.$('#toasts');
    const t = UI.el('div', 'toast');
    t.appendChild(UI.el('div', 't-title', title));
    if (desc) t.appendChild(UI.el('div', 't-desc', desc));
    box.appendChild(t);
    if (sfx !== false) DJ.sfx(sfx || 'achievement');
    setTimeout(() => {
      t.classList.add('fadeout');
      setTimeout(() => t.remove(), 400);
    }, 4200);
  };

  UI.announceAchievements = function (earned) {
    earned.forEach((a, i) => {
      setTimeout(() => {
        UI.toast('Achievement: ' + a.name, a.desc, 'achievement');
        if (a.unlocks) {
          const h = DJ.HERO_BY_ID[a.unlocks];
          setTimeout(() => UI.toast('Adventurer Unlocked!', h ? h.name + ' joins the roster.' : a.unlocks, 'unlock'), 900);
        }
      }, i * 700);
    });
  };

  // ---- Overlay ----
  UI.overlayOpen = false;
  UI.openOverlay = function (build, onClose, opts) {
    const ov = UI.$('#overlay');
    const panel = UI.$('#overlayPanel');
    panel.innerHTML = '';
    panel.className = 'overlay-panel' + ((opts && opts.wide) ? ' wide' : '') + ((opts && opts.xwide) ? ' xwide' : '');
    build(panel, UI.closeOverlay);
    ov.classList.remove('hidden');
    UI.overlayOpen = true;
    UI._onClose = onClose || null;
    DJ.sfx('open');
    ov.onclick = (e) => { if (e.target === ov) UI.closeOverlay(); };
  };
  // `silent` suppresses the cancel blip when the panel closes because the player
  // actually chose something.
  UI.closeOverlay = function (silent) {
    const ov = UI.$('#overlay');
    const panel = UI.$('#overlayPanel');
    // Panels that subscribe to live events listen for this to tear down cleanly.
    if (panel) panel.dispatchEvent(new CustomEvent('dj-overlay-closed'));
    ov.classList.add('hidden');
    UI.overlayOpen = false;
    if (silent !== true) DJ.sfx('cancel');
    if (UI._onClose) { const f = UI._onClose; UI._onClose = null; f(); }
  };

  // Every modal gets the same header: a title on the left and a small dismiss X on the
  // right, instead of a full-width Close button eating the bottom of the panel.
  UI.overlayHeader = function (panel, title, close, subtitleNode) {
    const head = UI.el('div', 'ov-head');
    const left = UI.el('div', 'ov-title');
    if (typeof title === 'string') left.appendChild(UI.el('h3', null, title));
    else if (title) left.appendChild(title);
    if (subtitleNode) left.appendChild(subtitleNode);
    head.appendChild(left);
    const x = UI.el('button', 'ov-close');
    x.type = 'button';
    x.innerHTML = '&times;';
    x.title = 'Close';
    x.setAttribute('aria-label', 'Close');
    x.addEventListener('click', () => close());
    head.appendChild(x);
    panel.appendChild(head);
    return head;
  };

  // ---- Instant tooltips ----
  // Native title= waits a second before appearing, which is useless for reading a
  // status icon mid-fight. These show immediately and follow the cursor.
  let tipEl = null;
  function ensureTip() {
    if (tipEl) return tipEl;
    tipEl = UI.el('div', 'tip');
    tipEl.setAttribute('role', 'tooltip');
    document.body.appendChild(tipEl);
    return tipEl;
  }
  UI.showTip = function (html, x, y) {
    const t = ensureTip();
    t.innerHTML = html;
    t.classList.add('on');
    UI.moveTip(x, y);
  };
  UI.moveTip = function (x, y) {
    const t = ensureTip();
    const r = t.getBoundingClientRect();
    let left = x + 14;
    let top = y + 16;
    if (left + r.width > innerWidth - 8) left = x - r.width - 14;
    if (top + r.height > innerHeight - 8) top = y - r.height - 12;
    t.style.left = Math.max(6, left) + 'px';
    t.style.top = Math.max(6, top) + 'px';
  };
  UI.hideTip = function () { if (tipEl) tipEl.classList.remove('on'); };

  // Attach an instant tooltip to a DOM element. `html` may be a string or a function.
  UI.tip = function (el, html) {
    el.addEventListener('mouseenter', (e) => UI.showTip(typeof html === 'function' ? html() : html, e.clientX, e.clientY));
    el.addEventListener('mousemove', (e) => UI.moveTip(e.clientX, e.clientY));
    el.addEventListener('mouseleave', UI.hideTip);
    el.addEventListener('click', UI.hideTip);
    return el;
  };

  // What each stat actually does, for the tooltips on stat boxes and bars.
  DJ.STAT_HELP = {
    hp:  { name: 'Health', text: 'How much damage this adventurer can take before falling. Reaching 0 knocks them out until they are revived.' },
    mp:  { name: 'Mana', text: 'Spent to cast abilities. Restored by resting at a campfire, by levelling up, and by blue potions.' },
    atk: { name: 'Attack', text: 'Drives damage from physical abilities and basic attacks. Reduced by the target\u2019s DEF.' },
    mag: { name: 'Magic', text: 'Drives damage from spells, and the strength of healing. Partly reduced by the target\u2019s DEF.' },
    def: { name: 'Defence', text: 'Reduces incoming damage. It counts in full against physical attacks but only partly against magic, so a heavily armoured monster is softer to spells than to swords.' },
    spd: { name: 'Speed', text: 'Sets turn order, and adds a small bonus to critical hit chance against slower foes.' },
  };
  UI.statTip = function (el, key) {
    const h = DJ.STAT_HELP[key];
    if (!h) return el;
    return UI.tip(el, `<b>${h.name}</b><span>${h.text}</span>`);
  };
  // The footnote under a status tooltip: how long it has left, how many doses have
  // piled up, how much a shield can still swallow.
  UI.statusFoot = function (id, turns, st) {
    const bits = [];
    if (st && id === 'poison' && (st.stacks || 1) > 1) bits.push(st.stacks + ' stacks');
    if (st && id === 'shield' && st.pool > 0) bits.push(st.pool + ' damage left to soak');
    if (turns) bits.push(turns + ' turn' + (turns === 1 ? '' : 's') + ' remaining');
    return bits.length ? '<i>' + bits.join('  \u00b7  ') + '</i>' : '';
  };
  // `grants` is how long the ability being read hands this status out for, as opposed to
  // `turns`, which is how long an effect already on a unit has left. With neither, fall
  // back to the four that last the same from every source: those carry no inline marker,
  // so the tooltip is the only place their length is written.
  const lasts = (n) => `<i>Lasts ${n} turn${n === 1 ? '' : 's'}</i>`;
  UI.statusTip = function (el, id, turns, st, grants) {
    const d = DJ.STATUS[id];
    if (!d) return el;
    return UI.tip(el, () => {
      let foot = '';
      if (grants) foot = lasts(grants);
      else if (turns) foot = UI.statusFoot(id, turns, st);
      else {
        const fixed = (DJ.FIXED_STATUS_TURNS || {})[id];
        if (fixed) foot = lasts(fixed);
      }
      return `<b style="color:${d.color}">${d.name}</b><span>${d.desc}</span>` + foot;
    });
  };

  // ---- Status names inside ability text ----
  // An ability that says it inflicts Poison should say so in the colour of Poison, and
  // the word itself should explain the effect on hover. Descriptions stay plain strings;
  // the markup is built here, once, for every screen that shows them.
  const STATUS_WORDS = (function () {
    const forms = {
      poison: ['poison', 'poisons', 'poisoned'],
      burn:   ['burn', 'burns', 'burned', 'burning'],
      bleed:  ['bleed', 'bleeds', 'bleeding'],
      stun:   ['stun', 'stuns', 'stunned'],
      weak:   ['weak', 'weaken', 'weakens', 'weakened'],
      slow:   ['slow', 'slows', 'slowed'],
      blind:  ['blind', 'blinds', 'blinded'],
      guard:  ['guard', 'guards'],
      haste:  ['haste'],
      regen:  ['regen'],
      shield: ['shield', 'shields', 'shielded'],
      rage:   ['rage'],
      taunt:  ['taunt', 'taunts'],
      shock:  ['shock', 'shocks', 'shocked'],
      chill:  ['chill', 'chills', 'chilled'],
      thorns: ['thorns'],
      charge: ['charging'],
    };
    const map = {};
    const all = [];
    for (const id in forms) for (const w of forms[id]) { map[w] = id; all.push(w); }
    // Longest first, so "poisoned" is never matched as "poison" with a stray tail.
    all.sort((a, b) => b.length - a.length);
    // No word-boundary escapes here on purpose: a literal class plus a lookahead does the
    // same job and survives every editor and shell this file has been through.
    return { map, re: new RegExp('(^|[^A-Za-z])(' + all.join('|') + ')(?![A-Za-z])', 'gi') };
  })();

  // These four last the same number of turns from every source in the game, so the field
  // guide states it once and an ability card does not repeat it.
  const FIXED_LENGTH = { bleed: true, poison: true, burn: true, stun: true };

  // How long each status an ability grants will actually last, keyed by status id.
  UI.skillTurns = function (sk) {
    const out = {};
    if (!sk) return out;
    const take = (st) => { if (st && st.id && !FIXED_LENGTH[st.id]) out[st.id] = st.turns || 2; };
    take(sk.status);
    for (const st of (sk.self ? (Array.isArray(sk.self) ? sk.self : [sk.self]) : [])) take(st);
    return out;
  };

  // Fill an element with text, tinting any status name it contains. `turns` maps a status
  // id to how long this particular ability grants it, which is stamped after the word.
  UI.statusText = function (text, el, turns) {
    const box = el || UI.el('span');
    const re = STATUS_WORDS.re;
    re.lastIndex = 0;
    let last = 0, m;
    while ((m = re.exec(text))) {
      const at = m.index + m[1].length;
      if (at > last) box.appendChild(document.createTextNode(text.slice(last, at)));
      const id = STATUS_WORDS.map[m[2].toLowerCase()];
      const d = DJ.STATUS[id];
      // Statuses are proper nouns here, so the word is capitalised whatever case the
      // description happened to use. The suffix is left alone: "slows" becomes "Slows",
      // not "Slow".
      const word = m[2].charAt(0).toUpperCase() + m[2].slice(1);
      const tag = UI.el('span', 'st-word', word);
      const n = turns && turns[id];
      if (d) { tag.style.color = d.color; UI.statusTip(tag, id, null, null, n); }
      box.appendChild(tag);
      // Just the number, so an ability that grants three of these still fits on its
      // button. The tooltip on the word says what it counts.
      if (n) {
        const t = UI.el('span', 'st-turns', '(' + n + ')');
        if (d) t.style.color = d.color;
        box.appendChild(t);
      }
      last = at + m[2].length;
    }
    if (last < text.length) box.appendChild(document.createTextNode(text.slice(last)));
    return box;
  };

  // The one-line description under an ability name, wherever it is shown.
  UI.skillDesc = function (sk, cls) {
    return UI.statusText(sk.desc || '', UI.el('div', cls || 'sk-desc'), UI.skillTurns(sk));
  };

  UI.flash = function () {
    if (!DJ.profile.settings.screenShake) return;
    const f = UI.$('#fxFlash');
    f.classList.remove('go');
    void f.offsetWidth;
    f.classList.add('go');
  };

  // ---- Small builders ----
  UI.statBar = function (label, value, max, color) {
    const row = UI.el('div', 'stat-row');
    row.appendChild(UI.el('b', null, label));
    UI.statTip(row, label.toLowerCase());
    const track = UI.el('div', 'stat-track');
    const fill = UI.el('div', 'stat-fill');
    fill.style.width = DJ.clamp(value / max, 0, 1) * 100 + '%';
    fill.style.background = color;
    track.appendChild(fill);
    row.appendChild(track);
    row.appendChild(UI.el('span', null, String(value)));
    return row;
  };

  UI.itemLine = function (item, extra) {
    const row = UI.el('div', 'loot-row');
    row.appendChild(UI.spriteEl(item.icon, 2, item.slot));
    const info = UI.el('div');
    const nm = UI.el('div', 'loot-name rarity-' + item.rarity, item.name);
    // The slot matters when deciding what to buy, so it rides next to the name.
    nm.appendChild(UI.el('span', 'loot-slot', item.slot));
    info.appendChild(nm);
    const st = Object.entries(item.stats || {}).map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${k.toUpperCase()}`).join('  ');
    if (st) info.appendChild(UI.el('div', 'loot-stats', st));
    info.appendChild(UI.el('div', 'loot-desc', item.desc));
    if (item.passive) info.appendChild(UI.el('div', 'loot-stats', DJ.PASSIVE_DESC[item.passive] || item.passive));
    row.appendChild(info);
    if (extra) { const sp = UI.el('div'); sp.style.marginLeft = 'auto'; sp.appendChild(extra); row.appendChild(sp); }
    return row;
  };

  UI.potionLine = function (pid, count, extra) {
    const p = DJ.POTIONS[pid];
    const row = UI.el('div', 'loot-row');
    row.appendChild(UI.spriteEl(p.icon, 2, 'potion'));
    const info = UI.el('div');
    info.appendChild(UI.el('div', 'loot-name', p.name));
    info.appendChild(UI.el('div', 'loot-desc', p.desc));
    row.appendChild(info);
    if (count != null) row.appendChild(UI.el('div', 'loot-count', '×' + count));
    if (extra) { const sp = UI.el('div'); sp.style.marginLeft = count != null ? '12px' : 'auto'; sp.appendChild(extra); row.appendChild(sp); }
    return row;
  };

  // A thin "14 / 25" bar for an achievement still in progress. Returns null when the
  // achievement is a one-off event, so callers can just append the result and move on.
  UI.achProgressBar = function (ach, profile) {
    const pr = DJ.achProgress(ach, profile);
    if (!pr) return null;
    const wrap = UI.el('div', 'ach-prog');
    const track = UI.el('div', 'ap-track');
    const fill = UI.el('div', 'ap-fill');
    fill.style.width = Math.round(pr.pct * 100) + '%';
    track.appendChild(fill);
    wrap.appendChild(track);
    wrap.appendChild(UI.el('span', 'ap-num', DJ.fmt(pr.cur) + ' / ' + DJ.fmt(pr.goal)));
    return wrap;
  };

  // Per-level growth as a row of chips, each tinted like its bar in the stats above.
  // Returns a heading plus the row, appended together, so both hero panels read alike.
  UI.growthRow = function (hero, colors) {
    const wrap = document.createDocumentFragment();
    wrap.appendChild(UI.el('div', 'grow-head', 'Gained per level'));
    const row = UI.el('div', 'grow-row');
    const grown = ['hp', 'mp', 'atk', 'mag', 'def', 'spd'].filter((k) => (hero.grow[k] || 0) >= 0.5);
    if (!grown.length) row.appendChild(UI.el('span', 'muted', 'No growth.'));
    for (const k of grown) {
      const chip = UI.el('span', 'grow-chip');
      chip.style.borderColor = colors[k];
      chip.appendChild(UI.el('b', null, '+' + hero.grow[k]));
      const lbl = UI.el('span', null, k.toUpperCase());
      lbl.style.color = colors[k];
      chip.appendChild(lbl);
      row.appendChild(chip);
    }
    wrap.appendChild(row);
    return wrap;
  };

  // How many expeditions this adventurer has carried to the Heart. Counted when the
  // Heart dies rather than when the run ends, so a party that went on into The Beyond
  // and fell there still gets the credit.
  DJ.heartWinsWith = (heroId) => ((DJ.profile.stats || {}).wonWith || {})[heroId] || 0;

  // The gold tick that marks one. Returns null for an adventurer who has not done it,
  // so callers can append the result without checking first.
  UI.heartWinBadge = function (heroId) {
    const n = DJ.heartWinsWith(heroId);
    if (!n) return null;
    const b = UI.el('div', 'won-badge', '\u2713');
    UI.tip(b, '<b>Beat the Heart of the Jungle</b><span>' + (n === 1
      ? 'You have finished an expedition with this adventurer.'
      : 'You have finished ' + n + ' expeditions with this adventurer.') + '</span>');
    return b;
  };

  UI.goldTag = function (amount) {
    const w = UI.el('span', 'gold-tag');
    if (DJ.SPRITES.icon_gold) w.appendChild(UI.spriteEl('icon_gold', 1.1, 'gold'));
    w.appendChild(UI.el('span', null, String(amount)));
    return w;
  };

  UI.heroBadge = function (h, scale) {
    const wrap = UI.el('div', 'pb-hero' + (h.alive ? '' : ' dead'));
    wrap.appendChild(UI.spriteEl(h.sprite, scale || 1.5, h.name));
    const info = UI.el('div', 'pb-info');
    const name = UI.el('div', 'pb-name');
    name.appendChild(UI.el('span', null, h.name));
    name.appendChild(UI.el('span', 'lv', 'Lv' + h.level));
    info.appendChild(name);
    const bars = UI.el('div', 'pb-bars');
    const mk = (cls, pct) => { const b = UI.el('div', 'mini-bar ' + cls); const i = UI.el('i'); i.style.width = DJ.clamp(pct, 0, 1) * 100 + '%'; b.appendChild(i); return b; };
    bars.appendChild(mk('hp', h.hp / h.maxHp));
    if (h.maxMp > 0) bars.appendChild(mk('mp', h.mp / h.maxMp));
    bars.appendChild(mk('xp', h.xpNext ? h.xp / h.xpNext : 1));
    info.appendChild(bars);
    wrap.appendChild(info);
    return wrap;
  };

  // ---- Canvas sizing (handles HiDPI) ----
  UI.fitCanvas = function (canvas) {
    const dpr = Math.min(root.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    return { w: r.width, h: r.height, dpr };
  };

  // Wire generic back buttons.
  UI.initBackButtons = function () {
    UI.$$('[data-back]').forEach((b) => {
      b.addEventListener('click', () => {
        DJ.sfx('cancel');
        const t = b.dataset.back;
        if (t === 'auto') UI.show(DJ.run && !DJ.run.finished ? 'map' : 'title');
        else UI.show(t);
      });
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
