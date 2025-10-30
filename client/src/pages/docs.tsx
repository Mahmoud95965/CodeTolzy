import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Zap, Code2, MessageSquare, Save } from "lucide-react";

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Learn how to use CodeTolzy AI to supercharge your development workflow
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <Card className="p-4 sticky top-20">
              <h3 className="font-semibold mb-4">Contents</h3>
              <nav className="space-y-2 text-sm">
                <a href="#getting-started" className="block text-muted-foreground hover:text-primary">
                  Getting Started
                </a>
                <a href="#features" className="block text-muted-foreground hover:text-primary">
                  Key Features
                </a>
                <a href="#editor" className="block text-muted-foreground hover:text-primary">
                  Using the Editor
                </a>
                <a href="#ai-chat" className="block text-muted-foreground hover:text-primary">
                  AI Assistant
                </a>
                <a href="#history" className="block text-muted-foreground hover:text-primary">
                  Code History
                </a>
              </nav>
            </Card>
          </aside>

          <div className="lg:col-span-3 space-y-8">
            <section id="getting-started">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Getting Started</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    CodeTolzy AI is an intelligent code generation platform that helps you write better code faster. 
                    Using advanced AI models, you can generate complete code snippets, components, and functions 
                    with simple natural language descriptions.
                  </p>
                  <h3 className="text-lg font-semibold mt-6 mb-3">Quick Start</h3>
                  <ol className="space-y-2 text-muted-foreground">
                    <li>1. Navigate to the Editor page</li>
                    <li>2. Choose your programming language</li>
                    <li>3. Describe what you want to build in the AI chat</li>
                    <li>4. Review and customize the generated code</li>
                  </ol>
                </div>
              </Card>
            </section>

            <section id="features">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Key Features</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Multi-Language Support</h3>
                    <p className="text-muted-foreground">
                      Generate code in JavaScript, TypeScript, Python, HTML, CSS, and more. 
                      Switch between languages seamlessly.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Intelligent Code Editing</h3>
                    <p className="text-muted-foreground">
                      Ask AI to modify existing code. Add features, fix bugs, or refactor 
                      with natural language commands.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Professional Editor</h3>
                    <p className="text-muted-foreground">
                      Monaco Editor provides syntax highlighting, auto-completion, and all 
                      the features you expect from a modern IDE.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            <section id="editor">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Code2 className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Using the Editor</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The code editor is your main workspace. It features a powerful Monaco Editor 
                    with all the capabilities you need for professional development.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-4">Editor Controls</h3>
                  <ul className="space-y-2 ml-4">
                    <li><strong>Copy Code:</strong> Instantly copy your code to clipboard</li>
                    <li><strong>Download:</strong> Save code as a file to your computer</li>
                    <li><strong>Save:</strong> Store code in history for later access</li>
                    <li><strong>Clear:</strong> Reset the editor and start fresh</li>
                  </ul>
                </div>
              </Card>
            </section>

            <section id="ai-chat">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">AI Assistant</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The AI chat panel is where the magic happens. Describe what you need in plain English, 
                    and watch as AI generates production-ready code.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-4">Example Prompts</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2 font-mono text-sm">
                    <p>"Create a React login form with email validation"</p>
                    <p>"Generate a Python function to sort a list of dictionaries"</p>
                    <p>"Add error handling to the current code"</p>
                    <p>"Convert this JavaScript to TypeScript"</p>
                  </div>
                  <p className="mt-4">
                    Be specific about what you want, and the AI will provide better results. 
                    You can also ask for modifications to existing code in the editor.
                  </p>
                </div>
              </Card>
            </section>

            <section id="history">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Save className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Code History</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Never lose your work. The history panel stores all your saved code snippets 
                    with timestamps and language labels.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-4">Managing History</h3>
                  <ul className="space-y-2 ml-4">
                    <li>Click any saved code to load it into the editor</li>
                    <li>Delete codes you no longer need</li>
                    <li>All history is stored locally in your browser</li>
                  </ul>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
