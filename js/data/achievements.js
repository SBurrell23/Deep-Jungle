/* Deep Jungle — 100 achievements. 20 of them unlock adventurers.
 * check(s, p): s = profile.stats, p = profile. Returns true when earned.
 */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const A = (DJ.ACHIEVEMENTS = []);
  function a(id, name, desc, check, unlocks) { A.push({ id, name, desc, check, unlocks: unlocks || null }); }
  const ge = (k, n) => (s) => (s[k] || 0) >= n;
  const tag = (t, n) => (s) => ((s.killsByTag || {})[t] || 0) >= n;
  const boss = (id, n) => (s) => ((s.bossKills || {})[id] || 0) >= (n || 1);
  const won = (h) => (s) => ((s.wonWith || {})[h] || 0) >= 1;

  // ===== Adventurer-unlocking achievements (20) =====
  a('first_blood', 'First Blood', 'Win your first battle.', ge('battlesWon', 1), 'frog_monk');
  a('thorn_crown', 'Thorn Crown', 'Defeat the Bramble King.', boss('bramble_king'), 'dryad_healer');
  a('overkill', 'Overkill', 'Deal 120 or more damage in a single hit.', ge('maxHit', 120), 'lizard_berserker');
  a('lore_seeker', 'Lore Seeker', 'Discover 15 monsters in the compendium.', ge('discovered', 15), 'moth_oracle');
  a('tamer', 'Tamer', 'Defeat 60 monsters.', ge('kills', 60), 'pygmy_beastmaster');
  a('green_thumb', 'Green Thumb', 'Solve 3 jungle puzzles.', ge('puzzlesSolved', 3), 'orchid_witch');
  a('unbroken', 'Unbroken', 'Win a battle without taking any damage.', ge('perfectBattles', 1), 'golem_guardian');
  a('treasure_hunter', 'Treasure Hunter', 'Earn 600 gold in total.', ge('goldEarned', 600), 'ratkin_corsair');
  a('fang_breaker', 'Fang Breaker', 'Defeat the Mother of Fangs.', boss('mother_of_fangs'), 'firefly_ranger');
  a('survivalist', 'Survivalist', 'Rest at 8 campfires.', ge('rests', 8), 'spore_druid');
  a('apex', 'Apex Predator', 'Raise any hero to level 10.', ge('heroMaxLevel', 10), 'tiger_shaman');
  a('elite_hunter', 'Elite Hunter', 'Defeat 5 elite monsters.', ge('elitesKilled', 5), 'harpy_skydancer');
  a('back_from_dead', 'Back from the Dead', 'Revive fallen heroes 3 times.', ge('revives', 3), 'ghoul_necromancer');
  a('collector', 'Collector', 'Equip 10 items.', ge('itemsEquipped', 10), 'beetle_knight');
  a('assassin', 'Assassin', 'Land 30 critical hits.', ge('crits', 30), 'naga_assassin');
  a('potion_master', 'Potion Master', 'Use 25 potions.', ge('potionsUsed', 25), 'panda_brewmaster');
  a('heartbreaker', 'Heartbreaker', 'Defeat the Heart of the Jungle.', boss('heart_of_jungle'), 'ape_stormcaller');
  a('cartographer', 'Cartographer', 'Visit 80 map nodes.', ge('nodesVisited', 80), 'chameleon_ninja');
  a('sage', 'Sage of the Deep', 'Discover 60 monsters.', ge('discovered', 60), 'treant_sage');
  a('perfect_run', 'Perfect Run', 'Defeat the Heart of the Jungle without any hero falling during the run.', ge('flawlessRuns', 1), 'jaguar_paladin');

  // ===== Progress =====
  a('into_the_green', 'Into the Green', 'Begin your first expedition.', ge('runsStarted', 1));
  a('undergrowth', 'Beyond the Undergrowth', 'Reach the second region.', ge('highestColumn', 6));
  a('canopy', 'Under the Canopy', 'Reach the third region.', ge('highestColumn', 11));
  a('warden_slayer', 'Warden Slayer', 'Defeat the Vine Warden.', boss('vine_warden'));
  a('heart_x3', 'Jungle Veteran', 'Defeat the Heart of the Jungle 3 times.', boss('heart_of_jungle', 3));
  a('heart_x10', 'Jungle Legend', 'Defeat the Heart of the Jungle 10 times.', boss('heart_of_jungle', 10));
  a('persistent', 'Persistent', 'Start 5 expeditions.', ge('runsStarted', 5));
  a('obsessed', 'Obsessed', 'Start 25 expeditions.', ge('runsStarted', 25));
  a('fallen', 'The Jungle Wins', 'Lose an expedition.', ge('runsLost', 1));
  a('speedrunner', 'Speedrunner', 'Defeat the Heart in a run visiting 16 nodes or fewer.', (s) => (s.fastestWinNodes || 999) <= 16);

  // ===== Combat =====
  a('brawler', 'Brawler', 'Win 10 battles.', ge('battlesWon', 10));
  a('warrior', 'Warrior', 'Win 50 battles.', ge('battlesWon', 50));
  a('champion', 'Champion', 'Win 200 battles.', ge('battlesWon', 200));
  a('hunter', 'Hunter', 'Defeat 150 monsters.', ge('kills', 150));
  a('exterminator', 'Exterminator', 'Defeat 500 monsters.', ge('kills', 500));
  a('big_hit', 'Big Hit', 'Deal 60 damage in a single hit.', ge('maxHit', 60));
  a('massive_hit', 'Massive Hit', 'Deal 250 damage in a single hit.', ge('maxHit', 250));
  a('legendary_hit', 'Legendary Hit', 'Deal 400 damage in a single hit.', ge('maxHit', 400));
  a('crit_happens', 'Crit Happens', 'Land 5 critical hits.', ge('crits', 5));
  a('crit_master', 'Critical Mass', 'Land 150 critical hits.', ge('crits', 150));
  a('flawless_x5', 'Untouchable', 'Win 5 battles without taking damage.', ge('perfectBattles', 5));
  a('one_round', 'Blitz', 'Win a battle in a single round.', ge('oneRoundWins', 1));
  a('blitz_x10', 'Lightning War', 'Win 10 battles in a single round.', ge('oneRoundWins', 10));
  a('last_stand', 'Last Stand', 'Win a battle with only one hero standing.', ge('soloWins', 1));
  a('clutch', 'Clutch', 'Win a battle with a hero below 10% HP.', ge('lowHpWins', 1));
  a('elite_x20', 'Elite Slayer', 'Defeat 20 elite monsters.', ge('elitesKilled', 20));
  a('poisoner', 'Poisoner', 'Defeat 15 monsters with poison damage.', ge('poisonKills', 15));
  a('arsonist', 'Arsonist', 'Defeat 15 monsters with burn damage.', ge('burnKills', 15));
  a('bleeder', 'Blood Letter', 'Defeat 15 monsters with bleed damage.', ge('bleedKills', 15));
  a('debuffer', 'Hex Master', 'Inflict 100 status effects.', ge('statusesInflicted', 100));
  a('healer', 'Field Medic', 'Heal 2,000 HP in total.', ge('healingDone', 2000));
  a('great_healer', 'Miracle Worker', 'Heal 15,000 HP in total.', ge('healingDone', 15000));
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
  a('discover_85', 'Encyclopedist', 'Discover 85 monsters.', ge('discovered', 85));
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
  a('roster_10', 'Recruiter', 'Unlock 10 adventurers.', (s, p) => (p.unlocked || []).length >= 10);
  a('roster_23', 'Full Roster', 'Unlock all 23 adventurers.', (s, p) => (p.unlocked || []).length >= 23);
  a('variety', 'Variety Pack', 'Win the game with 6 different adventurers.', (s) => Object.keys(s.wonWith || {}).length >= 6);
  a('starters', 'The Original Three', 'Win the game with Elf Warrior, Goblin Mage and Kua Ta Lancer together.', ge('starterWins', 1));
  a('all_casters', 'Spellbound', 'Win the game with a party of three magic users.', ge('casterWins', 1));
  a('goblin_win', 'Goblin Made Good', 'Win the game with the Goblin Mage in the party.', won('goblin_mage'));
  a('completionist', 'Completionist', 'Earn 90 achievements.', (s, p) => (p.achievements || []).length >= 90);

  DJ.ACH_BY_ID = {};
  A.forEach((x) => (DJ.ACH_BY_ID[x.id] = x));
})(typeof window !== 'undefined' ? window : globalThis);
