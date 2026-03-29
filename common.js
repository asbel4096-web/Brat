const seedListings = [
  {
    id:'1',
    type:'سيارة',
    title:'هيونداي سوناتا 2016 فل رقم 1',
    price:37772,
    city:'طرابلس',
    meta:'طرابلس • 2016 • 95,000 كم',
    desc:'فل رقم 1، بوش أصلي، صالون ممتاز، جاهزة بدون مصاريف.',
    seller:'يونس البراتشو',
    time:'الآن',
    phone:'0912345678',
    whatsapp:'218912345678',
    map:'https://maps.google.com/?q=Tripoli',
    condition:'ممتازة',
    fuel:'بنزين',
    transmission:'أوتوماتيك',
    engine:'2.0',
    year:'2016',
    mileage:'95,000',
    cover:'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    images:[
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id:'2',
    type:'قطعة غيار',
    title:'كمبيو كيا أوبتيما 2014',
    price:4500,
    city:'مصراتة',
    meta:'مصراتة • 2014 • قطعة مستعملة',
    desc:'كمبيو نظيف ومجرب، مناسب لعدة فئات.',
    seller:'مخزن الغيار',
    time:'منذ ساعة',
    phone:'0920000000',
    whatsapp:'218920000000',
    map:'https://maps.google.com/?q=Misrata',
    condition:'جيدة جدًا',
    fuel:'—',
    transmission:'—',
    engine:'متوافق مع عدة فئات',
    year:'2014',
    mileage:'—',
    cover:'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80',
    images:['https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80']
  },
  {
    id:'3',
    type:'خدمة',
    title:'ميكانيكي متنقل - فحص كمبيوتر',
    price:120,
    city:'طرابلس',
    meta:'طرابلس • خدمة متنقلة • سريع',
    desc:'فحص أعطال، كهرباء خفيفة، خدمة منزلية داخل طرابلس.',
    seller:'فني متنقل',
    time:'منذ 20 دقيقة',
    phone:'0911111111',
    whatsapp:'218911111111',
    map:'https://maps.google.com/?q=Tripoli',
    condition:'متوفر الآن',
    fuel:'—',
    transmission:'—',
    engine:'خدمة ميدانية',
    year:'2026',
    mileage:'—',
    cover:'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80',
    images:['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80']
  }
];

export const chats = [
  {name:'محمد', text:'السلام عليكم، السيارة موجودة؟', time:'منذ 5 دقائق', unread:2},
  {name:'أحمد', text:'نبي تفاصيل أكثر على القطعة', time:'منذ 20 دقيقة', unread:0},
  {name:'سالم', text:'ممكن رقم الواتساب؟', time:'منذ ساعة', unread:1}
];

const DB_NAME = 'bratsho-car-db';
const STORE = 'userListings';

function openDb(){
  return new Promise((resolve,reject)=>{
    const request = indexedDB.open(DB_NAME,1);
    request.onupgradeneeded = ()=>{
      const db = request.result;
      if(!db.objectStoreNames.contains(STORE)){
        db.createObjectStore(STORE,{keyPath:'id'});
      }
    };
    request.onsuccess = ()=>resolve(request.result);
    request.onerror = ()=>reject(request.error);
  });
}

async function readAllUserListings(){
  try{
    const db = await openDb();
    return await new Promise((resolve,reject)=>{
      const tx = db.transaction(STORE,'readonly');
      const store = tx.objectStore(STORE);
      const request = store.getAll();
      request.onsuccess = ()=>resolve(request.result || []);
      request.onerror = ()=>reject(request.error);
    });
  }catch(err){
    console.error('IndexedDB read failed', err);
    return [];
  }
}

export async function saveUserListing(listing){
  const db = await openDb();
  return await new Promise((resolve,reject)=>{
    const tx = db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).put(listing);
    tx.oncomplete = ()=>resolve(listing);
    tx.onerror = ()=>reject(tx.error);
  });
}

export async function getListings(){
  const userListings = await readAllUserListings();
  return [...userListings.sort((a,b)=> new Date(b.createdAt||0)-new Date(a.createdAt||0)), ...seedListings];
}

export async function getListingById(id){
  const all = await getListings();
  return all.find(x=>x.id===id) || all[0];
}

export async function getUserListings(){
  const all = await readAllUserListings();
  return all.sort((a,b)=> new Date(b.createdAt||0)-new Date(a.createdAt||0));
}

export function price(v){
  return Number(v||0).toLocaleString('en-US') + ' د.ل';
}

export function boot(active='home'){
  mountShell(active);
}

function navLink(href,label,icon,activeKey,key){
  return `<li><a href="${href}" class="${activeKey===key?'active':''}"><span class="nav-ico">${icon}</span><span>${label}</span></a></li>`;
}

export function mountShell(active='home'){
  if(document.querySelector('.topbar')) return;

  const top = document.createElement('header');
  top.className = 'topbar';
  top.innerHTML = `
    <div class="container topbar-inner">
      <div class="brand">
        <a href="index.html" class="logo">BC</a>
        <div>
          <h1 class="brand-title"><span>براتشو</span> كار</h1>
          <p class="brand-sub">سوق سيارات وقطع غيار وخدمات متنقلة بتصميم مرتب وسريع</p>
        </div>
      </div>
      <div class="top-actions">
        <a class="btn-accent" href="add.html">＋ أضف إعلان</a>
        <a class="btn-soft" href="messages.html">💬 دردشاتي</a>
        <a class="btn-soft" href="dashboard.html">👤 حسابي</a>
      </div>
    </div>
  `;
  document.body.prepend(top);

  const bottom = document.createElement('nav');
  bottom.className = 'bottom-nav';
  bottom.innerHTML = `
    <ul class="bottom-grid">
      ${navLink('index.html','الرئيسية','⌂',active,'home')}
      ${navLink('messages.html','دردشاتي','◔',active,'messages')}
      <li class="nav-center">
        <a href="add.html" class="nav-add ${active==='add'?'active':''}">
          <span class="nav-add-circle">+</span>
          <span>أضف إعلان</span>
        </a>
      </li>
      ${navLink('my-ads.html','إعلاناتي','▤',active,'myads')}
      ${navLink('dashboard.html','حسابي','◉',active,'dashboard')}
    </ul>
  `;
  document.body.append(bottom);
}

function sellerInitial(name='ب'){
  return String(name).trim().charAt(0) || 'ب';
}

function normalizePhone(phone=''){
  const digits = String(phone).replace(/\D/g,'');
  if(!digits) return '0912345678';
  if(digits.startsWith('218')) return digits;
  if(digits.startsWith('0')) return '218' + digits.slice(1);
  return digits;
}

export function listingCard(item){
  return `
    <article class="listing-card card">
      <a class="listing-media" href="details.html?id=${item.id}" style="background-image:url('${item.cover}')">
        <span class="listing-fav">♡</span>
        <span class="listing-type-chip">${item.type}</span>
        <span class="listing-image-count">${(item.images||[]).length} صورة</span>
      </a>

      <div class="listing-body">
        <div class="listing-topline">
          <a href="details.html?id=${item.id}"><h3 class="listing-title">${item.title}</h3></a>
          <div class="listing-price">${price(item.price)}</div>
        </div>

        <p class="listing-desc">${item.desc}</p>

        <div class="listing-meta-grid">
          <div class="meta-item">📍 <b>${item.city}</b></div>
          <div class="meta-item">🕒 <span>${item.time || 'الآن'}</span></div>
          <div class="meta-item">🏷️ <span>${item.type}</span></div>
        </div>

        <div class="seller-row">
          <div class="seller-info">
            <div class="avatar">${sellerInitial(item.seller)}</div>
            <div>
              <div class="seller-name">${item.seller || 'صاحب الإعلان'}</div>
              <div class="seller-sub">${item.meta || `${item.city} • ${item.year || ''}`}</div>
            </div>
          </div>

          <div class="listing-actions">
            <a class="action-mini" href="https://wa.me/${normalizePhone(item.whatsapp || item.phone)}" target="_blank" rel="noreferrer">واتس</a>
            <a class="action-mini" href="tel:${item.phone || '0912345678'}">اتصال</a>
            <a class="btn" href="details.html?id=${item.id}">عرض</a>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function emptyState({title='لا توجد بيانات', text='أضف أول إعلان ليظهر هنا.', cta='أضف إعلان', href='add.html'}={}){
  return `
    <div class="empty card">
      <div class="empty-icon">＋</div>
      <h3>${title}</h3>
      <p>${text}</p>
      <a class="btn" href="${href}">${cta}</a>
    </div>
  `;
}

export async function fileToDataUrl(file, maxWidth=1280, quality=.78){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = ()=>{
      const img = new Image();
      img.onload = ()=>{
        const ratio = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
