import { CodeEditor } from "../code-editor";
import { ThemeProvider } from "@/lib/theme-provider";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

export default function CodeEditorExample() {
  const [code, setCode] = useState('function hello() {\n  console.log("Hello, World!");\n}');
  const [language, setLanguage] = useState("javascript");

  return (
    <ThemeProvider>
      <div className="h-screen">
        <CodeEditor
          code={code}
          language={language}
          onCodeChange={(newCode) => setCode(newCode || "")}
          onLanguageChange={setLanguage}
          onSave={() => console.log("Save triggered")}
          onClear={() => setCode("")}
        />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
