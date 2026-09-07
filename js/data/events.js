/* Deep Jungle — narrative events, riddles, shrine blessings */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});

  // Outcome ops: heal(pct all) | damage(pct all) | gold(n) | potion(id|random) | item(rarityBoost) |
  //   stat({stat, amount, who:'random'|'all'}) | status | xp(n all) | battle(kind) | nothing | curse(stat)
  DJ.EVENTS = [
    { id: 'glowing_fruit', title: 'The Glowing Fruit', text: 'A tree heavy with luminous fruit hums softly. The fruit smells like honey and thunderstorms.',
      options: [
        { label: 'Eat the fruit', desc: 'Might heal. Might not.', outcomes: [{ w: 6, text: 'Warmth floods through the party. Everyone feels renewed.', ops: [{ heal: 0.4 }] }, { w: 4, text: 'It tasted wonderful. Then the stomach cramps began.', ops: [{ damage: 0.15 }, { status: 'poison' }] }] },
        { label: 'Harvest carefully', desc: 'Take some for later.', outcomes: [{ w: 1, text: 'You pack a few fruits into flasks. Potions, more or less.', ops: [{ potion: 'green' }, { potion: 'red' }] }] },
        { label: 'Leave it alone', desc: 'Nothing that glows is free.', outcomes: [{ w: 1, text: 'Wise. Probably.', ops: [] }] },
      ] },
    { id: 'old_shrine_offering', title: 'The Offering Bowl', text: 'A moss-covered idol holds a bowl. Old coins glint at the bottom. The idol\'s eyes are following you.',
      options: [
        { label: 'Offer 30 gold', desc: 'Costs 30 gold.', cost: 30, outcomes: [{ w: 7, text: 'The idol sighs contentedly. A hero feels stronger.', ops: [{ stat: { stat: 'random', amount: 2, who: 'random' } }] }, { w: 3, text: 'The idol accepts the coins and gives absolutely nothing back.', ops: [] }] },
        { label: 'Take the coins', desc: 'The idol might object.', outcomes: [{ w: 5, text: 'You grab the coins. The idol does nothing. Yet.', ops: [{ gold: 45 }] }, { w: 5, text: 'The idol\'s eyes flare. Thorns burst from the ground!', ops: [{ gold: 45 }, { damage: 0.2 }, { battle: 'normal' }] }] },
        { label: 'Bow and leave', desc: 'Respect costs nothing.', outcomes: [{ w: 1, text: 'The idol seems pleased. Your wounds knit slightly.', ops: [{ heal: 0.1 }] }] },
      ] },
    { id: 'wounded_explorer', title: 'The Wounded Explorer', text: 'A ragged explorer lies against a tree, clutching a bleeding leg. "Please... I have gold. Just help me."',
      options: [
        { label: 'Use a potion on them', desc: 'Costs one Red Potion.', costPotion: 'red', outcomes: [{ w: 8, text: 'They limp off gratefully, leaving you a reward and a hand-drawn map.', ops: [{ gold: 60 }, { item: 1 }] }, { w: 2, text: 'They drink it, then vanish into mist. A ghost. Your potion is gone.', ops: [] }] },
        { label: 'Search their pack', desc: 'They will not miss it.', outcomes: [{ w: 6, text: 'You find supplies and feel slightly bad about it.', ops: [{ gold: 25 }, { potion: 'random' }] }, { w: 4, text: 'The explorer was bait. Bandits!', ops: [{ battle: 'humanoid' }] }] },
        { label: 'Walk on', desc: 'Not your problem.', outcomes: [{ w: 1, text: 'The jungle is full of sad stories.', ops: [] }] },
      ] },
    { id: 'monkey_thieves', title: 'Monkey Business', text: 'A troop of howler monkeys is playing keep-away with something shiny they clearly stole from someone.',
      options: [
        { label: 'Chase them down', desc: 'Exhausting, but rewarding.', outcomes: [{ w: 6, text: 'After an undignified chase you recover a fine piece of equipment.', ops: [{ item: 1 }, { damage: 0.08 }] }, { w: 4, text: 'The monkeys scatter, taking the shiny thing and some of your gold.', ops: [{ gold: -20 }] }] },
        { label: 'Trade a potion for it', desc: 'Costs one random potion.', costPotion: 'any', outcomes: [{ w: 1, text: 'The monkeys accept the deal with great ceremony.', ops: [{ item: 2 }] }] },
        { label: 'Ignore them', desc: 'Monkeys are trouble.', outcomes: [{ w: 1, text: 'They pelt you with fruit as you leave. It is delicious.', ops: [{ heal: 0.05 }] }] },
      ] },
    { id: 'ancient_library', title: 'The Sunken Library', text: 'Half-buried in mud, a stone room full of clay tablets. Some are still legible.',
      options: [
        { label: 'Study the tablets', desc: 'Knowledge is power.', outcomes: [{ w: 1, text: 'The party learns forgotten techniques.', ops: [{ xp: 30 }] }] },
        { label: 'Look for treasure', desc: 'Libraries have vaults.', outcomes: [{ w: 5, text: 'Behind a false wall: a small cache of gold.', ops: [{ gold: 50 }] }, { w: 5, text: 'Behind a false wall: something that has been waiting.', ops: [{ battle: 'undead' }] }] },
      ] },
    { id: 'hot_spring', title: 'Hidden Hot Spring', text: 'Steam rises from a turquoise pool ringed with orchids. It looks incredibly inviting.',
      options: [
        { label: 'Bathe', desc: 'Rest a while.', outcomes: [{ w: 8, text: 'Aches melt away. Everyone is restored.', ops: [{ heal: 0.35 }, { mp: 0.35 }] }, { w: 2, text: 'The pool is home to leeches. So many leeches.', ops: [{ battle: 'aquatic' }] }] },
        { label: 'Fill your flasks', desc: 'Save it for later.', outcomes: [{ w: 1, text: 'The water keeps its warmth.', ops: [{ potion: 'red' }, { potion: 'blue' }] }] },
      ] },
    { id: 'trapped_beast', title: 'The Snared Beast', text: 'A jaguar cub is caught in a hunter\'s snare. Its mother is nowhere in sight. Probably.',
      options: [
        { label: 'Free it', desc: 'Kindness has a price.', outcomes: [{ w: 7, text: 'The cub bounds away. Later, you find a gift left on the path: a tooth, still warm.', ops: [{ item: 1 }] }, { w: 3, text: 'Its mother was watching. She misunderstands your intentions.', ops: [{ battle: 'beast' }] }] },
        { label: 'Take the hunter\'s trap', desc: 'Good steel.', outcomes: [{ w: 1, text: 'You salvage the mechanism. It sells for a bit.', ops: [{ gold: 30 }] }] },
      ] },
    { id: 'mushroom_ring', title: 'The Mushroom Ring', text: 'A perfect circle of pale mushrooms. Something in the back of your mind says "do not step inside".',
      options: [
        { label: 'Step inside', desc: 'What could go wrong?', outcomes: [{ w: 4, text: 'Time skips. You emerge stronger and unsure of how much time has passed.', ops: [{ stat: { stat: 'random', amount: 3, who: 'random' } }] }, { w: 3, text: 'Spores erupt. Everyone is coughing and weakened.', ops: [{ damage: 0.12 }, { status: 'poison' }] }, { w: 3, text: 'A chorus of funglings emerges to defend their circle.', ops: [{ battle: 'fungus' }] }] },
        { label: 'Pick a few', desc: 'For the road.', outcomes: [{ w: 1, text: 'They smell medicinal.', ops: [{ potion: 'green' }] }] },
        { label: 'Walk around', desc: 'Listen to the back of your mind.', outcomes: [{ w: 1, text: 'Nothing happens. Perfect.', ops: [] }] },
      ] },
    { id: 'merchants_ghost', title: 'The Merchant\'s Ghost', text: 'A translucent trader stands behind a rotted stall. "Bargains," he whispers. "Everything must go. I certainly cannot."',
      options: [
        { label: 'Buy the mystery box (40 gold)', desc: 'Costs 40 gold.', cost: 40, outcomes: [{ w: 5, text: 'Inside: a genuinely excellent item.', ops: [{ item: 3 }] }, { w: 3, text: 'Inside: some potions and a spider.', ops: [{ potion: 'random' }, { potion: 'random' }] }, { w: 2, text: 'Inside: dust and a receipt.', ops: [] }] },
        { label: 'Ask about the jungle', desc: 'Free.', outcomes: [{ w: 1, text: '"The Heart does not sleep. Bring fire. Bring friends. Bring more friends." He fades.', ops: [{ xp: 15 }] }] },
      ] },
    { id: 'rope_bridge', title: 'The Vine Bridge', text: 'A fraying vine bridge spans a gorge. The long way around costs time and blood; the bridge costs nerve.',
      options: [
        { label: 'Cross the bridge', desc: 'Quick, if it holds.', outcomes: [{ w: 7, text: 'It sways horribly. It holds. On the far side, someone dropped their purse.', ops: [{ gold: 35 }] }, { w: 3, text: 'A vine snaps. Everyone makes it, bruised.', ops: [{ damage: 0.2 }] }] },
        { label: 'Take the long way', desc: 'Safe but tiring.', outcomes: [{ w: 6, text: 'The long path is uneventful.', ops: [] }, { w: 4, text: 'The long path is not uneventful.', ops: [{ battle: 'normal' }] }] },
      ] },
    { id: 'singing_stone', title: 'The Singing Stone', text: 'A tall blue stone hums a note that makes your teeth buzz. Runes crawl across its surface.',
      options: [
        { label: 'Touch it', desc: 'Magical energy.', outcomes: [{ w: 6, text: 'Mana surges into the party.', ops: [{ mp: 1.0 }] }, { w: 4, text: 'The stone shrieks. Your ears ring and something answers the call.', ops: [{ battle: 'spirit' }] }] },
        { label: 'Chip off a piece', desc: 'Could be valuable.', outcomes: [{ w: 1, text: 'The shard glows faintly. A trinket, of sorts.', ops: [{ item: 2 }] }] },
      ] },
    { id: 'campfire_stranger', title: 'A Stranger\'s Fire', text: 'A hooded figure tends a small fire and offers a seat. "The Heart," she says, "fears those who fear nothing."',
      options: [
        { label: 'Share the fire', desc: 'Rest and listen.', outcomes: [{ w: 1, text: 'You wake stronger, and she is gone. Her fire still burns.', ops: [{ heal: 0.25 }, { stat: { stat: 'def', amount: 1, who: 'all' } }] }] },
        { label: 'Ask for training', desc: 'She looks capable.', outcomes: [{ w: 1, text: 'She corrects your stance with a stick. Painful. Effective.', ops: [{ stat: { stat: 'atk', amount: 2, who: 'random' } }, { damage: 0.05 }] }] },
      ] },
  ];

  DJ.RIDDLES = [
    { q: 'I have roots nobody sees, I am taller than trees, up and up I go, yet I never grow. What am I?', a: ['A mountain', 'A vine', 'A shadow', 'A river'], c: 0 },
    { q: 'The more you take from me, the bigger I become. What am I?', a: ['A hole', 'A debt', 'A fire', 'A river'], c: 0 },
    { q: 'I fly without wings, I cry without eyes. Wherever I go, darkness follows. What am I?', a: ['A bat', 'A cloud', 'A ghost', 'The night'], c: 1 },
    { q: 'What has a heart that does not beat?', a: ['A tree', 'A stone', 'An artichoke', 'A drum'], c: 2 },
    { q: 'I am always hungry and must always be fed. The finger I touch will soon turn red. What am I?', a: ['A leech', 'Fire', 'A wasp', 'Rust'], c: 1 },
    { q: 'What gets wetter the more it dries?', a: ['A river', 'A towel', 'Mud', 'A frog'], c: 1 },
    { q: 'I have branches but no fruit, trunk or leaves. What am I?', a: ['A coral', 'A bank', 'A staff', 'An antler'], c: 1 },
    { q: 'What can travel around the world while staying in a corner?', a: ['A spider', 'A stamp', 'A shadow', 'A snail'], c: 1 },
    { q: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?', a: ['A spirit', 'A leaf', 'An echo', 'A flute'], c: 2 },
    { q: 'What has many keys but cannot open a single lock?', a: ['A jailer', 'A piano', 'A map', 'A monkey'], c: 1 },
    { q: 'What runs but never walks, has a mouth but never talks, has a bed but never sleeps?', a: ['A jaguar', 'A river', 'A vine', 'A drum'], c: 1 },
    { q: 'Feed me and I live; give me a drink and I die. What am I?', a: ['A plant', 'Fire', 'A fish', 'A slime'], c: 1 },
    { q: 'What has one eye but cannot see?', a: ['A needle', 'A cyclops asleep', 'A storm', 'A potato'], c: 0 },
    { q: 'The person who makes it has no need of it. The person who buys it does not use it. The person who uses it does not know it. What is it?', a: ['A trap', 'A coffin', 'A map', 'A gift'], c: 1 },
    { q: 'I am not alive, but I grow. I do not have lungs, but I need air. I do not have a mouth, but water kills me. What am I?', a: ['Moss', 'A golem', 'Fire', 'A crystal'], c: 2 },
    { q: 'What belongs to you but is used more by others?', a: ['Your gold', 'Your name', 'Your shadow', 'Your sword'], c: 1 },
  ];

  // Shrine blessings: permanent stat for one hero, sometimes with a cost.
  DJ.BLESSINGS = [
    { id: 'vigor', name: 'Blessing of Vigor', desc: '+12 max HP to one hero.', apply: { hp: 12 } },
    { id: 'might', name: 'Blessing of Might', desc: '+3 ATK to one hero.', apply: { atk: 3 } },
    { id: 'wisdom', name: 'Blessing of Wisdom', desc: '+3 MAG and +6 max MP to one hero.', apply: { mag: 3, mp: 6 } },
    { id: 'stone', name: 'Blessing of Stone', desc: '+3 DEF to one hero.', apply: { def: 3 } },
    { id: 'wind', name: 'Blessing of Wind', desc: '+3 SPD to one hero.', apply: { spd: 3 } },
    { id: 'sacrifice', name: 'Blood Bargain', desc: '+5 ATK and +5 MAG to one hero, but -10 max HP.', apply: { atk: 5, mag: 5, hp: -10 } },
    { id: 'gold_blessing', name: 'Offering of Gold', desc: 'Lose 40 gold; the whole party gains +1 to all stats.', cost: 40, party: true, apply: { hp: 5, atk: 1, mag: 1, def: 1, spd: 1 } },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
