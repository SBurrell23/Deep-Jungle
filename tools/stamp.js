/* Deep Jungle — stamp local script/style URLs in index.html with a content hash.
 * Without this, browsers keep serving the previous build's JS after a deploy.
 * Run before committing:  node tools/stamp.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const HTML = path.join(ROOT, 'index.html');

let html = fs.readFileSync(HTML, 'utf8');
let changed = 0;

html = html.replace(/(src|href)="((?:js|css)\/[^"?]+)(\?v=[^"]*)?"/g, (m, attr, file) => {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return m;
  const hash = crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex').slice(0, 8);
  changed++;
  return `${attr}="${file}?v=${hash}"`;
});

fs.writeFileSync(HTML, html);
console.log(`stamped ${changed} asset reference(s) in index.html`);
