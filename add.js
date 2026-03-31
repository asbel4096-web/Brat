import { pageTemplate, customSelect, activateCustomSelects, saveListing, uploadListingImages, removeListingImages, normalizeWhatsapp, formatRelativeArabic, detailById, getCurrentUser, authGateCard, waitForAuthReady } from './common.js';

const editId = new URLSearchParams(location.search).get('id');

const content = `
<section class="section">
  <div class="step-pills"><span>1. القسم</span><span>2. التفاصيل</span><span>3. الصور</span><span>4. التواصل</span><span>5. المراجعة</span></div>
  <form id="ad-form" class="form-shell">
    <div class="section-head">
      <div>
        <h3>${editId ? 'تعديل الإعلان مع تحديث الصور' : 'بيانات الإعلان'}</h3>
        <p>${editId ? 'يمكنك حذف الصور القديمة وإضافة صور جديدة ثم حفظ التعديلات على نفس الإعلان.' : 'نموذج مرتب مع رفع حتى 20 صورة ومعاينة مباشرة ثم رفع حقيقي إلى Firebase Storage.'}</p>
      </div>
      <span class="btn btn-soft">${editId ? 'تعديل' : 'مباشر'}</span>
    </div>

    <div class="grid">
      ${customSelect('نوع الإعلان', 'سيارة', ['سيارة','قطعة غيار','خدمة'], 'ad-type')}
      ${customSelect('المدينة', 'طرابلس', ['طرابلس','بنغازي','مصراتة','الزاوية','زليتن','صرمان','صبراتة','العجيلات','سبها','سرت','الخمس','درنة','البيضاء','طبرق','أجدابيا','المرج','غريان','نالوت','يفرن','زوارة','بني وليد','ترهونة','رقدالين','الكفرة','هون','ودان','مرزق','غات','أوباري','راس لانوف','البريقة','شحات','سوسة','القبة','توكرة','تاورغاء','مسلاتة','سلوق'], 'ad-city')}
      <label class="field"><label>عنوان الإعلان</label><input name="title" required placeholder="مثال: هيونداي أزيرا 2023 محلية وكالة"></label>
      <label class="field"><label>السعر</label><input name="price" type="number" required placeholder="45000"></label>
      <label class="field"><label>السنة أو الحالة</label><input name="year" placeholder="مثال: 2023 أو خدمة"></label>
      <label class="field"><label>العداد أو حالة القطعة</label><input name="km" placeholder="مثال: 95,000 كم أو قطعة مستعملة"></label>
      <label class="field"><label>اسم المعلن</label><input name="seller" placeholder="مثال: براتشو كار"></label>
      <label class="field"><label>الوصف</label><textarea name="desc" required placeholder="اكتب تفاصيل السيارة أو القطعة أو الخدمة بشكل مرتب وواضح."></textarea></label>
      <label class="field"><label>رقم الهاتف</label><input name="phone" placeholder="0912345678"></label>
      <label class="field"><label>واتساب</label><input name="whatsapp" placeholder="0912345678 أو 2189..."></label>
      <label class="field"><label>اسم الموقع أو الحي</label><input name="mapLocation" placeholder="مثال: حي الأندلس، طرابلس"></label>
      <label class="field"><label>رابط الخريطة</label><input name="mapLink" placeholder="الصق رابط Google Maps هنا - اختياري"></label>

      <div class="search-panel">
        <div class="section-head">
          <div>
            <h3>الصور</h3>
            <p>${editId ? 'في وضع التعديل: يمكنك الاحتفاظ بالصور الحالية أو حذف بعضها ثم إضافة صور جديدة.' : 'يمكنك رفع حتى 20 صورة وسيتم تخزينها فعليًا داخل Firebase Storage.'}</p>
          </div>
        </div>
        <input id="image-input" type="file" accept="image/*" multiple hidden>
        <button id="pick-images" type="button" class="btn btn-soft btn-block">${editId ? 'إضافة صور جديدة' : 'رفع صور الإعلان'}</button>
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
    document.getElementById('app').innerHTML = pageTemplate({
      active:'add',
      title:'إضافة إعلان جديد',
      subtitle:'سجل الدخول أولًا حتى يحفظ الإعلان على حسابك الحقيقي.',
      content: authGateCard('لا يمكن إضافة أو تعديل إعلان بدون تسجيل الدخول.','افتح تسجيل الدخول')
    });
    return;
  }

  document.getElementById('app').innerHTML = pageTemplate({
    active:'add',
    title: editId ? 'تعديل إعلان' : 'إضافة إعلان جديد',
    subtitle:'مسار واضح وسريع لإضافة سيارة أو قطعة أو خدمة.',
    content
  });
  activateCustomSelects();

  const form = document.getElementById('ad-form');
  const imageInput = document.getElementById('image-input');
  const pickImages = document.getElementById('pick-images');
  const imagePreview = document.getElementById('image-preview');
  const imageCount = document.getElementById('image-count');
  const statusBox = document.getElementById('save-status');

  let pendingFiles = [];
  let existingItem = null;
  let keptImages = [];
  let removedImages = [];

  pickImages.addEventListener('click', ()=> imageInput.click());

  imageInput.addEventListener('change', ()=>{
    const fresh = Array.from(imageInput.files || []);
    const remainingSlots = Math.max(0, 20 - keptImages.length - pendingFiles.length);
    const allowed = fresh.slice(0, remainingSlots);
    pendingFiles = [...pendingFiles, ...allowed].slice(0, 20);
    if (fresh.length > allowed.length) {
      statusBox.textContent = `تم الوصول إلى الحد الأقصى 20 صورة. تم إضافة ${allowed.length} صورة فقط.`;
    } else {
      statusBox.textContent = '';
    }
    imageInput.value = '';
    renderSelectedImages();
  });

  function renderSelectedImages(){
    const currentItems = keptImages.map((src, idx) => ({
      key: `old_${idx}`,
      src,
      label: 'حالياً',
      kind: 'existing'
    }));
    const pendingItems = pendingFiles.map((file, idx) => ({
      key: `new_${idx}`,
      src: URL.createObjectURL(file),
      label: 'جديد',
      kind: 'pending'
    }));
    const items = [...currentItems, ...pendingItems];

    imageCount.textContent = items.length
      ? `عدد الصور الحالية ${items.length} من 20. يمكنك حذف أي صورة قبل الحفظ.`
      : 'لم يتم اختيار صور بعد.';

    imagePreview.innerHTML = items.map(item => `
      <article class="listing-card">
        <div class="listing-image" style="position:relative">
          <img src="${item.src}" alt="preview">
          <span class="badge dark" style="left:10px;right:auto">${item.label}</span>
          <button
            type="button"
            class="icon-btn js-remove-image"
            data-kind="${item.kind}"
            data-key="${item.key}"
            title="حذف الصورة"
            style="position:absolute;top:10px;left:10px;background:#fff;color:#b42318;border:1px solid rgba(180,35,24,.15);z-index:3"
          >✕</button>
        </div>
      </article>
    `).join('');

    imagePreview.querySelectorAll('.js-remove-image').forEach(btn => {
      btn.addEventListener('click', () => {
        const kind = btn.dataset.kind;
        const key = btn.dataset.key;
        if (kind === 'existing') {
          const index = Number(String(key).split('_')[1]);
          const removed = keptImages[index];
          if (removed) {
            removedImages.push(removed);
            keptImages = keptImages.filter((_, i) => i !== index);
          }
        } else {
          const index = Number(String(key).split('_')[1]);
          pendingFiles = pendingFiles.filter((_, i) => i !== index);
        }
        renderSelectedImages();
      });
    });
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

    keptImages = Array.isArray(existingItem.images)
      ? existingItem.images.slice(0, 20)
      : (existingItem.cover ? [existingItem.cover] : []);

    form.title.value = existingItem.title || '';
    form.price.value = existingItem.price || '';
    form.year.value = existingItem.year || '';
    form.km.value = existingItem.km || '';
    form.seller.value = existingItem.seller || '';
    form.desc.value = existingItem.desc || '';
    form.phone.value = existingItem.phone || '';
    form.whatsapp.value = existingItem.whatsapp || '';
    if (form.mapLocation) form.mapLocation.value = existingItem.mapLocation || '';
    if (form.mapLink) form.mapLink.value = existingItem.mapLink || '';
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
    const mapLocation = String(fd.get('mapLocation') || city || '').trim();
    const mapLink = String(fd.get('mapLink') || '').trim();

    if (!title || !desc || !price) {
      statusBox.textContent = 'أكمل الحقول الأساسية: العنوان والسعر والوصف.';
      return;
    }

    if ((keptImages.length + pendingFiles.length) < 1) {
      statusBox.textContent = 'أضف صورة واحدة على الأقل أو احتفظ بصورة حالية.';
      return;
    }

    try {
      const now = Date.now();
      const listingId = editId || `u_${now}`;

      let uploadedNewImages = [];
      if (pendingFiles.length) {
        statusBox.textContent = `جاري رفع ${pendingFiles.length} صورة إلى Firebase Storage...`;
        uploadedNewImages = await uploadListingImages(pendingFiles, listingId);
      }

      const images = [...keptImages, ...uploadedNewImages].slice(0, 20);
      const cover = images[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80';

      const item = {
        id: listingId,
        type, title, price, city, year, km, seller,
        sellerInitial: seller.charAt(0) || 'ب',
        desc, phone, whatsapp, mapLocation, mapLink,
        cover, images,
        createdTs: existingItem?.createdTs || now,
        createdAt: existingItem?.createdAt || formatRelativeArabic(now),
        status: existingItem?.status || 'active'
      };

      const saved = await saveListing(item);

      if (removedImages.length) {
        statusBox.textContent = 'تم حفظ التعديل. جاري تنظيف الصور المحذوفة...';
        try {
          await removeListingImages(removedImages);
        } catch (cleanupErr) {
          console.warn('cleanup skipped', cleanupErr);
        }
      }

      statusBox.textContent = editId ? 'تم تحديث الإعلان والصور بنجاح.' : 'تم حفظ الإعلان بنجاح على حسابك.';
      setTimeout(()=>{ location.href = `details.html?id=${saved.id}`; }, 350);
    } catch (err) {
      console.error(err);
      statusBox.textContent = err?.message === 'auth_required' ? 'سجل الدخول أولًا.' : 'تعذر الحفظ أو رفع الصور.';
    }
  });
})();
