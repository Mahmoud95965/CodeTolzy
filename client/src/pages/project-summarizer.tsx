import { useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Upload, Loader2, FileCode, FolderOpen, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface FileInfo {
  name: string;
  path: string;
  content: string;
  extension: string;
}

export default function ProjectSummarizer() {
  const [, setLocation] = useLocation();
  const { user, userData } = useAuthStore();
  const { toast } = useToast();
  
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [summary, setSummary] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const supportedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.html', '.css', '.json', '.md'];

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const items = Array.from(e.dataTransfer.items);
    processItems(items);
  }, []);

  const processItems = async (items: DataTransferItem[]) => {
    const filesList: FileInfo[] = [];

    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await processEntry(entry, '', filesList);
        }
      }
    }

    setFiles(filesList);
    toast({
      title: "تم تحميل الملفات",
      description: `تم تحميل ${filesList.length} ملف`,
    });
  };

  const processEntry = async (entry: any, path: string, filesList: FileInfo[]) => {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve) => entry.file(resolve));
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (supportedExtensions.includes(extension)) {
        const content = await file.text();
        filesList.push({
          name: file.name,
          path: path + file.name,
          content,
          extension,
        });
      }
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const entries = await new Promise<any[]>((resolve) => {
        reader.readEntries(resolve);
      });

      for (const childEntry of entries) {
        await processEntry(childEntry, path + entry.name + '/', filesList);
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const filesList: FileInfo[] = [];

    for (const file of selectedFiles) {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (supportedExtensions.includes(extension)) {
        const content = await file.text();
        filesList.push({
          name: file.name,
          path: file.name,
          content,
          extension,
        });
      }
    }

    setFiles(filesList);
    toast({
      title: "تم تحميل الملفات",
      description: `تم تحميل ${filesList.length} ملف`,
    });
  };

  const analyzeProject = async () => {
    if (!user) {
      setLocation('/login');
      return;
    }

    if (files.length === 0) {
      toast({
        title: "لا توجد ملفات",
        description: "الرجاء تحميل ملفات المشروع أولاً",
        variant: "destructive",
      });
      return;
    }

    if (userData?.plan !== 'pro') {
      toast({
        title: "ميزة Pro فقط",
        description: "تلخيص المشاريع متاح للمشتركين في الباقة Pro فقط",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setSummary('');

    try {
      const response = await fetch('/api/summarize-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });

      const data = await response.json();

      if (data.summary) {
        setSummary(data.summary);
        toast({
          title: "تم التحليل",
          description: "تم تلخيص المشروع بنجاح",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في التحليل",
        description: "حدث خطأ أثناء تحليل المشروع",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
Upload Project
                </CardTitle>
                <CardDescription>
Drag and drop project folder or select files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                >
                  <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
  Drag and drop project folder here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
  Or click to select files
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-input"
                    accept={supportedExtensions.join(',')}
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="file-input" className="cursor-pointer">
Select Files
                    </label>
                  </Button>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Supported Extensions:</p>
                  <div className="flex flex-wrap gap-2">
                    {supportedExtensions.map((ext) => (
                      <Badge key={ext} variant="secondary">
                        {ext}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Files List */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileCode className="h-5 w-5 text-primary" />
Uploaded Files
                    </span>
                    <Badge>{files.length} file{files.length > 1 ? 's' : ''}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileCode className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{file.path}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{file.extension}</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Button
                    className="w-full mt-4"
                    size="lg"
                    onClick={analyzeProject}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
Analyze Project
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Section */}
          <div>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
Project Summary
                </CardTitle>
                <CardDescription>
                  {summary
                    ? 'Comprehensive analysis of your project'
                    : 'Summary will appear here after analysis'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {summary ? (
                  <ScrollArea className="h-[600px]">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap">{summary}</div>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-[600px] flex items-center justify-center border rounded-lg bg-muted/20">
                    <div className="text-center text-muted-foreground">
                      <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Upload project and click "Analyze"</p>
                      <p className="text-sm mt-2">Smart summary will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pro Notice */}
        {userData?.plan !== 'pro' && (
          <Card className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pro Feature Only</CardTitle>
              <CardDescription className="text-lg">
                Project summarizer is available for Pro subscribers
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => setLocation('/pricing')}
              >
Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
