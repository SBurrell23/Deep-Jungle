"""Render a numbered row index for an FX sheet so effects can be mapped to rows."""
import sys
from PIL import Image, ImageDraw
name = sys.argv[1] if len(sys.argv) > 1 else 'fx5a'
out = sys.argv[2] if len(sys.argv) > 2 else 'rows.png'
lo = int(sys.argv[3]) if len(sys.argv) > 3 else 0
hi = int(sys.argv[4]) if len(sys.argv) > 4 else 999
pack = name[2]
size, cols = (32, 6) if pack in '34' else (64, 9)
im = Image.open(f'assets/FX/{name}.png').convert('RGBA')
rows = im.height // size
lo, hi = max(0, lo), min(rows, hi)
n = hi - lo
scale = 2 if size == 32 else 1
lbl = 34
sheet = Image.new('RGBA', (cols * size * scale + lbl, n * size * scale), (30, 32, 40, 255))
d = ImageDraw.Draw(sheet)
for i, r in enumerate(range(lo, hi)):
    strip = im.crop((0, r * size, cols * size, (r + 1) * size))
    if scale != 1:
        strip = strip.resize((strip.width * scale, strip.height * scale), Image.NEAREST)
    sheet.alpha_composite(strip, (lbl, i * size * scale))
    d.text((3, i * size * scale + size * scale // 2 - 4), str(r), fill=(255, 230, 120, 255))
    d.line([(0, i * size * scale), (sheet.width, i * size * scale)], fill=(70, 74, 86, 255))
sheet.save(out)
print(f'{name}: {rows} rows of {cols}x{size}px -> {out} (rows {lo}..{hi-1})')
