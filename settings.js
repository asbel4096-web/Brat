import { qs, brandShell } from './common.js';

const content = `
  <section class="section">
    <div class="section-head"><div><h3>إعدادات التطبيق</h3><p>مكان واحد للغة والمظهر وبعض الخيارات الأساسية.</p></div></div>
    <div class="settings-grid">
      <div class="item">
        <h3 style="margin-top:0">اللغة</h3>
        <p style="color:var(--muted)">اللغة الحالية: العربية</p>
        <div class="switch-row">
          <button class="btn btn-primary">العربية</button>
          <button class="btn btn-soft">English</button>
        </div>
      </div>
      <div class="item">
        <h3 style="margin-top:0">المظهر</h3>
        <p style="color:var(--muted)">الوضع الحالي: النهاري</p>
        <div class="switch-row">
          <button class="btn btn-primary">الوضع النهاري</button>
          <button class="btn btn-soft">الوضع الليلي</button>
        </div>
      </div>
    </div>
  </section>
`;
qs('#app').innerHTML = brandShell('account', content);
