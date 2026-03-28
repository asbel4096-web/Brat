import { initFirebase, qs, showToast, formatDate } from './common.js';

async function start(){
  const fb = await initFirebase();
  const { auth, db, adminEmails, onAuthStateChanged, collection, getDocs, query, where, updateDoc, deleteDoc, doc } = fb;

  onAuthStateChanged(auth, async user => {
    if(!user || !adminEmails.includes(user.email)) {
      location.href = 'index.html';
      return;
    }

    const snap = await getDocs(query(collection(db, 'listings'), where('status','==','pending')));
    const rows = snap.docs.map(d => ({ ...d.data(), id: d.id })).sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
    const tbody = qs('adminTable');
    if(!rows.length){
      tbody.innerHTML = '<tr><td colspan="4"><div class="empty">لا توجد إعلانات معلقة.</div></td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(item => `
      <tr>
        <td><strong>${item.title || '-'}</strong><div class="hint">${item.city || ''} • ${item.brand || ''} • ${item.model || ''}</div></td>
        <td>${item.createdByName || '-'}<div class="hint">${item.createdByEmail || ''}</div></td>
        <td><span class="badge pending">قيد المراجعة</span></td>
        <td>
          <button class="btn" data-approve="${item.id}">موافقة</button>
          <button class="ghost-btn" data-feature="${item.id}">موافقة + مميز</button>
          <button class="outline-btn" data-reject="${item.id}">رفض</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-approve]').forEach(btn => btn.addEventListener('click', async () => {
      await updateDoc(doc(db, 'listings', btn.dataset.approve), { status: 'approved', featured: false });
      showToast('تمت الموافقة على الإعلان.');
      location.reload();
    }));
    tbody.querySelectorAll('[data-feature]').forEach(btn => btn.addEventListener('click', async () => {
      await updateDoc(doc(db, 'listings', btn.dataset.feature), { status: 'approved', featured: true });
      showToast('تمت الموافقة وجعله مميزًا.');
      location.reload();
    }));
    tbody.querySelectorAll('[data-reject]').forEach(btn => btn.addEventListener('click', async () => {
      if(!confirm('رفض الإعلان؟')) return;
      await updateDoc(doc(db, 'listings', btn.dataset.reject), { status: 'rejected', featured: false });
      showToast('تم رفض الإعلان.');
      location.reload();
    }));
  });
}

start().catch(err => {
  console.error(err);
  showToast('تعذر تحميل لوحة الإدارة.');
});
