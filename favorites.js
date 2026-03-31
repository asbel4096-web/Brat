import { pageTemplate, listingCard, getFavoriteListings, bindFavoriteButtons, authGateCard, waitForAuthReady, getCurrentUser, t, initLanguageUI } from './common.js';

function statCard(num, ar, en, accent=''){
  return `<div class="fav-stat ${accent}"><strong>${num}</strong><span>${ar}</span><small>${en}</small></div>`;
}

async function render(){
  await waitForAuthReady();
  if (!getCurrentUser()) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'account',
      title:t('favorites_title'),
      subtitle:t('favorites_sub'),
      content: authGateCard('سجل دخولك حتى تظهر لك مفضلتك الخاصة على حسابك.')
    });
    return;
  }

  const favorites = await getFavoriteListings();
  const content = `
    <section class="section">
      <div class="hero-panel favorites-hero">
        <div class="favorites-langbar">
          <span>العربية</span>
          <span>English</span>
        </div>
        <div class="section-head favorites-head">
          <div>
            <h3>إعلاناتي المفضلة</h3>
            <p class="favorites-en-sub">My Favorites</p>
            <p>كل إعلان تضغط عليه بالقلب يُحفظ هنا على حسابك ليسهل الرجوع إليه لاحقًا.</p>
          </div>
          <a class="btn btn-soft favorites-browse-btn" href="index.html">تصفح الإعلانات / Browse</a>
        </div>

        <div class="favorites-stats">
          ${statCard(favorites.length, 'عناصر محفوظة', 'Saved Items', 'good')}
          ${statCard(favorites.filter(x => x.type === 'سيارة').length, 'سيارات', 'Cars')}
          ${statCard(favorites.filter(x => x.type === 'قطعة غيار').length, 'قطع غيار', 'Parts')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <h3>قائمة المفضلة</h3>
          <p class="favorites-en-sub dark">Favorites List</p>
          <p>واجهة أوضح للإعلانات المحفوظة مع إمكانية إزالة العنصر من المفضلة مباشرة.</p>
        </div>
      </div>
      ${favorites.length
        ? `<div class="listing-grid favorites-grid">${favorites.map(item => `<div class="surface-card favorites-item">${listingCard(item)}</div>`).join('')}</div>`
        : `<div class="empty-card"><div class="empty-icon">♥</div><h3 class="listing-title">لا توجد مفضلة بعد</h3><p class="muted">اضغط على زر القلب في أي إعلان ليظهر هنا مباشرة.</p><p class="muted">No saved items yet.</p><a class="btn btn-primary" href="index.html">تصفح الإعلانات / Browse Ads</a></div>`
      }
    </section>`;
  document.getElementById('app').innerHTML = pageTemplate({
    active:'account',
    title:t('favorites_title'),
    subtitle:t('favorites_sub'),
    content
  });
  bindFavoriteButtons();
}
render();
initLanguageUI();
