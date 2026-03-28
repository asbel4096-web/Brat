export const seedListings = [
  {id:'1',type:'car',title:'هيونداي سوناتا 2016',price:37772,city:'طرابلس',year:2016,mileage:'95,000 كم',desc:'فل رقم 1، بوش أصلي، صالون ممتاز، جاهزة بدون مصاريف.',image:'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'},
  {id:'2',type:'part',title:'كمبيو كيا أوبتيما 2014',price:4500,city:'مصراتة',year:2014,mileage:'قطعة مستعملة',desc:'كمبيو نظيف ومجرّب، مناسب لعدة فئات.',image:'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80'},
  {id:'3',type:'service',title:'ميكانيكي متنقل - فحص كمبيوتر',price:120,city:'طرابلس',year:2026,mileage:'خدمة متنقلة',desc:'فحص أعطال، كهرباء خفيفة، خدمة منزلية داخل طرابلس.',image:'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1200&q=80'},
  {id:'4',type:'service',title:'إنقاذ سريع بطارية',price:80,city:'جنزور',year:2026,mileage:'خدمة متنقلة',desc:'تشغيل بطارية، تغيير بطارية، وصول سريع.',image:'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80'},
  {id:'5',type:'part',title:'جنوط 18 أصلية',price:1800,city:'الزاوية',year:2022,mileage:'مستعملة نظيفة',desc:'جنوط نظيفة جدًا بدون لحام.',image:'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80'},
  {id:'6',type:'car',title:'كيا K5 2014',price:42000,city:'طرابلس',year:2014,mileage:'122,000 كم',desc:'استيراد كوري، شاشة، بصمة، كاميرا، حالة ممتازة.',image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'}
];

export function bootCommon(active='home'){
  const dark = localStorage.getItem('bratsho-theme') === 'dark';
  document.body.classList.toggle('dark', dark);
  injectFrame(active);
  bindThemeSwitch();
}

export function bindThemeSwitch(){
  document.addEventListener('click', e=>{
    const btn = e.target.closest('[data-toggle-theme]');
    if(!btn) return;
    const isDark = !document.body.classList.contains('dark');
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('bratsho-theme', isDark ? 'dark':'light');
  });
}

export function injectFrame(active='home'){
  if(document.querySelector('.topbar')) return;
  const top = document.createElement('header');
  top.className = 'topbar';
  top.innerHTML = `
    <div class="container topbar-inner">
      <div class="brand">
        <div>
          <h1><span>براتشو</span> كار</h1>
          <p>سيارات، قطع غيار، ميكانيكي متنقل</p>
        </div>
        <div class="logo-badge">BC</div>
      </div>
      <div class="quick-actions">
        <a class="soft-btn" href="settings.html">⚙️ الإعدادات</a>
        <a class="soft-btn" href="dashboard.html">👤 حسابي</a>
        <a class="primary-btn" href="add.html">＋ أضف إعلان</a>
      </div>
    </div>`;
  document.body.prepend(top);

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.innerHTML = `
    <ul>
      <li><a href="index.html" class="${active==='home'?'active':''}">🏠<span>الرئيسية</span></a></li>
      <li><a href="cars.html" class="${active==='cars'?'active':''}">🚘<span>السيارات</span></a></li>
      <li><a href="parts.html" class="${active==='parts'?'active':''}">🧩<span>القطع</span></a></li>
      <li><a href="services.html" class="${active==='services'?'active':''}">🛠️<span>الخدمات</span></a></li>
      <li><a href="settings.html" class="${active==='settings'?'active':''}">⚙️<span>الإعدادات</span></a></li>
    </ul>`;
  document.body.append(nav);
}

export function layoutStart(title, sub=''){
  return `<main class="page"><section class="section"><div class="container"><h2 class="page-title">${title}</h2>${sub?`<p class="page-sub">${sub}</p>`:''}</div></section>`;
}
export function layoutEnd(){ return `</main>`; }

export function adCard(item){
  const badge = item.type === 'car' ? 'سيارة' : item.type === 'part' ? 'قطعة غيار' : 'خدمة';
  return `
    <article class="ad-card">
      <div class="ad-image" style="background-image:url('${item.image}')"></div>
      <div class="ad-body">
        <span class="badge">${badge}</span>
        <div class="price">${Number(item.price).toLocaleString('en-US')} د.ل</div>
        <div class="title">${item.title}</div>
        <div class="meta"><span>${item.city}</span><span>${item.year}</span><span>${item.mileage}</span></div>
        <div class="desc">${item.desc}</div>
      </div>
    </article>`;
}