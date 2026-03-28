import { initFirebase, qs, showToast, formatPrice, buildCard } from './common.js';

function getId(){ return new URLSearchParams(location.search).get('id'); }

async function start(){
  const id = getId();
  if(!id) return showToast('لا يوجد إعلان محدد.');
  const fb = await initFirebase();
  const { db, collection, getDoc, doc, getDocs, query, where, limit } = fb;

  const snap = await getDoc(doc(db, 'listings', id));
  if(!snap.exists()) return showToast('الإعلان غير موجود.');
  const item = { ...snap.data(), id: snap.id };

  let active = (item.images && item.images[0]) || item.imageUrl || '';
  const drawMain = () => {
    qs('mainPhoto').innerHTML = active ? `<img src="${active}" alt="main">` : '';
  };
  drawMain();

  qs('detailTitle').textContent = item.title || '-';
  qs('detailPrice').textContent = formatPrice(item.price);
  qs('detailDescription').textContent = item.description || 'لا يوجد وصف.';
  qs('sellerCity').textContent = item.city || '-';
  qs('sellerPhone').textContent = item.phone || '-';
  qs('whatsappBtn').href = `https://wa.me/${(item.phone || '').replace(/\D/g,'')}`;
  qs('callBtn').href = `tel:${item.phone || ''}`;

  const specs = [
    ['الماركة', item.brand],
    ['الموديل', item.model],
    ['السنة', item.year],
    ['السعر', formatPrice(item.price)],
    ['الممشى', item.mileage],
    ['المدينة', item.city],
    ['القير', item.transmission],
    ['الوقود', item.fuel],
    ['اللون', item.color],
    ['الهاتف', item.phone]
  ];
  qs('specsGrid').innerHTML = specs.map(([k,v]) => `<div class="spec"><small>${k}</small><strong>${v || '-'}</strong></div>`).join('');

  const images = item.images?.length ? item.images : (item.imageUrl ? [item.imageUrl] : []);
  qs('thumbGrid').innerHTML = images.map(url => `<button type="button"><img src="${url}" alt="thumb"></button>`).join('');
  qs('thumbGrid').querySelectorAll('button').forEach((btn, idx) => btn.addEventListener('click', () => { active = images[idx]; drawMain(); }));

  const relatedSnap = await getDocs(query(collection(db, 'listings'), where('status','==','approved'), limit(4)));
  const related = relatedSnap.docs.map(d => ({ ...d.data(), id: d.id })).filter(x => x.id !== item.id).slice(0,3);
  const relatedList = qs('relatedList');
  if(!related.length) relatedList.innerHTML = '<div class="empty">لا توجد إعلانات مشابهة الآن.</div>';
  else related.forEach(r => relatedList.appendChild(buildCard(r)));
}

start().catch(err => {
  console.error(err);
  showToast('تعذر تحميل التفاصيل.');
});
