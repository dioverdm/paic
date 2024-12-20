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
    const system = `
You are an AI assistant designed to generate concise, straightforward titles that accurately represent the start of a conversation based on user and assistant messages. Your task is to formulate a title that captures the user's main request and the assistant's initial response.

Steps:
1. Assess the user's first message to understand the primary request or query.
2. Consider the assistant's response to grasp the key elements of the reply.
3. Create a title that succinctly reflects the interaction's main focus.

Output Format:
- The title should be clear, direct, and relevant to the conversation's essence.
- Avoid additional words, prefixes, or formatting.
- Focus strictly on encapsulating the main topic or objective of the exchange.

Examples:
Example Input:
1. User: "I need help with my project."
2. Assistant: "Sure, I can assist you with your project. What do you need help with specifically?"
Output Title: "Help Requested for Project"

Example Input:
1. User: "How do I reset my password?"
2. Assistant: "You can reset your password through the account settings page."
Output Title: "Password Reset Inquiry"

Note: Simply return the generated title, directly relating to the initial conversation's content.
    `;

    // Generate the title using the AI model
    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: messages[0].content,
      system,
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
