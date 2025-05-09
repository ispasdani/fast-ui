import React, { useEffect, useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { useCodeStore } from "@/store/codeStore";
import { DEPENDENCY } from "@/consts/sandpackDependecy";
import CodeDisplay from "./codeDisplay";

const ViewResult = () => {
  const codeData = useCodeStore((state) => state.codeData);
  const [cleanCode, setCleanCode] = useState("");
  const [sandpackFiles, setSandpackFiles] = useState<
    Record<string, { code: string; active: boolean }>
  >({});
  const [sandpackTemplate, setSandpackTemplate] = useState("react");

  useEffect(() => {
    if (codeData.generatedCode) {
      // Clean the code
      const processed = cleanGeneratedCode(codeData.generatedCode);
      setCleanCode(processed);

      // Set up the files based on the code type
      if (codeData.codeType === "react") {
        setupSandpackFiles(processed);
      }
    }
  }, [codeData.generatedCode, codeData.codeType]);

  const cleanGeneratedCode = (code: string) => {
    if (!code) return "";

    let cleanCode = code;

    // Remove markdown code block syntax
    cleanCode = cleanCode.replace(
      /```(jsx|javascript|react|js|html|css|angular|vue|svelte|typescript)?|```/g,
      ""
    );

    // Remove leading/trailing whitespace
    cleanCode = cleanCode.trim();

    // Apply framework-specific cleaning if needed
    if (codeData.codeType === "react") {
      // Ensure proper React import
      if (!cleanCode.includes("import React")) {
        cleanCode = 'import React from "react";\n' + cleanCode;
      }

      // Handle component export
      if (!cleanCode.includes("export default")) {
        const componentMatch = cleanCode.match(
          /function\s+([A-Z][a-zA-Z0-9]*)/
        );
        if (componentMatch && componentMatch[1]) {
          const componentName = componentMatch[1];
          cleanCode = cleanCode + `\n\nexport default ${componentName};`;
        }
      }
    }

    return cleanCode;
  };

  const setupSandpackFiles = (code: string) => {
    setSandpackTemplate("react");
    setSandpackFiles({
      "/App.js": {
        code:
          code ||
          `export default function App() {
          return <div className="flex justify-center items-center w-full h-full">
            <h1>Use AI Generator first to display your code here...</h1>
          </div>
        }`,
        active: true,
      },
    });
  };

  return (
    <div className="w-full">
      {codeData.codeType === "react" ? (
        <Sandpack
          template={sandpackTemplate as any}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            showNavigator: true,
            showTabs: true,
            editorHeight: 500,
          }}
          customSetup={{
            dependencies: {
              ...DEPENDENCY,
            },
          }}
          files={sandpackFiles}
        />
      ) : (
        <CodeDisplay code={cleanCode} frameeworkType={codeData.codeType} />
      )}
    </div>
  );
};

export default ViewResult;
