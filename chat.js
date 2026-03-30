import { pageTemplate, authGateCard, waitForAuthReady, getCurrentUser, watchChatMessages, sendChatMessage, safeText } from './common.js';

(async ()=>{
  await waitForAuthReady();
  const chatId = new URLSearchParams(location.search).get('id');
  if (!getCurrentUser()) {
    document.getElementById('app').innerHTML = pageTemplate({active:'messages', title:'المحادثة', subtitle:'الدردشات الحقيقية بين المشتري وصاحب الإعلان.', content: authGateCard('سجّل الدخول حتى تفتح المحادثات.')});
    return;
  }

  const content = `
  <section class="section">
    <div class="section-head"><div><h3>المحادثة</h3><p>أرسل رسالة مباشرة داخل الموقع وسيتم حفظها في Firebase.</p></div></div>
    <div class="surface-card" style="padding:14px">
      <div id="chat-messages" class="chat-thread"></div>
      <form id="chat-form" class="chat-compose">
        <input id="chat-input" class="chat-input" placeholder="اكتب رسالتك هنا">
        <button class="btn btn-primary" type="submit">إرسال</button>
      </form>
    </div>
  </section>`;
  document.getElementById('app').innerHTML = pageTemplate({active:'messages', title:'المحادثة', subtitle:'الدردشات الحقيقية بين المشتري وصاحب الإعلان.', content});

  const list = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const me = getCurrentUser().uid;

  const unwatch = watchChatMessages(chatId, messages => {
    list.innerHTML = messages.length ? messages.map(msg => `
      <div class="bubble ${msg.senderId === me ? 'bubble-me' : 'bubble-other'}">
        <div>${safeText(msg.text)}</div>
      </div>
    `).join('') : `<p class="muted">ابدأ أول رسالة الآن.</p>`;
    list.scrollTop = list.scrollHeight;
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    input.disabled = true;
    try {
      await sendChatMessage(chatId, value);
      input.value = '';
    } catch {
      alert('تعذر إرسال الرسالة');
    } finally {
      input.disabled = false;
      input.focus();
    }
  });

  window.addEventListener('beforeunload', () => { try { unwatch(); } catch {} });
})();
