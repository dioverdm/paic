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

interface Plugin {
  enabled: boolean;
  apiKey: string;
  cx: string;
}

interface Plugins {
  [key: string]: Plugin;
}

const plugins = [
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
];

const formSchema = z.object({
  enabled: z.boolean().default(false),
  apiKey: z.string().min(1, "API Key is required"),
  cx: z.string().min(1, "Custom Search Engine ID is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function PluginSettings() {
  const [mounted, setMounted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: false,
      apiKey: "",
      cx: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize from plugins object in localStorage
  useEffect(() => {
    if (!mounted) return;

    const pluginsStr = localStorage.getItem("plugins");
    if (pluginsStr) {
      const plugins: Plugins = JSON.parse(pluginsStr);
      const googleSearch = plugins["google-search"];

      if (googleSearch) {
        form.setValue("enabled", googleSearch.enabled);
        form.setValue("apiKey", googleSearch.apiKey);
        form.setValue("cx", googleSearch.cx);
      }
    }
  }, [mounted, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      const pluginsStr = localStorage.getItem("plugins");
      const plugins: Plugins = pluginsStr ? JSON.parse(pluginsStr) : {};

      // Update the plugins object
      plugins["google-search"] = {
        enabled: data.enabled,
        apiKey: data.apiKey,
        cx: data.cx,
      };

      // Save the entire plugins object
      localStorage.setItem("plugins", JSON.stringify(plugins));
      toast.success("Plugin settings saved successfully");
    } catch (error) {
      console.error("Error saving plugin settings:", error);
    }
  };

  return (
    <div className="space-y-6">
      {plugins.map((plugin) => (
        <Collapsible key={plugin.value}>
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
              {form.watch("apiKey") && form.watch("cx") && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              <ChevronDown className="h-5 w-5" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                      <FormLabel>Google API Key</FormLabel>
                      <FormControl>
                        <Input type="text" className="font-mono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  <Button variant="secondary" size="sm" asChild>
                    <a
                      href={plugin.cxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get CX ID →
                    </a>
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  Your settings are stored locally on your browser and never
                  sent anywhere else.
                </div>
              </form>
            </Form>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
