import { pageTemplate, listingCard, getUserListings } from './common.js';

(async ()=>{
  const userAds = await getUserListings(true);
  const listMarkup = userAds.length
    ? `<div class="listing-grid">${userAds.map(listingCard).join('')}</div>`
    : `<div class="empty-card"><div class="empty-icon">＋</div><h3 class="listing-title">لا توجد إعلانات محفوظة بعد</h3><p class="muted">من صفحة إضافة الإعلان تقدر تنشئ إعلان كامل محفوظ على Firebase.</p><a class="btn btn-primary" href="add.html">ابدأ بإضافة إعلان</a></div>`;
  const content = `
  <section class="section">
    <button class="btn btn-primary btn-block" onclick="location.href='add.html'">إضافة إعلان</button>
  </section>
  <section class="section">
    ${listMarkup}
  </section>`;
  document.getElementById('app').innerHTML = pageTemplate({active:'ads', title:'إعلاناتي', subtitle:'كل الإعلانات التي أضفتها من النموذج الجديد.', content});
})();
