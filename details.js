import { boot, listings, price } from './common.js';
boot('home');
const params = new URLSearchParams(location.search);
const id = params.get('id') || '1';
const item = listings.find(x=>x.id===id) || listings[0];

document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section">
    <div class="container">
      <div class="details-layout">
        <div class="gallery-card">
          <div class="main-photo" id="mainPhoto" style="background-image:url('${item.images[0]}')"></div>
          <div class="thumb-grid">
            ${item.images.map((src,i)=>`<button class="thumb ${i===0?'active':''}" style="background-image:url('${src}')" data-src="${src}"></button>`).join('')}
          </div>
        </div>

        <div class="side-card">
          <div class="pill">${item.type}</div>
          <div class="price-big">${price(item.price)}</div>
          <h2 class="title-big">${item.title}</h2>
          <div class="meta-row"><span>${item.city}</span><span>•</span><span>${item.meta}</span></div>
          <p class="desc-big">${item.desc}</p>
          <div class="stacked">
            <a class="btn full" href="tel:0912345678">اتصال مباشر</a>
            <a class="btn-soft full" href="https://wa.me/218912345678">واتساب</a>
            <a class="btn-soft full" href="https://maps.google.com/?q=Tripoli">الموقع على الخريطة</a>
          </div>
        </div>
      </div>

      <div class="section" style="padding-top:16px">
        <div class="spec-grid">
          <article class="spec-card"><span>الحالة</span><strong>ممتازة</strong></article>
          <article class="spec-card"><span>نوع الوقود</span><strong>بنزين</strong></article>
          <article class="spec-card"><span>ناقل الحركة</span><strong>أوتوماتيك</strong></article>
          <article class="spec-card"><span>المحرك</span><strong>2.0</strong></article>
          <article class="spec-card"><span>المدينة</span><strong>${item.city}</strong></article>
          <article class="spec-card"><span>التواصل</span><strong>واتساب / اتصال</strong></article>
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
