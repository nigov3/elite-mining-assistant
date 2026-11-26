import { readFileSync, existsSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import { runInNewContext } from 'node:vm';

const read = path => readFileSync(path, 'utf8');
const context = {};
runInNewContext(read('star-citizen/bindings.js'), context);
const bindings = context.starCitizenFlightBindings;
assert.equal(bindings.length, 17);
assert.equal(new Set(bindings.map(binding => binding.id)).size, bindings.length);
assert.equal(bindings.filter(binding => binding.point).length, 16);
assert.equal(bindings.flatMap(binding => binding.actions).length, 64);
for (const binding of bindings) {
  if (binding.point) assert(binding.point[0] > 0 && binding.point[0] < 822 &&
    binding.point[1] > 0 && binding.point[1] < 480);
  for (const [tags, action] of binding.actions) {
    assert(!tags || tags.split(' ').every(tag => ['M1','IM','SC','MG','ML','EA','VIEW','QT','CLICK','H','LONG','TAP','X2','STD'].includes(tag)));
    assert(action.length > 0);
  }
}
assert(bindings.find(binding => binding.id === 'square').actions.some(([, action]) => action.includes('квантовый')));
assert(bindings.find(binding => binding.id === 'cross').actions.some(([, action]) => action.includes('ложную цель')));
const actionsOf = id => bindings.find(binding => binding.id === id).actions;
assert(actionsOf('l3').some(([tags,label]) => !tags && label.includes('крен')));
assert(actionsOf('l3').some(([tags,label]) => tags === 'STD' && label.includes('тяга')));
assert(actionsOf('l3').some(([tags,label]) => tags === 'CLICK STD' && label === 'Форсаж'));
assert(actionsOf('down')[0][1].includes('шасси'));
assert(actionsOf('down')[1][0] === 'X2' && actionsOf('down')[1][1].includes('диспетчера'));
assert(actionsOf('down')[2][1] === 'Автопосадка');
assert(actionsOf('down')[3][0] === 'M1');
assert(actionsOf('down')[4][0].startsWith('IM'));
assert(actionsOf('missile-mode').some(([tags,label]) => tags === 'LONG' && label.includes('самоуничтожение')));
assert.equal(bindings.flatMap(binding => binding.actions).filter(([tags]) =>
  tags.split(' ').includes('STD')).length, 28);
for (const theme of ['dark','light']) {
  const html = read(theme + '/index.html');
  assert(html.indexOf('star-citizen/bindings.js') < html.indexOf('star-citizen/controls.js'));
  assert(html.indexOf('star-citizen/controls.js') < html.indexOf('../app.js'));
  assert(html.includes('star-citizen/controls.css'));
}
for (const asset of ['dualsense-edge.svg','dualsense-edge-cdfv2-ru.svg','xbox-original-ru.svg','keyboard-original-ru.svg']) {
  assert(existsSync('star-citizen/' + asset));
  assert(read('star-citizen/controls.js').includes(asset));
}
console.log('Star Citizen route assets and 17 control bindings verified.');
