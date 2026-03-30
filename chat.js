import { pageTemplate, authGateCard, waitForAuthReady, getCurrentUser, watchChatMessages, sendChatMessage, getUserChats, formatRelativeArabic, safeText } from './common.js';

function otherParty(chat, me){
  if (!chat) return 'المحادثة';
  if (chat.ownerId === me.uid) return chat.buyerEmail || 'العميل';
  if (chat.buyerId === me.uid) return chat.ownerEmail || 'صاحب الإعلان';
  return chat.buyerEmail || chat.ownerEmail || 'المحادثة';
}

(async ()=>{
  await waitForAuthReady();
  const chatId = new URLSearchParams(location.search).get('id');
  const me = getCurrentUser();

  if (!me) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'messages',
      title:'المحادثة',
      subtitle:'الدردشات الحقيقية بين المشتري وصاحب الإعلان.',
      content: authGateCard('سجّل الدخول حتى تفتح المحادثات.')
    });
    return;
  }

  const chats = await getUserChats();
  const chat = chats.find(row => row.id === chatId) || null;
  const chatTitle = safeText(chat?.listingTitle || 'المحادثة');
  const peer = safeText(otherParty(chat, me));
  const cover = safeText(chat?.listingCover || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80');

  const content = `
    <section class="section">
      <div class="chat-screen">
        <div class="chat-screen-head">
          <a class="chat-back" href="messages.html">←</a>
          <img class="chat-head-cover" src="${cover}" alt="${chatTitle}">
          <div class="chat-head-meta">
            <h3>${chatTitle}</h3>
            <p>${peer}</p>
          </div>
        </div>

        <div id="chat-messages" class="chat-thread modern-thread"></div>

        <form id="chat-form" class="chat-compose modern-compose">
          <button class="btn btn-primary send-btn" type="submit">إرسال</button>
          <input id="chat-input" class="chat-input modern-input" placeholder="اكتب رسالتك هنا">
        </form>
      </div>
    </section>
  `;

  document.getElementById('app').innerHTML = pageTemplate({
    active:'messages',
    title:'المحادثة',
    subtitle:'واجهة محادثة أوضح وأرتب.',
    content
  });

  const list = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  const unwatch = watchChatMessages(chatId, messages => {
    list.innerHTML = messages.length ? messages.map(msg => `
      <div class="msg-wrap ${msg.senderId === me.uid ? 'mine' : 'theirs'}">
        <div class="msg-bubble ${msg.senderId === me.uid ? 'msg-me' : 'msg-other'}">
          <div class="msg-text">${safeText(msg.text)}</div>
          <div class="msg-time">${formatRelativeArabic(msg.createdTs || Date.now())}</div>
        </div>
      </div>
    `).join('') : `
      <div class="chat-empty-thread">
        <div class="empty-icon">💬</div>
        <p class="muted">ابدأ أول رسالة الآن.</p>
      </div>
    `;
    list.scrollTop = list.scrollHeight;
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    input.disabled = true;
    form.querySelector('.send-btn').disabled = true;

    try {
      await sendChatMessage(chatId, value);
      input.value = '';
    } catch {
      alert('تعذر إرسال الرسالة');
    } finally {
      input.disabled = false;
      form.querySelector('.send-btn').disabled = false;
      input.focus();
    }
  });

  window.addEventListener('beforeunload', () => { try { unwatch(); } catch {} });
})();
