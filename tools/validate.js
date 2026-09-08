/* Deep Jungle — data + asset integrity check. Run by CI before deploying.
 * Fails the build if any sprite, skill, effect, or content reference is missing.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

global.window = global;
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// ---- load everything the page loads ----
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const scripts = Array.from(html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)).map((m) => m[1]);
// The stamp tool appends ?v=<hash>; strip it before touching the filesystem.
for (const s of scripts) {
  const p = path.join(ROOT, s);
  if (!fs.existsSync(p)) { err(`index.html references a missing script: ${s}`); continue; }
  // UI/main modules touch the DOM at load; only the data/engine layers are safe to require here.
  if (/^js\/(ui|main)/.test(s)) continue;
  try { require(p); } catch (e) { err(`${s} failed to load: ${e.message}`); }
}
const DJ = global.DJ || {};
if (!DJ.MONSTERS) { console.error('FATAL: game data did not load'); process.exit(1); }

// UI scripts still need to parse cleanly.
for (const s of scripts.filter((x) => /^js\/(ui|main)/.test(x))) {
  const src = fs.readFileSync(path.join(ROOT, s), 'utf8');
  try { new Function(src); } catch (e) { err(`${s} has a syntax error: ${e.message}`); }
}

// ---- counts the game promises ----
const expect = (label, actual, wanted) => {
  if (actual !== wanted) err(`${label}: expected ${wanted}, found ${actual}`);
};
expect('monsters', DJ.MONSTERS.length, 100);
expect('heroes', DJ.HEROES.length, 30);
expect('achievements', DJ.ACHIEVEMENTS.length, 100);
expect('achievements that unlock a hero', DJ.ACHIEVEMENTS.filter((a) => a.unlocks).length, 25);
expect('starter heroes', DJ.HEROES.filter((h) => !h.unlock).length, 5);

// ---- uniqueness ----
const seenId = new Set();
for (const m of DJ.MONSTERS) {
  if (seenId.has(m.id)) err(`duplicate monster id: ${m.id}`);
  seenId.add(m.id);
}
const statLines = new Map();
for (const m of DJ.MONSTERS) {
  const k = [m.hp, m.atk, m.mag, m.def, m.spd].join('/');
  if (statLines.has(k)) err(`monsters ${m.id} and ${statLines.get(k)} share identical stats (${k})`);
  statLines.set(k, m.id);
}
const achIds = new Set();
for (const a of DJ.ACHIEVEMENTS) {
  if (achIds.has(a.id)) err(`duplicate achievement id: ${a.id}`);
  achIds.add(a.id);
}

// ---- every hero is reachable ----
const unlockTargets = new Set(DJ.ACHIEVEMENTS.filter((a) => a.unlocks).map((a) => a.unlocks));
for (const h of DJ.HEROES) {
  if (!h.unlock) continue;
  if (!DJ.ACH_BY_ID[h.unlock]) err(`hero ${h.id} requires achievement "${h.unlock}", which does not exist`);
  if (!unlockTargets.has(h.id)) err(`hero ${h.id} is locked but no achievement unlocks it`);
}
for (const a of DJ.ACHIEVEMENTS) {
  if (a.unlocks && !DJ.HERO_BY_ID[a.unlocks]) err(`achievement ${a.id} unlocks unknown hero "${a.unlocks}"`);
}
// Every achievement check must run without throwing on a fresh profile.
const blank = { stats: {}, unlocked: [], achievements: [], compendium: {} };
for (const a of DJ.ACHIEVEMENTS) {
  try { a.check(blank.stats, blank); }
  catch (e) { err(`achievement ${a.id} check() throws on a fresh profile: ${e.message}`); }
}

// ---- skills and effects ----
for (const [id, sk] of Object.entries(DJ.SKILLS)) {
  if (sk.fx && !DJ.FX[sk.fx]) err(`skill ${id} uses unknown effect "${sk.fx}"`);
  if (!sk.name) err(`skill ${id} has no name`);
  if (!sk.desc) warn(`skill ${id} has no description`);
  if (sk.status && !DJ.STATUS[sk.status.id]) err(`skill ${id} applies unknown status "${sk.status.id}"`);
  // A skill may put several statuses on its caster, so `self` is one or a list of them.
  for (const st of (sk.self ? (Array.isArray(sk.self) ? sk.self : [sk.self]) : [])) {
    if (!DJ.STATUS[st.id]) err(`skill ${id} applies unknown self-status "${st.id}"`);
  }
}
for (const h of DJ.HEROES) {
  if (h.skills.length !== 4) err(`hero ${h.id} has ${h.skills.length} skills, expected 4`);
  for (const s of h.skills) if (!DJ.SKILLS[s]) err(`hero ${h.id} references unknown skill "${s}"`);
}
for (const m of DJ.MONSTERS) {
  if (!m.skills.length) err(`monster ${m.id} has no abilities`);
  for (const s of m.skills) if (!DJ.SKILLS[s]) err(`monster ${m.id} references unknown skill "${s}"`);
  if (!m.desc) err(`monster ${m.id} has no compendium description`);
}

// ---- FX frames must exist on their sheet ----
const FX_GRID = { 3: { cols: 6, size: 32 }, 4: { cols: 6, size: 32 }, 5: { cols: 9, size: 64 } };
const sheetDims = {};
for (const f of fs.readdirSync(path.join(ROOT, 'assets/FX'))) {
  if (!f.endsWith('.png')) continue;
  const buf = fs.readFileSync(path.join(ROOT, 'assets/FX', f));
  // PNG IHDR: width at byte 16, height at 20 (big-endian)
  sheetDims[f.replace('.png', '')] = { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}
for (const [id, fx] of Object.entries(DJ.FX)) {
  const dims = sheetDims[fx.sheet];
  if (!dims) { err(`effect ${id} needs sheet ${fx.sheet}.png, which is missing`); continue; }
  const g = FX_GRID[fx.pack];
  if (!g) { err(`effect ${id} has unknown pack "${fx.pack}"`); continue; }
  const rows = dims.h / g.size;
  if (fx.row >= rows) err(`effect ${id} wants row ${fx.row} but ${fx.sheet} only has ${rows} rows`);
  if (fx.frames > g.cols) err(`effect ${id} wants ${fx.frames} frames but rows are only ${g.cols} wide`);
}

// ---- sprites ----
const SPR = {};
for (const s of scripts.filter((x) => x.startsWith('js/sprites/'))) {
  global.DJ.SPRITES = global.DJ.SPRITES || {};
  try { require(path.join(ROOT, s)); } catch (e) { err(`${s} failed to load: ${e.message}`); }
}
Object.assign(SPR, global.DJ.SPRITES || {});

for (const [id, sp] of Object.entries(SPR)) {
  if (!sp.w || !sp.h) { err(`sprite ${id} is missing w/h`); continue; }
  if (!Array.isArray(sp.px)) { err(`sprite ${id} has no px grid`); continue; }
  if (sp.px.length !== sp.h) err(`sprite ${id}: ${sp.px.length} rows, expected h=${sp.h}`);
  const badRow = sp.px.findIndex((r) => r.length !== sp.w);
  if (badRow >= 0) err(`sprite ${id}: row ${badRow} is ${sp.px[badRow].length} chars, expected w=${sp.w}`);
  const used = new Set(sp.px.join('').split(''));
  used.delete('.');
  for (const c of used) if (!sp.pal[c]) err(`sprite ${id} uses palette key "${c}" which is not defined`);
  const filled = sp.px.reduce((a, r) => a + r.split('').filter((c) => c !== '.').length, 0);
  if (filled < sp.w * sp.h * 0.04) warn(`sprite ${id} is nearly empty (${filled} px)`);
}

const need = [];
for (const h of DJ.HEROES) if (!SPR[h.id]) need.push(`hero sprite: ${h.id}`);
for (const m of DJ.MONSTERS) if (!SPR[m.id]) need.push(`monster sprite: ${m.id}`);
for (const k of Object.keys(DJ.NODE_INFO)) if (!SPR[DJ.NODE_INFO[k].icon]) need.push(`node icon: ${DJ.NODE_INFO[k].icon}`);
for (const i of DJ.ITEMS) if (!SPR[i.icon]) need.push(`item icon: ${i.icon}`);
for (const p of Object.values(DJ.POTIONS)) if (!SPR[p.icon]) need.push(`potion icon: ${p.icon}`);
for (const s of Object.values(DJ.STATUS)) if (!SPR[s.icon]) need.push(`status icon: ${s.icon}`);
for (const n of Array.from(new Set(need))) err('missing ' + n);

// ---- map generation sanity ----
for (let i = 0; i < 40; i++) {
  const map = DJ.generateMap(1000 + i * 977);
  const start = map.nodeById[map.startId];
  // every node must be reachable from the start, and every path must reach the Heart
  const seen = new Set([start.id]);
  const stack = [start];
  while (stack.length) {
    const n = stack.pop();
    for (const nx of n.next) if (!seen.has(nx)) { seen.add(nx); stack.push(map.nodeById[nx]); }
  }
  const all = Object.keys(map.nodeById);
  const unreachable = all.filter((id) => !seen.has(id));
  if (unreachable.length) { err(`map seed ${1000 + i * 977}: ${unreachable.length} unreachable node(s)`); break; }
  const deadEnds = all.filter((id) => map.nodeById[id].next.length === 0 && id !== map.heartId);
  if (deadEnds.length) { err(`map seed ${1000 + i * 977}: dead-end node(s) that are not the Heart: ${deadEnds.join(', ')}`); break; }
  if (!seen.has(map.heartId)) { err(`map seed ${1000 + i * 977}: the Heart is unreachable`); break; }
  // each region boss column must be a single node everything funnels through
  for (const col of map.cols) {
    if (col.some((n) => n.type === 'boss' || n.type === 'heart')) {
      if (col.length !== 1) { err(`map seed ${1000 + i * 977}: a boss column has ${col.length} nodes`); break; }
    }
  }
}

// ---- content presence ----
if (DJ.EVENTS.length < 10) err(`only ${DJ.EVENTS.length} story events; expected at least 10`);
if (DJ.RIDDLES.length < 10) err(`only ${DJ.RIDDLES.length} riddles; expected at least 10`);
for (const r of DJ.RIDDLES) if (r.c < 0 || r.c >= r.a.length) err(`riddle "${r.q.slice(0, 30)}…" has an out-of-range answer index`);
for (const ev of DJ.EVENTS) {
  if (!ev.options || !ev.options.length) err(`event ${ev.id} has no options`);
  for (const o of ev.options) {
    if (!o.outcomes || !o.outcomes.length) err(`event ${ev.id} option "${o.label}" has no outcomes`);
    for (const oc of o.outcomes) if (!oc.text) err(`event ${ev.id} has an outcome with no text`);
  }
}
// Every track the music player references must actually be on disk.
for (const t of DJ.MUSIC.playlist.concat([DJ.MUSIC.boss])) {
  if (!fs.existsSync(path.join(ROOT, t.src))) err(`music track "${t.name}" is missing (${t.src})`);
}
if (DJ.MUSIC.playlist.length < 2) err('the music playlist needs at least two tracks to crossfade');

// Stamped asset URLs must match the file actually on disk, or a deploy serves stale JS.
{
  const crypto = require('crypto');
  const stamped = Array.from(html.matchAll(/(?:src|href)="((?:js|css)\/[^"?]+)\?v=([a-f0-9]+)"/g));
  const plain = Array.from(html.matchAll(/(?:src|href)="((?:js|css)\/[^"?]+)"/g));
  for (const [, f] of plain) err(`asset ${f} is not cache-stamped; run node tools/stamp.js`);
  for (const [, f, want] of stamped) {
    const fp = path.join(ROOT, f);
    if (!fs.existsSync(fp)) { err(`stamped asset missing: ${f}`); continue; }
    const norm = fs.readFileSync(fp, 'utf8').split('\r\n').join('\n');
    const got = crypto.createHash('sha1').update(norm, 'utf8').digest('hex').slice(0, 8);
    if (got !== want) err(`stale cache stamp on ${f} (html says ${want}, file is ${got}); run node tools/stamp.js`);
  }
}

// ---- report ----
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings.slice(0, 30)) console.log('  ! ' + w);
  if (warnings.length > 30) console.log(`  … and ${warnings.length - 30} more`);
}
if (errors.length) {
  console.error(`\nFAILED — ${errors.length} error(s):`);
  for (const e of errors.slice(0, 60)) console.error('  x ' + e);
  if (errors.length > 60) console.error(`  … and ${errors.length - 60} more`);
  process.exit(1);
}
console.log(`\nOK — ${DJ.MONSTERS.length} monsters, ${DJ.HEROES.length} heroes, ${DJ.ACHIEVEMENTS.length} achievements, ` +
  `${Object.keys(DJ.SKILLS).length} skills, ${Object.keys(SPR).length} sprites, ${Object.keys(DJ.FX).length} effects. All references resolve.`);
