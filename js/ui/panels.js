/* Deep Jungle — overlay panels: settings, party, bag, equip, hero detail. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const P = (UI.Panels = {});

  // ---------------- Settings ----------------
  P.settings = function () {
    UI.openOverlay((panel, close) => {
      const s = DJ.profile.settings;
      panel.appendChild(UI.el('h3', null, 'Settings'));

      const slider = (label, key, fmt) => {
        const row = UI.el('div', 'set-row');
        row.appendChild(UI.el('label', null, label));
        const inp = document.createElement('input');
        inp.type = 'range'; inp.min = 0; inp.max = 100; inp.step = 1;
        inp.value = Math.round(s[key] * 100);
        inp.setAttribute('aria-label', label);
        const out = UI.el('output', null, (fmt || ((v) => v + '%'))(inp.value));
        inp.addEventListener('input', () => {
          s[key] = inp.value / 100;
          out.textContent = (fmt || ((v) => v + '%'))(inp.value);
          DJ.Audio.applySettings();
          if (key === 'sfx') DJ.sfx('hover');
        });
        inp.addEventListener('change', () => DJ.save());
        row.appendChild(inp); row.appendChild(out);
        return row;
      };
      const toggle = (label, key, onChange) => {
        const row = UI.el('div', 'switch-row');
        row.appendChild(UI.el('span', null, label));
        const sw = UI.el('label', 'switch');
        const inp = document.createElement('input');
        inp.type = 'checkbox'; inp.checked = !!s[key];
        inp.setAttribute('aria-label', label);
        const track = UI.el('span', 'track');
        inp.addEventListener('change', () => {
          s[key] = inp.checked;
          DJ.Audio.applySettings();
          if (key === 'musicOn') { if (inp.checked) DJ.Audio.playMusic(); else DJ.Audio.pauseMusic(); }
          if (key === 'sfxOn' && inp.checked) DJ.sfx('confirm');
          DJ.save();
          onChange && onChange();
        });
        sw.appendChild(inp); sw.appendChild(track);
        row.appendChild(sw);
        return row;
      };

      panel.appendChild(UI.el('h4', null, 'Audio')).style.cssText = 'margin:0 0 10px;font-size:14px;color:#8fe08a';
      panel.appendChild(toggle('Music', 'musicOn'));
      panel.appendChild(slider('Music volume', 'music'));
      panel.appendChild(toggle('Sound effects', 'sfxOn'));
      panel.appendChild(slider('Effects volume', 'sfx'));

      panel.appendChild(UI.el('h4', null, 'Gameplay')).style.cssText = 'margin:16px 0 10px;font-size:14px;color:#8fe08a';
      const speedRow = UI.el('div', 'set-row');
      speedRow.appendChild(UI.el('label', null, 'Battle speed'));
      const sel = document.createElement('select');
      sel.style.cssText = 'background:#0d1c12;border:1px solid #2c4d34;color:#e8f3e4;border-radius:8px;padding:7px 10px;font-size:13px;width:100%';
      [['1', 'Normal'], ['2', 'Fast'], ['3', 'Very fast']].forEach(([v, t]) => {
        const o = document.createElement('option'); o.value = v; o.textContent = t;
        if (String(s.speed) === v) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', () => { s.speed = parseInt(sel.value, 10); DJ.save(); DJ.sfx('click'); });
      speedRow.appendChild(sel);
      speedRow.appendChild(UI.el('output', null, ''));
      panel.appendChild(speedRow);
      panel.appendChild(toggle('Damage numbers', 'damageNumbers'));
      panel.appendChild(toggle('Screen shake and flashes', 'screenShake'));
      panel.appendChild(toggle('Autosave', 'autoSave'));

      panel.appendChild(UI.el('h4', null, 'Save data')).style.cssText = 'margin:16px 0 10px;font-size:14px;color:#8fe08a';
      const stat = UI.el('p', 'muted');
      stat.style.fontSize = '12.5px';
      const st = DJ.profile.stats;
      stat.textContent = `${DJ.profile.achievements.length}/${DJ.ACHIEVEMENTS.length} achievements · ${DJ.profile.unlocked.length}/23 adventurers · ${st.discovered}/100 monsters · ${st.runsWon} ${st.runsWon === 1 ? 'victory' : 'victories'}`;
      panel.appendChild(stat);

      const btnRow = UI.el('div');
      btnRow.style.cssText = 'display:flex;gap:8px;margin-top:14px;flex-wrap:wrap';
      const abandon = UI.el('button', 'btn danger small');
      abandon.textContent = 'Abandon expedition';
      abandon.disabled = !DJ.run || DJ.run.finished;
      abandon.addEventListener('click', () => {
        confirmDialog('Abandon this expedition?', 'Your progress in the jungle is lost. Achievements and unlocks are kept.', () => {
          DJ.bump('runsLost');
          DJ.profile.run = null;
          DJ.run = null;
          DJ.save();
          UI.closeOverlay();
          UI.Title.refresh();
          UI.show('title');
        });
      });
      const wipe = UI.el('button', 'btn danger small');
      wipe.textContent = 'Erase all save data';
      wipe.addEventListener('click', () => {
        confirmDialog('Erase everything?', 'This permanently deletes every achievement, unlocked adventurer, and compendium entry. It cannot be undone.', () => {
          DJ.wipeSave();
          DJ.run = null;
          UI.closeOverlay();
          UI.Title.refresh();
          UI.show('title');
          UI.toast('Save erased', 'Starting fresh.', 'cancel');
        });
      });
      btnRow.appendChild(abandon);
      btnRow.appendChild(wipe);
      panel.appendChild(btnRow);

      const done = UI.el('button', 'btn primary wide');
      done.textContent = 'Done';
      done.style.marginTop = '14px';
      done.addEventListener('click', close);
      panel.appendChild(done);
    });
  };

  function confirmDialog(title, text, onYes) {
    UI.openOverlay((panel, close) => {
      panel.appendChild(UI.el('h3', null, title));
      const p = UI.el('p', 'muted', text);
      p.style.cssText = 'font-size:13.5px;line-height:1.55;margin-bottom:16px';
      panel.appendChild(p);
      const row = UI.el('div');
      row.style.cssText = 'display:flex;gap:9px';
      const no = UI.el('button', 'btn');
      no.textContent = 'Cancel';
      no.style.flex = '1';
      no.addEventListener('click', close);
      const yes = UI.el('button', 'btn danger');
      yes.textContent = 'Yes, do it';
      yes.style.flex = '1';
      yes.addEventListener('click', () => { onYes(); });
      row.appendChild(no); row.appendChild(yes);
      panel.appendChild(row);
    });
  }
  P.confirm = confirmDialog;

  // ---------------- Party ----------------
  P.party = function (onClose) {
    UI.openOverlay((panel, close) => {
      const run = DJ.run;
      panel.appendChild(UI.el('h3', null, 'Party'));
      const tabs = UI.el('div', 'tabs');
      const content = UI.el('div');
      let active = 0;
      const renderTab = () => {
        Array.from(tabs.children).forEach((c, i) => c.classList.toggle('on', i === active));
        content.innerHTML = '';
        content.appendChild(heroPanelBody(run.party[active], () => { P.party(onClose); }));
      };
      run.party.forEach((h, i) => {
        const t = UI.el('div', 'tab', h.name);
        t.addEventListener('click', () => { active = i; DJ.sfx('click'); renderTab(); });
        tabs.appendChild(t);
      });
      panel.appendChild(tabs);
      panel.appendChild(content);
      renderTab();
      const done = UI.el('button', 'btn primary wide');
      done.textContent = 'Close';
      done.style.marginTop = '14px';
      done.addEventListener('click', close);
      panel.appendChild(done);
    }, onClose);
  };

  P.heroPanel = function (hero) {
    UI.openOverlay((panel, close) => {
      panel.appendChild(UI.el('h3', null, hero.name));
      panel.appendChild(heroPanelBody(hero, () => P.heroPanel(hero)));
      const done = UI.el('button', 'btn primary wide');
      done.textContent = 'Close';
      done.style.marginTop = '14px';
      done.addEventListener('click', close);
      panel.appendChild(done);
    });
  };

  function heroPanelBody(h, refresh) {
    const wrap = UI.el('div', 'hero-panel');
    const head = UI.el('div', 'hp-head');
    head.appendChild(UI.spriteEl(h.sprite, 2.5, h.name));
    const ht = UI.el('div');
    ht.style.flex = '1';
    ht.appendChild(UI.el('h4', null, `${h.name}  ·  Lv ${h.level}`));
    ht.appendChild(UI.el('div', 'role-line', DJ.HERO_BY_ID[h.id].role));
    const bars = UI.el('div', 'pb-bars');
    const mk = (cls, pct, label) => {
      const row = UI.el('div');
      row.style.cssText = 'display:flex;align-items:center;gap:7px;font-size:11px;color:#9db3a0';
      const lb = UI.el('span', null, label);
      lb.style.cssText = 'width:78px;flex:0 0 auto;text-align:right';
      const b = UI.el('div', 'mini-bar ' + cls);
      b.style.flex = '1';
      const i = UI.el('i'); i.style.width = DJ.clamp(pct, 0, 1) * 100 + '%';
      b.appendChild(i);
      row.appendChild(lb); row.appendChild(b);
      return row;
    };
    bars.appendChild(mk('hp', h.hp / h.maxHp, `HP ${h.hp}/${h.maxHp}`));
    if (h.maxMp) bars.appendChild(mk('mp', h.mp / h.maxMp, `MP ${h.mp}/${h.maxMp}`));
    bars.appendChild(mk('xp', h.xpNext ? h.xp / h.xpNext : 1, h.xpNext ? `XP ${h.xp}/${h.xpNext}` : 'MAX LEVEL'));
    ht.appendChild(bars);
    head.appendChild(ht);
    wrap.appendChild(head);

    const grid = UI.el('div', 'stat-grid');
    for (const k of ['atk', 'mag', 'def', 'spd']) {
      const box = UI.el('div', 'stat-box');
      box.appendChild(UI.el('b', null, String(DJ.effStat(h, k))));
      box.appendChild(UI.el('span', null, k));
      grid.appendChild(box);
    }
    wrap.appendChild(grid);

    wrap.appendChild(UI.el('h4', null, 'Equipment')).style.cssText = 'margin:4px 0 0;font-size:14px;color:#8fe08a';
    for (const slot of ['weapon', 'armor', 'trinket']) {
      const it = h.equip[slot];
      const row = UI.el('div', 'equip-slot');
      row.appendChild(it ? UI.spriteEl(it.icon, 1.6, slot) : blankIcon());
      const info = UI.el('div');
      info.style.flex = '1';
      info.appendChild(UI.el('div', 'slot-label', slot));
      info.appendChild(UI.el('div', 'slot-item' + (it ? ' rarity-' + it.rarity : ''), it ? it.name : '— empty —'));
      if (it) {
        const st = Object.entries(it.stats || {}).map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${k.toUpperCase()}`).join('  ');
        info.appendChild(UI.el('div', 'loot-stats', st + (it.passive ? '   ' + (DJ.PASSIVE_DESC[it.passive] || '') : '')));
      }
      row.appendChild(info);
      row.addEventListener('click', () => { DJ.sfx('click'); slotChooser(h, slot, refresh); });
      wrap.appendChild(row);
    }

    wrap.appendChild(UI.el('h4', null, 'Skills')).style.cssText = 'margin:8px 0 0;font-size:14px;color:#8fe08a';
    const hero = DJ.HERO_BY_ID[h.id];
    hero.skills.forEach((sid, i) => {
      const sk = DJ.SKILLS[sid];
      if (!sk) return;
      const lv = DJ.SKILL_UNLOCK_LEVELS[i];
      const known = h.level >= lv;
      const item = UI.el('div', 'skill-item');
      if (!known) item.style.opacity = '.5';
      const hd = UI.el('div', 'sk-head');
      hd.appendChild(UI.el('span', 'sk-name', sk.name));
      hd.appendChild(UI.el('span', 'sk-cost', known ? (sk.mp ? sk.mp + ' MP' : 'Free') : 'Lv ' + lv));
      item.appendChild(hd);
      item.appendChild(UI.el('div', 'sk-desc', sk.desc));
      wrap.appendChild(item);
    });
    return wrap;
  }

  function blankIcon() {
    const c = document.createElement('canvas');
    c.width = 26; c.height = 26;
    const x = c.getContext('2d');
    x.strokeStyle = '#2c4d34'; x.lineWidth = 2;
    x.setLineDash([3, 3]);
    x.strokeRect(2, 2, 22, 22);
    return c;
  }

  function slotChooser(hero, slot, refresh) {
    const run = DJ.run;
    UI.openOverlay((panel, close) => {
      panel.appendChild(UI.el('h3', null, `${hero.name}: ${slot}`));
      const cur = hero.equip[slot];
      if (cur) {
        const b = UI.el('button', 'btn small');
        b.textContent = 'Unequip';
        b.addEventListener('click', () => { DJ.sfx('cancel'); run.unequipItem(hero, slot); UI.closeOverlay(); refresh && refresh(); });
        panel.appendChild(UI.itemLine(cur, b));
        panel.appendChild(UI.el('hr')).style.cssText = 'border:0;border-top:1px solid #2c4d34;margin:12px 0';
      }
      const avail = run.stash.filter((i) => i.slot === slot);
      if (!avail.length) panel.appendChild(UI.el('p', 'empty-note', 'Nothing else for this slot in your bag.'));
      for (const it of avail) {
        const b = UI.el('button', 'btn small gold');
        b.textContent = 'Equip';
        b.addEventListener('click', () => {
          DJ.sfx('confirm');
          run.equipItem(hero, it);
          DJ.bump('itemsEquipped');
          if (hero.equip.weapon && hero.equip.armor && hero.equip.trinket) DJ.bump('fullSets');
          DJ.checkAndAnnounce();
          UI.closeOverlay();
          refresh && refresh();
        });
        panel.appendChild(UI.itemLine(it, b));
      }
      const done = UI.el('button', 'btn wide');
      done.textContent = 'Back';
      done.style.marginTop = '12px';
      done.addEventListener('click', close);
      panel.appendChild(done);
    });
  }

  // Quick "give this new item to whom?" chooser
  P.equipChooser = function (item, after) {
    const run = DJ.run;
    UI.openOverlay((panel, close) => {
      panel.appendChild(UI.el('h3', null, 'Equip ' + item.name));
      panel.appendChild(UI.itemLine(item));
      panel.appendChild(UI.el('p', 'muted', 'Who takes it?')).style.cssText = 'font-size:13px;margin:12px 0 8px';
      for (const h of run.party) {
        const cur = h.equip[item.slot];
        const row = UI.el('div', 'equip-slot');
        row.appendChild(UI.spriteEl(h.sprite, 1.6, h.name));
        const info = UI.el('div');
        info.style.flex = '1';
        info.appendChild(UI.el('div', 'slot-item', h.name));
        info.appendChild(UI.el('div', 'loot-desc', cur ? `Replaces ${cur.name}` : `${item.slot} slot is empty`));
        const delta = statDelta(h, item, cur);
        if (delta) info.appendChild(UI.el('div', 'loot-stats', delta));
        row.appendChild(info);
        row.addEventListener('click', () => {
          DJ.sfx('confirm');
          if (!run.stash.includes(item)) run.addItem(item);
          run.equipItem(h, item);
          DJ.bump('itemsEquipped');
          if (h.equip.weapon && h.equip.armor && h.equip.trinket) DJ.bump('fullSets');
          DJ.checkAndAnnounce();
          UI.closeOverlay();
          after && after();
        });
        panel.appendChild(row);
      }
      const skip = UI.el('button', 'btn wide');
      skip.textContent = 'Keep it in the bag';
      skip.style.marginTop = '12px';
      skip.addEventListener('click', () => { if (!run.stash.includes(item)) run.addItem(item); close(); after && after(); });
      panel.appendChild(skip);
    });
  };

  function statDelta(hero, item, cur) {
    const keys = ['atk', 'mag', 'def', 'spd', 'hp', 'mp'];
    const out = [];
    for (const k of keys) {
      const a = (item.stats && item.stats[k]) || 0;
      const b = (cur && cur.stats && cur.stats[k]) || 0;
      const d = a - b;
      if (d) out.push(`${d > 0 ? '+' : ''}${d} ${k.toUpperCase()}`);
    }
    return out.join('  ');
  }

  P.chooseHero = function (title, fn) {
    const run = DJ.run;
    UI.openOverlay((panel, close) => {
      panel.appendChild(UI.el('h3', null, title));
      for (const h of run.party) {
        const row = UI.el('div', 'equip-slot');
        row.appendChild(UI.spriteEl(h.sprite, 1.8, h.name));
        const info = UI.el('div');
        info.style.flex = '1';
        info.appendChild(UI.el('div', 'slot-item', `${h.name}  ·  Lv ${h.level}`));
        info.appendChild(UI.el('div', 'loot-desc', `HP ${h.hp}/${h.maxHp}   ATK ${DJ.effStat(h, 'atk')}   MAG ${DJ.effStat(h, 'mag')}   DEF ${DJ.effStat(h, 'def')}   SPD ${DJ.effStat(h, 'spd')}`));
        row.appendChild(info);
        row.addEventListener('click', () => { DJ.sfx('confirm'); UI.closeOverlay(); fn(h); });
        panel.appendChild(row);
      }
    });
  };

  // ---------------- Bag ----------------
  P.bag = function () {
    UI.openOverlay((panel, close) => {
      const run = DJ.run;
      panel.appendChild(UI.el('h3', null, `Bag  ·  ${run.gold} gold`));
      panel.appendChild(UI.el('h4', null, 'Potions')).style.cssText = 'margin:0 0 8px;font-size:14px;color:#8fe08a';
      let any = false;
      for (const pid of Object.keys(DJ.POTIONS)) {
        const n = run.inventory[pid] || 0;
        if (n <= 0) continue;
        any = true;
        panel.appendChild(UI.potionLine(pid, n));
      }
      if (!any) panel.appendChild(UI.el('p', 'empty-note', 'No potions. Merchants sell them; monsters drop them.'));

      panel.appendChild(UI.el('h4', null, 'Unequipped gear')).style.cssText = 'margin:14px 0 8px;font-size:14px;color:#8fe08a';
      if (!run.stash.length) panel.appendChild(UI.el('p', 'empty-note', 'Nothing spare. Everything you own is being worn.'));
      for (const it of run.stash.slice()) {
        const b = UI.el('button', 'btn small');
        b.textContent = 'Equip';
        b.addEventListener('click', () => { DJ.sfx('click'); UI.closeOverlay(); P.equipChooser(it, () => P.bag()); });
        panel.appendChild(UI.itemLine(it, b));
      }
      const done = UI.el('button', 'btn primary wide');
      done.textContent = 'Close';
      done.style.marginTop = '14px';
      done.addEventListener('click', close);
      panel.appendChild(done);
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
