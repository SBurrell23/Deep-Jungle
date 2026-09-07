# Deep Jungle — Pixel Art Sprite Spec

All game art is defined as **text pixel grids** in JavaScript so it ships with zero binary
assets and can be drawn to `<canvas>` at any integer scale.

## File format

Each sprite file is a plain script (NOT an ES module) that appends to the global `DJ.SPRITES`
object:

```js
// js/sprites/monsters_a.js
(function () {
  const S = (window.DJ = window.DJ || {}).SPRITES || (DJ.SPRITES = {});

  S.vine_rat = {
    w: 32, h: 32,
    pal: {
      k: '#1b1023',   // outline (near-black, slightly tinted)
      b: '#6b4a2f',   // fur dark
      c: '#9c7048',   // fur mid
      d: '#c99c6a',   // fur light
      e: '#e84a5f',   // eye
      f: '#3f8a3a',   // vine
    },
    px: [
      '................................',
      // ... exactly h rows, each exactly w chars ...
    ],
  };
})();
```

Rules:
- `px` must have exactly `h` strings, each exactly `w` characters. `.` = transparent.
- Every non-`.` character used in `px` must exist in `pal`. Keys are single characters
  (letters, digits). Keep palettes to 4–9 colors.
- Sizes: regular monsters **32×32**; elites **40×40**; region bosses **48×48**;
  Heart of the Jungle **64×64**; heroes **32×32**; icons **16×16**; large icons **24×24**.
- Monsters FACE LEFT (they stand on the right side of the battle screen).
  Heroes FACE RIGHT. Icons have no facing.
- Feet/base should rest on (or within 2px of) the bottom row so sprites share a ground line.
  Flying creatures may hover but keep them in the lower 2/3.
- Use a dark tinted outline (not pure black) around the silhouette, 3–4 tones per material
  (shadow / mid / highlight), and one accent color for eyes/glow. Strong, readable
  silhouettes matter more than detail. No anti-aliasing — hard pixels only.
- Do not leave a sprite as a blob or a placeholder. Every sprite must be recognizable
  as the named creature at 3× scale.

## Verifying your work (required)

Render your file to a labelled contact sheet and LOOK at it with the Read tool:

```
python tools/render_sprites.py js/sprites/monsters_a.js /tmp/sheet_a.png
```

The tool validates dimensions/palette (it fails loudly on errors) and renders every sprite at
4× with its id underneath. Iterate until every sprite reads clearly as its creature.
