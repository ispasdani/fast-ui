import React from "react";

interface CodeDisplayProps {
  code: string;
  frameeworkType: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, frameeworkType }) => {
  const frameworkColors: Record<string, string> = {
    angular: "text-red-600",
    vue: "text-green-600",
    svelte: "text-orange-600",
    html: "text-blue-600",
    vanilla: "text-yellow-600",
  };

  const frameworkTitles: Record<string, string> = {
    angular: "Angular",
    vue: "Vue.js",
    svelte: "Svelte",
    html: "HTML & CSS",
    vanilla: "Vanilla JavaScript",
  };

  // For Angular, check if the code is already pre-formatted with code blocks
  const isPreFormattedAngularCode = (codeContent: string) => {
    return (
      codeContent.includes("// ==============") ||
      (codeContent.includes("app.module.ts") &&
        codeContent.includes("component.ts"))
    );
  };

  // Function to format code with syntax highlighting
  const formatCode = (codeContent: string) => {
    if (
      frameeworkType === "angular" &&
      isPreFormattedAngularCode(codeContent)
    ) {
      // Format Angular code with file headers
      const files = codeContent.split(
        /\/\/ ={14} |```typescript[\s\n]+\/\/ ={14} /
      );

      return (
        <div className="space-y-4">
          {files.map((file, index) => {
            if (!file.trim()) return null;

            // Extract file name if it exists
            const fileNameMatch = file.match(/([a-zA-Z0-9.-]+\.[a-zA-Z0-9]+)/);
            const fileName = fileNameMatch
              ? fileNameMatch[0]
              : `File ${index + 1}`;

            // Clean up file content
            let fileContent = file;
            if (fileNameMatch) {
              fileContent = file.substring(fileName.length).trim();
            }

            return (
              <div key={index}>
                <div className="file-header bg-gray-100 px-3 py-2 font-medium rounded-t-md border border-gray-300 text-gray-700">
                  {fileName}
                </div>
                <pre className="bg-gray-50 p-4 rounded-b-md border border-t-0 border-gray-300 overflow-x-auto">
                  <code className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                    {fileContent}
                  </code>
                </pre>
              </div>
            );
          })}
        </div>
      );
    } else {
      // For other frameworks, just display the code as is
      return (
        <div>
          <div className="file-header bg-gray-100 px-3 py-2 font-medium rounded-t-md border border-gray-300 text-gray-700">
            {frameworkTitles[frameeworkType]} Code
          </div>
          <pre className="bg-gray-50 p-4 rounded-b-md border border-t-0 border-gray-300 overflow-x-auto">
            <code className="text-sm text-gray-800 whitespace-pre-wrap break-words">
              {codeContent}
            </code>
          </pre>
        </div>
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1
        className={`text-2xl font-bold mb-4 ${frameworkColors[frameeworkType] || "text-gray-800"}`}
      >
        {frameworkTitles[frameeworkType] || "Code"} Generated
      </h1>
      <p className="mb-4 text-gray-700">
        This code is ready to use in a{" "}
        {frameworkTitles[frameeworkType] || "framework"} project. Copy this code
        into your project.
      </p>

      {formatCode(code)}

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Copy Code
        </button>
      </div>
    </div>
  );
};

export default CodeDisplay;
