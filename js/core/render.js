/* Deep Jungle — sprite rasterizer (text grids -> canvas) and FX sheet animator. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  DJ.SPRITES = DJ.SPRITES || {};

  const cache = new Map();   // "id@scale" -> canvas
  const tinted = new Map();

  DJ.spriteCanvas = function (id, scale) {
    scale = scale || 1;
    const key = id + '@' + scale;
    if (cache.has(key)) return cache.get(key);
    const sp = DJ.SPRITES[id];
    if (!sp) return null;
    const c = document.createElement('canvas');
    c.width = sp.w * scale; c.height = sp.h * scale;
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    for (let y = 0; y < sp.h; y++) {
      const row = sp.px[y] || '';
      let run = 0, runChar = null, runStart = 0;
      for (let px = 0; px <= sp.w; px++) {
        const ch = px < sp.w ? row[px] : null;
        if (ch === runChar) { run++; continue; }
        if (runChar && runChar !== '.' && sp.pal[runChar]) {
          x.fillStyle = sp.pal[runChar];
          x.fillRect(runStart * scale, y * scale, run * scale, scale);
        }
        runChar = ch; run = 1; runStart = px;
      }
    }
    cache.set(key, c);
    return c;
  };

  // Silhouette / flash version of a sprite (for hit flashes and locked entries).
  DJ.spriteTinted = function (id, scale, color, alpha) {
    const key = id + '@' + scale + '#' + color + '#' + (alpha || 1);
    if (tinted.has(key)) return tinted.get(key);
    const base = DJ.spriteCanvas(id, scale);
    if (!base) return null;
    const c = document.createElement('canvas');
    c.width = base.width; c.height = base.height;
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    x.drawImage(base, 0, 0);
    x.globalCompositeOperation = 'source-in';
    x.globalAlpha = alpha == null ? 1 : alpha;
    x.fillStyle = color;
    x.fillRect(0, 0, c.width, c.height);
    tinted.set(key, c);
    return c;
  };

  DJ.drawSprite = function (ctx, id, x, y, scale, opts) {
    opts = opts || {};
    const c = DJ.spriteCanvas(id, scale || 1);
    if (!c) return false;
    ctx.save();
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    let dx = x, dy = y;
    if (opts.center) { dx = x - c.width / 2; dy = y - c.height; }  // anchored at feet
    dx = Math.round(dx); dy = Math.round(dy);
    if (opts.flip) {
      ctx.translate(dx + c.width, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(c, 0, 0);
    } else {
      ctx.drawImage(c, dx, dy);
    }
    ctx.restore();
    if (opts.flash) {
      const t = DJ.spriteTinted(id, scale || 1, opts.flashColor || '#ffffff', opts.flash);
      if (t) {
        ctx.save();
        if (opts.flip) { ctx.translate(dx + t.width, dy); ctx.scale(-1, 1); ctx.drawImage(t, 0, 0); }
        else ctx.drawImage(t, dx, dy);
        ctx.restore();
      }
    }
    return true;
  };

  // Fallback box so a missing sprite is obvious but not fatal.
  DJ.drawMissing = function (ctx, x, y, w, h, label) {
    ctx.save();
    ctx.fillStyle = '#2a1030'; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#ff4d6d'; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    ctx.fillStyle = '#ff9ab0'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
    ctx.fillText((label || '?').slice(0, 10), x + w / 2, y + h / 2);
    ctx.restore();
  };

  // ---------- FX sprite sheets ----------
  const sheets = {};
  DJ.FX_SHEET_FILES = ['fx3a','fx3b','fx3c','fx3d','fx3e','fx3f','fx4a','fx4b','fx4c','fx4d','fx4e','fx4f','fx5a','fx5b','fx5c','fx5d','fx5e','fx5f'];
  // Frame grid per pack (measured from the sheets): packs 3/4 are 32px cells 6 wide; pack 5 is 64px cells 9 wide.
  DJ.FX_GRID = { '3': { cols: 6, size: 32, rows: 24 }, '4': { cols: 6, size: 32, rows: 30 }, '5': { cols: 9, size: 64, rows: 30 } };

  DJ.loadFxSheets = function (base) {
    const jobs = DJ.FX_SHEET_FILES.map((name) => new Promise((res) => {
      const img = new Image();
      img.onload = () => { sheets[name] = img; res(name); };
      img.onerror = () => { sheets[name] = null; res(null); };
      img.src = `${base}/${name}.png`;
    }));
    return Promise.all(jobs);
  };
  DJ.fxSheet = (name) => sheets[name] || null;
  DJ.fxGridFor = function (sheetName) {
    const pack = sheetName.charAt(2);
    const g = DJ.FX_GRID[pack] || DJ.FX_GRID['5'];
    const img = sheets[sheetName];
    if (img) return { cols: Math.max(1, Math.round(img.width / g.size)), size: g.size, rows: Math.round(img.height / g.size) };
    return g;
  };

  // Draw a single FX frame centred on (x, y).
  DJ.drawFxFrame = function (ctx, fxId, frame, x, y, scale, alpha) {
    const fx = DJ.FX[fxId];
    if (!fx) return false;
    const img = sheets[fx.sheet];
    if (!img) return false;
    const grid = DJ.fxGridFor(fx.sheet);
    const idx = DJ.clamp(frame, 0, fx.frames - 1);
    const cell = fx.row * grid.cols + idx;
    const sx = (cell % grid.cols) * grid.size;
    const sy = Math.floor(cell / grid.cols) * grid.size;
    if (sy + grid.size > img.height) return false;
    const w = grid.size * (scale || 1), h = grid.size * (scale || 1);
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, sx, sy, grid.size, grid.size, Math.round(x - w / 2), Math.round(y - h / 2), w, h);
    ctx.restore();
    return true;
  };

  // ---------- Particle / effect system ----------
  function FxLayer() { this.items = []; }
  FxLayer.prototype.add = function (o) { o.t = 0; this.items.push(o); return o; };
  FxLayer.prototype.spawnFx = function (fxId, x, y, opts) {
    opts = opts || {};
    const fx = DJ.FX[fxId] || DJ.FX.hit;
    return this.add({ type: 'sheet', fx: fxId, x, y, scale: opts.scale || 1.1, fps: opts.fps || 18,
      frames: fx ? fx.frames : 6, dur: (fx ? fx.frames : 6) / (opts.fps || 18), delay: opts.delay || 0 });
  };
  FxLayer.prototype.spawnText = function (text, x, y, opts) {
    opts = opts || {};
    return this.add({ type: 'text', text, x, y, color: opts.color || '#fff', size: opts.size || 16,
      vy: opts.vy == null ? -34 : opts.vy, dur: opts.dur || 0.95, delay: opts.delay || 0, bold: opts.bold !== false, shake: opts.shake });
  };
  FxLayer.prototype.spawnParticles = function (x, y, opts) {
    opts = opts || {};
    const n = opts.count || 10;
    for (let i = 0; i < n; i++) {
      const a = (opts.angle == null ? Math.random() * Math.PI * 2 : opts.angle + (Math.random() - 0.5) * (opts.spread || 1.2));
      const sp = (opts.speed || 90) * (0.5 + Math.random());
      this.add({ type: 'particle', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (opts.lift || 0),
        g: opts.gravity == null ? 180 : opts.gravity, size: opts.size || 3, color: opts.color || '#ffd27f',
        dur: opts.dur || 0.6, delay: 0 });
    }
  };
  FxLayer.prototype.update = function (dt) {
    for (const it of this.items) {
      if (it.delay > 0) { it.delay -= dt; continue; }
      it.t += dt;
      if (it.type === 'particle') {
        it.x += it.vx * dt; it.y += it.vy * dt; it.vy += it.g * dt;
      } else if (it.type === 'text') {
        it.y += it.vy * dt; it.vy += 46 * dt;
      }
    }
    this.items = this.items.filter((it) => it.delay > 0 || it.t < it.dur);
  };
  FxLayer.prototype.draw = function (ctx) {
    for (const it of this.items) {
      if (it.delay > 0) continue;
      const p = it.t / it.dur;
      if (it.type === 'sheet') {
        const frame = Math.floor(it.t * it.fps);
        DJ.drawFxFrame(ctx, it.fx, frame, it.x, it.y, it.scale, 1);
      } else if (it.type === 'text') {
        ctx.save();
        ctx.globalAlpha = p > 0.7 ? 1 - (p - 0.7) / 0.3 : 1;
        ctx.font = `${it.bold ? 'bold ' : ''}${it.size}px "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.lineWidth = 3.5; ctx.strokeStyle = 'rgba(10,6,14,0.92)';
        const jx = it.shake ? (Math.random() - 0.5) * 2.5 : 0;
        ctx.strokeText(it.text, it.x + jx, it.y);
        ctx.fillStyle = it.color;
        ctx.fillText(it.text, it.x + jx, it.y);
        ctx.restore();
      } else if (it.type === 'particle') {
        ctx.save();
        ctx.globalAlpha = 1 - p;
        ctx.fillStyle = it.color;
        const s = it.size * (1 - p * 0.4);
        ctx.fillRect(Math.round(it.x - s / 2), Math.round(it.y - s / 2), Math.max(1, Math.round(s)), Math.max(1, Math.round(s)));
        ctx.restore();
      }
    }
  };
  FxLayer.prototype.clear = function () { this.items.length = 0; };
  FxLayer.prototype.busy = function () { return this.items.some((i) => i.type === 'sheet'); };
  DJ.FxLayer = FxLayer;

  // ---------- Shared drawing helpers ----------
  DJ.roundRect = function (ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };
  // opts.max, when given, draws a dark tick every 25 points of that scale, so a bar can
  // be read as a count of segments rather than a vague fraction. A 900-HP boss would put
  // 36 ticks into 60 pixels, so the step doubles up through 50, 100, 250 and 500 until the
  // gaps are at least four pixels wide: you still count segments, they are just worth more.
  DJ.bar = function (ctx, x, y, w, h, pct, color, bg, border, opts) {
    ctx.save();
    ctx.fillStyle = bg || 'rgba(0,0,0,0.55)';
    ctx.fillRect(x, y, w, h);
    const fw = Math.max(0, Math.round(w * DJ.clamp(pct, 0, 1)));
    if (fw > 0) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, fw, h);
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.fillRect(x, y, fw, Math.max(1, Math.floor(h / 3)));
    }
    const max = opts && opts.max;
    if (max > 0 && w > 12) {
      // Mana pools are a fraction of a health pool, so they tick finer. The caller says
      // what one segment is worth and the ladder climbs from there.
      const base = (opts && opts.step) || 25;
      let step = base;
      for (const s of [base, base * 2, base * 4, base * 10, base * 20, base * 40]) {
        step = s; if ((w / (max / s)) >= 6) break;
      }
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      for (let v = step; v < max; v += step) {
        const tx = Math.round(x + w * (v / max));
        ctx.fillRect(tx, y + 1, 1, h - 2);
      }
    }
    ctx.strokeStyle = border || 'rgba(0,0,0,0.85)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    ctx.restore();
  };
})(typeof window !== 'undefined' ? window : globalThis);
