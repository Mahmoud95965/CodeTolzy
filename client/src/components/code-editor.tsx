import { Editor } from "@monaco-editor/react";
import { useTheme } from "@/lib/theme-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Trash2, Save, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CodeEditorProps {
  code: string;
  language: string;
  onCodeChange: (code: string | undefined) => void;
  onLanguageChange: (language: string) => void;
  onSave?: () => void;
  onClear?: () => void;
  onExplain?: () => void;
}

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
];

export function CodeEditor({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onSave,
  onClear,
  onExplain,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const handleDownload = () => {
    const extension = language === "javascript" || language === "typescript" 
      ? `.${language.substring(0, 2)}` 
      : language === "python" ? ".py" : `.${language}`;
    
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Code file downloaded",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b bg-card">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-40" data-testid="select-language">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            data-testid="button-copy"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            data-testid="button-download"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {onSave && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              data-testid="button-save"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
          {onClear && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              data-testid="button-clear"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
          {onExplain && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExplain}
              data-testid="button-explain"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Explain
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={onCodeChange}
          theme={theme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
