import { pageTemplate, listingCard, getUserListings, removeListing, updateListingStatus, safeText, authGateCard, waitForAuthReady, getCurrentUser } from './common.js';

function managementBar(item){
  const hidden = (item.status || 'active') === 'hidden';
  return `
    <div class="listing-actions" style="padding:0 12px 14px">
      <a class="btn btn-primary" href="add.html?id=${safeText(item.id)}">تعديل</a>
      <button class="btn btn-soft js-toggle" data-id="${safeText(item.id)}" data-status="${hidden ? 'active' : 'hidden'}">${hidden ? 'إظهار' : 'إخفاء'}</button>
      <button class="btn btn-soft js-delete" data-id="${safeText(item.id)}" style="color:#b42318">حذف</button>
    </div>`;
}

async function render(){
  await waitForAuthReady();
  if (!getCurrentUser()) {
    document.getElementById('app').innerHTML = pageTemplate({active:'ads', title:'إعلاناتي', subtitle:'كل الإعلانات التي أضفتها من النموذج الجديد.', content: authGateCard('سجل دخولك حتى ترى إعلانات حسابك فقط وتديرها بأمان.')});
    return;
  }
  const userAds = await getUserListings(true, { includeHidden: true });
  const listMarkup = userAds.length
    ? `<div class="listing-grid">${userAds.map(item => `<div class="surface-card" data-wrap="${safeText(item.id)}">${listingCard(item)}${managementBar(item)}</div>`).join('')}</div>`
    : `<div class="empty-card"><div class="empty-icon">＋</div><h3 class="listing-title">لا توجد إعلانات محفوظة بعد</h3><p class="muted">من صفحة إضافة الإعلان تقدر تنشئ إعلان كامل محفوظ على Firebase.</p><a class="btn btn-primary" href="add.html">ابدأ بإضافة إعلان</a></div>`;
  const content = `
  <section class="section">
    <button class="btn btn-primary btn-block" onclick="location.href='add.html'">إضافة إعلان</button>
  </section>
  <section class="section">
    <div class="section-head"><div><h3>إدارة الإعلانات</h3><p>تعديل، حذف، وإخفاء أو إظهار الإعلان من نفس الصفحة.</p></div></div>
    ${listMarkup}
  </section>`;
  document.getElementById('app').innerHTML = pageTemplate({active:'ads', title:'إعلاناتي', subtitle:'هذه الصفحة تعرض إعلانات الحساب الحالي فقط.', content});

  document.querySelectorAll('.js-delete').forEach(btn => btn.addEventListener('click', async ()=>{
    const id = btn.dataset.id;
    if (!confirm('هل تريد حذف الإعلان نهائيًا؟')) return;
    btn.disabled = true;
    try {
      await removeListing(id);
      await render();
    } catch {
      alert('تعذر حذف الإعلان.');
      btn.disabled = false;
    }
  }));

  document.querySelectorAll('.js-toggle').forEach(btn => btn.addEventListener('click', async ()=>{
    const id = btn.dataset.id;
    const status = btn.dataset.status;
    btn.disabled = true;
    try {
      await updateListingStatus(id, status);
      await render();
    } catch {
      alert('تعذر تحديث حالة الإعلان.');
      btn.disabled = false;
    }
  }));
}

render();
