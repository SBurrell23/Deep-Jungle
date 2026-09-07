#!/usr/bin/env python
"""Render Deep Jungle text-grid sprites to a labelled contact sheet PNG.
Usage: python tools/render_sprites.py <sprite.js> [more.js ...] <out.png> [--scale N] [--only id1,id2]
"""
import sys, json, subprocess, os, math
from PIL import Image, ImageDraw

args = [a for a in sys.argv[1:]]
scale = 4
only = None
if '--scale' in args:
    i = args.index('--scale'); scale = int(args[i+1]); del args[i:i+2]
if '--only' in args:
    i = args.index('--only'); only = set(args[i+1].split(',')); del args[i:i+2]
out = args[-1]; files = args[:-1]
if not files or not out.endswith('.png'):
    print(__doc__); sys.exit(2)

# Evaluate the JS files with node to extract DJ.SPRITES as JSON
node_src = """
global.window = global; global.DJ = { SPRITES: {} };
for (const f of process.argv.slice(1)) { require(require('path').resolve(f)); }
process.stdout.write(JSON.stringify(DJ.SPRITES));
"""
res = subprocess.run(['node', '-e', node_src, *files], capture_output=True, text=True)
if res.returncode != 0:
    print('NODE ERROR:\n' + res.stderr); sys.exit(1)
sprites = json.loads(res.stdout)
if only: sprites = {k: v for k, v in sprites.items() if k in only}

errors = []
def hex2rgb(h):
    h = h.lstrip('#')
    if len(h) == 3: h = ''.join(c*2 for c in h)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) + (255,)

rendered = {}
for sid, sp in sprites.items():
    w, h, pal, px = sp.get('w'), sp.get('h'), sp.get('pal', {}), sp.get('px', [])
    if len(px) != h:
        errors.append(f'{sid}: has {len(px)} rows, expected h={h}')
    bad_rows = [i for i, r in enumerate(px) if len(r) != w]
    if bad_rows:
        errors.append(f'{sid}: rows with wrong width (expected {w}): {bad_rows[:8]}')
    used = set(''.join(px)) - {'.'}
    missing = used - set(pal.keys())
    if missing:
        errors.append(f'{sid}: chars used but not in pal: {sorted(missing)}')
    filled = sum(1 for r in px for c in r if c != '.')
    if w and h and filled < (w*h) * 0.08:
        errors.append(f'{sid}: only {filled} filled pixels — looks empty/placeholder')
    img = Image.new('RGBA', (w or 1, h or 1), (0, 0, 0, 0))
    for y, row in enumerate(px[:h]):
        for x, c in enumerate(row[:w]):
            if c != '.' and c in pal:
                img.putpixel((x, y), hex2rgb(pal[c]))
    rendered[sid] = img.resize(((w or 1)*scale, (h or 1)*scale), Image.NEAREST)

if errors:
    print('VALIDATION ERRORS:'); print('\n'.join(' - ' + e for e in errors))

ids = sorted(rendered.keys())
if not ids:
    print('no sprites found'); sys.exit(1)
cell_w = max(im.width for im in rendered.values()) + 16
cell_h = max(im.height for im in rendered.values()) + 28
cols = min(8, len(ids)); rows = math.ceil(len(ids)/cols)
sheet = Image.new('RGBA', (cols*cell_w, rows*cell_h), (40, 44, 52, 255))
d = ImageDraw.Draw(sheet)
for i, sid in enumerate(ids):
    cx, cy = (i % cols)*cell_w, (i // cols)*cell_h
    d.rectangle([cx+4, cy+4, cx+cell_w-4, cy+cell_h-20], fill=(70, 80, 90, 255))
    im = rendered[sid]
    sheet.alpha_composite(im, (cx + (cell_w - im.width)//2, cy + 4 + (cell_h-24-im.height)))
    d.text((cx+6, cy+cell_h-16), sid[:22], fill=(255, 255, 255, 255))
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
sheet.save(out)
print(f'rendered {len(ids)} sprites -> {out}' + (' (WITH ERRORS)' if errors else ' OK'))
sys.exit(1 if errors else 0)
