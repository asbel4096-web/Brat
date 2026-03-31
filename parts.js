import { boot, listings, listingCard } from './common.js';
boot('home');
const items = listings.filter(x=>x.type==='قطعة غيار');
document.getElementById('app').innerHTML = `<main class="page"><section class="section"><div class="container"><div class="section-head"><div><h2>قطع الغيار والكماليات</h2><p>محركات، كمبيو، بطاريات، شاشات وكماليات.</p></div></div><div class="listing-grid">${items.map(listingCard).join('')}</div></div></section></main>`;
