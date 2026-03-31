import { pageTemplate, customSelect, activateCustomSelects, saveListing, uploadListingImages, removeListingImages, normalizeWhatsapp, formatRelativeArabic, detailById, getCurrentUser, authGateCard, waitForAuthReady, t, initLanguageUI } from './common.js';

const editId = new URLSearchParams(location.search).get('id');
const cities = ['طرابلس','بنغازي','مصراتة','الزاوية','زليتن','صرمان','صبراتة','العجيلات','سبها','سرت','الخمس','درنة','البيضاء','طبرق','أجدابيا','المرج','غريان','نالوت','يفرن','زوارة','بني وليد','ترهونة','رقدالين','الكفرة','هون','ودان','مرزق','غات','أوباري','راس لانوف','البريقة','شحات','سوسة','القبة','توكرة','تاورغاء','مسلاتة','سلوق'];

function buildContent(){
  return `
<section class="section">
  <div class="step-pills"><span>${t('step_category')}</span><span>${t('step_details')}</span><span>${t('step_images')}</span><span>${t('step_contact')}</span><span>${t('step_review')}</span></div>
  <form id="ad-form" class="form-shell">
    <div class="section-head">
      <div>
        <h3>${editId ? `${t('edit')} ${t('images')}` : t('ad_data')}</h3>
        <p>${editId ? 'يمكنك حذف الصور القديمة وإضافة صور جديدة ثم حفظ التعديلات على نفس الإعلان.' : 'نموذج مرتب مع رفع حتى 20 صورة ومعاينة مباشرة ثم رفع حقيقي إلى Firebase Storage.'}</p>
      </div>
      <span class="btn btn-soft">${editId ? t('edit') : t('direct')}</span>
    </div>

    <div class="grid">
      ${customSelect(t('ad_type'), t('cat_small_cars'), [t('cat_small_cars'),t('cat_heavy_cars'),t('cat_buses'),t('cat_parts'),t('cat_accessories'),t('cat_service')], 'ad-type')}
      ${customSelect(t('city'), 'طرابلس', cities, 'ad-city')}
      <label class="field"><label>${t('ad_title')}</label><input name="title" required placeholder="مثال: هيونداي أزيرا 2023 محلية وكالة"></label>
      <label class="field"><label>${t('price')}</label><input name="price" type="number" required placeholder="45000"></label>
      <label class="field"><label>${t('year_or_status')}</label><input name="year" placeholder="مثال: 2023 أو خدمة"></label>
      <label class="field"><label>${t('meter_or_part_state')}</label><input name="km" placeholder="مثال: 95,000 كم أو قطعة مستعملة"></label>
      <label class="field"><label>${t('advertiser_name')}</label><input name="seller" placeholder="مثال: براتشو كار"></label>
      <label class="field"><label>${t('description')}</label><textarea name="desc" required placeholder="اكتب تفاصيل السيارة أو القطعة أو الخدمة بشكل مرتب وواضح."></textarea></label>
      <label class="field"><label>${t('phone')}</label><input name="phone" placeholder="0912345678"></label>
      <label class="field"><label>${t('whatsapp')}</label><input name="whatsapp" placeholder="0912345678 أو 2189..."></label>
      <label class="field"><label>${t('map_area')}</label><input name="mapLocation" placeholder="مثال: حي الأندلس، طرابلس"></label>
      <label class="field"><label>${t('map_link')}</label><input name="mapLink" placeholder="الصق رابط Google Maps هنا - اختياري"></label>

      <div class="search-panel">
        <div class="section-head">
          <div>
            <h3>${t('images')}</h3>
            <p>${editId ? 'في وضع التعديل: يمكنك الاحتفاظ بالصور الحالية أو حذف بعضها ثم إضافة صور جديدة.' : 'يمكنك رفع حتى 20 صورة وسيتم تخزينها فعليًا داخل Firebase Storage.'}</p>
          </div>
        </div>
        <input id="image-input" type="file" accept="image/*" multiple hidden>
        <button id="pick-images" type="button" class="btn btn-soft btn-block">${editId ? 'إضافة صور جديدة' : t('upload_images')}</button>
        <div id="image-count" class="muted" style="margin-top:8px">لم يتم اختيار صور بعد.</div>
        <div id="image-preview" class="listing-grid" style="margin-top:10px"></div>
      </div>

      <button class="btn btn-primary btn-block" type="submit">${editId ? 'حفظ التعديلات' : t('save_preview')}</button>
      <div id="save-status" class="muted"></div>
    </div>
  </form>
</section>`;
}

(async function init(){
  await waitForAuthReady();
  if (!getCurrentUser()) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'add',
      title: editId ? t('edit') : t('add_ad_title'),
      subtitle:t('add_ad_sub'),
      content: authGateCard('لا يمكن إضافة أو تعديل إعلان بدون تسجيل الدخول.','فتح تسجيل الدخول')
    });
    initLanguageUI();
    return;
  }

  document.getElementById('app').innerHTML = pageTemplate({
    active:'add',
    title: editId ? t('edit') : t('add_ad_title'),
    subtitle:t('add_ad_sub'),
    content: buildContent()
  });
  activateCustomSelects();
  initLanguageUI();

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
    statusBox.textContent = fresh.length > allowed.length
      ? `تم الوصول إلى الحد الأقصى 20 صورة. تم إضافة ${allowed.length} صورة فقط.`
      : '';
    imageInput.value = '';
    renderSelectedImages();
  });

  function renderSelectedImages(){
    const currentItems = keptImages.map((src, idx) => ({ key:`old_${idx}`, src, label:'حالياً', kind:'existing' }));
    const pendingItems = pendingFiles.map((file, idx) => ({ key:`new_${idx}`, src:URL.createObjectURL(file), label:'جديد', kind:'pending' }));
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
    setSelectValue('ad-type', existingItem.type || t('cat_cars'));
    setSelectValue('ad-city', existingItem.city || 'طرابلس');
    renderSelectedImages();
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    statusBox.textContent = editId ? 'جاري حفظ التعديلات...' : 'جاري حفظ الإعلان على Firebase...';

    const fd = new FormData(form);
    const type = fd.get('ad-type') || t('cat_cars');
    const city = fd.get('ad-city') || 'طرابلس';
    const title = String(fd.get('title') || '').trim();
    const price = Number(fd.get('price') || 0);
    const year = String(fd.get('year') || '').trim() || (type === t('cat_service') ? t('cat_service') : 'غير محدد');
    const km = String(fd.get('km') || '').trim() || (type === t('cat_parts') ? 'قطعة' : 'غير محدد');
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
        try { await removeListingImages(removedImages); } catch {}
      }

      statusBox.textContent = editId ? 'تم تحديث الإعلان والصور بنجاح.' : 'تم حفظ الإعلان بنجاح على حسابك.';
      setTimeout(()=>{ location.href = `details.html?id=${saved.id}`; }, 350);
    } catch (err) {
      console.error(err);
      statusBox.textContent = err?.message === 'auth_required' ? 'سجل الدخول أولًا.' : 'تعذر الحفظ أو رفع الصور.';
    }
  });
})();
