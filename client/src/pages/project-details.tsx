import { useState, useEffect, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Github, Star, GitFork, Eye, ExternalLink, 
  FileCode, Sparkles, Play, Download, Share2,
  Folder, File, ChevronRight, Bookmark, Heart, Copy, Check, Loader2, X, Search
} from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { tolzyAI, type ProjectAnalysis, type FileAnalysis } from "@/lib/tolzyAI";

// مكون متكرر لعرض شجرة الملفات
interface FolderTreeProps {
  items: any[];
  level: number;
  expandedFolders: Set<string>;
  folderContents: {[key: string]: any[]};
  selectedFile: string | null;
  onToggleFolder: (path: string) => void;
  onSelectFile: (path: string) => void;
  getFileIcon: (fileName: string) => string;
}

function FolderTree({ 
  items, 
  level, 
  expandedFolders, 
  folderContents, 
  selectedFile, 
  onToggleFolder, 
  onSelectFile, 
  getFileIcon 
}: FolderTreeProps) {
  return (
    <>
      {items.map((item: any) => (
        item.type === "file" ? (
          <button
            key={item.path}
            onClick={() => onSelectFile(item.path)}
            className={`w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors flex items-center gap-2 group ${
              selectedFile === item.path ? "bg-primary/10 border-l-2 border-primary" : ""
            }`}
          >
            <span className="text-base">{getFileIcon(item.name)}</span>
            <span className={`text-sm truncate flex-1 ${selectedFile === item.path ? 'font-semibold text-primary' : ''}`}>
              {item.name}
            </span>
            {selectedFile === item.path && (
              <Check className="h-3 w-3 text-primary" />
            )}
          </button>
        ) : item.type === "dir" ? (
          <div key={item.path} className="space-y-1">
            <button
              onClick={() => onToggleFolder(item.path)}
              className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors flex items-center gap-2"
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${expandedFolders.has(item.path) ? 'rotate-90' : ''}`} />
              <Folder className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
            
            {expandedFolders.has(item.path) && folderContents[item.path] && (
              <div className="ml-6 space-y-1 border-l-2 border-muted pl-2">
                <FolderTree
                  items={folderContents[item.path]}
                  level={level + 1}
                  expandedFolders={expandedFolders}
                  folderContents={folderContents}
                  selectedFile={selectedFile}
                  onToggleFolder={onToggleFolder}
                  onSelectFile={onSelectFile}
                  getFileIcon={getFileIcon}
                />
              </div>
            )}
          </div>
        ) : null
      ))}
    </>
  );
}

export default function ProjectDetails() {
  const [, params] = useRoute("/project/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(auth.currentUser);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [repoFiles, setRepoFiles] = useState<any[]>([]);
  const [allFiles, setAllFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [folderContents, setFolderContents] = useState<{[key: string]: any[]}>({});
  const [readmeContent, setReadmeContent] = useState("");
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [imageFiles, setImageFiles] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [projectAnalysis, setProjectAnalysis] = useState<ProjectAnalysis | null>(null);
  const [fileAnalysis, setFileAnalysis] = useState<FileAnalysis | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wrapLines, setWrapLines] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadProject();
  }, [params?.id]);

  useEffect(() => {
    if (project?.githubUrl) {
      fetchRepoFiles();
      fetchReadme();
      fetchImages();
    }
  }, [project]);

  const loadProject = async () => {
    if (!params?.id) return;
    
    setLoading(true);
    try {
      const docRef = doc(db, "projects", params.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
        checkIfSaved(params.id);
      } else {
        toast({
          title: "خطأ",
          description: "المشروع غير موجود",
          variant: "destructive",
        });
        setLocation("/");
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async (projectId: string) => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, "savedProjects"),
        where("userId", "==", user.uid),
        where("projectId", "==", projectId)
      );
      const querySnapshot = await getDocs(q);
      setIsSaved(!querySnapshot.empty);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const fetchRepoFiles = async () => {
    if (!project?.githubUrl) return;
    
    try {
      const match = project.githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) return;
      
      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents`);
      if (response.ok) {
        const contents = await response.json();
        
        // فصل الملفات والمجلدات
        const files = contents.filter((f: any) => f.type === "file");
        const dirs = contents.filter((f: any) => f.type === "dir");
        
        setRepoFiles(files);
        setFolders(dirs);
        setAllFiles(files);
      }
    } catch (error) {
      console.error("Error fetching repo files:", error);
    }
  };

  const fetchFolderContents = async (path: string) => {
    if (!project?.githubUrl) return [];
    
    try {
      const match = project.githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) return [];
      
      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents/${path}`);
      if (response.ok) {
        const contents = await response.json();
        return contents;
      }
    } catch (error) {
      console.error("Error fetching folder contents:", error);
    }
    return [];
  };

  const toggleFolder = async (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
      // جلب محتويات المجلد إذا لم تكن محملة
      if (!folderContents[folderPath]) {
        const contents = await fetchFolderContents(folderPath);
        setFolderContents(prev => ({
          ...prev,
          [folderPath]: contents
        }));
        // إضافة الملفات للقائمة الكاملة
        const files = contents.filter((f: any) => f.type === "file");
        setAllFiles(prev => [...prev, ...files]);
      }
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconMap: any = {
      'js': '🟨',
      'jsx': '⚛️',
      'ts': '🔷',
      'tsx': '⚛️',
      'json': '📋',
      'md': '📝',
      'css': '🎨',
      'html': '🌐',
      'py': '🐍',
      'java': '☕',
      'go': '🔵',
      'rs': '🦀',
      'php': '🐘',
      'rb': '💎',
      'yml': '⚙️',
      'yaml': '⚙️',
      'xml': '📄',
      'svg': '🖼️',
      'png': '🖼️',
      'jpg': '🖼️',
      'gif': '🖼️',
    };
    return iconMap[ext || ''] || '📄';
  };

  // دالة لتمييز النص المطابق
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
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

  // بحث محسّن مع useMemo للأداء
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    
    return allFiles.filter((f: any) => {
      const fileName = f.name.toLowerCase();
      const filePath = f.path.toLowerCase();
      
      // البحث في اسم الملف والمسار الكامل
      return fileName.includes(query) || filePath.includes(query);
    }).sort((a, b) => {
      // ترتيب النتائج: الملفات التي تبدأ بالبحث أولاً
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aStarts = aName.startsWith(query);
      const bStarts = bName.startsWith(query);
      
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return aName.localeCompare(bName);
    });
  }, [searchQuery, allFiles]);

  const fetchReadme = async () => {
    if (!project?.githubUrl) return;
    
    setLoadingReadme(true);
    try {
      const match = project.githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) return;
      
      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");
      
      // محاولة جلب README.md
      const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/readme`);
      if (response.ok) {
        const data = await response.json();
        const content = atob(data.content);
        setReadmeContent(content);
      }
    } catch (error) {
      console.error("Error fetching README:", error);
    } finally {
      setLoadingReadme(false);
    }
  };

  const fetchImages = async () => {
    if (!project?.githubUrl) return;
    
    try {
      const match = project.githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) return;
      
      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents`);
      if (response.ok) {
        const files = await response.json();
        // البحث عن الصور
        const images = files.filter((f: any) => 
          f.type === "file" && /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f.name)
        );
        setImageFiles(images);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const generateAISummary = async () => {
    setLoadingAI(true);
    try {
      // استخدام TolzyAI لتحليل المشروع
      const analysis = await tolzyAI.analyzeProject(project);
      setProjectAnalysis(analysis);
      
      // تنسيق الملخص
      const summary = `
${analysis.summary}

✨ **المميزات الرئيسية:**
${analysis.features.map(f => f).join('\n')}

🚀 **التقنيات المستخدمة:**
${analysis.technologies.map(t => `• ${t}`).join('\n')}

🏗️ **البنية المعمارية:**
${analysis.architecture}

📊 **جودة الكود: ${analysis.codeQuality.score}%**

**نقاط القوة:**
${analysis.codeQuality.strengths.map(s => s).join('\n')}

**فرص التحسين:**
${analysis.codeQuality.improvements.map(i => i).join('\n')}

🎯 **حالات الاستخدام:**
${analysis.useCases.map(u => u).join('\n')}

📚 **مسار التعلم المقترح:**
${analysis.learningPath.map(l => l).join('\n')}
      `;
      
      setAiSummary(summary);
      toast({
        title: "✨ تم التحليل بواسطة TolzyAI!",
        description: "تم إنشاء تحليل ذكي شامل للمشروع",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحليل المشروع",
        variant: "destructive",
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const fetchFileContent = async (fileName: string) => {
    if (!project?.githubUrl) return;
    
    setLoadingFile(true);
    setShowAIExplanation(false);
    setFileAnalysis(null);
    
    try {
      const match = project.githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) return;
      
      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents/${fileName}`);
      if (response.ok) {
        const data = await response.json();
        const content = atob(data.content);
        setFileContent(content);
        setSelectedFile(fileName);
        
        // تحليل الملف بواسطة TolzyAI
        const analysis = await tolzyAI.analyzeFile(fileName, content, project.language || 'JavaScript');
        setFileAnalysis(analysis);
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "فشل تحميل الملف",
        variant: "destructive",
      });
    } finally {
      setLoadingFile(false);
    }
  };

  const handleSaveProject = async () => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "سجل دخول لحفظ المشاريع",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    try {
      if (isSaved) {
        const q = query(
          collection(db, "savedProjects"),
          where("userId", "==", user.uid),
          where("projectId", "==", project.id)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          await deleteDoc(doc(db, "savedProjects", document.id));
        });
        setIsSaved(false);
        toast({
          title: "تم الإلغاء",
          description: "تم إلغاء حفظ المشروع",
        });
      } else {
        await addDoc(collection(db, "savedProjects"), {
          userId: user.uid,
          projectId: project.id,
          name: project.name,
          description: project.description,
          language: project.language,
          image: project.image,
          stars: project.stars,
          forks: project.forks,
          savedAt: new Date(),
        });
        setIsSaved(true);
        toast({
          title: "تم الحفظ!",
          description: "تم حفظ المشروع بنجاح",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.name,
          text: project?.description,
          url: url,
        });
      } catch (error) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ الرابط",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(fileContent);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ الكود",
    });
  };

  const downloadFile = () => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile?.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "تم التحميل!",
      description: "تم تحميل الملف بنجاح",
    });
  };

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 10));
  const resetFontSize = () => setFontSize(14);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Github className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{project.author}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{project.name}</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
              <p className="text-xl text-muted-foreground mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags && Array.isArray(project.tags) && project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{project.stars}</span>
                  <span className="text-muted-foreground">نجمة</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  <span className="font-semibold">{project.forks}</span>
                  <span className="text-muted-foreground">فورك</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span className="font-semibold">{project.watchers}</span>
                  <span className="text-muted-foreground">متابع</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleSaveProject}
                variant={isSaved ? "default" : "outline"}
                className="gap-2"
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "محفوظ" : "حفظ المشروع"}
              </Button>
              <Button 
                variant="outline" 
                className="gap-2" 
                asChild
              >
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  عرض على GitHub
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleShare}
              >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {copied ? "تم النسخ" : "مشاركة"}
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                asChild
              >
                <a href={`${project.githubUrl}/archive/refs/heads/main.zip`} download>
                  <Download className="h-4 w-4" />
                  تحميل
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - File Structure */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Folder className="h-5 w-5 text-primary" />
                  ملفات المشروع
                </h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {allFiles.length} ملف
                </span>
              </div>
              
              {/* Search Box */}
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 ابحث عن ملف..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 pr-10 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
                      title="مسح البحث"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
                    <span>
                      {filteredFiles.length > 0 ? (
                        <>
                          <span className="font-semibold text-primary">{filteredFiles.length}</span> نتيجة
                        </>
                      ) : (
                        <span className="text-red-500">لا توجد نتائج</span>
                      )}
                    </span>
                    <span className="text-xs">
                      البحث في {allFiles.length} ملف
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {searchQuery ? (
                  /* عرض نتائج البحث */
                  filteredFiles.length > 0 ? (
                    <div className="space-y-1 animate-fadeIn">
                      {filteredFiles.map((file: any) => (
                        <button
                          key={file.path}
                          onClick={() => fetchFileContent(file.path)}
                          className={`w-full text-left px-3 py-2 rounded hover:bg-muted transition-all flex flex-col gap-1 group ${
                            selectedFile === file.path ? "bg-primary/10 border-l-2 border-primary" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{getFileIcon(file.name)}</span>
                            <span className={`text-sm flex-1 ${selectedFile === file.path ? 'font-semibold text-primary' : ''}`}>
                              {highlightMatch(file.name, searchQuery)}
                            </span>
                            {selectedFile === file.path && (
                              <Check className="h-3 w-3 text-primary" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mr-6 truncate">
                            {highlightMatch(file.path, searchQuery)}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm animate-fadeIn">
                      <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium mb-1">لا توجد نتائج</p>
                      <p className="text-xs">جرب البحث بكلمات مختلفة</p>
                    </div>
                  )
                ) : (
                  /* عرض شجرة الملفات */
                  <>
                    {/* الملفات في المجلد الرئيسي */}
                    {repoFiles.map((file: any) => (
                      <button
                        key={file.path}
                        onClick={() => fetchFileContent(file.path)}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors flex items-center gap-2 group ${
                          selectedFile === file.path ? "bg-primary/10 border-l-2 border-primary" : ""
                        }`}
                      >
                        <span className="text-base">{getFileIcon(file.name)}</span>
                        <span className={`text-sm truncate flex-1 ${selectedFile === file.path ? 'font-semibold text-primary' : ''}`}>
                          {file.name}
                        </span>
                        {selectedFile === file.path && (
                          <Check className="h-3 w-3 text-primary" />
                        )}
                      </button>
                    ))}

                    {/* المجلدات مع محتوياتها */}
                    <FolderTree
                      items={folders}
                      level={0}
                      expandedFolders={expandedFolders}
                      folderContents={folderContents}
                      selectedFile={selectedFile}
                      onToggleFolder={toggleFolder}
                      onSelectFile={fetchFileContent}
                      getFileIcon={getFileIcon}
                    />

                    {/* رسالة التحميل */}
                    {repoFiles.length === 0 && folders.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                        جاري تحميل الملفات...
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Stats */}
              {allFiles.length > 0 && (
                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>📁 {folders.length} مجلد</span>
                    <span>📄 {allFiles.length} ملف</span>
                  </div>
                </div>
              )}
            </Card>

            {/* AI Summary Card */}
            <Card className="p-6 mt-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <Sparkles className="h-8 w-8 text-primary mb-3 animate-float" />
              <h3 className="font-semibold mb-2">ملخص ذكي بالـ AI</h3>
              
              {aiSummary ? (
                <div className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                  {aiSummary}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  احصل على ملخص ذكي شامل للمشروع باستخدام الذكاء الاصطناعي.
                  سيتم تحليل الكود والتقنيات المستخدمة وتقديم نظرة عامة مفصلة.
                </p>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2"
                onClick={generateAISummary}
                disabled={loadingAI}
              >
                {loadingAI ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {aiSummary ? "تحديث الملخص" : "إنشاء ملخص AI"}
                  </>
                )}
              </Button>
            </Card>

            {/* Images Card */}
            {imageFiles.length > 0 && (
              <Card className="p-4 mt-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-primary" />
                  صور المشروع ({imageFiles.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {imageFiles.slice(0, 4).map((img: any) => (
                    <div key={img.name} className="relative group">
                      <img
                        src={img.download_url}
                        alt={img.name}
                        className="w-full h-24 object-cover rounded-lg border border-border hover:border-primary transition-all cursor-pointer"
                        onClick={() => window.open(img.download_url, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <ExternalLink className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
                {imageFiles.length > 4 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    +{imageFiles.length - 4} صورة أخرى
                  </p>
                )}
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="readme" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="readme">README</TabsTrigger>
                <TabsTrigger value="code">الكود</TabsTrigger>
                <TabsTrigger value="preview">معاينة</TabsTrigger>
              </TabsList>

              <TabsContent value="readme" className="mt-4">
                <Card className="p-6">
                  {loadingReadme ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : readmeContent ? (
                    <div className="prose dark:prose-invert max-w-none">
                      {/* Header جميل */}
                      <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-lg p-6 mb-6 border border-primary/20">
                        <h1 className="text-3xl font-bold mb-3 flex items-center gap-3">
                          <Github className="h-8 w-8 text-primary" />
                          {project.name}
                        </h1>
                        <p className="text-lg text-muted-foreground">{project.description}</p>
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                          <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{project.stars}</div>
                          <div className="text-sm text-muted-foreground">نجمة</div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                          <GitFork className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{project.forks}</div>
                          <div className="text-sm text-muted-foreground">فورك</div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                          <Eye className="h-6 w-6 text-green-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{project.watchers || 0}</div>
                          <div className="text-sm text-muted-foreground">متابع</div>
                        </div>
                      </div>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            التقنيات المستخدمة
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* README Content */}
                      <div className="bg-muted/30 rounded-lg p-6 border">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <FileCode className="h-5 w-5 text-primary" />
                          محتوى README
                        </h3>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {readmeContent}
                        </div>
                      </div>

                      {/* GitHub Link */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/20">
                        <h3 className="text-lg font-bold mb-2">🔗 رابط المشروع على GitHub</h3>
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-2 text-lg"
                        >
                          <Github className="h-5 w-5" />
                          {project.githubUrl}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      {/* Fallback Content */}
                      <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-lg p-6 mb-6 border border-primary/20">
                        <h1 className="text-3xl font-bold mb-3 flex items-center gap-3">
                          <Github className="h-8 w-8 text-primary" />
                          {project.name}
                        </h1>
                        <p className="text-lg text-muted-foreground">{project.description}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                          <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{project.stars}</div>
                          <div className="text-sm text-muted-foreground">نجمة</div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                          <GitFork className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{project.forks}</div>
                          <div className="text-sm text-muted-foreground">فورك</div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                          <Eye className="h-6 w-6 text-green-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{project.watchers || 0}</div>
                          <div className="text-sm text-muted-foreground">متابع</div>
                        </div>
                      </div>

                      {project.tags && project.tags.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            التقنيات المستخدمة
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/20">
                        <h3 className="text-lg font-bold mb-2">🔗 رابط المشروع على GitHub</h3>
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-2 text-lg"
                        >
                          <Github className="h-5 w-5" />
                          {project.githubUrl}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="code" className="mt-4">
                <Card className={`${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''} transition-all duration-300`}>
                  <div className="p-6">
                    {/* Header with Controls */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileCode className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-semibold block">
                            {selectedFile?.split('/').pop() || "اختر ملفاً من القائمة"}
                          </span>
                          {selectedFile && (
                            <span className="text-xs text-muted-foreground">
                              {selectedFile}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {fileContent && (
                        <div className="flex items-center gap-2">
                          {/* Font Size Controls */}
                          <div className="flex items-center gap-1 border rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={decreaseFontSize}
                              className="h-7 w-7 p-0"
                              title="تصغير الخط"
                            >
                              <span className="text-lg">-</span>
                            </Button>
                            <span className="text-xs px-2 min-w-[3rem] text-center">{fontSize}px</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={increaseFontSize}
                              className="h-7 w-7 p-0"
                              title="تكبير الخط"
                            >
                              <span className="text-lg">+</span>
                            </Button>
                          </div>

                          {/* Wrap Lines Toggle */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setWrapLines(!wrapLines)}
                            className="gap-2"
                            title="لف الأسطر"
                          >
                            <FileCode className="h-4 w-4" />
                            {wrapLines ? 'إلغاء اللف' : 'لف'}
                          </Button>

                          {/* Download */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadFile}
                            className="gap-2"
                            title="تحميل الملف"
                          >
                            <Download className="h-4 w-4" />
                            تحميل
                          </Button>

                          {/* Copy */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyCode}
                            className="gap-2"
                            title="نسخ الكود"
                          >
                            <Copy className="h-4 w-4" />
                            نسخ
                          </Button>

                          {/* AI Explanation */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAIExplanation(!showAIExplanation)}
                            className="gap-2"
                          >
                            <Sparkles className="h-4 w-4" />
                            AI
                          </Button>

                          {/* Fullscreen Toggle */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="gap-2"
                            title="ملء الشاشة"
                          >
                            {isFullscreen ? (
                              <>
                                <ExternalLink className="h-4 w-4 rotate-180" />
                                إغلاق
                              </>
                            ) : (
                              <>
                                <ExternalLink className="h-4 w-4" />
                                ملء
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    {loadingFile ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <span className="text-lg font-semibold text-muted-foreground">جاري تحميل الملف...</span>
                        <span className="text-sm text-muted-foreground mt-2">{selectedFile?.split('/').pop()}</span>
                      </div>
                    ) : fileContent ? (
                    <div className="relative">
                      {/* File Info Bar */}
                      <div className="bg-slate-900 rounded-t-lg px-4 py-2 flex items-center justify-between border-b border-slate-700">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <FileCode className="h-3 w-3" />
                            {selectedFile?.split('/').pop()}
                          </span>
                          <span>|</span>
                          <span>{fileContent.split('\n').length} سطر</span>
                          <span>|</span>
                          <span>{(new Blob([fileContent]).size / 1024).toFixed(2)} KB</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {selectedFile?.split('.').pop()?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Code Display with Line Numbers */}
                      <div className="bg-slate-950 rounded-b-lg overflow-hidden">
                        <div className={`${isFullscreen ? 'max-h-[calc(100vh-200px)]' : 'max-h-[600px]'} overflow-auto`}>
                          <div className="flex">
                            {/* Line Numbers */}
                            <div className="bg-slate-900 px-4 py-4 select-none border-r border-slate-700 sticky left-0">
                              <pre className="text-slate-500 text-right" style={{ fontSize: `${fontSize - 2}px`, lineHeight: '1.6' }}>
                                {fileContent.split('\n').map((_, i) => (
                                  <div key={i} className="hover:bg-slate-800 px-1 rounded transition-colors">{i + 1}</div>
                                ))}
                              </pre>
                            </div>
                            
                            {/* Code Content */}
                            <div className="flex-1 px-4 py-4">
                              <pre className={`text-slate-50 ${wrapLines ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`} style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}>
                                <code>{fileContent}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Code Stats */}
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-500/10 rounded">
                              <span className="text-blue-500">📊</span>
                            </div>
                            <div>
                              <div className="font-semibold">{fileContent.split('\n').length}</div>
                              <div className="text-xs text-muted-foreground">سطر</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-500/10 rounded">
                              <span className="text-green-500">📝</span>
                            </div>
                            <div>
                              <div className="font-semibold">{fileContent.split(/\s+/).length}</div>
                              <div className="text-xs text-muted-foreground">كلمة</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-500/10 rounded">
                              <span className="text-purple-500">🔤</span>
                            </div>
                            <div>
                              <div className="font-semibold">{fileContent.length}</div>
                              <div className="text-xs text-muted-foreground">حرف</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-orange-500/10 rounded">
                              <span className="text-orange-500">💾</span>
                            </div>
                            <div>
                              <div className="font-semibold">{(new Blob([fileContent]).size / 1024).toFixed(2)}</div>
                              <div className="text-xs text-muted-foreground">KB</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    ) : (
                      <div className="text-center py-20 text-muted-foreground">
                        <div className="inline-block p-6 bg-muted/50 rounded-full mb-4">
                          <FileCode className="h-16 w-16 opacity-50" />
                        </div>
                        <p className="text-xl font-semibold mb-2">اختر ملفاً من القائمة</p>
                        <p className="text-sm mb-4">سيتم عرض محتوى الملف هنا مع أرقام الأسطر</p>
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">تكبير/تصغير الخط</span>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">لف الأسطر</span>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">ملء الشاشة</span>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">تحميل</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {showAIExplanation && fileContent && fileAnalysis && (
                    <Card className="mt-4 p-6 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent border-primary/20 animate-fadeIn">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-6 w-6 text-primary mt-1 animate-float" />
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                            تحليل بواسطة TolzyAI
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">AI</span>
                          </h4>
                          
                          <div className="space-y-3 text-sm">
                            <div className="bg-background/50 rounded-lg p-4 border">
                              <p className="font-semibold mb-2">🎯 الغرض من الملف:</p>
                              <p className="text-muted-foreground">
                                {fileAnalysis.purpose}
                              </p>
                            </div>
                            
                            <div className="bg-background/50 rounded-lg p-4 border">
                              <p className="font-semibold mb-2">✨ المميزات الرئيسية:</p>
                              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                {fileAnalysis.keyFeatures.map((feature, i) => (
                                  <li key={i}>{feature}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {fileAnalysis.dependencies.length > 0 && (
                              <div className="bg-background/50 rounded-lg p-4 border">
                                <p className="font-semibold mb-2">📦 التبعيات:</p>
                                <div className="flex flex-wrap gap-2">
                                  {fileAnalysis.dependencies.map((dep, i) => (
                                    <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                                      {dep}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="bg-background/50 rounded-lg p-4 border">
                              <p className="font-semibold mb-2">📊 مستوى التعقيد:</p>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  fileAnalysis.complexity === 'low' ? 'bg-green-500/10 text-green-500' :
                                  fileAnalysis.complexity === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                  'bg-red-500/10 text-red-500'
                                }`}>
                                  {fileAnalysis.complexity === 'low' ? 'منخفض' :
                                   fileAnalysis.complexity === 'medium' ? 'متوسط' : 'مرتفع'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="bg-background/50 rounded-lg p-4 border">
                              <p className="font-semibold mb-2">💡 التوصيات:</p>
                              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                {fileAnalysis.recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">معاينة مباشرة</h3>
                    <Button className="gap-2">
                      <Play className="h-4 w-4" />
                      تشغيل في StackBlitz
                    </Button>
                  </div>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        اضغط على "تشغيل في StackBlitz" لمعاينة المشروع مباشرة
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Rating Section */}
            <Card className="p-6 mt-6">
              <h3 className="font-semibold mb-4">قيّم هذا المشروع</h3>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} className="hover:scale-110 transition-transform">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  </button>
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  (4.8 من 5 - 124 تقييم)
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
