import { bootCommon } from './common.js';
bootCommon('messages');
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="page-head"><div class="container">
    <h2 class="page-title">دردشاتي</h2>
    <p class="page-sub">رسائلك مع البائعين والفنيين.</p>
  </div></section>
  <section class="section"><div class="container">
    <div class="list-card">
      <div class="list-row"><span>ورشة الفحص السريع</span><span>اليوم</span></div>
      <div class="list-row"><span>معرض سوناتا ليبيا</span><span>أمس</span></div>
      <div class="list-row"><span>مخزن قطع أوبتيما</span><span>أمس</span></div>
    </div>
  </div></section>
</main>`;