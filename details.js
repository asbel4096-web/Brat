import { bootCommon, seedListings } from './common.js';
bootCommon('home');
const item = seedListings[0];
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section"><div class="container">
    <div class="ad-card">
      <div class="ad-image" style="height:340px;background-image:url('${item.image}')"></div>
      <div class="ad-body">
        <span class="badge">سيارة</span>
        <div class="price">${Number(item.price).toLocaleString('en-US')} د.ل</div>
        <div class="title">${item.title}</div>
        <div class="meta"><span>${item.city}</span><span>${item.year}</span><span>${item.mileage}</span></div>
        <div class="desc">${item.desc}</div>
      </div>
    </div>
  </div></section>
</main>`;