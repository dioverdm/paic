import { Brain } from "lucide-react";

const AI_MODELS = [
  {
    name: "OpenAI: GPT-4o",
    value: "gpt-4o",
    description: "Most advanced GPT model",
    provider: "openai",
  },
  {
    name: "OpenAI: GPT-4 Turbo",
    value: "gpt-4-turbo",
    description: "Fast GPT-4 for performance",
    provider: "openai",
  },
  {
    name: "OpenAI: GPT-3.5 Turbo",
    value: "gpt-3.5-turbo",
    description: "Balanced AI for tasks",
    provider: "openai",
  },
  {
    name: "OpenAI: GPT-4o-mini",
    value: "gpt-4o-mini",
    description: "Compact efficient GPT model",
    provider: "openai",
  },
  {
    name: "Anthropic: Claude 3.5 Sonnet",
    value: "claude-3-5-sonnet-latest",
    description: "Advanced code analysis model",
    provider: "anthropic",
  },
  {
    name: "Anthropic: Claude 3 Haiku",
    value: "claude-3-5-haiku-latest",
    description: "Fast code solutions model",
    provider: "anthropic",
  },
  {
    name: "Anthropic: Claude 3 Opus",
    value: "claude-3-opus-latest",
    description: "Top reasoning AI model",
    provider: "anthropic",
  },
  {
    name: "Google: Gemini Flash 1.5 8B",
    value: "Google: Gemini Flash 1.5 8B",
    description: "Quick response AI model",
    provider: "openrouter",
  },
  {
    name: "Meta: Llama 3.1 8B Instruct",
    value: "meta-llama/llama-3.1-8b-instruct",
    description: "Efficient open source model",
    provider: "openrouter",
  },
  {
    name: "Anthropic: Claude 3.5 Sonnet (self-moderated)",
    value: "anthropic/claude-3.5-sonnet:beta",
    description: "Safe self-regulated AI",
    provider: "openrouter",
  },
  {
    name: "Mistral: Mistral-7B Instruct",
    value: "mistralai/mistral-7b-instruct-v0.1",
    description: "Compact powerful language model",
    provider: "openrouter",
  },
  {
    name: "Neversleep: Llama 3 Lumimaid 8B",
    value: "neversleep/llama-3-lumimaid-8b",
    description: "Balanced Llama AI model",
    provider: "openrouter",
  },
  {
    name: "Google: Gemma 2 27B",
    value: "google/gemma-2-27b-it",
    description: "Large knowledge base model",
    provider: "openrouter",
  },
  {
    name: "Gryphe: MythoMax-L2-13B",
    value: "gryphe/mythomax-l2-13b",
    description: "Enhanced broad AI model",
    provider: "openrouter",
  },
  {
    name: "Microsoft: WizardLM 2 8x22B",
    value: "microsoft/wizardlm-2-8x22b",
    description: "Advanced reasoning AI model",
    provider: "openrouter",
  },
  {
    name: "X-AI: Grok-2",
    value: "x-ai/grok-2-1212",
    description: "Smart contextual AI model",
    provider: "openrouter",
  },
  {
    name: "Google: Gemini Pro 1.5",
    value: "google/gemini-pro-1.5",
    description: "Professional grade AI model",
    provider: "openrouter",
  },
  {
    name: "Google: Gemma 2 9B (FREE)",
    value: "google/gemma-2-9b-it:free",
    description: "Free efficient AI model",
    provider: "openrouter",
  },
  {
    name: "Anthropic: Claude Instant 1",
    value: "anthropic/claude-instant-1",
    description: "Quick response AI assistant",
    provider: "openrouter",
  },
].map((model) => ({ ...model, icon: <Brain className="w-4 h-4" /> }));

export default AI_MODELS;
