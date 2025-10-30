import { HistoryPanel, SavedCode } from "../history-panel";
import { ThemeProvider } from "@/lib/theme-provider";
import { useState } from "react";

const mockSavedCodes: SavedCode[] = [
  {
    id: "1",
    title: "React Login Component",
    language: "typescript",
    code: "function LoginForm() { return <div>Login</div> }",
    timestamp: new Date(2025, 0, 20),
  },
  {
    id: "2",
    title: "Python Data Processing",
    language: "python",
    code: "def process_data(data): return data.sort()",
    timestamp: new Date(2025, 0, 19),
  },
];

export default function HistoryPanelExample() {
  const [savedCodes, setSavedCodes] = useState(mockSavedCodes);

  return (
    <ThemeProvider>
      <div className="h-screen">
        <HistoryPanel
          savedCodes={savedCodes}
          onLoadCode={(code) => console.log("Load code:", code)}
          onDeleteCode={(id) => setSavedCodes((prev) => prev.filter((c) => c.id !== id))}
        />
      </div>
    </ThemeProvider>
  );
}
