import { pageTemplate, authGateCard, waitForAuthReady, getCurrentUser, watchChatMessages, sendChatMessage, getChatById, formatRelativeArabic, safeText, markChatRead, mountUnreadBadges, t, initAppChrome } from './common.js';

function otherParty(chat, me){
  if (!chat) return t('conversation');
  if (chat.ownerId === me.uid) return chat.buyerEmail || 'العميل';
  if (chat.buyerId === me.uid) return chat.ownerEmail || 'صاحب الإعلان';
  return chat.buyerEmail || chat.ownerEmail || t('conversation');
}

function setChatViewportHeight(){
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--chat-vh', `${vh}px`);
}

function scrollChatBottom(smooth=false){
  const list = document.getElementById('chat-messages');
  if (!list) return;
  list.scrollTo({ top: list.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
}

(async ()=>{
  setChatViewportHeight();
  window.addEventListener('resize', setChatViewportHeight);

  await waitForAuthReady();
  const chatId = new URLSearchParams(location.search).get('id');
  const me = getCurrentUser();

  if (!me) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'messages',
      title:t('conversation'),
      subtitle:t('conversation_sub'),
      content: authGateCard('سجّل الدخول حتى تفتح المحادثات.')
    });
    initAppChrome();
    return;
  }

  if (!chatId) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'messages',
      title:t('conversation'),
      subtitle:t('conversation_sub'),
      content:`<section class="section"><div class="empty-card"><div class="empty-icon">!</div><h3 class="listing-title">لا يوجد معرف محادثة</h3><a class="btn btn-primary" href="messages.html">${t('messages_title')}</a></div></section>`
    });
    initAppChrome();
    return;
  }

  let chat = null;
  try {
    chat = await getChatById(chatId);
  } catch (err) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'messages',
      title:t('conversation'),
      subtitle:t('conversation_sub'),
      content:`<section class="section"><div class="empty-card"><div class="empty-icon">⚠</div><h3 class="listing-title">تعذر فتح المحادثة</h3><p class="muted">تأكد أنك داخل الحساب الصحيح أو أن المحادثة ما زالت موجودة.</p><a class="btn btn-primary" href="messages.html">${t('messages_title')}</a></div></section>`
    });
    initAppChrome();
    return;
  }

  const chatTitle = safeText(chat?.listingTitle || t('conversation'));
  const peer = safeText(otherParty(chat, me));
  const cover = safeText(chat?.listingCover || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80');

  document.getElementById('app').innerHTML = pageTemplate({
    active:'messages',
    title:t('conversation'),
    subtitle:t('conversation_sub'),
    content: `
      <section class="section">
        <div class="chat-shell">
          <header class="chat-header-card">
            <div class="chat-header-main">
              <button type="button" class="icon-btn chat-back-btn" id="chat-back">←</button>
              <img class="chat-header-cover" src="${cover}" alt="${chatTitle}">
              <div class="chat-header-copy">
                <h3>${chatTitle}</h3>
                <p>${peer}</p>
              </div>
            </div>
          </header>

          <div id="chat-messages" class="chat-messages-panel"></div>

          <form id="chat-form" class="chat-compose-bar">
            <input id="chat-input" class="chat-input modern-input" placeholder="${t('write_message')}" autocomplete="off">
            <button class="btn btn-primary send-btn" type="submit">${t('send')}</button>
          </form>
        </div>
      </section>
    `
  });

  initAppChrome();
  mountUnreadBadges();

  document.getElementById('chat-back')?.addEventListener('click', ()=> history.back());

  const messagesEl = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  let firstPaint = true;

  function bubble(msg){
    const mine = msg.senderId === me.uid;
    const time = formatRelativeArabic(msg.createdTs || Date.now());
    return `
      <article class="chat-bubble-wrap ${mine ? 'mine' : 'other'}">
        <div class="chat-bubble ${mine ? 'mine' : 'other'}">
          <div class="chat-bubble-text">${safeText(msg.text || '')}</div>
          <div class="chat-bubble-time">${time}</div>
        </div>
      </article>
    `;
  }

  const unsubscribe = watchChatMessages(chatId, async rows => {
    messagesEl.innerHTML = rows.length
      ? rows.map(bubble).join('')
      : `<div class="empty-card chat-empty-card"><div class="empty-icon">💬</div><h3 class="listing-title">${t('conversation')}</h3><p class="muted">${t('messages_sub')}</p></div>`;

    if (firstPaint) {
      scrollChatBottom(false);
      firstPaint = false;
    } else {
      scrollChatBottom(true);
    }

    try { await markChatRead(chatId); } catch {}
  });

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const text = String(input.value || '').trim();
    if (!text) return;
    form.querySelector('button[type="submit"]').disabled = true;
    try {
      await sendChatMessage(chatId, text);
      input.value = '';
      input.focus();
      scrollChatBottom(true);
    } catch {
      alert('تعذر إرسال الرسالة');
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });

  window.addEventListener('beforeunload', ()=> { try { unsubscribe && unsubscribe(); } catch {} });
})();
