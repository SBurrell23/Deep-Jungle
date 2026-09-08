/* Deep Jungle — title screen with an animated jungle backdrop. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const T = (UI.Title = {});

  let canvas, ctx, raf = 0, t = 0, layers = null, fire = null;

  function buildLayers(w, h) {
    const rng = new DJ.RNG(20240906);
    const L = [];
    // three parallax bands of jungle silhouettes
    const bands = [
      { y: h * 0.72, color: '#0a1b10', count: 26, scale: 1.5, speed: 4 },
      { y: h * 0.82, color: '#0d2415', count: 20, scale: 2.1, speed: 9 },
      { y: h * 0.95, color: '#112e1a', count: 15, scale: 2.9, speed: 16 },
    ];
    for (const b of bands) {
      const items = [];
      for (let i = 0; i < b.count; i++) {
        items.push({ x: rng.range(-0.1, 1.1) * w, h: rng.range(0.55, 1) * 70 * b.scale, w: rng.range(0.5, 1) * 26 * b.scale, k: rng.range(0, 6.28) });
      }
      L.push({ ...b, items });
    }
    // fireflies
    const flies = [];
    for (let i = 0; i < 34; i++) {
      flies.push({ x: rng.range(0, 1) * w, y: rng.range(0.2, 0.95) * h, r: rng.range(1, 2.4), k: rng.range(0, 6.28), sp: rng.range(0.25, 0.8), amp: rng.range(10, 42) });
    }
    return { bands: L, flies, w, h };
  }

  function draw() {
    const size = UI.fitCanvas(canvas);
    const { w, h, dpr } = size;
    if (!layers || layers.w !== w || layers.h !== h) layers = buildLayers(w, h);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // sky
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#06110b');
    g.addColorStop(0.55, '#0a1c11');
    g.addColorStop(1, '#132f1b');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // moon glow
    ctx.save();
    const mg = ctx.createRadialGradient(w * 0.76, h * 0.2, 4, w * 0.76, h * 0.2, Math.min(w, h) * 0.42);
    mg.addColorStop(0, 'rgba(180,220,180,.24)');
    mg.addColorStop(1, 'rgba(180,220,180,0)');
    ctx.fillStyle = mg; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#dceedc';
    ctx.beginPath(); ctx.arc(w * 0.76, h * 0.2, Math.min(w, h) * 0.045, 0, 6.284); ctx.fill();
    ctx.restore();

    // parallax bands
    for (const b of layers.bands) {
      ctx.fillStyle = b.color;
      for (const it of b.items) {
        const sway = Math.sin(t * 0.5 + it.k) * 4;
        const x = ((it.x + t * b.speed) % (w + 120)) - 60;
        // trunk
        ctx.fillRect(x - it.w * 0.12, b.y, it.w * 0.24, h - b.y);
        // canopy blob
        ctx.beginPath();
        ctx.ellipse(x + sway, b.y, it.w, it.h * 0.5, 0, 0, 6.284);
        ctx.fill();
      }
    }
    // hanging vines
    ctx.strokeStyle = 'rgba(20,58,30,.75)'; ctx.lineWidth = 2;
    for (let i = 0; i < 14; i++) {
      const x = (i / 14) * w + Math.sin(t * 0.3 + i) * 8;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      for (let y = 0; y < h * 0.45; y += 12) ctx.lineTo(x + Math.sin(t * 0.6 + y * 0.05 + i) * 5, y);
      ctx.stroke();
    }
    // fireflies
    for (const f of layers.flies) {
      const x = f.x + Math.sin(t * f.sp + f.k) * f.amp;
      const y = f.y + Math.cos(t * f.sp * 0.7 + f.k) * f.amp * 0.5;
      const a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2.2 + f.k));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = '#d9ef7a';
      ctx.shadowColor = '#c7e85a'; ctx.shadowBlur = 9;
      ctx.beginPath(); ctx.arc(x, y, f.r, 0, 6.284); ctx.fill();
      ctx.restore();
    }
    // vignette
    const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,.62)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
  }

  function loop(now) {
    t = now / 1000;
    if (UI.current === 'title') draw();
    raf = requestAnimationFrame(loop);
  }

  T.init = function () {
    canvas = UI.$('#titleCanvas');
    ctx = canvas.getContext('2d');
    if (!raf) raf = requestAnimationFrame(loop);
    T.refresh();
  };

  T.refresh = function () {
    const p = DJ.profile;
    const cont = UI.$('#btnContinue');
    cont.classList.toggle('hidden', !DJ.hasSavedRun());
    const s = p.stats;
    const bits = [
      `${p.unlocked.length}/${DJ.HEROES.length} adventurers`,
      `${p.achievements.length}/${DJ.ACHIEVEMENTS.length} achievements`,
      `${s.discovered}/${DJ.MONSTERS.length} monsters`,
    ];
    if (s.runsWon > 0) bits.push(`${s.runsWon} ${s.runsWon === 1 ? 'victory' : 'victories'}`);
    UI.$('#titleStats').textContent = bits.join('   ·   ');
  };
})(typeof window !== 'undefined' ? window : globalThis);
