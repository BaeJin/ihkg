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
    const form = document.createElement('form');
    form.className = 'signup-form';
    form.innerHTML = `<h3>참여 신청</h3>
      <label for="signup-name">이름</label>
      <input id="signup-name" name="name" autocomplete="name" maxlength="40" required aria-describedby="signup-hint">
      <p id="signup-hint">동명이인은 이름 뒤에 별칭을 붙여주세요.</p>
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
        status.textContent = result.status === 'duplicate' ? '이 이름으로 이미 신청되어 있습니다.' : '신청이 완료되었습니다!';
        button.textContent = '신청 완료';
      } catch (error) {
        const messages = {INVALID_NAME:'이름을 1~40자로 입력해주세요.', EVENT_NOT_FOUND:'프로그램 정보가 변경되었습니다. 목록을 새로고침해주세요.', BUSY:'신청이 몰리고 있습니다. 잠시 후 다시 시도해주세요.', NOT_CONFIGURED:'신청 기능을 준비 중입니다.'};
        status.textContent = messages[error.message] || '저장 결과를 확인하지 못했습니다. 같은 이름으로 다시 시도해주세요. 중복 저장되지 않습니다.';
        button.disabled = false; input.disabled = false; button.textContent = '다시 신청';
      } finally { busy = false; }
    };
  }
  return {mount, submit};
})();
