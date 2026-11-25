/* Read-only public program feed. Never requests the attendee column or lodging tab. */
const GuildEvents = (() => {
  const endpoint = 'https://docs.google.com/spreadsheets/d/1hsjCzkUuXfGeiYc5u4Gl9PJebVFk4YoYOtkpNCI-0oE/gviz/tq';
  function parse(text) {
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
    if (!match) throw new Error('Invalid sheet response');
    const result = JSON.parse(match[1]);
    if (result.status !== 'ok' || !Array.isArray(result.table?.rows)) throw new Error('Sheet unavailable');
    const labels = result.table.cols.map(c => c.label);
    if (labels.join('|') !== '구분|프로그램|여는 사람|가능한 날짜|비고') throw new Error('Sheet columns changed');
    return result.table.rows.map(row => {
      const cells = row.c || [];
      const value = i => String(cells[i]?.f ?? cells[i]?.v ?? '').trim();
      const type = value(0) || '프로그램', name = value(1), host = value(2), time = value(3), desc = value(4);
      const date = time.match(/(\d{4})\s*\.\s*(\d{1,2})\s*\.\s*(\d{1,2})/);
      const day = date ? date[1]+'-'+date[2].padStart(2,'0')+'-'+date[3].padStart(2,'0') : 'pending';
      return {id:'sheet-'+encodeURIComponent(name+'|'+host), name, camp:host || '진행자 미정',
        day, time:time || '일정 미정', desc:desc || '세부 내용은 추후 안내합니다.',
        type, icon:'◷', color:'#b59966'};
    }).filter(event => event.name);
  }
  async function load() {
    const params = new URLSearchParams({gid:'115898339', range:'A2:F', headers:'1',
      tq:'select A,B,C,D,F where B is not null', tqx:'out:json'});
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