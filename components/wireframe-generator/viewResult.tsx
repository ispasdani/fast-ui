import React from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { useCodeStore } from "@/store/codeStore";
import { DEPENDENCY } from "@/consts/sandpackDependecy";

const ViewResult = () => {
  const codeData = useCodeStore((state) => state.codeData);

  return (
    <div>
      {/* Code Editor and Preview */}
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
          "/App.js": `export default function App() {
    return <div className="flex justify-center items-center w-full h-full">
        <h1>Use AI Generator first to display your code here...</h1>
    </div>
  }`,
        }}
      />
    </div>
  );
};

export default ViewResult;
