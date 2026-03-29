import { pageTemplate, customSelect, activateCustomSelects, fileToDataUrl, saveListing, normalizeWhatsapp, formatRelativeArabic } from './common.js';

const content = `
<section class="section">
  <div class="step-pills"><span>1. القسم</span><span>2. التفاصيل</span><span>3. الصور</span><span>4. التواصل</span><span>5. المراجعة</span></div>
  <form id="ad-form" class="form-shell">
    <div class="section-head"><div><h3>بيانات الإعلان</h3><p>نموذج مرتب مع رفع حتى 20 صورة ومعاينة مباشرة قبل الحفظ.</p></div><span class="btn btn-soft">أساسي</span></div>
    <div class="grid">
      ${customSelect('نوع الإعلان', 'سيارة', ['سيارة','قطعة غيار','خدمة'], 'ad-type')}
      ${customSelect('المدينة', 'طرابلس', ['طرابلس','مصراتة','بنغازي'], 'ad-city')}
      <label class="field"><label>عنوان الإعلان</label><input name="title" required placeholder="مثال: هيونداي أزيرا 2023 محلية وكالة"></label>
      <label class="field"><label>السعر</label><input name="price" type="number" required placeholder="45000"></label>
      <label class="field"><label>السنة أو الحالة</label><input name="year" placeholder="مثال: 2023 أو خدمة"></label>
      <label class="field"><label>العداد أو حالة القطعة</label><input name="km" placeholder="مثال: 95,000 كم أو قطعة مستعملة"></label>
      <label class="field"><label>اسم المعلن</label><input name="seller" placeholder="مثال: براتشو كار" value="براتشو كار"></label>
      <label class="field"><label>الوصف</label><textarea name="desc" required placeholder="اكتب تفاصيل السيارة أو القطعة أو الخدمة بشكل مرتب وواضح."></textarea></label>
      <label class="field"><label>رقم الهاتف</label><input name="phone" placeholder="0912345678"></label>
      <label class="field"><label>واتساب</label><input name="whatsapp" placeholder="0912345678 أو 2189..."></label>
      <div class="search-panel">
        <div class="section-head"><div><h3>الصور</h3><p>يمكنك رفع حتى 20 صورة. سيتم حفظ أول صورة كغلاف الإعلان.</p></div></div>
        <input id="image-input" type="file" accept="image/*" multiple hidden>
        <button id="pick-images" type="button" class="btn btn-soft btn-block">رفع صور الإعلان</button>
        <div id="image-count" class="muted" style="margin-top:8px">لم يتم اختيار صور بعد.</div>
        <div id="image-preview" class="listing-grid" style="margin-top:10px"></div>
      </div>
      <button class="btn btn-primary btn-block" type="submit">حفظ ومعاينة</button>
      <div id="save-status" class="muted"></div>
    </div>
  </form>
</section>`;

document.getElementById('app').innerHTML = pageTemplate({active:'add', title:'إضافة إعلان جديد', subtitle:'مسار واضح وسريع لإضافة سيارة أو قطعة أو خدمة.', content});
activateCustomSelects();

const form = document.getElementById('ad-form');
const imageInput = document.getElementById('image-input');
const pickImages = document.getElementById('pick-images');
const imagePreview = document.getElementById('image-preview');
const imageCount = document.getElementById('image-count');
const statusBox = document.getElementById('save-status');
let selectedFiles = [];

pickImages.addEventListener('click', ()=> imageInput.click());
imageInput.addEventListener('change', ()=>{
  selectedFiles = Array.from(imageInput.files || []).slice(0,20);
  renderSelectedImages();
});

function renderSelectedImages(){
  imageCount.textContent = selectedFiles.length ? `تم اختيار ${selectedFiles.length} صورة.` : 'لم يتم اختيار صور بعد.';
  imagePreview.innerHTML = selectedFiles.slice(0,4).map(file=>`
    <article class="listing-card"><div class="listing-image"><img src="${URL.createObjectURL(file)}" alt="preview"></div></article>
  `).join('');
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  statusBox.textContent = 'جاري حفظ الإعلان...';
  const fd = new FormData(form);
  const type = fd.get('ad-type') || 'سيارة';
  const city = fd.get('ad-city') || 'طرابلس';
  const title = String(fd.get('title') || '').trim();
  const price = Number(fd.get('price') || 0);
  const year = String(fd.get('year') || '').trim() || (type === 'خدمة' ? 'خدمة' : 'غير محدد');
  const km = String(fd.get('km') || '').trim() || (type === 'قطعة غيار' ? 'قطعة' : 'غير محدد');
  const seller = String(fd.get('seller') || 'براتشو كار').trim();
  const desc = String(fd.get('desc') || '').trim();
  const phone = String(fd.get('phone') || '').trim();
  const whatsapp = normalizeWhatsapp(String(fd.get('whatsapp') || phone || '').trim());

  if (!title || !desc || !price) {
    statusBox.textContent = 'أكمل الحقول الأساسية: العنوان والسعر والوصف.';
    return;
  }

  try {
    let images = [];
    if (selectedFiles.length) {
      images = await Promise.all(selectedFiles.slice(0,3).map(file => fileToDataUrl(file, 1100, 0.78)));
    }
    const cover = images[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80';
    const now = Date.now();
    const item = {
      id: `u_${now}`,
      type,
      title,
      price,
      city,
      year,
      km,
      seller,
      sellerInitial: seller.charAt(0) || 'ب',
      desc,
      phone,
      whatsapp,
      cover,
      images,
      createdTs: now,
      createdAt: formatRelativeArabic(now)
    };
    saveListing(item);
    statusBox.textContent = 'تم حفظ الإعلان بنجاح. جاري فتح المعاينة...';
    setTimeout(()=>{ location.href = `details.html?id=${item.id}`; }, 400);
  } catch (err) {
    console.error(err);
    statusBox.textContent = 'تعذر حفظ الصور. جرّب صورًا أقل أو بحجم أصغر.';
  }
});
