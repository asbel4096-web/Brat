import { qs, brandShell } from './common.js';

const content = `
  <section class="section">
    <div class="section-head"><div><h3>حسابي</h3><p>واجهة أنظف ومرتبة لإدارة الحساب والإعلانات.</p></div></div>

    <div class="content-card">
      <div class="brandbar" style="grid-template-columns:90px 1fr">
        <div class="logo-box" style="width:90px;height:90px">Y</div>
        <div class="brand-copy">
          <h1 style="font-size:46px">يونس البراتشو</h1>
          <div class="en">knkn2229@yahoo.com</div>
          <p>حساب مفعل • Firebase Auth</p>
        </div>
      </div>

      <div class="quick-actions" style="margin-top:18px">
        <a class="quick-card primary" href="my-ads.html"><span class="icon">▤</span><span>إدارة إعلاناتي</span></a>
        <a class="quick-card" href="add.html"><span class="icon">＋</span><span>إضافة إعلان</span></a>
        <a class="quick-card" href="settings.html"><span class="icon">⚙️</span><span>الإعدادات</span></a>
        <a class="quick-card" href="#"><span class="icon">⎋</span><span>تسجيل الخروج</span></a>
      </div>
    </div>
  </section>
`;

qs('#app').innerHTML = brandShell('account', content);
