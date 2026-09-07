/* Deep Jungle — core utilities (DOM-free) */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});

  // ---- Seeded RNG (mulberry32) ----
  function RNG(seed) {
    this.s = (seed >>> 0) || 1;
  }
  RNG.prototype.next = function () {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  RNG.prototype.int = function (min, max) { // inclusive
    return min + Math.floor(this.next() * (max - min + 1));
  };
  RNG.prototype.pick = function (arr) { return arr[Math.floor(this.next() * arr.length)]; };
  RNG.prototype.chance = function (p) { return this.next() < p; };
  RNG.prototype.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  RNG.prototype.weighted = function (entries) { // [{w, v}]
    let total = 0;
    for (const e of entries) total += e.w;
    let r = this.next() * total;
    for (const e of entries) { r -= e.w; if (r <= 0) return e.v; }
    return entries[entries.length - 1].v;
  };
  RNG.prototype.range = function (a, b) { return a + this.next() * (b - a); };
  DJ.RNG = RNG;
  DJ.rng = new RNG(Date.now());
  DJ.seedFromString = function (str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };

  // ---- Helpers ----
  DJ.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  DJ.lerp = (a, b, t) => a + (b - a) * t;
  DJ.deepClone = (o) => JSON.parse(JSON.stringify(o));
  DJ.uid = (() => { let n = 0; return (p) => (p || 'u') + (++n) + '_' + Math.floor(Math.random() * 1e6).toString(36); })();
  DJ.pct = (v, max) => (max <= 0 ? 0 : DJ.clamp(v / max, 0, 1));
  DJ.cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  DJ.fmt = (n) => (Math.abs(n) >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(Math.round(n)));

  // ---- Tiny event bus ----
  function Bus() { this.h = {}; }
  Bus.prototype.on = function (ev, fn) { (this.h[ev] = this.h[ev] || []).push(fn); return () => this.off(ev, fn); };
  Bus.prototype.off = function (ev, fn) { if (this.h[ev]) this.h[ev] = this.h[ev].filter((f) => f !== fn); };
  Bus.prototype.emit = function (ev, data) { (this.h[ev] || []).slice().forEach((f) => f(data)); };
  DJ.Bus = Bus;
  DJ.events = new Bus();

  DJ.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
})(typeof window !== 'undefined' ? window : globalThis);
