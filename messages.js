import { pageTemplate, authGateCard, waitForAuthReady, getCurrentUser, getUserChats, formatRelativeArabic, safeText } from './common.js';

function otherParty(chat, me){
  if (chat.ownerId === me.uid) return chat.buyerEmail || 'العميل';
  if (chat.buyerId === me.uid) return chat.ownerEmail || 'صاحب الإعلان';
  return chat.buyerEmail || chat.ownerEmail || 'محادثة';
}

(async ()=>{
  await waitForAuthReady();
  const me = getCurrentUser();

  if (!me) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'messages',
      title:'دردشاتي',
      subtitle:'رسائل العملاء والاستفسارات بشكل نظيف وواضح.',
      content: authGateCard('سجّل الدخول حتى تظهر لك محادثات حسابك الحقيقي.')
    });
    return;
  }

  const chats = await getUserChats();

  const listHtml = chats.length ? chats.map(chat => {
    const cover = safeText(chat.listingCover || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80');
    const title = safeText(chat.listingTitle || 'محادثة');
    const peer = safeText(otherParty(chat, me));
    const last = safeText(chat.lastMessage || 'ابدأ المحادثة الآن');
    const time = formatRelativeArabic(chat.updatedTs || Date.now());
    const avatar = safeText((peer || 'م').charAt(0).toUpperCase());
    return `
      <a class="chat-row" href="chat.html?id=${encodeURIComponent(chat.id)}">
        <img class="chat-row-cover" src="${cover}" alt="${title}">
        <div class="chat-row-main">
          <div class="chat-row-head">
            <strong>${title}</strong>
            <span>${time}</span>
          </div>
          <div class="chat-row-sub">${peer}</div>
          <div class="chat-row-last">${last}</div>
        </div>
        <div class="chat-row-avatar">${avatar}</div>
      </a>
    `;
  }).join('') : `
    <div class="empty-card">
      <div class="empty-icon">💬</div>
      <h3 class="listing-title">لا توجد محادثات بعد</h3>
      <p class="muted">عند الضغط على زر مراسلة داخل الإعلان ستظهر المحادثة هنا.</p>
    </div>
  `;

  const content = `
    <section class="section">
      <div class="section-head">
        <div>
          <h3>دردشاتي</h3>
          <p>كل المحادثات الحقيقية المرتبطة بإعلاناتك أو استفساراتك.</p>
        </div>
      </div>

      <div class="chat-inbox-card">
        <div class="chat-inbox-top">
          <div>
            <h3>صندوق الرسائل</h3>
            <p>واجهة أوضح وأقرب لفكرة المحادثات الحديثة.</p>
          </div>
          <span class="chat-count">${chats.length}</span>
        </div>
        <div class="chat-rows">${listHtml}</div>
      </div>
    </section>
  `;

  document.getElementById('app').innerHTML = pageTemplate({
    active:'messages',
    title:'دردشاتي',
    subtitle:'رسائل العملاء والاستفسارات بشكل نظيف وواضح.',
    content
  });
})();
