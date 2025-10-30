import { create } from 'zustand';

interface EditorState {
  code: string;
  language: string;
  output: string;
  errors: Array<{ line: number; message: string; fix?: string }>;
  isAnalyzing: boolean;
  isGenerating: boolean;
  autoSaveEnabled: boolean;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setOutput: (output: string) => void;
  setErrors: (errors: Array<{ line: number; message: string; fix?: string }>) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  clearErrors: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: '',
  language: 'javascript',
  output: '',
  errors: [],
  isAnalyzing: false,
  isGenerating: false,
  autoSaveEnabled: true,
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setOutput: (output) => set({ output }),
  setErrors: (errors) => set({ errors }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),
  clearErrors: () => set({ errors: [] }),
}));
