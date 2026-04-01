import { bootCommon, seedListings, adCard } from './common.js';
const page = document.body.dataset.page;
bootCommon(page);

const map = {cars:'car', parts:'part', services:'service'};
const titleMap = {cars:'السيارات', parts:'قطع الغيار', services:'الميكانيكي المتنقل'};
const subMap = {
  cars:'سيارات للبيع، وارد حديث، وعروض مميزة.',
  parts:'محركات، كمبيو، بطاريات، جنوط، وأبواب.',
  services:'خدمات فحص وصيانة متنقلة داخل المدن.'
};

const items = seedListings.filter(x=>x.type===map[page]);
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="page-head">
    <div class="container">
      <h2 class="page-title">${titleMap[page]}</h2>
      <p class="page-sub">${subMap[page]}</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="ads-grid">${items.map(adCard).join('')}</div>
    </div>
  </section>
</main>`;