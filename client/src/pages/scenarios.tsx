import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Loader2, Server, Globe, Bot, Smartphone, Database, Layout, Zap } from 'lucide-react';
import { doc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: any;
  language: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPro?: boolean;
}

const scenarios: Scenario[] = [
  {
    id: 'nodejs-api',
    title: 'Build Ready API with Node.js',
    description: 'Create complete REST API with Express.js including authentication, database, and documentation',
    icon: Server,
    language: 'javascript',
    tags: ['Node.js', 'Express', 'REST API', 'MongoDB'],
    difficulty: 'intermediate',
  },
  {
    id: 'react-login',
    title: 'React Login Page',
    description: 'Professional login form with data validation and state management',
    icon: Globe,
    language: 'javascript',
    tags: ['React', 'Authentication', 'Forms'],
    difficulty: 'beginner',
  },
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot',
    description: 'Develop smart chatbot using OpenAI API with interactive interface',
    icon: Bot,
    language: 'javascript',
    tags: ['AI', 'OpenAI', 'Chatbot', 'React'],
    difficulty: 'advanced',
    isPro: true,
  },
  {
    id: 'flutter-todo',
    title: 'Flutter To-Do App',
    description: 'Mobile app for task management with local database',
    icon: Smartphone,
    language: 'dart',
    tags: ['Flutter', 'Mobile', 'SQLite'],
    difficulty: 'intermediate',
  },
  {
    id: 'python-scraper',
    title: 'Python Web Scraper',
    description: 'Tool for extracting data from websites using BeautifulSoup',
    icon: Database,
    language: 'python',
    tags: ['Python', 'Web Scraping', 'Data'],
    difficulty: 'intermediate',
  },
  {
    id: 'nextjs-blog',
    title: 'Complete Next.js Blog',
    description: 'Blog website with CMS, SEO, and responsive design',
    icon: Layout,
    language: 'javascript',
    tags: ['Next.js', 'Blog', 'CMS', 'SEO'],
    difficulty: 'advanced',
    isPro: true,
  },
  {
    id: 'ecommerce-cart',
    title: 'E-commerce Shopping Cart',
    description: 'Complete shopping cart system with product management and payment',
    icon: Zap,
    language: 'javascript',
    tags: ['React', 'E-commerce', 'Payment'],
    difficulty: 'advanced',
    isPro: true,
  },
  {
    id: 'dashboard-admin',
    title: 'Admin Dashboard',
    description: 'Professional dashboard with charts and interactive tables',
    icon: Layout,
    language: 'javascript',
    tags: ['React', 'Dashboard', 'Charts'],
    difficulty: 'intermediate',
  },
];

export default function Scenarios() {
  const [, setLocation] = useLocation();
  const { user, userData } = useAuthStore();
  const { toast } = useToast();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const generateScenario = async (scenario: Scenario) => {
    if (!user) {
      setLocation('/login');
      return;
    }

    if (scenario.isPro && userData?.plan !== 'pro') {
      toast({
        title: "ميزة Pro فقط",
        description: "هذا السيناريو متاح للمشتركين في الباقة Pro فقط",
        variant: "destructive",
      });
      return;
    }

    if (userData && userData.usageCount >= userData.dailyLimit && userData.plan === 'free') {
      toast({
        title: "تم تجاوز الحد اليومي",
        description: "قم بالترقية إلى الباقة Pro للحصول على عدد غير محدود",
        variant: "destructive",
      });
      return;
    }

    setGeneratingId(scenario.id);

    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          title: scenario.title,
          description: scenario.description,
          language: scenario.language,
        }),
      });

      const data = await response.json();

      if (data.files) {
        // Create new project in Firestore
        const projectRef = await addDoc(collection(db, 'projects'), {
          userId: user.uid,
          name: scenario.title,
          description: scenario.description,
          language: scenario.language,
          files: data.files,
          scenarioId: scenario.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Update usage count
        await updateDoc(doc(db, 'users', user.uid), {
          usageCount: (userData?.usageCount || 0) + 1,
          projects: [...(userData?.projects || []), projectRef.id],
        });

        toast({
          title: "تم إنشاء المشروع",
          description: "تم إنشاء السيناريو بنجاح",
        });

        setLocation(`/editor?project=${projectRef.id}`);
      }
    } catch (error) {
      toast({
        title: "خطأ في الإنشاء",
        description: "حدث خطأ أثناء إنشاء السيناريو",
        variant: "destructive",
      });
    } finally {
      setGeneratingId(null);
    }
  };

  const filteredScenarios = scenarios.filter(scenario => {
    if (selectedDifficulty === 'all') return true;
    return scenario.difficulty === selectedDifficulty;
  });

  const difficultyColors = {
    beginner: 'bg-green-500',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-red-500',
  };

  const difficultyLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Ready Project</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready-made scenarios created with AI to start your project instantly
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('all')}
          >
All
          </Button>
          <Button
            variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('beginner')}
          >
Beginner
          </Button>
          <Button
            variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('intermediate')}
          >
Intermediate
          </Button>
          <Button
            variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('advanced')}
          >
Advanced
          </Button>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario) => {
            const Icon = scenario.icon;
            const isGenerating = generatingId === scenario.id;

            return (
              <Card 
                key={scenario.id} 
                className="hover:shadow-lg transition-all hover:scale-105 relative overflow-hidden"
              >
                {scenario.isPro && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Pro
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{scenario.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${difficultyColors[scenario.difficulty]}`} />
                        <span className="text-xs text-muted-foreground">
                          {difficultyLabels[scenario.difficulty]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {scenario.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {scenario.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => generateScenario(scenario)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
Create Project
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pro CTA */}
        {userData?.plan === 'free' && (
          <Card className="mt-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">احصل على المزيد مع Pro</CardTitle>
              <CardDescription className="text-lg">
                الوصول إلى جميع السيناريوهات المتقدمة وعدد غير محدود من العمليات
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => setLocation('/pricing')}
              >
                الترقية إلى Pro
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
