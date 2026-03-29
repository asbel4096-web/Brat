import { pageTemplate, getUserListings } from './common.js';
const userAds = getUserListings();
const content = `
<section class="section">
  <div class="dashboard-card">
    <div class="dashboard-profile">
      <div class="avatar">BC</div>
      <div><h3 class="listing-title" style="margin:0">براتشو كار</h3><p class="muted">عضو منذ 2024 • تاجر سيارات</p></div>
    </div>
    <div class="dashboard-buttons">
      <a class="btn btn-primary btn-block" href="my-ads.html">إدارة إعلاناتي</a>
      <a class="btn btn-soft btn-block" href="settings.html">إعدادات الحساب</a>
    </div>
  </div>
</section>
<section class="section stats-grid">
  <div class="stat"><div><strong>2,891</strong><span>المشاهدات</span></div></div>
  <div class="stat"><div><strong>${userAds.length}</strong><span>إعلاناتي</span></div></div>
  <div class="stat"><div><strong>8</strong><span>المفضلة</span></div></div>
  <div class="stat"><div><strong>4.9</strong><span>التقييم</span></div></div>
</section>`;
document.getElementById('app').innerHTML = pageTemplate({active:'account', title:'حسابي', subtitle:'لوحة أبسط وأوضح لمتابعة الإعلانات والحساب.', content});
