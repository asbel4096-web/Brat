import { bootCommon } from './common.js';
bootCommon('add');
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="page-head"><div class="container">
    <h2 class="page-title">أضف إعلانًا فاخرًا</h2>
    <p class="page-sub">تجربة إضافة إعلان متعددة الخطوات، أنظف وأهدأ.</p>
    <div class="steps-line">
      <span class="step-chip active">1. القسم</span>
      <span class="step-chip">2. النوع</span>
      <span class="step-chip">3. الصور</span>
      <span class="step-chip">4. التفاصيل</span>
      <span class="step-chip">5. التواصل</span>
      <span class="step-chip">6. المراجعة</span>
    </div>
  </div></section>
  <section class="section"><div class="container">
    <div class="step-card">
      <h2 class="page-title" style="font-size:44px">ما الذي تود بيعه أو الإعلان عنه؟</h2>
      <p class="page-sub">اختر القسم المناسب.</p>
      <div class="grid-choices">
        <div class="choice-card"><div class="muted">1</div><h4>سيارات ومركبات</h4><p>سيارات للبيع والإيجار.</p></div>
        <div class="choice-card"><div class="muted">2</div><h4>قطع غيار</h4><p>محركات، كمبيو، بطاريات، جنوط.</p></div>
        <div class="choice-card"><div class="muted">3</div><h4>خدمات متنقلة</h4><p>فحص، كهرباء، إنقاذ سريع.</p></div>
      </div>
      <div class="actions"><span></span><a class="primary-btn" href="#">التالي</a></div>
    </div>
  </div></section>
</main>`;