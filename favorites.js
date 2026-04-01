import { pageTemplate, listingCard, getFavoriteListings, bindFavoriteButtons, authGateCard, waitForAuthReady, getCurrentUser } from './common.js';

async function render(){
  await waitForAuthReady();
  if (!getCurrentUser()) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'account',
      title:'المفضلة',
      subtitle:'احفظ الإعلانات التي أعجبتك للرجوع إليها لاحقًا.',
      content: authGateCard('سجل دخولك حتى تظهر لك مفضلتك الخاصة على حسابك.')
    });
    return;
  }

  const favorites = await getFavoriteListings();
  const content = `
    <section class="section">
      <div class="section-head">
        <div>
          <h3>إعلاناتي المفضلة</h3>
          <p>كل إعلان تضغط عليه بالقلب يُحفظ هنا على حسابك.</p>
        </div>
      </div>
      ${favorites.length
        ? `<div class="listing-grid">${favorites.map(listingCard).join('')}</div>`
        : `<div class="empty-card"><div class="empty-icon">♥</div><h3 class="listing-title">لا توجد مفضلة بعد</h3><p class="muted">اضغط على زر القلب في أي إعلان ليظهر هنا مباشرة.</p><a class="btn btn-primary" href="index.html">تصفح الإعلانات</a></div>`
      }
    </section>`;
  document.getElementById('app').innerHTML = pageTemplate({active:'account', title:'المفضلة', subtitle:'قائمة الإعلانات التي حفظتها على حسابك الحقيقي.', content});
  bindFavoriteButtons();
}
render();
