import { boot, getListings, listingCard, emptyState } from './common.js';
boot('home');
const items = (await getListings()).filter(x=>x.type==='خدمة');
document.getElementById('app').innerHTML = `<main class="page"><section class="section"><div class="container"><div class="section-head"><div><h2>الميكانيكي المتنقل</h2><p>خدمات متنقلة، فحص كمبيوتر، كهرباء خفيفة ومساعدة سريعة.</p></div><a class="btn" href="add.html">أضف خدمة</a></div>${items.length ? `<div class="listing-grid">${items.map(listingCard).join('')}</div>` : emptyState({title:'لا توجد خدمات بعد',text:'أضف إعلان خدمة متنقلة الآن.',cta:'أضف خدمة'})}</div></section></main>`;
