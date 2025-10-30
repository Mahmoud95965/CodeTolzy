# Tolzy Code AI - دليل الإعداد الكامل

## 🚀 نظرة عامة

Tolzy Code AI هي منصة متكاملة لكتابة وتوليد الأكواد بالذكاء الاصطناعي. تحتوي على:

- ✅ محرر أكواد ذكي مع إكمال تلقائي
- ✅ تصحيح الأخطاء تلقائياً مع اقتراحات الإصلاح
- ✅ توليد أكواد من النصوص
- ✅ تلخيص المشاريع الذكي
- ✅ سيناريوهات جاهزة لمشاريع كاملة
- ✅ نظام مستخدمين مع Firebase Authentication
- ✅ نظام باقات مدفوعة (مجاني / Pro)
- ✅ دفع عبر Vodafone Cash

## 📋 المتطلبات

- Node.js 18+
- npm أو yarn
- حساب OpenAI API
- مشروع Firebase

## 🔧 خطوات الإعداد

### 1. تثبيت المكتبات

```bash
npm install
```

### 2. إعداد Firebase

1. انتقل إلى [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروع جديد أو استخدم مشروع موجود
3. فعّل Authentication:
   - Email/Password
   - Google
   - GitHub
4. أنشئ قاعدة بيانات Firestore
5. احصل على تكوين Firebase من إعدادات المشروع

### 3. إعداد OpenAI API

1. انتقل إلى [OpenAI Platform](https://platform.openai.com/)
2. أنشئ API Key جديد
3. احفظ المفتاح للاستخدام لاحقاً

### 4. تكوين ملف البيئة

أنشئ ملف `.env` في المجلد الرئيسي:

```env
# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Node Environment
NODE_ENV=development

# Firebase Configuration (Frontend)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Server Port
PORT=5000
```

### 5. إعداد Firestore

أنشئ المجموعات التالية في Firestore:

#### Collection: `users`
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "photoURL": "string",
  "plan": "free" | "pro",
  "usageCount": 0,
  "dailyLimit": 5,
  "projects": [],
  "createdAt": "timestamp"
}
```

#### Collection: `projects`
```json
{
  "userId": "string",
  "name": "string",
  "description": "string",
  "language": "string",
  "code": "string",
  "files": [],
  "scenarioId": "string (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 6. قواعد Firestore Security

أضف القواعد التالية في Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects collection
    match /projects/{projectId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🚀 تشغيل المشروع

### وضع التطوير

```bash
npm run dev
```

سيعمل التطبيق على `http://localhost:5000`

### البناء للإنتاج

```bash
npm run build
npm start
```

## 📁 هيكل المشروع

```
CodeTolzy-main/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # UI components
│   │   │   └── smart-editor.tsx
│   │   ├── pages/           # صفحات التطبيق
│   │   │   ├── login.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── scenarios.tsx
│   │   │   ├── text-to-code.tsx
│   │   │   ├── project-summarizer.tsx
│   │   │   ├── account.tsx
│   │   │   └── pricing-page.tsx
│   │   ├── store/           # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   └── editorStore.ts
│   │   ├── hooks/           # Custom hooks
│   │   │   └── useAuth.ts
│   │   └── lib/             # Utilities
│   │       ├── firebase.ts
│   │       └── queryClient.ts
├── server/                   # Backend Express
│   ├── lib/
│   │   └── openai.ts
│   ├── routes.ts
│   ├── routes-ai.ts         # AI endpoints
│   └── index.ts
├── shared/                   # Shared types
│   └── schema.ts
└── api/                      # Vercel serverless functions
```

## 🎯 المميزات الرئيسية

### 1. محرر الأكواد الذكي
- إكمال تلقائي بالذكاء الاصطناعي
- تصحيح الأخطاء مع اقتراحات الإصلاح
- شرح الكود
- تشغيل الكود
- حفظ تلقائي

### 2. توليد الأكواد من النصوص
- اكتب وصفاً بالعربية أو الإنجليزية
- احصل على كود كامل جاهز للاستخدام
- دعم لغات متعددة

### 3. السيناريوهات الذكية
- مشاريع جاهزة بضغطة زر
- Node.js API
- React Login
- AI Chatbot
- Flutter To-Do
- وأكثر...

### 4. تلخيص المشاريع
- ارفع مجلد المشروع
- احصل على تحليل شامل
- فهم البنية والعلاقات

### 5. نظام الباقات
- **مجاني**: 5 عمليات يومياً
- **Pro**: عدد غير محدود + جميع الميزات

## 🔐 المصادقة

المنصة تدعم:
- تسجيل الدخول بالبريد الإلكتروني
- تسجيل الدخول بـ Google
- تسجيل الدخول بـ GitHub

## 💰 نظام الدفع

### Vodafone Cash Integration

الملف: `server/routes-ai.ts`

```typescript
router.post('/api/payment/vodafone-cash', async (req, res) => {
  const { phoneNumber, amount, userId } = req.body;
  // تكامل مع Vodafone Cash API
});
```

**ملاحظة**: يجب تكامل Vodafone Cash API الفعلي في الإنتاج.

## 🌐 النشر

### Vercel

1. ادفع الكود إلى GitHub
2. اربط المستودع بـ Vercel
3. أضف متغيرات البيئة في لوحة Vercel
4. انشر!

### متغيرات البيئة المطلوبة في Vercel:
- `OPENAI_API_KEY`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 📊 API Endpoints

### AI Endpoints

- `POST /api/autocomplete` - إكمال تلقائي للكود
- `POST /api/debug` - تحليل وتصحيح الأخطاء
- `POST /api/explain` - شرح الكود
- `POST /api/generate` - توليد كود من نص
- `POST /api/run` - تشغيل الكود
- `POST /api/generate-scenario` - إنشاء سيناريو كامل
- `POST /api/summarize-project` - تلخيص المشروع
- `POST /api/payment/vodafone-cash` - معالجة الدفع

## 🎨 التخصيص

### الثيمات
المنصة تدعم الوضع الليلي والنهاري تلقائياً.

### الألوان
يمكن تخصيص الألوان من `tailwind.config.ts`

## 🐛 استكشاف الأخطاء

### خطأ في Firebase
- تأكد من صحة تكوين Firebase
- تحقق من تفعيل Authentication methods
- راجع قواعد Firestore

### خطأ في OpenAI
- تأكد من صحة API Key
- تحقق من الرصيد المتاح
- راجع حدود الاستخدام

### خطأ في البناء
```bash
# امسح node_modules وأعد التثبيت
rm -rf node_modules
npm install

# امسح الكاش
npm run clean
```

## 📞 الدعم

للمساعدة والدعم:
- افتح Issue على GitHub
- راجع الوثائق
- تواصل مع الفريق

## 📄 الترخيص

MIT License

---

**صُنع بـ ❤️ لمجتمع المطورين العرب**
