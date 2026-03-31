import { pageTemplate, getUserListings, signInWithEmail, signOutUser, signUpWithEmail, subscribeAuthState, waitForAuthReady, getCurrentUser, getUserLabel, getFavoriteIds, getUserChats } from './common.js';

function authForms(message=''){
  return `
  <section class="section">
    <div class="account-auth-wrap">
      <div class="account-auth-intro">
        <div class="hero-chips">
          <span class="chip">حساب حقيقي</span>
          <span class="chip">إعلاناتك</span>
          <span class="chip">مفضلتك</span>
        </div>
        <h3>سجّل دخولك إلى حسابك</h3>
        <p>ادخل بحسابك الحقيقي حتى ترتبط الإعلانات والمفضلة والدردشات بنفس الحساب بشكل واضح ومرتب.</p>
      </div>

      <div class="auth-grid">
        <form id="login-form" class="surface-card auth-form luxury-auth">
          <h3 class="listing-title">تسجيل الدخول</h3>
          <label class="field"><label>البريد الإلكتروني</label><input name="email" type="email" required placeholder="name@email.com"></label>
          <label class="field"><label>كلمة المرور</label><input name="password" type="password" required placeholder="******"></label>
          <button class="btn btn-primary btn-block" type="submit">دخول</button>
        </form>

        <form id="signup-form" class="surface-card auth-form luxury-auth">
          <h3 class="listing-title">إنشاء حساب</h3>
          <label class="field"><label>البريد الإلكتروني</label><input name="email" type="email" required placeholder="name@email.com"></label>
          <label class="field"><label>كلمة المرور</label><input name="password" type="password" required minlength="6" placeholder="6 أحرف أو أكثر"></label>
          <button class="btn btn-soft btn-block" type="submit">إنشاء حساب جديد</button>
        </form>
      </div>

      ${message ? `<div class="account-status error">${message}</div>` : ''}
      <div id="auth-status" class="account-status"></div>
    </div>
  </section>`;
}

function shortEmail(email=''){
  const e = String(email || '').trim();
  if (!e) return 'بدون بريد';
  if (e.length <= 28) return e;
  return e.slice(0, 25) + '...';
}

async function render(){
  await waitForAuthReady();
  const user = getCurrentUser();

  if (!user) {
    document.getElementById('app').innerHTML = pageTemplate({
      active:'account',
      title:'حسابي',
      subtitle:'أنشئ حسابًا أو سجل الدخول لربط الإعلانات بصاحبها الحقيقي.',
      content: authForms(location.hash === '#auth-required' ? 'يجب تسجيل الدخول أولًا قبل إضافة إعلان أو إدارة إعلاناتك.' : '')
    });
    bindAuthForms();
    return;
  }

  const [userAds, favoriteIds, chats] = await Promise.all([
    getUserListings(true, { includeHidden: true }),
    getFavoriteIds(true),
    getUserChats()
  ]);

  const activeAds = userAds.filter(x => (x.status || 'active') !== 'hidden');
  const hiddenAds = userAds.filter(x => (x.status || 'active') === 'hidden');
  const unreadCount = chats.reduce((sum, chat) => sum + (Number(chat.unreadCount) || 0), 0);

  const content = `
  <section class="section">
    <div class="account-hero-card">
      <div class="account-hero-top">
        <div class="account-id-block">
          <h3>${getUserLabel()}</h3>
          <p>${shortEmail(user.email || '')}</p>
          <span class="account-badge">Firebase Auth • حساب مفعل</span>
        </div>
        <div class="account-avatar">${(getUserLabel().charAt(0) || 'ب').toUpperCase()}</div>
      </div>

      <div class="account-main-actions">
        <a class="btn btn-primary btn-block" href="my-ads.html">إدارة إعلاناتي</a>
        <a class="btn btn-soft btn-block" href="add.html">إضافة إعلان جديد</a>
      </div>

      <div class="account-mini-actions clean-four">
        <a class="account-mini-btn" href="favorites.html">
          <span>المفضلة</span>
          <strong>${favoriteIds.length}</strong>
        </a>
        <a class="account-mini-btn" href="messages.html">
          <span>الدردشات</span>
          <strong>${chats.length}</strong>
        </a>
        <div class="account-mini-btn neutral">
          <span>غير مقروء</span>
          <strong>${unreadCount}</strong>
        </div>
        <button class="account-mini-btn danger" id="logout-btn" type="button">
          <span>تسجيل الخروج</span>
          <strong>⎋</strong>
        </button>
      </div>
    </div>
  </section>

  <section class="section stats-grid account-stats">
    <div class="stat stat-strong"><div><strong>${activeAds.length}</strong><span>إعلان منشور</span></div></div>
    <div class="stat"><div><strong>${hiddenAds.length}</strong><span>إعلان مخفي</span></div></div>
    <div class="stat"><div><strong>${favoriteIds.length}</strong><span>في المفضلة</span></div></div>
    <div class="stat"><div><strong>${unreadCount}</strong><span>غير مقروء</span></div></div>
  </section>

  <section class="section">
    <div class="account-summary-grid">
      <div class="summary-card">
        <h4>ملخص سريع</h4>
        <p>حسابك مربوط الآن بإعلاناتك الحقيقية، ويمكنك إدارة المنشور والمخفي والدردشات من مكان واحد.</p>
      </div>
      <div class="summary-card">
        <h4>آخر حالة</h4>
        <p>${activeAds.length > 0 ? `لديك ${activeAds.length} إعلان ظاهر حاليًا في المنصة.` : 'لا توجد إعلانات منشورة حاليًا.'}</p>
      </div>
    </div>
  </section>`;

  document.getElementById('app').innerHTML = pageTemplate({
    active:'account',
    title:'حسابي',
    subtitle:'لوحة أفخم وأوضح مرتبطة بحسابك الحقيقي وإعلاناتك ودردشاتك.',
    content
  });

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
    status.className = 'account-status';
    try {
      await signInWithEmail(String(fd.get('email')||'').trim(), String(fd.get('password')||''));
      status.textContent = 'تم تسجيل الدخول بنجاح.';
      status.className = 'account-status success';
      setTimeout(render, 250);
    } catch (err) {
      status.textContent = 'فشل تسجيل الدخول. تأكد من البريد وكلمة المرور.';
      status.className = 'account-status error';
    }
  });

  document.getElementById('signup-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    status.textContent = 'جاري إنشاء الحساب...';
    status.className = 'account-status';
    try {
      await signUpWithEmail(String(fd.get('email')||'').trim(), String(fd.get('password')||''));
      status.textContent = 'تم إنشاء الحساب وتسجيل الدخول مباشرة.';
      status.className = 'account-status success';
      setTimeout(render, 250);
    } catch (err) {
      status.textContent = 'تعذر إنشاء الحساب. جرب بريدًا آخر أو كلمة مرور أقوى.';
      status.className = 'account-status error';
    }
  });
}

subscribeAuthState(() => {
  if (document.hidden) return;
  render();
});

render();
