import { firebaseSettings, adminEmails } from './firebase-config.js';

export function qs(id){ return document.getElementById(id); }
export function showToast(text){
  const toastEl = qs('toast');
  if(!toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.remove('hidden');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.add('hidden'), 2600);
}
export function formatPrice(n){ return new Intl.NumberFormat('en-US').format(Number(n || 0)) + ' د.ل'; }
export function formatDate(ts){
  if(!ts) return '-';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return new Intl.DateTimeFormat('ar-LY',{dateStyle:'medium'}).format(d);
}

export async function initFirebase(){
  const [
    { initializeApp },
    { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile },
    { getFirestore, collection, addDoc, getDocs, getDoc, serverTimestamp, query, where, updateDoc, doc, deleteDoc, orderBy, limit },
    { getStorage, ref, uploadBytes, getDownloadURL }
  ] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js')
  ]);

  const app = initializeApp(firebaseSettings);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  return {
    auth,
    db,
    storage,
    adminEmails,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    collection,
    addDoc,
    getDocs,
    getDoc,
    serverTimestamp,
    query,
    where,
    updateDoc,
    doc,
    deleteDoc,
    orderBy,
    limit,
    ref,
    uploadBytes,
    getDownloadURL
  };
}

export function buildCard(item){
  const cover = item.images?.[0] || item.imageUrl || '';
  const imagesCount = item.images?.length || (item.imageUrl ? 1 : 0);
  const article = document.createElement('article');
  article.className = 'listing-card';
  article.innerHTML = `
    <div class="listing-image" style="background-image:url('${cover}')">
      ${item.featured ? '<span class="swiper-badge">مميز</span>' : ''}
      <span class="swiper-count">${imagesCount} صور</span>
    </div>
    <div class="listing-body">
      <h4 class="listing-title">${item.title || '-'}</h4>
      <div class="price">${formatPrice(item.price)}</div>
      <div class="meta-grid">
        <div class="meta-chip">${item.city || '-'}</div>
        <div class="meta-chip">${item.year || '-'}</div>
        <div class="meta-chip">${item.mileage || '-'}</div>
        <div class="meta-chip">${item.brand || '-'}</div>
      </div>
      <div class="card-actions">
        <a class="btn" href="details.html?id=${item.id}">التفاصيل</a>
        <a class="outline-btn" href="https://wa.me/${(item.phone||'').replace(/\D/g,'')}" target="_blank">واتساب</a>
      </div>
    </div>`;
  return article;
}
