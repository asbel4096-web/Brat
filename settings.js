import { bootCommon } from './common.js';
bootCommon('settings');
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="page-head"><div class="container">
    <h2 class="page-title">الإعدادات</h2>
    <p class="page-sub">الوضع، الدولة، العملة، وإعدادات الحساب.</p>
  </div></section>
  <section class="section"><div class="container">
    <div class="list-card">
      <div class="list-row"><span>الدولة</span><span>ليبيا</span></div>
      <div class="list-row"><span>العملة</span><span>دينار</span></div>
      <div class="list-row"><span>الوضع الليلي</span><button class="soft-btn" data-toggle-theme>تبديل</button></div>
      <div class="list-row"><span>إعدادات الحساب</span><span>←</span></div>
      <div class="list-row"><span>المساعدة</span><span>←</span></div>
      <div class="list-row"><span>عن التطبيق</span><span>براتشو كار</span></div>
    </div>
  </div></section>
</main>`;