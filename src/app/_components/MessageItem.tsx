import { memo } from "react";
import { motion } from "framer-motion";
import { Message } from "ai";
import { MarkdownContent } from "./MarkdownContent";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface MessageItemProps {
  message: Message;
  isLoading: boolean;
}

export const MessageItem = memo(function MessageItem({
  message,
  isLoading,
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
      {isLoading && message.role === "assistant" && message.content === "" && (
        <div className="flex justify-center items-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      <div
        className={`rounded-lg px-4 py-2 ${
          message.role === "user"
            ? "bg-primary text-primary-foreground max-w-[80%]"
            : "bg-sidebar w-fit max-w-[80%]"
        }`}
      >
        <div
          className={cn(
            "prose dark:prose-invert prose-pre:p-4",
            message.role === "user"
              ? "text-primary-foreground whitespace-pre-wrap"
              : "w-full"
          )}
        >
          <MarkdownContent content={message.content} id={message.id} />
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
