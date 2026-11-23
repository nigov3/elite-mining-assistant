const raw="Золото|Gold|47610|Металлические, металлообогащённые|Поверхностная, глубинная|Металлы\nКобальт|Cobalt|3762|Каменные|Поверхностная, глубинная*|Металлы\nОсмий|Osmium|45198|Металлические, металлообогащённые|Поверхностная, глубинная*|Металлы\nПалладий|Palladium|50639|Металлические|Поверхностная, глубинная*|Металлы\nПлатина|Platinum|58263|Металлические|Подрыв ядра, поверхностная, глубинная|Металлы\nПразеодим|Praseodymium|8620|Металлические, металлообогащённые|Поверхностная, глубинная*|Металлы\nСамарий|Samarium|25852|Металлические, металлообогащённые|Поверхностная, глубинная*|Металлы\nСеребро|Silver|37223|Металлические, металлообогащённые|Поверхностная, глубинная*|Металлы\nТорий|Thorium|11317|Металлические|Поверхностная, глубинная*|Металлы\nАлександрит|Alexandrite|217277|Металлообогащённые, ледяные, каменные|Подрыв ядра, реже поверхностная|Минералы\nБенитоит|Benitoite|149395|Металлообогащённые, каменные||Минералы\nБертрандит|Bertrandite|18817|Металлические, металлообогащённые||Минералы\nБоксит|Bauxite|1140|Каменные||Минералы\nБромеллит|Bromellite|30424|Ледяные|Поверхностная, глубинная|Минералы\nГаллит|Gallite|11915|Металлические, металлообогащённые, каменные||Минералы\nГидроксид лития|Lithium Hydroxide|5673|Ледяные|Поверхностная, глубинная|Минералы\nГрандидьерит|Grandidierite|197292|Металлообогащённые, ледяные||Минералы\nИндит|Indite|11389|Металлические, металлообогащённые, каменные|Поверхностная, глубинная|Минералы\nКлатрат метана|Methane Clathrate|1650|Ледяные|Поверхностная, глубинная|Минералы\nКолтан|Coltan|6163|Металлообогащённые, каменные||Минералы\nКристаллы моногидрата метанола|Methanol Monohydrate Crystals|2478|Ледяные|Поверхностная, глубинная|Минералы\nЛепидолит|Lepidolite|771|Металлообогащённые, каменные||Минералы\nМонацит|Monazite|200975|Металлообогащённые, каменные|Подрыв ядра|Минералы\nМусгравит|Musgravite|198613|Каменные|Подрыв ядра|Минералы\nНизкотемпературные алмазы|Low Temperature Diamonds|106353|Ледяные|Подрыв ядра, реже поверхностная|Минералы\nОпалы бездны|Void Opals|135284|Ледяные|Подрыв ядра|Минералы\nПейнит|Painite|53016|Металлические, металлообогащённые|Все способы|Минералы\nРодплумсайт|Rhodplumsite|176839|Металлообогащённые||Минералы\nРутил|Rutile|2083|Каменные||Минералы\nСерендибит|Serendibite|172711|Металлообогащённые, каменные||Минералы\nУранинит|Uraninite|2957|Металлообогащённые, каменные||Минералы\nВода|Water|278|Ледяные|Поверхностная, глубинная|Химикаты\nЖидкий кислород|Liquid Oxygen|1474|Ледяные|Поверхностная, глубинная|Химикаты\nПероксид водорода|Hydrogen Peroxide|3160|Ледяные|Поверхностная, глубинная|Химикаты\nТритий|Tritium|51707|Ледяные|Поверхностная, глубинная|Химикаты";
const resources=raw.split('\n').map(line=>line.split('|'));let descending=true,tab='resources';
const root=document.getElementById('app');root.innerHTML='<header class="site-header"><div class="brand"><div class="brand-mark" aria-hidden="true">✦</div><div><div class="brand-kicker">COMMANDER INTERFACE <span class="live-dot"></span> ONLINE</div><h1>ELITE <span>DANGEROUS</span></h1><div class="brand-subtitle">COMPANION / НАВИГАЦИОННАЯ КОНСОЛЬ</div></div></div><nav><a id="theme-switch" class="theme-switch" href="../light/">☀️ Светлая тема</a></nav></header><section class="hero"><div class="hero-content"><div class="eyebrow"><span class="live-dot"></span> PILOT&#39;S OPERATIONS CENTER <span class="hero-line"></span> CMDR // 3300</div><h2>Твоя галактика.<br><em>Твои правила.</em></h2><p>Добыча ресурсов, маршруты, торговля и знания — в одной командной консоли.</p><div class="hero-metrics"><div><strong>35</strong><span>РЕСУРСОВ</span></div><div><strong>06</strong><span>РАЗДЕЛОВ</span></div><div><strong>∞</strong><span>ВОЗМОЖНОСТЕЙ</span></div></div></div><div class="hero-orbit" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit orbit-three"></div><div class="orbit-planet"></div><div class="orbit-cross">+</div></div><div class="hero-coordinate">GALACTIC GRID // 00.00.00</div></section><div class="section-label"><span>01 / НАВИГАЦИЯ</span><span class="section-line"></span><span>ВЫБЕРИ МОДУЛЬ</span></div><div class="tabs" role="navigation" aria-label="Разделы сайта"><button id="res" class="active">Ресурсы</button></div><section class="panel" id="content"></section><footer class="site-footer"><span>✦ ELITE DANGEROUS COMPANION</span><span>UNOFFICIAL COMMUNITY TOOL · NOT AFFILIATED WITH FRONTIER</span></footer>';
const switcher=document.getElementById('theme-switch');if(document.body.dataset.theme==='light'){switcher.href='../dark/';switcher.textContent='🌙 Тёмная тема'}
const content=document.getElementById('content');document.getElementById('res').onclick=()=>show('resources');
const galaxyTab=document.createElement('button');galaxyTab.id='galaxy';galaxyTab.textContent='✧ Галактика';document.querySelector('.tabs').appendChild(galaxyTab);galaxyTab.onclick=()=>show('galaxy');
const tradeTab=document.createElement('button');tradeTab.id='trade';tradeTab.textContent='◈ Торговля';document.querySelector('.tabs').appendChild(tradeTab);tradeTab.onclick=()=>show('trade');
const routesTab=document.createElement('button');routesTab.id='routes';routesTab.textContent='⌁ Маршруты';document.querySelector('.tabs').appendChild(routesTab);routesTab.onclick=()=>show('routes');
const wikiTab=document.createElement('button');wikiTab.id='wiki';wikiTab.textContent='▤ База знаний';document.querySelector('.tabs').appendChild(wikiTab);wikiTab.onclick=()=>show('wiki');
const miningTab=document.createElement('button');miningTab.id='mining';miningTab.textContent='⚒ Точки добычи';document.querySelector('.tabs').appendChild(miningTab);miningTab.onclick=()=>show('mining');
function show(which){tab=which;galaxyTab.classList.toggle('active',which==='galaxy');miningTab.classList.toggle('active',which==='mining');tradeTab.classList.toggle('active',which==='trade');routesTab.classList.toggle('active',which==='routes');wikiTab.classList.toggle('active',which==='wiki');document.getElementById('res').classList.toggle('active',which==='resources');if(which==='galaxy'){showGalaxy();return}if(which==='mining'){showMining();return}if(which==='trade'){showTrade();return}if(which==='routes'){showRoutes();return}if(which==='wiki'){showWiki();return}
content.innerHTML='<h2>Справочник ресурсов</h2><input id="q" style="width:100%" placeholder="Поиск по русскому или английскому названию"><div class="filters"><select id="cat"><option value="">Все категории</option><option>Металлы</option><option>Минералы</option><option>Химикаты</option></select><select id="ring"><option value="">Все кольца</option><option>Металлические</option><option>Металлообогащённые</option><option>Каменные</option><option>Ледяные</option></select><button id="sort">Дорогие сначала</button></div><p class="muted" id="count"></p><div class="tablewrap"><table><thead><tr><th>Ресурс</th><th class="price">Кр./т</th><th>Кольца и добыча</th></tr></thead><tbody id="rows"></tbody></table></div><button id="copy" style="margin-top:18px">Скопировать таблицу</button><small class="muted">* Пометка «проверить» в исходных данных. Цены справочные, не текущие рыночные.</small>';['q','cat','ring'].forEach(id=>document.getElementById(id).addEventListener(id==='q'?'input':'change',render));document.getElementById('sort').onclick=()=>{descending=!descending;document.getElementById('sort').textContent=descending?'Дорогие сначала':'Дешёвые сначала';render()};document.getElementById('copy').onclick=()=>{const list=filtered();navigator.clipboard.writeText(list.map(r=>r.join('\t')).join('\n')).then(()=>alert('Скопировано')).catch(()=>alert('Не удалось скопировать'))};render()}
function filtered(){const q=document.getElementById('q').value.toLowerCase(),c=document.getElementById('cat').value,r=document.getElementById('ring').value;return resources.filter(x=>(!q||(x[0]+' '+x[1]).toLowerCase().includes(q))&&(!c||x[5]===c)&&(!r||x[3].split(', ').includes(r))).sort((a,b)=>descending?Number(b[2])-Number(a[2]):Number(a[2])-Number(b[2]))}
function render(){const list=filtered();document.getElementById('count').textContent='Найдено: '+list.length+' из '+resources.length;document.getElementById('rows').innerHTML=list.map(x=>'<tr><td><strong>'+x[0]+'</strong><div class="sub">'+x[1]+'</div></td><td class="price"><span class="price-tag '+(Number(x[2])>=100000?'price-high':Number(x[2])>=30000?'price-mid':'price-low')+'">'+Number(x[2]).toLocaleString('ru-RU')+'</span></td><td>'+x[3]+'<div class="sub">'+(x[4]||'Не указано')+'</div></td></tr>').join('')}
show('resources');
function showGalaxy(){
 content.innerHTML='<h2>Галактика</h2><p class="muted">Исследуй галактику на карте EDAstro и проверяй данные звёздных систем в EDSM.</p><div class="filters"><input id="sysname" placeholder="Например, Sol или Colonia" aria-label="Звёздная система"><button id="sysfind">Найти в EDSM</button></div><div id="sysresult" aria-live="polite"></div><p><a href="https://www.edsm.net/" target="_blank" rel="noopener noreferrer">EDSM ↗</a> · <a href="https://edastro.com/galmap/" target="_blank" rel="noopener noreferrer">Полная карта EDAstro ↗</a></p><iframe id="galaxyframe" title="Интерактивная карта галактики EDAstro" src="https://edastro.com/galmap/" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:72vh;min-height:480px;border:1px solid #475467;border-radius:12px;background:#101722"></iframe><small class="muted">EDSM и EDAstro используют неполные пользовательские данные. Если карта не появляется, открой её по ссылке выше.</small>';
 const field=(parent,label,value)=>{if(value===undefined||value===null||value==='')return;const row=document.createElement('p');row.style.margin='8px 0';const strong=document.createElement('strong');strong.textContent=label+': ';row.append(strong,document.createTextNode(String(value)));parent.append(row)};
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
const ringTypes={'Металлические':'Metallic','Металлообогащённые':'Metal Rich','Каменные':'Rocky','Ледяные':'Icy'};
function eligibleRings(resource){const entry=resources.find(r=>r[1]===resource);if(!entry)return [];return entry[3].split(',').map(x=>x.trim()).filter(Boolean).map(x=>({'Металлические':'Metallic','Металлообогащённые':'Metal Rich','Каменные':'Rocky','Ледяные':'Icy'})[x]).filter(Boolean)}
async function fetchJson(url){const r=await fetch(url);if(!r.ok)throw Error('HTTP '+r.status);return r.json()}
async function pooled(items,limit,fn){let index=0;const results=[];await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(index<items.length){const i=index++;try{results[i]=await fn(items[i],i)}catch(e){results[i]={error:String(e)}}}}));return results}
function showMining(){
 content.innerHTML='<h2>Точки добычи — EDTools</h2><p class="muted">Оригинальный Hotspot Finder EDTools. Сторонний сервис может загружаться медленно.</p><p><a href="https://edtools.cc/hotspot" target="_blank" rel="noopener noreferrer">Открыть EDTools в отдельной вкладке ↗</a></p><div class="edtools-frame-wrap"><div class="edtools-loader" id="edtools-loader" role="status" aria-live="polite"><div class="edtools-spinner" aria-hidden="true"><span></span></div><strong>ПОДКЛЮЧЕНИЕ К EDTOOLS</strong><p id="edtools-loading-text">Загружаем карту хотспотов…</p><div class="edtools-actions"><button type="button" id="edtools-show">Показать содержимое</button><button type="button" id="edtools-retry">Повторить загрузку</button></div></div><iframe id="edtools-frame" title="EDTools Hotspot Finder" src="https://edtools.cc/hotspot" referrerpolicy="strict-origin-when-cross-origin"></iframe></div><small class="muted">Если встроенная страница пустая или не отвечает, открой EDTools в отдельной вкладке. Событие загрузки iframe не гарантирует готовность сервиса.</small>';
 const frame=document.getElementById('edtools-frame'),loader=document.getElementById('edtools-loader'),label=document.getElementById('edtools-loading-text');
 let timer,completed=false;
 const reveal=()=>{completed=true;clearTimeout(timer);frame.classList.add('edtools-loaded');loader.classList.add('edtools-loader-hidden')};
 const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!completed&&frame.isConnected)label.textContent='EDTools отвечает дольше обычного. Попробуй показать содержимое, перезагрузить или открыть в новой вкладке.'},12000)};
 document.getElementById('edtools-show').onclick=reveal;
 document.getElementById('edtools-retry').onclick=()=>{completed=false;frame.classList.remove('edtools-loaded');loader.classList.remove('edtools-loader-hidden');label.textContent='Повторно загружаем EDTools…';frame.src='https://edtools.cc/hotspot';schedule()};
 frame.addEventListener('load',()=>{if(!completed)reveal()});
 schedule();
}

function makeExternalLink(label,url,description){
 const item=document.createElement('div');item.className='tool-link';const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label+' ↗';const p=document.createElement('p');p.className='muted';p.textContent=description;item.append(a,p);return item;
}
function showTrade(){
 content.innerHTML='<h2>Поиск мест продажи и станций</h2><p class="muted">Данные рынка EDDN через Ardent API. Данные зависят от сообщений игроков и могут устаревать.</p><div class="filters"><input id="trade-system" value="Sol" placeholder="Система" aria-label="Система"><select id="trade-mineral" aria-label="Минерал"></select><select id="trade-radius" aria-label="Радиус"><option value="50">50 св. лет</option><option value="100" selected>100 св. лет</option><option value="200">200 св. лет</option><option value="500">500 св. лет</option></select><button id="trade-search">Найти покупателей</button></div><p id="trade-message" class="muted" aria-live="polite">Выбери ресурс и нажми «Найти покупателей».</p><div id="trade-results"></div><div class="filters"><label for="trade-json">Если API недоступен из браузера, загрузи сохранённый JSON-ответ Ardent:</label><input id="trade-json" type="file" accept=".json,application/json"></div><p><a href="https://inara.cz/elite/commodities/" target="_blank" rel="noopener">Проверить цены на INARA ↗</a> · <a href="https://ardent-insight.com/" target="_blank" rel="noopener">Ardent Insight ↗</a></p>';
 const sel=document.getElementById('trade-mineral');resources.forEach(r=>{const opt=document.createElement('option');opt.value=r[1];opt.textContent=r[0]+' ('+r[1]+')';sel.append(opt)});sel.value='Platinum';
 const importInput=document.getElementById('trade-json');
 importInput.onchange=async()=>{
  const file=importInput.files?.[0];if(!file)return;
  const msg=document.getElementById('trade-message'),out=document.getElementById('trade-results');
  try{
   const json=JSON.parse(await file.text());
   const rows=Array.isArray(json)?json:Array.isArray(json.results)?json.results:Array.isArray(json.data)?json.data:null;
   if(!rows)throw Error('Ожидается JSON-массив рыночных записей');
   out.replaceChildren();
   const table=document.createElement('table');table.innerHTML='<thead><tr><th>Система</th><th>Станция</th><th>Цена, CR/т</th><th>Спрос</th><th>Расстояние, св. лет</th><th>Обновление</th></tr></thead>';
   const tbody=document.createElement('tbody');
   rows.slice(0,100).forEach(r=>{const tr=document.createElement('tr');for(const value of [r.systemName,r.stationName,r.sellPrice,r.demand,r.distance,r.updatedAt]){const td=document.createElement('td');td.textContent=value==null?'—':String(value);tr.append(td)}tbody.append(tr)});
   table.append(tbody);const wrap=document.createElement('div');wrap.className='tablewrap';wrap.append(table);out.append(wrap);
   msg.textContent='Загружено из локального файла: '+rows.length+' записей. Показаны первые 100. Данные не обновляются автоматически.';
  }catch(e){msg.textContent='Не удалось прочитать JSON: '+e.message}
 };
 const btn=document.getElementById('trade-search');
 btn.onclick=async()=>{
  const system=document.getElementById('trade-system').value.trim(),mineral=sel.value,radius=document.getElementById('trade-radius').value,msg=document.getElementById('trade-message'),out=document.getElementById('trade-results');
  if(!system){msg.textContent='Укажи исходную систему.';return}
  btn.disabled=true;out.replaceChildren();msg.textContent='Запрашиваю покупателей…';
  const endpoint='https://api.ardent-insight.com/v2/system/name/'+encodeURIComponent(system)+'/commodity/name/'+encodeURIComponent(mineral.toLowerCase().replace(/[^a-z0-9]/g,''))+'/nearby/imports?maxDistance='+radius+'&maxDaysAgo=30&minVolume=1';
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),30000);
  try{
   const response=await fetch(endpoint,{signal:controller.signal});if(!response.ok)throw Error('HTTP '+response.status);
   const json=await response.json();const rows=Array.isArray(json)?json:Array.isArray(json.results)?json.results:Array.isArray(json.data)?json.data:null;
   if(!rows)throw Error('Неожиданный формат ответа Ardent API');
   if(!rows.length){msg.textContent='Подходящих записей за последние 30 дней нет. Попробуй другой ресурс, систему или радиус.';return}
   const table=document.createElement('table');table.innerHTML='<thead><tr><th>Система</th><th>Станция</th><th>Цена продажи, CR/т</th><th>Спрос</th><th>Расстояние</th><th>Обновление</th></tr></thead>';
   const tbody=document.createElement('tbody');const cell=(tr,value)=>{const td=document.createElement('td');td.textContent=value==null?'—':String(value);tr.append(td)};
   rows.slice(0,100).forEach(r=>{const tr=document.createElement('tr');cell(tr,r.systemName??r.starsystemName??r.system?.name);cell(tr,r.stationName??r.marketName??r.station?.name);cell(tr,r.sellPrice??r.price??r.maxSellPrice);cell(tr,r.demand??r.volume??r.stock);cell(tr,r.distance??r.distanceLy);cell(tr,r.updatedAt??r.timestamp??r.lastUpdated);tbody.append(tr)});
   table.append(tbody);const wrap=document.createElement('div');wrap.className='tablewrap';wrap.append(table);out.append(wrap);
   msg.textContent='Получено записей: '+rows.length+'. Показаны первые 100. Источник: Ardent / EDDN.';
  }catch(e){
   const detail=e.name==='AbortError'?'Ardent не ответил за 30 секунд.':e instanceof TypeError?'Не удалось установить соединение с Ardent. Возможны проблемы сети, CORS или недоступность сервера.':'Ошибка Ardent: '+e.message+'.';
   msg.textContent=detail+' Можно повторить поиск или проверить данные на INARA.';
   const link=document.createElement('a');link.href=endpoint;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Проверить ответ Ardent напрямую ↗';out.append(link);
  }finally{clearTimeout(timeout);btn.disabled=false}
 };
}

function showRoutes(){
 content.innerHTML='<h2>Навигационный расчёт</h2><p class="muted">Проверка расстояния между системами по координатам EDSM. Это оценка минимального количества прыжков по прямой, а не готовый маршрут по звёздам. Для точного маршрута используй Spansh.</p><form id="route-form" class="filters"><input id="route-from" value="Sol" placeholder="Откуда" aria-label="Откуда" required><input id="route-to" value="Colonia" placeholder="Куда" aria-label="Куда" required><input id="route-range" type="number" min="1" max="500" step="0.1" value="50" aria-label="Дальность прыжка в световых годах" required><button type="submit">Рассчитать</button></form><p id="route-message" class="muted" aria-live="polite">Укажи системы и дальность прыжка корабля.</p><div id="route-results"></div><div class="tool-grid" id="route-links"></div>';
 const links=[['Neutron Router — Spansh','https://spansh.co.uk/plotter','Маршрут через нейтронные звёзды с реальными промежуточными системами'],['Galaxy Plotter — Spansh','https://spansh.co.uk/exact-plotter','Планирование прыжков с учётом характеристик корабля'],['Road to Riches — Spansh','https://spansh.co.uk/riches','Маршруты для исследования и заработка'],['Exobiology — Spansh','https://spansh.co.uk/exobiology','Поиск исследовательских маршрутов для экзобиологии']];
 const wrap=document.getElementById('route-links');links.forEach(x=>wrap.append(makeExternalLink(...x)));
 document.getElementById('route-form').onsubmit=async event=>{
  event.preventDefault();const from=document.getElementById('route-from').value.trim(),to=document.getElementById('route-to').value.trim(),range=Number(document.getElementById('route-range').value),msg=document.getElementById('route-message'),out=document.getElementById('route-results'),btn=event.submitter;
  if(!from||!to||!Number.isFinite(range)||range<=0){msg.textContent='Проверь названия систем и дальность прыжка.';return}
  btn.disabled=true;out.replaceChildren();msg.textContent='Получаю координаты систем из EDSM…';
  try{
   const endpoint=name=>'https://www.edsm.net/api-v1/system?systemName='+encodeURIComponent(name)+'&showCoordinates=1';
   const response=await Promise.all([fetch(endpoint(from),{signal:AbortSignal.timeout(12000)}),fetch(endpoint(to),{signal:AbortSignal.timeout(12000)})]);
   if(response.some(r=>!r.ok))throw Error('EDSM вернул ошибку HTTP');
   const [origin,dest]=await Promise.all(response.map(r=>r.json()));
   if(!origin.coords||!dest.coords)throw Error('Для одной из систем отсутствуют координаты в EDSM');
   const a=origin.coords,b=dest.coords;const dist=Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);const jumps=Math.ceil(dist/range);
   const summary=document.createElement('div');summary.className='route-summary';
   const heading=document.createElement('h3');heading.textContent=origin.name+' → '+dest.name;summary.append(heading);
   const line=document.createElement('p');line.textContent='Расстояние по прямой: '+dist.toLocaleString('ru-RU',{maximumFractionDigits:2})+' св. лет';summary.append(line);
   const count=document.createElement('p');count.textContent='Теоретический минимум: '+jumps.toLocaleString('ru-RU')+' прыжков при дальности '+range.toLocaleString('ru-RU')+' св. лет';summary.append(count);
   const note=document.createElement('p');note.className='muted';note.textContent='Это нижняя оценка без учёта расположения звёзд, топлива, массы корабля, нейтронных ускорений и доступности систем. Фактический маршрут может быть значительно длиннее или недоступен.';summary.append(note);out.append(summary);
   msg.textContent='Расчёт выполнен по координатам EDSM. Для реальной последовательности систем открой Spansh ниже.';
  }catch(error){msg.textContent='Не удалось рассчитать: '+error.message+'. Открой Spansh по ссылкам ниже.'}finally{btn.disabled=false}
 };
}
function showWiki(){
 const base='https://elite-dangerous.fandom.com/ru';
 content.innerHTML='<h2>База знаний Elite Dangerous</h2><p class="muted">Поиск по русскоязычной Elite Dangerous Wiki (Fandom): корабли, модули, ресурсы, инженеры, объекты и механики игры.</p><form id="wiki-form" class="filters"><input id="wiki-query" type="search" placeholder="Например: Анаконда, таргоиды, пейнит…" aria-label="Что найти на вики" required style="flex:1;min-width:200px"><button type="submit">Найти на вики</button></form><p id="wiki-status" class="muted" aria-live="polite"></p><div id="wiki-results"></div><p><a href="https://elite-dangerous.fandom.com/ru/wiki/Elite-dangerous_%D0%B2%D0%B8%D0%BA%D0%B8" target="_blank" rel="noopener noreferrer">Открыть русскую Elite Dangerous Wiki ↗</a></p>';
 document.getElementById('wiki-form').onsubmit=async e=>{
  e.preventDefault();const q=document.getElementById('wiki-query').value.trim(),status=document.getElementById('wiki-status'),out=document.getElementById('wiki-results');if(!q)return;
  out.replaceChildren();const searchUrl=base+'/wiki/Special:Search?query='+encodeURIComponent(q);const external=document.createElement('a');external.href=searchUrl;external.target='_blank';external.rel='noopener noreferrer';external.textContent='Открыть все результаты на русской вики ↗';out.append(external);status.textContent='Ищу статьи…';
  try{
   const api=base+'/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(q)+'&gsrlimit=12&prop=extracts&exintro=1&explaintext=1&exsentences=2&format=json&origin=*';
   const res=await fetch(api,{signal:AbortSignal.timeout(12000)});if(!res.ok)throw Error('HTTP '+res.status);const data=await res.json();if(data.error)throw Error(data.error.info||'API error');
   const pages=Object.values(data.query?.pages||{}).sort((a,b)=>(a.index??99)-(b.index??99));if(!pages.length){status.textContent='Статьи не найдены. Попробуй другой запрос или поиск на самой вики.';return}
   const list=document.createElement('div');list.className='tool-grid';pages.forEach(page=>{const item=document.createElement('div');item.className='tool-link';const a=document.createElement('a');a.href=base+'/wiki/'+encodeURIComponent(page.title.replace(/ /g,'_'));a.target='_blank';a.rel='noopener noreferrer';a.textContent=page.title+' ↗';item.append(a);if(page.extract){const p=document.createElement('p');p.textContent=page.extract.slice(0,320);item.append(p)}list.append(item)});out.append(list);status.textContent='Найдено статей: '+pages.length+'. Источник: русская Elite Dangerous Wiki.';
  }catch(err){status.textContent='Встроенный поиск недоступен ('+err.message+'). Ссылка выше открывает результаты напрямую на русской вики.'}
 };
}

/* Gamepad-friendly companion mode. The overlay must be focused for browser Gamepad API input. */
if(new URLSearchParams(location.search).has('overlay')){
 document.body.classList.add('overlay-mode');
 const hint=document.createElement('div');hint.className='gamepad-hint';hint.textContent='🎮 Крестовина / стик — выбор · A — открыть · B — назад · Ctrl+Shift+M — скрыть оверлей';document.querySelector('.site-header').after(hint);
 let lastButtons=[],lastMove=0,selected=0,active=false;
 const focusables=()=>Array.from(document.querySelectorAll('.tabs button, #content button, #content input, #content select, #content a')).filter(el=>el.getClientRects().length&&!el.disabled);
 const updateFocus=(delta)=>{const els=focusables();if(!els.length)return;selected=(selected+delta+els.length)%els.length;els[selected].focus({preventScroll:true});els[selected].scrollIntoView({block:'nearest',behavior:'smooth'})};
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.activeElement?.tagName!=='INPUT'){document.getElementById('res').click();selected=0}});
 function pollGamepad(time){const gp=navigator.getGamepads?.()[0];if(gp){const pressed=i=>Boolean(gp.buttons[i]?.pressed);const edge=i=>pressed(i)&&!lastButtons[i];if(!active){active=true;hint.textContent='🎮 Геймпад подключён · крестовина/стик: выбор · A: открыть · B: ресурсы'}
 const dir=pressed(13)||gp.axes[1]<-.65?-1:pressed(12)||gp.axes[1]>.65?1:0;
 if(dir&&time-lastMove>220){updateFocus(dir);lastMove=time}
 if(edge(0)){const els=focusables();const el=els[selected]||document.activeElement;if(el?.tagName==='INPUT'||el?.tagName==='SELECT')el.focus();else el?.click()}
 if(edge(1)){document.getElementById('res').click();selected=0;updateFocus(0)}
 lastButtons=gp.buttons.map(b=>b.pressed);
 }else{active=false;lastButtons=[]}requestAnimationFrame(pollGamepad)}
 requestAnimationFrame(pollGamepad);
}
