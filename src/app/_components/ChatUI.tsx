"use client";

import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef } from "react";
import { MessageItem } from "./MessageItem";
import useMessages from "@/hooks/use-messages";
import ChatControls from "./ChatControls";

export default function ChatUI() {
  const { messages, isLoading } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
            <div key={message.id}>
              <MessageItem
                key={message.id}
                message={message}
                isLoading={isLoading && index === messages.length - 1}
              />
              {message.role === "assistant" && <ChatControls />}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
