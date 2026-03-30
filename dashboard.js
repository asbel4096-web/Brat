import { pageTemplate, getUserListings } from './common.js';

(async ()=>{
  const userAds = await getUserListings(true, { includeHidden: true });
  const activeAds = userAds.filter(x => (x.status || 'active') !== 'hidden');
  const hiddenAds = userAds.filter(x => (x.status || 'active') === 'hidden');
  const content = `
  <section class="section">
    <div class="dashboard-card">
      <div class="dashboard-profile">
        <div class="avatar">BC</div>
        <div><h3 class="listing-title" style="margin:0">براتشو كار</h3><p class="muted">عضو منذ 2024 • تاجر سيارات</p></div>
      </div>
      <div class="dashboard-buttons">
        <a class="btn btn-primary btn-block" href="my-ads.html">إدارة إعلاناتي</a>
        <a class="btn btn-soft btn-block" href="add.html">إضافة إعلان جديد</a>
      </div>
    </div>
  </section>
  <section class="section stats-grid">
    <div class="stat"><div><strong>2,891</strong><span>المشاهدات</span></div></div>
    <div class="stat"><div><strong>${activeAds.length}</strong><span>منشور</span></div></div>
    <div class="stat"><div><strong>${hiddenAds.length}</strong><span>مخفي</span></div></div>
    <div class="stat"><div><strong>${userAds.length}</strong><span>إجمالي إعلاناتي</span></div></div>
  </section>`;
  document.getElementById('app').innerHTML = pageTemplate({active:'account', title:'حسابي', subtitle:'لوحة أبسط وأوضح لمتابعة الإعلانات والحساب.', content});
})();
