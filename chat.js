import { pageTemplate, authGateCard, waitForAuthReady, getCurrentUser, watchChatMessages, sendChatMessage, getChatById, formatRelativeArabic, safeText, markChatRead, mountUnreadBadges } from './common.js';

function otherParty(chat, me){
  if (!chat) return 'المحادثة';
  if (chat.ownerId === me.uid) return chat.buyerEmail || 'العميل';
  if (chat.buyerId === me.uid) return chat.ownerEmail || 'صاحب الإعلان';
  return chat.buyerEmail || chat.ownerEmail || 'المحادثة';
}

function playMessageTone(){
  try{
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.24);
    setTimeout(() => { try{ ctx.close(); }catch{} }, 350);
  }catch{}
}

function setChatViewportHeight(){
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--chat-vh', `${vh}px`);
}

function showToast(text){
  const holder = document.getElementById('chat-toast-holder');
  if (!holder) return;
  const toast = document.createElement('div');
  toast.className = 'chat-toast';
  toast.textContent = text;
  holder.appendChild(toast);
  setTimeout(()=> toast.classList.add('show'), 20);
  setTimeout(()=>{
    toast.classList.remove('show');
    setTimeout(()=> toast.remove(), 220);
  }, 2400);
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
      title:'المحادثة',
      subtitle:'الدردشات الحقيقية بين المشتري وصاحب الإعلان.',
      content: authGateCard('سجّل الدخول حتى تفتح المحادثات.')
    });
    return;
  }

  if (!chatId) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'messages',
      title:'المحادثة',
      subtitle:'رابط المحادثة غير صحيح.',
      content:`<section class="section"><div class="empty-card"><div class="empty-icon">!</div><h3 class="listing-title">لا يوجد معرف محادثة</h3><a class="btn btn-primary" href="messages.html">العودة إلى دردشاتي</a></div></section>`
    });
    return;
  }

  let chat = null;
  try {
    chat = await getChatById(chatId);
  } catch (err) {
    console.error('chat-open-error', err);
    document.getElementById('app').innerHTML = pageTemplate({
      active:'messages',
      title:'المحادثة',
      subtitle:'تعذر فتح المحادثة.',
      content:`<section class="section"><div class="empty-card"><div class="empty-icon">⚠</div><h3 class="listing-title">تعذر فتح المحادثة</h3><p class="muted">تأكد أنك داخل الحساب الصحيح أو أن المحادثة ما زالت موجودة.</p><a class="btn btn-primary" href="messages.html">العودة إلى دردشاتي</a></div></section>`
    });
    return;
  }

  if (!chat) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'messages',
      title:'المحادثة',
      subtitle:'المحادثة غير موجودة.',
      content:`<section class="section"><div class="empty-card"><div class="empty-icon">💬</div><h3 class="listing-title">المحادثة غير موجودة</h3><a class="btn btn-primary" href="messages.html">العودة إلى دردشاتي</a></div></section>`
    });
    return;
  }

  const chatTitle = safeText(chat.listingTitle || 'المحادثة');
  const peer = safeText(otherParty(chat, me));
  const cover = safeText(chat.listingCover || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80');

  document.getElementById('app').innerHTML = pageTemplate({
    active:'messages',
    title:'المحادثة',
    subtitle:'واجهة محادثة أوضح وأرتب.',
    content: `
      <section class="section">
        <div class="chat-screen">
          <div class="chat-screen-head">
            <button class="chat-back" id="go-back" type="button">←</button>
            <img class="chat-head-cover" src="${cover}" alt="${chatTitle}">
            <div class="chat-head-meta">
              <h3>${chatTitle}</h3>
              <p>${peer}</p>
            </div>
          </div>

          <div id="chat-toast-holder" class="chat-toast-holder"></div>
          <div id="chat-messages" class="chat-thread modern-thread"></div>

          <form id="chat-form" class="chat-compose modern-compose">
            <button class="btn btn-primary send-btn" type="submit">إرسال</button>
            <input id="chat-input" class="chat-input modern-input" placeholder="اكتب رسالتك هنا">
          </form>
        </div>
      </section>
    `
  });

  const list = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  let previousLastId = null;
  let firstPaintDone = false;
  let originalTitle = document.title || 'براتشو كار';

  document.getElementById('go-back')?.addEventListener('click', ()=> {
    window.location.assign('messages.html?v=notifyv1');
  });

  const unwatch = watchChatMessages(chatId, async messages => {
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

    requestAnimationFrame(() => {
      list.scrollTop = list.scrollHeight;
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });

    const last = messages[messages.length - 1] || null;

    if (!firstPaintDone) {
      firstPaintDone = true;
      previousLastId = last?.id || null;
    } else if (last && last.id !== previousLastId) {
      previousLastId = last.id;
      if (last.senderId !== me.uid) {
        playMessageTone();
        showToast('وصلتك رسالة جديدة');
        document.title = '🔔 رسالة جديدة';
        setTimeout(()=> { document.title = originalTitle; }, 2200);
      }
    }

    try {
      await markChatRead(chatId);
      mountUnreadBadges();
    } catch {}
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
    } catch (err) {
      console.error('send-message-error', err);
      alert('تعذر إرسال الرسالة');
    } finally {
      input.disabled = false;
      form.querySelector('.send-btn').disabled = false;
      input.focus();
    }
  });

  window.addEventListener('beforeunload', () => {
    try { unwatch(); } catch {}
    document.title = originalTitle;
  });
})();
