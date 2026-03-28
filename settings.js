import { bootCommon } from './common.js';
bootCommon();
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="page-head"><div class="container">
    <h2 class="page-title">الإعدادات</h2>
    <p class="page-sub">الوضع، الدولة، العملة، وإعدادات الحساب.</p>
  </div></section>
  <section class="section"><div class="container">
    <div class="settings-card">
      <div class="settings-row"><div class="settings-label">الدولة</div><div class="settings-value">ليبيا</div></div>
      <div class="settings-row"><div class="settings-label">العملة</div><div class="settings-value">دينار</div></div>
      <div class="settings-row"><div class="settings-label">الوضع الليلي</div><button class="soft-btn settings-action">تبديل</button></div>
      <div class="settings-row"><div class="settings-label">إعدادات الحساب</div><div class="settings-value">←</div></div>
      <div class="settings-row"><div class="settings-label">المساعدة</div><div class="settings-value">←</div></div>
      <div class="settings-row"><div class="settings-label">عن التطبيق</div><div class="settings-value">براتشو كار</div></div>
    </div>
  </div></section>
</main>`;