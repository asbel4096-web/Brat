import { pageTemplate, categoryCard, listingCard, getAllListings, customSelect, activateCustomSelects, applyFavorites, bindFavoriteButtons, t, initLanguageUI } from './common.js';

function statCard(number, label){
  return `<div class="home-stat-card"><strong>${number}</strong><span>${label}</span></div>`;
}

(async ()=>{
  const allListings = await getAllListings(true, { includeHidden: false });
  const latestBase = await applyFavorites(allListings.slice(0, 12));

  const carsCount = allListings.filter(x => String(x.type || '').includes('سيارة')).length;
  const partsCount = allListings.filter(x => String(x.type || '').includes('قطعة') || String(x.type || '').includes('غيار')).length;
  const serviceCount = allListings.filter(x => String(x.type || '').includes('خدمة') || String(x.title || '').includes('ميكانيكي')).length;

  const lang = getLang ? getLang() : 'ar';
  const content = `
  <section class="hero-panel home-hero-upgraded">
    <div class="hero-chips">
      <span class="chip">${t('cat_cars')}</span>
      <span class="chip">${t('cat_parts')}</span>
      <span class="chip">${t('cat_accessories')}</span>
      <span class="chip">${t('cat_service')}</span>
    </div>

    <div class="hero-copy">
      <h3>${t('home_title')}</h3>
      <p>${t('home_subtitle')}</p>
    </div>

    <div class="search-panel home-search-panel">
      <div class="search-grid home-search-grid">
        <label class="field search-wide"><label>${t('home_search')}</label><input id="home-search-input" placeholder="${t('home_search')}"></label>
        ${customSelect(t('ad_type'), t('all_cats'), [t('all_cats'),t('cat_cars'),t('cat_parts'),t('cat_accessories'),t('cat_service')], 'home-cat')}
        ${customSelect(t('city'), t('all_cities'), ['كل المدن','طرابلس','بنغازي','مصراتة','الزاوية','زليتن','صرمان','صبراتة','العجيلات','سبها','سرت','الخمس','درنة','البيضاء','طبرق','أجدابيا','المرج','غريان','نالوت','يفرن','زوارة','بني وليد','ترهونة','رقدالين','الكفرة','هون','ودان','مرزق','غات','أوباري','راس لانوف','البريقة','شحات','سوسة','القبة','توكرة','تاورغاء','مسلاتة','سلوق'], 'home-city')}
        <button class="btn btn-primary btn-block" id="home-search-btn" type="button">${t('search_now')}</button>
      </div>
    </div>

    <div class="home-stat-strip">
      ${statCard(allListings.length, t('stat_total_ads'))}
      ${statCard(carsCount, t('stat_cars'))}
      ${statCard(partsCount, t('stat_parts'))}
      ${statCard(serviceCount, t('stat_services'))}
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div>
        <h3>${t('main_categories')}</h3>
        <p>${t('home_subtitle')}</p>
      </div>
      <a class="btn btn-soft" href="add.html">${t('add_new_ad')}</a>
    </div>
    <div class="category-list home-cats-upgraded">
      ${categoryCard('🚗',t('cat_cars'),'Sedan, SUV, family and imported cars.','cars.html')}
      ${categoryCard('🧩',t('cat_parts'),'Engines, transmissions, doors, lights and batteries.','parts.html')}
      ${categoryCard('🛠️',t('cat_service'),'Mobile mechanic, diagnostics and quick rescue.','services.html')}
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div>
        <h3>${t('latest_ads')}</h3>
        <p>${t('change_search_try')}</p>
      </div>
      <div class="home-list-actions">
        <a class="btn btn-soft" href="favorites.html">${t('favorites')}</a>
        <button class="btn btn-soft" id="reset-home-filter" type="button">${t('reset_filter')}</button>
      </div>
    </div>
    <div class="listing-grid" id="home-listing-grid">${latestBase.map(listingCard).join('')}</div>
  </section>`;

  document.getElementById('app').innerHTML = pageTemplate({active:'home', title:'', subtitle:'', content});
  activateCustomSelects();
  bindFavoriteButtons();
  initLanguageUI();

  const grid = document.getElementById('home-listing-grid');
  const input = document.getElementById('home-search-input');
  const searchBtn = document.getElementById('home-search-btn');
  const resetBtn = document.getElementById('reset-home-filter');

  function readSelectValue(id){
    const trigger = document.querySelector(`[data-select-id="${id}"] .select-trigger`);
    return trigger?.dataset?.value || trigger?.textContent?.trim() || '';
  }

  async function runFilter(){
    const text = String(input?.value || '').trim().toLowerCase();
    const cat = readSelectValue('home-cat');
    const city = readSelectValue('home-city');

    let filtered = [...allListings];

    if (text) {
      filtered = filtered.filter(item =>
        String(item.title || '').toLowerCase().includes(text) ||
        String(item.desc || '').toLowerCase().includes(text) ||
        String(item.type || '').toLowerCase().includes(text) ||
        String(item.city || '').toLowerCase().includes(text)
      );
    }

    if (cat && cat !== 'كل الأقسام') {
      filtered = filtered.filter(item =>
        String(item.type || '').includes(cat) || String(item.title || '').includes(cat)
      );
    }

    if (city && city !== 'كل المدن') {
      filtered = filtered.filter(item => String(item.city || '') === city);
    }

    const prepared = await applyFavorites(filtered.slice(0, 12));
    grid.innerHTML = prepared.length
      ? prepared.map(listingCard).join('')
      : `<div class="empty-card"><div class="empty-icon">🔎</div><h3 class="listing-title">لا توجد نتائج</h3><p class="muted">جرّب تغيير البحث أو اختيار قسم/مدينة أخرى.</p></div>`;
    bindFavoriteButtons();
  }

  searchBtn?.addEventListener('click', runFilter);
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') runFilter();
  });

  document.querySelectorAll('[data-select-id="home-cat"] .select-option, [data-select-id="home-city"] .select-option').forEach(opt => {
    opt.addEventListener('click', () => setTimeout(runFilter, 60));
  });

  resetBtn?.addEventListener('click', async ()=>{
    if (input) input.value = '';
    const catTrig = document.querySelector('[data-select-id="home-cat"] .select-trigger');
    const cityTrig = document.querySelector('[data-select-id="home-city"] .select-trigger');
    if (catTrig) { catTrig.dataset.value = 'كل الأقسام'; catTrig.innerHTML = '<span>كل الأقسام</span>'; }
    if (cityTrig) { cityTrig.dataset.value = 'كل المدن'; cityTrig.innerHTML = '<span>كل المدن</span>'; }
    const prepared = await applyFavorites(allListings.slice(0, 12));
    grid.innerHTML = prepared.map(listingCard).join('');
    bindFavoriteButtons();
  });
})();
