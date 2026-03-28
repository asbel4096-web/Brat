export const seedListings = [
  {id:'1',type:'car',title:'هيونداي سوناتا 2016',price:37772,city:'طرابلس',year:2016,mileage:'95,000 كم',status:'approved'},
  {id:'2',type:'part',title:'كمبيو كيا أوبتيما 2014',price:4500,city:'مصراتة',year:2014,mileage:'قطعة مستعملة',status:'pending'},
  {id:'3',type:'service',title:'ميكانيكي متنقل - فحص كمبيوتر',price:120,city:'طرابلس',year:2026,mileage:'خدمة متنقلة',status:'approved'}
];

export const seedChats = [
  {name:'محمد', last:'السلام عليكم، السيارة موجودة؟', time:'منذ 5 دقائق', unread:2},
  {name:'أحمد', last:'نبي تفاصيل أكثر على القطعة', time:'منذ 20 دقيقة', unread:0},
  {name:'سالم', last:'ممكن رقم الواتساب؟', time:'منذ ساعة', unread:1}
];

export function bootCommon(active='home'){
  injectFrame(active);
}

export function injectFrame(active='home'){
  if(document.querySelector('.topbar')) return;

  const top = document.createElement('header');
  top.className = 'topbar';
  top.innerHTML = `
    <div class="container topbar-inner">
      <div class="brand">
        <div>
          <h1 class="brand-title"><span>براتشو</span> كار</h1>
          <p class="brand-sub">سيارات، قطع غيار، ميكانيكي متنقل</p>
        </div>
        <div class="logo-badge">BC</div>
      </div>
      <div class="quick-actions">
        <a class="soft-btn" href="settings.html">الإعدادات</a>
        <a class="soft-btn" href="dashboard.html">حسابي</a>
        <a class="primary-btn" href="add.html">أضف إعلان</a>
      </div>
    </div>
  `;
  document.body.prepend(top);

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.innerHTML = `
    <ul class="bottom-nav-grid">
      <li><a href="index.html" class="${active==='home' ? 'active' : ''}"><span class="nav-icon">⌂</span><span>الرئيسية</span></a></li>
      <li><a href="messages.html" class="${active==='messages' ? 'active' : ''}"><span class="nav-icon">◔</span><span>دردشاتي</span></a></li>
      <li class="nav-center"><a href="add.html" class="nav-add ${active==='add' ? 'active' : ''}"><span class="nav-add-circle">+</span><span>أضف إعلان</span></a></li>
      <li><a href="my-ads.html" class="${active==='myads' ? 'active' : ''}"><span class="nav-icon">▤</span><span>إعلاناتي</span></a></li>
      <li><a href="dashboard.html" class="${active==='dashboard' ? 'active' : ''}"><span class="nav-icon">◉</span><span>حسابي</span></a></li>
    </ul>
  `;
  document.body.append(nav);
}

export function formatPrice(n){
  return Number(n).toLocaleString('en-US') + ' د.ل';
}