import { boot, getListings, listingCard, emptyState } from './common.js';
boot('home');
const items = (await getListings()).filter(x=>x.type==='سيارة');
document.getElementById('app').innerHTML = `<main class="page"><section class="section"><div class="container"><div class="section-head"><div><h2>السيارات</h2><p>عرض إعلانات السيارات ببطاقات حديثة ومرتبة.</p></div><a class="btn" href="add.html">أضف سيارة</a></div>${items.length ? `<div class="listing-grid">${items.map(listingCard).join('')}</div>` : emptyState({title:'لا توجد سيارات بعد',text:'ابدأ بإضافة أول إعلان سيارة.',cta:'أضف سيارة'})}</div></section></main>`;
