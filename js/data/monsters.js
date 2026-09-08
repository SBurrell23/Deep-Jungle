/* Deep Jungle — 100 unique monsters.
 * Stats are for the tier's base level (T1=2, T2=5, T3=8, T4=11, T5=14) and scale with node level.
 * kind: normal | elite | boss | final.  tags drive achievements & compendium.
 */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const M = (DJ.MONSTERS = []);
  DJ.TIER_BASE_LEVEL = { 1: 2, 2: 5, 3: 8, 4: 11, 5: 14 };
  function m(id, name, tier, hp, atk, mag, def, spd, skills, tags, desc, kind) {
    M.push({ id, name, tier, hp, atk, mag, def, spd, skills, tags: tags.split(' '), desc, kind: kind || 'normal' });
  }
  // ---------------- TIER 1 (levels 1-3) ----------------
  m('vine_rat', 'Vine Rat', 1, 30, 9, 4, 3, 9, ['m_gnaw'], 'beast', 'A rat so tangled in creepers it has stopped fighting them. It has not stopped fighting you.');
  m('thorn_sprite', 'Thorn Sprite', 1, 24, 7, 10, 2, 12, ['m_thorns', 'm_heal'], 'plant spirit', 'A giggling mote of malice with thorns for fingers. Heals its friends, out of spite.');
  m('mud_toad', 'Mud Toad', 1, 46, 9, 5, 4, 4, ['m_tackle', 'm_mud_toss'], 'amphibian', 'Fat, patient, and covered in mud it will happily share with your eyes.');
  m('leaf_beetle', 'Leaf Beetle', 1, 38, 8, 3, 6, 6, ['m_bite', 'm_harden'], 'insect', 'Camouflaged as a leaf until it decides that you look edible.');
  m('gnat_swarm', 'Gnat Swarm', 1, 26, 6, 4, 1, 13, ['m_swarm'], 'insect swarm', 'Each gnat is harmless. There are four hundred of them.');
  m('bramble_hare', 'Bramble Hare', 1, 34, 11, 3, 3, 11, ['m_charge'], 'beast', 'Antlers of living bramble. Charges first and asks questions never.');
  m('fungling', 'Fungling', 1, 40, 7, 8, 4, 5, ['m_spore_burst', 'm_regen'], 'fungus plant', 'A mushroom that grew legs and opinions. Its spores are mildly poisonous, its opinions are worse.');
  m('sap_slime', 'Sap Slime', 1, 48, 8, 6, 2, 3, ['m_tackle', 'm_spit'], 'ooze', 'Tree sap that gained ambition. Sticky, slow, surprisingly durable.');
  m('jungle_bat', 'Jungle Bat', 1, 28, 9, 5, 2, 12, ['m_bite', 'm_screech'], 'beast flying', 'Its screech would be terrifying if it were not so shrill.');
  m('moss_crab', 'Moss Crab', 1, 44, 10, 2, 7, 4, ['m_crush', 'm_harden'], 'aquatic', 'Armored in moss and bad temper. That big claw is not decorative.');
  m('spitting_lizard', 'Spitting Lizard', 1, 32, 8, 9, 3, 9, ['m_spit', 'm_bite'], 'reptile', 'Aims for the face. Always the face.');
  m('puffbird', 'Puffbird', 1, 30, 7, 7, 2, 10, ['m_wing_gust', 'm_bite'], 'bird flying', 'Round, fluffy, and outraged by your presence in its jungle.');
  m('root_grub', 'Root Grub', 1, 50, 9, 2, 5, 2, ['m_bite', 'm_regen'], 'insect', 'Eats roots, rocks, and adventurers with equal enthusiasm.');
  m('fern_imp', 'Fern Imp', 1, 30, 8, 11, 3, 10, ['m_fireball', 'm_scratch'], 'demon spirit', 'A small red nuisance that learned one fire spell and will not shut up about it.');
  m('stinger_wasp', 'Stinger Wasp', 1, 26, 10, 3, 2, 14, ['m_sting'], 'insect flying', 'Fast, angry, venomous. The jungle trifecta.');
  m('ironshell_snail', 'Ironshell Snail', 1, 42, 7, 3, 9, 1, ['m_shell_spin', 'm_harden'], 'aquatic construct', 'Nobody knows where it got the rivets.');
  m('marsh_leech', 'Marsh Leech', 1, 36, 8, 5, 3, 6, ['m_leech'], 'aquatic', 'Drinks deeply and grows fat on what it takes.');
  m('twig_golem', 'Twig Golem', 1, 44, 10, 6, 5, 5, ['m_vine_whip', 'm_regen'], 'construct plant', 'Sticks, twine, and a green spark of something that wants to be alive.');
  // ---------------- TIER 2 (levels 4-6) ----------------
  m('howler_monkey', 'Howler Monkey', 2, 66, 15, 6, 6, 12, ['m_scratch', 'm_screech'], 'beast', 'You will hear it before you see it, and you will not enjoy either.');
  m('venom_spider', 'Venom Spider', 2, 60, 16, 8, 5, 11, ['m_venom_fang', 'm_web'], 'insect', 'Eight legs, eight eyes, and venom enough for eighty.');
  m('bog_wisp', 'Bog Wisp', 2, 52, 8, 19, 4, 13, ['m_shadow_bolt', 'm_ghost_touch'], 'spirit undead', 'The last light of someone who followed the wrong light.');
  m('tusk_boar', 'Tusk Boar', 2, 92, 17, 4, 7, 7, ['m_charge', 'm_tackle'], 'beast', 'Two tusks, one idea: forward.');
  m('bark_wolf', 'Bark Wolf', 2, 72, 16, 5, 8, 10, ['m_bite', 'm_howl'], 'beast plant', 'Its hide is literal bark. Its bite is worse.');
  m('fire_ant_warrior', 'Fire Ant Warrior', 2, 64, 17, 6, 8, 9, ['m_sting', 'm_harden'], 'insect humanoid', 'Colony discipline, thorn spear, leaf shield, and a burning grudge.');
  m('hex_frog', 'Hex Frog', 2, 58, 9, 18, 5, 9, ['m_curse', 'm_shadow_bolt'], 'amphibian', 'Croaks in a language that makes your knees ache.');
  m('sapling_treant', 'Sapling Treant', 2, 88, 14, 9, 9, 3, ['m_vine_whip', 'm_regen'], 'plant', 'Young, angry, and already convinced you are here to cut it down.');
  m('blowgun_pygmy', 'Blowgun Pygmy', 2, 56, 15, 7, 5, 12, ['m_dart', 'm_blowgun_volley'], 'humanoid', 'Guards the old paths. Excellent aim, terrible manners.');
  m('mud_golem', 'Mud Golem', 2, 96, 16, 5, 10, 2, ['m_slam', 'm_mud_toss'], 'construct', 'Wet, heavy, and very hard to argue with.');
  m('lantern_moth', 'Lantern Moth', 2, 54, 10, 17, 4, 12, ['m_blind_dust', 'm_fireball'], 'insect flying', 'Draws travelers off the path with its glow, then draws blood.');
  m('piranha_swarm', 'Piranha Swarm', 2, 62, 18, 4, 3, 13, ['m_frenzy_bite'], 'aquatic swarm', 'A river of teeth that has learned to leap.');
  m('coil_viper', 'Coil Viper', 2, 60, 17, 7, 6, 11, ['m_venom_fang', 'm_constrict'], 'reptile', 'Patient. Then, suddenly, not.');
  m('spore_bat', 'Spore Bat', 2, 56, 13, 12, 4, 13, ['m_spore_burst', 'm_bite'], 'beast fungus flying', 'Infected with a glowing fungus that steers it toward warm bodies.');
  m('orchid_mantis', 'Orchid Mantis', 2, 58, 19, 6, 5, 10, ['m_rend', 'm_scratch'], 'insect', 'The most beautiful thing that has ever tried to take your head off.');
  m('jungle_bandit', 'Jungle Bandit', 2, 70, 16, 6, 7, 9, ['m_rend', 'm_enrage'], 'humanoid', 'Robs the lost. You look lost.');
  m('bone_picker', 'Bone Picker', 2, 60, 15, 8, 5, 11, ['m_bite', 'm_wail'], 'bird flying undead', 'A vulture that waits. It has decided not to wait for you.');
  m('glow_slug', 'Glow Slug', 2, 84, 12, 14, 6, 2, ['m_spit', 'm_regen'], 'ooze', 'Its bioluminescent spots spell something rude in a dead language.');
  // ---------------- TIER 3 (levels 7-9) ----------------
  m('jaguar_stalker', 'Jaguar Stalker', 3, 118, 26, 8, 10, 14, ['m_rend', 'm_bite'], 'beast', 'By the time you see the spots, it has already chosen which of you goes first.');
  m('dart_shaman', 'Poison Dart Shaman', 3, 100, 20, 22, 8, 11, ['m_blowgun_volley', 'm_poison_cloud', 'm_heal'], 'humanoid', 'Whispers to frogs and coats his darts with their answers.');
  m('mangrove_croc', 'Mangrove Crocodile', 3, 150, 27, 5, 13, 6, ['m_devour', 'm_tail_swipe'], 'reptile aquatic', 'Roots grow from its back. It has been waiting a very long time.');
  m('anaconda', 'Anaconda', 3, 140, 25, 6, 11, 8, ['m_constrict', 'm_bite'], 'reptile', 'Long enough to hug the whole party at once.');
  m('totem_walker', 'Totem Walker', 3, 126, 21, 20, 12, 5, ['m_stone_skin', 'm_holy_smite', 'm_slam'], 'construct spirit', 'Four carved faces, each with a different grievance.');
  m('hornet_queen', 'Hornet Queen', 3, 104, 27, 9, 8, 15, ['m_sting', 'm_swarm', 'm_enrage'], 'insect flying', 'Her subjects are dead. She blames you.');
  m('rot_shambler', 'Rot Shambler', 3, 146, 23, 10, 9, 4, ['m_gnaw', 'm_plague'], 'undead fungus', 'Moss holds the bones together. The hunger holds everything else.');
  m('mist_panther', 'Mist Panther', 3, 108, 26, 14, 8, 15, ['m_void_claw', 'm_blind_dust'], 'beast spirit', 'Half here, half elsewhere, all teeth.');
  m('ruin_guardian', 'Ruin Guardian', 3, 138, 24, 12, 15, 5, ['m_crush', 'm_stone_skin'], 'construct', 'Still guarding a temple that fell a thousand years ago.');
  m('wild_druid', 'Wild Druid', 3, 112, 19, 24, 9, 9, ['m_thorns', 'm_heal', 'm_lightning'], 'humanoid plant', 'Went into the jungle to find himself. Found something else instead.');
  m('blood_vine', 'Blood Vine', 3, 132, 25, 11, 10, 7, ['m_vine_whip', 'm_leech'], 'plant', 'Red because of what it drinks. It is thirsty.');
  m('armored_tapir', 'Armored Tapir', 3, 156, 22, 4, 16, 6, ['m_charge', 'm_stomp'], 'beast', 'Someone armored a tapir. Someone was, in retrospect, unwise.');
  m('storm_parrot', 'Storm Parrot', 3, 98, 18, 26, 7, 16, ['m_lightning', 'm_thunderclap'], 'bird flying elemental', 'Repeats every spell it has ever heard. Unfortunately it has heard a few.');
  m('sludge_elemental', 'Sludge Elemental', 3, 148, 22, 18, 11, 3, ['m_spit', 'm_poison_cloud', 'm_regen'], 'elemental ooze', 'The swamp, concentrated and irritable.');
  m('skull_monkey', 'Skull Monkey', 3, 102, 24, 13, 8, 14, ['m_scratch', 'm_wail', 'm_curse'], 'undead beast', 'Still screaming. Still climbing. Still dead.');
  m('treefrog_witch', 'Tree Frog Witch', 3, 106, 17, 27, 9, 12, ['m_curse', 'm_shadow_bolt', 'm_heal'], 'amphibian', 'The hat was a gift. The wand she made herself.');
  m('lost_explorer', 'Lost Explorer', 3, 110, 20, 22, 7, 10, ['m_ghost_touch', 'm_wail'], 'undead spirit humanoid', 'Still looking for the way out. Would like company.');
  m('cave_troll', 'Cave Troll', 3, 160, 28, 5, 12, 4, ['m_crush', 'm_slam', 'm_regen'], 'humanoid', 'Regenerates. Do not give it time.');
  // ---------------- TIER 4 (levels 10-12) ----------------
  m('elder_treant', 'Elder Treant', 4, 226, 31, 20, 19, 3, ['m_vine_whip', 'm_slam', 'm_regen', 'm_heal'], 'plant', 'Was old when the temples were new. Slow to anger, and you have angered it.');
  m('basilisk', 'Basilisk', 4, 184, 33, 22, 15, 9, ['m_petrify', 'm_venom_fang'], 'reptile', 'Do not meet its eyes. Do not meet its teeth either.');
  m('fire_salamander', 'Fire Salamander', 4, 176, 30, 30, 13, 10, ['m_flame_breath', 'm_fireball', 'm_bite'], 'reptile elemental', 'Sets the wet jungle alight and considers it a good day.');
  m('shadow_ape', 'Shadow Ape', 4, 192, 35, 18, 13, 12, ['m_void_claw', 'm_slam', 'm_blind_dust'], 'beast spirit', 'Made of the dark between the trees.');
  m('stone_idol', 'Stone Idol', 4, 216, 30, 24, 20, 4, ['m_crush', 'm_holy_smite', 'm_stone_skin'], 'construct spirit', 'Worshippers gone, it now demands offerings from anyone.');
  m('manticore', 'Manticore', 4, 188, 36, 14, 14, 12, ['m_rend', 'm_sting', 'm_wing_gust'], 'beast flying', 'Lion, bat, scorpion, and a face that almost apologizes before it strikes.');
  m('swamp_hag', 'Swamp Hag', 4, 170, 24, 36, 12, 8, ['m_curse', 'm_poison_cloud', 'm_drain', 'm_heal'], 'humanoid undead', 'Knows your name. Knows all your names.');
  m('carnivorous_bloom', 'Carnivorous Bloom', 4, 208, 32, 22, 14, 5, ['m_devour', 'm_spore_burst', 'm_vine_whip'], 'plant', 'Smells like honey. Is not honey.');
  m('obsidian_beetle', 'Obsidian Beetle', 4, 220, 30, 12, 24, 6, ['m_charge', 'm_harden', 'm_crush'], 'insect', 'Its shell turns aside steel. Its horns do not turn aside anything.');
  m('serpent_priest', 'Serpent Priest', 4, 174, 26, 35, 13, 10, ['m_shadow_bolt', 'm_curse', 'm_heal', 'm_venom_fang'], 'reptile humanoid', 'Preaches to the coils. The coils listen.');
  m('thunder_gorilla', 'Thunder Gorilla', 4, 212, 37, 24, 15, 9, ['m_slam', 'm_lightning', 'm_enrage'], 'beast elemental', 'When it beats its chest, the sky answers.');
  m('canopy_wraith', 'Wraith of the Canopy', 4, 166, 22, 38, 11, 14, ['m_ghost_touch', 'm_wail', 'm_drain'], 'undead spirit', 'Drifts between the branches wearing the leaves of the dead.');
  m('bog_hydra', 'Bog Hydra', 4, 236, 33, 20, 14, 7, ['m_frenzy_bite', 'm_poison_cloud', 'm_regen'], 'reptile aquatic', 'Three heads, one appetite.');
  m('spore_colossus', 'Spore Colossus', 4, 230, 28, 27, 17, 3, ['m_spore_burst', 'm_slam', 'm_plague'], 'fungus plant', 'A walking forest floor. Breathe shallowly.');
  m('headhunter_chief', 'Headhunter Chief', 4, 190, 36, 16, 15, 11, ['m_rend', 'm_dart', 'm_howl'], 'humanoid', 'Collects heads. Yours would look fine on the belt, he says.');
  m('emerald_wyrmling', 'Emerald Wyrmling', 4, 180, 32, 32, 16, 11, ['m_flame_breath', 'm_bite', 'm_tail_swipe'], 'dragon flying', 'Small for a dragon. Not small.');
  m('rot_bear', 'Rot Bear', 4, 240, 38, 10, 13, 6, ['m_crush', 'm_gnaw', 'm_plague'], 'undead beast fungus', 'Bigger than it was alive, somehow.');
  m('hollow_knight', 'Hollow Knight', 4, 200, 34, 18, 22, 7, ['m_rend', 'm_harden', 'm_shadow_bolt'], 'undead construct', 'Armor with nothing inside but purpose.');
  // ---------------- TIER 5 (levels 13-15) ----------------
  m('ancient_golem', 'Ancient Golem', 5, 330, 44, 26, 30, 3, ['m_earthquake', 'm_crush', 'm_stone_skin'], 'construct', 'The runes on its chest spell a word that means "no".');
  m('jade_serpent', 'Jade Serpent', 5, 270, 42, 40, 22, 13, ['m_venom_fang', 'm_constrict', 'm_holy_smite'], 'reptile', 'A god to some. A very large snake to others. Both are correct.');
  m('void_panther', 'Void Panther', 5, 246, 48, 30, 18, 18, ['m_void_claw', 'm_rend', 'm_nightmare'], 'beast spirit', 'Its body is a window to somewhere with no stars.');
  m('titan_beetle', 'Titan Beetle', 5, 340, 40, 14, 32, 4, ['m_charge', 'm_earthquake', 'm_harden'], 'insect', 'You could shelter under it, if it would let you.');
  m('plague_shaman', 'Plague Shaman', 5, 250, 30, 50, 19, 10, ['m_plague', 'm_drain', 'm_curse', 'm_heal'], 'humanoid undead', 'The bird skull is not a mask.');
  m('root_lich', 'Lich of the Roots', 5, 262, 32, 54, 21, 9, ['m_bone_spear', 'm_drain', 'm_curse', 'm_shadow_bolt'], 'undead plant', 'It planted itself on purpose. It has been growing ever since.');
  m('wyvern', 'Wyvern', 5, 290, 46, 28, 22, 14, ['m_flame_breath', 'm_sting', 'm_wing_gust'], 'dragon flying', 'Poison tail, fire breath, no patience.');
  m('vine_titan', 'Vine Titan', 5, 350, 41, 34, 24, 5, ['m_vine_whip', 'm_slam', 'm_thorns', 'm_regen'], 'plant', 'A hillside got up and started walking toward you.');
  m('ghost_jaguar', 'Ghost Jaguar Spirit', 5, 240, 45, 36, 17, 19, ['m_void_claw', 'm_ghost_touch', 'm_nightmare'], 'beast spirit undead', 'Hunted for a hundred years. Never stopped.');
  m('sun_idol', 'Sun Idol', 5, 280, 34, 52, 26, 7, ['m_sun_flare', 'm_holy_smite', 'm_stone_skin'], 'construct spirit elemental', 'It remembers being worshipped. It remembers being fed.');
  m('death_bloom', 'Death Bloom', 5, 300, 39, 44, 20, 6, ['m_devour', 'm_poison_cloud', 'm_plague', 'm_regen'], 'plant undead', 'Flowers bloom from skulls. Skulls bloom from flowers.');
  m('storm_elemental', 'Storm Elemental', 5, 256, 36, 56, 18, 16, ['m_storm', 'm_lightning', 'm_thunderclap'], 'elemental flying', 'Weather that decided to take it personally.');
  m('chaos_ape', 'Chaos Ape', 5, 310, 50, 24, 20, 12, ['m_slam', 'm_rend', 'm_enrage', 'm_nightmare'], 'beast', 'Whatever changed it did not finish. It is still changing.');
  m('heartwood_sentinel', 'Heartwood Sentinel', 5, 320, 43, 32, 28, 8, ['m_crush', 'm_stone_skin', 'm_holy_smite'], 'construct plant', 'Grown by the Heart to keep its secrets. The red core never dims.');
  m('nightmare_moth', 'Nightmare Moth', 5, 236, 33, 51, 17, 17, ['m_nightmare', 'm_blind_dust', 'm_shadow_bolt', 'm_drain'], 'insect flying spirit', 'Look at its wings long enough and you forget why you came.');
  m('fossil_drake', 'Fossil Drake', 5, 336, 47, 30, 29, 6, ['m_flame_breath', 'm_bone_spear', 'm_tail_swipe'], 'dragon undead', 'Stone bones, amber eyes, and a fire that never learned it was dead.');
  // ---------------- ELITES (double HP, heavier hits) ----------------
  m('alpha_bark_wolf', 'Alpha Bark Wolf', 1, 92, 14, 6, 6, 10, ['m_bite', 'm_howl', 'm_rend'], 'beast plant', 'The pack follows it. The pack is smart.', 'elite');
  m('spider_matriarch', 'Spider Matriarch', 2, 170, 22, 12, 9, 10, ['m_venom_fang', 'm_web', 'm_swarm'], 'insect', 'Her children are hatching. Hurry.', 'elite');
  m('ogre_chieftain', 'Ogre Chieftain', 2, 200, 24, 6, 11, 5, ['m_crush', 'm_slam', 'm_enrage'], 'humanoid', 'The skulls on the necklace are from people who negotiated.', 'elite');
  m('swamp_behemoth', 'Swamp Behemoth', 3, 300, 30, 10, 16, 4, ['m_stomp', 'm_devour', 'm_regen'], 'beast aquatic', 'You mistook it for an island. Common mistake, last mistake.', 'elite');
  m('golden_idol', 'Golden Idol', 3, 250, 22, 34, 18, 8, ['m_holy_smite', 'm_sun_flare', 'm_stone_skin', 'm_curse'], 'construct spirit', 'Gold is soft, but the gods inside it are not.', 'elite');
  m('corrupted_dryad', 'Corrupted Dryad', 4, 380, 34, 42, 18, 10, ['m_drain', 'm_thorns', 'm_curse', 'm_heal'], 'plant undead spirit', 'Once a healer of the grove. Now the grove rots where she walks.', 'elite');
  m('elder_basilisk', 'Elder Basilisk', 4, 420, 40, 30, 22, 8, ['m_petrify', 'm_venom_fang', 'm_tail_swipe'], 'reptile', 'Crowned by age and armored by centuries of stone gazes.', 'elite');
  m('twin_anaconda', 'Twin-Headed Anaconda', 5, 560, 50, 22, 26, 11, ['m_constrict', 'm_frenzy_bite', 'm_venom_fang'], 'reptile', 'Two heads, and they agree about you.', 'elite');
  // ---------------- REGION BOSSES ----------------
  m('bramble_king', 'The Bramble King', 2, 260, 22, 16, 10, 6, ['b_bramble_crown', 'm_vine_whip', 'b_root_prison', 'm_regen'], 'plant boss', 'Crowned in thorns, seated on a throne of everything that tried to leave the undergrowth.', 'boss');
  m('mother_of_fangs', 'Mother of Fangs', 4, 620, 36, 28, 17, 11, ['b_fang_barrage', 'b_venom_flood', 'm_web', 'm_constrict'], 'insect reptile boss', 'Spider body, serpent legs, and a brood that never stops hatching.', 'boss');
  m('vine_warden', 'The Vine Warden', 5, 950, 46, 42, 28, 7, ['b_lantern_beam', 'b_warden_wall', 'm_vine_whip', 'm_earthquake'], 'construct plant boss', 'Built to keep the Heart safe. Built well.', 'boss');
  // ---- Alternate guardians, region 0. One of a region's three is drawn per run. ----
  m('thousand_mouth', 'The Thousand-Mouth', 2, 223, 20, 9, 8, 15, ['b_boiling_tide', 'b_scatter_reform', 'm_blind_dust', 'm_leech'], 'insect swarm boss', 'Not one creature but four million of them, in agreement. The skull it wears belonged to something that also thought it was fast.', 'boss');
  m('old_gullet', 'Old Gullet', 2, 270, 21, 7, 14, 4, ['b_tongue_drag', 'b_swell', 'm_devour', 'm_stomp'], 'amphibian beast boss', 'Has held the same wallow for sixty years without once standing up. Everything that walked past it is still in there.', 'boss');

  // ---- Alternate guardians, region 1. One of a region's three is drawn per run. ----
  m('sunken_choir', 'The Sunken Choir', 4, 484, 20, 35, 14, 13, ['b_undertow', 'b_choir_swell', 'm_wail', 'm_drain'], 'undead aquatic spirit boss', 'Everyone the Mire has taken, still holding hands and still singing. They have had a great deal of time to practise.', 'boss');
  m('kettlemaw', 'Old Kettlemaw', 4, 642, 39, 9, 20, 5, ['b_ground_gives', 'b_kettle_jaw', 'm_harden', 'm_stomp'], 'beast reptile aquatic boss', 'Two centuries of silt, shell and somebody else\'s temple wall, walking. It has never once needed to hurry.', 'boss');

  // ---- Alternate guardians, region 2. One of a region's three is drawn per run. ----
  m('skywrack', 'The Skywrack', 5, 790, 39, 28, 19, 20, ['b_stormfall', 'b_gale_eyes', 'm_storm', 'm_enrage'], 'beast bird flying boss', 'Six hundred years on the highest branch. Nothing has ever come up to challenge it, and it has grown very bored.', 'boss');
  m('last_watchman', 'The Last Watchman', 5, 781, 26, 49, 22, 10, ['b_toll_of_years', 'b_grey_tithe', 'm_nightmare', 'm_bone_spear'], 'undead spirit humanoid boss', 'Nobody came to relieve him. Nobody has come for four hundred years. He has decided that you will do.', 'boss');

  m('heart_of_jungle', 'Heart of the Jungle', 5, 1150, 48, 50, 26, 8, ['h_heartbeat', 'h_root_lash', 'h_bloom_heal', 'h_summon', 'h_wrath', 'h_drain_all'], 'plant boss final', 'Every root, every vine, every hungry thing in the jungle grows from this. It is awake, and it has noticed you.', 'final');

  DJ.MONSTER_BY_ID = {};
  M.forEach((x) => (DJ.MONSTER_BY_ID[x.id] = x));

  // XP / gold rewards by tier and kind
  DJ.monsterRewards = function (mon) {
    const baseXp = [0, 24, 50, 86, 126, 174][mon.tier];
    const baseGold = [0, 9, 17, 27, 38, 52][mon.tier];
    const mult = mon.kind === 'elite' ? 2.5 : mon.kind === 'boss' ? 5 : mon.kind === 'final' ? 10 : 1;
    return { xp: Math.round(baseXp * mult), gold: Math.round(baseGold * mult) };
  };
})(typeof window !== 'undefined' ? window : globalThis);
