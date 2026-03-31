import { pageTemplate, authGateCard, waitForAuthReady, getCurrentUser, getUserChats, formatRelativeArabic, safeText, mountUnreadBadges, t, initAppChrome } from './common.js';

function otherParty(chat, me){
  if (chat.ownerId === me.uid) return chat.buyerEmail || 'العميل';
  if (chat.buyerId === me.uid) return chat.ownerEmail || 'صاحب الإعلان';
  return chat.buyerEmail || chat.ownerEmail || t('conversation');
}

(async ()=>{
  await waitForAuthReady();
  const me = getCurrentUser();

  if (!me) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'messages',
      title:t('messages_title'),
      subtitle:t('messages_sub'),
      content: authGateCard('سجّل الدخول حتى تظهر لك محادثات حسابك الحقيقي.')
    });
    initAppChrome();
    return;
  }

  const chats = await getUserChats();

  const listHtml = chats.length ? chats.map(chat => {
    const cover = safeText(chat.listingCover || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80');
    const title = safeText(chat.listingTitle || t('conversation'));
    const peer = safeText(otherParty(chat, me));
    const last = safeText(chat.lastMessage || 'Start chat');
    const time = formatRelativeArabic(chat.updatedTs || Date.now());
    const avatar = safeText((peer || 'م').charAt(0).toUpperCase());
    return `
      <button class="chat-row chat-open-btn ${chat.unreadCount > 0 ? 'has-unread' : ''}" type="button" data-chat-id="${safeText(chat.id)}">
        <img class="chat-row-cover" src="${cover}" alt="${title}">
        <div class="chat-row-main">
          <div class="chat-row-head">
            <strong>${title}</strong>
            <span>${time}</span>
          </div>
          <div class="chat-row-sub">${peer}</div>
          <div class="chat-row-last">${last}</div>
          ${chat.unreadCount > 0 ? `<span class="chat-unread-pill">${chat.unreadCount}</span>` : ''}
        </div>
        <div class="chat-row-avatar">${avatar}</div>
      </button>
    `;
  }).join('') : `
    <div class="empty-card">
      <div class="empty-icon">💬</div>
      <h3 class="listing-title">No chats yet</h3>
      <p class="muted">Tap Message on any ad to create a chat here.</p>
    </div>
  `;

  document.getElementById('app').innerHTML = pageTemplate({
    active:'messages',
    title:t('messages_title'),
    subtitle:t('messages_sub'),
    content: `
      <section class="section">
        <div class="hero-panel chat-hero-panel">
          <div class="section-head">
            <div>
              <h3>${t('inbox')}</h3>
              <p>${t('messages_sub')}</p>
            </div>
            <span class="chat-count">${chats.length}</span>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="chat-inbox-card">
          <div class="chat-rows">${listHtml}</div>
        </div>
      </section>
    `
  });

  document.querySelectorAll('.chat-open-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const chatId = btn.dataset.chatId;
      if (!chatId) return;
      window.location.assign(`chat.html?id=${encodeURIComponent(chatId)}&v=chatfinal2`);
    });
  });

  initAppChrome();
})();

mountUnreadBadges();
