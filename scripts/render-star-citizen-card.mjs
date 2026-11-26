import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const context = {};
runInNewContext(readFileSync('star-citizen/bindings.js','utf8'),context);
const bindings = context.starCitizenFlightBindings;
const byId = Object.fromEntries(bindings.map(b => [b.id,b]));
const controller = readFileSync('star-citizen/dualsense-edge.svg','utf8')
  .replace(/^[\s\S]*?<\/defs>|<\/svg>\s*$/g,'')
  .replace(/fill="url\(#(?:shell|touch)\)"/g,'fill="#080f15"')
  .replace(/fill="#(?:263b50|304657|172432|283e50|263649|172638)"/g,'fill="#0a141d"')
  .replace(/fill="#162a3c"/g,'fill="#a3c5da"')
  .replace(/stroke="#(?:7c9eb7|739bb6|6898b4)"/g,'stroke="#b9d5e6"');
const colors = {M1:'#ffbc58',IM:'#d6adff',SC:'#73e5a1',MG:'#fa91c6',ML:'#f4de85',QT:'#69dcd5',EA:'#a2caff',VIEW:'#a7d2da'};
const symbols = {X2:'[2]',H:'[H]',LONG:'[H+]',CLICK:'[стик]',STD:'†'};
const W = 2360, H = 1380;
const out = [];
const esc = s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text = (x,y,s,size,fill='#dcebf5',weight=400) => out.push(`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}">${esc(s)}</text>`);
const line = (points,color='#526c7e',w=2.5) => out.push(`<polyline points="${points.map(a=>a.join(',')).join(' ')}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`);
const dot = (x,y,fill='#c1e0ef') => out.push(`<circle cx="${x}" cy="${y}" r="4" fill="${fill}"/>`);
const box = [
  ['missile-mode',49,178,[]],
  ['l2',520,160,[[702,334],[702,350],[826,428]]],
  ['create',952,147,[[919,251],[919,380],[968,404]]],
  ['options',1290,221,[[1243,299],[1243,382],[1319,414]]],
  ['r2',1620,153,[[1620,307],[1516,307],[1430,382]]],
  ['l1',466,398,[[652,447],[720,447]]],
  ['r1',1664,384,[[1654,414],[1587,414],[1525,478]]],
  ['l3',52,464,[[548,487],[568,487],[630,581],[715,581],[785,661]]],
  ['up',52,727,[[460,758],[588,758],[658,675],[696,675]]],
  ['left',52,851,[[460,881],[600,881],[663,796],[710,796]]],
  ['triangle',1780,546,[[1768,577],[1693,577],[1655,615],[1545,615]]],
  ['circle',1800,671,[[1787,700],[1680,700],[1633,653],[1510,653]]],
  ['square',1780,837,[[1768,861],[1670,861],[1575,768],[1515,768]]],
  ['cross',1792,982,[[1780,1006],[1652,1006],[1567,936],[1515,936]]],
  ['down',320,1085,[[578,1067],[578,1034],[764,930],[832,930]]],
  ['right',802,1085,[[914,1068],[914,960],[979,893]]],
  ['r3',1348,1066,[[1340,1055],[1340,941],[1263,859]]],
];
const x0=712, y0=470, scale=1.08;
const anchor = b => b.point.map((v,i)=>Math.round((i?y0:x0)+v*scale));
function action(x,y,[tagText,label]){
 const tags=tagText.split(' ').filter(Boolean);
 const modes=tags.filter(k=>colors[k]);
 const suffix=tags.filter(k=>symbols[k]).map(k=>symbols[k]).join(' ');
 const parts=[...modes.map(k=>[k,colors[k],750]),[label,'#dcebf5',400]];
 if(suffix)parts.push([suffix,'#abc0d0',650]);
 out.push(`<text x="${x}" y="${y}" font-size="18" xml:space="preserve">${parts.map(([s,c,w],i)=>`<tspan fill="${c}" font-weight="${w}">${i?'  ':''}${esc(s)}</tspan>`).join('')}</text>`);
}
text(50,50,'STAR CITIZEN  /  УПРАВЛЕНИЕ КОРАБЛЁМ',19,'#8faec2',700);
text(49,103,'DualSense Edge',43,'#e8f4fb',750);
text(1880,98,'ПОЛЁТ  ·  ПРОФИЛЬ CDFv2',24,'#79d9fb',700);
line([[50,120],[2310,120]],'#324b5d',2);
out.push(`<g transform="translate(${x0} ${y0}) scale(${scale})">${controller}</g>`);
// Draw the leaders over the outline so they stay traceable inside the controller.
for(const [id,x,y,via] of box){
 const b=byId[id];
 if(b.point) {
  const end=anchor(b);
  line([...via,end]);
  dot(...end);
 }
 text(x,y,b.label+(id==='missile-mode'?'  /  оба бампера':id==='l3'?'  /  левый стик':id==='r3'?'  /  правый стик':''),23,id==='l1'||id==='missile-mode'?colors.M1:'#86dcfa',750);
 b.actions.forEach((a,i)=>action(x,y+29+i*25,a));
}
line([[50,1248],[2310,1248]],'#324b5d',2);
const legend=[
 ['M1','Зажать L1',49],['IM','Взаимодействие',290],['SC','Сканирование',585],['MG','Добыча',864],['ML','Ракеты',1063],['QT','Квантовый режим',1255],['EA','Арена',1583],['VIEW','Свободный обзор',1769]
];
for(const [key,meaning,x] of legend){text(x,1284,key,19,colors[key],750);text(x+(key==='VIEW'?64:43),1284,meaning,18);}
for(const [s,x] of [['[2] Двойное нажатие',49],['[H] Удерживать',345],['[H+] Долго удерживать',588],['[стик] Нажать стик',922],['† По умолчанию (вне экспорта)',1230]])text(x,1332,s,18,'#abc0d0');
writeFileSync('star-citizen/dualsense-edge-cdfv2-ru.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="DejaVu Sans,sans-serif"><title>Star Citizen: управление полётом DualSense Edge, CDFv2</title><rect width="100%" height="100%" fill="#050a0e"/>\n${out.join('\n')}\n</svg>\n`);
