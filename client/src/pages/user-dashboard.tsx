import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, BookmarkIcon, Heart, Star, GitFork, Eye } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(auth.currentUser);
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        setLocation("/login");
      } else {
        setUser(currentUser);
        loadSavedProjects(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [setLocation]);

  const loadSavedProjects = async (userId: string) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "savedProjects"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedProjects(projects);
    } catch (error) {
      console.error("Error loading saved projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {/* User Profile Header */}
        <Card className="p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 mx-auto sm:mx-0">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
              <AvatarFallback className="text-xl md:text-2xl bg-primary/10">
                {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-right w-full">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {user.displayName || "مستخدم"}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 break-all">{user.email}</p>
              
              <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm justify-center sm:justify-start">
                <div className="flex items-center gap-2">
                  <BookmarkIcon className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  <span>{savedProjects.length} مشروع محفوظ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  <span>0 إعجاب</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full sm:w-auto text-sm md:text-base">
              <User className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              تعديل الملف الشخصي
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="saved" className="text-xs md:text-sm">المشاريع المحفوظة</TabsTrigger>
            <TabsTrigger value="liked" className="text-xs md:text-sm">المفضلة</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs md:text-sm">النشاط</TabsTrigger>
          </TabsList>

          {/* Saved Projects Tab */}
          <TabsContent value="saved" className="mt-4 md:mt-6">
            {loading ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-sm md:text-base text-muted-foreground">جاري التحميل...</p>
              </div>
            ) : savedProjects.length === 0 ? (
              <Card className="p-8 md:p-12 text-center">
                <BookmarkIcon className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  لا توجد مشاريع محفوظة
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                  ابدأ بحفظ المشاريع المفضلة لديك لتجدها هنا
                </p>
                <Link href="/">
                  <Button className="text-sm md:text-base">استكشف المشاريع</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {savedProjects.map((project) => (
                  <Link key={project.id} href={`/project/${project.projectId}`}>
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
                            {project.language || "JavaScript"}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {project.description}
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
          </TabsContent>

          {/* Liked Projects Tab */}
          <TabsContent value="liked" className="mt-4 md:mt-6">
            <Card className="p-8 md:p-12 text-center">
              <Heart className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                لا توجد مشاريع مفضلة
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                قم بالإعجاب بالمشاريع لتظهر هنا
              </p>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-4 md:mt-6">
            <Card className="p-8 md:p-12 text-center">
              <Eye className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                لا يوجد نشاط حتى الآن
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                سيظهر نشاطك الأخير هنا
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
