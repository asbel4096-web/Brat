import { boot, listings, listingCard } from './common.js';
boot('home');
const cars = listings.filter(x=>x.type==='سيارة');
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h2>السيارات</h2><p>سيارات للبيع بإظهار أنيق وحجم خط أقرب للتطبيقات الكبيرة.</p></div>
      </div>
      <div class="listing-grid">${cars.map(listingCard).join('')}</div>
    </div>
  </section>
</main>
`;