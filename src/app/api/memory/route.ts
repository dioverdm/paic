import { Message } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";

export const POST = async (req: NextRequest) => {
  try {
    const {
      messages,
      previousMemory,
    }: { messages: Message[]; previousMemory: string[] } = await req.json();

    // Process messages
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        memory: z.array(z.string()),
      }),
      prompt: `Task: Extract new important information from this conversation.

Current conversation:
${messages.map((message) => `${message.role}: ${message.content}`).join("\n")}

Previous memories:
${
  previousMemory.length > 0 ? previousMemory.join("\n") : "No previous memories"
}

Question: Based on this conversation, what new information should be remembered that isn't already in the previous memories? Format as a memory array.`,
      system: `Monitor the conversation between the user and assistant, focusing on identifying genuinely important information to remember, especially if explicitly stated by the user, and compare it with the previous context to avoid redundancy. Aim to optimize for low token usage to reduce costs. Return the information as an array of strings.

Steps

Context Integration: Start by comparing the current conversation with the provided previous context to identify new or updated information.
Identify Key Information: Pinpoint significant new details from the conversation that should be remembered.
User-Requested Memory: Prioritize any details where the user explicitly asks for them to be remembered.
Extract and Concisely Format: Summarize important statements into concise strings, eliminating any redundancy from the previous context.
Output Efficiency: Ensure the output is concise to minimize token usage.
Output Format

Provide the output as a JSON array of strings, each string representing a crucial new piece of information. Return an empty array if no new key information is found.
Examples

Example 1:

Previous Context: ["Is a project manager"]
Input Conversation:

User: I'm a project manager. Can you remember this part?
Assistant: Absolutely, anything else?
Output:

[]
Example 2:

Previous Context: ["Planning a trip to Japan next spring"]
Input Conversation:

User: I've decided to visit Kyoto specifically. Remember this change.
Assistant: Noted!
Output:

["Visit Kyoto during trip to Japan"]
Example 3:

Previous Context: []
Input Conversation:

User: I work remotely now. Remember this, okay?
Assistant: Sure, anything else?
User: No, that's it for now.
Output:

["Works remotely"]
Notes

Minimize redundant information by checking against the context.
Ensure the extraction is focused on significant changes or additions.
Keep output concise to limit token use and cost.`,
    });

    console.log("object", object);

    return NextResponse.json({ memory: object.memory }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
