import { bootCommon, seedListings, formatPrice } from './common.js';
bootCommon('myads');
document.getElementById('app').innerHTML = `
<main class="page">
  <section class="page-head"><div class="container">
    <h2 class="page-title">إعلاناتي</h2>
    <p class="page-sub">متابعة الإعلانات المنشورة والمعلقة بمظهر فاخر.</p>
  </div></section>
  <section class="section"><div class="container">
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-num">${seedListings.length}</div><div class="stat-label">كل الإعلانات</div></div>
      <div class="stat-card"><div class="stat-num">${seedListings.filter(x=>x.status==='approved').length}</div><div class="stat-label">منشورة</div></div>
      <div class="stat-card"><div class="stat-num">${seedListings.filter(x=>x.status==='pending').length}</div><div class="stat-label">قيد المراجعة</div></div>
      <div class="stat-card"><div class="stat-num">2</div><div class="stat-label">مسودات</div></div>
    </div>
    <div class="ads-list">
      ${seedListings.map(item => `
        <article class="ad-manage-card">
          <div>
            <div class="manage-title">${item.title}</div>
            <div class="manage-meta">${item.city} • ${item.year} • ${item.mileage}</div>
            <div class="manage-price">${formatPrice(item.price)}</div>
          </div>
          <div class="manage-side">
            <span class="status-pill ${item.status==='approved' ? 'approved' : 'pending'}">${item.status==='approved' ? 'منشور' : 'قيد المراجعة'}</span>
            <div class="manage-actions">
              <a class="soft-mini" href="details.html">عرض</a>
              <a class="soft-mini" href="add.html">تعديل</a>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  </div></section>
</main>`;