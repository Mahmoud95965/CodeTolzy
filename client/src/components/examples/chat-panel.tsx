import { ChatPanel } from "../chat-panel";
import { ThemeProvider } from "@/lib/theme-provider";
import { useState } from "react";

export default function ChatPanelExample() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "user" as const,
      content: "Create a React button component",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "assistant" as const,
      content: "I'll create a React button component for you.",
      timestamp: new Date(),
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: message,
        timestamp: new Date(),
      },
    ]);
    
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Code generated successfully!",
        timestamp: new Date(),
      },
    ]);
    setIsGenerating(false);
  };

  return (
    <ThemeProvider>
      <div className="h-screen">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
        />
      </div>
    </ThemeProvider>
  );
}
