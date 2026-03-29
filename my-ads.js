import { boot } from './common.js';
boot('myads');
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>إعلاناتي</h2>
          <p>كل الإعلانات التي أضفتها المعلن من النموذج الجديد.</p>
        </div>
      </div>

      <a class="btn full" href="add.html" style="margin-bottom:14px">إضافة إعلان</a>

      <div class="profile-card" style="text-align:center">
        <div style="width:118px;height:118px;border-radius:28px;background:linear-gradient(135deg,var(--primary),var(--primary-2));margin:0 auto 16px;display:grid;place-items:center;color:#fff;font-size:68px;font-weight:900">+</div>
        <h3 style="margin:0 0 10px;font-size:30px">لا توجد إعلانات محفوظة بعد</h3>
        <p class="brand-sub" style="max-width:560px;margin:0 auto 20px">من صفحة إضافة الإعلان تقدر تنشئ إعلان كامل مع حتى 20 صورة.</p>
        <div style="display:flex;justify-content:center">
          <a class="btn" href="add.html">ابدأ بإضافة إعلان</a>
        </div>
      </div>
    </div>
  </section>
</main>
`;
