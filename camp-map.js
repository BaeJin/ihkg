/* iHKG field guide. Geometry follows the supplied site layout, not GPS. */
window.GuildMap = (() => {
  const scriptBase = new URL('.', document.currentScript.src);
  // Abstract zones preserve the source plan's left/right orientation, not scale.
  const camps = [
    {id:'tree',en:'TREE OF LIFE',name:'진입로 · 생명의 나무',x:300,y:94,source:['tree','entrance'],symbol:'✳'},
    {id:'fire',en:'FIRE CIRCLE',name:'캠프파이어',x:108,y:429,source:[],symbol:'♨'},
    {id:'plunge',en:'COLD PLUNGE',name:'콜드플런지',x:214,y:429,source:[]},
    {id:'garden',en:'BIG WILD',name:'조경수 공간',x:220,y:290,source:['frontplant','plant','treerows'],symbol:''},
    {id:'animals',en:'LITTLE WILD',name:'낮은 식물과 동물들',x:430,y:290,source:[],symbol:''},
    {id:'main',en:'CENTER CAMP',name:'먹고 · 마시고 · 함께',x:125,y:610,source:['drinking','music','indoor'],symbol:'◉'},
    {id:'free',en:'INDOOR CAMP',name:'비닐하우스 캠핑 공간',x:235,y:642,source:['sauna','house'],symbol:'△'},
    {id:'hut',en:'CABIN 1',name:'캐빈 1',x:343,y:646,source:[],symbol:'⌂'},
    {id:'hut2',en:'CABIN 2',name:'캐빈 2',x:415,y:646,source:[]},
    {id:'caravan',en:'CARAVAN',name:'카라반',x:495,y:646,source:['caravan'],symbol:'🚐'},
    {id:'toilet',en:'WC',name:'화장실',x:504,y:787,source:['toilet'],symbol:'🚻'}
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
      main:`<path d="M-65-4Q-37-13-23-42Q0-14 23-42Q37-13 65-4M-65-4Q-54 8-43-4Q-32 8-21-4Q-10 8 0-4Q11 8 22-4Q33 8 44-4Q55 8 65-4M-57 0V43H57V0M-23-42V-57L-8-51L-23-47M23-42V-57L38-51L23-47M-15 43V18Q0 3 15 18V43M-57 43L-77 43M57 43H77M-77 43L-65-4M77 43L65-4"/><path d="M-42 13H-29V27H-42ZM29 13H42V27H29Z"/>`
    };
    return `<g class="camp-pictogram" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${art[id]||''}</g>`;
  }
  function marker(p){
    if(p.id==='tree')return `<g class="zone-marker tree-marker" data-camp="tree" role="button" tabindex="0" aria-label="Tree of Life details" transform="translate(480 95)"><rect x="-48" y="-44" width="96" height="96" fill="transparent"/>${pictogram('tree')}<text class="tree-caption" y="50" text-anchor="middle">tree of life</text></g>`;
    if(['garden','animals'].includes(p.id))return `<g class="zone-marker" data-camp="${p.id}" role="button" tabindex="0" aria-label="${p.en}"><rect x="${p.id==='garden'?75:325}" y="190" width="${p.id==='garden'?205:200}" height="${p.id==='garden'?155:360}" fill="transparent"/></g>`;
    const icon=p.id==='hut2'?'hut':p.id;
    const scale=p.id==='main' ? .66 : .78;
    const caption=p.id==='toilet'?'W/C':p.en;
    const hitWidth=p.id==='main'||p.id==='plunge'?100:68;
    return `<g class="zone-marker" data-camp="${p.id}" role="button" tabindex="0" aria-label="${p.name}" transform="translate(${p.x} ${p.y})">
      <rect x="${-hitWidth/2}" y="-40" width="${hitWidth}" height="88" fill="transparent"/>
      <g transform="scale(${scale})">${pictogram(icon)}</g>
      <text class="facility-caption" y="44" text-anchor="middle">${caption}</text></g>`;
  }
  function terrain(){
    const big=[];for(const y of [208,282])for(const x of [105,180,255])big.push([x,y]);
    const little=[];for(const y of [218,294,370,446,522])for(const x of [345,420,495])little.push([x,y]);
    return `<svg viewBox="0 0 600 850" class="camp-terrain" aria-label="Camp map with perimeter roads and a highlighted route between two entrances.">
      
      <defs><g id="wild-tree" fill="none" stroke="#7a8976" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M-5 5C-20 9-24-7-15-14C-18-24-6-29 0-24C8-30 21-22 17-13C27-5 19 9 5 5" fill="#a6b19b" fill-opacity=".22"/><path d="M0-17V19M0 0L-9-9M0-3L9-12M-5 19H5"/></g></defs>
      <g class="map-roads" fill="none" stroke="#bcb3a7" stroke-width="2" stroke-linejoin="miter">
        <path d="M57 185Q57 155 87 155H543V730H87Q57 730 57 704Z"/>
        <path d="M57 350H300M57 512H300M300 155V730M300 570H543M543 155H585M543 730H585"/>
        <path class="entry-route" d="M300 155H585M543 155V730M300 730H585" stroke-width="8"/>
      </g>
      <g class="wild-icons" aria-hidden="true">
        ${big.map(([x,y])=>`<use href="#wild-tree" transform="translate(${x} ${y}) scale(.95)"/>`).join('')}
        ${little.map(([x,y])=>`<use href="#wild-tree" transform="translate(${x} ${y}) scale(.95)"/>`).join('')}
      </g>
      <g fill="#928777" font-family="monospace" font-size="11" letter-spacing="2"><text x="585" y="141" text-anchor="end">ENTRY</text><text x="585" y="754" text-anchor="end">ENTRY</text></g>
      ${camps.map(marker).join('')}
    </svg>`;
  }
  function parkingLinks(){return `<div class="parking-simple location-parking">${parking.map((p,i)=>`<a href="${p.url||naver(p.name)}" target="_blank" rel="noopener"><span>주차 위치 ${i?'B':'A'} <small>(${p.name})</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div>`;}
  function shortcutButtons(){
    const shortcuts=[
      ['location','LOCATION · PARKING','위치와 주차 안내','<path d="M3 7L11 3L21 7L29 3V25L21 29L11 25L3 29ZM11 3V25M21 7V29"/><circle cx="16" cy="14" r="3"/><path d="M16 17V21"/>'],
      ['nearby','NEARBY','주변 놀거리','<circle cx="16" cy="16" r="13"/><path d="m22 10-4 8-8 4 4-8Z"/>']
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
    {id:'kitchen',title:'주방/식당',shape:'M14 48H89V357H14Z',x:52,y:212,icon:'kitchen',files:['IMG_9677.jpeg']},
    {id:'prep',title:'보조주방',shape:'M89 48H147V141H89Z',x:118,y:100,files:[]},
    {id:'wc1',title:'화장실 1',shape:'M147 48H204V141H147Z',x:175,y:100,files:[]},
    {id:'wc2',title:'화장실 2',shape:'M204 48H261V141H204Z',x:232,y:100,files:[]},
    ...[3,2,1].map((n,i)=>({id:'sleep'+n,title:'침실 컨테이너 '+n,label:'침실 '+n,
      shape:`M${321+i*72} 48h72v93h-72Z`,x:357+i*72,y:100,files:[]})),
    {id:'lounge',title:'라운지',shape:'M89 183H189V242H261V357H89Z',x:157,y:284,icon:'music',files:['IMG_9693.mp4','IMG_9694.jpeg']},
    {id:'indoor',title:'캠핑 공간 (비닐하우스)',label:'비닐하우스 캠핑',shape:'M537 48H603V357H261V242H189V183H537Z',x:414,y:272,icon:'tent',files:['IMG_9678(1).mp4']}
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
  function interiorPlan(){
    return `<svg class="inside-plan" viewBox="0 0 620 379" aria-label="센터캠프 시설 배치도">
      <rect class="inside-outline" x="14" y="48" width="589" height="309"/>
      <rect x="261" y="48" width="60" height="93" fill="#bcb3a733"/>
      ${insideSpaces.map(p=>`<g class="inside-space" data-inside="${p.id}" role="button" tabindex="0" aria-label="${p.title}" aria-pressed="false">
        <path class="floor-zone" d="${p.shape}"/>
        ${p.icon?`<g transform="translate(${p.x} ${p.y-23}) scale(.6)">${insideIcon(p.icon)}</g>`:''}
        <text x="${p.x}" y="${p.y+(p.icon?16:0)}" text-anchor="middle">${p.label||p.title}</text></g>`).join('')}
      </svg>`;
  }
  function openInterior(initialSpace){
    const d=modal(`<section class="camp-interior"><button class="inside-back" aria-label="Back to camp map">← MAP</button><div class="inside-heading"><span class="eyebrow">INSIDE THE CAMP</span><h2>CENTER CAMP</h2></div>${interiorPlan()}<p class="inside-hint">Select a space to explore</p><section class="inside-detail" aria-live="polite"><div class="inside-detail-heading"><h3>Make yourself at home.</h3><span>— / ${String(insideSpaces.length).padStart(2,'0')}</span></div><p class="inside-description">A place to eat, rest and spend time together.</p><div class="camp-media inside-media"></div></section></section>`);
    d.querySelector('.inside-back').onclick=()=>d.close();
    let selection=0;
    async function select(id){
      const p=insideSpaces.find(s=>s.id===id),version=++selection;
      d.querySelectorAll('[data-inside]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.inside===id)));
      d.querySelector('.inside-detail h3').textContent=p.title;
      d.querySelector('.inside-detail-heading span').textContent=String(insideSpaces.indexOf(p)+1).padStart(2,'0')+' / '+String(insideSpaces.length).padStart(2,'0');
      const target=d.querySelector('.inside-media');
      target.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()});target.replaceChildren();
      const description=d.querySelector('.inside-description');
      description.textContent=p.files.length?'Loading site visit photos…':'Photos coming soon.';
      if(!p.files.length)return;
      try{
        await assets();if(version!==selection||!d.open||!target.isConnected)return;
        let count=0;
        for(const file of p.files){
          if(!window.GUILD_ASSETS[file])continue;
          const video=false,m=document.createElement(video?'video':'img');m.src=window.GUILD_ASSETS[file];
          if(video){m.controls=true;m.playsInline=true;m.preload='metadata';if(window.GUILD_ASSETS[file+'.jpg'])m.poster=window.GUILD_ASSETS[file+'.jpg'];}else m.alt=p.title+' — site visit';
          target.append(m);count++;
        }
        description.textContent=count?'현장 사진을 바탕으로 AI가 일부 정리·재구성한 이미지가 포함되어 있습니다.':'Photos coming soon.';
      }catch(e){if(version===selection&&target.isConnected)description.textContent='Unable to load media. Please try again.';}
    }
    d.querySelectorAll('[data-inside]').forEach(b=>{b.onclick=()=>select(b.dataset.inside);b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(b.dataset.inside);}};});
    if(initialSpace)select(initialSpace);
  }

  async function openCamp(id){
    if(id==='main'||id==='free'){openInterior(id==='free'?'indoor':null);return;}
    const p=camps.find(c=>c.id===id);
    if(id==='plunge'){modal(`<div class="camp-sheet-title"><span class="eyebrow">COLD PLUNGE</span><h2>콜드플런지</h2><p>모닥불 옆에 있습니다.</p></div>`);return;}
    const sources=p.source.map(id=>window.GUILD_PLACES.find(c=>c.id===id)).filter(Boolean);
    const planned=['free','fire'].includes(id);
    const d=modal(`<div class="camp-sheet-title"><span class="eyebrow">${p.en}</span><h2>${p.en}</h2><p>${planned?'Activities and availability will be announced.':'Explore our shared space.'}</p></div><div class="camp-media" aria-live="polite">${sources.length?'Loading photos…':'Photos coming soon.'}</div>`);
    if(!sources.length)return;
    const target=d.querySelector('.camp-media');
    try{await assets();if(!d.open||!target.isConnected)return;target.replaceChildren();
      const files=[...new Set(sources.map(p=>p.file))];if(id==='garden')files.push('IMG_9673.mp4');if(id==='free')files.push('IMG_9691.jpeg');
      for(const file of files){if(!window.GUILD_ASSETS[file])continue;const video=false,m=document.createElement(video?'video':'img');m.src=window.GUILD_ASSETS[file];if(video){m.controls=true;m.playsInline=true;m.preload='metadata';if(window.GUILD_ASSETS[file+'.jpg'])m.poster=window.GUILD_ASSETS[file+'.jpg'];}else m.alt=p.name+' 현장 사진';target.append(m);}
      const note=document.createElement('p');note.className='media-note';note.textContent='현장 사진을 바탕으로 AI가 일부 정리·재구성한 이미지가 포함되어 있습니다. 실제 배치는 달라질 수 있습니다.';target.append(note);
    }catch(e){if(target.isConnected)target.textContent='Unable to load media. Please check that the media files are available.';}
  }
  function naverIcon(query,label,url){return `<a class="naver-icon-link" href="${url||naver(query)}" target="_blank" rel="noopener" aria-label="${label} 네이버 지도에서 보기" title="${label} · 네이버 지도"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C9.4 3 5 7.6 5 14c0 7 11 15 11 15s11-8 11-15C27 7.6 22.6 3 16 3Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M11 19V9h3l5 7V9h2v10h-3l-5-7v7Z" fill="currentColor"/></svg></a>`;}
  function placeGuide(label,title,places){
    const rows=places.map(p=>`<div class="parking-location-row"><div><strong>${p.name}</strong><p>${p.address ? p.address+'<br>' : ''}${p.note}</p></div>${naverIcon(p.name,p.name,p.url)}</div>`).join('');
    modal(`<div class="camp-sheet-title"><span class="eyebrow">${label}</span><h2>${title}</h2></div><div class="parking-section guide-places">${rows}</div>`);
  }
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
    const d=modal(`<div class="camp-sheet-title"><span class="eyebrow">LOCATION · PARKING</span><h2>위치와 주차 안내</h2><div class="location-address-row"><div><strong>${address}</strong><p>송포로118번길 170-107</p></div>${naverIcon(address,'길드하우스 위치')}</div></div>
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
      d.querySelector('.lot-address').innerHTML=`<div><strong>${p.address}</strong><p>${p.note}</p></div>${naverIcon(p.name,p.name,p.url)}`;
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
    placeGuide('NEARBY','주변 놀거리',[
      {name:'일산호수공원',note:'커피 한 잔 들고 호숫가를 걷다가, 메타세쿼이아 길로 접어들어 보세요. 캠프에서 미처 못 나눈 이야기를 이어가기 좋은 산책길이에요.'},
      {name:'현대 모터스튜디오 고양',note:'자동차 한 대는 어떻게 만들어질까요? 평소엔 볼 수 없는 차체와 부품을 가까이서 들여다보는 재미가 있어요.'},
      {name:'아쿠아플라넷 일산',note:'커다란 수조 앞에 잠시 서서 마음에 드는 물고기 한 마리를 눈으로 따라가 보세요. 물빛 속 움직임을 구경하다 보면 시간이 금세 가요.'},
      {name:'엠스파 찜질방',note:'바깥에서 실컷 논 날, 뜨끈한 찜질방에 누워 몸을 녹여 보세요. 돌아가기 전 한 박자 느긋하게 쉬어 가기 좋아요.',url:naver('일산 주엽동 엠스파')}
    ]);
  }

  function bind(){
    document.querySelectorAll('[data-camp]').forEach(b=>{b.onclick=()=>openCamp(b.dataset.camp);b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCamp(b.dataset.camp);}};});
    document.querySelectorAll('[data-arrival]').forEach(b=>b.onclick=()=>arrival());
    const guides={location:arrival,nearby:showNearby};
    document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=guides[b.dataset.guide]);
  }
  return {render,bind,arrival};
})();
