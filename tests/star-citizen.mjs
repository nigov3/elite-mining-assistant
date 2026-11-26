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
assert.equal(bindings.flatMap(binding => binding.actions).length, 65);
for (const binding of bindings) {
  if (binding.point) assert(binding.point[0] > 0 && binding.point[0] < 822 &&
    binding.point[1] > 0 && binding.point[1] < 480);
  for (const [tags, action] of binding.actions) {
    assert(!tags || tags.split(' ').every(tag => ['M1','IM','SC','MG','ML','EA'].includes(tag)));
    assert(action.length > 0);
  }
}
assert(bindings.find(binding => binding.id === 'square').actions.some(([, action]) => action.includes('квантовый')));
assert(bindings.find(binding => binding.id === 'cross').actions.some(([, action]) => action.includes('контрмеры')));
for (const theme of ['dark','light']) {
  const html = read(theme + '/index.html');
  assert(html.indexOf('star-citizen/bindings.js') < html.indexOf('star-citizen/controls.js'));
  assert(html.indexOf('star-citizen/controls.js') < html.indexOf('../app.js'));
  assert(html.includes('star-citizen/controls.css'));
}
for (const asset of ['dualsense-edge.svg','star-citizen-dualsense-edge-ru.webp','xbox-original-ru.svg','keyboard-original-ru.svg']) {
  assert(existsSync('star-citizen/' + asset));
  assert(read('star-citizen/controls.js').includes(asset));
}
console.log('Star Citizen route assets and 17 control bindings verified.');
