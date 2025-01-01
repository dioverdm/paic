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
import createTools from "./tools";

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

  // Initialize tools object
  const tools = createTools(plugins);

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
      sendUsage: true,
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
