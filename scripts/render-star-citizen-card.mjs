import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const context = {};
runInNewContext(readFileSync('star-citizen/bindings.js','utf8'), context);
const bindings = context.starCitizenFlightBindings;
const control = readFileSync('star-citizen/dualsense-edge.svg','utf8').replace(/^<svg[^>]*>|<\/svg>\s*$/g,'').trim();
const chips = context.starCitizenActionBadges;
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
// DejaVu Sans Bold at 15px, with padding on both sides.
const widths = { M1:44, IM:39, SC:40, MG:46, ML:43, QT:41, EA:40, VIEW:62,
  PRESS:96, TAP:182, X2:173, H:119, LONG:228, CLICK:149, CLICK_TAP:235, STD:146 };
const badgeWidth = key => widths[key];
const badge = (x,y,key) => {
  const [label,,tone,background] = chips[key];
  const width = badgeWidth(key);
  r(x,y,width,25,background,tone,6);
  t(x + width/2,y+18,label,15,tone,700,'middle');
  return width;
};
const chipRows = tags => {
  let width = 0;
  const lines = [];
  for (const tag of tags) {
    if (!lines.length || width + badgeWidth(tag) > 350) { lines.push([]); width = 0; }
    lines.at(-1).push(tag);
    width += badgeWidth(tag) + 7;
  }
  return lines;
};
const rows = bindings.map(b => {
  const acts = b.actions.map(([tags,label]) => ({
    title: wrap(label,31), detail: chipRows(context.starCitizenDisplayTags(tags, label))
  }));
  return { b, acts, height: 68 + acts.reduce((h,a)=>h+22*a.title.length+31*a.detail.length+11,0) };
});
r(49,43,6,83,'#62d9f4');
t(69,64,'STAR CITIZEN / УПРАВЛЕНИЕ КОРАБЛЁМ',19,'#62d9f4',700);
t(69,113,'DualSense Edge',45,'#edf5fd',700);
t(W-49,110,'ПРОФИЛЬ CDFv2',24,'#62d9f4',700,'end');
r(49,149,1582,386,'#0d1c2b','#2a4458',18);
out.push(`<g transform="translate(579 176) scale(.66)">${control}</g>`);
t(78,201,'ЛЕВЫЙ СТИК',17,'#62d9f4',700);
t(78,240,'Крен: наклон влево / вправо',21);
t(78,273,'Тяга: наклон вперёд / назад',21);
t(78,306,'Форсаж: нажатие L3',21);
t(78,339,'L1 + наклон: смещение вбок',21);
t(78,372,'или подъём / спуск',21);
t(1163,190,'ЦВЕТНЫЕ ОБОЗНАЧЕНИЯ',17,'#62d9f4',700);
['M1','IM','SC','MG','ML','QT','EA','VIEW'].forEach((key,i) => {
  const yy = 204 + i*32;
  badge(1163,yy,key);
  t(1237,yy+18,chips[key][1],18,'#e2edf7');
});
t(1163,490,'«По умолчанию» — из настроек игры 4.10,',16,'#a9c4d7');
t(1163,513,'не записано в экспорте CDFv2.',16,'#a9c4d7');
function renderAction(a, x, y) {
  for (const line of a.title) { t(x,y,line,18); y+=22; }
  for (const line of a.detail) {
    let xx=x;
    for (const key of line) xx+=badge(xx,y-15,key)+7;
    y+=31;
  }
  return y+11;
}
let y = 557;
for(let first=0;first<rows.length;first+=4){
  const batch=rows.slice(first,first+4);
  const wide = batch.length === 1 && batch[0].b.id === 'missile-mode';
  const h=wide ? Math.max(...batch[0].acts.map(a => 68+22*a.title.length+31*a.detail.length+11))
    : Math.max(...batch.map(a=>a.height));
  for(let col=0;col<batch.length;col++){
    const {b,acts}=batch[col], x=49+col*400, w=wide ? 1582 : 382;
    out.push(`<g data-control="${b.id}">`);
    r(x,y,w,h,'#101d2a','#294353',12);
    t(x+16,y+31,b.label+' / '+b.name,19,'#62d9f4',700);
    out.push(`<path d="M${x+16} ${y+43}h${w-32}" stroke="#294353"/>`);
    let yy=y+65;
    if (wide) {
      acts.forEach((a,i) => renderAction(a,x+16+520*i,yy));
    } else {
      for (const a of acts) yy=renderAction(a,x+16,yy);
    }
    out.push('</g>');
  }
  y+=h+18;
}
t(49,y+11,'Xbox → PS5: A = ×   B = ○   X = □   Y = △',17,'#a9c4d7',700);
const H=y+40;
writeFileSync('star-citizen/dualsense-edge-cdfv2-ru.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="DejaVu Sans, sans-serif"><title>Star Citizen: управление полётом DualSense Edge, CDFv2</title><rect width="100%" height="100%" fill="#07101c"/>\n${out.join('\n')}\n</svg>\n`);
console.log(W,H);
