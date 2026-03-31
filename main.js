import { pageTemplate, categoryCard, listingCard, getAllListings, customSelect, activateCustomSelects, applyFavorites, bindFavoriteButtons } from './common.js';

function statCard(number, label){
  return `<div class="home-stat-card"><strong>${number}</strong><span>${label}</span></div>`;
}

(async ()=>{
  const allListings = await getAllListings(true, { includeHidden: false });
  const latestBase = await applyFavorites(allListings.slice(0, 12));

  const carsCount = allListings.filter(x => String(x.type || '').includes('سيارة')).length;
  const partsCount = allListings.filter(x => String(x.type || '').includes('قطعة') || String(x.type || '').includes('غيار')).length;
  const serviceCount = allListings.filter(x => String(x.type || '').includes('خدمة') || String(x.title || '').includes('ميكانيكي')).length;

  const content = `
  <section class="hero-panel home-hero-upgraded">
    <div class="hero-chips">
      <span class="chip">سيارات</span>
      <span class="chip">قطع غيار</span>
      <span class="chip">كماليات</span>
      <span class="chip">ميكانيكي متنقل</span>
    </div>

    <div class="hero-copy">
      <h3>براتشو كار بشكل أنظف وأوضح وتجربة أسرع</h3>
      <p>بطاقات أوضح، بحث أسرع، وفرز أسهل بين مدن ليبيا حتى يصل الزبون للإعلان المناسب بسرعة.</p>
    </div>

    <div class="search-panel home-search-panel">
      <div class="search-grid home-search-grid">
        <label class="field search-wide"><label>بحث سريع</label><input id="home-search-input" placeholder="ابحث: أزيرا / سوناتا / كمبيو / ميكانيكي"></label>
        ${customSelect('القسم', 'كل الأقسام', ['كل الأقسام','سيارات','قطع غيار','كماليات','خدمة'], 'home-cat')}
        ${customSelect('المدينة', 'كل المدن', ['كل المدن','طرابلس','بنغازي','مصراتة','الزاوية','زليتن','صرمان','صبراتة','العجيلات','سبها','سرت','الخمس','درنة','البيضاء','طبرق','أجدابيا','المرج','غريان','نالوت','يفرن','زوارة','بني وليد','ترهونة','رقدالين','الكفرة','هون','ودان','مرزق','غات','أوباري','راس لانوف','البريقة','شحات','سوسة','القبة','توكرة','تاورغاء','مسلاتة','سلوق'], 'home-city')}
        <button class="btn btn-primary btn-block" id="home-search-btn" type="button">بحث الآن</button>
      </div>
    </div>

    <div class="home-stat-strip">
      ${statCard(allListings.length, 'إجمالي الإعلانات')}
      ${statCard(carsCount, 'سيارات')}
      ${statCard(partsCount, 'قطع غيار')}
      ${statCard(serviceCount, 'خدمات')}
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div>
        <h3>الأقسام الرئيسية</h3>
        <p>تنقل أسرع بين السيارات وقطع الغيار والخدمات مع شكل أبسط وأوضح.</p>
      </div>
      <a class="btn btn-soft" href="add.html">إضافة إعلان</a>
    </div>
    <div class="category-list home-cats-upgraded">
      ${categoryCard('🚗','السيارات','سيدان، SUV، عائلية، اقتصادية، ووارد حديث.','cars.html')}
      ${categoryCard('🧩','قطع الغيار','محركات، كمبيو، أبواب، فوانيس، بطاريات، وشاشات.','parts.html')}
      ${categoryCard('🛠️','الخدمات','ميكانيكي متنقل، كهرباء، قطر، وإنقاذ سريع.','services.html')}
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div>
        <h3>أحدث الإعلانات</h3>
        <p>كل إعلان منشور يظهر هنا مباشرة من Firebase، مع فلترة أسرع داخل الصفحة الرئيسية.</p>
      </div>
      <div class="home-list-actions">
        <a class="btn btn-soft" href="favorites.html">المفضلة</a>
        <button class="btn btn-soft" id="reset-home-filter" type="button">إعادة التصفية</button>
      </div>
    </div>
    <div class="listing-grid" id="home-listing-grid">${latestBase.map(listingCard).join('')}</div>
  </section>`;

  document.getElementById('app').innerHTML = pageTemplate({active:'home', title:'', subtitle:'', content});
  activateCustomSelects();
  bindFavoriteButtons();

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
