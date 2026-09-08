/* Deep Jungle — the branching map: pan/zoom canvas, clickable nodes, path preview. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const M = (UI.Map = {});

  const COL_W = 132;
  const ROW_H = 96;
  const PAD_X = 90;
  const NODE_R = 26;

  let canvas, ctx, raf = 0, t = 0;
  let camX = 0, targetCamX = 0;
  let hover = null, dragging = false, dragStartX = 0, dragCamX = 0, dragMoved = 0;
  let layout = null, seedRng = null, frozen = false;

  function computeLayout() {
    const run = DJ.run;
    if (!run) return null;
    const cols = run.map.cols;
    const nodes = [];
    const rng = new DJ.RNG(DJ.seedFromString('layout' + run.seed));
    cols.forEach((col, ci) => {
      col.forEach((nd, ri) => {
        const spread = (col.length - 1) / 2;
        const jitter = col.length > 1 ? rng.range(-9, 9) : 0;
        nodes.push({
          nd,
          x: PAD_X + ci * COL_W,
          y: (ri - spread) * ROW_H + jitter,
        });
      });
    });
    const byId = {};
    nodes.forEach((n) => (byId[n.nd.id] = n));
    // Decorative background props. Only ids that actually exist are used, so the extra
    // scenery set can land without this needing to know about it.
    const DECO = ['deco_tree', 'deco_fern', 'deco_rock', 'deco_mushroom', 'deco_flower', 'deco_totem', 'deco_vine',
      'deco_palm', 'deco_bush', 'deco_log', 'deco_stump', 'deco_boulder', 'deco_lilypad', 'deco_reeds',
      'deco_orchid', 'deco_bones', 'deco_ruin', 'deco_campfire', 'deco_mushroom_cluster', 'deco_hangvine',
      'deco_fern_big'].filter((id) => DJ.SPRITES[id]);
    const props = [];
    // Two bands: a dim far layer behind the paths and a slightly bolder near layer.
    for (let i = 0; i < cols.length * 7; i++) {
      const far = rng.chance(0.55);
      props.push({
        x: rng.range(-60, cols.length * COL_W + PAD_X * 2),
        y: rng.range(-340, 340),
        kind: DECO.length ? rng.pick(DECO) : 'deco_rock',
        s: far ? rng.range(0.6, 1.0) : rng.range(1.0, 1.7),
        a: far ? rng.range(0.07, 0.15) : rng.range(0.14, 0.30),
      });
    }
    // Draw the faint ones first so the bolder props sit in front.
    props.sort((a, b) => a.a - b.a);
    return { nodes, byId, width: cols.length * COL_W + PAD_X * 2, props };
  }

  function nodeAt(px, py) {
    if (!layout) return null;
    const r = canvas.getBoundingClientRect();
    const wx = px + camX;
    const wy = py - r.height / 2;
    for (const n of layout.nodes) {
      const dx = wx - n.x, dy = wy - n.y;
      if (dx * dx + dy * dy < (NODE_R + 8) * (NODE_R + 8)) return n;
    }
    return null;
  }

  function centerOnCurrent(instant) {
    const run = DJ.run;
    if (!run || !layout) return;
    const cur = layout.byId[run.currentId];
    if (!cur) return;
    const r = canvas.getBoundingClientRect();
    targetCamX = DJ.clamp(cur.x - r.width * 0.34, 0, Math.max(0, layout.width - r.width));
    if (instant) camX = targetCamX;
  }

  function draw() {
    const run = DJ.run;
    if (!run) return;
    const size = UI.fitCanvas(canvas);
    const { w, h, dpr } = size;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    camX += (targetCamX - camX) * 0.18;

    const regionIdx = DJ.regionOfCol(run.node().col);
    const region = DJ.REGIONS[regionIdx];

    // background gradient tinted by region
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#06110b');
    g.addColorStop(0.5, region.bg);
    g.addColorStop(1, '#050d08');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(-camX, h / 2);

    // decorative props
    for (const p of layout.props) {
      ctx.save();
      ctx.globalAlpha = p.a;
      const okay = DJ.drawSprite(ctx, p.kind, p.x, p.y, Math.round(p.s * 2), { center: true });
      if (!okay) { ctx.fillStyle = '#1b3a24'; ctx.fillRect(p.x - 8, p.y - 20, 16, 20); }
      ctx.restore();
    }

    // region banners
    let colAcc = 1;
    for (let ri = 0; ri < 3; ri++) {
      const n = (ri === 0 ? 12 : ri === 1 ? 13 : 12);
      const x0 = PAD_X + (colAcc - 0.5) * COL_W;
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = DJ.REGIONS[ri].color;
      ctx.lineWidth = 2; ctx.setLineDash([6, 8]);
      ctx.beginPath(); ctx.moveTo(x0, -h / 2); ctx.lineTo(x0, h / 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = DJ.REGIONS[ri].color;
      ctx.font = 'bold 12px "Trebuchet MS", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(DJ.REGIONS[ri].name.toUpperCase(), x0 + 8, -h / 2 + 22);
      ctx.restore();
      colAcc += n;
    }

    // ---- edges ----
    for (const n of layout.nodes) {
      for (const nid of n.nd.next) {
        const m = layout.byId[nid];
        if (!m) continue;
        const onPath = run.visited[n.nd.id] && run.visited[nid];
        const isChoice = n.nd.id === run.currentId && run.available.includes(nid);
        const reachable = run.visited[n.nd.id];
        ctx.save();
        ctx.lineWidth = isChoice ? 3.5 : onPath ? 3 : 2;
        if (isChoice) {
          ctx.strokeStyle = '#e8c65a';
          ctx.shadowColor = 'rgba(232,198,90,.6)'; ctx.shadowBlur = 10;
        } else if (onPath) ctx.strokeStyle = '#5fbf5a';
        else if (reachable) ctx.strokeStyle = 'rgba(140,180,145,.45)';
        else ctx.strokeStyle = 'rgba(90,120,95,.26)';
        // vine-like curve
        const mx = (n.x + m.x) / 2;
        ctx.beginPath();
        ctx.moveTo(n.x + NODE_R - 4, n.y);
        ctx.bezierCurveTo(mx, n.y, mx, m.y, m.x - NODE_R + 4, m.y);
        ctx.stroke();
        // little leaves along the path
        if (onPath || isChoice) {
          ctx.fillStyle = isChoice ? '#ffe9a3' : '#8fe08a';
          for (let k = 0.3; k < 0.9; k += 0.3) {
            const bx = bez(n.x + NODE_R, mx, mx, m.x - NODE_R, k);
            const by = bez(n.y, n.y, m.y, m.y, k);
            ctx.fillRect(Math.round(bx) - 1.5, Math.round(by) - 1.5, 3, 3);
          }
        }
        ctx.restore();
      }
    }

    // ---- nodes ----
    for (const n of layout.nodes) {
      const nd = n.nd;
      const info = DJ.NODE_INFO[nd.type];
      const visited = run.visited[nd.id];
      const isCurrent = nd.id === run.currentId;
      const selectable = run.available.includes(nd.id);
      const known = visited || selectable || nd.prev.some((p) => run.visited[p]) || nd.type === 'heart' || nd.type === 'boss';
      // Campfires and trading posts show from anywhere, greyed out until you arrive.
      // Everything else stays a question mark: the point of the map is choosing a route
      // toward the supplies you need, which you cannot do if you cannot see them.
      const landmark = !known && (nd.type === 'rest' || nd.type === 'merchant');
      const isHover = hover === n && selectable;
      const r = nd.type === 'heart' ? NODE_R + 10 : nd.type === 'boss' ? NODE_R + 5 : NODE_R;
      const pulse = selectable ? 1 + Math.sin(t * 3.4) * 0.055 : 1;

      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.scale(pulse, pulse);

      // glow ring
      if (selectable || isCurrent) {
        ctx.save();
        ctx.shadowColor = isCurrent ? 'rgba(95,191,90,.85)' : 'rgba(232,198,90,.8)';
        ctx.shadowBlur = isHover ? 26 : 16;
        ctx.fillStyle = isCurrent ? 'rgba(95,191,90,.2)' : 'rgba(232,198,90,.16)';
        ctx.beginPath(); ctx.arc(0, 0, r + 6, 0, 6.284); ctx.fill();
        ctx.restore();
      }

      // disc
      ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.284);
      const grd = ctx.createLinearGradient(0, -r, 0, r);
      if (!known) { grd.addColorStop(0, '#152a1b'); grd.addColorStop(1, '#0c1a11'); }
      else if (visited && !isCurrent) { grd.addColorStop(0, '#1c3a24'); grd.addColorStop(1, '#122417'); }
      else { grd.addColorStop(0, '#20422a'); grd.addColorStop(1, '#15291b'); }
      ctx.fillStyle = grd; ctx.fill();
      ctx.lineWidth = isCurrent ? 3 : selectable ? 2.6 : 2;
      ctx.strokeStyle = isCurrent ? '#8fe08a' : selectable ? '#e8c65a' : known ? (info ? info.color : '#4a7a52') : landmark ? '#3d6146' : '#24402c';
      ctx.stroke();

      // icon
      if (landmark) {
        // The real icon, dimmed, so it reads as somewhere you have not been yet.
        const iconId = info ? info.icon : 'node_rest';
        ctx.save();
        ctx.globalAlpha = 0.38;
        const s = 1.6;
        const drew = DJ.drawSprite(ctx, iconId, 0, (DJ.SPRITES[iconId] ? DJ.SPRITES[iconId].h * s / 2 : 12), s, { center: true });
        ctx.restore();
        if (!drew) {
          ctx.fillStyle = '#4a7a52';
          ctx.font = 'bold 15px "Trebuchet MS", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText((info ? info.name : '?').slice(0, 2).toUpperCase(), 0, 0);
        }
      } else if (known) {
        const iconId = info ? info.icon : 'node_battle';
        const s = nd.type === 'heart' ? 2 : 1.6;
        const drew = DJ.drawSprite(ctx, iconId, 0, 0 + (DJ.SPRITES[iconId] ? DJ.SPRITES[iconId].h * s / 2 : 12), s, { center: true });
        if (!drew) {
          ctx.fillStyle = info ? info.color : '#8fe08a';
          ctx.font = 'bold 15px "Trebuchet MS", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText((info ? info.name : '?').slice(0, 2).toUpperCase(), 0, 0);
        }
      } else {
        ctx.fillStyle = '#33553b';
        ctx.font = 'bold 18px "Trebuchet MS", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('?', 0, 1);
      }

      // completed tick
      if (visited && !isCurrent) {
        ctx.fillStyle = 'rgba(6,14,9,.55)';
        ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.284); ctx.fill();
        ctx.strokeStyle = '#8fe08a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(-2, 6); ctx.lineTo(8, -7); ctx.stroke();
      }
      ctx.restore();

      // labels
      if (known && (selectable || isCurrent || nd.type === 'heart' || nd.type === 'boss')) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = 'bold 11.5px "Trebuchet MS", sans-serif';
        ctx.fillStyle = selectable ? '#ffe9a3' : '#b6ccb8';
        ctx.strokeStyle = 'rgba(4,10,6,.9)'; ctx.lineWidth = 3;
        const label = info ? info.name : nd.type;
        ctx.strokeText(label, n.x, n.y + r + 15);
        ctx.fillText(label, n.x, n.y + r + 15);
        if (nd.type !== 'start' && nd.type !== 'rest' && nd.type !== 'merchant') {
          ctx.font = '10.5px "Trebuchet MS", sans-serif';
          ctx.fillStyle = '#8aa48d';
          const lv = 'Lv ' + nd.level;
          ctx.strokeText(lv, n.x, n.y + r + 28);
          ctx.fillText(lv, n.x, n.y + r + 28);
        }
        ctx.restore();
      }
    }
    ctx.restore();

    // edge fades
    const lf = ctx.createLinearGradient(0, 0, 46, 0);
    lf.addColorStop(0, 'rgba(5,13,8,.9)'); lf.addColorStop(1, 'rgba(5,13,8,0)');
    ctx.fillStyle = lf; ctx.fillRect(0, 0, 46, h);
    const rf = ctx.createLinearGradient(w - 46, 0, w, 0);
    rf.addColorStop(0, 'rgba(5,13,8,0)'); rf.addColorStop(1, 'rgba(5,13,8,.9)');
    ctx.fillStyle = rf; ctx.fillRect(w - 46, 0, 46, h);
  }

  function bez(a, b, c, d, t) {
    const mt = 1 - t;
    return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;
  }

  function loop(now) {
    t = now / 1000;
    if (UI.current === 'map' && DJ.run && !frozen) draw();
    raf = requestAnimationFrame(loop);
  }

  M.init = function () {
    canvas = UI.$('#mapCanvas');
    ctx = canvas.getContext('2d');

    canvas.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      if (dragging) {
        const dx = e.clientX - dragStartX;
        dragMoved = Math.max(dragMoved, Math.abs(dx));
        targetCamX = camX = DJ.clamp(dragCamX - dx, 0, Math.max(0, layout.width - r.width));
        return;
      }
      const prev = hover;
      hover = nodeAt(e.clientX - r.left, e.clientY - r.top);
      const reachable = !!hover && DJ.run.available.includes(hover.nd.id);
      canvas.classList.toggle('over-node', reachable);
      if (hover !== prev && reachable) DJ.sfx('hover');
    });
    canvas.addEventListener('mousedown', (e) => {
      dragging = true; dragMoved = 0;
      dragStartX = e.clientX; dragCamX = camX;
      canvas.classList.add('dragging');
    });
    root.addEventListener('mouseup', () => { dragging = false; canvas.classList.remove('dragging'); });
    canvas.addEventListener('mouseleave', () => { hover = null; canvas.classList.remove('over-node'); });
    canvas.addEventListener('click', (e) => {
      if (dragMoved > 6) return;
      const r = canvas.getBoundingClientRect();
      const n = nodeAt(e.clientX - r.left, e.clientY - r.top);
      if (n && DJ.run.available.includes(n.nd.id)) M.enter(n.nd.id);
      else if (n) DJ.sfx('error');
    });
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      targetCamX = DJ.clamp(targetCamX + (e.deltaY !== 0 ? e.deltaY : e.deltaX) * 0.8, 0, Math.max(0, layout.width - r.width));
    }, { passive: false });

    // touch
    let touchX = 0, touchCam = 0, touchMoved = 0;
    canvas.addEventListener('touchstart', (e) => {
      touchX = e.touches[0].clientX; touchCam = camX; touchMoved = 0;
    }, { passive: true });
    canvas.addEventListener('touchmove', (e) => {
      const r = canvas.getBoundingClientRect();
      const dx = e.touches[0].clientX - touchX;
      touchMoved = Math.max(touchMoved, Math.abs(dx));
      targetCamX = camX = DJ.clamp(touchCam - dx, 0, Math.max(0, layout.width - r.width));
    }, { passive: true });
    canvas.addEventListener('touchend', (e) => {
      if (touchMoved > 8) return;
      const r = canvas.getBoundingClientRect();
      const tch = e.changedTouches[0];
      const n = nodeAt(tch.clientX - r.left, tch.clientY - r.top);
      if (n && DJ.run.available.includes(n.nd.id)) M.enter(n.nd.id);
    });

    root.addEventListener('resize', () => { if (layout) centerOnCurrent(); });
    if (!raf) raf = requestAnimationFrame(loop);
  };

  M.open = function (instant) {
    frozen = false;
    layout = computeLayout();
    centerOnCurrent(instant !== false);
    M.refresh();
    UI.show('map');
  };

  M.refresh = function () {
    const run = DJ.run;
    if (!run) return;
    if (!layout) layout = computeLayout();
    const regionIdx = DJ.regionOfCol(run.node().col);
    UI.$('#mapRegion').textContent = DJ.REGIONS[regionIdx].name;
    UI.$('#mapGold').textContent = run.gold;
    const pct = Math.round((run.node().col / (run.map.totalCols - 1)) * 100);
    UI.$('#mapProgress').textContent = pct + '%';
    UI.$('#mapHint').textContent = run.available.length
      ? (run.available.length === 1 ? 'One way forward' : 'Choose your path')
      : 'The path ends here';
    const bar = UI.$('#partyBar');
    bar.innerHTML = '';
    const list = UI.el('div', 'pb-list');
    run.party.forEach((h) => {
      const b = UI.heroBadge(h, 1.5);
      b.addEventListener('click', () => UI.Panels.heroPanel(h));
      list.appendChild(b);
    });
    bar.appendChild(list);

    const actions = UI.el('div', 'map-actions');
    const mk = (icon, label, badge, fn) => {
      const b = UI.el('button', 'map-btn');
      b.type = 'button';
      if (DJ.SPRITES[icon]) b.appendChild(UI.spriteEl(icon, 1.3, label));
      b.appendChild(UI.el('span', null, label));
      if (badge) b.appendChild(UI.el('span', 'mb-badge', String(badge)));
      b.addEventListener('click', () => { DJ.sfx('click'); fn(); });
      return b;
    };
    const carrying = Object.values(run.inventory).reduce((a, n) => a + n, 0) + run.stash.length;
    actions.appendChild(mk('icon_bag', 'Bag', carrying, () => UI.Panels.bag()));
    actions.appendChild(mk('icon_party', 'Party', 0, () => UI.Panels.party(() => M.refresh())));
    bar.appendChild(actions);
    centerOnCurrent();
  };

  M.enter = function (nodeId) {
    const run = DJ.run;
    if (!run.moveTo(nodeId)) return;
    DJ.sfx('step');
    DJ.bump('nodesVisited');
    DJ.setMax('highestColumn', run.node().col);
    // Persist immediately: everything from here to completeNode() is unsaved otherwise,
    // so a refresh mid-battle used to leave the run stranded on the map.
    DJ.saveRun(run);
    hover = null;
    canvas.classList.remove('over-node');
    // Freeze the board while we hand off. Without this the map repaints for a couple of
    // frames with the *next* column already lit up, which flashes the upcoming choices
    // before the battle loads.
    frozen = true;
    UI.Nodes.enter(run.node());
  };
})(typeof window !== 'undefined' ? window : globalThis);
