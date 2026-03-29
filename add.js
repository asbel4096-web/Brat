import { boot } from './common.js';
boot('add');

document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h2>أضف إعلانًا احترافيًا</h2><p>مسار واضح وسريع لإضافة سيارة أو قطعة أو خدمة.</p></div>
      </div>

      <div class="steps">
        <span class="step active">1. القسم</span>
        <span class="step">2. النوع</span>
        <span class="step">3. الصور</span>
        <span class="step">4. التفاصيل</span>
        <span class="step">5. التواصل</span>
        <span class="step">6. المراجعة</span>
      </div>

      <div class="card" style="padding:22px">
        <h2 style="margin:0 0 8px;font-size:44px">اختر نوع الإعلان</h2>
        <p class="brand-sub" style="margin-bottom:0">ابدأ من القسم الصحيح حسب نوع النشاط.</p>

        <div class="option-grid" style="margin-top:18px">
          <article class="option"><h4>سيارات للبيع</h4><p>سيارات جديدة ومستعملة ومركبات خاصة.</p></article>
          <article class="option"><h4>قطع غيار وكماليات</h4><p>محركات، كمبيو، جنوط، شاشات، حساسات، زينة.</p></article>
          <article class="option"><h4>ميكانيكي متنقل</h4><p>فحص، كهرباء، بطاريات، سحب ونجدة سريعة.</p></article>
        </div>

        <div style="display:flex;justify-content:end;margin-top:18px">
          <a class="btn" href="#">التالي</a>
        </div>
      </div>
    </div>
  </section>
</main>