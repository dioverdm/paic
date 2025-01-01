"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Check, ChevronDown, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type PluginType = "google-search" | "firecrawl" | "bing-search";

interface PluginBase {
  name: string;
  value: PluginType;
  icon: string;
  iconBg: string;
  iconColor: string;
  description: string;
  apiKeyUrl: string;
  enabled: boolean;
  apiKey: string;
}

interface GoogleSearchPlugin extends PluginBase {
  value: "google-search";
  cx: string;
  cxUrl: string;
}

interface FirecrawlPlugin extends PluginBase {
  value: "firecrawl";
}

interface BingSearchPlugin extends PluginBase {
  value: "bing-search";
}

type PluginConfig = GoogleSearchPlugin | FirecrawlPlugin | BingSearchPlugin;

interface Plugin {
  enabled: boolean;
  apiKey: string;
  cx?: string; // Make cx optional since not all plugins need it
}

interface Plugins {
  [key: string]: Plugin;
}

const plugins: PluginConfig[] = [
  {
    name: "Google Search",
    value: "google-search",
    icon: "G",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    enabled: false,
    apiKey: "",
    cx: "",
    description: "Allow AI to search the web using Google Search",
    apiKeyUrl: "https://developers.google.com/custom-search/v1/overview",
    cxUrl: "https://programmablesearchengine.google.com/controlpanel/all",
  },
  {
    name: "Bing Search",
    value: "bing-search",
    icon: "B",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    enabled: false,
    apiKey: "",
    description: "Allow AI to search the web using Bing Search",
    apiKeyUrl: "https://www.microsoft.com/en-us/bing/apis/bing-web-search-api",
  },
  {
    name: "Firecrawl",
    value: "firecrawl",
    icon: "F",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    enabled: false,
    apiKey: "",
    description: "Extract structured data from any website",
    apiKeyUrl: "https://firecrawl.co/dashboard",
  },
];

const googleSearchSchema = z.object({
  enabled: z.boolean().default(false),
  apiKey: z.string().min(1, "API Key is required"),
  cx: z.string().min(1, "Custom Search Engine ID is required"),
});

const firecrawlSchema = z.object({
  enabled: z.boolean().default(false),
  apiKey: z.string().min(1, "API Key is required"),
  cx: z.string().optional(),
});

const bingSearchSchema = z.object({
  enabled: z.boolean().default(false),
  apiKey: z.string().min(1, "API Key is required"),
  cx: z.string().optional(),
});

type GoogleSearchFormValues = z.infer<typeof googleSearchSchema>;
type FirecrawlFormValues = z.infer<typeof firecrawlSchema>;

function PluginForm({
  plugin,
  onSubmit,
}: {
  plugin: PluginConfig;
  onSubmit: (data: GoogleSearchFormValues | FirecrawlFormValues) => void;
}) {
  const form = useForm<GoogleSearchFormValues | FirecrawlFormValues>({
    resolver: zodResolver(
      plugin.value === "google-search"
        ? googleSearchSchema
        : plugin.value === "bing-search"
        ? bingSearchSchema
        : firecrawlSchema
    ),
    defaultValues: {
      enabled: false,
      apiKey: "",
      ...(plugin.value === "google-search" ? { cx: "" } : {}),
    },
  });

  // Reset form when plugin changes
  useEffect(() => {
    const pluginsStr = localStorage.getItem("plugins");
    if (!pluginsStr) return;

    try {
      const plugins = JSON.parse(pluginsStr);
      const savedPlugin = plugins[plugin.value];
      if (savedPlugin) {
        form.reset(savedPlugin);
      }
    } catch (error) {
      console.error("Error loading plugin data:", error);
    }
  }, [plugin.value, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Enable {plugin.name}
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  {plugin.description}
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{plugin.name} API Key</FormLabel>
              <FormControl>
                <Input type="password" className="font-mono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {plugin.value === "google-search" && (
          <FormField
            control={form.control}
            name="cx"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Search Engine ID (CX)</FormLabel>
                <FormControl>
                  <Input type="text" className="font-mono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex gap-2">
          <Button type="submit" variant="default" size="sm">
            Save Settings
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <a
              href={plugin.apiKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get API Key →
            </a>
          </Button>
          {plugin.value === "google-search" && "cxUrl" in plugin && (
            <Button variant="secondary" size="sm" asChild>
              <a href={plugin.cxUrl} target="_blank" rel="noopener noreferrer">
                Get CX ID →
              </a>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          Your settings are stored locally on your browser and never sent
          anywhere else.
        </div>
      </form>
    </Form>
  );
}

export default function PluginSettings() {
  const [mounted, setMounted] = useState(false);
  const [openPlugin, setOpenPlugin] = useState<PluginType | null>(null);
  const [pluginStates, setPluginStates] = useState<Plugins>({});

  // Load initial plugin states
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }

    const pluginsStr = localStorage.getItem("plugins");
    if (pluginsStr) {
      try {
        setPluginStates(JSON.parse(pluginsStr));
      } catch (error) {
        console.error("Error loading plugin states:", error);
      }
    }
  }, [mounted]);

  const handlePluginSubmit = async (
    data: GoogleSearchFormValues | FirecrawlFormValues,
    plugin: PluginConfig
  ) => {
    try {
      const newPluginStates = {
        ...pluginStates,
        [plugin.value]: {
          enabled: data.enabled,
          apiKey: data.apiKey,
          ...(plugin.value === "google-search"
            ? { cx: (data as GoogleSearchFormValues).cx }
            : {}),
        },
      };

      setPluginStates(newPluginStates);
      localStorage.setItem("plugins", JSON.stringify(newPluginStates));
      toast.success("Plugin settings saved successfully");
    } catch (error) {
      console.error("Error saving plugin settings:", error);
      toast.error("Failed to save plugin settings");
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {plugins.map((plugin) => (
        <Collapsible
          key={plugin.value}
          open={openPlugin === plugin.value}
          onOpenChange={(open) => setOpenPlugin(open ? plugin.value : null)}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${plugin.iconBg}`}
              >
                <span className={`text-lg font-semibold ${plugin.iconColor}`}>
                  {plugin.icon}
                </span>
              </div>
              <div className="text-lg font-semibold">{plugin.name}</div>
            </div>
            <div className="flex items-center gap-2">
              {pluginStates[plugin.value]?.apiKey &&
                (plugin.value !== "google-search" ||
                  pluginStates[plugin.value]?.cx) && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
              <ChevronDown className="h-5 w-5" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pt-4">
            <PluginForm
              plugin={plugin}
              onSubmit={(data) => handlePluginSubmit(data, plugin)}
            />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
