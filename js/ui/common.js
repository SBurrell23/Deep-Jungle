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
    info.appendChild(UI.el('div', 'loot-name', p.name + (count != null ? ` ×${count}` : '')));
    info.appendChild(UI.el('div', 'loot-desc', p.desc));
    row.appendChild(info);
    if (extra) { const sp = UI.el('div'); sp.style.marginLeft = 'auto'; sp.appendChild(extra); row.appendChild(sp); }
    return row;
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
