export const seedListings = [
  {
    id:'1',
    type:'car',
    title:'هيونداي سوناتا 2016',
    price:37772,
    city:'طرابلس',
    year:2016,
    mileage:'95,000 كم',
    desc:'فل رقم 1، بوش أصلي، صالون ممتاز، جاهزة بدون مصاريف.',
    image:'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    images:[
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80'
    ],
    specs:{
      body:'سيدان',
      fuel:'بنزين',
      gear:'أوتوماتيك',
      engine:'2.0',
      import:'استيراد كوري',
      condition:'ممتازة'
    },
    seller:{
      name:'براتشو كار',
      phone:'0912345678',
      whatsapp:'0912345678',
      joined:'عضو منذ 2024'
    }
  }
];

export function bootCommon(active='home'){
  const dark = localStorage.getItem('bratsho-theme') === 'dark';
  document.body.classList.toggle('dark', dark);
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