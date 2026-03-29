import { boot, getListingById, price } from './common.js';
boot('home');
const params = new URLSearchParams(location.search);
const id = params.get('id') || '1';
const item = await getListingById(id);

const images = item.images?.length ? item.images : [item.cover];
const phone = item.phone || '0912345678';
const whatsapp = item.whatsapp || phone;
const map = item.map || `https://maps.google.com/?q=${encodeURIComponent(item.city || 'Tripoli')}`;

document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section">
    <div class="container">
      <div class="details-layout">
        <div class="gallery-card card">
          <div class="main-photo" id="mainPhoto" style="background-image:url('${images[0]}')"></div>
          <div class="thumb-grid">
            ${images.map((src,i)=>`<button class="thumb ${i===0?'active':''}" style="background-image:url('${src}')" data-src="${src}"></button>`).join('')}
          </div>
        </div>

        <div class="side-card card">
          <div class="pill">${item.type}</div>
          <div class="price-big">${price(item.price)}</div>
          <h2 class="title-big">${item.title}</h2>
          <div class="meta-row"><span>${item.city}</span><span>•</span><span>${item.meta}</span></div>
          <p class="desc-big">${item.desc}</p>
          <div class="stacked">
            <a class="btn full" href="tel:${phone}">اتصال مباشر</a>
            <a class="btn-soft full" href="https://wa.me/${String(whatsapp).replace(/\D/g,'')}" target="_blank" rel="noreferrer">واتساب</a>
            <a class="btn-soft full" href="${map}" target="_blank" rel="noreferrer">الموقع على الخريطة</a>
          </div>
        </div>
      </div>

      <div class="section" style="padding-top:16px">
        <div class="spec-grid">
          <article class="spec-card"><span>الحالة</span><strong>${item.condition || '—'}</strong></article>
          <article class="spec-card"><span>نوع الوقود</span><strong>${item.fuel || '—'}</strong></article>
          <article class="spec-card"><span>ناقل الحركة</span><strong>${item.transmission || '—'}</strong></article>
          <article class="spec-card"><span>المحرك</span><strong>${item.engine || '—'}</strong></article>
          <article class="spec-card"><span>السنة</span><strong>${item.year || '—'}</strong></article>
          <article class="spec-card"><span>المسافة</span><strong>${item.mileage || '—'}</strong></article>
          <article class="spec-card"><span>المدينة</span><strong>${item.city}</strong></article>
          <article class="spec-card"><span>عدد الصور</span><strong>${images.length}</strong></article>
        </div>
      </div>
    </div>
  </section>
</main>
`;

document.querySelectorAll('.thumb').forEach(btn=>{
  btn.onclick = ()=>{
    document.querySelectorAll('.thumb').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('mainPhoto').style.backgroundImage = `url('${btn.dataset.src}')`;
  };
});
