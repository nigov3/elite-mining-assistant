import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const catalog=JSON.parse(readFileSync('data/blackbox-guides.json','utf8'));
const sections=JSON.parse(readFileSync('data/blackbox-search-sections.json','utf8'));
const js=readFileSync('guide-search.js','utf8');
const {rankCompanionGuides,guideSearchTopics}=runInNewContext(js+'\n;({rankCompanionGuides,guideSearchTopics})');
assert.equal(Object.keys(sections).length,38);
for(const [path,anchors] of Object.entries(sections)){
 assert(catalog.some(entry=>entry.path===path));
 const html=readFileSync('blackbox/'+path,'utf8');
 for(const [anchor,label] of anchors){
  assert(html.includes('id="'+anchor+'"'),path+'#'+anchor);
  assert(label.trim());
 }
}
for(const [path,anchor] of guideSearchTopics){
 assert(catalog.some(entry=>entry.path===path),path);
 if(anchor)assert(readFileSync('blackbox/'+path,'utf8').includes('id="'+anchor+'"'),path+'#'+anchor);
}
const find=query=>rankCompanionGuides(catalog,sections,query);
for(const query of ['ФСД Стражей','ускоритель Стражей','Guardian FSD Booster']){
 assert.equal(find(query)[0]?.section,'module-guardian-fsd-booster',query);
}
assert.equal(find('Как открыть ФСД Стражей?')[0]?.section,'step-build-guardian-fsd-booster');
assert.equal(find('рамочно-сместительный двигатель')[0]?.section,'module-frame-shift-drive');
assert.equal(find('Экзобиология')[0]?.entry.path,'guides/systems/activity-guides/exploration.html');
assert.equal(find('где фармить александрит')[0]?.entry.path,'guides/systems/activity-guides/mining.html');
assert.equal(find('кольца и зоны концентрации')[0]?.entry.path,'guides/systems/activity-guides/mining.html');
assert.equal(find('МанДеЛай')[0]?.ship,'Mandalay');
assert.equal(find('Анаконда')[0]?.guides.length,7);
assert.match(find('Анаконда бой')[0]?.entry.path,/anaconda-combat\.html$/);
assert.match(find('Mandalay exploration')[0]?.entry.path,/mandalay-exploration\.html$/);
assert.equal(find('Кобра мк 5')[0]?.ship,'Cobra Mk V');
assert.equal(find('неизвестнощука').length,0);
assert.equal(find('что где как').length,0);
assert.equal(find('ФСД Стражей кадмий омлет').length,0);
console.log('Knowledge Base ranks exact, bilingual and topic matches and only links to valid guide sections.');
