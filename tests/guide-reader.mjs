// Verify route wiring without changing the original guide HTML.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const pages = JSON.parse(readFileSync('data/blackbox-guides.json', 'utf8'));
const progress = JSON.parse(readFileSync('blackbox/translation-progress.json', 'utf8'));
const paths = new Set(pages.map(({ path }) => path));
assert.equal(paths.size, 198);
assert.deepEqual(paths, new Set(progress.verifiedPaths));
for (const path of [...paths, 'guides/index.html']) {
  assert.match(path, /^guides\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html$/i);
  const html = readFileSync('blackbox/'+path, 'utf8');
  assert.match(html, /<script src="[^"]*\/js\/scroll-progress\.js" defer>/, path+' misses guide navigation');
  assert.match(html, /<link rel="stylesheet" href="[^"]*\/css\/ed-blackbox\.css">/, path+' misses original layout');
}

const site = 'https://example.test/repository/';
const article = site+'blackbox/guides/ships/ship-dossiers/mandalay-exploration.html';
const scriptURL = site+'blackbox/design-system/js/scroll-progress.js';
const bridge = readFileSync('blackbox/design-system/js/scroll-progress.js','utf8');
function link(href, target='') {
  return { href, target, getAttribute: () => href, relList: { values: new Set(), add(...values) { for (const value of values) this.values.add(value); } } };
}
function run({url, embedded = false, links = []}) {
  const location = new URL(url);
  let replacement;
  location.replace = (href) => replacement = href;
  const window = {};
  window.top = embedded ? {} : window;
  runInNewContext(bridge, {
    URL, window, location,
    document: {
      currentScript: { src: scriptURL },
      documentElement: { classList: { add() {} } },
      getElementById: () => ({}), // Already has its progress bar; isolate the routing behavior.
      querySelectorAll: () => links
    }
  });
  return replacement && new URL(replacement);
}
const direct = run({url: article+'#section-engineering-plan'});
assert.equal(direct.pathname, '/repository/dark/');
assert.equal(direct.hash, '#guides');
assert.equal(direct.searchParams.get('guide'), 'guides/ships/ship-dossiers/mandalay-exploration.html');
assert.equal(direct.searchParams.get('section'), 'section-engineering-plan');

const related = link('../../engineering/engineering-manuals/modules.html#module-frame-shift-drive');
const newTab = link('./anaconda-exploration.html', '_blank');
const anchor = link('#section-engineering-plan');
const originalIndex = link('../../index.html#section-dossiers');
const external = link('https://coriolis.io/');
const localAsset = link('../../../images/ships/mandalay.jpg');
run({url: article+'?companion=light', embedded: true, links: [related, newTab, anchor, originalIndex, external, localAsset]});
assert.equal(related.target, '_top');
const route = new URL(related.href);
assert.equal(route.pathname, '/repository/light/');
assert.equal(route.searchParams.get('guide'), 'guides/engineering/engineering-manuals/modules.html');
assert.equal(route.searchParams.get('section'), 'module-frame-shift-drive');
assert.equal(newTab.target, '_blank');
assert.match(newTab.href, /^https:\/\/example\.test\/repository\/light\/\?guide=/);
assert.equal(anchor.href, '#section-engineering-plan');
assert.equal(anchor.target, '');
assert.equal(new URL(originalIndex.href).searchParams.get('guide'),'guides/index.html');
assert.equal(external.href, 'https://coriolis.io/');
assert.equal(external.target, '_blank');
assert.deepEqual(external.relList.values, new Set(['noopener', 'noreferrer']));
assert.equal(localAsset.href, '../../../images/ships/mandalay.jpg');
console.log('Guide routes verified for 198 translated guides and the imported index.');
