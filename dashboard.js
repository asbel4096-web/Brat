import { pageTemplate, getUserListings, signInWithEmail, signOutUser, signUpWithEmail, waitForAuthReady, getCurrentUser, getUserLabel, getFavoriteIds, getUserChats, t, initAppChrome } from './common.js';

function authForms(message=''){
  return `
  <section class="section">
    <div class="account-auth-wrap">
      <div class="account-auth-intro">
        <div class="hero-chips">
          <span class="chip">Firebase</span>
          <span class="chip">${t('manage_my_ads')}</span>
          <span class="chip">${t('favorites')}</span>
        </div>
        <h3>${t('login')} / ${t('signup')}</h3>
        <p>${t('create_or_login')}</p>
      </div>

      <div class="auth-grid">
        <form id="login-form" class="surface-card auth-form luxury-auth">
          <h3 class="listing-title">${t('login')}</h3>
          <label class="field"><label>${t('email')}</label><input name="email" type="email" required placeholder="name@email.com"></label>
          <label class="field"><label>${t('password')}</label><input name="password" type="password" required placeholder="******"></label>
          <button class="btn btn-primary btn-block" type="submit">${t('login_btn')}</button>
        </form>

        <form id="signup-form" class="surface-card auth-form luxury-auth">
          <h3 class="listing-title">${t('signup')}</h3>
          <label class="field"><label>${t('email')}</label><input name="email" type="email" required placeholder="name@email.com"></label>
          <label class="field"><label>${t('password')}</label><input name="password" type="password" required minlength="6" placeholder="6+"></label>
          <button class="btn btn-soft btn-block" type="submit">${t('signup_btn')}</button>
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

function bindAuthForms(){
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const status = document.getElementById('auth-status');

  loginForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    status.textContent = '...';
    const fd = new FormData(loginForm);
    try {
      await signInWithEmail(String(fd.get('email') || '').trim(), String(fd.get('password') || ''));
      location.href = 'dashboard.html';
    } catch {
      status.textContent = 'تعذر تسجيل الدخول. تأكد من البريد وكلمة المرور أو أن الحساب موجود.';
    }
  });

  signupForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    status.textContent = '...';
    const fd = new FormData(signupForm);
    try {
      await signUpWithEmail(String(fd.get('email') || '').trim(), String(fd.get('password') || ''));
      location.href = 'dashboard.html';
    } catch {
      status.textContent = 'تعذر إنشاء الحساب. تأكد أن كلمة المرور 6 أحرف على الأقل وأن البريد غير مستخدم.';
    }
  });
}

async function render(){
  await waitForAuthReady();
  const user = getCurrentUser();

  if (!user) {
    const msg = location.hash === '#auth-required'
      ? `${t('login')} أولًا قبل إضافة إعلان أو إدارة إعلاناتك.`
      : '';
    document.getElementById('app').innerHTML = pageTemplate({
      active:'account',
      title:t('account'),
      subtitle:t('create_or_login'),
      content: authForms(msg)
    });
    bindAuthForms();
    initAppChrome();
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
          <span class="account-badge">${t('active_account')}</span>
        </div>
        <div class="account-avatar">${(getUserLabel().charAt(0) || 'ب').toUpperCase()}</div>
      </div>

      <div class="account-main-actions account-main-actions-3">
        <a class="btn btn-primary btn-block" href="my-ads.html">${t('manage_my_ads')}</a>
        <a class="btn btn-soft btn-block" href="add.html">${t('new_ad')}</a>
        <a class="btn btn-soft btn-block" href="settings.html">${t('open_settings')}</a>
      </div>

      <div class="account-mini-actions clean-four">
        <a class="account-mini-btn" href="favorites.html">
          <span>${t('favorites')}</span>
          <strong>${favoriteIds.length}</strong>
        </a>
        <a class="account-mini-btn" href="messages.html">
          <span>${t('chats')}</span>
          <strong>${chats.length}</strong>
        </a>
        <div class="account-mini-btn neutral">
          <span>${t('unread')}</span>
          <strong>${unreadCount}</strong>
        </div>
        <button class="account-mini-btn danger" id="logout-btn" type="button">
          <span>${t('logout')}</span>
          <strong>⎋</strong>
        </button>
      </div>
    </div>
  </section>

  <section class="section stats-grid account-stats">
    <div class="stat stat-strong"><div><strong>${activeAds.length}</strong><span>${t('published_ads')}</span></div></div>
    <div class="stat"><div><strong>${hiddenAds.length}</strong><span>${t('hidden_ads')}</span></div></div>
    <div class="stat"><div><strong>${favoriteIds.length}</strong><span>${t('in_favorites')}</span></div></div>
    <div class="stat"><div><strong>${unreadCount}</strong><span>${t('unread')}</span></div></div>
  </section>

  <section class="section">
    <div class="account-summary-grid">
      <div class="summary-card">
        <h4>${t('quick_summary')}</h4>
        <p>حسابك مربوط الآن بإعلاناتك الحقيقية ويمكنك إدارة المنشور والمخفي والدردشات من مكان واحد.</p>
      </div>
      <div class="summary-card">
        <h4>${t('last_status')}</h4>
        <p>لديك ${activeAds.length} إعلان ظاهر حاليًا في المنصة.</p>
      </div>
    </div>
  </section>`;

  document.getElementById('app').innerHTML = pageTemplate({
    active:'account',
    title:t('account'),
    subtitle:t('create_or_login'),
    content
  });

  document.getElementById('logout-btn')?.addEventListener('click', async ()=>{
    try {
      await signOutUser();
      location.href = 'dashboard.html';
    } catch {
      alert('تعذر تسجيل الخروج');
    }
  });

  initAppChrome();
}

render();
