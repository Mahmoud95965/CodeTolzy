import { useEffect, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useEditorStore } from '@/store/editorStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Bug, 
  Save, 
  Download, 
  Upload, 
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SmartEditorProps {
  projectId?: string;
}

export default function SmartEditor({ projectId }: SmartEditorProps) {
  const { 
    code, 
    language, 
    output, 
    errors, 
    isAnalyzing, 
    isGenerating,
    setCode, 
    setLanguage, 
    setOutput, 
    setErrors,
    setIsAnalyzing,
    clearErrors 
  } = useEditorStore();
  
  const { user, userData } = useAuthStore();
  const { toast } = useToast();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    if (code && projectId && user) {
      const timer = setTimeout(() => {
        saveProject();
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [code]);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Setup AI autocomplete
    setupAIAutocomplete(monaco);

    // Setup error markers
    monaco.editor.onDidChangeMarkers(() => {
      const markers = monaco.editor.getModelMarkers({});
      if (markers.length > 0) {
        const editorErrors = markers.map(marker => ({
          line: marker.startLineNumber,
          message: marker.message,
        }));
        setErrors(editorErrors);
      }
    });
  };

  const setupAIAutocomplete = (monaco: Monaco) => {
    // Register AI-powered autocomplete provider
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: async (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // Call AI API for suggestions
        try {
          const response = await fetch('/api/autocomplete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: textUntilPosition,
              language,
              position: {
                line: position.lineNumber,
                column: position.column,
              },
            }),
          });

          const data = await response.json();
          
          if (data.suggestions) {
            return {
              suggestions: data.suggestions.map((suggestion: string, index: number) => ({
                label: suggestion,
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: suggestion,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endColumn: position.column,
                },
                sortText: `0${index}`,
              })),
            };
          }
        } catch (error) {
          console.error('Autocomplete error:', error);
        }

        return { suggestions: [] };
      },
    });
  };

  const analyzeCode = async () => {
    if (!code) {
      toast({
        title: "لا يوجد كود",
        description: "الرجاء كتابة بعض الأكواد أولاً",
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

    setIsAnalyzing(true);
    clearErrors();

    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (data.errors && data.errors.length > 0) {
        setErrors(data.errors);
        toast({
          title: "تم اكتشاف أخطاء",
          description: `تم العثور على ${data.errors.length} خطأ في الكود`,
        });
      } else {
        toast({
          title: "الكود سليم",
          description: "لم يتم العثور على أخطاء",
        });
      }

      // Update usage count
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          usageCount: (userData?.usageCount || 0) + 1,
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في التحليل",
        description: "حدث خطأ أثناء تحليل الكود",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyFix = (fix: string, line: number) => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      const lineContent = model.getLineContent(line);
      
      editorRef.current.executeEdits('apply-fix', [{
        range: {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: lineContent.length + 1,
        },
        text: fix,
      }]);

      toast({
        title: "تم تطبيق الإصلاح",
        description: `تم إصلاح السطر ${line}`,
      });
    }
  };

  const explainCode = async () => {
    if (!code) {
      toast({
        title: "لا يوجد كود",
        description: "الرجاء كتابة بعض الأكواد أولاً",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      setOutput(data.explanation || 'لم يتم الحصول على شرح');
      
      toast({
        title: "تم الشرح",
        description: "تم شرح الكود بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في الشرح",
        description: "حدث خطأ أثناء شرح الكود",
        variant: "destructive",
      });
    }
  };

  const runCode = async () => {
    if (!code) {
      toast({
        title: "لا يوجد كود",
        description: "الرجاء كتابة بعض الأكواد أولاً",
        variant: "destructive",
      });
      return;
    }

    setOutput('جاري التشغيل...');

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      setOutput(data.output || data.error || 'لا يوجد إخراج');
    } catch (error) {
      setOutput('حدث خطأ أثناء تشغيل الكود');
    }
  };

  const saveProject = async () => {
    if (!user || !projectId) return;

    try {
      await updateDoc(doc(db, 'projects', projectId), {
        code,
        language,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Auto-save error:', error);
    }
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

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extensions[language] || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "تم التنزيل",
      description: "تم تنزيل الكود بنجاح",
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-background/95 backdrop-blur p-2 flex items-center gap-2 flex-wrap">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-1.5 border rounded-md bg-background"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="cpp">C++</option>
        </select>

        <Separator orientation="vertical" className="h-6" />

        <Button size="sm" variant="outline" onClick={runCode}>
          <Play className="h-4 w-4 mr-1" />
          تشغيل
        </Button>

        <Button 
          size="sm" 
          variant="outline" 
          onClick={analyzeCode}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Bug className="h-4 w-4 mr-1" />
          )}
          تحليل
        </Button>

        <Button size="sm" variant="outline" onClick={explainCode}>
          <Lightbulb className="h-4 w-4 mr-1" />
          شرح
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button size="sm" variant="outline" onClick={downloadCode}>
          <Download className="h-4 w-4 mr-1" />
          تنزيل
        </Button>

        {errors.length > 0 && (
          <Badge variant="destructive" className="mr-auto">
            {errors.length} خطأ
          </Badge>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              snippetSuggestions: 'top',
            }}
          />
        </div>

        {/* Side Panel */}
        <div className="w-80 border-l bg-background/50 backdrop-blur flex flex-col">
          {/* Errors Panel */}
          {errors.length > 0 && (
            <Card className="m-2 border-destructive">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  الأخطاء المكتشفة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {errors.map((error, index) => (
                      <div key={index} className="p-2 border rounded-md bg-background">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-xs font-medium">السطر {error.line}</span>
                          {error.fix && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-xs"
                              onClick={() => applyFix(error.fix!, error.line)}
                            >
                              إصلاح
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{error.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Output Panel */}
          <Card className="m-2 flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                الإخراج
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {output || 'لا يوجد إخراج بعد...'}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
