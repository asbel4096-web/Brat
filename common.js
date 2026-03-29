const STORAGE_KEY = 'bratsho_ads_v1';

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
    phone: '0910000000',
    whatsapp: '218910000000',
    desc: 'فل رقم 1، بوش أصلي، صالون ممتاز، جاهزة بدون مصاريف.',
    cover: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'],
    createdAt: 'الآن'
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
    phone: '0910000000',
    whatsapp: '218910000000',
    desc: 'كمبيو نظيف ومجرب، مناسب لعدة فئات، جاهز للتركيب.',
    cover: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80'],
    createdAt: 'الآن'
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
    phone: '0910000000',
    whatsapp: '218910000000',
    desc: 'فحص أعطال، كهرباء خفيفة، خدمة سريعة داخل طرابلس.',
    cover: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80'],
    createdAt: 'الآن'
  }
];

export const messages = [
  {name:'محمد', initial:'م', unread:2, time:'منذ 5 دقائق', text:'السلام عليكم، السيارة موجودة؟'},
  {name:'أحمد', initial:'أ', unread:0, time:'منذ 20 دقيقة', text:'نبي تفاصيل أكثر على القطعة'},
  {name:'سالم', initial:'س', unread:1, time:'منذ ساعة', text:'ممكن رقم الواتساب؟'}
];

export function price(v){
  const n = Number(v || 0);
  return n.toLocaleString('en-US') + ' د.ل';
}

export function safeText(value=''){
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function normalizeWhatsapp(raw=''){
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('218')) return digits;
  if (digits.startsWith('0')) return '218' + digits.slice(1);
  return digits;
}

export function makeMapsUrl(city=''){
  const q = encodeURIComponent(city || 'ليبيا');
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function getStorage(){
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function setStorage(items){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getUserListings(){
  return getStorage().sort((a,b)=> Number(b.createdTs || 0) - Number(a.createdTs || 0));
}

export function getAllListings(){
  return [...getUserListings(), ...listings];
}

export function detailById(id){
  return getAllListings().find(x=>String(x.id)===String(id)) || getAllListings()[0];
}

export function saveListing(data){
  const items = getUserListings();
  items.unshift(data);
  setStorage(items);
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
  const wa = normalizeWhatsapp(item.whatsapp || item.phone);
  const phone = String(item.phone || '').replace(/[^\d+]/g,'');
  const whatsappHref = wa ? `https://wa.me/${wa}` : `https://wa.me/218910000000`;
  const phoneHref = phone ? `tel:${phone}` : `tel:+218910000000`;
  return `
  <article class="listing-card">
    <a class="listing-image" href="details.html?id=${safeText(item.id)}">
      <img src="${safeText(item.cover)}" alt="${safeText(item.title)}">
      <span class="badge dark">${safeText(item.type)}</span>
    </a>
    <div class="listing-body">
      <div class="listing-price">${price(item.price)}</div>
      <h3 class="listing-title"><a href="details.html?id=${safeText(item.id)}">${safeText(item.title)}</a></h3>
      <p class="listing-desc">${safeText(item.desc)}</p>
      <div class="listing-meta">
        <span>${safeText(item.city)}</span>
        <span>${safeText(item.year || '')}</span>
        <span>${safeText(item.km || '')}</span>
      </div>
      <div class="listing-actions">
        <a class="btn btn-primary" href="details.html?id=${safeText(item.id)}">عرض</a>
        <a class="btn btn-soft" target="_blank" href="${whatsappHref}">واتساب</a>
        <a class="icon-btn" href="${phoneHref}">☎</a>
      </div>
    </div>
  </article>`;
}

export function categoryCard(icon, title, desc, href){
  return `<a class="category-card" href="${href}"><i>${icon}</i><div><h3>${title}</h3><p>${desc}</p></div></a>`;
}

export function customSelect(label, selected, items, id){
  const options = items.map((item, idx)=>`
    <button type="button" class="option ${item===selected || (idx===0 && !selected)?'is-selected':''}" data-value="${item}">${item}</button>`).join('');
  return `
    <div class="custom-select" data-select="${id}">
      <label>${label}</label>
      <button type="button" class="select-trigger"><span>${selected}</span><i>⌄</i></button>
      <input type="hidden" name="${id}" value="${selected}">
      <div class="select-menu">${options}</div>
    </div>`;
}

export function activateCustomSelects(root=document){
  root.querySelectorAll('.custom-select').forEach(select=>{
    const trigger = select.querySelector('.select-trigger');
    const menu = select.querySelector('.select-menu');
    const hidden = select.querySelector('input[type="hidden"]');
    if (select.dataset.bound === '1') return;
    select.dataset.bound = '1';
    trigger?.addEventListener('click', e=>{
      e.stopPropagation();
      root.querySelectorAll('.custom-select.is-open').forEach(other=>{ if(other!==select) other.classList.remove('is-open'); });
      select.classList.toggle('is-open');
    });
    menu?.querySelectorAll('.option').forEach(opt=>{
      opt.addEventListener('click', ()=>{
        menu.querySelectorAll('.option').forEach(o=>o.classList.remove('is-selected'));
        opt.classList.add('is-selected');
        const value = opt.dataset.value;
        trigger.querySelector('span').textContent = value;
        if (hidden) hidden.value = value;
        select.classList.remove('is-open');
      });
    });
  });
  if (!document.body.dataset.selectGlobalBound) {
    document.body.dataset.selectGlobalBound = '1';
    document.addEventListener('click', ()=>{
      document.querySelectorAll('.custom-select.is-open').forEach(s=>s.classList.remove('is-open'));
    });
  }
}

export function fileToDataUrl(file, maxW = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatRelativeArabic(ts){
  const diff = Math.max(0, Date.now() - Number(ts || 0));
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} يوم`;
}
