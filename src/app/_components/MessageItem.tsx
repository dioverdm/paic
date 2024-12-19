import { memo } from "react";
import { motion } from "framer-motion";
import { Message } from "ai";
import { MarkdownContent } from "./MarkdownContent";
import Image from "next/image";

interface MessageItemProps {
  message: Message;
}

export const MessageItem = memo(function MessageItem({
  message,
}: MessageItemProps) {
  return (
    <motion.div
      className={`flex gap-2 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {message.role === "assistant" && (
        <div className="size-10 flex-shrink-0 relative">
          <Image
            className="object-cover"
            src="/logo.svg"
            alt="logo"
            fill
            sizes="100%"
          />
        </div>
      )}
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] prose dark:prose-invert prose-pre:p-4 ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-sidebar max-w-[90%]"
        }`}
      >
        <MarkdownContent content={message.content} />
      </div>
    </motion.div>
  );
});
