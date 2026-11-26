import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const context = {};
runInNewContext(readFileSync('star-citizen/bindings.js','utf8'), context);
const bindings = context.starCitizenFlightBindings;
const control = readFileSync('star-citizen/dualsense-edge.svg','utf8').replace(/^<svg[^>]*>|<\/svg>\s*$/g,'').trim();
const chips = {
  M1: ['M1','Зажать L1','#ffbe58','#382a19'],
  IM: ['IM','Режим взаимодействия','#d6adff','#302346'],
  SC: ['SC','Режим сканирования','#73e5a1','#143525'],
  MG: ['MG','Режим добычи','#ff8ac0','#382339'],
  ML: ['ML','Ракетный режим','#f2e387','#39351f'],
  QT: ['QT','Квантовый режим','#52ddd7','#13353a'],
  EA: ['EA','Арена','#9ec8ff','#203451'],
  VIEW: ['VIEW','Свободный обзор','#a7d2da','#20353e'],
  CLICK: ['Нажать стик','','#d5e1ee','#223142'],
  H: ['Удерживать','','#d5e1ee','#223142'],
  LONG: ['Долго держать','','#f9b2b5','#3b2631'],
  TAP: ['Коротко','','#d5e1ee','#223142'],
  X2: ['Дважды','','#d5e1ee','#223142'],
  STD: ['По умолчанию','','#bbcbdc','#1f2d3b'],
};
const W = 1680;
const out = [];
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const r = (x,y,w,h,fill,stroke='none',radius=10) => out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`);
const t = (x,y,s,size,fill='#edf5fd',weight=400,anchor='start') => out.push(`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`);
const wrap = (s,len) => s.split(' ').reduce((a,w) => {
  if (!a.length || a.at(-1).length + w.length + 1 > len) a.push(w);
  else a[a.length-1] += ' ' + w;
  return a;
},[]);
const badgeWidth = key => chips[key][0].length * 9 + 17;
const badge = (x,y,key) => {
  const [label,,tone,background] = chips[key];
  const width = badgeWidth(key);
  r(x,y,width,24,background,tone,6);
  t(x + width/2,y+17,label,14,tone,700,'middle');
  return width;
};
const chipRows = tags => {
  let width = 0;
  const lines = [];
  for (const tag of tags.split(' ').filter(Boolean)) {
    if (!lines.length || width + badgeWidth(tag) > 350) { lines.push([]); width = 0; }
    lines.at(-1).push(tag);
    width += badgeWidth(tag) + 7;
  }
  return lines;
};
const rows = bindings.map(b => {
  const acts = b.actions.map(([tags,label]) => ({ title: wrap(label,31), detail: chipRows(tags) }));
  return { b, acts, height: 68 + acts.reduce((h,a)=>h+22*a.title.length+30*a.detail.length+9,0) };
});
r(49,43,6,83,'#62d9f4');
t(69,64,'STAR CITIZEN / УПРАВЛЕНИЕ КОРАБЛЁМ',19,'#62d9f4',700);
t(69,113,'DualSense Edge',45,'#edf5fd',700);
t(W-49,110,'ПРОФИЛЬ CDFv2',24,'#62d9f4',700,'end');
r(49,149,1582,386,'#0d1c2b','#2a4458',18);
out.push(`<g transform="translate(579 176) scale(.66)">${control}</g>`);
t(78,201,'ЛЕВЫЙ СТИК',17,'#62d9f4',700);
t(78,240,'Тяга вперёд / назад',23);
t(78,275,'L3: форсаж',21);
t(78,310,'Наклон влево / вправо: крен',21);
t(78,345,'L1 + стик: боковое смещение',20);
t(78,373,'и подъём / спуск',20);
t(1163,190,'ЦВЕТНЫЕ ОБОЗНАЧЕНИЯ',17,'#62d9f4',700);
['M1','IM','SC','MG','ML','QT','EA','VIEW'].forEach((key,i) => {
  const yy = 204 + i*32;
  const ww = badge(1163,yy,key);
  t(1163+ww+12,yy+18,chips[key][1],18,'#e2edf7');
});
t(1163,490,'«По умолчанию» — из настроек игры 4.10,',16,'#a9c4d7');
t(1163,513,'не записано в экспорте CDFv2.',16,'#a9c4d7');
let y = 557;
const sequence = ['l2','l1','r1','r2','l3','r3','create','options','triangle','circle','square','cross','up','left','down','right','missile-mode'];
const ordered = sequence.map(id=>rows.find(o=>o.b.id===id));
for(let first=0;first<ordered.length;first+=4){
  const batch=ordered.slice(first,first+4);
  const h=Math.max(...batch.map(a=>a.height));
  for(let col=0;col<batch.length;col++){
    const {b,acts}=batch[col], x=49+col*400;
    r(x,y,382,h,'#101d2a','#294353',12);
    t(x+15,y+31,b.label+'  /  '+b.name,19,'#62d9f4',700);
    let yy=y+57;
    for(const a of acts){
      for(const line of a.title){t(x+15,yy,line,18);yy+=22;}
      for(const line of a.detail){
        let xx=x+15;
        for(const key of line) xx+=badge(xx,yy-14,key)+7;
        yy+=30;
      }
      yy+=9;
    }
  }
  y+=h+18;
}
t(49,y+11,'Xbox → PS5: A = ×   B = ○   X = □   Y = △',17,'#a9c4d7',700);
const H=y+40;
writeFileSync('star-citizen/dualsense-edge-cdfv2-ru.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="DejaVu Sans, sans-serif"><title>Star Citizen: управление полётом DualSense Edge, CDFv2</title><rect width="100%" height="100%" fill="#07101c"/>\n${out.join('\n')}\n</svg>\n`);
console.log(W,H);
