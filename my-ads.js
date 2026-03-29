import { pageTemplate, listingCard, listings } from './common.js';
const content = `
<section class="section">
  <button class="btn btn-primary btn-block" onclick="location.href='add.html'">إضافة إعلان</button>
</section>
<section class="section">
  <div class="listing-grid">${listings.map(listingCard).join('')}</div>
</section>`;
document.getElementById('app').innerHTML = pageTemplate({active:'ads', title:'إعلاناتي', subtitle:'كل الإعلانات التي أضفتها المعلن من النموذج الجديد.', content});
