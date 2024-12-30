"use client";

import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { RotateCcw, SaveIcon } from "lucide-react";
import { toast } from "sonner";

export default function CommonSettings() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [contextLength, setContextLength] = useState("20");
  const [maxTokens, setMaxTokens] = useState("4000");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);

  useEffect(() => {
    // Load settings from localStorage
    setSystemPrompt(localStorage.getItem("systemPrompt") || "");
    setContextLength(localStorage.getItem("contextLength") || "4");
    setMaxTokens(localStorage.getItem("maxTokens") || "1000");
    setTemperature(parseFloat(localStorage.getItem("temperature") || "0.4"));
    setTopP(parseFloat(localStorage.getItem("topP") || "0.8"));
  }, []);

  const saveSystemPrompt = () => {
    if (systemPrompt === "You are a helpful assistant.") return;
    localStorage.setItem("systemPrompt", systemPrompt);
    toast("System prompt saved successfully");
  };

  const resetSystemPrompt = () => {
    const defaultPrompt = "You are a helpful assistant.";
    setSystemPrompt(defaultPrompt);
    localStorage.removeItem("systemPrompt");
  };

  const updateSetting = (name: string, value: string | number) => {
    localStorage.setItem(name, value.toString());
  };

  return (
    <>
      <div className="space-y-6">
        {/* Original common settings content */}
        {/* Default System Prompt */}
        <div className="space-y-2">
          <Label>Default System Prompt</Label>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="The best system prompt is already here. You can change it if you want."
            className="min-h-[100px]"
          />
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" onClick={resetSystemPrompt}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset System Prompt
            </Button>
            <Button variant="default" size="sm" onClick={saveSystemPrompt}>
              <SaveIcon className="w-4 h-4 mr-2" />
              Save System Prompt
            </Button>
          </div>
        </div>

        {/* Context Length */}
        <div className="space-y-2">
          <Label>Context Length</Label>
          <div className="text-sm text-muted-foreground">
            Number of previous messages to use as context
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              className="w-20"
              value={contextLength}
              onChange={(e) => {
                setContextLength(e.target.value);
                updateSetting("contextLength", e.target.value);
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                setContextLength("4");
                updateSetting("contextLength", "4");
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Max Output Tokens */}
        <div className="space-y-2">
          <Label>Max output tokens</Label>
          <div className="text-sm text-muted-foreground">
            Maximum number of tokens to generate
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              className="w-20"
              value={maxTokens}
              onChange={(e) => {
                setMaxTokens(e.target.value);
                updateSetting("maxTokens", e.target.value);
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                setMaxTokens("1000");
                updateSetting("maxTokens", "1000");
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <Label>Temperature</Label>
          <div className="text-sm text-muted-foreground">
            Controls randomness in responses (0 is focused, 1 is creative)
          </div>
          <div className="flex items-center gap-4">
            <Slider
              value={[temperature]}
              onValueChange={(value) => {
                setTemperature(value[0]);
                updateSetting("temperature", value[0]);
              }}
              max={1}
              step={0.1}
              className="w-[60%]"
            />
            <span className="w-12">{temperature}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                setTemperature(0.4);
                updateSetting("temperature", 0.4);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* TopP */}
        <div className="space-y-2">
          <Label>TopP</Label>
          <div className="text-sm text-muted-foreground">
            Controls diversity of responses (lower values make output more
            focused)
          </div>
          <div className="flex items-center gap-4">
            <Slider
              value={[topP]}
              onValueChange={(value) => {
                setTopP(value[0]);
                updateSetting("topP", value[0]);
              }}
              max={1}
              step={0.1}
              className="w-[60%]"
            />
            <span className="w-12">{topP}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                setTopP(0.8);
                updateSetting("topP", 0.8);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
