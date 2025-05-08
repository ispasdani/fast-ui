import { create } from "zustand";

interface CodeData {
  imageBase64: string;
  description: string;
  generatedCode: string;
  selectedModel: string;
  selectedModelIcon: string;
  codeType: string; // NEW FIELD for storing the code type
}

interface CodeStore {
  codeData: CodeData;
  setCodeData: (newData: Partial<CodeData>) => void;
}

export const useCodeStore = create<CodeStore>((set) => ({
  codeData: {
    imageBase64: "",
    description: "",
    generatedCode: "",
    selectedModel: "",
    selectedModelIcon: "",
    codeType: "react", // Default to React
  },
  setCodeData: (newData) =>
    set((state) => ({
      codeData: { ...state.codeData, ...newData },
    })),
}));
