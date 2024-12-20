import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

// Define types for the messages
type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type RequestBody = {
  messages: Message[];
};

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Helper function to clean and format the title properly
function formatTitle(text: string): string {
  // Remove any leading/trailing whitespace and extra escape characters
  return text
    .trim() // Remove leading/trailing spaces
    .replace(/\\"/g, '"') // Replace escaped double quotes with actual quotes
    .replace(/^"(.*)"$/, "$1"); // Remove any surrounding quotes if present
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const { messages } = body as RequestBody;

    if (!Array.isArray(messages) || messages.length < 2) {
      return NextResponse.json(
        { error: "Messages array must contain at least two messages" },
        { status: 400 }
      );
    }

    // Construct the refined prompt for the AI
    const prompt = `
You are an AI assistant that creates concise, straightforward titles for chat interactions. Based on the following two messages, generate a title that represents the start of the conversation in a simple, professional, and friendly manner. The title should focus on summarizing the assistant’s initial response or the main request from the user.

Here are the messages:

1. User: "${messages[0].content}"
2. Assistant: "${messages[1].content}"

The title should be:
- Simple and direct.
- Avoid any prefixes like "Ready to Help" or "How Can I Assist."
- Focus on the core question or statement.
- Do not include any additional words or formatting.

Just return the title, nothing else.
    `;

    // Generate the title using the AI model
    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt,
      maxTokens: 50,
      temperature: 0.6,
    });

    // Format the title to clean it up
    const title = formatTitle(text);

    return NextResponse.json({ title });
  } catch (error) {
    console.error("Error generating title:", error);
    return NextResponse.json(
      { error: "Failed to generate title" },
      { status: 500 }
    );
  }
}
