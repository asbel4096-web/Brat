import { firebaseSettings, adminEmails } from './firebase-config.js';

const demoListings = [
  {
    id: 'demo-1', title: 'هيونداي توسان 2023', brand: 'Hyundai', model: 'Tucson', year: 2023,
    price: 118000, mileage: '33,000 كم', city: 'طرابلس', phone: '0910000000',
    description: 'سيارة عائلية ممتازة، وارد حديث، شاشة، كاميرا، بصمة، حالة ممتازة.',
    imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80', status: 'approved'
  },
  {
    id: 'demo-2', title: 'كيا K7 2015', brand: 'Kia', model: 'K7', year: 2015,
    price: 64000, mileage: '120,000 كم', city: 'مصراتة', phone: '0920000000',
    description: 'فل أوبشن، بصمة، شاشة، كاميرا خلفية، نظيفة جدًا.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', status: 'approved'
  }
];

const toastEl = document.getElementById('toast');
const listingsGrid = document.getElementById('listingsGrid');
const pendingList = document.getElementById('pendingList');
const approvedCount = document.getElementById('approvedCount');
const pendingCount = document.getElementById('pendingCount');
const userState = document.getElementById('userState');
const logoutBtn = document.getElementById('logoutBtn');

const state = {
  user: null,
  isAdmin: false,
  firebaseEnabled: false,
  listings: [...demoListings],
  pending: []
};

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.remove('hidden');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.add('hidden'), 2600);
}

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function formatPrice(n) {
  return new Intl.NumberFormat('en-US').format(Number(n || 0)) + ' د.ل';
}

function renderListings(items = state.listings) {
  listingsGrid.innerHTML = '';
  const approved = items.filter(i => i.status === 'approved');

  approved.forEach(item => {
    const card = document.createElement('article');
    card.className = 'listing-card';
    card.innerHTML = `
      <div class="listing-image" style="background-image:url('${item.imageUrl || ''}')"></div>
      <div class="listing-body">
        <span class="badge">منشور</span>
        <div class="price">${formatPrice(item.price)}</div>
        <div class="title">${item.title}</div>
        <div class="meta">
          <span>${item.city || ''}</span>
          <span>${item.mileage || ''}</span>
          <span>${item.year || ''}</span>
        </div>
        <div class="desc">${item.description || ''}</div>
      </div>
    `;
    listingsGrid.appendChild(card);
  });

  approvedCount.textContent = approved.length;
}

function renderPending() {
  pendingList.innerHTML = '';

  state.pending.forEach(item => {
    const row = document.createElement('div');
    row.className = 'admin-item';
    row.innerHTML = `
      <strong>${item.title}</strong>
      <div class="meta">
        <span>${item.city || ''}</span>
        <span>${item.brand || ''}</span>
        <span>${item.model || ''}</span>
        <span>${item.phone || ''}</span>
      </div>
      <div class="desc">${item.description || ''}</div>
      <div class="admin-actions">
        <button class="small-btn approve" data-action="approve" data-id="${item.id}">موافقة</button>
        <button class="small-btn reject" data-action="reject" data-id="${item.id}">رفض</button>
      </div>
    `;
    pendingList.appendChild(row);
  });

  pendingCount.textContent = state.pending.length;
}

function updateUserUI() {
  if (state.user) {
    userState.textContent = state.isAdmin ? 'أدمن' : 'مسجل';
    logoutBtn.classList.remove('hidden');
  } else {
    userState.textContent = 'زائر';
    logoutBtn.classList.add('hidden');
  }
}

function switchAuthTab(tab) {
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.authTab === tab);
  });
  document.getElementById('loginFormWrap').classList.toggle('hidden', tab !== 'login');
  document.getElementById('registerFormWrap').classList.toggle('hidden', tab !== 'register');
}

function getFormData() {
  return {
    id: 'local-' + Date.now(),
    title: document.getElementById('title').value.trim(),
    brand: document.getElementById('brand').value.trim(),
    model: document.getElementById('model').value.trim(),
    year: document.getElementById('year').value.trim(),
    price: document.getElementById('price').value.trim(),
    mileage: document.getElementById('mileage').value.trim(),
    city: document.getElementById('city').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    description: document.getElementById('description').value.trim(),
    status: 'pending'
  };
}

function validateForm(data) {
  return data.title && data.brand && data.model && data.year && data.price && data.city && data.phone;
}

function bindStaticUI() {
  document.getElementById('openAuthBtn').addEventListener('click', () => openModal('authModal'));
  document.getElementById('openAddBtn').addEventListener('click', () => openModal('addModal'));
  document.getElementById('openAddHeroBtn').addEventListener('click', () => openModal('addModal'));
  document.getElementById('openAdminBtn').addEventListener('click', () => openModal('adminModal'));

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });

  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => switchAuthTab(btn.dataset.authTab));
  });

  document.getElementById('applyFilterBtn').addEventListener('click', () => {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    const brand = document.getElementById('brandFilter').value.toLowerCase();
    const city = document.getElementById('cityFilter').value.toLowerCase();

    const filtered = state.listings
      .filter(item => item.status === 'approved')
      .filter(item => {
        const hay = `${item.title} ${item.brand} ${item.model} ${item.city}`.toLowerCase();
        return (!q || hay.includes(q)) &&
               (!brand || (item.brand || '').toLowerCase() === brand) &&
               (!city || (item.city || '').toLowerCase() === city);
      });

    renderListings(filtered);
  });

  renderListings();
  renderPending();
  updateUserUI();
}

function initLocalHandlers() {
  document.getElementById('registerBtn').addEventListener('click', () => {
    state.user = { email: document.getElementById('registerEmail').value || 'demo@user.com' };
    state.isAdmin = adminEmails.includes(state.user.email);
    updateUserUI();
    closeModal('authModal');
    showToast('تم إنشاء حساب تجريبي.');
  });

  document.getElementById('loginBtn').addEventListener('click', () => {
    state.user = { email: document.getElementById('loginEmail').value || 'demo@user.com' };
    state.isAdmin = adminEmails.includes(state.user.email);
    updateUserUI();
    closeModal('authModal');
    renderPending();
    showToast('تم تسجيل الدخول التجريبي.');
  });

  logoutBtn.addEventListener('click', () => {
    state.user = null;
    state.isAdmin = false;
    updateUserUI();
    showToast('تم تسجيل الخروج.');
  });

  document.getElementById('submitListingBtn').addEventListener('click', () => {
    if (!state.user) return openModal('authModal');

    const data = getFormData();
    if (!validateForm(data)) return showToast('أكمل الحقول المطلوبة.');

    state.pending.unshift(data);
    renderPending();
    closeModal('addModal');
    showToast('تم إرسال الإعلان في الوضع التجريبي.');
  });

  pendingList.addEventListener('click', e => {
    const btn = e.target.closest('button[data-action]');
    if (!btn || !state.isAdmin) return showToast('هذه اللوحة للأدمن فقط.');

    const item = state.pending.find(x => x.id === btn.dataset.id);
    if (!item) return;

    if (btn.dataset.action === 'approve') {
      item.status = 'approved';
      state.listings.unshift(item);
      renderListings();
    }

    state.pending = state.pending.filter(x => x.id !== btn.dataset.id);
    renderPending();
  });
}

async function tryFirebaseInit() {
  const invalid = Object.values(firebaseSettings).some(v => String(v).startsWith('PUT_YOUR'));
  if (invalid) {
    throw new Error('Firebase config missing');
  }

  const [
    { initializeApp },
    { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile },
    { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, where, updateDoc, doc, deleteDoc },
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
  state.firebaseEnabled = true;

  async function loadListings() {
    const approvedSnap = await getDocs(
      query(collection(db, 'listings'), where('status', '==', 'approved'))
    );
    state.listings = approvedSnap.docs.map(d => ({ ...d.data(), id: d.id }));
    renderListings();
  }

  async function loadPending() {
    if (!state.isAdmin) {
      state.pending = [];
      renderPending();
      return;
    }

    const pendingSnap = await getDocs(
      query(collection(db, 'listings'), where('status', '==', 'pending'))
    );
    state.pending = pendingSnap.docs.map(d => ({ ...d.data(), id: d.id }));
    renderPending();
  }

  onAuthStateChanged(auth, async user => {
    state.user = user;
    state.isAdmin = !!(user && adminEmails.includes(user.email));
    updateUserUI();
    await loadListings();
    await loadPending();
  });

  document.getElementById('registerBtn').addEventListener('click', async () => {
    try {
      const name = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value.trim();

      if (!name || !email || !password) return showToast('املأ كل الحقول.');

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      closeModal('authModal');
      showToast('تم إنشاء الحساب.');
    } catch (err) {
      console.error(err);
      showToast('تعذر إنشاء الحساب: ' + (err.code || err.message));

  document.getElementById('loginBtn').addEventListener('click', async () => {
    try {
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      if (!email || !password) return showToast('أدخل البريد وكلمة المرور.');

      await signInWithEmailAndPassword(auth, email, password);
      closeModal('authModal');
      showToast('تم تسجيل الدخول.');
    } catch (err) {
      console.error(err);
      showToast('فشل تسجيل الدخول.');

  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      showToast('تم تسجيل الخروج.');
    } catch (err) {
      console.error(err);
      showToast('تعذر إنشاء الحساب.');
  document.getElementById('submitListingBtn').addEventListener('click', async () => {
    try {
      if (!auth.currentUser) return openModal('authModal');

      const data = getFormData();
      if (!validateForm(data)) return showToast('أكمل الحقول المطلوبة.');

      const file = document.getElementById('imageFile').files[0];
      let imageUrl = '';

      if (file) {
        const fileRef = ref(storage, `cars/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        imageUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, 'listings'), {
        ...data,
        imageUrl,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
        createdByEmail: auth.currentUser.email,
        createdByName: auth.currentUser.displayName || ''
      });

      closeModal('addModal');
      showToast('تم إرسال الإعلان للمراجعة.');
      await loadPending();
    } catch (err) {
      console.error(err);
      showToast('تعذر إرسال الإعلان.');
    }
  });

  pendingList.addEventListener('click', async e => {
    try {
      const btn = e.target.closest('button[data-action]');
      if (!btn || !state.isAdmin) return;

      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === 'approve') {
        await updateDoc(doc(db, 'listings', id), { status: 'approved' });
        showToast('تمت الموافقة على الإعلان.');
      } else {
        await deleteDoc(doc(db, 'listings', id));
        showToast('تم حذف الإعلان المرفوض.');
      }

      await loadListings();
      await loadPending();
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء تحديث الإعلان.');
    }
  });

  await loadListings();
  await loadPending();
}

bindStaticUI();
tryFirebaseInit().catch(err => {
  console.error(err);
  initLocalHandlers();
  showToast('تم تشغيل الوضع التجريبي.');
});
