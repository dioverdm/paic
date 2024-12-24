"use client";

import {
  Plus,
  File,
  Camera,
  X,
  ArrowRight,
  Brain,
  Lock,
  Unlock,
  StopCircleIcon,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { useClickOutside } from "@/hooks/use-click-outside";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AI_MODELS from "./AIMODELS";
import { ChatRequestOptions, CreateMessage, Message } from "ai";

const MIN_HEIGHT = 40;

const FileDisplay = ({
  fileName,
  onClear,
}: {
  fileName: string;
  onClear: () => void;
}) => (
  <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 w-fit px-3 py-1 rounded-lg">
    <File className="w-4 h-4 dark:text-white" />
    <span
      title={fileName}
      className="text-sm dark:text-white truncate max-w-20"
    >
      {fileName}
    </span>
    <button
      type="button"
      onClick={onClear}
      className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
    >
      <X className="w-3 h-3 dark:text-white" />
    </button>
  </div>
);

export default function AIInput_10({
  isLoading,
  stop,
  append,
  input,
  setInput,
  model,
  setModel,
}: {
  isLoading: boolean;
  stop: () => void;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
}) {
  const menuRef = useRef<HTMLDivElement & HTMLElement>(null);

  const [state, setState] = useState({
    value: "",
    fileName: "",
    isPrivacyMode: false,
    selectedModel: "OpenAI: GPT-4o-mini",
    isMenuOpen: false,
    isModelMenuOpen: false,
  });

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: 200,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | undefined>();

  const updateState = useCallback(
    (updates: Partial<typeof state>) =>
      setState((prev) => ({ ...prev, ...updates })),
    []
  );

  useClickOutside(menuRef, () => {
    if (state.isMenuOpen) updateState({ isMenuOpen: false });
    if (state.isModelMenuOpen) updateState({ isModelMenuOpen: false });
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // setSelectedModel();
      append(
        { content: input, role: "user" },
        {
          experimental_attachments: files,
          body: {
            model: AI_MODELS.find((m) => m.name === model)?.value || "",
            provider: AI_MODELS.find((m) => m.name === model)?.provider || "",
          },
        }
      );
      setInput("");
      updateState({ value: "" });
      setFiles(undefined);
      adjustHeight(true);
    }
  };

  return (
    <form
      className="w-full py-4"
      onSubmit={(e) => {
        e.preventDefault();
        append(
          { content: input, role: "user" },
          {
            experimental_attachments: files,
            body: {
              model: AI_MODELS.find((m) => m.name === model)?.value || "",
              provider: AI_MODELS.find((m) => m.name === model)?.provider || "",
            },
          }
        );
        setInput("");
        updateState({ value: "" });
        setFiles(undefined);
        adjustHeight(true);
      }}
    >
      <div className="rounded-xl bg-sidebar">
        <div ref={menuRef}>
          <div className="border-b border-black/10 dark:border-white/10">
            <div className="flex justify-between items-center px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="relative" data-model-menu>
                <Select
                  value={model}
                  onValueChange={(value) => {
                    setModel(value);
                  }}
                >
                  <SelectTrigger className="flex items-center gap-1.5 rounded-lg px-2 py-1">
                    <Brain className="w-4 h-4 dark:text-white" />
                    <span className="dark:text-white">{model}</span>
                  </SelectTrigger>
                  <SelectContent className="w-64">
                    <SelectGroup>
                      {AI_MODELS.map((model) => (
                        <SelectItem
                          key={model.name}
                          value={model.name}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {model.icon}
                            <span>{model.name}</span>
                          </div>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {model.description}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateState({
                    isPrivacyMode: !state.isPrivacyMode,
                  })
                }
                className={cn(
                  "flex items-center gap-2 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5",
                  state.isPrivacyMode
                    ? "text-green-600"
                    : "text-zinc-600 dark:text-zinc-400"
                )}
              >
                {state.isPrivacyMode ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
                <span>Privacy</span>
              </button>
            </div>
          </div>

          {files && (
            <div className="px-4 pt-2 flex gap-2 overflow-x-auto">
              {Array.from(files).map((file) => (
                <FileDisplay
                  key={file.name}
                  fileName={file.name}
                  onClear={() => setFiles(undefined)}
                />
              ))}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={() => {
              if (fileInputRef.current?.files) {
                setFiles(fileInputRef.current.files);
              }
            }}
            multiple
            // only image
            accept="image/*"
            hidden
          />

          <div className="relative px-2 py-2">
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2"
              data-action-menu
            >
              <DropdownMenu
                open={state.isMenuOpen}
                onOpenChange={(open) => updateState({ isMenuOpen: open })}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="rounded-3xl bg-black/5 dark:bg-white/5 p-2 hover:bg-black/10 dark:hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4 dark:text-white" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[140px]">
                  {[
                    {
                      icon: File,
                      label: "Upload File",
                      onClick: () => fileInputRef.current?.click(),
                    },
                    { icon: Camera, label: "Take Photo" },
                  ].map(({ icon: Icon, label, onClick }) => (
                    <DropdownMenuItem
                      key={label}
                      onClick={onClick}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Textarea
              id="ai-input-10"
              ref={textareaRef}
              value={input}
              placeholder="Type your message..."
              className={cn(
                "w-full rounded-xl pl-14 pr-10 border-none resize-none bg-transparent dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 focus-visible:ring-transparent focus-visible:outline-none",
                `min-h-[${MIN_HEIGHT}px]`
              )}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                updateState({ value: e.target.value });
                setInput(e.target.value);
                adjustHeight();
              }}
            />

            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                title="Stop"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-black/5 dark:bg-white/5 p-1"
              >
                <StopCircleIcon className={cn("w-4 h-4 dark:text-white")} />
              </button>
            ) : (
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-black/5 dark:bg-white/5 p-1"
                title="Send"
              >
                <ArrowRight
                  className={cn(
                    "w-4 h-4 dark:text-white",
                    state.value ? "opacity-100" : "opacity-30"
                  )}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
