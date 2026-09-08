# Deep Jungle

**Play it: https://sburrell23.github.io/Deep-Jungle/**

A turn-based jungle roguelite that runs entirely in the browser. Pick three adventurers,
carve a path through a procedurally generated jungle, and fight your way to the Heart of
the Jungle at the far end.

No build step, no dependencies, no framework. Open `index.html` and play.

## Playing

Choose three of 30 adventurers. Five are available from the start, covering fighter, mage,
lancer, monk and healer, so a first run already has a real choice. The other 25 unlock
through achievements, spread so that a first run opens about four and the roster keeps
opening for a dozen expeditions. The Adventurers screen on the title menu shows every
hero's stats and skills, with locked ones kept as silhouettes.

The map runs left to right across three regions and 40 columns. Each column offers a branch
of two to four nodes and you take exactly one, so a run visits about 34 of the 99 nodes on
the map. Roughly 78% of steps present a real choice of direction, and a single map contains
on the order of 10^11 distinct routes. Every path funnels through the same three region
bosses and ends at the Heart.

Columns alternate between forced-combat and mixed. Since you take exactly one node per
column, that alternation guarantees you can never travel two nodes in a row without a
fight, while still leaving a real choice at every step: on a combat column you pick which
fight, on a mixed one you pick whether to fight at all.

Battles are JRPG-style: initiative order by speed, four skills per hero unlocking at levels
1, 1, 5 and 10, and status effects that matter. Heroes level up, find equipment, and drink a
lot of potions. Actions are bound to Q, W, E and 1-4, and hovering any stat or status icon
explains it immediately.

Seventeen status effects drive most of what a fight asks of you, and both sides use all of
them. The three damage-over-time effects are deliberately different animals: **Poison**
stacks, adding a dose and resetting its clock every time it lands, so a poisoner who keeps
working gets steadily worse and one who is killed loses the whole stack at once; **Burn** is
short and heavy; **Bleed** is small and outlasts everything. **Shock** opens a target up to
25% more damage from every source, **Chill** slows a unit and halves the healing it
receives, and **Thorns** sends half of every blow straight back at whoever landed it.

Two of those exist to make attacking the wrong answer sometimes. A monster that spends a
turn **Charging** is announcing a much larger attack on its next one, which can be guarded
against, healed through, or thrown away entirely by stunning it; a monster with Thorns
punishes every separate hit, so a four-strike flurry into one reflects four times. Between
them, the fights that used to be attack-attack-attack now have turns where the right move is
to brace.

Each monster is built around a single idea rather than a generic kit. Some bleed, some
burn, some bristle, some wind up, and a couple — the Spore Colossus and the Plague Shaman
among them — never deal direct damage at all and simply keep stacking Poison until the
party runs out of time.

Any status an ability applies is named in the ability's own text, tinted its own colour and
explaining itself on hover, so nothing has to be memorised. The **Help** screen on the title
menu is a full field guide: the map, damage and turn order, every status with the exact
numbers the engine uses, the XP curve, gear, potions, and a section on when attacking is the
wrong move. Everything it quotes is read from live data, so it cannot drift.

Levelling restores rather than fully heals: the increase to max HP and MP is added straight
to the current values, and then a further 12% of each is topped up on top. A hero who levels
at low health comes out better off, but nowhere near full.

**Attrition is the run.** A battle hands back only a small share of health and mana
afterwards, so both drain across an expedition rather than resetting between fights. That
makes campfires, potions and the merchant into real decisions. A trader carries a few of
each potion rather than an unlimited supply — two to five of the basics, one to three on
the mid shelf, one of anything rare — because it does not matter how little a battle gives
back if a full purse can always buy the difference. What a shop has left is remembered on
the run, so leaving and coming back does not restock it. An ability that sweeps the
whole enemy line loses power for each target beyond the first, so clearing a crowd is what
sweeps are for rather than what they are always for.

**The expensive ability stays expensive.** Mana pools nearly triple across a run while
ability costs are fixed, so a capstone that cost half a bar at level 1 was costing a fifth
of one by the end and there was no longer any reason not to open every fight with it. The
two abilities a hero starts with are cheap and stay cheap; the two that unlock at levels 5
and 10 are priced against a full bar, so the big one is worth two or three casts a fight
and the other turns have to be filled with something else.

**Guard is a real stance.** It used to raise DEF by half, which — because DEF is already
divided into the damage — took about 14% off a hit in exchange for a whole turn. Nobody
ever guarded, and teaching the simulated player to brace against wind-ups made it lose
*more* runs, which is the measurement saying the trade was bad rather than the players
being wrong. Guard now cuts everything landing on that hero by 60%. A monster releasing a
wind-up hits the whole party for full power and never crits, so bracing against one is
usually the best turn on the board.

**How long an effect lasts is a property of the ability, not the status.** War Cry grants
three turns of Rage; Call of the Wild grants two. So every ability that hands out a boon or
an ailment stamps the duration onto the tinted word itself — Chilled 3, Haste 2 — read
straight off the ability so it cannot drift, and short enough that a card granting three of
them still fits on its button. Bleed, Poison, Burn and Stun are left bare, because those
four last the same from every source in the game and the field guide says so once.

A full run takes roughly an hour depending on your party. Progress saves to `localStorage`
automatically, and you can leave and resume mid-expedition, including partway through a
fight: the run is saved the moment you step onto a node, and resuming replays that node
from its saved RNG state, so you drop back into the same encounter.

## Node types

| Node | What happens |
|---|---|
| **Battle** | Two to four monsters scaled to the node's level |
| **Elite** | A much tougher single monster, usually with an escort. Better loot |
| **Region Boss** | The Bramble King, the Mother of Fangs, and the Vine Warden |
| **Heart of the Jungle** | The finale. Always the Heart, always with different minions |
| **Campfire** | Rest, train for XP, or forage for supplies |
| **Treasure** | Open it safely, or pry the lock for better odds and a chance of a trap |
| **Shrine** | Choose one of three permanent blessings |
| **Merchant** | Buy equipment and potions, sell what you are not using |
| **Encounter** | A branching story event with real consequences |
| **Puzzle** | A riddle, a totem memory sequence, a vine lock, or a glyph puzzle |
| **Training Ground** | Focused XP, group XP, or permanent stat conditioning |
| **Trap** | Push through it or try to disarm it |
| **Mystery** | Resolves into one of the above once you step in |

## Content

- **100 monsters**, every one with its own stat line, ability set, tags, and compendium
  entry. Tier 1 species haunt the undergrowth; tier 5 only appear deep in the canopy.
- **30 adventurers** across fighter, mage, healer, tank, rogue, and hybrid roles.
- **100 achievements**, 25 of which unlock a new adventurer.
- **227 skills** shared between heroes and monsters, with 17 status effects.
- **39 items** and 9 potions, including a rare one that grants an instant level.
- **12 story events**, 16 riddles, and 4 puzzle types.

## Technical notes

**Sprites are text.** Every character, monster, icon and decoration is a grid of characters
plus a small palette, defined in `js/sprites/*.js` and rasterized to canvas at load. The
format is documented in `docs/ART_SPEC.md`. This keeps the whole game readable and
diffable, and means the only binary assets are the music track and the effect sheets.

**Sound is generated.** Every sound effect is synthesized at play time with the Web Audio
API in `js/core/audio.js` — oscillators, filtered noise, and envelopes. There are no sound
effect files.

Music is the exception. Five exploration tracks play as a queue with a five-second
crossfade between them, and boss fights swap to their own track and hand control back when
the fight ends. Settings shows what is playing, with a skip button and a per-track repeat.

**The engine is DOM-free.** `js/engine/` knows nothing about the browser, which is what
lets the same battle code drive both the UI and the headless balance simulator.

## Tools

```bash
node tools/stamp.js
```

Rewrites the `?v=<hash>` on every local script and stylesheet in `index.html`. Run it after
changing anything under `js/` or `css/`, otherwise browsers keep serving the previous
build. `validate.js` fails the build if a stamp is stale.

```bash
node tools/validate.js
```

Checks that every sprite, skill, effect, item, achievement and map reference resolves, that
all 106 monsters have unique stats, that every locked hero is reachable through some
achievement, that every music track exists, that cache stamps are current, and that 40
generated maps have no unreachable nodes or dead ends. CI runs this before deploying.

It also reads every ability description against the statuses that ability actually applies.
Since a status named in the text is tinted and made hoverable, a description that claims an
effect it does not apply is a lie to the player rather than a typo, and fails the build;
applying one without mentioning it is only a warning. The same check confirms that the
payload of a wind-up never appears in a monster's own ability list, where it could be cast
with no warning at all.

```bash
node tools/sim.js 40
node tools/sim.js 30 --party dryad_healer,goblin_mage,elf_warrior --verbose
node tools/sweep.js 40 5
```

The balance simulator plays complete expeditions with an AI player and reports win rate,
estimated real playtime, and a difficulty curve broken down by map column. `sweep.js` runs
many random party compositions to catch outliers.

Current tuning, measured over 400 simulated runs across 80 random party compositions:

| Metric | Value |
|---|---|
| Win rate | 10.0% |
| Average playtime | 46m01s |
| Winning-run playtime | 72m29s |
| Battles per run | 17.9 |
| Nodes per run | 26.0 |

Read that figure as a floor rather than a forecast, and only as a relative measure between
two builds. The gap between it and a person is large and has been measured directly: four
separate attempts to make the simulated player behave more like one — drinking potions
sooner, topping the party up between fights, spending its gold, reviving the fallen — each
made its win rate *worse*, not better. Its losses are not caused by thrift. It loses
because it reacts to the board it is looking at, and a person plays the board that is one
turn away.

```bash
node tools/diag.js 40 4
node tools/parties.js 20 5
```

`sweep.js` answers "did the run survive". `diag.js` answers "what was the party doing":
what share of turns went on attacking rather than casting, how full the mana bars were
when fights ended, how many potions were carried to the grave, how hard the incoming hits
were as a share of the target's health, and what the party had left on the turn it lost.
It drives `sim.js` unchanged and watches from outside by wrapping a few engine methods, so
the player it describes is exactly the one `sweep.js` scores.

That tool is how this pass was done. It found that the average ability cost 14.5% of the
caster's bar, that the party ended fights on 85% health, that Guard was chosen on 1.4% of
turns, and that losing runs finished with 866 gold and eleven potions unspent — which
turned out to mean potions were not worth their turn rather than that the player was being
timid.

`parties.js` splits the same game by composition — balanced, sustain-heavy, random, and
all-damage — because `sweep.js` averages over trios no player would ever pick. It exists
to check how much the headline number understates a deliberate party. Currently: not much,
which is itself worth knowing.

### Balance harnesses

Four narrower tools, for questions `sim.js` and `sweep.js` average away. All of them
report a spread rather than a single number, because that is what you tune against.

```bash
node tools/heroes.js 5
```

Every adventurer run with the same fixed set of partner pairs, so what comes out is the
hero's own contribution rather than the company they kept. This is the one that found
the roster spanning 13% to 77%, and the two structural faults behind it: skills that
scaled off a stat their owner did not have, and tanks with no way to protect anyone.
At 50 runs a hero the noise is worth about 13 points, so act only on heroes that stay
out of line across repeated measurements rather than chasing single results.

```bash
node tools/sustain.js 300 4
```

Classifies every adventurer by the sustain they actually bring, read off their kit
rather than their job title, then splits win rates by how many healers a party brought
and, among healerless parties, by whether a substitute made up the difference. **Run
this after touching any heal power or cost.** As of now a healer is worth about four
points and a second about five, healerless parties win 47.7%, and what actually matters
is sustain of some kind rather than a healer specifically: a party carrying a drain, a
self-heal or a revive beats the average party that brought a real healer.

```bash
node tools/bosses.js 300
```

Fights all three of a region's guardians with the same party at the same level. Win rate
alone is misleading here, because a guardian can be beaten reliably and still gut a party
on the way out, which shows up later as a lost run. Watch the rounds and the hero downs
beside it.

```bash
node tools/beyond.js 60 4
```

Every party that beats the Heart carries straight on into The Beyond, and the tool
reports the distribution of depths reached. That distribution is the whole design of the
endless region: the party is frozen at level 20, so what happens next is a curve of
monster levels against a party that cannot answer it. The targets are that most deep
runs end before depth 13 and almost none see depth 20.

```bash
node tools/region.js 11 50
```

Stops each run at a chosen column and reports the difficulty curve over just that
stretch. Full expeditions hide what a single region feels like: this is what showed the
opening region ending fights with the party at 92% health, running a level and a third
below them the whole way.

Each region is guaranteed one or two trading posts, so gold always has somewhere to go.

The simulator's AI is a decent but not expert player, and its timing model assumes someone
who already knows the game. A first-time player reading skill descriptions and browsing
merchants should land nearer the top of that range.

```bash
python tools/render_sprites.py js/sprites/monsters_a.js out.png --scale 4
python tools/fx_rows.py fx5a rows.png 0 15
```

Sprite contact sheets and effect-sheet row indexes, for working on the art.

## Layout

```
index.html            screens and script order
css/game.css          all styling
js/core/              utilities, audio synthesis, sprite and effect rendering
js/data/              monsters, heroes, skills, items, achievements, events
js/engine/            battle, map generation, run state, save (all DOM-free)
js/sprites/           text-grid pixel art
js/ui/                screens: title, select, map, battle, nodes, puzzles, panels
tools/                validation, balance simulators and harnesses, art tooling
assets/FX/            effect sprite sheets
assets/audio/         music
```

## Credits

Effect sprite sheets: Retro Impact Effect Packs 3–5. Music: *Vinebridge Quest*.
Everything else was generated for this project.
