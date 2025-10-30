# 🔧 إصلاح مشكلة صلاحيات Firestore

## ❌ المشكلة:
```
FirebaseError: Missing or insufficient permissions.
```

هذا الخطأ يعني أن قواعد Firestore لا تسمح بالقراءة أو الكتابة.

---

## ✅ الحل:

### الخطوة 1️⃣: اذهب إلى Firebase Console

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. من القائمة الجانبية، اختر **Firestore Database**
4. اضغط على تبويب **Rules** (القواعد)

---

### الخطوة 2️⃣: استبدل القواعد بهذه القواعد:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // قواعد المشاريع الرئيسية
    match /projects/{projectId} {
      // السماح بالقراءة للجميع
      allow read: if true;
      
      // السماح بالكتابة فقط للمستخدمين المسجلين
      allow create, update, delete: if request.auth != null;
    }
    
    // قواعد المشاريع المحفوظة
    match /savedProjects/{docId} {
      // السماح بالقراءة والكتابة للمستخدم صاحب المشروع فقط
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      
      // السماح بالإنشاء للمستخدمين المسجلين
      allow create: if request.auth != null;
    }
    
    // قواعد عامة لأي مجموعة أخرى (اختياري)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

### الخطوة 3️⃣: انشر القواعد

1. بعد لصق القواعد، اضغط على **Publish** (نشر)
2. انتظر بضع ثوانٍ حتى يتم تطبيق القواعد

---

## 🔐 شرح القواعد:

### للمشاريع (`projects`):
- ✅ **القراءة**: مسموحة للجميع (حتى بدون تسجيل دخول)
- ✅ **الكتابة**: فقط للمستخدمين المسجلين

### للمشاريع المحفوظة (`savedProjects`):
- ✅ **القراءة/الكتابة**: فقط لصاحب المشروع
- ✅ **الإنشاء**: للمستخدمين المسجلين

---

## 🚀 للتطوير فقط (غير آمن):

إذا كنت في مرحلة التطوير وتريد السماح بكل شيء مؤقتاً:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **تحذير**: هذه القواعد غير آمنة! استخدمها فقط للتطوير ولفترة محدودة.

---

## ✅ بعد تطبيق القواعد:

1. أعد تحميل الصفحة
2. حاول إضافة مشروع مرة أخرى
3. يجب أن يعمل بدون مشاكل!

---

## 🔍 التحقق من القواعد:

في Firebase Console، يمكنك اختبار القواعد:
1. اذهب إلى تبويب **Rules**
2. اضغط على **Rules Playground**
3. اختبر العمليات المختلفة

---

## 📝 ملاحظات:

- تأكد من تسجيل الدخول قبل محاولة إضافة مشروع
- القواعد تحتاج بضع ثوانٍ للتطبيق بعد النشر
- إذا استمرت المشكلة، تحقق من أن المستخدم مسجل دخول بالفعل

---

## 🎯 القواعد الموصى بها للإنتاج:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // دالة مساعدة للتحقق من المسؤول
    function isAdmin() {
      return request.auth != null && 
        request.auth.token.email in [
          'mahmoud@example.com',
          'admin@tolzy.com'
        ];
    }
    
    // المشاريع - قراءة للجميع، كتابة للمسؤولين فقط
    match /projects/{projectId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // المشاريع المحفوظة - للمستخدمين المسجلين فقط
    match /savedProjects/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

هذه القواعد أكثر أماناً لأنها:
- ✅ تسمح فقط للمسؤولين بإضافة/تعديل/حذف المشاريع
- ✅ تسمح للمستخدمين بحفظ مشاريعهم فقط
- ✅ تسمح للجميع بقراءة المشاريع

---

## 🔧 إذا استمرت المشكلة:

1. تأكد من أن Firebase مفعّل في المشروع
2. تحقق من ملف `.env` وأن جميع المتغيرات صحيحة
3. تأكد من تسجيل الدخول قبل محاولة إضافة مشروع
4. افتح Console في المتصفح وتحقق من الأخطاء
5. تأكد من أن Firestore Database مفعّل (وليس Realtime Database)

---

**بعد تطبيق هذه القواعد، يجب أن تعمل إضافة المشاريع بدون مشاكل! 🚀**
