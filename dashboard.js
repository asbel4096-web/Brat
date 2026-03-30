import { pageTemplate, getUserListings, signInWithEmail, signOutUser, signUpWithEmail, subscribeAuthState, waitForAuthReady, getCurrentUser, getUserLabel } from './common.js';

function authForms(message=''){
  return `
  <section class="section">
    <div class="dashboard-card">
      <div class="section-head"><div><h3>تسجيل الدخول الحقيقي</h3><p>سجّل دخولك حتى ترتبط الإعلانات بحسابك وتظهر لك فقط داخل إعلاناتي.</p></div></div>
      ${message ? `<div class="muted" style="margin-bottom:12px;color:#b42318">${message}</div>` : ''}
      <div class="auth-grid">
        <form id="login-form" class="surface-card auth-form">
          <h3 class="listing-title">دخول</h3>
          <label class="field"><label>البريد الإلكتروني</label><input name="email" type="email" required placeholder="name@email.com"></label>
          <label class="field"><label>كلمة المرور</label><input name="password" type="password" required placeholder="******"></label>
          <button class="btn btn-primary btn-block" type="submit">تسجيل الدخول</button>
        </form>
        <form id="signup-form" class="surface-card auth-form">
          <h3 class="listing-title">إنشاء حساب</h3>
          <label class="field"><label>البريد الإلكتروني</label><input name="email" type="email" required placeholder="name@email.com"></label>
          <label class="field"><label>كلمة المرور</label><input name="password" type="password" required minlength="6" placeholder="6 أحرف أو أكثر"></label>
          <button class="btn btn-soft btn-block" type="submit">إنشاء حساب جديد</button>
        </form>
      </div>
      <div id="auth-status" class="muted" style="margin-top:10px"></div>
    </div>
  </section>`;
}

async function render(){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) {
    document.getElementById('app').innerHTML = pageTemplate({active:'account', title:'حسابي', subtitle:'أنشئ حسابًا أو سجل الدخول لربط الإعلانات بصاحبها الحقيقي.', content: authForms(location.hash === '#auth-required' ? 'يجب تسجيل الدخول أولًا قبل إضافة إعلان أو إدارة إعلاناتك.' : '')});
    bindAuthForms();
    return;
  }

  const userAds = await getUserListings(true, { includeHidden: true });
  const activeAds = userAds.filter(x => (x.status || 'active') !== 'hidden');
  const hiddenAds = userAds.filter(x => (x.status || 'active') === 'hidden');
  const content = `
  <section class="section">
    <div class="dashboard-card">
      <div class="dashboard-profile">
        <div class="avatar">${(getUserLabel().charAt(0) || 'ب').toUpperCase()}</div>
        <div><h3 class="listing-title" style="margin:0">${getUserLabel()}</h3><p class="muted">حساب مفعل • Firebase Auth</p></div>
      </div>
      <div class="dashboard-buttons">
        <a class="btn btn-primary btn-block" href="my-ads.html">إدارة إعلاناتي</a>
        <a class="btn btn-soft btn-block" href="add.html">إضافة إعلان جديد</a>
        <button class="btn btn-soft btn-block" id="logout-btn">تسجيل الخروج</button>
      </div>
    </div>
  </section>
  <section class="section stats-grid">
    <div class="stat"><div><strong>2,891</strong><span>المشاهدات</span></div></div>
    <div class="stat"><div><strong>${activeAds.length}</strong><span>منشور</span></div></div>
    <div class="stat"><div><strong>${hiddenAds.length}</strong><span>مخفي</span></div></div>
    <div class="stat"><div><strong>${userAds.length}</strong><span>إجمالي إعلاناتي</span></div></div>
  </section>`;
  document.getElementById('app').innerHTML = pageTemplate({active:'account', title:'حسابي', subtitle:'لوحة واضحة مرتبطة بحسابك الحقيقي وإعلاناتك فقط.', content});
  document.getElementById('logout-btn')?.addEventListener('click', async ()=>{
    await signOutUser();
    location.href = 'dashboard.html#auth';
  });
}

function bindAuthForms(){
  const status = document.getElementById('auth-status');
  document.getElementById('login-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    status.textContent = 'جاري تسجيل الدخول...';
    try {
      await signInWithEmail(String(fd.get('email')||'').trim(), String(fd.get('password')||''));
      status.textContent = 'تم تسجيل الدخول بنجاح.';
      setTimeout(render, 250);
    } catch (err) {
      status.textContent = 'فشل تسجيل الدخول. تأكد من البريد وكلمة المرور.';
    }
  });
  document.getElementById('signup-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    status.textContent = 'جاري إنشاء الحساب...';
    try {
      await signUpWithEmail(String(fd.get('email')||'').trim(), String(fd.get('password')||''));
      status.textContent = 'تم إنشاء الحساب وتسجيل الدخول مباشرة.';
      setTimeout(render, 250);
    } catch (err) {
      status.textContent = 'تعذر إنشاء الحساب. جرب بريدًا آخر أو كلمة مرور أقوى.';
    }
  });
}

subscribeAuthState(() => {
  if (document.hidden) return;
  render();
});

render();
