import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const app = readFileSync('app.js', 'utf8');
const entries = JSON.parse(readFileSync('data/blackbox-guides.json', 'utf8'));
const functions = app.slice(app.indexOf('function splitGuideCatalog('),app.indexOf('function guideElement('));
const result = runInNewContext(`
  const dossierPath='/ship-dossiers/';
  ${functions}
  const catalog=splitGuideCatalog(entries);
  ({
   shipCount:catalog.ships.length,
   mainCount:catalog.main.length,
   paths:[...catalog.main,...catalog.ships.flatMap(ship=>ship.guides)].map(guide=>guide.path),
   anaconda:catalog.ships.find(ship=>ship.title==='Anaconda').guides.length,
   explore:filterGuideCatalog(catalog,'','Корабли','Исследование').ships,
   search:filterGuideCatalog(catalog,'  mandalay   исследование ', '', '').ships,
   engineers:filterGuideCatalog(catalog,'','Инженеры',''),
   empty:filterGuideCatalog(catalog,':definitely no match:', '', '').ships.length
  })
`,{entries});
assert.equal(result.shipCount,48);
assert.equal(result.mainCount,38);
assert.deepEqual(new Set(result.paths),new Set(entries.map(e=>e.path)));
assert.equal(result.paths.length,198);
assert.equal(result.anaconda,7);
assert.equal(result.explore.length,23);
assert(result.explore.every(ship=>ship.guides.some(e=>e.role==='Исследование')));
assert.equal(result.search.length,1);
assert.equal(result.search[0].title,'Mandalay');
assert.equal(result.search[0].guides.length,2);
assert.equal(result.engineers.ships.length,0);
assert.equal(result.engineers.main.length,9);
assert.equal(result.empty,0);
console.log('Catalog groups 160 dossiers into 48 ships and preserves all 38 main guides.');
