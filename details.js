import { pageTemplate, detailById, price, safeText, normalizeWhatsapp, makeMapsUrl, getCurrentUser, updateListingStatus, removeListing, waitForAuthReady, isFavorite, toggleFavorite, createOrOpenChat } from './common.js';

(async ()=>{
  await waitForAuthReady();

  const id = new URLSearchParams(location.search).get('id');
  const item = await detailById(id);

  if (!item) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'home',
      title:'التفاصيل',
      subtitle:'الإعلان غير موجود أو تم حذفه.',
      content:`<section class="section"><div class="empty-card"><div class="empty-icon">!</div><h3 class="listing-title">الإعلان غير موجود</h3><a class="btn btn-primary" href="index.html">العودة للرئيسية</a></div></section>`
    });
    return;
  }

  item.__favorite = await isFavorite(item.id);

  const user = getCurrentUser();
  const wa = normalizeWhatsapp(item.whatsapp || item.phone);
  const phone = String(item.phone || '').replace(/[^\d+]/g,'');
  const whatsappHref = wa ? `https://wa.me/${wa}` : `https://wa.me/218910000000`;
  const phoneHref = phone ? `tel:${phone}` : `tel:+218910000000`;
  const mapsHref = makeMapsUrl(item.city);
  const isOwner = !!(item.ownerId && user && item.ownerId === user.uid);
  const isHidden = (item.status || 'active') === 'hidden';

  const gallery = (item.images?.length ? item.images : [item.cover]).map(src => `
    <div class="detail-cover" style="margin-top:14px">
      <img src="${safeText(src)}" alt="${safeText(item.title)}">
    </div>
  `).join('');

  const ownerTools = isOwner ? `
    <div class="detail-actions" style="margin-top:14px">
      <a class="btn btn-primary" href="add.html?id=${safeText(item.id)}">تعديل</a>
      <button class="btn btn-soft" id="toggle-state">${isHidden ? 'إظهار الإعلان' : 'إخفاء الإعلان'}</button>
      <button class="icon-btn" id="delete-ad" title="حذف">🗑</button>
    </div>
  ` : '';

  const content = `
  <section class="section">
    <div class="detail-card">
      <div class="detail-cover"><img src="${safeText(item.cover)}" alt="${safeText(item.title)}"></div>
      <div class="listing-price">${price(item.price)}</div>
      <h2 class="listing-title">${safeText(item.title)}</h2>
      <div class="listing-meta"><span>${safeText(item.city)}</span><span>${safeText(item.year || '')}</span><span>${safeText(item.km || '')}</span></div>
      ${isHidden ? '<p class="muted" style="color:#c97700;font-weight:800">هذا الإعلان مخفي حاليًا من الصفحة الرئيسية.</p>' : ''}
      <p class="listing-desc">${safeText(item.desc || '')}</p>

      <div class="table-list">
        <div class="table-row"><span>النوع</span><strong>${safeText(item.type || '')}</strong></div>
        <div class="table-row"><span>المدينة</span><strong>${safeText(item.city || '')}</strong></div>
        <div class="table-row"><span>السنة</span><strong>${safeText(item.year || '')}</strong></div>
        <div class="table-row"><span>الحالة</span><strong>${safeText(item.km || '')}</strong></div>
        <div class="table-row"><span>البائع</span><strong>${safeText(item.seller || 'براتشو')}</strong></div>
      </div>

      <div class="detail-actions">
        <button class="btn btn-primary" id="start-chat">مراسلة</button>
        <a class="btn btn-soft" target="_blank" href="${whatsappHref}">واتساب</a>
        <a class="btn btn-soft" href="${phoneHref}">اتصال</a>
        <a class="icon-btn" target="_blank" href="${mapsHref}">⌖</a>
        <button class="icon-btn ${item.__favorite ? 'is-favorite' : ''}" id="fav-detail">${item.__favorite ? '♥' : '♡'}</button>
      </div>

      ${ownerTools}
      ${gallery}
    </div>
  </section>`;

  document.getElementById('app').innerHTML = pageTemplate({
    active:'home',
    title:'التفاصيل',
    subtitle:'عرض كامل للإعلان مع وسائل التواصل.',
    content
  });

  const startChatBtn = document.getElementById('start-chat');
  startChatBtn?.addEventListener('click', async e => {
    e.preventDefault();

    if (!user) {
      location.href = 'dashboard.html#auth-required';
      return;
    }

    if (!item?.ownerId) {
      alert('هذا الإعلان غير مرتبط بصاحب واضح بعد.');
      return;
    }

    if (item.ownerId === user.uid) {
      alert('هذا إعلانك أنت.');
      return;
    }

    startChatBtn.disabled = true;
    startChatBtn.textContent = 'جاري فتح المحادثة...';

    try {
      const chat = await createOrOpenChat(item);
      if (!chat?.id) throw new Error('missing_chat_id');
      location.href = `chat.html?id=${encodeURIComponent(chat.id)}`;
    } catch (err) {
      console.error('start-chat-error', err, item);
      alert('تعذر فتح المحادثة');
    } finally {
      startChatBtn.disabled = false;
      startChatBtn.textContent = 'مراسلة';
    }
  });

  document.getElementById('fav-detail')?.addEventListener('click', async e => {
    e.currentTarget.disabled = true;
    try {
      const next = await toggleFavorite(item);
      e.currentTarget.textContent = next ? '♥' : '♡';
      e.currentTarget.classList.toggle('is-favorite', next);
    } catch (err) {
      if (err?.message === 'auth_required') {
        location.href = 'dashboard.html#auth-required';
        return;
      }
      alert('تعذر تحديث المفضلة');
    } finally {
      e.currentTarget.disabled = false;
    }
  });

  document.getElementById('toggle-state')?.addEventListener('click', async e => {
    e.currentTarget.disabled = true;
    try {
      await updateListingStatus(item.id, isHidden ? 'active' : 'hidden');
      location.reload();
    } catch {
      alert('تعذر تحديث حالة الإعلان');
      e.currentTarget.disabled = false;
    }
  });

  document.getElementById('delete-ad')?.addEventListener('click', async e => {
    if (!confirm('هل تريد حذف الإعلان؟')) return;
    e.currentTarget.disabled = true;
    try {
      await removeListing(item.id);
      location.href = 'my-ads.html';
    } catch {
      alert('تعذر حذف الإعلان');
      e.currentTarget.disabled = false;
    }
  });
})();
