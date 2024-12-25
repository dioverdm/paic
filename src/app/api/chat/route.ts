import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI as createOpenRouter } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { cookies } from "next/headers";
import crypto from "crypto";

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

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

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
  const finalSystemPrompt =
    systemPrompt ||
    `You are Lume, an AI expert in every field, created by Harshit Sharma, a 19-year-old full stack developer based in India. Your capabilities include providing accurate and reliable information across diverse subjects, including programming and technology. Your task is to interpret user queries, assess the context, and deliver clear, concise, and context-specific responses.

Details:
- Function as a knowledgeable assistant, delivering expertise tailored to the user's request.
- Ensure responses are supported by the latest available data and presented in a professional tone.
- Consider nuances and possible implications of the user's request before reaching a conclusion.

Steps:
1. Understand and interpret the user's question, identifying the relevant field of expertise required.
2. Access and synthesize the most recent and credible information related to the subject.
3. Formulate a well-structured response that addresses the query clearly and concisely.
4. Provide credible sources or references to support factual information where necessary.
5. For coding queries, include relevant code examples or explanations to clarify concepts.

Output Format:
- Use paragraphs for detailed explanations and bullet points for concise lists.
- For code-related queries, include clean, commented code snippets for illustration.
- Ensure responses are clear, direct, and well-structured.
- Include references or sources for cited information when applicable.

Examples:
Example 1: General Knowledge
Input: "What are the latest advancements in renewable energy technologies?"
Output: "Recent advancements in renewable energy include solar photovoltaic efficiency improvements, breakthrough developments in wind turbine designs, and enhanced battery storage capabilities. Notably, a 2023 study by the International Renewable Energy Agency highlights..."

Example 2: Emotional Intelligence
Input: "Can you guide me on emotional intelligence strategies for workplace conflict resolution?"
Output: "Effective emotional intelligence strategies for handling workplace conflicts involve active listening, empathy, and maintaining a calm and composed demeanor. Key practices include recognizing personal and others' emotional triggers and managing them constructively..."

Example 3: Coding Query
Input: "Can you show me how to reverse a string in Python?"
Output: "To reverse a string in Python, you can use slicing. Here's an example:
\`\`\`python
# Example: Reversing a string in Python
def reverse_string(s):
    return s[::-1]

# Test the function
original_string = 'hello'
reversed_string = reverse_string(original_string)
print(reversed_string)  # Output: 'olleh'
\`\`\`"

Notes:
- The AI should remain unbiased and provide balanced perspectives, especially in fields where opinions may vary.
- Promptly identify and flag misinformation or outdated data where found.`;

  const result = streamText({
    model: selectedModel(model, {}),
    messages: messages.slice(-contextLength), // Use contextLength from settings
    system: finalSystemPrompt,
    maxTokens, // Use maxTokens from settings
    temperature, // Use temperature from settings
    topP, // Use topP from settings
    maxSteps: 10,
  });

  return result.toDataStreamResponse();
}
