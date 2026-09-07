/* Deep Jungle — puzzle nodes: riddles, totem memory, vine locks, glyph weighing. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const P = (UI.Puzzles = {});

  P.start = function (node, done) {
    const rng = DJ.run.rng;
    const kind = rng.weighted([
      { v: 'riddle', w: 30 }, { v: 'totem', w: 25 }, { v: 'vine', w: 25 }, { v: 'glyph', w: 20 },
    ]);
    if (kind === 'riddle') return riddle(node, done);
    if (kind === 'totem') return totem(node, done);
    if (kind === 'vine') return vine(node, done);
    return glyph(node, done);
  };

  // ---------- 1. Riddle ----------
  function riddle(node, done) {
    const rng = DJ.run.rng;
    const r = rng.pick(DJ.RIDDLES);
    const order = rng.shuffle(r.a.map((text, i) => ({ text, correct: i === r.c })));
    UI.Nodes.panel('The Speaking Stone', 'Answer correctly', 'node_puzzle', (body) => {
      body.appendChild(UI.el('p', 'flavor', 'A face carved into a boulder opens one stone eye and asks a question it has clearly asked many, many times.'));
      const q = UI.el('p');
      q.style.cssText = 'font-size:15px;font-weight:700;color:#e8f3e4;line-height:1.55';
      q.textContent = '“' + r.q + '”';
      body.appendChild(q);
    }, order.map((o) => ({
      label: o.text, sfx: 'click',
      fn: () => {
        if (o.correct) DJ.bump('riddlesSolved');
        done(o.correct);
      },
    })));
  }

  // ---------- 2. Totem memory ----------
  function totem(node, done) {
    const rng = DJ.run.rng;
    const COLORS = [
      { id: 'r', name: 'Red', hex: '#e05252' }, { id: 'g', name: 'Green', hex: '#5fbf5a' },
      { id: 'b', name: 'Blue', hex: '#5aa8e0' }, { id: 'y', name: 'Yellow', hex: '#e8c65a' },
    ];
    const len = DJ.clamp(3 + Math.floor(node.level / 5), 3, 6);
    const seq = [];
    for (let i = 0; i < len; i++) seq.push(rng.pick(COLORS));
    let input = [];
    let phase = 'watch';
    let shownIdx = -1;

    function render() {
      UI.Nodes.panel('Totem of Echoes', phase === 'watch' ? 'Watch the sequence' : 'Repeat the sequence', 'node_puzzle', (body) => {
        body.appendChild(UI.el('p', 'flavor', 'Four carved faces stacked into a pillar. One by one they light from within, and then they wait, expectantly.'));
        const row = UI.el('div');
        row.style.cssText = 'display:flex;gap:10px;justify-content:center;margin:18px 0;min-height:58px';
        for (const c of COLORS) {
          const d = UI.el('div');
          const lit = phase === 'watch' && shownIdx >= 0 && seq[shownIdx].id === c.id;
          d.style.cssText = `width:54px;height:54px;border-radius:10px;border:2px solid ${c.hex};background:${lit ? c.hex : 'rgba(0,0,0,.35)'};box-shadow:${lit ? `0 0 22px ${c.hex}` : 'none'};transition:background .12s,box-shadow .12s;display:grid;place-items:center;font-weight:800;color:${lit ? '#0a140c' : c.hex};font-size:12px`;
          d.textContent = c.name;
          row.appendChild(d);
        }
        body.appendChild(row);
        const prog = UI.el('div', 'center muted');
        prog.style.fontSize = '13px';
        prog.textContent = phase === 'watch'
          ? `Sequence of ${len}…`
          : `${input.length} / ${len}` + (input.length ? '  ·  ' + input.map((i) => i.name).join(' → ') : '');
        body.appendChild(prog);
      }, phase === 'watch' ? [] : COLORS.map((c) => ({
        label: c.name, sfx: 'click',
        fn: () => {
          input.push(c);
          const i = input.length - 1;
          if (input[i].id !== seq[i].id) { done(false); return; }
          if (input.length === len) { DJ.bump('totemsSolved'); done(true); return; }
          render();
        },
      })));
    }

    // play the sequence
    render();
    let i = 0;
    const playNext = () => {
      if (i >= len) {
        shownIdx = -1; phase = 'input'; render();
        return;
      }
      shownIdx = i;
      DJ.sfx('hover');
      render();
      i++;
      setTimeout(() => { shownIdx = -1; render(); setTimeout(playNext, 200); }, 620);
    };
    setTimeout(playNext, 700);
  }

  // ---------- 3. Vine lock ----------
  function vine(node, done) {
    const rng = DJ.run.rng;
    // Pull vines in the correct order. Clues narrow it down.
    const n = DJ.clamp(3 + Math.floor(node.level / 6), 3, 5);
    const names = ['Thick knotted vine', 'Thin red vine', 'Mossy green vine', 'Dry brown vine', 'Flowering vine'].slice(0, n);
    const order = rng.shuffle(names.map((_, i) => i));
    let step = 0;
    const clues = [];
    clues.push(`The ${names[order[0]].toLowerCase()} must be pulled first.`);
    if (n >= 4) clues.push(`The ${names[order[n - 1]].toLowerCase()} must be pulled last.`);
    if (n >= 5) clues.push(`The ${names[order[1]].toLowerCase()} comes immediately after the first.`);

    function render() {
      UI.Nodes.panel('The Vine Lock', `Pull ${n} vines in order`, 'node_puzzle', (body) => {
        body.appendChild(UI.el('p', 'flavor', 'A slab of carved stone, sealed by a braid of living vines. Scratched into the rock beside it, in a script nobody uses any more, are instructions.'));
        for (const c of clues) {
          const li = UI.el('p');
          li.style.cssText = 'color:#e8c65a;font-size:13px;margin:4px 0';
          li.textContent = '· ' + c;
          body.appendChild(li);
        }
        const prog = UI.el('div', 'center muted');
        prog.style.cssText = 'font-size:13px;margin-top:12px';
        prog.textContent = `Pulled ${step} of ${n}`;
        body.appendChild(prog);
      }, names.map((nm, i) => ({
        label: nm, sfx: 'click',
        fn: () => {
          if (order[step] !== i) { done(false); return; }
          step++;
          if (step === n) { DJ.bump('vinesSolved'); done(true); return; }
          DJ.sfx('puzzle_ok');
          render();
        },
      })));
    }
    render();
  }

  // ---------- 4. Glyph weighing ----------
  function glyph(node, done) {
    const rng = DJ.run.rng;
    // Which glyph does NOT belong? Categories are jungle-themed.
    const sets = [
      { items: ['Jaguar', 'Anaconda', 'Hornet', 'Obsidian'], odd: 3, why: 'the others are living things' },
      { items: ['Rain', 'River', 'Mist', 'Ember'], odd: 3, why: 'the others are water' },
      { items: ['Root', 'Leaf', 'Bark', 'Bone'], odd: 3, why: 'the others belong to trees' },
      { items: ['Moon', 'Star', 'Sun', 'Stone'], odd: 3, why: 'the others are in the sky' },
      { items: ['Fang', 'Claw', 'Horn', 'Feather'], odd: 3, why: 'the others are weapons a beast is born with' },
      { items: ['Ash', 'Smoke', 'Flame', 'Moss'], odd: 3, why: 'the others come from fire' },
      { items: ['Spore', 'Seed', 'Pollen', 'Iron'], odd: 3, why: 'the others grow into something' },
      { items: ['Toad', 'Newt', 'Frog', 'Beetle'], odd: 3, why: 'the others are amphibians' },
    ];
    const s = rng.pick(sets);
    const shuffled = rng.shuffle(s.items.map((text, i) => ({ text, correct: i === s.odd })));
    UI.Nodes.panel('The Weighing Glyphs', 'One does not belong', 'node_puzzle', (body) => {
      body.appendChild(UI.el('p', 'flavor', 'Four glyphs set into a stone door, each on its own pressure plate. Above them, worn nearly smooth: a single line that translates roughly as "remove the stranger".'));
    }, shuffled.map((o) => ({
      label: o.text, sfx: 'click',
      fn: () => {
        if (o.correct) { DJ.bump('puzzlesSolved', 0); done(true); }
        else done(false);
      },
    })));
  }
})(typeof window !== 'undefined' ? window : globalThis);
