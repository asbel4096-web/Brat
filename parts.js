import { boot, getListings, listingCard, emptyState } from './common.js';
boot('home');
const items = (await getListings()).filter(x=>x.type==='قطعة غيار');
document.getElementById('app').innerHTML = `<main class="page"><section class="section"><div class="container"><div class="section-head"><div><h2>قطع الغيار والكماليات</h2><p>محركات، كمبيو، بطاريات، شاشات وكماليات.</p></div><a class="btn" href="add.html">أضف قطعة</a></div>${items.length ? `<div class="listing-grid">${items.map(listingCard).join('')}</div>` : emptyState({title:'لا توجد قطع غيار بعد',text:'أضف أول إعلان قطعة غيار أو كماليات.',cta:'أضف إعلان'})}</div></section></main>`;
