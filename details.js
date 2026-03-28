import { bootCommon, seedListings } from './common.js';
bootCommon('home');

const item = seedListings[0];

document.getElementById('app').innerHTML = `
<main class="page">
  <section class="details-page">
    <div class="container">
      <div class="details-top">
        <div class="details-gallery-card">
          <div class="details-main-image" style="background-image:url('${item.images[0]}')"></div>
          <div class="details-thumbs">
            ${item.images.map((src, i) => `<button class="details-thumb ${i===0?'active':''}" style="background-image:url('${src}')" aria-label="صورة ${i+1}"></button>`).join('')}
          </div>
        </div>

        <div class="details-side-card">
          <span class="badge">سيارة</span>
          <h2 class="details-title">${item.title}</h2>
          <div class="details-price">${Number(item.price).toLocaleString('en-US')} د.ل</div>
          <div class="details-meta">
            <span>${item.city}</span>
            <span>${item.year}</span>
            <span>${item.mileage}</span>
          </div>
          <p class="details-desc">${item.desc}</p>

          <div class="details-actions">
            <a class="primary-btn full" href="tel:${item.seller.phone}">اتصال مباشر</a>
            <a class="soft-btn full" href="https://wa.me/218${item.seller.whatsapp.slice(1)}">واتساب</a>
          </div>

          <div class="seller-mini-card">
            <div>
              <strong>${item.seller.name}</strong>
              <div class="muted">${item.seller.joined}</div>
            </div>
            <div class="seller-avatar">BC</div>
          </div>
        </div>
      </div>

      <div class="details-grid">
        <section class="details-block">
          <div class="block-head">
            <h3>المواصفات</h3>
            <p>تفاصيل مختصرة وواضحة</p>
          </div>
          <div class="specs-grid">
            <div class="spec-card"><span>نوع الهيكل</span><strong>${item.specs.body}</strong></div>
            <div class="spec-card"><span>نوع الوقود</span><strong>${item.specs.fuel}</strong></div>
            <div class="spec-card"><span>ناقل الحركة</span><strong>${item.specs.gear}</strong></div>
            <div class="spec-card"><span>المحرك</span><strong>${item.specs.engine}</strong></div>
            <div class="spec-card"><span>الاستيراد</span><strong>${item.specs.import}</strong></div>
            <div class="spec-card"><span>الحالة</span><strong>${item.specs.condition}</strong></div>
          </div>
        </section>

        <section class="details-block">
          <div class="block-head">
            <h3>وصف الإعلان</h3>
            <p>كل ما يحتاجه المشتري في صفحة واحدة</p>
          </div>
          <div class="details-text-card">
            <p>سيارة نظيفة ومناسبة للاستعمال اليومي، مع حالة ممتازة من ناحية المحرك والصالون والمظهر الخارجي. الإعلان مصمم ليظهر بشكل فاخر وواضح على الجوال مع أزرار تواصل مباشرة.</p>
            <p>يمكنك لاحقًا ربط هذه الصفحة ببيانات Firebase الحقيقية بحيث تتغير الصور والمواصفات تلقائيًا حسب الإعلان.</p>
          </div>
        </section>

        <aside class="details-block sticky-contact">
          <div class="block-head">
            <h3>تواصل مع البائع</h3>
            <p>خطوات سريعة ومباشرة</p>
          </div>
          <div class="contact-panel">
            <div class="contact-row"><span>الاسم</span><strong>${item.seller.name}</strong></div>
            <div class="contact-row"><span>الهاتف</span><strong>${item.seller.phone}</strong></div>
            <div class="contact-row"><span>المدينة</span><strong>${item.city}</strong></div>
            <a class="primary-btn full" href="tel:${item.seller.phone}">اتصل الآن</a>
            <a class="soft-btn full" href="https://wa.me/218${item.seller.whatsapp.slice(1)}">راسل واتساب</a>
          </div>
        </aside>
      </div>
    </div>
  </section>
</main>`;

const thumbs = document.querySelectorAll('.details-thumb');
const mainImage = document.querySelector('.details-main-image');

thumbs.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    thumbs.forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const bg = btn.style.backgroundImage;
    mainImage.style.backgroundImage = bg;
  });
});