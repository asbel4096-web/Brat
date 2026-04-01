import { qs, brandShell } from './common.js';

const content = `
  <section class="section">
    <article class="card">
      <div class="card-media">
        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80" alt="car">
        <span class="badge">سيارة</span>
        <button class="fav-btn" type="button">♡</button>
      </div>
      <div class="card-body">
        <div class="price">37,500 د.ل</div>
        <h2 class="title">هيونداي سوناتا 2016 فل رقم 1</h2>
        <p class="desc">بوش أصلي، صالون ممتاز، جاهزة بدون مصاريف. صفحة التفاصيل هنا مبنية من الصفر بشكل احترافي.</p>
        <div class="pills">
          <span class="pill">طرابلس</span>
          <span class="pill">2016</span>
          <span class="pill">95,000 كم</span>
          <span class="pill">يونس البراتشو</span>
        </div>
        <div class="card-actions">
          <a class="btn btn-primary" href="messages.html">مراسلة</a>
          <a class="btn btn-soft" href="#">واتساب</a>
          <a class="btn btn-soft" href="#">☎</a>
        </div>
      </div>
    </article>
  </section>

  <section class="section">
    <div class="content-card">
      <div class="section-head"><div><h3>التفاصيل</h3></div></div>
      <div class="table-list">
        <div class="row"><div class="k">النوع</div><div class="v">سيارة</div></div>
        <div class="row"><div class="k">المدينة</div><div class="v">طرابلس</div></div>
        <div class="row"><div class="k">السنة</div><div class="v">2016</div></div>
        <div class="row"><div class="k">الحالة</div><div class="v">95,000 كم</div></div>
        <div class="row"><div class="k">البائع</div><div class="v">يونس البراتشو</div></div>
      </div>
    </div>
  </section>
`;

qs('#app').innerHTML = brandShell('home', content);
