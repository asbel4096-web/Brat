import { boot, listings, listingCard, customSelect, activateCustomSelects } from './common.js';
boot('home');

document.getElementById('app').innerHTML = `
<main class="page">
  <section class="hero">
    <div class="container">
      <div class="hero-card">
        <div class="hero-inner">
          <div class="hero-tags">
            <a class="hero-tag" href="cars.html">سيارات</a>
            <a class="hero-tag" href="parts.html">قطع غيار</a>
            <a class="hero-tag" href="parts.html">كماليات</a>
            <a class="hero-tag" href="services.html">ميكانيكي متنقل</a>
          </div>
          <h2 class="hero-title">منصة احترافية للسيارات وقطع وخدمات متنقلة في ليبيا</h2>
          <p class="hero-text">أضف إعلانك بشكل أنيق، واربطه بالاتصال والدردشة والواتساب والموقع على الخريطة، مع واجهة حديثة باللون الأزرق الداكن والأسود والأبيض ولمسات برتقالية.</p>

          <div class="quick-grid">
            <a class="quick-item" href="cars.html"><div>🚘</div><strong>سيارات للبيع</strong><span>عرض سيارات جديدة ومستعملة</span></a>
            <a class="quick-item" href="parts.html"><div>🧩</div><strong>قطع غيار</strong><span>محركات، كمبيو، بطاريات وجنوط</span></a>
            <a class="quick-item" href="parts.html"><div>✨</div><strong>كماليات</strong><span>شاشات، حساسات، زينة وإكسسوارات</span></a>
            <a class="quick-item" href="services.html"><div>🛠️</div><strong>ميكانيكي متنقل</strong><span>فحص، كهرباء، بطارية، خدمة سريعة</span></a>
          </div>

          <div class="search-shell">
            <div class="search-grid">
              <label class="field"><input placeholder="ابحث: سوناتا 2016 / كمبيو / فحص بطارية"></label>
              ${customSelect('', 'كل الأقسام', ['كل الأقسام','سيارات','قطع غيار','كماليات','ميكانيكي متنقل'], 'home-section')}
              ${customSelect('', 'كل المدن', ['كل المدن','طرابلس','مصراتة','بنغازي'], 'home-city')}
              <button class="btn" id="goSearch">أضف الآن</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>الأقسام الرئيسية</h2>
          <p>واجهة مرتبة للمستخدم مع بطاقات واضحة وسريعة للمشاهدة.</p>
        </div>
      </div>

      <div class="category-grid">
        <a class="category-card card" href="cars.html"><div class="category-icon">🚗</div><h3>السيارات</h3><p>سيدان، SUV، عائلية، اقتصادية، وارد حديث، ومركبات خاصة.</p></a>
        <a class="category-card card" href="parts.html"><div class="category-icon">🧩</div><h3>قطع الغيار</h3><p>محركات، كمبيو، أبواب، فوانيس، جنوط، بطاريات، وشاشات.</p></a>
        <a class="category-card card" href="services.html"><div class="category-icon">🛠️</div><h3>الميكانيكي المتنقل</h3><p>فحص أعطال، تبديل بطارية، قطر، إنقاذ سريع، وكهرباء خفيفة.</p></a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>إعلانات مميزة</h2>
          <p>أفضل السيارات والقطع والخدمات المعروضة الآن.</p>
        </div>
        <a class="pill" href="my-ads.html">كل الإعلانات</a>
      </div>

      <div class="listing-grid">${listings.map(listingCard).join('')}</div>
    </div>
  </section>
</main>
`;

activateCustomSelects();
document.getElementById('goSearch').onclick = ()=>{
  const v = document.querySelector('[data-id="home-section"] .cselect-btn span').textContent.trim();
  if(v === 'سيارات') location.href = 'cars.html';
  else if(v === 'قطع غيار' || v === 'كماليات') location.href = 'parts.html';
  else if(v === 'ميكانيكي متنقل') location.href = 'services.html';
  else location.href = 'my-ads.html';
};
