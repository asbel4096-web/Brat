import { boot } from './common.js';
boot('dashboard');

document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h2>حسابي</h2><p>إدارة الحساب والإعلانات والمفضلة والدعم.</p></div>
      </div>

      <div class="stats">
        <article class="stat"><strong>2,891</strong><span>المشاهدات</span></article>
        <article class="stat"><strong>12</strong><span>الإعلانات</span></article>
        <article class="stat"><strong>8</strong><span>المفضلة</span></article>
        <article class="stat"><strong>4.9</strong><span>التقييم</span></article>
      </div>

      <div class="two-col">
        <div class="profile-card">
          <div class="profile-top">
            <div><h3 class="profile-title">براتشو كار</h3><p class="brand-sub">عضو منذ 2024 • تاجر سيارات</p></div>
            <div class="logo">BC</div>
          </div>
          <div class="stacked" style="margin-top:18px">
            <a class="btn full" href="my-ads.html">إدارة إعلاناتي</a>
            <a class="btn-soft full" href="settings.html">إعدادات الحساب</a>
          </div>
        </div>

        <div class="menu-list card">
          <div class="menu-row"><span>المفضلة</span><strong>12</strong></div>
          <div class="menu-row"><span>آخر الإعلانات المشاهدة</span><strong>7</strong></div>
          <div class="menu-row"><span>المتابَعون</span><strong>15</strong></div>
          <div class="menu-row"><span>الدعم والمساعدة</span><strong>متاح</strong></div>
        </div>
      </div>
    </div>
  </section>
</main>
`;