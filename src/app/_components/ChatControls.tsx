"use client";

import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import AI_MODELS from "./AIMODELS";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Attachment, ChatRequestOptions } from "ai";
import React, { useEffect } from "react";

export default function MinimalChatControls({
  selectedModel,
  reload,
  experimental_attachments,
  content,
}: {
  selectedModel: string;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  experimental_attachments: Attachment[] | undefined;
  content: string;
}) {
  const [model, setModel] = React.useState(selectedModel);
  const displayName = model.split(":")[1]?.trim() || selectedModel;

  useEffect(() => {
    setModel(selectedModel);
  }, [selectedModel]);

  return (
    <div className="flex items-center gap-2 px-2 py-1 ml-10">
      <Select
        value={model}
        onValueChange={(value) => {
          setModel(value);
        }}
      >
        <SelectTrigger className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground max-w-40">
          {displayName}
        </SelectTrigger>
        <SelectContent className="min-w-[140px]">
          <ScrollArea className="h-full max-h-64">
            {AI_MODELS.map((model) => (
              <SelectItem
                key={model.name}
                value={model.name}
                className="text-xs"
              >
                <div className="flex items-center gap-2">
                  {model.icon}
                  <span>{model.name}</span>
                </div>
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => {
            reload({
              body: {
                model: AI_MODELS.find((m) => m.name === model)?.value || "",
                provider:
                  AI_MODELS.find((m) => m.name === model)?.provider || "",
              },
              experimental_attachments,
            });
          }}
          title="Regenerate"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => {
            navigator.clipboard.writeText(content);
          }}
          title="Copy"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="Thumbs up"
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="Thumbs down"
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        {/* <div className="text-xs text-muted-foreground pl-3">
          {tokenUsage} tokens used
        </div> */}
      </div>
    </div>
  );
}
