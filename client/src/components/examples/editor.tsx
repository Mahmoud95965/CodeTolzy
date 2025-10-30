import Editor from "../../pages/editor";
import { ThemeProvider } from "@/lib/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export default function EditorExample() {
  return (
    <ThemeProvider>
      <Editor />
      <Toaster />
    </ThemeProvider>
  );
}
