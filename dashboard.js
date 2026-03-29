import { boot, getUserListings } from './common.js';
boot('dashboard');
const userListings = await getUserListings();
const totalViews = userListings.length * 241 + 2891;
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>حسابي</h2>
          <p>لوحة أبسط وأوضح لمتابعة الإعلانات والحساب.</p>
        </div>
      </div>

      <div class="stats">
        <article class="stat"><strong>${totalViews.toLocaleString('en-US')}</strong><span>المشاهدات</span></article>
        <article class="stat"><strong>${userListings.length}</strong><span>إعلاناتي</span></article>
        <article class="stat"><strong>8</strong><span>المفضلة</span></article>
        <article class="stat"><strong>4.9</strong><span>التقييم</span></article>
      </div>

      <div class="two-col">
        <div class="profile-card card">
          <div class="profile-top">
            <div>
              <h3 class="profile-title">براتشو كار</h3>
              <p class="brand-sub">عضو منذ 2024 • تاجر سيارات</p>
            </div>
            <div class="logo">BC</div>
          </div>

          <div class="stacked" style="margin-top:16px">
            <a class="btn full" href="my-ads.html">إدارة إعلاناتي</a>
            <a class="btn-soft full" href="add.html">إضافة إعلان جديد</a>
            <a class="btn-soft full" href="settings.html">إعدادات الحساب</a>
          </div>
        </div>

        <div class="menu-list card">
          <div class="menu-row"><span>الإعلانات المضافة من النموذج</span><strong>${userListings.length}</strong></div>
          <div class="menu-row"><span>آخر الإعلانات المشاهدة</span><strong>7</strong></div>
          <div class="menu-row"><span>الدردشات الجديدة</span><strong>3</strong></div>
          <div class="menu-row"><span>الدعم والمساعدة</span><strong>متاح</strong></div>
        </div>
      </div>
    </div>
  </section>
</main>
`;
