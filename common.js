export const listings = [
  {id:'1',type:'سيارة',title:'هيونداي سوناتا 2016 فل رقم 1',price:37772,city:'طرابلس',meta:'طرابلس • 2016 • 95,000 كم',desc:'فل رقم 1، بوش أصلي، صالون ممتاز، جاهزة بدون مصاريف.',seller:'يونس البراتشو',time:'الآن',cover:'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',images:['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80']},
  {id:'2',type:'قطعة غيار',title:'كمبيو كيا أوبتيما 2014',price:4500,city:'مصراتة',meta:'مصراتة • 2014 • قطعة مستعملة',desc:'كمبيو نظيف ومجرب، مناسب لعدة فئات.',seller:'مخزن الغيار',time:'منذ ساعة',cover:'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80',images:['https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80']},
  {id:'3',type:'خدمة',title:'ميكانيكي متنقل - فحص كمبيوتر',price:120,city:'طرابلس',meta:'طرابلس • خدمة متنقلة • سريع',desc:'فحص أعطال، كهرباء خفيفة، خدمة منزلية داخل طرابلس.',seller:'فني متنقل',time:'منذ 20 دقيقة',cover:'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80',images:['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80']}
];
export const chats = [
  {name:'محمد', text:'السلام عليكم، السيارة موجودة؟', time:'منذ 5 دقائق', unread:2},
  {name:'أحمد', text:'نبي تفاصيل أكثر على القطعة', time:'منذ 20 دقيقة', unread:0},
  {name:'سالم', text:'ممكن رقم الواتساب؟', time:'منذ ساعة', unread:1}
];
export function price(v){ return Number(v).toLocaleString('en-US') + ' د.ل'; }
export function boot(active='home'){ mountShell(active); }
function navLink(href,label,icon,activeKey,key){ return `<li><a href="${href}" class="${activeKey===key?'active':''}"><span>${icon}</span><span>${label}</span></a></li>`; }
export function mountShell(active='home'){
  if(document.querySelector('.topbar')) return;
  const top = document.createElement('header');
  top.className = 'topbar';
  top.innerHTML = `
    <div class="container topbar-inner">
      <div class="brand">
        <div class="logo">BC</div>
        <div>
          <h1 class="brand-title"><span>براتشو</span> كار</h1>
          <p class="brand-sub">سيارات، قطع غيار، كماليات، ميكانيكي متنقل</p>
        </div>
      </div>
      <div class="top-actions">
        <a class="btn-accent" href="add.html">أضف إعلان</a>
        <a class="btn-soft" href="messages.html">دردشاتي</a>
        <a class="btn-soft" href="dashboard.html">حسابي</a>
      </div>
    </div>`;
  document.body.prepend(top);
  const bottom = document.createElement('nav');
  bottom.className = 'bottom-nav';
  bottom.innerHTML = `
    <ul class="bottom-grid">
      ${navLink('index.html','الرئيسية','⌂',active,'home')}
      ${navLink('messages.html','دردشاتي','◔',active,'messages')}
      <li class="nav-center"><a href="add.html" class="nav-add ${active==='add'?'active':''}"><span class="nav-add-circle">+</span><span>أضف إعلان</span></a></li>
      ${navLink('my-ads.html','إعلاناتي','▤',active,'myads')}
      ${navLink('dashboard.html','حسابي','◉',active,'dashboard')}
    </ul>`;
  document.body.append(bottom);
}
function sellerInitial(name='ب'){ return String(name).trim().charAt(0) || 'ب'; }
export function listingCard(item){
  return `
    <article class="listing-card card">
      <a class="listing-media" href="details.html?id=${item.id}" style="background-image:url('${item.cover}')">
        <span class="listing-fav">♡</span>
        <span class="listing-type-chip">${item.type}</span>
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
              <div class="seller-sub">${item.meta}</div>
            </div>
          </div>
          <div class="listing-actions">
            <a class="action-mini" href="https://wa.me/218912345678">✆</a>
            <a class="action-mini" href="tel:0912345678">☎</a>
            <a class="btn" href="details.html?id=${item.id}">عرض</a>
          </div>
        </div>
      </div>
    </article>`;
}