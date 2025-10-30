import { useState } from "react";
import { Header } from "@/components/header";
import { CodeEditor } from "@/components/code-editor";
import { ChatPanel } from "@/components/chat-panel";
import { HistoryPanel, SavedCode } from "@/components/history-panel";
import { ExplanationDialog } from "@/components/explanation-dialog";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Editor() {
  const [code, setCode] = useState("// Start typing or ask AI to generate code...\n");
  const [language, setLanguage] = useState("javascript");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>(() => {
    const saved = localStorage.getItem("codeforge-history");
    if (!saved) return [];
    
    const parsed = JSON.parse(saved);
    return parsed.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  });
  const [chatOpen, setChatOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: message,
          language,
          currentCode: code !== "// Start typing or ask AI to generate code...\n" ? code : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      const response = await res.json() as { code: string; message: string };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setCode(response.code);
      setMessages((prev) => [...prev, aiMessage]);

      toast({
        title: "Code Generated!",
        description: "AI has created your code successfully",
      });
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message || "Failed to generate code"}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: error.message || "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCode = () => {
    const newSavedCode: SavedCode = {
      id: Date.now().toString(),
      title: `Code Snippet ${savedCodes.length + 1}`,
      language,
      code,
      timestamp: new Date(),
    };

    const updated = [newSavedCode, ...savedCodes];
    setSavedCodes(updated);
    localStorage.setItem("codeforge-history", JSON.stringify(updated));

    toast({
      title: "Saved!",
      description: "Code saved to history",
    });
  };

  const handleLoadCode = (savedCode: SavedCode) => {
    setCode(savedCode.code);
    setLanguage(savedCode.language);
    setHistoryOpen(false);
    toast({
      title: "Loaded!",
      description: `Loaded: ${savedCode.title}`,
    });
  };

  const handleDeleteCode = (id: string) => {
    const updated = savedCodes.filter((c) => c.id !== id);
    setSavedCodes(updated);
    localStorage.setItem("codeforge-history", JSON.stringify(updated));
    toast({
      title: "Deleted",
      description: "Code removed from history",
    });
  };

  const handleClear = () => {
    setCode("// Start typing or ask AI to generate code...\n");
    setMessages([]);
    toast({
      title: "Cleared",
      description: "Editor and chat cleared",
    });
  };

  const handleExplainCode = async () => {
    if (!code || code === "// Start typing or ask AI to generate code...\n") {
      toast({
        title: "No Code",
        description: "Please write some code first",
        variant: "destructive",
      });
      return;
    }

    setExplanationOpen(true);
    setIsExplaining(true);
    setExplanation("");

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      const response = await res.json() as { explanation: string; message: string };
      setExplanation(response.explanation);

      toast({
        title: "تم الشرح!",
        description: "تم تحليل الكود بنجاح",
      });
    } catch (error: any) {
      setExplanation(`خطأ: ${error.message || "فشل في شرح الكود"}`);
      toast({
        title: "خطأ",
        description: error.message || "فشل في شرح الكود",
        variant: "destructive",
      });
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {chatOpen && (
          <div className="w-80 lg:w-96 flex-shrink-0">
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 p-2 border-b bg-card">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatOpen(!chatOpen)}
              data-testid="button-toggle-chat"
            >
              {chatOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
            </Button>
            
            <div className="flex-1" />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHistoryOpen(!historyOpen)}
              data-testid="button-toggle-history"
            >
              {historyOpen ? (
                <PanelRightClose className="h-5 w-5" />
              ) : (
                <PanelRightOpen className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <CodeEditor
              code={code}
              language={language}
              onCodeChange={(newCode) => setCode(newCode || "")}
              onLanguageChange={setLanguage}
              onSave={handleSaveCode}
              onClear={handleClear}
              onExplain={handleExplainCode}
            />
          </div>
        </div>

        {historyOpen && (
          <div className="w-72 flex-shrink-0">
            <HistoryPanel
              savedCodes={savedCodes}
              onLoadCode={handleLoadCode}
              onDeleteCode={handleDeleteCode}
            />
          </div>
        )}
      </div>

      <ExplanationDialog
        open={explanationOpen}
        onOpenChange={setExplanationOpen}
        explanation={explanation}
        isLoading={isExplaining}
      />
    </div>
  );
}
