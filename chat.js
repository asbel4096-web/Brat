import { qs, brandShell } from './common.js';

const content = `
  <section class="section">
    <div class="chat-shell">
      <div class="chat-head">
        <a class="icon-btn" href="messages.html">←</a>
        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80" alt="">
        <div>
          <h3 style="margin:0 0 6px;font-size:28px">هيونداي سوناتا 2016</h3>
          <p style="margin:0;color:var(--muted)">يونس البراتشو</p>
        </div>
      </div>

      <div class="chat-messages">
        <div class="bubble-wrap other"><div class="bubble other">السلام عليكم، كم ماشيه السيارة؟</div></div>
        <div class="bubble-wrap mine"><div class="bubble mine">وعليكم السلام، ماشية 95 ألف.</div></div>
        <div class="bubble-wrap other"><div class="bubble other">تمام، نبي موقعكم.</div></div>
      </div>

      <div class="compose">
        <input class="field input" style="min-height:54px;border-radius:18px;border:2px solid var(--line);padding:0 16px" placeholder="اكتب رسالتك هنا">
        <button class="btn btn-primary">إرسال</button>
      </div>
    </div>
  </section>
`;
qs('#app').innerHTML = brandShell('messages', content);
