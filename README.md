# Tolzy Stack - مكتبة ذكية للمشاريع مفتوحة المصدر

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Tolzy%20Projects-blue?style=for-the-badge&logo=vercel)](https://code-tolzy.vercel.app/)
[![GitHub API](https://img.shields.io/badge/Powered%20by-GitHub%20API-green?style=for-the-badge&logo=github)](https://docs.github.com/en/rest)
[![React](https://img.shields.io/badge/Built%20with-React-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

**مكتبة ذكية تجمع أفضل المشاريع مفتوحة المصدر من GitHub وتقدمها بطريقة تفاعلية وتعليمية مع شروحات ذكية بالذكاء الاصطناعي.**

A smart library that collects the best open-source projects from GitHub and presents them in an interactive and educational way with AI-powered explanations.

## 🚀 Live Demo

**Visit the live application:** [https://code-tolzy.vercel.app/](https://code-tolzy.vercel.app/)

## ✨ المميزات الأساسية / Core Features

### 🔍 **بحث ذكي عن المشاريع**
- بحث متقدم مع Autocomplete
- فلاتر حسب اللغة والمجال والنجوم
- اقتراحات ذكية أثناء الكتابة

### 📚 **مكتبة مشاريع ضخمة**
- آلاف المشاريع من GitHub
- تصنيف حسب اللغة والشعبية
- تحديث مستمر للمشاريع الجديدة

### 🤖 **شروحات ذكية بالـ AI**
- ملخص تلقائي للمشاريع من README
- شرح تفصيلي للأكواد
- تفسير وظيفة كل ملف

### 💡 **اقتراحات مشاريع**
- اكتب فكرتك واحصل على مشاريع مشابهة
- توليد هيكل مشروع جديد بالـ AI
- اقتراحات مخصصة حسب احتياجاتك

### 📁 **عرض احترافي للملفات**
- واجهة تشبه VS Code
- عرض هيكل المشروع بالكامل
- معاينة الأكواد مع Syntax Highlighting

### ⭐ **نظام تقييم ومراجعات**
- تقييم المشاريع بالنجوم
- مراجعات من المستخدمين
- إحصائيات تفصيلية

### 🚀 **تشغيل مباشر**
- دمج مع StackBlitz
- معاينة المشاريع في المتصفح
- تجربة الكود مباشرة

## 🛠️ التقنيات المستخدمة / Tech Stack

### Frontend
- **React 18** - مكتبة بناء الواجهات
- **TypeScript** - للكتابة الآمنة
- **TailwindCSS** - للتصميم الحديث
- **Radix UI** - مكونات واجهة متقدمة
- **Lucide React** - أيقونات جميلة

### Backend & APIs
- **Node.js + Express** - خادم التطبيق
- **Vercel Serverless Functions** - وظائف بدون خادم
- **GitHub API** - جلب المشاريع من GitHub
- **OpenAI GPT-4 API** - الذكاء الاصطناعي للشروحات

### Database & Auth
- **Firebase Firestore** - قاعدة البيانات
- **Firebase Authentication** - نظام المصادقة (Google OAuth)

### Additional Tools
- **Monaco Editor** - عرض الأكواد
- **StackBlitz Embed** - تشغيل المشاريع مباشرة

## 🚀 البدء / Getting Started

### المتطلبات / Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (اختياري للميزات الذكية / optional for AI features)

### التثبيت / Installation

1. **استنساخ المشروع / Clone the repository:**
```bash
git clone https://github.com/Mahmoud95965/CodeTolzy.git
cd CodeTolzy
```

2. **تثبيت المكتبات / Install dependencies:**
```bash
npm install
```

3. **إنشاء ملف `.env` / Create a `.env` file:**
```env
# OpenAI API (للشروحات الذكية)
OPENAI_API_KEY=your_openai_api_key_here

# GitHub API (لجلب المشاريع)
GITHUB_TOKEN=your_github_token_here

# Firebase Config
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

NODE_ENV=development
```

4. **تشغيل السيرفر / Start the development server:**
```bash
npm run dev
```

التطبيق متاح على / App available at: `http://localhost:5000`

## 🌐 النشر / Deployment

### Vercel Deployment

1. ارفع الكود إلى GitHub / Push your code to GitHub
2. اربط المستودع بـ Vercel / Connect your repository to Vercel
3. أضف متغيرات البيئة في لوحة Vercel / Add your environment variables in Vercel dashboard:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=production
   ```
4. انشر! / Deploy!

التطبيق مُهيأ للنشر على Vercel مع ملف `vercel.json` المرفق.
The application is configured for Vercel with the included `vercel.json` file.

## 📁 هيكل المشروع / Project Structure

```
├── client/                 # تطبيق React الأمامي
│   ├── src/
│   │   ├── components/     # مكونات React
│   │   │   ├── header.tsx  # شريط التنقل
│   │   │   └── ui/         # مكونات الواجهة
│   │   ├── pages/          # صفحات التطبيق
│   │   │   ├── home.tsx    # الصفحة الرئيسية
│   │   │   ├── project-details.tsx  # تفاصيل المشروع
│   │   │   ├── suggest.tsx # اقتراح المشاريع
│   │   │   ├── dashboard.tsx # لوحة التحكم
│   │   │   └── login.tsx   # تسجيل الدخول
│   │   ├── hooks/          # React hooks مخصصة
│   │   └── lib/            # وظائف مساعدة
│   └── public/             # ملفات ثابتة
├── api/                    # Vercel Serverless Functions
│   ├── github/             # GitHub API integration
│   │   ├── search.ts       # بحث المشاريع
│   │   ├── repo.ts         # تفاصيل المشروع
│   │   └── files.ts        # ملفات المشروع
│   ├── ai/                 # AI endpoints
│   │   ├── summarize.ts    # تلخيص المشاريع
│   │   ├── explain.ts      # شرح الكود
│   │   └── suggest.ts      # اقتراح المشاريع
│   └── firebase/           # Firebase operations
├── server/                 # خادم Express (للتطوير)
└── shared/                 # أنواع مشتركة
```

## 📄 صفحات المنصة / Platform Pages

| المسار | الوصف | الميزات |
|--------|-------|---------|
| `/` | الصفحة الرئيسية | بحث ذكي + مشاريع مميزة |
| `/project/:id` | تفاصيل المشروع | عرض الملفات + شرح AI + تقييم |
| `/suggest` | اقتراح مشروع | إدخال الفكرة + اقتراحات AI |
| `/dashboard` | لوحة التحكم | إدارة المشاريع (للمشرف) |
| `/login` | تسجيل الدخول | Google OAuth |

## 🔌 نقاط API / API Endpoints

### GitHub Integration
- `GET /api/github/search` - البحث عن مشاريع
- `GET /api/github/repo/:owner/:name` - تفاصيل مشروع
- `GET /api/github/files/:owner/:name` - ملفات المشروع

### AI Features
- `POST /api/ai/summarize` - تلخيص المشروع
- `POST /api/ai/explain` - شرح الكود
- `POST /api/ai/suggest` - اقتراح مشاريع مشابهة

## 🎯 SEO Optimized

- **Meta Tags**: Comprehensive meta tags for search engines
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: XML sitemap for search engine crawling
- **Robots.txt**: Search engine crawling instructions
- **Performance**: Optimized for Core Web Vitals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for providing the GPT-4 API
- [Vercel](https://vercel.com/) for hosting and serverless functions
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [Radix UI](https://www.radix-ui.com/) for accessible UI components

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

## 🎓 الهدف من المنصة / Platform Goal

**Tolzy Stack** هي منصة تعليمية تهدف إلى:
- مساعدة المبرمجين والطلاب على التعلم من أفضل المشاريع
- توفير شروحات ذكية بالذكاء الاصطناعي
- تسهيل اكتشاف المشاريع مفتوحة المصدر
- تشجيع التعلم التفاعلي والعملي

## 🤝 المساهمة / Contributing

نرحب بالمساهمات! إذا كنت تريد المساهمة:

1. Fork المشروع
2. أنشئ فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📄 الترخيص / License

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 شكر وتقدير / Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) - لتوفير الوصول للمشاريع
- [OpenAI](https://openai.com/) - للذكاء الاصطناعي
- [Firebase](https://firebase.google.com/) - للبنية التحتية
- [Vercel](https://vercel.com/) - للاستضافة
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - لعرض الأكواد

---

**صُنع بـ ❤️ بواسطة / Made with ❤️ by [Mahmoud95965](https://github.com/Mahmoud95965)**

**Tolzy Stack - مكتبة ذكية للمشاريع مفتوحة المصدر 🚀**
