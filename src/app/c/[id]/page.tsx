"use client";

import React, { useEffect } from "react";
import { Message, useChat } from "ai/react";
import { useUserChat } from "@/store/userChat";
import { useParams } from "next/navigation";
import Intro from "@/app/_components/Intro";
import ChatUI from "@/app/_components/ChatUI";
import AIInput_10 from "@/app/_components/AiInput";
import AI_MODELS from "@/app/_components/AIMODELS";
import { toast } from "sonner";

type ArgsForMemory = { memory: string[] };

export default function Page() {
  const { addMessage, getChat, updateChatTitle } = useUserChat();
  const [chatUpdate, setChatUpdate] = React.useState(false);
  const [initializeChat, setInitializeChat] = React.useState(false);
  const [model, setModel] = React.useState("OpenAI: GPT-4o-mini");
  const params = useParams();
  const { id } = params;

  const {
    messages,
    setMessages,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    api: "/api/chat",
    onFinish() {
      setChatUpdate(true);
    },
    experimental_throttle: 100,
    id: id as string,
    onError(error) {
      toast.error(error.message);
      console.log("error", error);
    },
    onToolCall({ toolCall }) {
      console.log("Tool call", toolCall);
      if (toolCall?.toolName === "rememberInformation") {
        const previousMemory = localStorage.getItem("previousMemory");
        let memory: string[] = [];
        if (previousMemory) {
          // parse Array of strings
          memory = JSON.parse(previousMemory) as string[];
        }
        const array = (toolCall.args as ArgsForMemory).memory;
        localStorage.setItem(
          "previousMemory",
          JSON.stringify([...memory, ...array])
        );

        console.log(
          "Tool call",
          JSON.stringify((toolCall.args as ArgsForMemory).memory)
        );
      }
      if (toolCall?.toolName === "generateTitle") {
        updateChatTitle(
          id as string,
          (toolCall.args as { title: string }).title
        );
      }
    },
  });

  useEffect(() => {
    if (!initializeChat) {
      const chat = getChat(id as string);
      const messages =
        chat?.messages?.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          createdAt: message.createdAt
            ? new Date(message.createdAt)
            : new Date(),
        })) || [];
      setMessages(messages);
      const modelFind = AI_MODELS.find(
        (m) =>
          m.name === chat?.messages[chat?.messages.length - 1]?.model || model
      );

      console.log("modelFind", modelFind);
      // setModel(modelFind?.name || model);
      setInitializeChat(true);
    }
  }, [getChat, id, initializeChat, setMessages, model]);

  useEffect(() => {
    if (chatUpdate && !isLoading) {
      const handleChatUpdation = async (message: Message) => {
        addMessage(id as string, {
          id: messages[messages.length - 2].id,
          role: messages[messages.length - 2].role,
          content: messages[messages.length - 2].content,
          createdAt: messages[messages.length - 2].createdAt,
          model,
          provider: AI_MODELS.find((m) => m.name === model)?.provider || "",
        });
        addMessage(id as string, {
          id: message.id,
          role: message.role,
          content: message.content,
          createdAt: message.createdAt,
          model,
          provider: AI_MODELS.find((m) => m.name === model)?.provider || "",
        });
      };
      handleChatUpdation(messages[messages.length - 1]);
      setChatUpdate(false);
    }
  }, [messages, chatUpdate, isLoading, addMessage, id, model]);

  console.log("messages", messages);

  return (
    <div className="flex-1 flex justify-center">
      <div className="max-w-4xl flex-1 flex flex-col gap-6 justify-between relative">
        <div></div>
        {messages.length === 0 ? (
          <Intro />
        ) : (
          <ChatUI reload={reload} messages={messages} isLoading={isLoading} />
        )}
        <div className="sticky bottom-4">
          <AIInput_10
            isLoading={isLoading}
            stop={stop}
            append={append}
            input={input}
            setInput={setInput}
            model={model}
            setModel={setModel}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-background/0 -z-10" />
      </div>
    </div>
  );
}
