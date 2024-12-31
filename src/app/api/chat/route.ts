import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI as createOpenRouter } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";
import { generateId, Message, streamText } from "ai";
import { cookies } from "next/headers";
import crypto from "crypto";
import { z } from "zod";

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

  const tools = {
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
  };

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

  console.log("messagesWithMemory", messagesWithMemory);

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
    });

    return result.toDataStreamResponse();
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
