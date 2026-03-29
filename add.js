import { boot, customSelect, activateCustomSelects } from './common.js';
boot('add');
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>إضافة إعلان جديد</h2>
          <p>نموذج مرتب مع رفع حتى 20 صورة ومعاينة مباشرة قبل الحفظ.</p>
        </div>
      </div>

      <div class="steps">
        <span class="step active">القسم</span>
        <span class="step">التفاصيل</span>
        <span class="step">الصور</span>
        <span class="step">التواصل</span>
        <span class="step">المراجعة</span>
      </div>

      <div class="card" style="padding:18px">
        <div class="pill">أساسي</div>
        <h2 style="margin:14px 0 14px;font-size:clamp(24px,4vw,38px)">بيانات الإعلان</h2>

        <div style="display:grid;gap:12px">
          ${customSelect('نوع الإعلان', 'سيارة', ['سيارة','قطعة غيار','خدمة'], 'ad-type')}
          ${customSelect('المدينة', 'طرابلس', ['طرابلس','مصراتة','بنغازي'], 'ad-city')}
          <label class="field">
            <div class="label-top">عنوان الإعلان</div>
            <input placeholder="مثال: هيونداي أزيرا 2023 محلية وكالة">
          </label>
          <label class="field">
            <div class="label-top">السعر</div>
            <input placeholder="45000">
          </label>
          <label class="field">
            <div class="label-top">اسم المعلن</div>
            <input placeholder="براتشو كار">
          </label>
          <label class="field">
            <div class="label-top">الوصف</div>
            <textarea rows="5" placeholder="اكتب تفاصيل الإعلان بشكل واضح"></textarea>
          </label>
        </div>

        <div style="display:flex;justify-content:end;gap:10px;margin-top:16px">
          <a class="btn-soft" href="my-ads.html">حفظ لاحقًا</a>
          <a class="btn" href="my-ads.html">متابعة</a>
        </div>
      </div>
    </div>
  </section>
</main>
`;
activateCustomSelects();
