# Deep Jungle

**Play it: https://sburrell23.github.io/Deep-Jungle/**

A turn-based jungle roguelite that runs entirely in the browser. Pick three adventurers,
carve a path through a procedurally generated jungle, and fight your way to the Heart of
the Jungle at the far end.

No build step, no dependencies, no framework. Open `index.html` and play.

## Playing

Choose three of 23 adventurers. Three are available from the start; the other 20 unlock
through achievements, so each run tends to open up a different roster for the next one.

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
1, 1, 4 and 8, and status effects that matter. Heroes level up, find equipment, and drink a
lot of potions.

A full run takes roughly 40 minutes to an hour depending on your party. Progress saves to
`localStorage` automatically, and you can leave and resume mid-expedition.

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
- **23 adventurers** across fighter, mage, healer, tank, rogue, and hybrid roles.
- **100 achievements**, 20 of which unlock a new adventurer.
- **159 skills** shared between heroes and monsters, with 12 status effects.
- **39 items** and 8 potions.
- **12 story events**, 16 riddles, and 4 puzzle types.

## Technical notes

**Sprites are text.** Every character, monster, icon and decoration is a grid of characters
plus a small palette, defined in `js/sprites/*.js` and rasterized to canvas at load. The
format is documented in `docs/ART_SPEC.md`. This keeps the whole game readable and
diffable, and means the only binary assets are the music track and the effect sheets.

**Sound is generated.** Every sound effect is synthesized at play time with the Web Audio
API in `js/core/audio.js` — oscillators, filtered noise, and envelopes. There are no sound
effect files.

Music is the exception. Four exploration tracks play as a queue with a five-second
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
all 100 monsters have unique stats, that every locked hero is reachable through some
achievement, that every music track exists, that cache stamps are current, and that 40
generated maps have no unreachable nodes or dead ends. CI runs this before deploying.

```bash
node tools/sim.js 40
node tools/sim.js 30 --party dryad_healer,goblin_mage,elf_warrior --verbose
node tools/sweep.js 40 5
```

The balance simulator plays complete expeditions with an AI player and reports win rate,
estimated real playtime, and a difficulty curve broken down by map column. `sweep.js` runs
many random party compositions to catch outliers.

Current tuning, measured over 250 simulated runs across 50 random party compositions:

| Metric | Value |
|---|---|
| Win rate | 49.3% |
| Average playtime | 48m20s |
| Winning-run playtime | 51m27s |
| Battles per run | 24.5 |
| Nodes per run | 33.9 |

The three starting adventurers have no healer between them and win about a third of the
time, which is deliberate: losing is how you earn the achievements that open the rest of
the roster.

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
tools/                validation, balance simulator, art tooling
assets/FX/            effect sprite sheets
assets/audio/         music
```

## Credits

Effect sprite sheets: Retro Impact Effect Packs 3–5. Music: *Vinebridge Quest*.
Everything else was generated for this project.
