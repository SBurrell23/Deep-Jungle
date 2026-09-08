/* Deep Jungle — skill definitions (shared by heroes and monsters)
 * kind: phys | mag | heal | buff | debuff | drain | revive | util
 * target: enemy | enemies | ally | allies | self | deadAlly | randomEnemy
 * power: damage multiplier vs. basic attack (1.0). heal power multiplies MAG.
 * status: {id, turns, chance, val} applied to targets; self: status applied to user.
 */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const S = (DJ.SKILLS = {});

  // ---- Visual FX catalogue ----
  // Each entry names a pack (3/4/5), a row on that pack's sheet, and a palette variant
  // (a orange-fire, b purple-arcane, c cyan-water, d green-nature, e pink-holy, f white-steel).
  // Frame counts are measured from the sheets: pack 3 rows have 4-6 frames, pack 4 5-6, pack 5 6-9.
  DJ.FX = {
    slash:        { pack: '5', row: 0,  frames: 6, variant: 'f' },
    slash_big:    { pack: '5', row: 22, frames: 8, variant: 'f' },
    claw:         { pack: '5', row: 16, frames: 7, variant: 'a' },
    hit:          { pack: '4', row: 5,  frames: 6, variant: 'f' },
    hit_big:      { pack: '5', row: 5,  frames: 6, variant: 'f' },
    pierce:       { pack: '5', row: 11, frames: 7, variant: 'f' },
    fire:         { pack: '5', row: 20, frames: 8, variant: 'a' },
    fireball:     { pack: '5', row: 3,  frames: 6, variant: 'a' },
    flame:        { pack: '5', row: 19, frames: 8, variant: 'a' },
    inferno:      { pack: '5', row: 29, frames: 9, variant: 'a' },
    poison:       { pack: '5', row: 21, frames: 8, variant: 'd' },
    poison_cloud: { pack: '5', row: 17, frames: 8, variant: 'd' },
    nature:       { pack: '5', row: 1,  frames: 6, variant: 'd' },
    vine:         { pack: '5', row: 18, frames: 8, variant: 'd' },
    thorns:       { pack: '5', row: 9,  frames: 6, variant: 'd' },
    heal:         { pack: '5', row: 12, frames: 7, variant: 'd' },
    holy_heal:    { pack: '5', row: 12, frames: 7, variant: 'e' },
    buff:         { pack: '5', row: 26, frames: 9, variant: 'e' },
    buff_atk:     { pack: '5', row: 6,  frames: 6, variant: 'a' },
    debuff:       { pack: '5', row: 7,  frames: 6, variant: 'b' },
    arcane:       { pack: '5', row: 15, frames: 7, variant: 'b' },
    arcane_green: { pack: '5', row: 15, frames: 7, variant: 'd' },   // goblin sorcery
    arcane_burst: { pack: '5', row: 28, frames: 9, variant: 'b' },
    dark:         { pack: '5', row: 17, frames: 8, variant: 'b' },
    curse:        { pack: '5', row: 7,  frames: 6, variant: 'b' },
    lightning:    { pack: '5', row: 25, frames: 9, variant: 'c' },
    thunder:      { pack: '5', row: 25, frames: 9, variant: 'f' },
    water:        { pack: '5', row: 24, frames: 9, variant: 'c' },
    ice:          { pack: '5', row: 13, frames: 7, variant: 'c' },
    holy:         { pack: '5', row: 6,  frames: 6, variant: 'e' },
    shield:       { pack: '5', row: 12, frames: 7, variant: 'c' },
    stun:         { pack: '5', row: 14, frames: 7, variant: 'a' },
    roar:         { pack: '5', row: 4,  frames: 6, variant: 'f' },
    summon:       { pack: '5', row: 18, frames: 8, variant: 'b' },
    heart:        { pack: '5', row: 5,  frames: 6, variant: 'e' },
    sparkle:      { pack: '5', row: 13, frames: 7, variant: 'e' },
    wind:         { pack: '5', row: 4,  frames: 6, variant: 'f' },
    earth:        { pack: '5', row: 29, frames: 9, variant: 'a' },
    blood:        { pack: '5', row: 16, frames: 7, variant: 'a' },
    web:          { pack: '5', row: 21, frames: 8, variant: 'f' },
    song:         { pack: '5', row: 1,  frames: 6, variant: 'e' },
    steal:        { pack: '5', row: 13, frames: 7, variant: 'a' },
    swarm_fx:     { pack: '5', row: 21, frames: 8, variant: 'a' },
  };
  for (const k in DJ.FX) { const f = DJ.FX[k]; f.id = k; f.sheet = 'fx' + f.pack + f.variant; }

  function def(id, o) { o.id = id; S[id] = o; return o; }

  // ================= HERO SKILLS =================
  // -- Elf Warrior --
  def('sword_dance',  { name: 'Sword Dance', kind: 'phys', target: 'enemy', power: 2.0, mp: 5, fx: 'slash', sfx: 'slash', desc: 'A graceful strike dealing 170% damage.' });
  def('shield_wall',  { name: 'Shield Wall', kind: 'buff', target: 'allies', mp: 6, status: { id: 'guard', turns: 2, chance: 1 }, self: { id: 'taunt', turns: 2, chance: 1 }, fx: 'shield', sfx: 'buff', desc: 'The party guards behind you, and taunts the enemy.' });
  def('leaf_cyclone', { name: 'Leaf Cyclone', kind: 'phys', target: 'enemies', power: 1.55, mp: 10, fx: 'wind', sfx: 'slash', desc: 'Spinning slash hitting all enemies.' });
  def('elven_fury',   { name: 'Elven Fury', kind: 'phys', target: 'enemy', power: 1.55, hits: 3, mp: 14, fx: 'slash_big', sfx: 'slash', desc: 'Three rapid strikes.' });
  // -- Goblin Mage --
  def('spark',        { name: 'Spark', kind: 'mag', target: 'enemy', power: 1.6, mp: 4, fx: 'arcane_green', sfx: 'magic', desc: 'A crackle of green sorcery.' });
  def('fire_gout',    { name: 'Fire Gout', kind: 'mag', target: 'enemy', power: 1.9, mp: 7, status: { id: 'burn', turns: 3, chance: 0.6 }, fx: 'fire', sfx: 'fire', desc: 'Burns the target, may inflict Burn.' });
  def('mana_storm',   { name: 'Mana Storm', kind: 'mag', target: 'enemies', power: 1.22, mp: 13, fx: 'arcane_burst', sfx: 'magic', desc: 'Arcane blast hitting all enemies.' });
  def('meteor',       { name: 'Goblin Meteor', kind: 'mag', target: 'enemies', power: 2.0, mp: 23, status: { id: 'burn', turns: 2, chance: 0.5 }, fx: 'inferno', sfx: 'explosion', desc: 'Devastating fire on all foes.' });
  // -- Kua Ta Lancer --
  def('lunge',        { name: 'Lunge', kind: 'phys', target: 'enemy', power: 1.95, mp: 5, fx: 'pierce', sfx: 'pierce', desc: 'A piercing thrust.' });
  def('sweep',        { name: 'Spear Sweep', kind: 'phys', target: 'enemies', power: 1.35, mp: 9, fx: 'slash', sfx: 'slash', desc: 'Sweep the spear across all enemies.' });
  def('war_cry',      { name: 'War Cry', kind: 'buff', target: 'allies', mp: 8, status: { id: 'rage', turns: 3, chance: 1 }, fx: 'roar', sfx: 'roar', desc: 'Party gains Rage (+ATK) for 3 turns.' });
  def('impale',       { name: 'Impale', kind: 'phys', target: 'enemy', power: 2.8, mp: 15, status: { id: 'bleed', turns: 3, chance: 0.8 }, fx: 'pierce', sfx: 'pierce', desc: 'Massive damage, causes Bleed.' });
  // -- Frog Monk --
  def('tongue_lash',  { name: 'Tongue Lash', kind: 'phys', target: 'enemy', power: 1.5, mp: 4, status: { id: 'stun', turns: 1, chance: 0.35 }, fx: 'hit', sfx: 'hit', desc: 'Whip strike that may stun.' });
  def('meditate',     { name: 'Meditate', kind: 'heal', target: 'self', power: 1.25, mp: 0, self: { id: 'regen', turns: 2, chance: 1 }, fx: 'heal', sfx: 'heal', desc: 'Heal self and gain Regen. Free.' });
  def('lily_kick',    { name: 'Lily Pad Kick', kind: 'phys', target: 'enemy', power: 1.3, hits: 2, mp: 8, fx: 'hit_big', sfx: 'hit', desc: 'Two quick kicks.' });
  def('thousand_fists', { name: 'Thousand Fists', kind: 'phys', target: 'enemy', power: 0.9, hits: 5, mp: 16, fx: 'hit_big', sfx: 'hit', desc: 'A flurry of five blows.' });
  // -- Dryad Healer --
  def('mend',         { name: 'Mend', kind: 'heal', target: 'ally', power: 1.75, mp: 7, fx: 'heal', sfx: 'heal', desc: 'Heal one ally.' });
  def('thorn_bolt',   { name: 'Thorn Bolt', kind: 'mag', target: 'enemy', power: 1.4, mp: 4, fx: 'thorns', sfx: 'magic', desc: 'Launch a barbed thorn.' });
  def('blooming',     { name: 'Blooming Grove', kind: 'heal', target: 'allies', power: 0.76, mp: 18, status: { id: 'regen', turns: 2, chance: 1 }, fx: 'nature', sfx: 'heal', desc: 'Heal the party and grant Regen.' });
  def('rebirth',      { name: 'Rebirth', kind: 'revive', target: 'deadAlly', power: 0.5, mp: 18, fx: 'holy_heal', sfx: 'revive', desc: 'Revive a fallen ally at 50% HP.' });
  // -- Lizardfolk Berserker --
  def('rend',         { name: 'Rend', kind: 'phys', target: 'enemy', power: 1.6, mp: 4, status: { id: 'bleed', turns: 3, chance: 0.7 }, fx: 'claw', sfx: 'slash', desc: 'Savage cut that bleeds.' });
  def('frenzy',       { name: 'Frenzy', kind: 'buff', target: 'self', mp: 5, status: { id: 'rage', turns: 3, chance: 1 }, self: { id: 'haste', turns: 2, chance: 1 }, fx: 'buff_atk', sfx: 'roar', desc: 'Gain Rage and Haste.' });
  def('twin_axes',    { name: 'Twin Axes', kind: 'phys', target: 'enemy', power: 1.4, hits: 2, mp: 9, fx: 'slash_big', sfx: 'slash', desc: 'Two heavy chops.' });
  def('bloodbath',    { name: 'Bloodbath', kind: 'phys', target: 'enemies', power: 1.6, mp: 16, status: { id: 'bleed', turns: 2, chance: 0.6 }, fx: 'blood', sfx: 'slash', desc: 'Cleave everything. Bleeds.' });
  // -- Moth Oracle --
  def('moon_dust',    { name: 'Moon Dust', kind: 'mag', target: 'enemy', power: 1.68, mp: 4, status: { id: 'blind', turns: 2, chance: 0.5 }, fx: 'sparkle', sfx: 'magic', desc: 'Dust that may blind.' });
  def('foresight',    { name: 'Foresight', kind: 'buff', target: 'allies', mp: 7, status: { id: 'haste', turns: 2, chance: 1 }, fx: 'buff', sfx: 'buff', desc: 'Party gains Haste.' });
  def('lunar_veil',   { name: 'Lunar Veil', kind: 'buff', target: 'allies', mp: 9, status: { id: 'shield', turns: 3, chance: 1, val: 0.36 }, fx: 'shield', sfx: 'buff', desc: 'Shield the party (absorbs damage).' });
  def('prophecy',     { name: 'Prophecy', kind: 'mag', target: 'enemies', power: 2.05, mp: 13, status: { id: 'weak', turns: 2, chance: 0.7 }, fx: 'holy', sfx: 'magic', desc: 'Foretold doom: damage + Weak.' });
  // -- Pygmy Beastmaster --
  def('whip_crack',   { name: 'Whip Crack', kind: 'phys', target: 'enemy', power: 1.62, mp: 4, status: { id: 'weak', turns: 2, chance: 0.65 }, fx: 'slash', sfx: 'whip', desc: 'Lashing strike that weakens.' });
  def('boar_charge',  { name: 'Boar Charge', kind: 'phys', target: 'enemy', power: 2.2, mp: 7, status: { id: 'stun', turns: 1, chance: 0.5 }, fx: 'hit_big', sfx: 'hit', desc: 'Your boar tramples a foe.' });
  def('call_of_wild', { name: 'Call of the Wild', kind: 'buff', target: 'allies', mp: 9, status: { id: 'rage', turns: 2, chance: 1 }, fx: 'roar', sfx: 'roar', desc: 'The pack rallies: party gains Rage.' });
  def('stampede',     { name: 'Stampede', kind: 'phys', target: 'enemies', power: 1.95, mp: 15, fx: 'earth', sfx: 'explosion', desc: 'Beasts trample all enemies.' });
  // -- Orchid Witch --
  def('hex',          { name: 'Hex', kind: 'mag', target: 'enemy', power: 1.3, mp: 4, status: { id: 'weak', turns: 3, chance: 0.8 }, fx: 'curse', sfx: 'debuff', desc: 'Curse a target with Weak.' });
  def('venom_petals', { name: 'Venom Petals', kind: 'mag', target: 'enemies', power: 0.9, mp: 11, status: { id: 'poison', turns: 3, chance: 0.8 }, fx: 'poison', sfx: 'poison', desc: 'Poison every enemy.' });
  def('sleep_pollen', { name: 'Sleep Pollen', kind: 'debuff', target: 'enemies', mp: 12, status: { id: 'stun', turns: 1, chance: 0.42 }, fx: 'sparkle', sfx: 'debuff', desc: 'May stun all enemies.' });
  def('wither',       { name: 'Wither', kind: 'drain', target: 'enemy', power: 1.95, mp: 16, drain: 0.38, fx: 'dark', sfx: 'drain', desc: 'Drain life; heals you for half.' });
  // -- Golem Guardian --
  def('boulder_fist', { name: 'Boulder Fist', kind: 'phys', target: 'enemy', power: 2.1, mp: 5, fx: 'earth', sfx: 'hit', desc: 'Crushing stone punch.' });
  def('bulwark',      { name: 'Bulwark', kind: 'buff', target: 'self', mp: 4, status: { id: 'guard', turns: 3, chance: 1 }, self: [{ id: 'regen', turns: 2, chance: 1 }, { id: 'taunt', turns: 3, chance: 1 }], fx: 'shield', sfx: 'buff', desc: 'Harden: Guard, Regen, and taunts the enemy.' });
  def('quake',        { name: 'Quake', kind: 'phys', target: 'enemies', power: 1.62, mp: 11, status: { id: 'slow', turns: 2, chance: 0.6 }, fx: 'earth', sfx: 'explosion', desc: 'Shake the ground; slows enemies.' });
  def('mountain',     { name: 'Living Mountain', kind: 'buff', target: 'allies', mp: 13, status: { id: 'shield', turns: 3, chance: 1, val: 0.46 }, fx: 'shield', sfx: 'buff', desc: 'Big shield for the whole party.' });
  // -- Ratkin Corsair --
  def('cutlass',      { name: 'Cutlass Slash', kind: 'phys', target: 'enemy', power: 1.78, mp: 4, crit: 0.3, fx: 'slash', sfx: 'slash', desc: 'Slash with high crit chance.' });
  def('plunder',      { name: 'Plunder', kind: 'phys', target: 'enemy', power: 1.45, mp: 6, gold: 1, fx: 'steal', sfx: 'gold', desc: 'Strike and steal gold.' });
  def('powder_bomb',  { name: 'Powder Bomb', kind: 'phys', target: 'enemies', power: 1.3, mp: 11, status: { id: 'blind', turns: 2, chance: 0.5 }, fx: 'fireball', sfx: 'explosion', desc: 'Explosive blinding blast.' });
  def('broadside',    { name: 'Broadside', kind: 'phys', target: 'enemy', power: 1.34, hits: 4, mp: 15, crit: 0.2, fx: 'hit_big', sfx: 'explosion', desc: 'Four shots, each can crit.' });
  // -- Firefly Ranger --
  def('aimed_shot',   { name: 'Aimed Shot', kind: 'phys', target: 'enemy', power: 1.95, mp: 5, crit: 0.25, fx: 'pierce', sfx: 'arrow', desc: 'Precise arrow.' });
  def('firefly_volley', { name: 'Firefly Volley', kind: 'phys', target: 'enemies', power: 1.42, mp: 10, status: { id: 'burn', turns: 2, chance: 0.4 }, fx: 'sparkle', sfx: 'arrow', desc: 'Glowing arrows rain on all foes.' });
  def('snare',        { name: 'Snare', kind: 'debuff', target: 'enemy', mp: 6, status: { id: 'stun', turns: 1, chance: 0.8 }, fx: 'web', sfx: 'debuff', desc: 'Trap an enemy (likely stun).' });
  def('piercing_light', { name: 'Piercing Light', kind: 'phys', target: 'enemy', power: 3.0, mp: 16, fx: 'holy', sfx: 'arrow', desc: 'A radiant arrow of enormous power.' });
  // -- Sporeling Druid --
  def('spore_puff',   { name: 'Spore Puff', kind: 'mag', target: 'enemy', power: 1.18, mp: 5, status: { id: 'poison', turns: 3, chance: 0.9 }, fx: 'poison', sfx: 'poison', desc: 'Poisonous spores.' });
  def('mycelium',     { name: 'Mycelium Mend', kind: 'heal', target: 'allies', power: 0.6, mp: 17, fx: 'heal', sfx: 'heal', desc: 'Heal the whole party.' });
  def('toxic_bloom',  { name: 'Toxic Bloom', kind: 'mag', target: 'enemies', power: 0.92, mp: 17, status: { id: 'poison', turns: 3, chance: 0.9 }, fx: 'poison_cloud', sfx: 'poison', desc: 'Poison cloud on all enemies.' });
  def('fungal_rebirth', { name: 'Fungal Rebirth', kind: 'revive', target: 'deadAlly', power: 0.35, mp: 19, self: { id: 'regen', turns: 2, chance: 1 }, fx: 'nature', sfx: 'revive', desc: 'Revive an ally at 40% HP.' });
  // -- Tiger Shaman --
  def('totem_strike', { name: 'Totem Strike', kind: 'phys', target: 'enemy', power: 1.68, mp: 4, fx: 'hit', sfx: 'hit', desc: 'Smash with the totem staff.' });
  def('spirit_lightning', { name: 'Spirit Lightning', kind: 'mag', target: 'enemy', power: 2.35, mp: 7, status: { id: 'stun', turns: 1, chance: 0.3 }, fx: 'lightning', sfx: 'thunder', desc: 'Lightning that may stun.' });
  def('ancestor_ward', { name: 'Ancestor Ward', kind: 'buff', target: 'allies', mp: 10, status: { id: 'guard', turns: 3, chance: 1 }, fx: 'buff', sfx: 'buff', desc: 'Ancestors guard the party.' });
  def('tiger_spirit', { name: 'Tiger Spirit', kind: 'phys', target: 'enemies', power: 2.2, mp: 16, fx: 'claw', sfx: 'roar', desc: 'The tiger spirit mauls all enemies.' });
  // -- Harpy Skydancer --
  def('dive',         { name: 'Sky Dive', kind: 'phys', target: 'enemy', power: 2.0, mp: 5, fx: 'pierce', sfx: 'wind', desc: 'Plunge from above.' });
  def('gale',         { name: 'Gale', kind: 'phys', target: 'enemies', power: 1.3, mp: 9, status: { id: 'slow', turns: 2, chance: 0.6 }, fx: 'wind', sfx: 'wind', desc: 'Winds slow all enemies.' });
  def('tailwind',     { name: 'Tailwind', kind: 'buff', target: 'allies', mp: 8, status: { id: 'haste', turns: 3, chance: 1 }, fx: 'wind', sfx: 'buff', desc: 'Party gains Haste.' });
  def('talon_storm',  { name: 'Talon Storm', kind: 'phys', target: 'enemy', power: 1.45, hits: 4, mp: 15, fx: 'claw', sfx: 'slash', desc: 'Four raking talons.' });
  // -- Ghoul Necromancer --
  def('soul_drain',   { name: 'Soul Drain', kind: 'drain', target: 'enemy', power: 1.5, mp: 4, drain: 0.6, fx: 'dark', sfx: 'drain', desc: 'Drain life; heals you.' });
  def('bone_shards',  { name: 'Bone Shards', kind: 'mag', target: 'enemies', power: 1.2, mp: 9, status: { id: 'bleed', turns: 2, chance: 0.5 }, fx: 'curse', sfx: 'magic', desc: 'Shards cut all enemies.' });
  def('raise_ally',   { name: 'Raise Ally', kind: 'revive', target: 'deadAlly', power: 0.35, mp: 14, fx: 'dark', sfx: 'revive', desc: 'Revive at 35% HP.' });
  def('death_pact',   { name: 'Death Pact', kind: 'drain', target: 'enemies', power: 1.6, mp: 16, drain: 0.4, fx: 'dark', sfx: 'drain', desc: 'Drain all enemies.' });
  // -- Beetle Knight --
  def('lance_charge', { name: 'Lance Charge', kind: 'phys', target: 'enemy', power: 2.0, mp: 5, fx: 'pierce', sfx: 'pierce', desc: 'Charge with the lance.' });
  def('carapace',     { name: 'Carapace', kind: 'buff', target: 'self', mp: 4, status: { id: 'guard', turns: 3, chance: 1 }, self: [{ id: 'shield', turns: 3, chance: 1, val: 0.3 }, { id: 'taunt', turns: 3, chance: 1 }], fx: 'shield', sfx: 'buff', desc: 'Guard, Shield, and taunts the enemy.' });
  def('shield_bash',  { name: 'Shield Bash', kind: 'phys', target: 'enemy', power: 1.68, mp: 7, status: { id: 'stun', turns: 1, chance: 0.7 }, fx: 'hit_big', sfx: 'hit', desc: 'Bash that often stuns.' });
  def('horn_toss',    { name: 'Horn Toss', kind: 'phys', target: 'enemies', power: 1.92, mp: 14, fx: 'slash_big', sfx: 'slash', desc: 'Toss all enemies with your horns.' });
  // -- Naga Assassin --
  def('fang_strike',  { name: 'Fang Strike', kind: 'phys', target: 'enemy', power: 1.5, mp: 4, crit: 0.3, status: { id: 'poison', turns: 2, chance: 0.5 }, fx: 'slash', sfx: 'slash', desc: 'Poisoned blade, high crit.' });
  def('shadow_step',  { name: 'Shadow Step', kind: 'buff', target: 'self', mp: 5, status: { id: 'haste', turns: 3, chance: 1 }, self: { id: 'rage', turns: 2, chance: 1 }, fx: 'dark', sfx: 'buff', desc: 'Haste + Rage on self.' });
  def('assassinate',  { name: 'Assassinate', kind: 'phys', target: 'enemy', power: 2.6, mp: 12, crit: 0.5, fx: 'slash_big', sfx: 'crit', desc: 'Lethal strike, 50% crit.' });
  def('venom_dance',  { name: 'Venom Dance', kind: 'phys', target: 'enemies', power: 1.2, mp: 15, status: { id: 'poison', turns: 3, chance: 0.8 }, fx: 'poison', sfx: 'slash', desc: 'Poison blades on all enemies.' });
  // -- Panda Brewmaster --
  def('gourd_smash',  { name: 'Gourd Smash', kind: 'phys', target: 'enemy', power: 1.6, mp: 4, fx: 'hit_big', sfx: 'hit', desc: 'Bonk with the gourd.' });
  def('healing_brew', { name: 'Healing Brew', kind: 'heal', target: 'ally', power: 1.8, mp: 6, status: { id: 'regen', turns: 2, chance: 1 }, fx: 'heal', sfx: 'potion', desc: 'Heal an ally and grant Regen.' });
  def('fire_brew',    { name: 'Fire Brew', kind: 'mag', target: 'enemies', power: 1.4, mp: 10, status: { id: 'burn', turns: 2, chance: 0.6 }, fx: 'flame', sfx: 'fire', desc: 'Spit flaming brew at all foes.' });
  def('master_brew',  { name: 'Master Brew', kind: 'heal', target: 'allies', power: 0.92, mp: 19, status: { id: 'rage', turns: 2, chance: 1 }, fx: 'buff', sfx: 'potion', desc: 'Heal party and grant Rage.' });
  // -- Gorilla Stormcaller --
  def('thunder_fist', { name: 'Thunder Fist', kind: 'phys', target: 'enemy', power: 1.88, mp: 5, status: { id: 'stun', turns: 1, chance: 0.4 }, fx: 'thunder', sfx: 'thunder', desc: 'Electrified punch.' });
  def('chain_lightning', { name: 'Chain Lightning', kind: 'mag', target: 'enemies', power: 1.5, mp: 10, fx: 'lightning', sfx: 'thunder', desc: 'Lightning arcs to all enemies.' });
  def('storm_skin',   { name: 'Storm Skin', kind: 'buff', target: 'self', mp: 5, status: { id: 'rage', turns: 3, chance: 1 }, self: { id: 'guard', turns: 2, chance: 1 }, fx: 'buff_atk', sfx: 'buff', desc: 'Rage + Guard on self.' });
  def('tempest',      { name: 'Tempest', kind: 'mag', target: 'enemies', power: 2.25, mp: 17, status: { id: 'stun', turns: 1, chance: 0.3 }, fx: 'thunder', sfx: 'thunder', desc: 'A storm crashes on all enemies.' });
  // -- Chameleon Ninja --
  def('katana_cut',   { name: 'Katana Cut', kind: 'phys', target: 'enemy', power: 1.7, mp: 4, crit: 0.2, fx: 'slash', sfx: 'slash', desc: 'Swift clean cut.' });
  def('vanish',       { name: 'Vanish', kind: 'buff', target: 'self', mp: 5, status: { id: 'shield', turns: 2, chance: 1, val: 0.6 }, self: { id: 'haste', turns: 2, chance: 1 }, fx: 'dark', sfx: 'buff', desc: 'Blend in: big Shield + Haste.' });
  def('shuriken_rain', { name: 'Shuriken Rain', kind: 'phys', target: 'enemies', power: 1.1, mp: 9, fx: 'slash', sfx: 'slash', desc: 'Throwing stars at all foes.' });
  def('thousand_cuts', { name: 'Thousand Cuts', kind: 'phys', target: 'enemy', power: 0.8, hits: 6, mp: 16, crit: 0.15, fx: 'slash_big', sfx: 'slash', desc: 'Six slashes.' });
  // -- Treant Sage --
  def('root_grasp',   { name: 'Root Grasp', kind: 'mag', target: 'enemy', power: 1.4, mp: 4, status: { id: 'slow', turns: 2, chance: 0.7 }, fx: 'vine', sfx: 'magic', desc: 'Roots slow a target.' });
  def('sap_surge',    { name: 'Sap Surge', kind: 'heal', target: 'allies', power: 0.69, mp: 15, status: { id: 'regen', turns: 3, chance: 1 }, fx: 'nature', sfx: 'heal', desc: 'Heal + Regen for the party.' });
  def('ancient_word', { name: 'Ancient Word', kind: 'mag', target: 'enemies', power: 1.32, mp: 13, fx: 'holy', sfx: 'magic', desc: 'Words of power strike all enemies.' });
  def('worldroot',    { name: 'Worldroot', kind: 'mag', target: 'enemies', power: 1.8, mp: 22, status: { id: 'stun', turns: 1, chance: 0.4 }, fx: 'vine', sfx: 'explosion', desc: 'The roots of the world erupt.' });
  // -- Jaguar Paladin --
  def('sun_mace',     { name: 'Sun Mace', kind: 'phys', target: 'enemy', power: 1.6, mp: 4, fx: 'holy', sfx: 'hit', desc: 'A radiant blow.' });
  def('lay_on_paws',  { name: 'Lay on Paws', kind: 'heal', target: 'ally', power: 1.8, mp: 6, fx: 'holy_heal', sfx: 'heal', desc: 'Holy healing.' });
  def('solar_shield', { name: 'Solar Shield', kind: 'buff', target: 'allies', mp: 10, status: { id: 'shield', turns: 2, chance: 1, val: 0.3 }, self: { id: 'guard', turns: 2, chance: 1 }, fx: 'shield', sfx: 'buff', desc: 'Shield party; Guard self.' });
  def('judgement',    { name: 'Judgement', kind: 'phys', target: 'enemy', power: 2.6, mp: 14, status: { id: 'weak', turns: 2, chance: 0.6 }, fx: 'holy', sfx: 'crit', desc: 'Righteous smite, weakens.' });

  // -- Toucan Bard --
  def('beak_jab',     { name: 'Beak Jab', kind: 'phys', target: 'enemy', power: 1.55, mp: 4, fx: 'pierce', sfx: 'pierce', desc: 'A quick stab of that enormous beak.' });
  def('rally_song',   { name: 'Rally Song', kind: 'buff', target: 'allies', mp: 6, status: { id: 'haste', turns: 3, chance: 1 }, self: { id: 'rage', turns: 3, chance: 1 }, fx: 'song', sfx: 'buff', desc: 'The party gains Haste; you gain Rage.' });
  def('discord_cry',  { name: 'Discordant Cry', kind: 'debuff', target: 'enemies', mp: 10, status: { id: 'weak', turns: 3, chance: 0.8 }, fx: 'song', sfx: 'debuff', desc: 'An awful noise. All enemies are Weakened.' });
  def('dawn_anthem',  { name: 'Anthem of Dawn', kind: 'heal', target: 'allies', power: 0.92, mp: 17, status: { id: 'regen', turns: 3, chance: 1 }, fx: 'holy_heal', sfx: 'heal', desc: 'Heal the party and grant Regen.' });

  // -- Scarab Alchemist --
  def('acid_flask',   { name: 'Acid Flask', kind: 'mag', target: 'enemy', power: 1.7, mp: 5, status: { id: 'weak', turns: 3, chance: 0.6 }, fx: 'poison', sfx: 'poison', desc: 'Corrosive glass. Eats armour as well as flesh.' });
  def('smoke_screen', { name: 'Smoke Screen', kind: 'buff', target: 'allies', mp: 7, status: { id: 'shield', turns: 3, chance: 1, val: 0.3 }, fx: 'debuff', sfx: 'debuff', desc: 'Cover the party in choking smoke: Shield for 3 turns.' });
  def('volatile_mix', { name: 'Volatile Mix', kind: 'mag', target: 'enemies', power: 1.32, mp: 13, status: { id: 'burn', turns: 2, chance: 0.6 }, fx: 'fireball', sfx: 'explosion', desc: 'Whatever was in the flask, it is angry now.' });
  def('philos_fire',  { name: "Philosopher's Fire", kind: 'mag', target: 'enemies', power: 1.7, mp: 24, status: { id: 'burn', turns: 3, chance: 0.7 }, fx: 'inferno', sfx: 'explosion', desc: 'The reaction he has spent his life perfecting.' });

  // -- Sloth Sentinel --
  def('slow_swipe',   { name: 'Slow Swipe', kind: 'phys', target: 'enemy', power: 2.55, mp: 5, fx: 'claw', sfx: 'slash', desc: 'It takes a while. It lands like a falling tree.' });
  def('immovable',    { name: 'Immovable', kind: 'buff', target: 'self', mp: 5, status: { id: 'guard', turns: 3, chance: 1 }, self: [{ id: 'shield', turns: 3, chance: 1, val: 0.32 }, { id: 'taunt', turns: 3, chance: 1 }], fx: 'shield', sfx: 'buff', desc: 'Guard, a solid Shield, and taunts the enemy.' });
  def('canopy_hold',  { name: 'Canopy Hold', kind: 'buff', target: 'allies', mp: 13, status: { id: 'guard', turns: 3, chance: 1 }, self: [{ id: 'regen', turns: 3, chance: 1 }, { id: 'taunt', turns: 3, chance: 1 }], fx: 'nature', sfx: 'buff', desc: 'The party braces behind you and Guards, and taunts the enemy.' });
  def('avalanche',    { name: 'Avalanche', kind: 'phys', target: 'enemies', power: 1.92, mp: 17, status: { id: 'stun', turns: 1, chance: 0.35 }, fx: 'earth', sfx: 'explosion', desc: 'You finally let go. Everything below you regrets it.' });

  // -- Peacock Duelist --
  def('riposte',      { name: 'Riposte', kind: 'phys', target: 'enemy', power: 1.5, mp: 4, crit: 0.26, fx: 'slash', sfx: 'slash', desc: 'A precise counter-thrust. High crit chance.' });
  def('feint',        { name: 'Feint', kind: 'debuff', target: 'enemy', mp: 5, status: { id: 'weak', turns: 3, chance: 0.9 }, self: { id: 'haste', turns: 2, chance: 1 }, fx: 'sparkle', sfx: 'debuff', desc: 'Weaken a foe and gain Haste.' });
  def('plume_flourish', { name: 'Plume Flourish', kind: 'phys', target: 'enemy', power: 1.15, hits: 3, mp: 11, crit: 0.15, fx: 'slash_big', sfx: 'slash', desc: 'Three showy, deadly strikes.' });
  def('perfect_thrust', { name: 'Perfect Thrust', kind: 'phys', target: 'enemy', power: 2.4, mp: 17, crit: 0.33, fx: 'pierce', sfx: 'crit', desc: 'One thrust. Usually enough.' });

  // -- Crocodile Warlord --
  def('jaw_crush',    { name: 'Jaw Crush', kind: 'phys', target: 'enemy', power: 1.8, mp: 5, status: { id: 'bleed', turns: 3, chance: 0.7 }, fx: 'hit_big', sfx: 'bite', desc: 'Clamps down and does not let go.' });
  def('war_banner',   { name: 'War Banner', kind: 'buff', target: 'allies', mp: 9, status: { id: 'rage', turns: 3, chance: 1 }, self: { id: 'guard', turns: 2, chance: 1 }, fx: 'roar', sfx: 'roar', desc: 'The party gains Rage; you also Guard.' });
  def('tail_cleave',  { name: 'Tail Cleave', kind: 'phys', target: 'enemies', power: 1.45, mp: 12, fx: 'slash_big', sfx: 'slash', desc: 'One sweep of a very large tail.' });
  def('death_roll',   { name: 'Death Roll', kind: 'phys', target: 'enemy', power: 2.8, mp: 19, status: { id: 'bleed', turns: 3, chance: 0.9 }, fx: 'blood', sfx: 'crit', desc: 'The old crocodile answer to everything.' });

  // -- Axolotl Mystic --
  def('water_lash',   { name: 'Water Lash', kind: 'mag', target: 'enemy', power: 1.6, mp: 4, fx: 'water', sfx: 'water', desc: 'A whip of living river water.' });
  def('regrowth',     { name: 'Regrowth', kind: 'heal', target: 'ally', power: 1.65, mp: 9, status: { id: 'regen', turns: 3, chance: 1 }, fx: 'heal', sfx: 'heal', desc: 'Heal an ally and grant Regen.' });
  def('tidal_surge',  { name: 'Tidal Surge', kind: 'mag', target: 'enemies', power: 1.28, mp: 14, status: { id: 'slow', turns: 2, chance: 0.7 }, fx: 'water', sfx: 'water', desc: 'The river rises on your word. All enemies are Slowed.' });
  def('eternal_return', { name: 'Eternal Return', kind: 'revive', target: 'deadAlly', power: 0.6, mp: 22, self: { id: 'regen', turns: 3, chance: 1 }, fx: 'holy_heal', sfx: 'revive', desc: 'Revive a fallen ally at 60% HP. Nothing truly dies here.' });

  // -- Termite Swarmlord --
  def('gnawing_swarm', { name: 'Gnawing Swarm', kind: 'phys', target: 'enemy', power: 0.86, hits: 4, mp: 10, fx: 'hit', sfx: 'bite', desc: 'Four waves of jaws.' });
  def('chitin_ward',  { name: 'Chitin Ward', kind: 'buff', target: 'allies', mp: 8, status: { id: 'guard', turns: 3, chance: 1 }, fx: 'shield', sfx: 'buff', desc: 'Plates of chitin cover the party: Guard.' });
  def('hollow_bones', { name: 'Hollow the Bones', kind: 'phys', target: 'enemy', power: 1.9, mp: 6, status: { id: 'weak', turns: 3, chance: 0.85 }, fx: 'claw', sfx: 'bite', desc: 'Chews through armour. Leaves the target Weak.' });
  def('devour_tide',  { name: 'Devouring Tide', kind: 'phys', target: 'enemies', power: 1.45, mp: 18, status: { id: 'weak', turns: 2, chance: 0.7 }, fx: 'swarm_fx', sfx: 'bite', desc: 'The whole colony pours over the battlefield.' });

  // ================= MONSTER ABILITIES =================
  def('m_bite',       { name: 'Bite', kind: 'phys', target: 'enemy', power: 1.2, mp: 0, fx: 'hit', sfx: 'bite', desc: 'A vicious bite.' });
  def('m_scratch',    { name: 'Scratch', kind: 'phys', target: 'enemy', power: 1.0, mp: 0, fx: 'claw', sfx: 'slash', desc: 'Raking claws.' });
  def('m_gnaw',       { name: 'Gnaw', kind: 'phys', target: 'enemy', power: 1.1, mp: 0, status: { id: 'bleed', turns: 2, chance: 0.4 }, fx: 'hit', sfx: 'bite', desc: 'Gnawing attack that may bleed.' });
  def('m_tackle',     { name: 'Tackle', kind: 'phys', target: 'enemy', power: 1.3, mp: 0, fx: 'hit_big', sfx: 'hit', desc: 'Body slam.' });
  def('m_sting',      { name: 'Sting', kind: 'phys', target: 'enemy', power: 1.0, mp: 0, status: { id: 'poison', turns: 3, chance: 0.6 }, fx: 'poison', sfx: 'pierce', desc: 'Poisonous sting.' });
  def('m_spit',       { name: 'Acid Spit', kind: 'mag', target: 'enemy', power: 1.2, mp: 0, status: { id: 'weak', turns: 2, chance: 0.4 }, fx: 'poison', sfx: 'poison', desc: 'Corrosive spit.' });
  def('m_web',        { name: 'Web', kind: 'debuff', target: 'enemy', mp: 0, status: { id: 'slow', turns: 2, chance: 0.9 }, fx: 'web', sfx: 'debuff', desc: 'Sticky web slows.' });
  def('m_screech',    { name: 'Screech', kind: 'debuff', target: 'enemies', mp: 0, status: { id: 'weak', turns: 2, chance: 0.5 }, fx: 'roar', sfx: 'roar', desc: 'Ear-splitting screech.' });
  def('m_swarm',      { name: 'Swarm', kind: 'phys', target: 'enemies', power: 0.7, mp: 0, fx: 'hit', sfx: 'bite', desc: 'Countless small bites.' });
  def('m_vine_whip',  { name: 'Vine Whip', kind: 'phys', target: 'enemy', power: 1.4, mp: 0, fx: 'vine', sfx: 'whip', desc: 'Whipping vine.' });
  def('m_thorns',     { name: 'Thorn Burst', kind: 'mag', target: 'enemies', power: 0.9, mp: 0, status: { id: 'bleed', turns: 2, chance: 0.4 }, fx: 'thorns', sfx: 'magic', desc: 'Thorns fly everywhere.' });
  def('m_heal',       { name: 'Regrow', kind: 'heal', target: 'ally', power: 1.8, mp: 0, fx: 'heal', sfx: 'heal', desc: 'Heals an ally.' });
  def('m_regen',      { name: 'Photosynthesis', kind: 'buff', target: 'self', mp: 0, status: { id: 'regen', turns: 3, chance: 1 }, fx: 'nature', sfx: 'heal', desc: 'Gains Regen.' });
  def('m_harden',     { name: 'Harden', kind: 'buff', target: 'self', mp: 0, status: { id: 'guard', turns: 3, chance: 1 }, fx: 'shield', sfx: 'buff', desc: 'Toughens its hide.' });
  def('m_enrage',     { name: 'Enrage', kind: 'buff', target: 'self', mp: 0, status: { id: 'rage', turns: 3, chance: 1 }, fx: 'buff_atk', sfx: 'roar', desc: 'Flies into a rage.' });
  def('m_howl',       { name: 'Howl', kind: 'buff', target: 'allies', mp: 0, status: { id: 'rage', turns: 2, chance: 1 }, fx: 'roar', sfx: 'roar', desc: 'Rallies the pack.' });
  def('m_fireball',   { name: 'Fireball', kind: 'mag', target: 'enemy', power: 1.6, mp: 0, status: { id: 'burn', turns: 2, chance: 0.5 }, fx: 'fireball', sfx: 'fire', desc: 'A ball of fire.' });
  def('m_flame_breath', { name: 'Flame Breath', kind: 'mag', target: 'enemies', power: 1.2, mp: 0, status: { id: 'burn', turns: 2, chance: 0.5 }, fx: 'flame', sfx: 'fire', desc: 'Breathes fire on all.' });
  def('m_poison_cloud', { name: 'Poison Cloud', kind: 'mag', target: 'enemies', power: 0.8, mp: 0, status: { id: 'poison', turns: 3, chance: 0.7 }, fx: 'poison_cloud', sfx: 'poison', desc: 'Toxic mist.' });
  def('m_shadow_bolt', { name: 'Shadow Bolt', kind: 'mag', target: 'enemy', power: 1.5, mp: 0, fx: 'dark', sfx: 'magic', desc: 'Bolt of darkness.' });
  def('m_lightning',  { name: 'Lightning', kind: 'mag', target: 'enemy', power: 1.6, mp: 0, status: { id: 'stun', turns: 1, chance: 0.25 }, fx: 'lightning', sfx: 'thunder', desc: 'Bolt from the canopy.' });
  def('m_thunderclap', { name: 'Thunderclap', kind: 'mag', target: 'enemies', power: 1.1, mp: 0, status: { id: 'stun', turns: 1, chance: 0.2 }, fx: 'thunder', sfx: 'thunder', desc: 'Deafening thunder.' });
  def('m_water_jet',  { name: 'Water Jet', kind: 'mag', target: 'enemy', power: 1.4, mp: 0, fx: 'water', sfx: 'water', desc: 'High-pressure water.' });
  def('m_curse',      { name: 'Curse', kind: 'debuff', target: 'enemy', mp: 0, status: { id: 'weak', turns: 3, chance: 0.9 }, fx: 'curse', sfx: 'debuff', desc: 'A withering curse.' });
  def('m_drain',      { name: 'Life Drain', kind: 'drain', target: 'enemy', power: 1.3, mp: 0, drain: 0.6, fx: 'dark', sfx: 'drain', desc: 'Drains life.' });
  def('m_petrify',    { name: 'Petrifying Gaze', kind: 'debuff', target: 'enemy', mp: 0, status: { id: 'stun', turns: 1, chance: 0.7 }, fx: 'stun', sfx: 'debuff', desc: 'Gaze that freezes.' });
  def('m_crush',      { name: 'Crush', kind: 'phys', target: 'enemy', power: 1.9, mp: 0, fx: 'earth', sfx: 'hit', desc: 'A crushing blow.' });
  def('m_slam',       { name: 'Ground Slam', kind: 'phys', target: 'enemies', power: 1.0, mp: 0, fx: 'earth', sfx: 'explosion', desc: 'Slams the ground.' });
  def('m_stomp',      { name: 'Stomp', kind: 'phys', target: 'enemies', power: 0.9, mp: 0, status: { id: 'slow', turns: 2, chance: 0.4 }, fx: 'earth', sfx: 'hit', desc: 'Shakes everyone.' });
  def('m_rend',       { name: 'Rend', kind: 'phys', target: 'enemy', power: 1.4, mp: 0, status: { id: 'bleed', turns: 3, chance: 0.6 }, fx: 'claw', sfx: 'slash', desc: 'Tearing claws.' });
  def('m_dart',       { name: 'Poison Dart', kind: 'phys', target: 'enemy', power: 1.1, mp: 0, status: { id: 'poison', turns: 3, chance: 0.8 }, fx: 'pierce', sfx: 'arrow', desc: 'A poisoned dart.' });
  def('m_blowgun_volley', { name: 'Dart Volley', kind: 'phys', target: 'enemies', power: 0.8, mp: 0, status: { id: 'poison', turns: 2, chance: 0.5 }, fx: 'pierce', sfx: 'arrow', desc: 'Darts at everyone.' });
  def('m_wing_gust',  { name: 'Wing Gust', kind: 'mag', target: 'enemies', power: 0.9, mp: 0, status: { id: 'slow', turns: 2, chance: 0.4 }, fx: 'wind', sfx: 'wind', desc: 'A blast of wind.' });
  def('m_spore_burst', { name: 'Spore Burst', kind: 'mag', target: 'enemies', power: 0.9, mp: 0, status: { id: 'poison', turns: 2, chance: 0.6 }, fx: 'poison_cloud', sfx: 'poison', desc: 'Cloud of spores.' });
  def('m_blind_dust', { name: 'Blinding Dust', kind: 'debuff', target: 'enemies', mp: 0, status: { id: 'blind', turns: 2, chance: 0.6 }, fx: 'sparkle', sfx: 'debuff', desc: 'Dust in the eyes.' });
  def('m_constrict',  { name: 'Constrict', kind: 'phys', target: 'enemy', power: 1.5, mp: 0, status: { id: 'stun', turns: 1, chance: 0.4 }, fx: 'vine', sfx: 'hit', desc: 'Crushing coils.' });
  def('m_venom_fang', { name: 'Venom Fang', kind: 'phys', target: 'enemy', power: 1.3, mp: 0, status: { id: 'poison', turns: 3, chance: 0.8 }, fx: 'poison', sfx: 'bite', desc: 'Venomous bite.' });
  def('m_holy_smite', { name: 'Sun Smite', kind: 'mag', target: 'enemy', power: 1.7, mp: 0, fx: 'holy', sfx: 'magic', desc: 'Searing light.' });
  def('m_sun_flare',  { name: 'Sun Flare', kind: 'mag', target: 'enemies', power: 1.2, mp: 0, status: { id: 'blind', turns: 2, chance: 0.5 }, fx: 'holy', sfx: 'explosion', desc: 'Blinding flare.' });
  def('m_bone_spear', { name: 'Bone Spear', kind: 'mag', target: 'enemy', power: 1.7, mp: 0, status: { id: 'bleed', turns: 2, chance: 0.5 }, fx: 'curse', sfx: 'pierce', desc: 'A spear of bone.' });
  def('m_plague',     { name: 'Plague', kind: 'debuff', target: 'enemies', mp: 0, status: { id: 'poison', turns: 4, chance: 0.9 }, fx: 'poison_cloud', sfx: 'poison', desc: 'Virulent plague.' });
  def('m_frenzy_bite', { name: 'Frenzy', kind: 'phys', target: 'enemy', power: 0.8, hits: 3, mp: 0, fx: 'hit', sfx: 'bite', desc: 'Frenzied biting.' });
  def('m_charge',     { name: 'Charge', kind: 'phys', target: 'enemy', power: 1.7, mp: 0, status: { id: 'stun', turns: 1, chance: 0.3 }, fx: 'hit_big', sfx: 'hit', desc: 'Headlong charge.' });
  def('m_mud_toss',   { name: 'Mud Toss', kind: 'mag', target: 'enemy', power: 1.0, mp: 0, status: { id: 'blind', turns: 2, chance: 0.6 }, fx: 'earth', sfx: 'hit', desc: 'Blinding mud.' });
  def('m_shell_spin', { name: 'Shell Spin', kind: 'phys', target: 'enemies', power: 0.8, mp: 0, fx: 'wind', sfx: 'hit', desc: 'Spins into everyone.' });
  def('m_leech',      { name: 'Leech', kind: 'drain', target: 'enemy', power: 1.0, mp: 0, drain: 1.0, fx: 'blood', sfx: 'drain', desc: 'Sucks blood.' });
  def('m_ghost_touch', { name: 'Ghost Touch', kind: 'mag', target: 'enemy', power: 1.3, mp: 0, status: { id: 'slow', turns: 2, chance: 0.5 }, fx: 'dark', sfx: 'magic', desc: 'Chilling touch.' });
  def('m_wail',       { name: 'Wail', kind: 'mag', target: 'enemies', power: 0.9, mp: 0, status: { id: 'weak', turns: 2, chance: 0.5 }, fx: 'song', sfx: 'roar', desc: 'A mournful wail.' });
  def('m_stone_skin', { name: 'Stone Skin', kind: 'buff', target: 'allies', mp: 0, status: { id: 'guard', turns: 2, chance: 1 }, fx: 'shield', sfx: 'buff', desc: 'Hardens its allies.' });
  def('m_void_claw',  { name: 'Void Claw', kind: 'phys', target: 'enemy', power: 1.8, mp: 0, status: { id: 'blind', turns: 1, chance: 0.4 }, fx: 'dark', sfx: 'slash', desc: 'Claws of nothing.' });
  def('m_earthquake', { name: 'Earthquake', kind: 'phys', target: 'enemies', power: 1.4, mp: 0, status: { id: 'stun', turns: 1, chance: 0.25 }, fx: 'earth', sfx: 'explosion', desc: 'The ground heaves.' });
  def('m_tail_swipe', { name: 'Tail Swipe', kind: 'phys', target: 'enemies', power: 1.0, mp: 0, fx: 'slash', sfx: 'slash', desc: 'Sweeping tail.' });
  def('m_devour',     { name: 'Devour', kind: 'drain', target: 'enemy', power: 2.0, mp: 0, drain: 0.5, fx: 'hit_big', sfx: 'bite', desc: 'Tries to eat you.' });
  def('m_nightmare',  { name: 'Nightmare', kind: 'debuff', target: 'enemies', mp: 0, status: { id: 'stun', turns: 1, chance: 0.4 }, fx: 'sparkle', sfx: 'debuff', desc: 'Dreadful visions.' });
  def('m_storm',      { name: 'Storm', kind: 'mag', target: 'enemies', power: 1.5, mp: 0, status: { id: 'stun', turns: 1, chance: 0.25 }, fx: 'thunder', sfx: 'thunder', desc: 'A raging storm.' });

  // Boss / final abilities
  def('b_bramble_crown', { name: 'Bramble Crown', kind: 'phys', target: 'enemies', power: 1.3, mp: 0, status: { id: 'bleed', turns: 3, chance: 0.6 }, fx: 'thorns', sfx: 'explosion', desc: 'Thorns erupt around everyone.' });
  def('b_root_prison', { name: 'Root Prison', kind: 'debuff', target: 'enemy', mp: 0, status: { id: 'stun', turns: 1, chance: 0.9 }, fx: 'vine', sfx: 'debuff', desc: 'Roots bind a hero.' });
  def('b_venom_flood', { name: 'Venom Flood', kind: 'mag', target: 'enemies', power: 1.3, mp: 0, status: { id: 'poison', turns: 3, chance: 0.9 }, fx: 'poison_cloud', sfx: 'poison', desc: 'A flood of venom.' });
  def('b_fang_barrage', { name: 'Fang Barrage', kind: 'phys', target: 'enemy', power: 0.9, hits: 4, mp: 0, fx: 'pierce', sfx: 'bite', desc: 'Every head bites.' });
  def('b_lantern_beam', { name: 'Lantern Beam', kind: 'mag', target: 'enemy', power: 2.4, mp: 0, fx: 'holy', sfx: 'magic', desc: 'A beam from the lantern-heart.' });
  def('b_warden_wall', { name: 'Warden Wall', kind: 'buff', target: 'allies', mp: 0, status: { id: 'shield', turns: 2, chance: 1, val: 0.3 }, fx: 'shield', sfx: 'buff', desc: 'Bark shields the Warden and allies.' });
  def('h_heartbeat',  { name: 'Heartbeat', kind: 'phys', target: 'enemies', power: 1.15, mp: 0, status: { id: 'slow', turns: 2, chance: 0.5 }, fx: 'heart', sfx: 'heartbeat', desc: 'A crushing pulse through the jungle.' });
  def('h_bloom_heal', { name: 'Verdant Pulse', kind: 'heal', target: 'self', power: 2.2, mp: 0, fx: 'nature', sfx: 'heal', desc: 'The jungle closes its own wounds.' });
  def('h_root_lash',  { name: 'Root Lash', kind: 'phys', target: 'enemy', power: 2.2, mp: 0, status: { id: 'bleed', turns: 3, chance: 0.7 }, fx: 'vine', sfx: 'whip', desc: 'A massive root lashes out.' });
  def('h_summon',     { name: 'Call of the Deep', kind: 'summon', target: 'self', mp: 0, fx: 'summon', sfx: 'summon', desc: 'Summons minions from the deep jungle.' });
  def('h_wrath',      { name: 'Wrath of the Wild', kind: 'mag', target: 'enemies', power: 1.55, mp: 0, status: { id: 'burn', turns: 2, chance: 0.5 }, fx: 'inferno', sfx: 'explosion', desc: 'The jungle itself burns with fury.' });
  def('h_drain_all',  { name: 'Devouring Roots', kind: 'drain', target: 'enemies', power: 1.0, mp: 0, drain: 0.3, fx: 'dark', sfx: 'drain', desc: 'Roots drain the whole party.' });

  // Which stat a skill's numbers come from, so the UI can label it. Drain picks per
  // caster (see applySkill in battle.js), which is why the unit is optional here.
  DJ.skillScaling = function (sk, unit) {
    if (!sk) return null;
    if (sk.kind === 'phys') return 'PHYS';
    if (sk.kind === 'mag' || sk.kind === 'heal') return 'MAG';
    if (sk.kind === 'drain') {
      if (!unit || !unit.base) return 'PHYS/MAG';
      return unit.base.mag >= unit.base.atk ? 'MAG' : 'PHYS';
    }
    return null;   // buffs, debuffs, revives and summons do not scale off a stat
  };


  // ---- Alternate region bosses, region 0 ----
  def('b_boiling_tide', { name: 'Boiling Tide', kind: 'phys', target: 'enemies', power: 0.65, hits: 2, mp: 0, status: { id: 'bleed', turns: 2, chance: 0.35 }, fx: 'swarm_fx', sfx: 'bite', desc: 'The column breaks and washes over everyone, twice.' });
  def('b_scatter_reform', { name: 'Scatter and Reform', kind: 'buff', target: 'self', mp: 0, status: { id: 'haste', turns: 3, chance: 1 }, self: { id: 'shield', turns: 2, chance: 1, val: 0.25 }, fx: 'swarm_fx', sfx: 'summon', desc: 'The swarm comes apart, then pours back together faster and looser.' });
  def('b_tongue_drag', { name: 'Tongue Drag', kind: 'phys', target: 'enemy', power: 2.15, mp: 0, status: { id: 'slow', turns: 2, chance: 0.7 }, fx: 'hit_big', sfx: 'whip', desc: 'A tongue like a wet rope takes one hero off their feet.' });
  def('b_swell', { name: 'Swell', kind: 'buff', target: 'self', mp: 0, status: { id: 'rage', turns: 3, chance: 1 }, self: { id: 'guard', turns: 2, chance: 1 }, fx: 'shield', sfx: 'roar', desc: 'It inflates until the clearing gets noticeably darker.' });

  // ---- Alternate region bosses, region 1 ----
  def('b_undertow',     { name: 'Undertow', kind: 'drain', target: 'enemies', power: 1.05, mp: 0, drain: 0.45, fx: 'water', sfx: 'drain', desc: 'The water pulls at everyone, and the Choir grows on what it takes.' });
  def('b_choir_swell',  { name: 'Another Voice', kind: 'heal', target: 'ally', power: 1.35, mp: 0, fx: 'water', sfx: 'heal', desc: 'It counts its drowned again and finds that there are more of them.' });
  def('b_ground_gives', { name: 'The Ground Gives', kind: 'phys', target: 'enemies', power: 1.3, mp: 0, status: { id: 'stun', turns: 1, chance: 0.35 }, fx: 'earth', sfx: 'explosion', desc: 'What everyone was standing on turns out to have been him.' });
  def('b_kettle_jaw',   { name: 'Kettle Jaw', kind: 'phys', target: 'enemy', power: 2.2, mp: 0, status: { id: 'bleed', turns: 3, chance: 0.7 }, fx: 'hit_big', sfx: 'bite', desc: 'The jaw closes slowly. It does not open again.' });

  // ---- Alternate region bosses, region 2 ----
  def('b_stormfall', { name: 'Stormfall', kind: 'phys', target: 'enemy', power: 1.05, hits: 3, mp: 0, status: { id: 'bleed', turns: 3, chance: 0.5 }, fx: 'pierce', sfx: 'thunder', desc: 'Folds its wings and falls out of the cloud. Three times.' });
  def('b_gale_eyes', { name: 'Eye of the Storm', kind: 'debuff', target: 'enemies', mp: 0, status: { id: 'blind', turns: 2, chance: 0.7 }, self: { id: 'haste', turns: 3, chance: 1 }, fx: 'wind', sfx: 'wind', desc: 'Grit and rain in every eye but its own. The wind carries it faster.' });
  def('b_toll_of_years', { name: 'Toll of Years', kind: 'debuff', target: 'enemies', mp: 0, status: { id: 'weak', turns: 3, chance: 0.8 }, fx: 'curse', sfx: 'debuff', desc: 'He counts the years aloud. Everyone who hears them ages a little.' });
  def('b_grey_tithe', { name: 'The Grey Tithe', kind: 'drain', target: 'enemies', power: 1.2, mp: 0, drain: 0.24, fx: 'dark', sfx: 'drain', desc: 'Collects what he is owed from the whole party, and keeps it.' });

  // ---- Status definitions ----
  DJ.STATUS = {
    poison: { name: 'Poison', icon: 'status_poison', color: '#7dd66a', bad: true, desc: 'Takes damage each turn.' },
    burn:   { name: 'Burn',   icon: 'status_burn',   color: '#ff8a3d', bad: true, desc: 'Takes fire damage each turn.' },
    bleed:  { name: 'Bleed',  icon: 'status_bleed',  color: '#ff4d6d', bad: true, desc: 'Loses blood each turn.' },
    stun:   { name: 'Stun',   icon: 'status_stun',   color: '#ffe34d', bad: true, desc: 'Cannot act.' },
    weak:   { name: 'Weak',   icon: 'status_weak',   color: '#b48cff', bad: true, desc: 'ATK and MAG reduced 30%.' },
    slow:   { name: 'Slow',   icon: 'status_slow',   color: '#8fb4ff', bad: true, desc: 'SPD reduced 35%.' },
    blind:  { name: 'Blind',  icon: 'status_blind',  color: '#aaaaaa', bad: true, desc: '40% chance to miss.' },
    guard:  { name: 'Guard',  icon: 'status_guard',  color: '#7fc8ff', bad: false, desc: 'DEF increased 50%.' },
    haste:  { name: 'Haste',  icon: 'status_haste',  color: '#ffd27f', bad: false, desc: 'SPD increased 50%.' },
    regen:  { name: 'Regen',  icon: 'status_regen',  color: '#8cff9c', bad: false, desc: 'Heals each turn.' },
    shield: { name: 'Shield', icon: 'status_shield', color: '#7fe0ff', bad: false, desc: 'Soaks damage outright until it is used up. A hit it swallows whole does nothing.' },
    rage:   { name: 'Rage',   icon: 'status_rage',   color: '#ff6b6b', bad: false, desc: 'ATK increased 40%.' },
    taunt:  { name: 'Taunt',  icon: 'status_taunt',  color: '#ff8a5c', bad: false, desc: 'Enemies attack this hero.' },
  };
})(typeof window !== 'undefined' ? window : globalThis);
