/* Local Black Box search. Keep Wikis independent of the guide index and aliases. */
const searchStopWords=new Set('а в во для до и из к как на над о об от по под при про с со у что где зачем ли мне найти покажи расскажи гайд гайда руководство инструкция фармить the for to a an of how where'.split(' '));
function guideSearchWords(value){
 return String(value??'').normalize('NFKC').toLowerCase().replace(/ё/g,'е').replace(/фсд/g,'fsd').replace(/['’]/g,'').match(/[\p{L}\p{N}]+/gu)?.filter(word=>!searchStopWords.has(word))||[];
}
function guideWordsMatch(query,candidate){
 return query.every(word=>candidate.some(target=>{
  if(word===target)return true;
  // Allow queried word forms such as «инженера» / «инженеры», without matching short acronyms by prefix.
  if(!/^[а-я]{5,}$/.test(word)||!/^[а-я]{5,}$/.test(target))return false;
  const tail=/(?:иями|ями|ами|ого|ому|ыми|ими|ией|иях|иям|ия|ие|ий|ых|их|ой|ей|ом|ем|ам|ям|ах|ях|ые|ую|юю|ов|ев|а|я|ы|и|у|ю|е|о|ь)$/;
  const stem=value=>value.replace(tail,'');
  const a=stem(word),b=stem(target);
  return a.length>=4&&a===b;
 }));
}
const guideShipAliases={
 'Anaconda':'анаконда', 'Mandalay':'мандалай манделай мандалей монделай мондалай', 'Caspian Explorer':'каспиан эксплорер',
 'Cobra Mk III':'кобра мк 3 cobra mk 3 кобра мк iii', 'Cobra Mk IV':'кобра мк 4 cobra mk 4 кобра мк iv',
 'Cobra Mk V':'кобра мк 5 cobra mk 5 кобра мк v', 'Corsair':'корсар', 'Asp Explorer':'асп эксплорер',
 'Asp Scout':'асп скаут', 'Diamondback Explorer':'даймондбэк эксплорер дбэк dbx',
 'Diamondback Scout':'даймондбэк скаут дбс dbs', 'Krait Mk II':'крайт мк 2 крейт мк 2 krait mk 2 крайт мк ii',
 'Krait Phantom':'крайт фантом крейт фантом', 'Python':'питон пайтон', 'Python Mk II':'питон мк 2 пайтон мк 2 python mk 2',
 'Federal Corvette':'федеральный корвет корвет', 'Imperial Cutter':'имперский каттер каттер',
 'Imperial Clipper':'имперский клиппер клиппер', 'Sidewinder Mk I':'сайдвиндер сайдуиндер',
 'Vulture':'валчер вальчер', 'Fer-de-Lance':'фер де ланс фдл fdl', 'Dolphin':'дельфин',
 'Beluga Liner':'белуга', 'Orca':'орка косатка', 'Hauler':'хаулер', 'Mamba':'мамба'};
const guideRoleAliases={
 'Антитаргоидный бой':'ax таргоиды антитаргоидный',
 'Бой':'combat боевой',
 'Исследование':'exploration исследования исследовательский исследовательская эксплорейшн',
 'Добыча':'mining шахтер шахта майнинг добывающий',
 'Торговля':'trading trade торговый перевозка груза',
 'Многоцелевой':'multipurpose универсальный универсальная многоцелевой',
 'Пассажирские перевозки':'passenger пассажирский пассажиры туризм'
};
const engineeringManual='guides/engineering/engineering-manuals/';
const materialGuide='guides/engineering/materials-and-farming/';
const activityGuide='guides/systems/activity-guides/';
const galaxyGuide='guides/systems/galaxy-and-power-systems/';
const pilotGuide='guides/systems/new-pilot-and-interface/';
const guideSearchTopics=[
 [engineeringManual+'modules.html','module-guardian-fsd-booster','Ускоритель FSD Стражей','фсд стражей|guardian fsd|guardian fsd booster|бустер фсд стражей|фсд бустер|ускоритель фсд|усилитель фсд стражей|ускоритель стражей|гфсдб'],
 [engineeringManual+'checklist.html','step-build-guardian-fsd-booster','Как получить ускоритель FSD Стражей','разблокировать фсд стражей|разблокировка фсд стражей|получить фсд стражей|получение фсд стражей|открыть фсд стражей|разблокировать ускоритель стражей|открыть ускоритель фсд стражей|получить ускоритель фсд стражей|разблокировать ускоритель фсд стражей|получить усилитель фсд стражей|разблокировать усилитель фсд стражей|открыть усилитель фсд стражей|unlock guardian fsd booster'],
 [engineeringManual+'modules.html','module-frame-shift-drive','Рамочно-сместительный двигатель (FSD)','фсд|рсд|fsd|frame shift drive|гипердвигатель|двигатель sco|двигатель фсд|рамочно сместительный привод'],
 [engineeringManual+'blueprints.html','blueprint-group-frame-shift-drive','Инженерные улучшения FSD','инженерка фсд|улучшение фсд|улучшить фсд|увеличенная дальность фсд|улучшать fsd|fsd increased range|прокачать фсд'],
 [activityGuide+'mining.html','section-core-gameplay-mechanics','Основы добычи: кольца и подрыв ядер','александрит|alexandrite|пейнит|painite|опалы бездны|монацит|подрыв астероидов|взрывать астероиды|подорвать астероид|подрыв ядра|подрыв ядер|глубинная добыча|core mining|лазерная добыча|добыча астероидов|зоны концентрации|хотспот|анализатор импульсных волн|сейсмические заряды'],
 [activityGuide+'exploration.html','section-core-gameplay-mechanics','Основы исследования и экзобиология','экзобиология|экзо биология|exobiology|биологические образцы|сканировать растения|биосканер|сканер генетики|поиск биосигналов|сканирование планет|dss|fss'],
 [activityGuide+'exploration.html','section-the-exploration-activities','Исследовательские занятия и маршруты','нейтронная трасса|нейтронные звезды|нейтронный разгон|neutron highway|road to riches|дорога к богатству'],
 [activityGuide+'ax.html','','Как сражаться с таргоидами','таргоид|таргоиды|таргоидский перехватчик|thargoid|thargoids|anti xeno|ax combat'],
 [activityGuide+'combat.html','','Бой и охота за головами','охота за головами|bounty hunting|космические бои'],
 [activityGuide+'trading.html','','Торговля и торговые маршруты','торговый маршрут|торговые петли|trade loop|торговля грузами'],
 [activityGuide+'passenger.html','','Пассажирские миссии','пассажиры|робиго|robigo|перевозка пассажиров|пассажирские миссии'],
 [materialGuide+'high-grade-emissions.html','','Высококлассные сигналы','hge|эмиссия высокой степени|сигналы высоких классов|high grade emissions'],
 [materialGuide+'davs-hope.html','','Dav’s Hope','надежда дэва|дэва хоуп|давс хоуп|давс хоп'],
 [materialGuide+'jameson-crash-site.html','','Место крушения Джеймсона','кобра джеймсона|фарм данных джеймсон|джеймсон крэш сайт|место аварии джеймсона'],
 [materialGuide+'crystalline-shards.html','','Кристаллические осколки','кристаллические шипы|биологические кристаллы|фарм сырья'],
 [materialGuide+'materials.html','','Инженерные материалы','фарм материалов|обмен материалов|материал трейдер|material trader|инженерные ресурсы'],
 [engineeringManual+'checklist.html','','Порядок открытия инженеров','порядок инженеров|как открыть инженеров|дерево инженеров|разблокировка инженеров|unlock engineers'],
 [galaxyGuide+'fleet-carrier.html','','Авианосец','флит кэрриер|флотский авианосец|fleet carrier|авианосцы|перевозчик флота'],
 [galaxyGuide+'powerplay.html','','Powerplay','поверплей|пауэрплей|игра держав|power play'],
 [galaxyGuide+'bgs.html','','Фоновая симуляция','бгс|background simulation|малая фракция|влияние фракций'],
 [galaxyGuide+'community-goals.html','','Общественные цели','цели сообщества|community goal|community goals'],
 [galaxyGuide+'superpower-rank.html','','Ранги сверхдержав','ранг федерации|ранг империи|ранги федерации|ранги империи|прокачка ранга'],
 [galaxyGuide+'system-colonization.html','','Колонизация систем','колонизация|колонизация системы|колонизировать систему|colonisation'],
 [pilotGuide+'docking-landing-manual.html','','Стыковка и посадка','запросить посадку|запрос стыковки|пристыковаться|как сесть на станцию|посадка на станцию'],
 [pilotGuide+'hud-customization.html','','Настройка HUD','цвет интерфейса|цвет кабины|поменять цвет hud|цвет приборов'],
 [pilotGuide+'third-party-apps.html','','Сторонние приложения','трекинг|оверлей|инструменты командора|inara|edsy|edmc|eddiscovery|spansh'],
];
function rankCompanionGuides(catalog,sections,rawQuery,max=6){
 const query=guideSearchWords(rawQuery);
 if(!query.length)return [];
 const phrase=query.join(' ');
 const articlesByPath=new Map(catalog.map(entry=>[entry.path,entry]));
 const ranked=new Map();
 const put=(key,result,score)=>{
  if(!ranked.has(key)||score>ranked.get(key).score)ranked.set(key,{...result,score});
 };
 const add=(entry,title,section,score)=>put(entry.path,{entry,title,section},score);
 const scoreWords=(text,score)=>{
  const indexed=guideSearchWords(text);
  if(!guideWordsMatch(query,indexed))return 0;
  return score+(phrase===indexed.join(' ')?20:0)-Math.min(12,Math.max(0,indexed.length-query.length));
 };
 const relevantShips=new Map();
 for(const entry of catalog){
  if(entry.path.includes('/ship-dossiers/')){
   const shipWords=guideSearchWords(entry.title+' '+(guideShipAliases[entry.title]||''));
   if(!query.some(word=>guideWordsMatch([word],shipWords)))continue;
   const shipMatch=guideWordsMatch(query,shipWords);
   if(shipMatch){
    if(!relevantShips.has(entry.title))relevantShips.set(entry.title,[]);
    relevantShips.get(entry.title).push(entry);
   }else if(guideWordsMatch(query,[...shipWords,...guideSearchWords(entry.role+' '+(guideRoleAliases[entry.role]||''))])){
    const roleQuery=query.filter(word=>!guideWordsMatch([word],shipWords));
    const canonicalRole=guideSearchWords(entry.role);
    const canonicalMatch=guideWordsMatch(roleQuery,canonicalRole);
    add(entry,entry.title+' — '+entry.role,'',110+(canonicalMatch?15-canonicalRole.length:0));
   }
   continue;
  }
  const slug=entry.path.split('/').at(-1).replace(/\.html$/,'');
  const titleScore=Math.max(scoreWords(entry.title,85),scoreWords(slug,75));
  if(titleScore)add(entry,entry.title,'',titleScore);
  for(const [section,title] of sections[entry.path]||[]){
   const score=Math.max(scoreWords(title,62),scoreWords(section.replace(/^(?:section|module|engineer)-/,''),47));
   if(score)add(entry,title,section,score);
  }
 }
 for(const [title,guides] of relevantShips){
  const exact=phrase===guideSearchWords(title).join(' ');
  put('ship:'+title,{title,ship:title,guides},exact?125:113);
 }
 for(const [path,section,title,aliases] of guideSearchTopics){
  const entry=articlesByPath.get(path);
  if(!entry)continue;
  // Curated topics match a complete alias; a lone shared word is insufficient.
  const matched=aliases.split('|').some(alias=>{
   const words=guideSearchWords(alias);
   return query.length===words.length&&guideWordsMatch(query,words);
  });
  if(matched)add(entry,title,section,135);
 }
 // Without “FSD”, this can also refer to Guardian reinforcement modules. Keep those matches,
 // and include the relevant FSD unlock steps as a clearly named alternative.
 if(phrase==='усилитель стражей'){
  const checklist=articlesByPath.get(engineeringManual+'checklist.html');
  if(checklist)add(checklist,'Как получить ускоритель FSD Стражей','step-build-guardian-fsd-booster',(ranked.get(checklist.path)?.score||39)+1);
 }
 return [...ranked.values()].sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title,'ru')).slice(0,max);
}
