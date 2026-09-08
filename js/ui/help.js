/* Deep Jungle — the field guide: how the game actually works, in the game's own numbers.
 * Everything quotable is read from the live data (DJ.STATUS, DJ.STATUS_TUNE, DJ.TUNE,
 * DJ.POTIONS, DJ.NODE_INFO, the XP curve), so this page cannot drift away from the
 * engine the way a hand-written wiki would.
 */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const H = (UI.Help = {});

  let section = 'basics';

  const pct = (x) => Math.round(x * 100) + '%';

  // ---- small builders ----
  // Prose runs through UI.statusText, so any effect named anywhere on this page is
  // tinted and explains itself on hover, exactly as it does on an ability card.
  const p = (text) => UI.statusText(text, UI.el('p', 'help-p'));
  const h = (text) => UI.el('h3', 'help-h', text);
  const sub = (text) => UI.el('h4', 'help-sub', text);

  function bullets(items) {
    const ul = UI.el('ul', 'help-list');
    for (const t of items) ul.appendChild(UI.statusText(t, UI.el('li')));
    return ul;
  }

  // A two-column definition table: a name on the left, what it does on the right.
  function defs(rows) {
    const box = UI.el('div', 'help-defs');
    for (const r of rows) {
      if (!r) continue;
      const [label, body, color, icon] = r;
      const row = UI.el('div', 'hd-row');
      const left = UI.el('div', 'hd-key');
      if (icon && DJ.SPRITES[icon]) left.appendChild(UI.spriteEl(icon, 1.3, label));
      const nm = UI.el('span', null, label);
      if (color) nm.style.color = color;
      left.appendChild(nm);
      row.appendChild(left);
      row.appendChild(UI.statusText(body, UI.el('div', 'hd-val')));
      box.appendChild(row);
    }
    return box;
  }

  // A worked example or a rule of thumb, set apart from the prose around it.
  function note(text) {
    return UI.statusText(text, UI.el('div', 'help-note'));
  }

  // ---- the exact numbers behind each status, straight from the engine ----
  function statusNumbers(id) {
    const T = DJ.STATUS_TUNE || {};
    switch (id) {
      case 'poison': return Math.round(T.poisonPct * 1000) / 10 + '% of max HP per stack, each turn  ·  up to ' +
        T.poisonMaxStacks + ' stacks  ·  ' + T.poisonTurns + ' turns';
      case 'burn':   return Math.round(T.burnPct * 100) + '% of max HP each turn  ·  2 turns';
      case 'bleed':  return Math.round(T.bleedPct * 1000) / 10 + '% of max HP each turn  ·  4 turns';
      case 'regen':  return Math.round(T.regenPct * 100) + '% of max HP healed each turn';
      case 'thorns': return 'A thorns trinket reflects ' + pct(T.thornsPassive) + ' instead';
      case 'shield': return 'The pool is sized from the wearer’s max HP';
      case 'taunt':  return 'Six times more likely to be targeted';
      case 'charge': return 'Lost entirely if the unit is stunned before it releases';
      // Everything else states its own numbers in the one-line description, so a second
      // line under it would only say the same thing again.
      default: return '';
    }
  }

  function statusTable(bad) {
    const box = UI.el('div', 'help-status');
    for (const id in DJ.STATUS) {
      const d = DJ.STATUS[id];
      if (!!d.bad !== bad) continue;
      const card = UI.el('div', 'hs-card');
      const head = UI.el('div', 'hs-head');
      if (DJ.SPRITES[d.icon]) head.appendChild(UI.spriteEl(d.icon, 1.6, d.name));
      const nm = UI.el('b', null, d.name);
      nm.style.color = d.color;
      head.appendChild(nm);
      card.appendChild(head);
      card.appendChild(UI.el('div', 'hs-desc', d.desc));
      const n = statusNumbers(id);
      if (n) card.appendChild(UI.el('div', 'hs-num', n));
      box.appendChild(card);
    }
    return box;
  }

  // ================= sections =================
  const SECTIONS = [
    ['basics', 'How a Run Works', buildBasics],
    ['map', 'The Map', buildMap],
    ['battle', 'Battle', buildBattle],
    ['stats', 'Stats', buildStats],
    ['ailments', 'Ailments', buildAilments],
    ['boons', 'Boons', buildBoons],
    ['tactics', 'When Not to Attack', buildTactics],
    ['levels', 'Levels and XP', buildLevels],
    ['gear', 'Gear and Potions', buildGear],
    ['roster', 'Adventurers', buildRoster],
  ];

  function buildBasics(box) {
    box.appendChild(h('How a Run Works'));
    box.appendChild(p('An expedition is one journey from the edge of the jungle to the Heart at its centre. You pick three adventurers, walk a branching map of ' + (DJ.HEART_COL + 1) + ' columns, and fight whatever is on the path you chose. If all three fall, the expedition ends there and the party is lost with it.'));
    box.appendChild(p('Nothing carries over between expeditions except what you have learned and what you have unlocked. Levels, gold and gear all belong to the run they were earned in.'));
    box.appendChild(sub('The three regions'));
    // Where each region begins and ends is read off the map generator, so this cannot
    // drift if the columns are ever rebalanced.
    const span = [];
    for (let c = 1; c <= DJ.HEART_COL; c++) {
      const r = DJ.regionOfCol(c);
      if (!span[r]) span[r] = { from: c, to: c };
      else span[r].to = c;
    }
    const flavour = [
      'Small, quick things, and where the game teaches you what a wind-up looks like. A party that fights everything here leaves it over-levelled.',
      'The ground stops being ground. Poisoners, drowners, and the first monsters that genuinely punish a careless turn.',
      'Above the mist, where the old guardians still keep their posts. It ends at the Heart of the Jungle.',
    ];
    box.appendChild(defs(DJ.REGIONS.slice(0, 3).map((r, i) => [
      r.name,
      'Columns ' + span[i].from + ' to ' + span[i].to + '. ' + flavour[i],
      r.color,
    ])));
    // The Beyond does not exist as far as the game is concerned until the Heart is dead,
    // so the guide does not mention it either.
    if (((DJ.profile.stats || {}).runsWon || 0) > 0) {
      box.appendChild(defs([[DJ.REGIONS[3].name,
        'Past where the Heart was. Endless, generated fresh every time, and it never stops scaling. No XP is granted here, so you are spending what you already have. Most parties stall somewhere past depth ten.',
        DJ.REGIONS[3].color]]));
    }
    box.appendChild(note('Ordinary battles, elites and bosses are the only nodes that award XP. Everything else on the map is spent time, gold, or a gamble.'));
  }

  function buildMap(box) {
    box.appendChild(h('The Map'));
    box.appendChild(p('The map runs left to right in columns. Each step you choose one of the nodes the current path leads to, and you cannot go back. Nodes you have not yet reached show as a question mark, apart from campfires and merchants, which are always visible so a route can be planned around them.'));
    const rows = [];
    const order = ['battle', 'elite', 'boss', 'heart', 'rest', 'merchant', 'treasure', 'shrine', 'training', 'event', 'puzzle', 'trap', 'mystery'];
    const what = {
      battle: 'An ordinary fight. XP, gold, and sometimes a piece of equipment.',
      elite: 'A much harder fight against a single large monster, for much better loot.',
      boss: 'The guardian of the region. One of three possible guardians is drawn at the start of each expedition, so no two runs meet the same set.',
      heart: 'The end of the expedition, and the hardest fight in the game.',
      rest: 'Recover health and mana, or spend the night improving one adventurer instead.',
      merchant: 'Buy potions and equipment, and sell what you are not wearing.',
      treasure: 'Equipment and gold, with no fight attached.',
      shrine: 'A permanent stat bonus for one adventurer, for the rest of the run.',
      training: 'Trade time for experience.',
      event: 'A choice with consequences. Some of them are bad.',
      puzzle: 'A riddle, a totem sequence, or a vine lock. Solve it for a reward.',
      trap: 'Damage, unless you spot it coming.',
      mystery: 'Could be any of the above. That is the point.',
    };
    for (const k of order) {
      const info = DJ.NODE_INFO[k];
      if (info) rows.push([info.name, what[k], info.color, info.icon]);
    }
    box.appendChild(defs(rows));
    box.appendChild(note('Every path through the map visits exactly one node per column, so a run is always the same length. What changes is which nodes you spend it on.'));
  }

  function buildBattle(box) {
    box.appendChild(h('Battle'));
    box.appendChild(sub('Turn order'));
    box.appendChild(p('At the start of each round every living unit rolls for position: its SPD multiplied by a random factor between 0.85 and 1.15. Highest goes first. A fast adventurer usually acts before a slow monster, but not always, which is why Haste and Chill matter more than their numbers suggest.'));
    box.appendChild(p('The order strip at the top of the battle screen shows who is next. It is a projection, not a promise: it re-rolls each round.'));
    box.appendChild(sub('What a turn can be'));
    box.appendChild(defs([
      ['Attack', 'A basic strike at 100% power. Costs nothing.'],
      ['Ability', 'One of up to four abilities, each costing mana. The tag on the card says whether its numbers come from ATK or MAG.'],
      ['Guard', 'Raises DEF by 50% for two turns. It restores no mana, and it is not a wasted turn as often as it looks.'],
      ['Item', 'Drink a potion. Uses the whole turn, whoever it is aimed at.'],
    ]));
    box.appendChild(sub('Damage'));
    box.appendChild(p('A physical hit is ATK multiplied by the ability’s power, then reduced by the target’s DEF. Magic works the same way from MAG, except that DEF only counts for six tenths of its value. Every hit is then rolled a further 10% either way.'));
    box.appendChild(note('That six tenths is the whole reason to carry a spellcaster: an armoured monster is meaningfully softer to magic than it is to steel. Check DEF on the compendium page before deciding who swings.'));
    box.appendChild(sub('Hitting everything at once'));
    box.appendChild(p('An ability that strikes every enemy loses ' +
      Math.round(DJ.AOE_FALLOFF.perTarget * 100) + '% of its power for each target beyond the first, down to a floor of ' +
      Math.round(DJ.AOE_FALLOFF.floor * 100) + '%. Against two it deals ' + Math.round(DJ.aoeShare(2) * 100) +
      '% to each, against three ' + Math.round(DJ.aoeShare(3) * 100) + '%, against four ' + Math.round(DJ.aoeShare(4) * 100) +
      '%. Sweeps are still the right answer to a crowd, but they are no longer the right answer to everything.'));
    box.appendChild(sub('Critical hits'));
    box.appendChild(p('Every attack starts at a 5% chance to crit and gains half a percent for each point of SPD it has over its target, up to a ceiling of 75%. Some abilities add their own chance on top. A crit deals 75% more damage.'));
    box.appendChild(sub('Resistance'));
    box.appendChild(p('Bigger monsters shrug off ailments. An elite takes a harmful status at 85% of its listed chance, and a boss or the Heart at 60%. Stun is resisted much harder still: 60% on an elite, 30% on a boss, and even then it lasts only a single turn. Damage over time ticks on a boss for ' + pct((DJ.STATUS_TUNE || {}).dotBossMult || 0.4) + ' of its usual figure.'));
    box.appendChild(note('No single tick of Poison, Burn or Bleed can take more than ' + pct((DJ.STATUS_TUNE || {}).dotEnemyCap || 0.18) + ' of a monster’s maximum health, so stacking Poison on something enormous has a ceiling. On your own party there is no such mercy.'));
  }

  function buildStats(box) {
    box.appendChild(h('Stats'));
    box.appendChild(p('Six numbers describe every adventurer and every monster. They rise automatically with level, and gear and shrines add to them on top.'));
    const rows = [];
    for (const k of ['hp', 'mp', 'atk', 'mag', 'def', 'spd']) {
      const s = DJ.STAT_HELP[k];
      if (s) rows.push([s.name + '  (' + k.toUpperCase() + ')', s.text]);
    }
    box.appendChild(defs(rows));
    box.appendChild(sub('Where the numbers come from'));
    box.appendChild(defs([
      ['Physical damage', 'ATK, multiplied by the ability power, divided down by the target’s full DEF.'],
      ['Magic damage', 'MAG, multiplied by the ability power, divided down by 60% of the target’s DEF.'],
      ['Healing', 'MAG, multiplied by the ability power, plus a small bonus from the healer’s level.'],
      ['Drain', 'Whichever of ATK or MAG is higher on the caster.'],
      ['Turn order and crits', 'SPD, on both counts.'],
    ]));
  }

  function buildAilments(box) {
    box.appendChild(h('Ailments'));
    box.appendChild(p('Harmful effects. Both sides can inflict all of them, and a green potion clears every one at once.'));
    box.appendChild(statusTable(true));
  }

  function buildBoons(box) {
    box.appendChild(h('Boons'));
    box.appendChild(p('Helpful effects. Monsters use most of these too.'));
    box.appendChild(statusTable(false));
  }

  function buildTactics(box) {
    box.appendChild(h('When Not to Attack'));
    box.appendChild(p('Most turns, hitting the thing in front of you is correct. Three situations change that, and all three announce themselves before they cost you anything.'));
    box.appendChild(sub('Something is winding up'));
    box.appendChild(p('A monster that spends a turn Charging is telling you that something much larger arrives on its next turn. You have one turn to decide what to do about it.'));
    box.appendChild(bullets([
      'Guard with whoever it is most likely to hit. Guard is at its best exactly here.',
      'Stun it. An interrupted wind-up is lost entirely, and the monster has wasted a whole turn.',
      'Heal first. A wind-up landing on somebody already hurt is how parties lose an adventurer.',
      'Or take it on the chin, and use the free turn to kill something else.',
    ]));
    box.appendChild(sub('Something is bristling'));
    box.appendChild(p('A monster with Thorns sends half of every blow that lands straight back at whoever threw it. A four-hit flurry into a bristling monster reflects four times. This is the one case where a turn spent guarding, healing, or buffing genuinely beats a turn spent attacking.'));
    box.appendChild(note('Thorns reflects damage that actually landed, so it does not care whether you swung with ATK or MAG. What it does care about is how many separate hits you threw.'));
    box.appendChild(sub('Something is stacking'));
    box.appendChild(p('A monster whose whole kit is Poison does no real damage on any single turn and is lethal over eight of them. Against these, killing the poisoner is more urgent than killing whatever is hitting you, and a green potion is worth more than a red one.'));
    box.appendChild(sub('And on your own side'));
    box.appendChild(bullets([
      'Shock makes a target take a quarter more damage from everything. Landing it before your heaviest ability is worth a turn.',
      'Chill halves the healing a target receives, which is how you beat a monster that keeps mending itself.',
      'Taunt pulls attacks onto whoever can survive them. Every heavy front-liner has it.',
    ]));
  }

  function buildLevels(box) {
    box.appendChild(h('Levels and XP'));
    box.appendChild(p('Every adventurer who is still standing at the end of a battle shares in the XP. A fallen adventurer earns nothing for that fight, which is a quiet second cost to letting somebody go down.'));
    box.appendChild(sub('What a level costs'));
    const tbl = UI.el('div', 'help-xp');
    const head = UI.el('div', 'hx-row hx-head');
    for (const t of ['Level', 'XP to reach it', 'Running total']) head.appendChild(UI.el('span', null, t));
    tbl.appendChild(head);
    let total = 0;
    for (let lv = 1; lv < DJ.MAX_LEVEL; lv++) {
      const cost = DJ.xpForLevel(lv);
      total += cost;
      const row = UI.el('div', 'hx-row');
      row.appendChild(UI.el('span', null, String(lv + 1)));
      row.appendChild(UI.el('span', null, DJ.fmt(cost)));
      row.appendChild(UI.el('span', null, DJ.fmt(total)));
      tbl.appendChild(row);
    }
    box.appendChild(tbl);
    box.appendChild(p('The cost of the next level is 26 multiplied by the current level raised to the power 1.32, so it climbs steeply but never becomes impossible. The cap is level ' + DJ.MAX_LEVEL + '.'));
    box.appendChild(sub('What a level gives'));
    box.appendChild(bullets([
      'Every stat rises by that adventurer’s own per-level growth, shown on their card.',
      'A quarter of maximum health and just under a third of maximum mana are restored on the spot.',
      'Two abilities are known from the start. The third arrives at level ' +
        DJ.SKILL_UNLOCK_LEVELS[2] + ' and the fourth at level ' + DJ.SKILL_UNLOCK_LEVELS[3] + '.',
    ]));
    box.appendChild(note('Levelling up mid-fight is a real heal. A party one battle away from a level-up is in better shape than its health bars suggest.'));
  }

  function buildGear(box) {
    box.appendChild(h('Gear and Potions'));
    box.appendChild(sub('Equipment'));
    box.appendChild(p('Each adventurer wears a weapon, a piece of armour and a trinket. Equipment adds flat stats, and some trinkets carry a passive effect that runs all fight.'));
    box.appendChild(defs([
      ['Common', 'The bulk of what drops. Modest stats, no passive.', '#c8d8c8'],
      ['Rare', 'Better stats, and the first pieces that carry a passive.', '#6fb8e8'],
      ['Epic', 'The best in the jungle, and the rarest. Elites, bosses and treasure are where they come from.', '#d0b0ff'],
    ]));
    const pas = [];
    for (const k in (DJ.PASSIVE_DESC || {})) pas.push([k.charAt(0).toUpperCase() + k.slice(1), DJ.PASSIVE_DESC[k]]);
    if (pas.length) { box.appendChild(sub('Trinket passives')); box.appendChild(defs(pas)); }
    box.appendChild(sub('Potions'));
    const prow = [];
    for (const id in DJ.POTIONS) {
      const pt = DJ.POTIONS[id];
      const extra = pt.cap ? '  Carry at most ' + pt.cap + '.' : '';
      const price = pt.price ? '  Around ' + pt.price + ' gold, rising as the run goes on.' : '';
      prow.push([pt.name, pt.desc + extra + (pt.rare ? '  Never sold and never dropped by an ordinary monster.' : price), null, pt.icon]);
    }
    box.appendChild(defs(prow));
    box.appendChild(note('Drinking a potion costs the whole turn. Two red potions and a wasted round is often a worse trade than one Guard and a heal.'));
  }

  function buildRoster(box) {
    box.appendChild(h('Adventurers'));
    box.appendChild(p('There are ' + DJ.HEROES.length + ' adventurers. Five are available from the start and the rest are unlocked by achievements, which are earned by playing rather than bought.'));
    box.appendChild(p('The Adventurers page shows every one of them, locked or not, with the achievement that unlocks each. Achievements that count something show their progress, so you can see how far off you are.'));
    box.appendChild(sub('Roles'));
    box.appendChild(defs([
      ['Front-liners', 'High HP and DEF, and the only adventurers with Taunt. Several also carry Thorns, which turns standing still into an attack.'],
      ['Casters', 'High MAG. Magic ignores four tenths of a target’s DEF, so casters are the answer to anything armoured.'],
      ['Healers', 'Keep the party standing. Watch for Chill, which halves everything they do.'],
      ['Skirmishers', 'High SPD, high crit. They act first, which is what makes Shock and other openers land before the heavy hitters swing.'],
      ['Support', 'Buffs, debuffs, and the Toucan Bard, who is the only adventurer able to put mana back into the party.'],
    ]));
    box.appendChild(note('A party does not strictly need a healer, but it does need a plan for damage it cannot avoid: potions, a Shield, Regen, or something with enough Thorns and DEF that the jungle hurts itself on it.'));
  }

  // ================= screen =================
  H.open = function () {
    H.render();
    UI.show('help');
  };

  H.render = function () {
    const nav = UI.$('#helpNav');
    const body = UI.$('#helpBody');
    nav.innerHTML = '';
    body.innerHTML = '';

    for (const [id, label] of SECTIONS) {
      const b = UI.el('button', 'help-tab' + (id === section ? ' on' : ''), label);
      b.type = 'button';
      b.addEventListener('click', () => {
        if (section === id) return;
        section = id;
        DJ.sfx('click');
        H.render();
        body.scrollTop = 0;
      });
      nav.appendChild(b);
    }

    // Sections build into a centred column rather than straight into the scroller.
    const inner = UI.el('div', 'help-inner');
    body.appendChild(inner);
    const found = SECTIONS.find((s) => s[0] === section) || SECTIONS[0];
    found[2](inner);
  };
})(typeof window !== 'undefined' ? window : globalThis);
