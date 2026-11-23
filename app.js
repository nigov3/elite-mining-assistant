const raw="Золото|Gold|47610|Металлические, металлообогащённые|Поверхностная, глубинная|Металлы\nКобальт|Cobalt|3762|Каменные|Поверхностная, глубинная*|Металлы\nОсмий|Osmium|45198|Металлические, металлообогащённые|Поверхностная, глубинная*|Металлы\nПалладий|Palladium|50639|Металлические|Поверхностная, глубинная*|Металлы\nПлатина|Platinum|58263|Металлические|Подрыв ядра, поверхностная, глубинная|Металлы\nПразеодим|Praseodymium|8620|Металлические, металлообогащённые|Поверхностная, глубинная*|Металлы\nСамарий|Samarium|25852|Металлические, металлообогащённые|Поверхностная, глубинная*|Металлы\nСеребро|Silver|37223|Металлические, металлообогащённые|Поверхностная, глубинная*|Металлы\nТорий|Thorium|11317|Металлические|Поверхностная, глубинная*|Металлы\nАлександрит|Alexandrite|217277|Металлообогащённые, ледяные, каменные|Подрыв ядра, реже поверхностная|Минералы\nБенитоит|Benitoite|149395|Металлообогащённые, каменные||Минералы\nБертрандит|Bertrandite|18817|Металлические, металлообогащённые||Минералы\nБоксит|Bauxite|1140|Каменные||Минералы\nБромеллит|Bromellite|30424|Ледяные|Поверхностная, глубинная|Минералы\nГаллит|Gallite|11915|Металлические, металлообогащённые, каменные||Минералы\nГидроксид лития|Lithium Hydroxide|5673|Ледяные|Поверхностная, глубинная|Минералы\nГрандидьерит|Grandidierite|197292|Металлообогащённые, ледяные||Минералы\nИндит|Indite|11389|Металлические, металлообогащённые, каменные|Поверхностная, глубинная|Минералы\nКлатрат метана|Methane Clathrate|1650|Ледяные|Поверхностная, глубинная|Минералы\nКолтан|Coltan|6163|Металлообогащённые, каменные||Минералы\nКристаллы моногидрата метанола|Methanol Monohydrate Crystals|2478|Ледяные|Поверхностная, глубинная|Минералы\nЛепидолит|Lepidolite|771|Металлообогащённые, каменные||Минералы\nМонацит|Monazite|200975|Металлообогащённые, каменные|Подрыв ядра|Минералы\nМусгравит|Musgravite|198613|Каменные|Подрыв ядра|Минералы\nНизкотемпературные алмазы|Low Temperature Diamonds|106353|Ледяные|Подрыв ядра, реже поверхностная|Минералы\nОпалы бездны|Void Opals|135284|Ледяные|Подрыв ядра|Минералы\nПейнит|Painite|53016|Металлические, металлообогащённые|Все способы|Минералы\nРодплумсайт|Rhodplumsite|176839|Металлообогащённые||Минералы\nРутил|Rutile|2083|Каменные||Минералы\nСерендибит|Serendibite|172711|Металлообогащённые, каменные||Минералы\nУранинит|Uraninite|2957|Металлообогащённые, каменные||Минералы\nВода|Water|278|Ледяные|Поверхностная, глубинная|Химикаты\nЖидкий кислород|Liquid Oxygen|1474|Ледяные|Поверхностная, глубинная|Химикаты\nПероксид водорода|Hydrogen Peroxide|3160|Ледяные|Поверхностная, глубинная|Химикаты\nТритий|Tritium|51707|Ледяные|Поверхностная, глубинная|Химикаты";
const resources=raw.split('\n').map(line=>line.split('|'));let descending=true,tab='resources';
const groups=[['A','Сканер обнаружения','Подробный сканер поверхности'],['B','Импульсная волна','Дрон «Геологоразведчик»'],['C','Проходочный лазер','Дрон «Сборщик»'],['D','Абразивный бластер','Дрон «Сборщик»'],['E','Вытесняющая ракета','Дрон «Сборщик»'],['F','Сейсмический заряд','Дрон «Сборщик»'],['G','—','—'],['H','—','—']];
const root=document.getElementById('app');root.innerHTML='<header><div><h1>Elite Dangerous Mining Assistant</h1><div class="muted">Справочник добычи ресурсов</div></div><nav><a id="theme-switch" href="../light/">☀️ Светлая тема</a></nav></header><div class="tabs"><button id="res" class="active">Ресурсы</button><button id="fire">Огневые группы</button></div><section class="panel" id="content"></section>';
const switcher=document.getElementById('theme-switch');if(document.body.dataset.theme==='light'){switcher.href='../dark/';switcher.textContent='🌙 Тёмная тема'}
const content=document.getElementById('content');document.getElementById('res').onclick=()=>show('resources');document.getElementById('fire').onclick=()=>show('groups');
const galaxyTab=document.createElement('button');galaxyTab.id='galaxy';galaxyTab.textContent='Галактика';document.querySelector('.tabs').appendChild(galaxyTab);galaxyTab.onclick=()=>show('galaxy');
const miningTab=document.createElement('button');miningTab.id='mining';miningTab.textContent='Точки добычи';document.querySelector('.tabs').appendChild(miningTab);miningTab.onclick=()=>show('mining');
function show(which){tab=which;galaxyTab.classList.toggle('active',which==='galaxy');miningTab.classList.toggle('active',which==='mining');document.getElementById('res').classList.toggle('active',which==='resources');document.getElementById('fire').classList.toggle('active',which==='groups');if(which==='galaxy'){showGalaxy();return}if(which==='mining'){showMining();return}if(which==='groups'){content.innerHTML='<h2>Огневые группы</h2><div class="tablewrap"><table><thead><tr><th>Группа</th><th>Основной огонь</th><th>Вспомогательный огонь</th></tr></thead><tbody>'+groups.map(g=>'<tr>'+g.map(v=>'<td>'+v+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';return}
content.innerHTML='<h2>Справочник ресурсов</h2><input id="q" style="width:100%" placeholder="Поиск по русскому или английскому названию"><div class="filters"><select id="cat"><option value="">Все категории</option><option>Металлы</option><option>Минералы</option><option>Химикаты</option></select><select id="ring"><option value="">Все кольца</option><option>Металлические</option><option>Металлообогащённые</option><option>Каменные</option><option>Ледяные</option></select><button id="sort">Дорогие сначала</button></div><p class="muted" id="count"></p><div class="tablewrap"><table><thead><tr><th>Ресурс</th><th class="price">Кр./т</th><th>Кольца и добыча</th></tr></thead><tbody id="rows"></tbody></table></div><button id="copy" style="margin-top:18px">Скопировать таблицу</button><small class="muted">* Пометка «проверить» в исходных данных. Цены справочные, не текущие рыночные.</small>';['q','cat','ring'].forEach(id=>document.getElementById(id).addEventListener(id==='q'?'input':'change',render));document.getElementById('sort').onclick=()=>{descending=!descending;document.getElementById('sort').textContent=descending?'Дорогие сначала':'Дешёвые сначала';render()};document.getElementById('copy').onclick=()=>{const list=filtered();navigator.clipboard.writeText(list.map(r=>r.join('\t')).join('\n')).then(()=>alert('Скопировано')).catch(()=>alert('Не удалось скопировать'))};render()}
function filtered(){const q=document.getElementById('q').value.toLowerCase(),c=document.getElementById('cat').value,r=document.getElementById('ring').value;return resources.filter(x=>(!q||(x[0]+' '+x[1]).toLowerCase().includes(q))&&(!c||x[5]===c)&&(!r||x[3].split(', ').includes(r))).sort((a,b)=>descending?Number(b[2])-Number(a[2]):Number(a[2])-Number(b[2]))}
function render(){const list=filtered();document.getElementById('count').textContent='Найдено: '+list.length+' из '+resources.length;document.getElementById('rows').innerHTML=list.map(x=>'<tr><td><strong>'+x[0]+'</strong><div class="sub">'+x[1]+'</div></td><td class="price"><span class="price-tag '+(Number(x[2])>=100000?'price-high':Number(x[2])>=30000?'price-mid':'price-low')+'">'+Number(x[2]).toLocaleString('ru-RU')+'</span></td><td>'+x[3]+'<div class="sub">'+(x[4]||'Не указано')+'</div></td></tr>').join('')}
show('resources');
function showGalaxy(){
 content.innerHTML='<h2>Галактика</h2><p class="muted">Исследуй галактику на карте EDAstro и проверяй данные звёздных систем в EDSM.</p><div class="filters"><input id="sysname" placeholder="Например, Sol или Colonia" aria-label="Звёздная система"><button id="sysfind">Найти в EDSM</button></div><div id="sysresult" aria-live="polite"></div><p><a href="https://www.edsm.net/" target="_blank" rel="noopener noreferrer">EDSM ↗</a> · <a href="https://edastro.com/galmap/" target="_blank" rel="noopener noreferrer">Полная карта EDAstro ↗</a></p><iframe id="galaxyframe" title="Интерактивная карта галактики EDAstro" src="https://edastro.com/galmap/" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:72vh;min-height:480px;border:1px solid #475467;border-radius:12px;background:#101722"></iframe><small class="muted">EDSM и EDAstro используют неполные пользовательские данные. Если карта не появляется, открой её по ссылке выше.</small>';
 const field=(parent,label,value)=>{if(value===undefined||value===null||value==='')return;const row=document.createElement('p');row.style.margin='8px 0';const strong=document.createElement('strong');strong.textContent=label+': ';row.append(strong,document.createTextNode(String(value)));parent.append(row)};
 const resourceSelect=document.getElementById('mining-resource');for(const r of resources){const o=document.createElement('option');o.value=r[1];o.textContent=r[0];resourceSelect.append(o)}resourceSelect.value='Platinum';
 const find=async()=>{const name=document.getElementById('sysname').value.trim(),out=document.getElementById('sysresult');out.replaceChildren();if(!name){out.textContent='Введи название системы';return}out.textContent='Ищу систему в EDSM…';
 try{const url='https://www.edsm.net/api-v1/system?systemName='+encodeURIComponent(name)+'&showCoordinates=1&showInformation=1&showPrimaryStar=1';const response=await fetch(url);if(!response.ok)throw Error('HTTP '+response.status);const d=await response.json();out.replaceChildren();if(!d.name){out.textContent='Система не найдена в базе EDSM';return}
 const card=document.createElement('section');card.className='edsm-card';const heading=document.createElement('h3');heading.textContent=d.name;card.append(heading);
 const info=d.information||{};field(card,'Основная звезда',d.primaryStar?.type);field(card,'Спектральный класс',d.primaryStar?.name);
 if(d.coords){field(card,'Координаты (св. лет)',[d.coords.x,d.coords.y,d.coords.z].join(' / '));const distance=Math.hypot(Number(d.coords.x),Number(d.coords.y),Number(d.coords.z));if(Number.isFinite(distance))field(card,'Расстояние до Sol',distance.toLocaleString('ru-RU',{maximumFractionDigits:1})+' св. лет')}
 field(card,'Население',typeof info.population==='number'?info.population.toLocaleString('ru-RU'):info.population);
 field(card,'Государство',info.government);field(card,'Принадлежность',info.allegiance);field(card,'Экономика',info.economy);field(card,'Вторая экономика',info.secondEconomy);field(card,'Безопасность',info.security);field(card,'Состояние',info.state);field(card,'Фракция',info.faction);field(card,'Держава',info.power);field(card,'Состояние державы',info.powerState);
 const actions=document.createElement('p');const link=document.createElement('a');link.href='https://www.edsm.net/en/system/id/'+encodeURIComponent(d.id||0)+'/name/'+encodeURIComponent(d.name);link.target='_blank';link.rel='noopener noreferrer';link.textContent='Подробнее в EDSM ↗';actions.append(link);card.append(actions);out.append(card);
 }catch(err){out.textContent='Не удалось получить данные EDSM. Возможно, браузер блокирует запрос (CORS) или сервис недоступен.'}};
 document.getElementById('sysfind').onclick=find;
 document.getElementById('sysname').addEventListener('keydown',e=>{if(e.key==='Enter')find()});
}

const miningSites=[
 ['Omicron Capricorni B','B 1 A Ring',4,2,11713],
 ['HIP 104504','12 A Ring',5,2,1859],
 ['HIP 104549','6 A Ring',2,1,3208],
 ['HIP 100449','5 A Ring',5,1,4780],
 ['HIP 105066','3 A Ring',1,0,2469],
 ['Col 285 Sector VZ-P d5-85','5 A Ring',2,4,3916],
 ['Nipiates','2 A Ring',3,0,772],
 ['Macua','2 A Ring',2,5,1388],
 ['Col 285 Sector YQ-C c13-21','2 A Ring',8,2,474],
 ['Col 285 Sector WP-E c12-17','1 A Ring',5,9,289],
 ['Col 285 Sector ZK-O d6-104','7 A Ring',5,2,4079],
 ['HIP 90565','3 A Ring',3,3,2336]
].map(([system,ring,platinum,painite,arrivalLs])=>({system,ring,platinum,painite,arrivalLs}));
async function edsmCoordinates(names){
 const query=new URLSearchParams({showCoordinates:'1'});
 names.forEach(name=>query.append('systemName[]',name));
 const response=await fetch('https://www.edsm.net/api-v1/systems?'+query);
 if(!response.ok)throw Error('EDSM HTTP '+response.status);
 const result=await response.json();if(!Array.isArray(result))throw Error('EDSM response');
 return new Map(result.filter(x=>x.coords).map(x=>[x.name.toLowerCase(),x.coords]));
}
const ringTypes={'Металлические':'Metal Rich','Металлообогащённые':'Metallic','Каменные':'Rocky','Ледяные':'Icy'};
function eligibleRings(resource){const entry=resources.find(r=>r[1]===resource);if(!entry)return [];return entry[3].split(',').map(x=>x.trim()).filter(Boolean).map(x=>({'Металлические':'Metallic','Металлообогащённые':'Metal Rich','Каменные':'Rocky','Ледяные':'Icy'})[x]).filter(Boolean)}
async function fetchJson(url){const r=await fetch(url);if(!r.ok)throw Error('HTTP '+r.status);return r.json()}
async function pooled(items,limit,fn){let index=0;const results=[];await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(index<items.length){const i=index++;try{results[i]=await fn(items[i],i)}catch(e){results[i]={error:String(e)}}}}));return results}
function showMining(){
 content.innerHTML='<h2>Поиск мест добычи</h2><p class="muted">Поиск подходящих колец по данным EDSM для всех ресурсов справочника. Тип кольца — потенциальное место добычи, НЕ подтверждённый хотспот. Отдельно показаны известные записи нашего ограниченного каталога.</p><div class="filters"><input id="mining-origin" value="Sol" placeholder="Система отправления" aria-label="Система отправления"><select id="mining-resource"></select><select id="mining-radius"><option value="20">20 св. лет</option><option value="50" selected>50 св. лет</option><option value="100">100 св. лет (максимум EDSM)</option></select><button id="mining-find">Найти</button><button id="mining-stop" type="button" disabled>Остановить</button></div><p id="mining-status" class="muted" aria-live="polite">Выбери ресурс и нажми «Найти».</p><div class="tablewrap"><table><thead><tr><th>Система / кольцо</th><th>Тип кольца</th><th>От звезды</th><th>Расстояние</th><th>Статус</th></tr></thead><tbody id="mining-results"></tbody></table></div><p><a id="mining-edtools" href="https://edtools.cc/hotspot" target="_blank" rel="noopener noreferrer">Дополнительные сведения о хотспотах: EDTools ↗</a></p><small class="muted">При наличии снимка EDTools сначала отображаются подтверждённые записи. При его отсутствии используется поиск потенциальных колец EDSM. Для производительности анализируется не более 60 ближайших систем с доступными координатами за один поиск. Это НЕ исчерпывающий поиск по всем системам в радиусе. EDSM может не содержать сведения обо всех телах и кольцах. Результаты не подтверждают наличие выбранного минерала в конкретном кольце.</small>';
 const select=document.getElementById('mining-resource');for(const r of resources){const o=document.createElement('option');o.value=r[1];o.textContent=r[0];select.append(o)}select.value='Platinum';
 let generation=0;
 const stop=document.getElementById('mining-stop'),go=document.getElementById('mining-find'),status=document.getElementById('mining-status'),tbody=document.getElementById('mining-results');
 stop.onclick=()=>{generation++;status.textContent+=' Поиск остановлен.';stop.disabled=true;go.disabled=false};
 const addRow=(system,ring,type,arrival,distance,kind)=>{const tr=document.createElement('tr');const vals=[system+' — '+ring,type,arrival==null?'Неизвестно':Math.round(arrival).toLocaleString('ru-RU')+' св. с.',distance==null?'Неизвестно':distance.toLocaleString('ru-RU',{maximumFractionDigits:1})+' св. лет',kind];for(const val of vals){const td=document.createElement('td');td.textContent=val;tr.append(td)}tbody.append(tr)};
 go.onclick=async()=>{
 const sourceSystem=document.getElementById('mining-origin').value.trim(),selected=select.value,searchRadius=Number(document.getElementById('mining-radius').value);
 const snapshotStatus=document.getElementById('mining-status');
 try{
 const snap=await fetchJson('../data/edtools-hotspots.json');
 const matching=(snap.rows||[]).filter(r=>r.mineral===selected);
 if(matching.length){
 const origin=await fetchJson('https://www.edsm.net/api-v1/system?systemName='+encodeURIComponent(sourceSystem)+'&showCoordinates=1');
 const systems=await edsmCoordinates([...new Set(matching.map(r=>r.system))]);
 if(origin.coords){
 const rows=matching.map(r=>{const c=systems.get(r.system.toLowerCase());return {...r,distance:c?Math.hypot(c.x-origin.coords.x,c.y-origin.coords.y,c.z-origin.coords.z):null}}).filter(r=>r.distance!==null&&r.distance<=searchRadius).sort((a,b)=>a.distance-b.distance);
 tbody.replaceChildren();for(const r of rows)addRow(r.system,r.ring,r.type,r.arrivalLs,r.distance,'EDTools: '+r.hotspots+' хотспотов');
 snapshotStatus.textContent='EDTools: '+rows.length+' записей в радиусе '+searchRadius+' св. лет. Снимок: '+(snap.updatedAt||'дата неизвестна')+'. Результаты ограничены покрытием базы EDTools.';
 return;
 }
 }
 }catch(e){/* No snapshot or blocked EDSM: use ring-type discovery below. */}
 const run=++generation,origin=document.getElementById('mining-origin').value.trim(),resource=select.value,radius=Number(document.getElementById('mining-radius').value),types=eligibleRings(resource);
 tbody.replaceChildren();if(!origin){status.textContent='Введи систему отправления.';return}if(!types.length){status.textContent='Для этого ресурса типы колец в справочнике не указаны. Автоматически подобрать подходящие кольца нельзя.';return}
 go.disabled=true;stop.disabled=false;status.textContent='Получаю ближайшие системы из EDSM…';
 try{
 const list=await fetchJson('https://www.edsm.net/api-v1/sphere-systems?systemName='+encodeURIComponent(origin)+'&radius='+radius+'&showCoordinates=1');
 if(run!==generation)return;if(!Array.isArray(list))throw Error('Некорректный ответ EDSM');
 const nearby=list.filter(x=>x.name&&Number.isFinite(Number(x.distance))).sort((a,b)=>a.distance-b.distance).slice(0,60);
 if(!nearby.length){status.textContent='EDSM не вернул системы. Проверь название исходной системы.';return}
 let scanned=0,errors=0,found=0;
 const results=await pooled(nearby,4,async sys=>{
 if(run!==generation)return [];
 try{
 const data=await fetchJson('https://www.edsm.net/api-system-v1/bodies?systemName='+encodeURIComponent(sys.name));
 if(run!==generation)return [];
 const matches=[];for(const body of data.bodies||[]){for(const ring of body.rings||[]){const type=String(ring.type||'');if(types.some(t=>type.toLowerCase()===t.toLowerCase()))matches.push({system:sys.name,ring:ring.name||body.name+' Ring',type,arrival:body.distanceToArrival,distance:Number(sys.distance)})}}
 return matches;
 }finally{scanned++;if(run===generation)status.textContent='Проверено '+scanned+' из '+nearby.length+' систем; найдено колец: '+found}
 });
 if(run!==generation)return;
 for(const result of results){if(result?.error){errors++;continue}for(const item of result||[]){found++;addRow(item.system,item.ring,item.type,item.arrival,item.distance,'Потенциальное кольцо')}}
 const key=resource==='Platinum'?'platinum':resource==='Painite'?'painite':null;
 if(key){const known=miningSites.filter(x=>x[key]>0);const names=new Set(Array.from(tbody.rows).map(row=>row.cells[0].textContent.toLowerCase()));for(const site of known){const identifier=(site.system+' — '+site.ring).toLowerCase();if(!names.has(identifier))addRow(site.system,site.ring,'По каталогу',site.arrivalLs,null,'Каталог: проверить в EDTools')}}
 status.textContent='Готово. Проверено '+(nearby.length-errors)+' из '+nearby.length+' ближайших систем (лимит 60). Подходящих колец: '+found+'.'+(errors?' Ошибок API: '+errors+'.':'')+' Совпадение типа кольца не гарантирует ресурс или хотспот.';
 if(!found)status.textContent+=' Попробуй увеличить радиус.';
 }catch(e){if(run===generation)status.textContent='Поиск не выполнен: '+e.message+'. Возможны ограничения CORS или недоступность EDSM.'}
 finally{if(run===generation){go.disabled=false;stop.disabled=true}}
 };
 document.getElementById('mining-origin').addEventListener('keydown',e=>{if(e.key==='Enter')go.click()});
}
