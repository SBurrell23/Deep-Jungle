/* Deep Jungle — 100 achievements. 25 of them unlock adventurers (5 start unlocked).
 * check(s, p): s = profile.stats, p = profile. Returns true when earned.
 */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const A = (DJ.ACHIEVEMENTS = []);
  function a(id, name, desc, check, unlocks) {
    A.push({ id, name, desc, check, progress: check.prog || null, unlocks: unlocks || null });
  }
  // Each helper carries a `prog` alongside its test, so the UI can say "14 / 25" instead of
  // just "not yet". Hand-written checks below opt in by wrapping themselves in withProg.
  const withProg = (fn, prog) => { fn.prog = prog; return fn; };
  const count = (read, n) => withProg((s) => read(s) >= n, (s) => ({ cur: read(s), goal: n }));
  const ge = (k, n) => count((s) => s[k] || 0, n);
  const tag = (t, n) => count((s) => (s.killsByTag || {})[t] || 0, n);
  const boss = (id, n) => count((s) => (s.bossKills || {})[id] || 0, n || 1);
  // Regions field one of several guardians per run, so an achievement about "the
  // guardian of the Mire" counts whichever one the map put there. Tying these to a
  // single monster would leave two adventurer unlocks waiting on a dice roll.
  const guardian = (r, n) => count(
    (s) => DJ.regionBosses(r).reduce((a, id) => a + ((s.bossKills || {})[id] || 0), 0), n || 1);
  const won = (h) => count((s) => Math.min(1, (s.wonWith || {})[h] || 0), 1);

  // ===== Adventurer-unlocking achievements (18 here; 7 more are marked further down) =====
  a('first_blood', 'First Blood', 'Win your first battle.', ge('battlesWon', 1));
  a('thorn_crown', 'Thorn Crown', 'Defeat the guardian of the Undergrowth.', guardian(0));
  a('overkill', 'Overkill', 'Deal 260 or more damage in a single hit.', ge('maxHit', 260), 'lizard_berserker');
  a('lore_seeker', 'Lore Seeker', 'Discover 45 monsters in the compendium.', ge('discovered', 45), 'moth_oracle');
  a('tamer', 'Tamer', 'Defeat 220 monsters.', ge('kills', 220), 'pygmy_beastmaster');
  a('green_thumb', 'Green Thumb', 'Solve 12 jungle puzzles.', ge('puzzlesSolved', 12), 'orchid_witch');
  a('unbroken', 'Unbroken', 'Win 8 battles without taking any damage.', ge('perfectBattles', 8), 'golem_guardian');
  a('treasure_hunter', 'Treasure Hunter', 'Earn 3,000 gold in total.', ge('goldEarned', 3000), 'ratkin_corsair');
  a('fang_breaker', 'Fang Breaker', 'Defeat the guardian of the Mire.', guardian(1), 'firefly_ranger');
  a('survivalist', 'Survivalist', 'Rest at 30 campfires.', ge('rests', 30), 'spore_druid');
  a('apex', 'Apex Predator', 'Raise a hero to level 16.', ge('heroMaxLevel', 16), 'tiger_shaman');
  a('elite_hunter', 'Elite Hunter', 'Defeat 30 elite monsters.', ge('elitesKilled', 30), 'harpy_skydancer');
  a('back_from_dead', 'Back from the Dead', 'Revive fallen heroes 18 times.', ge('revives', 18), 'ghoul_necromancer');
  a('collector', 'Collector', 'Equip 40 items.', ge('itemsEquipped', 40), 'beetle_knight');
  a('assassin', 'Assassin', 'Land 120 critical hits.', ge('crits', 120), 'naga_assassin');
  a('potion_master', 'Potion Master', 'Use 90 potions.', ge('potionsUsed', 90), 'panda_brewmaster');
  a('heartbreaker', 'Heartbreaker', 'Defeat the Heart of the Jungle.', boss('heart_of_jungle'), 'ape_stormcaller');
  a('cartographer', 'Cartographer', 'Visit 220 map nodes.', ge('nodesVisited', 220), 'chameleon_ninja');
  a('sage', 'Sage of the Deep', 'Discover 70 monsters.', ge('discovered', 70), 'treant_sage');
  a('perfect_run', 'Perfect Run', 'Defeat the Heart of the Jungle without any hero falling during the run.', ge('flawlessRuns', 1), 'jaguar_paladin');

  // ===== Progress =====
  a('into_the_green', 'Into the Green', 'Begin your first expedition.', ge('runsStarted', 1));
  a('undergrowth', 'Beyond the Undergrowth', 'Reach the second region.', ge('highestColumn', 6));
  a('canopy', 'Under the Canopy', 'Reach the third region.', ge('highestColumn', 11));
  a('warden_slayer', 'Warden Slayer', 'Defeat the guardian of the High Canopy.', guardian(2), 'toucan_bard');
  a('heart_x3', 'Jungle Veteran', 'Defeat the Heart of the Jungle 3 times.', boss('heart_of_jungle', 3), 'scarab_alchemist');
  a('heart_x10', 'Jungle Legend', 'Defeat the Heart of the Jungle 10 times.', boss('heart_of_jungle', 10));
  a('persistent', 'Persistent', 'Start 5 expeditions.', ge('runsStarted', 5));
  a('obsessed', 'Obsessed', 'Start 25 expeditions.', ge('runsStarted', 25));
  a('fallen', 'The Jungle Wins', 'Lose an expedition.', ge('runsLost', 1));
  a('speedrunner', 'Speedrunner', 'Defeat the Heart in a run visiting 16 nodes or fewer.', (s) => (s.fastestWinNodes || 999) <= 16);

  // ===== Combat =====
  a('brawler', 'Brawler', 'Win 10 battles.', ge('battlesWon', 10));
  a('warrior', 'Warrior', 'Win 50 battles.', ge('battlesWon', 50));
  a('champion', 'Champion', 'Win 200 battles.', ge('battlesWon', 200), 'sloth_sentinel');
  a('hunter', 'Hunter', 'Defeat 150 monsters.', ge('kills', 150));
  a('exterminator', 'Exterminator', 'Defeat 500 monsters.', ge('kills', 500), 'croc_warlord');
  a('big_hit', 'Big Hit', 'Deal 60 damage in a single hit.', ge('maxHit', 60));
  a('massive_hit', 'Massive Hit', 'Deal 250 damage in a single hit.', ge('maxHit', 250));
  a('legendary_hit', 'Legendary Hit', 'Deal 400 damage in a single hit.', ge('maxHit', 400));
  a('crit_happens', 'Crit Happens', 'Land 20 critical hits.', ge('crits', 20));
  a('crit_master', 'Critical Mass', 'Land 300 critical hits.', ge('crits', 300), 'peacock_duelist');
  a('flawless_x5', 'Untouchable', 'Win 5 battles without taking damage.', ge('perfectBattles', 5));
  a('one_round', 'Blitz', 'Win a battle in a single round.', ge('oneRoundWins', 1));
  a('blitz_x10', 'Lightning War', 'Win 10 battles in a single round.', ge('oneRoundWins', 10));
  a('last_stand', 'Last Stand', 'Win a battle with only one hero standing.', ge('soloWins', 1));
  a('clutch', 'Clutch', 'Win a battle with a hero below 10% HP.', ge('lowHpWins', 1));
  a('elite_x20', 'Elite Slayer', 'Defeat 60 elite monsters.', ge('elitesKilled', 60));
  a('poisoner', 'Poisoner', 'Defeat 15 monsters with poison damage.', ge('poisonKills', 15));
  a('arsonist', 'Arsonist', 'Defeat 15 monsters with burn damage.', ge('burnKills', 15));
  a('bleeder', 'Blood Letter', 'Defeat 15 monsters with bleed damage.', ge('bleedKills', 15));
  a('debuffer', 'Hex Master', 'Inflict 100 status effects.', ge('statusesInflicted', 100));
  a('healer', 'Field Medic', 'Heal 2,000 HP in total.', ge('healingDone', 2000));
  a('great_healer', 'Miracle Worker', 'Heal 15,000 HP in total.', ge('healingDone', 15000), 'axolotl_mystic');
  a('damage_10k', 'Wrecking Crew', 'Deal 10,000 total damage.', ge('damageDealt', 10000));
  a('defender', 'Turtle', 'Defend 30 times.', ge('defends', 30));
  a('marathon', 'Marathon Battle', 'Fight a battle lasting 10 or more rounds.', ge('longestBattle', 10));
  a('minion_masher', 'Minion Masher', 'Defeat 10 minions summoned by the Heart.', ge('summonKills', 10));
  a('revivalist', 'Revivalist', 'Revive fallen heroes 15 times.', ge('revives', 15));

  // ===== Bestiary =====
  a('beast_hunter', 'Beast Hunter', 'Defeat 40 beasts.', tag('beast', 40));
  a('bug_squasher', 'Bug Squasher', 'Defeat 40 insects.', tag('insect', 40));
  a('gardener', 'Gardener', 'Defeat 40 plants.', tag('plant', 40));
  a('gravedigger', 'Gravedigger', 'Defeat 30 undead.', tag('undead', 30));
  a('exorcist', 'Exorcist', 'Defeat 30 spirits.', tag('spirit', 30));
  a('herpetologist', 'Herpetologist', 'Defeat 30 reptiles.', tag('reptile', 30));
  a('demolisher', 'Demolisher', 'Defeat 25 constructs.', tag('construct', 25));
  a('dragon_slayer', 'Dragon Slayer', 'Defeat 5 dragons.', tag('dragon', 5));
  a('mycologist', 'Mycologist', 'Defeat 20 fungal monsters.', tag('fungus', 20));
  a('birdwatcher', 'Birdwatcher', 'Defeat 20 birds.', tag('bird', 20));
  a('humanitarian', 'Not So Humanitarian', 'Defeat 30 humanoids.', tag('humanoid', 30));
  a('elementalist', 'Elementalist', 'Defeat 15 elementals.', tag('elemental', 15));
  a('discover_5', 'Curious', 'Discover 5 monsters.', ge('discovered', 5));
  a('discover_30', 'Naturalist', 'Discover 30 monsters.', ge('discovered', 30));
  a('discover_85', 'Encyclopedist', 'Discover 88 monsters.', ge('discovered', 88), 'termite_swarmlord');
  a('discover_100', 'Complete Compendium', 'Discover all 100 monsters.', ge('discovered', 100));

  // ===== Exploration & economy =====
  a('wanderer', 'Wanderer', 'Visit 30 map nodes.', ge('nodesVisited', 30));
  a('pathfinder', 'Pathfinder', 'Visit 250 map nodes.', ge('nodesVisited', 250));
  a('shopper', 'Shopper', 'Visit 5 merchants.', ge('merchants', 5));
  a('big_spender', 'Big Spender', 'Spend 1,000 gold.', ge('goldSpent', 1000));
  a('rich', 'Rich', 'Earn 5,000 gold in total.', ge('goldEarned', 5000));
  a('hoarder', 'Hoarder', 'Hold 400 gold at once.', ge('goldMax', 400));
  a('looter', 'Looter', 'Find 20 pieces of equipment.', ge('itemsFound', 20));
  a('epic_find', 'Epic Find', 'Find an epic item.', ge('epicsFound', 1));
  a('fully_geared', 'Fully Geared', 'Have a hero wearing a weapon, armor and trinket at once.', ge('fullSets', 1));
  a('storyteller', 'Storyteller', 'Resolve 10 jungle events.', ge('events', 10));
  a('riddler', 'Riddle Me This', 'Answer 5 riddles correctly.', ge('riddlesSolved', 5));
  a('totem_memory', 'Totem Memory', 'Solve 5 totem sequences.', ge('totemsSolved', 5));
  a('vine_untangler', 'Untangler', 'Solve 5 vine locks.', ge('vinesSolved', 5));
  a('puzzle_master', 'Puzzle Master', 'Solve 25 puzzles.', ge('puzzlesSolved', 25));
  a('trapped', 'Walked Right Into It', 'Trigger 3 traps.', ge('traps', 3));
  a('blessed', 'Blessed', 'Receive 5 shrine blessings.', ge('shrines', 5));
  a('trained', 'Well Trained', 'Visit 5 training grounds.', ge('trainings', 5));
  a('chemist', 'Chemist', 'Use 100 potions.', ge('potionsUsed', 100));

  // ===== Heroes =====
  a('level_5', 'Growing Up', 'Raise a hero to level 5.', ge('heroMaxLevel', 5));
  a('level_15', 'Peak Form', 'Raise a hero to level 15.', ge('heroMaxLevel', 15));
  a('roster_10', 'Recruiter', 'Unlock 10 adventurers.', withProg((s, p) => (p.unlocked || []).length >= 10, (s, p) => ({ cur: (p.unlocked || []).length, goal: 10 })));
  a('roster_23', 'Full Roster', 'Unlock all 23 adventurers.', withProg((s, p) => (p.unlocked || []).length >= 23, (s, p) => ({ cur: (p.unlocked || []).length, goal: 23 })));
  a('variety', 'Variety Pack', 'Win the game with 6 different adventurers.', withProg((s) => Object.keys(s.wonWith || {}).length >= 6, (s) => ({ cur: Object.keys(s.wonWith || {}).length, goal: 6 })));
  a('starters', 'The Original Three', 'Win the game with Elf Warrior, Goblin Mage and Kua Ta Lancer together.', ge('starterWins', 1));
  a('all_casters', 'Spellbound', 'Win the game with a party of three magic users.', ge('casterWins', 1));
  a('goblin_win', 'Goblin Made Good', 'Win the game with the Goblin Mage in the party.', won('goblin_mage'));
  a('completionist', 'Completionist', 'Earn 90 achievements.', withProg((s, p) => (p.achievements || []).length >= 90, (s, p) => ({ cur: (p.achievements || []).length, goal: 90 })));

  DJ.ACH_BY_ID = {};
  A.forEach((x) => (DJ.ACH_BY_ID[x.id] = x));

  // How close the current profile is to an achievement. Null when the goal is a single
  // event ("defeat the Bramble King"), where a bar would say nothing a lock icon does not.
  DJ.achProgress = function (ach, profile) {
    if (!ach || !ach.progress) return null;
    const pr = profile || DJ.profile;
    if (!pr) return null;
    let out;
    try { out = ach.progress(pr.stats || {}, pr); } catch (e) { return null; }
    if (!out || !(out.goal > 1)) return null;
    const cur = Math.max(0, Math.min(out.cur || 0, out.goal));
    return { cur, goal: out.goal, pct: cur / out.goal, done: cur >= out.goal };
  };
})(typeof window !== 'undefined' ? window : globalThis);
