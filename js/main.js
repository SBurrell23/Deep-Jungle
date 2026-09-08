/* Deep Jungle — boot, wiring, run lifecycle. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});

  DJ.run = null;

  // ---------------- boot ----------------
  function setBoot(pct, msg) {
    const f = UI.$('#bootFill');
    if (f) f.style.width = pct + '%';
    const m = UI.$('#bootMsg');
    if (m && msg) m.textContent = msg;
  }

  function missingSpriteReport() {
    const need = [];
    for (const h of DJ.HEROES) if (!DJ.SPRITES[h.id]) need.push(h.id);
    for (const m of DJ.MONSTERS) if (!DJ.SPRITES[m.id]) need.push(m.id);
    for (const k in DJ.NODE_INFO) if (!DJ.SPRITES[DJ.NODE_INFO[k].icon]) need.push(DJ.NODE_INFO[k].icon);
    for (const i of DJ.ITEMS) if (!DJ.SPRITES[i.icon]) need.push(i.icon);
    for (const p in DJ.POTIONS) if (!DJ.SPRITES[DJ.POTIONS[p].icon]) need.push(DJ.POTIONS[p].icon);
    for (const s in DJ.STATUS) if (!DJ.SPRITES[DJ.STATUS[s].icon]) need.push(DJ.STATUS[s].icon);
    return Array.from(new Set(need));
  }

  async function boot() {
    setBoot(10, 'Loading save…');
    DJ.load();
    setBoot(25, 'Warming the drums…');
    DJ.Audio.init();
    DJ.Audio.loadMusic();
    DJ.Audio.loopOne = !!DJ.profile.settings.loopOne;
    setBoot(45, 'Painting the canopy…');
    await DJ.loadFxSheets('assets/FX');
    setBoot(75, 'Waking the monsters…');

    const missing = missingSpriteReport();
    if (missing.length) console.warn('[Deep Jungle] missing sprites:', missing);

    UI.initBackButtons();
    UI.Title.init();
    UI.Select.init();
    UI.Map.init();
    UI.Battle.init();
    UI.Compendium.init();
    wireButtons();
    wireKeys();
    setBoot(100, 'Ready.');
    await DJ.sleep(220);
    UI.Title.refresh();
    UI.show('title');

    // Music needs a user gesture in most browsers.
    const unlock = () => {
      DJ.Audio.unlock();
      DJ.Audio.playMusic();
      root.removeEventListener('pointerdown', unlock);
      root.removeEventListener('keydown', unlock);
    };
    root.addEventListener('pointerdown', unlock);
    root.addEventListener('keydown', unlock);
  }

  function wireButtons() {
    UI.$('#btnNewRun').addEventListener('click', () => {
      DJ.sfx('confirm');
      if (DJ.hasSavedRun()) {
        UI.Panels.confirm('Start a new expedition?', 'Your saved expedition will be discarded.', () => {
          DJ.profile.run = null; DJ.save();
          UI.closeOverlay();
          UI.Select.open();
        });
      } else UI.Select.open();
    });
    UI.$('#btnContinue').addEventListener('click', () => {
      DJ.sfx('confirm');
      try {
        DJ.run = DJ.deserializeRun(DJ.profile.run);
        DJ.resumeRun();
      } catch (e) {
        console.error('could not load run', e);
        UI.toast('Could not load that expedition', 'Starting fresh instead.', 'error');
        DJ.profile.run = null; DJ.save();
        UI.Title.refresh();
      }
    });
    UI.$('#btnRoster').addEventListener('click', () => { DJ.sfx('page'); UI.Roster.open(); });
    UI.$('#btnCompendium').addEventListener('click', () => { DJ.sfx('page'); UI.Compendium.open(); });
    UI.$('#btnAchievements').addEventListener('click', () => { DJ.sfx('page'); UI.Achievements.open(); });
    UI.$('#btnHistory').addEventListener('click', () => { DJ.sfx('page'); UI.History.open(); });
    UI.$('#btnHelp').addEventListener('click', () => { DJ.sfx('page'); UI.Help.open(); });
    // A balance aid rather than a feature: DJ.UI.ItemDebug.open() from the console,
    // or load the page with ?items on the end.
    // Waits for the boot screen to hand over, which takes as long as the effect
    // sheets do.
    if (/[?&]items/.test(location.search) && UI.ItemDebug) {
      const openWhenReady = () => {
        if (UI.current === 'title') UI.ItemDebug.open();
        else setTimeout(openWhenReady, 200);
      };
      setTimeout(openWhenReady, 300);
    }
    UI.$('#btnSettings').addEventListener('click', () => UI.Panels.settings());
    // The gear floats above every screen, so settings are always one click away.
    const gear = UI.$('#btnGlobalSettings');
    gear.addEventListener('click', () => UI.Panels.settings());
    const syncGear = (id) => gear.classList.toggle('hidden', id === 'boot' || id === 'title');
    DJ.events.on('screen', syncGear);
    syncGear(UI.current);
    UI.$('#btnMapCompendium').addEventListener('click', () => { DJ.sfx('page'); UI.Compendium.open(); });
  }

  function wireKeys() {
    root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (UI.overlayOpen) { UI.closeOverlay(); return; }
        if (UI.current === 'compendium' || UI.current === 'achievements' || UI.current === 'roster') {
          UI.show(DJ.run && !DJ.run.finished ? 'map' : 'title');
          return;
        }
        if (UI.current === 'battle' && UI.Battle.isTargeting && UI.Battle.isTargeting()) {
          UI.Battle.cancelTargeting();
          return;
        }
        if (UI.current !== 'boot') UI.Panels.settings();
      }
    });
  }

  // ---------------- run lifecycle ----------------
  DJ.startRun = function (partyIds) {
    const seed = (Date.now() ^ Math.floor(Math.random() * 0xffffff)) >>> 0;
    DJ.run = new DJ.Run({ seed, partyIds });
    DJ.bump('runsStarted');
    DJ.saveRun(DJ.run);
    DJ.checkAndAnnounce();
    UI.Map.open(true);
  };

  // Drop the player back where they left off. If they closed the tab or stepped out
  // to the menu partway through a node, that node is replayed from its saved RNG state
  // rather than leaving the map with no onward path.
  DJ.resumeRun = function () {
    const run = DJ.run;
    if (!run) return;
    UI.Map.open(true);
    if (!run.isMidNode()) return;
    if (run.pendingRng != null) run.rng.s = run.pendingRng;
    const node = run.node();
    if (!node) return;
    setTimeout(() => UI.Nodes.enter(node), 60);
  };

  // Called after a node screen resolves.
  DJ.afterNode = function () {
    const run = DJ.run;
    if (!run) return;
    if (run.isWiped()) { DJ.runLost(); return; }
    DJ.saveRun(run);
    DJ.checkAndAnnounce();
    UI.Map.open(false);
    UI.Map.refresh();
  };

  // The player refused to leave. The victory is recorded now, so it counts however the
  // deep run ends, and then the map opens up past the Heart.
  DJ.enterBeyond = function () {
    const run = DJ.run;
    if (!run || !run.enterBeyond()) return false;
    DJ.recordHeartVictory(run);
    DJ.checkAndAnnounce();
    UI.show('map');
    UI.Map.open(false);
    UI.Map.refresh();
    DJ.saveRun(run);
    UI.toast('The Beyond opens. No more levels from here.');
    return true;
  };

  DJ.runWon = function () {
    const run = DJ.run;
    run.finished = true; run.won = true;
    DJ.recordRunEnd(run);
    const earned = DJ.checkAchievements();
    showRunEnd(true, run, earned);
    DJ.run = null;
  };

  DJ.runLost = function () {
    const run = DJ.run;
    if (!run) return;
    run.finished = true;
    // A party that fell in The Beyond had already beaten the Heart to get there. The
    // expedition was a win; only the deep run ended badly.
    run.won = !!run.heartBeaten;
    DJ.recordRunEnd(run);
    const earned = DJ.checkAchievements();
    showRunEnd(false, run, earned);
    DJ.run = null;
  };

  function showRunEnd(won, run, earned) {
    // A deep run always ends the same way, but it is not a defeat: the Heart was already
    // beaten to get there, so the screen says how far they got rather than that they lost.
    const deep = !!run.beyond;
    UI.$('#resultTitle').textContent = deep ? 'THE BEYOND TAKES YOU'
      : won ? 'THE JUNGLE IS QUIET' : 'THE JUNGLE KEEPS YOU';
    UI.$('#resultTitle').className = deep ? 'win' : won ? 'win' : 'lose';
    const body = UI.$('#resultBody');
    body.innerHTML = '';
    const p = UI.el('p', 'muted');
    p.style.cssText = 'font-style:italic;line-height:1.6;margin-bottom:16px';
    p.textContent = deep
      ? 'You went past the end of the map and kept walking. Nothing out here was keeping score, but you were.'
      : won
      ? 'Your three walk out of the treeline into ordinary daylight, carrying a piece of something that used to be the centre of the world.'
      : 'The green closes over the place where you fell. Within a season there will be no sign that anyone came this way at all.';
    body.appendChild(p);

    if (deep) {
      const d = UI.el('div', 'xp-burst');
      d.appendChild(UI.el('b', null, String(run.depth())));
      d.appendChild(UI.el('span', null, 'Jungle Depth'));
      body.appendChild(d);
    }

    const rows = [
      ['Nodes travelled', run.nodesVisited],
      ['Battles fought', run.stats.battles],
      ['Elites defeated', run.stats.elites],
      ['Bosses defeated', run.stats.bosses],
      ['Monsters catalogued this run', Object.keys(run.discovered).length],
      ['Gold held', run.gold],
      ['Highest level reached', Math.max(...run.party.map((h) => h.level))],
    ];
    for (const [k, v] of rows) {
      const r = UI.el('div', 'reward-line');
      r.innerHTML = `${k}: <b>${v}</b>`;
      body.appendChild(r);
    }

    const strip = UI.el('div');
    strip.style.cssText = 'display:flex;gap:10px;justify-content:center;margin:16px 0';
    for (const h of run.party) {
      const c = UI.el('div');
      c.style.textAlign = 'center';
      c.appendChild(UI.spriteEl(h.sprite, 2, h.name));
      c.appendChild(UI.el('div', 'loot-desc', `${h.name} · Lv${h.level}`));
      strip.appendChild(c);
    }
    body.appendChild(strip);

    if (earned && earned.length) {
      body.appendChild(UI.el('h4', null, `Achievements earned (${earned.length})`)).style.cssText = 'margin:14px 0 8px;font-size:14px;color:#8fe08a';
      for (const a of earned) {
        const r = UI.el('div', 'levelup-card');
        r.appendChild(UI.el('div', 'lu-head', a.name));
        r.appendChild(UI.el('div', 'lu-stats', a.desc));
        if (a.unlocks) {
          const h = DJ.HERO_BY_ID[a.unlocks];
          r.appendChild(UI.el('div', 'lu-skill', 'Unlocked: ' + (h ? h.name : a.unlocks)));
        }
        body.appendChild(r);
      }
    }

    const acts = UI.$('#resultActions');
    acts.innerHTML = '';
    const again = UI.el('button', 'choice-btn');
    again.appendChild(UI.el('div', 'c-label', 'New expedition'));
    again.appendChild(UI.el('div', 'c-desc', 'A fresh jungle, a new party.'));
    again.addEventListener('click', () => { DJ.sfx('confirm'); UI.Select.open(); });
    acts.appendChild(again);

    const ach = UI.el('button', 'choice-btn');
    ach.appendChild(UI.el('div', 'c-label', 'Achievements'));
    ach.addEventListener('click', () => { DJ.sfx('page'); UI.Achievements.open(); });
    acts.appendChild(ach);

    const comp = UI.el('button', 'choice-btn');
    comp.appendChild(UI.el('div', 'c-label', 'Compendium'));
    comp.addEventListener('click', () => { DJ.sfx('page'); UI.Compendium.open(); });
    acts.appendChild(comp);

    const home = UI.el('button', 'choice-btn');
    home.appendChild(UI.el('div', 'c-label', 'Return to title'));
    home.addEventListener('click', () => { DJ.sfx('cancel'); UI.Title.refresh(); UI.show('title'); });
    acts.appendChild(home);

    UI.show('result');
    DJ.sfx(won ? 'victory' : 'defeat');
    if (earned) UI.announceAchievements(earned);
  }

  DJ.checkAndAnnounce = function () {
    const earned = DJ.checkAchievements();
    if (earned.length) UI.announceAchievements(earned);
    return earned;
  };

  // ---------------- go ----------------
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(typeof window !== 'undefined' ? window : globalThis);
