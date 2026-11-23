// Static smoke checks for the GitHub Pages companion. Run: node tests/smoke.mjs
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
const js = readFileSync('app.js', 'utf8');
const css = readFileSync('style.css', 'utf8');
execFileSync(process.execPath, ['--check', 'app.js'], { stdio: 'inherit' });
for (const tab of ['resources','galaxy','trade','routes','wiki','mining']) {
  assert(js.includes("show('"+tab+"')"), 'Missing tab: '+tab);
}
assert(!js.includes("document.getElementById('mining-resource')"), 'Galaxy initialization crash regression');
assert(js.includes("'Металлические':'Metallic'"), 'Metallic ring mapping regression');
assert(js.includes("'Металлообогащённые':'Metal Rich'"), 'Metal Rich ring mapping regression');
assert(js.includes("Неожиданный формат ответа Ardent API"), 'Trade schema validation missing');
assert(css.includes('.edtools-loader'), 'EDTools loading styles missing');
for (const theme of ['dark','light']) {
  const html = readFileSync(theme+'/index.html','utf8');
  assert(html.includes('../app.js?'), theme+' missing app script');
  assert(html.includes('../style.css?'), theme+' missing stylesheet');
  assert(html.includes('data-theme="'+theme+'"'), theme+' wrong theme');
}
console.log('Static smoke checks passed. Live API and browser tests are NOT covered.');
