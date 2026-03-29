export const listings = [
  {
    id: '1',
    type: 'سيارة',
    title: 'هيونداي سوناتا 2016 فل رقم 1',
    price: 37772,
    city: 'طرابلس',
    year: '2016',
    km: '95,000 كم',
    seller: 'يونس البراتشو',
    sellerInitial: 'ي',
    desc: 'فل رقم 1، بوش أصلي، صالون ممتاز، جاهزة بدون مصاريف.',
    cover: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '2',
    type: 'قطعة غيار',
    title: 'كمبيو كيا أوبتيما 2014',
    price: 4500,
    city: 'مصراتة',
    year: '2014',
    km: 'قطعة مستعملة',
    seller: 'مخزن البراتشو',
    sellerInitial: 'ب',
    desc: 'كمبيو نظيف ومجرب، مناسب لعدة فئات، جاهز للتركيب.',
    cover: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '3',
    type: 'خدمة',
    title: 'ميكانيكي متنقل - فحص كمبيوتر',
    price: 120,
    city: 'طرابلس',
    year: 'خدمة',
    km: 'زيارة منزلية',
    seller: 'فني البراتشو',
    sellerInitial: 'ف',
    desc: 'فحص أعطال، كهرباء خفيفة، خدمة سريعة داخل طرابلس.',
    cover: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80'
  }
];

export const messages = [
  {name:'محمد', initial:'م', unread:2, time:'منذ 5 دقائق', text:'السلام عليكم، السيارة موجودة؟'},
  {name:'أحمد', initial:'أ', unread:0, time:'منذ 20 دقيقة', text:'نبي تفاصيل أكثر على القطعة'},
  {name:'سالم', initial:'س', unread:1, time:'منذ ساعة', text:'ممكن رقم الواتساب؟'}
];

export function price(v){
  return Number(v).toLocaleString('en-US') + ' د.ل';
}

export function pageTemplate({active='home', title='', subtitle='', content=''}) {
  return `
  <div class="app-shell">
    <header class="site-header">
      <div class="brand-wrap">
        <div>
          <h1 class="brand-title">براتشو <span>كار</span></h1>
          <p class="brand-sub">سوق سيارات وقطع غيار وخدمات متنقلة بتصميم مرتب وسريع</p>
        </div>
        <div class="logo-box">BC</div>
      </div>
      <div class="top-shortcuts">
        <a class="shortcut-card" href="dashboard.html">حسابي <span>👤</span></a>
        <a class="shortcut-card" href="messages.html">دردشاتي <span>💬</span></a>
        <a class="shortcut-card shortcut-accent" href="add.html">+ أضف إعلان</a>
      </div>
    </header>

    <main class="page-main">
      <section class="page-hero">
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </section>
      ${content}
    </main>

    <nav class="bottom-nav">
      <a href="index.html" class="nav-item ${active==='home'?'is-active':''}"><span>⌂</span><b>الرئيسية</b></a>
      <a href="messages.html" class="nav-item ${active==='messages'?'is-active':''}"><span>◔</span><b>دردشاتي</b></a>
      <a href="add.html" class="nav-item nav-center ${active==='add'?'is-active':''}"><span>＋</span><b>أضف إعلان</b></a>
      <a href="my-ads.html" class="nav-item ${active==='ads'?'is-active':''}"><span>▤</span><b>إعلاناتي</b></a>
      <a href="dashboard.html" class="nav-item ${active==='account'?'is-active':''}"><span>◉</span><b>حسابي</b></a>
    </nav>
  </div>`;
}

export function listingCard(item){
  return `
  <article class="listing-card">
    <a class="listing-image" href="details.html?id=${item.id}">
      <img src="${item.cover}" alt="${item.title}">
      <span class="badge dark">${item.type}</span>
    </a>
    <div class="listing-body">
      <div class="listing-price">${price(item.price)}</div>
      <h3 class="listing-title"><a href="details.html?id=${item.id}">${item.title}</a></h3>
      <p class="listing-desc">${item.desc}</p>
      <div class="listing-meta">
        <span>${item.city}</span>
        <span>${item.year}</span>
        <span>${item.km}</span>
      </div>
      <div class="listing-actions">
        <a class="btn btn-primary" href="details.html?id=${item.id}">عرض</a>
        <a class="btn btn-soft" target="_blank" href="https://wa.me/218910000000">واتساب</a>
        <a class="icon-btn" href="tel:+218910000000">☎</a>
      </div>
    </div>
  </article>`;
}

export function categoryCard(icon, title, desc, href){
  return `<a class="category-card" href="${href}"><i>${icon}</i><div><h3>${title}</h3><p>${desc}</p></div></a>`;
}

export function detailById(id){
  return listings.find(x=>x.id===id) || listings[0];
}

export function customSelect(label, selected, items, id){
  const options = items.map((item, idx)=>`
    <button type="button" class="option ${idx===0?'is-selected':''}" data-value="${item}">${item}</button>`).join('');
  return `
    <div class="custom-select" data-select="${id}">
      <label>${label}</label>
      <button type="button" class="select-trigger"><span>${selected}</span><i>⌄</i></button>
      <div class="select-menu">${options}</div>
    </div>`;
}

export function activateCustomSelects(root=document){
  root.querySelectorAll('.custom-select').forEach(select=>{
    const trigger = select.querySelector('.select-trigger');
    const menu = select.querySelector('.select-menu');
    trigger?.addEventListener('click', e=>{
      e.stopPropagation();
      root.querySelectorAll('.custom-select.is-open').forEach(other=>{ if(other!==select) other.classList.remove('is-open'); });
      select.classList.toggle('is-open');
    });
    menu?.querySelectorAll('.option').forEach(opt=>{
      opt.addEventListener('click', ()=>{
        menu.querySelectorAll('.option').forEach(o=>o.classList.remove('is-selected'));
        opt.classList.add('is-selected');
        trigger.querySelector('span').textContent = opt.dataset.value;
        select.classList.remove('is-open');
      });
    });
  });
  document.addEventListener('click', ()=>{
    root.querySelectorAll('.custom-select.is-open').forEach(s=>s.classList.remove('is-open'));
  });
}
