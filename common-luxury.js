export function initTheme(){
  const saved = localStorage.getItem('bratsho_theme') || 'light';
  if(saved==='dark') document.body.classList.add('theme-dark');
}
export function setTheme(mode){
  document.body.classList.toggle('theme-dark', mode==='dark');
  localStorage.setItem('bratsho_theme', mode);
}
export function shellTop(title, extra=''){
return `
<div class="shell">
  <header class="topbar">
    <div class="topbar-inner">
      <div class="page-title">${title}</div>
      <div class="top-icons">
        <a class="icon-btn" href="settings.html">⚙️</a>
        <a class="icon-btn" href="messages.html">🔔<span class="notif-dot">27</span></a>
        <a class="icon-btn" href="#">📞</a>
      </div>
    </div>
  </header>
  <main class="content">${extra}`;
}
export function bottomNav(active){
  const items=[['index.html','🏠','الرئيسية','home'],['cars.html','🚘','السيارات','cars'],['add.html','＋','أضف إعلان','add'],['messages.html','💬','دردشاتي','messages'],['dashboard.html','👤','حسابي','account']];
  return `<nav class="bottom-nav">${items.map(([href,icon,label,key])=> key==='add'?`<a class="nav-item add ${active===key?'active':''}" href="${href}"><div class="add-circle">＋</div><div>${label}</div></a>`:`<a class="nav-item ${active===key?'active':''}" href="${href}"><div class="nicon">${icon}</div><div>${label}</div></a>`).join('')}</nav>`;
}
export function finishShell(active){ return `</main></div>${bottomNav(active)}`; }
