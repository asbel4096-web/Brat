import { pageTemplate, messages, authGateCard, waitForAuthReady, getCurrentUser } from './common.js';

(async ()=>{
  await waitForAuthReady();
  const content = !getCurrentUser() ? authGateCard('سجّل الدخول حتى تظهر لك رسائل حسابك لاحقًا.') : `
  <section class="section">
    <div class="section-head"><div><h3>دردشاتي</h3><p>رسائل العملاء بشكل مرتب وواضح.</p></div></div>
    <div class="chat-list">${messages.map(m=>`<article class="chat-card"><div class="chat-avatar">${m.initial}</div><div class="chat-body"><div class="chat-top"><strong>${m.name}</strong><span>${m.time}</span></div><p>${m.text}</p></div>${m.unread?`<span class="chat-badge">${m.unread}</span>`:''}</article>`).join('')}
    </div>
  </section>`;
  document.getElementById('app').innerHTML = pageTemplate({active:'messages', title:'دردشاتي', subtitle:'رسائل العملاء والاستفسارات بشكل نظيف وواضح.', content});
})();
