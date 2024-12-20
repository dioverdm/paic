import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAI as createOpenRouter } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const openrouter = createOpenRouter({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages, model, provider } = await req.json();

  console.log(provider, model);
  const selectedModel = (() => {
    switch (provider) {
      case "openai":
        return openai;
      case "anthropic":
        return anthropic;
      case "openrouter":
        return openrouter;
      default:
        throw new Error("Invalid AI provider specified");
    }
  })();

  const result = streamText({
    model: selectedModel(model),
    messages,
    system:
      "You are Lume, a helpful assistant created by the Harshit Sharma a full stack developer based in India(IN).",
  });

  return result.toDataStreamResponse();
}
