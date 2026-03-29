import { boot, fileToDataUrl, saveUserListing } from './common.js';
boot('add');

const cities = ['طرابلس','مصراتة','بنغازي','الزاوية','زليتن','سبها','الخمس','سرت'];

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

      <div class="steps compact">
        <span class="step active">القسم</span>
        <span class="step active">التفاصيل</span>
        <span class="step active">الصور</span>
        <span class="step active">التواصل</span>
        <span class="step active">المراجعة</span>
      </div>

      <form id="adForm" class="form-layout">
        <div class="form-main card">
          <div class="form-section">
            <div class="section-title-row"><h3>بيانات الإعلان</h3><span class="helper-chip">أساسي</span></div>
            <div class="form-grid two">
              <label class="input-group"><span>نوع الإعلان</span>
                <select name="type" required>
                  <option value="سيارة">سيارة</option>
                  <option value="قطعة غيار">قطعة غيار</option>
                  <option value="خدمة">خدمة</option>
                </select>
              </label>
              <label class="input-group"><span>المدينة</span>
                <select name="city" required>
                  ${cities.map(c=>`<option value="${c}">${c}</option>`).join('')}
                </select>
              </label>
              <label class="input-group span-2"><span>عنوان الإعلان</span><input name="title" required placeholder="مثال: هيونداي أزيرا 2023 محلية وكالة"></label>
              <label class="input-group"><span>السعر</span><input name="price" type="number" min="0" required placeholder="45000"></label>
              <label class="input-group"><span>اسم المعلن</span><input name="seller" required placeholder="براتشو كار"></label>
              <label class="input-group"><span>سنة الصنع / السنة</span><input name="year" placeholder="2023"></label>
              <label class="input-group"><span>المسافة المقطوعة</span><input name="mileage" placeholder="12,000 كم"></label>
              <label class="input-group"><span>المحرك</span><input name="engine" placeholder="2.5 / V6 / خدمة ميدانية"></label>
              <label class="input-group"><span>ناقل الحركة</span>
                <select name="transmission">
                  <option value="أوتوماتيك">أوتوماتيك</option>
                  <option value="عادي">عادي</option>
                  <option value="—">—</option>
                </select>
              </label>
              <label class="input-group"><span>نوع الوقود</span>
                <select name="fuel">
                  <option value="بنزين">بنزين</option>
                  <option value="ديزل">ديزل</option>
                  <option value="كهرباء">كهرباء</option>
                  <option value="هجين">هجين</option>
                  <option value="—">—</option>
                </select>
              </label>
              <label class="input-group"><span>الحالة</span>
                <select name="condition">
                  <option value="ممتازة">ممتازة</option>
                  <option value="جيدة جدًا">جيدة جدًا</option>
                  <option value="جيدة">جيدة</option>
                  <option value="مستخدمة">مستخدمة</option>
                </select>
              </label>
              <label class="input-group span-2"><span>وصف الإعلان</span><textarea name="desc" rows="5" required placeholder="اكتب وصفًا واضحًا ومختصرًا يشرح حالة الإعلان والمميزات المهمة."></textarea></label>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title-row"><h3>صور الإعلان</h3><span class="helper-chip accent">حتى 20 صورة</span></div>
            <label class="upload-dropzone" for="imagesInput">
              <input id="imagesInput" name="images" type="file" accept="image/*" multiple>
              <strong>اضغط لاختيار الصور أو اسحبها هنا</strong>
              <span>الحد الأقصى 20 صورة. يتم ضغطها تلقائيًا لتحسين الأداء.</span>
            </label>
            <div class="upload-bar"><span id="imageCounter">0 / 20 صورة</span><span id="uploadStatus">لم يتم اختيار صور بعد</span></div>
            <div id="previewGrid" class="preview-grid"></div>
          </div>

          <div class="form-section">
            <div class="section-title-row"><h3>بيانات التواصل</h3><span class="helper-chip">للعميل</span></div>
            <div class="form-grid two">
              <label class="input-group"><span>رقم الهاتف</span><input name="phone" required placeholder="0912345678"></label>
              <label class="input-group"><span>واتساب</span><input name="whatsapp" placeholder="218912345678"></label>
              <label class="input-group span-2"><span>رابط الموقع على الخريطة</span><input name="map" placeholder="https://maps.google.com/?q=Tripoli"></label>
            </div>
          </div>
        </div>

        <aside class="form-side">
          <div class="card preview-panel">
            <div class="section-title-row"><h3>مراجعة سريعة</h3><span class="helper-chip">مباشر</span></div>
            <div class="review-list">
              <div class="review-row"><span>العنوان</span><strong id="reviewTitle">—</strong></div>
              <div class="review-row"><span>السعر</span><strong id="reviewPrice">—</strong></div>
              <div class="review-row"><span>القسم</span><strong id="reviewType">سيارة</strong></div>
              <div class="review-row"><span>المدينة</span><strong id="reviewCity">طرابلس</strong></div>
              <div class="review-row"><span>الصور</span><strong id="reviewImages">0</strong></div>
            </div>
            <button class="btn full" type="submit">حفظ الإعلان</button>
            <a class="btn-soft full" href="my-ads.html">عرض إعلاناتي</a>
            <p class="hint-note">بعد الحفظ يظهر الإعلان مباشرة في الرئيسية، الأقسام، وإعلاناتي.</p>
          </div>
        </aside>
      </form>
    </div>
  </section>
</main>
`;

const form = document.getElementById('adForm');
const imagesInput = document.getElementById('imagesInput');
const previewGrid = document.getElementById('previewGrid');
const imageCounter = document.getElementById('imageCounter');
const uploadStatus = document.getElementById('uploadStatus');
const reviewTitle = document.getElementById('reviewTitle');
const reviewPrice = document.getElementById('reviewPrice');
const reviewType = document.getElementById('reviewType');
const reviewCity = document.getElementById('reviewCity');
const reviewImages = document.getElementById('reviewImages');

let imageData = [];

function updateReview(){
  const fd = new FormData(form);
  reviewTitle.textContent = fd.get('title') || '—';
  reviewPrice.textContent = fd.get('price') ? `${Number(fd.get('price')).toLocaleString('en-US')} د.ل` : '—';
  reviewType.textContent = fd.get('type') || '—';
  reviewCity.textContent = fd.get('city') || '—';
  reviewImages.textContent = String(imageData.length);
}

function renderPreviews(){
  imageCounter.textContent = `${imageData.length} / 20 صورة`;
  uploadStatus.textContent = imageData.length ? 'تم تجهيز الصور بنجاح' : 'لم يتم اختيار صور بعد';
  previewGrid.innerHTML = imageData.map((src,index)=>`
    <div class="preview-item">
      <div class="preview-thumb" style="background-image:url('${src}')"></div>
      <button class="preview-remove" type="button" data-index="${index}">حذف</button>
      <span class="preview-badge">${index+1}</span>
    </div>
  `).join('');
  updateReview();
}

previewGrid.addEventListener('click', (e)=>{
  const btn = e.target.closest('.preview-remove');
  if(!btn) return;
  imageData.splice(Number(btn.dataset.index),1);
  renderPreviews();
});

imagesInput.addEventListener('change', async ()=>{
  const files = [...imagesInput.files || []];
  if(!files.length) return;
  const allowedCount = 20 - imageData.length;
  const selected = files.slice(0, allowedCount);
  if(files.length > allowedCount){
    uploadStatus.textContent = `تم أخذ أول ${allowedCount} صورة فقط لأن الحد الأقصى 20`;
  }
  for (const file of selected){
    const compressed = await fileToDataUrl(file, 1280, .76);
    imageData.push(compressed);
  }
  imagesInput.value = '';
  renderPreviews();
});

form.addEventListener('input', updateReview);
form.addEventListener('change', updateReview);
updateReview();

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  if(!imageData.length){
    uploadStatus.textContent = 'أضف صورة واحدة على الأقل قبل الحفظ';
    imagesInput.focus();
    return;
  }
  const fd = new FormData(form);
  const now = new Date();
  const id = `u-${Date.now()}`;
  const listing = {
    id,
    type: fd.get('type'),
    title: String(fd.get('title')).trim(),
    price: Number(fd.get('price') || 0),
    city: fd.get('city'),
    meta: `${fd.get('city')} • ${fd.get('year') || '—'} • ${fd.get('mileage') || '—'}`,
    desc: String(fd.get('desc')).trim(),
    seller: String(fd.get('seller')).trim(),
    time: 'الآن',
    phone: String(fd.get('phone')).trim(),
    whatsapp: String(fd.get('whatsapp') || fd.get('phone')).trim(),
    map: String(fd.get('map') || `https://maps.google.com/?q=${encodeURIComponent(fd.get('city'))}`).trim(),
    condition: fd.get('condition'),
    fuel: fd.get('fuel'),
    transmission: fd.get('transmission'),
    engine: String(fd.get('engine') || '—').trim(),
    year: String(fd.get('year') || '—').trim(),
    mileage: String(fd.get('mileage') || '—').trim(),
    cover: imageData[0],
    images: imageData,
    createdAt: now.toISOString()
  };
  try{
    await saveUserListing(listing);
    location.href = `details.html?id=${id}`;
  }catch(err){
    console.error(err);
    uploadStatus.textContent = 'صار خطأ أثناء حفظ الإعلان. جرّب تقليل حجم الصور قليلًا.';
  }
});
