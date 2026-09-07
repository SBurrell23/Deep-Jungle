/* Deep Jungle — battle screen: canvas scene, animated event queue, action menus. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const B = (UI.Battle = {});

  let canvas, ctx, raf = 0, lastT = 0;
  let battle = null, node = null, onDone = null;
  let fx = null;
  let slots = { heroes: [], enemies: [] };
  let anim = [];            // queued visual events
  let animBusy = false;
  let waitingFor = null;    // hero unit awaiting input
  let pendingAction = null; // action awaiting a target
  let shake = 0, shakeT = 0;
  let logLines = [];
  let bgSeed = 1;
  let selectedTarget = null;
  let hoverTarget = null;
  let battleOver = false;
  let stripTick = 0;
  const statusHits = [];   // on-canvas status icon boxes, rebuilt every frame

  const SPEEDS = { 1: 1, 2: 1.55, 3: 2.3 };
  function sp() { return SPEEDS[DJ.profile.settings.speed] || 1; }
  function ms(v) { return v / sp(); }

  // ---------------- layout ----------------
  function layoutUnits() {
    const box = sceneBox();
    const w = box.w, h = box.h;
    const ground = box.y + h * GROUND;
    const depth = h * 0.045;          // small stagger reads as depth, not stairs
    const base = pickScale(w);

    const heroes = battle.party;
    const heroGap = Math.max(58, w * 0.085);
    slots.heroes = heroes.map((u, i) => ({
      u,
      x: w * 0.26 - i * heroGap,
      y: ground + i * depth,
      scale: base * (1 + i * 0.045),  // nearer heroes slightly larger
    }));

    const enemies = battle.enemies;
    const n = enemies.length;
    slots.enemies = enemies.map((u, i) => {
      const big = u.kind === 'final' || u.kind === 'boss';
      // bosses anchor at the back-centre; the rest fan out in front of them
      if (big) return { u, x: w * 0.78, y: ground - depth * 0.4, scale: base * (u.kind === 'final' ? 1.25 : 1.1) };
      const others = enemies.filter((e) => e.kind !== 'final' && e.kind !== 'boss');
      const j = others.indexOf(u);
      const m = Math.max(1, others.length);
      const hasBoss = enemies.some((e) => e.kind === 'final' || e.kind === 'boss');
      const spanX = Math.min(w * 0.34, m > 1 ? w * 0.10 * (m - 1) : 0);
      const tt = m > 1 ? j / (m - 1) : 0.5;
      const anchor = hasBoss ? w * 0.55 : w * 0.74;
      return {
        u,
        x: anchor + (tt - 0.5) * spanX,
        y: ground + (j % 2 === 0 ? depth * 0.9 : -depth * 0.5),
        scale: base * (j % 2 === 0 ? 1.03 : 0.95),
      };
    });
  }
  function pickScale(w) { return w < 460 ? 1.8 : w < 700 ? 2.3 : w < 980 ? 2.9 : 3.4; }
  function slotOf(u) {
    return slots.heroes.find((s) => s.u === u) || slots.enemies.find((s) => s.u === u) || null;
  }
  function unitCenter(u) {
    const s = slotOf(u);
    if (!s) return { x: 0, y: 0 };
    const sp2 = DJ.SPRITES[u.sprite];
    const hh = (sp2 ? sp2.h : 32) * s.scale;
    return { x: s.x, y: s.y - hh * 0.5 };
  }

  // ---------------- scene drawing ----------------
  function drawScene(dt) {
    const size = UI.fitCanvas(canvas);
    const { w, h, dpr } = size;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layoutUnits();

    let sx = 0, sy = 0;
    if (shake > 0) {
      shakeT += dt;
      sx = (Math.random() - 0.5) * shake;
      sy = (Math.random() - 0.5) * shake;
      shake = Math.max(0, shake - dt * 42);
    }
    ctx.save();
    ctx.translate(sx, sy);

    const region = DJ.REGIONS[node ? DJ.regionOfCol(node.col) : 0];
    drawBackground(w, h, region);   // full canvas gets the sky/ground wash

    // shadows + units, sorted so lower units draw in front
    statusHits.length = 0;
    slots.heroes.forEach((s, i) => { s.labelRow = i; });
    slots.enemies.forEach((s, i) => { s.labelRow = i; });
    const all = slots.heroes.concat(slots.enemies).slice().sort((a, b) => a.y - b.y);
    for (const s of all) drawUnit(s, w, h);

    fx.draw(ctx);
    ctx.restore();
  }

  const GROUND = 0.70;
  // On tall/narrow viewports the raw canvas leaves a huge empty sky. Constrain the
  // playfield to a band no taller than 9:16 of its width, centred vertically.
  function sceneBox() {
    const r = canvas.getBoundingClientRect();
    const w = r.width;
    const maxH = Math.min(r.height, w * 0.62);
    return { x: 0, y: (r.height - maxH) / 2, w, h: maxH, fullH: r.height };
  }
  function drawBackground(w, hFull, region) {
    const box = sceneBox();
    const h = box.h;
    const top = box.y;
    const ground = top + h * GROUND;
    // wash the whole canvas so the band never reads as letterboxing
    const full = ctx.createLinearGradient(0, 0, 0, hFull);
    full.addColorStop(0, '#030905');
    full.addColorStop(0.5, region.bg);
    full.addColorStop(1, '#030905');
    ctx.fillStyle = full; ctx.fillRect(0, 0, w, hFull);
    const g = ctx.createLinearGradient(0, top, 0, top + h);
    g.addColorStop(0, '#040d07');
    g.addColorStop(0.45, region.bg);
    g.addColorStop(GROUND, '#0d2214');
    g.addColorStop(1, '#081409');
    ctx.fillStyle = g; ctx.fillRect(0, top, w, h);

    const rng = new DJ.RNG(bgSeed);
    // far canopy
    ctx.fillStyle = 'rgba(8,26,15,.85)';
    for (let i = 0; i < 16; i++) {
      const x = rng.range(-40, w + 40), rr = rng.range(28, 70);
      ctx.beginPath(); ctx.ellipse(x, top + h * 0.22 + rng.range(-30, 30), rr, rr * 0.55, 0, 0, 6.284); ctx.fill();
    }
    // mid trees
    for (let i = 0; i < 9; i++) {
      const x = rng.range(0, w);
      const tw = rng.range(9, 20);
      ctx.fillStyle = 'rgba(12,34,20,.9)';
      ctx.fillRect(x, top + h * 0.28, tw, ground - (top + h * 0.28));
      ctx.beginPath(); ctx.ellipse(x + tw / 2, top + h * 0.3, rng.range(30, 56), rng.range(16, 28), 0, 0, 6.284); ctx.fill();
    }
    // hanging vines
    ctx.strokeStyle = 'rgba(24,64,34,.8)'; ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const x = rng.range(0, w);
      const len = rng.range(h * 0.12, h * 0.4);
      ctx.beginPath(); ctx.moveTo(x, top);
      for (let y = 0; y < len; y += 14) ctx.lineTo(x + Math.sin(y * 0.06 + i) * 6, top + y);
      ctx.stroke();
    }
    // ground
    const gg = ctx.createLinearGradient(0, ground - 12, 0, h);
    gg.addColorStop(0, '#1d3d22');
    gg.addColorStop(1, '#0b1a0e');
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.moveTo(0, ground);
    for (let x = 0; x <= w; x += 26) ctx.lineTo(x, ground + Math.sin(x * 0.03 + bgSeed) * 3);
    ctx.lineTo(w, top + h); ctx.lineTo(0, top + h); ctx.closePath(); ctx.fill();
    // ground detail
    ctx.fillStyle = 'rgba(52,102,58,.5)';
    for (let i = 0; i < 26; i++) {
      const x = rng.range(0, w), y = rng.range(ground + 4, top + h - 4);
      ctx.fillRect(x, y, rng.range(2, 7), 2);
    }
    // vignette
    const cy = top + h / 2;
    const vg = ctx.createRadialGradient(w / 2, cy, Math.min(w, h) * 0.3, w / 2, cy, Math.max(w, h) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)');
    ctx.fillStyle = vg; ctx.fillRect(0, top, w, h);
  }

  function drawUnit(s, w, h) {
    const u = s.u;
    const spr = DJ.SPRITES[u.sprite];
    const sw = (spr ? spr.w : 32) * s.scale;
    const sh = (spr ? spr.h : 32) * s.scale;
    const dead = !u.alive;

    // shadow
    ctx.save();
    ctx.globalAlpha = dead ? 0.12 : 0.34;
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(s.x, s.y + 2, sw * 0.36, sw * 0.12, 0, 0, 6.284); ctx.fill();
    ctx.restore();

    if (dead && (u.fadeT == null)) u.fadeT = 0;
    const alpha = dead ? 0.24 : 1;
    const bob = dead ? 0 : Math.sin(lastT * 0.0022 + (u.uid.charCodeAt(1) || 0)) * (u.side === 'hero' ? 1.4 : 2.0);
    const lunge = u.lungeT ? Math.sin(Math.min(1, u.lungeT) * Math.PI) * (u.side === 'hero' ? 16 : -16) : 0;

    // target highlight ring
    const isTargetable = pendingAction && pendingAction.targets && pendingAction.targets.includes(u);
    const hovered = isTargetable && hoverTarget === u;
    if (isTargetable) {
      ctx.save();
      ctx.strokeStyle = hovered ? '#ffe9a3' : 'rgba(232,198,90,.6)';
      ctx.lineWidth = hovered ? 3 : 2;
      ctx.setLineDash([5, 4]);
      ctx.lineDashOffset = -lastT * 0.02;
      ctx.beginPath(); ctx.ellipse(s.x, s.y + 2, sw * 0.44, sw * 0.17, 0, 0, 6.284); ctx.stroke();
      ctx.restore();
    }

    const ok = DJ.drawSprite(ctx, u.sprite, s.x + lunge, s.y + bob, s.scale, {
      center: true, alpha,
      flash: u.flashT ? Math.min(1, u.flashT * 3) : 0,
      flashColor: u.flashColor || '#ffffff',
    });
    if (!ok) DJ.drawMissing(ctx, s.x - sw / 2, s.y - sh, sw, sh, u.name);

    // Hovering a valid target lights the whole creature, so it is unmistakable which
    // one the click will land on: a soft halo behind it plus an additive wash on top.
    if (hovered) {
      const pulse = 0.5 + Math.sin(lastT * 0.007) * 0.5;
      const halo = DJ.spriteTinted(u.sprite, s.scale, '#ffe9a3', 1);
      const dx = Math.round(s.x + lunge - sw / 2);
      const dy = Math.round(s.y + bob - sh);
      if (halo) {
        // Halo behind the creature carries the glow; the wash on top stays light so the
        // sprite itself is still readable.
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.shadowColor = 'rgba(255,226,120,.95)';
        ctx.shadowBlur = 16 + pulse * 14;
        ctx.globalCompositeOperation = 'destination-over';
        for (let i = 0; i < 3; i++) ctx.drawImage(halo, dx, dy);
        ctx.restore();
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.13 + pulse * 0.10;
        ctx.drawImage(halo, dx, dy);
        ctx.restore();
      }
    }

    // active-turn marker: a large glowing gold chevron, placed above this unit's
    // status bars so it is never hidden behind them
    if (waitingFor === u) {
      ctx.save();
      const barTop = s.y - sh - 20 - ((s.labelRow || 0) % 3) * 15;
      const ay = barTop - 26 + Math.sin(lastT * 0.005) * 4;
      ctx.shadowColor = 'rgba(255,220,90,.95)';
      ctx.shadowBlur = 16 + Math.sin(lastT * 0.006) * 6;
      const grad = ctx.createLinearGradient(0, ay - 4, 0, ay + 16);
      grad.addColorStop(0, '#fff6c9');
      grad.addColorStop(1, '#e8a815');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(s.x, ay + 16);
      ctx.lineTo(s.x - 12, ay - 2);
      ctx.lineTo(s.x - 5, ay - 2);
      ctx.lineTo(s.x - 5, ay - 11);
      ctx.lineTo(s.x + 5, ay - 11);
      ctx.lineTo(s.x + 5, ay - 2);
      ctx.lineTo(s.x + 12, ay - 2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(90,60,5,.85)'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.restore();
    }

    if (!dead) drawUnitBars(s, u, sw, sh, s.labelRow || 0);
  }

  function drawUnitBars(s, u, sw, sh, idx) {
    const top = s.y - sh - 20 - (idx % 3) * 15;
    const bw = u.side === 'hero' ? Math.min(Math.max(40, sw * 0.8), 54) : Math.max(46, sw * 0.9);
    const x = s.x - bw / 2;
    if (u.side === 'enemy') {
      ctx.save();
      ctx.font = 'bold 10.5px "Trebuchet MS", sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(4,10,6,.92)'; ctx.lineWidth = 3;
      ctx.strokeText(u.name, s.x, top - 4);
      ctx.fillStyle = u.kind === 'final' ? '#ff9ab0' : u.kind === 'boss' ? '#ffb0a0' : u.kind === 'elite' ? '#e8b0ff' : '#e0d4c0';
      ctx.fillText(u.name, s.x, top - 4);
      ctx.restore();
    }

    DJ.bar(ctx, x, top, bw, 5, u.hp / u.maxHp, u.side === 'hero' ? '#4fbf5a' : '#c9483f');
    let barBottom = top + 5;
    if (u.side === 'hero' && u.maxMp > 0) {
      DJ.bar(ctx, x, top + 6, bw, 4, u.mp / u.maxMp, '#4f9fe0');
      barBottom = top + 10;
    }

    // statuses
    if (u.statuses.length) {
      let ix = x;
      const iy = barBottom + 3;
      for (const st of u.statuses.slice(0, 6)) {
        const def = DJ.STATUS[st.id];
        // Remember the hit box so hovering the icon can explain the effect.
        statusHits.push({ x: ix - 1, y: iy - 1, w: 14, h: 14, id: st.id, turns: st.turns });
        const drew = DJ.drawSprite(ctx, def ? def.icon : 'status_poison', ix, iy + 12, 0.85, { center: true });
        if (!drew) { ctx.fillStyle = def ? def.color : '#fff'; ctx.fillRect(ix, iy, 7, 7); }
        ctx.save();
        ctx.font = 'bold 8px monospace'; ctx.fillStyle = '#fff'; ctx.textAlign = 'left';
        ctx.strokeStyle = 'rgba(0,0,0,.9)'; ctx.lineWidth = 2;
        ctx.strokeText(String(st.turns), ix + 6, iy + 13); ctx.fillText(String(st.turns), ix + 6, iy + 13);
        ctx.restore();
        ix += 13;
      }
    }
  }

  // ---------------- animation loop ----------------
  function tick(now) {
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    if (UI.current === 'battle' && battle) {
      fx.update(dt);
      // per-unit timers
      for (const u of battle.party.concat(battle.enemies)) {
        if (u.flashT) u.flashT = Math.max(0, u.flashT - dt * 2.6);
        if (u.lungeT) u.lungeT = Math.max(0, u.lungeT - dt * 3.4);
      }
      drawScene(dt);
      if (++stripTick % 6 === 0) { refreshPartyStrip(); refreshTurnOrder(); }
    }
    raf = requestAnimationFrame(tick);
  }

  // ---------------- party strip ----------------
  function refreshPartyStrip() {
    const strip = UI.$('#battleParty');
    if (!strip || !battle) return;
    strip.innerHTML = '';
    for (const h of battle.party) {
      const cell = UI.el('div', 'bp-hero' + (h.alive ? '' : ' dead') + (waitingFor === h ? ' active' : ''));
      cell.appendChild(UI.spriteEl(h.sprite, 1.2, h.name));
      const info = UI.el('div', 'bp-info');
      const nm = UI.el('div', 'bp-name');
      nm.appendChild(UI.el('span', null, h.name));
      nm.appendChild(UI.el('span', 'bp-hp', h.alive ? `${h.hp}/${h.maxHp}` : 'down'));
      info.appendChild(nm);
      const bars = UI.el('div', 'pb-bars');
      const mk = (cls, pct) => { const b = UI.el('div', 'mini-bar ' + cls); const i = UI.el('i'); i.style.width = DJ.clamp(pct, 0, 1) * 100 + '%'; b.appendChild(i); return b; };
      bars.appendChild(mk('hp', h.hp / h.maxHp));
      if (h.maxMp > 0) bars.appendChild(mk('mp', h.mp / h.maxMp));
      info.appendChild(bars);
      if (h.statuses.length) {
        const st = UI.el('div', 'bp-status');
        for (const x of h.statuses.slice(0, 5)) {
          const d = DJ.STATUS[x.id];
          const dot = UI.el('span', 'bp-dot', (d ? d.name[0] : '?'));
          dot.style.background = d ? d.color : '#888';
          UI.statusTip(dot, x.id, x.turns);
          st.appendChild(dot);
        }
        info.appendChild(st);
      }
      cell.appendChild(info);
      strip.appendChild(cell);
    }
  }

  // ---------------- log ----------------
  function log(text) {
    if (!text) return;
    logLines.push(text);
    if (logLines.length > 5) logLines.shift();
    const box = UI.$('#battleLog');
    box.innerHTML = '';
    logLines.forEach((l, i) => {
      const d = UI.el('div', i < logLines.length - 2 ? 'fade' : '', l);
      box.appendChild(d);
    });
  }

  // ---------------- event playback ----------------
  function playEvents(events, done) {
    animBusy = true;
    let i = 0;
    const step = () => {
      if (i >= events.length) { animBusy = false; done && done(); return; }
      const e = events[i++];
      const delay = handleEvent(e);
      setTimeout(step, ms(delay));
    };
    step();
  }

  function handleEvent(e) {
    switch (e.type) {
      case 'start': return 10;
      case 'roundStart':
        UI.$('#battleRound').textContent = 'Round ' + e.round;
        return 60;
      case 'turnStart':
        // Whose turn it is reads from the highlighted portrait in the turn strip.
        if (e.unit.side === 'enemy') return 220;
        return 10;
      case 'action': {
        const u = e.unit;
        u.lungeT = 1;
        if (e.name && e.name !== 'Attack') log(`${u.name} uses ${e.name}!`);
        else if (e.potion) log(`${u.name} uses ${e.potion.name}.`);
        else log(`${u.name} attacks.`);
        if (e.skill && e.skill.sfx) DJ.sfx(e.skill.sfx);
        else if (!e.potion) DJ.sfx('slash');
        return 260;
      }
      case 'hit': {
        const c = unitCenter(e.target);
        if (e.miss) {
          fx.spawnText('MISS', c.x, c.y, { color: '#c8d8c8', size: 15 });
          DJ.sfx('miss');
          return 220;
        }
        const fxId = e.fx || 'hit';
        fx.spawnFx(fxId, c.x, c.y, { scale: e.target.kind === 'final' ? 1.6 : 1.2 });
        e.target.flashT = 1;
        e.target.flashColor = e.crit ? '#fff2a0' : '#ffffff';
        if (DJ.profile.settings.damageNumbers) {
          fx.spawnText((e.crit ? 'CRIT ' : '') + e.dmg, c.x, c.y - 6, {
            color: e.crit ? '#ffd75e' : (e.target.side === 'hero' ? '#ff8b8b' : '#ffffff'),
            size: e.crit ? 24 : 18, shake: e.crit,
          });
        }
        fx.spawnParticles(c.x, c.y, { count: e.crit ? 14 : 8, color: e.target.side === 'hero' ? '#e05252' : '#ffd27f', speed: e.crit ? 130 : 90 });
        if (e.crit) { DJ.sfx('crit'); shake = 12; UI.flash(); }
        else if (e.sfx) DJ.sfx(e.sfx);
        else DJ.sfx('hit');
        if (e.target.kind === 'final' || e.crit) shake = Math.max(shake, 8);
        else if (DJ.profile.settings.screenShake) shake = Math.max(shake, 4);
        return e.crit ? 420 : 300;
      }
      case 'heal': {
        const c = unitCenter(e.target);
        if (!e.quiet) {
          fx.spawnFx(e.fx || 'heal', c.x, c.y, { scale: 1.1 });
          DJ.sfx('heal');
        }
        if (e.amount > 0 && DJ.profile.settings.damageNumbers) fx.spawnText('+' + e.amount, c.x, c.y - 8, { color: '#8cff9c', size: 17 });
        return e.quiet ? 0 : 320;
      }
      case 'mp': {
        if (e.quiet || !e.amount) return 0;
        const c = unitCenter(e.unit);
        fx.spawnText('+' + e.amount + ' MP', c.x, c.y - 22, { color: '#8fd0ff', size: 13 });
        return 120;
      }
      case 'status': {
        const c = unitCenter(e.target);
        const def = DJ.STATUS[e.status];
        if (!e.applied) { fx.spawnText('resisted', c.x, c.y - 14, { color: '#b8c8b8', size: 12 }); return 140; }
        fx.spawnText(def ? def.name : e.status, c.x, c.y - 16, { color: def ? def.color : '#fff', size: 13 });
        DJ.sfx(def && def.bad ? 'debuff' : 'buff');
        return 200;
      }
      case 'statusEnd': return 0;
      case 'statusTick': {
        const c = unitCenter(e.unit);
        const def = DJ.STATUS[e.status];
        if (e.dmg) {
          e.unit.flashT = 0.7; e.unit.flashColor = def ? def.color : '#fff';
          fx.spawnText('-' + e.dmg, c.x, c.y, { color: def ? def.color : '#fff', size: 15 });
          DJ.sfx(e.status === 'burn' ? 'fire' : e.status === 'poison' ? 'poison' : 'hit');
        } else if (e.heal) {
          fx.spawnText('+' + e.heal, c.x, c.y, { color: '#8cff9c', size: 15 });
        }
        return 240;
      }
      case 'skipStun': {
        const c = unitCenter(e.unit);
        fx.spawnFx('stun', c.x, c.y, { scale: 1 });
        fx.spawnText('STUNNED', c.x, c.y - 14, { color: '#ffe34d', size: 14 });
        log(`${e.unit.name} is stunned!`);
        DJ.sfx('stun');
        return 380;
      }
      case 'death': {
        const c = unitCenter(e.unit);
        fx.spawnParticles(c.x, c.y, { count: 20, color: e.unit.side === 'hero' ? '#7a3030' : '#4a7a52', speed: 120, dur: 0.9 });
        log(e.unit.side === 'hero' ? `${e.unit.name} falls!` : `${e.unit.name} is defeated!`);
        DJ.sfx('death');
        if (e.unit.side === 'enemy') DJ.discoverMonster(e.unit.id, true);
        return 340;
      }
      case 'revive': {
        const c = unitCenter(e.unit);
        fx.spawnFx(e.fx || 'holy_heal', c.x, c.y, { scale: 1.4 });
        fx.spawnText('REVIVED', c.x, c.y - 20, { color: '#ffe9a3', size: 16 });
        log(`${e.unit.name} rises again!`);
        DJ.sfx('revive');
        return 520;
      }
      case 'summon': {
        for (const u of e.units) {
          const c = unitCenter(u);
          fx.spawnFx('summon', c.x, c.y, { scale: 1.4 });
        }
        log('The jungle answers the call!');
        DJ.sfx('summon');
        shake = 10;
        return 620;
      }
      case 'gold': {
        log(`Stole ${e.amount} gold!`);
        DJ.sfx('gold');
        return 200;
      }
      case 'log': log(e.text); return 200;
      case 'victory':
        battleOver = true;
        return 260;
      case 'defeat':
        battleOver = true;
        return 260;
      default: return 0;
    }
  }

  // ---------------- flow ----------------
  B.init = function () {
    canvas = UI.$('#battleCanvas');
    ctx = canvas.getContext('2d');
    fx = new DJ.FxLayer();
    if (!raf) raf = requestAnimationFrame(tick);

    canvas.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left, py = e.clientY - r.top;
      const hit = statusHits.find((h) => px >= h.x && px <= h.x + h.w && py >= h.y && py <= h.y + h.h);
      if (hit) {
        const d = DJ.STATUS[hit.id];
        if (d) UI.showTip(`<b style="color:${d.color}">${d.name}</b><span>${d.desc}</span><i>${hit.turns} turn${hit.turns === 1 ? '' : 's'} remaining</i>`, e.clientX, e.clientY);
      } else UI.hideTip();

      if (!pendingAction || !pendingAction.targets) {
        if (hoverTarget) hoverTarget = null;
        canvas.classList.remove('can-target');
        return;
      }
      hoverTarget = hitTest(e);
      canvas.classList.toggle('can-target', !!hoverTarget);
    });
    canvas.addEventListener('mouseleave', () => UI.hideTip());
    canvas.addEventListener('click', (e) => {
      if (!pendingAction || !pendingAction.targets) return;
      const u = hitTest(e);
      if (u) chooseTarget(u);
      else DJ.sfx('error');
    });
    canvas.addEventListener('contextmenu', (e) => {
      if (!pendingAction) return;
      e.preventDefault();
      cancelTargeting();
    });
    const cancelBtn = UI.$('#targetCancel');
    if (cancelBtn) cancelBtn.addEventListener('click', cancelTargeting);

    // Hotkeys: Q attack, W items, E guard, 1-4 abilities.
    root.addEventListener('keydown', (e) => {
      if (UI.current !== 'battle' || UI.overlayOpen) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (pendingAction) return;            // targeting is mouse-driven
      const btn = hotkeys[k];
      if (!btn || btn.disabled) return;
      e.preventDefault();
      btn.click();
    });
    canvas.addEventListener('touchend', (e) => {
      if (!pendingAction || !pendingAction.targets) return;
      const t = e.changedTouches[0];
      const u = hitTest({ clientX: t.clientX, clientY: t.clientY });
      if (u) chooseTarget(u);
    });
  };

  function hitTest(e) {
    const r = canvas.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    let best = null, bestD = 1e9;
    for (const s of slots.heroes.concat(slots.enemies)) {
      if (!pendingAction.targets.includes(s.u)) continue;
      const spr = DJ.SPRITES[s.u.sprite];
      const sw = (spr ? spr.w : 32) * s.scale, sh = (spr ? spr.h : 32) * s.scale;
      if (px >= s.x - sw / 2 - 6 && px <= s.x + sw / 2 + 6 && py >= s.y - sh - 10 && py <= s.y + 10) {
        const d = Math.abs(px - s.x);
        if (d < bestD) { bestD = d; best = s.u; }
      }
    }
    return best;
  }

  B.start = function (theNode, enemies, done) {
    node = theNode;
    onDone = done;
    battleOver = false;
    logLines = [];
    bgSeed = DJ.seedFromString(theNode.id + DJ.run.seed);
    UI.$('#battleLog').innerHTML = '';
    UI.$('#actionMenu').innerHTML = '';
    UI.$('#turnOrder').innerHTML = '';
    UI.$('#battleRound').textContent = 'Round 1';
    const info = DJ.NODE_INFO[theNode.type];
    UI.$('#battleTitle').textContent =
      theNode.type === 'heart' ? 'THE HEART OF THE JUNGLE'
      : theNode.type === 'boss' ? 'BOSS: ' + (DJ.MONSTER_BY_ID[theNode.boss] || {}).name
      : theNode.type === 'elite' ? 'ELITE ENCOUNTER'
      : 'BATTLE  ·  Lv ' + theNode.level;

    for (const u of DJ.run.party) { u.statuses = []; u.flashT = 0; u.lungeT = 0; }
    for (const e of enemies) { DJ.discoverMonster(e.id, false); DJ.run.discovered[e.id] = true; }

    battle = new DJ.Battle({ party: DJ.run.party, enemies, rng: DJ.run.rng, level: theNode.level, kind: theNode.type });
    fx.clear();
    layoutUnits();
    UI.show('battle');
    if (theNode.type === 'heart' || theNode.type === 'boss') {
      DJ.sfx('roar'); shake = 14;
      DJ.Audio.enterBossMusic();
    }

    playEvents(battle.start(), advance);
  };

  function advance() {
    if (battleOver) { finish(); return; }
    if (battle.over) { finish(); return; }
    const step = battle.next();
    playEvents(step.events, () => {
      if (step.over || battle.over) { finish(); return; }
      if (step.needInput) askAction(step.needInput);
      else setTimeout(advance, ms(120));
    });
  }

  // ---------------- action menu ----------------
  const SKILL_KIND_CLASS = { phys: 'k-phys', mag: 'k-mag', heal: 'k-heal', buff: 'k-buff', debuff: 'k-debuff', drain: 'k-drain', revive: 'k-revive', summon: 'k-mag' };

  function askAction(u) {
    waitingFor = u;
    pendingAction = null;
    selectedTarget = null;
    hoverTarget = null;
    showTargetPrompt(false);
    refreshPartyStrip();
    refreshTurnOrder();

    const menu = UI.$('#actionMenu');
    menu.innerHTML = '';
    hotkeys = {};

    // Left rail: Attack (always available) plus the two utility actions.
    const rail = UI.el('div', 'act-primary');
    rail.appendChild(bindKey('q', attackBtn(u)));
    const potCount = Object.values(DJ.run.inventory).reduce((a, n) => a + (n > 0 ? 1 : 0), 0);
    rail.appendChild(bindKey('w', utilBtn('act-item', 'potion_red', 'Items',
      potCount ? potCount + (potCount > 1 ? ' kinds' : ' kind') : 'empty', !potCount, openItemMenu,
      'Open your potions and use one on the party.')));
    rail.appendChild(bindKey('e', utilBtn('act-defend', 'status_guard', 'Guard', 'Raise DEF, Regain MP', false,
      () => submit({ type: 'defend' }),
      'Guard: raises this hero\u2019s DEF by 50% for 2 turns and restores a little MP.')));
    menu.appendChild(rail);

    // Right: four fixed skill slots. Locked ones stay as empty placeholders so the
    // grid never resizes as a hero learns more.
    const skills = UI.el('div', 'act-skills');
    const hero = DJ.HERO_BY_ID[u.id];
    const all = hero ? hero.skills : u.skills;
    for (let i = 0; i < 4; i++) {
      const sid = all[i];
      const lv = DJ.SKILL_UNLOCK_LEVELS[i];
      const known = sid && u.level >= lv;
      if (!known) {
        const slot = UI.el('div', 'act-slot-empty');
        slot.appendChild(UI.el('div', 'slot-lock', sid ? 'Unlocks at level ' + lv : '\u2014'));
        skills.appendChild(slot);
        continue;
      }
      const sk = DJ.SKILLS[sid];
      const usable = (sk.mp || 0) <= u.mp && battle.canUseSkill(u, sk);
      const b = UI.el('button', 'act-btn act-skill ' + (SKILL_KIND_CLASS[sk.kind] || 'k-phys'));
      b.type = 'button';
      const n = UI.el('div', 'a-name');
      n.appendChild(UI.el('span', null, sk.name));
      const meta = UI.el('div', 'a-meta');
      if (sk.mp) meta.appendChild(UI.el('span', 'a-cost', sk.mp + ' MP'));
      const scaling = DJ.skillScaling(sk, u);
      if (scaling) {
        const tag = UI.el('span', 'a-scale ' + (scaling === 'MAG' ? 'sc-mag' : 'sc-phys'), scaling);
        UI.tip(tag, scaling === 'MAG'
          ? '<b>Scales with MAG</b><span>This ability\u2019s numbers come from Magic.</span>'
          : '<b>Scales with ATK</b><span>This ability\u2019s numbers come from Attack.</span>');
        meta.appendChild(tag);
      }
      n.appendChild(meta);
      b.appendChild(n);
      b.appendChild(UI.el('div', 'a-desc', sk.desc));
      b.disabled = !usable;
      b.title = usable ? sk.desc : ((sk.mp || 0) > u.mp ? 'Not enough MP' : 'No valid target');
      b.addEventListener('click', () => { DJ.sfx('click'); beginAction({ type: 'skill', skillId: sid }, sk.target); });
      skills.appendChild(bindKey(String(i + 1), b));
    }
    menu.appendChild(skills);
  }

  // Each action carries the key that triggers it, printed small in its corner.
  let hotkeys = {};
  function bindKey(key, btn) {
    const tag = UI.el('span', 'hotkey', key.toUpperCase());
    btn.appendChild(tag);
    hotkeys[key] = btn;
    return btn;
  }

  function attackBtn(u) {
    const b = UI.el('button', 'act-btn act-attack');
    b.type = 'button';
    const weapon = u.equip && u.equip.weapon ? u.equip.weapon.icon : 'item_sword';
    if (DJ.SPRITES[weapon]) b.appendChild(UI.spriteEl(weapon, 2, 'attack'));
    const label = UI.el('div', 'a-name', 'Attack');
    b.appendChild(label);
    b.title = 'A basic weapon strike. Always available and costs no MP.';
    b.addEventListener('click', () => { DJ.sfx('click'); beginAction({ type: 'attack' }, 'enemy'); });
    return b;
  }

  function utilBtn(cls, icon, name, desc, disabled, fn, tip) {
    const b = UI.el('button', 'act-btn act-util ' + cls);
    b.type = 'button';
    if (tip) b.title = tip;
    if (DJ.SPRITES[icon]) b.appendChild(UI.spriteEl(icon, 1.4, name));
    const t = UI.el('div');
    t.style.minWidth = '0';
    t.appendChild(UI.el('div', null, name));
    if (desc) { const d = UI.el('div', 'a-desc', desc); d.style.marginTop = '0'; t.appendChild(d); }
    b.appendChild(t);
    b.disabled = !!disabled;
    b.addEventListener('click', () => { DJ.sfx('click'); fn(); });
    return b;
  }

  // Targeting happens on the battlefield, never in the menu: the prompt replaces the
  // action list so the only way forward is to click a creature.
  function showTargetPrompt(on, label) {
    const hint = UI.$('#targetHint');
    const menu = UI.$('#actionMenu');
    if (!hint || !menu) return;
    hint.classList.toggle('hidden', !on);
    menu.classList.toggle('hidden', !!on);
    if (on) { const big = hint.querySelector('.th-big'); if (big) big.textContent = label || 'Choose a target'; }
    document.body.classList.toggle('targeting', !!on);
  }

  function beginAction(action, targetKind) {
    const needsPick = ['enemy', 'ally', 'deadAlly'].includes(targetKind);
    if (!needsPick) { submit(action); return; }
    let targets;
    if (targetKind === 'enemy') targets = battle.alive('enemy');
    else if (targetKind === 'ally') targets = battle.alive('hero');
    else targets = battle.party.filter((x) => !x.alive);
    if (!targets.length) { DJ.sfx('error'); return; }
    if (targets.length === 1) { action.target = targets[0]; submit(action); return; }
    pendingAction = { action, targets };
    const label = targetKind === 'enemy' ? 'Choose a target'
      : targetKind === 'deadAlly' ? 'Choose a fallen ally' : 'Choose an ally';
    showTargetPrompt(true, label);
  }

  function cancelTargeting() {
    if (!pendingAction) return;
    pendingAction = null;
    hoverTarget = null;
    showTargetPrompt(false);
    DJ.sfx('cancel');
    if (waitingFor) askAction(waitingFor);
  }
  B.cancelTargeting = cancelTargeting;
  B.isTargeting = () => !!pendingAction;

  function chooseTarget(t) {
    if (!pendingAction) return;
    const a = pendingAction.action;
    a.target = t;
    pendingAction = null;
    hoverTarget = null;
    showTargetPrompt(false);
    DJ.sfx('confirm');
    submit(a);
  }

  // ---------------- item modal ----------------
  function openItemMenu() {
    const u = waitingFor;
    const inv = DJ.run.inventory;
    UI.openOverlay((panel, close) => {
      UI.overlayHeader(panel, 'Use an item', close);
      const have = Object.keys(DJ.POTIONS).filter((pid) => (inv[pid] || 0) > 0 && !DJ.POTIONS[pid].effect.levelUp);
      if (!have.length) {
        panel.appendChild(UI.el('p', 'empty-note', 'Your bag is empty. Merchants sell potions, and monsters drop them.'));
        return;
      }
      const grid = UI.el('div', 'item-grid');
      for (const pid of have) {
        const p = DJ.POTIONS[pid];
        const card = UI.el('button', 'item-card');
        card.type = 'button';
        const top = UI.el('div', 'ic-top');
        top.appendChild(UI.spriteEl(p.icon, 3, p.name));
        top.appendChild(UI.el('span', 'ic-count', '\u00d7' + inv[pid]));
        card.appendChild(top);
        card.appendChild(UI.el('div', 'ic-name', p.name));
        card.appendChild(UI.el('div', 'ic-desc', p.desc));
        card.addEventListener('click', () => {
          DJ.sfx('confirm');
          UI.closeOverlay(true);
          const e = p.effect;
          if (e.party) { submit({ type: 'item', potion: pid, inventory: inv }); return; }
          const targets = e.revive != null ? battle.party.filter((x) => !x.alive) : battle.alive('hero');
          if (!targets.length) { DJ.sfx('error'); askAction(u); return; }
          if (targets.length === 1) { submit({ type: 'item', potion: pid, target: targets[0], inventory: inv }); return; }
          pendingAction = { action: { type: 'item', potion: pid, inventory: inv }, targets };
          showTargetPrompt(true, e.revive != null ? 'Choose a fallen ally' : 'Choose an ally');
        });
        grid.appendChild(card);
      }
      panel.appendChild(grid);
    }, () => { if (waitingFor && !pendingAction) askAction(waitingFor); });
  }

  // ---------------- turn order strip ----------------
  function refreshTurnOrder() {
    const box = UI.$('#turnOrder');
    if (!box || !battle) return;
    box.innerHTML = '';
    const order = battle.upcomingOrder(10);
    if (!order.length) return;
    for (const entry of order) {
      const u = entry.unit;
      const slot = UI.el('div', 'to-slot' + (u.side === 'enemy' ? ' enemy' : '') + (entry.current ? ' now' : '') + (u.alive ? '' : ' dead'));
      slot.title = u.name + '  ' + u.hp + '/' + u.maxHp + ' HP';
      const sc = u.size >= 64 ? 0.5 : u.size >= 48 ? 0.66 : u.size >= 40 ? 0.8 : 1;
      slot.appendChild(UI.spriteEl(u.sprite, sc, u.name));
      const hp = UI.el('div', 'to-hp');
      const fill = UI.el('i');
      fill.style.width = DJ.clamp(u.hp / u.maxHp, 0, 1) * 100 + '%';
      hp.appendChild(fill);
      slot.appendChild(hp);
      box.appendChild(slot);
    }
  }

  function submit(action) {
    const u = waitingFor;
    waitingFor = null;
    pendingAction = null;
    showTargetPrompt(false);
    UI.$('#actionMenu').innerHTML = '';
    const events = battle.act(u, action);
    battle.checkEnd();
    playEvents(events, () => {
      if (battle.over) {
        // surface the terminal victory/defeat event
        const tail = battle.result === 'victory' ? [{ type: 'victory' }] : [{ type: 'defeat' }];
        playEvents(tail, finish);
        return;
      }
      setTimeout(advance, ms(140));
    });
  }

  function finish() {
    if (B._finished) return;
    B._finished = true;
    const won = battle.result === 'victory';
    UI.$('#actionMenu').innerHTML = '';
    UI.$('#turnOrder').innerHTML = '';
    showTargetPrompt(false);
    waitingFor = null;
    if (node && (node.type === 'boss' || node.type === 'heart')) DJ.Audio.exitBossMusic();
    setTimeout(() => {
      DJ.sfx(won ? 'victory' : 'defeat');
      const b = battle;
      B._finished = false;
      battle = null;
      onDone && onDone(won, b);
    }, ms(700));
  }

  B.activeBattle = () => battle;
})(typeof window !== 'undefined' ? window : globalThis);
