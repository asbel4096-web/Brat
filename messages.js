import { qs, brandShell } from './common.js';

const content = `
  <section class="section">
    <div class="section-head"><div><h3>صندوق الرسائل</h3><p>واجهة محادثات قريبة من المنصات الكبيرة، لكن أنظف ببصمة براتشو.</p></div></div>
    <div class="message-list">
      <a class="message-item" href="chat.html">
        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80" alt="">
        <div>
          <h4>هيونداي سوناتا 2016</h4>
          <p>يونس البراتشو</p>
          <div class="last">كم ماشيه؟</div>
        </div>
        <div class="avatar">ي</div>
      </a>
      <a class="message-item" href="chat.html">
        <img src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80" alt="">
        <div>
          <h4>كمبيو كيا أوبتيما</h4>
          <p>مخزن البراتشو</p>
          <div class="last">نبي موقعكم</div>
        </div>
        <div><span class="unread">2</span></div>
      </a>
    </div>
  </section>
`;
qs('#app').innerHTML = brandShell('messages', content);
