import { initFirebase, qs, showToast, buildCard } from './common.js';

const state = {
  user: null,
  isAdmin: false,
  listings: [],
  featured: []
};

function openModal(id){ qs(id)?.classList.remove('hidden'); }
function closeModal(id){ qs(id)?.classList.add('hidden'); }

function switchAuthTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.authTab === tab));
  qs('loginFormWrap')?.classList.toggle('hidden', tab !== 'login');
  qs('registerFormWrap')?.classList.toggle('hidden', tab !== 'register');
}

function updateUserUI(){
  qs('userState').textContent = state.user ? (state.isAdmin ? 'أدمن' : 'مسجل') : 'زائر';
  qs('logoutBtn')?.classList.toggle('hidden', !state.user);
  qs('dashboardLink')?.classList.toggle('hidden', !state.user);
  qs('adminLink')?.classList.toggle('hidden', !state.isAdmin);
}

function getFormData(){
  return {
    title: qs('title').value.trim(),
    brand: qs('brand').value.trim(),
    model: qs('model').value.trim(),
    year: qs('year').value.trim(),
    price: qs('price').value.trim(),
    mileage: qs('mileage').value.trim(),
    city: qs('city').value.trim(),
    phone: qs('phone').value.trim(),
    description: qs('description').value.trim(),
    transmission: qs('transmission').value.trim(),
    fuel: qs('fuel').value.trim(),
    color: qs('color').value.trim(),
    status: 'pending',
    featured: false
  };
}

function validateForm(data){
  return data.title && data.brand && data.model && data.year && data.price && data.city && data.phone;
}

function renderListings(){
  const latestGrid = qs('listingsGrid');
  const featuredGrid = qs('featuredGrid');
  latestGrid.innerHTML = '';
  featuredGrid.innerHTML = '';

  const featured = state.listings.filter(x => x.featured);
  const normal = state.listings;

  qs('approvedCount').textContent = normal.length;
  qs('pendingCount').textContent = '—';
  qs('featuredCount').textContent = featured.length;

  if(!featured.length) featuredGrid.innerHTML = '<div class="empty">لا توجد إعلانات مميزة حاليًا.</div>';
  else featured.forEach(item => featuredGrid.appendChild(buildCard(item)));

  if(!normal.length) latestGrid.innerHTML = '<div class="empty">لا توجد إعلانات منشورة حتى الآن.</div>';
  else normal.forEach(item => latestGrid.appendChild(buildCard(item)));
}

function previewFiles(files){
  const preview = qs('previewGrid');
  preview.innerHTML = '';
  [...files].slice(0,8).forEach((file, idx) => {
    const url = URL.createObjectURL(file);
    const div = document.createElement('div');
    div.className = 'preview-item';
    div.innerHTML = `<img src="${url}" alt="preview"><span class="preview-badge">${idx === 0 ? 'رئيسية' : idx + 1}</span>`;
    preview.appendChild(div);
  });
}

async function start(){
  const fb = await initFirebase();
  const { auth, db, storage, adminEmails, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, collection, addDoc, getDocs, serverTimestamp, query, where, orderBy, limit, ref, uploadBytes, getDownloadURL } = fb;

  async function loadPublished(){
    const snap = await getDocs(query(collection(db, 'listings'), where('status','==','approved')));
    state.listings = snap.docs.map(d => ({ ...d.data(), id: d.id })).sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
    renderListings();
  }

  onAuthStateChanged(auth, async user => {
    state.user = user;
    state.isAdmin = !!(user && adminEmails.includes(user.email));
    updateUserUI();
    await loadPublished();
  });

  qs('openAuthBtn')?.addEventListener('click', () => openModal('authModal'));
  qs('openAddBtn')?.addEventListener('click', () => openModal('addModal'));
  qs('openAddHeroBtn')?.addEventListener('click', () => openModal('addModal'));
  document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => closeModal(btn.dataset.close)));
  document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => switchAuthTab(btn.dataset.authTab)));
  qs('imageFile')?.addEventListener('change', e => previewFiles(e.target.files));

  qs('registerBtn')?.addEventListener('click', async () => {
    try{
      const name = qs('registerName').value.trim();
      const email = qs('registerEmail').value.trim();
      const password = qs('registerPassword').value.trim();
      if(!name || !email || !password) return showToast('املأ كل الحقول.');
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      closeModal('authModal');
      showToast('تم إنشاء الحساب.');
    }catch(err){
      alert('تعذر إنشاء الحساب: ' + (err.code || err.message));
    }
  });

  qs('loginBtn')?.addEventListener('click', async () => {
    try{
      const email = qs('loginEmail').value.trim();
      const password = qs('loginPassword').value.trim();
      if(!email || !password) return showToast('أدخل البريد وكلمة المرور.');
      await signInWithEmailAndPassword(auth, email, password);
      closeModal('authModal');
      showToast('تم تسجيل الدخول.');
    }catch(err){
      alert('فشل تسجيل الدخول: ' + (err.code || err.message));
    }
  });

  qs('logoutBtn')?.addEventListener('click', async () => {
    try {
      await signOut(auth);
      showToast('تم تسجيل الخروج.');
    } catch (err) {
      alert('تعذر تسجيل الخروج: ' + (err.code || err.message));
    }
  });

  qs('submitListingBtn')?.addEventListener('click', async () => {
    try{
      if(!auth.currentUser) return openModal('authModal');
      const data = getFormData();
      if(!validateForm(data)) return showToast('أكمل الحقول المطلوبة.');
      const files = [...(qs('imageFile').files || [])].slice(0,8);
      const images = [];
      for(const file of files){
        const fileRef = ref(storage, `cars/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`);
        await uploadBytes(fileRef, file);
        images.push(await getDownloadURL(fileRef));
      }
      await addDoc(collection(db, 'listings'), {
        ...data,
        images,
        imageUrl: images[0] || '',
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
        createdByEmail: auth.currentUser.email,
        createdByName: auth.currentUser.displayName || ''
      });
      closeModal('addModal');
      showToast('تم إرسال الإعلان للمراجعة.');
      qs('previewGrid').innerHTML = '';
      qs('imageFile').value = '';
    }catch(err){
      alert('تعذر إرسال الإعلان: ' + (err.code || err.message));
    }
  });

  qs('applyFilterBtn')?.addEventListener('click', () => {
    const q = qs('searchInput').value.toLowerCase().trim();
    const brand = qs('brandFilter').value.toLowerCase();
    const city = qs('cityFilter').value.toLowerCase();
    const sort = qs('sortFilter').value;

    let filtered = state.listings.filter(item => {
      const hay = `${item.title} ${item.brand} ${item.model} ${item.city}`.toLowerCase();
      return (!q || hay.includes(q)) &&
        (!brand || (item.brand || '').toLowerCase() === brand) &&
        (!city || (item.city || '').toLowerCase() === city);
    });

    if(sort === 'priceAsc') filtered.sort((a,b) => Number(a.price||0) - Number(b.price||0));
    if(sort === 'priceDesc') filtered.sort((a,b) => Number(b.price||0) - Number(a.price||0));
    if(sort === 'newest') filtered.sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));

    const latestGrid = qs('listingsGrid');
    latestGrid.innerHTML = '';
    if(!filtered.length) latestGrid.innerHTML = '<div class="empty">لا توجد نتائج مطابقة.</div>';
    else filtered.forEach(item => latestGrid.appendChild(buildCard(item)));
  });
}

start().catch(err => {
  console.error(err);
  showToast('تعذر تشغيل الموقع.');
});
