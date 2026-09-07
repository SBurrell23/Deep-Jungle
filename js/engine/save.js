/* Deep Jungle — localStorage persistence + achievement evaluation. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const KEY = 'deepjungle.save.v1';

  DJ.defaultProfile = function () {
    return {
      version: 1,
      unlocked: ['elf_warrior', 'goblin_mage', 'kuata_lancer'],
      achievements: [],
      compendium: {},            // monsterId -> {seen, killed}
      settings: { music: 0.5, sfx: 0.7, musicOn: true, sfxOn: true, speed: 1, autoSave: true, screenShake: true, damageNumbers: true },
      stats: {
        runsStarted: 0, runsWon: 0, runsLost: 0, battlesWon: 0, kills: 0, elitesKilled: 0,
        crits: 0, maxHit: 0, damageDealt: 0, damageTaken: 0, healingDone: 0, statusesInflicted: 0,
        potionsUsed: 0, potionsByType: {}, revives: 0, heroKOs: 0, defends: 0, skillsUsed: 0,
        nodesVisited: 0, rests: 0, merchants: 0, shrines: 0, events: 0, puzzlesSolved: 0,
        riddlesSolved: 0, totemsSolved: 0, vinesSolved: 0, traps: 0, trainings: 0,
        goldEarned: 0, goldSpent: 0, goldMax: 0, itemsFound: 0, itemsEquipped: 0, epicsFound: 0, fullSets: 0,
        heroMaxLevel: 1, discovered: 0, highestColumn: 0, perfectBattles: 0, oneRoundWins: 0,
        soloWins: 0, lowHpWins: 0, longestBattle: 0, poisonKills: 0, burnKills: 0, bleedKills: 0,
        summonKills: 0, killsByTag: {}, bossKills: {}, wonWith: {}, flawlessRuns: 0,
        fastestWinNodes: 999, starterWins: 0, casterWins: 0, playTime: 0,
      },
      run: null,
    };
  };

  DJ.profile = DJ.defaultProfile();

  DJ.load = function () {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) { DJ.profile = DJ.defaultProfile(); return false; }
      const d = JSON.parse(raw);
      const p = DJ.defaultProfile();
      // merge shallow, deep for stats/settings
      Object.assign(p, d);
      p.settings = Object.assign(DJ.defaultProfile().settings, d.settings || {});
      p.stats = Object.assign(DJ.defaultProfile().stats, d.stats || {});
      p.unlocked = Array.from(new Set((d.unlocked || []).concat(['elf_warrior', 'goblin_mage', 'kuata_lancer'])));
      DJ.profile = p;
      return true;
    } catch (e) { console.warn('load failed', e); DJ.profile = DJ.defaultProfile(); return false; }
  };
  DJ.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(DJ.profile)); return true; }
    catch (e) { console.warn('save failed', e); return false; }
  };
  DJ.wipeSave = function () { try { localStorage.removeItem(KEY); } catch (e) {} DJ.profile = DJ.defaultProfile(); };

  DJ.saveRun = function (run) {
    DJ.profile.run = run && !run.finished ? run.serialize() : null;
    if (DJ.profile.settings.autoSave) DJ.save();
  };
  DJ.hasSavedRun = function () { return !!(DJ.profile.run && DJ.profile.run.party && DJ.profile.run.party.length); };

  // ---- Stat helpers ----
  const S = () => DJ.profile.stats;
  DJ.bump = function (key, n) { const s = S(); s[key] = (s[key] || 0) + (n == null ? 1 : n); };
  DJ.setMax = function (key, v) { const s = S(); if (v > (s[key] || 0)) s[key] = v; };
  DJ.setMin = function (key, v) { const s = S(); if (v < (s[key] == null ? Infinity : s[key])) s[key] = v; };
  DJ.bumpMap = function (mapKey, k, n) { const s = S(); s[mapKey] = s[mapKey] || {}; s[mapKey][k] = (s[mapKey][k] || 0) + (n == null ? 1 : n); };

  DJ.discoverMonster = function (id, killed) {
    const c = DJ.profile.compendium;
    const e = (c[id] = c[id] || { seen: 0, killed: 0 });
    e.seen++;
    if (killed) e.killed++;
    S().discovered = Object.keys(c).length;
  };

  // ---- Achievements ----
  DJ.checkAchievements = function () {
    const p = DJ.profile;
    const earned = [];
    const have = new Set(p.achievements);
    for (const a of DJ.ACHIEVEMENTS) {
      if (have.has(a.id)) continue;
      let ok = false;
      try { ok = !!a.check(p.stats, p); } catch (e) { ok = false; }
      if (ok) {
        p.achievements.push(a.id);
        have.add(a.id);
        earned.push(a);
        if (a.unlocks && !p.unlocked.includes(a.unlocks)) p.unlocked.push(a.unlocks);
      }
    }
    // completionist may become true after the loop above
    if (earned.length) {
      for (const a of DJ.ACHIEVEMENTS) {
        if (have.has(a.id)) continue;
        let ok = false; try { ok = !!a.check(p.stats, p); } catch (e) {}
        if (ok) { p.achievements.push(a.id); have.add(a.id); earned.push(a); if (a.unlocks && !p.unlocked.includes(a.unlocks)) p.unlocked.push(a.unlocks); }
      }
    }
    if (earned.length) DJ.save();
    return earned;
  };

  DJ.isUnlocked = (heroId) => DJ.profile.unlocked.includes(heroId);
  DJ.unlockRequirement = function (heroId) {
    const a = DJ.ACHIEVEMENTS.find((x) => x.unlocks === heroId);
    return a || null;
  };

  // ---- Record a finished battle into the profile ----
  DJ.recordBattle = function (battle, run) {
    const st = battle.stats;
    DJ.bump('damageDealt', st.damageDealt);
    DJ.bump('damageTaken', st.damageTaken);
    DJ.bump('crits', st.crits);
    DJ.setMax('maxHit', st.maxHit);
    DJ.bump('healingDone', st.healing);
    DJ.bump('statusesInflicted', st.statuses);
    DJ.bump('revives', st.revives);
    DJ.bump('heroKOs', st.heroKOs);
    DJ.bump('defends', st.defends);
    DJ.bump('skillsUsed', st.skillsUsed);
    DJ.bump('potionsUsed', st.potions);
    DJ.bump('summonKills', st.summonKills);
    DJ.setMax('longestBattle', battle.round);
    for (const k of st.kills) {
      DJ.bump('kills');
      DJ.discoverMonster(k.id, true);
      if (k.kind === 'elite') DJ.bump('elitesKilled');
      if (k.kind === 'boss' || k.kind === 'final') DJ.bumpMap('bossKills', k.id);
      if (k.cause === 'poison') DJ.bump('poisonKills');
      if (k.cause === 'burn') DJ.bump('burnKills');
      if (k.cause === 'bleed') DJ.bump('bleedKills');
      for (const t of k.tags || []) DJ.bumpMap('killsByTag', t);
    }
    if (battle.result === 'victory') {
      DJ.bump('battlesWon');
      if (st.damageTaken === 0) DJ.bump('perfectBattles');
      if (battle.round <= 1) DJ.bump('oneRoundWins');
      const alive = battle.party.filter((h) => h.alive);
      if (alive.length === 1 && battle.party.length > 1) DJ.bump('soloWins');
      if (alive.some((h) => h.hp / h.maxHp < 0.1)) DJ.bump('lowHpWins');
    }
    if (st.heroKOs > 0 && run) run.flawless = false;
    for (const h of (run ? run.party : [])) DJ.setMax('heroMaxLevel', h.level);
    if (run) DJ.setMax('goldMax', run.gold);
  };

  DJ.recordRunEnd = function (run) {
    if (run.won) {
      DJ.bump('runsWon');
      for (const h of run.party) DJ.bumpMap('wonWith', h.id);
      if (run.flawless) DJ.bump('flawlessRuns');
      DJ.setMin('fastestWinNodes', run.nodesVisited);
      const ids = run.party.map((h) => h.id).sort().join(',');
      if (ids === ['elf_warrior', 'goblin_mage', 'kuata_lancer'].sort().join(',')) DJ.bump('starterWins');
      const casters = run.party.filter((h) => { const b = DJ.HERO_BY_ID[h.id].base; return b.mag >= b.atk; });
      if (casters.length === 3) DJ.bump('casterWins');
    } else DJ.bump('runsLost');
    DJ.profile.run = null;
    DJ.save();
  };
})(typeof window !== 'undefined' ? window : globalThis);
