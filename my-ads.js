import { boot, listings, listingCard } from './common.js';
boot('myads');

document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h2>إعلاناتي</h2><p>إدارة الإعلانات المنشورة والمراجعة بسرعة.</p></div>
      </div>
      <div class="listing-grid">
        ${listings.map(listingCard).join('')}
      </div>
    </div>
  </section>
</main>