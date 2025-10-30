import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { ArrowRight, Search, Star, GitFork, Eye, Sparkles, Code2, BookOpen, Lightbulb, TrendingUp, Filter, Github, Loader2, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      // تحميل جميع المشاريع للبحث
      const allQuery = query(collection(db, "projects"));
      const allSnapshot = await getDocs(allQuery);
      const all = allSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllProjects(all);
      
      // تحميل المشاريع المميزة للعرض
      const q = query(
        collection(db, "projects"),
        orderBy("createdAt", "desc"),
        limit(8)
      );
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeaturedProjects(projects);
    } catch (error) {
      console.error("Error loading projects:", error);
      // في حالة الخطأ، استخدم بيانات تجريبية
      setFeaturedProjects([
        {
          id: 1,
          name: "React Dashboard",
          description: "لوحة تحكم حديثة وكاملة مبنية بـ React و TypeScript",
          language: "TypeScript",
          stars: 1250,
          forks: 340,
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
        },
      ]);
      setAllProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // دالة لتمييز النص المطابق
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    
    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);
    
    return (
      <>
        {before}
        <span className="bg-yellow-500/30 text-yellow-700 dark:text-yellow-300 font-semibold">
          {match}
        </span>
        {after}
      </>
    );
  };

  // بحث محسّن مع useMemo
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    
    return allProjects.filter((project: any) => {
      const name = (project.name || '').toLowerCase();
      const description = (project.description || '').toLowerCase();
      const language = (project.language || '').toLowerCase();
      const tags = (project.tags || []).join(' ').toLowerCase();
      
      return name.includes(query) || 
             description.includes(query) || 
             language.includes(query) ||
             tags.includes(query);
    }).sort((a, b) => {
      // ترتيب: المشاريع التي تبدأ بالبحث أولاً
      const aName = (a.name || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      const aStarts = aName.startsWith(query);
      const bStarts = bName.startsWith(query);
      
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // ثم حسب عدد النجوم
      return (b.stars || 0) - (a.stars || 0);
    }).slice(0, 12); // أول 12 نتيجة
  }, [searchQuery, allProjects]);

  const features = [
    {
      icon: BookOpen,
      title: "مكتبة مشاريع ضخمة",
      description: "آلاف المشاريع مفتوحة المصدر من GitHub منظمة ومصنفة حسب اللغة والمجال لسهولة الوصول.",
    },
    {
      icon: Sparkles,
      title: "شرح ذكي بالـ AI",
      description: "ملخصات وشروحات تلقائية للمشاريع والأكواد باستخدام الذكاء الاصطناعي لفهم أسرع وأعمق.",
    },
    {
      icon: Code2,
      title: "عرض احترافي للكود",
      description: "استعراض ملفات المشاريع بواجهة تشبه VS Code مع إمكانية شرح كل ملف بالتفصيل.",
    },
    {
      icon: Lightbulb,
      title: "اقتراحات ذكية",
      description: "اكتب فكرتك واحصل على مشاريع مشابهة من GitHub أو هيكل مشروع جديد مولّد بالذكاء الاصطناعي.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-16 md:pt-20 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative">
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6 animate-float">
              <Github className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              <span className="text-xs md:text-sm font-medium">مدعوم بـ GitHub API & AI</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent px-2">
              Tolzy Stack
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-8 leading-relaxed px-4">
              مكتبة ذكية لأفضل المشاريع مفتوحة المصدر
              <br className="hidden sm:block" />
              <span className="text-sm sm:text-base md:text-lg block sm:inline mt-2 sm:mt-0">اكتشف، تعلّم، وطوّر مع آلاف المشاريع من GitHub</span>
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-6 md:mb-8 px-2">
              <Card className="p-1.5 md:p-2 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <Input
                      type="search"
                      placeholder="ابحث عن مشاريع..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 md:pl-12 pr-10 md:pr-12 h-10 md:h-12 text-sm md:text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
                        title="مسح البحث"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <Link href="/projects">
                    <Button className="gap-2 h-10 md:h-12 px-4 md:px-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 w-full sm:w-auto">
                      <Filter className="h-3 w-3 md:h-4 md:w-4" />
                      <span>فلتر</span>
                    </Button>
                  </Link>
                </div>
                
              </Card>
              
              {/* عداد النتائج */}
              {searchQuery && (
                <div className="mt-3 text-sm text-muted-foreground text-center animate-fadeIn">
                  {filteredProjects.length > 0 ? (
                    <>
                      <span className="font-semibold text-primary">{filteredProjects.length}</span> نتيجة من {allProjects.length} مشروع
                    </>
                  ) : (
                    <span className="text-red-500">لا توجد نتائج مطابقة</span>
                  )}
                </div>
              )}
              
              {/* Quick Filters */}
              <div className="flex gap-1.5 md:gap-2 mt-3 md:mt-4 flex-wrap justify-center px-2">
                {["JavaScript", "Python", "React", "TypeScript", "Node.js"].map((tech) => (
                  <Button
                    key={tech}
                    variant="outline"
                    size="sm"
                    className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all text-xs md:text-sm px-2 md:px-3 h-7 md:h-8"
                  >
                    {tech}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center px-4">
              <Button 
                size="lg" 
                className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-sm md:text-base h-10 md:h-11 px-4 md:px-6"
                onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                استكشف المشاريع
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results or Featured Projects */}
      <section id="projects-section" className="py-8 md:py-12 lg:py-16 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-3">
            <div className="w-full sm:w-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                {searchQuery ? (
                  <>
                    <Search className="inline h-8 w-8 text-primary mr-2" />
                    نتائج البحث
                  </>
                ) : (
                  <>
                    <TrendingUp className="inline h-6 w-6 md:h-8 md:w-8 text-primary mr-2" />
                    مشاريع مميزة
                  </>
                )}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                {searchQuery ? `البحث عن: "${searchQuery}"` : 'أحدث وأفضل المشاريع مفتوحة المصدر'}
              </p>
            </div>
            {!searchQuery && <Link href="/projects" className="w-full sm:w-auto"><Button variant="outline" className="w-full sm:w-auto text-sm md:text-base">عرض الكل</Button></Link>}
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12 md:py-20">
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
            </div>
          ) : searchQuery && filteredProjects.length === 0 ? (
            <Card className="p-8 md:p-12 text-center animate-fadeIn">
              <Search className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-3 md:mb-4 opacity-30" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">لا توجد نتائج</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">جرب البحث بكلمات مختلفة أو تصفح المشاريع المميزة</p>
              <Button onClick={() => setSearchQuery("")} variant="outline" className="text-sm md:text-base">
                مسح البحث
              </Button>
            </Card>
          ) : !searchQuery && featuredProjects.length === 0 ? (
            <Card className="p-8 md:p-12 text-center">
              <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">لا توجد مشاريع متاحة</h3>
              <p className="text-sm md:text-base text-muted-foreground">سيتم إضافة المشاريع قريباً</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {(searchQuery ? filteredProjects : featuredProjects).map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer h-full">
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img 
                        src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop"} 
                        alt={project.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {project.language}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2">
                        {searchQuery ? highlightMatch(project.name, searchQuery) : project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {searchQuery ? highlightMatch(project.description || '', searchQuery) : project.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {project.stars || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-4 w-4" />
                          {project.forks || 0}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 px-4">
              لماذا Tolzy Stack؟
            </h2>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg px-4">
              منصة تعليمية ذكية للمبرمجين والطلاب
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 md:p-6 hover:shadow-lg transition-all text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 mb-3 md:mb-4">
                  <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 px-4">
              كيف تعمل المنصة؟
            </h2>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg px-4">
              ثلاث خطوات بسيطة للبدء
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center px-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-xl md:text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">ابحث عن مشروع</h3>
              <p className="text-sm md:text-base text-muted-foreground">استخدم البحث الذكي للعثور على المشروع المناسب</p>
            </div>
            <div className="text-center px-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-xl md:text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">استكشف واشرح</h3>
              <p className="text-sm md:text-base text-muted-foreground">اطلع على الملفات واحصل على شرح ذكي بالـ AI</p>
            </div>
            <div className="text-center px-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-xl md:text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">تعلم وطبق</h3>
              <p className="text-sm md:text-base text-muted-foreground">جرب المشروع مباشرة أو استخدمه في مشاريعك</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <Card className="p-6 md:p-8 lg:p-12 text-center border-primary/20 bg-card/50 backdrop-blur">
            <Sparkles className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-primary mx-auto mb-3 md:mb-4" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 px-4">
              ابدأ رحلتك التعليمية الآن
            </h2>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              انضم إلى آلاف المطورين والطلاب الذين يتعلمون من أفضل المشاريع مفتوحة المصدر.
              <br className="hidden sm:block" />
              <span className="block sm:inline mt-2 sm:mt-0">مجاني بالكامل ومدعوم بالذكاء الاصطناعي.</span>
            </p>
            <div className="flex gap-3 md:gap-4 justify-center flex-wrap px-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 w-full sm:w-auto text-sm md:text-base h-10 md:h-11">
                  <Github className="h-4 w-4 md:h-5 md:w-5" />
                  ابدأ الآن مجاناً
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 w-full sm:w-auto text-sm md:text-base h-10 md:h-11"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 rotate-180" />
                العودة للأعلى
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 md:py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Brand */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Github className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <span className="font-bold text-base md:text-lg">Tolzy Stack</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                مكتبة ذكية للمشاريع مفتوحة المصدر مدعومة بالذكاء الاصطناعي
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-base">روابط سريعة</h3>
              <div className="space-y-2 text-xs md:text-sm">
                <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors">
                  الرئيسية
                </Link>
                <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                  عن المنصة
                </Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                  اتصل بنا
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-base">السياسات</h3>
              <div className="space-y-2 text-xs md:text-sm">
                <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                  سياسة الخصوصية
                </Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                  الشروط والأحكام
                </Link>
                <Link href="/security" className="block text-muted-foreground hover:text-primary transition-colors">
                  الأمان
                </Link>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-base">تابعنا</h3>
              <div className="flex gap-2 md:gap-3">
                <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Github className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </a>
                <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <svg className="h-4 w-4 md:h-5 md:w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 md:pt-6">
            <p className="text-xs md:text-sm text-muted-foreground text-center px-4">
              © 2025 Tolzy Stack. جميع الحقوق محفوظة | مدعوم بـ GitHub API & OpenAI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
