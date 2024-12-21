"use client";

import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import AI_MODELS from "./AIMODELS";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/use-chat";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

export default function MinimalChatControls() {
  // Get display name for selected model
  const {
    chatControls: {
      setCopyToClipboard,
      setSelectedModel,
      setRegenerate,
      setRegenerateWithModel,
      selectedModel,
    },
  } = useChat();
  const displayName = selectedModel.split(":")[1]?.trim() || selectedModel;

  return (
    <div className="flex items-center gap-1 px-2 py-1 ml-10">
      <Select
        value={selectedModel}
        onValueChange={(value) => {
          setSelectedModel(value);
          setRegenerateWithModel(true);
        }}
      >
        <SelectTrigger className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground max-w-24">
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
          onClick={() => setCopyToClipboard(true)}
          title="Copy"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => setRegenerate(true)}
          title="Regenerate"
        >
          <RotateCcw className="h-4 w-4" />
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
