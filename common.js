import { auth, db, storage } from './firebase-config.js';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  initializeFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

const STORAGE_KEY = 'bratsho_ads_v2_cache';
const OWNER_KEY = 'bratsho_owner_id';
const COLLECTION_NAME = 'listings';
const FAVORITES_KEY = 'bratsho_favorites_v1';

export const listings = [
  {
    id: '1', type: 'سيارة', title: 'هيونداي سوناتا 2016 فل رقم 1', price: 37772, city: 'طرابلس', year: '2016', km: '95,000 كم', seller: 'يونس البراتشو', sellerInitial: 'ي', phone: '0910000000', whatsapp: '218910000000', desc: 'فل رقم 1، بوش أصلي، صالون ممتاز، جاهزة بدون مصاريف.', cover: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'], createdAt: 'الآن', createdTs: Date.now() - 3600000
  },
  {
    id: '2', type: 'قطعة غيار', title: 'كمبيو كيا أوبتيما 2014', price: 4500, city: 'مصراتة', year: '2014', km: 'قطعة مستعملة', seller: 'مخزن البراتشو', sellerInitial: 'ب', phone: '0910000000', whatsapp: '218910000000', desc: 'كمبيو نظيف ومجرب، مناسب لعدة فئات، جاهز للتركيب.', cover: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80', images: ['https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80'], createdAt: 'الآن', createdTs: Date.now() - 7200000
  },
  {
    id: '3', type: 'خدمة', title: 'ميكانيكي متنقل - فحص كمبيوتر', price: 120, city: 'طرابلس', year: 'خدمة', km: 'زيارة منزلية', seller: 'فني البراتشو', sellerInitial: 'ف', phone: '0910000000', whatsapp: '218910000000', desc: 'فحص أعطال، كهرباء خفيفة، خدمة سريعة داخل طرابلس.', cover: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80', images: ['https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80'], createdAt: 'الآن', createdTs: Date.now() - 10800000
  }
];

export const messages = [
  {name:'محمد', initial:'م', unread:2, time:'منذ 5 دقائق', text:'السلام عليكم، السيارة موجودة؟'},
  {name:'أحمد', initial:'أ', unread:0, time:'منذ 20 دقيقة', text:'نبي تفاصيل أكثر على القطعة'},
  {name:'سالم', initial:'س', unread:1, time:'منذ ساعة', text:'ممكن رقم الواتساب؟'}
];

let remoteCache = null;
let remoteLoadedAt = 0;
let authReadyResolved = false;
let currentUserCache = null;
let authReadyResolver;
const authReady = new Promise(resolve => { authReadyResolver = resolve; });

onAuthStateChanged(auth, user => {
  currentUserCache = user || null;
  if (!authReadyResolved) {
    authReadyResolved = true;
    authReadyResolver(user || null);
  }
});

export async function waitForAuthReady(){
  return authReady;
}

export function subscribeAuthState(callback){
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(){
  return auth.currentUser || currentUserCache || null;
}

export function isLoggedIn(){
  return !!getCurrentUser();
}

export async function signUpWithEmail(email, password){
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithEmail(email, password){
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signOutUser(){
  await signOut(auth);
}

export function getOwnerId(){
  const user = getCurrentUser();
  if (user?.uid) return user.uid;
  let ownerId = localStorage.getItem(OWNER_KEY);
  if (!ownerId) {
    ownerId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(OWNER_KEY, ownerId);
  }
  return ownerId;
}

export function getUserLabel(){
  const user = getCurrentUser();
  if (!user) return 'زائر';
  return user.email || 'مستخدم';
}

function getFavoriteCache(){
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); } catch { return []; }
}

function setFavoriteCache(ids){
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(new Set((ids || []).map(String)))));
}

let favoriteIdsCache = getFavoriteCache();

export async function getFavoriteIds(force = false){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) {
    favoriteIdsCache = [];
    setFavoriteCache([]);
    return [];
  }
  if (!force && favoriteIdsCache.length) return favoriteIdsCache;
  try {
    const snap = await getDocs(collection(db, 'users', user.uid, 'favorites'));
    favoriteIdsCache = snap.docs.map(d => String(d.id));
    setFavoriteCache(favoriteIdsCache);
    return favoriteIdsCache;
  } catch (err) {
    console.warn('Favorites fallback', err);
    favoriteIdsCache = getFavoriteCache();
    return favoriteIdsCache;
  }
}

export async function applyFavorites(items = []){
  const ids = new Set(await getFavoriteIds());
  return (items || []).map(item => ({ ...item, __favorite: ids.has(String(item.id)) }));
}

export async function isFavorite(id){
  const ids = await getFavoriteIds();
  return ids.includes(String(id));
}

export async function toggleFavorite(itemOrId){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) throw new Error('auth_required');
  const item = typeof itemOrId === 'object' ? itemOrId : await detailById(itemOrId);
  if (!item) throw new Error('not_found');
  const favRef = doc(db, 'users', user.uid, 'favorites', String(item.id));
  const exists = favoriteIdsCache.includes(String(item.id));
  if (exists) {
    await deleteDoc(favRef);
    favoriteIdsCache = favoriteIdsCache.filter(x => x !== String(item.id));
  } else {
    await setDoc(favRef, {
      listingId: String(item.id),
      title: String(item.title || ''),
      cover: String(item.cover || ''),
      createdTs: Date.now(),
      ownerId: String(item.ownerId || '')
    }, { merge: true });
    favoriteIdsCache = [String(item.id), ...favoriteIdsCache.filter(x => x !== String(item.id))];
  }
  setFavoriteCache(favoriteIdsCache);
  return !exists;
}

export async function getFavoriteListings(){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) return [];
  const ids = await getFavoriteIds(true);
  if (!ids.length) return [];
  const all = await getAllListings(true, { includeHidden: false });
  const map = new Map(all.map(x => [String(x.id), x]));
  return ids.map(id => map.get(String(id))).filter(Boolean).map(x => ({ ...x, __favorite: true }));
}

export function bindFavoriteButtons(root = document){
  root.querySelectorAll('.js-favorite').forEach(btn => {
    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.id;
      btn.disabled = true;
      try {
        const next = await toggleFavorite(id);
        btn.classList.toggle('is-favorite', next);
        btn.setAttribute('aria-pressed', next ? 'true' : 'false');
        btn.textContent = next ? '♥' : '♡';
      } catch (err) {
        if (err?.message === 'auth_required') {
          location.href = 'dashboard.html#auth-required';
          return;
        }
        alert('تعذر تحديث المفضلة');
      } finally {
        btn.disabled = false;
      }
    });
  });
}

export function price(v){
  const n = Number(v || 0);
  return n.toLocaleString('en-US') + ' د.ل';
}

export function safeText(value=''){
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function normalizeWhatsapp(raw=''){
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('218')) return digits;
  if (digits.startsWith('0')) return '218' + digits.slice(1);
  return digits;
}

export function makeMapsUrl(city=''){
  const q = encodeURIComponent(city || 'ليبيا');
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function getStorage(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function setStorage(items){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function mergeUnique(...lists){
  const map = new Map();
  lists.flat().forEach(item => {
    if (!item?.id) return;
    map.set(String(item.id), item);
  });
  return Array.from(map.values()).sort((a, b) => Number(b.createdTs || 0) - Number(a.createdTs || 0));
}

function normalizeIncoming(item = {}){
  const createdTs = Number(item.createdTs || item.createdAtMs || Date.now());
  return {
    id: String(item.id || `u_${createdTs}`),
    type: item.type || 'سيارة',
    title: item.title || 'إعلان',
    price: Number(item.price || 0),
    city: item.city || 'طرابلس',
    year: item.year || 'غير محدد',
    km: item.km || 'غير محدد',
    seller: item.seller || 'براتشو كار',
    sellerInitial: (item.sellerInitial || item.seller || 'ب').charAt(0),
    phone: item.phone || '',
    whatsapp: normalizeWhatsapp(item.whatsapp || item.phone || ''),
    desc: item.desc || '',
    cover: item.cover || 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',
    images: Array.isArray(item.images) && item.images.length ? item.images : (item.cover ? [item.cover] : []),
    createdTs,
    createdAt: item.createdAt || formatRelativeArabic(createdTs),
    ownerId: item.ownerId || '',
    status: item.status || 'active'
  };
}

export async function getRemoteListings(force = false){
  if (!force && remoteCache && (Date.now() - remoteLoadedAt) < 20000) return remoteCache;
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdTs', 'desc'), limit(60));
    const snap = await getDocs(q);
    remoteCache = snap.docs.map(d => normalizeIncoming({ id: d.id, ...d.data() }));
    remoteLoadedAt = Date.now();
    return remoteCache;
  } catch (err) {
    console.warn('Firestore read fallback to local cache', err);
    remoteCache = getStorage().map(normalizeIncoming);
    remoteLoadedAt = Date.now();
    return remoteCache;
  }
}

export async function getAllListings(force = false, { includeHidden = false } = {}){
  const remote = await getRemoteListings(force);
  const merged = mergeUnique(remote, listings.map(x => ({ ...x, status: x.status || 'active' })));
  return includeHidden ? merged : merged.filter(x => (x.status || 'active') !== 'hidden');
}

export async function getUserListings(force = false, { includeHidden = true } = {}){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) return [];
  try {
    const q = query(collection(db, COLLECTION_NAME), where('ownerId', '==', user.uid), orderBy('createdTs', 'desc'), limit(60));
    const snap = await getDocs(q);
    const own = snap.docs.map(d => normalizeIncoming({ id: d.id, ...d.data() }));
    setStorage(own);
    return includeHidden ? own : own.filter(x => (x.status || 'active') !== 'hidden');
  } catch (err) {
    console.warn('Owner query fallback', err);
    const own = getStorage().map(normalizeIncoming).filter(x => x.ownerId === user.uid);
    return includeHidden ? own : own.filter(x => (x.status || 'active') !== 'hidden');
  }
}

export async function detailById(id){
  try {
    const ref = doc(db, COLLECTION_NAME, String(id));
    const snap = await getDoc(ref);
    if (snap.exists()) return normalizeIncoming({ id: snap.id, ...snap.data() });
  } catch (err) {
    console.warn('Firestore detail fallback', err);
  }
  const all = await getAllListings();
  return all.find(x => String(x.id) === String(id)) || all[0];
}

export async function updateListingStatus(id, status='hidden'){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) throw new Error('auth_required');
  const current = await detailById(id);
  if (!current || current.ownerId !== user.uid) throw new Error('not_owner');
  const local = getStorage();
  setStorage(local.map(x => String(x.id) === String(id) ? { ...x, status } : x));
  await updateDoc(doc(db, COLLECTION_NAME, String(id)), { status, updatedAt: serverTimestamp() });
  if (remoteCache) remoteCache = remoteCache.map(x => String(x.id) === String(id) ? { ...x, status } : x);
  return true;
}

export async function removeListing(id){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) throw new Error('auth_required');
  const current = await detailById(id);
  if (!current || current.ownerId !== user.uid) throw new Error('not_owner');
  const local = getStorage();
  setStorage(local.filter(x => String(x.id) !== String(id)));
  await removeListingImages(current.images || []);
  await deleteDoc(doc(db, COLLECTION_NAME, String(id)));
  if (remoteCache) remoteCache = remoteCache.filter(x => String(x.id) !== String(id));
  return true;
}


export async function uploadListingImages(files = [], listingId = ''){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) throw new Error('auth_required');
  const picked = Array.from(files || []).slice(0, 20);
  const urls = [];
  for (const file of picked) {
    const cleanName = String(file.name || 'image.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileRef = ref(storage, `listing-images/${user.uid}/${listingId}/${Date.now()}_${Math.random().toString(36).slice(2,8)}_${cleanName}`);
    const snap = await uploadBytes(fileRef, file, { contentType: file.type || 'image/jpeg' });
    urls.push(await getDownloadURL(snap.ref));
  }
  return urls;
}

export async function removeListingImages(imageUrls = []){
  const jobs = (imageUrls || [])
    .filter(url => typeof url === 'string' && (url.includes('firebasestorage') || url.includes('storage.googleapis.com')))
    .map(async url => {
      try {
        await deleteObject(ref(storage, url));
      } catch (err) {
        console.warn('Storage delete skipped', err);
      }
    });
  await Promise.all(jobs);
}

export async function saveListing(data){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) throw new Error('auth_required');
  const normalized = normalizeIncoming({ ...data, ownerId: user.uid, status: data.status || 'active' });
  const currentLocal = getStorage().filter(x => String(x.id) !== normalized.id);
  setStorage([normalized, ...currentLocal]);
  await setDoc(doc(db, COLLECTION_NAME, normalized.id), {
    ...normalized,
    ownerId: user.uid,
    ownerEmail: user.email || '',
    createdTs: Number(normalized.createdTs || Date.now()),
    createdAtMs: Number(normalized.createdTs || Date.now()),
    updatedAt: serverTimestamp()
  }, { merge: true });
  remoteCache = mergeUnique([normalized], remoteCache || []);
  remoteLoadedAt = Date.now();
  return normalized;
}

export function authGateCard(message='سجّل دخولك أولًا لإدارة الإعلانات والحفظ الحقيقي.', cta='فتح تسجيل الدخول'){
  return `<div class="empty-card"><div class="empty-icon">🔐</div><h3 class="listing-title">الدخول مطلوب</h3><p class="muted">${message}</p><a class="btn btn-primary" href="dashboard.html#auth">${cta}</a></div>`;
}


export async function createOrOpenChat(item){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) throw new Error('auth_required');

  const ownerId = String(item?.ownerId || '').trim();
  const listingId = String(item?.id || '').trim();

  if (!ownerId) throw new Error('owner_missing');
  if (!listingId) throw new Error('listing_missing');
  if (ownerId === user.uid) throw new Error('self_chat');

  const participants = [String(user.uid), ownerId].sort();
  const chatId = `chat_${listingId}_${participants.join('_')}`;
  const chatRef = doc(db, 'chats', chatId);
  const snap = await getDoc(chatRef);

  const unreadCounts = {
    [ownerId]: snap.exists() ? Number((snap.data().unreadCounts || {})[ownerId] || 0) : 0,
    [String(user.uid)]: 0
  };

  const payload = {
    id: chatId,
    listingId,
    listingTitle: String(item?.title || 'محادثة'),
    listingCover: String(item?.cover || ''),
    ownerId,
    ownerEmail: String(item?.ownerEmail || ''),
    buyerId: String(user.uid),
    buyerEmail: String(user.email || ''),
    participants,
    unreadCounts,
    lastMessage: snap.exists() ? String(snap.data().lastMessage || '') : '',
    lastSenderId: snap.exists() ? String(snap.data().lastSenderId || '') : '',
    updatedTs: Date.now(),
    updatedAt: serverTimestamp()
  };

  if (!snap.exists()) {
    await setDoc(chatRef, payload);
  } else {
    await updateDoc(chatRef, {
      participants,
      ownerId,
      ownerEmail: String(item?.ownerEmail || snap.data().ownerEmail || ''),
      buyerId: String(user.uid),
      buyerEmail: String(user.email || ''),
      listingId,
      listingTitle: String(item?.title || snap.data().listingTitle || 'محادثة'),
      listingCover: String(item?.cover || snap.data().listingCover || ''),
      [`unreadCounts.${String(user.uid)}`]: 0,
      updatedTs: Date.now(),
      updatedAt: serverTimestamp()
    });
  }

  return { id: chatId };
}

export async function sendChatMessage(chatId, body){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) throw new Error('auth_required');
  const text = String(body || '').trim();
  if (!text) throw new Error('empty_message');

  const chatRef = doc(db, 'chats', String(chatId));
  const snap = await getDoc(chatRef);
  if (!snap.exists()) throw new Error('chat_missing');

  const chat = snap.data();
  const participants = Array.isArray(chat.participants) ? chat.participants.map(String) : [];
  if (!participants.includes(String(user.uid))) throw new Error('forbidden_chat');

  const otherId = participants.find(id => id !== String(user.uid)) || '';
  const msgCol = collection(db, 'chats', String(chatId), 'messages');

  await addDoc(msgCol, {
    text,
    senderId: String(user.uid),
    senderEmail: String(user.email || ''),
    createdTs: Date.now(),
    createdAt: serverTimestamp()
  });

  const updates = {
    lastMessage: text,
    lastSenderId: String(user.uid),
    [`unreadCounts.${String(user.uid)}`]: 0,
    updatedTs: Date.now(),
    updatedAt: serverTimestamp()
  };
  if (otherId) {
    updates[`unreadCounts.${otherId}`] = increment(1);
  }

  await updateDoc(chatRef, updates);
}


export async function getChatById(chatId){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) throw new Error('auth_required');
  const snap = await getDoc(doc(db, 'chats', String(chatId)));
  if (!snap.exists()) return null;
  const data = { id: snap.id, ...snap.data() };
  if (!Array.isArray(data.participants) || !data.participants.includes(String(user.uid))) {
    throw new Error('forbidden_chat');
  }
  return data;
}

export async function getUserChats(){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) return [];
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', String(user.uid)),
    orderBy('updatedTs', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = { id: d.id, ...d.data() };
    data.unreadCount = Number((data.unreadCounts || {})[String(user.uid)] || 0);
    return data;
  });
}

export async function markChatRead(chatId){
  await waitForAuthReady();
  const user = getCurrentUser();
  if (!user) return;
  await updateDoc(doc(db, 'chats', String(chatId)), {
    [`unreadCounts.${String(user.uid)}`]: 0
  });
}

export function watchUnreadTotal(callback){
  const user = getCurrentUser();
  if (!user) {
    callback(0);
    return () => {};
  }
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', String(user.uid)),
    orderBy('updatedTs', 'desc'),
    limit(50)
  );
  return onSnapshot(q, snap => {
    const total = snap.docs.reduce((sum, d) => {
      const data = d.data() || {};
      return sum + Number((data.unreadCounts || {})[String(user.uid)] || 0);
    }, 0);
    callback(total);
  }, () => callback(0));
}

export function watchChatMessages(chatId, callback){
  const q = query(
    collection(db, 'chats', String(chatId), 'messages'),
    orderBy('createdTs', 'asc')
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export function pageTemplate({active='home', title='', subtitle='', content=''}) {
  return `
  <div class="app-shell">
    <header class="site-header">
      <div class="brand-wrap">
        <div class="brand-copy">
          <h1 class="brand-title">براتشو <span>كار</span></h1>
          <p class="brand-en">Bratsho Car</p>
          <p class="brand-sub">سوق سيارات وقطع غيار وخدمات متنقلة بتصميم مرتب وسريع</p>
        </div>
        <div class="logo-box">BC</div>
      </div>
      <div class="top-shortcuts">
        <a class="shortcut-card" href="dashboard.html">حسابي <span>👤</span></a>
        <a class="shortcut-card" href="favorites.html">المفضلة <span>♥</span></a>
        <a class="shortcut-card shortcut-card-messages" href="messages.html">دردشاتي <span>💬</span><i class="msg-badge is-hidden" id="msg-badge-top">0</i></a>
        <a class="shortcut-card shortcut-accent" href="add.html">+ أضف إعلان</a>
      </div>
    </header>

    <main class="page-main">
      <section class="page-hero">
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </section>
      ${content}
    </main>

    <nav class="bottom-nav">
      <a href="index.html" class="nav-item ${active==='home'?'is-active':''}"><span>⌂</span><b>الرئيسية</b></a>
      <a href="messages.html" class="nav-item nav-item-messages ${active==='messages'?'is-active':''}"><span>◔</span><b>دردشاتي</b><i class="msg-badge nav-badge is-hidden" id="msg-badge-bottom">0</i></a>
      <a href="add.html" class="nav-item nav-center ${active==='add'?'is-active':''}"><span>＋</span><b>أضف إعلان</b></a>
      <a href="my-ads.html" class="nav-item ${active==='ads'?'is-active':''}"><span>▤</span><b>إعلاناتي</b></a>
      <a href="dashboard.html" class="nav-item ${active==='account'?'is-active':''}"><span>◉</span><b>حسابي</b></a>
    </nav>
  </div>`;
}


export async function mountUnreadBadges(){
  await waitForAuthReady();
  const top = document.getElementById('msg-badge-top');
  const bottom = document.getElementById('msg-badge-bottom');
  const apply = (count) => {
    [top, bottom].forEach(el => {
      if (!el) return;
      const value = Number(count || 0);
      el.textContent = String(value);
      el.classList.toggle('is-hidden', value <= 0);
    });
  };
  const user = getCurrentUser();
  if (!user) {
    apply(0);
    return () => {};
  }
  return watchUnreadTotal(apply);
}

function truncateText(text = '', max = 110){
  const t = String(text || '').trim();
  return t.length > max ? `${t.slice(0, max).trim()}...` : t;
}

export function listingCard(item){
  const wa = normalizeWhatsapp(item.whatsapp || item.phone);
  const phone = String(item.phone || '').replace(/[^\d+]/g,'');
  const whatsappHref = wa ? `https://wa.me/${wa}` : `https://wa.me/218910000000`;
  const phoneHref = phone ? `tel:${phone}` : `tel:+218910000000`;
  const favIcon = item.__favorite ? '♥' : '♡';
  return `
  <article class="listing-card listing-card-upgraded">
    <a class="listing-image" href="details.html?id=${safeText(item.id)}">
      <img src="${safeText(item.cover)}" alt="${safeText(item.title)}">
      <span class="badge dark">${safeText(item.type)}</span>
      <button type="button" class="icon-btn js-favorite card-fav ${item.__favorite ? 'is-favorite' : ''}" data-id="${safeText(item.id)}" aria-pressed="${item.__favorite ? 'true' : 'false'}" title="المفضلة">${favIcon}</button>
    </a>
    <div class="listing-body">
      <div class="listing-topline">
        <div class="listing-price">${price(item.price)}</div>
        <span class="mini-pill">${safeText(item.city)}</span>
      </div>
      ${(item.status || 'active') === 'hidden' ? '<div class="muted" style="margin-bottom:6px;color:#c97700;font-weight:800">مخفي من العرض العام</div>' : ''}
      <h3 class="listing-title"><a href="details.html?id=${safeText(item.id)}">${safeText(item.title)}</a></h3>
      <p class="listing-desc">${safeText(truncateText(item.desc, 95))}</p>
      <div class="listing-meta">
        <span>${safeText(item.year || '')}</span>
        <span>${safeText(item.km || '')}</span>
        <span>${safeText(item.seller || 'براتشو')}</span>
      </div>
      <div class="listing-actions">
        <a class="btn btn-primary" href="details.html?id=${safeText(item.id)}">عرض</a>
        <a class="btn btn-soft" target="_blank" href="${whatsappHref}">واتساب</a>
        <a class="icon-btn" href="${phoneHref}">☎</a>
      </div>
    </div>
  </article>`;
}

export function categoryCard(icon, title, desc, href){
  return `<a class="category-card" href="${href}"><i>${icon}</i><div><h3>${title}</h3><p>${desc}</p></div></a>`;
}

export function customSelect(label, selected, items, id){
  const options = items.map((item, idx)=>`
    <button type="button" class="option ${item===selected || (idx===0 && !selected)?'is-selected':''}" data-value="${item}">${item}</button>`).join('');
  return `
    <div class="custom-select" data-select="${id}">
      <label>${label}</label>
      <button type="button" class="select-trigger"><span>${selected}</span><i>⌄</i></button>
      <input type="hidden" name="${id}" value="${selected}">
      <div class="select-menu">${options}</div>
    </div>`;
}

export function activateCustomSelects(root=document){
  root.querySelectorAll('.custom-select').forEach(select=>{
    const trigger = select.querySelector('.select-trigger');
    const menu = select.querySelector('.select-menu');
    const hidden = select.querySelector('input[type="hidden"]');
    if (select.dataset.bound === '1') return;
    select.dataset.bound = '1';
    trigger?.addEventListener('click', e=>{
      e.stopPropagation();
      root.querySelectorAll('.custom-select.is-open').forEach(other=>{ if(other!==select) other.classList.remove('is-open'); });
      select.classList.toggle('is-open');
    });
    menu?.querySelectorAll('.option').forEach(opt=>{
      opt.addEventListener('click', ()=>{
        menu.querySelectorAll('.option').forEach(o=>o.classList.remove('is-selected'));
        opt.classList.add('is-selected');
        const value = opt.dataset.value;
        trigger.querySelector('span').textContent = value;
        if (hidden) hidden.value = value;
        select.classList.remove('is-open');
      });
    });
  });
  if (!document.body.dataset.selectGlobalBound) {
    document.body.dataset.selectGlobalBound = '1';
    document.addEventListener('click', ()=>{
      document.querySelectorAll('.custom-select.is-open').forEach(s=>s.classList.remove('is-open'));
    });
  }
}

export function fileToDataUrl(file, maxW = 840, quality = 0.68) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatRelativeArabic(ts){
  const diff = Math.max(0, Date.now() - Number(ts || 0));
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} يوم`;
}
