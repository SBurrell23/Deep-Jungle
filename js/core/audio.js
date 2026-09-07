/* Deep Jungle — audio: looping music track + fully procedural Web Audio SFX. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});

  const A = (DJ.Audio = {
    ctx: null, master: null, sfxGain: null, musicGain: null,
    music: null, musicEl: null, started: false, unlocked: false,
    _pending: 0,
  });

  A.init = function () {
    if (A.ctx) return A.ctx;
    const AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return null;
    A.ctx = new AC();
    A.master = A.ctx.createGain();
    A.master.gain.value = 1;
    // A limiter on the master keeps stacked effects (thunder over an explosion over a
    // crit) from clipping, which otherwise crackles on the loudest moments of a boss fight.
    A.limiter = A.ctx.createDynamicsCompressor();
    A.limiter.threshold.value = -6;
    A.limiter.knee.value = 4;
    A.limiter.ratio.value = 12;
    A.limiter.attack.value = 0.003;
    A.limiter.release.value = 0.18;
    A.master.connect(A.limiter);
    A.limiter.connect(A.ctx.destination);
    A.sfxGain = A.ctx.createGain();
    A.sfxGain.connect(A.master);
    A.musicGain = A.ctx.createGain();
    A.musicGain.connect(A.master);
    A.applySettings();
    return A.ctx;
  };

  A.unlock = function () {
    A.init();
    if (!A.ctx) return;
    if (A.ctx.state === 'suspended') A.ctx.resume();
    A.unlocked = true;
    if (A.musicEl && A.musicEl.paused && DJ.profile.settings.musicOn) A.musicEl.play().catch(() => {});
  };

  A.applySettings = function () {
    const s = (DJ.profile && DJ.profile.settings) || { music: 0.5, sfx: 0.7, musicOn: true, sfxOn: true };
    if (A.sfxGain) A.sfxGain.gain.value = s.sfxOn ? s.sfx : 0;
    if (A.musicGain) A.musicGain.gain.value = s.musicOn ? s.music : 0;
    if (A.musicEl) A.musicEl.volume = s.musicOn ? s.music * 0.85 : 0;
  };

  // ---------- Music ----------
  A.loadMusic = function (url) {
    if (A.musicEl) return;
    const el = new Audio();
    el.src = url;
    el.loop = true;
    el.preload = 'auto';
    el.volume = 0;
    A.musicEl = el;
    el.addEventListener('canplaythrough', () => { A.applySettings(); }, { once: true });
  };
  A.playMusic = function () {
    if (!A.musicEl) return;
    A.applySettings();
    if (DJ.profile.settings.musicOn) A.musicEl.play().catch(() => {});
  };
  A.pauseMusic = function () { if (A.musicEl) A.musicEl.pause(); };

  // ---------- Procedural SFX toolkit ----------
  function now() { return A.ctx.currentTime; }
  function env(g, t0, a, d, peak, sus, rel) {
    g.gain.cancelScheduledValues(t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + a);
    if (sus != null && rel) {
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, sus), t0 + a + d);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d + rel);
    } else {
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
    }
  }
  function osc(type, f0, f1, t0, dur, gainNode, detune) {
    const o = A.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    if (f1 != null && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
    if (detune) o.detune.value = detune;
    o.connect(gainNode);
    o.start(t0); o.stop(t0 + dur + 0.02);
    return o;
  }
  let noiseBuf = null;
  function noise(dur) {
    const sr = A.ctx.sampleRate;
    const len = Math.max(1, Math.ceil(sr * dur));
    if (!noiseBuf || noiseBuf.length < len) {
      noiseBuf = A.ctx.createBuffer(1, Math.max(len, sr), sr);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = A.ctx.createBufferSource();
    src.buffer = noiseBuf;
    return src;
  }
  function filt(type, freq, q) {
    const f = A.ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; if (q != null) f.Q.value = q;
    return f;
  }
  function gain(v) { const g = A.ctx.createGain(); g.gain.value = v == null ? 1 : v; return g; }

  // Each SFX is a function(t0) that schedules its own graph into sfxGain.
  const SFX = {
    // --- UI ---
    click: (t) => { const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.001, 0.05, 0.22); osc('square', 660, 520, t, 0.06, g); },
    hover: (t) => { const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.002, 0.04, 0.08); osc('sine', 900, 1100, t, 0.05, g); },
    confirm: (t) => { const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.004, 0.16, 0.24); osc('triangle', 523, 784, t, 0.18, g); osc('triangle', 659, 1046, t, 0.18, g, 4); },
    cancel: (t) => { const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.003, 0.11, 0.2); osc('square', 380, 190, t, 0.13, g); },
    error: (t) => { const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.003, 0.16, 0.22); osc('sawtooth', 180, 110, t, 0.18, g); },
    page: (t) => { const n = noise(0.13); const f = filt('bandpass', 2400, 1.2); const g = gain(0); n.connect(f); f.connect(g); g.connect(A.sfxGain); env(g, t, 0.005, 0.11, 0.14); f.frequency.setValueAtTime(1200, t); f.frequency.exponentialRampToValueAtTime(4200, t + 0.11); n.start(t); n.stop(t + 0.14); },

    // --- Melee ---
    slash: (t) => {
      const n = noise(0.22); const f = filt('bandpass', 2200, 1.1); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      f.frequency.setValueAtTime(5200, t); f.frequency.exponentialRampToValueAtTime(700, t + 0.16);
      env(g, t, 0.004, 0.17, 0.5); n.start(t); n.stop(t + 0.22);
      const g2 = gain(0); g2.connect(A.sfxGain); env(g2, t, 0.002, 0.07, 0.14); osc('sawtooth', 900, 240, t, 0.08, g2);
    },
    hit: (t) => {
      const n = noise(0.16); const f = filt('lowpass', 1500); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      env(g, t, 0.002, 0.13, 0.55); n.start(t); n.stop(t + 0.16);
      const g2 = gain(0); g2.connect(A.sfxGain); env(g2, t, 0.001, 0.1, 0.4); osc('sine', 190, 55, t, 0.11, g2);
    },
    crit: (t) => {
      SFX.hit(t);
      const g = gain(0); g.connect(A.sfxGain); env(g, t + 0.02, 0.002, 0.24, 0.42);
      osc('square', 1400, 340, t + 0.02, 0.26, g);
      const n = noise(0.3); const f = filt('highpass', 2600); const g2 = gain(0);
      n.connect(f); f.connect(g2); g2.connect(A.sfxGain); env(g2, t + 0.02, 0.003, 0.26, 0.3); n.start(t + 0.02); n.stop(t + 0.32);
    },
    pierce: (t) => {
      const n = noise(0.18); const f = filt('bandpass', 3000, 4); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(5200, t + 0.1);
      env(g, t, 0.003, 0.15, 0.4); n.start(t); n.stop(t + 0.18);
      const g2 = gain(0); g2.connect(A.sfxGain); env(g2, t, 0.002, 0.12, 0.22); osc('sawtooth', 420, 1600, t, 0.12, g2);
    },
    bite: (t) => {
      const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.002, 0.09, 0.4); osc('square', 260, 70, t, 0.1, g);
      const n = noise(0.12); const f = filt('bandpass', 1100, 2); const g2 = gain(0);
      n.connect(f); f.connect(g2); g2.connect(A.sfxGain); env(g2, t + 0.03, 0.002, 0.08, 0.3); n.start(t + 0.03); n.stop(t + 0.13);
    },
    whip: (t) => {
      const n = noise(0.2); const f = filt('bandpass', 3200, 3); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      f.frequency.setValueAtTime(1400, t); f.frequency.exponentialRampToValueAtTime(6000, t + 0.08); f.frequency.exponentialRampToValueAtTime(900, t + 0.17);
      env(g, t, 0.004, 0.16, 0.42); n.start(t); n.stop(t + 0.2);
    },
    arrow: (t) => {
      const n = noise(0.24); const f = filt('bandpass', 2000, 6); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      f.frequency.setValueAtTime(3400, t); f.frequency.exponentialRampToValueAtTime(1100, t + 0.2);
      env(g, t, 0.006, 0.2, 0.3); n.start(t); n.stop(t + 0.24);
      const g2 = gain(0); g2.connect(A.sfxGain); env(g2, t, 0.003, 0.07, 0.16); osc('triangle', 1200, 500, t, 0.08, g2);
    },

    // --- Magic ---
    magic: (t) => {
      const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.02, 0.3, 0.26);
      osc('sine', 420, 1500, t, 0.32, g); osc('sine', 630, 2200, t, 0.32, g, 6);
      const g2 = gain(0); const f = filt('bandpass', 2400, 2); g2.connect(A.sfxGain);
      const n = noise(0.34); n.connect(f); f.connect(g2); env(g2, t, 0.03, 0.3, 0.13); n.start(t); n.stop(t + 0.34);
    },
    fire: (t) => {
      const n = noise(0.5); const f = filt('lowpass', 900); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      f.frequency.setValueAtTime(2600, t); f.frequency.exponentialRampToValueAtTime(420, t + 0.42);
      env(g, t, 0.012, 0.44, 0.5); n.start(t); n.stop(t + 0.5);
      const g2 = gain(0); g2.connect(A.sfxGain); env(g2, t, 0.01, 0.3, 0.2); osc('sawtooth', 160, 60, t, 0.32, g2);
    },
    explosion: (t) => {
      const n = noise(0.75); const f = filt('lowpass', 1400); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(180, t + 0.6);
      env(g, t, 0.006, 0.68, 0.6); n.start(t); n.stop(t + 0.75);
      const g2 = gain(0); g2.connect(A.sfxGain); env(g2, t, 0.004, 0.5, 0.7); osc('sine', 130, 34, t, 0.55, g2);
    },
    thunder: (t) => {
      const n = noise(0.6); const f = filt('highpass', 1800); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      env(g, t, 0.001, 0.1, 0.5, 0.09, 0.42); n.start(t); n.stop(t + 0.62);
      const g2 = gain(0); g2.connect(A.sfxGain); env(g2, t, 0.001, 0.16, 0.55); osc('sawtooth', 2600, 300, t, 0.18, g2);
      const g3 = gain(0); const f3 = filt('lowpass', 300); g3.connect(A.sfxGain);
      const n3 = noise(0.7); n3.connect(f3); f3.connect(g3); env(g3, t + 0.06, 0.02, 0.6, 0.5); n3.start(t + 0.06); n3.stop(t + 0.76);
    },
    poison: (t) => {
      const n = noise(0.5); const f = filt('bandpass', 700, 1.4); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      f.frequency.setValueAtTime(400, t); f.frequency.linearRampToValueAtTime(1500, t + 0.4);
      env(g, t, 0.03, 0.44, 0.3); n.start(t); n.stop(t + 0.5);
      for (let i = 0; i < 4; i++) { const g2 = gain(0); g2.connect(A.sfxGain); const tt = t + i * 0.08; env(g2, tt, 0.004, 0.07, 0.1); osc('sine', 300 + i * 90, 600 + i * 120, tt, 0.08, g2); }
    },
    heal: (t) => {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => { const g = gain(0); g.connect(A.sfxGain); const tt = t + i * 0.07; env(g, tt, 0.02, 0.34, 0.2); osc('sine', n, n, tt, 0.36, g); osc('triangle', n * 2, n * 2, tt, 0.36, g, 5); });
    },
    revive: (t) => {
      const notes = [392, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => { const g = gain(0); g.connect(A.sfxGain); const tt = t + i * 0.1; env(g, tt, 0.03, 0.5, 0.24); osc('sine', n, n, tt, 0.52, g); osc('sine', n * 1.5, n * 1.5, tt, 0.52, g, -4); });
    },
    buff: (t) => {
      const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.03, 0.35, 0.24);
      osc('triangle', 330, 880, t, 0.37, g); osc('triangle', 440, 1174, t, 0.37, g, 7);
    },
    debuff: (t) => {
      const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.02, 0.4, 0.24);
      osc('sawtooth', 520, 130, t, 0.42, g); osc('sine', 260, 70, t, 0.42, g, -8);
    },
    drain: (t) => {
      const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.05, 0.42, 0.26);
      osc('sawtooth', 120, 620, t, 0.46, g); osc('sine', 90, 420, t, 0.46, g, 5);
    },
    wind: (t) => {
      const n = noise(0.6); const f = filt('bandpass', 900, 0.8); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      f.frequency.setValueAtTime(500, t); f.frequency.linearRampToValueAtTime(2400, t + 0.3); f.frequency.linearRampToValueAtTime(600, t + 0.58);
      env(g, t, 0.06, 0.52, 0.34); n.start(t); n.stop(t + 0.6);
    },
    water: (t) => {
      const n = noise(0.42); const f = filt('bandpass', 1600, 1.6); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      f.frequency.setValueAtTime(2800, t); f.frequency.exponentialRampToValueAtTime(600, t + 0.36);
      env(g, t, 0.006, 0.38, 0.42); n.start(t); n.stop(t + 0.42);
    },
    roar: (t) => {
      const g = gain(0); const f = filt('lowpass', 1100); g.connect(A.sfxGain);
      const o1 = A.ctx.createOscillator(); o1.type = 'sawtooth';
      o1.frequency.setValueAtTime(110, t); o1.frequency.linearRampToValueAtTime(190, t + 0.18); o1.frequency.linearRampToValueAtTime(80, t + 0.62);
      const lfo = A.ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 26;
      const lg = gain(28); lfo.connect(lg); lg.connect(o1.frequency);
      o1.connect(f); f.connect(g);
      env(g, t, 0.04, 0.6, 0.5); o1.start(t); o1.stop(t + 0.68); lfo.start(t); lfo.stop(t + 0.68);
      const n = noise(0.7); const nf = filt('bandpass', 600, 0.9); const ng = gain(0);
      n.connect(nf); nf.connect(ng); ng.connect(A.sfxGain); env(ng, t, 0.04, 0.6, 0.22); n.start(t); n.stop(t + 0.7);
    },
    summon: (t) => {
      const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.12, 0.6, 0.3);
      osc('sawtooth', 70, 260, t, 0.72, g); osc('square', 105, 390, t, 0.72, g, 8);
      const n = noise(0.8); const f = filt('bandpass', 300, 1); const g2 = gain(0);
      n.connect(f); f.connect(g2); g2.connect(A.sfxGain);
      f.frequency.setValueAtTime(200, t); f.frequency.exponentialRampToValueAtTime(2400, t + 0.7);
      env(g2, t, 0.1, 0.66, 0.28); n.start(t); n.stop(t + 0.8);
    },
    heartbeat: (t) => {
      const beat = (tt, amp) => { const g = gain(0); const f = filt('lowpass', 220); g.connect(A.sfxGain); const o = A.ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(90, tt); o.frequency.exponentialRampToValueAtTime(36, tt + 0.22); o.connect(f); f.connect(g); env(g, tt, 0.008, 0.26, amp); o.start(tt); o.stop(tt + 0.3); };
      beat(t, 0.75); beat(t + 0.3, 0.5);
    },

    // --- Feedback / rewards ---
    gold: (t) => {
      for (let i = 0; i < 5; i++) { const g = gain(0); g.connect(A.sfxGain); const tt = t + i * 0.045; env(g, tt, 0.002, 0.16, 0.15);
        osc('square', 1300 + Math.random() * 900, 2000 + Math.random() * 900, tt, 0.17, g); }
    },
    potion: (t) => {
      const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.005, 0.22, 0.22); osc('sine', 700, 1500, t, 0.24, g);
      const n = noise(0.3); const f = filt('bandpass', 2600, 3); const g2 = gain(0);
      n.connect(f); f.connect(g2); g2.connect(A.sfxGain); env(g2, t + 0.04, 0.01, 0.24, 0.13); n.start(t + 0.04); n.stop(t + 0.34);
    },
    levelup: (t) => {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((n, i) => { const g = gain(0); g.connect(A.sfxGain); const tt = t + i * 0.085; env(g, tt, 0.006, 0.3, 0.24); osc('square', n, n, tt, 0.3, g); osc('triangle', n * 2, n * 2, tt, 0.3, g, 4); });
    },
    victory: (t) => {
      const seq = [[523.25, 0], [659.25, 0.13], [783.99, 0.26], [1046.5, 0.39], [783.99, 0.56], [1046.5, 0.68], [1318.5, 0.84]];
      seq.forEach(([n, dt]) => { const g = gain(0); g.connect(A.sfxGain); const tt = t + dt; env(g, tt, 0.01, 0.42, 0.22); osc('square', n, n, tt, 0.44, g); osc('triangle', n / 2, n / 2, tt, 0.44, g, -5); });
    },
    defeat: (t) => {
      const seq = [[440, 0], [392, 0.2], [349.23, 0.4], [261.63, 0.62]];
      seq.forEach(([n, dt]) => { const g = gain(0); g.connect(A.sfxGain); const tt = t + dt; env(g, tt, 0.02, 0.6, 0.24); osc('sawtooth', n, n * 0.985, tt, 0.62, g); osc('sine', n / 2, n / 2, tt, 0.62, g); });
    },
    achievement: (t) => {
      const notes = [659.25, 830.61, 987.77, 1318.5];
      notes.forEach((n, i) => { const g = gain(0); g.connect(A.sfxGain); const tt = t + i * 0.07; env(g, tt, 0.005, 0.4, 0.22); osc('triangle', n, n, tt, 0.42, g); osc('sine', n * 2, n * 2, tt, 0.42, g, 3); });
    },
    unlock: (t) => {
      const notes = [392, 523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((n, i) => { const g = gain(0); g.connect(A.sfxGain); const tt = t + i * 0.075; env(g, tt, 0.006, 0.45, 0.2); osc('square', n, n, tt, 0.46, g); });
    },
    death: (t) => {
      const g = gain(0); const f = filt('lowpass', 800); g.connect(A.sfxGain);
      const o = A.ctx.createOscillator(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.5);
      o.connect(f); f.connect(g); env(g, t, 0.01, 0.5, 0.4); o.start(t); o.stop(t + 0.55);
    },
    step: (t) => {
      const n = noise(0.12); const f = filt('lowpass', 700); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain); env(g, t, 0.003, 0.1, 0.2); n.start(t); n.stop(t + 0.12);
    },
    open: (t) => {
      const n = noise(0.35); const f = filt('bandpass', 800, 1.4); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain);
      f.frequency.setValueAtTime(500, t); f.frequency.linearRampToValueAtTime(1800, t + 0.3);
      env(g, t, 0.01, 0.32, 0.28); n.start(t); n.stop(t + 0.35);
      const g2 = gain(0); g2.connect(A.sfxGain); env(g2, t + 0.22, 0.004, 0.2, 0.16); osc('square', 900, 1400, t + 0.22, 0.22, g2);
    },
    trap: (t) => {
      const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.001, 0.14, 0.5); osc('square', 1500, 200, t, 0.15, g);
      SFX.hit(t + 0.05);
    },
    shrine: (t) => {
      const notes = [261.63, 392, 523.25, 659.25];
      notes.forEach((n, i) => { const g = gain(0); g.connect(A.sfxGain); const tt = t + i * 0.12; env(g, tt, 0.06, 0.7, 0.16); osc('sine', n, n, tt, 0.72, g); osc('sine', n * 3, n * 3, tt, 0.72, g, 4); });
    },
    puzzle_ok: (t) => {
      [659.25, 987.77].forEach((n, i) => { const g = gain(0); g.connect(A.sfxGain); const tt = t + i * 0.1; env(g, tt, 0.005, 0.28, 0.2); osc('triangle', n, n, tt, 0.3, g); });
    },
    puzzle_fail: (t) => {
      const g = gain(0); g.connect(A.sfxGain); env(g, t, 0.004, 0.32, 0.24); osc('square', 300, 140, t, 0.34, g);
    },
    stun: (t) => {
      for (let i = 0; i < 3; i++) { const g = gain(0); g.connect(A.sfxGain); const tt = t + i * 0.09; env(g, tt, 0.003, 0.14, 0.16); osc('sine', 1500 - i * 260, 1900 - i * 260, tt, 0.15, g); }
    },
    miss: (t) => {
      const n = noise(0.16); const f = filt('highpass', 2200); const g = gain(0);
      n.connect(f); f.connect(g); g.connect(A.sfxGain); env(g, t, 0.004, 0.14, 0.16); n.start(t); n.stop(t + 0.16);
    },
  };
  A.SFX = SFX;

  A.play = function (name, delay) {
    const s = DJ.profile && DJ.profile.settings;
    if (!s || !s.sfxOn) return;
    if (!A.ctx) A.init();
    if (!A.ctx || A.ctx.state === 'suspended') return;
    const fn = SFX[name];
    if (!fn) return;
    // simple polyphony guard
    if (A._pending > 22) return;
    A._pending++;
    setTimeout(() => { A._pending--; }, 700);
    try { fn(now() + (delay || 0)); } catch (e) { /* ignore audio errors */ }
  };
  DJ.sfx = A.play;
})(typeof window !== 'undefined' ? window : globalThis);
