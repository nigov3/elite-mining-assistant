import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import { runInNewContext } from 'node:vm';

const read = path => readFileSync(path, 'utf8');
const { columns, rows } = JSON.parse(read('star-citizen/pledge-vehicles-ru.json'));
assert.equal(columns.length, 31);
assert.equal(rows.length, 252);
assert(rows.every(row => row.length === columns.length));
assert.equal(new Set(rows.map(row => row[0])).size, 252);
assert.equal(rows.filter(row => row[2] === 'Космический корабль').length, 206);
assert.equal(rows.filter(row => row[2] === 'Наземный транспорт').length, 36);
assert.equal(rows.filter(row => row[2] === 'Гравитационный транспорт').length, 10);
const env = { URL, document: { currentScript: { src: 'https://example.test/star-citizen/ships.js' } } };
runInNewContext(read('star-citizen/ships.js'), env);
const { selectRows, format } = env.StarCitizenShips;
const titan = selectRows(rows, { query: 'titan лёгкий', type: 'Космический корабль' })[0];
assert.equal(titan[0], 'Avenger Titan');
assert.equal(titan[14], 1324325);
assert.equal(titan[23], 8);
assert.equal(titan[25], 1425);
assert.equal(titan[30], 'Обновление 1.0.0');
assert.equal(rows.find(row => row[0] === 'Valkyrie Liberator')[25], null);
assert.equal(rows.find(row => row[0] === 'Prospector')[23], 0);
assert.equal(format(null), '—');
assert.equal(format(0), '0');
assert.equal(selectRows(rows, { query: 'таких-кораблей-нет' }).length, 0);
assert(selectRows(rows, { career: 'Промышленность', ready: 'Доступен в игре' }).some(row => row[0] === 'Golem'));
const sorted = selectRows(rows, { column: 14, descending: true });
assert.equal(sorted.at(-1)[14], null);
for (let i = 1; i < sorted.length && sorted[i][14] != null; i++) assert(sorted[i - 1][14] >= sorted[i][14]);
for (const theme of ['dark','light']) {
  const html = read(theme + '/index.html');
  assert(html.indexOf('star-citizen/ships.js') < html.indexOf('../app.js'));
  assert(html.includes('star-citizen/ships.css'));
}
assert(read('app.js').includes("which==='star-citizen-ships'"));
assert(read('star-citizen/controls.js').includes('href="#star-citizen-ships"'));
console.log('Star Citizen pledge catalog: 252 records, 31 columns, filters and numeric sorting verified.');
