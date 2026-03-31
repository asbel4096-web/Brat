import { pageTemplate, waitForAuthReady, getCurrentUser, getUserLabel, t, getLang, getTheme, initAppChrome, signOutUser } from './common.js';

function card(title, subtitle, body){
  return `<section class="section"><div class="surface-card settings-card"><div class="section-head"><div><h3>${title}</h3>${subtitle ? `<p>${subtitle}</p>` : ''}</div></div>${body}</div></section>`;
}

(async ()=>{
  await waitForAuthReady();
  const user = getCurrentUser();
  const lang = getLang();
  const theme = getTheme();

  const content = `
    ${card('', '', `
      <div class="settings-grid">
        <div class="settings-option settings-option-static">
          <div>
            <strong>${t('language')}</strong>
            <small>${t('current_language')}</small>
          </div>
          <div class="settings-value-badge">${lang === 'en' ? 'English' : 'العربية'}</div>
        </div>

        <div class="settings-option settings-option-static">
          <div>
            <strong>${t('appearance')}</strong>
            <small>${t('current_theme')}</small>
          </div>
          <div class="settings-value-badge">${theme === 'dark' ? t('dark_mode') : t('light_mode')}</div>
        </div>

        <div class="settings-option settings-option-static">
          <div>
            <strong>${t('notifications')}</strong>
            <small>${t('enabled')}</small>
          </div>
          <div class="settings-pill">${t('enabled')}</div>
        </div>

        <div class="settings-option">
          <div>
            <strong>${t('account_settings')}</strong>
            <small>${user ? getUserLabel() : 'Guest'}</small>
          </div>
          <div class="settings-actions">
            ${user ? `<button class="btn btn-soft" id="logout-settings">${t('logout')}</button>` : `<a class="btn btn-primary" href="dashboard.html">${t('login')}</a>`}
          </div>
        </div>
      </div>
    `)}

    ${card(t('app_info'), 'Bratsho Car', `
      <div class="settings-info-list">
        <div class="settings-info-row"><span>${t('language')}</span><b>${lang === 'en' ? 'English' : 'العربية'}</b></div>
        <div class="settings-info-row"><span>${t('appearance')}</span><b>${theme === 'dark' ? t('dark_mode') : t('light_mode')}</b></div>
        <div class="settings-info-row"><span>Version</span><b>v2 UI</b></div>
      </div>
    `)}
  `;

  document.getElementById('app').innerHTML = pageTemplate({
    active:'account',
    title:t('app_settings'),
    subtitle:t('settings_sub'),
    content
  });

  initAppChrome();

  document.getElementById('logout-settings')?.addEventListener('click', async ()=>{
    try {
      await signOutUser();
      location.href = 'dashboard.html';
    } catch {
      alert('تعذر تسجيل الخروج');
    }
  });
})();
