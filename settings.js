import { boot } from './common.js';
boot();
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>الإعدادات</h2>
          <p>إدارة الحساب، الدولة، العملة، اللغة، والوضع الليلي.</p>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-row"><strong>الدولة</strong><span>ليبيا</span></div>
        <div class="settings-row"><strong>العملة</strong><span>دينار</span></div>
        <div class="settings-row"><strong>اللغة</strong><span>العربية / English</span></div>
        <div class="settings-row"><strong>الوضع الليلي</strong><span>تشغيل / إيقاف</span></div>
        <div class="settings-row"><strong>إعدادات الحساب</strong><span>تعديل</span></div>
        <div class="settings-row"><strong>المساعدة</strong><span>متاحة</span></div>
      </div>
    </div>
  </section>
</main>
`;