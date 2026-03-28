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
          <button class="hero-badge" data-toggle-theme style="all:unset;cursor:pointer;padding:10px 16px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.26);font-weight:800">وضع ليلي/نهاري</button>
        </div>

        <div class="hero-grid">
          <div>
            <h2>منصة سيارات وقطع وخدمات متنقلة في ليبيا</h2>
            <p>ابحث بسرعة، أضف إعلانك في دقائق، وتواصل مباشرة مع البائع أو الفني.</p>
          </div>

          <div class="search-panel">
            <div class="search-row">
              <input placeholder="ابحث: سوناتا 2016 / كمبيو أوبتيما / فحص كمبيوتر">
              <select>
                <option>كل الأقسام</option>
                <option>سيارات</option>
                <option>قطع</option>
                <option>خدمات</option>
              </select>
              <select>
                <option>كل المدن</option>
                <option>طرابلس</option>
                <option>مصراتة</option>
                <option>الزاوية</option>
              </select>
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
        <div>
          <h3 class="section-title">الأقسام الرئيسية</h3>
          <p class="section-desc">منصة متخصصة بدل السوق العام</p>
        </div>
      </div>

      <div class="category-grid">
        <div class="section-card">
          <div class="mini">القسم 1</div>
          <h4>السيارات</h4>
          <p>سيارات للبيع، سيدان، SUV، عائلية، اقتصادية، وارد حديث، ومركبات مميزة.</p>
        </div>

        <div class="section-card">
          <div class="mini">القسم 2</div>
          <h4>قطع غيار السيارات</h4>
          <p>محركات، كمبيو، أبواب، فنارات، جنوط، بطاريات، شاشات، وكماليات.</p>
        </div>

        <div class="section-card">
          <div class="mini">القسم 3</div>
          <h4>الميكانيكي المتنقل</h4>
          <p>فحص، كهرباء، تغيير زيوت، إنقاذ سريع، بطاريات، وخدمة عند الزبون.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <h3 class="section-title">تصفح سريع</h3>
          <p class="section-desc">واجهة نظيفة ومناسبة للجوال</p>
        </div>
      </div>

      <div class="quick-grid">
        <div class="mini-chip">سيدان</div>
        <div class="mini-chip">SUV</div>
        <div class="mini-chip">محركات</div>
        <div class="mini-chip">بطاريات</div>
        <div class="mini-chip">فحص كمبيوتر</div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <h3 class="section-title">إعلانات مميزة</h3>
          <p class="section-desc">أفضل السيارات والقطع والخدمات</p>
        </div>
        <a class="section-link" href="cars.html">المزيد</a>
      </div>

      <div class="ads-grid">
        ${cars.slice(0,1).map(adCard).join('')}
        ${parts.slice(0,1).map(adCard).join('')}
        ${services.slice(0,1).map(adCard).join('')}
      </div>
    </div>
  </section>
</main>`;