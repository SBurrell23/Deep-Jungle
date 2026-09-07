/* Deep Jungle — overlay panels: settings, party, bag, equip, hero detail. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const P = (UI.Panels = {});

  // ---------------- Settings ----------------
  P.settings = function () {
    UI.openOverlay((panel, close) => {
      const s = DJ.profile.settings;
      UI.overlayHeader(panel, 'Settings', close);

      const slider = (label, key, onInput) => {
        const row = UI.el('div', 'set-row');
        row.appendChild(UI.el('label', null, label));
        const inp = document.createElement('input');
        inp.type = 'range'; inp.min = 0; inp.max = 100; inp.step = 1;
        inp.value = Math.round(s[key] * 100);
        inp.setAttribute('aria-label', label);
        const out = UI.el('output', null, inp.value + '%');
        inp.addEventListener('input', () => {
          s[key] = inp.value / 100;
          out.textContent = inp.value + '%';
          DJ.Audio.applySettings();
          if (onInput) onInput();
        });
        inp.addEventListener('change', () => DJ.save());
        row.appendChild(inp); row.appendChild(out);
        return row;
      };
      const toggle = (label, key, onChange, title) => {
        const row = UI.el('div', 'switch-row');
        const lbl = UI.el('span', null, label);
        if (title) { row.title = title; }
        row.appendChild(lbl);
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
          onChange && onChange(inp.checked);
        });
        sw.appendChild(inp); sw.appendChild(track);
        row.appendChild(sw);
        return row;
      };
      const heading = (t) => {
        const h = UI.el('h4', 'set-head', t);
        return h;
      };

      const cols = UI.el('div', 'settings-cols');

      // ---------- left: sound and music ----------
      const left = UI.el('div', 'settings-col');
      left.appendChild(heading('Sound'));
      left.appendChild(toggle('Sound effects', 'sfxOn'));
      left.appendChild(slider('Effects volume', 'sfx', () => DJ.sfx('hover')));

      left.appendChild(heading('Music'));
      left.appendChild(toggle('Music', 'musicOn'));
      left.appendChild(slider('Music volume', 'music'));

      // Now-playing card with skip and single-track repeat.
      const np = UI.el('div', 'now-playing');
      const npLabel = UI.el('div', 'np-label', 'Now playing');
      const npName = UI.el('div', 'np-name', '');
      np.appendChild(npLabel);
      np.appendChild(npName);
      const npRow = UI.el('div', 'np-row');
      const nextBtn = UI.el('button', 'btn small');
      nextBtn.textContent = 'Next \u25b8';
      nextBtn.title = 'Skip to the next track in the queue';
      nextBtn.addEventListener('click', () => { DJ.sfx('click'); DJ.Audio.nextTrack(false); });
      npRow.appendChild(nextBtn);

      const loopWrap = UI.el('label', 'np-loop');
      const loopBox = document.createElement('input');
      loopBox.type = 'checkbox';
      loopBox.checked = !!DJ.Audio.loopOne;
      loopBox.addEventListener('change', () => {
        DJ.Audio.setLoopOne(loopBox.checked);
        DJ.sfx('click');
        syncNowPlaying();
      });
      loopWrap.appendChild(loopBox);
      loopWrap.appendChild(UI.el('span', null, 'Loop this song'));
      loopWrap.title = 'Repeat the current track instead of moving on';
      npRow.appendChild(loopWrap);
      np.appendChild(npRow);
      left.appendChild(np);

      function syncNowPlaying() {
        const t = DJ.Audio.currentTrack ? DJ.Audio.currentTrack() : null;
        npName.textContent = t ? t.name : '\u2014';
        const boss = DJ.Audio.bossMode;
        npLabel.textContent = boss ? 'Boss music' : 'Now playing';
        np.classList.toggle('boss', !!boss);
        nextBtn.disabled = !!boss;
        loopBox.disabled = !!boss;
        loopBox.checked = !!DJ.Audio.loopOne;
      }
      syncNowPlaying();
      const off = DJ.events.on('music', syncNowPlaying);
      const npTimer = setInterval(syncNowPlaying, 1000);
      panel.addEventListener('dj-overlay-closed', () => { off(); clearInterval(npTimer); });

      cols.appendChild(left);

      // ---------- right: gameplay and save data ----------
      const right = UI.el('div', 'settings-col');
      right.appendChild(heading('Gameplay'));
      const speedRow = UI.el('div', 'set-row');
      speedRow.appendChild(UI.el('label', null, 'Battle speed'));
      const sel = document.createElement('select');
      sel.className = 'set-select';
      [['1', 'Normal'], ['2', 'Fast'], ['3', 'Very fast']].forEach(([v, t]) => {
        const o = document.createElement('option'); o.value = v; o.textContent = t;
        if (String(s.speed) === v) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', () => { s.speed = parseInt(sel.value, 10); DJ.save(); DJ.sfx('click'); });
      speedRow.appendChild(sel);
      speedRow.appendChild(UI.el('output', null, ''));
      right.appendChild(speedRow);
      right.appendChild(toggle('Damage numbers', 'damageNumbers'));
      right.appendChild(toggle('Screen shake and flashes', 'screenShake'));
      right.appendChild(toggle('Autosave', 'autoSave'));

      right.appendChild(heading('Save data'));
      const stat = UI.el('p', 'muted set-stats');
      const st = DJ.profile.stats;
      stat.textContent = `${DJ.profile.achievements.length}/${DJ.ACHIEVEMENTS.length} achievements \u00b7 ${DJ.profile.unlocked.length}/23 adventurers \u00b7 ${st.discovered}/100 monsters \u00b7 ${st.runsWon} ${st.runsWon === 1 ? 'victory' : 'victories'}`;
      right.appendChild(stat);

      const inRun = !!(DJ.run && !DJ.run.finished);
      const btnCol = UI.el('div', 'set-buttons');

      // Leaving for the title screen keeps the expedition; only "Abandon" throws it away.
      const toTitle = UI.el('button', 'btn small');
      toTitle.textContent = 'Return to main menu';
      toTitle.title = 'Keeps your expedition. You can continue it from the title screen.';
      toTitle.disabled = UI.current === 'title';
      toTitle.addEventListener('click', () => {
        if (inRun) DJ.saveRun(DJ.run);
        DJ.save();
        UI.closeOverlay(true);
        UI.Title.refresh();
        UI.show('title');
      });
      btnCol.appendChild(toTitle);

      const abandon = UI.el('button', 'btn danger small');
      abandon.textContent = 'Abandon expedition';
      abandon.disabled = !inRun;
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
      btnCol.appendChild(abandon);

      right.appendChild(btnCol);

      cols.appendChild(right);
      panel.appendChild(cols);
    }, null, { wide: true });
  };

  function confirmDialog(title, text, onYes) {
    UI.openOverlay((panel, close) => {
      UI.overlayHeader(panel, title, close);
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
  // All three adventurers side by side, so gear can be compared without switching tabs.
  P.party = function (onClose) {
    UI.openOverlay((panel, close) => {
      const run = DJ.run;
      UI.overlayHeader(panel, 'Party', close);
      const cols = UI.el('div', 'party-cols');
      for (const h of run.party) {
        const col = UI.el('div', 'party-col' + (h.alive ? '' : ' dead'));
        col.appendChild(heroPanelBody(h, () => { UI.closeOverlay(true); P.party(onClose); }));
        cols.appendChild(col);
      }
      panel.appendChild(cols);
    }, onClose, { xwide: true });
  };

  P.heroPanel = function (hero) {
    UI.openOverlay((panel, close) => {
      UI.overlayHeader(panel, hero.name, close);
      panel.appendChild(heroPanelBody(hero, () => { UI.closeOverlay(true); P.heroPanel(hero); }));
    }, null, { wide: false });
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

    const grid = UI.el('div', 'stat-grid four');
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
      UI.overlayHeader(panel, `${hero.name}: ${slot}`, close);
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
    });
  }

  // Quick "give this new item to whom?" chooser. `after` fires once the item has been
  // dealt with, either equipped or deliberately kept in the bag, so callers can drop it
  // from a spoils list.
  P.equipChooser = function (item, after) {
    const run = DJ.run;
    let settled = false;
    const settle = () => { if (!settled) { settled = true; after && after(); } };
    UI.openOverlay((panel, close) => {
      UI.overlayHeader(panel, 'Equip ' + item.name, close);
      panel.appendChild(UI.itemLine(item));
      const q = UI.el('p', 'muted', 'Who takes it?');
      q.style.cssText = 'font-size:13px;margin:14px 0 4px';
      panel.appendChild(q);
      const list = UI.el('div', 'equip-list');
      for (const h of run.party) {
        const cur = h.equip[item.slot];
        const row = UI.el('div', 'equip-slot');
        row.appendChild(UI.spriteEl(h.sprite, 1.7, h.name));
        const info = UI.el('div');
        info.style.flex = '1';
        info.appendChild(UI.el('div', 'slot-item', h.name));
        info.appendChild(UI.el('div', 'loot-desc', cur ? `Replaces ${cur.name}` : `${item.slot} slot is empty`));
        const delta = statDeltaEl(h, item, cur);
        if (delta) info.appendChild(delta);
        row.appendChild(info);
        row.addEventListener('click', () => {
          DJ.sfx('confirm');
          if (!run.stash.includes(item)) run.addItem(item);
          run.equipItem(h, item);
          DJ.bump('itemsEquipped');
          if (h.equip.weapon && h.equip.armor && h.equip.trinket) DJ.bump('fullSets');
          DJ.checkAndAnnounce();
          UI.closeOverlay(true);
          settle();
        });
        list.appendChild(row);
      }
      panel.appendChild(list);
      const skip = UI.el('button', 'btn wide');
      skip.textContent = 'Keep In Bag';
      skip.style.marginTop = '12px';
      skip.addEventListener('click', () => {
        if (!run.stash.includes(item)) run.addItem(item);
        UI.closeOverlay(true);
        settle();
      });
      panel.appendChild(skip);
    }, settle);
  };

  // Comparing the candidate against what the hero already wears. Gains read green,
  // losses read red, so a downgrade is obvious before you commit to it.
  function statDeltaEl(hero, item, cur) {
    const keys = ['atk', 'mag', 'def', 'spd', 'hp', 'mp'];
    const wrap = UI.el('div', 'delta-row');
    let any = false;
    for (const k of keys) {
      const a = (item.stats && item.stats[k]) || 0;
      const b = (cur && cur.stats && cur.stats[k]) || 0;
      const d = a - b;
      if (!d) continue;
      any = true;
      const chip = UI.el('span', 'delta ' + (d > 0 ? 'up' : 'down'),
        `${d > 0 ? '+' : '\u2212'}${Math.abs(d)} ${k.toUpperCase()}`);
      wrap.appendChild(chip);
    }
    // A passive the old item did not have is itself an upgrade worth calling out.
    const curPassive = cur && cur.passive;
    if (item.passive && item.passive !== curPassive) {
      any = true;
      wrap.appendChild(UI.el('span', 'delta up', DJ.PASSIVE_DESC[item.passive] || item.passive));
    } else if (curPassive && curPassive !== item.passive) {
      any = true;
      wrap.appendChild(UI.el('span', 'delta down', 'loses ' + (DJ.PASSIVE_DESC[curPassive] || curPassive)));
    }
    if (!any) { wrap.appendChild(UI.el('span', 'delta same', 'no change')); }
    return wrap;
  }


  P.chooseHero = function (title, fn, candidates) {
    const run = DJ.run;
    const pool = candidates && candidates.length ? candidates : run.party;
    UI.openOverlay((panel, close) => {
      UI.overlayHeader(panel, title, close);
      const list = UI.el('div', 'equip-list');
      for (const h of pool) {
        const row = UI.el('div', 'equip-slot');
        row.appendChild(UI.spriteEl(h.sprite, 1.8, h.name));
        const info = UI.el('div');
        info.style.flex = '1';
        info.appendChild(UI.el('div', 'slot-item', `${h.name}  ·  Lv ${h.level}`));
        info.appendChild(UI.el('div', 'loot-desc', `HP ${h.hp}/${h.maxHp}   ATK ${DJ.effStat(h, 'atk')}   MAG ${DJ.effStat(h, 'mag')}   DEF ${DJ.effStat(h, 'def')}   SPD ${DJ.effStat(h, 'spd')}`));
        row.appendChild(info);
        row.addEventListener('click', () => { DJ.sfx('confirm'); UI.closeOverlay(true); fn(h); });
        list.appendChild(row);
      }
      panel.appendChild(list);
    });
  };

  // Drinking a potion on the map: apply it, show what changed, then return to the bag.
  function applyFieldPotion(pid, target) {
    const run = DJ.run;
    const res = run.usePotionOutOfBattle(pid, target);
    if (!res) { DJ.sfx('error'); P.bag(); return; }
    DJ.bump('potionsUsed');
    DJ.bumpMap('potionsByType', pid);
    DJ.saveRun(run);
    DJ.checkAndAnnounce();
    DJ.sfx(res.potion.effect.revive != null ? 'revive' : 'potion');
    UI.closeOverlay(true);
    UI.openOverlay((panel, close) => {
      UI.overlayHeader(panel, res.potion.name, close);
      for (const line of res.lines) {
        const row = UI.el('div', 'loot-row');
        row.appendChild(UI.spriteEl(line.unit.sprite, 1.8, line.unit.name));
        const info = UI.el('div');
        info.appendChild(UI.el('div', 'loot-name', line.unit.name));
        info.appendChild(UI.el('div', 'loot-stats', line.text));
        row.appendChild(info);
        panel.appendChild(row);
      }
      const back = UI.el('button', 'btn wide');
      back.textContent = 'Back to bag';
      back.style.marginTop = '12px';
      back.addEventListener('click', () => { UI.closeOverlay(true); P.bag(); });
      panel.appendChild(back);
    }, () => { if (UI.current === 'map') UI.Map.refresh(); });
  }

  // ---------------- Bag ----------------
  P.bag = function () {
    UI.openOverlay((panel, close) => {
      const run = DJ.run;
      const title = UI.el('div');
      const h3 = UI.el('h3', null, 'Bag');
      h3.style.cssText = 'display:flex;align-items:center;gap:10px';
      h3.appendChild(UI.goldTag(run.gold));
      title.appendChild(h3);
      UI.overlayHeader(panel, title, close);

      const cols = UI.el('div', 'bag-cols');

      const potions = UI.el('div', 'bag-col');
      potions.appendChild(UI.el('h4', null, 'Potions'));
      const pScroll = UI.el('div', 'scroll');
      let any = false;
      for (const pid of Object.keys(DJ.POTIONS)) {
        const n = run.inventory[pid] || 0;
        if (n <= 0) continue;
        any = true;
        const btn = UI.el('button', 'btn small');
        btn.textContent = 'Use';
        const inField = DJ.potionUsableOutOfBattle(pid);
        const useful = inField && run.potionHasEffect(pid);
        btn.disabled = !useful;
        btn.title = !inField ? 'Only has an effect during battle'
          : useful ? 'Use it now' : 'Nobody would benefit right now';
        btn.addEventListener('click', () => {
          DJ.sfx('click');
          const e = DJ.POTIONS[pid].effect;
          if (e.party) { applyFieldPotion(pid, null); return; }
          const candidates = e.revive != null
            ? run.party.filter((h) => !h.alive)
            : run.party.filter((h) => h.alive);
          if (candidates.length === 1) { applyFieldPotion(pid, candidates[0]); return; }
          UI.closeOverlay(true);
          P.chooseHero(`Use ${DJ.POTIONS[pid].name} on whom?`, (h) => applyFieldPotion(pid, h), candidates);
        });
        pScroll.appendChild(UI.potionLine(pid, n, btn));
      }
      if (!any) pScroll.appendChild(UI.el('p', 'empty-note', 'No potions. Merchants sell them; monsters drop them.'));
      potions.appendChild(pScroll);
      cols.appendChild(potions);

      const gear = UI.el('div', 'bag-col');
      gear.appendChild(UI.el('h4', null, 'Unequipped gear'));
      const gScroll = UI.el('div', 'scroll');
      if (!run.stash.length) gScroll.appendChild(UI.el('p', 'empty-note', 'Nothing spare. Everything you own is being worn.'));
      for (const it of run.stash.slice()) {
        const b = UI.el('button', 'btn small');
        b.textContent = 'Equip';
        b.addEventListener('click', () => { DJ.sfx('click'); UI.closeOverlay(true); P.equipChooser(it, () => P.bag()); });
        gScroll.appendChild(UI.itemLine(it, b));
      }
      gear.appendChild(gScroll);
      cols.appendChild(gear);

      panel.appendChild(cols);
    }, null, { wide: true });
  };
})(typeof window !== 'undefined' ? window : globalThis);
