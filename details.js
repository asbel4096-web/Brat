import { pageTemplate, detailById, price, safeText, normalizeWhatsapp, makeMapsUrl, getCurrentUser, updateListingStatus, removeListing, waitForAuthReady, toggleFavorite, createOrOpenChat, t, initLanguageUI } from './common.js';

(async ()=>{
  await waitForAuthReady();
  const id = new URLSearchParams(location.search).get('id') || '1';
  const item = await detailById(id);
  const wa = normalizeWhatsapp(item.whatsapp || item.phone);
  const phone = String(item.phone || '').replace(/[^\d+]/g,'');
  const whatsappHref = wa ? `https://wa.me/${wa}` : `https://wa.me/218910000000`;
  const phoneHref = phone ? `tel:${phone}` : `tel:+218910000000`;
  const mapsHref = item.mapLink || makeMapsUrl(item.mapLocation || item.city);
  const isOwner = !!(item.ownerId && getCurrentUser() && item.ownerId === getCurrentUser().uid);
  const isHidden = (item.status || 'active') === 'hidden';

  const ownerTools = isOwner ? `
    <div class="detail-actions" style="margin-top:10px">
      <a class="btn btn-primary" href="add.html?id=${safeText(item.id)}">تعديل</a>
      <button class="btn btn-soft" id="toggle-state">${isHidden ? 'إظهار الإعلان' : 'إخفاء الإعلان'}</button>
      <button class="icon-btn" id="delete-ad">🗑</button>
    </div>` : '';

  const gallery = (item.images?.length ? item.images : [item.cover]).map(src=>`
    <div class="detail-thumb"><img src="${safeText(src)}" alt="${safeText(item.title)}"></div>
  `).join('');

  const content = `
  <section class="section">
    <div class="detail-card detail-card-upgraded">
      <div class="detail-hero">
        <div class="detail-cover detail-cover-main"><img src="${safeText(item.cover)}" alt="${safeText(item.title)}"></div>
        <div class="detail-headline">
          <div class="detail-topline">
            <span class="detail-type-pill">${safeText(item.type)}</span>
            <div class="listing-price">${price(item.price)}</div>
          </div>
          <h2 class="listing-title detail-title">${safeText(item.title)}</h2>
          <p class="listing-desc detail-desc">${safeText(item.desc)}</p>
          <div class="detail-pills">
            <span>${safeText(item.city)}</span>
            <span>${safeText(item.year)}</span>
            <span>${safeText(item.km)}</span>
            <span>${safeText(item.seller || 'براتشو')}</span>
          </div>
        </div>
      </div>

      ${(item.status || 'active') === 'hidden' ? '<p class="muted" style="color:#c97700;font-weight:800;margin-top:10px">هذا الإعلان مخفي حاليًا من العرض العام.</p>' : ''}

      <div class="detail-actions detail-actions-main">
        <button class="btn btn-primary" id="start-chat">${t('message')}</button>
        <a class="btn btn-soft" target="_blank" href="${whatsappHref}">${t('whatsapp')}</a>
        <a class="btn btn-soft" href="${phoneHref}">${t('call')}</a>
        <a class="icon-btn icon-btn-map" target="_blank" href="${mapsHref}" title="الخريطة">⌖</a>
        <button class="icon-btn icon-btn-fav ${item.__favorite ? 'is-favorite' : ''}" id="fav-detail" title="المفضلة">${item.__favorite ? '♥' : '♡'}</button>
      </div>

      <div class="table-list detail-table">
        <div class="table-row"><span>${t('type')}</span><span>${safeText(item.type)}</span></div>
        <div class="table-row"><span>${t('city')}</span><span>${safeText(item.city)}</span></div>
        <div class="table-row"><span>${t('year')}</span><span>${safeText(item.year)}</span></div>
        <div class="table-row"><span>${t('condition')}</span><span>${safeText(item.km)}</span></div>
        <div class="table-row"><span>${t('seller')}</span><span>${safeText(item.seller)}</span></div>
        ${item.mapLocation ? `<div class="table-row"><span>${t('location')}</span><span>${safeText(item.mapLocation)}</span></div>` : ''}
      </div>

      ${ownerTools}

      <div class="detail-gallery">
        ${gallery}
      </div>
    </div>
  </section>`;

  document.getElementById('app').innerHTML = pageTemplate({
    active:'home',
    title:t('details'),
    subtitle:t('full_ad_view'),
    content
  });

  document.getElementById('start-chat')?.addEventListener('click', async e => {
    e.currentTarget.disabled = true;
    try {
      const chat = await createOrOpenChat(item);
      if (chat?.id) location.href = `chat.html?id=${encodeURIComponent(chat.id)}`;
    } catch (err) {
      if (err?.message === 'auth_required') {
        location.href = 'dashboard.html#auth-required';
        return;
      }
      alert('تعذر فتح المحادثة');
    } finally {
      e.currentTarget.disabled = false;
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
initLanguageUI();
})();
