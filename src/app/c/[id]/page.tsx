"use client";

import React, { useEffect } from "react";
import { Message, useChat } from "ai/react";
import { useUserChat } from "@/store/userChat";
import { useParams } from "next/navigation";
import Intro from "@/app/_components/Intro";
import ChatUI from "@/app/_components/ChatUI";
import AIInput_10 from "@/app/_components/AiInput";
import AI_MODELS from "@/app/_components/AIMODELS";

export default function Page() {
  const { addMessage, getChat } = useUserChat();
  const [chatUpdate, setChatUpdate] = React.useState(false);
  const [initializeChat, setInitializeChat] = React.useState(false);
  const [model, setModel] = React.useState("gpt-4o-mini");
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
    body: {
      provider: "openai",
      model: "gpt-4o-mini",
    },
    onFinish() {
      setChatUpdate(true);
    },
    experimental_throttle: 100,
    id: id as string,
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
      setInitializeChat(true);
    }
  }, [getChat, id, initializeChat, setMessages]);

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
