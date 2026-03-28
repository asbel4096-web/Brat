import { initFirebase, qs, showToast, formatPrice, formatDate } from './common.js';

async function start(){
  const fb = await initFirebase();
  const { auth, db, adminEmails, onAuthStateChanged, signOut, collection, getDocs, query, where, deleteDoc, doc } = fb;

  onAuthStateChanged(auth, async user => {
    if(!user) {
      location.href = 'index.html';
      return;
    }
    qs('adminLink')?.classList.toggle('hidden', !adminEmails.includes(user.email));

    const snap = await getDocs(query(collection(db, 'listings'), where('createdByEmail','==', user.email)));
    const rows = snap.docs.map(d => ({ ...d.data(), id: d.id })).sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
    const tbody = qs('myListingsTable');
    if(!rows.length){
      tbody.innerHTML = '<tr><td colspan="5"><div class="empty">لا توجد إعلانات لك بعد.</div></td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(item => `
      <tr>
        <td><strong>${item.title || '-'}</strong><div class="hint">${item.city || ''}</div></td>
        <td>${formatPrice(item.price)}</td>
        <td><span class="badge ${item.status || 'pending'}">${item.status === 'approved' ? 'منشور' : item.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}</span></td>
        <td>${formatDate(item.createdAt)}</td>
        <td>
          <a class="outline-btn" href="details.html?id=${item.id}">فتح</a>
          <button class="ghost-btn" data-del="${item.id}">حذف</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', async () => {
      if(!confirm('حذف الإعلان؟')) return;
      await deleteDoc(doc(db, 'listings', btn.dataset.del));
      showToast('تم حذف الإعلان.');
      location.reload();
    }));
  });

  qs('logoutBtn')?.addEventListener('click', async () => {
    await signOut(auth);
    location.href = 'index.html';
  });
}

start().catch(err => {
  console.error(err);
  showToast('تعذر تحميل لوحة المستخدم.');
});
