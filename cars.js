import { boot, listings, listingCard } from './common.js';
boot('home');
const items = listings.filter(x=>x.type==='سيارة');
document.getElementById('app').innerHTML = `<main class="page"><section class="section"><div class="container"><div class="section-head"><div><h2>السيارات</h2><p>عرض إعلانات السيارات ببطاقات حديثة ومرتبة.</p></div></div><div class="listing-grid">${items.map(listingCard).join('')}</div></div></section></main>`;
