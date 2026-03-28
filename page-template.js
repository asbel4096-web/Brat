import {bootCommon, injectFrame, seedListings, listingCard} from './common.js';
bootCommon();
const page=document.body.dataset.page||'cars';
injectFrame(page);
const map={cars:['car','السيارات','سيارات للبيع ومركبات'],parts:['part','قطع الغيار','قطع سيارات وكماليات'],services:['service','الميكانيكي المتنقل','خدمات متنقلة وفنيون']};
const [type,title,sub]=map[page];
document.getElementById('app').innerHTML=`<section class="page"><div class="container"><div class="section-head"><div><h2>${title}</h2><p>${sub}</p></div><a class="btn" href="add.html">أضف إعلان</a></div><div class="cards">${seedListings.filter(x=>x.type===type).map(listingCard).join('')}</div></div></section>`;
