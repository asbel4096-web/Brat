import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

export const firebaseSettings = {
  apiKey: 'AIzaSyDsZF0lFIBHFbZEs0W456Mvvmng-JrvtBE',
  authDomain: 'bratsho-car.firebaseapp.com',
  projectId: 'bratsho-car',
  storageBucket: 'bratsho-car.firebasestorage.app',
  messagingSenderId: '320104607081',
  appId: '1:320104607081:web:1f25ac69df065c4d7921f8'
};

export const app = initializeApp(firebaseSettings);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const adminEmails = ['bzcars6@gmail.com'];
