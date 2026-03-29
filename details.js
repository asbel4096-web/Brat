import { pageTemplate, detailById, price, safeText, normalizeWhatsapp, makeMapsUrl } from './common.js';

(async ()=>{
  const id = new URLSearchParams(location.search).get('id') || '1';
  const item = await detailById(id);
  const wa = normalizeWhatsapp(item.whatsapp || item.phone);
  const phone = String(item.phone || '').replace(/[^\d+]/g,'');
  const whatsappHref = wa ? `https://wa.me/${wa}` : `https://wa.me/218910000000`;
  const phoneHref = phone ? `tel:${phone}` : `tel:+218910000000`;
  const mapsHref = makeMapsUrl(item.city);
  const gallery = (item.images?.length ? item.images : [item.cover]).map(src=>`
    <div class="detail-cover" style="margin-top:10px"><img src="${safeText(src)}" alt="${safeText(item.title)}"></div>
  `).join('');
  const content = `
  <section class="section">
    <div class="detail-card">
      <div class="detail-cover"><img src="${safeText(item.cover)}" alt="${safeText(item.title)}"></div>
      <div class="listing-price">${price(item.price)}</div>
      <h2 class="listing-title">${safeText(item.title)}</h2>
      <div class="listing-meta"><span>${safeText(item.city)}</span><span>${safeText(item.year)}</span><span>${safeText(item.km)}</span></div>
      <p class="listing-desc">${safeText(item.desc)}</p>
      <div class="table-list">
        <div class="table-row"><span>النوع</span><span>${safeText(item.type)}</span></div>
        <div class="table-row"><span>المدينة</span><span>${safeText(item.city)}</span></div>
        <div class="table-row"><span>السنة</span><span>${safeText(item.year)}</span></div>
        <div class="table-row"><span>الحالة</span><span>${safeText(item.km)}</span></div>
        <div class="table-row"><span>البائع</span><span>${safeText(item.seller)}</span></div>
      </div>
      <div class="detail-actions">
        <a class="btn btn-primary" target="_blank" href="${whatsappHref}">واتساب</a>
        <a class="btn btn-soft" href="${phoneHref}">اتصال</a>
        <a class="icon-btn" target="_blank" href="${mapsHref}">⌖</a>
      </div>
      ${gallery}
    </div>
  </section>`;
  document.getElementById('app').innerHTML = pageTemplate({active:'home', title:'التفاصيل', subtitle:'عرض كامل للإعلان مع وسائل التواصل.', content});
})();
