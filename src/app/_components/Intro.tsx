"use client";

import Image from "next/image";
import { motion } from "framer-motion";
// import { BackgroundGrid } from "./BackgroundGrid";

export default function Intro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col gap-6 md:gap-8 items-center text-center px-4 relative"
    >
      {/* <BackgroundGrid /> */}

      <div className="size-20 md:size-24 relative animate-float">
        <Image
          src="/logo.svg"
          alt="Lume-AI logo"
          fill
          priority
          className="object-contain drop-shadow-lg"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="flex flex-col gap-2 md:gap-3"
      >
        <h3 className="text-lg md:text-xl font-medium text-muted-foreground">
          Hi, <span className="font-bold">Clever Developer</span>
        </h3>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
          Can I help you with anything?
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-[90%] md:max-w-lg mx-auto leading-relaxed">
          Ready to assist you with anything you need, from answering questions
          to providing recommendations. Let&apos;s get started!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-col md:flex-row gap-4 w-full max-w-[90%] md:max-w-none"
      >
        <FeatureCard
          icon="🔒"
          title="Privacy First"
          description="Your conversations and data are fully encrypted and private"
        />
        <FeatureCard
          icon="🖼️"
          title="Multimodal"
          description="Chat with text, images, files and more seamlessly"
        />
        <FeatureCard
          icon="💰"
          title="Cost Effective"
          description="Get powerful AI assistance at budget-friendly rates"
        />
      </motion.div>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-card p-4 md:p-6 rounded-xl border shadow-sm flex flex-col gap-2 items-center flex-1 min-w-0"
    >
      <span className="text-xl md:text-2xl">{icon}</span>
      <h3 className="font-semibold text-sm md:text-base">{title}</h3>
      <p className="text-xs md:text-sm text-muted-foreground text-center">
        {description}
      </p>
    </motion.div>
  );
}
