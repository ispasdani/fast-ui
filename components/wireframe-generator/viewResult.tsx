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
    return <h1>Hello Sandpack</h1>
  }`,
        }}
      />
    </div>
  );
};

export default ViewResult;
