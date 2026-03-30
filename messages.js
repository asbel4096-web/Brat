import { pageTemplate, authGateCard, waitForAuthReady, getCurrentUser, getUserChats, formatRelativeArabic, safeText } from './common.js';

(async ()=>{
  await waitForAuthReady();
  if (!getCurrentUser()) {
    document.getElementById('app').innerHTML = pageTemplate({active:'messages', title:'دردشاتي', subtitle:'رسائل العملاء والاستفسارات بشكل نظيف وواضح.', content: authGateCard('سجّل الدخول حتى تظهر لك محادثات حسابك الحقيقي.')});
    return;
  }

  const chats = await getUserChats();
  const content = `
  <section class="section">
    <div class="section-head"><div><h3>دردشاتي</h3><p>كل المحادثات الحقيقية المرتبطة بإعلاناتك أو استفساراتك.</p></div></div>
    ${chats.length ? `<div class="chat-list">${
      chats.map(chat => `
        <a class="chat-card" href="chat.html?id=${safeText(chat.id)}">
          <div class="chat-avatar">${safeText((chat.buyerEmail || chat.ownerEmail || 'ب').charAt(0).toUpperCase())}</div>
          <div class="chat-body">
            <div class="chat-top">
              <strong>${safeText(chat.listingTitle || 'محادثة')}</strong>
              <span>${formatRelativeArabic(chat.updatedTs || Date.now())}</span>
            </div>
            <p>${safeText(chat.lastMessage || 'ابدأ المحادثة الآن')}</p>
          </div>
        </a>
      `).join('')
    }</div>` : `<div class="empty-card"><div class="empty-icon">💬</div><h3 class="listing-title">لا توجد محادثات بعد</h3><p class="muted">عند الضغط على زر مراسلة داخل الإعلان ستظهر المحادثة هنا.</p></div>`}
  </section>`;
  document.getElementById('app').innerHTML = pageTemplate({active:'messages', title:'دردشاتي', subtitle:'رسائل العملاء والاستفسارات بشكل نظيف وواضح.', content});
})();
