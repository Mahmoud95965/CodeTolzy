# 🚀 دليل المطورين - Tolzy Stack Developer Guide

## 📋 نظرة عامة / Overview

هذا الدليل موجه للمطورين الذين يريدون المساهمة في **Tolzy Stack** أو فهم البنية التقنية للمشروع.

---

## 🏗️ البنية المعمارية / Architecture

### Frontend Architecture
```
React 18 + TypeScript
├── Components (UI Building Blocks)
├── Pages (Route Components)
├── Hooks (Custom React Hooks)
├── Store (State Management)
└── Utils (Helper Functions)
```

### Backend Architecture
```
Node.js + Express
├── API Routes
│   ├── GitHub Integration
│   ├── AI Services (OpenAI)
│   └── Firebase Operations
├── Middleware
└── Utilities
```

---

## 🔌 API Integration Guide

### 1. GitHub API Integration

#### البحث عن المشاريع / Search Projects
```typescript
// api/github/search.ts
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function searchProjects(query: string, language?: string) {
  const response = await octokit.search.repos({
    q: `${query}${language ? ` language:${language}` : ''} stars:>100`,
    sort: 'stars',
    order: 'desc',
    per_page: 20
  });
  
  return response.data.items;
}
```

#### جلب تفاصيل المشروع / Get Repository Details
```typescript
// api/github/repo.ts
export async function getRepoDetails(owner: string, repo: string) {
  const response = await octokit.repos.get({
    owner,
    repo
  });
  
  return response.data;
}
```

#### جلب ملفات المشروع / Get Repository Files
```typescript
// api/github/files.ts
export async function getRepoFiles(owner: string, repo: string, path = '') {
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path
  });
  
  return response.data;
}
```

### 2. OpenAI Integration

#### تلخيص المشروع / Summarize Project
```typescript
// api/ai/summarize.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function summarizeProject(readme: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "أنت مساعد ذكي متخصص في تلخيص المشاريع البرمجية بطريقة واضحة ومفيدة."
      },
      {
        role: "user",
        content: `لخص هذا المشروع بشكل مختصر ومفيد:\n\n${readme}`
      }
    ],
    max_tokens: 500
  });
  
  return completion.choices[0].message.content;
}
```

#### شرح الكود / Explain Code
```typescript
// api/ai/explain.ts
export async function explainCode(code: string, language: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "أنت مساعد برمجي خبير في شرح الأكواد بطريقة سهلة الفهم."
      },
      {
        role: "user",
        content: `اشرح هذا الكود المكتوب بلغة ${language}:\n\n${code}`
      }
    ],
    max_tokens: 1000
  });
  
  return completion.choices[0].message.content;
}
```

#### اقتراح مشاريع / Suggest Projects
```typescript
// api/ai/suggest.ts
export async function suggestProjects(idea: string, language?: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "أنت خبير في البحث عن المشاريع مفتوحة المصدر واقتراح الأنسب منها."
      },
      {
        role: "user",
        content: `بناءً على هذه الفكرة: "${idea}"${language ? ` واللغة المفضلة: ${language}` : ''}, اقترح 3-5 مشاريع مشابهة من GitHub مع روابطها.`
      }
    ],
    max_tokens: 1500
  });
  
  return completion.choices[0].message.content;
}
```

### 3. Firebase Integration

#### إعداد Firebase / Firebase Setup
```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
```

#### المصادقة / Authentication
```typescript
// hooks/useAuth.ts
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export function useAuth() {
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { loginWithGoogle, logout };
}
```

#### حفظ البيانات / Save Data
```typescript
// lib/firestore.ts
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

// حفظ مشروع
export async function saveProject(project: any) {
  const docRef = await addDoc(collection(db, 'projects'), {
    ...project,
    createdAt: new Date()
  });
  return docRef.id;
}

// جلب المشاريع
export async function getProjects(filters?: any) {
  const q = filters 
    ? query(collection(db, 'projects'), where('language', '==', filters.language))
    : collection(db, 'projects');
    
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

---

## 🎨 إضافة صفحة جديدة / Adding New Page

### الخطوات:

1. **إنشاء ملف الصفحة**
```typescript
// client/src/pages/my-new-page.tsx
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default function MyNewPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">صفحتي الجديدة</h1>
      </div>
    </div>
  );
}
```

2. **إضافة المسار في App.tsx**
```typescript
// client/src/App.tsx
import MyNewPage from "@/pages/my-new-page";

function Router() {
  return (
    <Switch>
      {/* ... existing routes */}
      <Route path="/my-page" component={MyNewPage} />
    </Switch>
  );
}
```

3. **إضافة رابط في Header (اختياري)**
```typescript
// client/src/components/header.tsx
const navItems = [
  // ... existing items
  { path: "/my-page", label: "صفحتي" },
];
```

---

## 🧩 إضافة مكون جديد / Adding New Component

```typescript
// client/src/components/project-card.tsx
import { Card } from "@/components/ui/card";
import { Star, GitFork } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
}

export function ProjectCard({ name, description, stars, forks, language }: ProjectCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="flex items-center gap-4">
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
          {language}
        </span>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          {stars}
        </div>
        <div className="flex items-center gap-1">
          <GitFork className="h-4 w-4" />
          {forks}
        </div>
      </div>
    </Card>
  );
}
```

---

## 🔧 متغيرات البيئة / Environment Variables

قم بإنشاء ملف `.env` في جذر المشروع:

```env
# OpenAI API
OPENAI_API_KEY=sk-...

# GitHub API
GITHUB_TOKEN=ghp_...

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Environment
NODE_ENV=development
```

---

## 🧪 الاختبار / Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 📦 البناء والنشر / Build & Deploy

### بناء المشروع محلياً
```bash
npm run build
```

### النشر على Vercel
```bash
vercel --prod
```

---

## 🐛 تصحيح الأخطاء / Debugging

### تفعيل وضع التطوير
```bash
npm run dev
```

### فحص الأكواد
```bash
npm run lint
```

### تنسيق الأكواد
```bash
npm run format
```

---

## 📚 موارد إضافية / Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [GitHub API Docs](https://docs.github.com/en/rest)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)

---

## 💡 نصائح للمطورين / Developer Tips

1. **استخدم TypeScript دائماً** - للحصول على أكواد آمنة وموثوقة
2. **اتبع معايير الكود** - استخدم ESLint و Prettier
3. **اكتب تعليقات واضحة** - خاصة للوظائف المعقدة
4. **اختبر قبل الـ Commit** - تأكد من عمل كل شيء
5. **استخدم Git بشكل صحيح** - commits واضحة ومنظمة

---

## 🤝 المساهمة / Contributing

راجع ملف [CONTRIBUTING.md](CONTRIBUTING.md) للمزيد من التفاصيل.

---

**Happy Coding! 🚀**
