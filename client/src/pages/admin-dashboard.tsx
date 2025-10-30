import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit, Shield, Loader2, Lock, Upload, Github as GithubIcon } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

// كلمة السر للمسؤول
const ADMIN_PASSWORD = "Tolzy@#159208@#";

// قائمة بريد المسؤولين (يمكنك تغييرها)
const ADMIN_EMAILS = ["mahmoud@example.com", "admin@tolzy.com"]; // ضع بريدك الإلكتروني هنا

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(auth.currentUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // نموذج المشروع الجديد
  const [uploadType, setUploadType] = useState<"manual" | "github">("manual");
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [fetchingGithub, setFetchingGithub] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    language: "",
    githubUrl: "",
    image: "",
    stars: 0,
    forks: 0,
    tags: "",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        setLocation("/login");
      } else {
        setUser(currentUser);
        // التحقق من أن المستخدم مسؤول
        const adminCheck = ADMIN_EMAILS.includes(currentUser.email || "");
        setIsAdmin(adminCheck);
        
        if (!adminCheck) {
          toast({
            title: "غير مصرح",
            description: "ليس لديك صلاحيات الوصول لهذه الصفحة",
            variant: "destructive",
          });
          setLocation("/");
        } else {
          // التحقق من كلمة السر المحفوظة
          const savedAuth = sessionStorage.getItem("admin_auth");
          if (savedAuth === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            loadProjects();
          }
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setLocation, toast]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", password);
      loadProjects();
      toast({
        title: "تم التحقق بنجاح!",
        description: "مرحباً بك في لوحة المسؤول",
      });
    } else {
      toast({
        title: "كلمة سر خاطئة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsList);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل المشاريع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGithubRepo = async () => {
    if (!githubRepoUrl) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رابط GitHub",
        variant: "destructive",
      });
      return;
    }

    setFetchingGithub(true);
    try {
      // استخراج اسم المستخدم واسم المستودع من الرابط
      const match = githubRepoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        throw new Error("رابط GitHub غير صالح");
      }

      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");

      // جلب بيانات المستودع من GitHub API
      const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`);
      if (!response.ok) {
        throw new Error("فشل جلب بيانات المستودع");
      }

      const data = await response.json();

      // ملء النموذج تلقائياً
      setNewProject({
        name: data.name,
        description: data.description || "",
        language: data.language || "",
        githubUrl: data.html_url,
        image: data.owner.avatar_url || "",
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        tags: data.topics?.join(", ") || "",
      });

      toast({
        title: "تم بنجاح!",
        description: "تم جلب بيانات المشروع من GitHub",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFetchingGithub(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const tagsArray = newProject.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
      
      await addDoc(collection(db, "projects"), {
        ...newProject,
        tags: tagsArray,
        stars: Number(newProject.stars),
        forks: Number(newProject.forks),
        createdAt: new Date(),
        createdBy: user?.email,
      });

      toast({
        title: "تم بنجاح!",
        description: "تم إضافة المشروع بنجاح",
      });

      // إعادة تعيين النموذج
      setNewProject({
        name: "",
        description: "",
        language: "",
        githubUrl: "",
        image: "",
        stars: 0,
        forks: 0,
        tags: "",
      });
      setGithubRepoUrl("");

      // إعادة تحميل المشاريع
      loadProjects();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;

    try {
      await deleteDoc(doc(db, "projects", projectId));
      toast({
        title: "تم الحذف",
        description: "تم حذف المشروع بنجاح",
      });
      loadProjects();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  // شاشة إدخال كلمة السر
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
          <Card className="w-full max-w-md p-8 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                <Lock className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">لوحة المسؤول محمية</h1>
              <p className="text-muted-foreground">
                يرجى إدخال كلمة السر للوصول إلى لوحة التحكم
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <Label htmlFor="admin-password">كلمة السر</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="mt-2"
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full gap-2">
                <Shield className="h-5 w-5" />
                تسجيل الدخول
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <Lock className="h-4 w-4 inline mr-1" />
                هذه الصفحة محمية بكلمة سر قوية
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Admin Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10">
            <Shield className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">لوحة تحكم المسؤول</h1>
            <p className="text-muted-foreground">إدارة المشاريع والمحتوى</p>
          </div>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="add">إضافة مشروع</TabsTrigger>
            <TabsTrigger value="manage">إدارة المشاريع</TabsTrigger>
          </TabsList>

          {/* Add Project Tab */}
          <TabsContent value="add" className="mt-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">إضافة مشروع جديد</h2>
              
              {/* Upload Type Selection */}
              <div className="mb-6">
                <Label className="mb-3 block">طريقة الإضافة</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={uploadType === "manual" ? "default" : "outline"}
                    onClick={() => setUploadType("manual")}
                    className="h-20 flex flex-col gap-2"
                  >
                    <Upload className="h-6 w-6" />
                    <span>إدخال يدوي</span>
                  </Button>
                  <Button
                    type="button"
                    variant={uploadType === "github" ? "default" : "outline"}
                    onClick={() => setUploadType("github")}
                    className="h-20 flex flex-col gap-2"
                  >
                    <GithubIcon className="h-6 w-6" />
                    <span>من GitHub</span>
                  </Button>
                </div>
              </div>

              {/* GitHub URL Input */}
              {uploadType === "github" && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <Label htmlFor="github-url" className="mb-2 block">رابط مستودع GitHub</Label>
                  <div className="flex gap-2">
                    <Input
                      id="github-url"
                      type="url"
                      value={githubRepoUrl}
                      onChange={(e) => setGithubRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={fetchGithubRepo}
                      disabled={fetchingGithub || !githubRepoUrl}
                      className="gap-2"
                    >
                      {fetchingGithub ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          جاري الجلب...
                        </>
                      ) : (
                        <>
                          <GithubIcon className="h-4 w-4" />
                          جلب البيانات
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    سيتم ملء الحقول تلقائياً من بيانات GitHub
                  </p>
                </div>
              )}
              
              <form onSubmit={handleAddProject} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">اسم المشروع *</Label>
                    <Input
                      id="name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="React Dashboard"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="language">لغة البرمجة *</Label>
                    <Input
                      id="language"
                      value={newProject.language}
                      onChange={(e) => setNewProject({ ...newProject, language: e.target.value })}
                      placeholder="TypeScript"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">الوصف *</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="وصف مختصر للمشروع..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="githubUrl">رابط GitHub *</Label>
                    <Input
                      id="githubUrl"
                      type="url"
                      value={newProject.githubUrl}
                      onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                      placeholder="https://github.com/user/repo"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">رابط الصورة</Label>
                    <Input
                      id="image"
                      type="url"
                      value={newProject.image}
                      onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="stars">عدد النجوم</Label>
                    <Input
                      id="stars"
                      type="number"
                      value={newProject.stars}
                      onChange={(e) => setNewProject({ ...newProject, stars: Number(e.target.value) })}
                      placeholder="1250"
                    />
                  </div>

                  <div>
                    <Label htmlFor="forks">عدد الـ Forks</Label>
                    <Input
                      id="forks"
                      type="number"
                      value={newProject.forks}
                      onChange={(e) => setNewProject({ ...newProject, forks: Number(e.target.value) })}
                      placeholder="340"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">الوسوم (مفصولة بفاصلة)</Label>
                    <Input
                      id="tags"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                      placeholder="React, Dashboard, Admin"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      إضافة المشروع
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </TabsContent>

          {/* Manage Projects Tab */}
          <TabsContent value="manage" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">المشاريع المضافة ({projects.length})</h2>
                <Button variant="outline" onClick={loadProjects}>
                  تحديث
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">جاري التحميل...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">لا توجد مشاريع مضافة بعد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{project.name}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {project.language}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>⭐ {project.stars}</span>
                          <span>🔱 {project.forks}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
