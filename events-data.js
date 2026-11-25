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
      const rawDate = value('날짜') || value('가능한 날짜');
      const date = rawDate.match(/(\d{4})\s*[.\/-]\s*(\d{1,2})\s*[.\/-]\s*(\d{1,2})/);
      const day = date ? date[1]+'-'+date[2].padStart(2,'0')+'-'+date[3].padStart(2,'0') : 'pending';
      const period = desc.match(/시간대:\s*(오전|오후)/)?.[1];
      const time = labels.includes('날짜') ? (day==='pending'?'날짜 미정':day)+' · '+(value('시각') || value('시간') || (period?period+' · 시각 미정':'시각 미정')) : rawDate;
      const participants = [...new Set(value('같이 하고 싶어요').split(/\n/).map(s=>s.trim()).filter(Boolean))];
      return {id:'sheet-'+encodeURIComponent(name+'|'+host), name, camp:host || '진행자 미정',
        participants,
        day, time:time || '일정 미정', desc:desc || '세부 내용은 추후 안내합니다.',
        type, icon:'◷', color:'#b59966'};
    }).filter(event => event.name);
  }
  async function load() {
    const params = new URLSearchParams({gid:'115898339', range:'A2:G', headers:'1',
      tq:'select A,B,C,D,E,F,G where B is not null', tqx:'out:json'});
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
