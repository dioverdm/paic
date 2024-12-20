import React from "react";
import AiInput from "@/app/_components/AiInput";
import ChatInterfaceMain from "@/app/_components/ChatInterfaceMain";

export default function page() {
  return (
    <div className="flex-1 flex justify-center">
      <div className="max-w-4xl flex-1 flex flex-col gap-6 justify-between relative">
        <div></div>
        <ChatInterfaceMain />
        <div className="sticky bottom-4">
          <AiInput />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-background/0 -z-10" />
      </div>
    </div>
  );
}
