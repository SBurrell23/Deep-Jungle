/* Deep Jungle — equipment & potions */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const I = (DJ.ITEMS = []);
  // slot: weapon | armor | trinket. tier 1-5 controls where it drops. rarity: common | rare | epic
  // stats: atk mag def hp spd mp. passive: crit | lifesteal | regen | resist | mpregen | gold | xp | thorns
  function it(id, name, slot, tier, rarity, icon, stats, desc, passive) {
    I.push({ id, name, slot, tier, rarity, icon, stats, desc, passive: passive || null });
  }
  // ---- Weapons ----
  it('rusty_machete', 'Rusty Machete', 'weapon', 1, 'common', 'item_sword', { atk: 3 }, 'Someone else\'s. They will not need it.');
  it('thorn_wand', 'Thorn Wand', 'weapon', 1, 'common', 'item_wand', { mag: 3 }, 'A stick that remembers being a rose.');
  it('bone_spear', 'Bone Spear', 'weapon', 1, 'rare', 'item_spear', { atk: 4, spd: 1 }, 'Light, sharp, and faintly disapproving.');
  it('vine_whip', 'Vine Whip', 'weapon', 2, 'common', 'item_whip', { atk: 5 }, 'Still slightly alive.');
  it('firefly_bow', 'Firefly Bow', 'weapon', 2, 'rare', 'item_bow', { atk: 5, spd: 2 }, 'Glows softly. Enemies find that unfair.');
  it('ember_staff', 'Ember Staff', 'weapon', 2, 'rare', 'item_staff', { mag: 6, mp: 6 }, 'Warm to the touch. Very warm.');
  it('jaguar_fang_blade', 'Jaguar Fang Blade', 'weapon', 3, 'rare', 'item_dagger', { atk: 8 }, 'Crit chance +10%.', 'crit');
  it('shaman_totem', 'Shaman Totem', 'weapon', 3, 'rare', 'item_staff', { mag: 8, def: 1 }, 'Four faces, all of them helpful for once.');
  it('obsidian_axe', 'Obsidian Axe', 'weapon', 3, 'epic', 'item_axe', { atk: 11, spd: -1 }, 'Heavy. Worth it.');
  it('serpent_mace', 'Serpent Mace', 'weapon', 4, 'rare', 'item_mace', { atk: 11, def: 2 }, 'Heals 10% of damage dealt.', 'lifesteal');
  it('storm_lance', 'Storm Lance', 'weapon', 4, 'epic', 'item_spear', { atk: 13, spd: 2 }, 'Crackles when swung.');
  it('lich_scepter', 'Lich Scepter', 'weapon', 4, 'epic', 'item_wand', { mag: 14, mp: 10 }, 'Regenerates MP every turn.', 'mpregen');
  it('sunfire_claws', 'Sunfire Claws', 'weapon', 5, 'epic', 'item_claws', { atk: 17, spd: 3 }, 'Crit chance +10%.', 'crit');
  it('heartwood_staff', 'Heartwood Staff', 'weapon', 5, 'epic', 'item_staff', { mag: 18, hp: 20 }, 'Cut from the Warden. It still hums.', 'mpregen');
  it('kings_bramble_sword', 'King\'s Bramble Sword', 'weapon', 5, 'epic', 'item_sword', { atk: 16, mag: 6 }, 'Heals 10% of damage dealt.', 'lifesteal');
  // ---- Armor ----
  it('leaf_tunic', 'Leaf Tunic', 'armor', 1, 'common', 'item_leather_armor', { def: 2, hp: 8 }, 'Breathable. Slightly edible.');
  it('travelers_robe', 'Traveler\'s Robe', 'armor', 1, 'common', 'item_robe', { def: 1, mp: 8 }, 'Many pockets, few of them empty.');
  it('boar_hide', 'Boar Hide', 'armor', 2, 'common', 'item_hide_armor', { def: 3, hp: 14 }, 'Smells like victory. Or boar.');
  it('beetle_shell_mail', 'Beetle Shell Mail', 'armor', 2, 'rare', 'item_shell_armor', { def: 5, spd: -1 }, 'Iridescent and irritatingly sturdy.');
  it('spider_silk_robe', 'Spider Silk Robe', 'armor', 3, 'rare', 'item_robe', { def: 3, mag: 4, mp: 10 }, 'Woven by something with far too many legs.');
  it('bronze_scale', 'Bronze Scale Armor', 'armor', 3, 'rare', 'item_chain_armor', { def: 6, hp: 20 }, 'Taken from an armored tapir who no longer needed it.');
  it('ruin_plate', 'Ruin Guardian Plate', 'armor', 4, 'epic', 'item_plate_armor', { def: 9, hp: 25, spd: -1 }, 'Regenerates 5% HP per turn.', 'regen');
  it('wraith_cloak', 'Wraith Cloak', 'armor', 4, 'rare', 'item_cloak', { def: 4, spd: 3, mag: 4 }, 'Status effects land half as often.', 'resist');
  it('mossback_hide', 'Mossback Hide', 'armor', 4, 'rare', 'item_hide_armor', { def: 7, hp: 30 }, 'Regenerates 5% HP per turn.', 'regen');
  it('titan_carapace', 'Titan Carapace', 'armor', 5, 'epic', 'item_plate_armor', { def: 12, hp: 40, spd: -2 }, 'You could shelter under it. Now you do.');
  it('void_mantle', 'Void Mantle', 'armor', 5, 'epic', 'item_cloak', { def: 6, spd: 4, mag: 6 }, 'Status effects land half as often.', 'resist');
  it('wardens_bark', 'Warden\'s Bark', 'armor', 5, 'epic', 'item_shell_armor', { def: 10, hp: 35, mag: 3 }, 'Regenerates 5% HP per turn.', 'regen');
  // ---- Trinkets ----
  it('lucky_tooth', 'Lucky Tooth', 'trinket', 1, 'common', 'item_tooth', { spd: 2 }, 'Not yours. That is the lucky part.');
  it('copper_ring', 'Copper Ring', 'trinket', 1, 'common', 'item_ring', { hp: 10, mp: 4 }, 'Turns your finger green. Small price.');
  it('puffbird_feather', 'Puffbird Feather', 'trinket', 2, 'common', 'item_feather', { spd: 3, def: 1 }, 'Very light. Makes you feel the same.');
  it('merchants_charm', 'Merchant\'s Charm', 'trinket', 2, 'rare', 'item_charm', { hp: 8 }, 'Enemies drop 25% more gold.', 'gold');
  it('scholars_amulet', 'Scholar\'s Amulet', 'trinket', 2, 'rare', 'item_amulet', { mag: 3 }, 'Wearer gains 20% more XP.', 'xp');
  it('jade_idol', 'Jade Idol', 'trinket', 3, 'rare', 'item_idol', { def: 3, mp: 12 }, 'Regenerates MP every turn.', 'mpregen');
  it('bloodstone_ring', 'Bloodstone Ring', 'trinket', 3, 'rare', 'item_ring', { atk: 4 }, 'Heals 10% of damage dealt.', 'lifesteal');
  it('swift_boots', 'Swift Boots', 'trinket', 3, 'rare', 'item_boots', { spd: 5 }, 'Stolen from a bandit mid-stride.');
  it('thorn_amulet', 'Thorn Amulet', 'trinket', 4, 'rare', 'item_amulet', { def: 4, hp: 20 }, 'Attackers take 20% of damage back.', 'thorns');
  it('hunters_gem', 'Hunter\'s Gem', 'trinket', 4, 'epic', 'item_gem', { atk: 6, spd: 3 }, 'Crit chance +10%.', 'crit');
  it('ancestor_charm', 'Ancestor Charm', 'trinket', 4, 'epic', 'item_charm', { hp: 30, def: 3 }, 'Regenerates 5% HP per turn.', 'regen');
  it('sun_idol_shard', 'Sun Idol Shard', 'trinket', 5, 'epic', 'item_idol', { mag: 10, atk: 6 }, 'Regenerates MP every turn.', 'mpregen');
  it('heart_seed', 'Heart Seed', 'trinket', 5, 'epic', 'item_gem', { hp: 50, def: 5, spd: 2 }, 'Regenerates 5% HP per turn. It beats.', 'regen');
  it('phoenix_feather_charm', 'Phoenix Feather Charm', 'trinket', 5, 'epic', 'item_feather', { spd: 6, atk: 5, mag: 5 }, 'Status effects land half as often.', 'resist');

  DJ.ITEM_BY_ID = {};
  I.forEach((x) => (DJ.ITEM_BY_ID[x.id] = x));

  DJ.PASSIVE_DESC = {
    crit: 'Crit +10%', lifesteal: 'Lifesteal 10%', regen: 'Regen 5%/turn', resist: 'Status resist',
    mpregen: 'MP regen', gold: '+25% gold', xp: '+20% XP', thorns: 'Thorns 20%',
  };

  // ---- Potions ----
  // grade drives both how often a potion drops and how its price moves through a run:
  //   basic   cheap sustain, bought constantly, so its price tracks the gold curve closely
  //   mid     situational, inflates more slowly
  //   premium a run-defining tonic, priced as a luxury and capped by `cap` drops per run
  DJ.POTIONS = {
    red:     { id: 'red', name: 'Red Potion', icon: 'potion_red', grade: 'basic', price: 16, desc: 'Heal 45% HP of one hero.', effect: { heal: 0.45 } },
    blue:    { id: 'blue', name: 'Blue Potion', icon: 'potion_blue', grade: 'basic', price: 14, desc: 'Restore 50% MP of one hero.', effect: { mp: 0.5 } },
    green:   { id: 'green', name: 'Green Potion', icon: 'potion_green', grade: 'basic', price: 13, desc: 'Cure all ailments and heal 15% HP.', effect: { cure: true, heal: 0.15 } },
    yellow:  { id: 'yellow', name: 'Yellow Potion', icon: 'potion_yellow', grade: 'mid', price: 44, desc: 'Revive a fallen hero with 50% HP.', effect: { revive: 0.5 } },
    purple:  { id: 'purple', name: 'Purple Potion', icon: 'potion_purple', grade: 'mid', price: 30, desc: 'Grant Rage and Haste for 3 turns.', effect: { status: ['rage', 'haste'], turns: 3 } },
    orange:  { id: 'orange', name: 'Orange Potion', icon: 'potion_orange', grade: 'premium', price: 130, cap: 2, desc: 'Fully heal one hero.', effect: { heal: 1.0 } },
    elixir:  { id: 'elixir', name: 'Elixir', icon: 'potion_elixir', grade: 'premium', price: 320, cap: 1, desc: 'Fully restore HP and MP of the whole party.', effect: { party: true, heal: 1.0, mp: 1.0, cure: true } },
    phoenix: { id: 'phoenix', name: 'Phoenix Down', icon: 'potion_phoenix', grade: 'premium', price: 260, cap: 1, desc: 'Revive all fallen heroes at full HP.', effect: { party: true, revive: 1.0 } },
    // The rare one. Never sold, never dropped by ordinary monsters.
    pink:    { id: 'pink', name: 'Heartbloom Nectar', icon: 'potion_pink', grade: 'rare', price: 0, rare: true, desc: 'Raises one adventurer a full level, instantly.', effect: { levelUp: 1 } },
  };
  // 'pink' is deliberately absent: it is only granted by the boss/elite rules in run.js.
  // The premium three sit at the bottom on purpose. Between them they turn up well under
  // once per run, and `cap` stops a lucky streak handing out a second Elixir.
  DJ.POTION_DROP_WEIGHTS = [
    { v: 'red', w: 40 }, { v: 'blue', w: 26 }, { v: 'green', w: 20 },
    { v: 'yellow', w: 8 }, { v: 'purple', w: 6 },
    { v: 'orange', w: 1.4 }, { v: 'phoenix', w: 0.6 }, { v: 'elixir', w: 0.5 },
  ];

  // How fast a grade's price climbs per level of the node you are shopping at. Gold income
  // roughly triples across a run, so the shelf has to move with it or late gold is worthless.
  const PRICE_GROWTH = { basic: 0.11, mid: 0.08, premium: 0.05 };
  DJ.potionPrice = function (pid, level) {
    const p = DJ.POTIONS[pid];
    if (!p || !p.price) return 0;
    const lv = DJ.clamp(level || 1, 1, 20);
    return Math.round(p.price * (1 + (lv - 1) * (PRICE_GROWTH[p.grade] || 0)));
  };

  // Roll an equipment item for a given level. rarityBoost bumps toward rare/epic (elites, bosses, treasure).
  DJ.rollItem = function (rng, level, rarityBoost) {
    const tier = DJ.clamp(Math.ceil(level / 3), 1, 5);
    const pool = I.filter((x) => x.tier >= Math.max(1, tier - 1) && x.tier <= tier);
    const boost = rarityBoost || 0;
    const weights = pool.map((x) => ({ v: x, w: (x.rarity === 'common' ? 10 : x.rarity === 'rare' ? 5 + boost * 3 : 1.5 + boost * 3) * (x.tier === tier ? 1.6 : 1) }));
    return rng.weighted(weights);
  };
  // Pass the run and the per-run caps apply: a capped potion drops out of the pool once
  // the run has already produced its allowance, so an Elixir really is a once-a-run find.
  DJ.rollPotion = function (rng, run) {
    if (!run) return rng.weighted(DJ.POTION_DROP_WEIGHTS);
    const got = run.potionDrops || (run.potionDrops = {});
    let pool = DJ.POTION_DROP_WEIGHTS.filter((e) => {
      const cap = DJ.POTIONS[e.v].cap;
      return !cap || (got[e.v] || 0) < cap;
    });
    if (!pool.length) pool = DJ.POTION_DROP_WEIGHTS.filter((e) => !DJ.POTIONS[e.v].cap);
    const pid = rng.weighted(pool);
    got[pid] = (got[pid] || 0) + 1;
    return pid;
  };
  DJ.itemPrice = function (item) {
    const base = { common: 30, rare: 60, epic: 110 }[item.rarity];
    return base + item.tier * 18;
  };
})(typeof window !== 'undefined' ? window : globalThis);
