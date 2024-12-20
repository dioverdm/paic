import { memo } from "react";
import { motion } from "framer-motion";
import { Message } from "ai";
import { MarkdownContent } from "./MarkdownContent";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
        className={`rounded-lg px-4 py-2 max-w-[80%] ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-sidebar max-w-[90%]"
        }`}
      >
        <div
          className={cn(
            "prose dark:prose-invert prose-pre:p-4",
            message.role === "user"
              ? "text-primary-foreground whitespace-pre-wrap"
              : ""
          )}
        >
          <MarkdownContent content={message.content} />
        </div>
        <div className="flex justify-end">
          {message.experimental_attachments &&
            message.experimental_attachments.map((attachment) => (
              <div
                key={attachment.url}
                className="relative w-48 aspect-square bg-muted rounded-lg overflow-hidden my-3"
              >
                <Image
                  src={attachment.url}
                  alt={attachment.name || "attachment"}
                  className="object-cover"
                  fill
                />
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
});
