import { Brain } from "lucide-react";

const AI_MODELS = [
  {
    name: "OpenAI: GPT-4o",
    value: "gpt-4o",
    description: "Ultimate brain for complex tasks",
    provider: "openai",
  },
  {
    name: "OpenAI: GPT-4 Turbo",
    value: "gpt-4-turbo",
    description: "Fast and highly intelligent",
    provider: "openai",
  },
  {
    name: "OpenAI: GPT-3.5 Turbo",
    value: "gpt-3.5-turbo",
    description: "Quick reliable general assistant",
    provider: "openai",
  },
  {
    name: "OpenAI: GPT-4o-mini",
    value: "gpt-4o-mini",
    description: "Smart everyday task helper",
    provider: "openai",
  },
  {
    name: "Anthropic: Claude 3.5 Sonnet",
    value: "claude-3-5-sonnet-latest",
    description: "Expert code wizard master",
    provider: "anthropic",
  },
  {
    name: "Anthropic: Claude 3 Haiku",
    value: "claude-3-5-haiku-latest",
    description: "Swift coding problem solver",
    provider: "anthropic",
  },
  {
    name: "Anthropic: Claude 3 Opus",
    value: "claude-3-5-opus-latest",
    description: "Supreme intelligence master model",
    provider: "anthropic",
  },
  {
    name: "Google: Gemini 1.5 Flash-8B",
    value: "google/gemini-flash-1.5-8b",
    description: "Lightning fast Google AI",
    provider: "openrouter",
  },
  {
    name: "Meta: Llama 3.3 70B Instruct",
    value: "meta-llama/llama-3.3-70b-instruct",
    description: "Open source AI champion",
    provider: "openrouter",
  },
].map((model) => ({ ...model, icon: <Brain className="w-4 h-4" /> }));

export default AI_MODELS;
