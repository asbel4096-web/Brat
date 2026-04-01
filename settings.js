import { pageTemplate } from './common.js';
const content = `
<section class="section">
  <div class="surface-card">
    <div class="table-list">
      <div class="table-row"><span>الدولة</span><span>ليبيا</span></div>
      <div class="table-row"><span>العملة</span><span>دينار</span></div>
      <div class="table-row"><span>الوضع الليلي</span><span>تبديل</span></div>
      <div class="table-row"><span>إعدادات الحساب</span><span>←</span></div>
      <div class="table-row"><span>المساعدة</span><span>←</span></div>
      <div class="table-row"><span>عن التطبيق</span><span>براتشو كار</span></div>
    </div>
  </div>
</section>`;
document.getElementById('app').innerHTML = pageTemplate({active:'account', title:'الإعدادات', subtitle:'الوضع، الدولة، العملة، وإعدادات الحساب.', content});
