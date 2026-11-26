import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const ctx = {};
runInNewContext(readFileSync('star-citizen/bindings.js','utf8'), ctx);
const bindings = ctx.starCitizenFlightBindings;
const control = readFileSync('star-citizen/dualsense-edge.svg','utf8').replace(/^<svg[^>]*>|<\/svg>\s*$/g,'').trim();
const chips = ctx.starCitizenActionBadges;
const W = 1470, pad = 24, card = 348, step = 358;
const out = [];
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const r = (x,y,w,h,fill,stroke='none',radius=9) =>
  out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`);
const t = (x,y,s,size,fill='#edf5fd',weight=400,anchor='start') =>
  out.push(`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`);
const line = (x,y,w,stroke) => out.push(`<path d="M${x} ${y}h${w}" stroke="${stroke}"/>`);
const widths = { M1:38, IM:34, SC:34, MG:38, ML:35, QT:34, EA:34, VIEW:54,
  X2:33, H:66, LONG:57, CLICK:49, CLICK_TAP:120, STD:22 };
function badge(x,y,key) {
  const [full,,tone,background] = chips[key];
  const label = ctx.starCitizenCompactLabels[key] || full, width = widths[key];
  r(x,y-16,width,22,background,key === 'STD' ? '#536577' : tone,5);
  t(x + width/2,y,label,13,tone,700,'middle');
}
const legend = (key,note,x,y) => {
  badge(x,y,key);
  t(x+128,y,note,17,'#d9e7f4');
};
r(pad,28,5,66,'#62d9f4');
t(pad+16,49,'STAR CITIZEN / УПРАВЛЕНИЕ КОРАБЛЁМ',16,'#62d9f4',700);
t(pad+16,87,'DualSense Edge',38,'#edf5fd',700);
t(W-pad,85,'ПРОФИЛЬ CDFv2',21,'#62d9f4',700,'end');
r(pad,110,W-pad*2,259,'#0d1c2b','#2a4458',14);
out.push(`<g transform="translate(540 123) scale(.45)">${control}</g>`);
t(44,143,'КАК НАЖИМАТЬ',16,'#62d9f4',700);
t(44,173,'Без метки нажатия: нажать один раз',17,'#d9e7f4');
[['X2','Двойное нажатие'],['H','Удержание'],['LONG','Длительное удержание'],
 ['CLICK','Нажатие стика'],['CLICK_TAP','Короткое нажатие стика'],
 ['STD','По умолчанию, не из экспорта']].forEach(([key,def],i) => legend(key,def,44,201+i*27));
t(918,143,'МОДИФИКАТОР И РЕЖИМЫ',16,'#62d9f4',700);
['M1','IM','SC','MG','ML','QT','EA','VIEW'].forEach((key,i) => {
  const x=918+Math.floor(i/4)*264, y=179+i%4*39;
  badge(x,y,key);
  t(x+58,y,({IM:'Взаимодействие',SC:'Сканирование',MG:'Добыча'})[key] || chips[key][1],17,'#d9e7f4');
});

function action(a,x,y) {
  out.push('<g data-action="true">');
  let left=x;
  for (const key of a.keys) {
    badge(left,y,key);
    left+=widths[key]+5;
  }
  t(left+(a.keys.length ? 6 : 0),y,a.label,17);
  out.push('</g>');
}
let y=386;
const rows = bindings.map(b => ({ b, acts:ctx.starCitizenCompactActions(b) }));
for(let first=0;first<rows.length;first+=4){
  const batch=rows.slice(first,first+4);
  const wide = batch.length === 1 && batch[0].b.id === 'missile-mode';
  const h=65+Math.max(...batch.map(a=>wide ? 1 : a.acts.length))*31;
  for(let col=0;col<batch.length;col++){
    const {b,acts}=batch[col], x=pad+col*step, w=wide ? W-pad*2 : card;
    out.push(`<g data-control="${b.id}">`);
    r(x,y,w,h,'#101d2a','#294353',12);
    t(x+12,y+27,b.label+' / '+b.name,18,'#62d9f4',700);
    line(x+12,y+38,w-24,'#344c60');
    acts.forEach((a,i) => {
      const ax=x+12+(wide ? i*470 : 0), ay=y+61+(wide ? 0 : i*31);
      if (i>0 && !wide) line(x+12,ay-21,w-24,'#23394a');
      action(a,ax,ay);
    });
    out.push('</g>');
  }
  y+=h+14;
}
const H=y+13;
writeFileSync('star-citizen/dualsense-edge-cdfv2-ru.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="DejaVu Sans, sans-serif"><title>Star Citizen: управление полётом DualSense Edge, CDFv2</title><rect width="100%" height="100%" fill="#07101c"/>\n${out.join('\n')}\n</svg>\n`);
console.log(W,H);
