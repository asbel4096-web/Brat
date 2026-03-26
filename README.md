# براتشو كار - نسخة Firebase مع تسجيل دخول وموافقة الإعلانات

هذه نسخة جاهزة كنقطة بداية لموقع سيارات شبيه بالسوق المفتوح لكن بهوية براتشو كار.

## الموجود داخل النسخة
- تسجيل دخول وإنشاء حساب بالبريد وكلمة المرور
- إضافة إعلان سيارة
- رفع صورة إلى Firebase Storage
- حفظ بيانات الإعلان في Firestore
- حالة الإعلان: `pending` ثم `approved`
- لوحة إدارة لموافقة أو رفض الإعلانات
- وضع تجريبي يشتغل حتى قبل ربط Firebase

## الملفات
- `index.html`
- `styles.css`
- `app.js`
- `firebase-config.js`

## 1) أنشئ مشروع Firebase
فعّل الخدمات التالية:
- Authentication > Email/Password
- Firestore Database
- Storage

## 2) ضع بيانات المشروع
افتح `firebase-config.js` وضع بيانات مشروعك.

## 3) ضع بريد الأدمن
داخل `adminEmails` أضف بريدك:
```js
export const adminEmails = [
  "your@email.com"
];
```

## 4) قواعد Firestore مبدئية للتجربة
انسخ هذه القواعد ثم عدلها لاحقًا بشكل أكثر أمانًا:
```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /listings/{listingId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}
```

## 5) قواعد Storage مبدئية للتجربة
```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cars/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 6) الرفع على GitHub Pages
- غيّر اسم الصفحة الرئيسية إلى `index.html`
- ارفع الملفات للمستودع
- فعّل GitHub Pages
- اربط الدومين

## مهم
هذه النسخة بداية قوية، لكنها ليست نظام معارض كامل بعد. التطوير القادم الممكن:
- Google Sign-In
- حسابات معارض
- رسائل داخلية
- تفعيل واتساب
- لوحة إدارة منفصلة
- تأكيد الهاتف
- بحث متقدم
