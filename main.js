import { boot, getListings, listingCard } from './common.js';
boot('home');
const listings = await getListings();

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
          <h2 class="hero-title">براتشو كار بشكل أرتب وتناسق أقوى وتجربة إعلان أسهل</h2>
          <p class="hero-text">واجهة حديثة ومتوازنة بالأزرق والأسود والأبيض مع لمسات برتقالية، وأزرار أوضح، وبطاقات عرض مرتبة، ونظام إضافة إعلان يدعم حتى 20 صورة للمعلن.</p>

          <div class="quick-grid">
            <a class="quick-item" href="cars.html"><div>🚘</div><strong>سيارات للبيع</strong><span>سيارات جديدة ومستعملة ببطاقات أنيقة</span></a>
            <a class="quick-item" href="parts.html"><div>🧩</div><strong>قطع غيار</strong><span>محركات وكمبيو وبطاريات وكماليات</span></a>
            <a class="quick-item" href="parts.html"><div>✨</div><strong>كماليات</strong><span>شاشات وحساسات وزينة وإكسسوارات</span></a>
            <a class="quick-item" href="services.html"><div>🛠️</div><strong>ميكانيكي متنقل</strong><span>خدمة سريعة وفحص وكهرباء خفيفة</span></a>
          </div>

          <div class="search-shell">
            <div class="search-grid">
              <label class="field"><input placeholder="ابحث: أزيرا 2023 / كمبيو / ميكانيكي متنقل"></label>
              <label class="field">
                <select onchange="if(this.value) location.href=this.value">
                  <option value="">كل الأقسام</option>
                  <option value="cars.html">سيارات</option>
                  <option value="parts.html">قطع غيار</option>
                  <option value="parts.html">كماليات</option>
                  <option value="services.html">ميكانيكي متنقل</option>
                </select>
              </label>
              <label class="field">
                <select><option>كل المدن</option><option>طرابلس</option><option>مصراتة</option><option>بنغازي</option></select>
              </label>
              <a class="btn" href="add.html">أضف الآن</a>
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
          <p>نسخة أكثر ترتيبًا للمشروع مع تسلسل بصري أوضح ومساحات متوازنة.</p>
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
          <h2>أحدث الإعلانات</h2>
          <p>كل إعلان جديد تتم إضافته من صفحة المعلن يظهر هنا مباشرة.</p>
        </div>
        <a class="pill" href="my-ads.html">كل الإعلانات</a>
      </div>

      <div class="listing-grid">${listings.map(listingCard).join('')}</div>
    </div>
  </section>
</main>
`;
