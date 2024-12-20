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
import { useState, useRef, useCallback, useEffect } from "react";
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
import { useChat } from "ai/react";
import useMessages from "@/hooks/use-messages";
import { useParams, useRouter } from "next/navigation";
import { useChat as useChatStore } from "@/hooks/use-chat";
const AI_MODELS = [
  {
    name: "OpenAI: GPT-4o",
    value: "openai/gpt-4o-2024-11-20",
    description: "Ultimate brain for complex tasks",
  },
  {
    name: "OpenAI: GPT-4 Turbo",
    value: "openai/gpt-4-turbo",
    description: "Fast and highly intelligent",
  },
  {
    name: "OpenAI: GPT-3.5 Turbo",
    value: "openai/gpt-3.5-turbo",
    description: "Quick reliable general assistant",
  },
  {
    name: "OpenAI: GPT-4o-mini",
    value: "openai/gpt-4o-mini",
    description: "Smart everyday task helper",
  },
  {
    name: "Anthropic: Claude 3.5 Sonnet",
    value: "anthropic/claude-3.5-sonnet",
    description: "Expert code wizard master",
  },
  {
    name: "Anthropic: Claude 3 Haiku",
    value: "anthropic/claude-3-haiku",
    description: "Swift coding problem solver",
  },
  {
    name: "Anthropic: Claude 3 Opus",
    value: "anthropic/claude-3-opus",
    description: "Supreme intelligence master model",
  },
  {
    name: "Google: Gemini 1.5 Flash-8B",
    value: "google/gemini-flash-1.5-8b",
    description: "Lightning fast Google AI",
  },
  {
    name: "Meta: Llama 3.1 8B Instruct",
    value: "meta-llama/llama-3.1-8b-instruct",
    description: "Open source AI champion",
  },
].map((model) => ({ ...model, icon: <Brain className="w-4 h-4" /> }));

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

export default function AIInput_10() {
  const menuRef = useRef<HTMLDivElement & HTMLElement>(null);
  const { setMessages } = useMessages();
  const { createChat, updateChat, getChat } = useChatStore();
  const [runInitialChat, setRunInitialChat] = useState(false);
  const [init, setInit] = useState(false);
  const router = useRouter();
  const params = useParams();
  const chatId = params.id;
  const {
    messages,
    setMessages: setAiMessages,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
  } = useChat({
    api: "/api/chat",
    credentials: "include",
    onFinish() {
      if (!chatId && messages.length < 3) {
        setRunInitialChat(true);
      } else {
        updateChat(chatId as string, messages);
      }
    },
  });

  useEffect(() => {
    if (runInitialChat && !isLoading) {
      // setTimeout(() => {
      const chatId = createChat(messages[0].content);
      updateChat(chatId, messages);
      router.push(`/c/${chatId}`);
      setRunInitialChat(false);
      // }, 1000);
    }
  }, [createChat, isLoading, messages, runInitialChat, updateChat, router]);

  const [state, setState] = useState({
    value: "",
    fileName: "",
    isPrivacyMode: false,
    selectedModel: "OpenAI: GPT-4o",
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
      handleSubmit(e, {
        experimental_attachments: files,
      });
      updateState({ value: "" });
      setFiles(undefined);
      adjustHeight(true);
    }
  };

  useEffect(() => {
    if (messages.length > 0 && init) {
      const intervalId = setInterval(() => {
        setMessages(messages);
      }, 50);

      // Clean up interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [messages, setMessages, init]);

  useEffect(() => {
    if (!init) {
      const chat = getChat(chatId as string);
      setAiMessages(chat?.messages || []);
      setMessages(chat?.messages || []);
      setInit(true);
    }
  }, [chatId, getChat, init, setAiMessages, setMessages]);

  return (
    <form
      className="w-full py-4"
      onSubmit={(e) =>
        handleSubmit(e, {
          experimental_attachments: files,
        })
      }
    >
      <div className="rounded-xl bg-sidebar">
        <div ref={menuRef}>
          <div className="border-b border-black/10 dark:border-white/10">
            <div className="flex justify-between items-center px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="relative" data-model-menu>
                <Select
                  value={state.selectedModel}
                  onValueChange={(value) =>
                    updateState({ selectedModel: value })
                  }
                >
                  <SelectTrigger className="flex items-center gap-1.5 rounded-lg px-2 py-1">
                    <Brain className="w-4 h-4 dark:text-white" />
                    <span className="dark:text-white">
                      {state.selectedModel}
                    </span>
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
              value={state.value}
              placeholder="Type your message..."
              className={cn(
                "w-full rounded-xl pl-14 pr-10 border-none resize-none bg-transparent dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 focus-visible:ring-transparent focus-visible:outline-none",
                `min-h-[${MIN_HEIGHT}px]`
              )}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                updateState({ value: e.target.value });
                handleInputChange(e);
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
                type="button"
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
