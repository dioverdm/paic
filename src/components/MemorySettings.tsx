"use client";

import { XIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

export default function MemorySettings() {
  const [memory, setMemory] = React.useState<string[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const previousMemory = localStorage.getItem("previousMemory");
    if (previousMemory) {
      setMemory(JSON.parse(previousMemory));
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const deleteMemory = (index: number) => {
    const newMemory = memory.filter((_, i) => i !== index);
    setMemory(newMemory);
    localStorage.setItem("previousMemory", JSON.stringify(newMemory));
  };

  return (
    <div className="w-full">
      {memory.map((item, index) => (
        <div
          key={index}
          className="w-full flex items-center justify-between bg-secondary p-2 px-3 rounded-lg mb-2"
        >
          <p>{item}</p>
          <Button
            size={"icon"}
            className="size-6"
            onClick={() => deleteMemory(index)}
          >
            <XIcon />
          </Button>
        </div>
      ))}
    </div>
  );
}
