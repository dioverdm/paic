"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";

const userFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  orgName: z.string().min(2),
});

const apiFormSchema = z.object({
  openaiKey: z.string().optional(),
  anthropicKey: z.string().optional(),
  openrouterKey: z.string().min(2),
});

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("onboarding-complete");
    if (status && status === "true") {
      setOnboardingComplete(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("onboarding-complete", String(onboardingComplete));
  }, [onboardingComplete]);
  const userForm = useForm({
    resolver: zodResolver(userFormSchema),
  });
  const apiForm = useForm({
    resolver: zodResolver(apiFormSchema),
  });

  const handleUserSubmit = userForm.handleSubmit((data) => {
    localStorage.setItem("user-details", JSON.stringify(data));
    setCurrentSlide(2);
  });

  const handleApiSubmit = apiForm.handleSubmit(async (data) => {
    setLoading(true);
    const toastId = toast.loading("Saving API keys...");
    try {
      if (data.openaiKey) {
        localStorage.setItem("openai", "true");
        const response = await fetch("/api/encrypt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: "openai",
            apiKey: data.openaiKey,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save API key");
        }
      }
      if (data.anthropicKey) {
        localStorage.setItem("anthropic", "true");
        const response = await fetch("/api/encrypt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: "anthropic",
            apiKey: data.anthropicKey,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save API key");
        }
      }
      if (data.openrouterKey) {
        localStorage.setItem("openrouter", "true");
        const response = await fetch("/api/encrypt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: "openrouter",
            apiKey: data.openrouterKey,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save API key");
        }
      }
      toast.success("API keys saved successfully", { id: toastId });
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Error saving API key", { id: toastId });
    } finally {
      setLoading(false);
      setOnboardingComplete(true);
      window.location.reload();
    }
  });

  const slides = [
    {
      content: (
        <div className="space-y-8 w-full">
          <div className="relative w-full h-48 flex items-center justify-center bg-gradient-to-b from-primary/15 to-background rounded-lg">
            <div className="absolute inset-0 bg-grid-white/10" />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative z-10 h-24 w-24 rounded-full flex items-center justify-center"
            >
              <Image src="/logo.svg" width={80} height={80} alt="Logo" />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <p className="text-muted-foreground text-sm font-medium">
              WELCOME TO THE FUTURE
            </p>
            <h2 className="text-4xl font-bold bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
              Experience AI Like Never Before
            </h2>
            <p className="text-muted-foreground">
              Chat, create, and explore with cutting-edge AI models in one
              unified interface.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              className="w-full relative overflow-hidden group"
              size="lg"
              onClick={() => setCurrentSlide(1)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Get Started</span>
            </Button>
          </motion.div>
        </div>
      ),
    },
    {
      title: "Tell us about yourself",
      description: "This helps us personalize your experience",
      content: (
        <form onSubmit={handleUserSubmit} className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input {...userForm.register("name")} />
            {userForm.formState.errors.name && (
              <p className="text-sm text-red-500">Name is required</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input {...userForm.register("email")} type="email" />
            {userForm.formState.errors.email && (
              <p className="text-sm text-red-500">Valid email is required</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input {...userForm.register("orgName")} />
            {userForm.formState.errors.orgName && (
              <p className="text-sm text-red-500">
                Organization name is required
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" size="lg">
            Continue
          </Button>
        </form>
      ),
    },
    {
      title: "Setup your API Keys",
      description: "Your keys are stored locally in your browser for security",
      content: (
        <form onSubmit={handleApiSubmit} className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="openrouterKey">OpenRouter API Key (Required)</Label>
            <Input {...apiForm.register("openrouterKey")} type="password" />
            {apiForm.formState.errors.openrouterKey && (
              <p className="text-sm text-red-500">OpenAI API key is required</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="openaiKey">OpenAI API Key (Optional)</Label>
            <Input {...apiForm.register("openaiKey")} type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="anthropicKey">Anthropic API Key (Optional)</Label>
            <Input {...apiForm.register("anthropicKey")} type="password" />
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            Your API keys are stored securely in your browser&apos;s local
            storage and never sent to our servers.
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            Complete Setup
          </Button>
        </form>
      ),
    },
  ];

  return (
    <Dialog open={!onboardingComplete}>
      <DialogContent
        className="max-w-md min-h-[600px] overflow-hidden"
        showClose={false}
      >
        <DialogTitle className="hidden"></DialogTitle>
        <div className="flex flex-col w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center justify-between h-full py-6"
            >
              <div className="text-center space-y-4 mb-8">
                <h3 className="text-3xl font-semibold">
                  {slides[currentSlide].title}
                </h3>
                <p className="text-muted-foreground">
                  {slides[currentSlide].description}
                </p>
              </div>

              <div className="w-full">{slides[currentSlide].content}</div>

              <div className="flex justify-center gap-2 mt-8">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSlide
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                    role="button"
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
