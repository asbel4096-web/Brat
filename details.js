import { pageTemplate, detailById, price } from './common.js';
const id = new URLSearchParams(location.search).get('id') || '1';
const item = detailById(id);
const content = `
<section class="section">
  <div class="detail-card">
    <div class="detail-cover"><img src="${item.cover}" alt="${item.title}"></div>
    <div class="listing-price">${price(item.price)}</div>
    <h2 class="listing-title">${item.title}</h2>
    <div class="listing-meta"><span>${item.city}</span><span>${item.year}</span><span>${item.km}</span></div>
    <p class="listing-desc">${item.desc}</p>
    <div class="table-list">
      <div class="table-row"><span>النوع</span><span>${item.type}</span></div>
      <div class="table-row"><span>المدينة</span><span>${item.city}</span></div>
      <div class="table-row"><span>السنة</span><span>${item.year}</span></div>
      <div class="table-row"><span>الحالة</span><span>${item.km}</span></div>
      <div class="table-row"><span>البائع</span><span>${item.seller}</span></div>
    </div>
    <div class="detail-actions">
      <a class="btn btn-primary" target="_blank" href="https://wa.me/218910000000">واتساب</a>
      <a class="btn btn-soft" href="tel:+218910000000">اتصال</a>
      <a class="icon-btn" href="messages.html">✉</a>
    </div>
  </div>
</section>`;
document.getElementById('app').innerHTML = pageTemplate({active:'home', title:'التفاصيل', subtitle:'عرض كامل للإعلان مع وسائل التواصل.', content});
