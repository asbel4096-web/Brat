import { qs, brandShell } from './common.js';

const content = `
  <section class="section">
    <div class="section-head">
      <div>
        <h3>إضافة إعلان جديد</h3>
        <p>نسخة نظيفة وسهلة، مثل الحراج في الوضوح، مع لمسة البراتشو.</p>
      </div>
      <button class="btn btn-soft">مباشر</button>
    </div>

    <div class="content-card">
      <div class="field"><label>القسم</label><select><option>سيارات صغيرة</option><option>سيارات ثقيلة</option><option>حافلات</option><option>كماليات سيارات</option><option>قطع غيار</option><option>خدمات</option></select></div>
      <div class="field"><label>المدينة</label><select><option>طرابلس</option><option>بنغازي</option><option>مصراتة</option><option>الزاوية</option><option>زليتن</option><option>صرمان</option><option>صبراتة</option><option>العجيلات</option></select></div>
      <div class="field"><label>عنوان الإعلان</label><input placeholder="مثال: هيونداي أزيرا 2023 محلية وكالة"></div>
      <div class="field"><label>السعر</label><input placeholder="45000"></div>
      <div class="field"><label>السنة أو الحالة</label><input placeholder="2023 أو خدمة"></div>
      <div class="field"><label>العداد أو حالة القطعة</label><input placeholder="95,000 كم أو قطعة مستعملة"></div>
      <div class="field"><label>الوصف</label><textarea placeholder="اكتب تفاصيل الإعلان بشكل مرتب وواضح"></textarea></div>
      <div class="field"><label>رقم الهاتف</label><input placeholder="0912345678"></div>
      <div class="field"><label>واتساب</label><input placeholder="0912345678 أو 2189..."></div>
      <div class="field"><label>الموقع أو الحي</label><input placeholder="حي الأندلس، طرابلس"></div>
      <div class="field"><label>رابط الخريطة</label><input placeholder="Google Maps link"></div>
      <div class="field"><label>الصور</label><input type="file" multiple></div>
      <button class="btn btn-primary" style="width:100%">حفظ ومعاينة</button>
    </div>
  </section>
`;

qs('#app').innerHTML = brandShell('add', content);
