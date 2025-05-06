import React, { useEffect, useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { useCodeStore } from "@/store/codeStore";
import { DEPENDENCY } from "@/consts/sandpackDependecy";

const ViewResult = () => {
  const codeData = useCodeStore((state) => state.codeData);
  const [cleanCode, setCleanCode] = useState("");

  useEffect(() => {
    if (codeData.generatedCode) {
      // Clean the code
      const processed = cleanGeneratedCode(codeData.generatedCode);
      setCleanCode(processed);
    }
  }, [codeData.generatedCode]);

  const cleanGeneratedCode = (code: string) => {
    if (!code) return "";

    let cleanCode = code;

    // Remove markdown code block syntax
    cleanCode = cleanCode.replace(/```(jsx|javascript|react|js)?|```/g, "");

    // Remove leading/trailing whitespace
    cleanCode = cleanCode.trim();

    // Ensure proper React import
    if (!cleanCode.includes("import React")) {
      cleanCode = 'import React from "react";\n' + cleanCode;
    }

    // Handle component export
    if (!cleanCode.includes("export default")) {
      const componentMatch = cleanCode.match(/function\s+([A-Z][a-zA-Z0-9]*)/);
      if (componentMatch && componentMatch[1]) {
        const componentName = componentMatch[1];
        cleanCode = cleanCode + `\n\nexport default ${componentName};`;
      }
    }

    return cleanCode;
  };

  return (
    <div>
      <Sandpack
        template="react"
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
        files={{
          "/App.js": {
            code:
              cleanCode ||
              `export default function App() {
              return <div className="flex justify-center items-center w-full h-full">
                <h1>Use AI Generator first to display your code here...</h1>
              </div>
            }`,
            active: true,
          },
        }}
      />
    </div>
  );
};

export default ViewResult;
