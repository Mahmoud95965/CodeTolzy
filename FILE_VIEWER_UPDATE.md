# 📁 تحسينات عارض الملفات والأكواد - Tolzy Stack

## ✅ التحديثات الجديدة

تم تحسين عارض الملفات والأكواد بشكل كامل مع مميزات احترافية!

---

## 🎯 المميزات الجديدة

### 1️⃣ شجرة ملفات كاملة مع المجلدات 📂

#### ✅ المميزات:
- **عرض المجلدات والملفات** منفصلين
- **توسيع/طي المجلدات** بنقرة واحدة
- **أيقونة متحركة** للمجلدات (ChevronRight تدور 90 درجة)
- **جلب محتويات المجلد** عند التوسيع
- **عداد الملفات** في الأعلى

#### 📝 الكود:
```typescript
const [folders, setFolders] = useState<any[]>([]);
const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

const toggleFolder = async (folderPath: string) => {
  const newExpanded = new Set(expandedFolders);
  if (newExpanded.has(folderPath)) {
    newExpanded.delete(folderPath);
  } else {
    newExpanded.add(folderPath);
    // جلب محتويات المجلد
    const contents = await fetchFolderContents(folderPath);
    setAllFiles(prev => [...prev, ...contents.filter((f: any) => f.type === "file")]);
  }
  setExpandedFolders(newExpanded);
};
```

#### 🎨 واجهة المستخدم:
```tsx
{folders.map((folder: any) => (
  <button onClick={() => toggleFolder(folder.path)}>
    <ChevronRight className={`transition-transform ${
      expandedFolders.has(folder.path) ? 'rotate-90' : ''
    }`} />
    <Folder className="h-4 w-4 text-yellow-500" />
    <span>{folder.name}</span>
  </button>
))}
```

---

### 2️⃣ بحث في الملفات 🔍

#### ✅ المميزات:
- **صندوق بحث** في أعلى القائمة
- **بحث فوري** أثناء الكتابة
- **تصفية الملفات** حسب الاسم
- **رسالة "لا توجد ملفات مطابقة"** عند عدم وجود نتائج

#### 📝 الكود:
```typescript
const [searchQuery, setSearchQuery] = useState("");

const filteredFiles = searchQuery
  ? allFiles.filter((f: any) => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : repoFiles;
```

#### 🎨 واجهة المستخدم:
```tsx
<input
  type="text"
  placeholder="🔍 ابحث عن ملف..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full px-3 py-2 text-sm border rounded-lg"
/>
```

---

### 3️⃣ أيقونات ملونة حسب نوع الملف 🎨

#### ✅ الأيقونات المدعومة:
```typescript
const iconMap = {
  'js': '🟨',      // JavaScript
  'jsx': '⚛️',     // React JSX
  'ts': '🔷',      // TypeScript
  'tsx': '⚛️',     // React TSX
  'json': '📋',    // JSON
  'md': '📝',      // Markdown
  'css': '🎨',     // CSS
  'html': '🌐',    // HTML
  'py': '🐍',      // Python
  'java': '☕',    // Java
  'go': '🔵',      // Go
  'rs': '🦀',      // Rust
  'php': '🐘',     // PHP
  'rb': '💎',      // Ruby
  'yml': '⚙️',     // YAML
  'xml': '📄',     // XML
  'svg': '🖼️',     // SVG
  'png': '🖼️',     // PNG
  'jpg': '🖼️',     // JPG
  'gif': '🖼️',     // GIF
};
```

#### 📝 الكود:
```typescript
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return iconMap[ext || ''] || '📄';
};
```

---

### 4️⃣ عرض الكود مع أرقام الأسطر 📊

#### ✅ المميزات:
- **أرقام الأسطر** على اليمين
- **شريط معلومات الملف** في الأعلى:
  - اسم الملف
  - عدد الأسطر
  - حجم الملف (KB)
  - نوع الملف
- **إحصائيات الكود** في الأسفل:
  - عدد الأسطر 📊
  - عدد الكلمات 📝
  - حجم الملف 💾
- **خلفية داكنة** احترافية
- **حد فاصل** بين الأرقام والكود

#### 🎨 التصميم:

**شريط المعلومات:**
```tsx
<div className="bg-slate-900 rounded-t-lg px-4 py-2 border-b border-slate-700">
  <div className="flex items-center gap-3 text-xs text-slate-400">
    <span>📄 {selectedFile?.split('/').pop()}</span>
    <span>|</span>
    <span>{fileContent.split('\n').length} سطر</span>
    <span>|</span>
    <span>{(new Blob([fileContent]).size / 1024).toFixed(2)} KB</span>
  </div>
</div>
```

**أرقام الأسطر + الكود:**
```tsx
<div className="flex">
  {/* Line Numbers */}
  <div className="bg-slate-900 px-4 py-4 select-none border-r border-slate-700">
    <pre className="text-xs text-slate-500 text-right leading-6">
      {fileContent.split('\n').map((_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </pre>
  </div>
  
  {/* Code Content */}
  <div className="flex-1 px-4 py-4">
    <pre className="text-sm text-slate-50 leading-6">
      <code>{fileContent}</code>
    </pre>
  </div>
</div>
```

**إحصائيات الكود:**
```tsx
<div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
  <span>📊 {fileContent.split('\n').length} سطر</span>
  <span>📝 {fileContent.split(/\s+/).length} كلمة</span>
  <span>💾 {(new Blob([fileContent]).size / 1024).toFixed(2)} KB</span>
</div>
```

---

### 5️⃣ تحسينات القائمة الجانبية 📋

#### ✅ المميزات:
- **عداد الملفات** في الأعلى
- **تمييز الملف المختار**:
  - خلفية ملونة
  - حد أيسر بلون primary
  - نص بخط عريض
  - علامة ✓ صغيرة
- **تمرير سلس** للقائمة
- **ارتفاع محدد** (500px) مع scroll
- **إحصائيات** في الأسفل:
  - عدد المجلدات 📁
  - عدد الملفات 📄

#### 🎨 التصميم:
```tsx
{/* Header with Counter */}
<div className="flex items-center justify-between mb-4">
  <h3>ملفات المشروع</h3>
  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
    {allFiles.length} ملف
  </span>
</div>

{/* File Item */}
<button className={`
  ${selectedFile === file.path 
    ? "bg-primary/10 border-l-2 border-primary" 
    : ""
  }
`}>
  <span>{getFileIcon(file.name)}</span>
  <span className={selectedFile === file.path ? 'font-semibold text-primary' : ''}>
    {file.name}
  </span>
  {selectedFile === file.path && <Check className="h-3 w-3 text-primary" />}
</button>

{/* Stats Footer */}
<div className="mt-4 pt-4 border-t">
  <div className="flex items-center justify-between">
    <span>📁 {folders.length} مجلد</span>
    <span>📄 {allFiles.length} ملف</span>
  </div>
</div>
```

---

## 📊 ملخص التحسينات

### ✅ ما تم إضافته:

| المميزة | الحالة | الوصف |
|---------|--------|-------|
| **شجرة المجلدات** | ✅ مكتمل | توسيع/طي المجلدات |
| **البحث** | ✅ مكتمل | بحث فوري في الملفات |
| **أيقونات ملونة** | ✅ مكتمل | 20+ نوع ملف |
| **أرقام الأسطر** | ✅ مكتمل | عرض احترافي للكود |
| **شريط المعلومات** | ✅ مكتمل | اسم، حجم، عدد الأسطر |
| **إحصائيات الكود** | ✅ مكتمل | أسطر، كلمات، حجم |
| **تمييز الملف** | ✅ مكتمل | حد ملون + علامة ✓ |
| **عداد الملفات** | ✅ مكتمل | في الأعلى والأسفل |

---

## 🎨 الألوان والتصميم

### الألوان:
```css
/* خلفية الكود */
bg-slate-950    /* الكود الرئيسي */
bg-slate-900    /* أرقام الأسطر + شريط المعلومات */
border-slate-700 /* الحدود */
text-slate-50   /* نص الكود */
text-slate-500  /* أرقام الأسطر */
text-slate-400  /* معلومات الملف */

/* تمييز الملف المختار */
bg-primary/10   /* خلفية */
border-primary  /* حد أيسر */
text-primary    /* نص */

/* المجلدات */
text-yellow-500 /* أيقونة المجلد */
```

### الأنيميشن:
- `transition-transform` - دوران ChevronRight
- `transition-colors` - تغيير الألوان عند hover
- `hover:bg-muted` - خلفية عند التمرير
- `animate-spin` - دوران Loader

---

## 🚀 كيفية الاستخدام

### للمستخدم:

1. **تصفح الملفات**:
   - شاهد جميع الملفات في القائمة
   - المجلدات في الأعلى
   - الملفات في الأسفل

2. **البحث**:
   - اكتب في صندوق البحث
   - النتائج تظهر فوراً

3. **توسيع المجلدات**:
   - اضغط على المجلد
   - شاهد محتوياته

4. **عرض الكود**:
   - اضغط على أي ملف
   - شاهد الكود مع أرقام الأسطر
   - شاهد الإحصائيات

---

## 📝 الدوال الجديدة

```typescript
// 1. جلب محتويات المجلد
fetchFolderContents(path: string): Promise<any[]>

// 2. توسيع/طي المجلد
toggleFolder(folderPath: string): Promise<void>

// 3. الحصول على أيقونة الملف
getFileIcon(fileName: string): string

// 4. تصفية الملفات
filteredFiles: computed based on searchQuery
```

---

## 🎯 الفوائد

### للمطورين:
- ✅ **رؤية واضحة** للكود
- ✅ **أرقام الأسطر** للمراجعة
- ✅ **إحصائيات مفيدة** للملفات
- ✅ **بحث سريع** في الملفات
- ✅ **تنظيم أفضل** مع المجلدات

### للمتعلمين:
- ✅ **فهم أفضل** لبنية المشروع
- ✅ **تصفح سهل** للملفات
- ✅ **أيقونات واضحة** لأنواع الملفات
- ✅ **عرض احترافي** للكود

---

## 🔧 التحسينات المستقبلية

- [ ] Syntax Highlighting للكود
- [ ] نسخ سطر محدد
- [ ] تحميل ملف محدد
- [ ] عرض diff بين الإصدارات
- [ ] تكبير/تصغير الخط
- [ ] تبديل السمة (فاتح/داكن)
- [ ] تصدير الكود كصورة
- [ ] مشاركة سطر محدد

---

## 🎉 النتيجة النهائية

**عارض الملفات والأكواد** الآن:
- ✅ **احترافي** - تصميم مثل VS Code
- ✅ **شامل** - جميع الملفات والمجلدات
- ✅ **تفاعلي** - بحث وتوسيع
- ✅ **واضح** - أرقام أسطر وإحصائيات
- ✅ **منظم** - أيقونات ملونة
- ✅ **سريع** - استجابة فورية

**المشروع جاهز للاستخدام! 🚀✨**

---

## 📁 الملفات المحدثة

### ✅ `client/src/pages/project-details.tsx`:
- إضافة 4 states جديدة
- إضافة 3 دوال جديدة
- تحسين واجهة القائمة الجانبية
- تحسين عرض الكود
- إضافة أرقام الأسطر
- إضافة البحث
- إضافة شجرة المجلدات

**تم التحديث بنجاح! 🎊**
