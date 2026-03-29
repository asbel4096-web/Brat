import { boot, listings, listingCard } from './common.js';
boot('home');

document.getElementById('app').innerHTML = `
<main class="page">
  <section class="hero">
    <div class="container">
      <div class="hero-card">
        <div class="hero-inner">
          <div class="hero-tags">
            <span class="hero-tag">سيارات</span>
            <span class="hero-tag">قطع غيار</span>
            <span class="hero-tag">كماليات</span>
            <span class="hero-tag">ميكانيكي متنقل</span>
          </div>
          <h2 class="hero-title">منصة احترافية لسيارات وقطع وخدمات متنقلة في ليبيا</h2>
          <p class="hero-text">أضف إعلانك بشكل أنيق، واربطه بالاتصال والدردشة والواتساب والموقع على الخريطة، مع واجهة حديثة باللون الأزرق الداكن والأسود والأبيض ولمسات برتقالية.</p>

          <div class="quick-grid">
            <div class="quick-item"><div>🚘</div><strong>سيارات للبيع</strong><span>عرض سيارات جديدة ومستعملة</span></div>
            <div class="quick-item"><div>🧩</div><strong>قطع غيار</strong><span>محركات، كمبيو، بطاريات وجنوط</span></div>
            <div class="quick-item"><div>✨</div><strong>كماليات</strong><span>شاشات، حساسات، زينة وإكسسوارات</span></div>
            <div class="quick-item"><div>🛠️</div><strong>ميكانيكي متنقل</strong><span>فحص، كهرباء، بطارية، خدمة سريعة</span></div>
          </div>

          <div class="search-shell">
            <div class="search-grid">
              <label class="field"><input placeholder="ابحث: سوناتا 2016 / كمبيو / فحص بطارية"></label>
              <label class="field">
                <select><option>كل الأقسام</option><option>سيارات</option><option>قطع غيار</option><option>كماليات</option><option>ميكانيكي متنقل</option></select>
              </label>
              <label class="field">
                <select><option>كل المدن</option><option>طرابلس</option><option>مصراتة</option><option>بنغازي</option></select>
              </label>
              <button class="btn">بحث</button>
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
          <p>نسخة حديثة مخصصة لبراتشو كار، وليست سوقًا عامًا.</p>
        </div>
      </div>

      <div class="category-grid">
        <article class="category-card card"><div class="category-icon">🚗</div><h3>السيارات</h3><p>سيدان، SUV، عائلية، اقتصادية، وارد حديث، ومركبات خاصة.</p></article>
        <article class="category-card card"><div class="category-icon">🧩</div><h3>قطع الغيار</h3><p>محركات، كمبيو، أبواب، فوانيس، جنوط، بطاريات، وشاشات.</p></article>
        <article class="category-card card"><div class="category-icon">🛠️</div><h3>الميكانيكي المتنقل</h3><p>فحص أعطال، تبديل بطارية، قطر، إنقاذ سريع، وكهرباء خفيفة.</p></article>
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
      <div class="listing-grid">
        ${listings.map(listingCard).join('')}
      </div>
    </div>
  </section>
</main>