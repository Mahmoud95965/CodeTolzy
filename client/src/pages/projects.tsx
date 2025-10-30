import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Github, Star, GitFork, Eye, Search, Filter, 
  Code2, Sparkles, TrendingUp, Clock
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function Projects() {
  const [, setLocation] = useLocation();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<'all' | 'popular' | 'recent'>('all');

  useEffect(() => {
    loadProjects();
  }, [filterBy]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      let q;
      
      if (filterBy === 'popular') {
        q = query(collection(db, "projects"), orderBy("stars", "desc"), limit(50));
      } else if (filterBy === 'recent') {
        q = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(50));
      } else {
        q = query(collection(db, "projects"), limit(50));
      }

      const snapshot = await getDocs(q);
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProjects(projectsData);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <Code2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              استكشف المشاريع البرمجية
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              مكتبة شاملة من أفضل المشاريع مفتوحة المصدر على GitHub
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ابحث عن مشروع، تقنية، أو لغة برمجة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 py-6 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="inline-block p-3 bg-blue-500/10 rounded-full mb-3">
                <Code2 className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{projects.length}+</div>
              <div className="text-sm text-muted-foreground">مشروع متاح</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="inline-block p-3 bg-yellow-500/10 rounded-full mb-3">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {projects.reduce((sum, p) => sum + (p.stars || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">نجمة على GitHub</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="inline-block p-3 bg-green-500/10 rounded-full mb-3">
                <Sparkles className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">TolzyAI</div>
              <div className="text-sm text-muted-foreground">تحليل ذكي للمشاريع</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">تصفية حسب:</span>
            <div className="flex gap-2">
              <Button
                variant={filterBy === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy('all')}
              >
                الكل
              </Button>
              <Button
                variant={filterBy === 'popular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy('popular')}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                الأكثر شهرة
              </Button>
              <Button
                variant={filterBy === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy('recent')}
                className="gap-2"
              >
                <Clock className="h-4 w-4" />
                الأحدث
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                عرض {filteredProjects.length} من {projects.length} مشروع
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => setLocation(`/project/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Github className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{project.author}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags && project.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-muted text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags && project.tags.length > 3 && (
                      <span className="px-2 py-1 rounded-full bg-muted text-xs">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{project.stars || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      <span>{project.forks || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{project.watchers || 0}</span>
                    </div>
                  </div>

                  {project.language && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm">{project.language}</span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">لا توجد نتائج</h3>
            <p className="text-muted-foreground">
              جرب البحث بكلمات مختلفة أو تغيير الفلتر
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
