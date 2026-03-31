import { boot, listings, listingCard } from './common.js';
boot('home');
const items = listings.filter(x=>x.type==='خدمة');
document.getElementById('app').innerHTML = `<main class="page"><section class="section"><div class="container"><div class="section-head"><div><h2>الميكانيكي المتنقل</h2><p>خدمات متنقلة، فحص كمبيوتر، كهرباء خفيفة ومساعدة سريعة.</p></div></div><div class="listing-grid">${items.map(listingCard).join('')}</div></div></section></main>`;
