/* iHKG field guide. Geometry follows the supplied site layout, not GPS. */
window.GuildMap = (() => {
  const scriptBase = new URL('.', document.currentScript.src);
  // Abstract zones preserve the source plan's left/right orientation, not scale.
  const camps = [
    {id:'tree',en:'TREE OF LIFE',name:'진입로 · 생명의 나무',x:300,y:94,source:['tree','entrance'],symbol:'✳'},
    {id:'fire',en:'FIRE CIRCLE',name:'캠프파이어',x:108,y:466,source:[],symbol:'♨'},
    {id:'plunge',en:'COLD PLUNGE',name:'콜드플런지',x:214,y:466,source:[]},
    {id:'main',en:'CENTER CAMP',name:'먹고 · 마시고 · 함께',x:178,y:628,source:['drinking','music','indoor'],symbol:'◉'},
    {id:'free',en:'INDOOR CAMP',name:'캠핑 존',x:235,y:642,source:['sauna','house'],symbol:'△'},
    {id:'hut',en:'CABIN 1',name:'캐빈 1',x:343,y:646,source:[],symbol:'⌂'},
    {id:'hut2',en:'CABIN 2',name:'캐빈 2',x:415,y:646,source:[]},
    {id:'caravan',en:'CARAVAN',name:'카라반',x:495,y:646,source:['caravan'],symbol:'🚐'},
  ];
  const address='경기도 고양시 일산서구 대화동 1667-4';
  const parking=[{name:'대화농업체험공원 주차장',url:'https://naver.me/5T4pEsah',address:'경기도 고양시 일산서구 대수길 31-3',note:'공원 이용객과 함께 사용하는 주차장입니다. 요금과 개방 구역은 현장 안내를 확인해주세요.'},{name:'고양종합운동장 부설주차장',url:'https://naver.me/xFLsIsxD',address:'경기도 고양시 일산서구 중앙로 1601',note:'유료 주차장입니다. 경기·공연일에는 진입 구역과 주차 운영이 달라질 수 있습니다.'}];
  const naver=q=>'https://map.naver.com/p/search/'+encodeURIComponent(q);
  function pictogram(id){
    const art={
      tree:`<path d="M-6 13C-29 17-38-7-24-20C-27-34-9-44 1-34C14-43 31-31 27-18C40-5 29 17 7 13" fill="currentColor" fill-opacity=".10"/><path d="M0-25V19M0 4L-17-12M-10-5L-21-5M-10-5L-11-20M0-4L17-20M10-14L22-14M0 12L15 1M0 19L-9 28L-23 33M-9 28L-10 37M0 19L9 28L23 33M9 28L10 37M0 19V36"/>`,
      plunge:`<ellipse cx="0" cy="-5" rx="27" ry="9"/><path d="M-27-5l4 20q21 13 46 0l4-20M-13-5q5-4 11 0t12 0"/>`,
      fire:`<path d="M0-25C8-10 19-5 16 9C12 24-12 24-17 9C-21-3-9-10-9-18C-7-12-5-9-2-6C3-13 3-18 0-25Z" fill="currentColor" fill-opacity=".18"/><path d="M0 0C7 8 7 16 0 19C-8 16-7 9 0 0ZM-19 28L19 34M19 28L-19 34"/>`,
      hut:`<path d="M-28-6L0-29L28-6M-23-10V26H23V-10M10-21V-31H18V-15"/><path d="M-4 26V7H7V26M-17-3H-8V7H-17ZM12-3H20V5H12Z"/><path d="M-28 29H28"/>`,
      caravan:`<path d="M-29 15V-13Q-29-24-18-24H18Q27-24 29-13L32 15ZM32 12H43L47 17M-20-16H-5V-4H-20ZM5 15V-16H19V15"/><circle cx="-14" cy="17" r="6" fill="#e8e0d8"/><circle cx="-14" cy="17" r="2"/><path d="M14-1H15M25 20V25"/>`,
      toilet:`<g fill="currentColor" stroke="none"><circle cx="-16" cy="-24" r="5"/><circle cx="16" cy="-24" r="5"/><path d="M-23-15Q-23-18-20-18H-12Q-9-18-9-15V2H-12V26H-16V7H-18V26H-22V2H-25V-12Q-25-15-23-15Z"/><path d="M12-17H20L29 6H23L19-5L25 13H20V26H16V13H13V26H9V13H4L10-5L6 6H1L10-15Q10-17 12-17Z"/></g><path d="M0-30V30" stroke-width="1.5" opacity=".45"/>`,
      free:`<path d="M-38 24L0-30L38 24ZM0-30V24M-15 24L0-7L15 24M-38 24H-49M38 24H49M-49 24L-19-3M49 24L19-3"/><path d="M0-30V-39L12-35L0-31"/>`,
      main:`<g stroke="#71503b" stroke-width="1.55">
        <path d="M-65-4L-77 43H77L65-4" fill="none"/>
        <path d="M-57-3H57V43H-57Z" fill="#f1d6a2"/>
        <path d="M-57 0H57V7H-57Z" fill="#ddbb82" stroke="none"/>
        <path d="M-15 43V20Q0 3 15 20V43Z" fill="#526755"/>
        <path d="M-42 13H-29V27H-42ZM29 13H42V27H29Z" fill="#f9bc5d"/>
        <path d="M-35.5 13V27M35.5 13V27" stroke-width="1"/>
        <path d="M-65-4Q-37-13-23-42Q0-14 23-42Q37-13 65-4Q55 8 44-4Q33 8 22-4Q11 8 0-4Q-10 8-21-4Q-32 8-43-4Q-54 8-65-4Z" fill="#bb694d"/>
        <path d="M-23-42Q-27-17-43-4Q-32 8-21-4Q-16-24-23-42ZM23-42Q17-21 22-4Q33 8 44-4Q28-18 23-42Z" fill="#f6ddad" stroke="none"/>
        <path d="M-65-4Q-37-13-23-42Q0-14 23-42Q37-13 65-4Q55 8 44-4Q33 8 22-4Q11 8 0-4Q-10 8-21-4Q-32 8-43-4Q-54 8-65-4Z" fill="none"/>
        <path d="M-23-42V-57L-8-51L-23-47M23-42V-57L38-51L23-47" fill="#d6a34e"/>
      </g>`
    };
    return `<g class="camp-pictogram" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${art[id]||''}</g>`;
  }
  function marker(p){
    if(p.id==='tree')return `<g class="zone-marker tree-marker" data-camp="tree" role="button" tabindex="0" aria-label="Tree of Life details" transform="translate(480 95)"><rect x="-48" y="-44" width="96" height="96" fill="transparent"/>${pictogram('tree')}<text class="tree-caption" y="50" text-anchor="middle">tree of life</text></g>`;
    if(p.id==='hut'||p.id==='hut2')return `<g class="zone-marker" aria-hidden="true" pointer-events="none" transform="translate(${p.x} ${p.y}) scale(.78)">${pictogram('hut')}</g>`;
    const centerCamp=p.id==='main';
    const scale=centerCamp ? '1.51 1.76' : .78;
    const caption=p.id==='toilet'?'W/C':p.en;
    const hitWidth=centerCamp?236:p.id==='plunge'?100:68;
    return `<g class="zone-marker" data-camp="${p.id}" role="button" tabindex="0" aria-label="${p.name}" transform="translate(${p.x} ${p.y})">
      <rect x="${-hitWidth/2}" y="${centerCamp?-103:-40}" width="${hitWidth}" height="${centerCamp?198:88}" fill="transparent"/>
      <g transform="scale(${scale})">${p.id==='caravan'?'<path d="M-29 15V-13Q-29-24-18-24H18Q27-24 29-13L32 15Z" fill="#dae2cf"/><path d="M-20-16H-5V-4H-20Z" fill="#c5dadd"/>':''}${pictogram(p.id)}</g>
      <text class="facility-caption" y="${centerCamp?93:44}" text-anchor="middle">${caption}</text></g>`;
  }
  function terrain(){
    function grove(xs,ys){
      const trees=ys.flatMap(y=>xs.map(x=>`<use href="#wild-tree" transform="translate(${x} ${y}) scale(.95)"/>`)).join('');
      return `<g class="zone-marker grove" data-camp="wild" role="button" tabindex="0" aria-label="나무 지역 사진">
        <rect x="${xs[0]-28}" y="${ys[0]-32}" width="${xs.at(-1)-xs[0]+56}" height="${ys.at(-1)-ys[0]+64}" fill="transparent"/>
        ${trees}</g>`;
    }
    return `<svg viewBox="0 0 600 850" class="camp-terrain" aria-label="Camp map with perimeter roads and three entrances.">
      
      <defs><g id="wild-tree" fill="none" stroke="#7a8976" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M-5 5C-20 9-24-7-15-14C-18-24-6-29 0-24C8-30 21-22 17-13C27-5 19 9 5 5" fill="#a6b19b" fill-opacity=".22"/><path d="M0-17V19M0 0L-9-9M0-3L9-12M-5 19H5"/></g></defs>
      <g class="map-roads" fill="none" stroke="#bcb3a7" stroke-width="2" stroke-linejoin="miter">
        <path d="M57 185Q57 155 87 155H543V730H87Q57 730 57 704Z"/>
        <path d="M300 155V730M543 155H585M543 730H585"/>
        <path class="entry-route" d="M300 155H585M543 155V730M300 730H585" stroke-width="8"/>
      </g>
      <g transform="translate(402 134) scale(.55)" color="#82796a" aria-hidden="true" pointer-events="none">${pictogram('caravan')}</g>
      <g class="garden-art" fill="none" stroke="#82796a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" pointer-events="none">
        <g transform="translate(512 190)" aria-label="비닐하우스">
          <path d="M-20 14Q0-12 20 14V181Q0 155-20 181Z" fill="#c4d3c7" fill-opacity=".38"/>
          <path d="M-20 181V190H20V181M-20 14V24M20 14V24M0 2V168" opacity=".7"/>
          <path d="M-20 52Q0 26 20 52M-20 90Q0 64 20 90M-20 128Q0 102 20 128M-20 166Q0 140 20 166"/>
        </g>
        <g transform="translate(110 128) scale(.9)" aria-label="오리">
          <path d="M-24 1Q-20 7-8 4Q-2 3 0-4Q-3-17 9-18Q21-19 21-7Q22 0 16 3Q18 18 0 20Q-18 22-24 1Z" fill="#eee2bc"/>
          <path d="M21-8L30-5L21-2Z" fill="#ce9a67"/><circle cx="14" cy="-10" r="2" fill="#534d43" stroke="none"/>
          <path d="M-13 8Q-8 15 1 10M-4 21l-3 4m13-5 2 4"/>
        </g>
        <g transform="translate(172 128) scale(.9)" class="zone-marker" data-camp="chicken" role="button" tabindex="0" pointer-events="all" aria-label="닭 사진"><rect x="-37" y="-37" width="74" height="74" fill="transparent" stroke="none"/>
          <path d="M-11 2Q-20-12-24-9L-21 4L-28-1Q-24 12-14 13" fill="#beaa8c"/>
          <path d="M-15 6Q-11-1-4 0Q0-2 0-9Q0-19 11-18Q22-16 18-5Q21 6 14 14Q3 24-10 16Q-16 12-15 6Z" fill="#ece0ca"/>
          <path d="M2-17Q-2-25 4-23L7-19Q7-28 12-24L13-19Q19-24 19-18L16-15" fill="#b98479"/>
          <path d="M19-10L25-7L18-5Z" fill="#ce9a67"/><circle cx="13" cy="-10" r="1.9" fill="#534d43" stroke="none"/>
          <path d="M-8 7Q-3 14 4 7M-3 19v6l-4 2m13-9 1 7 4 2"/>
        </g>
      </g>
      ${grove([103,177,251],[218,294,370])}
      ${grove([352,433],[218,294,370])}
      ${grove([345,420,495],[458,543])}
      <g fill="#ad4a29" font-family="monospace" font-size="13" font-weight="bold" letter-spacing="1.5">
        <g class="zone-marker" data-camp="upper-entry" role="button" tabindex="0" aria-label="위쪽 입구 사진">
          <rect x="532" y="109" width="67" height="66" fill="transparent"/>
          <circle cx="585" cy="155" r="6" stroke="#fff4e0" stroke-width="2"/>
          <text x="590" y="141" text-anchor="end">ENTRY</text>
        </g>
        <g class="zone-marker" data-camp="lower-entry" role="button" tabindex="0" aria-label="아래쪽 오르막 입구 사진">
          <rect x="532" y="708" width="67" height="66" fill="transparent"/>
          <circle cx="585" cy="730" r="6" stroke="#fff4e0" stroke-width="2"/>
          <text x="590" y="754" text-anchor="end">ENTRY</text>
        </g>
      </g>
      ${camps.filter(p=>p.id!=='free').map(marker).join('')}
      <g class="zone-marker" data-camp="bridge" role="button" tabindex="0" aria-label="센터캠프 다리 입구 사진" transform="translate(39 634)">
        <rect x="-37" y="-41" width="74" height="79" fill="transparent"/>
        <g fill="none" stroke="#ad4a29" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M-22 7Q0-4 22 7L22 12Q0 2-22 12Z" fill="#efb48a"/>
          <path d="M-22 5V-8M-11 1V-13M0 0V-15M11 1V-13M22 5V-8M-22-6Q0-19 22-6"/>
        </g>
        <text x="0" y="31" text-anchor="middle" fill="#ad4a29" font-weight="bold" font-family="monospace" font-size="13" letter-spacing="1.5">ENTRY</text>
      </g>
    </svg>`;
  }
  function parkingLinks(){return `<div class="parking-simple location-parking">${parking.map((p,i)=>`<a href="${p.url||naver(p.name)}" target="_blank" rel="noopener"><span>주차 위치 ${i?'B':'A'} <small>(${p.name})</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div>`;}
  function shortcutButtons(){
    const shortcuts=[
      ['location','오시는 길','오시는 길','<path d="M3 7L11 3L21 7L29 3V25L21 29L11 25L3 29ZM11 3V25M21 7V29"/><circle cx="16" cy="14" r="3"/><path d="M16 17V21"/>'],
      ['nearby','주변 놀거리','주변 놀거리','<circle cx="16" cy="16" r="13"/><path d="m22 10-4 8-8 4 4-8Z"/>']
    ];
    return shortcuts.map(([id,label,title,icon])=>
      `<button class="offsite-parking" data-guide="${id}" aria-label="${title}" aria-haspopup="dialog" title="${title}"><svg viewBox="0 0 32 32" aria-hidden="true">${icon}</svg><span>${label}</span></button>`
    ).join('');
  }
  function render(){return `<section class="field-guide abstract-guide"><div class="field-heading map-heading"><h1 class="guild-wordmark" aria-label="2026 HKG GUILD CAMP"><span class="wordmark-top">2026 HKG</span><span class="wordmark-name">GUILD CAMP</span></h1><div class="map-shortcuts">${shortcutButtons()}</div></div><div class="abstract-map">${terrain()}</div></section>`;}

  function modal(content){
    let d=document.querySelector('#campDialog');
    if(!d){d=document.createElement('dialog');d.id='campDialog';d.className='camp-dialog';document.querySelector('#app').append(d);d.addEventListener('click',e=>{if(e.target===d)d.close()});d.addEventListener('close',()=>{d.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()});d.replaceChildren()});}
    d.querySelectorAll('video').forEach(v=>v.pause());
    d.innerHTML=`<button class="sheet-close" aria-label="닫기">×</button>${content}`;
    const heading=d.querySelector('h2');
    if(heading){heading.id='camp-dialog-title';d.setAttribute('aria-labelledby',heading.id);}
    d.querySelector('.sheet-close').onclick=()=>d.close(); if(!d.open)d.showModal(); return d;
  }
  let assetPromise;
  function assets(){if(window.GUILD_ASSETS)return Promise.resolve();if(!assetPromise)assetPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL('site-assets.js?v=20261117-photos1',scriptBase);s.onload=resolve;s.onerror=()=>{assetPromise=null;s.remove();reject(Error('자료를 불러오지 못했습니다.'))};document.head.append(s)});return assetPromise;}

  // Relative positions follow the site-visit plan; furniture is symbolic.
  const insideSpaces=[
    {id:'kitchen',title:'주방/식당',shape:'M14 48H89V357H14Z',x:52,y:212,icon:'kitchen',files:['kitchen-dining-tidy.webp']},
    {id:'prep',title:'보조주방',shape:'M89 48H147V141H89Z',x:118,y:100,files:['kitchen-clean.webp']},
    {id:'wc1',title:'화장실 1',shape:'M147 48H204V141H147Z',x:175,y:100,files:[]},
    {id:'wc2',title:'화장실 2',shape:'M204 48H261V141H204Z',x:232,y:100,files:[]},
    ...[3,2,1].map((n,i)=>({id:'sleep'+n,title:'침실 컨테이너 '+n,label:'침실 '+n,
      shape:`M${321+i*72} 48h72v93h-72Z`,x:357+i*72,y:100,files:[]})),
    {id:'lounge',title:'라운지',shape:'M89 183H189V242H261V357H89Z',x:157,y:284,icon:'music',files:['lounge-plan.webp?v=4'],preview:true},
    {id:'indoor',title:'캠핑 존',shape:'M537 48H603V357H261V242H189V183H537Z',x:414,y:272,icon:'tent',files:['camping-plan.webp?v=5'],preview:true}
  ];
  function insideIcon(id){
    const icons={
      table:'<rect x="-20" y="-48" width="40" height="96" rx="5"/><path d="M-32-33V-13M-32 13V33M32-33V-13M32 13V33M-10-60H10M-10 60H10"/>',
      kitchen:'<path d="M-28-32V-8Q-28 3-18 3Q-8 3-8-8V-32M-18-32V34M18 34V-32C30-23 31-4 29 9H18"/>',
      bed:'<path d="M-36-20V30M36 0V30M-36 18H36M-36 5H36V-4Q36-12 28-12H-4V5"/><rect x="-29" y="-12" width="18" height="13" rx="4"/>',
      lounge:'<rect x="-22" y="-12" width="44" height="28" rx="9"/><path d="M-30-22H30M-30 26H30M-34-18V-32H34V-18M-34 23V36H34V23"/>',
      tent:'<path d="M-38 28L0-32L38 28ZM0-32V28M-15 28L0-3L15 28M-45 28H45"/>',
      music:'<path d="M-13 18V-23L27-31V10M-13-12L27-20"/><ellipse cx="-23" cy="21" rx="10" ry="7" fill="currentColor" stroke="none"/><ellipse cx="17" cy="13" rx="10" ry="7" fill="currentColor" stroke="none"/>'
    };
    return `<g class="inside-furniture" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[id]}</g>`;
  }
  function insideDoor(x, facing, label){
    return `<g transform="translate(${x} 252) scale(${facing} 1)" pointer-events="none" role="img" aria-label="${label}">
      <path d="M0 1V37" stroke="#f1ece3" stroke-width="5"/>
      <path d="M0 38A38 38 0 0 0 38 0" fill="none" stroke="#9d8971" stroke-width="1.8"/>
      <path d="M0 0H38" stroke="#725b41" stroke-width="3" stroke-linecap="round"/>
    </g>`;
  }
  function interiorPlan(){
    return `<svg class="inside-plan" viewBox="0 0 620 379" aria-label="센터캠프 시설 배치도">
      <rect class="inside-outline" x="14" y="48" width="589" height="309"/>
      <rect x="261" y="48" width="60" height="93" fill="#bcb3a733"/>
      ${insideSpaces.map(p=>`<g class="inside-space" data-inside="${p.id}" role="button" tabindex="0" aria-label="${p.title}" aria-pressed="false">
        <path class="floor-zone" d="${p.shape}"/>
        ${p.icon?`<g transform="translate(${p.x} ${p.y-23}) scale(.6)">${insideIcon(p.icon)}</g>`:''}
        <text x="${p.x}" y="${p.y+(p.icon?16:0)}" text-anchor="middle">${p.label||p.title}</text></g>`).join('')}
      ${insideDoor(14,1,'주방/식당 왼쪽 문')}
      ${insideDoor(603,-1,'캠핑 존 오른쪽 문')}
      </svg>`;
  }
  function openInterior(initialSpace){
    const d=modal(`<section class="camp-interior"><button class="inside-back" aria-label="Back to camp map">← MAP</button><div class="inside-heading"><span class="eyebrow">INSIDE THE CAMP</span><h2>CENTER CAMP</h2></div>${interiorPlan()}<p class="inside-hint">Select a space to explore</p><section class="inside-detail" aria-live="polite"><div class="inside-detail-heading"><h3>Make yourself at home.</h3><span>— / ${String(insideSpaces.length).padStart(2,'0')}</span></div><p class="inside-description">A place to eat, rest and spend time together.</p><div class="camp-media inside-media"></div></section></section>`);
    d.querySelector('.inside-back').onclick=()=>d.close();
    function select(id){
      const p=insideSpaces.find(s=>s.id===id);
      d.querySelectorAll('[data-inside]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.inside===id)));
      d.querySelector('.inside-detail h3').textContent=p.title;
      d.querySelector('.inside-detail-heading span').textContent=String(insideSpaces.indexOf(p)+1).padStart(2,'0')+' / '+String(insideSpaces.length).padStart(2,'0');
      const target=d.querySelector('.inside-media');
      target.replaceChildren();
      const description=d.querySelector('.inside-description');
      description.textContent=p.files.length?(p.preview?'현장 사진에 인조잔디와 배치 드로잉을 더한 예상도입니다.':'현장 사진을 바탕으로 정리한 이미지입니다.'):'아직 등록된 사진이 없습니다.';
      for(const file of p.files){
        const image=document.createElement('img');
        image.alt=p.title+(p.preview?' 배치 예상도':' 사진');
        image.src=new URL('media/'+file,scriptBase);
        image.onerror=()=>{if(image.isConnected)description.textContent='사진을 불러오지 못했습니다.';};
        target.append(image);
      }
    }
    d.querySelectorAll('[data-inside]').forEach(b=>{b.onclick=()=>select(b.dataset.inside);b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(b.dataset.inside);}};});
    if(initialSpace)select(initialSpace);
  }

  async function openCamp(id){
    if(id==='upper-entry'){
      modal(`<div class="camp-sheet-title"><span class="eyebrow">ENTRY</span><h2>위쪽 입구</h2></div>
        <div class="camp-media"><img src="${new URL('media/upper-entry.webp',scriptBase)}" alt="초록색 울타리 옆으로 이어지는 위쪽 입구 진입로"></div>`);
      return;
    }
    if(id==='bridge'||id==='lower-entry'){
      const lower=id==='lower-entry';
      const title=lower?'아래쪽 오르막 입구':'센터캠프 다리 입구';
      const photo=lower?'lower-entry.webp':'center-entry.webp';
      const direction=lower?'오른쪽 자갈길 오르막 끝':'흰색 천막 오른쪽 입구';
      const arrow=lower?'M744 419Q830 382 959 350M931 344L959 350L940 371':'M326 294Q275 299 215 364M218 344L214 366L237 358';
      modal(`<div class="camp-sheet-title"><span class="eyebrow">ENTRY</span><h2>${title}</h2></div>
        <svg viewBox="0 0 1000 750" width="100%" role="img" aria-label="${direction} 방향을 표시한 현장 사진">
          <image href="${new URL('media/'+photo,scriptBase)}" width="1000" height="750"/>
          <g style="filter:drop-shadow(0 2px 3px #25354b) drop-shadow(0 0 4px #ecfaff)" fill="white">
            <text x="${lower?602:314}" y="${lower?438:282}" font-family="Segoe Print, Trebuchet MS, sans-serif" font-size="46" font-style="italic" font-weight="bold">ENTRY</text>
            <path d="${arrow}" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>`);
      return;
    }
    if(id==='wild'||id==='chicken'){
      const wild=id==='wild';
      const title=wild?'나무 지역':'닭';
      const files=wild?['IMG_9668.jpg','IMG_9670.jpg']:['camp-chickens.webp'];
      const photos=files.map(file=>`<img src="${new URL('media/'+file,scriptBase)}" alt="${title} 현장 사진">`).join('');
      modal(`<div class="camp-sheet-title"><span class="eyebrow">${wild?'WILD':'CHICKEN'}</span><h2>${title}</h2></div><div class="camp-media">${photos}</div>`);
      return;
    }
    if(id==='main'||id==='free'){openInterior(id==='free'?'indoor':null);return;}
    const p=camps.find(c=>c.id===id);
    if(id==='plunge'){modal(`<div class="camp-sheet-title"><span class="eyebrow">COLD PLUNGE</span><h2>콜드플런지</h2><p>모닥불 옆에 있습니다.</p></div>`);return;}
    const sources=p.source.map(id=>window.GUILD_PLACES.find(c=>c.id===id)).filter(Boolean);
    const planned=['free','fire'].includes(id);
    const d=modal(`<div class="camp-sheet-title"><span class="eyebrow">${p.en}</span><h2>${p.en}</h2><p>${planned?'Activities and availability will be announced.':'Explore our shared space.'}</p></div><div class="camp-media" aria-live="polite">${sources.length?'Loading photos…':'Photos coming soon.'}</div>`);
    if(!sources.length)return;
    const target=d.querySelector('.camp-media');
    try{await assets();if(!d.open||!target.isConnected)return;target.replaceChildren();
      const files=[...new Set(sources.map(p=>p.file))];if(id==='free')files.push('IMG_9691.jpeg');
      for(const file of files){if(!window.GUILD_ASSETS[file])continue;const video=false,m=document.createElement(video?'video':'img');m.src=window.GUILD_ASSETS[file];if(video){m.controls=true;m.playsInline=true;m.preload='metadata';if(window.GUILD_ASSETS[file+'.jpg'])m.poster=window.GUILD_ASSETS[file+'.jpg'];}else m.alt=p.name+' 현장 사진';target.append(m);}
      const note=document.createElement('p');note.className='media-note';note.textContent='현장 사진을 바탕으로 AI가 일부 정리·재구성한 이미지가 포함되어 있습니다. 실제 배치는 달라질 수 있습니다.';target.append(note);
    }catch(e){if(target.isConnected)target.textContent='Unable to load media. Please check that the media files are available.';}
  }
  function naverIcon(query,label,url){return `<a class="naver-icon-link" href="${url||naver(query)}" target="_blank" rel="noopener" aria-label="${label} 네이버 지도에서 보기" title="${label} · 네이버 지도"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C9.4 3 5 7.6 5 14c0 7 11 15 11 15s11-8 11-15C27 7.6 22.6 3 16 3Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M11 19V9h3l5 7V9h2v10h-3l-5-7v7Z" fill="currentColor"/></svg></a>`;}
  function arrival(){
    // Coordinates follow the orientation and turns of the supplied walking map.
    // All points use the original satellite image's pixel coordinates.
    const venue=[[566,130],[685,0],[916,126],[996,191],[884,330]];
    const connector=[[1787,1152],[1687,1135],[1322,1014],[1365,843],[1184,735]];
    const paths=[
      {label:'짧은 길',meters:200,points:[[1171,714],[1349,470],[1009,231],[996,248],[966,227],[950,216]]},
      {label:'돌아가는 길',meters:550,points:[[1150,726],[986,965],[597,1046],[521,899],[275,835],[139,448],[547,63],[608,115]]}
    ];
    const formGroup=(name,title,labels)=>`<fieldset><legend>${title}</legend><div class="route-options">${labels.map((text,i)=>
      `<label><input type="radio" name="${name}" value="${i}" ${i===0?'checked':''}><span>${text}</span></label>`
    ).join('')}</div></fieldset>`;
    const d=modal(`<div class="camp-sheet-title arrival-title"><h2>오시는 길</h2></div>
      <section class="arrival-destination" aria-labelledby="venue-address-title">
        <h3 id="venue-address-title">길드하우스 주소</h3>
        <div class="arrival-address"><div><strong>경기도 고양시 일산서구 송포로118번길 170-107</strong><small>지번 · 대화동 1667-4</small></div>${naverIcon(address,'길드하우스 주소')}</div>
      </section>
      <div class="walking-guide">${formGroup('lot','주차장',parking.map(p=>p.name))}
      <div class="lot-address parking-location-row" aria-live="polite"></div>
      ${formGroup('walk','주차장에서 오는 길',paths.map(p=>p.label))}
      <div class="route-result" aria-live="polite"></div></div>`);
    const draw=()=>{
      const lot=Number(d.querySelector('input[name=lot]:checked').value);
      const walk=Number(d.querySelector('input[name=walk]:checked').value);
      const path=paths[walk], p=parking[lot];
      const points=lot ? connector.concat(path.points) : path.points;
      const line=(pts,cls)=>`<polyline class="${cls}" points="${pts.map(pt=>pt.join(',')).join(' ')}"/>`;
      const pin=pt=>`<circle class="route-pin" cx="${pt[0]}" cy="${pt[1]}" r="18"/>`;
      const label=(x,y,text,anchor='middle')=>`<text class="route-label" x="${x}" y="${y}" text-anchor="${anchor}" style="font-size:60px">${text}</text>`;
      const distances=paths.map(route=>Math.round((route.meters+(lot ? 218 : 0))/10)*10);
      d.querySelectorAll('input[name=walk]').forEach((input,i)=>{
        input.nextElementSibling.textContent=`${paths[i].label} · 약 ${distances[i]} m`;
      });
      const meters=distances[walk];
      d.querySelector('.lot-address').innerHTML=`<div><small>선택한 주차장 주소</small><strong>${p.address}</strong></div>${naverIcon(p.name,p.name,p.url)}`;
      const cautions=walk===0
        ? ['근처에 민가가 있으니 조용히 지나가 주세요.','좁은 다리를 건너야 합니다.']
        : ['길가에서 개가 짖을 수 있으니 놀라지 마세요.'];
      d.querySelector('.route-result').innerHTML=`<section class="walk-cautions"><h3>주의사항</h3><ul><li>농로입니다. 야간에는 불빛이 없으니 조심하세요.</li>${cautions.map(text=>`<li>${text}</li>`).join('')}</ul></section><div class="route-summary"><strong>${p.name} → ${path.label}</strong><b>약 ${meters} m</b></div>
        <div class="map-zoom-controls" role="group" aria-label="지도 배율">
          <button type="button" data-map-minus aria-label="지도 축소" disabled>−</button>
          <output aria-label="현재 지도 배율">100%</output>
          <button type="button" data-map-plus aria-label="지도 확대">＋</button>
        </div>
        <div class="walking-viewport" tabindex="0" role="region" aria-label="도보 경로 지도">
        <svg class="walking-map" viewBox="0 0 2092 1241" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${p.name}에서 길드하우스까지 ${path.label} 위성 지도">
          <image href="${new URL('media/arrival-aerial.webp',scriptBase)}" width="2092" height="1241"/>
          <rect width="2092" height="1241" fill="#091710" opacity=".38"/>
          <polygon class="venue-area" points="${venue.map(pt=>pt.join(',')).join(' ')}" fill="#ffc65c" fill-opacity=".44" stroke="#ffe198" stroke-width="2" vector-effect="non-scaling-stroke"><title>길드하우스 영역</title></polygon>
          ${line(points,'route-outline')}${line(points,'route-active')}
          ${pin(points[0])}${pin(points[points.length-1])}
          ${label(775,165,'길드하우스')}
          ${label(1640,350,'대화천')}
          ${label(1250,655,'대화농업체험공원')}${label(1250,715,'주차장')}
          ${label(2050,866,'고양종합운동장','end')}${label(2050,932,'제1주차장','end')}
        </svg></div>
        <p class="aerial-credit">위성영상 © Kakao</p>
        <p class="route-note">노란 면은 길드하우스, 청록색 선은 선택한 도보 경로입니다.</p>`;
      const viewport=d.querySelector('.walking-viewport');
      const map=viewport.querySelector('svg');
      const plus=d.querySelector('[data-map-plus]'), minus=d.querySelector('[data-map-minus]');
      let zoom=1;
      function resizeMap(next){
        const ratio=next/zoom;
        const cx=viewport.scrollLeft+viewport.clientWidth/2, cy=viewport.scrollTop+viewport.clientHeight/2;
        map.style.width=(next*100)+'%';
        viewport.scrollTo(cx*ratio-viewport.clientWidth/2,cy*ratio-viewport.clientHeight/2);
        zoom=next;
        plus.disabled=zoom===4;
        minus.disabled=zoom===1;
        d.querySelector('.map-zoom-controls output').textContent=(zoom*100)+'%';
      }
      plus.onclick=()=>resizeMap(Math.min(4,zoom+1));
      minus.onclick=()=>resizeMap(Math.max(1,zoom-1));
      viewport.onpointerdown=e=>{
        if(e.pointerType!=='mouse'||e.button!==0||zoom===1)return;
        viewport.setPointerCapture(e.pointerId);
        const left=viewport.scrollLeft,top=viewport.scrollTop;
        viewport.onpointermove=move=>viewport.scrollTo(left+e.clientX-move.clientX,top+e.clientY-move.clientY);
      };
      viewport.onlostpointercapture=()=>{viewport.onpointermove=null;};
    };
    d.querySelectorAll('.route-options input').forEach(input=>input.addEventListener('change',draw));
    draw();
  }
  function showNearby(){
    const places=[
      {name:'일산호수공원',note:'달맞이섬의 정자, 월파정을 목적지로 잡아 보세요. 호숫가를 걷다 섬 안으로 들어서면 방금 걸어온 물가가 건너편 풍경이 됩니다.'},
      {name:'현대 모터스튜디오 고양',note:'자동차 안에 접혀 있던 에어백이 여기서는 터널의 벽을 이룹니다. 터널을 지나 충돌 테스트 영상까지 보면 운전석에서 볼 수 없던 자동차의 속사정이 보여요.'},
      {name:'아쿠아플라넷 일산',note:'메인 수조에서 한 몸처럼 방향을 트는 정어리 떼를 보고, 더 정글에서는 미어캣과 눈을 맞춰 보세요. 마지막 코스는 옥상 동물원 스카이팜이에요.'},
      {name:'엠스파 찜질방',note:'불한증막에서 땀을 낸 뒤 찜질복 차림으로 치킨을 나눠 먹는 게 이곳의 재미예요. 한증막의 열기가 부담스럽다면 자수정방부터 들러 보세요.',url:naver('일산 주엽동 엠스파')}
    ];
    const events=[
      {name:'Anime X Game Festival 2026',when:'12.4(금)–12.6(일) · 매일 09:30–18:00',hall:'제1전시장 1–5홀',note:'애니메이션과 게임 부스가 다섯 홀에 걸쳐 펼쳐집니다. 좋아하는 작품의 부스와 성우들이 오르는 RED 스테이지를 일정에 함께 담아 보세요.',link:'https://www.agfkorea.com/event?idx=1',action:'공식 행사 안내'},
      {name:'2026 타임캡슐 슈퍼콘서트 in 일산',when:'12.5(토) · 16:00',hall:'제2전시장 9홀',note:'노래방에서 따라 부르던 Y2K와 이브(EVE)의 노래를 원곡 가수의 목소리로 듣는 토요일. 그 시절 선곡 취향이 같았던 친구와 가기 좋은 무대예요.',link:'https://m.smartstore.naver.com/timecapsulesuperconcert/products/13835944517',action:'공연 안내·예매'}
    ];
    const listings=events.map(e=>`<article class="parking-location-row"><div><small>${e.when} · ${e.hall}</small><h4>${e.name}</h4><p>${e.note}</p><a href="${e.link}" target="_blank" rel="noopener">${e.action} ↗</a></div></article>`).join('');
    const outings=places.map(p=>`<div class="parking-location-row"><div><strong>${p.name}</strong><p>${p.note}</p></div>${naverIcon(p.name,p.name,p.url)}</div>`).join('');
    modal(`<div class="camp-sheet-title"><h2>주변 놀거리</h2></div>
      <section class="parking-section guide-places nearby-events"><h3>킨텍스 공연·전시</h3>${listings}</section>
      <section class="parking-section guide-places"><h3>주변 나들이</h3>${outings}</section>`);

  }

  function bind(){
    document.querySelectorAll('[data-camp]').forEach(b=>{b.onclick=()=>openCamp(b.dataset.camp);b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCamp(b.dataset.camp);}};});
    document.querySelectorAll('[data-arrival]').forEach(b=>b.onclick=()=>arrival());
    const guides={location:arrival,nearby:showNearby};
    document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=guides[b.dataset.guide]);
  }
  return {render,bind,arrival};
})();
