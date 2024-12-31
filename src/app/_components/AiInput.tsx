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
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import AI_MODELS from "./AIMODELS";
import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setModel(value);
  }, [value, setModel]);

  useEffect(() => {
    setValue(model);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const getSettings = () => ({
    systemPrompt: localStorage.getItem("systemPrompt") || "",
    contextLength: parseInt(localStorage.getItem("contextLength") || "4"),
    maxTokens: parseInt(localStorage.getItem("maxTokens") || "1000"),
    temperature: parseFloat(localStorage.getItem("temperature") || "0.4"),
    topP: parseFloat(localStorage.getItem("topP") || "0.8"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    if (isLoading) return;
    if (value === "") return;
    const settings = getSettings();
    append(
      { content: input, role: "user" },
      {
        experimental_attachments: files,
        body: {
          model: AI_MODELS.find((m) => m.name === model)?.value || "",
          provider: AI_MODELS.find((m) => m.name === model)?.provider || "",
          ...settings, // Include all settings in the request
        },
      }
    );
    setInput("");
    updateState({ value: "" });
    setFiles(undefined);
    adjustHeight(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!input) return;
      if (isLoading) return;
      if (value === "") return;
      const settings = getSettings();
      append(
        { content: input, role: "user" },
        {
          experimental_attachments: files,
          body: {
            model: AI_MODELS.find((m) => m.name === model)?.value || "",
            provider: AI_MODELS.find((m) => m.name === model)?.provider || "",
            ...settings, // Include all settings in the request
            memory: localStorage.getItem("previousMemory") || "",
            plugins: localStorage.getItem("plugins") || "",
          },
        }
      );
      setInput("");
      updateState({ value: "" });
      setFiles(undefined);
      adjustHeight(true);
    }
  };

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>, prev?: FileList) => {
      const items = e.clipboardData?.items;
      if (items) {
        let preventDefault = false;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.kind === "file") {
            const file = item.getAsFile();
            if (file) {
              preventDefault = true;
              const dataTransfer = new DataTransfer();
              if (prev) {
                Array.from(prev).forEach((f) => dataTransfer.items.add(f));
              }
              dataTransfer.items.add(file);
              if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files;
                setFiles(dataTransfer.files);
              }
            }
          }
        }
        if (preventDefault) {
          e.preventDefault();
        }
      }
    },
    []
  );

  // Add focus effect when pathname changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [pathname, textareaRef]);

  // Add initial focus
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef]);

  const openai = localStorage.getItem("openai");
  const anthropic = localStorage.getItem("anthropic");
  const openrouter = localStorage.getItem("openrouter");

  const filteredModels = AI_MODELS.filter((m) => {
    if (openai && m.provider === "openai") return true;
    if (anthropic && m.provider === "anthropic") return true;
    if (openrouter && m.provider === "openrouter") return true;
    return false;
  });

  console.log(filteredModels);

  return (
    <form className="w-full py-4" onSubmit={handleSubmit}>
      <div className="rounded-xl bg-sidebar">
        <div ref={menuRef}>
          <div className="border-b border-black/10 dark:border-white/10">
            <div className="flex justify-between items-center px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="relative">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1 w-fit justify-between"
                    >
                      <Brain className="w-4 h-4 dark:text-white" />
                      {value
                        ? filteredModels.find((model) => model.name === value)
                            ?.name || "Select model..."
                        : "Select model..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[20rem] p-0">
                    <Command>
                      <CommandInput placeholder="Search model..." />
                      <CommandList>
                        <CommandEmpty>No model found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-[15rem]">
                            {filteredModels?.map((model) => (
                              <CommandItem
                                key={model.name}
                                value={model.name}
                                onSelect={(currentValue) => {
                                  setValue(
                                    currentValue === value ? "" : currentValue
                                  );
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    value === model.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div>
                                  <div className="font-medium">
                                    {model.name}
                                  </div>
                                  <div className="text-xs text-black/50 dark:text-white/50">
                                    {model.description}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
              onPaste={handlePaste}
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
                disabled={value === ""}
              >
                <ArrowRight
                  className={cn(
                    "w-4 h-4 dark:text-white",
                    state.value && value !== "" ? "opacity-100" : "opacity-30"
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
