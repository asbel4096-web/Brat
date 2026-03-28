import { bootCommon, seedChats } from './common.js';
bootCommon('messages');
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="page-head"><div class="container">
    <h2 class="page-title">دردشاتي</h2>
    <p class="page-sub">رسائل العملاء والاستفسارات بشكل نظيف وواضح.</p>
  </div></section>
  <section class="section"><div class="container">
    <div class="search-chat"><input placeholder="ابحث في دردشاتي"></div>
    <div class="chat-list">
      ${seedChats.map(chat => `
        <article class="chat-card">
          <div class="chat-avatar">${chat.name.slice(0,1)}</div>
          <div class="chat-main">
            <div class="chat-top"><strong>${chat.name}</strong><span>${chat.time}</span></div>
            <p>${chat.last}</p>
          </div>
          <div class="chat-end">${chat.unread ? `<span class="unread-badge">${chat.unread}</span>` : ''}</div>
        </article>
      `).join('')}
    </div>
  </div></section>
</main>`;