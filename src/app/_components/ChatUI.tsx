"use client";

import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef } from "react";
import { MessageItem } from "./MessageItem";
import ChatControls from "./ChatControls";
import { ChatRequestOptions, Message } from "ai";
import { useParams } from "next/navigation";
import { useUserChat } from "@/store/userChat";

export default function ChatUI({
  messages,
  isLoading,
  reload,
}: {
  messages: Message[];
  isLoading: boolean;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}) {
  const { getChat } = useUserChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const { id } = params;
  const chat = getChat(id as string);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div
      className={cn("flex flex-col h-full", {
        hidden: messages?.length === 0,
      })}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="w-full mx-auto space-y-6">
          {messages?.map((message, index) => (
            <div key={message.id} className="w-full">
              <MessageItem
                key={message.id}
                message={message}
                isLoading={isLoading && index === messages.length - 1}
              />

              {message.role === "assistant" &&
                !isLoading &&
                index === messages.length - 1 &&
                messages.length >= 2 &&
                id && (
                  <ChatControls
                    selectedModel={
                      chat?.messages.find((i) => i.id === message.id)?.model ||
                      ""
                    }
                    content={message.content}
                    reload={reload}
                    experimental_attachments={message.experimental_attachments}
                  />
                )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
