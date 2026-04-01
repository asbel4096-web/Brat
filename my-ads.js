import { pageTemplate, listingCard, getUserListings, removeListing, updateListingStatus, safeText, authGateCard, waitForAuthReady, getCurrentUser, price, t, initLanguageUI } from './common.js';

function summaryCard(num, label, sublabel='', accent=''){
  return `<div class="myads-stat ${accent}"><strong>${num}</strong><span>${label}</span><small>${sublabel}</small></div>`;
}

function managementBar(item){
  const hidden = (item.status || 'active') === 'hidden';
  return `
    <div class="myads-managebar">
      <a class="btn btn-primary" href="add.html?id=${safeText(item.id)}">تعديل / Edit</a>
      <button class="btn btn-soft js-toggle" data-id="${safeText(item.id)}" data-status="${hidden ? 'active' : 'hidden'}">${hidden ? 'إظهار / Show' : 'إخفاء / Hide'}</button>
      <button class="btn btn-soft js-delete danger" data-id="${safeText(item.id)}">حذف / Delete</button>
    </div>`;
}

function ownerCard(item){
  const hidden = (item.status || 'active') === 'hidden';
  return `
    <article class="surface-card myads-owner-card" data-wrap="${safeText(item.id)}">
      <div class="myads-owner-top">
        <div class="myads-owner-price">${price(item.price)}</div>
        <span class="myads-status ${hidden ? 'is-hidden' : 'is-active'}">${hidden ? 'مخفي' : 'منشور'}</span>
      </div>
      ${listingCard(item)}
      ${managementBar(item)}
    </article>`;
}

async function render(){
  await waitForAuthReady();
  if (!getCurrentUser()) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'ads',
      title:t('my_ads'),
      subtitle:t('my_ads_sub'),
      content: authGateCard('سجل دخولك حتى ترى إعلانات حسابك فقط وتديرها بأمان.')
    });
    return;
  }

  const userAds = await getUserListings(true, { includeHidden: true });
  const activeAds = userAds.filter(x => (x.status || 'active') !== 'hidden');
  const hiddenAds = userAds.filter(x => (x.status || 'active') === 'hidden');

  const listMarkup = userAds.length
    ? `<div class="myads-grid">${userAds.map(ownerCard).join('')}</div>`
    : `<div class="empty-card"><div class="empty-icon">＋</div><h3 class="listing-title">لا توجد إعلانات محفوظة بعد</h3><p class="muted">من صفحة إضافة الإعلان تقدر تنشئ إعلان كامل محفوظ على Firebase.</p><a class="btn btn-primary" href="add.html">ابدأ بإضافة إعلان</a></div>`;

  const content = `
  <section class="section">
    <div class="hero-panel myads-hero">
      <div class="myads-langbar">
        <span>العربية</span>
        <span>English</span>
      </div>
      <div class="section-head myads-head-final">
        <div>
          <h3>إدارة إعلاناتي</h3>
          <p class="myads-en-sub">Manage My Ads</p>
          <p>لوحة أنظف لإدارة إعلاناتك، مع حالة الإعلان وتعديل سريع وإخفاء أو حذف من نفس الصفحة.</p>
        </div>
        <a class="btn btn-soft myads-addbtn" href="add.html">إضافة إعلان جديد / New Ad</a>
      </div>
      <div class="myads-stats">
        ${summaryCard(userAds.length, 'إجمالي الإعلانات', 'Total Ads')}
        ${summaryCard(activeAds.length, 'إعلانات منشورة', 'Published Ads', 'good')}
        ${summaryCard(hiddenAds.length, 'إعلانات مخفية', 'Hidden Ads')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div>
        <h3>قائمة الإعلانات</h3>
        <p class="myads-en-sub">Ads List</p>
        <p>كل إعلان يعرض حالته الحالية مع أدوات الإدارة أسفل البطاقة مباشرة.</p>
      </div>
    </div>
    ${listMarkup}
  </section>`;

  document.getElementById('app').innerHTML = pageTemplate({
    active:'ads',
    title:t('my_ads'),
    subtitle:t('my_ads_sub'),
    content
  });

  document.querySelectorAll('.js-delete').forEach(btn => btn.addEventListener('click', async ()=>{
    const id = btn.dataset.id;
    if (!confirm('هل تريد حذف الإعلان نهائيًا؟')) return;
    btn.disabled = true;
    try {
      await removeListing(id);
      await render();
initLanguageUI();
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
initLanguageUI();
    } catch {
      alert('تعذر تحديث حالة الإعلان.');
      btn.disabled = false;
    }
  }));
}

render();
initLanguageUI();
