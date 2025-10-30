import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Code2, Loader2, Sparkles, Copy, Download } from 'lucide-react';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Editor from '@monaco-editor/react';

export default function TextToCode() {
  const [, setLocation] = useLocation();
  const { user, userData } = useAuthStore();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const examples = [
    {
      title: 'Login Page',
      prompt: 'Build a React login page with email and password fields and a login button',
      language: 'javascript',
    },
    {
      title: 'API endpoint',
      prompt: 'Create an Express.js API endpoint to create a new user in the database',
      language: 'javascript',
    },
    {
      title: 'Sort Function',
      prompt: 'Write a Python function to sort a list of numbers using Quick Sort algorithm',
      language: 'python',
    },
  ];

  const generateCode = async () => {
    if (!user) {
      setLocation('/login');
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "الرجاء إدخال وصف",
        description: "اكتب وصفاً للكود الذي تريد إنشاءه",
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

    setIsGenerating(true);
    setGeneratedCode('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          language,
        }),
      });

      const data = await response.json();

      if (data.code) {
        setGeneratedCode(data.code);
        
        // Update usage count
        await updateDoc(doc(db, 'users', user.uid), {
          usageCount: (userData?.usageCount || 0) + 1,
        });

        toast({
          title: "تم التوليد بنجاح",
          description: "تم إنشاء الكود بنجاح",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في التوليد",
        description: "حدث خطأ أثناء توليد الكود",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الكود إلى الحافظة",
    });
  };

  const downloadCode = () => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      cpp: 'cpp',
    };

    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-code.${extensions[language] || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "تم التنزيل",
      description: "تم تنزيل الكود بنجاح",
    });
  };

  const saveAsProject = async () => {
    if (!user || !generatedCode) return;

    try {
      const projectRef = await addDoc(collection(db, 'projects'), {
        userId: user.uid,
        name: prompt.slice(0, 50),
        description: prompt,
        language,
        code: generatedCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await updateDoc(doc(db, 'users', user.uid), {
        projects: [...(userData?.projects || []), projectRef.id],
      });

      toast({
        title: "تم الحفظ",
        description: "تم حفظ المشروع بنجاح",
      });

      setLocation(`/editor?project=${projectRef.id}`);
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ المشروع",
        variant: "destructive",
      });
    }
  };

  const useExample = (example: typeof examples[0]) => {
    setPrompt(example.prompt);
    setLanguage(example.language);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
Describe What You Want to Create
                </CardTitle>
                <CardDescription>
                  Write a detailed description of the code you want AI to create
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Programming Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Example: Build a React login page with email and password..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={generateCode}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Examples</CardTitle>
                <CardDescription>
                  Try one of these examples to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-right h-auto py-3"
                    onClick={() => useExample(example)}
                  >
                    <div className="text-right">
                      <div className="font-semibold mb-1">{example.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {example.prompt}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Usage Stats */}
            {userData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Daily Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">
                      {userData.usageCount} / {userData.dailyLimit}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {userData.plan === 'pro' ? 'Pro' : 'Free'}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((userData.usageCount / userData.dailyLimit) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-primary" />
                    Generated Code
                  </CardTitle>
                  {generatedCode && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={copyCode}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadCode}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" onClick={saveAsProject}>
                        Save as Project
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  {generatedCode
                    ? 'Code generated successfully'
                    : 'Generated code will appear here'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {generatedCode ? (
                  <div className="h-[600px] border rounded-lg overflow-hidden">
                    <Editor
                      height="100%"
                      language={language}
                      value={generatedCode}
                      theme="vs-dark"
                      options={{
                        readOnly: false,
                        minimap: { enabled: true },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                      }}
                      onChange={(value) => setGeneratedCode(value || '')}
                    />
                  </div>
                ) : (
                  <div className="h-[600px] border rounded-lg flex items-center justify-center bg-muted/20">
                    <div className="text-center text-muted-foreground">
                      <Code2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Write a description and click "Generate Code"</p>
                      <p className="text-sm mt-2">Generated code will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
