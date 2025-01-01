"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Check, ChevronDown, Info } from "lucide-react";
import { toast } from "sonner";

// Remove the crypto import and encrypt function as they're now handled by the API

export function ModelSettings() {
  const [openAIKey, setOpenAIKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize keys from cookies
  useEffect(() => {
    if (!mounted) return;
    const openAICookie = localStorage.getItem("openai");
    const anthropicCookie = localStorage.getItem("anthropic");
    const openRouterCookie = localStorage.getItem("openrouter");

    console.log(openAICookie, anthropicCookie, openRouterCookie);

    if (openAICookie) setOpenAIKey("************");
    if (anthropicCookie) setAnthropicKey("************");
    if (openRouterCookie) setOpenRouterKey("************");
  }, [mounted]);

  const saveApiKey = async (provider: string, key: string) => {
    try {
      const response = await fetch("/api/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: key }),
      });

      if (!response.ok) {
        throw new Error("Failed to save API key");
      }

      // Clear the input field after successful save
      switch (provider.toLowerCase()) {
        case "openai":
          //   setOpenAIKey("");
          localStorage.setItem("openai", "true");
          break;
        case "anthropic":
          //   setAnthropicKey("");
          localStorage.setItem("anthropic", "true");
          break;
        case "openrouter":
          //   setOpenRouterKey("");
          localStorage.setItem("openrouter", "true");
          break;
      }

      toast.success("API key saved successfully");

      // You might want to add a success toast here
    } catch (error) {
      console.error("Error saving API key:", error);
      // You might want to add an error toast here
    }
  };

  return (
    <div className="space-y-6">
      {/* Other Model Providers */}
      {[
        {
          name: "Anthropic",
          icon: "A",
          iconBg: "bg-orange-100",
          iconColor: "text-orange-600",
          key: anthropicKey,
          setKey: setAnthropicKey,
          apiUrl: "https://console.anthropic.com/account/keys",
        },
        {
          name: "OpenRouter",
          icon: "O",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
          key: openRouterKey,
          setKey: setOpenRouterKey,
          apiUrl: "https://openrouter.ai/keys",
        },
      ].map((provider) => (
        <Collapsible key={provider.name}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${provider.iconBg}`}
              >
                <span className={`text-lg font-semibold ${provider.iconColor}`}>
                  {provider.icon}
                </span>
              </div>
              <div className="text-lg font-semibold">
                {provider.name}
                {!openRouterKey && provider.name === "OpenRouter" && (
                  <span className="text-xs">(This key is necessary!)</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {provider.key && <Check className="h-5 w-5 text-green-500" />}
              <ChevronDown className="h-5 w-5" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor={`${provider.name.toLowerCase()}-key`}>
                  {provider.name} API Key
                </Label>
                <Input
                  id={`${provider.name.toLowerCase()}-key`}
                  type="password"
                  value={provider.key}
                  onChange={(e) => provider.setKey(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => saveApiKey(provider.name, provider.key)}
                  variant="default"
                  size="sm"
                >
                  Save API Key
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <a
                    href={provider.apiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get your API key here →
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => provider.setKey("")}
                >
                  Remove API Key
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      {/* OpenAI Section */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
              <svg
                className="h-5 w-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.0264 1.1706a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4929 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0264 1.1706a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.6 8.3829 14.6264 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4069-.6813zm2.0264-3.0231l-.142-.0852-4.7782-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1658a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
              </svg>
            </div>
            <div className="text-lg font-semibold">OpenAI</div>
          </div>
          <div className="flex items-center gap-2">
            {openAIKey && <Check className="h-5 w-5 text-green-500" />}
            <ChevronDown className="h-5 w-5" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                className="font-mono"
                placeholder="sk-..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => saveApiKey("openai", openAIKey)}
                variant="default"
                size="sm"
              >
                Save API Key
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get your API key here →
                </a>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setOpenAIKey("")}
              >
                Remove API Key
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              Your API Key is stored locally on your browser and never sent
              anywhere else.
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
