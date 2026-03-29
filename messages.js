import { boot, chats } from './common.js';
boot('messages');

document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h2>دردشاتي</h2><p>رسائل العملاء بشكل مرتب وواضح.</p></div>
      </div>
      <div class="search-card card"><input placeholder="ابحث في الدردشات"></div>
      <div class="chat-list">
        ${chats.map(c=>`
          <article class="chat-card">
            <div class="chat-avatar">${c.name[0]}</div>
            <div>
              <div class="chat-head"><strong>${c.name}</strong><span>${c.time}</span></div>
              <p>${c.text}</p>
            </div>
            <div>${c.unread?`<span class="unread">${c.unread}</span>`:''}</div>
          </article>
        `).join('')}
      </div>
    </div>
  </section>
</main>
`;