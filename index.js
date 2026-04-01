import { qs, brandShell, listingCard, demoItems } from './common.js';

const content = `
  <section class="hero">
    <div class="hero-chips">
      <span class="chip">سيارات صغيرة</span>
      <span class="chip">سيارات ثقيلة</span>
      <span class="chip">حافلات</span>
      <span class="chip">كماليات سيارات</span>
      <span class="chip">خدمات</span>
    </div>
    <h2>تصميم واضح مثل المنصات الكبيرة، لكن ببصمة براتشو.</h2>
    <p>نسخة جديدة من الصفر، مرتبة وسريعة، وتناسب سوق السيارات وقطع الغيار والخدمات في ليبيا.</p>

    <div class="search-card">
      <div class="search-grid">
        <div class="field"><label>ابحث</label><input placeholder="أزيرا / سوناتا / كمبيو / ميكانيكي"></div>
        <div class="field"><label>القسم</label><select><option>كل الأقسام</option><option>سيارات صغيرة</option><option>سيارات ثقيلة</option><option>حافلات</option><option>كماليات سيارات</option><option>خدمات</option></select></div>
        <div class="field"><label>المدينة</label><select><option>كل المدن</option><option>طرابلس</option><option>بنغازي</option><option>مصراتة</option><option>الزاوية</option><option>زليتن</option><option>صرمان</option><option>صبراتة</option><option>العجيلات</option></select></div>
        <button class="btn btn-primary">ابحث الآن</button>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="stats">
      <div class="stat"><strong>14</strong><span>إجمالي الإعلانات</span></div>
      <div class="stat"><strong>12</strong><span>سيارات</span></div>
      <div class="stat"><strong>1</strong><span>قطع غيار</span></div>
      <div class="stat"><strong>1</strong><span>خدمات</span></div>
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div>
        <h3>الأقسام الرئيسية</h3>
        <p>تقسيم واضح مثل الحراج مع لمسة براتشو الحديثة.</p>
      </div>
      <a class="btn btn-soft" href="add.html">إضافة إعلان</a>
    </div>
    <div class="categories">
      <a class="category" href="#"><div class="cicon">🚗</div><div><h4>سيارات صغيرة</h4><p>سيدان، عائلية، اقتصادية، وارد ومحلي.</p></div></a>
      <a class="category" href="#"><div class="cicon">🚚</div><div><h4>سيارات ثقيلة</h4><p>شاحنات ومركبات أعمال ونقل.</p></div></a>
      <a class="category" href="#"><div class="cicon">🚌</div><div><h4>حافلات</h4><p>نقل ركاب ومدارس وخدمات.</p></div></a>
      <a class="category" href="#"><div class="cicon">✨</div><div><h4>كماليات سيارات</h4><p>شاشات، فرش، زينة وإكسسوارات.</p></div></a>
      <a class="category" href="#"><div class="cicon">🧩</div><div><h4>قطع غيار</h4><p>محركات، كمبيو، أبواب، فوانيس وبطاريات.</p></div></a>
      <a class="category" href="#"><div class="cicon">🛠️</div><div><h4>خدمات</h4><p>كشف أعطال، ميكانيكي متنقل، إطارات، زيوت ومواد مضافة.</p></div></a>
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div>
        <h3>أحدث الإعلانات</h3>
        <p>عرض أنظف، أقرب للسوق المفتوح، ولكن بلون وهوية براتشو.</p>
      </div>
    </div>
    <div class="listing-grid">
      ${demoItems.map(listingCard).join('')}
    </div>
  </section>
`;

qs('#app').innerHTML = brandShell('home', content);
