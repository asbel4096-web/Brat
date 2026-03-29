import { boot, getUserListings, listingCard, emptyState } from './common.js';
boot('myads');
const listings = await getUserListings();
document.getElementById('app').innerHTML = `<main class="page"><section class="section"><div class="container"><div class="section-head"><div><h2>إعلاناتي</h2><p>كل الإعلانات التي أضافها المعلن من النموذج الجديد.</p></div><a class="btn" href="add.html">إضافة إعلان</a></div>${listings.length ? `<div class="listing-grid">${listings.map(listingCard).join('')}</div>` : emptyState({title:'لا توجد إعلانات محفوظة بعد',text:'من صفحة إضافة الإعلان تقدر تنشئ إعلان كامل مع حتى 20 صورة.',cta:'ابدأ بإضافة إعلان'})}</div></section></main>`;
