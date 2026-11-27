/* Public program feed, including the user-authorized participant list. */
const GuildEvents = (() => {
  const endpoint = 'https://docs.google.com/spreadsheets/d/1hsjCzkUuXfGeiYc5u4Gl9PJebVFk4YoYOtkpNCI-0oE/gviz/tq';
  function parse(text) {
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
    if (!match) throw new Error('Invalid sheet response');
    const result = JSON.parse(match[1]);
    if (result.status !== 'ok' || !Array.isArray(result.table?.rows)) throw new Error('Sheet unavailable');
    const labels = result.table.cols.map(c => c.label);
    if (!labels.includes('프로그램') || !labels.includes('여는 사람')) throw new Error('Sheet columns changed');
    return result.table.rows.map(row => {
      const cells = row.c || [];
      const value = label => { const i=labels.indexOf(label); return String(cells[i]?.f ?? cells[i]?.v ?? '').trim(); };
      const type = value('구분') || '프로그램', name = value('프로그램'), host = value('여는 사람'), desc = value('비고');
      const rawDate = value('시작날짜') || value('날짜') || value('가능한 날짜');
      const date = rawDate.match(/(\d{4})\s*[.\/-]\s*(\d{1,2})\s*[.\/-]\s*(\d{1,2})/);
      const day = date ? date[1]+'-'+date[2].padStart(2,'0')+'-'+date[3].padStart(2,'0') : 'pending';
      const period = desc.match(/시간대:\s*(오전|오후)/)?.[1];
      const stamp = (date, clock, missing) => {
        if (!date && !clock) return missing;
        const parsed = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
        const dateText = parsed ? parsed[2]+'/'+parsed[3]+'('+'일월화수목금토'[new Date(date+'T12:00:00Z').getUTCDay()]+')' : '날짜 미정';
        return dateText+' '+(clock || '시각 미정');
      };
      const clock = value('시작시각') || value('시각') || value('시간') || (period && period+' · 시각 미정');
      const time = stamp(day==='pending'?'':day,clock,'시작 미정')+' ~ '+stamp(value('종료날짜'),value('종료시각'),'종료 미정');
      const participants = [...new Set(value('같이 하고 싶어요').split(/[,，\r\n]+/).map(s=>s.trim()).filter(Boolean))];
      return {id:'sheet-'+encodeURIComponent(name+'|'+host), name, camp:host || '진행자 미정',
        participants,
        startAt: Date.parse(day+'T'+(value('시작시각') || value('시각'))+':00+09:00'),
        endAt: Date.parse(value('종료날짜')+'T'+value('종료시각')+':00+09:00'),
        endDay: value('종료날짜'),
        day, time:time || '일정 미정', desc:desc || '세부 내용은 추후 안내합니다.',
        type};
    }).filter(event => event.name);
  }
  async function load() {
    const params = new URLSearchParams({gid:'115898339', range:'A2:I', headers:'1',
      tq:'select * where B is not null', tqx:'out:json', refresh:String(Date.now())});
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint+'?'+params, {signal:controller.signal, credentials:'omit'});
      if (!response.ok) throw new Error('HTTP '+response.status);
      return parse(await response.text());
    } finally { clearTimeout(timer); }
  }
  return {load, parse};
})();

