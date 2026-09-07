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
    slots.heroes = heroes.map((u, i) => ({
      u,
      x: w * 0.20 - i * (w * 0.055),
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
    if (isTargetable) {
      ctx.save();
      const on = hoverTarget === u || selectedTarget === u;
      ctx.strokeStyle = on ? '#ffe9a3' : 'rgba(232,198,90,.65)';
      ctx.lineWidth = on ? 3 : 2;
      ctx.setLineDash([5, 4]);
      ctx.lineDashOffset = -lastT * 0.02;
      ctx.beginPath(); ctx.ellipse(s.x, s.y + 2, sw * 0.42, sw * 0.16, 0, 0, 6.284); ctx.stroke();
      ctx.restore();
    }
    // active-turn marker
    if (waitingFor === u) {
      ctx.save();
      ctx.fillStyle = '#8fe08a';
      const ay = s.y - sh - 16 + Math.sin(lastT * 0.005) * 3;
      ctx.beginPath(); ctx.moveTo(s.x, ay + 9); ctx.lineTo(s.x - 7, ay); ctx.lineTo(s.x + 7, ay); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    const ok = DJ.drawSprite(ctx, u.sprite, s.x + lunge, s.y + bob, s.scale, {
      center: true, alpha,
      flip: u.side === 'enemy' ? false : false,
      flash: u.flashT ? Math.min(1, u.flashT * 3) : 0,
      flashColor: u.flashColor || '#ffffff',
    });
    if (!ok) DJ.drawMissing(ctx, s.x - sw / 2, s.y - sh, sw, sh, u.name);

    if (!dead) drawUnitBars(s, u, sw, sh, s.labelRow || 0);
  }

  function drawUnitBars(s, u, sw, sh, idx) {
    const top = s.y - sh - 20 - (idx % 3) * 15;
    const bw = Math.max(46, sw * 0.9);
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

    // statuses
    if (u.statuses.length) {
      let ix = x;
      const iy = top + 8;
      for (const st of u.statuses.slice(0, 6)) {
        const def = DJ.STATUS[st.id];
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
      if (++stripTick % 6 === 0) refreshPartyStrip();
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
          dot.title = d ? d.name : x.id;
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
        if (e.unit.side === 'enemy') { UI.$('#turnBanner').textContent = e.unit.name + '’s turn'; return 220; }
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
      if (!pendingAction || !pendingAction.targets) { hoverTarget = null; return; }
      hoverTarget = hitTest(e);
    });
    canvas.addEventListener('click', (e) => {
      if (!pendingAction || !pendingAction.targets) return;
      const u = hitTest(e);
      if (u) chooseTarget(u);
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
    UI.$('#turnBanner').textContent = '';
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
    if (theNode.type === 'heart' || theNode.type === 'boss') { DJ.sfx('roar'); shake = 14; }

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
  function askAction(u) {
    waitingFor = u;
    pendingAction = null;
    selectedTarget = null;
    UI.$('#turnBanner').textContent = `${u.name} — HP ${u.hp}/${u.maxHp}${u.maxMp ? `  ·  MP ${u.mp}/${u.maxMp}` : ''}`;
    UI.$('#targetHint').classList.add('hidden');
    refreshPartyStrip();
    const menu = UI.$('#actionMenu');
    menu.innerHTML = '';

    menu.appendChild(actBtn('Attack', 'Basic strike. No MP.', false, () => beginAction({ type: 'attack' }, 'enemy')));
    for (const sid of u.skills) {
      const sk = DJ.SKILLS[sid];
      if (!sk) continue;
      const affordable = (sk.mp || 0) <= u.mp;
      const usable = affordable && battle.canUseSkill(u, sk);
      menu.appendChild(actBtn(sk.name, sk.desc, !usable, () => beginAction({ type: 'skill', skillId: sid }, sk.target), sk.mp));
    }
    const potCount = Object.entries(DJ.run.inventory).filter(([, n]) => n > 0).length;
    menu.appendChild(actBtn('Item', potCount ? `${potCount} kind${potCount > 1 ? 's' : ''} of potion` : 'No potions', !potCount, openItemMenu));
    menu.appendChild(actBtn('Defend', 'Raise guard and recover MP.', false, () => submit({ type: 'defend' })));
    menu.appendChild(actBtn('Auto', 'Let this hero decide.', false, () => {
      const a = battle.heroAutoAction(u, DJ.run.inventory);
      submit(a);
    }));
  }

  function actBtn(name, desc, disabled, fn, mp) {
    const b = UI.el('button', 'act-btn');
    b.type = 'button';
    const n = UI.el('div', 'a-name');
    n.appendChild(UI.el('span', null, name));
    if (mp) n.appendChild(UI.el('span', 'a-cost', mp + ' MP'));
    b.appendChild(n);
    b.appendChild(UI.el('div', 'a-desc', desc));
    b.disabled = !!disabled;
    b.addEventListener('click', () => { DJ.sfx('click'); fn(); });
    return b;
  }

  function beginAction(action, targetKind) {
    const u = waitingFor;
    const needsPick = ['enemy', 'ally', 'deadAlly'].includes(targetKind);
    if (!needsPick) { submit(action); return; }
    let targets;
    if (targetKind === 'enemy') targets = battle.alive('enemy');
    else if (targetKind === 'ally') targets = battle.alive('hero');
    else targets = battle.party.filter((x) => !x.alive);
    if (!targets.length) { DJ.sfx('error'); return; }
    if (targets.length === 1) { action.target = targets[0]; submit(action); return; }
    pendingAction = { action, targets };
    UI.$('#targetHint').classList.remove('hidden');
    const menu = UI.$('#actionMenu');
    menu.innerHTML = '';
    for (const t of targets) {
      const b = UI.el('button', 'act-btn');
      b.type = 'button';
      const n = UI.el('div', 'a-name');
      n.appendChild(UI.el('span', null, t.name));
      n.appendChild(UI.el('span', 'a-cost', `${t.hp}/${t.maxHp}`));
      b.appendChild(n);
      if (t.statuses.length) b.appendChild(UI.el('div', 'a-desc', t.statuses.map((s) => (DJ.STATUS[s.id] || {}).name || s.id).join(', ')));
      b.addEventListener('mouseenter', () => { hoverTarget = t; });
      b.addEventListener('mouseleave', () => { hoverTarget = null; });
      b.addEventListener('click', () => chooseTarget(t));
      menu.appendChild(b);
    }
    const cancel = UI.el('button', 'act-btn');
    cancel.type = 'button';
    cancel.appendChild(UI.el('div', 'a-name', 'Back'));
    cancel.addEventListener('click', () => { DJ.sfx('cancel'); pendingAction = null; askAction(waitingFor); });
    menu.appendChild(cancel);
  }

  function chooseTarget(t) {
    if (!pendingAction) return;
    const a = pendingAction.action;
    a.target = t;
    pendingAction = null;
    hoverTarget = null;
    UI.$('#targetHint').classList.add('hidden');
    DJ.sfx('confirm');
    submit(a);
  }

  function openItemMenu() {
    const u = waitingFor;
    const menu = UI.$('#actionMenu');
    menu.innerHTML = '';
    const inv = DJ.run.inventory;
    let any = false;
    for (const pid of Object.keys(DJ.POTIONS)) {
      const n = inv[pid] || 0;
      if (n <= 0) continue;
      any = true;
      const p = DJ.POTIONS[pid];
      menu.appendChild(actBtn(`${p.name} ×${n}`, p.desc, false, () => {
        const e = p.effect;
        if (e.party) { submit({ type: 'item', potion: pid, inventory: inv }); return; }
        const targets = e.revive != null ? battle.party.filter((x) => !x.alive) : battle.alive('hero');
        if (!targets.length) { DJ.sfx('error'); return; }
        if (targets.length === 1) { submit({ type: 'item', potion: pid, target: targets[0], inventory: inv }); return; }
        pendingAction = { action: { type: 'item', potion: pid, inventory: inv }, targets };
        beginItemTarget(targets, pid);
      }));
    }
    if (!any) menu.appendChild(actBtn('No potions', 'Your bag is empty.', true, () => {}));
    const back = UI.el('button', 'act-btn');
    back.type = 'button';
    back.appendChild(UI.el('div', 'a-name', 'Back'));
    back.addEventListener('click', () => { DJ.sfx('cancel'); askAction(u); });
    menu.appendChild(back);
  }

  function beginItemTarget(targets, pid) {
    const menu = UI.$('#actionMenu');
    menu.innerHTML = '';
    UI.$('#targetHint').classList.remove('hidden');
    for (const t of targets) {
      const b = UI.el('button', 'act-btn');
      b.type = 'button';
      const n = UI.el('div', 'a-name');
      n.appendChild(UI.el('span', null, t.name));
      n.appendChild(UI.el('span', 'a-cost', `${t.hp}/${t.maxHp}`));
      b.appendChild(n);
      b.addEventListener('click', () => chooseTarget(t));
      menu.appendChild(b);
    }
    const back = UI.el('button', 'act-btn');
    back.type = 'button';
    back.appendChild(UI.el('div', 'a-name', 'Back'));
    back.addEventListener('click', () => { DJ.sfx('cancel'); pendingAction = null; openItemMenu(); });
    menu.appendChild(back);
  }

  function submit(action) {
    const u = waitingFor;
    waitingFor = null;
    pendingAction = null;
    UI.$('#actionMenu').innerHTML = '';
    UI.$('#targetHint').classList.add('hidden');
    UI.$('#turnBanner').textContent = '';
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
    UI.$('#turnBanner').textContent = '';
    waitingFor = null;
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
