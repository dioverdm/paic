"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  ChevronDown,
} from "lucide-react";
import AI_MODELS from "./AIMODELS";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define interface for model selection props
interface MinimalChatControlsProps {
  selectedModel?: string;
  onModelSelect?: (modelName: string) => void;
  tokenUsage?: number;
}

export default function MinimalChatControls({
  selectedModel = "OpenAI: GPT-4o-mini",
  onModelSelect = () => {},
}: //   tokenUsage = 3600,
MinimalChatControlsProps) {
  // Get display name for selected model
  const displayName = selectedModel.split(":")[1]?.trim() || selectedModel;

  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            {displayName}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[140px]">
          <ScrollArea className="h-full max-h-64">
            {AI_MODELS.map((model) => (
              <DropdownMenuItem
                key={model.name}
                className="text-xs"
                onClick={() => onModelSelect(model.name)}
              >
                <div className="flex items-center gap-2">
                  {model.icon}
                  <span>{model.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="Copy"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
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
