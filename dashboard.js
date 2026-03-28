import { bootCommon, seedListings } from './common.js';
bootCommon('dashboard');

const approved = seedListings.filter(x=>x.status==='approved').length;
const pending = seedListings.filter(x=>x.status==='pending').length;

document.getElementById('app').innerHTML = `
<main class="page">
  <section class="page-head"><div class="container">
    <h2 class="page-title">حسابي</h2>
    <p class="page-sub">لوحة أنيقة لمتابعة الإعلانات والحساب.</p>
  </div></section>

  <section class="section"><div class="container">
    <div class="profile-card">
      <div class="profile-top">
        <div>
          <h3>براتشو كار</h3>
          <p class="muted">عضو منذ 2024 • تاجر سيارات</p>
        </div>
        <div class="seller-avatar large">BC</div>
      </div>
      <div class="profile-actions">
        <a class="primary-btn" href="my-ads.html">إدارة إعلاناتي</a>
        <a class="soft-btn" href="settings.html">إدارة الحساب</a>
      </div>
    </div>

    <div class="stats-grid" style="margin-top:16px">
      <div class="stat-card"><div class="stat-num">2,891</div><div class="stat-label">المشاهدات</div></div>
      <div class="stat-card"><div class="stat-num">${approved}</div><div class="stat-label">الإعلانات المنشورة</div></div>
      <div class="stat-card"><div class="stat-num">${pending}</div><div class="stat-label">قيد المراجعة</div></div>
      <div class="stat-card"><div class="stat-num">4.8</div><div class="stat-label">التقييم</div></div>
    </div>

    <div class="panel-grid">
      <div class="list-card">
        <div class="list-row"><span>المفضلة</span><strong>12</strong></div>
        <div class="list-row"><span>آخر الإعلانات المشاهدة</span><strong>7</strong></div>
        <div class="list-row"><span>رسائل جديدة</span><strong>3</strong></div>
        <div class="list-row"><span>الملف الشخصي</span><strong>مكتمل 80%</strong></div>
      </div>

      <div class="support-card">
        <h3>هل تحتاج إلى مساعدة؟</h3>
        <p class="muted">تواصل معنا أو ابدأ بإضافة إعلان جديد.</p>
        <a class="primary-btn full" href="add.html">أضف إعلان الآن</a>
        <a class="soft-btn full" href="messages.html">فتح الدردشات</a>
      </div>
    </div>
  </div></section>
</main>`;