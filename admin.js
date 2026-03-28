import { bootCommon } from './common.js';
bootCommon('dashboard');
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="page-head"><div class="container">
    <h2 class="page-title">لوحة الإدارة</h2>
    <p class="page-sub">نسخة واجهة فقط لإدارة الإعلانات.</p>
  </div></section>
  <section class="section"><div class="container">
    <div class="list-card">
      <div class="list-row"><span>إعلان سوناتا 2016</span><span>موافقة / رفض</span></div>
      <div class="list-row"><span>كمبيو أوبتيما 2014</span><span>موافقة / رفض</span></div>
      <div class="list-row"><span>ميكانيكي متنقل</span><span>موافقة / رفض</span></div>
    </div>
  </div></section>
</main>`;