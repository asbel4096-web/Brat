import { bootCommon, seedListings, adCard } from './common.js';
bootCommon('myads');
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="page-head"><div class="container">
    <h2 class="page-title">إعلاناتي</h2>
    <p class="page-sub">تابع إعلاناتك المنشورة والمعلقة.</p>
  </div></section>
  <section class="section"><div class="container">
    <div class="ads-grid">${seedListings.slice(0,3).map(adCard).join('')}</div>
  </div></section>
</main>`;