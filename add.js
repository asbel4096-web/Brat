import { pageTemplate, customSelect, activateCustomSelects, saveListing, uploadListingImages, normalizeWhatsapp, formatRelativeArabic, detailById, getCurrentUser, authGateCard, waitForAuthReady } from './common.js';

const editId = new URLSearchParams(location.search).get('id');

const content = `
<section class="section">
  <div class="step-pills"><span>1. القسم</span><span>2. التفاصيل</span><span>3. الصور</span><span>4. التواصل</span><span>5. المراجعة</span></div>
  <form id="ad-form" class="form-shell">
    <div class="section-head"><div><h3>${editId ? 'تعديل الإعلان' : 'بيانات الإعلان'}</h3><p>نموذج مرتب مع رفع حتى 20 صورة ومعاينة مباشرة ثم رفع حقيقي إلى Firebase Storage.</p></div><span class="btn btn-soft">${editId ? 'تعديل' : 'مباشر'}</span></div>
    <div class="grid">
      ${customSelect('نوع الإعلان', 'سيارة', ['سيارة','قطعة غيار','خدمة'], 'ad-type')}
      ${customSelect('المدينة', 'طرابلس', ['طرابلس','مصراتة','بنغازي'], 'ad-city')}
      <label class="field"><label>عنوان الإعلان</label><input name="title" required placeholder="مثال: هيونداي أزيرا 2023 محلية وكالة"></label>
      <label class="field"><label>السعر</label><input name="price" type="number" required placeholder="45000"></label>
      <label class="field"><label>السنة أو الحالة</label><input name="year" placeholder="مثال: 2023 أو خدمة"></label>
      <label class="field"><label>العداد أو حالة القطعة</label><input name="km" placeholder="مثال: 95,000 كم أو قطعة مستعملة"></label>
      <label class="field"><label>اسم المعلن</label><input name="seller" placeholder="مثال: براتشو كار"></label>
      <label class="field"><label>الوصف</label><textarea name="desc" required placeholder="اكتب تفاصيل السيارة أو القطعة أو الخدمة بشكل مرتب وواضح."></textarea></label>
      <label class="field"><label>رقم الهاتف</label><input name="phone" placeholder="0912345678"></label>
      <label class="field"><label>واتساب</label><input name="whatsapp" placeholder="0912345678 أو 2189..."></label>
      <div class="search-panel">
        <div class="section-head"><div><h3>الصور</h3><p>يمكنك رفع حتى 20 صورة وسيتم تخزينها فعليًا داخل Firebase Storage.</p></div></div>
        <input id="image-input" type="file" accept="image/*" multiple hidden>
        <button id="pick-images" type="button" class="btn btn-soft btn-block">رفع صور الإعلان</button>
        <div id="image-count" class="muted" style="margin-top:8px">لم يتم اختيار صور بعد.</div>
        <div id="image-preview" class="listing-grid" style="margin-top:10px"></div>
      </div>
      <button class="btn btn-primary btn-block" type="submit">${editId ? 'حفظ التعديلات' : 'حفظ ومعاينة'}</button>
      <div id="save-status" class="muted"></div>
    </div>
  </form>
</section>`;

(async function init(){
  await waitForAuthReady();
  if (!getCurrentUser()) {
    document.getElementById('app').innerHTML = pageTemplate({active:'add', title:'إضافة إعلان جديد', subtitle:'سجل الدخول أولًا حتى يحفظ الإعلان على حسابك الحقيقي.', content: authGateCard('لا يمكن إضافة أو تعديل إعلان بدون تسجيل الدخول.','افتح تسجيل الدخول')});
    return;
  }

  document.getElementById('app').innerHTML = pageTemplate({active:'add', title: editId ? 'تعديل إعلان' : 'إضافة إعلان جديد', subtitle:'مسار واضح وسريع لإضافة سيارة أو قطعة أو خدمة.', content});
  activateCustomSelects();

  const form = document.getElementById('ad-form');
  const imageInput = document.getElementById('image-input');
  const pickImages = document.getElementById('pick-images');
  const imagePreview = document.getElementById('image-preview');
  const imageCount = document.getElementById('image-count');
  const statusBox = document.getElementById('save-status');
  let selectedFiles = [];
  let existingItem = null;
  let existingImages = [];

  pickImages.addEventListener('click', ()=> imageInput.click());
  imageInput.addEventListener('change', ()=>{
    selectedFiles = Array.from(imageInput.files || []).slice(0,20);
    renderSelectedImages();
  });

  function renderSelectedImages(){
    const previews = selectedFiles.length ? selectedFiles.map(file => ({ src: URL.createObjectURL(file), fresh: true })) : existingImages.map(src => ({ src, fresh: false }));
    imageCount.textContent = previews.length ? `عدد الصور الحالية ${previews.length} من 20.` : 'لم يتم اختيار صور بعد.';
    imagePreview.innerHTML = previews.map(item=>`
      <article class="listing-card"><div class="listing-image"><img src="${item.src}" alt="preview"></div></article>
    `).join('');
  }

  function setSelectValue(name, value){
    const hidden = form.querySelector(`input[name="${name}"]`);
    const select = hidden?.closest('.custom-select');
    if (!hidden || !select) return;
    hidden.value = value;
    const span = select.querySelector('.select-trigger span');
    if (span) span.textContent = value;
    select.querySelectorAll('.option').forEach(opt => opt.classList.toggle('is-selected', opt.dataset.value === value));
  }

  if (editId) {
    existingItem = await detailById(editId);
    if (!existingItem || existingItem.ownerId !== getCurrentUser().uid) {
      statusBox.textContent = 'لا يمكن تعديل هذا الإعلان.';
      return;
    }
        existingImages = Array.isArray(existingItem.images) ? existingItem.images.slice(0,20) : (existingItem.cover ? [existingItem.cover] : []);
    form.title.value = existingItem.title || '';
    form.price.value = existingItem.price || '';
    form.year.value = existingItem.year || '';
    form.km.value = existingItem.km || '';
    form.seller.value = existingItem.seller || '';
    form.desc.value = existingItem.desc || '';
    form.phone.value = existingItem.phone || '';
    form.whatsapp.value = existingItem.whatsapp || '';
    setSelectValue('ad-type', existingItem.type || 'سيارة');
    setSelectValue('ad-city', existingItem.city || 'طرابلس');
    renderSelectedImages();
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    statusBox.textContent = editId ? 'جاري حفظ التعديلات...' : 'جاري حفظ الإعلان على Firebase...';
    const fd = new FormData(form);
    const type = fd.get('ad-type') || 'سيارة';
    const city = fd.get('ad-city') || 'طرابلس';
    const title = String(fd.get('title') || '').trim();
    const price = Number(fd.get('price') || 0);
    const year = String(fd.get('year') || '').trim() || (type === 'خدمة' ? 'خدمة' : 'غير محدد');
    const km = String(fd.get('km') || '').trim() || (type === 'قطعة غيار' ? 'قطعة' : 'غير محدد');
    const seller = String(fd.get('seller') || getCurrentUser()?.email || 'براتشو كار').trim();
    const desc = String(fd.get('desc') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const whatsapp = normalizeWhatsapp(String(fd.get('whatsapp') || phone || '').trim());

    if (!title || !desc || !price) {
      statusBox.textContent = 'أكمل الحقول الأساسية: العنوان والسعر والوصف.';
      return;
    }

    try {
      const listingId = editId || `u_${now}`;
      let images = existingImages.slice(0,20);
      if (selectedFiles.length) {
        statusBox.textContent = `جاري رفع ${selectedFiles.length} صورة إلى Firebase Storage...`;
        images = await uploadListingImages(selectedFiles, listingId);
      }
      const cover = images[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80';
      const now = Date.now();
      const item = {
        id: listingId,
        type, title, price, city, year, km, seller,
        sellerInitial: seller.charAt(0) || 'ب', desc, phone, whatsapp,
        cover, images,
        createdTs: existingItem?.createdTs || now,
        createdAt: existingItem?.createdAt || formatRelativeArabic(now),
        status: existingItem?.status || 'active'
      };
      const saved = await saveListing(item);
      statusBox.textContent = editId ? 'تم تحديث الإعلان بنجاح.' : 'تم حفظ الإعلان بنجاح على حسابك.';
      setTimeout(()=>{ location.href = `details.html?id=${saved.id}`; }, 350);
    } catch (err) {
      console.error(err);
      statusBox.textContent = err?.message === 'auth_required' ? 'سجل الدخول أولًا.' : 'تعذر الحفظ على Firebase.';
    }
  });
})();
