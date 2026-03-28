import { bootCommon, seedListings } from './common.js';
bootCommon('home');

const item = seedListings[0];

document.getElementById('app').innerHTML = `
<main class="page details-mobile-page">
  <section class="details-page">
    <div class="container">
      <div class="details-hero-card">
        <div class="details-main-image" style="background-image:url('${item.images[0]}')"></div>

        <div class="details-hero-body">
          <div class="details-topline">
            <span class="badge">سيارة</span>
            <span class="details-mini-meta">${item.city} • ${item.year} • ${item.mileage}</span>
          </div>

          <div class="details-price">${Number(item.price).toLocaleString('en-US')} د.ل</div>
          <h2 class="details-title">${item.title}</h2>
          <p class="details-desc">${item.desc}</p>

          <div class="details-actions">
            <a class="primary-btn full" href="tel:${item.seller.phone}">اتصال مباشر</a>
            <a class="soft-btn full" href="https://wa.me/218${item.seller.whatsapp.slice(1)}">واتساب</a>
          </div>
        </div>
      </div>

      <div class="details-thumbs">
        ${item.images.map((src, i) => `<button class="details-thumb ${i===0?'active':''}" style="background-image:url('${src}')" aria-label="صورة ${i+1}"></button>`).join('')}
      </div>

      <div class="details-sections-grid">
        <section class="details-block">
          <div class="block-head">
            <h3>المواصفات</h3>
            <p>كل المعلومات المهمة بسرعة</p>
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
            <h3>بيانات البائع</h3>
            <p>تواصل مباشر وسريع</p>
          </div>
          <div class="seller-card">
            <div class="seller-row">
              <div>
                <strong>${item.seller.name}</strong>
                <div class="muted">${item.seller.joined}</div>
              </div>
              <div class="seller-avatar">BC</div>
            </div>
            <div class="contact-row"><span>الهاتف</span><strong>${item.seller.phone}</strong></div>
            <div class="contact-row"><span>المدينة</span><strong>${item.city}</strong></div>
            <div class="contact-row"><span>واتساب</span><strong>${item.seller.whatsapp}</strong></div>
          </div>
        </section>

        <section class="details-block">
          <div class="block-head">
            <h3>وصف الإعلان</h3>
            <p>عرض واضح واحترافي</p>
          </div>
          <div class="details-text-card">
            <p>هذه نسخة جوال محسنة لصفحة التفاصيل، بحيث يظهر السعر والعنوان وأزرار التواصل مباشرة بدون أن يغطيها الشريط السفلي.</p>
            <p>يمكن لاحقًا ربط هذه الصفحة مع Firebase لعرض الإعلان الحقيقي والصور الحقيقية لكل سيارة أو قطعة أو خدمة.</p>
          </div>
        </section>
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
    mainImage.style.backgroundImage = btn.style.backgroundImage;
  });
});