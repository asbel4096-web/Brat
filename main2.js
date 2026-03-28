import { bootCommon, seedListings, adCard } from './common.js';
bootCommon('home');

const cars = seedListings.filter(x=>x.type==='car');
const parts = seedListings.filter(x=>x.type==='part');
const services = seedListings.filter(x=>x.type==='service');

document.getElementById('app').innerHTML = `
<main class="page">
  <section class="hero">
    <div class="container">
      <div class="hero-card">
        <div class="hero-badges">
          <span class="hero-badge">سيارات</span>
          <span class="hero-badge">قطع غيار</span>
          <span class="hero-badge">ميكانيكي متنقل</span>
          <span class="hero-badge"><button data-toggle-theme style="all:unset;cursor:pointer">وضع ليلي/نهاري</button></span>
        </div>
        <div class="hero-grid">
          <div>
            <h2>منصة سيارات وقطع وخدمات متنقلة في ليبيا</h2>
            <p>ابحث بسرعة، أضف إعلانك في دقائق، وتواصل مباشرة مع البائع أو الفني.</p>
          </div>
          <div class="search-card">
            <div class="search-row">
              <input class="ghost-input" placeholder="ابحث: سوناتا 2016 / كمبيو أوبتيما / فحص كمبيوتر">
              <select><option>كل الأقسام</option><option>سيارات</option><option>قطع</option><option>خدمات</option></select>
              <select><option>كل المدن</option><option>طرابلس</option><option>مصراتة</option><option>الزاوية</option></select>
              <button class="primary-btn full">بحث</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h3>الأقسام الرئيسية</h3><p>منصة متخصصة بدل السوق العام</p></div>
      </div>
      <div class="category-grid">
        <div class="section-card"><div class="mini">🚘 القسم 1</div><h4>السيارات</h4><p>سيارات للبيع، سيدان، SUV، عائلية، اقتصادية، وارد حديث، ومركبات مميزة.</p></div>
        <div class="section-card"><div class="mini">🧩 القسم 2</div><h4>قطع غيار السيارات</h4><p>محركات، كمبيو، أبواب، فنارات، جنوط، بطاريات، شاشات، وكماليات.</p></div>
        <div class="section-card"><div class="mini">🛠️ القسم 3</div><h4>الميكانيكي المتنقل</h4><p>فحص، كهرباء، تغيير زيوت، إنقاذ سريع، بطاريات، وخدمة عند الزبون.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head"><div><h3>تصفح سريع</h3><p>واجهة مثل التطبيقات لكن مخصصة للسيارات</p></div></div>
      <div class="quick-grid">
        <div class="chip">🚗 سيدان</div>
        <div class="chip">🚙 SUV</div>
        <div class="chip">⚙️ محركات</div>
        <div class="chip">🪫 بطاريات</div>
        <div class="chip">💡 فنارات</div>
        <div class="chip">🛞 جنوط</div>
        <div class="chip">🔧 كهرباء</div>
        <div class="chip">🚨 إنقاذ سريع</div>
        <div class="chip">📟 فحص كمبيوتر</div>
        <div class="chip">🇰🇷 وارد حديث</div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head"><div><h3>إعلانات مميزة</h3><p>أفضل السيارات والقطع والخدمات</p></div><a class="section-link" href="cars.html">المزيد ←</a></div>
      <div class="ads-grid">
        ${cars.slice(0,1).map(adCard).join('')}
        ${parts.slice(0,1).map(adCard).join('')}
        ${services.slice(0,1).map(adCard).join('')}
      </div>
    </div>
  </section>
</main>`;