import { bootCommon } from './common.js';
bootCommon('dashboard');
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="page-head">
    <div class="container">
      <h2 class="page-title">حسابي</h2>
      <p class="page-sub">لوحة مرتبة لإدارة نشاطك وإعلاناتك.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-num">2,891</div><div class="stat-label">المشاهدات</div></div>
        <div class="stat-card"><div class="stat-num">6</div><div class="stat-label">الإعلانات</div></div>
        <div class="stat-card"><div class="stat-num">4</div><div class="stat-label">المفضلة</div></div>
        <div class="stat-card"><div class="stat-num">12</div><div class="stat-label">الرسائل</div></div>
      </div>
      <div class="list-card" style="margin-top:20px">
        <div class="list-row"><span>إدارة الحساب</span><span>←</span></div>
        <div class="list-row"><span>إعلاناتي</span><span>←</span></div>
        <div class="list-row"><span>المفضلة</span><span>←</span></div>
        <div class="list-row"><span>الدعم والمساعدة</span><span>←</span></div>
      </div>
    </div>
  </section>
</main>`;