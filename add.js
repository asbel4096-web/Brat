import { pageTemplate, customSelect, activateCustomSelects } from './common.js';

const content = `
<section class="section">
  <div class="step-pills"><span>1. القسم</span><span>2. التفاصيل</span><span>3. الصور</span><span>4. التواصل</span><span>5. المراجعة</span></div>
  <div class="form-shell">
    <div class="section-head"><div><h3>بيانات الإعلان</h3><p>نموذج مرتب مع رفع حتى 20 صورة ومعاينة مباشرة قبل الحفظ.</p></div><span class="btn btn-soft">أساسي</span></div>
    <div class="grid">
      ${customSelect('نوع الإعلان', 'سيارة', ['سيارة','قطعة غيار','خدمة'], 'ad-type')}
      ${customSelect('المدينة', 'طرابلس', ['طرابلس','مصراتة','بنغازي'], 'ad-city')}
      <label class="field"><label>عنوان الإعلان</label><input placeholder="مثال: هيونداي أزيرا 2023 محلية وكالة"></label>
      <label class="field"><label>السعر</label><input placeholder="45000"></label>
      <label class="field"><label>الوصف</label><textarea placeholder="اكتب تفاصيل السيارة أو القطعة أو الخدمة بشكل مرتب وواضح."></textarea></label>
      <label class="field"><label>رقم الهاتف</label><input placeholder="0912345678"></label>
      <label class="field"><label>واتساب</label><input placeholder="رابط أو رقم الواتساب"></label>
      <div class="search-panel">
        <div class="section-head"><div><h3>الصور</h3><p>يمكنك رفع حتى 20 صورة وترتيبها بسهولة.</p></div></div>
        <button class="btn btn-soft btn-block">رفع صور الإعلان</button>
      </div>
      <button class="btn btn-primary btn-block">حفظ ومعاينة</button>
    </div>
  </div>
</section>`;

document.getElementById('app').innerHTML = pageTemplate({active:'add', title:'إضافة إعلان جديد', subtitle:'مسار واضح وسريع لإضافة سيارة أو قطعة أو خدمة.', content});
activateCustomSelects();
