import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI as createOpenRouter } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";
import {
  generateId,
  InvalidToolArgumentsError,
  Message,
  NoSuchToolError,
  streamText,
  ToolExecutionError,
} from "ai";
import { cookies } from "next/headers";
import crypto from "crypto";
import { z } from "zod";
import { JSDOM } from "jsdom";

// Helper function to derive a 32-byte key
const deriveKey = (secret: string): Buffer => {
  return crypto.createHash("sha256").update(String(secret)).digest();
};

// Decryption function
const decrypt = (encryptedData: string, secret: string) => {
  const [ivHex, encryptedHex] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const key = deriveKey(secret);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const body = await req.json();
  const {
    messages,
    model,
    provider,
    systemPrompt,
    contextLength,
    maxTokens,
    temperature,
    topP,
    memory,
    plugins,
  } = body;

  // Get encrypted API key from cookies
  const encryptedKey = cookieStore.get(
    `${provider.toLowerCase()}-api-key`
  )?.value;
  if (!encryptedKey) {
    return new Response("API key not found", { status: 401 });
  }

  // Decrypt API key
  const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
  if (!SECRET_KEY) {
    return new Response("Encryption secret key not configured", {
      status: 500,
    });
  }

  const apiKey = decrypt(encryptedKey, SECRET_KEY);

  if (!messages || !model || !provider) {
    return new Response("Missing required fields", { status: 400 });
  }

  if (!apiKey) {
    return new Response("API key not found", { status: 401 });
  }

  // Initialize provider with decrypted API key
  const selectedModel = (() => {
    switch (provider) {
      case "openai":
        return createOpenAI({
          apiKey,
        });
      case "anthropic":
        return createAnthropic({
          apiKey,
        });
      case "openrouter":
        return createOpenRouter({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey,
        });
      default:
        throw new Error("Invalid AI provider specified");
    }
  })();
  // Use the system prompt from settings if provided, otherwise use default
  const { SYSTEM_PROMPT } = JSON.parse(process.env.SYSTEM_PROMPT as string);
  const finalSystemPrompt =
    systemPrompt || SYSTEM_PROMPT || "You are a helpful assistant.";

  const tools:
    | {
        [key: string]: {
          description: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parameters: z.ZodObject<any>;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          execute: (params: any) => Promise<any>;
        };
      }
    | undefined = {
    rememberInformation: {
      description: `Extract and store essential information as an array of unique, concise memory strings.

Capture only:

User preferences and settings
Shared personal details
Key decisions or choices
Crucial facts or context for future use
Ensure no duplicates by comparing with existing memories. Return the array of concise memory strings.`,
      parameters: z.object({
        memory: z
          .array(z.string())
          .optional()
          .describe("The info to remember!"),
      }),
      execute: async ({ memory }: { memory: string[] }) => {
        return memory || [];
      },
    },
    generateTitle: {
      description: `Create a concise and descriptive title for the conversation based on its context and content.

Guidelines:

Limit to 2-4 words.
Clearly describe the main topic.
Capture the essence of the conversation.
Use title case formatting.
Avoid generic titles like "Chat" or "Conversation."
Return the title as a single string.`,
      parameters: z.object({
        title: z.string().describe("The generated title for the conversation"),
      }),
      execute: async ({ title }: { title: string }) => {
        return title;
      },
    },
    getCurrentDate: {
      description: `Get the current date and time in ISO format.
      
      Returns the current date/time as a string.`,
      parameters: z.object({
        format: z
          .string()
          .optional()
          .describe("Optional date format specification"),
      }),
      execute: async () => {
        return new Date().toISOString();
      },
    },
    fetchWebPage: {
      description: `Safely fetch and extract content from a specified web page URL. DONT USE IT IF THE URL IS NOT PROVIDED

      Guidelines:
      - Only fetch from valid, public URLs
      - Strips script, style, and meta tags for cleaner content
      - Returns parsed HTML content
      - Uses browser-like User-Agent
      - Handles errors gracefully

      Do not use for:
      - Web searching (use webSearch tool instead)
      - Accessing private/authenticated content
      - Scraping restricted content`,
      parameters: z.object({
        url: z.string().url().describe("The URL to fetch content from"),
      }),
      execute: async ({ url }: { url: string }) => {
        const response = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
          },
        });
        if (!response.ok) {
          return `Failed to fetch: ${response.status}`;
        }
        const html = await response.text();

        // Create a DOM parser
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // // Remove all script tags
        // const scripts = document.getElementsByTagName("script");
        // while (scripts.length > 0) {
        //   scripts[0].parentNode?.removeChild(scripts[0]);
        // }

        // Remove all style tags
        const styles = document.getElementsByTagName("style");
        while (styles.length > 0) {
          styles[0].parentNode?.removeChild(styles[0]);
        }

        // Remove all meta tags
        const meta = document.getElementsByTagName("meta");
        while (meta.length > 0) {
          meta[0].parentNode?.removeChild(meta[0]);
        }

        // Get the cleaned HTML
        return document.documentElement.outerHTML;
      },
    },
  };

  const pluginsArray: {
    [key: string]: {
      enabled: boolean;
      apiKey: string;
      cx: string;
    };
  } = JSON.parse(plugins);

  console.log("pluginsArray", pluginsArray);

  // Add plugin tools
  const webSearch = {
    description: `Perform a web search using Google Custom Search API and return relevant results.
      
    Guidelines:
    - Return top search results
    - Include title and snippet for each result
    - Filter for relevant content only`,
    parameters: z.object({
      query: z.string().describe("The search query to execute"),
    }),
    execute: async ({ query }: { query: string }) => {
      const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${
          pluginsArray["google-search"].apiKey
        }&cx=${pluginsArray["google-search"].cx}&q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            "Accept-Encoding": "gzip",
          },
        }
      );
      const data = await res.json();
      return data;
    },
  };

  if (pluginsArray["google-search"].enabled) {
    tools.webSearch = webSearch;
  }

  const messagesWithMemory: Message[] = [
    ...(provider !== "openrouter"
      ? [
          {
            id: generateId(),
            role: "system",
            content: `Remembering information... ${memory}`,
            createdAt: new Date(),
          },
        ]
      : []),
    ...messages.slice(-contextLength),
  ];

  try {
    const result = streamText({
      model: selectedModel(model),
      messages: messagesWithMemory, // Use contextLength from settings
      system: finalSystemPrompt,
      maxTokens, // Use maxTokens from settings
      temperature, // Use temperature from settings
      topP, // Use topP from settings
      maxSteps: 10,
      tools: provider !== "anthropic" ? tools : {},
      // toolChoice: {}
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        if (NoSuchToolError.isInstance(error)) {
          return "The model tried to call a unknown tool.";
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          return "The model called a tool with invalid arguments.";
        } else if (ToolExecutionError.isInstance(error)) {
          return "An error occurred during tool execution.";
        } else {
          return "An unknown error occurred.";
        }
      },
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
