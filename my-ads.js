import { qs, brandShell, listingCard, demoItems } from './common.js';
const content = `
  <section class="section">
    <div class="section-head"><div><h3>إعلاناتي</h3><p>لوحة مرتبة لإدارة الإعلانات المنشورة والمخفية.</p></div><a class="btn btn-primary" href="add.html">إضافة إعلان</a></div>
    <div class="stats">
      <div class="stat"><strong>3</strong><span>إجمالي الإعلانات</span></div>
      <div class="stat"><strong>3</strong><span>إعلان منشور</span></div>
      <div class="stat"><strong>0</strong><span>إعلان مخفي</span></div>
      <div class="stat"><strong>2</strong><span>في المفضلة</span></div>
    </div>
    <div class="listing-grid" style="margin-top:16px">${demoItems.map(listingCard).join('')}</div>
  </section>
`;
qs('#app').innerHTML = brandShell('myads', content);
