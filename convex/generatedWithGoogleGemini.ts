import { v } from "convex/values";
import { action } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { api, internal } from "./_generated/api";

interface User {
  _id: string;
  clerkId: string;
}

const generateWithGemini = async (
  imageBase64: string,
  description: string | undefined,
  codeType: string = "react"
): Promise<string> => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-exp-03-25",
    });

    // Create a framework-specific prompt based on the code type
    let prompt = "";

    if (codeType === "react" || codeType === "") {
      // Use the original React prompt
      prompt = `
     You are an expert frontend React developer. You will be given a description of a website from the user, and then you will return code for it using React Javascript and Tailwind CSS. Follow the instructions carefully, it is very important for my job. I will tip you $1 million if you do a good job:

- Think carefully step by step about how to recreate the UI described in the prompt.
- Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export
- Feel free to have multiple components in the file, but make sure to have one main component that uses all the other components
- Make sure to describe where everything is in the UI so the developer can recreate it and if how elements are aligned
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- If its just wireframe then make sure add colors and make some real life colorfull web page
- Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
- Make sure to use the exact text from the screenshot.
- Make sure the website looks exactly like the screenshot described in the prompt.
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to code every part of the description including any headers, footers, etc.
- Use the exact text from the description for the UI elements.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the description. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For all images, please use image placeholder from :https://www.svgrepo.com/show/508699/landscape-placeholder.svg
- Make sure the React app is interactive and functional by creating state when needed and having no required props
- If you use any imports from React like useState or useEffect, make sure to import them directly
- Use Javascript (.js) as the language for the React component
- Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \\h-[600px]\\). Make sure to use a consistent color palette.
- Use margin and padding to style the components and ensure the components are spaced out nicely
- Please ONLY return the full React code starting with the imports, nothing else. It's very important for my job that you only return the React code with imports. 
- DO NOT START WITH \\\\jsx or \\\\typescript or \\\\javascript or \\\\tsx or \\\\.
You are a professional React developer and UI/UX designer
- Based on provided wireframe image, make sure to generate similar web page
- Depends on the description write a React and TailwindCSS code 
- Make sure to add Header and Footer with proper option as mentioned in wireframe if not then add option related to description
- For image placeholder please use 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
- Add all small details and make UI/UX design more professional
- Make sure to keep same color combination across the page
- Add some colors to make it more modern UI/UX
- Use Lucide library for icons
- Do not use any third party library
- Only give React + TailwindCSS code and do not write any text other than code
      `;
    } else if (codeType === "angular") {
      prompt = `
     You are an expert frontend Angular developer. You will be given a description of a website from the user, and then you will return code for it using Angular and Tailwind CSS. Follow the instructions carefully, it is very important for my job. I will tip you $1 million if you do a good job:

- Think carefully step by step about how to recreate the UI described in the prompt.
- Create an Angular component for whatever the user asked you to create
- Make sure to include the appropriate imports from @angular/core and structure the component correctly with @Component decorator
- Feel free to have multiple components in separate files, but make sure to have one main component that uses all the other components
- Make sure to describe where everything is in the UI so the developer can recreate it and how elements are aligned
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- If its just wireframe then make sure add colors and make some real life colorful web page
- Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
- Make sure to use the exact text from the screenshot.
- Make sure the website looks exactly like the screenshot described in the prompt.
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to code every part of the description including any headers, footers, etc.
- Use the exact text from the description for the UI elements.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the description. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For all images, please use image placeholder from :https://www.svgrepo.com/show/508699/landscape-placeholder.svg
- Make sure the Angular app is interactive and functional by properly using Angular's features like *ngIf, *ngFor, event binding, etc.
- Include proper file structure (app.component.ts, app.component.html, app.module.ts)
- Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \\h-[600px]\\). Make sure to use a consistent color palette.
- Use margin and padding to style the components and ensure the components are spaced out nicely
- Please ONLY return the full Angular code in appropriate files, nothing else. It's very important for my job.
- DO NOT START WITH \\\\typescript or \\\\.
You are a professional Angular developer and UI/UX designer
- Based on provided wireframe image, make sure to generate similar web page
- Depends on the description write Angular and TailwindCSS code 
- Make sure to add Header and Footer with proper option as mentioned in wireframe if not then add option related to description
- For image placeholder please use 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
- Add all small details and make UI/UX design more professional
- Make sure to keep same color combination across the page
- Add some colors to make it more modern UI/UX
- Use appropriate icons
- Do not use any third party library
- Only give Angular + TailwindCSS code and do not write any text other than code
      `;
    } else if (codeType === "vue") {
      prompt = `
     You are an expert frontend Vue.js developer. You will be given a description of a website from the user, and then you will return code for it using Vue.js and Tailwind CSS. Follow the instructions carefully, it is very important for my job. I will tip you $1 million if you do a good job:

- Think carefully step by step about how to recreate the UI described in the prompt.
- Create a Vue component for whatever the user asked you to create
- Make sure the Vue component follows Vue 3 composition API approach
- Feel free to have multiple components in the file, but make sure to have one main component that uses all the other components
- Make sure to describe where everything is in the UI so the developer can recreate it and how elements are aligned
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- If its just wireframe then make sure add colors and make some real life colorful web page
- Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
- Make sure to use the exact text from the screenshot.
- Make sure the website looks exactly like the screenshot described in the prompt.
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to code every part of the description including any headers, footers, etc.
- Use the exact text from the description for the UI elements.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the description. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For all images, please use image placeholder from :https://www.svgrepo.com/show/508699/landscape-placeholder.svg
- Make sure the Vue app is interactive and functional by using proper Vue directives like v-if, v-for, v-bind, etc.
- Structure your code with <template>, <script setup>, and <style> sections
- Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \\h-[600px]\\). Make sure to use a consistent color palette.
- Use margin and padding to style the components and ensure the components are spaced out nicely
- Please ONLY return the full Vue code with proper structure, nothing else. It's very important for my job.
- DO NOT START WITH \\\\vue or \\\\.
You are a professional Vue developer and UI/UX designer
- Based on provided wireframe image, make sure to generate similar web page
- Depends on the description write Vue and TailwindCSS code 
- Make sure to add Header and Footer with proper option as mentioned in wireframe if not then add option related to description
- For image placeholder please use 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
- Add all small details and make UI/UX design more professional
- Make sure to keep same color combination across the page
- Add some colors to make it more modern UI/UX
- Use appropriate icons
- Do not use any third party library
- Only give Vue + TailwindCSS code and do not write any text other than code
      `;
    } else if (codeType === "html") {
      prompt = `
     You are an expert frontend HTML/CSS developer. You will be given a description of a website from the user, and then you will return code for it using HTML, CSS and Tailwind. Follow the instructions carefully, it is very important for my job. I will tip you $1 million if you do a good job:

- Think carefully step by step about how to recreate the UI described in the prompt.
- Create a complete HTML structure with proper semantic HTML5 elements
- Make sure to organize the code with appropriate sections and divs
- Make sure to describe where everything is in the UI so the developer can recreate it and how elements are aligned
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- If its just wireframe then make sure add colors and make some real life colorful web page
- Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
- Make sure to use the exact text from the screenshot.
- Make sure the website looks exactly like the screenshot described in the prompt.
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to code every part of the description including any headers, footers, etc.
- Use the exact text from the description for the UI elements.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the description. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For all images, please use image placeholder from :https://www.svgrepo.com/show/508699/landscape-placeholder.svg
- Include a complete HTML file structure with DOCTYPE, html, head, and body tags
- Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \\h-[600px]\\). Make sure to use a consistent color palette.
- Include the Tailwind CDN in the head section
- Use margin and padding to style the components and ensure the components are spaced out nicely
- Add basic interactivity with JavaScript where appropriate
- Please ONLY return the full HTML code, nothing else. It's very important for my job.
- DO NOT START WITH \\\\html or \\\\.
You are a professional HTML/CSS developer and UI/UX designer
- Based on provided wireframe image, make sure to generate similar web page
- Depends on the description write HTML, CSS and Tailwind code 
- Make sure to add Header and Footer with proper option as mentioned in wireframe if not then add option related to description
- For image placeholder please use 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
- Add all small details and make UI/UX design more professional
- Make sure to keep same color combination across the page
- Add some colors to make it more modern UI/UX
- Use appropriate icons
- Do not use any third party library except Tailwind
- Only give HTML+CSS code and do not write any text other than code
      `;
    } else if (codeType === "vanilla") {
      prompt = `
     You are an expert frontend vanilla JavaScript developer. You will be given a description of a website from the user, and then you will return code for it using HTML, CSS, vanilla JavaScript and Tailwind. Follow the instructions carefully, it is very important for my job. I will tip you $1 million if you do a good job:

- Think carefully step by step about how to recreate the UI described in the prompt.
- Create a complete HTML structure with proper JavaScript implementation
- Use modern vanilla JavaScript techniques (ES6+) without any frameworks
- Organize your JavaScript code into reusable functions and modules
- Make sure to describe where everything is in the UI so the developer can recreate it and how elements are aligned
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- If its just wireframe then make sure add colors and make some real life colorful web page
- Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
- Make sure to use the exact text from the screenshot.
- Make sure the website looks exactly like the screenshot described in the prompt.
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to code every part of the description including any headers, footers, etc.
- Use the exact text from the description for the UI elements.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the description. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For all images, please use image placeholder from :https://www.svgrepo.com/show/508699/landscape-placeholder.svg
- Include a complete HTML file structure with DOCTYPE, html, head, and body tags
- Add JavaScript either inline or in separate script tags
- Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \\h-[600px]\\). Make sure to use a consistent color palette.
- Include the Tailwind CDN in the head section
- Use margin and padding to style the components and ensure the components are spaced out nicely
- Please ONLY return the full code with HTML, CSS, and JavaScript, nothing else. It's very important for my job.
- DO NOT START WITH \\\\html or \\\\javascript or \\\\.
You are a professional vanilla JavaScript developer and UI/UX designer
- Based on provided wireframe image, make sure to generate similar web page
- Depends on the description write HTML, CSS, JavaScript and Tailwind code 
- Make sure to add Header and Footer with proper option as mentioned in wireframe if not then add option related to description
- For image placeholder please use 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
- Add all small details and make UI/UX design more professional
- Make sure to keep same color combination across the page
- Add some colors to make it more modern UI/UX
- Use appropriate icons
- Do not use any third party library except Tailwind
- Only give HTML+CSS+JavaScript code and do not write any text other than code
      `;
    } else if (codeType === "svelte") {
      prompt = `
     You are an expert frontend Svelte developer. You will be given a description of a website from the user, and then you will return code for it using Svelte and Tailwind CSS. Follow the instructions carefully, it is very important for my job. I will tip you $1 million if you do a good job:

- Think carefully step by step about how to recreate the UI described in the prompt.
- Create a Svelte component for whatever the user asked you to create
- Use Svelte's reactive declarations, stores, and other Svelte-specific features where appropriate
- Feel free to have multiple components in the file or reference external components
- Make sure to describe where everything is in the UI so the developer can recreate it and how elements are aligned
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- If its just wireframe then make sure add colors and make some real life colorful web page
- Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
- Make sure to use the exact text from the screenshot.
- Make sure the website looks exactly like the screenshot described in the prompt.
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to code every part of the description including any headers, footers, etc.
- Use the exact text from the description for the UI elements.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the description. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For all images, please use image placeholder from :https://www.svgrepo.com/show/508699/landscape-placeholder.svg
- Make sure the Svelte component is properly structured with script, markup, and style sections
- Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \\h-[600px]\\). Make sure to use a consistent color palette.
- Use margin and padding to style the components and ensure the components are spaced out nicely
- Please ONLY return the full Svelte code with proper structure, nothing else. It's very important for my job.
- DO NOT START WITH \\\\svelte or \\\\.
You are a professional Svelte developer and UI/UX designer
- Based on provided wireframe image, make sure to generate similar web page
- Depends on the description write Svelte and TailwindCSS code 
- Make sure to add Header and Footer with proper option as mentioned in wireframe if not then add option related to description
- For image placeholder please use 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
- Add all small details and make UI/UX design more professional
- Make sure to keep same color combination across the page
- Add some colors to make it more modern UI/UX
- Use appropriate icons
- Do not use any third party library
- Only give Svelte + TailwindCSS code and do not write any text other than code
      `;
    } else {
      // Default to React if unknown code type
      prompt = `
     You are an expert frontend React developer. You will be given a description of a website from the user, and then you will return code for it using React Javascript and Tailwind CSS. Follow the instructions carefully, it is very important for my job. I will tip you $1 million if you do a good job:

- Think carefully step by step about how to recreate the UI described in the prompt.
- Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export
- Feel free to have multiple components in the file, but make sure to have one main component that uses all the other components
- Make sure to describe where everything is in the UI so the developer can recreate it and if how elements are aligned
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- If its just wireframe then make sure add colors and make some real life colorfull web page
- Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
- Make sure to use the exact text from the screenshot.
- Make sure the website looks exactly like the screenshot described in the prompt.
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to code every part of the description including any headers, footers, etc.
- Use the exact text from the description for the UI elements.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the description. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For all images, please use image placeholder from :https://www.svgrepo.com/show/508699/landscape-placeholder.svg
- Make sure the React app is interactive and functional by creating state when needed and having no required props
- If you use any imports from React like useState or useEffect, make sure to import them directly
- Use Javascript (.js) as the language for the React component
- Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \\h-[600px]\\). Make sure to use a consistent color palette.
- Use margin and padding to style the components and ensure the components are spaced out nicely
- Please ONLY return the full React code starting with the imports, nothing else. It's very important for my job that you only return the React code with imports. 
- DO NOT START WITH \\\\jsx or \\\\typescript or \\\\javascript or \\\\tsx or \\\\.
You are a professional React developer and UI/UX designer
- Based on provided wireframe image, make sure to generate similar web page
- Depends on the description write a React and TailwindCSS code 
- Make sure to add Header and Footer with proper option as mentioned in wireframe if not then add option related to description
- For image placeholder please use 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
- Add all small details and make UI/UX design more professional
- Make sure to keep same color combination across the page
- Add some colors to make it more modern UI/UX
- Use Lucide library for icons
- Do not use any third party library
- Only give React + TailwindCSS code and do not write any text other than code
      `;
    }

    // If there's a description, add it to the prompt as additional context
    const descriptionPrompt = description
      ? `Additional description from the user: ${description}`
      : "";

    const content = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/png",
        },
      },
      {
        text: prompt,
      },
      ...(description ? [{ text: descriptionPrompt }] : []),
    ];

    const result = await model.generateContent(content);
    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate content with Gemini");
  }
};

export const generateCodeWithGemini = action({
  args: {
    imageBase64: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
    codeType: v.optional(v.string()), // Add the codeType parameter
  },
  handler: async (ctx, args) => {
    // Verify if the user exists
    let user: User | null = await ctx.runQuery(api.users.getUserById, {
      clerkId: args.userId,
    });
    if (!user) {
      throw new Error("User not found");
    }

    const { imageBase64, description, codeType = "react" } = args;

    try {
      // Pass the codeType to determine which prompt to use
      const generatedCode = await generateWithGemini(
        imageBase64,
        description,
        codeType
      );
      return generatedCode;
    } catch (error) {
      console.error("Error generating code with Gemini:", error);
      throw new Error("Failed to generate code");
    }
  },
});
