import { pageTemplate, messages } from './common.js';
const items = messages.map(m=>`
  <article class="message-card">
    <div class="avatar" style="width:72px;height:72px;border-radius:24px;font-size:34px">${m.initial}</div>
    <div>
      <h3 class="message-name">${m.name}</h3>
      <div class="message-time">${m.time}</div>
      <p class="message-text">${m.text}</p>
    </div>
    <div>${m.unread?`<div class="message-badge">${m.unread}</div>`:''}</div>
  </article>`).join('');
const content = `
<section class="section">
  <label class="field"><input placeholder="ابحث في الدردشات"></label>
</section>
<section class="section"><div class="message-list">${items}</div></section>`;
document.getElementById('app').innerHTML = pageTemplate({active:'messages', title:'دردشاتي', subtitle:'رسائل العملاء بشكل مرتب وواضح.', content});
