import { pageTemplate, categoryCard, listingCard, getAllListings, customSelect, activateCustomSelects, applyFavorites, bindFavoriteButtons } from './common.js';

(async ()=>{
  const allListings = await getAllListings(true, { includeHidden: false });
  const latest = await applyFavorites(allListings.slice(0, 6));

  const content = `
  <section class="hero-panel">
    <div class="hero-chips">
      <span class="chip">سيارات</span>
      <span class="chip">قطع غيار</span>
      <span class="chip">كماليات</span>
      <span class="chip">ميكانيكي متنقل</span>
    </div>
    <h3>براتشو كار بشكل أرتب وتناسق أقوى وتجربة إعلان أسهل</h3>
    <p>واجهة حديثة ومتوازنة بالأزرق الداكن والأسود والأبيض مع لمسات برتقالية، وبطاقات عرض مرتبة، ونظام مفضلة حقيقي مرتبط بالحساب.</p>
    <div class="search-panel">
      <div class="search-grid">
        <label class="field"><input placeholder="ابحث: أزيرا 2023 / كمبيو / ميكانيكي متنقل"></label>
        ${customSelect('القسم', 'كل الأقسام', ['كل الأقسام','سيارات','قطع غيار','كماليات','ميكانيكي متنقل'], 'home-cat')}
        ${customSelect('المدينة', 'كل المدن', ['كل المدن','طرابلس','مصراتة','بنغازي'], 'home-city')}
        <button class="btn btn-primary btn-block" onclick="location.href='add.html'">أضف الآن</button>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="section-head"><div><h3>الأقسام الرئيسية</h3><p>نسخة أكثر ترتيبًا للمشروع مع تسلسل بصري أوضح ومساحات متوازنة.</p></div></div>
    <div class="category-list">
      ${categoryCard('🚗','السيارات','سيدان، SUV، عائلية، اقتصادية، وارد حديث، ومركبات خاصة.','cars.html')}
      ${categoryCard('🧩','قطع الغيار','محركات، كمبيو، أبواب، فوانيس، جنوط، بطاريات، وشاشات.','parts.html')}
      ${categoryCard('🛠️','الميكانيكي المتنقل','فحص أعطال، تبديل بطارية، قطر، إنقاذ سريع، وكهرباء خفيفة.','services.html')}
    </div>
  </section>
  <section class="section">
    <div class="section-head"><div><h3>أحدث الإعلانات</h3><p>كل إعلان منشور يظهر هنا مباشرة من Firebase. يمكنك الآن حفظ أي إعلان في المفضلة.</p></div><a class="btn btn-soft" href="favorites.html">المفضلة</a></div>
    <div class="listing-grid">${latest.map(listingCard).join('')}</div>
  </section>`;

  document.getElementById('app').innerHTML = pageTemplate({active:'home', title:'', subtitle:'', content});
  activateCustomSelects();
  bindFavoriteButtons();
})();
