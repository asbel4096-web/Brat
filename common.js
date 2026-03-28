export const STORAGE_KEY='bratsho-theme';
export function initTheme(){
  const saved=localStorage.getItem(STORAGE_KEY)||'light';
  document.documentElement.dataset.theme=saved;
  document.querySelectorAll('[data-theme-toggle]').forEach(el=>{el.checked=saved==='dark'; el.addEventListener('change',()=>{const theme=el.checked?'dark':'light'; document.documentElement.dataset.theme=theme; localStorage.setItem(STORAGE_KEY,theme); document.querySelectorAll('[data-theme-toggle]').forEach(x=>x.checked=el.checked);});});
}
export function bootCommon(){initTheme();}
export function formatPrice(n){return new Intl.NumberFormat('en-US').format(Number(n||0))+' د.ل';}
export const seedListings=[
{id:'c1',type:'car',title:'هيونداي سوناتا 2016',brand:'Hyundai',model:'Sonata',year:2016,price:37772,city:'طرابلس',mileage:'95,000 كم',imageUrl:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',description:'فل رقم 1، بوش أصلي، صالون ممتاز، جاهزة بدون مصاريف.',status:'approved',featured:true},
{id:'c2',type:'part',title:'كمبيو كيا أوبتيما 2014',brand:'Kia',model:'Optima',year:2014,price:4500,city:'مصراتة',mileage:'قطعة مستعملة',imageUrl:'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80',description:'كمبيو نظيف ومجرب، مناسب لعدة فئات.',status:'approved',featured:false},
{id:'c3',type:'service',title:'ميكانيكي متنقل - فحص كمبيوتر',brand:'Service',model:'Diagnostics',year:2026,price:120,city:'طرابلس',mileage:'خدمة متنقلة',imageUrl:'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80',description:'فحص أعطال، كهرباء خفيفة، خدمة منزلية داخل طرابلس.',status:'approved',featured:true}
];
export function nav(active='home'){return `
<nav class="bottom-nav">
<a class="${active==='home'?'active':''}" href="index.html">🏠<span>الرئيسية</span></a>
<a class="${active==='cars'?'active':''}" href="cars.html">🚗<span>السيارات</span></a>
<a class="${active==='parts'?'active':''}" href="parts.html">🧩<span>القطع</span></a>
<a class="${active==='services'?'active':''}" href="services.html">🛠️<span>الخدمات</span></a>
<a class="${active==='settings'?'active':''}" href="settings.html">⚙️<span>الإعدادات</span></a>
</nav>`;}
export function topbar(){return `<header class="topbar"><div class="container topbar-inner"><div class="logo-wrap"><div class="logo-badge">BC</div><div class="logo-title"><h1>براتشو <span>كار</span></h1><p>سيارات، قطع غيار، ميكانيكي متنقل</p></div></div><div class="top-actions"><a class="ghost-btn" href="settings.html">⚙️ الإعدادات</a><a class="ghost-btn" href="dashboard.html">👤 حسابي</a><a class="btn" href="add.html">➕ أضف إعلان</a></div></div></header>`}
export function injectFrame(active){document.body.insertAdjacentHTML('afterbegin',topbar());document.body.insertAdjacentHTML('beforeend',nav(active));}
export function listingCard(item){return `<article class="listing-card"><div class="listing-image" style="background-image:url('${item.imageUrl}')"></div><div class="listing-body"><div class="listing-top"><span class="badge">${item.type==='car'?'سيارة':item.type==='part'?'قطعة غيار':'خدمة'}</span><div class="price">${formatPrice(item.price)}</div></div><div class="title">${item.title}</div><div class="meta"><span>${item.city}</span><span>${item.mileage}</span><span>${item.year||''}</span></div><div class="desc">${item.description}</div><div class="card-actions"><a class="btn" href="details.html?id=${item.id}">التفاصيل</a><a class="ghost-btn" href="https://wa.me/218910000000" target="_blank">واتساب</a></div></div></article>`}
