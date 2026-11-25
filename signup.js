const GuildSignup = (() => {
  const pending = new Map();
  function endpoint() {
    const value = window.IHKG_SIGNUP_URL || '';
    return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(value) ? value : '';
  }
  function requestId(key) {
    if (!pending.has(key)) pending.set(key, crypto.randomUUID());
    return pending.get(key);
  }
  async function submit(eventId, name, website = '') {
    const url = endpoint();
    if (!url) throw new Error('NOT_CONFIGURED');
    const normalized = name.normalize('NFKC').trim().replace(/\s+/g, ' ');
    if (!normalized || Array.from(normalized).length > 40 || /[\u0000-\u001f\u007f]/.test(name)) throw new Error('INVALID_NAME');
    const key = JSON.stringify([eventId, normalized.toLocaleLowerCase('ko-KR')]);
    const id = requestId(key);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      // text/plain avoids a preflight; Google ContentService redirects are followed.
      // Never use no-cors: an opaque response cannot confirm that anything was saved.
      const response = await fetch(url, {
        method: 'POST', headers: {'Content-Type': 'text/plain;charset=UTF-8'},
        credentials: 'omit', redirect: 'follow', signal: controller.signal,
        body: JSON.stringify({action: 'register', eventId, name: normalized, requestId: id, website})
      });
      if (!response.ok) throw new Error('UNCONFIRMED');
      const result = await response.json();
      if (!result.ok) throw new Error(result.code || 'UNCONFIRMED');
      if (!['registered', 'duplicate'].includes(result.status) || result.requestId !== id) throw new Error('UNCONFIRMED');
      pending.delete(key);
      return result;
    } finally { clearTimeout(timeout); }
  }
  function mount(event) {
    if (!endpoint()) return;
    const container = document.querySelector('#detailbody .details');
    if (!container) return;
    const participants = document.createElement('section');
    participants.className = 'signup-participants';
    participants.innerHTML = '<h3>같이 하고 싶어요 <span class="participant-count"></span></h3><div class="participant-names"></div><p class="participant-load" role="status">현재 참여자를 확인하고 있어요…</p>';
    container.appendChild(participants);
    function showParticipants(names) {
      participants.querySelector('.participant-count').textContent = names.length+'명';
      const list=participants.querySelector('.participant-names'); list.replaceChildren();
      names.forEach(name=>{const chip=document.createElement('span');chip.textContent=name;list.appendChild(chip);});
      participants.querySelector('.participant-load').textContent = names.length ? '' : '아직 등록된 참여자가 없어요. 첫 번째로 함께해 주세요!';
    }
    let rosterRequest = 0;
    async function refreshRoster(registeredName) {
      const request = ++rosterRequest;
      const note = participants.querySelector('.participant-load');
      try {
        const items = await GuildEvents.load();
        if (!participants.isConnected || request !== rosterRequest) return;
        const current = items.find(item => item.id === event.id);
        if (!current) throw new Error('Event missing');
        event.participants = current.participants || [];
        showParticipants(event.participants);
        const normalize = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
        if (registeredName && !event.participants.some(name => normalize(name) === normalize(registeredName))) {
          note.textContent = '신청은 저장됐습니다. 공개 명단에는 아직 반영되지 않았습니다.';
        }
      } catch {
        if (participants.isConnected && request === rosterRequest) {
          note.textContent = '현재 명단을 불러오지 못했습니다. 잠시 후 다시 열어주세요.';
        }
      }
    }
    refreshRoster();
    const form = document.createElement('form');
    form.className = 'signup-form';
    form.innerHTML = `<h3>참여 신청</h3>
      <label for="signup-name">이름</label>
      <input id="signup-name" name="name" autocomplete="name" maxlength="40" required aria-describedby="signup-hint">
      <p id="signup-hint">신청한 이름은 참여자 명단에 표시됩니다.<br>동명이인은 이름 뒤에 별칭을 붙여주세요.</p>
      <label class="signup-trap" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <button class="detail-action" type="submit">참여 신청</button>
      <p class="signup-status" role="status" aria-live="polite"></p>`;
    container.appendChild(form);
    const input = form.querySelector('[name="name"]'), button = form.querySelector('button');
    const status = form.querySelector('.signup-status');
    let busy = false;
    form.onsubmit = async e => {
      e.preventDefault();
      if (busy) return;
      busy = true; button.disabled = true; input.disabled = true;
      button.textContent = '신청 중…'; status.textContent = '';
      try {
        const result = await submit(event.id, input.value, form.querySelector('[name="website"]').value);
        refreshRoster(input.value);
        form.onsubmit = e => e.preventDefault();
        form.classList.add('signup-finished');
        form.innerHTML = `<section class="signup-success" tabindex="-1" aria-labelledby="signup-success-title">
          <span class="signup-success-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M12 25l8 8 16-18"/></svg></span>
          <h3 id="signup-success-title"></h3>
          <p class="signup-success-name"></p>
          <p class="signup-success-event"></p>
          <p class="signup-success-note"></p>
          <button type="button" class="detail-action signup-confirm">확인 · 캠프에서 만나요!</button>
        </section>`;
        form.querySelector('#signup-success-title').textContent = result.status === 'duplicate' ? '이미 신청되어 있어요!' : '참여 신청 완료!';
        form.querySelector('.signup-success-name').textContent = input.value.trim() + '님, 캠프에서 만나요!';
        form.querySelector('.signup-success-event').textContent = event.name;
        form.querySelector('.signup-success-note').textContent = result.status === 'duplicate' ? '기존 신청이 확인되었습니다. 다시 신청하지 않으셔도 됩니다.' : '신청이 정상적으로 저장되었습니다.';
        form.querySelector('.signup-confirm').onclick = () => document.querySelector('#detail').close();
        const panel = form.querySelector('.signup-success');
        panel.focus({preventScroll:true});
        panel.scrollIntoView({block:'center',behavior:'auto'});
      } catch (error) {
        const messages = {INVALID_NAME:'이름을 1~40자로 입력해주세요.', EVENT_NOT_FOUND:'프로그램 정보가 변경되었습니다. 목록을 새로고침해주세요.', BUSY:'신청이 몰리고 있습니다. 잠시 후 다시 시도해주세요.', NOT_CONFIGURED:'신청 기능을 준비 중입니다.'};
        status.textContent = messages[error.message] || '저장 결과를 확인하지 못했습니다. 같은 이름으로 다시 시도해주세요. 중복 저장되지 않습니다.';
        button.disabled = false; input.disabled = false; button.textContent = '다시 신청';
      } finally { busy = false; }
    };
  }
  return {mount, submit};
})();

