import { qs, brandShell, listingCard, demoItems } from './common.js';
const content = `
  <section class="section">
    <div class="section-head"><div><h3>المفضلة</h3><p>إعلاناتك المحفوظة بشكل مرتب وواضح.</p></div></div>
    <div class="listing-grid">${demoItems.map(listingCard).join('')}</div>
  </section>
`;
qs('#app').innerHTML = brandShell('home', content);
