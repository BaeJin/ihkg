// Show the verified schedule while Google Sheets refreshes.
let events=[
  {
    "id": "sheet-%EA%B8%B8%ED%95%98%EC%9D%98%20%EC%98%A8%EA%B8%B0%EB%A5%BC%20%EC%A7%80%EC%BC%9C%20%EC%A4%84%20%22%ED%99%94%EB%AA%A9%20%EB%82%9C%EB%A1%9C%22%20%EC%A7%81%EC%A0%91%20%EB%A7%8C%EB%93%A4%EA%B8%B0%7C%EC%A7%84%EB%B0%B0",
    "name": "길하의 온기를 지켜 줄 \"화목 난로\" 직접 만들기",
    "camp": "진배",
    "day": "2026-12-04",
    "time": "12/04(금) 오전 · 시각 미정 ~ 종료 미정",
    "desc": "5인 이상 지원 필요. 반나절 가량 소요. 재밌음!\n시간대: 오전 (시각 미정)",
    "type": "액티비티",
    "color": "#b59966"
  },
  {
    "id": "sheet-%EC%95%84%EA%B8%B0%EB%93%A4%20%ED%9E%90%EB%A7%81%ED%95%98%EB%8A%94%20%EC%B2%B4%ED%97%98%EB%86%8D%EC%9E%A5!%20(%ED%8C%8C%EB%A6%87%ED%8C%8C%EB%A6%87)%7C%EB%B0%80%EB%9D%BC",
    "name": "아기들 힐링하는 체험농장! (파릇파릇)",
    "camp": "밀라",
    "day": "2026-12-05",
    "time": "12/05(토) 10:00 ~ 종료 미정",
    "desc": "https://naver.me/xCBu6GcT",
    "type": "액티비티",
    "color": "#b59966"
  },
  {
    "id": "sheet-%EA%B3%A0%EA%B8%B0%EB%9E%91%20%EA%B0%99%EC%9D%B4%20%EB%A8%B9%EC%9D%84%20%EA%B9%80%EC%B9%98%20%EB%8B%B4%EA%B7%B8%EA%B8%B0%7C%ED%81%B4%EB%A1%9C%EC%9D%B4",
    "name": "고기랑 같이 먹을 김치 담그기",
    "camp": "클로이",
    "day": "2026-12-05",
    "time": "12/05(토) 오전 · 시각 미정 ~ 종료 미정",
    "desc": "배추 현지 조달 가능\n시간대: 오전 (시각 미정)",
    "type": "액티비티",
    "color": "#b59966"
  },
  {
    "id": "sheet-%EB%B2%84%EB%8B%9D%EB%A7%A8%20%EB%A7%8C%EB%93%A4%EA%B8%B0%7C%EC%A7%84%EB%B0%B0",
    "name": "버닝맨 만들기",
    "camp": "진배",
    "day": "2026-12-05",
    "time": "12/05(토) 오전 · 시각 미정 ~ 종료 미정",
    "desc": "각목으로 미니 버닝맨 만들기\n시간대: 오전 (시각 미정)",
    "type": "액티비티",
    "color": "#b59966"
  },
  {
    "id": "sheet-%EC%8F%98%EA%B0%80%EB%A6%AC%20%EB%82%9A%EC%8B%9C%7C%EC%A7%84%EB%B0%B0",
    "name": "쏘가리 낚시",
    "camp": "진배",
    "day": "2026-12-05",
    "time": "12/05(토) 오후 · 시각 미정 ~ 종료 미정",
    "desc": "농장 옆 수로에서 쏘가리가 낚인대요\n시간대: 오후 (시각 미정)",
    "type": "액티비티",
    "color": "#b59966"
  },
  {
    "id": "sheet-%ED%92%8B%EC%82%B4%7C",
    "name": "풋살",
    "camp": "진행자 미정",
    "day": "pending",
    "time": "시작 미정 ~ 종료 미정",
    "desc": "근처 체육시설 예약 가능",
    "type": "액티비티",
    "color": "#b59966"
  },
  {
    "id": "sheet-%EC%A1%B1%EA%B5%AC%7C",
    "name": "족구",
    "camp": "진행자 미정",
    "day": "pending",
    "time": "시작 미정 ~ 종료 미정",
    "desc": "근처 체육시설 예약 가능",
    "type": "액티비티",
    "color": "#b59966"
  },
  {
    "id": "sheet-%ED%94%BC%ED%81%B4%EB%B3%BC%7C",
    "name": "피클볼",
    "camp": "진행자 미정",
    "day": "pending",
    "time": "시작 미정 ~ 종료 미정",
    "desc": "근처 체육시설 예약 가능",
    "type": "액티비티",
    "color": "#b59966"
  }
];
let eventState='loading', eventLoading=false;
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function refreshEvents(){if(eventLoading)return;eventLoading=true;eventState='loading';if(tab==='events')render();try{events=await GuildEvents.load();eventState='ready'}catch{eventState='error'}finally{eventLoading=false;if(tab==='events')render()}}
function eventDays(){return [['all','ALL','전체'],...[...new Set(events.map(e=>e.day))].sort().map(d=>d==='pending'?[d,'TBD','미정']:[d,d.slice(5).replace('-','/'),['일','월','화','수','목','금','토'][new Date(d+'T12:00:00').getDay()]])]}

let tab='map',day='all',query='',category='전체',onlyFav=false,showEnded=false,zoom=1;let saved;try{saved=new Set(JSON.parse(localStorage.getItem('iguild-favorites')||'[]'))}catch{saved=new Set()}
const $=s=>document.querySelector(s),main=$('#main');const icons={map:'Map',events:'Events',shop:'Shop',more:'More',search:'Search'};
function eventStatus(e, now=Date.now()){
  if(Number.isFinite(e.endAt) && now>=e.endAt)return 'ended';
  if(Number.isFinite(e.startAt) && now>=e.startAt && now<e.endAt)return 'live';
  return 'scheduled';
}
// Build Events controls here so previously cached page shells can also start.
$('#floating').innerHTML='<button type="button" id="new-event" aria-label="이벤트 등록" title="이벤트 등록">+</button><button type="button" id="refresh-events" aria-label="새로고침" title="새로고침">↻</button>';
$('#filter')?.remove();
function filtered(){return events.filter(e=>(showEnded||eventStatus(e)!=='ended')&&(day==='all'||e.day===day||(e.day<=day && day<=e.endDay))&&(category==='전체'||e.type===category)&&(!onlyFav||saved.has(e.id))&&`${e.name} ${e.camp} ${e.desc} ${e.type}`.toLowerCase().includes(query.toLowerCase()))}
function favorite(id){saved.has(id)?saved.delete(id):saved.add(id);try{localStorage.setItem('iguild-favorites',JSON.stringify([...saved]))}catch{}render()}
function eventSummary(e, heading) {
  const byline = e.camp && e.camp !== '진행자 미정' ? `${e.type} - ${e.camp}` : e.type;
  return `<span class="event-kind">${byline}</span>
    <${heading} class="event-name">${e.name}</${heading}>
    <strong class="event-when">${e.time}</strong>
    <span class="event-notes">${e.desc}</span>`;
}
function row(event) {
  const e = Object.fromEntries(Object.entries(event).map(([k,v]) => [k,escapeHTML(v)]));
  const live=eventStatus(event)==='live';
  return `<article class="row event-card${live?' is-live':''}"><button class="open" data-open="${e.id}">${live?'<span class="event-live-label">진행 중</span>':''}${eventSummary(e,'h3')}</button>
    <button class="heart ${saved.has(e.id)?'on':''}" aria-label="${e.name} 즐겨찾기" aria-pressed="${saved.has(e.id)}" data-save="${e.id}">${saved.has(e.id)?'♥':'♡'}</button></article>`;
}
function list(){if(eventState==='loading'&&!events.length)return '<div class="empty" role="status">프로그램을 불러오는 중입니다…</div>';if(eventState==='error'&&!events.length)return '<div class="empty" role="alert">프로그램을 불러오지 못했습니다. 새로고침을 눌러 다시 시도해주세요.</div>';return filtered().map(row).join('')||'<div class="empty">표시할 항목이 없어요.<br>검색어나 필터를 바꿔보세요.</div>'}
function search(){return `<label class="search">⌕ <input id="query" aria-label="프로그램 검색" placeholder="Search events, camps…" value=""></label>`}
function map(){return GuildMap.render()}
function openEventForm(){
  const dialog=$('#detail'), body=$('#detailbody');
  body.innerHTML=`<form class="event-editor">
    <h2>이벤트 등록</h2>
    <label>프로그램 이름<input name="name" maxlength="100" required></label>
    <label>여는 사람<input name="host" maxlength="40" required></label>
    <label>구분<select name="type" required><option>액티비티</option><option>공유회</option><option>기여활동</option></select></label>
    <div class="event-period"><label>시작날짜<input type="date" name="startDate" required></label><label>시작시각<input type="time" name="startTime" required></label>
    <label>종료날짜<input type="date" name="endDate" required></label><label>종료시각<input type="time" name="endTime" required></label></div>
    <label>비고 (선택)<textarea name="note" maxlength="800" rows="2"></textarea></label>
    <p role="status"></p><div><button type="button" class="detail-action">닫기</button> <button type="submit" class="detail-action">등록하기</button></div></form>`;
  const form=body.querySelector('form'), fields=form.elements, status=form.querySelector('[role=status]');
  const submit=form.querySelector('[type=submit]');
  fetch(window.IHKG_SIGNUP_URL,{credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(10000)})
    .then(response=>response.json()).then(info=>{
      if(info.service==='ihkg-registration' && info.version<3){
        submit.disabled=true;
        status.textContent='웹 등록 기능을 준비 중입니다. ';
        const link=document.createElement('a');
        link.href=document.querySelector('#title a').href;
        link.target='_blank';link.rel='noopener';link.textContent='프로그램 시트에서 등록하기 ↗';
        status.append(link);
      }
    }).catch(()=>{});
  form.querySelector('[type=button]').onclick=()=>dialog.close();
  fields.startDate.onchange=()=>{if(!fields.endDate.value)fields.endDate.value=fields.startDate.value;};
  form.onsubmit=async e=>{
    e.preventDefault();
    const values=Object.fromEntries(new FormData(form));
    if(values.endDate+'T'+values.endTime<=values.startDate+'T'+values.startTime){
      status.textContent='종료 일시는 시작 일시보다 늦어야 합니다.';return;
    }
    if(submit.disabled)return;
    submit.disabled=true;status.textContent='등록 중…';
    try{
      const response=await fetch(window.IHKG_SIGNUP_URL,{method:'POST',credentials:'omit',
        headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({action:'createEvent',...values}),signal:AbortSignal.timeout(45000)});
      const result=await response.json();
      if(!response.ok || !result.ok || result.status!=='created')throw new Error(result.code);
      status.textContent='이벤트를 등록했습니다.';
      for(const control of form.querySelectorAll('input,select,textarea'))control.disabled=true;
      query='';day='all';category='전체';onlyFav=false;
      await refreshEvents();
    }catch(error){
      const messages={EVENT_EXISTS:'같은 이름과 진행자의 이벤트가 이미 있습니다.',INVALID_REQUEST:'웹 등록 기능을 준비 중입니다. 프로그램 시트에서 등록할 수 있습니다.',
        INVALID_EVENT:'프로그램 이름, 구분, 여는 사람을 확인해주세요. 이름과 진행자에 | 문자는 사용할 수 없습니다.',INVALID_RANGE:'시작과 종료 일시를 확인해주세요.',BUSY:'잠시 후 다시 시도해주세요.'};
      status.textContent=messages[error.message]||'저장 여부를 확인하지 못했습니다. 이벤트 목록을 확인한 뒤 다시 시도해주세요.';
      submit.disabled=false;
    }
  };
  dialog.showModal();
}
function addProgramSheetLink() {
  const link = document.createElement('a');
  link.href = 'https://docs.google.com/spreadsheets/d/1hsjCzkUuXfGeiYc5u4Gl9PJebVFk4YoYOtkpNCI-0oE/edit?gid=115898339#gid=115898339';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = '스프레드 시트 바로가기';
  $('#title').append(link);
}
function render(){document.body.classList.toggle('map',tab==='map');$('#title').textContent=tab==='map'?'iHKG / FIELD GUIDE':icons[tab];if(tab==='events')addProgramSheetLink();document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.tab===tab);b.setAttribute('aria-current',b.dataset.tab===tab?'page':'false')});document.body.classList.toggle('events-view',tab==='events');$('#floating').hidden=tab!=='events';$('#refresh-events').disabled=eventLoading;$('#mode').hidden=tab==='more';if(tab==='map')main.innerHTML=map();else if(tab==='shop')main.innerHTML=GuildShop.render();else if(tab==='more')main.innerHTML=`<section class="community-page"><span class="page-kicker">STAY CONNECTED</span><h1>More</h1><div class="community-links"><button class="community-link" disabled><span class="community-icon" aria-hidden="true"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 5C8.8 5 3 9.3 3 14.7c0 3.5 2.5 6.6 6.2 8.3L8 28l6-3.7 2 .1c7.2 0 13-4.4 13-9.7S23.2 5 16 5Z" fill="currentColor" stroke="none"/><g fill="#e8e0d8" stroke="none"><circle cx="10" cy="15" r="1.4"/><circle cx="16" cy="15" r="1.4"/><circle cx="22" cy="15" r="1.4"/></g></svg></span><span><b>길드하우스 단톡방</b><small>카카오톡</small></span><span class="link-pending">링크 준비 중</span></button><button class="community-link" disabled><span class="community-icon" aria-hidden="true"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 6V3H29V24H26"/><rect x="3" y="8" width="21" height="21" rx="3"/><circle cx="9" cy="14" r="2"/><path d="M4 25L10 19L14 23L18 17L24 24"/></svg></span><span><b>길드하우스 사진첩</b><small>구글포토</small></span><span class="link-pending">링크 준비 중</span></button><button class="community-link" disabled><span class="community-icon" aria-hidden="true"><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="5" width="22" height="25" rx="3"/><rect x="11" y="2" width="10" height="6" rx="2" fill="#e8e0d8"/><circle cx="11" cy="15" r="2"/><path d="M8 22v-1a3 3 0 0 1 6 0v1M18 14H23M18 20H23M9 26H23"/></svg></span><span><b>숙박자 명단</b><small>구글시트</small></span><span class="link-pending">길드 내부 안내</span></button></div></section>`;else main.innerHTML=search()+(tab==='events'?`<div class="days">${eventDays().map(d=>`<button data-day="${d[0]}" class="${day===d[0]?'selected':''}"><small>${d[1]}</small><b>${d[2]}</b></button>`).join('')}</div>`:'')+`<label class="ended-toggle"><input type="checkbox" id="show-ended" ${showEnded?'checked':''}> 종료된 일정 표시</label>`+`<p class="notice">${eventState==='loading'?'프로그램을 불러오는 중…':eventState==='error'?'저장된 일정을 표시하고 있어요. 새로고침하면 최신 일정을 확인합니다.':'공유회 · 프로그램 안내 — 일정은 변경될 수 있습니다.'}${onlyFav?' · 즐겨찾기만 표시':''}</p><section id="results">${list()}</section>`;bind();if(tab==='map')GuildMap.bind();if(tab==='shop')GuildShop.bind();}
function bind(){if($('#show-ended'))$('#show-ended').onchange=e=>{showEnded=e.target.checked;render();$('#show-ended').focus();};if($('#new-event'))$('#new-event').onclick=openEventForm;if($('#refresh-events'))$('#refresh-events').onclick=refreshEvents;document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>detail(b.dataset.open));document.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>favorite(b.dataset.save));document.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{day=b.dataset.day;render()});if($('#query')){$('#query').value=query;$('#query').oninput=e=>{query=e.target.value;$('#results').innerHTML=list();document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>detail(b.dataset.open));document.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>favorite(b.dataset.save))}}if($('#category'))$('#category').onchange=e=>{category=e.target.value;render()};if($('#reset'))$('#reset').onclick=()=>{category='전체';day='all';query='';onlyFav=false;render()};if($('#plus')){$('#plus').onclick=()=>{zoom=Math.min(1.8,zoom+.2);render()};$('#minus').onclick=()=>{zoom=Math.max(.7,zoom-.2);render()};$('#home').onclick=()=>{zoom=1;render()}}if($('#savedlist')){$('#savedlist').onclick=()=>{tab='events';onlyFav=true;day='all';query='';category='전체';render()};$('#alllist').onclick=()=>{tab='events';onlyFav=false;render()}}}
function detail(id){const event=events.find(e=>e.id===id);if(!event)return;const e=Object.fromEntries(Object.entries(event).map(([k,v])=>[k,escapeHTML(v)]));$('#detailbody').innerHTML=`<div class="details"><button class="close" style="position:static;color:inherit;float:right" aria-label="닫기">×</button>${eventSummary(e,'h2')}<button class="detail-action" id="dsave">${saved.has(id)?'♥ 즐겨찾기 해제':'♡ 즐겨찾기에 추가'}</button><button class="detail-action" id="dmap">지도에서 보기</button><p class="notice">프로그램과 일정은 변경될 수 있습니다.</p></div>`;$('#detail .close').onclick=()=>$('#detail').close();$('#dsave').onclick=()=>{favorite(id);$('#dsave').textContent=saved.has(id)?'♥ 즐겨찾기 해제':'♡ 즐겨찾기에 추가'};$('#dmap').onclick=()=>{tab='map';onlyFav=false;category='전체';day='all';query='';$('#detail').close();render()};if(!$('#detail').open)$('#detail').showModal();GuildSignup.mount(event)}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;query='';day='all';render()});$('#mode').onclick=()=>{tab=tab==='map'?'events':'map';render()};
const detailDialog=$('#detail');
function onBackdrop(event){
  if(event.target!==detailDialog)return false;
  const rect=detailDialog.getBoundingClientRect();
  return event.clientX<rect.left || event.clientX>=rect.right ||
    event.clientY<rect.top || event.clientY>=rect.bottom;
}
let backdropPointer=null;
detailDialog.addEventListener('pointerdown',event=>{
  backdropPointer=event.isPrimary && event.button===0 && onBackdrop(event)?event.pointerId:null;
});
detailDialog.addEventListener('pointercancel',()=>{backdropPointer=null});
detailDialog.addEventListener('click',event=>{
  if(backdropPointer!==null && event.pointerId===backdropPointer && onBackdrop(event))detailDialog.close();
  backdropPointer=null;
});
render();

refreshEvents();



function updateScheduleStatus(){
  if(tab!=='events')return;
  const cards=Array.from(main.querySelectorAll('.event-card'));
  const visible=filtered();
  if(cards.length!==visible.length || visible.some((e,i)=>cards[i].classList.contains('is-live')!==(eventStatus(e)==='live')))render();
}
setInterval(updateScheduleStatus,15000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateScheduleStatus();});
