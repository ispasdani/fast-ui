import React, { useEffect, useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { useCodeStore } from "@/store/codeStore";
import { DEPENDENCY } from "@/consts/sandpackDependecy";

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
      setupSandpackFiles(processed, codeData.codeType);
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
    switch (codeData.codeType) {
      case "react":
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
        break;

      case "angular":
        // For Angular, we want to format the code for better display
        // We'll wrap each file in a div with appropriate styling
        if (
          cleanCode.includes("@Component") ||
          cleanCode.includes(".component.")
        ) {
          // Split the code by file markers (typescript or HTML)
          const fileSegments = cleanCode.split(/typescript|<!-- /);

          let formattedCode = "";

          fileSegments.forEach((segment) => {
            if (!segment.trim()) return;

            // Extract the filename or determine its type
            let fileName = "";
            let fileContent = segment;

            // Check if this segment contains a filename comment
            if (segment.startsWith("//")) {
              const firstLine = segment.split("\n")[0];
              fileName = firstLine.replace("//", "").trim();
              fileContent = segment.substring(firstLine.length).trim();
            } else if (segment.includes("component.html")) {
              fileName = segment.split("-->")[0].trim();
              fileContent = segment
                .substring(segment.indexOf("-->") + 3)
                .trim();
            }

            if (fileName) {
              formattedCode += `<div class="file-header">${fileName}</div>\n`;
              formattedCode += `<pre class="code-block">${fileContent}</pre>\n`;
            } else {
              formattedCode += `<pre class="code-block">${segment}</pre>\n`;
            }
          });

          cleanCode = formattedCode;
        }
        break;

      case "vue":
        // Vue-specific cleaning if needed
        break;

      case "svelte":
        // Svelte-specific cleaning if needed
        break;

      // Add other framework-specific cleaning if needed
    }

    return cleanCode;
  };

  const setupSandpackFiles = (code: string, codeType: string) => {
    let template = "react"; // Default template
    let files: Record<string, { code: string; active: boolean }> = {};

    switch (codeType) {
      case "react":
        template = "react";
        files = {
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
        };
        break;

      case "vue":
        template = "vanilla"; // Using vanilla as the base for Vue
        files = {
          "/index.html": {
            code: `<!DOCTYPE html>
<html>
  <head>
    <title>Vue App</title>
    <meta charset="UTF-8" />
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      pre { white-space: pre-wrap; word-wrap: break-word; }
      .file-header { font-weight: bold; background: #f0f0f0; padding: 8px; margin-top: 16px; border-radius: 4px 4px 0 0; }
      .code-block { background: #f8f8f8; padding: 12px; margin-top: 0; border-radius: 0 0 4px 4px; margin-bottom: 16px; overflow-x: auto; }
    </style>
  </head>
  <body class="bg-slate-100 p-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold mb-4 text-indigo-700">Vue Code Generated</h1>
        <p class="mb-4 text-slate-700">This code is ready to use in a Vue project. Copy this code into your Vue project.</p>
        
        <div class="space-y-4">
          <div class="file-header">Vue Component</div>
          <pre class="code-block">${
            code?.replace(/</g, "&lt;").replace(/>/g, "&gt;") ||
            `<template>
  <div>
    <h1>Use AI Generator first to display your Vue code here...</h1>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>`
          }</pre>
        </div>
      </div>
    </div>
  </body>
</html>`,
            active: true,
          },
        };
        break;

      case "angular":
        // For Angular, we'll just display the code in a pre-formatted way
        // since Sandpack doesn't natively support Angular
        template = "vanilla";

        // Helper function to check if code is already pre-formatted
        const isPreFormattedAngularCode = (code: string) => {
          return (
            code.includes('<div class="file-header">') &&
            code.includes('<pre class="code-block">') &&
            (code.includes("app.module.ts") || code.includes("component.ts"))
          );
        };

        // Create a formatted display for Angular code
        const formattedAngularCode = isPreFormattedAngularCode(code)
          ? `<!DOCTYPE html>
<html>
<head>
  <title>Angular Code Preview</title>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    pre { white-space: pre-wrap; word-wrap: break-word; }
    .file-header { font-weight: bold; background: #f0f0f0; padding: 8px; margin-top: 16px; border-radius: 4px 4px 0 0; }
    .code-block { background: #f8f8f8; padding: 12px; margin-top: 0; border-radius: 0 0 4px 4px; margin-bottom: 16px; overflow-x: auto; }
  </style>
</head>
<body class="bg-slate-100 p-4">
  <div class="max-w-4xl mx-auto">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold mb-4 text-indigo-700">Angular Code Generated</h1>
      <p class="mb-4 text-slate-700">This code is ready to use in an Angular project. Copy this code into your Angular project.</p>
      
      <div class="space-y-4">
        ${code}
      </div>
    </div>
  </div>
</body>
</html>`
          : `<!DOCTYPE html>
<html>
<head>
  <title>Angular Code Preview</title>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    pre { white-space: pre-wrap; word-wrap: break-word; }
    .file-header { font-weight: bold; background: #f0f0f0; padding: 8px; margin-top: 16px; border-radius: 4px 4px 0 0; }
    .code-block { background: #f8f8f8; padding: 12px; margin-top: 0; border-radius: 0 0 4px 4px; margin-bottom: 16px; overflow-x: auto; }
  </style>
</head>
<body class="bg-slate-100 p-4">
  <div class="max-w-4xl mx-auto">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold mb-4 text-indigo-700">Angular Code Generated</h1>
      <p class="mb-4 text-slate-700">This code is ready to use in an Angular project. Copy this code into your Angular project.</p>
      
      <div class="space-y-4">
        <div class="file-header">Angular Code</div>
        <pre class="code-block">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
      </div>
    </div>
  </div>
</body>
</html>`;

        files = {
          "/index.html": {
            code: formattedAngularCode,
            active: true,
          },
        };
        break;

      case "html":
        template = "vanilla";
        files = {
          "/index.html": {
            code:
              code ||
              `<!DOCTYPE html>
            <html>
              <head>
                <title>HTML + CSS</title>
                <meta charset="UTF-8" />
                <script src="https://cdn.tailwindcss.com"></script>
              </head>
              <body>
                <div class="flex justify-center items-center w-full h-full">
                  <h1>Use AI Generator first to display your HTML code here...</h1>
                </div>
              </body>
            </html>`,
            active: true,
          },
        };
        break;

      case "vanilla":
        template = "vanilla";
        files = {
          "/index.js": {
            code:
              code ||
              `document.getElementById("app").innerHTML = \`
              <div class="flex justify-center items-center w-full h-full">
                <h1>Use AI Generator first to display your Vanilla JS code here...</h1>
              </div>
            \`;`,
            active: true,
          },
          "/index.html": {
            code: `<!DOCTYPE html>
            <html>
              <head>
                <title>Vanilla JS</title>
                <meta charset="UTF-8" />
                <script src="https://cdn.tailwindcss.com"></script>
              </head>
              <body>
                <div id="app"></div>
                <script src="index.js"></script>
              </body>
            </html>`,
            active: false,
          },
        };
        break;

      case "svelte":
        template = "vanilla"; // Using vanilla as base for Svelte preview
        files = {
          "/index.html": {
            code: `<!DOCTYPE html>
<html>
  <head>
    <title>Svelte App</title>
    <meta charset="UTF-8" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      pre { white-space: pre-wrap; word-wrap: break-word; }
      .file-header { font-weight: bold; background: #f0f0f0; padding: 8px; margin-top: 16px; border-radius: 4px 4px 0 0; }
      .code-block { background: #f8f8f8; padding: 12px; margin-top: 0; border-radius: 0 0 4px 4px; margin-bottom: 16px; overflow-x: auto; }
    </style>
  </head>
  <body class="bg-slate-100 p-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold mb-4 text-teal-700">Svelte Code Generated</h1>
        <p class="mb-4 text-slate-700">This code is ready to use in a Svelte project. Copy this code into your Svelte project.</p>
        
        <div class="space-y-4">
          <div class="file-header">Svelte Component</div>
          <pre class="code-block">${
            code?.replace(/</g, "&lt;").replace(/>/g, "&gt;") ||
            `<script>
  // Svelte component script
</script>

<div class="flex justify-center items-center w-full h-full">
  <h1>Use AI Generator first to display your Svelte code here...</h1>
</div>

<style>
  /* Svelte styles */
</style>`
          }</pre>
        </div>
      </div>
    </div>
  </body>
</html>`,
            active: true,
          },
        };
        break;

      default:
        // Default to React
        template = "react";
        files = {
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
        };
    }

    setSandpackTemplate(template);
    setSandpackFiles(files);
  };

  return (
    <div>
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
    </div>
  );
};

export default ViewResult;
