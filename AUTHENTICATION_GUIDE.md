# 🔐 دليل نظام المصادقة والإدارة - Tolzy Stack

## ✅ التحديثات المنفذة

تم تنفيذ نظام مصادقة كامل ومتقدم مع إدارة المشاريع عبر Firestore.

---

## 🎯 المميزات المنفذة

### 1️⃣ نظام المصادقة المتقدم

#### ✅ صفحة تسجيل دخول قوية (`/login`)
- **تسجيل الدخول عبر Google** - OAuth مع Firebase
- **تسجيل الدخول عبر GitHub** - OAuth مع Firebase
- **تسجيل الدخول بالبريد وكلمة المرور** - Firebase Email/Password
- **إنشاء حساب جديد** - مع إمكانية إضافة الاسم الكامل
- **واجهة جميلة ومتجاوبة** - تصميم حديث مع أيقونات
- **رسائل نجاح وخطأ** - باستخدام Toast notifications

#### ✅ أيقونة المستخدم في الـ Header
- **صورة المستخدم** - تظهر صورة الملف الشخصي من Google/GitHub
- **Avatar Fallback** - حرف أول من الاسم إذا لم تتوفر صورة
- **قائمة منسدلة** تحتوي على:
  - معلومات المستخدم (الاسم والبريد)
  - لوحة التحكم
  - الإعدادات
  - لوحة المسؤول (للمسؤولين فقط)
  - تسجيل الخروج

---

### 2️⃣ لوحة تحكم المستخدم (`/dashboard`)

#### المميزات:
- **معلومات الملف الشخصي**:
  - صورة المستخدم الكبيرة
  - الاسم والبريد الإلكتروني
  - إحصائيات (عدد المشاريع المحفوظة)

- **تبويبات متعددة**:
  - **المشاريع المحفوظة**: عرض جميع المشاريع التي حفظها المستخدم
  - **المفضلة**: المشاريع المفضلة (جاهز للتطوير)
  - **النشاط**: نشاط المستخدم الأخير (جاهز للتطوير)

- **عرض المشاريع المحفوظة**:
  - بطاقات جميلة مع صور
  - معلومات المشروع (اسم، وصف، لغة)
  - إحصائيات (نجوم، forks)
  - رابط مباشر لصفحة المشروع

---

### 3️⃣ لوحة تحكم المسؤول (`/admin`) 🔒

#### الحماية:
- **محمية بالكامل** - فقط المسؤولين يمكنهم الوصول
- **قائمة المسؤولين** في الكود:
```typescript
const ADMIN_EMAILS = ["mahmoud@example.com", "admin@tolzy.com"];
```
- **إعادة توجيه تلقائية** - غير المسؤولين يتم توجيههم للصفحة الرئيسية

#### المميزات:
##### تبويب "إضافة مشروع":
- نموذج كامل لإضافة مشروع جديد:
  - اسم المشروع
  - لغة البرمجة
  - الوصف
  - رابط GitHub
  - رابط الصورة
  - عدد النجوم
  - عدد الـ Forks
  - الوسوم (Tags)
- **حفظ مباشر في Firestore**
- **رسائل نجاح/خطأ**

##### تبويب "إدارة المشاريع":
- **عرض جميع المشاريع** من Firestore
- **حذف المشاريع** مع تأكيد
- **تعديل المشاريع** (جاهز للتطوير)
- **إحصائيات** - عدد المشاريع الكلي

---

### 4️⃣ تكامل Firestore

#### Collections المستخدمة:

##### 1. `projects` - المشاريع الرئيسية
```typescript
{
  name: string,           // اسم المشروع
  description: string,    // الوصف
  language: string,       // لغة البرمجة
  githubUrl: string,      // رابط GitHub
  image: string,          // رابط الصورة
  stars: number,          // عدد النجوم
  forks: number,          // عدد الـ Forks
  tags: string[],         // الوسوم
  createdAt: Date,        // تاريخ الإضافة
  createdBy: string       // بريد المسؤول
}
```

##### 2. `savedProjects` - المشاريع المحفوظة
```typescript
{
  userId: string,         // معرف المستخدم
  projectId: string,      // معرف المشروع
  name: string,           // اسم المشروع
  description: string,    // الوصف
  language: string,       // لغة البرمجة
  image: string,          // رابط الصورة
  stars: number,          // عدد النجوم
  forks: number,          // عدد الـ Forks
  savedAt: Date           // تاريخ الحفظ
}
```

---

### 5️⃣ الصفحة الرئيسية المحدثة

#### التحديثات:
- **جلب المشاريع من Firestore** بدلاً من البيانات الثابتة
- **حالة التحميل** - Loader أثناء جلب البيانات
- **حالة فارغة** - رسالة عند عدم وجود مشاريع
- **عرض ديناميكي** - جميع المشاريع من قاعدة البيانات
- **ترتيب حسب التاريخ** - أحدث المشاريع أولاً
- **حد أقصى 8 مشاريع** في الصفحة الرئيسية

---

## 🔧 الإعداد المطلوب

### 1. إعداد Firebase

#### إنشاء مشروع Firebase:
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروع جديد
3. فعّل **Authentication**:
   - Google Provider
   - GitHub Provider
   - Email/Password
4. فعّل **Firestore Database**
5. انسخ إعدادات Firebase

#### إضافة المتغيرات في `.env`:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 2. إعداد Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // المشاريع - قراءة للجميع، كتابة للمسؤولين فقط
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in ['mahmoud@example.com', 'admin@tolzy.com'];
    }
    
    // المشاريع المحفوظة - كل مستخدم يصل لمشاريعه فقط
    match /savedProjects/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

### 3. تحديث قائمة المسؤولين

في ملف `admin-dashboard.tsx` و `header.tsx`:
```typescript
const ADMIN_EMAILS = ["your-email@example.com", "admin@tolzy.com"];
```
**⚠️ مهم:** ضع بريدك الإلكتروني الفعلي هنا!

---

## 📱 المسارات الجديدة

| المسار | الوصف | الحماية |
|--------|-------|---------|
| `/login` | صفحة تسجيل الدخول | عامة |
| `/dashboard` | لوحة تحكم المستخدم | محمية (مستخدمين فقط) |
| `/admin` | لوحة تحكم المسؤول | محمية (مسؤولين فقط) |
| `/project/:id` | تفاصيل المشروع | عامة |
| `/` | الصفحة الرئيسية | عامة |

---

## 🎨 الملفات المحدثة/الجديدة

### ملفات جديدة:
- ✅ `client/src/pages/login.tsx` - صفحة تسجيل دخول جديدة كلياً
- ✅ `client/src/pages/user-dashboard.tsx` - لوحة تحكم المستخدم
- ✅ `client/src/pages/admin-dashboard.tsx` - لوحة تحكم المسؤول
- ✅ `client/src/lib/firebase.ts` - إعداد Firebase (موجود مسبقاً)

### ملفات محدثة:
- ✅ `client/src/components/header.tsx` - أيقونة المستخدم والقائمة
- ✅ `client/src/pages/home.tsx` - جلب من Firestore
- ✅ `client/src/App.tsx` - المسارات الجديدة

### ملفات محذوفة:
- ❌ `client/src/pages/suggest.tsx` - تم حذفها (ألغيت فكرة اقتراح المشاريع)

---

## 🚀 كيفية الاستخدام

### للمستخدم العادي:
1. **تسجيل الدخول** عبر Google أو GitHub أو البريد
2. **تصفح المشاريع** في الصفحة الرئيسية
3. **حفظ المشاريع** المفضلة
4. **الوصول للوحة التحكم** لرؤية المشاريع المحفوظة

### للمسؤول:
1. **تسجيل الدخول** ببريد مسؤول
2. **الوصول للوحة المسؤول** من القائمة المنسدلة
3. **إضافة مشاريع جديدة** عبر النموذج
4. **إدارة المشاريع** (حذف، تعديل)

---

## 📊 هيكل قاعدة البيانات

```
Firestore
├── projects/
│   ├── {projectId}
│   │   ├── name
│   │   ├── description
│   │   ├── language
│   │   ├── githubUrl
│   │   ├── image
│   │   ├── stars
│   │   ├── forks
│   │   ├── tags[]
│   │   ├── createdAt
│   │   └── createdBy
│   └── ...
│
└── savedProjects/
    ├── {docId}
    │   ├── userId
    │   ├── projectId
    │   ├── name
    │   ├── description
    │   ├── language
    │   ├── image
    │   ├── stars
    │   ├── forks
    │   └── savedAt
    └── ...
```

---

## ⚡ الميزات القادمة (اختياري)

- [ ] نظام التقييمات (⭐⭐⭐⭐⭐)
- [ ] التعليقات على المشاريع
- [ ] مشاركة المشاريع على وسائل التواصل
- [ ] إحصائيات متقدمة للمسؤول
- [ ] تعديل المشاريع في لوحة المسؤول
- [ ] البحث والفلترة المتقدمة
- [ ] إشعارات للمستخدمين

---

## 🎉 النتيجة النهائية

تم تحويل **Tolzy Stack** إلى منصة كاملة مع:
- ✅ نظام مصادقة متقدم (Google, GitHub, Email)
- ✅ لوحة تحكم للمستخدمين
- ✅ لوحة تحكم محمية للمسؤولين
- ✅ تكامل كامل مع Firestore
- ✅ إدارة المشاريع (إضافة، حذف، عرض)
- ✅ واجهة مستخدم جميلة ومتجاوبة

**المشروع جاهز للاستخدام! 🚀**
